# 鶴友寮 食堂メニュー Viewer

> **GitHub Pagesで公開する場合は、このREADMEの「GitHub Pages で公開する場合」から設定してください。**
> 静的サイト版は `site/` にあり、GitHub Actionsが毎日06:15（日本時間）に公式献立PDFのリンクを確認して公開データを更新します。

舞鶴高専の鶴友寮「食堂関係」ページに公開されている月別献立表PDFを取得し、月別に選択・閲覧する Flask 製ウェブアプリです。

## 主な機能

- 学校公式の献立一覧から月別記事を自動取得
- 各記事から「献立表」PDFを抽出（栄養価計算書PDFは優先しない）
- 月別カード／プルダウンから選択
- PDFをページ内に表示し、別タブでも開ける
- 取得結果を30分キャッシュし、ボタンで手動更新
- 取得失敗時は確認済みの2026年9月PDFをフォールバック表示

## 動作要件

- Python 3.10 以上
- 実行サーバーから `www.maizuru-ct.ac.jp` への HTTPS アクセス

## ローカル実行

```bash
cd kakuyu-menu
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

ブラウザーで `http://127.0.0.1:8000/` を開きます。

## 本番実行（Gunicorn）

```bash
gunicorn --workers 2 --bind 127.0.0.1:8017 --timeout 60 app:app
```

Nginx のリバースプロキシ設定例は `deploy/nginx-location.example.conf`、systemd の例は `deploy/tsuruyu-menu.service.example` にあります。Nginx 設定例は `/tsuruyu-menu/` 配下で動作するよう、`X-Forwarded-Prefix` を利用しています。

## データの扱いについて

- 献立PDFの内容を複製・再編集せず、舞鶴高専公式サイト上のPDFを直接表示します。
- アレルゲンや栄養価は原本を確認してください。このアプリは医療・食物アレルギー判断用の加工を行いません。
- 献立一覧のHTML構造が学校サイト側で変更された場合、`_collect_post_links()` またはPDF抽出処理の調整が必要になることがあります。
- 取得できない場合に備え、確認済みの2026年9月PDFを予備表示します。予備表示中は画面にその旨を表示します。

## 参照元

https://www.maizuru-ct.ac.jp/kakuyu/category/dining/

## AlmaLinux / Rocky Linux VPS への配置例

以下は `/tsuruyu-menu/` で公開する場合の例です。既存のNginx `server` 設定に `deploy/nginx-location.example.conf` の内容を追加します。

```bash
sudo useradd --system --home-dir /opt/kakuyu-menu --shell /sbin/nologin tsuruyu
sudo mkdir -p /opt/kakuyu-menu
sudo cp -a . /opt/kakuyu-menu/
sudo chown -R tsuruyu:tsuruyu /opt/kakuyu-menu
sudo -u tsuruyu python3 -m venv /opt/kakuyu-menu/.venv
sudo -u tsuruyu /opt/kakuyu-menu/.venv/bin/pip install -r /opt/kakuyu-menu/requirements.txt
sudo cp /opt/kakuyu-menu/deploy/tsuruyu-menu.service.example /etc/systemd/system/tsuruyu-menu.service
sudo systemctl daemon-reload
sudo systemctl enable --now tsuruyu-menu
sudo nginx -t && sudo systemctl reload nginx
```

SELinux が有効な環境で Nginx から Gunicorn への接続が拒否される場合は、運用方針を確認したうえで次を検討します。

```bash
sudo setsebool -P httpd_can_network_connect 1
```

アプリは `127.0.0.1:8017` のみで待ち受けるため、8017番ポートを外部公開する必要はありません。

---

# GitHub Pages で公開する場合（推奨）

このリポジトリには、Flask版に加えて **GitHub Pages用の静的サイト版** を用意しています。GitHub PagesではPython/Flaskサーバーを常時実行できないため、公開時には `site/` 内のHTML・CSS・JavaScriptとJSONを配信します。

## 公開手順

1. このフォルダーの内容をGitHubのリポジトリに push します。既定ブランチは `main` にしてください。
2. GitHubで対象リポジトリを開き、`Settings` → `Pages` を選びます。
3. `Build and deployment` の `Source` を **GitHub Actions** にします。
4. `Actions` タブで **Update menu data and deploy GitHub Pages** が実行され、完了するまで待ちます。
5. `Settings` → `Pages` に表示される公開URLを開きます。

リポジトリ名が `kakuyu-menu` の場合、通常のURL形式は `https://<GitHubユーザー名>.github.io/kakuyu-menu/` です。ユーザーサイト用リポジトリ（`<GitHubユーザー名>.github.io`）の場合は `https://<GitHubユーザー名>.github.io/` になります。

## 献立一覧の自動更新

- GitHub Actionsが毎日 **日本時間06:15** に学校公式の「食堂関係」ページを確認します。
- 新しい月の献立PDFや更新版PDFが見つかれば、公開用 `menus.json` を更新して再デプロイします。
- `Actions` タブからワークフローを手動実行して、すぐに一覧を更新することもできます。
- 公式サイトが一時的に応答しない場合や取得形式が変わった場合は、既存の `site/data/menus.json` を残してデプロイします。
- 画面の「データを再読み込み」は、GitHub Pagesに既に公開されているJSONを読み直します。学校サイトの再取得を直接実行するものではありません。

## GitHub Pages版の構成

```text
.github/workflows/pages.yml  # 定期取得とPages公開
scripts/update_menus.py      # 公式ページからPDFリンクを収集
site/
  index.html                 # 表示画面
  data/menus.json            # 月別献立表データ
  static/app.js              # 月選択・PDF表示
  static/styles.css          # デザイン
```

GitHub Pages版では献立PDF自体を複製せず、学校公式サイト上のPDFを直接表示します。内容・変更・アレルゲンについては、学校公式の最新資料を必ず確認してください。

## ローカルで静的版を確認する

リポジトリのルートで次を実行します。

```bash
python3 -m http.server 8000 --directory site
```

ブラウザーで `http://localhost:8000/` を開いてください。`file://` で直接HTMLを開くとJSON取得がブラウザーに制限されることがあるため、簡易HTTPサーバーを使用してください。

Flask版をVPSで運用する場合は、従来どおり上記の「ローカル実行」「本番実行」の手順を利用できます。
