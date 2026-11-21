const OFFICIAL_DINING_URL = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/";
const DEFAULT_MENU_PDF_URL =
  "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/sites/3/2026/10/menu-domitory-2026_11-2.pdf";
const DEFAULT_ALLERGY_NOTICE = "PDFファイルを確認してください．";

const MEAL_LABELS = [
  { key: "breakfast", label: "朝食", time: "07:00 〜 09:00" },
  { key: "lunch", label: "昼食", time: "11:30 〜 13:30" },
  { key: "dinner", label: "夕食", time: "18:00 〜 21:00" }
];

let menuDays = [];
let selectedDate = "";
let currentMenuPdfUrl = DEFAULT_MENU_PDF_URL;

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getNowJstDate() {
  const now = new Date();
  const jstMs = now.getTime() + (now.getTimezoneOffset() + 540) * 60000;
  return new Date(jstMs);
}

function getTodayIsoJst() {
  const jstDate = getNowJstDate();
  const y = jstDate.getFullYear();
  const m = String(jstDate.getMonth() + 1).padStart(2, "0");
  const d = String(jstDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeNextMonday0630Jst() {
  const now = getNowJstDate();
  const dow = now.getDay();
  const daysAhead = (1 - dow + 7) % 7;
  const candidate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysAhead,
    6,
    30,
    0,
    0
  );
  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 7);
  }
  const y = candidate.getFullYear();
  const m = String(candidate.getMonth() + 1).padStart(2, "0");
  const d = String(candidate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d} 06:30:00 JST`;
}

function shiftIsoDate(isoDate, deltaDays) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const nd = String(dt.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

function formatJapaneseDate(isoDate, dayOfWeek = "") {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const dowNames = ["日", "月", "火", "水", "木", "金", "土"];
  const calculatedDow = dowNames[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const dow = dayOfWeek || calculatedDow;
  return `${y}年${m}月${d}日（${dow}）`;
}

function renderAutoCheckResult(feed) {
  const auto = feed.auto_check || {};
  const badgeEl = document.getElementById("auto-check-badge");
  const msgEl = document.getElementById("auto-check-message");
  const schedEl = document.getElementById("auto-check-schedule");
  const lastEl = document.getElementById("auto-check-last");
  const nextEl = document.getElementById("auto-check-next");
  const targetEl = document.getElementById("auto-check-target");

  const isSuccess = (auto.result_status || "success") === "success";
  if (badgeEl) {
    badgeEl.textContent = isSuccess ? "本番公開中・反映済み" : "確認待ち";
    badgeEl.style.backgroundColor = isSuccess ? "#1e6f5c" : "#b45309";
  }

  if (msgEl) {
    msgEl.textContent =
      auto.result_message ||
      `公式献立表データを確認し、${menuDays.length}日分の献立を反映しました。`;
  }
  if (schedEl) {
    schedEl.textContent = auto.schedule_label || "毎週月曜日 06:30 ごろ（JST）";
  }
  if (lastEl) {
    lastEl.textContent = auto.last_checked_at || feed.fetched_at || "未実行";
  }
  if (nextEl) {
    nextEl.textContent = auto.next_check_at || computeNextMonday0630Jst();
  }
  if (targetEl) {
    const targetMonth = auto.target_month || "今月分";
    targetEl.textContent = `${targetMonth}（登録済み ${menuDays.length}日分）`;
  }

  const allergyTextEl = document.getElementById("allergy-notice-text");
  if (allergyTextEl) {
    allergyTextEl.textContent = feed.allergy_notice || DEFAULT_ALLERGY_NOTICE;
  }

  currentMenuPdfUrl = feed.latest_article?.menu_pdf_url || DEFAULT_MENU_PDF_URL;
  const allergyPdfEl = document.getElementById("allergy-pdf-link");
  if (allergyPdfEl && currentMenuPdfUrl) {
    allergyPdfEl.innerHTML = `<a href="${escapeHtml(currentMenuPdfUrl)}" target="_blank" rel="noopener noreferrer">公式献立表PDFを開く ↗</a>`;
  }
}

function renderQuickDayChips() {
  const container = document.getElementById("quick-days");
  if (!container) return;

  if (menuDays.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = menuDays.map((entry) => {
    const [, m, d] = entry.date.split("-").map(Number);
    const dow = entry.day_of_week || "";
    const dowClass = dow === "日" ? "sun" : (dow === "土" ? "sat" : "");
    const isActive = entry.date === selectedDate;
    return `
      <button type="button" class="day-chip ${dowClass} ${isActive ? "active" : ""}" data-date="${escapeHtml(entry.date)}">
        ${m}/${d}(${escapeHtml(dow)})
      </button>
    `;
  }).join("");

  container.querySelectorAll(".day-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      setSelectedDate(btn.dataset.date);
    });
  });
}

function renderDailyMenu(isoDate) {
  const labelEl = document.getElementById("selected-date-label");
  const pickerEl = document.getElementById("date-picker");
  const container = document.getElementById("daily-menu-container");
  if (!container) return;

  if (pickerEl) pickerEl.value = isoDate;
  const dayEntry = menuDays.find((d) => d.date === isoDate);
  if (labelEl) {
    labelEl.textContent = formatJapaneseDate(isoDate, dayEntry?.day_of_week || "");
  }

  renderQuickDayChips();

  if (!dayEntry || !dayEntry.meals) {
    container.innerHTML = `
      <div class="empty-state">
        <p><strong>${escapeHtml(formatJapaneseDate(isoDate))}</strong> の献立データは未反映です。</p>
        <p class="meta">公式の献立表PDFファイルから直接ご確認いただけます。</p>
        <p style="margin-top:0.8rem;">
          <a class="nav-btn primary" href="${escapeHtml(currentMenuPdfUrl)}" target="_blank" rel="noopener noreferrer">
            公式献立表PDFを開く ↗
          </a>
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = MEAL_LABELS.map(({ key, label, time }) => {
    const meal = dayEntry.meals[key];
    const hasContent =
      meal &&
      ((meal.set_a?.name && meal.set_a.name.trim() !== "") ||
        (meal.set_b?.name && meal.set_b.name.trim() !== "") ||
        (Array.isArray(meal.common?.items) && meal.common.items.length > 0));

    if (!hasContent) {
      return `
        <article class="meal-section">
          <div class="meal-header">
            <div><h2>${escapeHtml(label)}</h2></div>
            <span class="meta">営業時間目安: ${escapeHtml(time)}</span>
          </div>
          <p class="meta" style="margin:0;">
            この時間帯の献立は未反映です。詳細は
            <a href="${escapeHtml(currentMenuPdfUrl)}" target="_blank" rel="noopener noreferrer">公式献立表PDF ↗</a>
            をご確認ください。
          </p>
        </article>
      `;
    }

    const setAName = meal.set_a?.name || "記載なし";
    const setACal = meal.set_a?.calories ? `${meal.set_a.calories} kcal` : "";
    const setBName = meal.set_b?.name || "記載なし";
    const setBCal = meal.set_b?.calories ? `${meal.set_b.calories} kcal` : "";
    const commonItems = Array.isArray(meal.common?.items) ? meal.common.items : [];
    const noteHtml = meal.note ? `<span class="note-badge">${escapeHtml(meal.note)}</span>` : "";

    return `
      <article class="meal-section">
        <div class="meal-header">
          <div>
            <h2>${escapeHtml(label)} ${noteHtml}</h2>
          </div>
          <span class="meta">営業時間目安: ${escapeHtml(time)}</span>
        </div>
        <div class="course-grid">
          <div class="course-card set-a">
            <span class="course-badge">A定食</span>
            <div class="dish-name">${escapeHtml(setAName)}</div>
            ${setACal ? `<div class="meta">エネルギー: ${escapeHtml(setACal)}</div>` : ""}
          </div>

          <div class="course-card set-b">
            <span class="course-badge">B定食</span>
            <div class="dish-name">${escapeHtml(setBName)}</div>
            ${setBCal ? `<div class="meta">エネルギー: ${escapeHtml(setBCal)}</div>` : ""}
          </div>

          <div class="course-card common">
            <span class="course-badge">共通料理</span>
            ${
              commonItems.length > 0
                ? `<ul class="common-list">${commonItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
                : `<div class="meta">記載なし</div>`
            }
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function formatCompactMealCell(meal) {
  if (!meal) {
    return `<span class="meta">PDF参照</span>`;
  }
  const a = meal.set_a?.name || "";
  const b = meal.set_b?.name || "";
  const c = Array.isArray(meal.common?.items) ? meal.common.items.join("・") : "";
  if (!a && !b && !c) {
    return `<span class="meta">PDF参照</span>`;
  }
  return `
    <div><span class="mini-tag a">A定食</span>${escapeHtml(a || "-")}</div>
    <div><span class="mini-tag b">B定食</span>${escapeHtml(b || "-")}</div>
    <div class="meta"><span class="mini-tag c">共通</span>${escapeHtml(c || "-")}</div>
  `;
}

function renderMonthlyTable(keyword = "") {
  const tbody = document.getElementById("monthly-table-body");
  const summaryEl = document.getElementById("monthly-summary");
  if (!tbody) return;

  const q = keyword.trim().toLowerCase();
  const filtered = menuDays.filter((entry) => {
    if (!q) return true;
    const blob = JSON.stringify(entry).toLowerCase();
    return blob.includes(q);
  });

  if (summaryEl) {
    summaryEl.textContent = `表示件数: ${filtered.length}日分 / 登録済み ${menuDays.length}日分`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="meta" style="text-align:center;padding:1.5rem;">
          該当する献立データがありません。<a href="${escapeHtml(currentMenuPdfUrl)}" target="_blank" rel="noopener noreferrer">公式献立表PDF ↗</a> をご確認ください。
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((entry) => {
    const [, m, d] = entry.date.split("-").map(Number);
    return `
      <tr>
        <td style="white-space:nowrap;">
          <strong>${m}月${d}日（${escapeHtml(entry.day_of_week || "")}）</strong><br/>
          <button type="button" class="nav-btn" style="margin-top:0.3rem;padding:0.2rem 0.5rem;font-size:0.78rem;" data-jump-date="${escapeHtml(entry.date)}">
            詳細表示
          </button>
        </td>
        <td>${formatCompactMealCell(entry.meals?.breakfast)}</td>
        <td>${formatCompactMealCell(entry.meals?.lunch)}</td>
        <td>${formatCompactMealCell(entry.meals?.dinner)}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("[data-jump-date]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchView("daily");
      setSelectedDate(btn.dataset.jumpDate);
    });
  });
}

function switchView(mode) {
  const dailyView = document.getElementById("daily-view");
  const monthlyView = document.getElementById("monthly-view");
  const tabDaily = document.getElementById("tab-daily");
  const tabMonthly = document.getElementById("tab-monthly");

  if (mode === "monthly") {
    dailyView?.classList.add("hidden");
    monthlyView?.classList.remove("hidden");
    tabDaily?.classList.remove("active");
    tabMonthly?.classList.add("active");
  } else {
    monthlyView?.classList.add("hidden");
    dailyView?.classList.remove("hidden");
    tabMonthly?.classList.remove("active");
    tabDaily?.classList.add("active");
  }
}

function setSelectedDate(isoDate) {
  if (!isoDate) return;
  selectedDate = isoDate;
  renderDailyMenu(selectedDate);
}

async function loadAndRenderFeed(preserveSelectedDate = false) {
  let feed = {
    source_url: OFFICIAL_DINING_URL,
    fetched_at: "",
    allergy_notice: DEFAULT_ALLERGY_NOTICE,
    auto_check: {},
    latest_article: {
      menu_pdf_url: DEFAULT_MENU_PDF_URL
    },
    days: []
  };

  try {
    const res = await fetch(`./monthly_menu.json?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      feed = await res.json();
    }
  } catch (_) {
    // ローカル直接閲覧時
  }

  menuDays = Array.isArray(feed.days) ? feed.days : [];
  renderAutoCheckResult(feed);

  const syncEl = document.getElementById("sync-info");
  if (syncEl) {
    const title = feed.latest_article?.title || "学寮食堂献立表";
    syncEl.textContent = `${title} / 更新: ${feed.fetched_at || ""}`;
  }

  const pdfArea = document.getElementById("pdf-link-area");
  const menuPdf = feed.latest_article?.menu_pdf_url || DEFAULT_MENU_PDF_URL;
  const nutritionPdf = feed.latest_article?.nutrition_pdf_url;
  if (pdfArea) {
    const links = [];
    if (menuPdf) {
      links.push(`<a href="${escapeHtml(menuPdf)}" target="_blank" rel="noopener noreferrer">献立表PDF ↗</a>`);
    }
    if (nutritionPdf) {
      links.push(`<a href="${escapeHtml(nutritionPdf)}" target="_blank" rel="noopener noreferrer">栄養価計算書PDF ↗</a>`);
    }
    pdfArea.innerHTML = links.length > 0 ? ` ｜ ${links.join(" ｜ ")}` : "";
  }

  if (preserveSelectedDate && selectedDate) {
    setSelectedDate(selectedDate);
  } else {
    const today = getTodayIsoJst();
    const hasToday = menuDays.some((d) => d.date === today);
    const initialDate = hasToday ? today : (menuDays[0]?.date || today);
    setSelectedDate(initialDate);
  }

  const searchInput = document.getElementById("menu-search");
  renderMonthlyTable(searchInput ? searchInput.value : "");
}

async function init() {
  await loadAndRenderFeed(false);

  document.getElementById("reload-feed-btn")?.addEventListener("click", () => {
    loadAndRenderFeed(true);
  });

  document.getElementById("tab-daily")?.addEventListener("click", () => switchView("daily"));
  document.getElementById("tab-monthly")?.addEventListener("click", () => switchView("monthly"));

  document.getElementById("prev-day-btn")?.addEventListener("click", () => {
    setSelectedDate(shiftIsoDate(selectedDate, -1));
  });
  document.getElementById("next-day-btn")?.addEventListener("click", () => {
    setSelectedDate(shiftIsoDate(selectedDate, 1));
  });
  document.getElementById("today-btn")?.addEventListener("click", () => {
    const t = getTodayIsoJst();
    setSelectedDate(menuDays.some((d) => d.date === t) ? t : (menuDays[0]?.date || t));
  });
  document.getElementById("date-picker")?.addEventListener("change", (e) => {
    if (e.target.value) setSelectedDate(e.target.value);
  });
  document.getElementById("menu-search")?.addEventListener("input", (e) => {
    renderMonthlyTable(e.target.value);
  });
}

document.addEventListener("DOMContentLoaded", init);
