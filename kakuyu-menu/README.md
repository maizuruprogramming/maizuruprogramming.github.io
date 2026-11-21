# kakuyu-menu - 鶴友寮 食堂メニュー

舞鶴工業高等専門学校・鶴友寮が公開する月別献立表を、スマートフォンでも確認しやすくする非公式ビューアです。GitHub Pagesで公開する静的サイト版を中心に構成しています。

## GitHub Pages版の機能

- 今日の日付（日本時間）をもとに、朝食・昼食・夕食を自動表示
- 献立表の先頭が「A」の項目をA定食、先頭が「B」の項目をB定食として分類（共通料理はどちらにも表示）
- 週間献立カレンダー（日付を選んで当日の献立に移動）
- 料理名検索（読み込まれている日別献立データを対象）
- アレルゲン情報の確認画面（卵・乳・小麦・エビ・カニ・そば・落花生）
- 月別公式PDFの一覧・画面内表示
- PC／スマートフォン対応

## データの取得と正確性

`.github/workflows/pages.yml` が毎日10:35ごろ（日本時間／UTC 01:35）と `main` へのpush時に実行されます。

1. `scripts/update_menus.py` が鶴友寮の公式掲載ページから月別献立PDFのURLを取得します。
2. `scripts/extract_daily_menus.py` が公式PDFを取得し、日付・朝食／昼食／夕食・A／B・共通料理・栄養価を抽出します。A/Bは、献立テキストの先頭に付く「A」「B」（例：`A ごはん`、`B:パン`、`Aカレー`）を目印に分類します。
3. `site/data/daily-menus.json` を生成してGitHub Pagesに公開します。

献立PDFの表構造が変更されると抽出できない場合があります。その場合は、GitHub Actionsのログを確認し、公式PDFを直接参照してください。抽出に失敗したときは既存の日別JSONを保持します。

### アレルゲン情報について

公式PDFのアレルゲン表示は、各献立のA／Bに対する赤丸などの視覚情報です。通常のテキスト抽出では正確な判定ができないため、このプロジェクトでは自動推定しません。未確認の項目は画面上で **「未確認」** と表示し、該当する公式PDFを開けるようにしています。

PDF原本を人が確認した後、必要に応じて `site/data/allergen-overrides.json` に転記すると、次回のActions実行で「確認済み」として表示されます。空配列は「原本を確認し、その食品の赤丸表示がなかった」と確認できた場合にのみ使用してください。

記入例：

```json
{
  "2026-11-02": {
    "breakfast": {
      "a": ["egg", "milk", "wheat"],
      "b": ["egg", "milk", "wheat"]
    },
    "lunch": {
      "a": ["wheat"],
      "b": []
    }
  }
}
```

利用できるキーは `egg`（卵）、`milk`（乳）、`wheat`（小麦）、`shrimp`（エビ）、`crab`（カニ）、`buckwheat`（そば）、`peanut`（落花生）です。日付・食事区分・A/Bのすべてを原本と照合してください。

**重要：** アレルゲン表示は安全を保証するものではありません。学校公式資料には、調理時の意図しない混入（コンタミネーション）への注意、原材料を完全除去している人は食べないこと、醤油など調味料由来の小麦は表示対象外であることが記載されています。アレルギーに関する判断には、このアプリだけを使用せず、必ず学校の最新資料・学校からの案内を優先してください。

## GitHub Pagesで公開

1. `kakuyu-menu` フォルダー内のファイルをGitHubリポジトリへpushします。既定ブランチは `main` にしてください。
2. GitHubリポジトリの `Settings` → `Pages` を開きます。
3. `Build and deployment` の `Source` を **GitHub Actions** に設定します。
4. `Actions` タブで **Update menu data and deploy GitHub Pages** が完了したことを確認します。
5. `Settings` → `Pages` に表示されるURLを開きます。

リポジトリ名が `kakuyu-menu` の場合、通常の公開URLは `https://<GitHubユーザー名>.github.io/kakuyu-menu/` です。

### 手動でデータを更新する

GitHubの `Actions` → `Update menu data and deploy GitHub Pages` → `Run workflow` から手動実行できます。サイト上の「データを再読み込み」は、既に公開されているJSONを読み直す操作です。公式サイトへの再取得はGitHub Actionsで行います。

## ローカルで静的版を確認

```bash
python3 -m http.server 8000 --directory site
```

`http://localhost:8000/` を開きます。`file://` で直接開くとJSON取得が制限されることがあるため、HTTPサーバーを使用してください。

日別献立データをローカルで再生成する場合：

```bash
python -m pip install requests beautifulsoup4 pymupdf
python scripts/update_menus.py --output site/data/menus.json
python scripts/extract_daily_menus.py --menus-json site/data/menus.json --output site/data/daily-menus.json
```

## フォルダー構成

```text
kakuyu-menu/
├── .github/workflows/pages.yml
├── scripts/
│   ├── update_menus.py
│   └── extract_daily_menus.py
└── site/
    ├── index.html
    ├── data/
    │   ├── menus.json
    │   ├── daily-menus.json
    │   └── allergen-overrides.json
    └── static/
        ├── app.js
        └── styles.css
```

## 公式参照先

https://www.maizuru-ct.ac.jp/kakuyu/category/dining/
