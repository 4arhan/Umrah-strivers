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

const { SCENES, ONE, ULOG, DUAS, JR } = require('./scenes.js')(VERSION);

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
