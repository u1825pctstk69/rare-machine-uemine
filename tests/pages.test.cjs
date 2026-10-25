const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const source=JSON.parse(fs.readFileSync('site/machines.json'));
const release=JSON.parse(fs.readFileSync('pages-site/machines.json'));
test('画像参照以外の13機種情報とCSSを維持',()=>{
 assert.equal(release.length,13);
 const withoutImage=ms=>ms.map(({image,...rest})=>rest);
 assert.deepEqual(withoutImage(release),withoutImage(source));
 assert.equal(fs.readFileSync('pages-site/styles.css','utf8'),fs.readFileSync('site/styles.css','utf8'));
});
for(const m of release)test(`機種${m.id}：画像は元データと一致・公開ディレクトリ内`,()=>{
 assert.equal(m.image,`./assets/${m.id}.jpg`);
 assert.deepEqual(fs.readFileSync(`pages-site/${m.image}`),fs.readFileSync(`site/${source.find(s=>s.id===m.id).image}`));
});
test('画像は通常表示・外部確認画像パスなし・成果物を限定',()=>{
 assert.deepEqual(fs.readdirSync('pages-site').sort(),['app.js','assets','index.html','machines.json','styles.css']);
 assert.equal(fs.readdirSync('pages-site/assets').length,13);
 for(const f of ['app.js','index.html','machines.json'])assert.ok(!/review-assets|reviewImages|権利未確認/.test(fs.readFileSync(`pages-site/${f}`,'utf8')));
 assert.match(fs.readFileSync('pages-site/app.js','utf8'),/const showImages = true/);
});
test('再生成結果が同一',()=>{
 const files=['app.js','index.html','styles.css','machines.json',...fs.readdirSync('pages-site/assets').map(f=>'assets/'+f)];
 const before=files.map(f=>fs.readFileSync(`pages-site/${f}`));
 cp.execFileSync('python',['scripts/build_pages.py']);
 files.forEach((f,i)=>assert.deepEqual(fs.readFileSync(`pages-site/${f}`),before[i]));
});
