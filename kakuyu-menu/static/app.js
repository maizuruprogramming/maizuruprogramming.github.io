(() => {
  const monthSelect = document.getElementById('month-select');
  const menuGrid = document.getElementById('menu-grid');
  const statusMessage = document.getElementById('status-message');
  const refreshButton = document.getElementById('refresh-button');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerSubtitle = document.getElementById('viewer-subtitle');
  const pdfWrap = document.getElementById('pdf-wrap');
  const openPdf = document.getElementById('open-pdf');

  let menus = [];
  let selectedMonth = '';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function monthText(menu) {
    return menu.month_label || menu.month || '掲載月不明';
  }

  function renderCards() {
    if (!menus.length) {
      menuGrid.innerHTML = '<div class="empty-card">現在、表示できる献立表がありません。学校公式ページをご確認ください。</div>';
      return;
    }

    menuGrid.innerHTML = menus.map((menu) => {
      const isSelected = menu.month === selectedMonth;
      return `
        <button class="menu-card" type="button" data-month="${escapeHtml(menu.month)}" aria-pressed="${isSelected}">
          <span class="card-top">
            <span class="card-month">${escapeHtml(monthText(menu))}</span>
            <span class="card-chip">${isSelected ? '表示中' : '献立表を見る'}</span>
          </span>
          <span class="card-title">${escapeHtml(menu.title || '学寮食堂献立表')}</span>
        </button>`;
    }).join('');

    menuGrid.querySelectorAll('.menu-card').forEach((button) => {
      button.addEventListener('click', () => selectMenu(button.dataset.month));
    });
  }

  function renderViewer(menu) {
    if (!menu) return;
    viewerTitle.textContent = monthText(menu) + 'の献立表';
    viewerSubtitle.textContent = [menu.published ? `掲載日：${menu.published}` : '', '学校公式PDF'].filter(Boolean).join(' ・ ');
    openPdf.href = menu.pdf_url;
    openPdf.hidden = false;
    pdfWrap.innerHTML = `
      <iframe
        src="${escapeHtml(menu.pdf_url)}#view=FitH"
        title="${escapeHtml(monthText(menu))} 学寮食堂献立表 PDF"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin">
      </iframe>`;
  }

  function selectMenu(month) {
    const menu = menus.find((item) => item.month === month) || menus[0];
    if (!menu) return;
    selectedMonth = menu.month;
    monthSelect.value = menu.month;
    renderCards();
    renderViewer(menu);
  }

  function renderMonthOptions() {
    monthSelect.innerHTML = menus.map((menu) =>
      `<option value="${escapeHtml(menu.month)}">${escapeHtml(monthText(menu))}</option>`
    ).join('');
    monthSelect.disabled = menus.length === 0;
  }

  async function loadMenus(forceRefresh = false) {
    refreshButton.disabled = true;
    refreshButton.innerHTML = '<span aria-hidden="true">↻</span> 取得中…';
    statusMessage.classList.remove('error');
    statusMessage.textContent = '学校公式ページから献立表を取得しています。';
    if (!menus.length) {
      menuGrid.innerHTML = '<div class="loading-card"><span class="loader"></span> 献立表を読み込んでいます…</div>';
    }

    try {
      const base = window.APP_BASE || '';
      const response = await fetch(`${base}/api/menus${forceRefresh ? '?refresh=1' : ''}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      menus = Array.isArray(data.menus) ? data.menus : [];

      renderMonthOptions();
      if (menus.length) {
        const preferred = menus.find((menu) => menu.month === selectedMonth) || menus[0];
        selectMenu(preferred.month);
      } else {
        renderCards();
        viewerTitle.textContent = '献立表';
        viewerSubtitle.textContent = '表示できる献立表がありません。';
        openPdf.hidden = true;
        pdfWrap.innerHTML = '<div class="pdf-placeholder"><p>学校公式ページから献立表を取得できませんでした。</p></div>';
      }

      statusMessage.textContent = data.message || '献立表を取得しました。';
      if (data.status !== 'ok') statusMessage.classList.add('error');
    } catch (error) {
      console.error(error);
      statusMessage.textContent = '献立一覧を取得できませんでした。学校公式ページをご確認ください。';
      statusMessage.classList.add('error');
      if (!menus.length) {
        menuGrid.innerHTML = '<div class="empty-card">読み込みに失敗しました。画面右上の「最新情報を取得」から再試行できます。</div>';
      }
    } finally {
      refreshButton.disabled = false;
      refreshButton.innerHTML = '<span aria-hidden="true">↻</span> 最新情報を取得';
    }
  }

  monthSelect.addEventListener('change', () => selectMenu(monthSelect.value));
  refreshButton.addEventListener('click', () => loadMenus(true));
  loadMenus(false);
})();
