import json
from pathlib import Path

from scripts.extract_daily_menus import apply_daily_overrides, build_daily_payload


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OVERRIDE_FILE = PROJECT_ROOT / "site/data/daily-menu-overrides.json"


def load_expected_day():
    payload = json.loads(OVERRIDE_FILE.read_text(encoding="utf-8"))
    return payload["days"][0]


def test_manual_november_18_data_overrides_incorrect_pdf_parse_and_keeps_dinner():
    # This reproduces the bad data observed in the deployed daily-menus.json.
    generated = {
        "2026-11-18": {
            "date": "2026-11-18",
            "month": "2026-11",
            "meals": {
                "breakfast": {
                    "a": ["豚の 生姜炒め丼"], "b": [],
                    "common": ["納豆", "茄子の そぼろあん", "コーンサラダ", "味噌汁", "ジョア"],
                },
                "lunch": {
                    "a": ["ジャンボ チキンカツ"],
                    "b": ["白身魚の チーズ焼き", "ごはん", "ポトフ"],
                    "common": ["さっぱり水餃子", "プリン", "わかめスープ"],
                },
                "dinner": {"a": [], "b": [], "common": ["高野豆腐煮"]},
            },
        }
    }

    apply_daily_overrides(generated, OVERRIDE_FILE)

    day = generated["2026-11-18"]
    breakfast = day["meals"]["breakfast"]
    lunch = day["meals"]["lunch"]
    assert breakfast["a"] == ["ごはん"]
    assert breakfast["b"] == ["ロールパン"]
    assert breakfast["common"] == ["納豆", "茄子のそぼろあん", "コーンサラダ", "味噌汁", "ジョア"]
    assert lunch["a"] == ["豚の生姜炒め丼"]
    assert lunch["b"] == ["白身魚のチーズ焼き", "ごはん"]
    assert lunch["common"] == ["さっぱり水餃子", "プリン", "わかめスープ"]
    # Dinner was not part of the user-confirmed correction, so keep PDF output.
    assert day["meals"]["dinner"]["common"] == ["高野豆腐煮"]
    assert breakfast["source_method"] == "manual_override"
    assert lunch["source_method"] == "manual_override"


def test_build_payload_emits_curated_day_even_when_pdf_list_is_empty(tmp_path):
    menus_file = tmp_path / "menus.json"
    menus_file.write_text(json.dumps({"menus": []}), encoding="utf-8")
    allergen_file = tmp_path / "allergens.json"
    allergen_file.write_text("{}", encoding="utf-8")

    payload = build_daily_payload(
        menus_file,
        allergen_file,
        limit=18,
        daily_override_path=OVERRIDE_FILE,
    )

    assert payload["status"] == "partial"
    assert len(payload["days"]) == 1
    day = payload["days"][0]
    assert day["date"] == "2026-11-18"
    assert day["meals"]["breakfast"]["a"] == ["ごはん"]
    assert day["meals"]["breakfast"]["b"] == ["ロールパン"]
    assert day["meals"]["lunch"]["a"] == ["豚の生姜炒め丼"]
    assert day["meals"]["lunch"]["b"] == ["白身魚のチーズ焼き", "ごはん"]


def test_override_contains_only_confirmed_breakfast_and_lunch():
    day = load_expected_day()
    assert set(day["meals"]) == {"breakfast", "lunch"}
    assert day["source_method"] == "user_transcription"


def test_github_pages_workflow_passes_daily_override_file():
    workflow = (PROJECT_ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
    assert "--daily-overrides site/data/daily-menu-overrides.json" in workflow
