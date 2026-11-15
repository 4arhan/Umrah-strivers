// Regenerates the product page's screenshots (site/shots/*.webp) from the real app.
//
//   node tools/site-shots.js              every scene, light and dark
//   ONLY=home-arafah,lost node tools/site-shots.js
//   OUT=/some/dir FMT=png DSF=1 node tools/site-shots.js     quick drafts to look at
//
// Each scene seeds a sample pilgrim, pins the clock (Riyadh time) and opens one screen, so a
// re-run gives the same picture unless the app itself changed. Nothing here is a mock-up:
// the browser loads index.html from this repository.
//
// Needs playwright-core and a Chromium. NODE_PATH / CHROME point at them when they are not
// installed locally (the same variables test/smoke.js uses).
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.OUT || path.join(ROOT, 'site', 'shots');
const FMT = process.env.FMT || 'webp';
const DSF = +(process.env.DSF || 2);
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const THEMES = (process.env.THEMES || 'light,dark').split(',');
const VERSION = /APP_VERSION='([^']+)'/.exec(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'))[1];

// ── The sample pilgrims. Every name, number and hotel here is made up. ──
const HOTEL = { mk: { n: 'Dar Al Noor Hotel', a: 'Ibrahim Al Khalil Rd', p: '+966 12 000 0000', m: 'Gate 79, King Fahd', ar: 'فندق دار النور', g: 'King Abdulaziz Gate' }, md: { n: 'Taiba Garden Hotel', a: 'King Fahd Rd', p: '+966 14 000 0000', m: 'Gate 21', ar: 'فندق حديقة طيبة' }, l: 'Group leader +966 55 000 1111' };
const UM = { onboarded: true, journey: 'umrah', name: 'Bilal', dep: '2027-03-20', tripLen: 10, profile: 'm', umrahs: 1, seenVer: VERSION,
  kids: true, kidNames: ['Yusuf', 'Maryam'], kidInfo: { Maryam: { g: 'g', ar: 'مريم' } }, itin: { first: 'makkah', mad: 3 }, hotelInfo: HOTEL,
  me: { c: 'United Kingdom', lang: 'English, Urdu', med: 'Type 2 diabetes · allergic to penicillin', blood: 'O+', ph: '+44 7700 900123', home: 'Aisha +44 7700 900456' },
  meds: [{ n: 'Metformin', d: '500 mg', t: ['08:00', '20:00'] }], medsShow: true };
const HJ = Object.assign({}, UM, { journey: 'hajj', dep: '2027-05-01', tripLen: 21, hajjYear: 1448, hajjD8: '2027-05-14', hajjTypeConfirmed: true, hajjType: 'tamattu', tmode: 'nafl',
  camp: { n: '43', m: '113', l: 'Yusuf', p: '+966 55 000 1111', z: '4', st: '62', g: 'B', lm: 'Opposite the Civil Defence post', ts: '3' } });
const RAM = Object.assign({}, UM, { dep: '2027-02-20', tripLen: 14, profile: 'w', name: 'Aisha', kids: false });
const PLAN = Object.assign({}, UM, { umrahs: 0 });
const ULOG = [{ n: 1, log: { done: Date.parse('2027-03-21T10:00:00Z') } }];
const DUAS = [{ t: 'Good health and a long life for my mother and father', done: true }, { t: 'Forgiveness for me and my family', done: true }, { t: 'Guide my children and keep them firm', done: false }, { t: 'Shifa for my uncle', done: false }, { t: 'The Ummah', done: false }];
const JR = { '2027-03-21': { t: 'Saw the Kaaba for the first time after Fajr. Could not stop the tears.' }, '2027-03-22': { t: 'Tawaf on the roof at night — cooler, calmer, room to make dua.' }, '2027-03-23': { t: 'Shared dates with a family from Jakarta near the Clock Tower.' } };
// Progress a real pilgrim would have by then, set through the app's own stores.
const TICK_PLAN = "PLAN.forEach(function(s){s.items.forEach(function(it){if((it.wk||0)>=6)planChk[it.id]=true;});});save('us-plan',planChk);updPlan();chkBadges();renderHome();";
const TICK_DAILY = "var d=dailyChk[dayKey()]||{};DAILY.forEach(function(s){s.items.forEach(function(it,j){if(j<2)d[it.id]=true;});});dailyChk[dayKey()]=d;save('us-daily',dailyChk);updDaily();renderHome();";
const H9 = { h8niyyah: true, h8talb: true, h8mina: true, h8night: true, h9arrive: true, h9salah: true };

// id, settings, Riyadh time, what to open, extra storage, element to bring to the top of the screen
const SCENES = [
  ['welcome', {}, '2027-01-22T10:15:00', ""],
  // ── Home ──
  ['home-plan', PLAN, '2027-01-22T10:15:00', TICK_PLAN + "goTab('home')"],
  ['home-trip', UM, '2027-03-24T13:30:00', TICK_DAILY + "goTab('home')"],
  ['home-arafah', HJ, '2027-05-15T15:10:00', "goTab('home')", { 'us-hajj': H9 }],
  ['home-after', Object.assign({}, UM, { post: true }), '2027-04-20T13:30:00', "goTab('home')"],
  // ── Before you fly ──
  ['prepare', PLAN, '2027-01-22T10:15:00', TICK_PLAN + "goTab('plan','prep')"],
  ['itinerary', PLAN, '2027-01-22T10:15:00', "goTab('plan','prep','itinCard')", null, '#itinCard'],
  ['quiz', PLAN, '2027-01-22T10:15:00', "goTab('plan','quiz');startLevel(0)"],
  ['quiz-levels', PLAN, '2027-01-22T10:15:00', "goTab('plan','quiz','qzCard')", null, '#qzCard'],
  // ── The rites ──
  ['steps', UM, '2027-03-21T09:30:00', "goTab('umrah','steps')"],
  ['counters', Object.assign({}, UM, { tawaf: 3, wudu: true }), '2027-03-21T09:30:00', "goTab('umrah','count')"],
  ['focus-tawaf', Object.assign({}, UM, { tawaf: 3, wudu: true }), '2027-03-21T09:30:00', "goTab('umrah','count');enterFocus('tawaf')"],
  // ── The days of Hajj ──
  ['hajj-counters', Object.assign({}, HJ, { rami: { 10: { aqabah: 3 } } }), '2027-05-16T07:30:00', "goTab('umrah','count')", { 'us-hajj': Object.assign({ h9wuquf: true }, H9) }],
  ['hajj-today', HJ, '2027-05-15T14:00:00', TICK_DAILY + "goTab('daily','today')", { 'us-hajj': H9 }],
  ['jamarat', HJ, '2027-05-17T11:00:00', "goTab('umrah','count');jamSheet(11)", { 'us-hajj': Object.assign({ h9wuquf: true, h10rami: true }, H9) }],
  ['heat', HJ, '2027-05-15T11:00:00', "goTab('home');heatSheet()", { 'us-hajj': H9 }],
  // ── Every day of the trip ──
  ['today', UM, '2027-03-24T13:30:00', TICK_DAILY + "goTab('daily','today')"],
  ['stats', UM, '2027-03-24T13:30:00', TICK_DAILY + "goTab('daily','stats')"],
  ['driver', UM, '2027-03-24T13:30:00', "homeDriver()"],
  ['tools', UM, '2027-03-24T13:30:00', "goTab('daily','tools')"],
  ['dua-reader', UM, '2027-03-24T13:30:00', "goTab('daily','tools');openMyDuas()"],
  ['journal', UM, '2027-03-24T13:30:00', "goTab('daily','today');jrSheet()"],
  ['ramadan', RAM, '2027-03-03T15:30:00', "goTab('home')"],
  // ── Places ──
  ['places', UM, '2027-03-27T13:30:00', "goTab('places')"],
  ['place', UM, '2027-03-27T13:30:00', "goTab('places');openPlace('rawdah')"],
  // ── Safety and family ──
  ['lost', UM, '2027-03-24T13:30:00', "showLost()"],
  ['help', UM, '2027-03-24T13:30:00', "showHelp()"],
  ['phrase', UM, '2027-03-24T13:30:00', "showSay('say-doctor')"],
  ['child-card', UM, '2027-03-24T13:30:00', "showKidCard(1,'child')"],
  ['camp-card', HJ, '2027-05-17T11:00:00', "showCampCard()", { 'us-hajj': H9 }],
  // ── Trust ──
  ['sources', UM, '2027-03-24T13:30:00', "goTab('more','settings');sourcesSheet('bukhari')"],
  ['correction', UM, '2027-03-24T13:30:00', "goTab('plan','learn');corrSheet('learn','know3')"],
  ['whats-new', UM, '2027-03-24T13:30:00', "goTab('more','settings');whatsNewSheet()"],
];

// Screens that look the same in both themes (focus mode, the white cards made to be shown to a
// stranger): one file is enough.
const ONE = new Set(['focus-tawaf', 'dua-reader', 'lost', 'help', 'phrase', 'child-card', 'camp-card', 'driver']);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.css': 'text/css' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(r);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve(); const BASE = 'http://127.0.0.1:' + server.address().port;
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(Object.assign({}, process.env.CHROME ? { executablePath: process.env.CHROME } : {}, proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}));
  const enc = FMT === 'webp' ? await (await browser.newContext()).newPage() : null;
  const errs = []; let n = 0, bytes = 0;
  for (const theme of THEMES) for (const [id, st, now, go, extra, top] of SCENES) {
    if (ONLY && !ONLY.includes(id)) continue;
    if (theme === 'dark' && ONE.has(id)) continue;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true, timezoneId: 'Asia/Riyadh', locale: 'en-GB', serviceWorkers: 'block', colorScheme: theme });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(id + ' ' + theme + ': ' + e.message));
    await p.clock.setFixedTime(new Date(now + '+03:00'));
    await p.goto(BASE + '/manifest.json');
    await p.evaluate(([s, t, x, ul, du, jr]) => {
      localStorage.clear();
      if (!s.onboarded) return; // a first visit: nothing stored
      localStorage.setItem('us-settings', JSON.stringify(Object.assign({}, s, { theme: t }, s.journey === 'umrah' && s.name === 'Bilal' && s.umrahs ? { journal: jr } : {})));
      localStorage.setItem('us-umrahlog', JSON.stringify(ul)); localStorage.setItem('us-dualist', JSON.stringify(du));
      Object.keys(x || {}).forEach(k => localStorage.setItem(k, JSON.stringify(x[k])));
    }, [st, theme, extra, ULOG, DUAS, JR]);
    await p.goto(BASE + '/index.html'); await p.waitForTimeout(700);
    const r = await p.evaluate(async ([g, top]) => {
      try { exitFocus(); } catch (e) { }
      document.querySelectorAll('.sheet-o.on,.on.sheet').forEach(x => x.classList.remove('on'));
      let err = ''; try { (0, eval)(g); } catch (e) { err = e.message; }
      await new Promise(r => setTimeout(r, 650)); await document.fonts.ready;
      const tc = document.getElementById('toastC'); if (tc) tc.innerHTML = '';
      if (!document.querySelector('.focus.on,.sheet-o.on')) { const a = document.activeElement; if (a && a.blur) a.blur(); }
      if (top) { const e = document.querySelector(top); if (e) { window.scrollTo({ top: Math.max(0, e.getBoundingClientRect().top + scrollY - 132), behavior: 'instant' }); await new Promise(r => setTimeout(r, 450)); } else err = err || 'no element ' + top; }
      return err;
    }, [go, top || '']);
    if (r) errs.push(id + ' ' + theme + ': ' + r);
    await p.waitForTimeout(250);
    // never photograph a scroll in flight (the app's bars come out displaced): wait until it has stopped
    await p.evaluate(async () => { let y = -1; while (y !== scrollY) { y = scrollY; await new Promise(r => setTimeout(r, 160)); } });
    const png = await p.screenshot({ type: 'png' });
    const file = path.join(OUT, id + '-' + theme + '.' + FMT);
    if (enc) {
      const b64 = await enc.evaluate(async src => {
        const im = new Image(); im.src = src; await im.decode();
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
        return c.toDataURL('image/webp', 0.86).split(',')[1];
      }, 'data:image/png;base64,' + png.toString('base64'));
      fs.writeFileSync(file, Buffer.from(b64, 'base64'));
    } else fs.writeFileSync(file, png);
    bytes += fs.statSync(file).size; n++;
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(n + ' screenshots, ' + Math.round(bytes / 1024) + ' KB, app version ' + VERSION);
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors');
  if (errs.length) process.exit(1);
})();
