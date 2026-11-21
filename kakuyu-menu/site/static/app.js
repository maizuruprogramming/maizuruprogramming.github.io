(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const els = {
    todayDate: $('#today-date-label'), todayMeals: $('#today-meals'), todayButton: $('#today-button'),
    optionButtons: [...document.querySelectorAll('.option-button')], daySourceNote: $('#day-source-note'),
    weekLabel: $('#week-label'), weekGrid: $('#week-grid'), prevWeek: $('#prev-week'), nextWeek: $('#next-week'),
    search: $('#dish-search'), clearSearch: $('#clear-search'), searchResults: $('#search-results'),
    allergenChecks: [...document.querySelectorAll('#allergen-list input[type="checkbox"]')],
    checkAllergens: $('#check-allergens'), resetAllergens: $('#reset-allergens'), allergenResults: $('#allergen-results'),
    allergenPdfLink: $('#allergen-pdf-link'), monthSelect: $('#month-select'), menuGrid: $('#menu-grid'),
    status: $('#status-message'), refresh: $('#refresh-button'), viewerTitle: $('#viewer-title'),
    viewerSubtitle: $('#viewer-subtitle'), pdfWrap: $('#pdf-wrap'), openPdf: $('#open-pdf')
  };

  const MEALS = [
    { key: 'breakfast', label: '朝食', icon: '🌅', theme: 'breakfast' },
    { key: 'lunch', label: '昼食', icon: '☀️', theme: 'lunch' },
    { key: 'dinner', label: '夕食', icon: '🌙', theme: 'dinner' }
  ];
  const ALLERGENS = {
    egg: '卵', milk: '乳', wheat: '小麦', shrimp: 'エビ', crab: 'カニ',
    buckwheat: 'そば', peanut: '落花生'
  };

  let monthlyMenus = [];
  let dayMap = new Map();
  let selectedDate = tokyoToday();
  let selectedOption = 'a';
  let selectedMonth = '';
  let weekOffset = 0;
  let currentDayPdf = '';

  function tokyoToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function parseDate(iso) {
    const [year, month, day] = String(iso).split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  function toIso(date) {
    return [date.getUTCFullYear(), String(date.getUTCMonth() + 1).padStart(2, '0'), String(date.getUTCDate()).padStart(2, '0')].join('-');
  }

  function addDays(iso, count) {
    const date = parseDate(iso);
    date.setUTCDate(date.getUTCDate() + count);
    return toIso(date);
  }

  function mondayOf(iso) {
    const date = parseDate(iso);
    const day = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - day);
    return toIso(date);
  }

  function dateLabel(iso, includeYear = false) {
    const date = parseDate(iso);
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'UTC', month: 'long', day: 'numeric', weekday: 'short', ...(includeYear ? { year: 'numeric' } : {})
    }).format(date);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function textItems(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === 'string') return value.split(/[\n\r、]/).map((item) => item.trim()).filter(Boolean);
    return [];
  }

  function mealFor(date, key) {
    const day = dayMap.get(date);
    return day && day.meals ? day.meals[key] || null : null;
  }

  function optionName(option = selectedOption) { return option === 'b' ? 'B定食' : 'A定食'; }

  function selectedDishItems(meal, option = selectedOption) {
    if (!meal) return [];
    const optionItems = textItems(meal[option]);
    const common = textItems(meal.common);
    // Some weekend meals are presented as a single shared menu without A/B labels.
    if (!optionItems.length && !textItems(meal.a).length && !textItems(meal.b).length) return common;
    return [...optionItems, ...common];
  }

  function formatNutrition(nutrition) {
    if (!nutrition || typeof nutrition !== 'object') return '';
    const labels = [
      ['energy_kcal', 'kcal'], ['protein_g', 'g'], ['fat_g', 'g'], ['salt_g', 'g']
    ];
    return labels.filter(([key]) => nutrition[key] !== undefined && nutrition[key] !== null && nutrition[key] !== '')
      .map(([key, unit]) => `${escapeHtml(nutrition[key])}${unit}`).join(' ・ ');
  }

  function getSourceForDate(date) {
    const exact = dayMap.get(date);
    if (exact && exact.pdf_url) return exact.pdf_url;
    const month = date.slice(0, 7);
    return monthlyMenus.find((item) => item.month === month)?.pdf_url || '';
  }

  function renderMealCard(date, mealMeta) {
    const meal = mealFor(date, mealMeta.key);
    const pdfUrl = (meal && meal.pdf_url) || getSourceForDate(date);
    const items = selectedDishItems(meal);
    const optionItems = meal ? textItems(meal[selectedOption]) : [];
    const hasSeparateOptions = meal && (textItems(meal.a).length > 0 || textItems(meal.b).length > 0);
    const nutrition = meal && meal.nutrition ? meal.nutrition[selectedOption] : null;
    const list = items.length
      ? `<ul class="dish-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : `<p class="unknown-menu">${meal ? (hasSeparateOptions ? `${optionName()}の献立は掲載されていません。` : '献立内容を取得できませんでした。') : 'この日の献立データはまだ読み込まれていません。'} ${pdfUrl ? '公式PDFで確認できます。' : ''}</p>`;
    const optionDisplay = hasSeparateOptions ? `<span class="dish-option">${optionName()}</span>` : '<span class="dish-option shared">共通メニュー</span>';
    const allergenHtml = renderMealAllergens(meal, selectedOption, pdfUrl);
    return `
      <article class="meal-card ${mealMeta.theme}">
        <div class="meal-card-head"><div><span class="meal-icon">${mealMeta.icon}</span><h3>${mealMeta.label}</h3></div>${optionDisplay}</div>
        ${list}
        ${nutrition ? `<p class="nutrition-line">栄養価：${formatNutrition(nutrition)}</p>` : ''}
        ${allergenHtml}
        ${pdfUrl ? `<a class="meal-pdf-link" href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">公式PDFで詳細を確認 ↗</a>` : ''}
      </article>`;
  }

  function renderMealAllergens(meal, option, pdfUrl) {
    const status = meal?.allergen_status || 'unverified';
    const allergens = meal?.allergens?.[option];
    if (status === 'verified' && Array.isArray(allergens)) {
      const names = allergens.map((key) => ALLERGENS[key] || key);
      return `<div class="meal-allergens"><strong>アレルゲン表示（原本確認済み）</strong><p>${names.length ? names.map(escapeHtml).join('・') : '該当表示なし'}</p><small>表示内容は公式PDFの赤丸表示の転記です。安全を保証するものではありません。</small></div>`;
    }
    return `<div class="meal-allergens is-unknown"><strong>アレルゲン表示：未確認</strong><p>公式PDFの該当日の赤丸表示を確認してください。</p>${pdfUrl ? `<a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">アレルゲン表示をPDFで確認 ↗</a>` : ''}</div>`;
  }

  function renderToday() {
    els.todayDate.textContent = dateLabel(selectedDate, true);
    $('#today-title').textContent = selectedDate === tokyoToday() ? '今日の献立' : '選択した日の献立';
    const day = dayMap.get(selectedDate);
    currentDayPdf = getSourceForDate(selectedDate);
    els.todayMeals.innerHTML = MEALS.map((meta) => renderMealCard(selectedDate, meta)).join('');
    if (day && day.pdf_url) {
      els.daySourceNote.textContent = day.source_updated ? `献立データの取得日：${day.source_updated}` : '日別献立データは公式PDFから抽出したものです。';
    } else if (currentDayPdf) {
      els.daySourceNote.innerHTML = `日別データがまだありません。<a href="${escapeHtml(currentDayPdf)}" target="_blank" rel="noopener noreferrer">この月の公式献立表PDFを確認 ↗</a>`;
    } else {
      els.daySourceNote.textContent = 'この日付に対応する献立表は見つかりません。月別PDFをご確認ください。';
    }
    els.allergenPdfLink.href = currentDayPdf || 'https://www.maizuru-ct.ac.jp/kakuyu/category/dining/';
    renderWeek();
  }

  function renderOptionButtons() {
    els.optionButtons.forEach((button) => {
      const active = button.dataset.option === selectedOption;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderWeek() {
    // Keep the selected day visible when the user navigates to another week.
    const weekStart = addDays(mondayOf(selectedDate), weekOffset * 7);
    const end = addDays(weekStart, 6);
    els.weekLabel.textContent = `${dateLabel(weekStart)} ～ ${dateLabel(end)}`;
    const today = tokyoToday();
    els.weekGrid.innerHTML = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const day = dayMap.get(date);
      const weekday = parseDate(date).getUTCDay();
      const hasData = Boolean(day && day.meals && Object.keys(day.meals).length);
      const selected = date === selectedDate;
      const lunch = day?.meals?.lunch;
      const previewItems = lunch ? [...textItems(lunch[selectedOption]), ...textItems(lunch.common)] : [];
      const preview = previewItems[0] || '';
      return `<button type="button" class="calendar-day ${selected ? 'is-selected' : ''} ${date === today ? 'is-today' : ''} ${hasData ? 'has-menu' : ''}" data-date="${date}" aria-pressed="${selected}">
        <span class="calendar-weekday ${weekday === 0 ? 'sunday' : weekday === 6 ? 'saturday' : ''}">${['日','月','火','水','木','金','土'][weekday]}</span>
        <strong>${Number(date.slice(-2))}</strong><span class="calendar-status">${hasData ? '献立あり' : 'PDF'}</span>
        ${preview ? `<span class="calendar-preview">${escapeHtml(preview)}</span>` : ''}
      </button>`;
    }).join('');
    els.weekGrid.querySelectorAll('.calendar-day').forEach((button) => {
      button.addEventListener('click', () => {
        selectedDate = button.dataset.date;
        weekOffset = 0;
        renderToday();
      });
    });
  }

  function renderSearch() {
    const query = els.search.value.trim().toLocaleLowerCase('ja');
    els.clearSearch.hidden = !query;
    if (!query) {
      els.searchResults.innerHTML = '<p class="muted">料理名を入力すると検索結果が表示されます。</p>';
      return;
    }
    const results = [];
    for (const [date, day] of dayMap.entries()) {
      for (const meta of MEALS) {
        const meal = day.meals?.[meta.key];
        if (!meal) continue;
        for (const option of ['a', 'b']) {
          const items = [...textItems(meal[option]), ...textItems(meal.common)];
          const matched = items.filter((item) => item.toLocaleLowerCase('ja').includes(query));
          matched.forEach((dish) => results.push({ date, meal: meta, option, dish }));
        }
      }
    }
    results.sort((a, b) => a.date.localeCompare(b.date) || MEALS.findIndex((m) => m.key === a.meal.key) - MEALS.findIndex((m) => m.key === b.meal.key));
    if (!results.length) {
      els.searchResults.innerHTML = '<p class="muted">該当する料理は見つかりませんでした。まだ読み込まれていない月の献立は検索対象外です。</p>';
      return;
    }
    els.searchResults.innerHTML = `<p class="result-count">${results.length}件見つかりました</p><div class="result-list">${results.map((item) => `
      <button type="button" class="search-result" data-date="${item.date}" data-option="${item.option}">
        <span class="result-date">${escapeHtml(dateLabel(item.date, true))} ・ ${item.meal.label}</span>
        <strong>${escapeHtml(item.dish)}</strong><span class="result-option">${item.option.toUpperCase()}定食</span>
      </button>`).join('')}</div>`;
    els.searchResults.querySelectorAll('.search-result').forEach((button) => {
      button.addEventListener('click', () => {
        selectedDate = button.dataset.date;
        selectedOption = button.dataset.option;
        weekOffset = 0;
        renderOptionButtons();
        renderToday();
        window.scrollTo({ top: $('.today-section').offsetTop - 12, behavior: 'smooth' });
      });
    });
  }

  function renderAllergenResults() {
    const selected = els.allergenChecks.filter((input) => input.checked).map((input) => input.value);
    if (!selected.length) {
      els.allergenResults.innerHTML = '<p class="muted">確認したい食品を1つ以上選択してください。</p>';
      return;
    }
    if (dayMap.size === 0) {
      els.allergenResults.innerHTML = '<p>アレルゲン表示を照合できる日別データがまだありません。必ず学校公式の献立表PDFを開き、赤丸表示を確認してください。</p>';
      return;
    }
    const results = [];
    let unknown = 0;
    for (const [date, day] of dayMap.entries()) {
      for (const meta of MEALS) {
        const meal = day.meals?.[meta.key];
        if (!meal) continue;
        for (const option of ['a', 'b']) {
          if (meal.allergen_status !== 'verified' || !Array.isArray(meal.allergens?.[option])) {
            unknown += 1;
            continue;
          }
          const found = meal.allergens[option].filter((key) => selected.includes(key));
          if (found.length) results.push({ date, meta, option, found });
        }
      }
    }
    const names = selected.map((key) => ALLERGENS[key]).join('・');
    const matches = results.length
      ? `<div class="allergen-match-list">${results.map((item) => `<div class="allergen-match"><strong>${escapeHtml(dateLabel(item.date, true))} ・ ${item.meta.label} ・ ${item.option.toUpperCase()}定食</strong><span>${item.found.map((key) => escapeHtml(ALLERGENS[key])).join('・')}</span></div>`).join('')}</div>`
      : '<p>登録済みの確認データには該当表示がありませんでした。</p>';
    els.allergenResults.innerHTML = `<div class="allergen-summary"><strong>選択中：${escapeHtml(names)}</strong><p>${results.length}件で該当表示あり。確認データ未登録の食事は ${unknown} 件あります。</p></div>${matches}<p class="allergen-caution-inline">未登録・未確認の食事は判定に含まれていません。「該当なし」は安全の保証ではありません。必ず原本PDFを確認してください。</p>`;
  }

  function monthText(menu) { return menu.month_label || menu.month || '掲載月不明'; }

  function renderArchiveCards() {
    if (!monthlyMenus.length) {
      els.menuGrid.innerHTML = '<div class="empty-card">現在、表示できる献立表がありません。学校公式ページをご確認ください。</div>';
      return;
    }
    els.menuGrid.innerHTML = monthlyMenus.map((menu) => {
      const active = menu.month === selectedMonth;
      return `<button class="menu-card" type="button" data-month="${escapeHtml(menu.month)}" aria-pressed="${active}"><span class="card-month">${escapeHtml(monthText(menu))}</span><span class="card-title">${escapeHtml(menu.title || '学寮食堂献立表')}</span></button>`;
    }).join('');
    els.menuGrid.querySelectorAll('.menu-card').forEach((button) => button.addEventListener('click', () => selectArchive(button.dataset.month)));
  }

  function selectArchive(month) {
    const menu = monthlyMenus.find((item) => item.month === month);
    if (!menu) return;
    selectedMonth = month;
    renderArchiveCards();
    els.monthSelect.value = month;
    els.viewerTitle.textContent = `${monthText(menu)}の献立表`;
    els.viewerSubtitle.textContent = [menu.published ? `掲載日：${menu.published}` : '', '舞鶴高専公式PDF'].filter(Boolean).join(' ・ ');
    els.openPdf.href = menu.pdf_url;
    els.openPdf.hidden = false;
    els.pdfWrap.innerHTML = `<iframe src="${escapeHtml(menu.pdf_url)}#view=FitH" title="${escapeHtml(monthText(menu))} 学寮食堂献立表 PDF" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }

  function renderArchiveOptions() {
    els.monthSelect.innerHTML = monthlyMenus.map((menu) => `<option value="${escapeHtml(menu.month)}">${escapeHtml(monthText(menu))}</option>`).join('');
    els.monthSelect.disabled = monthlyMenus.length === 0;
  }

  function formatUpdatedAt(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  async function fetchJson(path) {
    const url = new URL(path, document.baseURI);
    url.searchParams.set('t', String(Date.now()));
    const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.json();
  }

  async function loadData() {
    els.refresh.disabled = true;
    els.refresh.textContent = '読み込み中…';
    els.status.classList.remove('error');
    els.status.textContent = '献立データを読み込んでいます。';
    try {
      const [monthly, daily] = await Promise.all([
        fetchJson('./data/menus.json'), fetchJson('./data/daily-menus.json').catch(() => ({ days: [] }))
      ]);
      monthlyMenus = Array.isArray(monthly.menus) ? monthly.menus : [];
      dayMap = new Map((Array.isArray(daily.days) ? daily.days : []).filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date)).map((day) => [day.date, day]));
      renderArchiveOptions();
      if (monthlyMenus.length) {
        const initial = monthlyMenus.find((menu) => menu.month === selectedMonth) || monthlyMenus[0];
        selectArchive(initial.month);
      } else {
        renderArchiveCards();
      }
      renderToday();
      renderSearch();
      const updated = formatUpdatedAt(daily.updated_at || monthly.updated_at);
      const extracted = daily.days?.length || 0;
      els.status.textContent = `${monthly.message || '献立表を読み込みました。'} 日別データ：${extracted}日分${updated ? ` ／ 更新：${updated}` : ''}`;
      if (!extracted) els.status.textContent += '（日別データは次回のGitHub Actions実行後に表示されます）';
    } catch (error) {
      console.error(error);
      els.status.textContent = '献立データを読み込めませんでした。ページを再読み込みするか、学校公式ページをご確認ください。';
      els.status.classList.add('error');
      if (!monthlyMenus.length) renderArchiveCards();
      renderToday();
    } finally {
      els.refresh.disabled = false;
      els.refresh.textContent = '↻ データを再読み込み';
    }
  }

  els.optionButtons.forEach((button) => button.addEventListener('click', () => {
    selectedOption = button.dataset.option;
    renderOptionButtons();
    renderToday();
  }));
  els.todayButton.addEventListener('click', () => { selectedDate = tokyoToday(); weekOffset = 0; renderToday(); });
  els.prevWeek.addEventListener('click', () => { weekOffset -= 1; renderWeek(); });
  els.nextWeek.addEventListener('click', () => { weekOffset += 1; renderWeek(); });
  els.search.addEventListener('input', renderSearch);
  els.clearSearch.addEventListener('click', () => { els.search.value = ''; renderSearch(); els.search.focus(); });
  els.checkAllergens.addEventListener('click', renderAllergenResults);
  els.resetAllergens.addEventListener('click', () => { els.allergenChecks.forEach((input) => { input.checked = false; }); renderAllergenResults(); });
  els.monthSelect.addEventListener('change', () => selectArchive(els.monthSelect.value));
  els.refresh.addEventListener('click', loadData);

  renderOptionButtons();
  loadData();
})();
