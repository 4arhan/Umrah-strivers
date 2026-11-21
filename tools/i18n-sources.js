// Fetches the source texts the translations are checked against, for every reference in cites.js:
//   i18n/src/quran.json   each verse in Arabic and in one named, published translation per language
//   i18n/src/hadith.json  each hadith in Arabic and in the published English, by collection and number
// Quran: fawazahmed0/quran-api. Hadith: fawazahmed0/hadith-api (Muslim is looked up by its Abdul Baqi number).
// A verse is never translated by Miqah; a pack quotes the edition named here.
//
//   node tools/i18n-sources.js        (needs curl and network; results are cached in i18n/src/.cache)
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'i18n', 'src'), CACHE = path.join(OUT, '.cache');
fs.mkdirSync(CACHE, { recursive: true });

// one published translation per language: edition id in the API, translator as it should be credited
const QURAN = {
  ar: ['ara-quranuthmanihaf', 'The Arabic text (Uthmani script)'], en: ['eng-ummmuhammad', 'Saheeh International'],
  zh: ['zho-majian', 'Ma Jian (马坚)'], hi: ['hin-suhelfarooqkhan', 'Suhel Farooq Khan & Saifur Rahman Nadwi'], es: ['spa-muhammadisagarc', 'Muhammad Isa García'],
  fr: ['fra-muhammadhamidul', 'Muhammad Hamidullah'], bn: ['ben-muhiuddinkhan', 'Muhiuddin Khan'], pt: ['por-samirelhayek', 'Samir El-Hayek'],
  ru: ['rus-elmirkuliev', 'Elmir Kuliev'], ur: ['urd-fatehmuhammadja', 'Fateh Muhammad Jalandhry'], id: ['ind-indonesianislam', 'Kementerian Agama RI'],
  ms: ['msa-abdullahmuhamma', 'Abdullah Muhammad Basmeih'], tr: ['tur-diyanetisleri', 'Diyanet İşleri'], fa: ['fas-mohammadmahdifo', 'Mohammad Mahdi Fooladvand'], sw: ['swa-alimuhsinalbarw', 'Ali Muhsin Al-Barwani'],
};
const BOOK = { bukhari: 'bukhari', muslim: 'muslim', abudawud: 'abudawud', tirmidhi: 'tirmidhi', nasai: 'nasai', ibnmajah: 'ibnmajah', malik: 'malik' };

function get(url) {
  const f = path.join(CACHE, url.replace(/[^a-z0-9.-]+/gi, '_').slice(-180));
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  let body = '';
  for (let i = 0; i < 3 && !body; i++) { try { body = execFileSync('curl', ['-s', '-m', '60', '--fail', url], { encoding: 'utf8', maxBuffer: 1 << 28 }); } catch (e) { body = ''; } }
  if (body) fs.writeFileSync(f, body);
  return body;
}
const J = s => { try { return JSON.parse(s); } catch (e) { return null; } };

const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'cites.js'), 'utf8'), ctx);
const CITES = vm.runInContext('CITES', ctx);

// ── Quran ──
const quran = { editions: {}, verses: {} }; Object.keys(QURAN).forEach(l => { quran.editions[l] = { id: QURAN[l][0], by: QURAN[l][1] }; });
const refs = [...new Set(CITES.filter(c => c.c === 'quran').map(c => c.n))];
let qMiss = 0;
for (const ref of refs) {
  const m = /^(\d+):(\d+)(?:[-–](\d+))?$/.exec(ref); if (!m) { quran.verses[ref] = { note: 'a whole surah: quoted by name, not by text' }; continue; }
  const s = +m[1], a = +m[2], b = +(m[3] || m[2]); quran.verses[ref] = {};
  for (const l of Object.keys(QURAN)) {
    const parts = [];
    for (let v = a; v <= b; v++) { const d = J(get('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/' + QURAN[l][0] + '/' + s + '/' + v + '.json')); if (d && d.text) parts.push(String(d.text).replace(/\s+/g, ' ').trim()); else qMiss++; }
    if (parts.length === b - a + 1) quran.verses[ref][l] = parts.join(' ');
  }
}
fs.writeFileSync(path.join(OUT, 'quran.json'), JSON.stringify(quran, null, 1));
console.log('quran: ' + refs.length + ' references × ' + Object.keys(QURAN).length + ' editions, ' + qMiss + ' verses missing');

// ── Hadith ──
const hadith = {}, whole = {}; let hMiss = [];
function book(ed) { if (!whole[ed]) { const d = J(get('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/' + ed + '.min.json')); whole[ed] = (d && d.hadiths) || []; } return whole[ed]; }
for (const c of CITES) {
  if (c.c === 'quran') continue; const key = c.c + ':' + c.n; if (hadith[key]) continue;
  const b = BOOK[c.c]; if (!b) { hadith[key] = { note: 'this collection is not in the API: check against a printed edition' }; hMiss.push(key); continue; }
  const num = parseFloat(c.n), e = {};
  for (const [lang, ed] of [['ar', 'ara-' + b], ['en', 'eng-' + b]]) {
    const list = book(ed);
    // Muslim: the app cites Abdul Baqi numbers, which the API keeps as arabicnumber; the other books match on hadithnumber
    // (a number in Muslim can cover several narrations; the fullest one is the one a sentence in the app is most likely drawn from)
    const hit = b === 'muslim' ? list.filter(h => Math.floor(h.arabicnumber) === num && h.text).sort((x, y) => y.text.length - x.text.length)[0] : list.find(h => h.hadithnumber === num);
    if (hit && hit.text) e[lang] = String(hit.text).replace(/\s+/g, ' ').trim();
  }
  if (!e.ar) hMiss.push(key);
  hadith[key] = e;
}
fs.writeFileSync(path.join(OUT, 'hadith.json'), JSON.stringify(hadith, null, 1));
console.log('hadith: ' + Object.keys(hadith).length + ' references, ' + hMiss.length + ' without an Arabic text from the API' + (hMiss.length ? ' (' + hMiss.slice(0, 12).join(', ') + (hMiss.length > 12 ? ' …' : '') + ')' : ''));
