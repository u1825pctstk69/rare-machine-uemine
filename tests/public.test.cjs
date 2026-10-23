const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
test('公開成果物は4ファイルだけで画像・画像有効化コードを含まない',()=>{
 assert.deepEqual(fs.readdirSync('public-site').sort(),['app.js','index.html','machines.json','styles.css']);
 for(const f of fs.readdirSync('public-site')) {
  const text=fs.readFileSync(`public-site/${f}`,'utf8');
  assert.ok(!/review-assets|reviewImages|data:image|<img\b|\.jpg|\.png/.test(text),f);
 }
});
test('画像参照以外の機種情報を完全維持',()=>{
 const expected=JSON.parse(fs.readFileSync('site/machines.json'));
 expected.forEach(m=>delete m.image);
 assert.deepEqual(JSON.parse(fs.readFileSync('public-site/machines.json')),expected);
 assert.equal(fs.readFileSync('public-site/styles.css','utf8'),fs.readFileSync('site/styles.css','utf8'));
});
test('再生成結果が同一',()=>{
 const files=fs.readdirSync('public-site');
 const before=files.map(f=>fs.readFileSync(`public-site/${f}`,'utf8'));
 cp.execFileSync('python',['scripts/build_public.py']);
 assert.deepEqual(files.map(f=>fs.readFileSync(`public-site/${f}`,'utf8')),before);
});
