from scripts.extract_daily_menus import parse_date, parse_meal_text, parse_table_rows

PDF = "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/example.pdf"


def test_parse_date_japanese():
    assert parse_date("2026年11月21日（土）") == "2026-11-21"
    assert parse_date("日付") is None


def test_parse_meal_text_a_b_common_nutrition():
    sample = """【A】
ごはん
【B】
食パン
【共通料理】
チキンナゲット
味噌汁
牛乳
【A】 エネルギー 980kcal 蛋白質 23.5g 脂質 28.3g 食塩 2.7g
【B】 エネルギー 856kcal 蛋白質 24.5g 脂質 39.1g 食塩 4.1g"""
    parsed = parse_meal_text(sample)
    assert parsed["a"] == ["ごはん"]
    assert parsed["b"] == ["食パン"]
    assert parsed["common"] == ["チキンナゲット", "味噌汁", "牛乳"]
    assert parsed["nutrition"]["a"]["energy_kcal"] == 980
    assert parsed["nutrition"]["b"]["protein_g"] == 24.5
    assert parsed["allergen_status"] == "unverified"


def test_parse_single_line_marker():
    parsed = parse_meal_text("【A】カレーライス\n【B】豚の生姜焼き")
    assert parsed["a"] == ["カレーライス"]
    assert parsed["b"] == ["豚の生姜焼き"]


def test_parse_table_rows():
    rows = [
        ["日付", "2026年11月16日(月)", "2026年11月17日(火)"],
        ["朝食", "【A】\nごはん\n【B】\n食パン", "【A】\nごはん\n【B】\n食パン"],
        ["昼食", "【A】カレー\n【B】焼き魚", "【A】うどん\n【B】豚丼"],
        ["夕食", "ハンバーグ\nごはん", "煮魚\n味噌汁"],
    ]
    parsed = parse_table_rows(rows, PDF)
    assert set(parsed) == {"2026-11-16", "2026-11-17"}
    assert parsed["2026-11-16"]["meals"]["lunch"]["a"] == ["カレー"]
    assert parsed["2026-11-17"]["meals"]["dinner"]["common"] == ["煮魚", "味噌汁"]


def test_weekend_shared_meal_is_not_mistaken_for_a_or_b():
    parsed = parse_meal_text("麻婆丼\nブロッコリーのおかか和え\n味噌汁")
    assert parsed["a"] == []
    assert parsed["b"] == []
    assert parsed["common"] == ["麻婆丼", "ブロッコリーのおかか和え", "味噌汁"]


def test_parse_concatenated_a_b_sections():
    parsed = parse_meal_text("【A】カレー【B】焼き魚【共通料理】サラダ")
    assert parsed["a"] == ["カレー"]
    assert parsed["b"] == ["焼き魚"]
    assert parsed["common"] == ["サラダ"]


def test_coordinate_fallback_keeps_parallel_date_columns_separate():
    from types import SimpleNamespace
    from scripts.extract_daily_menus import parse_page_coordinates

    entries = [
        (30, 10, 58, 20, "2026年11月16日(月)"),
        (120, 10, 148, 20, "2026年11月17日(火)"),
        (210, 10, 238, 20, "2026年11月18日(水)"),
        (3, 30, 18, 40, "朝食"),
        (30, 34, 75, 44, "【A】ごはん"),
        (120, 34, 165, 44, "【A】パン"),
        (210, 34, 255, 44, "【A】粥"),
        (30, 45, 75, 55, "【B】食パン"),
        (120, 45, 165, 55, "【B】ごはん"),
        (210, 45, 255, 55, "【B】食パン"),
        (3, 60, 18, 70, "昼食"),
        (30, 64, 75, 74, "【A】カレー"),
        (120, 64, 165, 74, "【A】うどん"),
        (210, 64, 255, 74, "【A】丼"),
        (3, 90, 18, 100, "夕食"),
        (30, 94, 75, 104, "焼き魚"),
        (120, 94, 165, 104, "ハンバーグ"),
        (210, 94, 255, 104, "煮物"),
    ]
    spans = [
        {"text": text, "bbox": [x0, y0, x1, y1]}
        for x0, y0, x1, y1, text in entries
    ]
    page = SimpleNamespace(
        rect=SimpleNamespace(x0=0, x1=300, y1=130),
        get_text=lambda _kind: {"blocks": [{"lines": [{"spans": spans}]}]},
    )
    result = parse_page_coordinates(page, PDF)
    assert set(result) == {"2026-11-16", "2026-11-17", "2026-11-18"}
    assert result["2026-11-17"]["meals"]["lunch"]["a"] == ["うどん"]
    assert result["2026-11-18"]["meals"]["dinner"]["common"] == ["煮物"]


def test_normalizes_compatibility_kanji_in_pdf_text():
    assert parse_date("2026年11月21日（土）") == "2026-11-21"
    parsed = parse_meal_text("【共通料理】味噌汁")
    assert parsed["common"] == ["味噌汁"]
