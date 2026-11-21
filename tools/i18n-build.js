// Language packs: batches out, checked translations in.
//
//   node tools/i18n-build.js chunks        put lines that are new into new batches (i18n/src/chunks/); 'chunks fresh' starts over
//   node tools/i18n-build.js pack [ar ur]  check every translation in i18n/tr/<lang>/ and write i18n/<lang>.js + i18n/index.js
//
// A translation is accepted only if it keeps what must not change: every {…} placeholder (so no number, date,
// name or phone number can be altered), every <n> tag pair, every arrow and tick, ﷺ, and every web address.
// Anything else is written to i18n/tr/<lang>/_rejects.json and stays in English until it is fixed.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'i18n', 'src');
// the tests build a throwaway pack somewhere else
const TR = process.env.I18N_TR || path.join(ROOT, 'i18n', 'tr'), OUT = process.env.I18N_OUT || path.join(ROOT, 'i18n');
const LANGS = ['zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur', 'id', 'ms', 'tr', 'fa', 'sw'];
const SCRIPT = { ar: /[\u0600-\u06FF]/, ur: /[\u0600-\u06FF]/, fa: /[\u0600-\u06FF]/, bn: /[\u0980-\u09FF]/, hi: /[\u0900-\u097F]/, zh: /[\u4E00-\u9FFF]/, ru: /[\u0400-\u04FF]/ };
const units = () => JSON.parse(fs.readFileSync(path.join(SRC, 'units.json'), 'utf8')).units;

// ── which reference a line carries ──
const COLL = { 'Bukhari': 'bukhari', 'Muslim': 'muslim', 'Tirmidhi': 'tirmidhi', 'Abu Dawud': 'abudawud', 'Nasai': 'nasai', 'Ibn Majah': 'ibnmajah', 'Muwatta': 'malik', 'Ahmad': 'ahmad', 'Quran': 'quran' };
function refsOf(u) {
  if (!u.n) return []; const out = [];
  u.k.replace(/(Bukhari|Muslim|Tirmidhi|Abu Dawud|Nasai|Ibn Majah|Muwatta|Ahmad|Quran) \{(\d+)\}/g, (a, c, i) => { const n = u.n[+i - 1]; if (n) out.push(COLL[c] + ':' + n); return a; });
  return [...new Set(out)];
}

// ── batches ──
const GROUPS = [
  // tier A: what a pilgrim uses on the day
  ['A', 'rites', /#rw-|\.stp-t|#rulB|#ramiProb|#printSheet|\.duacard|#miss-|#hajjWajibNote|#tawafDua|#saiDua|^HAJJ_|^RITES|^DUAS|^TROUBLE|^RAMI_PROB|^TB_HAJJ|#walk|\.focus|#riteHero|#ramiCard|#hlog/],
  ['A', 'packs', /#pka-|#pk-|^WAY_PACK|^HEAT_PACK|^RAM_PACK|#sayBody|#sayEn|^SAY|#helpBody|#lost|#drv|#kid/],
  ['A', 'plan', /#pw-|^PLAN|#it-|#itin|^DAILY|#dw-|#tlCard|#cdCard|#niyCard|#hotelCard|#campBlk|#readyCard/],
  // tier B: learning and visiting
  ['B', 'quiz', /^QUIZ_LEVELS|#qzArea|#qzCard|\.fc-in|#fcCard|^KIDSQ|#kidsArea|#kidsCard|^KIDS_STORIES/],
  ['B', 'learn', /#knowContainer|#qaContainer|#sisContainer|#histContainer|#scamContainer|#madContainer|#virtContainer|^KNOW|^FIQHQA|^SISTERS|^HISTORY|^SCAMS|^VIRTUES|^MADINAH|^QUOTES/],
  ['B', 'places', /#pl-|\.place-|^PLACES|^TOUR|#tourCard|#view-places/],
];
function groupOf(u) { for (const [t, g, re] of GROUPS) if (re.test(u.c || '')) return [t, g]; return ['A', 'ui']; }

function chunks(fresh) {
  const dir = path.join(SRC, 'chunks'); if (fresh) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const U = units(), live = new Map(U.map(u => [u.h, u])), placed = new Set(), index = [], parts = {}; let n = 0, added = 0, gone = 0;
  const itemOf = u => { const item = { h: u.h, k: u.k, c: u.c }, r = refsOf(u); if (u.of) item.part_of = u.of; if (r.length) item.refs = r; return item; };
  const save = (id, list) => { if (!list.length) { fs.rmSync(path.join(dir, id + '.json'), { force: true }); return; } fs.writeFileSync(path.join(dir, id + '.json'), JSON.stringify(list, null, 1)); const m = /^([AB])-([a-z]+)-(\d+)$/.exec(id); index.push({ id: id, tier: m[1], group: m[2], units: list.length, chars: list.reduce((a, x) => a + x.k.length, 0), refs: list.filter(x => x.refs).length }); n += list.length; };
  // batches that exist keep the lines that are still in the app
  fs.readdirSync(dir).filter(f => /^[AB]-[a-z]+-\d+\.json$/.test(f)).sort().forEach(f => {
    const id = f.slice(0, -5), m = /^(.+)-(\d+)$/.exec(id); parts[m[1]] = Math.max(parts[m[1]] || 0, +m[2]);
    const old = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), keep = old.filter(x => live.has(x.h) && !placed.has(x.h)).map(x => itemOf(live.get(x.h)));
    gone += old.length - keep.length; keep.forEach(x => placed.add(x.h)); save(id, keep);
  });
  const by = {}; U.filter(u => !placed.has(u.h)).forEach(u => { const [t, g] = groupOf(u); (by[t + '-' + g] = by[t + '-' + g] || []).push(u); });
  Object.keys(by).sort().forEach(key => {
    const list = by[key].sort((a, b) => (a.c || '') < (b.c || '') ? -1 : (a.c || '') > (b.c || '') ? 1 : a.k < b.k ? -1 : 1);
    let cur = [], size = 0, part = parts[key] || 0;
    const flush = () => { if (!cur.length) return; save(key + '-' + String(++part).padStart(2, '0'), cur); added += cur.length; cur = []; size = 0; };
    list.forEach(u => { if (size + u.k.length > 9000 || cur.length >= 170) flush(); cur.push(itemOf(u)); size += u.k.length; });
    flush();
  });
  index.sort((a, b) => a.id < b.id ? -1 : 1);
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(index, null, 1));
  if (!fresh) console.log(added + ' lines in new batches, ' + gone + ' lines no longer in the app.');
  const sum = t => index.filter(x => x.tier === t).reduce((a, x) => a + x.chars, 0);
  console.log(index.length + ' batches, ' + n + ' units. Tier A: ' + index.filter(x => x.tier === 'A').length + ' batches, ' + sum('A') + ' characters. Tier B: ' + index.filter(x => x.tier === 'B').length + ' batches, ' + sum('B') + ' characters.');
}

// ── checking one translation ──
const multiset = a => a.slice().sort().join('\u0001');
const tokens = s => s.match(/\{[A-Za-z]?\d+\}/g) || [];
const glyphs = s => s.match(/[→↔↗✓✕▶◀▾▴↻⛶＋]/g) || [];
const hosts = s => (s.match(/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:sa|app|com|org|net|gov)\b/gi) || []).map(x => x.toLowerCase());
function tagsOK(s, want) {
  const st = [], seen = []; let m; const re = /<(\/?)(\d+)>/g;
  while ((m = re.exec(s))) { if (m[1]) { if (st.pop() !== m[2]) return false; } else { st.push(m[2]); seen.push(m[2]); } }
  return !st.length && multiset(seen) === multiset(want);
}
function check(lang, src, tr) {
  const forms = tr && typeof tr === 'object' ? Object.keys(tr).map(k => [k, tr[k]]) : [['', tr]];
  if (!forms.length) return 'empty';
  const wantTok = tokens(src), wantTags = (src.match(/<(\d+)>/g) || []).map(x => x.slice(1, -1)), wantG = glyphs(src), wantH = hosts(src);
  for (const [form, t] of forms) {
    if (form && !/^(zero|one|two|few|many|other)$/.test(form)) return 'bad plural key ' + form;
    if (typeof t !== 'string' || !t.trim()) return 'empty';
    if (t !== t.trim()) return 'leading or trailing space';
    const got = tokens(t);
    // a plural form may spell the number out ("one day", "two days") and drop {1}; nothing else may go missing
    const need = form && form !== 'other' && form !== 'many' && form !== 'few' ? wantTok.filter(x => x !== '{1}') : wantTok;
    const gotCmp = form && form !== 'other' && form !== 'many' && form !== 'few' ? got.filter(x => x !== '{1}') : got;
    if (multiset(need) !== multiset(gotCmp)) return 'placeholders differ: want ' + wantTok.join(' ') + ' got ' + got.join(' ');
    if (!tagsOK(t, wantTags)) return 'tags differ or are not nested';
    if (multiset(glyphs(t)) !== multiset(wantG)) return 'arrows or ticks differ';
    if ((src.match(/ﷺ/g) || []).length !== (t.match(/ﷺ/g) || []).length) return 'ﷺ count differs';
    const h = hosts(t); for (const x of wantH) if (h.indexOf(x) < 0) return 'web address missing: ' + x;
    const sl = src.replace(/<\/?\d+>|\{[A-Za-z]?\d+\}/g, '').length, tl = t.replace(/<\/?\d+>|\{[A-Za-z]?\d+\}/g, '').length;
    if (sl > 12 && (tl > sl * 4 + 30 || tl < sl * (lang === 'zh' ? 0.12 : 0.3))) return 'length out of range (' + sl + ' → ' + tl + ')';
    if (SCRIPT[lang] && sl > 14 && !SCRIPT[lang].test(t)) return 'not in the language’s script';
    if (/[\uE000-\uF8FF]|\uFFFD/.test(t)) return 'stray characters';
  }
  return '';
}

function pack(langs) {
  const U = units(), byH = new Map(U.map(u => [u.h, u])), manifest = {};
  (langs.length ? langs : LANGS).forEach(lang => {
    const dir = path.join(TR, lang); if (!fs.existsSync(dir)) return;
    const meta = JSON.parse(fs.readFileSync(path.join(dir, '_meta.json'), 'utf8'));
    const out = {}, rejects = [], unknown = [];
    fs.readdirSync(dir).filter(f => /\.json$/.test(f) && !/^_/.test(f)).sort().forEach(f => {
      let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { rejects.push({ file: f, why: 'not valid JSON: ' + e.message }); return; }
      Object.keys(j).forEach(h => { const u = byH.get(h); if (!u) { unknown.push(h); return; } const why = check(lang, u.k, j[h]); if (why) rejects.push({ h: h, file: f, why: why, k: u.k, t: j[h] }); else out[h] = j[h]; });
    });
    fs.writeFileSync(path.join(dir, '_rejects.json'), JSON.stringify(rejects, null, 1));
    const missing = U.filter(u => !(u.h in out)).length;
    for (const k of ['D', 'd', 'M', 'm', 'H', 'P']) { const want = { D: 7, d: 7, M: 12, m: 12, H: 12, P: 5 }[k]; if (!meta.g || !Array.isArray(meta.g[k]) || meta.g[k].length !== want) throw new Error(lang + ': _meta.json g.' + k + ' must list ' + want + ' names'); }
    const body = 'I18N_PACK(' + JSON.stringify(lang) + ',' + JSON.stringify({ g: meta.g, u: out }) + ');\n';
    fs.writeFileSync(path.join(OUT, lang + '.js'), body);
    let v = 0x811c9dc5; for (let i = 0; i < body.length; i++) { v ^= body.charCodeAt(i); v = Math.imul(v, 16777619) >>> 0; }
    manifest[lang] = { v: v.toString(36), n: Object.keys(out).length, of: U.length, note: meta.note || '', quran: meta.quran || '', checked: meta.checked || '' };
    console.log(lang + ': ' + Object.keys(out).length + ' of ' + U.length + ' lines (' + missing + ' still English), ' + rejects.length + ' rejected, ' + unknown.length + ' not in the inventory, ' + Math.round(body.length / 1024) + ' KB');
  });
  // keep packs that were built earlier and not rebuilt now
  let prev = {}; try { const m = /window\.I18N_PACKS\s*=\s*(\{[\s\S]*\});/.exec(fs.readFileSync(path.join(OUT, 'index.js'), 'utf8')); if (m) prev = JSON.parse(m[1]); } catch (e) { }
  const all = Object.assign({}, prev, manifest); Object.keys(all).forEach(l => { if (!fs.existsSync(path.join(OUT, l + '.js'))) delete all[l]; });
  fs.writeFileSync(path.join(OUT, 'index.js'), '/* Miqah language packs: which ones ship, written by tools/i18n-build.js. */\nwindow.I18N_PACKS = ' + JSON.stringify(all) + ';\n');
  console.log('packs: ' + (Object.keys(all).join(' ') || 'none'));
}

// ── the source texts a batch is checked against ──
const QURAN = () => JSON.parse(fs.readFileSync(path.join(SRC, 'quran.json'), 'utf8'));
const HADITH = () => JSON.parse(fs.readFileSync(path.join(SRC, 'hadith.json'), 'utf8'));
function refs(id, lang) {
  const list = JSON.parse(fs.readFileSync(path.join(SRC, 'chunks', id + '.json'), 'utf8')), Q = QURAN(), H = HADITH(), out = {};
  list.forEach(u => (u.refs || []).forEach(r => {
    if (out[r]) return;
    if (r.indexOf('quran:') === 0) {
      const n = r.slice(6), key = Q.verses[n] ? n : Object.keys(Q.verses).find(k => k.split(/[-–]/)[0] === n) || n, v = Q.verses[key];
      out[r] = v ? (v.note ? { note: v.note } : { verses: key, arabic: v.ar, english: v.en + ' (' + Q.editions.en.by + ')', published: lang && v[lang] ? v[lang] : '', published_by: lang && Q.editions[lang] ? Q.editions[lang].by : '' }) : { note: 'not fetched: check the verse yourself' };
    } else { const h = H[r]; out[r] = h && (h.ar || h.en) ? { arabic: h.ar || '', english: h.en || '' } : { note: (h && h.note) || 'no text from the API for this number: do not guess its wording' }; }
  }));
  return out;
}

// ── one batch of one language: what is missing, what is refused ──
function checkFile(lang, id) {
  const list = JSON.parse(fs.readFileSync(path.join(SRC, 'chunks', id + '.json'), 'utf8')), f = path.join(TR, lang, id + '.json');
  if (!fs.existsSync(f)) return { ok: false, error: 'no file at i18n/tr/' + lang + '/' + id + '.json' };
  let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return { ok: false, error: 'not valid JSON: ' + e.message }; }
  const want = new Set(list.map(u => u.h)), missing = list.filter(u => !(u.h in j)).map(u => u.h), extra = Object.keys(j).filter(h => !want.has(h)), bad = [];
  list.forEach(u => { if (u.h in j) { const why = check(lang, u.k, j[u.h]); if (why) bad.push({ h: u.h, why: why }); } });
  return { ok: !missing.length && !extra.length && !bad.length, lines: list.length, missing: missing, extra: extra, refused: bad };
}

// ── names the phone fills in by itself: weekdays, months, Hijri months, the five prayers ──
const PRAYERS = {
  ar: ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'], ur: ['فجر', 'ظہر', 'عصر', 'مغرب', 'عشاء'], fa: ['صبح', 'ظهر', 'عصر', 'مغرب', 'عشا'],
  bn: ['ফজর', 'যোহর', 'আসর', 'মাগরিব', 'এশা'], hi: ['फ़ज्र', 'ज़ुहर', 'अस्र', 'मग़रिब', 'इशा'], id: ['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'],
  ms: ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'], tr: ['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'], zh: ['晨礼', '晌礼', '晡礼', '昏礼', '宵礼'],
  ru: ['Фаджр', 'Зухр', 'Аср', 'Магриб', 'Иша'], es: ['Fayr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], fr: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Icha'],
  pt: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], sw: ['Alfajiri', 'Adhuhuri', 'Alasiri', 'Magharibi', 'Isha'],
};
// Hijri months where the phone's own list is not what a reader of that language would write
const HIJRI = {
  hi: ['मुहर्रम', 'सफ़र', 'रबीउल अव्वल', 'रबीउस्सानी', 'जुमादल ऊला', 'जुमादल आख़िरा', 'रजब', 'शाबान', 'रमज़ान', 'शव्वाल', 'ज़ुल-क़ादा', 'ज़ुल-हिज्जा'],
  ur: ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاولیٰ', 'جمادی الثانیہ', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'],
  zh: ['穆哈兰姆月', '色法尔月', '赖比尔·敖外鲁月', '赖比尔·阿色尼月', '主马达·敖外鲁月', '主马达·阿色尼月', '赖哲卜月', '舍尔邦月', '赖买丹月', '闪瓦鲁月', '都尔喀尔德月', '都尔黑哲月'],
};
function names(lang) {
  const loc = lang + '-u-ca-gregory-nu-latn', part = (o, d, t) => (new Intl.DateTimeFormat(o.loc || loc, Object.assign({ timeZone: 'UTC' }, o.f)).formatToParts(d).find(x => x.type === t) || {}).value || '';
  const g = { D: [], d: [], M: [], m: [], H: [], P: PRAYERS[lang] };
  for (let i = 0; i < 7; i++) { const d = new Date(Date.UTC(2026, 0, 5 + i)); g.D.push(part({ f: { weekday: 'long' } }, d, 'weekday')); g.d.push(part({ f: { weekday: 'short' } }, d, 'weekday')); }   // 5 Jan 2026 is a Monday
  // a month is only ever filled in beside a day number, so take the form the language uses there ("24 марта", not "март")
  for (let i = 0; i < 12; i++) { const d = new Date(Date.UTC(2026, i, 15)); g.M.push(part({ f: { day: 'numeric', month: 'long' } }, d, 'month')); g.m.push(part({ f: { day: 'numeric', month: 'short' } }, d, 'month')); }
  // where the language writes the month as a number beside a day (Chinese), take the name it uses alone
  for (let i = 0; i < 12; i++) if (/^\d+$/.test(g.M[i])) { const d = new Date(Date.UTC(2026, i, 15)); g.M[i] = g.m[i] = part({ f: { month: 'short' } }, d, 'month'); }
  if (HIJRI[lang]) { g.H = HIJRI[lang]; return g; }
  const hl = lang + '-u-ca-islamic-umalqura-nu-latn', seen = {};
  for (let i = 0; i < 400 && g.H.filter(Boolean).length < 12; i++) { const d = new Date(Date.UTC(2026, 5, 20) + i * 864e5), k = +new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', timeZone: 'UTC' }).format(d); if (!seen[k]) { seen[k] = 1; g.H[k - 1] = part({ loc: hl, f: { day: 'numeric', month: 'long' } }, d, 'month'); } }
  return g;
}
function meta(langs) {
  const Q = QURAN();
  (langs.length ? langs : LANGS).forEach(lang => {
    const dir = path.join(TR, lang), f = path.join(dir, '_meta.json'); fs.mkdirSync(dir, { recursive: true });
    let cur = {}; try { cur = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { }
    const m = Object.assign({ g: names(lang), note: '', quran: Q.editions[lang].by, checked: '' }, cur);
    fs.writeFileSync(f, JSON.stringify(m, null, 1));
    console.log(lang + '  ' + m.g.D.join(' ') + ' | ' + m.g.m.slice(0, 3).join(' ') + ' | ' + m.g.M.slice(2, 4).join(' ') + ' | ' + m.g.H.slice(8, 12).join(', ') + ' | ' + m.g.P.join(' '));
  });
}
function status(json) {
  const idx = JSON.parse(fs.readFileSync(path.join(SRC, 'chunks', 'index.json'), 'utf8'));
  const out = {};
  LANGS.forEach(lang => {
    if (!fs.existsSync(path.join(TR, lang))) return; const todo = [], recheck = []; let ok = 0;
    idx.forEach(c => { const r = checkFile(lang, c.id), seen = fs.existsSync(path.join(TR, lang, '_checked', c.id + '.json')); if (!r.ok) todo.push(c.id); else if (!seen) recheck.push(c.id); else ok++; });
    out[lang] = { terms: fs.existsSync(path.join(TR, lang, '_terms.json')), done: ok, translate: todo, check: recheck };
    if (!json) console.log(lang + ': ' + ok + ' of ' + idx.length + ' batches translated and checked; ' + todo.length + ' to translate, ' + recheck.length + ' translated but not yet checked' + (out[lang].terms ? '' : '; no term sheet yet'));
  });
  if (json) console.log(JSON.stringify(out));
}

const cmd = process.argv[2], A = process.argv.slice(3);
if (require.main === module) {
  if (cmd === 'chunks') chunks(A[0] === 'fresh');
  else if (cmd === 'pack') pack(A);
  else if (cmd === 'refs') console.log(JSON.stringify(refs(A[0], A[1]), null, 1));
  else if (cmd === 'check') { const r = checkFile(A[0], A[1]); console.log(JSON.stringify(r, null, 1)); process.exitCode = r.ok ? 0 : 1; }
  else if (cmd === 'meta') meta(A);
  else if (cmd === 'status') status(A[0] === 'json');
  else console.log('usage: node tools/i18n-build.js chunks | meta [lang …] | refs <batch> <lang> | check <lang> <batch> | status | pack [lang …]');
}
module.exports = { check, checkFile, refs, refsOf, names, LANGS };
