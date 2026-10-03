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

const STR = {
  en: {
    tab_editions: "Editions",
    tab_archive: "Archive",
    tab_settings: "Settings",
    gate_who: "Who's signing in",
    gate_pass: "Passphrase",
    gate_sign_in: "Sign in",
    gate_enter_pass: "Enter the passphrase first.",
    gate_wrong: "That passphrase didn't work. Try again.",
    generate_btn: "+ Generate new edition",
    generating: "Generating new edition…",
    requested_at: "requested {date}",
    loading_editions: "Loading editions…",
    no_editions: "No editions yet.",
    load_editions_failed: "Couldn't load editions.",
    pick_desks: "Pick desks (optional — leave all unchecked to let the editor choose via story-budget)",
    angle_label: "Angle or story idea (optional)",
    angle_placeholder: "e.g. a famous forgery, a 2026 crypto hack...",
    queue_btn: "Queue this edition",
    queued_msg: "Queued — picked up within the hour and should appear here once research finishes (this is real multi-step work, not instant).",
    queue_failed: "Couldn't queue a new edition: {msg}",
    loading_edition: "Loading edition…",
    why: "Why this story",
    judgment: "Needs your judgment",
    approve: "Approve",
    request_changes: "Request changes",
    mark_posted: "Mark as posted",
    notes: "Notes",
    no_notes: "No notes yet.",
    load_edition_failed: "Couldn't load this edition.",
    publish: "Publish",
    save: "Save",
    edit: "Edit",
    done: "Done",
    copy: "Copy",
    copied: "Copied",
    saving: "Saving…",
    publishing: "Publishing…",
    published: "Published",
    package_label: "Story package · visuals & music",
    publish_confirm: "Post the {lang} Telegram text to the TEA Media channel now? This publishes immediately.",
    save_failed: "Couldn't save: {msg}",
    publish_failed: "Publish failed: {msg}",
    what_changes: "What needs to change?",
    failed: "Failed: {msg}",
    loading_archive: "Loading archive…",
    no_cards: "No cards filed yet.",
    wow_rel: "wow {w} · rel {r}",
    used_in: "used in {list}",
    unused: "unused",
    load_archive_failed: "Couldn't load the archive.",
    loading_settings: "Loading settings…",
    editions_per_week: "Editions per week",
    platforms: "Platforms",
    politics: "Cyprus / Türkiye / Iran politics",
    default_desks: "Default desk rotation (optional — leave all unchecked to rotate automatically)",
    save_settings: "Save settings",
    saved: "Saved",
    load_settings_failed: "Couldn't load settings.",
    status_awaiting: "awaiting",
    status_changes: "changes",
    status_approved: "approved",
    status_published: "published",
    status_verified: "verified",
    "status_needs-2nd-source": "needs 2nd source",
    status_myth: "myth",
    status_pending: "pending",
    status_running: "running",
    status_done: "done",
    status_failed: "failed",
    fmt_telegram: "Telegram",
    fmt_whatsapp: "WhatsApp",
    fmt_carousel: "Instagram / Facebook carousel",
    fmt_reel: "Reel script",
    fmt_linkedin: "LinkedIn",
    fmt_visual: "Visual brief",
    desk_antiquity: "Antiquity",
    desk_empires_crashes: "Empires & Crashes",
    desk_cons_heists: "Cons & Heists",
    desk_crypto_fintech: "Crypto & Fintech",
    desk_money_lock: "Money Lock",
    desk_oddities_myths: "Oddities & Myths",
    desk_region: "Our Region",
    desk_wire: "Wire",
    plat_telegram: "Telegram",
    plat_whatsapp: "WhatsApp",
    plat_instagram: "Instagram",
    plat_facebook: "Facebook",
    plat_linkedin: "LinkedIn",
    pol_ask_each_time: "Ask me each time a story touches Cyprus, Türkiye or Iran politics",
    pol_allow_neutral_coverage: "Write neutral, facts-only coverage without asking",
    pol_always_hold: "Never research these topics at all",
    by_claude: "Claude",
  },
  fa: {
    tab_editions: "شماره‌ها",
    tab_archive: "آرشیو",
    tab_settings: "تنظیمات",
    gate_who: "چه کسی وارد می‌شود",
    gate_pass: "رمز عبور",
    gate_sign_in: "ورود",
    gate_enter_pass: "ابتدا رمز عبور را وارد کنید.",
    gate_wrong: "این رمز عبور درست نیست. دوباره امتحان کنید.",
    generate_btn: "+ ساخت شماره جدید",
    generating: "در حال ساخت شماره جدید…",
    requested_at: "درخواست‌شده در {date}",
    loading_editions: "در حال بارگذاری شماره‌ها…",
    no_editions: "هنوز شماره‌ای نیست.",
    load_editions_failed: "بارگذاری شماره‌ها ممکن نشد.",
    pick_desks: "انتخاب بخش‌ها (اختیاری — اگر هیچ‌کدام را نزنید، سردبیر خودش انتخاب می‌کند)",
    angle_label: "زاویه یا ایدهٔ داستان (اختیاری)",
    angle_placeholder: "مثلاً یک جعل مشهور، یک هک کریپتویی ۲۰۲۶…",
    queue_btn: "ثبت این شماره در صف",
    queued_msg: "در صف ثبت شد — ظرف یک ساعت برداشته می‌شود و پس از پایان تحقیق اینجا ظاهر می‌شود (این کار چندمرحله‌ای و واقعی است، فوری نیست).",
    queue_failed: "ثبت شماره جدید ممکن نشد: {msg}",
    loading_edition: "در حال بارگذاری شماره…",
    why: "چرا این داستان",
    judgment: "نیاز به قضاوت شما",
    approve: "تأیید",
    request_changes: "درخواست اصلاح",
    mark_posted: "علامت‌گذاری به‌عنوان منتشرشده",
    notes: "یادداشت‌ها",
    no_notes: "هنوز یادداشتی نیست.",
    load_edition_failed: "بارگذاری این شماره ممکن نشد.",
    publish: "انتشار",
    save: "ذخیره",
    edit: "ویرایش",
    done: "پایان",
    copy: "کپی",
    copied: "کپی شد",
    saving: "در حال ذخیره…",
    publishing: "در حال انتشار…",
    published: "منتشر شد",
    package_label: "بستهٔ داستان · تصویر و موسیقی",
    publish_confirm: "متن تلگرامی {lang} همین حالا در کانال TEA Media منتشر شود؟ این کار فوری منتشر می‌کند.",
    save_failed: "ذخیره ممکن نشد: {msg}",
    publish_failed: "انتشار ناموفق بود: {msg}",
    what_changes: "چه چیزی باید تغییر کند؟",
    failed: "ناموفق: {msg}",
    loading_archive: "در حال بارگذاری آرشیو…",
    no_cards: "هنوز کارتی ثبت نشده.",
    wow_rel: "جذابیت {w} · ارتباط {r}",
    used_in: "استفاده در {list}",
    unused: "استفاده‌نشده",
    load_archive_failed: "بارگذاری آرشیو ممکن نشد.",
    loading_settings: "در حال بارگذاری تنظیمات…",
    editions_per_week: "شماره در هفته",
    platforms: "پلتفرم‌ها",
    politics: "سیاست قبرس / ترکیه / ایران",
    default_desks: "چرخش پیش‌فرض بخش‌ها (اختیاری — اگر هیچ‌کدام را نزنید، خودکار می‌چرخد)",
    save_settings: "ذخیرهٔ تنظیمات",
    saved: "ذخیره شد",
    load_settings_failed: "بارگذاری تنظیمات ممکن نشد.",
    status_awaiting: "در انتظار",
    status_changes: "نیاز به اصلاح",
    status_approved: "تأییدشده",
    status_published: "منتشرشده",
    status_verified: "تأییدشده",
    "status_needs-2nd-source": "نیاز به منبع دوم",
    status_myth: "افسانه",
    status_pending: "در صف",
    status_running: "در حال ساخت",
    status_done: "انجام شد",
    status_failed: "ناموفق",
    fmt_telegram: "تلگرام",
    fmt_whatsapp: "واتس‌اپ",
    fmt_carousel: "کاروسل اینستاگرام / فیس‌بوک",
    fmt_reel: "متن ریلز",
    fmt_linkedin: "لینکدین",
    fmt_visual: "نقشهٔ تصویری",
    desk_antiquity: "عتیقه (پیش از ۱۵۰۰)",
    desk_empires_crashes: "امپراتوری‌ها و بحران‌ها",
    desk_cons_heists: "کلاهبرداری و سرقت",
    desk_crypto_fintech: "کریپتو و فین‌تک",
    desk_money_lock: "قفل پول",
    desk_oddities_myths: "عجایب و افسانه‌ها",
    desk_region: "منطقهٔ ما",
    desk_wire: "خبرهای روز",
    plat_telegram: "تلگرام",
    plat_whatsapp: "واتس‌اپ",
    plat_instagram: "اینستاگرام",
    plat_facebook: "فیس‌بوک",
    plat_linkedin: "لینکدین",
    pol_ask_each_time: "هر بار بپرس وقتی داستانی به سیاست قبرس، ترکیه یا ایران مربوط است",
    pol_allow_neutral_coverage: "پوشش بی‌طرفانه و فقط بر اساس واقعیت، بدون پرسیدن",
    pol_always_hold: "هرگز این موضوعات را بررسی نکن",
    by_claude: "Claude",
  },
};

let uiLang = localStorage.getItem("sikke_ui_lang") === "fa" ? "fa" : "en";

function t(key, vars = {}) {
  const s = STR[uiLang][key] ?? STR.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
}

const DESK_KEYS = [
  ["antiquity", "desk_antiquity"],
  ["empires-crashes", "desk_empires_crashes"],
  ["cons-heists", "desk_cons_heists"],
  ["crypto-fintech", "desk_crypto_fintech"],
  ["money-lock", "desk_money_lock"],
  ["oddities-myths", "desk_oddities_myths"],
  ["region", "desk_region"],
  ["wire", "desk_wire"],
];
const PLATFORM_KEYS = [
  ["telegram", "plat_telegram"],
  ["whatsapp", "plat_whatsapp"],
  ["instagram", "plat_instagram"],
  ["facebook", "plat_facebook"],
  ["linkedin", "plat_linkedin"],
];
const POLICY_KEYS = ["ask_each_time", "allow_neutral_coverage", "always_hold"];
const FORMAT_KEYS = {
  telegram: "fmt_telegram",
  whatsapp: "fmt_whatsapp",
  carousel: "fmt_carousel",
  reel: "fmt_reel",
  linkedin: "fmt_linkedin",
  visual: "fmt_visual",
};

const view = document.getElementById("view");

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

function badge(status, cls) {
  const text = STR[uiLang][`status_${cls}`] ? t(`status_${cls}`) : status;
  return `<span class="badge badge-${cls}">${escapeHtml(text)}</span>`;
}

function setActiveTab(name) {
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.tab === name);
  });
}

function applyUiLanguage() {
  document.documentElement.lang = uiLang;
  document.documentElement.dir = uiLang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("ui-fa", uiLang === "fa");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const toggle = document.getElementById("uiLangToggle");
  if (toggle) toggle.textContent = uiLang === "fa" ? "English" : "فارسی";
}

async function renderEditions() {
  setActiveTab("editions");
  view.innerHTML = `<div class="loading">${t("loading_editions")}</div>`;
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
        <div class="card-title">${t("generating")}</div>
        <div class="meta">${badge(r.status, r.status)}<span>${t("requested_at", { date: escapeHtml(r.requested_at) })}</span></div>
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
      : `<div class="empty">${t("no_editions")}</div>`;

    view.innerHTML = `
      <button class="btn-primary" id="generateBtn" style="width:100%;margin-bottom:12px;">${t("generate_btn")}</button>
      <div id="generateForm" style="display:none;"></div>
      ${pendingHtml}
      ${editionsHtml}
    `;
    document.getElementById("generateBtn").addEventListener("click", toggleGenerateForm);
  } catch (err) {
    view.innerHTML = `<div class="empty">${t("load_editions_failed")}<br>${escapeHtml(err.message)}</div>`;
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
      <div class="format-label" style="margin-bottom:8px;">${t("pick_desks")}</div>
      <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:12px;">
        ${DESK_KEYS.map(
          ([slug, key]) =>
            `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" value="${slug}" style="margin-right:4px;">${escapeHtml(t(key))}</label>`
        ).join("")}
      </div>
      <div class="format-label" style="margin-bottom:6px;">${t("angle_label")}</div>
      <input type="text" id="angleInput" class="field__input" placeholder="${escapeHtml(t("angle_placeholder"))}" style="margin-bottom:12px;">
      <button class="btn-primary" id="submitGenerate" style="width:100%;">${t("queue_btn")}</button>
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
    const msg = t("queued_msg");
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
    renderEditions();
  } catch (err) {
    const msg = t("queue_failed", { msg: err.message });
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

let activeLang = "EN";

async function renderEditionDetail(id) {
  setActiveTab("editions");
  view.innerHTML = `<div class="loading">${t("loading_edition")}</div>`;
  try {
    const e = await api(`/api/editions/${id}`);
    const langs = Object.keys(e.content || {});
    if (!langs.includes(activeLang)) activeLang = langs[0] || "EN";

    const judgmentHtml = (e.judgment || [])
      .map((j) => `<li>${escapeHtml(j)}</li>`)
      .join("");
    const notesHtml = (e.notes || [])
      .map(
        (n) => `<div class="note"><div class="note-meta">${escapeHtml(n.kind)} · ${escapeHtml(n.by || t("by_claude"))} · ${escapeHtml(n.at)}</div>${escapeHtml(n.text)}</div>`
      )
      .join("");

    view.innerHTML = `
      <div class="card-title" style="font-size:18px;">${escapeHtml(e.title)}</div>
      <div class="meta" style="margin:6px 0 14px;">${badge(e.status, e.status)}<span>${escapeHtml(e.publish_date)}</span></div>
      <div class="format-block"><div class="format-label">${t("why")}</div><div class="format-body">${escapeHtml(e.why)}</div></div>
      ${judgmentHtml ? `<div class="format-block"><div class="format-label">${t("judgment")}</div><div class="format-body"><ul style="margin:0;padding-left:18px;">${judgmentHtml}</ul></div></div>` : ""}

      <div class="lang-tabs">
        ${langs.map((l) => `<div class="lang-tab ${l === activeLang ? "active" : ""}" data-lang="${l}">${l}</div>`).join("")}
      </div>
      <div id="langContent"></div>

      <div class="actions">
        <button class="btn-primary" data-action="approve">${t("approve")}</button>
        <button class="btn-secondary" data-action="changes">${t("request_changes")}</button>
        <button class="btn-secondary" data-action="posted">${t("mark_posted")}</button>
      </div>

      <div class="notes"><div class="format-label">${t("notes")}</div>${notesHtml || `<div class="meta">${t("no_notes")}</div>`}</div>
    `;

    renderLangContent(e.content[activeLang] || {}, id, activeLang, e.status);

    view.querySelectorAll(".lang-tab").forEach((el) => {
      el.addEventListener("click", () => {
        activeLang = el.dataset.lang;
        view.querySelectorAll(".lang-tab").forEach((tab) => tab.classList.toggle("active", tab === el));
        renderLangContent(e.content[activeLang] || {}, id, activeLang, e.status);
      });
    });

    view.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleDecision(id, btn.dataset.action));
    });
  } catch (err) {
    view.innerHTML = `<div class="empty">${t("load_edition_failed")}<br>${escapeHtml(err.message)}</div>`;
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
    if (lines[i].trim().startsWith("```")) {
      flushPara();
      const code = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "```") {
        code.push(lines[i]);
        i++;
      }
      i++;
      const body = code.join("\n");
      html += `<div class="prompt-block"><pre>${escapeHtml(body)}</pre><button class="btn-copy" data-copy-code="${escapeHtml(body)}">${t("copy")}</button></div>`;
      continue;
    }
    const heading = lines[i].match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      html += `<h4 class="pkg-h">${escapeHtml(heading[2])}</h4>`;
      i++;
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
  el.innerHTML = Object.entries(FORMAT_KEYS)
    .filter(([key]) => content[key])
    .map(
      ([key, labelKey]) => `
      <div class="format-block">
        <div class="format-label-row">
          <div class="format-label">${t(labelKey)}</div>
          <div class="format-actions">
            ${
              key === "telegram"
                ? `<button class="btn-copy ${canPublish ? "" : "btn-disabled"}" data-publish-telegram ${canPublish ? "" : "disabled"}>${t("publish")}</button>`
                : ""
            }
            <button class="btn-copy btn-save" data-save-key="${key}" style="display:none;">${t("save")}</button>
            <button class="btn-copy" data-toggle-key="${key}">${t("edit")}</button>
            <button class="btn-copy" data-copy-key="${key}">${t("copy")}</button>
          </div>
        </div>
        <div class="format-body format-read" data-key="${key}">${renderFormattedText(content[key])}</div>
        <textarea class="format-body format-editable" data-key="${key}" data-original="${escapeHtml(content[key])}" hidden>${escapeHtml(content[key])}</textarea>
      </div>`
    )
    .join("");

  if (lang === "EN" && content.package) {
    el.insertAdjacentHTML(
      "beforeend",
      `<div class="format-block package-block">
        <div class="format-label-row"><div class="format-label">${t("package_label")}</div></div>
        <div class="format-body format-read">${renderFormattedText(content.package)}</div>
      </div>`
    );
  }

  el.querySelectorAll("[data-copy-code]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.dataset.copyCode, btn));
  });

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
        btn.textContent = t("edit");
      } else {
        ta.hidden = false;
        read.hidden = true;
        btn.textContent = t("done");
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
  btn.textContent = t("saving");
  btn.disabled = true;
  try {
    await api(`/api/editions/${editionId}/content`, {
      method: "PATCH",
      body: JSON.stringify({ lang, key, text }),
    });
    ta.dataset.original = text;
    btn.style.display = "none";
    btn.textContent = t("save");
    btn.disabled = false;
    const read = el.querySelector(`.format-read[data-key="${key}"]`);
    const toggleBtn = el.querySelector(`[data-toggle-key="${key}"]`);
    read.innerHTML = renderFormattedText(text);
    ta.hidden = true;
    read.hidden = false;
    if (toggleBtn) toggleBtn.textContent = t("edit");
    tg?.HapticFeedback?.notificationOccurred("success");
  } catch (err) {
    btn.textContent = t("save");
    btn.disabled = false;
    const msg = t("save_failed", { msg: err.message });
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

async function publishToTelegram(editionId, lang, btn) {
  const confirmed = window.confirm(t("publish_confirm", { lang }));
  if (!confirmed) return;
  btn.textContent = t("publishing");
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
    btn.textContent = t("published");
    btn.classList.add("btn-copy-done");
  } catch (err) {
    btn.textContent = t("publish");
    btn.disabled = false;
    const msg = t("publish_failed", { msg: err.message });
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
  btn.textContent = t("copied");
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
      ? await promptViaTelegram(t("what_changes"))
      : window.prompt(t("what_changes")) || "";
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
    const msg = t("failed", { msg: err.message });
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  }
}

function promptViaTelegram(message) {
  // Telegram's native popup doesn't support free text input; fall back to window.prompt
  // inside the WebView, which Telegram does allow.
  return Promise.resolve(window.prompt(message) || "");
}

async function renderArchive() {
  setActiveTab("archive");
  view.innerHTML = `<div class="loading">${t("loading_archive")}</div>`;
  try {
    const cards = await api("/api/cards");
    if (!cards.length) {
      view.innerHTML = `<div class="empty">${t("no_cards")}</div>`;
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
          <span>${t("wow_rel", { w: c.wow, r: c.relevance })}</span>
          ${c.used_in?.length ? `<span>${t("used_in", { list: c.used_in.join(", ") })}</span>` : `<span>${t("unused")}</span>`}
        </div>
      </div>`
      )
      .join("");
  } catch (err) {
    view.innerHTML = `<div class="empty">${t("load_archive_failed")}<br>${escapeHtml(err.message)}</div>`;
  }
}

async function renderSettings() {
  setActiveTab("settings");
  view.innerHTML = `<div class="loading">${t("loading_settings")}</div>`;
  try {
    const s = await api("/api/settings");
    view.innerHTML = `
      <div class="card">
        <div class="format-label" style="margin-bottom:6px;">${t("editions_per_week")}</div>
        <input type="number" id="setEditionsPerWeek" class="field__input" min="1" max="14" value="${s.editions_per_week}" style="margin-bottom:16px;">

        <div class="format-label" style="margin-bottom:6px;">${t("platforms")}</div>
        <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:16px;">
          ${PLATFORM_KEYS.map(
            ([slug, key]) =>
              `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" class="setPlatform" value="${slug}" ${s.platforms.includes(slug) ? "checked" : ""} style="margin-right:4px;">${escapeHtml(t(key))}</label>`
          ).join("")}
        </div>

        <div class="format-label" style="margin-bottom:6px;">${t("politics")}</div>
        <div style="margin-bottom:16px;">
          ${POLICY_KEYS.map(
            (val) => `
            <label style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:14px;cursor:pointer;">
              <input type="radio" name="setPolicy" value="${val}" ${s.regional_politics_policy === val ? "checked" : ""} style="margin-top:3px;">
              <span>${escapeHtml(t(`pol_${val}`))}</span>
            </label>`
          ).join("")}
        </div>

        <div class="format-label" style="margin-bottom:6px;">${t("default_desks")}</div>
        <div class="filters" style="flex-wrap:wrap;overflow:visible;margin-bottom:18px;">
          ${DESK_KEYS.map(
            ([slug, key]) =>
              `<label class="filter-chip" style="cursor:pointer;"><input type="checkbox" class="setDesk" value="${slug}" ${s.default_desks.includes(slug) ? "checked" : ""} style="margin-right:4px;">${escapeHtml(t(key))}</label>`
          ).join("")}
        </div>

        <button class="btn-primary" id="saveSettings" style="width:100%;">${t("save_settings")}</button>
      </div>
    `;
    document.getElementById("saveSettings").addEventListener("click", saveSettings);
  } catch (err) {
    view.innerHTML = `<div class="empty">${t("load_settings_failed")}<br>${escapeHtml(err.message)}</div>`;
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
  btn.textContent = t("saving");
  btn.disabled = true;
  try {
    await api("/api/settings", { method: "PUT", body: JSON.stringify(body) });
    tg?.HapticFeedback?.notificationOccurred("success");
    btn.textContent = t("saved");
    setTimeout(() => {
      btn.textContent = t("save_settings");
      btn.disabled = false;
    }, 1200);
  } catch (err) {
    btn.textContent = t("save_settings");
    btn.disabled = false;
    const msg = t("save_failed", { msg: err.message });
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
  applyUiLanguage();
  router();
}

function showGate(message) {
  applyUiLanguage();
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
    showGate(t("gate_enter_pass"));
    return;
  }
  webSession = { name, pass };
  try {
    await api("/api/settings");
    localStorage.setItem("sikke_web_session", JSON.stringify(webSession));
    showApp();
  } catch {
    webSession = null;
    showGate(t("gate_wrong"));
  }
});

document.getElementById("uiLangToggle").addEventListener("click", () => {
  uiLang = uiLang === "fa" ? "en" : "fa";
  localStorage.setItem("sikke_ui_lang", uiLang);
  applyUiLanguage();
  if (document.getElementById("app").style.display !== "none") router();
});

applyUiLanguage();
trySession();
