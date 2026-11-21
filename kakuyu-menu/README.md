# 鶴友寮食事サイト — 毎週月曜 06:30 自動メニューチェック＆日別献立表示システム

鶴友寮の公式ページ（`https://www.maizuru-ct.ac.jp/kakuyu/category/dining/`）から**毎週月曜日の朝 6:30 ごろ**に自動でその月の食事メニューをチェック・反映し、**その日の献立（A定食・B定食・共通料理）**・**1ヶ月一覧**・**自動チェック結果**をWebページに表示するシステムです。

> **アレルギー対応について**  
> PDFファイルを確認してください．

## ディレクトリ構成

```text
.
├── .github/
│   └── workflows/
│       └── update-menu.yml             # GitHub Actions 毎週月曜 06:30 JST 自動実行ワークフロー (YAML)
├── config/
│   └── settings.yaml                   # 自動チェック時刻・取得元URL・食事区分・アレルギー案内設定 (YAML)
├── data/
│   └── menu.yaml                       # 1ヶ月分（30日分）の献立マスターデータ (YAML)
├── python/
│   ├── fetch_menu.py                   # その月の食事メニュー自動チェック・取得・JSON反映スクリプト (Python)
│   ├── auto_scheduler.py               # 毎週月曜日 06:30 (JST) 常駐自動スケジューラ (Python)
│   └── requirements.txt                # Python 依存パッケージ定義
├── web/
│   ├── index.html                      # 本日の献立・1ヶ月一覧・自動チェック結果・アレルギー案内画面 (HTML)
│   ├── app.js                          # 自動チェック結果描画・日付切替・A/B定食/共通料理描画 (JavaScript)
│   └── monthly_menu.json               # Web画面が読み込む1ヶ月分献立＆自動チェック結果データ (JSON)
├── csharp/
│   ├── Program.cs                      # 毎週月曜 06:30 自動監視＆指定日/1ヶ月献立表示ツール (C#)
│   └── KakuyuryoMonthlyMenu.csproj     # .NET 8 プロジェクトファイル
├── .gitignore                          # Git 除外設定
├── LICENSE                             # MIT ライセンス
└── README.md                           # プロジェクト説明書
```

## 主な機能

1. **毎週月曜日 06:30（JST）自動メニューチェック＆反映**
   * **GitHub Actions (`.github/workflows/update-menu.yml`)**: 毎週月曜日 06:30 JST（日曜 21:30 UTC）に自動起動し、その月の食事メニューをチェックして `web/monthly_menu.json` へ自動コミット・反映します。
   * **常駐スケジューラ (`python/auto_scheduler.py`)**: サーバーやPC上で常駐起動しておくと、毎週月曜 06:30 JST に自動でその月の献立チェックを実行し、`web/monthly_menu.json` を更新します。
   * **C# スケジューラ (`csharp/Program.cs`)**: `dotnet run -- --schedule` で毎週月曜 06:30 JST の自動監視・チェック実行にも対応しています。
2. **自動チェック結果のWebページ表示 (`web/index.html`, `web/app.js`)**
   * 最終自動チェック日時・次回予定日時（毎週月曜 06:30 JST）・対象月・反映結果メッセージをページ上部の結果カードに表示します。
3. **その日の献立（A定食・B定食・共通料理）＆1ヶ月一覧表示**
   * 本日の朝食・昼食・夕食それぞれの **A定食**・**B定食**・**共通料理** を表示し、1ヶ月分の日付切替や料理名検索が可能です。
4. **アレルギー対応案内**
   * ページ上に「アレルギー対応については、PDFファイルを確認してください．」を明記し、公式ページ・PDFへの導線を表示しています。

## 実行方法

### 1. Python（即時チェック / 毎週月曜 06:30 自動スケジューラ）
```bash
cd python
pip install -r requirements.txt   # 未インストールでも標準ライブラリ＋YAMLデータで動作します

# 今すぐその月のメニューをチェックして web/monthly_menu.json に反映
python fetch_menu.py

# 毎週月曜日 06:30 (JST) に自動チェックする常駐スケジューラを起動
python auto_scheduler.py
```

### 2. Web（献立サイトの表示）
```bash
cd web
python -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

### 3. C#（献立表示・自動チェック監視）
```bash
cd csharp
dotnet run                  # 本日の献立と自動チェック結果を表示
dotnet run -- 2026-11-21    # 指定日の献立を表示
dotnet run -- --all         # 1ヶ月分すべての献立を表示
dotnet run -- --check-now   # 今すぐその月のメニューをチェック・反映
dotnet run -- --schedule    # 毎週月曜 06:30 (JST) 自動チェック待機モード
```

## ライセンス
[MIT License](LICENSE)
