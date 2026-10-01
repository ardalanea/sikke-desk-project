// Set this to the deployed Worker URL after `wrangler deploy`.
const API_BASE = "https://sikke-newsroom-api.etemadansari-ardalan.workers.dev";

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const view = document.getElementById("view");
const FORMAT_LABELS = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  carousel: "Instagram / Facebook carousel",
  reel: "Reel script",
  linkedin: "LinkedIn",
  visual: "Visual brief",
};

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function api(path, options = {}) {
  const headers = { "content-type": "application/json", ...(options.headers || {}) };
  if (tg?.initData) headers["X-Telegram-Init-Data"] = tg.initData;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

function badge(text, cls) {
  return `<span class="badge badge-${cls}">${escapeHtml(text)}</span>`;
}

function setActiveTab(name) {
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.tab === name);
  });
}

async function renderEditions() {
  setActiveTab("editions");
  view.innerHTML = `<div class="loading">Loading editions…</div>`;
  try {
    const [editions, requests] = await Promise.all([
      api("/api/editions"),
      api("/api/generation-requests/mine").catch(() => []),
    ]);

    const pending = requests.filter((r) => r.status === "pending" || r.status === "running");
    const pendingHtml = pending
      .map(
        (r) => `
      <div class="card" style="opacity:0.75;">
        <div class="card-title">Generating new edition…</div>
        <div class="meta">${badge(r.status, r.status)}<span>requested ${escapeHtml(r.requested_at)}</span></div>
        ${r.angle ? `<div class="meta" style="margin-top:6px;">${escapeHtml(r.angle)}</div>` : ""}
      </div>`
      )
      .join("");

    const editionsHtml = editions.length
      ? editions
          .map(
            (e) => `
      <a class="card" href="#/editions/${e.id}" style="display:block;text-decoration:none;color:inherit;">
        <div class="card-title">${escapeHtml(e.title)}</div>
        <div class="meta">
          ${badge(e.status, e.status)}
          <span>${escapeHtml(e.publish_date)}</span>
          <span>${escapeHtml(e.lead_card)}</span>
        </div>
      </a>`
          )
          .join("")
      : `<div class="empty">No editions yet.</div>`;

    view.innerHTML = `
      <button class="btn-primary" id="generateBtn" style="width:100%;margin-bottom:12px;">+ Generate new edition</button>
      ${pendingHtml}
      ${editionsHtml}
    `;
    document.getElementById("generateBtn").addEventListener("click", requestNewEdition);
  } catch (err) {
    view.innerHTML = `<div class="empty">Couldn't load editions.<br>${escapeHtml(err.message)}</div>`;
  }
}

async function requestNewEdition() {
  const angle = window.prompt(
    "Optional: any specific angle or story idea? Leave blank to let the editor pick."
  );
  if (angle === null) return; // cancelled
  try {
    await api("/api/generate", { method: "POST", body: JSON.stringify({ angle }) });
    tg?.HapticFeedback?.notificationOccurred("success");
    const msg = "Queued — a new edition will be researched and should appear here within 15–30 minutes.";
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
    renderEditions();
  } catch (err) {
    const msg = `Couldn't queue a new edition: ${err.message}`;
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

let activeLang = "EN";

async function renderEditionDetail(id) {
  setActiveTab("editions");
  view.innerHTML = `<div class="loading">Loading edition…</div>`;
  try {
    const e = await api(`/api/editions/${id}`);
    const langs = Object.keys(e.content || {});
    if (!langs.includes(activeLang)) activeLang = langs[0] || "EN";

    const judgmentHtml = (e.judgment || [])
      .map((j) => `<li>${escapeHtml(j)}</li>`)
      .join("");
    const notesHtml = (e.notes || [])
      .map(
        (n) => `<div class="note"><div class="note-meta">${escapeHtml(n.kind)} · ${escapeHtml(n.by || "Claude")} · ${escapeHtml(n.at)}</div>${escapeHtml(n.text)}</div>`
      )
      .join("");

    view.innerHTML = `
      <div class="card-title" style="font-size:18px;">${escapeHtml(e.title)}</div>
      <div class="meta" style="margin:6px 0 14px;">${badge(e.status, e.status)}<span>${escapeHtml(e.publish_date)}</span></div>
      <div class="format-block"><div class="format-label">Why this story</div><div class="format-body">${escapeHtml(e.why)}</div></div>
      ${judgmentHtml ? `<div class="format-block"><div class="format-label">Needs your judgment</div><div class="format-body"><ul style="margin:0;padding-left:18px;">${judgmentHtml}</ul></div></div>` : ""}

      <div class="lang-tabs">
        ${langs.map((l) => `<div class="lang-tab ${l === activeLang ? "active" : ""}" data-lang="${l}">${l}</div>`).join("")}
      </div>
      <div id="langContent"></div>

      <div class="actions">
        <button class="btn-primary" data-action="approve">Approve</button>
        <button class="btn-secondary" data-action="changes">Request changes</button>
        <button class="btn-secondary" data-action="posted">Mark as posted</button>
      </div>

      <div class="notes"><div class="format-label">Notes</div>${notesHtml || '<div class="meta">No notes yet.</div>'}</div>
    `;

    renderLangContent(e.content[activeLang] || {}, id, activeLang, e.status);

    view.querySelectorAll(".lang-tab").forEach((el) => {
      el.addEventListener("click", () => {
        activeLang = el.dataset.lang;
        view.querySelectorAll(".lang-tab").forEach((t) => t.classList.toggle("active", t === el));
        renderLangContent(e.content[activeLang] || {}, id, activeLang, e.status);
      });
    });

    view.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleDecision(id, btn.dataset.action));
    });
  } catch (err) {
    view.innerHTML = `<div class="empty">Couldn't load this edition.<br>${escapeHtml(err.message)}</div>`;
  }
}

function renderLangContent(content, editionId, lang, editionStatus) {
  const el = document.getElementById("langContent");
  if (!el) return;
  const canPublish = editionStatus === "approved" || editionStatus === "published";
  el.innerHTML = Object.entries(FORMAT_LABELS)
    .filter(([key]) => content[key])
    .map(
      ([key, label]) => `
      <div class="format-block">
        <div class="format-label-row">
          <div class="format-label">${label}</div>
          <div style="display:flex;gap:6px;">
            ${
              key === "telegram"
                ? `<button class="btn-copy ${canPublish ? "" : "btn-disabled"}" data-publish-telegram ${canPublish ? "" : "disabled"}>Publish</button>`
                : ""
            }
            <button class="btn-copy" data-copy-key="${key}">Copy</button>
          </div>
        </div>
        <div class="format-body">${escapeHtml(content[key])}</div>
      </div>`
    )
    .join("");

  el.querySelectorAll("[data-copy-key]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(content[btn.dataset.copyKey], btn));
  });

  const publishBtn = el.querySelector("[data-publish-telegram]");
  if (publishBtn && canPublish) {
    publishBtn.addEventListener("click", () => publishToTelegram(editionId, lang, publishBtn));
  }
}

async function publishToTelegram(editionId, lang, btn) {
  const confirmed = window.confirm(
    `Post the ${lang} Telegram text to the TEA Media channel now? This publishes immediately.`
  );
  if (!confirmed) return;
  btn.textContent = "Publishing…";
  btn.disabled = true;
  try {
    await api(`/api/editions/${editionId}/publish-telegram`, {
      method: "POST",
      body: JSON.stringify({ lang }),
    });
    tg?.HapticFeedback?.notificationOccurred("success");
    btn.textContent = "Published";
    btn.classList.add("btn-copy-done");
  } catch (err) {
    btn.textContent = "Publish";
    btn.disabled = false;
    const msg = `Publish failed: ${err.message}`;
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for WebViews without Clipboard API permission
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  tg?.HapticFeedback?.notificationOccurred("success");
  const original = btn.textContent;
  btn.textContent = "Copied";
  btn.classList.add("btn-copy-done");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("btn-copy-done");
  }, 1200);
}

async function handleDecision(editionId, kind) {
  const needsNote = kind === "changes";
  let text = "";
  if (needsNote) {
    text = tg?.showPopup
      ? await promptViaTelegram("What needs to change?")
      : window.prompt("What needs to change?") || "";
    if (!text) return;
  }
  try {
    await api(`/api/editions/${editionId}/decision`, {
      method: "POST",
      body: JSON.stringify({ kind, text }),
    });
    tg?.HapticFeedback?.notificationOccurred("success");
    renderEditionDetail(editionId);
  } catch (err) {
    tg?.showAlert ? tg.showAlert(`Failed: ${err.message}`) : alert(`Failed: ${err.message}`);
  }
}

function promptViaTelegram(message) {
  // Telegram's native popup doesn't support free text input; fall back to window.prompt
  // inside the WebView, which Telegram does allow.
  return Promise.resolve(window.prompt(message) || "");
}

async function renderArchive() {
  setActiveTab("archive");
  view.innerHTML = `<div class="loading">Loading archive…</div>`;
  try {
    const cards = await api("/api/cards");
    if (!cards.length) {
      view.innerHTML = `<div class="empty">No cards filed yet.</div>`;
      return;
    }
    view.innerHTML = cards
      .map(
        (c) => `
      <div class="card">
        <div class="card-title">${escapeHtml(c.headline)}</div>
        <div class="meta">
          ${badge(c.status, c.status.toLowerCase())}
          <span>${escapeHtml(c.category)}</span>
          <span>${escapeHtml(c.era)}</span>
          <span>wow ${c.wow} · rel ${c.relevance}</span>
          ${c.used_in?.length ? `<span>used in ${c.used_in.join(", ")}</span>` : "<span>unused</span>"}
        </div>
      </div>`
      )
      .join("");
  } catch (err) {
    view.innerHTML = `<div class="empty">Couldn't load the archive.<br>${escapeHtml(err.message)}</div>`;
  }
}

function router() {
  const hash = location.hash || "#/editions";
  const editionMatch = hash.match(/^#\/editions\/(.+)$/);
  if (editionMatch) {
    renderEditionDetail(decodeURIComponent(editionMatch[1]));
  } else if (hash === "#/archive") {
    renderArchive();
  } else {
    renderEditions();
  }
}

window.addEventListener("hashchange", router);
router();
