# 鶴友寮 食事サイト（本番公開版）— 毎週月曜 06:30 自動メニューチェック＆日別献立表示

鶴友寮の公式ページ（`https://www.maizuru-ct.ac.jp/kakuyu/` / `https://www.maizuru-ct.ac.jp/kakuyu/category/dining/`）から**毎週月曜日の朝 6:30 ごろ（JST）**に自動でその月の食事メニューPDFを取得・解析し、**本日の献立（A定食・B定食・共通料理）**・**1ヶ月一覧**・**自動チェック結果**をWebページに表示するシステムです。

> **アレルギー対応について**  
> PDFファイルを確認してください．

## ディレクトリ構成

```text
.
├── .github/
│   └── workflows/
│       └── update-menu.yml             # GitHub Actions 毎週月曜 06:30 JST 自動取得・公開ワークフロー
├── config/
│   └── settings.yaml                   # 自動チェック時刻・取得元URL・食事区分・アレルギー案内設定
├── data/
│   └── menu.yaml                       # 献立データ（仮データ削除済み・実データ格納用）
├── python/
│   ├── fetch_menu.py                   # 公式ページ・献立表PDFから直接取得・解析しJSON/YAMLへ反映
│   ├── auto_scheduler.py               # 毎週月曜日 06:30 (JST) 常駐自動スケジューラ
│   └── requirements.txt                # Python 依存パッケージ定義 (pypdf, pyyaml)
├── web/
│   ├── index.html                      # 本番公開用Web画面（本日の献立・1ヶ月一覧・自動チェック結果・PDFリンク）
│   ├── app.js                          # 自動チェック結果描画・日付切替・A/B定食/共通料理描画
│   └── monthly_menu.json               # Web画面が読み込む実データJSON（仮データ削除済み）
├── csharp/
│   ├── Program.cs                      # 毎週月曜 06:30 自動監視＆日別/1ヶ月献立表示ツール (C#)
│   └── KakuyuryoMonthlyMenu.csproj     # .NET 8 プロジェクトファイル
├── .gitignore
├── LICENSE
└── README.md
```

## 本番公開手順（GitHub Pages + GitHub Actions）

1. このリポジトリ一式を GitHub リポジトリ（`main` ブランチ）にプッシュします。
2. GitHub リポジトリの **Settings > Pages** を開き、Source を **Deploy from a branch**（`main` ブランチ / `/web` フォルダ）に設定して公開します。
3. **Actions** タブから **Weekly Monday 06:30 JST Auto Menu Check** を有効化（または **Run workflow** で初回手動実行）すると、公式サイトの最新献立表PDFから全日程の献立が自動抽出され、`web/monthly_menu.json` と `data/menu.yaml` に反映されて公開サイトへ自動デプロイされます。
4. 以降は**毎週月曜日の朝 6:30 ごろ（JST）**に自動実行され、その月の最新献立が自動的にチェック・更新されます。

## ローカル環境での実行方法

### 1. 公式PDFから最新メニューを直接取得・反映（Python）
```bash
cd python
pip install -r requirements.txt
python fetch_menu.py

# 毎週月曜日 06:30 (JST) に自動チェックする常駐スケジューラを起動する場合
python auto_scheduler.py
```

### 2. Webサイトのローカル確認
```bash
cd web
python -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

### 3. C# CLI ツールでの確認・自動監視
```bash
cd csharp
dotnet run                  # 本日の献立と自動チェック結果を表示
dotnet run -- 2026-11-21    # 指定日の献立を表示
dotnet run -- --all         # 取得済み全日程の献立を表示
dotnet run -- --check-now   # 公式サイト接続確認・ステータス更新
dotnet run -- --schedule    # 毎週月曜 06:30 (JST) 自動チェック待機モード
```

## ライセンス
[MIT License](LICENSE)
