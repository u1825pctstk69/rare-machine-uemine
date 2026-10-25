# 現在の正式公開候補：画像あり版

店舗確認により13画像のWeb掲載許可ありとして、`pages-site/`を正式な配信対象に採用しました。承認済みの配色・機種情報・台番号・レートを維持しています。旧履歴整理は中止し、既存Git履歴を保持します。以下に残る画像なし版の説明は過去の開発記録です。

- 再生成：`python scripts/build_pages.py`
- 登録・画像テスト：`node --test tests/data.test.cjs tests/pages.test.cjs tests/public.test.cjs`
- スマホ相当のブラウザーテスト：`python tests/pages_browser_test.py`
- 公開候補のローカル確認：`python -m http.server 8000 --bind 127.0.0.1 --directory pages-site`
- 最新の確認結果と公開手順：[docs/image-release.md](docs/image-release.md)
- 配信設定の非稼働テンプレート：`deployment/pages.yml.example`

**Public変更・mainマージ・Pages公開はまだ承認待ちです。テンプレートを稼働させないでください。**

---

# コトブキプラス上峰店 レア台発見！

NFCタグ1個から13機種の案内へ進む静的サイトです。提供された「レア台発見！」HTMLのデザイン・操作を維持しています。**開発・店舗確認段階。一般公開の承認はありません。** リポジトリの可視性・Pages設定は変更しません。

## ローカル確認

依存ライブラリ・ビルド・DBは不要です。リポジトリルートで：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

ブラウザーで `http://127.0.0.1:8000/site/` を開きます（HTMLを直接ダブルクリックせずHTTPで確認）。画像なしが標準です。権利未確認画像を店舗内で確認する場合のみ `?reviewImages=1` を付けます。このモードと `review-assets/` は公開しないでください。

```sh
node --test tests/data.test.cjs
python tests/browser_test.py
```

データテストはNode.js標準機能のみ。ブラウザーテストはPython Playwrightと `/usr/bin/chromium` がある開発環境用です。上記サーバーが必要です。アプリ自体はこれらに依存しません。

## ファイル

- `site/index.html`：承認済みHTMLを基にした画面
- `site/styles.css`：既存配色・レイアウトとスマホ/フォーカス対応
- `site/app.js`：カテゴリー・詳細・直前の機種を除外するおまかせ選択
- `site/machines.json`：13機種の名称・紹介・台番号・レート・個別URL
- `review-assets/`：元HTMLの画像13枚。権利未確認・公開対象外
- `tests/`：登録情報・ブラウザー操作の検証
- `docs/verification.md`：全13機種の確認結果・疑義・リンク一覧
- `docs/operations.md`：更新・公開前確認・NFC設定・稼働検証

## 更新

`site/machines.json`だけで機種情報を変更できます。`id`は重複しない値、`cat`は `retro` / `anime` / `pachi`、`locations`に台番号とレートを登録します。`url`はP-WORLDの正しい個別ページを登録します。`5円`は「プラスファイブ」、`1円`は「プラスワン」で表記してください。複数設置は同一機種の`locations`に追加し、共通のガイドを使用します。

追加・撤去後は13機種固定の要件とテスト期待値も見直してください。台番号変更時は`tests/data.test.cjs`の期待値も店舗資料に基づき更新します。画像URLだけで許諾済みと判定しないでください。`verification`は確認状況の記録です。

公開用ディレクトリは `site/` だけです。GitHub Pagesのブランチ配信は通常ルートか`docs/`を選ぶため、この構成では**承認後に `site/`のみをアップロードするPages Actions構成**を別途設定します。自動公開ワークフローは現在含めていません。

## 独立した画像なし配信用候補

`public-site/` を追加しました。元デザインのCSSと機種情報を維持し、画像参照と確認画像を有効にするコードまで除去した独立版です。再生成は `python scripts/build_public.py`。今後の配信対象は **public-site/だけ**です（上記site/配信の説明よりこの指示を優先）。一般公開は未承認です。

```sh
node --test tests/data.test.cjs tests/public.test.cjs
python tests/public_browser_test.py
```

後者はサーバーを自動起動して終了時に停止します。ChromiumでiPhone/Android相当のエミュレーションを実施し、実機Safari/Chromeや実際のP-WORLD到達を保証しません。Git履歴にある画像の扱い、全機種照合、予定URL・NFC手順は `docs/final-review.md` を参照してください。リポジトリ全体のPublic変更は禁止のままです。
