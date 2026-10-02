// Set this to the deployed Worker URL after `wrangler deploy`.
const API_BASE = "https://sikke-newsroom-api.etemadansari-ardalan.workers.dev";

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

// Outside Telegram (opened directly in a browser), fall back to a passphrase
// login against the same backend (requireArtifactUser in the Worker).
let webSession = null;
try {
  webSession = JSON.parse(localStorage.getItem("sikke_web_session") || "null");
} catch {
  webSession = null;
}

const view = document.getElementById("view");
const FORMAT_LABELS = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  carousel: "Instagram / Facebook carousel",
  reel: "Reel script",
  linkedin: "LinkedIn",
  visual: "Visual brief",
};
const DESKS = [
  ["antiquity", "Antiquity"],
  ["empires-crashes", "Empires & Crashes"],
  ["cons-heists", "Cons & Heists"],
  ["crypto-fintech", "Crypto & Fintech"],
  ["money-lock", "Money Lock"],
  ["oddities-myths", "Oddities & Myths"],
  ["region", "Our Region"],
  ["wire", "Wire"],
];
const PLATFORMS = [
  ["telegram", "Telegram"],
  ["whatsapp", "WhatsApp"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["linkedin", "LinkedIn"],
];
const POLICY_LABELS = {
  ask_each_time: "Ask me each time a story touches Cyprus, Türkiye or Iran politics",
  allow_neutral_coverage: "Write neutral, facts-only coverage without asking",
  always_hold: "Never research these topics at all",
};

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function api(path, options = {}) {
  const headers = { "content-type": "application/json", ...(options.headers || {}) };
  if (tg?.initData) {
    headers["X-Telegram-Init-Data"] = tg.initData;
  } else if (webSession) {
    headers["X-Artifact-Passphrase"] = webSession.pass;
    headers["X-Artifact-User"] = webSession.name;
  }
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
      <div id="generateForm" style="display:none;"></div>
      ${pendingHtml}
      ${editionsHtml}
    `;
    document.getElementById("generateBtn").addEventListener("click", toggleGenerateForm);
  } catch (err) {
    view.innerHTML = `<div class="empty">Couldn't load editions.<br>${escapeHtml(err.message)}</div>`;
  }
}

function toggleGenerateForm() {
  const form = document.getElementById("generateForm");
  const open = form.style.display !== "none";
  if (open) {
    form.style.display = "none";
    return;
  }
  form.style.display = "block";
  form.innerHTML = `
    <div class="card">
      <div class="format-label" style="margin-bottom:8px;">Pick desks (optional — leave all unchecked to let the editor choose via story-budget)</div>
      <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:12px;">
        ${DESKS.map(
          ([slug, label]) =>
            `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" value="${slug}" style="margin-right:4px;">${escapeHtml(label)}</label>`
        ).join("")}
      </div>
      <div class="format-label" style="margin-bottom:6px;">Angle or story idea (optional)</div>
      <input type="text" id="angleInput" class="field__input" placeholder="e.g. a famous forgery, a 2026 crypto hack..." style="margin-bottom:12px;">
      <button class="btn-primary" id="submitGenerate" style="width:100%;">Queue this edition</button>
    </div>
  `;
  document.getElementById("submitGenerate").addEventListener("click", requestNewEdition);
}

async function requestNewEdition() {
  const form = document.getElementById("generateForm");
  const desks = [...form.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);
  const angle = document.getElementById("angleInput").value.trim();
  try {
    await api("/api/generate", { method: "POST", body: JSON.stringify({ angle, desks }) });
    tg?.HapticFeedback?.notificationOccurred("success");
    const msg = "Queued — picked up within the hour and should appear here once research finishes (this is real multi-step work, not instant).";
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

// Turns plain post text into readable HTML: blank-line-separated paragraphs,
// and any markdown table (reel scripts) into a real <table> instead of raw
// pipe characters.
function renderFormattedText(raw) {
  const lines = raw.split("\n");
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const isSepRow = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(l);
  const splitRow = (l) => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  let html = "";
  let paraBuf = [];
  const flushPara = () => {
    const text = paraBuf.join("\n").trim();
    if (text) html += `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
    paraBuf = [];
  };
  let i = 0;
  while (i < lines.length) {
    if (isTableRow(lines[i]) && i + 1 < lines.length && isSepRow(lines[i + 1])) {
      flushPara();
      const head = splitRow(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      html += `<table class="post-table"><thead><tr>${head.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table>`;
      continue;
    }
    if (lines[i].trim() === "") flushPara();
    else paraBuf.push(lines[i]);
    i++;
  }
  flushPara();
  return html || `<p>${escapeHtml(raw)}</p>`;
}

function autoGrow(ta) {
  ta.style.height = "auto";
  ta.style.height = ta.scrollHeight + 2 + "px";
}

function renderLangContent(content, editionId, lang, editionStatus) {
  const el = document.getElementById("langContent");
  if (!el) return;
  el.lang = lang === "FA" ? "fa" : lang === "TR" ? "tr" : "en";
  el.dir = lang === "FA" ? "rtl" : "ltr";
  const canPublish = editionStatus === "approved" || editionStatus === "published";
  el.innerHTML = Object.entries(FORMAT_LABELS)
    .filter(([key]) => content[key])
    .map(
      ([key, label]) => `
      <div class="format-block">
        <div class="format-label-row">
          <div class="format-label">${label}</div>
          <div class="format-actions">
            ${
              key === "telegram"
                ? `<button class="btn-copy ${canPublish ? "" : "btn-disabled"}" data-publish-telegram ${canPublish ? "" : "disabled"}>Publish</button>`
                : ""
            }
            <button class="btn-copy btn-save" data-save-key="${key}" style="display:none;">Save</button>
            <button class="btn-copy" data-toggle-key="${key}">Edit</button>
            <button class="btn-copy" data-copy-key="${key}">Copy</button>
          </div>
        </div>
        <div class="format-body format-read" data-key="${key}">${renderFormattedText(content[key])}</div>
        <textarea class="format-body format-editable" data-key="${key}" data-original="${escapeHtml(content[key])}" hidden>${escapeHtml(content[key])}</textarea>
      </div>`
    )
    .join("");

  el.querySelectorAll(".format-editable").forEach((ta) => {
    ta.addEventListener("input", () => {
      const key = ta.dataset.key;
      const saveBtn = el.querySelector(`[data-save-key="${key}"]`);
      saveBtn.style.display = ta.value !== ta.dataset.original ? "inline-block" : "none";
      autoGrow(ta);
    });
  });

  el.querySelectorAll("[data-toggle-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.toggleKey;
      const read = el.querySelector(`.format-read[data-key="${key}"]`);
      const ta = el.querySelector(`.format-editable[data-key="${key}"]`);
      const editing = !ta.hidden;
      if (editing) {
        read.innerHTML = renderFormattedText(ta.value);
        ta.hidden = true;
        read.hidden = false;
        btn.textContent = "Edit";
      } else {
        ta.hidden = false;
        read.hidden = true;
        btn.textContent = "Done";
        autoGrow(ta);
        ta.focus();
      }
    });
  });

  el.querySelectorAll("[data-copy-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ta = el.querySelector(`.format-editable[data-key="${btn.dataset.copyKey}"]`);
      copyText(ta ? ta.value : content[btn.dataset.copyKey], btn);
    });
  });

  el.querySelectorAll("[data-save-key]").forEach((btn) => {
    btn.addEventListener("click", () => saveContentField(editionId, lang, btn.dataset.saveKey, btn));
  });

  const publishBtn = el.querySelector("[data-publish-telegram]");
  if (publishBtn && canPublish) {
    publishBtn.addEventListener("click", () => publishToTelegram(editionId, lang, publishBtn));
  }
}

async function saveContentField(editionId, lang, key, btn) {
  const el = document.getElementById("langContent");
  const ta = el.querySelector(`.format-editable[data-key="${key}"]`);
  const text = ta.value;
  btn.textContent = "Saving…";
  btn.disabled = true;
  try {
    await api(`/api/editions/${editionId}/content`, {
      method: "PATCH",
      body: JSON.stringify({ lang, key, text }),
    });
    ta.dataset.original = text;
    btn.style.display = "none";
    btn.textContent = "Save";
    btn.disabled = false;
    const read = el.querySelector(`.format-read[data-key="${key}"]`);
    const toggleBtn = el.querySelector(`[data-toggle-key="${key}"]`);
    read.innerHTML = renderFormattedText(text);
    ta.hidden = true;
    read.hidden = false;
    if (toggleBtn) toggleBtn.textContent = "Edit";
    tg?.HapticFeedback?.notificationOccurred("success");
  } catch (err) {
    btn.textContent = "Save";
    btn.disabled = false;
    const msg = `Couldn't save: ${err.message}`;
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
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
    const saveBtn = document.querySelector('[data-save-key="telegram"]');
    if (saveBtn && saveBtn.style.display !== "none") {
      await saveContentField(editionId, lang, "telegram", saveBtn);
    }
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

async function renderSettings() {
  setActiveTab("settings");
  view.innerHTML = `<div class="loading">Loading settings…</div>`;
  try {
    const s = await api("/api/settings");
    view.innerHTML = `
      <div class="card">
        <div class="format-label" style="margin-bottom:6px;">Editions per week</div>
        <input type="number" id="setEditionsPerWeek" class="field__input" min="1" max="14" value="${s.editions_per_week}" style="margin-bottom:16px;">

        <div class="format-label" style="margin-bottom:6px;">Platforms</div>
        <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:16px;">
          ${PLATFORMS.map(
            ([slug, label]) =>
              `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" class="setPlatform" value="${slug}" ${s.platforms.includes(slug) ? "checked" : ""} style="margin-right:4px;">${escapeHtml(label)}</label>`
          ).join("")}
        </div>

        <div class="format-label" style="margin-bottom:6px;">Cyprus / Türkiye / Iran politics</div>
        <div style="margin-bottom:16px;">
          ${Object.entries(POLICY_LABELS)
            .map(
              ([val, label]) => `
            <label style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:14px;cursor:pointer;">
              <input type="radio" name="setPolicy" value="${val}" ${s.regional_politics_policy === val ? "checked" : ""} style="margin-top:3px;">
              <span>${escapeHtml(label)}</span>
            </label>`
            )
            .join("")}
        </div>

        <div class="format-label" style="margin-bottom:6px;">Default desk rotation (optional — leave all unchecked to rotate automatically)</div>
        <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:18px;">
          ${DESKS.map(
            ([slug, label]) =>
              `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" class="setDesk" value="${slug}" ${s.default_desks.includes(slug) ? "checked" : ""} style="margin-right:4px;">${escapeHtml(label)}</label>`
          ).join("")}
        </div>

        <button class="btn-primary" id="saveSettings" style="width:100%;">Save settings</button>
      </div>
    `;
    document.getElementById("saveSettings").addEventListener("click", saveSettings);
  } catch (err) {
    view.innerHTML = `<div class="empty">Couldn't load settings.<br>${escapeHtml(err.message)}</div>`;
  }
}

async function saveSettings() {
  const btn = document.getElementById("saveSettings");
  const body = {
    editions_per_week: Number(document.getElementById("setEditionsPerWeek").value) || 2,
    platforms: [...document.querySelectorAll(".setPlatform:checked")].map((el) => el.value),
    regional_politics_policy:
      document.querySelector('input[name="setPolicy"]:checked')?.value || "ask_each_time",
    default_desks: [...document.querySelectorAll(".setDesk:checked")].map((el) => el.value),
  };
  btn.textContent = "Saving…";
  btn.disabled = true;
  try {
    await api("/api/settings", { method: "PUT", body: JSON.stringify(body) });
    tg?.HapticFeedback?.notificationOccurred("success");
    btn.textContent = "Saved";
    setTimeout(() => {
      btn.textContent = "Save settings";
      btn.disabled = false;
    }, 1200);
  } catch (err) {
    btn.textContent = "Save settings";
    btn.disabled = false;
    const msg = `Couldn't save: ${err.message}`;
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

function router() {
  const hash = location.hash || "#/editions";
  const editionMatch = hash.match(/^#\/editions\/(.+)$/);
  if (editionMatch) {
    renderEditionDetail(decodeURIComponent(editionMatch[1]));
  } else if (hash === "#/archive") {
    renderArchive();
  } else if (hash === "#/settings") {
    renderSettings();
  } else {
    renderEditions();
  }
}

window.addEventListener("hashchange", router);

function showApp() {
  document.getElementById("gate").style.display = "none";
  document.getElementById("app").style.display = "";
  router();
}

function showGate(message) {
  document.getElementById("app").style.display = "none";
  document.getElementById("gate").style.display = "";
  const err = document.getElementById("gateError");
  if (message) {
    err.textContent = message;
    err.style.display = "";
  } else {
    err.style.display = "none";
  }
}

async function trySession() {
  if (tg?.initData) {
    showApp();
    return;
  }
  if (webSession) {
    try {
      await api("/api/settings");
      showApp();
      return;
    } catch {
      webSession = null;
      localStorage.removeItem("sikke_web_session");
    }
  }
  showGate();
}

document.getElementById("gateSubmit").addEventListener("click", async () => {
  const name = document.getElementById("gateName").value;
  const pass = document.getElementById("gatePass").value;
  if (!pass) {
    showGate("Enter the passphrase first.");
    return;
  }
  webSession = { name, pass };
  try {
    await api("/api/settings");
    localStorage.setItem("sikke_web_session", JSON.stringify(webSession));
    showApp();
  } catch {
    webSession = null;
    showGate("That passphrase didn't work. Try again.");
  }
});

trySession();
