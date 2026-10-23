"""Build only the image-free, standalone deployment tree. Never publishes."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
source=root/'site'
target=root/'public-site'
target.mkdir(exist_ok=True)
app=(source/'app.js').read_text()
app=app.replace("const reviewImages = new URLSearchParams(location.search).get('reviewImages') === '1';\n",'')
a=app.index('function imageFallback('); b=app.index('function category(',a);app=app[:a]+app[b:]
a=app.index('    if (reviewImages) {');b=app.index('    const label',a);app=app[:a]+app[b:]
a=app.index("  const img = $('photo')");b=app.index("  $('places').replaceChildren();",a);app=app[:a]+app[b:]
app=app.replace("  if (reviewImages) $('reviewNotice').textContent = '店舗内確認用：権利未確認の画像を表示しています。一般公開禁止。';\n",'')
html=(source/'index.html').read_text().replace('<img class="detailPhoto" id="photo" alt="" hidden>\n','')
for filename,content in [('index.html',html),('app.js',app),('styles.css',(source/'styles.css').read_text())]:
 (target/filename).write_text(content)
data=json.loads((source/'machines.json').read_text())
for m in data:m.pop('image',None)
(target/'machines.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Built public-site/: 4 files, no machine images or image activation mode')
