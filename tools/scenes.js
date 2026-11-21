// The sample pilgrims and the screens the tools open: tools/site-shots.js photographs them for the
// product page, tools/i18n-extract.js reads their text for the language packs.
module.exports = function (VERSION) {
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
const AT = t => Date.parse('2027-03-21T' + t + ':00+03:00');
const ULOG = [{ n: 1, log: { ihram: AT('05:40'), tawafStart: AT('09:10'), tawafEnd: AT('09:58'), saiStart: AT('10:20'), saiEnd: AT('11:12'), halq: AT('11:40'), done: AT('11:40') } }];
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
  ['learn', PLAN, '2027-01-22T10:15:00', "goTab('plan','learn')"],
  ['flashcard', PLAN, '2027-01-22T10:15:00', "goTab('plan','learn','fcCard');startFC()", null, '#fcCard'],
  ['scams', PLAN, '2027-01-22T10:15:00', "goTab('plan','learn','scamCard')", null, '#scamCard'],
  ['sisters', Object.assign({}, PLAN, { profile: 'w', name: 'Aisha' }), '2027-01-22T10:15:00', "goTab('plan','learn','sisCard')", null, '#sisCard'],
  ['hajj-learn', HJ, '2027-04-10T10:15:00', "goTab('plan','learn')"],
  ['kids', PLAN, '2027-01-22T10:15:00', "goTab('plan','quiz');startKids()", null, '#kidsCard'],
  ['story', PLAN, '2027-01-22T10:15:00', "goTab('plan','quiz');openStory(KIDS_STORIES[0].id)", null, '#kidsCard'],
  ['leave', PLAN, '2027-03-19T09:00:00', TICK_PLAN + "goTab('home')"],
  ['hotel', PLAN, '2027-01-22T10:15:00', "goTab('plan','prep','hotelCard')", null, '#hotelCard'],
  ['vault', PLAN, '2027-01-22T10:15:00', "goTab('plan','prep','vaultCard')", null, '#vaultCard'],
  // ── The rites ──
  ['walk', UM, '2027-03-21T09:30:00', "goTab('umrah','steps');startWalk()"],
  ['duas', UM, '2027-03-24T13:30:00', "goTab('more','duas')"],
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
  ['getting-around', UM, '2027-03-27T13:30:00', "goTab('places');goSheet('go-haramain')"],
  ['boundary', HJ, '2027-05-15T11:00:00', "goTab('places');waySheet('bound-arafah')", { 'us-hajj': H9 }],
  ['qibla', UM, '2027-03-24T13:30:00', "goTab('daily','tools','qiblaCard')", null, '#qiblaCard'],
  ['keepsake', UM, '2027-03-24T13:30:00', "goTab('daily','stats');makeKeepsake(1)"],
  ['essentials', Object.assign({}, UM, { essentials: true }), '2027-03-24T13:30:00', "goTab('home')"],
  // ── Safety and family ──
  ['meds', UM, '2027-03-24T13:30:00', "goTab('more','settings','meCard');medSheet(0)"],
  ['checkin', UM, '2027-03-24T13:30:00', "showCheckin()"],
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
const ONE = new Set(['focus-tawaf', 'dua-reader', 'lost', 'help', 'phrase', 'child-card', 'camp-card', 'driver', 'checkin']);
  return { SCENES, ONE, ULOG, DUAS, JR, UM, HJ, RAM, PLAN, HOTEL, H9, TICK_PLAN, TICK_DAILY };
};
