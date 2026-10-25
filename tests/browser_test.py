"""Run with Python Playwright and system Chromium; server must serve repository root on :8000."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
machines=json.loads(Path('site/machines.json').read_text())
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':375,'height':812},is_mobile=True,has_touch=True)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 requests=[]
 page.on('request',lambda r:requests.append(r.url))
 page.goto('http://127.0.0.1:8000/site/')
 page.wait_for_function("!document.querySelector('[data-category]').disabled")
 for cat in ['retro','anime','pachi']:
  page.locator(f'[data-category="{cat}"]').click()
  subset=[m for m in machines if m['cat']==cat]
  assert page.locator('#machineList button').count()==len(subset)
  for i,m in enumerate(subset):
   page.locator('#machineList button').nth(i).click()
   assert page.locator('#name').inner_text()==m['name']
   assert page.locator('#guide').get_attribute('href')==m['url']
   assert page.locator('#guide').get_attribute('rel')=='noopener noreferrer'
   for l in m['locations']:
    assert f"{l['num']}番台" in page.locator('#places').inner_text()
    assert l['rate'] in page.locator('#places').inner_text()
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
   page.locator('[data-action="list"]').click()
  page.locator('#list [data-action="home"]').click()
 assert not any('review-assets' in r for r in requests),'default mode must not load restricted images'
 page.locator('#home [data-action="random"]').click()
 for _ in range(30):
  before=page.locator('#name').inner_text()
  page.locator('#detail [data-action="random"]').click()
  assert before!=page.locator('#name').inner_text()
 for width in [320,375,390,768]:
  page.set_viewport_size({'width':width,'height':812})
  for m in machines:
   page.locator('#detail [data-action="home"]').click()
   page.locator(f'[data-category="{m["cat"]}"]').click()
   page.locator('#machineList button').filter(has_text=m['name']).click()
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(width,m['name'])
 page.goto('http://127.0.0.1:8000/site/?reviewImages=1')
 page.wait_for_function("!document.querySelector('[data-category]').disabled")
 for cat in ['retro','anime','pachi']:
  page.locator(f'[data-category="{cat}"]').click()
  for i,m in enumerate([m for m in machines if m['cat']==cat]):
   page.locator('#machineList button').nth(i).click()
   page.wait_for_function("!document.querySelector('#photo').hidden && document.querySelector('#photo').naturalWidth > 0")
   page.locator('[data-action="list"]').click()
  page.locator('#list [data-action="home"]').click()
 Path('test-results').mkdir(exist_ok=True)
 page.screenshot(path='test-results/mobile-home.png',full_page=True)
 assert not errors,errors
 page.route('**/machines.json',lambda route:route.fulfill(status=500,body='error'))
 page.reload()
 page.locator('#loadError').wait_for(state='visible')
 assert page.locator('#home button:disabled').count()==4
 browser.close()
print('PASS: 13 details, categories, 30 non-repeating random selections, 4 widths, 13 review images, no default image requests, data failure handling; no JavaScript errors')
