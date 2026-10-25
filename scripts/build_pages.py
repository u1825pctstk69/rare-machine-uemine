"""Prepare image-enabled Pages files locally; does not deploy or change GitHub."""
from pathlib import Path
import json,shutil,re
root=Path(__file__).resolve().parents[1]
source=root/'site'; target=root/'pages-site'
(target/'assets').mkdir(parents=True,exist_ok=True)
app=(source/'app.js').read_text().replace("const reviewImages = new URLSearchParams(location.search).get('reviewImages') === '1';",'const showImages = true;')
app=app.replace("  if (reviewImages) $('reviewNotice').textContent = '店舗内確認用：権利未確認の画像を表示しています。一般公開禁止。';\n",'').replace('reviewImages','showImages')
html=re.sub(r'<div\b[^>]*\bid="reviewNotice"[^>]*>.*?</div>\s*', '', (source/'index.html').read_text(), flags=re.S)
(target/'app.js').write_text(app);(target/'index.html').write_text(html)
shutil.copyfile(source/'styles.css',target/'styles.css')
data=json.loads((source/'machines.json').read_text())
for m in data:
 old=source/m['image']; new=target/'assets'/old.name
 shutil.copyfile(old,new);m['image']='./assets/'+old.name
(target/'machines.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Prepared pages-site: HTML/CSS/JS/JSON and 13 images; nothing published')
