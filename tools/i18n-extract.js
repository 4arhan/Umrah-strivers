// Collects every piece of English the app can show, in the canonical form the language engine
// (i18n.js) looks up, and writes i18n/src/units.json. The engine's own code does the reading, so a
// key here is exactly the key the app will ask for.
//
//   node tools/i18n-extract.js            crawl the app and walk data.js
//   LANG_CHECK=ar node tools/i18n-extract.js   crawl in a language and list what was left in English
//
// Three sources:
//   dom   what is actually on screen: every sample pilgrim, every tab, sheet, card, quiz question …
//   data  every string in data.js, parsed on its own (catches content the crawl did not open)
//   say   text that never reaches the page as text (toasts in app.js)
// Needs playwright-core and a Chromium (NODE_PATH / CHROME, as for test/smoke.js).
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require('playwright-core');
const ROOT = path.resolve(__dirname, '..');
const VERSION = /APP_VERSION='([^']+)'/.exec(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'))[1];
// The crawl's pilgrims carry words that appear nowhere in the app's own text. Whatever the engine then marks {U…} is the
// pilgrim's, and a lesson that mentions Bilal or Ibrahim is never mistaken for a line about the user.
const FAKE = [['Dar Al Noor Hotel', 'Qzhotel Qone'], ['Taiba Garden Hotel', 'Qzhotel Qtwo'], ['Ibrahim Al Khalil Rd', 'Qzroad Qone'], ['King Fahd Rd', 'Qzroad Qtwo'], ['King Abdulaziz Gate', 'Qzgate Qone'], ['Gate 79, King Fahd', 'Qzmeet 79 Qpoint'], ['Gate 21', 'Qzmeet 21'],
  ['Group leader +966 55 000 1111', 'Qzleader +966 55 000 1111'], ['United Kingdom', 'Qzland'], ['English, Urdu', 'Qzlang Qzlang'], ['Type 2 diabetes · allergic to penicillin', 'Qzmed note'], ['Metformin', 'Qzmedicine'], ['500 mg', 'Qzdose'],
  ['Opposite the Civil Defence post', 'Qzlandmark'], ['Bilal', 'Qzbilal'], ['Aisha', 'Qzaisha'], ['Yusuf', 'Qzyusuf'], ['Maryam', 'Qzmaryam']];
const fake = o => { let j = JSON.stringify(o); FAKE.forEach(([a, b]) => { j = j.split(a).join(b); }); return JSON.parse(j); };
const S0 = require('./scenes.js')(VERSION), S = Object.assign({}, S0);
['UM', 'HJ', 'RAM', 'PLAN', 'HOTEL'].forEach(k => { S[k] = fake(S0[k]); });
S.SCENES = S0.SCENES.map(sc => [sc[0], fake(sc[1]), sc[2], sc[3], sc[4], sc[5]]);
S.DUAS = S0.DUAS.map((d, i) => ({ t: 'Qzdua number ' + 'abcde'[i], done: d.done })); S.JR = {}; Object.keys(S0.JR).forEach((k, i) => { S.JR[k] = { t: 'Qzjournal line ' + 'abc'[i] }; });
const CHECK = process.env.LANG_CHECK || '';
const OUT = path.join(ROOT, 'i18n', 'src');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
function serve() { return new Promise(res => { const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(r); }).listen(0, '127.0.0.1', () => res(s)); }); }

// the base states the crawl explores: (settings, Riyadh time, extra storage)
const W = Object.assign({}, S.UM, { profile: 'w', name: 'Qzaisha' });
const HJW = Object.assign({}, S.HJ, { profile: 'w', name: 'Qzaisha' });
const STATES = [
  ['first', {}, '2027-01-22T10:15:00'],
  // finished the welcome, set nothing: the empty states of every tab
  ['blank-umrah', { onboarded: true, journey: 'umrah' }, '2027-01-22T10:15:00'], ['blank-hajj', { onboarded: true, journey: 'hajj' }, '2027-01-22T10:15:00'], ['blank-w', { onboarded: true, journey: 'umrah', profile: 'w' }, '2027-01-22T10:15:00'],
  ['plan-umrah', S.PLAN, '2027-01-22T10:15:00'], ['plan-umrah-w', Object.assign({}, W, { umrahs: 0 }), '2027-01-22T10:15:00'],
  ['plan-hajj', Object.assign({}, S.HJ, { umrahs: 0 }), '2027-04-10T10:15:00'], ['plan-hajj-qiran', Object.assign({}, S.HJ, { umrahs: 0, hajjType: 'qiran' }), '2027-04-10T10:15:00'], ['plan-hajj-ifrad', Object.assign({}, HJW, { umrahs: 0, hajjType: 'ifrad' }), '2027-04-10T10:15:00'],
  ['leave', S.PLAN, '2027-03-19T09:00:00'],
  ['trip-d2', Object.assign({}, S.UM, { tawaf: 3, wudu: true }), '2027-03-21T09:30:00'], ['trip-d5', S.UM, '2027-03-24T13:30:00'], ['trip-d8-w', W, '2027-03-27T13:30:00'],
  ['ramadan', S.RAM, '2027-03-03T15:30:00'], ['ramadan-suhoor', S.RAM, '2027-03-05T03:30:00'],
  ['essentials', Object.assign({}, S.UM, { essentials: true }), '2027-03-24T13:30:00'],
  ['after', Object.assign({}, S.UM, { post: true }), '2027-04-20T13:30:00'],
  ['hajj-d7', S.HJ, '2027-05-13T11:00:00', {}],
  ['hajj-d8', S.HJ, '2027-05-14T09:00:00', {}],
  ['hajj-d9', S.HJ, '2027-05-15T15:10:00', { 'us-hajj': S.H9 }],
  ['hajj-d10', Object.assign({}, S.HJ, { rami: { 10: { aqabah: 3 } } }), '2027-05-16T07:30:00', { 'us-hajj': Object.assign({ h9wuquf: true }, S.H9) }],
  ['hajj-d11', Object.assign({}, HJW, { rami: { 10: { aqabah: 7 } } }), '2027-05-17T11:00:00', { 'us-hajj': Object.assign({ h9wuquf: true, h10rami: true }, S.H9) }],
  ['hajj-d12', Object.assign({}, S.HJ, { hajjType: 'qiran', rami: { 10: { aqabah: 7 }, 11: { sughra: 7, wusta: 7, aqabah: 7 } } }), '2027-05-18T15:30:00', { 'us-hajj': Object.assign({ h9wuquf: true, h10rami: true, h11rami: true }, S.H9) }],
  ['hajj-d13', Object.assign({}, S.HJ, { hajjType: 'ifrad' }), '2027-05-19T10:00:00', { 'us-hajj': Object.assign({ h9wuquf: true, h10rami: true, h11rami: true, h12rami: true }, S.H9) }],
  ['hajj-after', Object.assign({}, S.HJ, { post: true }), '2027-06-10T13:30:00', { 'us-hajj': Object.assign({ h9wuquf: true, h10rami: true, h11rami: true, h12rami: true }, S.H9) }],
];

const DEEP = new Set(['plan-umrah', 'trip-d5', 'hajj-d9', 'hajj-d11', 'plan-hajj-ifrad']);

// run inside the page: open what this state can show, reading the text after each step.
// deep = every sheet, card, quiz question and story (state-independent, so a few states do it); otherwise the tabs and what is on them.
async function explore(deep) {
  const I = window.I18N, seen = Object.create(null), out = [];
  const grab = root => { try { I.collect(root || document.body).forEach(u => { if (!seen[u.k]) { seen[u.k] = 1; out.push(u); } }); } catch (e) { } };
  const top = () => document.querySelector('.focus.on') || document.querySelector('.sheet-o.on') || document.body;
  const nap = ms => new Promise(r => setTimeout(r, ms));
  const tryDo = async (code, wait, whole) => { try { (0, eval)(code); } catch (e) { } await nap(wait || 30); grab(whole ? document.body : top()); };
  const shut = () => { try { exitFocus(); } catch (e) { } try { closeSheet(); } catch (e) { } try { closeOnboard(); } catch (e) { } document.querySelectorAll('.sheet-o.on,.focus.on').forEach(x => x.classList.remove('on')); };
  const open = () => { document.querySelectorAll('.acc:not(.open)').forEach(a => a.classList.add('open')); document.querySelectorAll('.sec.shut').forEach(a => a.classList.remove('shut')); document.querySelectorAll('details:not([open])').forEach(d => d.open = true); };
  await nap(200); grab();
  const TABS = [['home'], ['plan', 'prep'], ['plan', 'learn'], ['plan', 'quiz'], ['umrah', 'count'], ['umrah', 'steps'], ['daily', 'today'], ['daily', 'tools'], ['daily', 'stats'], ['places'], ['more', 'guide'], ['more', 'duas'], ['more', 'settings']];
  for (const t of TABS) { try { (0, eval)("goTab(" + t.map(x => "'" + x + "'").join(',') + ")"); } catch (e) { } await nap(90); open(); }
  await nap(80); grab();
  // tap every header once so lazily built bodies exist, read, tap back
  const hs = [].slice.call(document.querySelectorAll('.acc-h,.why,.sec-h,.tc-h')).slice(0, 700);
  hs.forEach(e => { try { e.click(); } catch (x) { } }); await nap(150); grab(); hs.forEach(e => { try { e.click(); } catch (x) { } }); await nap(60);
  const day = ["showHelp()", "showLost()", "showCampDriver()", "showCampCard()", "homeDriver()", "troubleSheet()", "periodSheet()", "jamSheet(10)", "jamSheet(11)", "catchSheet()", "ramiForSheet(11)", "sosSheet()", "campSheet()", "hotelSheet()", "niySheet()", "showCheckin()", "printSheet()", "whatsNewSheet()", "showOnboard()", "showOnboard(1)", "showOnboard(2)", "showOnboard('hajj')"];
  for (const c of day) { shut(); await tryDo(c, 25); open(); grab(top()); }
  shut();
  for (const k of ['tawaf', 'sai', 'rami', 'arafah', 'tasbih', 'nafl']) { await tryDo("goTab('umrah','count');enterFocus('" + k + "')", 50); await tryDo("troubleSheet()", 25); shut(); }
  await tryDo("goTab('umrah','steps');startWalk()", 80);
  for (let i = 0; i < 70; i++) { const b = document.querySelector('.focus.on .btn'); if (!b) break; try { b.click(); } catch (e) { break; } await nap(8); grab(top()); }
  shut();
  if (!deep) { grab(); return out; }
  for (const c of ['all', 'makkah', 'madinah']) await tryDo("goTab('places');filterCity('" + c + "');tourOpen=true;renderPlaces()", 60, true);
  try { for (const p of PLACES) { try { openPlace(p.id); } catch (e) { } } await nap(120); grab(document.getElementById('view-places') || document.body); } catch (e) { }
  shut();
  const ids = (name, f) => { try { const v = (0, eval)(name); return (Array.isArray(v) ? v : Object.values(v)).map(f || (x => x.id)).filter(Boolean); } catch (e) { return []; } };
  const calls = ["troubleSheet('tawaf')", "troubleSheet('sai')", "troubleSheet('rami')", "wuduSheet()", "excusedSheet()", "myDuasSheet()", "addDuaSheet()", "sortedSheet()", "careSheet()", "readySheet()", "pasteGroupSheet()", "estUmrahSheet()", "ramSheet()", "heatSheet()", "campWaySheet()", "campPinSheet()", "goSheet()", "homePTSheet()", "medSheet(0)", "medSheet(-1)", "sourcesSheet()", "jrSheet()", "showQR()", "showSayList()", "showKids()", "showKidCard(0,'child')", "showKidCard(0,'parent')", "showKidCard(1,'child')", "openMyDuas()", "I18N.sheet()", "depLinkSheet()", "ramiEarlySheet()", "ramiOrderSheet()"];
  ids('SAY').forEach(id => calls.push("showSay('" + id + "')"));
  ids('HEAT_PACK').forEach(id => calls.push("heatSheet('" + id + "')"));
  ids('RAM_PACK').forEach(id => calls.push("ramSheet('" + id + "')"));
  ids('WAY_PACK').forEach(id => { calls.push("waySheet('" + id + "')"); calls.push("goSheet('" + id + "')"); calls.push("campWaySheet('" + id + "')"); });
  ids('HAJJ_RULINGS').forEach(id => calls.push("rulingSheet('" + id + "')"));
  ids('TROUBLE_HAJJ').forEach(id => calls.push("hajjTroubleSheet('" + id + "')"));
  ids('PLACES').forEach(id => calls.push("showPlaceDriver('" + id + "')"));
  ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah', 'quran', 'ahmad', 'malik', 'other'].forEach(k => calls.push("sourcesSheet('" + k + "')"));
  ['learn', 'step', 'dua', 'place', 'pack'].forEach(k => calls.push("corrSheet('" + k + "','x')"));
  for (const c of calls) { shut(); await tryDo(c, 20); open(); grab(top()); }
  shut();
  try { qzFreeAll(); } catch (e) { }
  const qz = () => document.getElementById('qzCard') || document.body;
  try { for (let L = 0; L < QUIZ_LEVELS.length; L++) { shut(); (0, eval)("goTab('plan','quiz')"); try { startLevel(L); } catch (e) { continue; } await nap(20); grab(qz()); for (let q = 0; q < 40; q++) { const o = qz().querySelector('.qopt, .qz-opt, .q-o, button.opt'); if (!o) break; try { o.click(); } catch (e) { } await nap(5); grab(qz()); try { qzNext(); } catch (e) { break; } await nap(5); grab(qz()); } } } catch (e) { }
  shut();
  await tryDo("goTab('plan','quiz');startKids()", 50, true);
  const kc = () => document.getElementById('kidsCard') || document.body;
  for (let i = 0; i < 12; i++) { const o = document.querySelector('#kidsArea button'); if (!o) break; try { o.click(); } catch (e) { } await nap(25); grab(kc()); }
  try { for (const st of KIDS_STORIES) { try { openStory(st.id); } catch (e) { } await nap(20); grab(kc()); } } catch (e) { }
  await tryDo("goTab('plan','learn','fcCard');startFC()", 60, true);
  const fc = () => document.getElementById('fcCard') || document.body;
  for (let i = 0; i < 60; i++) { try { fcFlip(); } catch (e) { break; } await nap(5); grab(fc()); try { fcGrade(i % 2 === 0); } catch (e) { break; } await nap(5); grab(fc()); }
  shut(); grab();
  return out;
}

// run inside the page: every string in data.js, parsed on its own; and literal toasts
function walkData(toasts) {
  const I = window.I18N, seen = Object.create(null), out = [], host = document.createElement('div');
  const NAMES = Object.getOwnPropertyNames(window).filter(n => /^[A-Z][A-Z0-9_]+$/.test(n) && !/^(CSS|URL|JSON|NaN|PERSISTENT|TEMPORARY|I18N|MARKS|ST|CITES)$/.test(n));
  const skipKey = /^(id|ar|arH|tl|ll|go|place|req|g|ci|city|i|ico|icon|emoji|q2|url|href|src|maps|key|on|j|ht|who|ck|cks|stk|img|mk|study|a)$/;
  function add(str, from, kind) { if (typeof str !== 'string' || str.length < 2) return; host.innerHTML = str; I.collect(host).forEach(u => { if (!seen[u.k]) { seen[u.k] = 1; const o = { k: u.k, h: u.h, c: from, kind: kind }; if (u.n) o.n = u.n; if (u.of) o.of = u.of; out.push(o); } }); }
  function walk(v, from, key, depth) { if (depth > 8 || v == null) return; if (typeof v === 'string') { if (!skipKey.test(key || '') || /\s/.test(v) && key !== 'ar' && key !== 'arH' && key !== 'tl' && key !== 'url' && key !== 'href') add(v, from + (key ? '.' + key : ''), 'data'); } else if (Array.isArray(v)) v.forEach(x => walk(x, from, key, depth + 1)); else if (typeof v === 'object') for (const k in v) walk(v[k], from, k, depth + 1); }
  const DATA = ['PLAN', 'DAILY', 'RITES', 'HAJJ_RITES', 'HAJJ_TYPES', 'HAJJ_PATH', 'HAJJ_RULINGS', 'DUAS', 'TB_HAJJ', 'KNOW', 'SISTERS', 'HISTORY', 'VIRTUES', 'MADINAH', 'FIQHQA', 'SCAMS', 'QUIZ_LEVELS', 'KIDSQ', 'KIDS_STORIES', 'PLACES', 'TROUBLE', 'TROUBLE_HAJJ', 'RAMI_PROB', 'WAY_PACK', 'RAM_PACK', 'HEAT_PACK', 'SAY', 'QUOTES', 'WHATS_NEW', 'BADGES', 'TOUR', 'GLABEL', 'GSHORT', 'TROUBLE_QA', 'DUA_SUG'];
  NAMES.concat(DATA).filter((n, i, a) => a.indexOf(n) === i).forEach(n => { let v; try { v = (0, eval)(n); } catch (e) { return; } if (v && typeof v === 'object' && n !== 'MARKS' && n !== 'ST' && n !== 'I18N_PACKS' && n !== 'CITES') walk(v, n, '', 0); });
  toasts.forEach(t => add(t, 'toast', 'say'));
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve(), BASE = 'http://127.0.0.1:' + server.address().port;
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(Object.assign({}, process.env.CHROME ? { executablePath: process.env.CHROME } : {}, proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}));
  const units = new Map(), errs = [], missed = new Set();
  const put = (u, kind, where) => { const e = units.get(u.k); if (e) { if (kind === 'dom' && e.kind !== 'dom') e.kind = 'dom'; if (e.where.length < 3 && e.where.indexOf(where) < 0) e.where.push(where); } else { const o = { k: u.k, h: u.h, kind: u.kind || kind, c: u.c, where: [where] }; if (u.n) o.n = u.n; if (u.of) o.of = u.of; units.set(u.k, o); } };
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const toasts = [...appSrc.matchAll(/toast\('((?:[^'\\\n]|\\.)*)'\s*[,)]/g)].map(m => m[1].replace(/\\'/g, "'").replace(/\\n/g, ' '));
  const lits = [...appSrc.matchAll(/\.(?:textContent|innerHTML|innerText|placeholder|title)\s*=\s*'((?:[^'\\\n]|\\.)*)'\s*[;,)}]/g)].map(m => m[1].replace(/\\'/g, "'").replace(/\\n/g, ' ')).filter(x => /[A-Za-z]{3}/.test(x));
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null;

  async function page(st, now, extra) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, timezoneId: 'Asia/Riyadh', locale: 'en-GB', serviceWorkers: 'block' });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
    await p.clock.setFixedTime(new Date(now + '+03:00'));
    await p.goto(BASE + '/manifest.json');
    await p.evaluate(([s, x, ul, du, jr, lang]) => {
      localStorage.clear(); localStorage.setItem('us-lang', lang || 'en');
      if (s.onboarded) { localStorage.setItem('us-settings', JSON.stringify(Object.assign({}, s, { theme: 'light' }, s.umrahs ? { journal: jr } : {}))); localStorage.setItem('us-umrahlog', JSON.stringify(ul)); localStorage.setItem('us-dualist', JSON.stringify(du)); }
      Object.keys(x || {}).forEach(k => localStorage.setItem(k, JSON.stringify(x[k])));
    }, [st, extra, S.ULOG, S.DUAS, S.JR, CHECK]);
    await p.goto(BASE + '/index.html'); await p.waitForTimeout(600);
    return { p, ctx };
  }

  for (const [id, st, now, extra] of STATES) {
    if (only && !only.includes(id)) continue;
    const { p, ctx } = await page(st, now, extra);
    let got = [];
    try { got = await p.evaluate(explore, DEEP.has(id)); } catch (e) { errs.push(id + ': ' + e.message.slice(0, 160)); }
    got.forEach(u => put(u, 'dom', id));
    if (CHECK) (await p.evaluate(() => I18N.missed())).forEach(k => missed.add(k));
    process.stdout.write(id + ' ' + got.length + ' · ');
    await ctx.close();
  }
  // the product-page scenes too (they tick lists and open particular screens)
  for (const [id, st, now, go, extra] of S.SCENES) {
    if (only) break;
    const { p, ctx } = await page(st, now, extra);
    try { const got = await p.evaluate(async g => { try { (0, eval)(g); } catch (e) { } await new Promise(r => setTimeout(r, 300)); return I18N.collect(document.body); }, go); got.forEach(u => put(u, 'dom', 'scene:' + id)); } catch (e) { }
    if (CHECK) (await p.evaluate(() => I18N.missed())).forEach(k => missed.add(k));
    await ctx.close();
  }
  if (!CHECK && !only) {
    const { p, ctx } = await page(S.UM, '2027-03-24T13:30:00');
    // lines the app puts together for a notification, which never pass through the page
    const NOTES = ['Asr in 15 min (Makkah)', 'Asr in 15 min (Madinah)', 'Jumu’ah in 45 min (Makkah)', 'Jumu’ah in 45 min (Madinah)', 'Jumu’ah — the Haram fills 1–2 hours before. Head out with wudu.', 'Head out with wudu — the Haram fills early. May it be accepted.', 'Asr in 15 minutes', 'Jumu’ah in 45 minutes', 'Medicine time'];
    (await p.evaluate(walkData, toasts.concat(lits, NOTES))).forEach(u => put(u, u.kind, u.c));
    await ctx.close();
    // the page as it is written, before the app fills it in: what shows for a moment, or in a part nothing has drawn yet
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }), p2 = await c2.newPage();
    await c2.route(/\/(app|data|cites)\.js/, r => r.fulfill({ contentType: 'text/javascript', body: '' }));
    await p2.goto(BASE + '/index.html'); await p2.waitForTimeout(400);
    (await p2.evaluate(() => I18N.collect(document.body))).forEach(u => put(u, 'dom', 'static'));
    await c2.close();
  }
  await browser.close(); server.close();
  console.log('');
  if (CHECK) {
    const list = [...missed].sort(); fs.writeFileSync(path.join(OUT, 'missed-' + CHECK + '.json'), JSON.stringify(list, null, 1));
    console.log(CHECK + ': ' + list.length + ' runs were left in English (i18n/src/missed-' + CHECK + '.json)');
  } else {
    const junk = u => /Qz[a-z]/.test(u.k) || (u.kind === 'data' && /^[a-z0-9_-]+$/.test(u.k));
    const all = [...units.values()].filter(u => !junk(u)).sort((a, b) => a.k < b.k ? -1 : 1), hs = new Map(), clash = [];
    all.forEach(u => { if (hs.has(u.h) && hs.get(u.h) !== u.k) clash.push(u.k); hs.set(u.h, u.k); });
    const chars = all.reduce((n, u) => n + u.k.length, 0), by = {}; all.forEach(u => by[u.kind] = (by[u.kind] || 0) + 1);
    if (!only) fs.writeFileSync(path.join(OUT, 'units.json'), JSON.stringify({ version: VERSION, count: all.length, chars: chars, units: all }, null, 0));
    console.log(all.length + ' units, ' + chars + ' characters', JSON.stringify(by), 'hash clashes:', clash.length);
    if (clash.length) { console.log(clash.slice(0, 5)); process.exitCode = 1; }
  }
  if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 8).join(' | '));
})();
