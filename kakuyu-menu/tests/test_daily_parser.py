import json

from scripts.extract_daily_menus import (
    apply_allergen_overrides,
    parse_date,
    parse_meal_text,
    parse_table_rows,
)

PDF = "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/example.pdf"


def test_parse_date_japanese():
    assert parse_date("2026年11月21日（土）") == "2026-11-21"
    assert parse_date("日付") is None


def test_each_item_is_classified_by_its_own_leading_character():
    parsed = parse_meal_text(
        "A ごはん\n"
        "味噌汁\n"
        "B: 食パン\n"
        "牛乳\n"
        "サラダ"
    )
    assert parsed["a"] == ["ごはん"]
    assert parsed["b"] == ["食パン"]
    assert parsed["common"] == ["味噌汁", "牛乳", "サラダ"]


def test_a_b_prefix_without_separator_and_same_line():
    parsed = parse_meal_text("Aカレーライス B焼き魚\n小鉢")
    assert parsed["a"] == ["カレーライス"]
    assert parsed["b"] == ["焼き魚"]
    assert parsed["common"] == ["小鉢"]


def test_fullwidth_a_b_prefixes_are_normalized():
    parsed = parse_meal_text("Ａ　ごはん\nＢ：パン\n味噌汁")
    assert parsed["a"] == ["ごはん"]
    assert parsed["b"] == ["パン"]
    assert parsed["common"] == ["味噌汁"]


def test_explicit_inline_markers_and_common_marker():
    parsed = parse_meal_text("【A】カレーライス\n【B】豚の生姜焼き\n【共通料理】サラダ")
    assert parsed["a"] == ["カレーライス"]
    assert parsed["b"] == ["豚の生姜焼き"]
    assert parsed["common"] == ["サラダ"]


def test_detached_marker_does_not_leak_to_the_next_unlabelled_line():
    parsed = parse_meal_text("【A】\nごはん\n【B】\n食パン\n味噌汁")
    # A/B is only recognized when attached to an item. Unlabelled rows stay common.
    assert parsed["a"] == []
    assert parsed["b"] == []
    assert parsed["common"] == ["ごはん", "食パン", "味噌汁"]


def test_leading_a_or_b_is_the_classifier_even_without_punctuation():
    parsed = parse_meal_text("Apple pie\nBread")
    assert parsed["a"] == ["pple pie"]
    assert parsed["b"] == ["read"]
    assert parsed["common"] == []


def test_parse_nutrition_with_a_b_prefixes_and_common_nutrition():
    parsed = parse_meal_text(
        "A ごはん\n"
        "A エネルギー 980kcal 蛋白質 23.5g 脂質 28.3g 食塩 2.7g\n"
        "B 食パン\n"
        "B エネルギー 856kcal 蛋白質 24.5g 脂質 39.1g 食塩 4.1g\n"
        "エネルギー 900kcal"
    )
    assert parsed["a"] == ["ごはん"]
    assert parsed["b"] == ["食パン"]
    assert parsed["nutrition"]["a"]["energy_kcal"] == 980
    assert parsed["nutrition"]["b"]["energy_kcal"] == 856
    assert parsed["nutrition"]["common"]["energy_kcal"] == 900
    assert parsed["allergen_status"] == "unverified"


def test_parse_table_rows():
    rows = [
        ["日付", "2026年11月16日(月)", "2026年11月17日(火)"],
        ["朝食", "A ごはん\n味噌汁\nB 食パン\n牛乳", "A ごはん\nB 食パン\n味噌汁"],
        ["昼食", "Aカレー\nB焼き魚\nサラダ", "Aうどん\nB豚丼\n小鉢"],
        ["夕食", "ハンバーグ\nごはん", "煮魚\n味噌汁"],
    ]
    parsed = parse_table_rows(rows, PDF)
    assert set(parsed) == {"2026-11-16", "2026-11-17"}
    assert parsed["2026-11-16"]["meals"]["breakfast"]["a"] == ["ごはん"]
    assert parsed["2026-11-16"]["meals"]["breakfast"]["b"] == ["食パン"]
    assert parsed["2026-11-16"]["meals"]["breakfast"]["common"] == ["味噌汁", "牛乳"]
    assert parsed["2026-11-17"]["meals"]["dinner"]["common"] == ["煮魚", "味噌汁"]


def test_weekend_shared_meal_is_common():
    parsed = parse_meal_text("麻婆丼\nブロッコリーのおかか和え\n味噌汁")
    assert parsed["a"] == []
    assert parsed["b"] == []
    assert parsed["common"] == ["麻婆丼", "ブロッコリーのおかか和え", "味噌汁"]


def test_parse_concatenated_a_b_sections():
    parsed = parse_meal_text("【A】カレー【B】焼き魚【共通料理】サラダ")
    assert parsed["a"] == ["カレー"]
    assert parsed["b"] == ["焼き魚"]
    assert parsed["common"] == ["サラダ"]


def test_allergens_start_unverified_and_null():
    parsed = parse_meal_text("A ごはん\nB 食パン\n味噌汁")
    assert parsed["allergen_status"] == "unverified"
    assert parsed["allergens"] == {"a": None, "b": None}


def test_allergen_override_marks_only_manually_verified_meals(tmp_path):
    days = {
        "2026-11-16": {
            "date": "2026-11-16",
            "meals": {
                "lunch": parse_meal_text("A カレー\nB 焼き魚\nサラダ"),
                "dinner": parse_meal_text("A ハンバーグ\nB 煮魚"),
            },
        }
    }
    override_file = tmp_path / "allergen-overrides.json"
    override_file.write_text(json.dumps({
        "2026-11-16": {
            "lunch": {"a": ["egg", "wheat"], "b": []}
        }
    }), encoding="utf-8")

    apply_allergen_overrides(days, override_file)
    lunch = days["2026-11-16"]["meals"]["lunch"]
    dinner = days["2026-11-16"]["meals"]["dinner"]
    assert lunch["allergen_status"] == "verified"
    assert lunch["allergens"] == {"a": ["egg", "wheat"], "b": []}
    assert dinner["allergen_status"] == "unverified"
    assert dinner["allergens"] == {"a": None, "b": None}


def test_invalid_allergen_override_does_not_mark_verified(tmp_path):
    days = {
        "2026-11-16": {
            "date": "2026-11-16",
            "meals": {"lunch": parse_meal_text("A カレー\nB 焼き魚")},
        }
    }
    override_file = tmp_path / "allergen-overrides.json"
    override_file.write_text(json.dumps({
        "2026-11-16": {"lunch": {"a": ["egg"], "b": ["unknown"]}}
    }), encoding="utf-8")
    apply_allergen_overrides(days, override_file)
    meal = days["2026-11-16"]["meals"]["lunch"]
    assert meal["allergen_status"] == "unverified"
    assert meal["allergens"] == {"a": None, "b": None}


def test_coordinate_fallback_keeps_parallel_date_columns_separate():
    from types import SimpleNamespace
    from scripts.extract_daily_menus import parse_page_coordinates

    entries = [
        (30, 10, 58, 20, "2026年11月16日(月)"),
        (120, 10, 148, 20, "2026年11月17日(火)"),
        (210, 10, 238, 20, "2026年11月18日(水)"),
        (3, 30, 18, 40, "朝食"),
        (30, 34, 75, 44, "Aごはん"),
        (120, 34, 165, 44, "Aパン"),
        (210, 34, 255, 44, "A粥"),
        (30, 45, 75, 55, "B食パン"),
        (120, 45, 165, 55, "Bごはん"),
        (210, 45, 255, 55, "B食パン"),
        (3, 60, 18, 70, "昼食"),
        (30, 64, 75, 74, "Aカレー"),
        (120, 64, 165, 74, "Aうどん"),
        (210, 64, 255, 74, "A丼"),
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
    assert result["2026-11-17"]["meals"]["breakfast"]["a"] == ["パン"]
    assert result["2026-11-18"]["meals"]["dinner"]["common"] == ["煮物"]


def test_normalizes_compatibility_kanji_in_pdf_text():
    assert parse_date("2026年11月21日（土）") == "2026-11-21"
    parsed = parse_meal_text("【共通料理】味噌汁")
    assert parsed["common"] == ["味噌汁"]


def test_menu_names_with_parenthetical_and_partial_looking_edges_are_preserved():
    """Do not trim, rewrite, or infer continuations from menu-name fragments."""
    parsed = parse_meal_text(
        "A (クリーム)\n"
        "B チーズin\n"
        "A のり塩コロッ\n"
        "B (北海道)\n"
        "A 豚の\n"
        "B カスタード\n"
        "味噌汁"
    )
    assert parsed["a"] == ["(クリーム)", "のり塩コロッ", "豚の"]
    assert parsed["b"] == ["チーズin", "(北海道)", "カスタード"]
    assert parsed["common"] == ["味噌汁"]


def test_parenthetical_notes_at_both_ends_of_full_dish_names_are_preserved():
    parsed = parse_meal_text(
        "A チーズinハンバーグ（クリーム）\n"
        "B （北海道）豚の生姜焼き\n"
        "カスタードプリン"
    )
    assert parsed["a"] == ["チーズinハンバーグ(クリーム)"]
    assert parsed["b"] == ["(北海道)豚の生姜焼き"]
    assert parsed["common"] == ["カスタードプリン"]
