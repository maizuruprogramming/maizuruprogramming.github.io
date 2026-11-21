(() => {
  "use strict";

  const MENU_JSON_URL = "monthly_menu.json";
  const DEFAULT_PDF_URL =
    "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/sites/3/2026/10/menu-domitory-2026_11-2.pdf";

  const DEFAULT_MEAL_HOURS = {
    weekday: {
      label: "月〜金（平日）",
      breakfast: "7:30～8:30",
      lunch: "12:00～12:55",
      dinner: "18:00～19:30",
    },
    weekend_holiday: {
      label: "土〜日・休日",
      breakfast: "7:40～8:40",
      lunch: "12:00～13:30",
      dinner: "18:00～19:30",
    },
  };

  const MEAL_DEFINITIONS = [
    { key: "breakfast", label: "朝食" },
    { key: "lunch", label: "昼食" },
    { key: "dinner", label: "夕食" },
  ];

  const DOW_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

  let menuData = null;
  let daysList = [];
  let selectedDate = "";

  const $ = (id) => document.getElementById(id);

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/\u0026/g, "\u0026amp;")
      .replace(/\u003c/g, "\u0026lt;")
      .replace(/\u003e/g, "\u0026gt;")
      .replace(/\u0022/g, "\u0026quot;")
      .replace(/\u0027/g, "\u0026#39;");
  }

  function parseIsoDate(isoStr) {
    const [y, m, d] = isoStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function formatIsoDate(dateObj) {
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getTodayJstIso() {
    const now = new Date();
    const jstMs = now.getTime() + 9 * 60 * 60 * 1000;
    return formatIsoDate(new Date(jstMs));
  }

  function getNthWeekdayIso(year, month, weekday, n) {
    const first = new Date(Date.UTC(year, month - 1, 1));
    const offset = (weekday - first.getUTCDay() + 7) % 7;
    const day = 1 + offset + (n - 1) * 7;
    return formatIsoDate(new Date(Date.UTC(year, month - 1, day)));
  }

  function getJapaneseHolidays(year) {
    const holidays = new Set([
      `${year}-01-01`, // 元日
      `${year}-02-11`, // 建国記念の日
      `${year}-02-23`, // 天皇誕生日
      `${year}-04-29`, // 昭和の日
      `${year}-05-03`, // 憲法記念日
      `${year}-05-04`, // みどりの日
      `${year}-05-05`, // こどもの日
      `${year}-08-11`, // 山の日
      `${year}-11-03`, // 文化の日
      `${year}-11-23`, // 勤労感謝の日
      getNthWeekdayIso(year, 1, 1, 2),  // 成人の日
      getNthWeekdayIso(year, 7, 1, 3),  // 海の日
      getNthWeekdayIso(year, 9, 1, 3),  // 敬老の日
      getNthWeekdayIso(year, 10, 1, 2), // スポーツの日
    ]);

    const vernal = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    const autumnal = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    holidays.add(`${year}-03-${String(vernal).padStart(2, "0")}`);
    holidays.add(`${year}-09-${String(autumnal).padStart(2, "0")}`);

    // 国民の休日
    const sorted = Array.from(holidays).sort();
    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = parseIsoDate(sorted[i]);
      const next = parseIsoDate(sorted[i + 1]);
      if ((next - cur) / 86400000 === 2) {
        const mid = new Date(cur.getTime() + 86400000);
        if (mid.getUTCDay() !== 0) {
          holidays.add(formatIsoDate(mid));
        }
      }
    }

    // 振替休日
    for (const iso of Array.from(holidays).sort()) {
      const dt = parseIsoDate(iso);
      if (dt.getUTCDay() === 0) {
        let sub = new Date(dt.getTime() + 86400000);
        while (holidays.has(formatIsoDate(sub))) {
          sub = new Date(sub.getTime() + 86400000);
        }
        holidays.add(formatIsoDate(sub));
      }
    }

    return holidays;
  }

  function getFallbackScheduleForDate(isoStr) {
    const dt = parseIsoDate(isoStr);
    const dow = dt.getUTCDay();
    const holidays = getJapaneseHolidays(dt.getUTCFullYear());
    const isWeekendOrHoliday = dow === 0 || dow === 6 || holidays.has(isoStr);
    const hoursMaster = (menuData && menuData.meal_hours) || DEFAULT_MEAL_HOURS;
    const schedule = isWeekendOrHoliday ? hoursMaster.weekend_holiday : hoursMaster.weekday;

    return {
      dayType: schedule.label,
      isHoliday: isWeekendOrHoliday,
      hours: {
        breakfast: schedule.breakfast,
        lunch: schedule.lunch,
        dinner: schedule.dinner,
      },
    };
  }

  function resolveDaySchedule(isoStr, dayObj) {
    const fallback = getFallbackScheduleForDate(isoStr);
    const dayType = (dayObj && dayObj.day_type) || fallback.dayType;
    const isHoliday = dayType.includes("休日") || fallback.isHoliday;
    const meals = (dayObj && dayObj.meals) || {};

    return {
      dayType,
      isHoliday,
      hours: {
        breakfast: (meals.breakfast && meals.breakfast.hours) || fallback.hours.breakfast,
        lunch: (meals.lunch && meals.lunch.hours) || fallback.hours.lunch,
        dinner: (meals.dinner && meals.dinner.hours) || fallback.hours.dinner,
      },
    };
  }

  function formatJapaneseDateLabel(isoStr, dayObj) {
    const dt = parseIsoDate(isoStr);
    const y = dt.getUTCFullYear();
    const m = dt.getUTCMonth() + 1;
    const d = dt.getUTCDate();
    const dow = (dayObj && dayObj.day_of_week) || DOW_NAMES[dt.getUTCDay()];
    return `${y}年${m}月${d}日（${dow}）`;
  }

  function renderHeaderAndMeta(data) {
    const sourceLink = $("source-link");
    if (sourceLink && data.source_url) {
      sourceLink.href = data.source_url;
    }

    const latestArticle = data.latest_article || {};
    const pdfUrl = latestArticle.menu_pdf_url || DEFAULT_PDF_URL;
    const nutritionUrl = latestArticle.nutrition_pdf_url || "";
    const pdfLinkArea = $("pdf-link-area");
    if (pdfLinkArea) {
      let html = ` / <a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">献立表PDF ↗</a>`;
      if (nutritionUrl) {
        html += ` / <a href="${escapeHtml(nutritionUrl)}" target="_blank" rel="noopener noreferrer">栄養価計算書PDF ↗</a>`;
      }
      pdfLinkArea.innerHTML = html;
    }

    const syncInfo = $("sync-info");
    if (syncInfo) {
      syncInfo.textContent = data.fetched_at ? `最終反映: ${data.fetched_at}` : "";
    }

    const autoCheck = data.auto_check || {};
    if ($("auto-check-badge")) {
      $("auto-check-badge").textContent =
        autoCheck.result_status === "success" ? "本番公開中" : "確認中";
    }
    if ($("auto-check-message") && autoCheck.result_message) {
      $("auto-check-message").textContent = autoCheck.result_message;
    }
    if ($("auto-check-schedule") && autoCheck.schedule_label) {
      $("auto-check-schedule").textContent = autoCheck.schedule_label;
    }
    if ($("auto-check-last")) {
      $("auto-check-last").textContent = autoCheck.last_checked_at || data.fetched_at || "-";
    }
    if ($("auto-check-next")) {
      $("auto-check-next").textContent = autoCheck.next_check_at || "-";
    }
    if ($("auto-check-target")) {
      const targetMonth = autoCheck.target_month || latestArticle.title || "-";
      $("auto-check-target").textContent = `${targetMonth}（${daysList.length}日分）`;
    }

    if ($("allergy-notice-text") && data.allergy_notice) {
      $("allergy-notice-text").textContent = data.allergy_notice;
    }
    if ($("allergy-pdf-link")) {
      $("allergy-pdf-link").innerHTML = `<a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">公式献立表PDFを開く ↗</a>`;
    }
  }

  function renderQuickDays() {
    const container = $("quick-days");
    if (!container) return;

    container.innerHTML = daysList
      .map((dayObj) => {
        const dt = parseIsoDate(dayObj.date);
        const m = dt.getUTCMonth() + 1;
        const d = dt.getUTCDate();
        const dow = dayObj.day_of_week || DOW_NAMES[dt.getUTCDay()];
        const schedule = resolveDaySchedule(dayObj.date, dayObj);

        const classes = ["day-chip"];
        if (dow === "日" || (schedule.isHoliday && dow !== "土")) {
          classes.push("sun");
        } else if (dow === "土") {
          classes.push("sat");
        }
        if (dayObj.date === selectedDate) {
          classes.push("active");
        }

        return `<button type="button" class="${classes.join(" ")}" data-date="${escapeHtml(dayObj.date)}">${m}/${d}(${escapeHtml(dow)})</button>`;
      })
      .join("");
  }

  function renderDailyView() {
    const dayObj = daysList.find((d) => d.date === selectedDate) || null;
    const schedule = resolveDaySchedule(selectedDate, dayObj);

    const dateLabelEl = $("selected-date-label");
    if (dateLabelEl) {
      dateLabelEl.textContent = formatJapaneseDateLabel(selectedDate, dayObj);
    }

    const dayTypeBadgeEl = $("selected-day-type-badge");
    if (dayTypeBadgeEl) {
      dayTypeBadgeEl.textContent = schedule.dayType;
      dayTypeBadgeEl.classList.toggle("holiday", schedule.isHoliday);
    }

    const datePickerEl = $("date-picker");
    if (datePickerEl) {
      datePickerEl.value = selectedDate;
    }

    const currentIndex = daysList.findIndex((d) => d.date === selectedDate);
    if ($("prev-day-btn")) {
      $("prev-day-btn").disabled = currentIndex === 0;
    }
    if ($("next-day-btn")) {
      $("next-day-btn").disabled = currentIndex === daysList.length - 1 && currentIndex !== -1;
    }

    renderQuickDays();

    const container = $("daily-menu-container");
    if (!container) return;

    if (!dayObj || !dayObj.meals) {
      container.innerHTML = `
        <div class="empty-state">
          選択された日付（${escapeHtml(formatJapaneseDateLabel(selectedDate, null))}）の献立データは登録されていません。
        </div>
      `;
      return;
    }

    const articleNote = (menuData && menuData.latest_article && menuData.latest_article.note) || "";

    container.innerHTML = MEAL_DEFINITIONS.map(({ key, label }) => {
      const meal = dayObj.meals[key] || {};
      const hoursText = meal.hours || schedule.hours[key] || "";
      const setA = meal.set_a || {};
      const setB = meal.set_b || {};
      const commonItems = Array.isArray(meal.common && meal.common.items) ? meal.common.items : [];

      const showChangeNote =
        dayObj.date === "2026-11-14" && key === "lunch" && articleNote;

      const commonHtml =
        commonItems.length > 0
          ? `<ul class="common-list">${commonItems
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>`
          : `<div class="meta">共通料理なし</div>`;

      return `
        <article class="meal-section">
          <div class="meal-header">
            <div class="meal-header-left">
              <h2>${escapeHtml(label)}</h2>
              ${hoursText ? `<span class="meal-time-badge">${escapeHtml(hoursText)}</span>` : ""}
            </div>
            ${showChangeNote ? `<span class="note-badge">${escapeHtml(articleNote)}</span>` : ""}
          </div>
          <div class="course-grid">
            <div class="course-card set-a">
              <span class="course-badge">A定食</span>
              <div class="dish-name">${escapeHtml(setA.name || "未定")}</div>
              ${setA.calories ? `<div class="meta">エネルギー: ${escapeHtml(setA.calories)} kcal</div>` : ""}
            </div>
            <div class="course-card set-b">
              <span class="course-badge">B定食</span>
              <div class="dish-name">${escapeHtml(setB.name || "共通メニュー（選択なし）")}</div>
              ${setB.calories ? `<div class="meta">エネルギー: ${escapeHtml(setB.calories)} kcal</div>` : ""}
            </div>
            <div class="course-card common">
              <span class="course-badge">共通料理</span>
              ${commonHtml}
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderMealSummaryCell(meal, fallbackHours) {
    if (!meal) return "-";
    const hoursText = meal.hours || fallbackHours || "";
    const setAName = (meal.set_a && meal.set_a.name) || "-";
    const setBName = (meal.set_b && meal.set_b.name) || "";
    const commonItems = Array.isArray(meal.common && meal.common.items) ? meal.common.items : [];

    const lines = [];
    if (hoursText) {
      lines.push(`<div class="meta" style="margin-bottom:0.25rem;">${escapeHtml(hoursText)}</div>`);
    }
    lines.push(`<div><span class="mini-tag a">A</span>${escapeHtml(setAName)}</div>`);
    if (setBName && setBName !== "共通メニュー（選択なし）") {
      lines.push(`<div><span class="mini-tag b">B</span>${escapeHtml(setBName)}</div>`);
    }
    if (commonItems.length > 0) {
      lines.push(
        `<div><span class="mini-tag c">共</span>${escapeHtml(commonItems.join(" / "))}</div>`
      );
    }
    return lines.join("");
  }

  function renderMonthlyTable(filterKeyword = "") {
    const tbody = $("monthly-table-body");
    const summaryEl = $("monthly-summary");
    if (!tbody) return;

    const kw = filterKeyword.trim().toLowerCase();
    const filtered = daysList.filter((dayObj) => {
      if (!kw) return true;
      const schedule = resolveDaySchedule(dayObj.date, dayObj);
      const haystack = [
        dayObj.date,
        dayObj.day_of_week,
        schedule.dayType,
        JSON.stringify(dayObj.meals || {}),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(kw);
    });

    if (summaryEl) {
      summaryEl.textContent = kw
        ? `検索結果: ${filtered.length}件 / 全${daysList.length}日`
        : `登録済みの献立一覧（全${daysList.length}日分）`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;color:var(--muted);padding:1.4rem;">
            該当する献立が見つかりませんでした。
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map((dayObj) => {
        const schedule = resolveDaySchedule(dayObj.date, dayObj);
        const dt = parseIsoDate(dayObj.date);
        const m = dt.getUTCMonth() + 1;
        const d = dt.getUTCDate();
        const dow = dayObj.day_of_week || DOW_NAMES[dt.getUTCDay()];
        const meals = dayObj.meals || {};

        return `
          <tr>
            <td style="white-space:nowrap;">
              <div>
                <button type="button" class="nav-btn jump-date-btn" data-date="${escapeHtml(dayObj.date)}" style="padding:0.25rem 0.55rem;font-size:0.82rem;">
                  ${m}月${d}日（${escapeHtml(dow)}）
                </button>
              </div>
              <div style="margin-top:0.35rem;">
                <span class="day-type-badge ${schedule.isHoliday ? "holiday" : ""}" style="font-size:0.72rem;padding:0.1rem 0.45rem;">
                  ${escapeHtml(schedule.dayType)}
                </span>
              </div>
            </td>
            <td>${renderMealSummaryCell(meals.breakfast, schedule.hours.breakfast)}</td>
            <td>${renderMealSummaryCell(meals.lunch, schedule.hours.lunch)}</td>
            <td>${renderMealSummaryCell(meals.dinner, schedule.hours.dinner)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function switchTab(tabName) {
    const isDaily = tabName === "daily";
    if ($("tab-daily")) $("tab-daily").classList.toggle("active", isDaily);
    if ($("tab-monthly")) $("tab-monthly").classList.toggle("active", !isDaily);
    if ($("daily-view")) $("daily-view").classList.toggle("hidden", !isDaily);
    if ($("monthly-view")) $("monthly-view").classList.toggle("hidden", isDaily);
  }

  function selectDate(isoStr) {
    if (!isoStr) return;
    selectedDate = isoStr;
    renderDailyView();
  }

  function selectInitialDate() {
    if (daysList.length === 0) {
      selectedDate = getTodayJstIso();
      return;
    }
    const todayIso = getTodayJstIso();
    const exact = daysList.find((d) => d.date === todayIso);
    if (exact) {
      selectedDate = exact.date;
      return;
    }
    const upcoming = daysList.find((d) => d.date >= todayIso);
    selectedDate = upcoming ? upcoming.date : daysList[0].date;
  }

  async function loadMenuJson(forceReload = false) {
    const url = forceReload ? `${MENU_JSON_URL}?t=${Date.now()}` : MENU_JSON_URL;
    try {
      const resp = await fetch(url, { cache: "no-store" });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      menuData = await resp.json();
      daysList = Array.isArray(menuData.days) ? menuData.days : [];

      if (daysList.length > 0 && $("date-picker")) {
        $("date-picker").min = daysList[0].date;
        $("date-picker").max = daysList[daysList.length - 1].date;
      }

      renderHeaderAndMeta(menuData);
      if (!selectedDate || !daysList.some((d) => d.date === selectedDate)) {
        selectInitialDate();
      }
      renderDailyView();
      const searchEl = $("menu-search");
      renderMonthlyTable(searchEl ? searchEl.value : "");
    } catch (err) {
      if ($("sync-info")) {
        $("sync-info").textContent = "献立データの読み込みに失敗しました";
      }
      if ($("daily-menu-container")) {
        $("daily-menu-container").innerHTML = `
          <div class="empty-state">
            献立データ（monthly_menu.json）を読み込めませんでした。<br />
            <span class="meta">${escapeHtml(err.message)}</span>
          </div>
        `;
      }
    }
  }

  function bindEvents() {
    if ($("tab-daily")) $("tab-daily").addEventListener("click", () => switchTab("daily"));
    if ($("tab-monthly")) $("tab-monthly").addEventListener("click", () => switchTab("monthly"));
    if ($("reload-feed-btn")) $("reload-feed-btn").addEventListener("click", () => loadMenuJson(true));

    if ($("prev-day-btn")) {
      $("prev-day-btn").addEventListener("click", () => {
        const idx = daysList.findIndex((d) => d.date === selectedDate);
        if (idx > 0) {
          selectDate(daysList[idx - 1].date);
        } else if (selectedDate) {
          const prev = new Date(parseIsoDate(selectedDate).getTime() - 86400000);
          selectDate(formatIsoDate(prev));
        }
      });
    }

    if ($("next-day-btn")) {
      $("next-day-btn").addEventListener("click", () => {
        const idx = daysList.findIndex((d) => d.date === selectedDate);
        if (idx >= 0 && idx < daysList.length - 1) {
          selectDate(daysList[idx + 1].date);
        } else if (selectedDate) {
          const next = new Date(parseIsoDate(selectedDate).getTime() + 86400000);
          selectDate(formatIsoDate(next));
        }
      });
    }

    if ($("today-btn")) {
      $("today-btn").addEventListener("click", () => {
        selectInitialDate();
        renderDailyView();
      });
    }

    if ($("date-picker")) {
      $("date-picker").addEventListener("change", (e) => {
        if (e.target.value) {
          selectDate(e.target.value);
        }
      });
    }

    if ($("quick-days")) {
      $("quick-days").addEventListener("click", (e) => {
        const btn = e.target.closest(".day-chip");
        if (btn && btn.dataset && btn.dataset.date) {
          selectDate(btn.dataset.date);
        }
      });
    }

    if ($("menu-search")) {
      $("menu-search").addEventListener("input", (e) => {
        renderMonthlyTable(e.target.value);
      });
    }

    if ($("monthly-table-body")) {
      $("monthly-table-body").addEventListener("click", (e) => {
        const btn = e.target.closest(".jump-date-btn");
        if (btn && btn.dataset && btn.dataset.date) {
          selectDate(btn.dataset.date);
          switchTab("daily");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    loadMenuJson(false);
  });
})();