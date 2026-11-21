"""毎週月曜日の朝 6:30 (JST) ごろに自動でその月の食事メニューをチェック・反映するスケジューラ."""

from __future__ import annotations

import argparse
import time
from datetime import datetime

from fetch_menu import JST, get_next_monday_0630_jst, run_monthly_menu_check


def run_scheduler_loop(run_immediately: bool = False) -> None:
    print("=== 鶴友寮 食事メニュー自動チェック・スケジューラ起動 ===")
    print("スケジュール: 毎週月曜日 06:30 (JST)")

    if run_immediately:
        print("[INFO] 起動時初回チェックを実行します...")
        run_monthly_menu_check(trigger="scheduled_monday_0630_initial")

    while True:
        now_jst = datetime.now(JST)
        next_run = get_next_monday_0630_jst(now_jst)
        wait_seconds = max(1.0, (next_run - now_jst).total_seconds())
        print(
            f"[WAIT] 現在時刻: {now_jst.strftime('%Y-%m-%d %H:%M:%S JST')} / "
            f"次回自動チェック予定: {next_run.strftime('%Y-%m-%d %H:%M:%S JST')} "
            f"(残り約 {wait_seconds / 3600:.2f} 時間)"
        )

        # 長時間スリープ時の時刻ズレを防ぐため最大60秒刻みで待機
        while True:
            current = datetime.now(JST)
            remaining = (next_run - current).total_seconds()
            if remaining <= 0:
                break
            time.sleep(min(remaining, 60.0))

        print(f"[RUN] 毎週月曜 06:30 自動チェックを開始します: {datetime.now(JST).strftime('%Y-%m-%d %H:%M:%S JST')}")
        run_monthly_menu_check(trigger="scheduled_monday_0630")
        # 同一分内での二重実行防止
        time.sleep(2.0)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="毎週月曜日 06:30 (JST) にその月の食事メニューを自動チェック・反映します。"
    )
    parser.add_argument(
        "--run-now",
        action="store_true",
        help="起動直後に1回チェックを実行してから毎週月曜 06:30 の待機に入ります。",
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="待機せず1回だけチェック・反映を実行して終了します。",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="次回実行予定の月曜 06:30 (JST) を表示して終了します。",
    )
    args = parser.parse_args()

    if args.dry_run:
        now_jst = datetime.now(JST)
        next_run = get_next_monday_0630_jst(now_jst)
        print(f"現在時刻 (JST): {now_jst.strftime('%Y-%m-%d %H:%M:%S JST')}")
        print(f"次回自動チェック予定: {next_run.strftime('%Y-%m-%d %H:%M:%S JST')}")
        return

    if args.once:
        run_monthly_menu_check(trigger="scheduled_monday_0630")
        return

    run_scheduler_loop(run_immediately=args.run_now)


if __name__ == "__main__":
    main()
