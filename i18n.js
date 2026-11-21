/* Miqah — languages (6.11). Loaded before data.js and app.js.

   The app is written in English. In any other language this file translates what is on the screen:
   each run of text is reduced to a canonical form, looked up in that language's pack
   (i18n/<code>.js) and replaced. A run with no entry stays in English. Nothing is translated or
   guessed on the phone, and Arabic text (duas, verses, the cards shown to a stranger) is never touched.

   Canonical form, so one entry serves every variation of a line:
     numbers        "Day 5 of 10"            → "Day {1} of {2}"        (so no number can be mistranslated)
     dates          "Wed 24 Mar"             → "{d1} {1} {m1}"         (weekday / month / Hijri month from the pack's glossary)
     prayer names   "Asr in 2h 21m"          → "{P1} in {1}h {2}m"     (short lines only)
     your own words "As-salamu alaykum, Ali" → "As-salamu alaykum, {U1}"
     inline tags    "Read <b>this</b> first" → "Read <1>this</1> first"
     marks          arrows and ticks are kept as one character each; emoji are dropped (the app turns them into icons)

   English users pay nothing: with English selected no observer runs. */
(function () {
  'use strict';
  var W = window, D = document, R = D.documentElement;

  // code, own name, English name, right-to-left
  var LANGS = [['en', 'English', 'English'], ['zh', '中文', 'Chinese'], ['hi', 'हिन्दी', 'Hindi'], ['es', 'Español', 'Spanish'], ['fr', 'Français', 'French'],
    ['ar', 'العربية', 'Arabic', 1], ['bn', 'বাংলা', 'Bengali'], ['pt', 'Português', 'Portuguese'], ['ru', 'Русский', 'Russian'], ['ur', 'اردو', 'Urdu', 1],
    ['id', 'Bahasa Indonesia', 'Indonesian'], ['ms', 'Bahasa Melayu', 'Malay'], ['tr', 'Türkçe', 'Turkish'], ['fa', 'فارسی', 'Persian', 1], ['sw', 'Kiswahili', 'Swahili']];
  // the two words the language sheet needs before any pack is loaded
  var WORD = { en: ['Language', 'Continue'], zh: ['语言', '继续'], hi: ['भाषा', 'जारी रखें'], es: ['Idioma', 'Continuar'], fr: ['Langue', 'Continuer'], ar: ['اللغة', 'متابعة'], bn: ['ভাষা', 'চালিয়ে যান'],
    pt: ['Idioma', 'Continuar'], ru: ['Язык', 'Продолжить'], ur: ['زبان', 'جاری رکھیں'], id: ['Bahasa', 'Lanjutkan'], ms: ['Bahasa', 'Teruskan'], tr: ['Dil', 'Devam'], fa: ['زبان', 'ادامه'], sw: ['Lugha', 'Endelea'] };
  // a face for the scripts Manrope does not cover; Chinese uses the phone's own
  var FACE = { ar: 'Noto Sans Arabic', fa: 'Noto Sans Arabic', ur: 'Noto Sans Arabic', bn: 'Noto Sans Bengali', hi: 'Noto Sans Devanagari' };
  var SYS = { zh: "'PingFang SC','Noto Sans CJK SC','Noto Sans SC','Microsoft YaHei'" };
  var KEY = 'us-lang', PACKS = W.I18N_PACKS || {};

  function info(c) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === c) return LANGS[i]; return null; }
  function has(c) { return c === 'en' || !!PACKS[c]; }
  function stored() { try { var v = localStorage.getItem(KEY); return v && info(v) && has(v) ? v : ''; } catch (e) { return ''; } }
  var lang = stored() || 'en', pack = null, ready = lang === 'en';

  /* ───────────── canonical form ───────────── */
  var GLYPH = { '✔': '✓', '►': '▶', '◄': '◀', '←': '◀', '‹': '◀', '›': '▶', '▼': '▾', '▲': '▴', '✖': '✕', '↺': '↻' };
  var GCLS = { refresh: '↻', check: '✓', chevr: '▶', chevl: '◀', chevd: '▾', chevu: '▴', close: '✕', expand: '⛶', plus: '＋', ext: '↗', arrow: '→', lr: '↔' };
  var G_RE = /[→↔↗✓✕▶◀▾▴↻⛶＋]/, G_ALL = /\s*([→↔↗✓✕▶◀▾▴↻⛶＋])\s*/g, G_VAR = /[✔►◄←‹›▼▲✖↺]/g;
  var EMOJI = /(?:[⌚⌛⏩-⏺☀-✒✔✖-➿⬆⬇⬛⬜⭐]|[\uD83C-\uD83E][\uDC00-\uDFFF])(?:[\uFE0F\u200D]|[\uD83C-\uD83E][\uDC00-\uDFFF]|[☀-➿])*/g;
  var NUM = /\d+(?:[.,:]\d+)*/g;
  var WD = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], WDS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MOS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var PR = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  // Hijri month names exactly as this browser prints them for the app (the spelling differs between engines and locales)
  var HIJ = (function () {
    var m = {}, names = [];
    try {
      ['en-u-ca-islamic-umalqura', 'en-GB-u-ca-islamic-umalqura'].forEach(function (loc) {
        var f = new Intl.DateTimeFormat(loc, { month: 'long', timeZone: 'UTC' }), g = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', timeZone: 'UTC' });
        for (var i = 0; i < 13; i++) { var d = new Date(Date.UTC(2026, 5, 20) + i * 29.6 * 864e5), n = f.format(d), k = +g.format(d); if (n && k >= 1 && k <= 12 && !/^\d/.test(n) && !m[n]) { m[n] = k; names.push(n); } }
      });
    } catch (e) { }
    names.sort(function (a, b) { return b.length - a.length; });
    return { idx: m, re: names.length ? new RegExp('(' + names.map(function (n) { return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'g') : null };
  })();
  var RX = {
    mo: new RegExp('(\\{\\d+\\},? )(' + MO.join('|') + '|' + MOS.join('|') + ')\\b|\\b(' + MO.join('|') + '|' + MOS.join('|') + ')( \\{\\d+\\})', 'g'),
    wd: new RegExp('\\b(' + WD.join('|') + '|' + WDS.join('|') + ')(,? (?:\\{\\d+\\}|\\{[mM]\\d+\\}))', 'g'),
    pr: new RegExp('\\b(' + PR.join('|') + ')\\b', 'g')
  };

  function hash(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; } return h.toString(36); }

  // what the pilgrim typed in (names, hotel, camp, medicines …): never translated, and never part of a key
  var uCache = null, uSig = null;
  function userStrings() {
    if (uCache) return uCache;
    var out = [], seen = {};
    function add(v) { if (typeof v !== 'string') return; v = v.replace(/\s+/g, ' ').trim(); if (v.length < 3 || !/[^\d\s+().,:\/-]/.test(v) || seen[v]) return; seen[v] = 1; out.push(v); }
    function all(o, d) { if (!o || d > 3) return; if (typeof o === 'string') return add(o); if (typeof o === 'object') for (var k in o) all(o[k], d + 1); }
    try {
      var S = W.ST || {};
      add(S.name); all(S.kidNames, 0); all(S.kidInfo, 0); all(S.hotelInfo, 0); all(S.camp, 0); all(S.me, 0); all(S.meds, 0); all(S.journal, 0); add(S.hotel); add(S.meet); add(S.companion);
      if (S.home && S.home.n) add(S.home.n);
      if (Array.isArray(W.duas)) W.duas.forEach(function (d) { add(d && d.t); });
    } catch (e) { }
    out.sort(function (a, b) { return b.length - a.length; });
    uCache = out;
    // the app reads the pilgrim's settings a moment after the first lines are drawn: once their words are known (or change), look again at what was left
    var sig = out.join('\u0001'); if (uSig !== null && sig !== uSig && mo) setTimeout(function () { pass(D.body); }, 0); uSig = sig;
    return out;
  }

  /* text → { key, v } ; s may hold tag marks (\uE1xx open, \uE2xx close) put there by serial() */
  function reEsc(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function canon(s, plain) {
    var v = { n: [], U: [], D: [], d: [], M: [], m: [], H: [], P: [], o: { D: [], d: [], M: [], m: [], H: [], P: [] }, g: [], lead: '', pre: /^\s/.test(s), post: /\s$/.test(s) };
    s = s.replace(/[\u00A0\u202F\u2009\u2060]/g, ' ').replace(G_VAR, function (c) { v.g.push(c); return GLYPH[c]; });
    EMOJI.lastIndex = 0; var lm = EMOJI.exec(s); if (lm && !s.slice(0, lm.index).trim() && !G_RE.test(lm[0])) v.lead = lm[0];
    EMOJI.lastIndex = 0;
    s = s.replace(EMOJI, function (c) { return G_RE.test(c) ? c : ' '; }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
    var us = plain ? [] : userStrings();
    for (var i = 0; i < us.length && v.U.length < 200; i++) {
      if (s.indexOf(us[i]) < 0) continue;
      var re = new RegExp('(^|[^A-Za-z\\u00C0-\\u024F])' + reEsc(us[i]) + '(?![A-Za-z\\u00C0-\\u024F])', 'g'), mark = String.fromCharCode(0xE011 + v.U.length), hit = false;
      s = s.replace(re, function (a, lead) { hit = true; return lead + mark; });
      if (hit) v.U.push(us[i]);
    }
    if (v.U.length > 1) { var ord = [], U2 = []; s = s.replace(/[\uE011-\uE0FF]/g, function (c) { var was = c.charCodeAt(0) - 0xE011, k = ord.indexOf(was); if (k < 0) { k = ord.length; ord.push(was); U2.push(v.U[was]); } return String.fromCharCode(0xE011 + k); }); v.U = U2; }
    s = s.replace(NUM, function (n) { v.n.push(n); return '{' + v.n.length + '}'; });
    if (HIJ.re) s = s.replace(HIJ.re, function (n, a, off, str) { var b = str.slice(Math.max(0, off - 7), off), f = str.slice(off + n.length, off + n.length + 7); if (!/\{\d+\},? $/.test(b) && !/^,? \{\d+\}/.test(f)) return n; v.H.push(HIJ.idx[n] - 1); v.o.H.push(n); return '{H' + v.H.length + '}'; });
    s = s.replace(RX.mo, function (a, pre, mo1, mo2, post) { var mo = mo1 || mo2, long = MO.indexOf(mo), kind = long > -1 ? 'M' : 'm'; v[kind].push(long > -1 ? long : MOS.indexOf(mo)); v.o[kind].push(mo); return (pre || '') + '{' + kind + v[kind].length + '}' + (post || ''); });
    s = s.replace(RX.wd, function (a, wd, rest) { var long = WD.indexOf(wd), kind = long > -1 ? 'D' : 'd'; v[kind].push(long > -1 ? long : WDS.indexOf(wd)); v.o[kind].push(wd); return '{' + kind + v[kind].length + '}' + rest; });
    if (s.length <= 48) s = s.replace(RX.pr, function (a, p) { v.P.push(PR.indexOf(p)); v.o.P.push(p); return '{P' + v.P.length + '}'; });
    s = s.replace(G_ALL, '$1');
    s = s.replace(/[\uE011-\uE0FF]/g, function (c) { return '{U' + (c.charCodeAt(0) - 0xE010) + '}'; });
    s = s.replace(/[\uE100-\uE1FF]/g, function (c) { return '<' + (c.charCodeAt(0) - 0xE100) + '>'; }).replace(/[\uE200-\uE2FF]/g, function (c) { return '</' + (c.charCodeAt(0) - 0xE200) + '>'; });
    return { key: s, v: v };
  }
  var LETTER = /[A-Za-zÀ-ɏЀ-ӿ]/;
  function worth(key) { return LETTER.test(key.replace(/<\/?\d+>|\{[A-Za-z]?\d+\}/g, '')); }  // a line that is only the pilgrim's own words, numbers or marks has nothing to translate

  /* a translated entry + the values taken out of the English → text, with <n> marks for tags */
  function fill(t, v) {
    if (t && typeof t === 'object') { var n = parseFloat(String(v.n[0] || '').replace(/,/g, '')), cat = 'other'; try { cat = new Intl.PluralRules(lang).select(isNaN(n) ? 0 : n); } catch (e) { } t = t[cat] || t.other || t.many || t.few || t.one || ''; }
    var G = (pack && pack.g) || {};
    t = String(t).replace(/\{([A-Za-z]?)(\d+)\}/g, function (a, kind, k) {
      k = +k - 1;
      if (!kind) return v.n[k] != null ? v.n[k] : a;
      if (kind === 'U') return v.U[k] != null ? v.U[k] : a;
      if (!v[kind] || v[kind][k] == null) return a;
      return (G[kind] && G[kind][v[kind][k]]) || v.o[kind][k];
    });
    var gi = 0, glyphs = v.g;
    return t.replace(/\s*([→↔↗✓✕▶◀▾▴↻⛶＋])\s*/g, function (a, g, off, str) {
      var orig = g; for (var i = gi; i < glyphs.length; i++) { if (GLYPH[glyphs[i]] === g) { orig = glyphs[i]; gi = i + 1; break; } }
      var first = !str.slice(0, off).replace(/<\/?\d+>/g, '').trim(), last = !str.slice(off + a.length).replace(/<\/?\d+>/g, '').trim();
      return (first ? '' : ' ') + orig + (last ? '' : ' ');
    });
  }

  /* ───────────── reading runs out of the page ───────────── */
  var FMT = { B: 1, STRONG: 1, I: 1, EM: 1, U: 1, A: 1, BDI: 1, MARK: 1, SUB: 1, SUP: 1 };
  // never read: Arabic, transliteration, the Sources page's quoted sentences (kept in the app's original English beside their reference)
  var SKIP = 'script,style,textarea,svg,canvas,code,pre,[contenteditable],[data-i18n-skip],.ar,[lang="ar"]:not(html),.plar,.drv-ar,.drv-arn,.lost-ar,.df-ar,.ty-saw,.tl,.df-tl,.say-tl,.src-t';
  function thin(n) { return n.nodeType === 1 && n.tagName === 'SPAN' && /(^| )ty-(nw|dot)( |$)/.test(n.className); }
  function glyphEl(n) { return n.nodeType === 1 && n.tagName === 'svg' && n.classList.contains('ty-g'); }
  function saw(n) { return n.nodeType === 1 && n.tagName === 'SPAN' && n.classList.contains('ty-saw'); }
  function inl(n) {
    if (n.nodeType === 3) return true; if (n.nodeType !== 1) return false;
    if (glyphEl(n) || saw(n)) return true;
    if (!(thin(n) || FMT[n.tagName])) return false;
    if (FMT[n.tagName] && n.matches('[data-i18n-skip],.ar,[lang="ar"]')) return false;
    for (var c = n.firstChild; c; c = c.nextSibling) if (!inl(c)) return false;
    return true;
  }
  function serial(nodes, tags) {
    var s = '';
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType === 3) s += n.nodeValue;
      else if (glyphEl(n)) { var m = /ty-(?!g |g$|lead|trail|mid|solo)([a-z]+)/.exec(n.getAttribute('class') || ''); s += (m && GCLS[m[1]]) || ''; }
      else if (saw(n)) s += n.textContent;
      else if (thin(n)) s += serial(n.childNodes, tags);
      else { tags.push(n); var k = tags.length; s += String.fromCharCode(0xE100 + k) + serial(n.childNodes, tags) + String.fromCharCode(0xE200 + k); }
    }
    return s;
  }
  var done = new WeakSet(), outs = Object.create(null), aDone = new WeakMap();
  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];

  // walk(el, fn): fn(run nodes, parent) for every run of inline content; fn2(el, attr) for every translatable attribute
  function walk(el, fn, fn2) {
    if (!el || el.nodeType !== 1 || (el.matches && el.matches(SKIP))) return;
    if (fn2) for (var a = 0; a < ATTRS.length; a++) if (el.hasAttribute(ATTRS[a])) fn2(el, ATTRS[a]);
    var kids = [].slice.call(el.childNodes), run = [];
    function flush() {
      if (!run.length) return; var r = run; run = [];
      var real = r.filter(function (n) { return n.nodeType !== 3 || n.nodeValue.trim(); });
      if (!real.length) return;
      // a lone <b> or <a> holding the whole line: the line is what is inside it
      if (real.length === 1 && real[0].nodeType === 1 && FMT[real[0].tagName]) { walk(real[0], fn, fn2); return; }
      fn(r, el);
    }
    for (var i = 0; i < kids.length; i++) { var c = kids[i]; if (inl(c)) run.push(c); else { flush(); if (c.nodeType === 1) walk(c, fn, fn2); } }
    flush();
  }
  function runKey(nodes, plain) { var tags = [], raw = serial(nodes, tags), c = canon(raw, plain); c.tags = tags; c.raw = raw; return c; }

  /* ───────────── writing a translation back ───────────── */
  function build(t, c) {
    var f = D.createDocumentFragment(), stack = [f], re = /<(\/?)(\d+)>/g, last = 0, m, made = [];
    function text(s) { if (!s) return; var n = D.createTextNode(s); done.add(n); made.push(n); stack[stack.length - 1].appendChild(n); }
    while ((m = re.exec(t))) {
      text(t.slice(last, m.index)); last = m.index + m[0].length;
      if (m[1]) { if (stack.length > 1) stack.pop(); }
      else { var src = c.tags[+m[2] - 1]; if (!src) continue; var el = src.cloneNode(false); stack[stack.length - 1].appendChild(el); stack.push(el); }
    }
    text(t.slice(last));
    return f;
  }
  function lookup(c) { var e = pack && pack.u[hash(c.key)]; return e == null ? null : fill(e, c.v); }
  function translateRun(nodes, parent, quiet) {
    var fresh = false; for (var i = 0; i < nodes.length; i++) if (nodes[i].nodeType !== 3 || !done.has(nodes[i])) { fresh = true; break; }
    if (!fresh) return;
    var c = runKey(nodes, true);
    if (!worth(c.key)) return;
    function mine() { nodes.forEach(function (n) { if (n.nodeType === 3) done.add(n); }); }
    if (outs[c.key]) return mine();
    // the line as written first (a lesson may mention the pilgrim's own name); then with the pilgrim's words taken out
    var t = lookup(c);
    if (t == null) { var c2 = runKey(nodes, false); if (c2.key !== c.key) { if (outs[c2.key]) return mine(); if (!worth(c2.key)) return; c = c2; t = lookup(c); } }
    if (t == null && nodes.length === 1 && nodes[0].nodeType === 3) t = pieces(nodes[0].nodeValue);
    if (t == null) {
      // not known as one line: a bold place name followed by a plan, a label followed by a status. Try each part on its own.
      if (nodes.length > 1 && !quiet) { var any = nodes.some(function (n) { return n.nodeType === 3 ? done.has(n) : !!(n.firstChild && n.firstChild.nodeType === 3 && done.has(n.firstChild)); }); nodes.slice().forEach(function (n) { if (n.parentNode !== parent) return; if (n.nodeType === 3) { if (n.nodeValue.trim()) { var was = n.nodeValue; translateRun([n], parent, true); if (n.parentNode !== parent || n.nodeValue !== was) any = true; } } else if (FMT[n.tagName]) { var h0 = n.innerHTML; walk(n, function (ns, p) { translateRun(ns, p, true); }, translateAttr); if (n.innerHTML !== h0) any = true; } }); if (any) return; }
      if (!quiet) miss(c.key); return;
    }
    if (c.v.lead) t = c.v.lead + ' ' + t;
    t = (c.v.pre ? ' ' : '') + t + (c.v.post ? ' ' : '');
    var frag = build(t, c), first = nodes[0], made = [].slice.call(frag.childNodes);
    outs[runKey(made, true).key] = 1; outs[runKey(made, false).key] = 1;
    parent.insertBefore(frag, first);
    for (var j = 0; j < nodes.length; j++) if (nodes[j].parentNode === parent) parent.removeChild(nodes[j]);
  }
  // "Makkah · day 3 · Asr": when the whole line is unknown, its parts may each be known. Parts are split at " · " first;
  // a part that is still unknown is split once more at a dash or a bar.
  function one(p) { var c = canon(p, true), t = worth(c.key) ? lookup(c) : null; if (t == null) { c = canon(p); t = worth(c.key) ? lookup(c) : null; } return t; }
  function split(raw, re, deeper) {
    var parts = raw.split(re), hit = 0, out = '';
    if (parts.length < 3) return null;
    for (var i = 0; i < parts.length; i++) {
      if (i % 2) { out += parts[i]; continue; }
      var t = one(parts[i]); if (t == null && deeper) t = split(parts[i], deeper);
      if (t != null) { hit++; out += t; } else out += parts[i].trim();
    }
    return hit ? out : null;
  }
  function pieces(raw) { return split(raw, /( · )/, /( — | \| )/) || split(raw, /( — | \| )/); }
  function translateAttr(el, a) {
    var val = el.getAttribute(a); if (!val) return; var prev = aDone.get(el);
    if (prev && prev[a] === val) return;
    var c = canon(val, true); if (!worth(c.key)) return;
    var t = lookup(c); if (t == null) { var c2 = canon(val); if (c2.key !== c.key) { if (!worth(c2.key)) return; c = c2; t = lookup(c); } }
    if (t == null) { miss(c.key); return; }
    t = t.replace(/<\/?\d+>/g, '');
    if (!prev) { prev = {}; aDone.set(el, prev); } prev[a] = t; el.setAttribute(a, t);
  }
  var missed = Object.create(null);
  function miss(k) { if (!missed[k]) missed[k] = 1; }

  /* plain strings that never reach the page as text (share sheets, notifications) */
  function t(s) { if (lang === 'en' || !pack || typeof s !== 'string') return s; uCache = null; var c = canon(s, true), r = worth(c.key) ? lookup(c) : null; if (r == null) { c = canon(s); r = worth(c.key) ? lookup(c) : null; } return r == null ? s : r.replace(/<\/?\d+>/g, ''); }

  /* ───────────── running ───────────── */
  var mo = null, busy = false;
  function pass(el) { if (!pack) return; busy = true; uCache = null; try { walk(el, translateRun, translateAttr); } catch (e) { if (W.console) console.warn('i18n', e); } busy = false; if (mo) mo.takeRecords(); }
  function host(n) { var e = n.nodeType === 1 ? n : n.parentNode; while (e && e.nodeType === 1 && e !== D.body && (FMT[e.tagName] || thin(e))) e = e.parentNode; return e; }
  /* The app's own typography pass (emoji → icons, ties, curly quotes) answers the same mutations. Waiting one microtask
     lets it finish first, so the text read here is always the settled text — the same text the extract tool saw. Still before paint. */
  var queue = [], queued = false;
  function onMut(recs) {
    if (busy || !pack) return;
    for (var i = 0; i < recs.length; i++) { var r = recs[i], e = r.type === 'attributes' ? r.target : host(r.target); if (e && e.nodeType === 1 && queue.indexOf(e) < 0) queue.push(e); }
    if (!queued) { queued = true; Promise.resolve().then(flushQ); }
  }
  function flushQ() {
    queued = false; var set = queue; queue = [];
    set = set.filter(function (e) { for (var j = 0; j < set.length; j++) if (set[j] !== e && set[j].contains(e)) return false; return true; });
    for (var k = 0; k < set.length; k++) if (set[k].isConnected) pass(set[k]);
  }
  function start() {
    if (mo || lang === 'en') return;
    mo = new MutationObserver(onMut);
    mo.observe(D.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    pass(D.body);
  }
  function reveal() { ready = true; R.classList.remove('i18n-wait'); }
  function face() {
    var f = FACE[lang], sys = SYS[lang]; if (!f && !sys) return;
    if (f) { var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@300..700&display=swap'; D.head.appendChild(l); }
    var cs = getComputedStyle(R), add = f ? "'" + f + "'" : sys;
    ['--f-text', '--f-display'].forEach(function (p) { var cur = cs.getPropertyValue(p).trim(); if (cur) R.style.setProperty(p, add + ',' + cur); });
  }

  W.I18N_PACK = function (code, p) {
    if (code !== lang) return;
    pack = p; if (!pack.u) pack.u = {};
    if (D.body) { start(); reveal(); } else D.addEventListener('DOMContentLoaded', function () { start(); reveal(); });
  };
  function load() {
    if (lang === 'en') return;
    R.lang = lang; if (info(lang)[3]) R.dir = 'rtl';
    face();
    var s = D.createElement('script'); s.src = 'i18n/' + lang + '.js?v=' + ((PACKS[lang] || {}).v || 1);
    s.onerror = function () { reveal(); };
    D.head.appendChild(s);
    setTimeout(reveal, 2500);
  }

  /* ───────────── choosing a language ───────────── */
  var pick = lang;
  function suggest() {
    var navs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
    for (var i = 0; i < navs.length; i++) { var c = String(navs[i]).toLowerCase().split('-')[0]; if (c === 'in') c = 'id'; if (info(c) && has(c)) return c; }
    return 'en';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function sheetHTML() {
    var w = WORD[pick] || WORD.en, rows = LANGS.filter(function (l) { return has(l[0]); }).map(function (l) {
      var on = l[0] === pick;
      return '<button type="button" class="lang-opt' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" onclick="I18N.choose(\'' + l[0] + '\')" data-i18n-skip><span class="lang-n"><b lang="' + l[0] + '"' + (l[3] ? ' dir="rtl"' : '') + '>' + esc(l[1]) + '</b>' + (l[0] === 'en' ? '' : '<small>' + l[2] + '</small>') + '</span><span class="lang-r" aria-hidden="true"></span></button>';
    }).join('');
    var P = PACKS[pick], own = ' lang="' + pick + '" dir="' + (info(pick)[3] ? 'rtl' : 'ltr') + '"', note = pick === 'en' || !(P && P.note) ? '' : '<p class="lang-note" data-i18n-skip' + own + '>' + esc(P.note) + '</p>';
    return '<div data-i18n-skip data-lang-sheet><div class="sheet-h" aria-hidden="true"><svg class="mk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.5 3.9 5.5 3.9 9s-1.3 6.5-3.9 9c-2.6-2.5-3.9-5.5-3.9-9S9.400 5.5 12 3z"/></svg></div>'
      + '<h3 id="langH"><bdi' + own + '>' + esc(w[0]) + '</bdi>' + (pick === 'en' ? '' : ' <small class="lang-h2" lang="en" dir="ltr">Language</small>') + '</h3>'
      + '<div class="lang-list" role="radiogroup" aria-labelledby="langH">' + rows + '</div>' + note
      + '<button type="button" class="btn tall" id="langGo"' + own + ' onclick="I18N.confirm()">' + esc(w[1]) + '</button></div>';
  }
  var afterPick = null;
  // sheet(then): then runs once the sheet is gone, whether a language was confirmed or the sheet was waved away. offer: start on the phone's own language.
  function sheet(then, offer) {
    afterPick = typeof then === 'function' ? then : null; pick = (!offer && stored()) || (afterPick || offer ? suggest() : lang);
    if (typeof W.openSheet !== 'function') { var f0 = afterPick; afterPick = null; if (f0) f0(); return; }
    W.openSheet(sheetHTML());
    var o = D.getElementById('gSheet');
    if (o && afterPick && W.MutationObserver) { var w = new MutationObserver(function () { if (o.classList.contains('on')) return; w.disconnect(); var f = afterPick; afterPick = null; if (f) setTimeout(f, 280); }); w.observe(o, { attributes: true, attributeFilter: ['class'] }); }
  }
  // someone already using the app, whose phone is in a language Miqah now has: offer it once, and never ask again
  function offerOnce(then) {
    if (!unset() || suggest() === 'en' || D.querySelector('.sheet-o.on,.focus.on,#obSheet.on')) return false;
    try { localStorage.setItem(KEY, 'en'); } catch (e) { return false; }
    sheet(then, true); return true;
  }
  function choose(c) { if (!has(c)) return; pick = c; var b = D.getElementById('gSheetBody'); if (b) { var y = b.scrollTop; b.innerHTML = sheetHTML(); b.scrollTop = y; var on = b.querySelector('.lang-opt.on'); if (on) on.focus(); } }
  function confirm() {
    var was = lang; try { localStorage.setItem(KEY, pick); } catch (e) { }
    if (pick !== was) { location.reload(); return; }
    if (typeof W.closeSheet === 'function') W.closeSheet();   // the watcher in sheet() runs what comes next
  }
  function unset() { try { return !localStorage.getItem(KEY); } catch (e) { return false; } }
  // the Settings row and the link on the welcome: named in the language's own name, and only there when there is a language to choose
  function label() {
    var any = Object.keys(PACKS).length > 0, el = D.getElementById('langLbl'), ob = D.getElementById('obLangN'), lnk = D.getElementById('obLangLnk');
    if (el) { el.textContent = info(lang)[1]; el.setAttribute('data-i18n-skip', ''); var row = el.closest ? el.closest('.setrow') : null; if (row) row.hidden = !any; }
    if (ob) { ob.textContent = info(lang)[1]; ob.setAttribute('data-i18n-skip', ''); }
    if (lnk) lnk.hidden = !any;
  }

  /* ───────────── for the tools: every run on the page, in canonical form ───────────── */
  function collect(root) {
    var out = [], seen = {}; uCache = null;
    function ctx(el) { var p = []; for (var e = el; e && e.nodeType === 1 && p.length < 3; e = e.parentNode) { if (e.id) { p.push('#' + e.id); break; } if (typeof e.className === 'string' && e.className.trim()) p.push('.' + e.className.trim().split(/\s+/)[0]); } return p.join(' < '); }
    var CITE = /(Bukhari|Muslim|Tirmidhi|Abu Dawud|Nasai|Ibn Majah|Muwatta|Ahmad|Quran) \{\d+\}/;
    walk(root || D.body, function (nodes, parent) {
      var c = runKey(nodes); if (!worth(c.key)) return;
      if (!seen[c.key]) { seen[c.key] = 1; var u = { k: c.key, h: hash(c.key), c: ctx(parent) }; if (CITE.test(c.key)) u.n = c.v.n; out.push(u); }
      if (nodes.length === 1 && nodes[0].nodeType === 3 && nodes[0].nodeValue.indexOf(' · ') > -1) nodes[0].nodeValue.split(' · ').forEach(function (p) { var pc = canon(p); if (pc.key.length > 80 || !worth(pc.key) || seen[pc.key]) return; seen[pc.key] = 1; out.push({ k: pc.key, h: hash(pc.key), c: ctx(parent), of: c.key }); });
    },
      function (el, a) { var c = canon(el.getAttribute(a) || ''); if (!worth(c.key) || seen[c.key]) return; seen[c.key] = 1; out.push({ k: c.key, h: hash(c.key), c: '@' + a }); });
    return out;
  }

  W.I18N = { lang: lang, langs: LANGS, packs: PACKS, rtl: !!(info(lang) || [])[3], name: info(lang)[1], has: has, unset: unset, sheet: sheet, offerOnce: offerOnce, choose: choose, confirm: confirm, label: label, t: t,
    collect: collect, canon: function (s) { return canon(s).key; }, hash: hash, missed: function () { return Object.keys(missed); }, ready: function () { return ready; } };
  load();
})();
