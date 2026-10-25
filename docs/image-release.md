# 画像あり正式公開候補・準備結果（2026-10-25）

## 現在の方針

店舗から、13画像はメーカーがホール向けに提供した公式販促素材でWeb掲載許可ありと連絡を受けました。この店舗申告に基づき画像あり版を正式採用します。許諾書や規約原本を開発側で独立照合したものではありません。店舗で出典・許諾条件・クレジット指定等の証拠を保管してください。条件指定がある場合は公開前に反映します。

履歴書換・画像削除・クリーンルート移行は中止。既存画像とGit履歴を保持し、通常の開発ブランチで公開準備します。旧画像なし版・旧移行計画は履歴資料であり、現在の配信方針ではありません。ローカルの旧クリーン候補やバックアップは削除・pushせず保持。

## 公開する配置

`pages-site/`だけが正式な配信対象です。index.html、styles.css、app.js、machines.jsonとassets/の画像13枚を含みます。画像は通常アクセスで表示し、確認用クエリーは不要。画像失敗時は元レイアウトの代替枠を表示します。全画像は元review-assetsとバイト一致。元CSSと、画像参照以外の機種データは完全一致。台番号・レート・名称・紹介文・ガイドURLを変更していません。店舗確認中の注意文は公開承認前のため残し、権利未確認の記述だけを除去しました。

`python scripts/build_pages.py`で再生成。機種更新はsite/machines.jsonで行い再生成・テストします。以前の画像なしビルドはpages-siteには影響しません。

## 全13リンクの今回の再確認

全件HTTP 403。本文Forbidden。要求経路またはサイト側の制限を特定できないため、正常到達・正式名称・型式・シリーズ一致は全件未確認です。成功確認0件。登録URLは維持しました。`image-release-links.json`参照。

|登録名|台番号・レート|個別URL|実ページ照合|
|---|---|---|---|
|絶対衝激|157番台 プラスファイブ|[10290](https://www.p-world.co.jp/machine/database/10290)|未確認・403|
|ツインエンジェルPARTY|248番台 プラスファイブ|[9443](https://www.p-world.co.jp/machine/database/9443)|未確認・403|
|マジカルハロウィン Trick or Treat!|249番台 プラスファイブ|[9438](https://www.p-world.co.jp/machine/database/9438)|未確認・403|
|スカイガールズ ～ゼロノツバサ～|250番台 プラスファイブ|[9093](https://www.p-world.co.jp/machine/database/9093)|未確認・403|
|楽園追放|297番台 20円スロット|[9433](https://www.p-world.co.jp/machine/database/9433)|未確認・403|
|傷物語|258番台 20円スロット|[9864](https://www.p-world.co.jp/machine/database/9864)|未確認・403|
|ダンまち2|291番台 20円スロット / 279番台 プラスファイブ / 280番台 プラスファイブ|[10033](https://www.p-world.co.jp/machine/database/10033)|未確認・403|
|OVERLORD 絶対支配者光臨II|253番台 プラスファイブ|[9792](https://www.p-world.co.jp/machine/database/9792)|未確認・403|
|けものフレンズ|247番台 プラスファイブ|[9615](https://www.p-world.co.jp/machine/database/9615)|未確認・403|
|パチスロこの素晴らしい世界に祝福を！|138番台 プラスファイブ / 284番台 プラスファイブ|[9594](https://www.p-world.co.jp/machine/database/9594)|未確認・403|
|新世紀エヴァンゲリオン～シト、新生～ PREMIUM MODEL|129番台 プラスワン|[9167](https://www.p-world.co.jp/machine/database/9167)|未確認・403|
|PF戦姫絶唱シンフォギア（甘デジ）|90番台 プラスワン|[9294](https://www.p-world.co.jp/machine/database/9294)|未確認・403|
|PFアクエリオン ALL STARS LIGHTver.|89番台 プラスワン|[9210](https://www.p-world.co.jp/machine/database/9210)|未確認・403|

## 公開前の最終操作（今回は実施しない）

1. 店舗PCで元バックアップの保存・SHA-256検証を完了。過去履歴は削除せず保持。
2. P-WORLDを店舗環境で全13件開いて実機型式と照合。iPhone Safari/Android Chrome実機、NFC読取を確認。サイトの注意文を公開用に変更する場合も店舗承認を得る。
3. 対象開発ブランチのPRをレビューし、店舗が明示承認してから通常のマージでmainへ反映。force push・ブランチ削除・新規ルートへの置換は不要。
4. Publicにすると全ブランチの履歴・旧画像・旧資料も公開対象になるため、画像以外の店舗資料も含め公開範囲を店舗が最終確認。バックアップはリポジトリ外に置いてありpushしない。
5. 店舗の明示承認後に既存リポジトリをPublicへ変更。GitHub FreeでのPagesを利用するための操作だが、今回は実施しない。
6. 承認後にdeployment/pages.yml.exampleを.github/workflows/pages.ymlとしてmainに登録し、Settings → Pages → SourceをGitHub Actionsに設定。テンプレートは現在非稼働。自動pushトリガーを含まず、mainに対する手動実行だけに限定。
7. Actions画面でmainを選んでRun workflow。成果物はpages-site/だけで、HTMLと画像を同じ成果物に含む。既存のdocs/やreview-assets/、テストをPagesに配信しない。
8. 公開予定URLは `https://u1825pctstk69.github.io/rare-machine-uemine/`。未公開・未検証の予定値で、Pages画面の実URLを優先。HTTPSで13詳細・画像・リンクを再確認。
9. NFCタグ1個に公開済みHTTPSトップURLをURL/URIレコードとして書込。QR不要。iPhone/Androidで通知のタップから案内ページまで現場確認。URLと動作が確定するまでタグを永久ロックしない。

## 未実施・未確認

Public変更、mainマージ、Pages設定、配信ワークフロー設置/実行は未実施。外部P-WORLD全13件の内容照合、実機Safari/Chrome、NFC読取は未確認/未実施。外部リンク自動テストは応答を模擬してクリック先を検証するもので、実サイトの正常性を保証しません。画像の利用条件は店舗確認済みとして扱い、機種情報の疑義とは分けます。

## 今回のテスト結果

- `node --test tests/data.test.cjs tests/pages.test.cjs tests/public.test.cjs`：34件合格、失敗・スキップ0。機種登録15件、画像あり版16件、旧画像なし版3件。
- `python tests/pages_browser_test.py`：iPhone 13/Pixel 7相当のChromiumエミュレーションで両方合格。各プロファイルで3カテゴリー・13詳細・13画像・13個別URLクリック（応答模擬）・おまかせ30回・4画面幅・画像404時の代替枠・データ読込失敗時の案内を確認。JavaScript例外なし。画面幅テストも画像ロード完了後に確認。
- 初回のブラウザーテストでは旧画像なし版のデータ読込先が残って失敗、次に画像ロード待ち不足で失敗。テストの読込先と待機条件を修正して再実行し、上記が最終結果です。機種情報・デザイン・アプリ処理をテストのために変更していません。
- 実機Safari/Android Chrome・WebKit・現場NFC・公開URLでの操作は未実施。
