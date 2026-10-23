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
