from scripts.update_menus import extract_month


def test_extract_month_prefers_pdf_filename_over_a_conflicting_post_title():
    month, label = extract_month(
        "学寮食堂献立表（令和8年10月）",
        "https://www.maizuru-ct.ac.jp/kakuyu/2026/10/27/2228/",
        "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/2026/10/menu-domitory-2026_11-2.pdf",
    )
    assert month == "2026-11"
    assert label == "2026年11月"


def test_extract_month_uses_pdf_filename_when_post_title_is_generic():
    month, label = extract_month(
        "舞鶴工業高等専門学校",
        "https://www.maizuru-ct.ac.jp/kakuyu/2026/10/27/2228/",
        "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/2026/10/menu-domitory-2026_11-2.pdf",
    )
    assert month == "2026-11"
    assert label == "2026年11月"


def test_extract_month_falls_back_to_post_month_when_pdf_filename_has_no_month():
    month, label = extract_month(
        "舞鶴工業高等専門学校",
        "https://www.maizuru-ct.ac.jp/kakuyu/2026/10/27/2228/",
        "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/2026/10/current-menu.pdf",
    )
    assert month == "2026-10"
    assert label == "2026年10月"
