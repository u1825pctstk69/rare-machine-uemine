"""Image-free release tests. Chromium device emulation, not physical Safari/Chrome."""
import json,threading,functools
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'public-site')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
machines=json.loads((root/'public-site/machines.json').read_text())
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for device in ['iPhone 13','Pixel 7']:
   config=dict(p.devices[device]);config.pop('default_browser_type',None)
   context=browser.new_context(**config)
   errors=[];requests=[]
   context.on('page',lambda page:page.on('pageerror',lambda e:errors.append(str(e))))
   context.on('request',lambda r:requests.append(r.url))
   # Intercept external navigation: verifies click target, not remote page content.
   context.route('https://www.p-world.co.jp/**',lambda route:route.fulfill(status=200,body='<title>Navigation test only</title>'))
   page=context.new_page();page.goto(base+'?reviewImages=1')
   page.wait_for_function("!document.querySelector('[data-category]').disabled")
   for cat in ['retro','anime','pachi']:
    page.locator(f'[data-category="{cat}"]').click()
    subset=[m for m in machines if m['cat']==cat]
    assert page.locator('#machineList button').count()==len(subset)
    for i,m in enumerate(subset):
     page.locator('#machineList button').nth(i).click()
     assert page.locator('#name').inner_text()==m['name']
     assert page.locator('#places .row').count()==len(m['locations'])
     for l in m['locations']:
      assert f"{l['num']}番台" in page.locator('#places').inner_text()
      assert l['rate'] in page.locator('#places').inner_text()
     with page.expect_popup() as popup:
      page.locator('#guide').click()
     external=popup.value;external.wait_for_load_state()
     assert external.url==m['url'];external.close()
     page.locator('[data-action="list"]').click()
    page.locator('#list [data-action="home"]').click()
   page.locator('#home [data-action="random"]').click()
   for _ in range(30):
    before=page.locator('#name').inner_text()
    page.locator('#detail [data-action="random"]').click()
    assert before!=page.locator('#name').inner_text()
   for width in [320,375,390,768]:
    page.set_viewport_size({'width':width,'height':844})
    for m in machines:
     page.locator('#detail [data-action="home"]').click()
     page.locator(f'[data-category="{m["cat"]}"]').click()
     page.locator('#machineList button').filter(has_text=m['name']).click()
     assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(device,width,m['id'])
   assert page.locator('img').count()==0
   assert not any('review-assets' in r or r.startswith('data:image') for r in requests)
   assert not errors,errors
   page.set_viewport_size({'width':390,'height':844})
   (root/'test-results').mkdir(exist_ok=True)
   page.screenshot(path=str(root/f'test-results/public-{device.replace(" ","-")}.png'),full_page=True)
   page.route('**/machines.json',lambda r:r.fulfill(status=500,body='error'))
   page.reload();page.locator('#loadError').wait_for(state='visible')
   assert page.locator('#home button:disabled').count()==4
   context.close()
   print(f'PASS {device} / Chromium emulation: 13 details & external click targets (mocked), 3 categories, 30 random, 4 widths, no images, load failure')
  browser.close()
finally:
 server.shutdown();server.server_close()
