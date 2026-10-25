const names = {retro: '懐かしの1台', anime: 'アニメ系', pachi: 'パチンコレア台'};
const $ = id => document.getElementById(id);
const showImages = true;
let machines = [], current = 'retro', last = -1;

function show(section) {
  document.querySelectorAll('.section').forEach(el => el.classList.toggle('active', el.id === section));
  scrollTo({top: 0, behavior: 'instant'});
  const heading = document.querySelector(`#${section} h2`);
  heading.tabIndex = -1;
  heading.focus({preventScroll: true});
}
function imageFallback(img, placeholder) {
  img.hidden = true;
  placeholder.hidden = false;
}
function category(cat) {
  current = cat;
  $('categoryName').textContent = names[cat];
  $('machineList').replaceChildren();
  machines.filter(m => m.cat === cat).forEach(m => {
    const button = document.createElement('button');
    button.className = 'machine';
    const placeholder = document.createElement('span');
    placeholder.className = 'imagePlaceholder';
    placeholder.textContent = '機種案内';
    placeholder.setAttribute('aria-hidden', 'true');
    button.append(placeholder);
    if (showImages) {
      const img = document.createElement('img');
      img.alt = ''; img.src = m.image;
      img.onload = () => { placeholder.hidden = true; };
      img.onerror = () => imageFallback(img, placeholder);
      button.prepend(img);
    }
    const label = document.createElement('span');
    label.textContent = m.name;
    const small = document.createElement('small');
    small.textContent = m.locations.map(l => `${l.rate} ${l.num}番台`).join('・');
    label.append(small); button.append(label);
    button.addEventListener('click', () => detail(m.id));
    $('machineList').append(button);
  });
  show('list');
}
function detail(id) {
  const m = machines.find(x => x.id === id);
  if (!m) return;
  last = id; current = m.cat;
  $('genre').textContent = names[m.cat];
  $('name').textContent = m.name;
  $('description').textContent = m.desc;
  const img = $('photo'), placeholder = $('photoPlaceholder');
  img.removeAttribute('src'); img.hidden = true; placeholder.hidden = false;
  if (showImages) {
    img.alt = m.name;
    img.onload = () => {img.hidden = false; placeholder.hidden = true;};
    img.onerror = () => imageFallback(img, placeholder);
    img.src = m.image;
  }
  $('places').replaceChildren();
  m.locations.forEach(l => {
    const row = document.createElement('div'); row.className = 'row';
    const rate = document.createElement('span'), num = document.createElement('strong');
    rate.textContent = l.rate; num.textContent = `${l.num}番台`;
    row.append(rate, num); $('places').append(row);
  });
  const guide = $('guide');
  const valid = /^https:\/\/www\.p-world\.co\.jp\/machine\/database\/\d+$/.test(m.url);
  guide.hidden = !valid;
  if (valid) guide.href = m.url; else guide.removeAttribute('href');
  $('guideNote').textContent = valid
    ? 'P-WORLDの個別機種ページへ移動します。リンク先・型式は店舗確認中です。'
    : '個別ガイドURLを確認中です。';
  show('detail');
}
function randomAll() {
  const candidates = machines.filter(m => m.id !== last);
  if (candidates.length) detail(candidates[Math.floor(Math.random() * candidates.length)].id);
}
document.querySelectorAll('button').forEach(b => {b.disabled = true;});
try {
  const response = await fetch('./machines.json', {cache: 'no-cache'});
  if (!response.ok) throw new Error('Machine data unavailable');
  machines = await response.json();
  if (!Array.isArray(machines) || !machines.length) throw new Error('Empty machine data');
  document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => category(b.dataset.category)));
  document.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.action === 'random') randomAll();
    if (b.dataset.action === 'home') show('home');
    if (b.dataset.action === 'list') category(current);
  }));
  document.querySelectorAll('button').forEach(b => {b.disabled = false;});
} catch {
  $('loadError').hidden = false;
  $('loadError').textContent = '機種情報を読み込めませんでした。通信状況を確認して再読み込みしてください。';
}
