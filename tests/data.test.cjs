const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const machines = JSON.parse(fs.readFileSync('site/machines.json', 'utf8'));
const expected = [
 ['retro', [[157,'プラスファイブ']],10290], ['retro',[[248,'プラスファイブ']],9443],
 ['retro',[[249,'プラスファイブ']],9438], ['retro',[[250,'プラスファイブ']],9093],
 ['anime',[[297,'20円スロット']],9433], ['anime',[[258,'20円スロット']],9864],
 ['anime',[[291,'20円スロット'],[279,'プラスファイブ'],[280,'プラスファイブ']],10033],
 ['anime',[[253,'プラスファイブ']],9792], ['anime',[[247,'プラスファイブ']],9615],
 ['anime',[[138,'プラスファイブ'],[284,'プラスファイブ']],9594],
 ['pachi',[[129,'プラスワン']],9167], ['pachi',[[90,'プラスワン']],9294], ['pachi',[[89,'プラスワン']],9210]
];
test('13機種・3ジャンル・台番号の重複なし', () => {
 assert.equal(machines.length,13);
 assert.equal(new Set(machines.map(m=>m.id)).size,13);
 assert.deepEqual(['retro','anime','pachi'].map(c=>machines.filter(m=>m.cat===c).length),[4,6,3]);
 const nums=machines.flatMap(m=>m.locations.map(l=>l.num));
 assert.equal(new Set(nums).size,nums.length);
});
for(const [i, [cat,locations,guide]] of expected.entries()) test(`登録照合 ${i}: ${machines[i].name}`, () => {
 const m=machines[i]; assert.equal(m.id,i); assert.equal(m.cat,cat);
 assert.deepEqual(m.locations.map(l=>[l.num,l.rate]),locations);
 assert.equal(m.url,`https://www.p-world.co.jp/machine/database/${guide}`);
 assert.ok(m.name.trim() && m.desc.trim());
 assert.equal(m.verification.guide,'unverified');
 assert.ok(fs.existsSync(`site/${m.image}`));
});
test('このすばはパチスロ版共通ガイド、A-SLOT+対象外', () => {
 assert.equal(machines[9].name,'パチスロこの素晴らしい世界に祝福を！');
 assert.ok(!machines[9].name.includes('A-SLOT'));
 assert.ok(machines[9].locations.every(l=>!l.url));
});
