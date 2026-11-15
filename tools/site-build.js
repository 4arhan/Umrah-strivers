// Builds site/index.html (the product page at demo.miqah.app) from tools/site-content.js:
// a hero, an index of the feature categories, one section per category, the live demo and the updates.
//
//   node tools/site-build.js          write site/index.html and copy the icons
//   node tools/site-build.js --check  exit 1 if site/index.html is out of date (test/smoke.js runs the same check)
//
// The version number, the icons and the QR code are read from the app, so they cannot drift.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..'), SITE = path.join(ROOT, 'site');
const C = require('./site-content.js');

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const VERSION = /APP_VERSION='([^']+)'/.exec(appJs)[1];
const MARKS = (() => { const a = appJs.indexOf('var MARKS={'), b = appJs.indexOf('};', a); const c = {}; vm.createContext(c); vm.runInContext(appJs.slice(a, b + 2), c); return vm.runInContext('MARKS', c); })();
const QR = /id="qrShow"[\s\S]*?(<svg viewBox="0 0 \d+ \d+"[^>]*><path fill="#111" d="[^"]+"\/><\/svg>)/.exec(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'))[1];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ic = n => { if (!MARKS[n]) throw new Error('no mark called ' + n); return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + MARKS[n] + '</svg>'; };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = iso => { const [y, m, d] = iso.split('-').map(Number); return d + ' ' + MONTHS[m - 1] + ' ' + y; };

const used = new Set();
function shotFile(k, theme) { const f = 'shots/' + k + '-' + theme + '.webp'; used.add(f); if (!fs.existsSync(path.join(SITE, f))) throw new Error('missing screenshot ' + f + ' — run tools/site-shots.js'); return f; }
// one: the screen looks the same in both themes (focus mode, the white cards), so only one file exists
function imgs(k, alt, o) {
  o = o || {}; const at = ' alt="' + esc(alt || '') + '" width="780" height="1688" decoding="async" loading="' + (o.eager ? 'eager' : 'lazy') + '"' + (o.eager ? ' fetchpriority="high"' : '');
  if (o.one) return '<img src="' + shotFile(k, o.one === true ? 'light' : o.one) + '"' + at + '>';
  return '<img class="lt" src="' + shotFile(k, 'light') + '"' + at + '><img class="dk" src="' + shotFile(k, 'dark') + '"' + at + '>';
}
const phone = (k, alt, o) => '<div class="phone' + (o && o.cls ? ' ' + o.cls : '') + '"><span class="screen">' + imgs(k, alt, o) + '</span></div>';

function ring7() { // seven arcs for the seven rounds of tawaf; the first three are lit before any animation runs
  const r = 280, c = 300, gap = 7, span = 360 / 7; let h = '';
  for (let i = 0; i < 7; i++) {
    const a0 = (-90 + i * span + gap / 2) * Math.PI / 180, a1 = (-90 + (i + 1) * span - gap / 2) * Math.PI / 180;
    const p = a => (c + r * Math.cos(a)).toFixed(1) + ' ' + (c + r * Math.sin(a)).toFixed(1);
    h += '<path' + (i < 3 ? ' class="lit"' : '') + ' style="--i:' + i + '" d="M' + p(a0) + 'A' + r + ' ' + r + ' 0 0 1 ' + p(a1) + '"/>';
  }
  return '<svg class="ring7" viewBox="0 0 600 600" aria-hidden="true" focusable="false">' + h + '</svg>';
}

// ── features ──
const CUR = VERSION.split('.').slice(0, 2).join('.'); // the current minor line: features from it are tagged New
const tag = since => since === CUR ? '<span class="new">New</span>' : '';
const countOf = c => (c.beats || []).length + (c.cards || []).length + (c.more || []).length;
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

function story(cat) {
  const beats = cat.beats.map((b, i) => `
        <article class="beat${i ? '' : ' on'}">
          <div class="beat-phone">${phone(b.shot, b.alt, { one: b.one })}</div>
          <div class="beat-copy">
            <p class="where"><span class="kicker">${ic(b.icon)}${esc(b.where)}</span>${tag(b.since)}</p>
            <h3>${b.h3}</h3>
            <p class="t">${b.t}</p>${b.chips.length ? `
            <ul class="chips">${b.chips.map(c => '<li>' + c + '</li>').join('')}</ul>` : ''}
          </div>
        </article>`).join('');
  const stage = cat.beats.map((b, i) => `<span class="shot${i ? '' : ' on'}">${imgs(b.shot, '', { one: b.one })}</span>`).join('');
  return `
      <div class="story">
        <div class="story-stage" aria-hidden="true"><div class="stage-in"><div class="phone"><span class="screen">${stage}</span></div><div class="dots">${cat.beats.map((b, i) => '<i' + (i ? '' : ' class="on"') + '></i>').join('')}</div></div></div>
        <div class="beats">${beats}
        </div>
      </div>`;
}

// everything else in the category: small screenshots first, then one-line rows
function also(cat) {
  const peeks = cat.more.filter(m => !Array.isArray(m)), rows = cat.more.filter(m => Array.isArray(m));
  return `
      <div class="also">
        <h3 class="also-h">And ${cat.more.length} more <span>in ${esc(cat.noun.toLowerCase())}</span></h3>${peeks.length ? `
        <div class="peeks">${peeks.map(m => `
          <figure class="peek"><div class="crop">${phone(m.shot, m.alt, { one: m.one })}</div><figcaption><b>${m.b}${tag(m.since)}</b><span>${m.s}</span></figcaption></figure>`).join('')}
        </div>` : ''}${rows.length ? `
        <ul class="tiles">${rows.map(([i, b, t, since]) => `
          <li class="tile">${ic(i)}<b>${b}${tag(since)}</b><span>${t}</span></li>`).join('')}
        </ul>` : ''}
      </div>`;
}

const catHead = cat => `
      <header class="cat-head">
        <span class="cat-ico">${ic(cat.icon)}</span>
        <p class="eyebrow">${esc(cat.noun)} <span>· ${plural(countOf(cat), 'feature')}</span></p>
        <h2 class="h2">${cat.value}</h2>
        <p class="sub">${cat.sub}</p>
      </header>`;

function category(cat) {
  if (cat.kind === 'cards') return `
  <section class="cat band" id="${cat.id}">
    <div class="wrap band-in">${catHead(cat)}
      <div class="rail">${cat.cards.map(c => `
        <figure><div class="crop">${phone(c.shot, c.alt, { one: true })}</div><figcaption><b>${c.b}${tag(c.since)}</b><span>${c.s}</span></figcaption></figure>`).join('')}
      </div>${also(cat)}
    </div>
  </section>`;
  if (cat.kind === 'trust') { const P = cat.privacy; return `
  <section class="cat" id="${cat.id}">
    <div class="wrap">${catHead(cat)}
      <div class="tgrid">${cat.cards.map(c => `
        <article class="tcard"><div class="well${c.up ? ' low" style="--up:' + c.up : ''}"><div class="crop">${phone(c.shot, c.alt)}</div></div><div class="txt"><b>${c.b}${tag(c.since)}</b><p>${c.s}</p></div></article>`).join('')}
      </div>
      <p class="note">${ic('info')}<span>${cat.note}</span></p>
      <div class="priv">
        <p class="eyebrow">${esc(P.eyebrow)}</p>
        <h3 class="h3">${P.h3}</h3>
        <div class="pgrid">${P.cells.map(c => `
          <article class="pcell"><span class="ico">${ic(c.icon)}</span><h4>${c.h}</h4><p>${c.p}</p></article>`).join('')}
        </div>
        <a class="more-link" href="${C.privacy}">Read the privacy policy${ic('arrow')}</a>
      </div>${also(cat)}
    </div>
  </section>`; }
  return `
  <section class="cat" id="${cat.id}">
    <div class="wrap">${catHead(cat)}${story(cat)}${also(cat)}
    </div>
  </section>`;
}

function build() {
  const H = C.hero, D = C.demo, G = C.get, U = C.updates, K = C.categories;
  if (U[0].v !== VERSION) throw new Error('the app is ' + VERSION + ' but the newest entry in tools/site-content.js is ' + U[0].v + ' — add what changed');
  const total = K.reduce((n, c) => n + countOf(c), 0);
  const nav = K.map(c => [c.id, c.nav]).concat([['new', 'What’s new']]);
  const SHOWN = 4;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(C.title)}</title>
<meta name="description" content="${esc(C.description)}">
<link rel="canonical" href="${C.url}">
<meta name="theme-color" content="#150B27">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(C.title)}">
<meta property="og:description" content="${esc(C.description)}">
<meta property="og:url" content="${C.url}">
<meta property="og:image" content="${C.url}og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&amp;family=Scheherazade+New:wght@400;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css?v=${VERSION}">
<script>(function(d){d.classList.add('js');try{var t=localStorage.getItem('miqah-site-theme');if(t==='light'||t==='dark')d.dataset.theme=t;}catch(e){}})(document.documentElement);</script>
</head>
<body id="top">
<a class="sr" href="#features">Skip to the features</a>

<header class="nav">
  <a class="brand" href="#top"><img src="icon-192.png" alt="" width="30" height="30">Miqah</a>
  <nav class="nav-links" aria-label="Sections">${nav.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join('')}</nav>
  <button class="theme-btn" id="themeBtn" type="button" aria-label="Switch between light and dark">${ic('moon').replace('class="ic"', 'class="ic i-moon"')}${ic('sun').replace('class="ic"', 'class="ic i-sun"')}</button>
  <a class="btn lav sm" href="${C.app}">Open the app</a>
</header>
<nav class="catbar" id="catbar" aria-label="Feature categories">${K.map(c => `<a href="#${c.id}">${ic(c.icon)}${esc(c.nav)}</a>`).join('')}</nav>

<main>
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-copy">
        <p class="strap">${esc(H.strap)}</p>
        <h1>${H.h1}</h1>
        <p class="lede">${H.lede}</p>
        <div class="cta-row">
          <a class="btn lav" href="${C.app}">Open Miqah${ic('arrow')}</a>
          <a class="btn ghost" href="${C.install}">How to install</a>
        </div>
        <p class="fine"><b>Version ${VERSION}</b> · ${day(U[0].date)} · No account · No ads</p>
        <div class="talbiyah">
          <p class="ar" lang="ar" dir="rtl">${H.ar}</p>
          <p class="tr">${esc(H.tr)}</p>
        </div>
      </div>
      <div class="hero-phones">
        ${ring7()}
        ${phone(H.phones[0][0], H.phones[0][2], { one: H.phones[0][1], eager: true, cls: 'p-l' })}
        ${phone(H.phones[1][0], H.phones[1][2], { one: H.phones[1][1], eager: true, cls: 'p-c' })}
        ${phone(H.phones[2][0], H.phones[2][2], { one: H.phones[2][1], eager: true, cls: 'p-r' })}
      </div>
    </div>
  </section>

  <section class="intro" id="features">
    <div class="wrap">
      <p class="big">${C.intro}</p>
      <div class="ix-head">
        <p class="eyebrow">${esc(C.index.eyebrow)}</p>
        <h2 class="h2">${C.index.h2}</h2>
        <p class="sub">${plural(total, 'feature')} in ${plural(K.length, 'group')}. Pick the one you care about, or scroll through them all.</p>
      </div>
      <nav class="ixgrid" aria-label="Feature categories">${K.map(c => `
        <a class="ix" href="#${c.id}"><span class="ix-ico">${ic(c.icon)}</span><span class="ix-t"><b>${esc(c.nav)}</b><span class="ix-v">${c.value}</span></span><span class="ix-n">${plural(countOf(c), 'feature')}${ic('arrow')}</span><span class="ix-ph" aria-hidden="true">${phone(c.cover, '', { one: c.coverOne })}</span></a>`).join('')}
      </nav>
    </div>
  </section>
${K.map(category).join('\n')}

  <section class="band" id="${D.id}">
    <div class="wrap band-in try">
      <div>
        <p class="eyebrow">${esc(D.eyebrow)}</p>
        <h2 class="h2">${D.h2}</h2>
        <p class="sub">${D.sub}</p>
        <ol class="only-wide">${D.steps.map(s => '<li>' + s + '</li>').join('')}</ol>
        <div class="cta-row"><a class="btn ghost" href="${C.app}">Open it full-screen${ic('ext')}</a></div>
      </div>
      <div class="try-phone"><div class="phone"><span class="screen" id="demoScreen">${imgs(D.poster[0], D.poster[1])}<span class="try-start"><button class="btn lav only-wide" id="demoBtn" type="button">Start the live demo</button><a class="btn lav only-narrow" href="${C.app}">Open Miqah</a></span></span></div></div>
    </div>
  </section>

  <section class="sec" id="new">
    <div class="wrap">
      <p class="eyebrow">What’s new</p>
      <h2 class="h2">Every update, in plain words.</h2>
      <p class="sub">The page you are reading is updated with each release of the app.</p>
      <ol class="upd" id="upd">${U.map((u, i) => `
        <li class="u"${i >= SHOWN ? ' hidden' : ''}><div class="v"><span class="ver">${esc(u.v)}</span><time datetime="${u.date}">${day(u.date)}</time></div><div><h3>${u.title}</h3><ul>${u.items.map(x => '<li>' + x + '</li>').join('')}</ul></div></li>`).join('')}
      </ol>${U.length > SHOWN ? `
      <button class="btn line sm upd-more" id="updMore" type="button">Show ${U.length - SHOWN} earlier updates</button>` : ''}
    </div>
  </section>

  <section class="band" id="${G.id}">
    <div class="wrap band-in get">
      <div>
        <p class="eyebrow">${esc(G.eyebrow)}</p>
        <h2 class="h2">${G.h2}</h2>
        <p class="sub">${G.sub}</p>
        <div class="cta-row">
          <a class="btn lav" href="${C.app}">Open Miqah${ic('arrow')}</a>
          <a class="btn ghost" href="${C.install}">How to install</a>
        </div>
      </div>
      <div class="qr">${QR.replace('<svg ', '<svg role="img" aria-label="QR code for miqah.app" ')}<span>miqah.app</span></div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="wrap foot-in">
    <a class="brand" href="#top"><img src="icon-192.png" alt="" width="30" height="30" loading="lazy">Miqah</a>
    <nav aria-label="Links"><a href="${C.app}">Open the app</a><a href="${C.install}">Install</a><a href="${C.privacy}">Privacy policy</a><a href="#new">What’s new</a></nav>
    <p>Free, with no ads. Miqah is a study companion, not a fatwa service. Every screenshot on this page is the real app, version ${VERSION}, showing sample data: the names, numbers and hotels are made up.</p>
  </div>
</footer>
<script src="site.js?v=${VERSION}" defer></script>
</body>
</html>
`;
  return html;
}

const file = path.join(SITE, 'index.html');
// what the smoke test asks: is the committed page what this script would write today?
function stale() { try { return fs.readFileSync(file, 'utf8') === build() ? '' : 'site/index.html is out of date — run: node tools/site-build.js'; } catch (e) { return e.message; } }
module.exports = { build, stale };

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const why = stale(); if (why) { console.error(why); process.exit(1); }
    console.log('site/index.html is up to date (' + VERSION + ')');
  } else {
    const out = build(); fs.writeFileSync(file, out);
    for (const f of ['favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'og-image.png']) fs.copyFileSync(path.join(ROOT, 'icons', f), path.join(SITE, f));
    const stray = fs.readdirSync(path.join(SITE, 'shots')).filter(f => !used.has('shots/' + f));
    console.log('site/index.html written: ' + Math.round(out.length / 1024) + ' KB, ' + used.size + ' screenshots, app ' + VERSION);
    if (stray.length) console.log('not used by the page (safe to delete): ' + stray.join(' '));
  }
}
