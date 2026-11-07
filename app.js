/* Miqah — application logic */
/* Release note: bump APP_VERSION here AND in sw.js for every release (the SW cache name is derived from it). */
var APP_VERSION='6.3.2';
var APP_URL='https://umrah-strivers.vercel.app/';
/* prefers-reduced-motion: JS motion (confetti, the % count-up, smooth scrolling) honours it like the CSS does */
var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
function smooth(){return RM.matches?'auto':'smooth';}
/* ════════════════════════ MARKS ════════════════════════ */
/* Marks: one small inline-SVG set (24x24, 1.5px stroke, currentColor) drawn in the line style of the Kaaba mark.
   Heroes, segment labels, stage cards, card titles, counter titles, the journey chip and the onboarding rows carry these instead of emoji;
   content rows (checklist items, places, FAQ, toasts) keep their emoji. Colour comes from context: lavender on aubergine, --brand-2 on paper (see .mk in index.html). */
var MARKS={
  kaaba:'<path d="M4 8.5h13v12H4z"/><path d="M4 8.5l3-3h13v12l-3 3"/><path d="M4 12h13m0 0l3-3"/><path d="M12.5 20.5v-5h2.5v5"/>',
  tent:'<path d="M2 19L8.5 6.5h7L22 19z"/><path d="M9 19l3-6 3 6"/><path d="M8.5 6.5L12 13l3.5-6.5"/>',
  hills:'<path d="M2 19h20"/><path d="M3 19c2.5-7 4.5-10 7.5-10s4 5.5 6 5.5 3-4.5 6-4.5"/>',
  mount:'<path d="M2 20L9 7l4 6 2.5-3L22 20z"/><path d="M2 20h20"/>',
  dome:'<path d="M5 14a7 7 0 0 1 14 0"/><path d="M3 14h18"/><path d="M5 14v6h14v-6"/><path d="M12 7V4"/><path d="M10.5 20v-2.5a1.5 1.5 0 0 1 3 0V20"/>',
  pin:'<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  tack:'<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  beads:'<circle cx="12" cy="11" r="7.5" stroke-dasharray=".1 3.7" stroke-width="2.6"/><path d="M12 18.5v3"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  star:'<path d="M15 4.6A8 8 0 1 0 15 19.4 7 7 0 0 1 15 4.6z"/><path d="M17.5 9l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.5 2.1-.3z"/>',
  scroll:'<path d="M6 4h12a2 2 0 0 1 2 2v1H8v10a2 2 0 0 1-4 0V6a2 2 0 0 1 2-2z"/><path d="M8 17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><path d="M11 10.5h6M11 13.5h6"/>',
  hands:'<path d="M11 20.5c-4.5 0-8-3-8-7V9.5a1.5 1.5 0 0 1 3 0V13"/><path d="M13 20.5c4.5 0 8-3 8-7V9.5a1.5 1.5 0 0 0-3 0V13"/><path d="M6 13V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M18 13V6.5a1.5 1.5 0 0 0-3 0V12"/><path d="M9 11.5V4.5a1.5 1.5 0 0 1 2-1.4"/><path d="M15 11.5V4.5a1.5 1.5 0 0 0-2-1.4"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 .9-3.6 2-4.6 0 1.6.6 2.6 1.6 3.1C10.6 8.5 11.3 6 12 3z"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  bus:'<rect x="4" y="4" width="16" height="14" rx="2"/><path d="M4 11h16M8 18v2M16 18v2M8 14.5h1M15 14.5h1"/>',
  bag:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 7v13M16 7v13"/>',
  plane:'<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
  sprout:'<path d="M12 21v-8"/><path d="M12 13c0-4.4 3.1-7 8-7 0 4.4-3.1 7-8 7z"/><path d="M12 16c0-3.3-2.4-5.5-6-5.5 0 3.3 2.4 5.5 6 5.5z"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h1M4 12h1M4 18h1"/>',
  car:'<path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1"/><path d="M6 20v1M18 20v1M7 18h1M16 18h1"/>',
  sos:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  cards:'<rect x="7" y="3" width="13" height="16" rx="2"/><path d="M4 7v12a2 2 0 0 0 2 2h10"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  kid:'<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7"/><path d="M12 16.5v.5"/>',
  hotel:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/><path d="M10 21v-3h4v3"/>',
  stone:'<path d="M9 4.5l6-.5 5 4.5-.5 7-5.5 4.5-6.5-2-3-6z"/><path d="M9 4.5l3.5 5.5 7.5-1M12.5 10l-2 8.5"/>',
  wave:'<path d="M8 13V7a1.5 1.5 0 0 1 3 0v5"/><path d="M11 12V5a1.5 1.5 0 0 1 3 0v7"/><path d="M14 12V6a1.5 1.5 0 0 1 3 0v8"/><path d="M8 13l-1.5-2a1.5 1.5 0 0 0-2.5 1.5l3 5.5A5 5 0 0 0 11.3 21H13a4 4 0 0 0 4-4v-3"/>',
  chart:'<path d="M4 20V4M4 20h16"/><path d="M8 15l3-4 3 2 5-6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  museum:'<path d="M3 9l9-5 9 5"/><path d="M4 9h16M5 20h14"/><path d="M6 9v11M10 9v11M14 9v11M18 9v11"/>',
  sun:'<path d="M4 18h16"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 7V4M5 11l1.5 1.5M19 11l-1.5 1.5"/>',
  heart:'<path d="M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  /* 'spark' is kept as a name only (the owner retired the sparkle): it draws a circled check, so no sparkle can render anywhere */
  spark:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  starf:'<path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.6l-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  /* 'flower' is drawn as a tulip in profile: at 14px a four-petal bloom read as a sparkle */
  flower:'<path d="M7 5.5V10a5 5 0 0 0 10 0V5.5L14.5 8 12 4.5 9.5 8z"/><path d="M12 15v6"/><path d="M12 19.5c-.4-2.4-2.4-3.9-5-3.9.3 2.4 2.3 3.9 5 3.9z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  medal:'<circle cx="12" cy="14.5" r="5.5"/><path d="M9.2 9.5L6.5 3h4l1.5 3.5L13.5 3h4l-2.7 6.5"/><path d="M9.8 14.7l1.5 1.5 3-3"/>',
  disk:'<path d="M4 5a1 1 0 0 1 1-1h11l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M8 4v5h7V4"/><path d="M7 20v-6h10v6"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
  scissors:'<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><path d="M8.6 8.4L20 17.5M8.6 15.6L20 6.5M12.5 12l1.6 1.3"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  grid:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
  group:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7"/><path d="M17.5 14a6 6 0 0 1 4 6"/>',
  cross:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M12 3v2"/>',
  share:'<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
  alert:'<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5"/><path d="M12 17.2v.3"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/>',
  speaker:'<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z"/><path d="M16.5 9a4.5 4.5 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/>',
  pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/><path d="M12 20h8"/>',
  antenna:'<path d="M12 21v-9"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M8 14a5.5 5.5 0 0 1 0-8"/><path d="M16 14a5.5 5.5 0 0 0 0-8"/><path d="M5.5 16.5a9 9 0 0 1 0-13"/><path d="M18.5 16.5a9 9 0 0 0 0-13"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  question:'<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4"/><path d="M12 17v.2"/>',
  chevr:'<path d="M9.5 6l6 6-6 6"/>',chevl:'<path d="M14.5 6l-6 6 6 6"/>',chevd:'<path d="M6 9.5l6 6 6-6"/>',chevu:'<path d="M6 14.5l6-6 6 6"/>',close:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',expand:'<path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15"/>',plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h13.5"/><path d="M13 6.5l5.5 5.5-5.5 5.5"/>',ext:'<path d="M8 16L17 7"/><path d="M9 7h8v8"/>',
  image:'<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 15.5l-4.5-4.5-8.5 8"/>',
  bulb:'<path d="M9.5 17.5h5M10.5 20.5h3"/><path d="M12 3.5a5.5 5.5 0 0 0-3.2 10c.7.5 1.2 1.3 1.2 2.2v.3h4v-.3c0-.9.5-1.7 1.2-2.2A5.5 5.5 0 0 0 12 3.5z"/>',
  lr:'<path d="M4 12h16"/><path d="M7.5 8.5L4 12l3.5 3.5"/><path d="M16.5 8.5L20 12l-3.5 3.5"/>',
  print:'<path d="M7 8V3.5h10V8"/><path d="M5 8h14a1.5 1.5 0 0 1 1.5 1.5V16H17v4.5H7V16H3.5V9.5A1.5 1.5 0 0 1 5 8z"/><path d="M7 13h10"/>'
};
/* mk('tent') → the inline SVG; cls adds classes (mkt = text-leading, with a right margin) */
function mk(n,cls){var p=MARKS[n];if(!p)return '';return '<svg class="mk mk-'+n+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+p+'</svg>';}
/* emoji → mark (keys without the VS16 selector) */
var EMOJI_MK={'🕋':'kaaba','⛺':'tent','⛰':'hills','🏔':'mount','🕌':'dome','📍':'pin','📌':'tack','📚':'book','📓':'book','📖':'book','📿':'beads','🌙':'moon','📜':'scroll','🤲':'hands','🔥':'flame','💧':'drop','🧭':'compass','🚌':'bus','🧳':'bag','✈':'plane','🛫':'plane','🌱':'sprout','🔄':'refresh','🔁':'refresh','📋':'list','🚕':'car','🚗':'car','🆘':'sos','🗓':'calendar','📅':'calendar','🃏':'cards','🔐':'lock','🧒':'kid','🧠':'quiz','🏨':'hotel','🪨':'stone','🚶':'stone','👋':'wave','📈':'chart','⚙':'gear','🏛':'museum','🌅':'sun','🤍':'heart','ℹ':'info','✨':'check','✂':'scissors','🌸':'flower','⏳':'clock','⏱':'clock','⏰':'clock','🕰':'clock','🏅':'medal','🎖':'medal','💾':'disk','🔗':'link','❓':'quiz','🔒':'lock','🔓':'lock','🟩':'grid','👥':'group','👨‍👩‍👧':'group','🩺':'cross','🛂':'scroll','🚨':'sos','🎉':'medal','⭐':'starf','🌟':'starf','❌':'close','🕰':'clock','💛':'heart','⚖':'book','🎴':'cards','🏢':'hotel','🚓':'car','🤝':'hands','☎':'phone','📞':'phone','🗺':'map','✅':'check','💝':'heart','🔊':'speaker','🎯':'tack','🔔':'bell','📤':'share','📸':'share','🧕':'kid','🚶‍♀':'stone','💪':'wave','⚠':'alert','🗑':'trash','✍':'pen','📡':'antenna','❓':'question','🏥':'cross','❤':'heart','🚨':'sos','🏆':'medal','👳':'kid','🖨':'print','🖼':'image','💡':'bulb','🏠':'museum','🏘':'museum','🏙':'pin','🚩':'dome','🚪':'dome','🌌':'star','🍽':'pin','🏞':'hills','🌄':'mount','🌴':'sprout','🌳':'sprout','🌿':'sprout','🌹':'flower','🚂':'bus','🚄':'bus','🛍':'bag','🧵':'kaaba','🛡':'book','📲':'share','📥':'disk','🔍':'quiz','🐢':'stone','⬆':'refresh','⬇':'disk','☎':'phone','🎫':'calendar'};
/* one leading emoji (+ variation selectors / ZWJ sequences) and the space after it; "✓" (2713) is kept */
var EMOJI_RE=/^\s*(?:[☀-✒✔-➿⬆⬇]|[\ud83c-\ud83e][\udc00-\udfff])(?:[️‍]|[\ud83c-\ud83e][\udc00-\udfff]|[☀-➿])*\s*/;
function stripEmoji(s){return String(s==null?'':s).replace(EMOJI_RE,'');}
/* every colour emoji (not the ✓ ✕ → chrome glyphs, which become stroke marks) */
var EMO_RE=/(?:[⌚⌛⏩-⏺☀-✒✗-➿⬆⬇⬛⬜⭐]|[\ud83c-\ud83e][\udc00-\udfff])(?:[️‍]|[\ud83c-\ud83e][\udc00-\udfff]|[☀-➿])*/g;
function dropEmoji(s){return String(s==null?'':s).replace(EMO_RE,'').replace(/[ \t]{2,}/g,' ').replace(/(<(?:h1|h2|li)>)\s+/g,'$1');}
function leadEmoji(s){var m=EMOJI_RE.exec(String(s==null?'':s));return m?m[0].replace(/[\s️]/g,''):'';}
/* emk('⛺') → 'tent' (a mark name for an emoji; fb when unknown) */
function emk(e,fb){return EMOJI_MK[String(e==null?'':e).replace(/[\s️]/g,'')]||fb||'';}
/* mkOr('🕋','kaaba') → the mark's SVG, or the emoji itself when it has no mark and no fallback (content tiles keep their glyph) */
function mkOr(e,fb){var n=emk(e,fb);return n?mk(n):String(e==null?'':e);}
/* markify('⛺ Hajj 1448') → tent mark + 'Hajj 1448' (text-leading mark; the emoji is stripped even when it has no mark) */
function markify(s,cls){var n=emk(leadEmoji(s));return (n?mk(n,cls||'mkt'):'')+stripEmoji(s);}
/* static markup declares its mark with data-mk="name" (segment labels, view titles, onboarding rows, counter titles); filled once at start-up */
function fillMarks(root){var els=(root||document).querySelectorAll('[data-mk]');for(var i=0;i<els.length;i++){var el=els[i];if(el.querySelector('.mk'))continue;var tile=el.classList.contains('mk-i')||el.classList.contains('kaaba-i');el.insertAdjacentHTML('afterbegin',mk(el.getAttribute('data-mk'),tile?'':'mkt'));}}
/* ════════════════════════ STATE ════════════════════════ */
/* J-01: every new key has a default here so Object.assign over an old blob fills it — no migration writes.
   journey 'umrah'|'hajj'; hajjType tamattu|qiran|ifrad (Settings, never asked at onboarding); hajjYear/hajjD8 cache the Gregorian date of 8 Dhul Hijjah;
   hajjShift −1|0|+1 absorbs moon-sighting differences; hlog = Hajj stamps (separate from ST.log so finishUmrah never wipes it); rami = pebbles per day; camp = Mina camp / maktab / leader;
   hajjTypeConfirmed = the halq gate has asked "what did you say at the miqat?"; stay13 = staying for the 13th; tmode = the tawaf counter's target (TM); tmAuto = the Hajj year whose counter was moved to ifadah mode once */
var ST={day:1,tripLen:10,theme:'light',tab:'home',dep:'',umrahs:0,tawaf:0,sai:0,quizBest:0,city:'Makkah',journey:'umrah',hajjType:'tamattu',hajjYear:null,hajjD8:'',hajjShift:0,hajjs:0,hajjsPrev:0,hlog:{},rami:{},camp:{n:'',m:'',l:'',p:''},hajjTypeConfirmed:false,stay13:false,tmAuto:0};
var TRIP_MAX=45;
var tasbih={};
var planChk={},riteChk={},dailyChk={},placeVis={},earned={},hajjChk={};

function loadAll(){
  try{
    var s=localStorage.getItem('us-settings');if(s)ST=Object.assign(ST,JSON.parse(s));
    if(!ST.camp||typeof ST.camp!=='object')ST.camp={n:'',m:'',l:'',p:''};if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};if(!ST.rami||typeof ST.rami!=='object')ST.rami={};
    planChk=JSON.parse(localStorage.getItem('us-plan')||'{}');
    riteChk=JSON.parse(localStorage.getItem('us-rites')||'{}');
    hajjChk=JSON.parse(localStorage.getItem('us-hajj')||'{}');if(!hajjChk||typeof hajjChk!=='object')hajjChk={};
    dailyChk=JSON.parse(localStorage.getItem('us-daily')||'{}');
    placeVis=JSON.parse(localStorage.getItem('us-places')||'{}');
    earned=JSON.parse(localStorage.getItem('us-badges')||'{}');
    tasbih=JSON.parse(localStorage.getItem('us-tasbih')||'{}');
    routeSel=JSON.parse(localStorage.getItem('us-route')||'{}');if(!routeSel||typeof routeSel!=='object'||Array.isArray(routeSel))routeSel={};
  }catch(e){}
  migrateHotel();
}
function saveST(){localStorage.setItem('us-settings',JSON.stringify(ST));}
function save(k,o){localStorage.setItem(k,JSON.stringify(o));}

/* ════════════════════════ GENERIC UI ════════════════════════ */
function toast(m,gold,actLabel,actFn){var c=document.getElementById('toastC');if(!c)return;var t=document.createElement('div');t.className='toast'+(gold?' gold':'')+(actLabel?' act':'');t.setAttribute('role','status');var tm=String(m==null?'':m),tn=emk(leadEmoji(tm),'');tm=stripEmoji(tm);if(/^✓\s*/.test(tm)){tn=tn||'check';tm=tm.replace(/^✓\s*/,'');}t.innerHTML=(tn?mk(tn,'mkt'):'')+'<span>'+esc(tm)+'</span>';
  if(actLabel){var b=document.createElement('button');b.textContent=actLabel;b.onclick=function(){t.remove();if(actFn)actFn();};t.appendChild(b);}
  while(c.children.length>=3)c.firstChild.remove();
  c.appendChild(t);setTimeout(function(){t.remove();},actLabel?6000:3200);}
function totalUmrahs(){return (ST.umrahs||0)+(ST.umrahsPrev||0);}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function numWord(n){var W=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];return W[n]||String(n);}
function fmtDate(iso,long){var d=new Date(iso+'T00:00:00');if(isNaN(d))return iso;return d.toLocaleDateString('en-GB',long?{day:'numeric',month:'long',year:'numeric'}:{day:'numeric',month:'short'});}
/* days until departure (null when unset); onTrip = departed and not yet past the trip length */
function depDays(){if(!ST.dep)return null;return Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);}
function onTrip(){var d=depDays();return d!==null&&d<=0&&d>=-ST.tripLen;}
/* share plain text via the OS sheet → clipboard → toast */
function shareText(title,text,url){var data={title:title,text:text};if(url)data.url=url;
  if(navigator.share){navigator.share(data).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(text+(url?' '+url:'')).then(function(){toast('📋 Copied — paste it into your group chat');}).catch(function(){toast(url||'Copy failed');});}
  else toast(url||text.slice(0,80));}
/* brother/sister profile (P-10): who:'m'|'w' rows are shown & counted only for the matching profile.
   J-02: rows may also carry j:'hajj'|'umrah' (journey) and ht:['tamattu',…] (Hajj type) — one gate for PLAN, RITES, HAJJ_RITES, DAILY, DUAS, QUIZ_LEVELS and the knowledge arrays */
function journey(){return ST.journey==='hajj'?'hajj':'umrah';}
function hajjType(){return (typeof HAJJ_TYPES!=='undefined'&&HAJJ_TYPES[ST.hajjType])?ST.hajjType:'tamattu';}
function forMe(it){return (!it.who||!ST.profile||it.who===ST.profile)&&(!it.j||it.j===journey())&&(!it.ht||it.ht.indexOf(hajjType())>-1);}
function setProfile(v){ST.profile=v||'';saveST();applyProfile();renderPlan();updPlan();renderRites();updRites();vib(8);}
function applyProfile(){document.querySelectorAll('#profSeg button,#obProf button,#obProf2 button,#obProf3 button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-p')||'')===(ST.profile||''));});}
function profSegHTML(id){return '<div class="segmini" id="'+id+'"><button data-p="m" onclick="setProfile(\'m\')">Brother</button><button data-p="w" onclick="setProfile(\'w\')">Sister</button><button data-p="" onclick="setProfile(\'\')">Both</button></div>';}
function textSwHTML(id){return '<button class="sw" id="'+id+'" role="switch" aria-checked="false" aria-label="Larger text" onclick="setText(ST.text===\'lg\'?\'\':\'lg\')"></button>';}

/* ════════════════════════ HAJJ CALENDAR (J-03) ════════════════════════ */
/* Umrah stays anchored to ST.dep (depDays/onTrip/expectedDay untouched). The days of Hajj anchor to the Hijri calendar: Intl 'islamic-umalqura' only goes Gregorian → Hijri,
   so hajjD8() walks the days around a guess until it finds 8/12/<year>, caches the hit in ST, and falls back to the HAJJ_D8 table. ST.hajjShift (−1|0|+1) absorbs a moon-sighting difference. */
function hijriYMD(d){try{var p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric',timeZone:'Asia/Riyadh'}).formatToParts(d),o={};p.forEach(function(x){o[x.type]=x.value;});var y=parseInt(o.year),m=parseInt(o.month),dd=parseInt(o.day);return (y&&m&&dd)?{y:y,m:m,d:dd}:null;}catch(e){return null;}}
function isoOf(dt){return dt.getFullYear()+'-'+('0'+(dt.getMonth()+1)).slice(-2)+'-'+('0'+dt.getDate()).slice(-2);}
function addDays(iso,n){var d=new Date(iso+'T00:00:00');d.setDate(d.getDate()+n);return isoOf(d);}
/* whole days from today (Makkah's calendar day, like the Hajj dates themselves) to a Gregorian date */
function daysUntil(iso){var n=riyadhNow();n.setHours(0,0,0,0);return Math.round((new Date(iso+'T00:00:00')-n)/86400000);}
function hajjD8(y){
  y=parseInt(y);if(!y)return '';
  if(ST.hajjYear===y&&ST.hajjD8)return ST.hajjD8;
  var T=(typeof HAJJ_D8!=='undefined')?HAJJ_D8:{},guess=T[y]||'';
  if(!guess){var ks=Object.keys(T).map(Number),k=ks[0];ks.forEach(function(x){if(Math.abs(x-y)<Math.abs(k-y))k=x;});guess=k?addDays(T[k],Math.round((y-k)*354.367)):isoOf(new Date());}
  var found='';
  for(var i=-40;i<=40&&!found;i++){var iso=addDays(guess,i),h=hijriYMD(new Date(iso+'T09:00:00Z'));if(h&&h.y===y&&h.m===12&&h.d===8)found=iso;}
  if(!found)found=T[y]||guess;
  ST.hajjYear=y;ST.hajjD8=found;saveST();
  return found;
}
/* {8:'YYYY-MM-DD',…,13:…} — the Gregorian dates of 8..13 Dhul Hijjah of Hijri year y, shifted by ST.hajjShift */
function hajjDates(y){var d8=hajjD8(y),sh=parseInt(ST.hajjShift)||0,o={};if(!d8)return o;for(var n=8;n<=13;n++)o[n]=addDays(d8,n-8+sh);return o;}
/* the Hijri year whose Hajj a pilgrim flying on dep (or today) is going to: past 13 Dhul Hijjah means next year's */
function hajjYearFor(dep){var dt=dep?new Date(dep+'T09:00:00Z'):new Date();if(isNaN(dt))dt=new Date();var h=hijriYMD(dt);
  if(h)return (h.m===12&&h.d>13)?h.y+1:h.y;
  var iso=isoOf(dt),T=(typeof HAJJ_D8!=='undefined')?HAJJ_D8:{},ks=Object.keys(T).map(Number).sort(function(a,b){return a-b;});
  for(var i=0;i<ks.length;i++){if(addDays(T[ks[i]],5)>=iso)return ks[i];}return ks.length?ks[ks.length-1]:0;}
function curHajjYear(){return hajjYearFor(ST.dep||'');}
/* 8..13 on a day of Hajj, 'pre' before the 8th, 'post' after the 13th, null outside Hajj mode — a calendar hint, never a verdict */
function hajjDay(){if(journey()!=='hajj')return null;var D=hajjDates(curHajjYear());if(!D[8])return null;var t=isoOf(riyadhNow());if(t<D[8])return 'pre';if(t>D[13])return 'post';for(var n=8;n<=13;n++)if(D[n]===t)return n;return 'pre';}
var DH_NAME={8:'Tarwiyah',9:'Arafah',10:'Yawm an-Nahr',11:'Tashriq · 1st day',12:'Tashriq · 2nd day',13:'Tashriq · 3rd day'},DH_SHORT={8:'Mina',9:'Arafah',10:'Nahr',11:'Tashriq',12:'Tashriq',13:'Tashriq'};
function hajjHint(y){var D=hajjDates(y);if(!D[8])return '';return '8–13 Dhul Hijjah '+y+' ≈ '+fmtDate(D[8])+' – '+fmtDate(D[13],true)+' · Arafah '+fmtDate(D[9]);}
/* a Hajj trip must still be "on trip" through the 13th: lengthen a too-short default trip, never shorten one the pilgrim set */
function hajjFitTrip(){if(journey()!=='hajj'||!ST.dep)return;var D=hajjDates(curHajjYear());if(!D[13])return;var need=Math.round((new Date(D[13]+'T00:00:00')-new Date(ST.dep+'T00:00:00'))/86400000)+3;need=Math.max(3,Math.min(TRIP_MAX,need));
  if(need>ST.tripLen){ST.tripLen=need;if(ST.day>need)ST.day=need;saveST();var t=document.getElementById('tripLen');if(t)t.value=need;}}
function setHajjShift(v){v=Math.max(-1,Math.min(1,parseInt(v)||0));ST.hajjShift=v;delete ST.hajjConf;saveST();applyJourney();updDaily();homeRefresh();vib(8);
  /* (review) the toast speaks from the pilgrim's side: what today now is, not which way the table moved */
  var hd=hajjDay(),D=hajjDates(curHajjYear());toast(typeof hd==='number'?'📅 Today is now '+hd+' Dhul Hijjah · Arafah '+fmtDate(D[9]):v?'📅 Hajj days shifted — Arafah on '+fmtDate(D[9]):'📅 Hajj days follow the Umm al-Qura calendar');}
/* Home: "Today is 9 Dhul Hijjah, correct? ◀ ✓ ▶" — ◀ = the real day is one earlier (shift +1), ▶ = one later (shift −1) */
function hajjShiftBy(d){setHajjShift((parseInt(ST.hajjShift)||0)+d);}
function hajjConfirm(){ST.hajjConf=curHajjYear();saveST();homeRefresh();vib(8);toast('✓ Dhul Hijjah day confirmed');}
function hajjConfReset(){delete ST.hajjConf;saveST();homeRefresh();}
function setHajjType(t){if(!HAJJ_TYPES[t])return;ST.hajjType=t;ST.hajjTypeConfirmed=true;saveST();applyJourney();journeyRefresh();vib(8);toast('⛺ '+HAJJ_TYPES[t].t+' — '+HAJJ_TYPES[t].s);}
/* everything that filters through forMe() is rebuilt when the journey or the Hajj type changes */
function journeyRefresh(){renderPlan();updPlan();renderRites();updRites();renderDuas();buildDeck();renderFC();renderPlaces();updPlaces();renderJourneys();updChip();homeRefresh();}
/* J-05: labels that follow the journey — header tagline, nav label (data-v="umrah" and the ids never change), Rites intro, Settings rows, After card */
function applyJourney(){var HJ=journey()==='hajj',y=HJ?curHajjYear():0;
  var tg=document.querySelector('.brand h1 small');if(tg)tg.textContent=HJ?'Hajj '+y+' companion':'Hajj & Umrah companion';
  var nl=document.querySelector('.nav button[data-v="umrah"] .l');if(nl)nl.textContent=HJ?'Hajj':'Umrah';
  var hk=document.querySelector('#riteHero .k');if(hk)hk.innerHTML=mk(HJ?'tent':'kaaba','mkt')+(HJ?'Hajj · live':'Umrah · live');
  var vp=document.getElementById('umrahVhP');if(vp)vp.textContent=HJ?'Part 1 — your Umrah. Part 2 — the five days of Hajj. Counters keep count for you.':'Every step from miqat to halq — with counters that keep count for you.';
  var jl=document.getElementById('journeyLbl');if(jl)jl.innerHTML=markify(HJ?'⛺ Hajj '+y+' · '+HAJJ_TYPES[hajjType()].t:'🕋 Umrah');
  var hs=document.getElementById('hajjSet');if(hs)hs.hidden=!HJ;var cc=document.getElementById('campCard');if(cc)cc.hidden=!HJ;
  document.querySelectorAll('#hajjTypeSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-ht')===hajjType());});
  var sh=String(parseInt(ST.hajjShift)||0);document.querySelectorAll('#hajjShiftSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-s')===sh);});
  var sl=document.getElementById('hajjShiftLbl');if(sl&&HJ){var D=hajjDates(y);sl.textContent='Moon sighting can move the days by one · Arafah on '+fmtDate(D[9],true)+(ST.hajjShift?' (shifted '+(ST.hajjShift>0?'+1':'−1')+')':'');}
  var ph=document.getElementById('postH3');if(ph)ph.innerHTML=markify('🌱 After '+(HJ?'Hajj':'Umrah')+' — keep it alive');
  var hn=document.getElementById('hajjNote');if(hn)hn.hidden=!HJ;
  loadCamp();renderJourneys();updChip();}
/* optional PLAN sections (P-32): sec.opt names an ST flag */
function activePlan(){return PLAN.filter(function(sc){return !sc.opt||ST[sc.opt];});}
function findPlanItem(id){var f=null;PLAN.forEach(function(sc){sc.items.forEach(function(it){if(it.id===id)f=it;});});return f;}
/* counts: with a profile, mismatched rows vanish; with no profile, gendered rows are visible but only count once ticked */
function planCounts(items){var tot=0,done=0;items.forEach(function(it){if(!forMe(it))return;var on=!!planChk[it.id];if(it.who&&!ST.profile&&!on)return;tot++;if(on)done++;});return {tot:tot,done:done};}
function planTotals(){var tot=0,done=0,secs={};activePlan().forEach(function(sc){var c=planCounts(sc.items);secs[sc.id]=c;tot+=c.tot;done+=c.done;});return {tot:tot,done:done,secs:secs,pct:tot?Math.round(done/tot*100):0};}
function riteCounts(steps,chk){chk=chk||riteChk;var tot=0,done=0,seen={};steps.forEach(function(st){if(!riteVis(st))return;var on=!!chk[st.id];
  if(st.pair&&!ST.profile){if(seen[st.pair])return;seen[st.pair]=true;tot++;if(steps.some(function(x){return x.pair===st.pair&&chk[x.id];}))done++;return;}
  if(st.who&&!ST.profile&&!on)return;tot++;if(on)done++;});return {tot:tot,done:done};}
function riteTotals(){var tot=0,done=0;RITES.forEach(function(ph){var c=riteCounts(ph.steps);tot+=c.tot;done+=c.done;});return {tot:tot,done:done};}
function togKids(){ST.kids=!ST.kids;saveST();updKidsSw();renderPlan();updPlan();vib(10);if(ST.kids){toast('👨‍👩‍👧 Children’s to-dos added to your timeline');setTimeout(function(){if(document.getElementById('view-plan').classList.contains('on'))openPlanSec('kids');},150);}}
function updKidsSw(){document.querySelectorAll('#kidsSw,#kidsSw2').forEach(function(sw){sw.classList.toggle('on',!!ST.kids);sw.setAttribute('aria-checked',ST.kids?'true':'false');});}
/* text size (M-09) */
function applyText(){document.documentElement.setAttribute('data-text',ST.text||'');document.querySelectorAll('#textSeg button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-t')||'')===(ST.text||''));});document.querySelectorAll('#obText,#obText0,#obText1').forEach(function(o){o.classList.toggle('on',ST.text==='lg');o.setAttribute('aria-checked',ST.text==='lg'?'true':'false');});}
function setText(v){ST.text=v||'';saveST();applyText();vib(8);}
/* generic bottom sheet (reset, image export, certificate name…) */
function openSheet(html){var o=document.getElementById('gSheet'),b=document.getElementById('gSheetBody');if(!o)return;b.innerHTML=html;
  /* the sheet roundel is the aubergine object with a lavender mark: a single leading emoji becomes its mark */
  var sh=b.querySelector('.sheet-h');if(sh&&!sh.querySelector('.mk')&&!sh.classList.contains('kaaba')){var t=sh.textContent.trim(),n=t==='↺'?'refresh':emk(t,'kaaba');sh.innerHTML=mk(n);}
  o.classList.add('on');}
function closeSheet(){var o=document.getElementById('gSheet');if(o)o.classList.remove('on');}
function vib(ms){if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}
function toggleTheme(){ST.theme=ST.theme==='light'?'dark':'light';applyTheme();saveST();}
function applyTheme(){document.documentElement.setAttribute('data-theme',ST.theme);document.getElementById('themeIcon').innerHTML=mk(ST.theme==='dark'?'sun':'moon');var t=document.getElementById('dmTgl');if(t){t.classList.toggle('on',ST.theme==='dark');t.setAttribute('aria-checked',ST.theme==='dark'?'true':'false');}document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',ST.theme==='dark'?'#0B0812':'#F4F2F8');});}
function togSec(el){var sec=el.closest('.sec');sec.classList.toggle('shut');el.setAttribute('aria-expanded',sec.classList.contains('shut')?'false':'true');}
function setRing(id,pct){var el=document.getElementById(id);if(el)el.style.strokeDashoffset=239*(1-Math.min(100,pct)/100);}
function goTab(t,sub,anchor){ST.tab=t;saveST();
  var view=document.getElementById('view-'+t);if(!view)return;
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('on');});
  view.classList.add('on');
  document.querySelectorAll('.nav button').forEach(function(e){var on=e.getAttribute('data-v')===t;e.classList.toggle('on',on);if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');});
  if(sub)goSub(t,sub,true);
  if(t==='daily'){updDaily();updStats();loadPT();renderTB();}
  if(t==='places'){placesSeed();updPlaces();}
  if(t==='umrah')updRites();
  if(t==='plan')updPlan();
  if(t==='home')renderHome();
  updChip();qbAutoStop();
  if(!ST.segNudged&&view.querySelector('.seg')){ST.segNudged=true;saveST();var on=view.querySelector('.seg button.on');if(on)on.classList.add('nudge');}
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='count'&&cntStarted())anchor=cntActive()+'Card';
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='steps'){focusRites(false);var nxr=nextRite();anchor=nxr?'rw-'+nxr.st.id:(hajjPart2Active()?'hajjDone':'riteDone');}
  if(anchor){requestAnimationFrame(function(){setTimeout(function(){jumpTo(anchor,true);},30);});}
  else window.scrollTo({top:0,behavior:smooth()});}
/* deep links used by chips in checklists and knowledge bodies (M-05) */
function goRef(tab,sub,anchor){if(tab==='places')placesReset();goTab(tab,sub||null,anchor||null);}
function placesReset(){var sr=document.getElementById('plSearch');if(sr&&sr.value)sr.value='';if(unvisOnly){unvisOnly=false;var e=document.getElementById('pillUnvis');if(e){e.classList.remove('on');e.setAttribute('aria-pressed','false');}}if(cityFilter!=='all')filterCity('all',true);else renderPlaces();}
function openPlace(id){var p=placeById(id);if(!p)return;placesReset();plShow(id);goTab('places',null,'pl-'+id);}
function openTour(){tourOpen=true;placesReset();var t=document.getElementById('tourCard');if(t){t.classList.add('open');var hd=t.querySelector('.tour-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('places',null,'tourCard');}
function goPost(enable){if(enable&&!ST.post){ST.post=true;saveST();renderPost();}goTab('more','guide','postCard');}
function startPost(){goPost(true);toast('🌱 Post-Umrah mode on — 30 days, 3 habits',true);}
function refChip(it){var q=function(v){return v?'\''+v+'\'':'null';};if(typeof it.go==='string')return '<button class="xchip" onclick="event.stopPropagation();'+it.go+'">'+(it.goL||'Open')+' →</button>';if(it.place)return '<button class="xchip" onclick="event.stopPropagation();openPlace('+q(it.place)+')">'+(it.goL||'📍 Open')+' →</button>';if(it.go)return '<button class="xchip" onclick="event.stopPropagation();goRef('+q(it.go[0])+','+q(it.go[1])+','+q(it.go[2])+')">'+(it.goL||'Open')+' →</button>';return '';}
function mkSec(sec,shut,inner,countId){
  var apps='';
  /* D-05: the tick rows come first; tools are a wrapping row of chips underneath (external ones say they need signal) */
  if(sec.apps)apps='<div class="apps"><span class="apps-h">Helpful tools</span>'+sec.apps.map(function(x){var go=x.u?'href="'+x.u+'" target="_blank" rel="noopener" title="'+esc(x.d||'')+' — opens in browser, needs internet"':'href="#" title="'+esc(x.d||'')+'" onclick="event.preventDefault();goTab(\''+x.go[0]+'\',\''+x.go[1]+'\''+(x.go[2]?',\''+x.go[2]+'\'':'')+')"';return '<a class="applink" '+go+'><span class="app-i">'+x.i+'</span><span class="app-t"><b>'+x.n+'</b></span><span class="app-go">'+(x.u?'Open ↗':'Go →')+'</span></a>';}).join('')+'</div>';
  return '<div class="sec'+(shut?' shut':'')+'" id="sec-'+sec.id+'"><div class="sec-hd" role="button" tabindex="0" aria-expanded="'+(shut?'false':'true')+'" onclick="togSec(this)"><div class="sec-ico">'+(sec.ico?mkOr(sec.ico,''):'•')+'</div><h2>'+sec.title+(sec.sub?'<small>'+sec.sub+'</small>':'')+'</h2><span class="sec-ct" id="sp-'+sec.id+'"></span><span class="sec-chev">▼</span></div><div class="sec-bd">'+(sec.hn?'<div class="note">'+sec.hn+'</div>':'')+inner+apps+'</div></div>';
}

/* ════════════════════════ PLAN ════════════════════════ */
function renderPlan(){
  var h='';
  activePlan().forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      if(!forMe(it))return;
      var exp=it.id==='quiz80'?'Pass all '+numWord(qzVisible().length)+' levels in the Quiz tab (80%+ each). This ticks itself when the circuit is complete.':it.exp;
      inner+='<div class="row" id="pw-'+it.id+'"'+(it.bag?' data-bag="'+it.bag+'"':'')+' role="checkbox" tabindex="0" aria-checked="false" onclick="togPlan(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(exp?'<div class="x">'+exp+'</div>':'')+refChip(it)+'</div></div>';
    });
    if(sec.id==='pack')inner='<div class="pills sm bagpills" style="margin:6px 0 10px;flex-wrap:wrap"><button class="pill on" onclick="event.stopPropagation();bagFilter(this,\'all\')">All</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'ihram\')">'+markify('🤍 Ihram bag')+'</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'carry\')">'+markify('✈️ Carry-on')+'</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'case\')">'+markify('🧳 Suitcase')+'</button></div>'+inner;
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('planContainer').innerHTML=h;
  /* J-02: knowledge topics carry j:'hajj' — gated like every other row */
  LN_CARDS.forEach(function(c){var arr=c[2].filter(forMe),el=document.getElementById(c[1]);if(el)el.innerHTML=accs(arr);lnMeta(c[0],arr);});
  renderRiteTiles();filterLearn();
}
/* accordions (P-19): the header alone toggles, so links and text inside an open topic are usable */
function accs(arr){return arr.map(function(g){return '<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+g.t+' <span class="acc-c">▶</span></div><div class="acc-b">'+g.b+'</div></div>';}).join('');}
function accToggle(h){var a=h.parentNode,o=a.classList.toggle('open');h.setAttribute('aria-expanded',o?'true':'false');}
/* Learn hub: reading sections in reading order (P-13/P-21), topic counts (P-20), search (P-20), rites index (P-14) */
var LN_CARDS=[['knowCard','knowContainer',KNOW],['qaCard','qaContainer',FIQHQA.concat(TROUBLE)],['histCard','histContainer',HISTORY],['virtCard','virtContainer',VIRTUES],['madCard','madContainer',MADINAH],['sisCard','sisContainer',SISTERS],['scamCard','scamContainer',SCAMS]];
var LN_OTHER=['ritesCard','fcCard','lnQuizCard'],lnAuto=null;
function fcText(html){return String(html||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function lnMeta(cardId,arr){var h3=document.querySelector('#'+cardId+' h3');if(!h3)return;var w=0;arr.forEach(function(g){w+=fcText(g.t+' '+g.b).split(' ').length;});var m=h3.querySelector('.lnm');if(!m){m=document.createElement('small');m.className='lnm';h3.appendChild(m);}m.textContent=arr.length+' topics · ≈'+Math.max(1,Math.round(w/200))+' min read';}
function filterLearn(){
  var inp=document.getElementById('lnSearch');if(!inp)return;var q=(inp.value||'').trim().toLowerCase(),none=document.getElementById('lnNone'),shown=[],total=0;
  if(lnAuto&&(!q||lnAuto.textContent.toLowerCase().indexOf(q)<0)){lnAuto.classList.remove('open');var ah=lnAuto.querySelector('.acc-h');if(ah)ah.setAttribute('aria-expanded','false');lnAuto=null;}
  LN_CARDS.forEach(function(c){var card=document.getElementById(c[0]);if(!card)return;var vis=0;
    card.querySelectorAll('.acc').forEach(function(a){var hit=!q||a.textContent.toLowerCase().indexOf(q)>-1;a.hidden=!hit;if(hit){vis++;shown.push(a);}});
    card.classList.toggle('ln-hide',!!q&&!vis);var j=document.querySelector('#lnJumps [data-for="'+c[0]+'"]');if(j)j.classList.toggle('ln-hide',!!q&&!vis);total+=vis;});
  LN_OTHER.forEach(function(id){var e=document.getElementById(id);if(e)e.classList.toggle('ln-hide',!!q);var j=document.querySelector('#lnJumps [data-for="'+id+'"]');if(j)j.classList.toggle('ln-hide',!!q);});
  if(none)none.hidden=!q||total>0;
  if(q&&shown.length===1&&lnAuto!==shown[0]){lnAuto=shown[0];lnAuto.classList.add('open');var hd=lnAuto.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');try{lnAuto.scrollIntoView({behavior:smooth(),block:'center'});}catch(e){}}
}
function renderRiteTiles(){var a=document.getElementById('riteTiles');if(!a)return;
  a.innerHTML=RITES.map(function(ph,i){var t=ph.title.replace(/^Phase \d+ · /,''),n=riteCounts(ph.steps).tot;
    return '<div class="rtile" role="button" tabindex="0" aria-label="Step '+(i+1)+', '+t.replace(/"/g,'')+' — open in the rites guide" onclick="openRitePhase(\''+ph.id+'\')"><span class="i">'+mkOr(ph.ico,'kaaba')+'</span><b>'+t+'</b><small>Step '+(i+1)+' · '+n+' to-dos</small></div>'+(i===0||i===2?'<span class="rarr" aria-hidden="true">→</span>':'')+(i===1?'<span class="rarr dn" aria-hidden="true">↓</span>':'');}).join('');}
function openRitePhase(id){var sc=document.getElementById('sec-'+id);if(sc){sc.classList.remove('shut');var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');}goTab('umrah','steps','sec-'+id);}
/* P-15: hand-off from reading to the quiz — next unlocked level, or the mistakes drill once all are passed */
function lnNextLevel(){for(var i=0;i<QUIZ_LEVELS.length;i++){if(qzVis(i)&&!qzPassed(i))return i;}return -1;}
function renderLearnQuiz(){
  var a=document.getElementById('lnQuizArea'),sb=document.getElementById('lnQuizSub');if(!a)return;
  var next=lnNextLevel(),wc=qzWrongCount(),h;
  if(next<0){sb.textContent='All '+qzVisible().length+' levels passed — mashallah.';h='<div class="lnq"><div class="lvl-n">'+mk('medal')+'</div><div class="t"><b>Circuit complete</b>'+(wc?wc+' question'+(wc===1?'':'s')+' still to master.':'Nothing left to review — go with presence of heart.')+'</div></div><button class="btn'+(wc?' gold':' ghost')+'" onclick="lnQuizGo()">'+(wc?'🔁 Review my mistakes ('+wc+')':'🧠 Open the quiz')+'</button>';}
  else{var L=QUIZ_LEVELS[next],best=qzST.best[next];sb.textContent='Next up: '+L.name+(best!==undefined?' · best so far '+best+'%':'');
    h='<div class="lnq"><div class="lvl-n">'+mkOr(L.icon,'quiz')+'</div><div class="t"><b>'+L.name.split(' · ')[1]+'</b>'+L.desc+' · '+L.qs.length+' questions · 80% unlocks the next level</div></div><button class="btn gold" onclick="lnQuizGo()">🧠 Start '+L.name.split(' · ')[0]+' →</button>';}
  a.innerHTML=h;
}
function lnQuizGo(){var next=lnNextLevel();goTab('plan','quiz');if(next<0){if(qzWrongCount())startMistakes();}else startLevel(next);}
function togPlan(id){planChk[id]=!planChk[id];save('us-plan',planChk);vib(15);if(planChk[id])markPrepDay();updPlan();chkBadges();}
function updPlan(){
  var P=planTotals(),tot=P.tot,done=P.done;
  activePlan().forEach(function(sec){
    sec.items.forEach(function(it){var on=!!planChk[it.id];
      var w=document.getElementById('pw-'+it.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});
    var sp=document.getElementById('sp-'+sec.id),c=P.secs[sec.id];if(sp&&c)sp.textContent=c.done+'/'+c.tot;
  });
  var pct=P.pct;
  animPct('planPct',pct);setRing('planRing',pct);
  document.getElementById('planHeroT').textContent=pct>=100?'Fully prepared — alhamdulillah':pct>=70?'Almost there':pct>=30?'Good progress':pct>0?'Getting started':'Let’s get ready';
  renderTimeline();renderCatTiles();renderWeather();
  var stk=prepStreak(),phn=document.getElementById('planHeroN');if(phn)phn.textContent=done;document.getElementById('planHeroS').textContent='of '+tot+' items ready'+(stk>1?' · '+stk+'-day streak':'');
  updCountdown();
  if(qzActive){qzMeterUpd();renderLearnQuiz();}else renderLevels();
  homeRefresh();
}
function setDep(v){ST.dep=v;saveST();updCountdown();updChip();renderItin();renderTimeline();renderTodayTop();updToolsOrder();renderDuaSec();if(v)toast('✈️ '+fmtDate(v)+' — countdown, timeline & itinerary are now dated',true);}
/* return date (P-05): derives the trip length; #tripLen in Settings stays as a mirror */
function setRet(v){if(!v)return;if(!ST.dep){toast('Set your departure date first');updRetDate();return;}var days=Math.round((new Date(v+'T00:00:00')-new Date(ST.dep+'T00:00:00'))/86400000)+1;if(days<3||days>TRIP_MAX){toast(days<3?'Trips here are at least 3 days — return date adjusted':'Trips here are up to '+TRIP_MAX+' days — return date adjusted');}setTripLen(Math.max(3,Math.min(TRIP_MAX,days)));}
function updRetDate(){var r=document.getElementById('retDate');if(!r)return;if(!ST.dep){r.value='';r.removeAttribute('min');return;}var d=new Date(ST.dep+'T00:00:00');r.min=ST.dep;d.setDate(d.getDate()+(ST.tripLen-1));r.value=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function pickDep(){var inp=document.getElementById('depDate');if(!inp)return;var ok=false;try{if(inp.showPicker){inp.showPicker();ok=true;}}catch(e){}if(!ok){document.getElementById('cdCard').classList.remove('cd2-empty');inp.focus();try{inp.click();}catch(e){}}}
/* jump bar under the Prepare hero (P-06); on trip the trip-time cards come first */
function renderPrepJumps(){var a=document.getElementById('prepJumps');if(!a)return;
  var J=[['niyCard','🤍 Intention'],['cdCard','📅 Countdown'],['tlCard','⏳ Timeline'],['planContainer','✅ Checklists'],['hotelCard','🏨 Hotel & SOS'],['itinCard','🗓️ Itinerary'],['vaultCard','🔐 Vault']];
  if(!ST.dep)J=J.filter(function(j){return j[0]!=='tlCard';});
  if(onTrip()){var first=['hotelCard','vaultCard','itinCard'];J=first.map(function(id){return J.filter(function(j){return j[0]===id;})[0];}).concat(J.filter(function(j){return first.indexOf(j[0])<0;}));}
  a.innerHTML=J.map(function(j){return '<button onclick="jumpTo(\''+j[0]+'\')">'+markify(j[1])+'</button>';}).join('');}
function updCountdown(){
  var n=document.getElementById('cdNum'),t=document.getElementById('cdT'),s=document.getElementById('cdS'),inp=document.getElementById('depDate');
  var card=document.getElementById('cdCard'),niy=document.getElementById('niyCard'),setBtn=document.getElementById('cdSetBtn');
  if(card&&niy){var empty=!ST.dep;card.classList.toggle('cd2-empty',empty);if(setBtn)setBtn.hidden=!empty;
    if(empty&&card.nextElementSibling!==niy)niy.parentNode.insertBefore(card,niy);
    if(!empty&&card.previousElementSibling!==niy)niy.parentNode.insertBefore(card,niy.nextSibling);}
  updRetDate();renderPrepJumps();
  if(ST.dep){inp.value=ST.dep;
    var d=Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);
    var u=document.getElementById('cdU');
    if(d>1){n.textContent=d;u.textContent='days';t.textContent='until departure';s.textContent='Prepare with excellence — the countdown is on.';}
    else if(d===1){n.textContent='1';u.textContent='day';t.textContent='Tomorrow!';s.textContent='Final checks — passport, ihram, dua list.';}
    else if(d===0){n.textContent='🛫';u.textContent='today';t.textContent='Today is the day!';s.textContent='Safe travels — labbayk!';}
    else{n.textContent='🕋';u.textContent='on trip';t.textContent='You’re on your journey';s.textContent='Switch to the Umrah & Daily tabs.';}
  }else{n.textContent='—';document.getElementById('cdU').textContent='days';t.textContent='When do you fly?';s.textContent='Your date unlocks the countdown, a dated to-do timeline, the itinerary and the journey chip.';}
}

/* ════════════════════════ QUIZ (levels) ════════════════════════ */
var qzST={best:{}};
try{qzST=Object.assign(qzST,JSON.parse(localStorage.getItem('us-quiz')||'{}'));}catch(e){}
/* qzActive (P-23) keeps updPlan from wiping a running level; qzPerm (P-27) is the display order of the current options;
   qzOrder shuffles question order on a retake of a passed level; qzMissed (P-26) collects this run's wrong stems */
var qzLevel=0,qzI=0,qzScore=0,qzLock=false,qzHist=[],qzMode='level',qzQueue=[],qzActive=false,qzPerm=[],qzOrder=null,qzMissed=[];
if(!qzST.wrong)qzST.wrong={};
function qzSave(){localStorage.setItem('us-quiz',JSON.stringify(qzST));}
/* J-02: a level may carry j:'hajj' — it is skipped (not counted, not rendered, never gating) outside that journey; indices into QUIZ_LEVELS stay global */
function qzVis(i){var L=QUIZ_LEVELS[i];return !!L&&forMe(L);}
function qzVisible(){return QUIZ_LEVELS.filter(forMe);}
function qzPrevVis(i){for(var k=i-1;k>=0;k--)if(qzVis(k))return k;return -1;}
function qzWrongCount(){return Object.keys(qzST.wrong).filter(function(k){var m=k.match(/^l(\d+)q/);return m&&qzVis(+m[1]);}).length;}
function qzWrongIn(lv){return Object.keys(qzST.wrong).filter(function(k){var m=k.match(/^l(\d+)q/);return m&&+m[1]===lv;}).length;}
function qzShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function curRef(){return qzMode==='level'?{lv:qzLevel,qi:qzOrder?qzOrder[qzI]:qzI}:qzQueue[qzI];}
function curQ(){var r=curRef();return QUIZ_LEVELS[r.lv].qs[r.qi];}
function curKey(){var r=curRef();return 'l'+r.lv+'q'+r.qi;}
function qzTotal(){return qzMode==='level'?QUIZ_LEVELS[qzLevel].qs.length:qzQueue.length;}
function qzPassed(i){return (qzST.best[i]||0)>=80;}
/* P-29: the smallest score that rounds to the 80% pass mark — same formula as nextQz */
function qzNeed(n){for(var k=0;k<=n;k++){if(Math.round(k/n*100)>=80)return k;}return n;}
/* P-30: returning pilgrims (post mode or an Umrah on record) and "Unlock all levels" (qzST.free) open every level */
function qzFreeAll(){return !!(qzST.free||ST.post||totalUmrahs()>=1);}
function qzUnlocked(i){var p=qzPrevVis(i);return p<0||qzPassed(p)||qzFreeAll();}
function qzPassedCount(){var n=0;QUIZ_LEVELS.forEach(function(_,i){if(qzVis(i)&&qzPassed(i))n++;});return n;}
function qzAllPassed(){return qzPassedCount()===qzVisible().length;}
function qzNext(){for(var i=0;i<QUIZ_LEVELS.length;i++){if(qzVis(i)&&qzUnlocked(i)&&!qzPassed(i))return i;}return -1;}
function qzMeterUpd(){var pc=qzPassedCount(),nv=qzVisible().length||1,b=document.getElementById('qzBest');if(b)b.textContent=pc+'/'+nv;var m=document.getElementById('qzMeter');if(m)m.style.width=Math.round(pc/nv*100)+'%';}
function qzLvName(i,part){return QUIZ_LEVELS[i].name.split(' · ')[part===undefined?0:part];}
/* P-26: each level names the Learn card that teaches it */
function qzStudyGo(i){var st=QUIZ_LEVELS[i].study||{};goTab(st.tab||'plan',st.sub||'learn',st.id||'knowCard');}
function qzFree(on){qzST.free=!!on;qzSave();renderLevels();toast(on?'🔓 All levels unlocked — the certificate still needs every level at 80%':'🔒 Guided order restored');vib(8);}
function renderLevels(){
  qzActive=false;
  var h='',wc=qzWrongCount(),nx=qzNext(),cur=qzST.cur,qc=0,qt=0;
  QUIZ_LEVELS.forEach(function(lv,i){if(!qzVis(i))return;qt+=lv.qs.length;qc+=Math.round((qzST.best[i]||0)/100*lv.qs.length);});
  /* P-23: a half-finished level survives tab changes and reloads */
  if(cur&&cur.hist&&cur.hist.length){var L=cur.mode==='mist'?null:QUIZ_LEVELS[cur.lv],tot=cur.mode==='mist'?(cur.queue||[]).length:(L?L.qs.length:0);
    if(tot&&cur.i<=tot)h+='<div class="qz-resume"><div class="t"><b>Resume '+(L?L.name:'Mistake review')+'</b><small>Q'+(Math.min(cur.i,tot-1)+1)+'/'+tot+' · '+cur.score+' ✓ so far</small></div><button class="btn gold" onclick="qzResume()">Resume</button><button class="chip-btn" onclick="qzDiscard()" aria-label="Discard the unfinished level">✕ Discard</button></div>';
    else{delete qzST.cur;qzSave();}}
  /* P-25: one primary answer to "what next?" */
  function qzPill(ey,ln,ic){return '<span class="hs-cw"><small class="hs-ce">'+ey+'</small><span class="hs-ct">'+ln+'</span></span><span class="hs-go">'+mk(ic)+'</span>';}
  if(nx>-1)h+='<button class="btn gold qz-cta" onclick="startLevel('+nx+')">'+qzPill((qzST.best[nx]!==undefined?'Retake':'Continue')+' · '+qzLvName(nx)+'<span class="qzc-n"> · '+QUIZ_LEVELS[nx].qs.length+' questions</span>',qzLvName(nx,1),qzST.best[nx]!==undefined?'refresh':'arrow')+'</button>';
  else if(wc>0)h+='<button class="btn gold qz-cta" onclick="startMistakes()">'+qzPill('Practice','Review '+wc+' mistake'+(wc===1?'':'s'),'refresh')+'</button>';
  else h+='<button class="btn gold qz-cta" onclick="makeCert()">'+qzPill('All levels passed','Download my certificate','medal')+'</button>';
  h+='<div class="qz-sub"><span>'+qc+' of '+qt+' questions correct in your best runs</span>'+(nx>-1&&wc>0?'<button class="chip-btn gsoft" onclick="startMistakes()">🔁 Review '+wc+' mistake'+(wc===1?'':'s')+'</button>':'')+'</div>';
  QUIZ_LEVELS.forEach(function(lv,i){
    if(!qzVis(i))return;
    var un=qzUnlocked(i),ps=qzPassed(i),best=qzST.best[i],w=qzWrongIn(i),need=qzNeed(lv.qs.length);
    h+='<div class="lvl'+(un?'':' locked')+(ps?' passed':'')+(i===nx?' next':'')+'" role="button" tabindex="0"'+(un?'':' aria-disabled="true"')+' aria-label="'+lv.name.replace(/"/g,'')+(ps?', passed '+best+'%':(un?(i===nx?', up next':''):', locked'))+'" onclick="startLevel('+i+')">'
      +'<div class="lvl-n">'+(un?mkOr(lv.icon,'quiz'):mk('lock'))+'</div>'
      +'<div class="lvl-t"><b>'+lv.name+'</b><small>'+lv.desc+' · <span class="ty-nw">'+lv.qs.length+' questions</span> · <span class="ty-nw">pass = '+need+' correct</span>'+(ps&&w?' · <span class="ty-nw">'+w+' to review</span>':'')+'</small>'+(un&&!ps?'<button class="lvl-study" onclick="event.stopPropagation();qzStudyGo('+i+')" aria-label="Study for '+qzLvName(i)+'">📚 study</button>':'')+'</div>'
      +'<div class="lvl-s">'+(ps?'✓ '+best+'%':(best!==undefined?best+'%':(un?'Start →':'Locked')))+'</div></div>';
  });
  if(qzST.free)h+='<p class="qz-free">🔓 All levels unlocked · <button class="lnk" onclick="qzFree(false)">Restore guided order</button></p>';
  else if(qzFreeAll())h+='<p class="qz-free">🔓 All levels open — you have been before.</p>';
  if(qzAllPassed())h+='<div class="note" style="margin-top:10px">🏆 Circuit complete! You have the knowledge — now go with presence of heart. Taqabbal Allah.</div>'+(wc>0?'<button class="btn ghost" onclick="makeCert()">🎖️ Download my certificate</button>':'');
  document.getElementById('qzArea').innerHTML=h;
  qzMeterUpd();renderLearnQuiz();
}
function startLevel(i){
  if(!qzUnlocked(i)){qzLockCard(i);return;}
  qzMode='level';qzLevel=i;qzI=0;qzScore=0;qzHist=[];qzMissed=[];qzActive=true;
  qzOrder=null;if(qzPassed(i)){qzOrder=qzShuffle(QUIZ_LEVELS[i].qs.map(function(_,k){return k;}));}
  delete qzST.cur;qzSave();renderQz();jumpTo('qzArea',true);
}
/* P-30: a locked row explains the gate and offers to open every level */
function qzLockCard(i){var pi=qzPrevVis(i),p=QUIZ_LEVELS[pi],need=qzNeed(p.qs.length);vib([50,40,50]);
  document.getElementById('qzArea').innerHTML='<div class="qz-lock"><div class="big">'+mk('lock')+'</div><h4>'+qzLvName(i)+' is locked</h4><p>Pass '+p.name+' first — '+need+' of '+p.qs.length+' correct (80%). Been before, or want the harder levels now? Open them all; the certificate still needs every level passed.</p><button class="btn gold" onclick="startLevel('+pi+')">▶ Take '+qzLvName(pi)+'</button><button class="btn ghost" onclick="qzFree(true)">🔓 Unlock all levels</button><button class="btn ghost" onclick="renderLevels()">← All levels</button></div>';
  jumpTo('qzArea',true);}
function startMistakes(level){
  qzQueue=Object.keys(qzST.wrong).map(function(k){var m=k.match(/^l(\d+)q(\d+)$/);return m?{lv:+m[1],qi:+m[2]}:null;}).filter(function(x){return x&&qzVis(x.lv)&&QUIZ_LEVELS[x.lv].qs[x.qi]&&(level===undefined||x.lv===level);});
  if(!qzQueue.length){toast('No mistakes to review — mashallah!');return;}
  qzMode='mist';qzI=0;qzScore=0;qzHist=[];qzMissed=[];qzOrder=null;qzActive=true;delete qzST.cur;qzSave();renderQz();jumpTo('qzArea',true);
}
/* P-23: resume state = the next unanswered question */
function qzCurSave(){qzST.cur={mode:qzMode,lv:qzLevel,i:qzHist.length,score:qzScore,hist:qzHist.slice(),queue:qzMode==='mist'?qzQueue:null,order:qzOrder,missed:qzMissed.slice()};}
function qzResume(){var c=qzST.cur;if(!c||!c.hist||!c.hist.length){renderLevels();return;}
  qzMode=c.mode==='mist'?'mist':'level';qzLevel=c.lv||0;qzQueue=(c.queue||[]).filter(function(x){return x&&QUIZ_LEVELS[x.lv]&&QUIZ_LEVELS[x.lv].qs[x.qi];});
  if((qzMode==='level'&&!QUIZ_LEVELS[qzLevel])||(qzMode==='mist'&&!qzQueue.length)){qzDiscard();return;}
  var tot=qzTotal();qzHist=c.hist.slice(0,tot);qzScore=Math.min(c.score||0,qzHist.length);qzMissed=c.missed||[];qzOrder=(c.order&&c.order.length===tot)?c.order:null;qzActive=true;
  if(c.i>=tot){qzI=tot-1;nextQz();return;}
  qzI=Math.max(0,c.i);renderQz();jumpTo('qzArea',true);}
function qzDiscard(){delete qzST.cur;qzSave();renderLevels();}
function qzExit(){if(qzHist.length)qzCurSave();else delete qzST.cur;qzSave();renderLevels();vib(8);}
function qzOpts(q){return q.o?q.o:['True','False'];}
function qzAns(q){return q.o?q.a:(q.a===0?0:1);}
function qzDots(n){var h='';for(var i=0;i<n;i++){h+='<i class="'+(i<qzHist.length?(qzHist[i]?'f':'w'):'')+'"></i>';}return '<div class="qz-dots" role="img" aria-label="Question '+(qzI+1)+' of '+n+'">'+h+'</div>';}
function renderQz(){
  qzLock=false;
  var q=curQ(),tot=qzTotal(),opts=qzOpts(q);
  qzPerm=opts.map(function(_,i){return i;});if(q.o)qzShuffle(qzPerm);
  var head=markify(qzMode==='mist'?'🔁 Mistake review':QUIZ_LEVELS[qzLevel].icon+' '+qzLvName(qzLevel)),need='';
  if(qzMode==='level'){var left=qzNeed(tot)-qzScore,rem=tot-qzI;
    need=left<=0?'<span class="qz-need ok">pass secured ✓</span>':left<=rem?'<span class="qz-need gold">'+left+' more to pass</span>':'<span class="qz-need">keep going — mistakes go to your review list</span>';}
  var h='<div class="qz-top"><span>'+head+' · Q'+(qzI+1)+'/'+tot+(qzMode==='level'?' · '+qzScore+' ✓':'')+'</span><span class="qz-exit" role="button" tabindex="0" onclick="qzExit()">✕ Exit</span></div>'+(need?'<div class="qz-needrow">'+need+'</div>':'')+qzDots(tot)+'<div class="qz-q">'+q.q+'</div>';
  qzPerm.forEach(function(j,i){h+='<button class="qz-o" id="qzo-'+i+'" onclick="answerQz('+i+')">'+(q.o?String.fromCharCode(65+i)+'. ':'')+opts[j]+'</button>';});
  h+='<div id="qzFb" aria-live="polite"></div>';
  document.getElementById('qzArea').innerHTML=h;
}
function answerQz(i){
  if(qzLock)return;qzLock=true;
  var q=curQ(),ans=qzAns(q),ok=qzPerm[i]===ans;
  qzHist.push(ok);
  if(ok){qzScore++;vib(30);delete qzST.wrong[curKey()];}else{vib([60,40,60]);qzST.wrong[curKey()]=1;qzMissed.push(q.q);}
  qzCurSave();qzSave();
  var re=document.getElementById('qzo-'+qzPerm.indexOf(ans));if(re)re.classList.add('right');
  if(!ok)document.getElementById('qzo-'+i).classList.add('wrong');
  document.getElementById('qzFb').innerHTML='<div class="qz-x">'+(ok?mk('check','mkt')+'Correct! ':mk('close','mkt')+'<span class="srx">Not quite. </span>')+q.e+'</div><button class="btn" onclick="nextQz()">'+(qzI<qzTotal()-1?'Next question →':'See my score')+'</button>';
}
function nextQz(){
  if(qzI<qzTotal()-1){qzI++;renderQz();return;}
  qzActive=false;delete qzST.cur;
  if(qzMode==='mist'){
    var cleared=qzScore,tot0=qzQueue.length;qzSave();
    document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+cleared+'/'+tot0+'</div><p>mistakes cleared'+(qzWrongCount()?' — '+qzWrongCount()+' still to master.':' — clean slate, mashallah!')+'</p><button class="btn ghost" onclick="renderLevels()">← All levels</button>'+(qzWrongCount()?'<button class="btn gold" onclick="startMistakes()">↺ Review remaining</button>':'')+'</div>';
    return;
  }
  var lv=QUIZ_LEVELS[qzLevel],n=lv.qs.length,need=qzNeed(n);
  var pct=Math.round(qzScore/n*100);
  var prevBest=qzST.best[qzLevel]||0;
  if(pct>prevBest){qzST.best[qzLevel]=pct;}
  qzSave();
  var passed=pct>=80,all=qzAllPassed(),msg,btns,nx=-1,nxv=-1;
  for(var nv=qzLevel+1;nv<QUIZ_LEVELS.length;nv++){if(qzVis(nv)){nxv=nv;break;}}
  if(passed&&!all)nx=(nxv>-1&&!qzPassed(nxv))?nxv:qzNext();
  if(passed&&all)msg=nxv<0?'Final level passed — the whole circuit is yours!':'Level passed — and that completes the whole circuit!';
  else if(passed)msg='Level passed!'+(nx===qzLevel+1?' '+qzLvName(nx,1)+' is now unlocked.':'');
  else msg='You got '+qzScore+' — you need '+need+' of '+n+' to pass. Study the section below, then retake.';
  if(passed){toast('🎉 '+qzLvName(qzLevel)+' passed!',true);vib([40,60,120]);confetti(all?160:70);}
  if(all&&!planChk['quiz80']){planChk['quiz80']=true;save('us-plan',planChk);updPlan();toast('🏆 Knowledge circuit complete!',true);}
  ST.quizBest=Math.max(ST.quizBest||0,pct);saveST();
  chkBadges();qzMeterUpd();
  var wl=qzWrongIn(qzLevel),wc=qzWrongCount();
  /* P-24 / P-26: the primary button is always the next step */
  if(passed&&all)btns='<button class="btn gold" onclick="makeCert()">🎖️ Get my certificate</button>'+(wc?'<button class="btn ghost" onclick="startMistakes()">🔁 Review my mistakes ('+wc+')</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else if(passed)btns='<button class="btn gold" onclick="startLevel('+nx+')">▶ Start '+qzLvName(nx,1)+'</button>'+(pct<100?'<button class="btn ghost" onclick="startLevel('+qzLevel+')">↺ Retake level</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else btns='<button class="btn gold" onclick="startLevel('+qzLevel+')">↺ Retake level</button><button class="btn ghost" onclick="qzStudyGo('+qzLevel+')">📚 Study this level</button>'+(lv.rites?'<button class="btn ghost" onclick="goTab(\'umrah\',\'steps\')">📋 Open the rites guide</button>':'')+(wl?'<button class="btn ghost" onclick="startMistakes('+qzLevel+')">🔁 Review the '+wl+' I missed</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  var missed=(!passed&&qzMissed.length)?'<div class="qz-missed"><b>Missed this run</b><ul>'+qzMissed.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div>':'';
  document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+pct+'%</div><p>'+qzScore+' of '+n+' correct — '+msg+'</p>'+missed+btns+'</div>';
}

/* ════════════════════════ RITES ════════════════════════ */
/* U-17: a step may carry one dua or an array of duas (an optional one is marked opt:'label') */
function stDuas(st){return st.dua?(Array.isArray(st.dua)?st.dua:[st.dua]):[];}
function duaHTML(st,d,i){var lbl=d.opt?d.opt:'Dua'+(st.rep?' · <span class="rep">↻ '+st.rep+'</span>':'');
  return '<div class="dua tapable'+(d.opt?' duaopt':'')+'" role="button" tabindex="0" aria-label="Open this dua full screen" onclick="event.stopPropagation();openRiteDua(\''+st.id+'\','+(i||0)+')"><div class="dua-top"><small>'+lbl+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'<span>Listen</span></button></div><span class="ar" lang="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span>'+(d.s?'<span class="src">'+d.s+'</span>':'')+'<span class="enl">⛶ tap to enlarge</span></div>';}
/* the ordered list of visible steps with their global number (U-10) */
function riteList(){var L=[],n=0;RITES.forEach(function(ph){ph.steps.forEach(function(st){if(!riteVis(st))return;n++;L.push({st:st,ph:ph,n:n});});});return L;}
/* U-19: the mataf schematic moves from the top of the tab into Phase 2, where tawaf begins */
var MATAF_HTML='';
function troubleList(){var qa={};FIQHQA.forEach(function(g){if(g.id)qa[g.id]=g;});var L=[TROUBLE[0],qa.wudu,qa.rest,TROUBLE[2],qa.floors,qa.talk,qa.menses,TROUBLE[1]].filter(function(x){return !!x;});return L.slice(0,8);}
function renderRites(){
  var m=document.getElementById('matafSec');if(m){MATAF_HTML=m.outerHTML;m.parentNode.removeChild(m);}
  var h='',n=0,HJ=journey()==='hajj',ty=hajjType(),locked=HJ&&ty!=='tamattu';
  /* J-06: Hajj is a superset — Part 1 is the Umrah below, verbatim (same ids, same riteChk, same stamps); Part 2 (HAJJ_RITES) renders into #hajjContainer.
     A Qarin / Mufrid never cuts after the arrival sa'i, so Phase 4 becomes a locked "you stay in ihram" panel (U-23 halq gate). */
  if(HJ)h+='<div class="note hajjnote" id="hajjNote">'+mk('alert','mkt')+'<b>Hajj rulings:</b> confirm with your group leader or a scholar.</div><div class="subt" id="hajjPart1">Part 1 · Your Umrah'+(ty==='tamattu'?' — a Tamattu’ Hajj begins with it'+(ST.hajjTypeConfirmed?'':'<small>Type unconfirmed until the halq step</small>'):' — '+HAJJ_TYPES[ty].t+': arrival tawaf &amp; sa’i, no cutting')+'</div>';
  /* (review) a Tamattu' pilgrim on a day of Hajj with this trip's Umrah unrecorded: Part 2 is live below — nudge, never block */
  if(HJ&&ty==='tamattu'&&typeof hajjDay()==='number'&&tripUmrahs()===0)h+='<div class="note" id="umrahNudge" style="margin:0 2px 10px">'+mk('kaaba','mkt')+'This trip’s Umrah is not recorded yet'+((riteChk.cut||riteChk.cutw)?' — <button class="lnk" style="font-size:1em" onclick="finishUmrah()">Record it</button>':' — tick its steps below as you did them, then record it')+'. Part 2 (the days of Hajj) is already live further down.</div>';
  RITES.forEach(function(ph,i){
    var inner='';
    if(ph.id==='ph2'&&MATAF_HTML)inner+=MATAF_HTML;
    if(ph.kn)inner+='<div class="kn">🧒 '+ph.kn+'</div>';
    ph.steps.forEach(function(st){
      if(!riteVis(st))return;
      n++;
      inner+=stepRowHTML(st,n,'togRite',HJ);
      if(st.call)inner+='<div class="callout"><span class="co-i">'+(st.call.ico||'💡')+'</span><div class="co-t">'+st.call.t+(st.call.go?' <button class="xchip" onclick="'+st.call.go+'">'+(st.call.goL||'Read more')+' →</button>':'')+'</div></div>';
      /* soft, non-blocking hint: the three phrasings at the miqat (the type itself is asked at the halq step) */
      if(HJ&&st.id==='niyyah')inner+='<div class="callout" id="niyHint"><span class="co-i">🤍</span><div class="co-t"><b>At the miqat you say one of three:</b> '+['tamattu','qiran','ifrad'].map(function(t){return '<i>'+HAJJ_TYPES[t].talb+'</i> ('+HAJJ_TYPES[t].t+')';}).join(' · ')+'. Your group leader knows which one your package follows — the app asks again before the hair is cut.</div></div>';
    });
    if(ph.id==='ph4'){
      if(locked)inner='<div class="rite-lock" id="riteLock"><b>'+mk('lock','mkt')+'You stay in ihram</b><p>Do not cut your hair until after Arafah and the stoning on the 10th. '+HAJJ_TYPES[ty].t+': '+(riteChk.laps?'the arrival tawaf and sa’i are done':'once the arrival tawaf and sa’i are done')+' — keep the ihram rules, keep the talbiyah, and continue in Part 2 below.</p><button class="btn" onclick="setSecOpen(\'hd8\',true);jumpTo(\'hajjContainer\')">⛺ Open Part 2 →</button><button class="lnk fresh" onclick="halqGate(\''+(ST.profile==='w'?'cutw':'cut')+'\')">Not '+HAJJ_TYPES[ty].t+'? Change what you said at the miqat</button></div>';
      else inner+='<div class="rite-done" id="riteDone"><b>'+markify('🎉 Your Umrah is complete')+'</b><p>'+(HJ?'All ihram restrictions are lifted until you enter ihram again for Hajj on 8 Dhul Hijjah. Record it — Part 2 then takes over.':'All ihram restrictions are lifted. May Allah accept it — make shukr, and keep filling your days with worship.')+'</p><button class="btn gold" id="recordBtn" onclick="finishUmrah()">'+markify(HJ?'🎉 Record your Umrah — your ihram ends until 8 Dhul Hijjah':'🎉 Record completed Umrah &amp; reset')+'</button><div id="riteDoneNote"></div><button class="lnk fresh" onclick="startFresh()">↺ Start fresh (nothing recorded)</button>'+(HJ?'':'<p class="rd-foot">Another Umrah? Take ihram from <button class="xchip" onclick="openPlace(\'taneem\')">📍 Masjid Aisha (Tan’eem) →</button></p>')+'</div>';
    }
    h+=mkSec(ph,i>0,inner);
  });
  h+=mkSec({id:'trouble',ico:'🆘',title:'If something goes wrong',sub:'Lost count · wudu broke · forbidden by mistake · missed the miqat'},true,accs(troubleList()));
  document.getElementById('riteContainer').innerHTML=h;
  renderHajjRites();
  renderCnt('tawaf');renderCnt('sai');renderRami();renderRiteTiles();
}
/* U-22: the same answers inside the big counter — the sheet sits above the tap zone, so the count is untouched */
function troubleSheet(){var hj=journey()==='hajj'&&(focusKey==='rami'||tmHajj());openSheet('<div class="sheet-h danger">'+mk('alert')+'</div><h3>Something wrong?</h3><p>Tap a question — your count is not touched.</p>'+accs(hj?TROUBLE_HAJJ:troubleList())+'<button class="btn ghost" onclick="closeSheet()">Back to the counter</button>');}
/* U-17: deep link into a Know-before-you-go topic (0 = miqats, 2 = how to wear the ihram) */
function openKnow(i){var a=document.querySelectorAll('#knowContainer .acc')[i];if(a){a.classList.add('open');var hd=a.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('plan','learn',a?null:'knowCard');if(a)requestAnimationFrame(function(){setTimeout(function(){try{a.scrollIntoView({behavior:smooth(),block:'center'});}catch(e){}},60);});}
/* open the Know-before-you-go topic whose title contains `word` (indices shift with journey gating, titles do not) */
function openKnowT(word){var L=KNOW.filter(forMe),i=-1;L.forEach(function(t,k){if(i<0&&t.t.indexOf(word)>-1)i=k;});openKnow(i<0?0:i);}
function stamp(k){ST.log=ST.log||{};if(!ST.log[k]){ST.log[k]=Date.now();saveST();}}
function togRite(id,quiet){
  /* U-23: in Hajj mode the hair cannot be ticked until the pilgrim has said what they said at the miqat */
  if((id==='cut'||id==='cutw')&&!riteChk[id]&&journey()==='hajj'&&!ST.hajjTypeConfirmed){halqGate(id);vib([60,40,60]);return;}
  riteChk[id]=!riteChk[id];save('us-rites',riteChk);vib(15);
  if(riteChk[id]){if(id==='niyyah'){stamp('ihram');if(tmode()!=='umrah')setTmode('umrah',true);}if(id==='start')stamp('tawafStart');if(id==='cut'||id==='cutw')stamp('halq');}
  else{/* U-13: an un-ticked step takes its stamp with it — practice ticks never poison the keepsake */
    var lg=ST.log||{};if(id==='niyyah'&&lg.ihram){delete lg.ihram;saveST();}if((id==='cut'||id==='cutw')&&lg.halq&&!riteChk.cut&&!riteChk.cutw){delete lg.halq;saveST();}}
  updRites();renderLog();focusRites(false);
  if(!quiet){var st=riteStep(id);if(riteChk[id])toast('✓ '+fcText(st?st.b:'Step')+' — tap again to undo');}}
/* U-10: where am I in the rites? */
/* journey-aware: Part 1 until the Umrah is recorded (or, for Qiran / Ifrad, until the arrival sa'i), then Part 2 */
function nextRite(){if(hajjPart2Active())return hajjNext();var L=riteList();for(var i=0;i<L.length;i++){var st=L[i].st;if(riteChk[st.id])continue;
  if(st.pair&&L.some(function(x){return x.st.pair===st.pair&&x.st.id!==st.id&&riteChk[x.st.id];}))continue;return L[i];}return null;}
function phaseDone(ph){var c=riteCounts(ph.steps);return c.tot>0&&c.done>=c.tot;}
function setSecOpen(id,open){var sc=document.getElementById('sec-'+id);if(!sc)return;sc.classList.toggle('shut',!open);var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded',open?'true':'false');}
/* open the phase that holds the next step; fully ticked phases fold away. scroll=true (fresh navigation) also folds every other phase and lands on the step */
function focusRites(scroll){var nx=nextRite(),P2=hajjPart2Active(),cur=nx?nx.ph.id:(P2?'hdw':'ph4');
  RITES.forEach(function(ph){if(ph.id===cur)setSecOpen(ph.id,true);else if(phaseDone(ph)||scroll)setSecOpen(ph.id,false);});
  if(nx&&nx.hajj)setSecOpen(cur,true);
  if(scroll){setTimeout(function(){jumpTo(nx?'rw-'+nx.st.id:(P2?'hajjDone':'riteDone'),true);},40);}}
function openRiteStep(id){var st=null,ph=null;RITES.forEach(function(p){p.steps.forEach(function(x){if(x.id===id){st=x;ph=p;}});});if(!ph)HAJJ_RITES.forEach(function(p){p.steps.forEach(function(x){if(x.id===id){st=x;ph=p;}});});if(!ph)return;setSecOpen(ph.id,true);
  if(document.getElementById('view-umrah').classList.contains('on')&&(ST.sub||{}).umrah==='steps')jumpTo('rw-'+id);else goTab('umrah','steps','rw-'+id);}
function renderRiteNow(){var s=document.getElementById('riteNow');if(!s)return;var nx=nextRite(),P2=hajjPart2Active(),L=P2?hajjList():riteList(),HJ=journey()==='hajj';
  if(!nx){s.classList.add('done');
    if(P2){var ok=hajjReady();s.innerHTML='<div class="now-l" role="button" tabindex="0" onclick="jumpTo(\'hajjDone\')"><span class="now-k">All '+L.length+' Hajj steps ticked</span><b class="now-t">'+(ok?'Hajj complete — record it':'Hajj complete? Check the pillars')+'</b></div><button class="now-tick" onclick="'+(ok?'finishHajj()':'jumpTo(\'hajjDone\')')+'" aria-label="Record completed Hajj">🎉 Record</button>';}
    else if(HJ&&hajjType()!=='tamattu')s.innerHTML='<div class="now-l" role="button" tabindex="0" onclick="jumpTo(\'riteLock\')"><span class="now-k">Part 1 done</span><b class="now-t">Stay in ihram — Part 2 on 8 Dhul Hijjah</b></div><button class="now-tick" onclick="setSecOpen(\'hd8\',true);jumpTo(\'hajjContainer\')" aria-label="Open Part 2">⛺ Part 2</button>';
    else s.innerHTML='<div class="now-l" role="button" tabindex="0" onclick="setSecOpen(\'ph4\',true);jumpTo(\'riteDone\')"><span class="now-k">All '+L.length+' steps ticked</span><b class="now-t">Umrah complete — record it</b></div><button class="now-tick" onclick="finishUmrah()" aria-label="Record completed Umrah">🎉 Record</button>';}
  else{s.classList.remove('done');var k=(nx.hajj?'Part 2 · step ':'Step ')+nx.n+' of '+L.length;
    s.innerHTML='<div class="now-l" role="button" tabindex="0" aria-label="Go to step '+nx.n+'" onclick="openRiteStep(\''+nx.st.id+'\')"><span class="now-k">'+k+'</span><b class="now-t">'+fcText(riteStepView(nx.st).b)+'</b></div><button class="now-tick" onclick="'+(nx.hajj?'togHajj':'togRite')+'(\''+nx.st.id+'\')" aria-label="Mark step '+nx.n+' done">✓ Done</button>';}}
function updRites(){
  tmAuto();
  var R=riteTotals(),tot=R.tot,done=R.done;
  var L=riteList();
  RITES.forEach(function(ph){ph.steps.forEach(function(st){var on=!!riteChk[st.id];var w=document.getElementById('rw-'+st.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});
    var c=riteCounts(ph.steps),sp=document.getElementById('sp-'+ph.id);
    if(sp){var mine=L.filter(function(x){return x.ph===ph;}),lo=mine.length?mine[0].n:0,hi=mine.length?mine[mine.length-1].n:0;
      /* U-10: global numbering — pending 'steps 6–12', in progress '3/7', finished '✓ done' */
      sp.textContent=c.done>=c.tot&&c.tot?'✓ done':c.done?c.done+'/'+c.tot:(lo===hi?'step '+lo:'steps '+lo+'–'+hi);sp.classList.toggle('ok',c.tot>0&&c.done>=c.tot);}});
  var rd=document.getElementById('riteDone');if(rd)rd.classList.toggle('ready',!!(riteChk.cut||riteChk.cutw));
  updHajjRites();renderRami();
  renderRiteNow();if(walkOpen)renderWalk();
  renderCnt('tawaf');renderCnt('sai');renderLog();renderUmrahs();updWudu();renderCntHd();renderRiteHero();updCntLayout();
  updChip();homeRefresh();
}
/* ── live hero (U-05): where am I in the Umrah right now ── */
function umrahTawaf(){var lg=ST.log||{};return tmode()!=='umrah'?((riteChk.rounds||lg.tawafEnd)?7:0):ST.tawaf;}
/* in Hajj mode the sa'i counter only feeds the Umrah in 'umrah' mode (tmAuto zeroes the counts once the days of Hajj begin) — the Umrah's sa'i then reads from its tick / stamp */
function umrahSai(){var lg=ST.log||{};return (journey()==='hajj'&&tmode()!=='umrah')?((riteChk.laps||lg.saiEnd)?7:0):ST.sai;}
function umrahPct(){var lg=ST.log||{},ih=(riteChk.niyyah||lg.ihram)?1:0,hq=(riteChk.cut||riteChk.cutw||lg.halq)?1:0;return Math.round(25*ih+25*umrahTawaf()/7+25*Math.min(7,umrahSai())/7+25*hq);}
/* the Home card's segmented rite bar (Ihram · Tawaf · Sa'i · Halq): f = fill 0–1 per rite, cur = the rite in progress (ink 600) */
function riteSegs(cur,f){var RL=['Ihram','Tawaf','Sa’i','Halq'],sb='',sl='';
  RL.forEach(function(r,i){sb+='<i class="hs-sb'+(i===cur?' on':'')+'"><b style="width:'+Math.round((f[i]||0)*100)+'%"></b></i>';sl+='<small class="hs-sl'+(i===cur?' on':'')+'">'+r+'</small>';});
  return '<div class="hs-sg" role="img" aria-label="'+RL.map(function(r,i){return r+' '+(f[i]>=1?'done':i===cur?'in progress':'to do');}).join(', ')+'">'+sb+sl+'</div>';}
function renderRiteHero(){
  var t=document.getElementById('riteHeroT'),s=document.getElementById('riteHeroS');if(!t)return;
  var lg=ST.log||{},ih=!!(riteChk.niyyah||lg.ihram),hq=!!(riteChk.cut||riteChk.cutw||lg.halq),tw=umrahTawaf(),sa=umrahSai(),title,sub,m=tmode(),HJ=journey()==='hajj';
  if(tmHajj()){var hn=TM[m].h.replace(/^\S+ /,''),hs=TM[m].sai,t2=tahallul2(),left=hajjSaiLeft().join(' and ');
    if(ST.tawaf>0&&ST.tawaf<7){title=hn+' · round '+(ST.tawaf+1)+' of 7';sub='Ordinary pace, no raml · Kaaba on your left · tap the ring after each round';}
    else if(ST.tawaf>=7&&hs&&ST.sai>0&&ST.sai<7){title='Sa’i of Hajj · lap '+(ST.sai+1)+' of 7';sub=saiHill(ST.sai);}
    else if(ST.tawaf>=7&&hs&&ST.sai>=7){title=t2?'Second tahallul — alhamdulillah':'Tawaf & sa’i of Hajj done';sub=t2?'Tawaf and sa’i of Hajj done · everything is allowed again · back to Mina':'Still to do: '+left+' · the ihram restrictions remain until then';}
    else if(ST.tawaf>=7&&hs){title=hajjSaiNeeded()?'Next: the sa’i of Hajj':hn+' done'+(t2?' — second tahallul':'');sub=hajjSaiNeeded()?'2 rakahs, Zamzam, then Safa — the sa’i counter is below':(t2?'Your sa’i is already done — nothing more is needed':'Your sa’i is already done · still to do: '+left);}
    else if(ST.tawaf>=7){title=hn+' done — go with Allah’s peace';sub='2 rakahs if you can, a last Zamzam, a last dua — then leave Makkah';}
    else{title='Ready: '+hn.toLowerCase();sub=ST.wudu?'Ordinary clothes, no raml · start at the Black Stone line':'Make wudu, then start at the Black Stone line';}}
  else if(m==='nafl'&&ST.tawaf>0&&ST.tawaf<7){title='Nafl tawaf · round '+(ST.tawaf+1)+' of 7';sub='Normal pace · Kaaba on your left · tap the ring after each round';}
  else if(hq){title='Taqabbal Allah!';sub='Umrah complete — record it under the sa’i counter';}
  else if(sa>=7&&HJ&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu'){title='Stay in ihram — Part 2 on 8 Dhul Hijjah';sub='Arrival tawaf &amp; sa’i done · no cutting until the 10th · keep the talbiyah';}
  else if(sa>=7&&halqUnconfirmed()){title='Before cutting: what did you say at the miqat?';sub='Tamattu’ cuts now · Qiran / Ifrad stay in ihram until the 10th — the app asks at the halq step';}
  else if(sa>=7){title='Next: Halq / taqsir';sub='Men shave or trim · women trim a fingertip — ihram ends after cutting';}
  else if(sa>0){title='Sa’i · lap '+(sa+1)+' of 7';sub=saiHill(sa);}
  else if(tw>=7){title='Next: Sa’i';sub='2 rakahs at Maqam Ibrahim, Zamzam, then Safa';}
  else if(tw>0){title='Tawaf · round '+(tw+1)+' of 7';sub='Kaaba on your left · tap the ring after each round';}
  else if(ih){title='Next: Tawaf';sub=ST.wudu?'Start at the Black Stone line':'Make wudu, then start at the Black Stone line';}
  else{title='Ready to begin';sub='Ghusl & ihram at the miqat · wudu before tawaf';}
  var tq=/^(.*\S) · ((?:round|lap) \d of 7)$/.exec(title);if(tq)t.innerHTML=esc(tq[1])+'<span class="rh-dot"> ·</span> <span class="rh-2">'+tq[2]+'</span>';else t.textContent=title;
  /* the four Umrah rites as the Home card's segmented bar (the ihram time and durations live in the log under the counters) */
  var cur=!ih?0:tw<7?1:sa<7?2:!hq?3:4,segs=(tmHajj()||hajjPart2Active())?'':riteSegs(cur,[ih?1:0,Math.min(7,tw)/7,Math.min(7,sa)/7,hq?1:0]);
  var n=totalUmrahs();
  var sgEl=document.getElementById('riteSegs');if(sgEl){sgEl.innerHTML=segs;sgEl.hidden=!segs;}
  s.innerHTML='<span class="rh-s">'+esc(sub)+'</span>'+(sgEl?'':segs)+(n?'<span class="rh-n">'+mk('kaaba','mkt')+n+' Umrah'+(n===1?'':'s')+' completed'+(ST.umrahsPrev?' (incl. '+ST.umrahsPrev+' before this app)':'')+'</span>':'');
  var pct=umrahPct();if(hajjPart2Active()){var HT=hajjTotals();pct=HT.tot?Math.round(HT.done/HT.tot*100):0;}animPct('ritePct',pct);setRing('riteRing',pct);
  var rk=document.querySelector('#riteHero .ring-num small');if(rk)rk.textContent=hajjPart2Active()?'Hajj':'Umrah';
}
/* ── round-by-round coaching (U-01 / U-21 / U-07): index k = guidance for the round you are NOW in (k rounds done), index 7 = completion.
   Each entry = [action line, reflective line]. Religious content unchanged; men/women differences stated where they exist. ── */
var TAWAF_TIPS=[
 ['Start at the Black Stone line — "Bismillahi wallahu akbar", Kaaba on your left.','Men: brisk short steps (raml); women: normal pace. Touch the Yamani corner only if easy, then "Rabbana atina…".'],
 ['Keep your pace (raml for men).','Any dhikr or dua you love — nothing fixed.'],
 ['Last raml round for men.','Guard your gaze and tongue; crowded? use the outer ring or upper floor — it counts.'],
 ['Normal pace now.','Dua for your parents and those who asked you.'],
 ['Istighfar.','Don’t push at the Stone — point and say Allahu Akbar.'],
 ['Salawat on the Prophet ﷺ.','Keep your group in sight — agree a meeting point now.'],
 ['Last round — finish at the Black Stone line.','Then men cover both shoulders; 2 rakahs behind Maqam Ibrahim.'],
 ['Tawaf complete.','Men: cover both shoulders again. 2 rakahs behind Maqam Ibrahim — anywhere in the mosque if crowded — then Zamzam.']];
var SAI_TIPS=[
 ['On Safa: face the Kaaba, praise Allah, repeat the dhikr 3× with your own duas.','Safa → Marwah. Men jog lightly between the green lights; women walk throughout.'],
 ['Back to Safa.','Remember Hajar’s trust: "He will not abandon us."'],
 ['Dua is accepted here — pour out your heart.','Ask for yourself, your family and everyone who asked you.'],
 ['Halfway.','Sip Zamzam from the coolers if you need to.'],
 ['Dua for the ummah.','The angel says "Amin, and for you the same."'],
 ['One to go.','Salawat and istighfar.'],
 ['Last lap · Safa → Marwah — you finish on Marwah.','Then halq / taqsir.'],
 ['Sa’i complete.','Men: shave (best) or trim; women: trim a fingertip’s length — never shave. Your Umrah is done. Taqabbal Allah!']];
var NAFL_TIPS=[
 ['Start at the Black Stone line — "Bismillahi wallahu akbar", Kaaba on your left.','Normal pace for everyone — no raml or idtiba’ in a nafl tawaf. Touch the Yamani corner only if easy, then "Rabbana atina…".'],
 ['Any dhikr or dua you love — nothing fixed.','Every step is worship — there is no set formula.'],
 ['Guard your gaze and your tongue.','Crowded? The upper floors count just the same.'],
 ['Dua for your parents and those who asked you.','Between the Yamani corner and the Stone: "Rabbana atina…".'],
 ['Istighfar.','Don’t push at the Stone — point and say Allahu Akbar.'],
 ['Salawat on the Prophet ﷺ.','Keep your group in sight.'],
 ['Last round — finish at the Black Stone line.','Then 2 rakahs anywhere in the mosque.'],
 ['Nafl tawaf complete.','2 rakahs anywhere in the mosque, then Zamzam.']];
function saiHill(v){return v>=7?'Finished on Marwah':(v%2===0?'On Safa → walk to Marwah':'On Marwah → walk to Safa');}
function tipHTML(k,v){var T=k==='tawaf'?tawafTips(tmode()):saiTips(),t=T[Math.min(7,v)]||['',''],u=k==='tawaf'?'round':'lap';
  return (k==='sai'?'<span class="tip-h">'+saiHill(v)+'</span>':'')+'<b class="tip-a">'+(v<7?'Now: '+u+' '+(v+1)+' of 7 · ':'')+t[0]+'</b>'+(t[1]?'<span class="tip-r">'+t[1]+'</span>':'');}
function duaIdx(word){for(var i=0;i<DUAS.length;i++){if(DUAS[i].t.indexOf(word)>-1)return i;}return -1;}
/* U-09: the dua of this rite, always under the counter */
function cntDuaHTML(k){var i=duaIdx(k==='tawaf'?'Yamani':'Safa');if(i<0)return '';var d=DUAS[i];
  return '<div class="dua tapable" role="button" tabindex="0" aria-label="Open '+d.t.replace(/"/g,'')+' full screen" onclick="openDua('+i+')"><div class="dua-top"><small>'+d.t+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="enl">⛶ tap to enlarge</span></div>';}
function riteStep(id){var f=null;RITES.forEach(function(ph){ph.steps.forEach(function(st){if(st.id===id)f=st;});});if(!f)f=hajjStep(id);return f;}
function brg(id,label){var on=!!riteChk[id];return '<div class="brg'+(on?' done':'')+'" role="checkbox" tabindex="0" aria-checked="'+(on?'true':'false')+'" onclick="togRite(\''+id+'\')"><span class="tick"></span><span>'+label+'</span></div>';}
var safaOpen=false;
function togSafaDhikr(){safaOpen=!safaOpen;renderCnt('tawaf');}
/* U-03: what the 7/7 state hands you on to */
function doneHTML(k){var m=tmode(),HJ=journey()==='hajj';
  if(k==='tawaf'){
    if(m==='nafl'){var d=dailyChk[dayKey()]||{},n=(d.ntawafN||(d.ntawaf?1:0))+1;return '<h4>✅ Nafl tawaf complete</h4><p>2 rakahs anywhere in the mosque, then Zamzam.</p><button class="btn gold" onclick="logNafl()">✅ Log nafl tawaf #'+n+' today · Count another</button>';}
    if(m==='wada')return '<h4>✅ Tawaf al-wada complete</h4><p>2 rakahs if you can, a last drink of Zamzam, a last dua at the door — then leave Makkah. No sa’i after it. It is ticked in Part 2.</p><button class="btn gold" onclick="goTab(\'umrah\',\'steps\',\'hajjDone\')">⛺ Record your Hajj →</button>';
    if(tmHajj()){var hn=TM[m].h.replace(/^\S+ /,'');if(ST.sai>0)return '<h4>✅ '+hn+' complete</h4><p>Sa’i is under way — keep going below.</p>';
      return '<h4>✅ '+hn+' complete</h4><p>2 rakahs anywhere in the mosque, Zamzam'+(hajjSaiNeeded()?', then the sa’i of Hajj — Safa to Marwah, in ordinary clothes.':'. Your sa’i is already done. '+hajjSaiDoneCopy())+'</p>'+(hajjSaiNeeded()?'<button class="btn gold" onclick="startSai()">Start the sa’i of Hajj →</button>':'<button class="btn" onclick="goTab(\'umrah\',\'steps\',\'rw-h10night\')">⛺ Back to Part 2 →</button>');}
    if(ST.sai>0)return '<h4>✅ Tawaf complete</h4><p>Sa’i is under way — keep going below.</p>';
    var safa=riteStep('safa');
    return '<h4>Between tawaf and sa’i</h4>'+brg('maqam','Cover shoulders (men) · 2 rakahs behind Maqam Ibrahim')+brg('zamzam','Drink Zamzam + dua')+brg('safa','On Safa: face the Kaaba, dhikr 3×')
      +'<button class="lnk" onclick="togSafaDhikr()" aria-expanded="'+(safaOpen?'true':'false')+'">'+(safaOpen?'▴ Hide Safa dhikr':'▾ Show Safa dhikr')+'</button>'
      +(safaOpen&&safa?stDuas(safa).map(function(d,k){return duaHTML(safa,d,k);}).join(''):'')
      +'<button class="btn gold" onclick="startSai()">Start Sa’i →</button>';
  }
  if(tmHajj()&&tmT('sai'))return '<h4>✅ Sa’i of Hajj complete</h4><p>'+hajjSaiDoneCopy()+'</p><button class="btn" onclick="goTab(\'umrah\',\'steps\',\'rw-h10night\')">⛺ Back to Part 2 →</button>';
  if(HJ&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu')return '<h4>✅ Sa’i complete — stay in ihram</h4><p>As a '+HAJJ_TYPES[hajjType()].t+' pilgrim you do not cut now: the ihram continues until after Arafah and the stoning on the 10th.</p><button class="btn" onclick="goTab(\'umrah\',\'steps\',\'riteLock\')">⛺ Open Part 2 →</button>';
  var cut=!!(riteChk.cut||riteChk.cutw);
  /* (review) the halq gate comes BEFORE the cut, not at the tick: a Qarin / Mufrid must not be told "next: halq" */
  if(!cut&&halqUnconfirmed())return '<h4>✅ Sa’i complete</h4>'+halqAskHTML();
  return '<h4>✅ Sa’i complete</h4><p>'+(cut?'Halq / taqsir done — the ihram restrictions are lifted. Record this Umrah to keep its timeline and reset the steps for the next one.':'Next: halq / taqsir. Men shave (best) or trim; women trim a fingertip’s length — never shave. <b>Ihram restrictions end only after cutting.</b>')+'</p>'
    +(cut?'<button class="btn gold" onclick="finishUmrah()">'+markify('🎉 Record this Umrah')+'</button>':'<button class="btn" onclick="openRitePhase(\'ph4\')">Next: halq / taqsir →</button>');
}
function renderCnt(k){
  var v=ST[k],m=tmode(),nafl=k==='tawaf'?m!=='umrah':tmHajj(); /* nafl = this count does not feed the Umrah step chip */
  var tip=document.getElementById(k+'Tip');if(tip)tip.innerHTML=tipHTML(k,v);
  if(k===focusKey){var fn=document.getElementById('focusN'),ft=document.getElementById('focusTip'),fl=document.getElementById('focusLive');if(fn)fn.textContent=v;if(ft)ft.innerHTML=tipHTML(k,v);if(fl)fl.textContent=(k==='tawaf'?'Round ':'Lap ')+v+' of 7'+(v>=7?' — complete':'');renderFocusDone();}
  document.getElementById(k+'N').textContent=v;
  var ring=document.getElementById(k+'Ring');
  if(ring)ring.style.strokeDashoffset=565*(1-v/7);
  var dn=document.getElementById(k+'Done');if(dn){dn.innerHTML=v>=7?doneHTML(k):'';dn.style.display=v>=7?'block':'none';}
  var tp=document.getElementById(k+'Tap');if(tp)tp.textContent=v>=7?'Complete ✓':'tap to count';
  var rb=document.getElementById(k+'RingBtn');if(rb)rb.setAttribute('aria-label',v>=7?(k==='tawaf'?'Tawaf complete, 7 of 7 rounds':'Sa’i complete, 7 of 7 laps'):(k==='tawaf'?'Count a tawaf round, '+v+' of 7 done':'Count a sa’i lap, '+v+' of 7 done'));
  var un=document.getElementById(k+'Undo');if(un)un.disabled=v===0;
  var du=document.getElementById(k+'Dua');if(du&&!du.innerHTML)du.innerHTML=cntDuaHTML(k);
  var lc=document.getElementById('live-'+(k==='tawaf'?'rounds':'laps'));if(lc)lc.textContent=nafl?'🔄 Open counter →':'🔄 '+v+' / 7 '+(k==='tawaf'?'rounds':'laps')+' · Open counter →';
  if(k==='tawaf'){var h3=document.getElementById('tawafH');if(h3)h3.innerHTML=markify(TM[m].h);
    var sb=document.getElementById('tawafSub');if(sb)sb.innerHTML=(m==='nafl'?'7 rounds at a normal pace — no raml or idtiba’. Wudu is still required.':m==='umrah'?'7 rounds, counter-clockwise, from the Black Stone line.':m==='wada'?'The last thing you do in Makkah — 7 rounds in ordinary clothes, no raml, no sa’i after it. Ticks Part 2; your Umrah record is untouched.':'The pillar that completes your Hajj — 7 rounds in ordinary clothes, no raml or idtiba’ (Shafi’is: raml if a sa’i follows), with wudu. Ticks Part 2; your Umrah record is untouched.')+'<br><b>Tap the circle after each round.</b>';
    renderTmodeSeg();}
  renderCntSum(k);
}
/* ── U-04: one big ring per moment ── */
var cntForce={},saiGo=false,layoutHold=0,lastAct='';
function cntActive(){if(tmode()==='nafl'||!tmT('sai'))return 'tawaf';if(ST.tawaf>=7&&(ST.sai>0||saiGo))return 'sai';return 'tawaf';}
function cntStarted(){return ST.tawaf>0||ST.sai>0;}
function updCntLayout(){var sub=document.getElementById('sub-umrah-count');if(!sub)return;
  if(Date.now()<layoutHold){setTimeout(updCntLayout,layoutHold-Date.now()+60);return;}
  var act=cntActive();if(act!==lastAct){cntForce={};lastAct=act;}
  sub.classList.toggle('started',cntStarted());sub.classList.toggle('rite-tawaf',act==='tawaf');sub.classList.toggle('rite-sai',act==='sai');
  ['tawaf','sai'].forEach(function(k){var c=document.getElementById(k+'Card');if(c)c.classList.toggle('compact',k!==act&&!cntForce[k]);});}
function renderCntSum(k){var e=document.getElementById(k+'Sum');if(!e)return;var v=ST[k],lbl;
  var okH=' · '+mk('check','mkt')+'7/7';
  if(k==='tawaf')lbl=markify(TM[tmode()].h)+(v>=7?okH:' · '+v+'/7');
  else lbl=markify(tmHajj()&&tmT('sai')?'⛰️ Sa’i of Hajj':'⛰️ Sa’i')+(v>=7?okH:' · '+v+'/7'+(tmode()==='nafl'?' · not part of a nafl tawaf':!tmT('sai')?' · no sa’i after tawaf al-wada':(ST.tawaf<7?' · after tawaf':'')));
  e.innerHTML='<b>'+lbl+'</b><button class="chip-btn" onclick="showCnt(\''+k+'\')" aria-label="Show the '+(k==='tawaf'?'tawaf':'sa’i')+' counter">Show</button>';}
function showCnt(k){cntForce[k]=true;updCntLayout();setTimeout(function(){jumpTo(k+'Card',true);},40);}
function goCounter(k){cntForce[k]=true;goTab('umrah','count',k+'Card');}
function goSteps(k){var ph=k==='tawaf'?'ph2':'ph3',sc=document.getElementById('sec-'+ph);if(sc){sc.classList.remove('shut');var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');}goTab('umrah','steps',k==='tawaf'?'rw-start':'rw-safa');}
function startSai(){saiGo=true;cntForce={};if(document.getElementById('focus').classList.contains('on')){enterFocus('sai');updCntLayout();return;}updCntLayout();goTab('umrah','count','saiCard');vib(10);}
/* ── wudu (U-08): a clear state, a sheet instead of confirm(), never cleared by a counter reset ── */
function togWudu(){ST.wudu=!ST.wudu;ST.wuduAt=ST.wudu?Date.now():null;saveST();updWudu();renderRiteHero();vib(10);if(ST.wudu)toast('💧 Wudu confirmed — bismillah, begin at the Black Stone line');}
function updWudu(){var c=document.getElementById('wuduCard'),sw=document.getElementById('wuduSw'),st=document.getElementById('wuduSt');if(!c)return;
  c.classList.toggle('ok',!!ST.wudu);c.setAttribute('aria-checked',ST.wudu?'true':'false');if(sw)sw.classList.toggle('on',!!ST.wudu);
  if(st)st.textContent=ST.wudu?'✓ Wudu made'+(ST.wuduAt?' · '+fmtTime(ST.wuduAt):''):'Not yet — tap to confirm';
  var fw=document.getElementById('focusWudu');if(fw){fw.innerHTML=mk('drop','mkt')+(ST.wudu?'Wudu ✓':'Wudu?');fw.classList.toggle('on',!!ST.wudu);fw.setAttribute('aria-pressed',ST.wudu?'true':'false');fw.hidden=focusKey!=='tawaf';}}
function wuduSheet(){openSheet('<div class="sheet-h">'+mk('drop')+'</div><h3>Are you in wudu?</h3><p>"Tawaf around the House is like salah" (Tirmidhi 960) — it needs wudu. Sa’i does not.</p><button class="btn tall" onclick="wuduYes()">✓ Yes, I have wudu — begin</button><button class="btn ghost tall" onclick="closeSheet()">'+markify('💧 Not yet — I’ll make wudu first')+'</button>');}
function wuduYes(){ST.wudu=true;ST.wuduAt=Date.now();saveST();updWudu();renderRiteHero();closeSheet();cntr('tawaf',1);}
function focusWudu(){
  if(ST.wudu&&ST.tawaf>=1&&ST.tawaf<=6){ST.wudu=false;ST.wuduAt=null;saveST();updWudu();renderRiteHero();
    openSheet('<div class="sheet-h">'+mk('drop')+'</div><h3>Wudu broke mid-tawaf?</h3><p class="lead">Renew your wudu and return — completed rounds are not lost. The majority hold you resume from where you stopped in the current round, or repeat that round to be safe. <b>Resume round '+(ST.tawaf+1)+'.</b></p><p>Crowding makes this common — no panic, it does not ruin your Umrah. Nothing has been reset.</p><button class="btn tall" onclick="closeSheet()">Got it</button>');return;}
  togWudu();}
/* U-20: a sister whose period starts after ihram — the ruling in seconds, no shaming CTAs */
function periodSheet(){openSheet('<div class="sheet-h rose">🌸</div><h3>Period started? Your ihram is still valid</h3>'
  +'<p class="lead">When Aishah (RA) got her period at Sarif, the Prophet ﷺ told her: <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p>'
  +'<ul><li>Your ihram stays valid — stay in it.</li><li>Keep up the talbiyah, dhikr and dua; the Haram courtyards are open to you.</li><li>Do not enter tawaf. Delay tawaf — and the sa’i after it — until you are pure, then ghusl, tawaf and sa’i. Nothing is lost.</li><li>Umrah has no separate farewell tawaf.</li></ul>'
  +'<p class="lead"><b>Departing within days?</b> Ask a scholar or your group’s alim about the concessions — do not decide alone.</p>'
  +'<p class="lead" style="color:var(--ink2)"><b>Meanwhile</b>, everything else in Daily still counts: dhikr and dua, Quran by listening or tafsir, sadaqah, serving pilgrims, Zamzam, your dua list.</p>'
  +'<button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'learn\',\'sisCard\')">🌸 Read the full sisters’ guide</button><button class="btn" onclick="closeSheet()">Got it</button>');}
/* ── U-07: Umrah tawaf vs nafl tawaf ── */
function setTmode(m,quiet){m=TM[m]?m:'umrah';
  if(tmodesDue().indexOf(m)<0){toast(tmWhyNot(m));vib([40,40,40]);renderTmodeSeg();return;}
  if(tmode()===m&&!quiet)return;ST.tmode=m;saveST();cntForce={};if(document.getElementById('focus').classList.contains('on')&&focusKey==='tawaf')document.getElementById('focusTitle').innerHTML=markify(TM[m].h);updRites();
  if(!quiet){toast(m==='nafl'?'🔁 Nafl tawaf — normal pace, no raml; logs to today’s tracker at 7':m==='umrah'?'🕋 Umrah tawaf — feeds your rites checklist & timeline':m==='wada'?'👋 Tawaf al-wada — ticks Part 2; your Umrah record is untouched':'🕋 Tawaf al-ifadah — ticks Part 2; your Umrah record is untouched');vib(8);}}
function logNafl(){var k=dayKey(),d=dailyChk[k]||{},n=(d.ntawafN||(d.ntawaf?1:0))+1;d.ntawaf=true;d.ntawafN=n;dailyChk[k]=d;save('us-daily',dailyChk);
  ST.tawaf=0;saveST();lastTap.tawaf=0;closeSheet();updRites();updDaily();updStats();chkBadges();toast('✅ Nafl tawaf #'+n+' logged for day '+ST.day+' — count another when ready',true);vib([30,40,60]);}
/* ── the counter itself (U-02 feeds the checklist, U-06 guards the tap) ── */
var lastTap={};
function cntr(k,d){
  if(k==='tawaf'&&d>0&&ST.tawaf===0&&!ST.wudu){wuduSheet();vib([60,40,60]);return;}
  var v=Math.max(0,Math.min(7,ST[k]+d));
  if(v===ST[k])return;
  var now=Date.now();
  if(d>0){if(lastTap[k]&&now-lastTap[k]<800){vib([40,40,40]);toast('Already counted — tap Undo if wrong');return;}lastTap[k]=now;}
  ST[k]=v;saveST();
  /* J-08: the target table decides what this count writes — the Umrah step + ST.log, or a Part 2 step + ST.hlog; a nafl tawaf writes nothing */
  var t=tmT(k);
  if(t){var lg=tmLog(t),ch=tmChk(t),id=tmChkId(t),chg=false;
    if(v===1&&d>0&&!lg[t.log+'Start'])lg[t.log+'Start']=now;if(v===7&&!lg[t.log+'End'])lg[t.log+'End']=now;saveST();
    var on=v>=7;if(!!ch[id]!==on){ch[id]=on;chg=true;}
    /* U-10: the first counted round means you made wudu and started at the Stone line */
    if(k==='tawaf'&&v===1&&d>0&&!t.store&&!riteChk.start){riteChk.start=true;riteChk.wudu=true;chg=true;}
    if(chg)tmSave(t);}
  vib(v===7?[50,60,140]:35);
  if(v===7){layoutHold=now+1300;confetti(50);if(k==='tawaf')safaOpen=false;var m=tmode();
    if(k==='tawaf'&&m==='umrah')toast('🕋 Tawaf complete! 2 rakahs at Maqam Ibrahim, Zamzam, then Safa',true);
    else if(k==='tawaf'&&m==='wada')toast('👋 Tawaf al-wada complete — 2 rakahs if you can, Zamzam, and leave with Allah’s peace',true);
    else if(k==='tawaf'&&tmHajj())toast('🕋 '+TM[m].h.replace(/^\S+ /,'')+' complete! 2 rakahs, Zamzam'+(hajjSaiNeeded()?', then the sa’i of Hajj':(tahallul2()?' — second tahallul':' — still to do: '+hajjSaiLeft().join(' and '))),true);
    else if(k==='sai'&&tmHajj())toast('⛰️ Sa’i of Hajj complete — '+(tahallul2()?'the second tahallul, everything is allowed again':'still to do: '+hajjSaiLeft().join(' and ')+' — the ihram restrictions remain until then'),true);
    else if(k==='sai'&&journey()==='hajj'&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu')toast('⛰️ Sa’i complete — you stay in ihram until the 10th',true);
    else if(k==='sai'&&halqUnconfirmed())toast('⛰️ Sa’i complete! Before anything is cut: what did you say at the miqat?',true);
    else if(k==='sai')toast('⛰️ Sa’i complete! Next: halq / taqsir',true);}
  else cntToast(d>0?(k==='tawaf'?'Round ':'Lap ')+v+' of 7':'↶ Back to '+v+' of 7');
  updRites();
}
/* per-tap count toast: replaces the previous one; skipped inside the big counter where the number is the feedback */
function cntToast(m){if(document.getElementById('focus').classList.contains('on'))return;var c=document.getElementById('toastC');if(c)c.querySelectorAll('.toast[data-cnt]').forEach(function(t){t.remove();});toast(m);if(c&&c.lastElementChild)c.lastElementChild.setAttribute('data-cnt','1');}
function cntrReset(k){var n=ST[k];if(!n){toast((k==='tawaf'?'Tawaf':'Sa’i')+' counter is already at 0');return;}
  openSheet('<div class="sheet-h danger">↺</div><h3>Reset '+(k==='tawaf'?'tawaf':'sa’i')+' to 0?</h3><p>Your '+n+' completed '+(k==='tawaf'?'round':'lap')+(n===1?'':'s')+' will be cleared'+(k==='tawaf'?' — your wudu status is kept':'')+'. To fix one extra tap, use Undo instead.</p><button class="btn danger tall" onclick="cntrResetGo(\''+k+'\')">↺ Reset to 0</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function cntrResetGo(k){closeSheet();ST[k]=0;var t=tmT(k);if(t){var lg=tmLog(t);delete lg[t.log+'Start'];delete lg[t.log+'End'];var ch=tmChk(t),id=tmChkId(t);if(ch[id]){delete ch[id];tmSave(t);}}saveST();if(k==='sai')saiGo=false;cntForce={};lastTap[k]=0;updRites();toast((k==='tawaf'?'Tawaf':'Sa’i')+' counter reset to 0');}
function finishUmrah(){
  var R=riteTotals(),done=R.done,tot=R.tot;
  if(done<tot&&!confirm('Only '+done+' of '+tot+' steps are ticked. Record this Umrah as complete anyway?'))return;
  var lg=ST.log||{};lg.done=Date.now();var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}hist.push({n:ST.umrahs+1,log:lg});localStorage.setItem('us-umrahlog',JSON.stringify(hist));
  ST.umrahs++;ST.tawaf=0;ST.sai=0;ST.wudu=false;ST.wuduAt=null;ST.log={};ST.tmode='nafl';saveST();saiGo=false;cntForce={};lastTap={};renderUmrahs();renderJourneys();updWudu();
  riteChk={};save('us-rites',riteChk);
  updRites();renderLog();chkBadges();confetti(140);
  var onSteps=document.getElementById('view-umrah').classList.contains('on')&&(ST.sub||{}).umrah==='steps';
  /* U-15: close the loop where the pilgrim is — keepsake + today's log in the completion block, or the hero on the counters */
  var note=document.getElementById('riteDoneNote'),no=ST.umrahs;
  if(note)note.innerHTML='<div class="rd-note">'+mk('medal','mkt')+'Umrah #'+totalUmrahs()+' recorded — may Allah accept it!'+(journey()==='hajj'?' Your ihram has ended until 8 Dhul Hijjah — Part 2 is below.':'')+'<div class="rd-acts"><button class="chip-btn" onclick="makeKeepsake('+no+')">🎴 Keepsake</button><button class="chip-btn" onclick="goTab(\'daily\',\'today\')">📿 Log today’s worship</button></div></div>';
  if(onSteps){if(walkOpen)closeWalk(true);setSecOpen('ph4',true);if(journey()==='hajj'){setSecOpen('hd8',true);setTimeout(function(){jumpTo('hajjContainer',true);},400);}else setTimeout(function(){jumpTo('umrahsCard',true);},400);}
  else{toast('🎉 Umrah #'+totalUmrahs()+' recorded — may Allah accept it!',true);if(document.getElementById('view-umrah').classList.contains('on'))setTimeout(function(){jumpTo('riteHero',true);},400);}
}
/* U-13: clear practice ticks without recording a fake Umrah */
function startFresh(){openSheet('<div class="sheet-h danger">↺</div><h3>Start fresh?</h3><p>Clears every tick, both counters and this Umrah’s timeline <b>without recording an Umrah</b>. Recorded Umrahs and keepsakes are kept.</p><button class="btn danger tall" onclick="startFreshGo()">↺ Clear — nothing recorded</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function startFreshGo(){closeSheet();riteChk={};save('us-rites',riteChk);ST.log={};ST.tawaf=0;ST.sai=0;ST.wudu=false;ST.wuduAt=null;saveST();saiGo=false;cntForce={};lastTap={};var n=document.getElementById('riteDoneNote');if(n)n.innerHTML='';updRites();renderLog();focusRites(false);toast('Cleared — nothing was recorded');vib(10);}

/* ════════════════════════ HAJJ RITES (Part 2), COUNTER TARGETS & RAMI (J-08) ════════════════════════ */
/* Hajj progress lives in its OWN stores — hajjChk ('us-hajj') for ticks, ST.hlog for stamps, ST.rami for pebbles — so finishUmrah()'s riteChk={} / ST.log={} can never wipe it. */
/* TM: what each tawaf mode writes. chk = the step it ticks, log = the stamp prefix (…Start/…End), store 'hajj' → hajjChk/ST.hlog, otherwise riteChk/ST.log.
   nafl ticks nothing; sai = what the sa'i counter writes in that mode (null = no sa'i follows this tawaf). The Umrah tawaf can therefore never be overwritten by a Hajj tawaf. */
var TM={umrah:{chk:'rounds',log:'tawaf',h:'🕋 Tawaf',lbl:'🕋 Umrah tawaf',sai:{chk:'laps',log:'sai'}},
  nafl:{h:'🔁 Nafl tawaf',lbl:'🔁 Nafl tawaf',sai:{chk:'laps',log:'sai'}},
  ifadah:{chk:'h10ifadah',log:'ifadah',store:'hajj',h:'🕋 Tawaf al-ifadah',lbl:'🕋 Ifadah',sai:{chk:'h10sai',log:'hsai',store:'hajj'}},
  wada:{chk:'hwada',log:'wada',store:'hajj',h:'👋 Tawaf al-wada',lbl:'👋 Wada',sai:null}};
/* (review) the arrival tawaf of a Qarin / Mufrid IS Part 1 in 'umrah' mode — there is no separate qudum mode, so one tawaf can never be counted twice or into a phantom step */
function tmode(){var m=TM[ST.tmode]?ST.tmode:'umrah';return m==='qudum'?'umrah':m;}
function tmHajj(){var m=tmode();return m!=='umrah'&&m!=='nafl';}
/* the target the counter k writes to in the current mode, or null (nafl tawaf, sa'i after wada; in Hajj mode a sa'i after a nafl tawaf writes nothing — riteChk.laps is the Umrah's) */
function tmT(k){var t=TM[tmode()];if(k==='sai')return (tmode()==='nafl'&&journey()==='hajj')?null:t.sai;return t.chk?t:null;}
/* J-09 (review): this trip's recorded Umrahs — entries of us-umrahlog done on/after the departure date (est:true entries are stamped on arrival, so they count). Lifetime ST.umrahs never decides a Hajj phase. */
function tripUmrahs(){var n=0,since=ST.dep?new Date(ST.dep+'T00:00:00').getTime():0;if(isNaN(since))since=0;try{JSON.parse(localStorage.getItem('us-umrahlog')||'[]').forEach(function(u){if((((u||{}).log||{}).done||0)>=since)n++;});}catch(e){}return n;}
/* the Umrah (or arrival) tawaf is behind the pilgrim: cut ticked, rounds ticked, or this trip's Umrah recorded */
function umrahTawafDone(){return !!(riteChk.cut||riteChk.cutw||riteChk.rounds||tripUmrahs()>0);}
function hajjDayN(){var hd=hajjDay();return typeof hd==='number'?hd:(hd==='post'?14:0);}
/* tawaf al-ifadah is due once Arafah is ticked OR the calendar says the 10th — either, not both */
function ifadahDue(){return journey()==='hajj'&&(!!hajjChk.h9wuquf||hajjDayN()>=10);}
/* the second tahallul needs the stoning of the 10th, the cut AND tawaf al-ifadah (with its sa'i): the completion copy announces it only when the ticks say so */
function hajjSaiLeft(){var L=[];if(!hajjChk.h10rami)L.push('rami of Jamrat al-Aqabah');if(!(hajjChk.h10halq||hajjChk.h10halqw))L.push('halq / taqsir');return L;}
function tahallul2(){return hajjSaiLeft().length===0;}
function hajjSaiDoneCopy(){var L=hajjSaiLeft();if(!L.length)return 'The second tahallul — everything is allowed again. Back to Mina for the nights of tashriq; tawaf al-wada is the last thing before you leave Makkah.';
  return 'Tawaf and sa’i of Hajj done. Still to do: '+L.join(' and ')+'. Until both are done the ihram restrictions remain — the first tahallul comes with the stoning and the cut (Shafi’is: any two of stoning, cut and tawaf), the second only with all three.';}
/* (review) the counter is never left in 'umrah' mode once the Umrah tawaf is done and the days of Hajj have begun — a Hajj tawaf must not be stamped as the Umrah, and a reset must not delete the Umrah record.
   Once per Hajj year, when the counter is idle: umrah → ifadah (or nafl before the 10th); nafl → ifadah when the ifadah becomes due. The pilgrim can still pick nafl by hand. */
function tmAuto(){if(journey()!=='hajj')return;var m=tmode(),busy=(ST.tawaf>0&&ST.tawaf<7)||(ST.sai>0&&ST.sai<7),due=ifadahDue()&&!hajjChk.h10ifadah&&!(ST.hlog||{}).ifadahEnd,y=curHajjYear();
  if(m==='umrah'&&umrahTawafDone()&&!busy&&(hajjDayN()>=8||hajjChk.h9wuquf)){ST.tmode=due?'ifadah':'nafl';if(due)ST.tmAuto=y;ST.tawaf=0;ST.sai=0;saveST();saiGo=false;cntForce={};lastTap={};}
  else if(m==='nafl'&&due&&ST.tmAuto!==y&&!ST.tawaf&&!ST.sai){ST.tmode='ifadah';ST.tmAuto=y;saveST();}}
function tmChk(t){return t.store==='hajj'?hajjChk:riteChk;}
function tmChkId(t){return (t.chk==='hwada'&&ST.profile==='w')?'hwadaw':t.chk;}
function tmLog(t){if(t.store==='hajj'){if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};return ST.hlog;}ST.log=ST.log||{};return ST.log;}
function tmSave(t){if(t.store==='hajj')save('us-hajj',hajjChk);else save('us-rites',riteChk);}
/* the modes that are due now: nafl always; Umrah until the Umrah tawaf is done and the days of Hajj (8th) have begun; ifadah from the 10th (or once Arafah is ticked — the calendar is a hint, not a verdict); wada after ifadah */
function tmodesDue(){var L=[];
  if(journey()==='hajj'){var n=hajjDayN(),ar=!!hajjChk.h9wuquf;
    if(!(umrahTawafDone()&&(n>=8||ar)))L.push('umrah');L.push('nafl');
    if(n>=10||ar)L.push('ifadah');
    if(hajjChk.h10ifadah||(ST.hlog||{}).ifadahEnd)L.push('wada');}
  else L=['umrah','nafl'];
  if(L.indexOf(tmode())<0)L.push(tmode());return L;}
function tmWhyNot(m){return m==='ifadah'?'Tawaf al-ifadah comes on 10 Dhul Hijjah, after Arafah — tick "Stand at Arafah" in Part 2 once you have':m==='wada'?'Tawaf al-wada is the last thing you do — after tawaf al-ifadah':m==='umrah'?'Your Umrah tawaf is done — this tawaf is a nafl, or tawaf al-ifadah once Arafah is behind you':'Not available';}
function renderTmodeSeg(){var s=document.getElementById('tmodeSeg');if(!s)return;var due=tmodesDue(),cur=tmode();
  s.innerHTML=due.map(function(m){return '<button'+(m===cur?' class="on"':'')+' data-m="'+m+'" onclick="setTmode(\''+m+'\')">'+markify(due.length>2?TM[m].lbl:(m==='umrah'?'🕋 Umrah tawaf':m==='nafl'?'🔁 Nafl tawaf':TM[m].h))+'</button>';}).join('');
  s.classList.toggle('many',due.length>2);}
/* coaching per mode: ifadah/wada = ordinary pace (no raml / idtiba'); the arrival tawaf of a Qarin / Mufrid is Part 1 in 'umrah' mode (with raml) */
function tawafTips(m){if(m==='umrah')return TAWAF_TIPS;if(m==='nafl')return NAFL_TIPS;
  var T=NAFL_TIPS.map(function(r){return r.slice();});T[0]=[T[0][0],'Normal pace for everyone — no raml or idtiba’ in this tawaf (Shafi’is: raml if a sa’i follows). Touch the Yamani corner only if easy, then "Rabbana atina…".'];
  T[7]=m==='wada'?['Tawaf al-wada complete.','2 rakahs if you can, a last drink of Zamzam, a last dua at the door — then leave Makkah.']:['Tawaf al-ifadah complete.','2 rakahs anywhere in the mosque, Zamzam'+(hajjSaiNeeded()?', then the sa’i of Hajj.':' — your sa’i is already done.')];return T;}
/* (review) the halq gate has not been answered yet: nothing may be cut before "what did you say at the miqat?" */
function halqUnconfirmed(){return journey()==='hajj'&&!ST.hajjTypeConfirmed;}
function cutId(){return ST.profile==='w'?'cutw':'cut';}
function halqAskHTML(cls){return '<p><b>Before anything is cut:</b> what did you say at the miqat? Tamattu’ cuts now; Qiran / Ifrad stay in ihram until the 10th.</p><button class="'+(cls||'btn gold')+'" onclick="event.stopPropagation();halqGate(\''+cutId()+'\')">🤍 What did you say at the miqat?</button>';}
function halqGateHome(){goTab('umrah','steps','rw-'+cutId());setTimeout(function(){halqGate(cutId());},450);}
function saiTips(){var T=SAI_TIPS.map(function(r){return r.slice();});
  if(tmHajj()){T[6]=['Last lap · Safa → Marwah — you finish on Marwah.','Then back to Mina for the night.'];T[7]=['Sa’i of Hajj complete.',hajjSaiDoneCopy()+' Taqabbal Allah!'];return T;}
  if(journey()==='hajj'&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu'){T[6]=['Last lap · Safa → Marwah — you finish on Marwah.','Then you stay in ihram — no cutting until the 10th.'];T[7]=['Sa’i complete — stay in ihram.','As a '+HAJJ_TYPES[hajjType()].t+' pilgrim you do not cut now: the ihram continues until after Arafah and the stoning on the 10th.'];return T;}
  if(halqUnconfirmed()){T[6]=['Last lap · Safa → Marwah — you finish on Marwah.','Then: what did you say at the miqat? The app asks before anything is cut.'];T[7]=['Sa’i complete.','Before anything is cut: what did you say at the miqat? Tamattu’ cuts now; Qiran / Ifrad stay in ihram until the 10th.'];return T;}
  return SAI_TIPS;}

/* ── Part 2 helpers ── */
function hajjStep(id){var f=null;HAJJ_RITES.forEach(function(s){s.steps.forEach(function(st){if(st.id===id)f=st;});});return f;}
/* a step as it reads for THIS pilgrim: v[type] (b/p/dua…) merged over the base step */
function riteStepView(st){var v=journey()==='hajj'&&st.v&&st.v[hajjType()];if(!v)return st;var o={};Object.keys(st).forEach(function(k){o[k]=st[k];});Object.keys(v).forEach(function(k){o[k]=v[k];});return o;}
/* Part 1 rows for this pilgrim: in Hajj mode a Qarin / Mufrid never cuts after the arrival sa'i, so Phase 4 is a locked panel instead of tick rows */
function riteVis(st){return forMe(st)&&!(st.pair==='hair'&&journey()==='hajj'&&hajjType()!=='tamattu');}
function hajjSecOn(sec){return !sec.opt||ST[sec.opt]||sec.steps.some(function(st){return hajjChk[st.id];});}
function hajjSecs(){return HAJJ_RITES.filter(hajjSecOn);}
function hajjList(){var L=[],n=0;hajjSecs().forEach(function(s){s.steps.forEach(function(st){if(!forMe(st))return;n++;L.push({st:st,ph:s,n:n,hajj:true});});});return L;}
/* Part 2 takes over the Now strip once THIS trip's Umrah is recorded (Tamattu'), on any day of Hajj by the calendar (8..13), after the arrival sa'i (Qiran / Ifrad), or as soon as a real Hajj step is ticked */
function hajjPart2Active(){if(journey()!=='hajj')return false;if(tripUmrahs()>0)return true;if(typeof hajjDay()==='number')return true;if(hajjType()!=='tamattu'&&riteChk.laps)return true;return Object.keys(hajjChk).some(function(k){return hajjChk[k]&&(k==='hwadaEx'||!!hajjStep(k));});}
function hajjNext(){var L=hajjList();for(var i=0;i<L.length;i++){var st=L[i].st;if(hajjChk[st.id])continue;
  if(st.pair&&L.some(function(x){return x.st.pair===st.pair&&x.st.id!==st.id&&hajjChk[x.st.id];}))continue;return L[i];}return null;}
function hajjTotals(){var tot=0,done=0;hajjSecs().forEach(function(s){var c=riteCounts(s.steps,hajjChk);tot+=c.tot;done+=c.done;});return {tot:tot,done:done};}
/* Record-Hajj enablement: the ihram of Hajj (Tamattu') + Arafah + rami of the 10th + halq/taqsir + ifadah (+ the sa'i of Hajj, unless a Qarin/Mufrid already did it after the arrival tawaf) + wada or its exemption */
function hajjMissing(){var m=[];if(hajjType()==='tamattu'&&!hajjChk.h8niyyah)m.push('the ihram of Hajj (8th)');if(!hajjChk.h9wuquf)m.push('standing at Arafah');if(!hajjChk.h10rami)m.push('rami of the 10th');if(!(hajjChk.h10halq||hajjChk.h10halqw))m.push('halq / taqsir');if(!hajjChk.h10ifadah)m.push('tawaf al-ifadah');
  var saiOK=hajjChk.h10sai||(hajjType()!=='tamattu'&&(riteChk.laps||(ST.log||{}).saiEnd));if(!saiOK)m.push('the sa’i of Hajj');
  if(!(hajjChk.hwada||hajjChk.hwadaw||hajjChk.hwadaEx))m.push('tawaf al-wada (or its exemption)');return m;}
function hajjReady(){return hajjMissing().length===0;}
/* wajibs that do not block the record but deserve a look at "Missed it?" before it */
function hajjUnticked(){var ids=[['h9nstay','the night at Muzdalifah'],['h10hady','the hady'],['h10night','the night of the 10th in Mina'],['h11rami','rami of the 11th'],['h11night','the night of the 11th'],['h12rami','rami of the 12th']];if(ST.stay13)ids.push(['h13night','the night of the 13th'],['h13rami','rami of the 13th']);
  var L=[];ids.forEach(function(x){var st=hajjStep(x[0]);if(st&&forMe(st)&&!hajjChk[x[0]])L.push(x[1]);});return L;}
/* the sa'i of Hajj is still owed: always for Tamattu'; for Qiran / Ifrad only if no sa'i was done after the arrival tawaf */
function hajjSaiNeeded(){return hajjType()==='tamattu'||!(hajjChk.h10sai||riteChk.laps||(ST.log||{}).saiEnd);}
function togOn(id){var e=document.getElementById(id);if(e)e.classList.toggle('on');}
function togStay13(){ST.stay13=!ST.stay13;saveST();vib(8);updRites();toast(ST.stay13?'🌅 The 13th is in your plan — stone after midday, then leave':'Leaving on the 12th — be outside Mina before sunset');}
/* one tick row (shared by Part 1 and Part 2): req pill, Why?, Missed it?, delegation toggle, live counter chip, duas */
function stepRowHTML(st,n,tog,hajj){var v=hajj?riteStepView(st):st,id=st.id,ctr=v.counter,chip='';
  if(id==='rounds'||id==='laps')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goCounter(\''+(id==='rounds'?'tawaf':'sai')+'\')">🔄 Open counter →</button>';
  if(hajj&&ctr==='rami')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();openRami('+st.id.replace(/\D/g,'')+')">🪨 Open the rami counter →</button>';
  else if(hajj&&(ctr==='ifadah'||ctr==='wada'))chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goHajjCounter(\''+ctr+'\')">🔄 Open counter →</button>';
  else if(hajj&&id==='h10sai')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goHajjCounter(\'ifadah\',\'sai\')">🔄 Open the sa’i counter →</button>';
  var acts=(hajj&&v.miss?'<button class="xchip" aria-expanded="false" onclick="event.stopPropagation();togOn(\'miss-'+id+'\');this.setAttribute(\'aria-expanded\',document.getElementById(\'miss-'+id+'\').classList.contains(\'on\'))">🆘 Missed it?</button>':'')
    +(hajj&&v.del?'<button class="xchip del" id="del-'+id+'" role="switch" aria-checked="false" onclick="event.stopPropagation();ramiDel('+st.id.replace(/\D/g,'')+')">🤝 Delegated</button>':'')+chip;
  return '<div class="stp" id="rw-'+id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="'+tog+'(\''+id+'\')"><div class="stp-n">'+n+'</div><div class="stp-t"><b>'+v.b+(hajj&&v.req?' <span class="req '+v.req+'">'+v.req+'</span>':'')+'</b><p>'+v.p+(v.why?' <button class="why" onclick="event.stopPropagation();this.parentNode.nextSibling.classList.toggle(\'on\')" aria-label="Why this step?">Why?</button>':'')+'</p>'+(v.why?'<div class="whyb">'+v.why+'</div>':'')
    +(hajj&&v.miss?'<div class="whyb miss" id="miss-'+id+'"><b>Missed it?</b> '+esc(v.miss)+'</div>':'')
    +(v.kid?'<button class="xchip" onclick="event.stopPropagation();openStory(\''+v.kid+'\')">🧒 Story for the kids →</button>':'')
    +(hajj?(acts?'<div class="stp-acts">'+acts+'</div>':''):chip)
    +stDuas(v).map(function(d,k){return duaHTML(st,d,k);}).join('')+'</div></div>';}
/* Part 2 · The days of Hajj — one section per day, folded until its date, auto-opened on its day, never hidden once past */
function renderHajjRites(){var hc=document.getElementById('hajjContainer');if(!hc)return;if(journey()!=='hajj'){hc.innerHTML='';return;}
  var hd=hajjDay(),y=curHajjYear(),D=hajjDates(y),ty=hajjType(),n=0,h='';
  h+='<div class="subt" id="hajjPart2">Part 2 · The days of Hajj '+y+'</div><p class="hajj-rule" id="hajjRule">'+mk('alert','mkt')+'<b>Hajj rulings:</b> confirm with your group leader or a scholar.</p>';
  h+='<div class="note" style="margin:0 2px 12px">'+HAJJ_TYPES[ty].t+' — '+HAJJ_TYPES[ty].s+'. <button class="lnk" style="font-size:1em" onclick="goTab(\'more\',\'settings\',\'hajjSet\')">Change type</button>'+(D[8]?'<br>8 Dhul Hijjah ≈ '+fmtDate(D[8],true)+' · each day opens on its date; nothing closes because a day has passed.':'')+'</div>';
  HAJJ_RITES.forEach(function(s){var inner='',open;
    if(typeof hd==='number')open=s.hd===hd;else open=s.hd===null&&(hd==='post'||!!(hajjChk.h12leave||hajjChk.h13rami));
    if(s.opt==='stay13')inner+='<div class="brg'+(ST.stay13?' done':'')+'" id="stay13Row" role="checkbox" tabindex="0" aria-checked="'+(ST.stay13?'true':'false')+'" onclick="togStay13()"><span class="tick"></span><span>I am staying for the 13th (nafr ath-thani — what the Prophet ﷺ did)</span></div>';
    if(s.kn)inner+='<div class="kn">🧒 '+s.kn+'</div>';
    s.steps.forEach(function(st){if(!forMe(st))return;n++;inner+=stepRowHTML(st,n,'togHajj',true);});
    if(s.id==='hdw')inner+='<div class="brg" id="rw-hwadaEx" role="checkbox" tabindex="0" aria-checked="false" onclick="togHajj(\'hwadaEx\')"><span class="tick"></span><span>'+mk('flower','mkt')+'Waived for me — on my period (sisters) or I live in Makkah</span></div>';
    var sec={id:s.id,ico:s.ico,title:s.title+(D[s.hd]?'<small>'+fmtDate(D[s.hd],true)+(s.night?' · night':'')+(s.sub?' · '+s.sub:'')+'</small>':(s.sub?'<small>'+s.sub+'</small>':'')),hn:s.hn};
    h+=mkSec(sec,!open,inner);});
  h+='<div class="rite-done" id="hajjDone"><b>'+markify('⛺ Your Hajj ')+y+'</b><p id="hajjReadyNote"></p><p id="hajjWajibNote" style="font-size:var(--t-3);color:var(--ink2);line-height:var(--lh-body)"></p><div class="hlog" id="hlogArea"></div><button class="btn gold" id="hajjRecordBtn" onclick="finishHajj()" disabled>'+markify('🎉 Record completed Hajj')+'</button><div id="hajjDoneNote"></div><button class="lnk fresh" onclick="startFreshHajj()">↺ Start fresh (nothing recorded)</button></div>';
  h+=mkSec({id:'htrouble',ico:'🆘',title:'If something goes wrong in the days of Hajj',sub:'Missed stoning · period before ifadah · too weak · lost in Mina · wrong order'},true,accs(TROUBLE_HAJJ));
  hc.innerHTML=h;updHajjRites();}
function updHajjRites(){if(journey()!=='hajj'||!document.getElementById('hajjPart2'))return;
  var L=hajjList();
  HAJJ_RITES.forEach(function(s){s.steps.forEach(function(st){var on=!!hajjChk[st.id],w=document.getElementById('rw-'+st.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}
      if(st.del){var d=document.getElementById('del-'+st.id),dl=!!((ST.rami[s.hd]||{}).del);if(d){d.classList.toggle('on',dl);d.setAttribute('aria-checked',dl?'true':'false');}}
      var lc=document.getElementById('live-'+st.id);if(lc&&st.counter&&st.counter!=='rami'){var m=tmode(),k=st.id==='h10sai'?'sai':'tawaf',u=k==='sai'?'laps':'rounds',mine=(k==='sai'?(TM[m].sai&&TM[m].sai.chk==='h10sai'):TM[m].chk&&tmChkId(TM[m])===st.id);lc.textContent=mine?'🔄 '+ST[k]+' / 7 '+u+' · Open counter →':(k==='sai'?'🔄 Open the sa’i counter →':'🔄 Open counter →');}
      if(st.counter==='rami'&&lc){var r=ST.rami[s.hd]||{},js=ramiJams(s.hd),dn=js.filter(function(j){return (r[j]||0)>=7;}).length;lc.textContent=r.del?'🤝 Delegated today · Open the rami counter →':dn?'🪨 '+dn+' / '+js.length+' jamarat done · Open the rami counter →':'🪨 Open the rami counter →';}});
    var c=riteCounts(s.steps,hajjChk),sp=document.getElementById('sp-'+s.id);if(sp){var vis=hajjSecOn(s);sp.textContent=!vis?'optional':c.tot&&c.done>=c.tot?'✓ done':c.done?c.done+'/'+c.tot:(typeof hajjDay()==='number'&&hajjDay()===s.hd?'today':c.tot+' steps');sp.classList.toggle('ok',c.tot>0&&c.done>=c.tot);}});
  var ex=document.getElementById('rw-hwadaEx');if(ex){ex.classList.toggle('done',!!hajjChk.hwadaEx);ex.setAttribute('aria-checked',hajjChk.hwadaEx?'true':'false');}
  var s13=document.getElementById('stay13Row');if(s13){s13.classList.toggle('done',!!ST.stay13);s13.setAttribute('aria-checked',ST.stay13?'true':'false');}
  var miss=hajjMissing(),rb=document.getElementById('hajjRecordBtn'),rn=document.getElementById('hajjReadyNote'),rd=document.getElementById('hajjDone'),wn=document.getElementById('hajjWajibNote'),dn=document.getElementById('hajjDoneNote');
  /* (review) this year's Hajj is already recorded and Part 2 is clear: say so (from us-hajjlog, so it survives a reload) instead of asking for the pillars again */
  var H=[];try{H=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}if(!Array.isArray(H))H=[];var last=H.length?H[H.length-1]:null,recorded=!!(last&&last.y===curHajjYear()&&!Object.keys(hajjChk).some(function(k){return hajjChk[k];}));
  if(rb){rb.disabled=miss.length>0;rb.hidden=recorded;}if(rd)rd.classList.toggle('ready',miss.length===0);
  if(rn){rn.hidden=recorded;rn.textContent=miss.length?'Record it once these are ticked: '+miss.join(' · ')+'.':'Every pillar and duty is ticked — may Allah accept it. Record it to keep its timeline and keepsake.';}
  if(wn){var un=recorded?[]:hajjUnticked();wn.hidden=!un.length;wn.textContent=un.length?'Still unticked (not required to record, but read "Missed it?" on each first): '+un.join(' · ')+'.':'';}
  if(dn&&recorded&&!dn.innerHTML)dn.innerHTML='<div class="rd-note">'+mk('medal','mkt')+'Hajj '+last.y+' recorded — may Allah accept it!<div class="rd-acts"><button class="chip-btn" onclick="makeHajjKeepsake('+(H.length-1)+')">🎴 Keepsake</button><button class="chip-btn" onclick="goTab(\'more\',\'guide\',\'journeysArea\')">📜 My journeys</button></div></div>';
  renderHlog();}
function renderHlog(){var a=document.getElementById('hlogArea');if(!a)return;var lg=ST.hlog||{},rows=[['🏔️','Arafah',lg.h9wuquf],['🪨','Rami of the 10th',lg.h10rami],['✂️','Halq / taqsir',lg.h10halq||lg.h10halqw],['🕋','Tawaf al-ifadah',lg.ifadahEnd||lg.h10ifadah,lg.ifadahStart],['⛰️','Sa’i of Hajj',lg.hsaiEnd||lg.h10sai,lg.hsaiStart],['👋','Tawaf al-wada',lg.wadaEnd||lg.hwada||lg.hwadaw,lg.wadaStart]],h='';
  rows.forEach(function(r){var on=!!r[2];h+='<div class="lg'+(on?' on':'')+'"><span class="lg-i">'+mkOr(r[0],'')+'</span><span class="lg-t">'+r[1]+(on&&r[3]&&r[2]>r[3]?' <em>'+fmtDur(r[2]-r[3])+'</em>':'')+'</span><span class="lg-v">'+(on?fmtTime(r[2]):'—')+'</span></div>';});a.innerHTML=h;}
/* ticks go to hajjChk ('us-hajj') and stamp ST.hlog — never riteChk / ST.log */
function togHajj(id,quiet){hajjChk[id]=!hajjChk[id];save('us-hajj',hajjChk);vib(15);if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(hajjChk[id]){if(!ST.hlog[id])ST.hlog[id]=Date.now();}else delete ST.hlog[id];saveST();
  updRites();focusRites(false);
  if(!quiet){var st=hajjStep(id);if(hajjChk[id])toast('✓ '+fcText(st?riteStepView(st).b:'Step')+' — tap again to undo');}}
/* (review) the counter never opens in a mode other than the one requested: if the mode is not due yet, ask inline instead of falling through to the current mode */
function goHajjCounter(m,k){if(tmodesDue().indexOf(m)>-1){setTmode(m,true);goCounter(k||'tawaf');return;}
  var ks=k==='sai'?'\'sai\'':'null';
  if(m==='ifadah')openSheet('<div class="sheet-h">'+mk('kaaba')+'</div><h3>Tawaf al-ifadah already?</h3><p>It comes after the standing at Arafah. If you have stood at Arafah, confirm it — the counter then opens in ifadah mode and never touches your Umrah record.</p><button class="btn tall" onclick="closeSheet();if(!hajjChk.h9wuquf)togHajj(\'h9wuquf\',true);goHajjCounter(\'ifadah\','+ks+')">✓ I have stood at Arafah — this is tawaf al-ifadah</button><button class="btn ghost tall" onclick="closeSheet()">Not yet</button>');
  else if(m==='wada')openSheet('<div class="sheet-h">👋</div><h3>Tawaf al-wada already?</h3><p>The farewell tawaf is the last thing you do — after tawaf al-ifadah. If you did the ifadah without the counter, tick its step first; then the wada counter opens.</p><button class="btn tall" onclick="closeSheet();goTab(\'umrah\',\'steps\',\'rw-h10ifadah\')">Open the ifadah step</button><button class="btn ghost tall" onclick="closeSheet()">Not yet</button>');
  else toast(tmWhyNot(m));}
/* U-23: the one moment the Hajj type matters and the pilgrim can answer — before the hair is cut */
function halqGate(id){var h='<div class="sheet-h">🤍</div><h3>What did you say at the miqat?</h3><p>Your words at the miqat decide whether you cut now or stay in ihram until the 10th. Your group leader knows which one your package follows.</p>';
  ['tamattu','qiran','ifrad'].forEach(function(t){var T=HAJJ_TYPES[t];h+='<button class="opt big" onclick="halqGateGo(\''+t+'\',\''+id+'\')"><span lang="ar" style="font-size:var(--t-5)">'+T.ar.split(' ').slice(-1)[0]+'</span><div><b>'+T.talb+'</b><small>'+T.t+' · '+T.s+(t==='tamattu'?' — cut now':' — stay in ihram')+'</small></div></button>';});
  h+='<button class="btn ghost" onclick="closeSheet()">Not sure — ask my group leader first</button>';openSheet(h);}
function halqGateGo(t,id){closeSheet();ST.hajjTypeConfirmed=true;
  if(t==='tamattu'){ST.hajjType='tamattu';saveST();applyJourney();if(!riteChk[id])togRite(id);else updRites();return;}
  setHajjType(t);toast('🤍 '+HAJJ_TYPES[t].t+' — you stay in ihram until the 10th. Part 2 is open below.',true);
  setTimeout(function(){setSecOpen('hd8',true);jumpTo('riteLock',true);},350);}
/* ── Rami counter: 7 pebbles per jamarah per day, in order — stored ST.rami[day][jamarah], a delegation flag per day ── */
var JAM={sughra:['Jamrat as-Sughra','the small one · nearest Mina'],wusta:['Jamrat al-Wusta','the middle one'],aqabah:['Jamrat al-Aqabah','the big one · nearest Makkah']};
var ramiDay=0,ramiForce=false,ramiJ=0,ramiLast=0;
function ramiJams(d){return parseInt(d)===10?['aqabah']:['sughra','wusta','aqabah'];}
function ramiD(d){if(!ST.rami||typeof ST.rami!=='object')ST.rami={};if(!ST.rami[d]||typeof ST.rami[d]!=='object')ST.rami[d]={};return ST.rami[d];}
function ramiDefaultDay(){var hd=hajjDay();if(typeof hd==='number'&&hd>=10)return hd;var ds=Object.keys(ST.rami||{}).map(Number).filter(function(x){return x>=10&&x<=13;});if(hd==='post'&&ds.length)return Math.max.apply(null,ds);return ds.length?Math.max.apply(null,ds):10;}
function ramiDone(d){var r=(ST.rami||{})[d]||{};return !!r.del||ramiJams(d).every(function(j){return (r[j]||0)>=7;});}
function ramiVisible(){if(journey()!=='hajj')return false;var hd=hajjDay();return ramiForce||(typeof hd==='number'&&hd>=10)||hd==='post'||Object.keys(ST.rami||{}).length>0;}
function ramiSetDay(d){ramiDay=d;ramiJ=0;renderRami();vib(6);}
function renderRami(){var c=document.getElementById('ramiCard');if(!c)return;var HJ=journey()==='hajj';c.hidden=!HJ;if(!HJ)return;
  if(!ramiVisible()){c.classList.add('compact');c.innerHTML='<div class="cnt-sum" style="display:flex"><b>'+mk('stone','mkt')+'Rami — opens on 10&nbsp;Dhul&nbsp;Hijjah</b><button class="chip-btn" onclick="ramiForce=true;renderRami()">Open now</button></div>';return;}
  c.classList.remove('compact');if(!ramiDay)ramiDay=ramiDefaultDay();var d=ramiDay,r=(ST.rami||{})[d]||{},js=ramiJams(d),i=duaIdx('pebble'),dua=i>-1?DUAS[i]:null;
  var h='<h3>'+mk('stone','mkt')+'Rami — '+d+' Dhul Hijjah'+(DH_NAME[d]?' · '+DH_NAME[d]:'')+'</h3><div class="segmini rami-days" role="group" aria-label="Day of stoning">'+[10,11,12,13].map(function(x){return '<button'+(x===d?' class="on"':'')+' onclick="ramiSetDay('+x+')">'+x+(ramiDone(x)?' ✓':'')+'</button>';}).join('')+'</div>';
  h+='<div class="cnt-sub">'+(d===10?'Jamrat al-Aqabah only — the big one nearest Makkah. From sunrise; the weak who left Muzdalifah early: Shafi’is / Hanbalis from after midnight, Hanafis / Malikis from Fajr — if unsure, wait for Fajr. Stop the talbiyah at the first pebble.':'After midday: small → middle → Aqabah, in this order. One pebble at a time, "Allahu akbar" with each, into the basin. Dua after the first two, not after Aqabah.')+'<br><b>Tap the number after each pebble.</b></div>';
  js.forEach(function(j,k){var n=Math.min(7,r[j]||0),ok=n>=7,prev=k>0&&(r[js[k-1]]||0)<7;
    h+='<div class="rami-j'+(r.del?' dis':'')+'" id="rj-'+j+'"><div class="rami-t"><b>'+(k+1)+'. '+JAM[j][0]+(ok?' ✓':'')+'</b><small>'+JAM[j][1]+(prev&&!ok?' · after the previous one':'')+'</small><div class="pebs" aria-hidden="true">'+[1,2,3,4,5,6,7].map(function(x){return '<i'+(x<=n?' class="on"':'')+'></i>';}).join('')+'</div></div>'
      +'<button class="rring'+(ok?' ok':'')+'" aria-label="'+JAM[j][0]+': '+n+' of 7 pebbles — tap to count one" onclick="ramiTap(\''+j+'\',1)">'+n+'<small>of 7</small></button><button class="chip-btn" aria-label="Undo one pebble at '+JAM[j][0]+'" onclick="ramiTap(\''+j+'\',-1)"'+(n?'':' disabled')+'>−1</button></div>';});
  h+='<div class="brg'+(r.del?' done':'')+'" role="switch" tabindex="0" aria-checked="'+(r.del?'true':'false')+'" onclick="ramiDel('+d+')"><span class="tick"></span><span>'+mk('group','mkt')+'Delegated — someone who has stoned for themselves threw my pebbles today</span></div>';
  if(dua)h+='<div class="cnt-dua"><div class="dua tapable" role="button" tabindex="0" aria-label="Open the takbir full screen" onclick="openDua('+i+')"><div class="dua-top"><small>'+dua.t+'</small><button class="say" data-ar="'+dua.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar">'+dua.ar+'</span><span class="tl">'+dua.tl+'</span><span class="enl">⛶ tap to enlarge</span></div></div>';
  h+='<div class="cnt-acts"><button class="btn big" onclick="enterFocus(\'rami\')">⛶ Big counter</button><button class="chip-btn" onclick="troubleSheet()">'+markify('⚠️ Problem?')+'</button></div>';
  h+='<div class="cnt-done" id="ramiDone" style="display:'+(ramiDone(d)?'block':'none')+'">'+(r.del?mk('group','mkt')+'Delegated for today — the step is ticked in Part 2.':mk('check','mkt')+'Rami complete for the '+d+'th'+(d===10?' — next: hady, halq, then tawaf al-ifadah.':d===12?' — leaving? Be out of Mina before sunset.':' — back to the tent, takbir after every prayer.'))+' <button class="xchip" onclick="goTab(\'umrah\',\'steps\',\'rw-h'+d+'rami\')">Open day '+d+' →</button></div>';
  h+='<button class="lnk reset" onclick="ramiReset('+d+')">Reset the '+d+'th to 0</button>';
  c.innerHTML=h;}
function ramiStep(d){return hajjStep('h'+d+'rami');}
/* (review) on the 11th–13th the jamarat are stoned in order: a tap on a later jamarah while an earlier one is unfinished asks first instead of counting silently */
var ramiOrderOK=false;
function ramiOrderSheet(j,p,d){openSheet('<div class="sheet-h danger">🪨</div><h3>'+JAM[p][0]+' first</h3><p>On the '+d+'th the jamarat are stoned in order: small → middle → Aqabah. '+JAM[p][0]+' is at '+(ramiD(d)[p]||0)+' of 7. Count at '+JAM[j][0]+' anyway?</p><p style="font-size:var(--t-2)">If you really stoned out of order, read "Missed it?" on today’s rami step — most scholars count the order as a condition.</p><button class="btn ghost tall" onclick="closeSheet();ramiOrderOK=true;ramiTap(\''+j+'\',1);ramiOrderOK=false">Yes, count it anyway</button><button class="btn tall" onclick="closeSheet()">No — '+JAM[p][0]+' first</button>');}
function ramiTap(j,dlt){var d=ramiDay||ramiDefaultDay(),r=ramiD(d),n=Math.min(7,r[j]||0),v=Math.max(0,Math.min(7,n+dlt));if(v===n)return;
  if(dlt>0&&!r.del&&!ramiOrderOK){var js0=ramiJams(d),prev=js0.slice(0,js0.indexOf(j)).filter(function(x){return (r[x]||0)<7;});if(prev.length){ramiOrderSheet(j,prev[0],d);vib([40,40,40]);return;}}
  var now=Date.now();if(dlt>0){if(now-ramiLast<800){vib([40,40,40]);toast('Already counted — tap −1 if wrong');return;}ramiLast=now;}
  r[j]=v;var js=ramiJams(d),all=js.every(function(x){return (r[x]||0)>=7;}),stId='h'+d+'rami';
  if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(v===1&&dlt>0&&!ST.hlog['rami'+d+'Start'])ST.hlog['rami'+d+'Start']=now;
  if(all){ST.hlog['rami'+d]=ST.hlog['rami'+d]||now;if(!hajjChk[stId]){hajjChk[stId]=true;ST.hlog[stId]=ST.hlog[stId]||now;save('us-hajj',hajjChk);}}
  else if(hajjChk[stId]&&!r.del){delete hajjChk[stId];delete ST.hlog[stId];delete ST.hlog['rami'+d];save('us-hajj',hajjChk);}
  saveST();vib(v===7?[50,60,140]:35);
  var k=js.indexOf(j);if(v===7){if(all){confetti(50);toast('🪨 Rami of the '+d+'th complete — '+(d===10?'stop here, no dua after Aqabah; next the hady and halq':'back to Mina, takbir after every prayer'),true);}else{var nxj=js.slice(k+1).concat(js.slice(0,k)).filter(function(x){return (r[x]||0)<7;})[0];toast('✓ '+JAM[j][0]+' done — now '+JAM[nxj][0]+(k<2?' (make dua facing the qiblah first)':''),true);if(focusKey==='rami')ramiJ=js.indexOf(nxj);}}
  else cntToast(dlt>0?'Allahu akbar · '+v+' of 7 · '+JAM[j][0]:'↶ Back to '+v+' of 7');
  updRites();if(document.getElementById('focus').classList.contains('on')&&focusKey==='rami')renderFocusRami();}
function ramiDel(d){var r=ramiD(d),stId='h'+d+'rami';r.del=!r.del;if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(r.del){if(!hajjChk[stId]){hajjChk[stId]=true;ST.hlog[stId]=ST.hlog[stId]||Date.now();}}else if(!ramiJams(d).every(function(x){return (r[x]||0)>=7;})&&hajjChk[stId]){delete hajjChk[stId];delete ST.hlog[stId];}
  save('us-hajj',hajjChk);saveST();vib(10);ramiDay=d;updRites();toast(r.del?'🤝 Delegated — the rami of the '+d+'th is ticked for you':'Delegation removed for the '+d+'th');}
function ramiReset(d){openSheet('<div class="sheet-h danger">↺</div><h3>Reset the '+d+'th to 0?</h3><p>Clears today’s pebble counts and the delegation flag. To fix one extra tap, use −1 instead.</p><button class="btn danger tall" onclick="ramiResetGo('+d+')">↺ Reset to 0</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function ramiResetGo(d){closeSheet();var stId='h'+d+'rami';delete ST.rami[d];if(hajjChk[stId]){delete hajjChk[stId];save('us-hajj',hajjChk);}if(ST.hlog){delete ST.hlog[stId];delete ST.hlog['rami'+d];delete ST.hlog['rami'+d+'Start'];}saveST();ramiJ=0;ramiLast=0;updRites();toast('Rami of the '+d+'th reset to 0');}
function openRami(d){ramiForce=true;if(d>=10&&d<=13)ramiDay=d;else if(!ramiDay)ramiDay=ramiDefaultDay();ramiJ=0;renderRami();goTab('umrah','count','ramiCard');}
function renderFocusRami(){var d=ramiDay||ramiDefaultDay(),r=ramiD(d),js=ramiJams(d);if(ramiJ>=js.length)ramiJ=js.length-1;
  while(ramiJ<js.length-1&&(r[js[ramiJ]]||0)>=7)ramiJ++;var j=js[ramiJ],n=Math.min(7,r[j]||0),done=ramiDone(d);
  document.getElementById('focusTitle').innerHTML=mk('stone','mkt')+esc(JAM[j][0])+'<span class="ft-d"> · '+d+'&nbsp;DH</span>';document.getElementById('focusOf').innerHTML='of 7 pebbles · '+(ramiJ+1)+' of '+js.length+'<span class="fo-d"> · '+d+'&nbsp;DH</span>';
  var fn=document.getElementById('focusN'),fl=document.getElementById('focusLive'),t=document.getElementById('focusTip'),p=document.getElementById('focusDone'),h=document.getElementById('focusHint');
  if(fn)fn.textContent=n;if(fl)fl.textContent=JAM[j][0]+' '+n+' of 7';
  if(t){t.hidden=done;t.innerHTML='<b class="tip-a">'+(n<7?'Pebble '+(n+1)+' of 7 · "Allahu akbar"':'7 of 7 — done')+'</b><span class="tip-r">'+(d===10?'One at a time, into the basin. Stop the talbiyah at the first pebble. No dua after Aqabah.':ramiJ<2?'One at a time, into the basin. Then step aside, face the qiblah and make dua.':'One at a time, into the basin. No dua after Aqabah — back to the tent.')+'</span>';}
  if(h)h.hidden=done;if(p){p.hidden=!done;p.innerHTML=done?'<p>'+(r.del?'Delegated for today.':'Rami of the '+d+'th complete — '+(d===10?'next: hady, halq, then tawaf al-ifadah.':'back to Mina.'))+'</p><button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'rw-h'+d+'rami\')">Exit → Part 2, day '+d+'</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>':'';}
  if(done&&wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}}
/* ── finishing the Hajj: its own log ('us-hajjlog'), counter, badge and keepsake — Part 1's Umrah record is untouched ── */
function finishHajj(){var miss=hajjMissing();if(miss.length){toast('Not yet — still to tick: '+miss.join(', '));vib([40,40,40]);return;}
  var lg={};Object.keys(ST.hlog||{}).forEach(function(k){lg[k]=ST.hlog[k];});lg.done=Date.now();
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}if(!Array.isArray(hist))hist=[];
  hist.push({y:curHajjYear(),type:hajjType(),umrahN:ST.umrahs||0,name:ST.name||'',log:lg});localStorage.setItem('us-hajjlog',JSON.stringify(hist));var idx=hist.length-1;
  ST.hajjs=(ST.hajjs||0)+1;ST.hlog={};ST.rami={};ST.hajjTypeConfirmed=false;ST.tawaf=0;ST.sai=0;ST.tmode='nafl';ST.post=true;delete ST.stay13;saveST();
  hajjChk={};save('us-hajj',hajjChk);saiGo=false;cntForce={};lastTap={};ramiDay=0;ramiJ=0;ramiForce=false;
  renderPost();updRites();renderJourneys();chkBadges();applyJourney();updChip();homeRefresh();confetti(160);
  var note=document.getElementById('hajjDoneNote');if(note)note.innerHTML='<div class="rd-note">'+mk('medal','mkt')+'Hajj '+hist[idx].y+' recorded — may Allah accept it!<div class="rd-acts"><button class="chip-btn" onclick="makeHajjKeepsake('+idx+')">🎴 Keepsake</button><button class="chip-btn" onclick="goTab(\'more\',\'guide\',\'journeysArea\')">📜 My journeys</button></div></div>';
  toast('⛺ Hajj '+hist[idx].y+' recorded — may Allah accept it. "The accepted Hajj has no reward but Paradise" (Bukhari 1773)',true);
  if(document.getElementById('view-umrah').classList.contains('on'))setTimeout(function(){jumpTo('hajjDone',true);},400);}
function startFreshHajj(){openSheet('<div class="sheet-h danger">↺</div><h3>Start Part 2 fresh?</h3><p>Clears every Hajj tick, the pebble counts and this Hajj’s timeline <b>without recording a Hajj</b>. Your Umrah record, recorded Hajjs and keepsakes are kept.</p><button class="btn danger tall" onclick="startFreshHajjGo()">↺ Clear — nothing recorded</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function startFreshHajjGo(){closeSheet();hajjChk={};save('us-hajj',hajjChk);ST.hlog={};ST.rami={};ST.hajjTypeConfirmed=false;delete ST.stay13;if(tmHajj())ST.tmode='umrah';saveST();ramiDay=0;ramiJ=0;var n=document.getElementById('hajjDoneNote');if(n)n.innerHTML='';updRites();focusRites(false);toast('Cleared — nothing was recorded');vib(10);}
function makeHajjKeepsake(i){var hist=[];try{hist=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}var u=hist[i];if(!u)return;var lg=u.log||{},ty=(HAJJ_TYPES[u.type]||{}).t||'';
  var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d');
  kCloth(x,1080,1350);kBadge(x,540,250,'tent');
  x.textAlign='center';kLabel(x,'My Hajj · '+(u.y||'')+(ty?' · '+ty:''),540,400,40);
  x.font='600 64px '+KF;x.fillStyle=K.ihram;x.fillText(u.name||ST.name||'A guest of Allah',540,500);
  x.font='30px '+KB;x.fillStyle=K.ihram2;x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  var y=660;x.textAlign='left';x.font='30px '+KB;
  [['Arafah',lg.h9wuquf],['Rami of the 10th',lg.h10rami],['Halq / taqsir',lg.h10halq||lg.h10halqw],['Tawaf al-ifadah',lg.ifadahStart,lg.ifadahEnd||lg.h10ifadah],['Sa’i of Hajj',lg.hsaiStart,lg.hsaiEnd||lg.h10sai],['Tawaf al-wada',lg.wadaStart,lg.wadaEnd||lg.hwada||lg.hwadaw]].forEach(function(r){
    x.fillStyle=K.gold3;x.fillText(r[0],130,y);x.fillStyle=K.ihram;x.textAlign='right';var a=r[1],b=r[2];
    x.fillText(a?fmtTime(a)+(b&&b>a?' – '+fmtTime(b)+'  ('+fmtDur(b-a)+')':''):(b?fmtTime(b):'—'),950,y);x.textAlign='left';y+=66;});
  x.textAlign='center';x.font='500 28px '+KB;x.fillStyle=K.gold3;x.fillText('“…he will return as if he were born anew.” — Bukhari 1521',540,1140);
  kFoot(x,'Miqah · umrah-strivers.vercel.app',540,1190);
  exportImage(c,'my-hajj-'+(u.y||'')+'.png','My Hajj keepsake');}

/* ════════════════════════ DAILY ════════════════════════ */
/* D-20: rows a menstruating sister is excused from on a day flagged dailyChk['d<n>']._excused */
var EXCUSED_IDS=['fajr','dhuhr','asr','maghrib','isha','tahajjud','duha','ntawaf'];
function dayExcused(n){var d=dailyChk['d'+(n===undefined?ST.day:n)];return !!(d&&d._excused);}
/* D-09 / D-20: totals for one day — excused rows drop out, points carry the weight */
function itemCounts(n){var d=dailyChk['d'+n]||{},ex=!!d._excused,acc={tot:0,done:0,max:0,pts:0};DAILY.forEach(function(s){s.items.forEach(function(it){if(ex&&EXCUSED_IDS.indexOf(it.id)>-1)return;acc.tot++;acc.max+=it.pts;if(d[it.id]){acc.done++;acc.pts+=it.pts;}});});return acc;}
function renderDaily(){
  var h='';
  DAILY.forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      inner+='<div class="row" id="dw-'+it.id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="togDaily(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b><span class="rl">'+it.label+'</span>'+(it.pts>=15?'<span class="prio">Priority</span>':'')+(it.id==='ntawaf'?'<span class="xn" id="ntawafN" hidden></span>':'')+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+(it.ref?'<div class="rf">'+it.ref+'</div>':'')+refChip(it)+'</div></div>';
    });
    /* D-02: the tick rows come first; the section's hadith sits under them */
    var s2={};for(var k in sec)if(k!=='hn')s2[k]=sec[k];
    if(sec.hn)inner+='<div class="note">'+sec.hn+'</div>';
    h+=mkSec(s2,i>0,inner);
  });
  document.getElementById('dailyContainer').innerHTML=h;
}
function dayKey(){return 'd'+ST.day;}
function togDaily(id){var d=dailyChk[dayKey()]||{};if(d._excused&&EXCUSED_IDS.indexOf(id)>-1){toast('🌸 Not required today — you are excused');return;}d[id]=!d[id];if(id==='ntawaf'&&!d[id])delete d.ntawafN;dailyChk[dayKey()]=d;save('us-daily',dailyChk);vib(15);updDaily();updStats();chkBadges();}
/* ── D-01: which trip day is it really? Day 1 = the departure/arrival date (the itinerary's and onboarding's convention) ── */
function localMidnight(d){var x=new Date(d);x.setHours(0,0,0,0);return x;}
function expectedDay(){if(!ST.dep)return null;var since=Math.round((localMidnight(new Date())-localMidnight(new Date(ST.dep+'T00:00:00')))/86400000);if(isNaN(since)||since<0)return null;return Math.min(since+1,ST.tripLen);}
function dayDateObj(n){if(!ST.dep)return null;var dt=new Date(ST.dep+'T00:00:00');if(isNaN(dt))return null;dt.setDate(dt.getDate()+(n-1));return dt;}
function dayDateStr(n,long){var dt=dayDateObj(n);return dt?dt.toLocaleDateString('en-GB',long?{weekday:'long',day:'numeric',month:'long'}:{weekday:'short',day:'numeric',month:'short'}):'';}
function dayHasTicks(n){var d=dailyChk['d'+n]||{};return Object.keys(d).some(function(k){return k[0]!=='_'&&d[k]===true;});}
var daySyncHide=0,daySyncPending=0;
/* manual=true from ◀ ▶ / the heatmap; ST.dayAuto records whether the shown day is in step with the calendar */
function setDay(n,manual){n=Math.max(1,Math.min(ST.tripLen,n));var ex=expectedDay();ST.day=n;ST.dayAuto=!manual||ex===n;if(manual)daySyncPending=0;saveST();updDaily();updChip();renderItin();renderPT_tick();var it=itinDays()[ST.day-1];if(it&&it.city!==(ST.city||'Makkah'))setCity(it.city);}
function changeDay(d){var n=ST.day+d;if(n>=1&&n<=ST.tripLen)setDay(n,true);}
function goToday(){var ex=expectedDay();if(ex)setDay(ex,true);vib(8);}
/* follows the calendar unless the pilgrim deliberately parked on another day that has ticks — then a pill offers the switch */
function syncDay(){var ex=expectedDay();if(!ex||ex===ST.day){daySyncPending=0;return;}
  if(ST.dayAuto!==false||!dayHasTicks(ST.day)){setDay(ex,false);toast('📅 Moved to Day '+ex+' of '+ST.tripLen);}
  else{daySyncPending=ex;updDaily();}}
function dismissSync(){daySyncHide=expectedDay()||0;updDaily();}
(function(){function next(){var n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1,0,0,5);setTimeout(function(){syncDay();next();},Math.max(1000,m-n));}next();})();
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')syncDay();});
function dayPct(n){
  var d=dailyChk['d'+n];if(!d)return null;
  var c=itemCounts(n);return c.max?Math.round(c.pts/c.max*100):0;
}
function updDaily(){renderTB();renderWater();renderTodayTop();renderKidsDay();
  var ex=expectedDay(),off=!!ex&&ex!==ST.day,dd=document.getElementById('dayDisp');
  if(dd){var hdd=(!off&&journey()==='hajj')?hajjDay():null;
    /* J-08: during the days of Hajj the label leads with the Hijri day; nothing else about the day changes */
    dd.innerHTML=typeof hdd==='number'?hdd+' Dhul Hijjah <small>· day '+ST.day+' of '+ST.tripLen+'</small>':'Day '+ST.day+' <small>of '+ST.tripLen+'</small>';dd.setAttribute('aria-label',(typeof hdd==='number'?hdd+' Dhul Hijjah, ':'')+'Day '+ST.day+' of '+ST.tripLen+(off?(ST.day<ex?', a past day':', a day ahead'):'')+' — open trip stats');}
  var dl=document.getElementById('dayDate');if(dl){var dt=dayDateObj(ST.day),ds=dayDateStr(ST.day),hj=dt?hijriFor(dt.getFullYear(),dt.getMonth(),dt.getDate()):'';dl.textContent=(off?(ST.day<ex?'Past day · ':'Ahead · '):'')+(ds?ds+(hj?' · '+hj:''):'Set your departure date in Plan › Prepare for real dates');}
  var pv=document.getElementById('dayPrev'),nx=document.getElementById('dayNext'),td=document.getElementById('dayToday');
  if(pv){pv.disabled=ST.day<=1;pv.setAttribute('aria-disabled',pv.disabled?'true':'false');}if(nx){nx.disabled=ST.day>=ST.tripLen;nx.setAttribute('aria-disabled',nx.disabled?'true':'false');}if(td)td.hidden=!off;
  var d=dailyChk[dayKey()]||{},exc=!!d._excused;
  DAILY.forEach(function(sec){var sd=0,st=0;sec.items.forEach(function(it){var on=!!d[it.id],skip=exc&&EXCUSED_IDS.indexOf(it.id)>-1;if(!skip){st++;if(on)sd++;}
    var w=document.getElementById('dw-'+it.id);if(w){w.classList.toggle('done',on&&!skip);w.classList.toggle('excused',skip);w.setAttribute('aria-checked',on&&!skip?'true':'false');w.setAttribute('aria-disabled',skip?'true':'false');}});
    var sp=document.getElementById('sp-'+sec.id);if(sp)sp.textContent=sd+'/'+st;});
  var xn=document.getElementById('ntawafN');if(xn){var nn=d.ntawafN||0;xn.hidden=nn<2;xn.textContent='×'+nn;}
  var C=itemCounts(ST.day),pct=C.max?Math.round(C.pts/C.max*100):0;
  animPct('dPct',pct);setRing('dRing',pct);
  document.getElementById('dHeroT').textContent=pct>=100?'Perfect day':pct>=70?'Strong day':pct>=35?'Keep going':pct>0?'Good start':'Bismillah';
  var dhn=document.getElementById('dHeroN');if(dhn)dhn.textContent=C.done;
  document.getElementById('dHeroS').innerHTML='of '+C.tot+(exc?' that count today<span class="exc-line">Ihram, dhikr, dua and listening continue — tawaf and salah wait until you are pure (<a href="#" onclick="event.preventDefault();openQA(\'menses\')">Bukhari 305</a>)</span>':' completed');
  /* D-07: the real Friday's Dhuhr row is Jumu'ah */
  var rl=document.querySelector('#dw-dhuhr .rl');if(rl)rl.textContent=(ST.day===ex&&isFriday())?'Jumu’ah in congregation':'Dhuhr in congregation';
  renderDayTools(ex,off,exc);syncPTTiles();
  updStreaks();renderHeat();
}
/* D-01 / D-10 / D-20: the small row of day-level actions under the hero */
function renderDayTools(ex,off,exc){var a=document.getElementById('dayTools');if(!a)return;var h='';
  if(off&&daySyncPending===ex&&daySyncHide!==ex)h+='<button class="chip-btn sync" onclick="goToday()">📅 Today is Day '+ex+' — switch ▶</button><button class="chip-btn" onclick="dismissSync()" aria-label="Dismiss">✕</button>';
  if(ST.profile!=='m')h+='<button class="chip-btn exc'+(exc?' on':'')+'" onclick="excusedSheet()" aria-pressed="'+(exc?'true':'false')+'">'+mk('flower','mkt')+(exc?'Excused today ✓':'Excused today')+'</button>';
  if(ST.day>=ST.tripLen&&ST.tripLen>1)h+='<button class="chip-btn" onclick="goSub(\'daily\',\'stats\')">🏁 Trip finished? Stats &amp; share card</button>'+(ST.post?'':'<button class="chip-btn" onclick="startPost()">🌱 Turn on Post-Umrah habits</button>');
  a.innerHTML=h;}
/* D-20: the ruling in one sheet, reversible */
function excusedSheet(){var exc=dayExcused();
  openSheet('<div class="sheet-h rose">🌸</div><h3>'+(exc?'Day '+ST.day+' is excused':'Excused today?')+'</h3><p class="lead">Menstruating? The Prophet ﷺ told Aishah (RA): <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p><ul><li>Salah, tahajjud, duha and nafl tawaf are <b>not required</b> today — they will not count against you.</li><li>Quran (listening or tafsir), adhkar, dhikr, dua, sadaqah, serving pilgrims, ziyarah and Zamzam continue and still count.</li><li>Streaks pause — they neither grow nor break on an excused day.</li></ul>'
    +(exc?'<button class="btn tall" onclick="setExcused(false)">↩ Not excused today</button>':'<button class="btn tall rose" onclick="setExcused(true)">🌸 Mark Day '+ST.day+' excused</button>')+'<button class="btn ghost" onclick="closeSheet();openQA(\'menses\')">📖 Read the ruling</button><button class="btn ghost" onclick="closeSheet()">Close</button>');}
function setExcused(on){var d=dailyChk[dayKey()]||{};if(on)d._excused=true;else delete d._excused;dailyChk[dayKey()]=d;save('us-daily',dailyChk);closeSheet();updDaily();updStats();chkBadges();toast(on?'🌸 Day '+ST.day+' marked excused — everything else still counts':'Day '+ST.day+' is a full day again');vib(10);}
/* open one fiqh Q&A accordion by its id (FIQHQA/TROUBLE carry ids) */
function openQA(id){var L=FIQHQA.concat(TROUBLE).filter(forMe),i=-1;L.forEach(function(g,k){if(g.id===id)i=k;});var a=i>-1?document.querySelectorAll('#qaContainer .acc')[i]:null;if(a){a.classList.add('open');var hd=a.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('plan','learn',a?null:'qaCard');if(a)requestAnimationFrame(function(){setTimeout(function(){try{a.scrollIntoView({behavior:smooth(),block:'center'});}catch(e){}},60);});}
/* D-20: excused days neither count nor break the salah/tawaf streaks */
function streakOf(stk){
  var ids=[];DAILY.forEach(function(s){s.items.forEach(function(it){if(it.stk===stk)ids.push(it.id);});});
  var n=0,pause=stk!=='quran';
  for(var day=ST.day;day>=1;day--){
    var d=dailyChk['d'+day];if(pause&&d&&d._excused)continue;
    var hit=d&&ids.some(function(id){return d[id];});
    if(hit)n++;else if(day<ST.day)break;
  }
  return n;
}
/* D-08: labelled, explained, tappable streak tiles */
var STK_ROW={fajr:'fajr',tahaj:'tahajjud',quran:'recite',tawaf:'ntawaf'},STK_LBL={fajr:'Fajr',tahaj:'Tahajjud',quran:'Quran',tawaf:'Nafl tawaf'};
function updStreaks(){
  var m={fajr:'skFajr',tahaj:'skTahaj',quran:'skQuran',tawaf:'skTawaf'};
  Object.keys(m).forEach(function(k){var n=streakOf(k),el=document.getElementById(m[k]);if(!el)return;var num=el.querySelector('.n');if(num)num.innerHTML=n+'<small>d</small>';el.classList.toggle('on',n>=3);var lbl=n+'-day '+STK_LBL[k]+' streak'+(n>=3?' 🔥':'');el.setAttribute('title',lbl);el.setAttribute('aria-label',lbl+' — open the row');var l=el.querySelector('.l');if(l)l.textContent=STK_LBL[k].replace('Nafl tawaf','Tawaf')+(n>=3?' 🔥':'');});
}
function stkGo(k){var id=STK_ROW[k],row=document.getElementById('dw-'+id);if(!row)return;var sec=row.closest('.sec');if(sec)setSecOpen(sec.id.replace('sec-',''),true);vib(8);setTimeout(function(){jumpTo('dw-'+id,true);row.classList.add('hl');setTimeout(function(){row.classList.remove('hl');},1600);},80);}
/* D-10: the heatmap doubles as the day picker */
function renderHeat(){
  var g=document.getElementById('heatGrid');if(!g)return;var h='';
  for(var i=1;i<=ST.tripLen;i++){
    var p=dayPct(i),ex=dayExcused(i),cls='',dt=dayDateStr(i);
    if(p!==null&&p>0){cls=p>=90?'h4':p>=70?'h3':p>=40?'h2':'h1';}
    h+='<div class="hc '+cls+(i===ST.day?' now':'')+(ex?' exc':'')+'" role="button" tabindex="0" onclick="heatGo('+i+')" title="Day '+i+(dt?' · '+dt:'')+(p!==null?': '+p+'%':'')+(ex?' (excused)':'')+'" aria-label="Day '+i+(dt?', '+dt:'')+(p!==null?', '+p+'%':', not logged')+(ex?', excused':'')+' — open to log it">'+i+'</div>';
  }
  g.style.gridTemplateColumns='repeat('+Math.min(ST.tripLen,7)+',minmax(0,1fr))';
  g.innerHTML=h;
  var lg=document.getElementById('heatLeg');if(lg)lg.innerHTML='<i class="hc h1"></i>&lt;40% <i class="hc h2"></i>40% <i class="hc h3"></i>70% <i class="hc h4"></i>90%+ <span class="hleg-h">Tap a day to log it</span>';
}
function heatGo(i){setDay(i,true);goSub('daily','today',true);setTimeout(function(){jumpTo('dayNav',true);},60);vib(8);}
function statsEmpty(){var logged=0;for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0)logged++;}var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;return logged===0&&!totalUmrahs()&&pv===0&&tbTotal()===0;}
function updStats(){
  var logged=0,sum=0,best=0,bestD=0,perf=0,nt=0;
  for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0){logged++;sum+=p;if(p>best){best=p;bestD=i;}if(p>=80)perf++;}var dd=dailyChk['d'+i];if(dd)nt+=(dd.ntawafN||(dd.ntawaf?1:0));}
  function set(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  set('stDays',logged);set('stAvg',(logged?Math.round(sum/logged):0)+'%');set('stBest',bestD?'Day '+bestD+' ('+best+'%)':'—');set('stPerf',perf);
  set('stHeroN',logged);set('stHeroOf','of '+ST.tripLen+' days with worship logged');set('stHeroAvg',(logged?Math.round(sum/logged):0)+'%');set('stHeroBest',bestD?'Day '+bestD:'—');set('stHeroU',totalUmrahs());
  var fs=streakOf('fajr');set('stFajr',fs+(fs===1?' day':' days'));
  set('stUmrahs',totalUmrahs());set('stNafl',nt);set('stDhikr',tbTotal());
  /* D-17: the numbers shown elsewhere, on one scoreboard */
  set('stDuas',duas.filter(function(d){return d.done;}).length+' of '+duas.length);
  set('stKm','≈ '+kmEst()+' km');set('stCups',cupsTotal());
  var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;
  set('stPlaces',pv+' / '+PLACES.length);
  /* D-18: first-time visitors get a pointer to Today instead of a wall of zeros; the share card waits for real numbers */
  var empty=statsEmpty(),se=document.getElementById('stEmpty'),sb=document.getElementById('shareBtn');
  if(se)se.hidden=!empty;if(sb){sb.disabled=empty;sb.textContent=empty?'📸 Share card unlocks after your first day':'📸 Share my progress card';}
  renderBadges();
}
function setTripLen(v){var n=parseInt(v)||10;n=Math.max(3,Math.min(TRIP_MAX,n));ST.tripLen=n;if(ST.day>n)ST.day=n;delete ST.dayAuto;saveST();document.getElementById('tripLen').value=n;updRetDate();updDaily();updStats();renderItin();updChip();renderPrepJumps();}

/* ════════════════════════ PLACES ════════════════════════ */
var cityFilter='all',unvisOnly=false,tourOpen=false,nearPos=null,lastRoute={},routeSel={},routeClimbs={},routeWant=null;
var KAABA_LL=[21.4225,39.8262],NABAWI_LL=[24.4672,39.6111],CITY_N={makkah:'Makkah',madinah:'Madinah'};
/* L-06: landmark anchors — a hotel can be placed before travel, and a pin is always described by a name, never by coordinates */
var HOTEL_ANCHORS={makkah:[['Clock Tower',21.4187,39.8256],['King Abdulaziz Gate',21.4200,39.8238],['Ajyad / Misfalah',21.4160,39.8280],['Jarwal',21.4290,39.8210],['Aziziyah',21.4020,39.8700],['Kudai',21.4090,39.8180]],
  madinah:[['Bab as-Salam (west)',24.4677,39.6085],['Qiblatayn Rd',24.4790,39.6000],['Sultanah',24.4803,39.5966],['Quba Avenue',24.4500,39.6160],['Baqi’ side (east)',24.4675,39.6150]]};
function placeById(id){for(var i=0;i<PLACES.length;i++)if(PLACES[i].id===id)return PLACES[i];return null;}
function hav(a,b){var R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180,x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
/* which city a coordinate belongs to (null when >100 km from both Harams) */
function cityOf(ll){if(!ll)return null;var a=hav(ll,KAABA_LL),b=hav(ll,NABAWI_LL);if(Math.min(a,b)>100)return null;return a<b?'makkah':'madinah';}
function hotelPin(city){var h=ST.hotel;if(!h||Array.isArray(h)||typeof h!=='object')return null;var v=h[city];return (Array.isArray(v)&&v.length===2&&isFinite(v[0])&&isFinite(v[1]))?v:null;}
function anyPin(){return hotelPin('makkah')||hotelPin('madinah');}
/* v4.13: ST.hotel was one [lat,lng]; it is now {makkah:[..],madinah:[..]} — the old pin is filed under the city it sits in */
function migrateHotel(){var h=ST.hotel;if(Array.isArray(h)){var c=cityOf([+h[0],+h[1]]);ST.hotel={};if(c)ST.hotel[c]=[+h[0],+h[1]];saveST();}else if(h&&typeof h!=='object'){ST.hotel={};saveST();}}
function nearAnchor(city,ll){var best=null,bd=1e9;(HOTEL_ANCHORS[city]||[]).forEach(function(a){var d=hav(ll,[a[1],a[2]]);if(d<bd){bd=d;best=a[0];}});return bd<=2.5?best:CITY_N[city]+' pin';}
function pinName(city){var hi=ST.hotelInfo||{},pins=['makkah','madinah'].filter(hotelPin);return (hi.n&&pins.length===1)?hi.n:nearAnchor(city,hotelPin(city));}
function originFor(city){return nearPos||hotelPin(city);}
function kmStr(km){return km<0.05?'< 50 m':km<1?Math.round(km*1000/50)*50+' m':km<10?(Math.round(km*10)/10)+' km':Math.round(km)+' km';}
/* L-01 / L-06 / L-11: distances come from your live position, else from the hotel pin of THAT city; nothing beyond 100 km */
function distLbl(p){if(p.g==='haram')return 'inside the Haram';var from=nearPos||hotelPin(p.city);if(!from||!p.ll)return '';var km=hav(from,p.ll);if(km>100)return '';if(nearPos&&km<0.15)return '📍 you’re here';var walk=Math.round(km/4.5*60),suf=nearPos?' from you':' from hotel';return '≈ '+kmStr(km)+(km<3?' · '+walk+' min walk':'')+suf;}
function updHotelLbl(){var pins=['makkah','madinah'].filter(hotelPin);if(pins.length>1&&cityFilter==='madinah')pins.reverse();
  var l=document.getElementById('hotelLbl');if(l)l.textContent=pins.length?'🏨 '+pins.map(function(c){return pinName(c)+' · '+CITY_N[c];}).join(' | ')+(pins.length===1?' · distances from here':''):'🏨 Save your hotel to see walking times';
  var l2=document.getElementById('hotelLbl2');if(l2)l2.textContent=pins.length?'📍 '+pins.map(function(c){return CITY_N[c]+': '+pinName(c);}).join(' · ')+' — Places shows distances from here':'📍 Hotel not pinned — use your location at the hotel, or pick a landmark now';}
/* L-06: one sheet for both cities — GPS when you are there, a landmark when you are not, ✕ per city */
function hotelSheet(){var h='<div class="sheet-h">🏨</div><h3>Where is your hotel?</h3><p style="font-size:var(--t-3)">Places measures walking times and routes from it — one pin per city, so you can set both before you fly.</p><button class="btn" onclick="closeSheet();setHotelGPS()">📡 Use my location — I’m at the hotel now</button>';
  ['makkah','madinah'].forEach(function(c){var pin=hotelPin(c);h+='<div class="subt" style="margin-top:14px">'+mk(c==='makkah'?'kaaba':'dome','mkt')+CITY_N[c]+(pin?' · near '+esc(nearAnchor(c,pin)):' · not set')+'</div><div class="anch">'+HOTEL_ANCHORS[c].map(function(a,i){return '<button class="chip-btn'+(pin&&hav(pin,[a[1],a[2]])<.3?' on':'')+'" onclick="setHotelAnchor(\''+c+'\','+i+')">'+a[0]+'</button>';}).join('')+(pin?'<button class="chip-btn clr" onclick="clearHotel(\''+c+'\')">✕ Clear '+CITY_N[c]+' pin</button>':'')+'</div>';});
  openSheet(h);}
function setHotel(){hotelSheet();}
function setHotelAt(city,ll,label){ST.hotel=(ST.hotel&&!Array.isArray(ST.hotel)&&typeof ST.hotel==='object')?ST.hotel:{};ST.hotel[city]=[+ll[0],+ll[1]];saveST();updHotelLbl();renderPlaces();updPlaces();toast('🏨 '+CITY_N[city]+' hotel set near '+label+' — distances from here');if(routeWant===city)planRoute(city);}
function setHotelAnchor(city,i){var a=HOTEL_ANCHORS[city][i];if(!a)return;closeSheet();setHotelAt(city,[a[1],a[2]],a[0]);}
function clearHotel(city){if(ST.hotel&&!Array.isArray(ST.hotel))delete ST.hotel[city];saveST();closeSheet();updHotelLbl();renderPlaces();updPlaces();toast(CITY_N[city]+' hotel pin cleared');}
function setHotelGPS(){if(!navigator.geolocation){toast('Location not supported — pick a landmark','','Pick',hotelSheet);return;}toast('Locating…');
  navigator.geolocation.getCurrentPosition(function(pos){var ll=[pos.coords.latitude,pos.coords.longitude],c=cityOf(ll);if(!c){toast('Not in Makkah or Madinah — pick a landmark instead','','Pick',hotelSheet);return;}setHotelAt(c,ll,nearAnchor(c,ll));},function(){toast('Location denied — pick a landmark instead','','Pick',hotelSheet);});}
/* L-01 / L-11: Near me switches to the city you are standing in and says so; the button reads as a clearable state */
function nearMe(){var b=document.getElementById('nearBtn');
  if(nearPos){nearPos=null;if(b){b.classList.remove('on');b.innerHTML=markify('📡 Near me');}renderPlaces();updPlaces();return;}
  if(!navigator.geolocation){toast('Location not supported');return;}toast('Locating…');
  navigator.geolocation.getCurrentPosition(function(pos){nearPos=[pos.coords.latitude,pos.coords.longitude];if(b){b.classList.add('on');b.innerHTML=markify('📡 Near me ✓ · tap to clear');}
    var c=cityOf(nearPos);if(c&&cityFilter!==c)filterCity(c);else{renderPlaces();updPlaces();}
    toast(c?'📡 Sorted by distance — showing '+CITY_N[c]:'📡 You’re far from both cities — distances hidden');if(routeWant)planRoute(routeWant);},function(){toast('Location denied');});}
function plSearchable(p){return (p.n+' '+p.d+' '+p.tip+' '+(p.ar||'')+' '+(p.tags||[]).join(' ')+' '+(p.stop?'hop-on hop-off bus stop':'')).toLowerCase();}
function mapsSearch(p){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.q);}
function countable(p){return p.g!=='hajj'&&!p.noroute;}
function routable(p){return !!p.ll&&!p.noroute&&['tour','trip','haram','mharam'].indexOf(p.g)<0;}
function inRoute(id){var p=placeById(id);return !!(p&&routeSel[p.city]&&routeSel[p.city].indexOf(id)>-1);}
function visLbl(id){var v=placeVis[id];return v?'<span class="vtick">✓ '+(typeof v==='number'?'Visited · Day '+v:'Visited')+'</span>':'';}
function tourCard(){
  var st=TOUR.stops.map(function(x){return '<span class="stopchip '+x.r+'" role="button" tabindex="0" onclick="openPlace(\''+x.id+'\')"><i></i>'+x.n+' · '+x.t+'</span>';}).join('');
  return '<div class="tour'+(tourOpen?' open':'')+'" id="tourCard"><div class="tour-h" role="button" tabindex="0" aria-expanded="'+(tourOpen?'true':'false')+'" onclick="togTour(this)"><span class="tour-i">🚌</span><div><b>Ziyarah bus (hop-on hop-off)</b><small>City Sightseeing · 2 routes · 12 stops · tap for stops &amp; booking</small></div><span class="place-ch">▾</span></div>'
    +'<p>One ticket, two loops: the Red route is the history loop (Quba, Qiblatayn, the Trench, Uhud), the Green route circles the Prophet’s Mosque. Check the current timetable and price when booking.</p>'
    +'<div class="stops">'+st+'</div>'
    +'<a class="btn gold" style="margin-top:12px;text-align:center;text-decoration:none" href="'+TOUR.url+'" target="_blank" rel="noopener">🎟️ Book on city-sightseeing.com →</a>'
    +'<div class="tour-note">Tip: ride the full Red loop once for orientation, then hop off at Quba and Uhud around Fajr/Asr when they are calmest. Tap a stop to open its card.</div></div>';
}
function togTour(h){var t=h.parentNode;tourOpen=!t.classList.contains('open');t.classList.toggle('open',tourOpen);h.setAttribute('aria-expanded',tourOpen?'true':'false');}
/* one place card — collapsed header carries the Arabic name, access tags, distance and the visited day (L-04, L-05, L-10) */
function placeCard(p,q){
  var dist=distLbl(p),inR=inRoute(p.id),on=!!placeVis[p.id];
  var meta=(p.stop?'<span class="stopbadge '+(p.stop[0]==='R'?'red':'green')+'" role="button" tabindex="0" aria-label="Hop-on hop-off stop — open the bus card" onclick="event.stopPropagation();openTour()">🚌 Stop '+p.stop.slice(1)+' · '+(p.stop[0]==='R'?'Red':'Green')+'</span>':'')
    +(p.tags||[]).map(function(t){return '<span class="ptag">'+t+'</span>';}).join('')+(dist?'<span class="distchip">'+dist+'</span>':'')+visLbl(p.id);
  return '<div class="place'+(on?' vis':'')+(q?' open':'')+'" id="pl-'+p.id+'"><div class="place-h" onclick="this.parentNode.classList.toggle(\'open\')"><div class="place-ico" role="button" tabindex="0" aria-label="'+(on?'Visited — tap to unmark':'Mark visited')+'" onclick="event.stopPropagation();togPlace(\''+p.id+'\')">'+p.i+'</div><div class="place-t"><b>'+p.n+'</b>'+(p.ar?'<span class="plar" lang="ar" dir="rtl">'+p.ar+'</span>':'')+meta+'<p>'+p.d+'</p><div class="tip">'+mk('bulb','mkt')+p.tip+'</div></div><span class="place-ch">▾</span></div>'
    +'<div class="place-a"><a href="'+mapsSearch(p)+'" target="_blank" rel="noopener">🗺️ Open in Maps</a><button onclick="showPlaceDriver(\''+p.id+'\')">🚕 Show driver</button>'+(routable(p)?'<button class="rt'+(inR?' on':'')+'" onclick="togRoute(\''+p.id+'\')">'+(inR?'✓ In route':'＋ Route')+'</button>':'')+'<button class="mv" onclick="togPlace(\''+p.id+'\')">'+(on?'✓ Visited':'Mark visited')+'</button></div>'
    +(p.id==='rawdah'?'<div class="place-a" style="margin-top:8px"><a href="https://www.nusuk.sa/" target="_blank" rel="noopener">🎫 Get the free Rawdah permit on Nusuk</a></div>':'')
    +(['taneem','jiranah','miqat'].indexOf(p.id)>-1?'<div class="place-a" style="margin-top:8px"><button onclick="goTab(\'umrah\',\'steps\')">🤍 Umrah steps — ihram from here</button></div>':'')+'</div>';
}
function renderPlaces(){
  var h='',c0=document.getElementById('placesContainer');if(!c0)return;
  var q=(document.getElementById('plSearch')||{}).value||'';q=q.trim().toLowerCase();
  /* L-02: remember what is open so a rebuild (filter, Near me, hotel) never folds a card or a group under the reader */
  var openSet={},secOpen={};c0.querySelectorAll('.place.open').forEach(function(e){openSet[e.id]=1;});c0.querySelectorAll('.sec:not(.shut)').forEach(function(e){secOpen[e.id]=1;});
  ['makkah','madinah'].forEach(function(city){
    if(!q&&cityFilter!=='all'&&cityFilter!==city)return; /* a search always looks in both cities */
    var cityAny=false,ch='',groups=GORDER[city].slice(),lists={},HJ=journey()==='hajj';
    /* J-08: going for Hajj, the Hajj sites come right after the Haram and stay unfolded */
    if(HJ&&city==='makkah')groups=['haram','hajj'].concat(groups.filter(function(g){return g!=='haram'&&g!=='hajj';}));
    groups.forEach(function(g){var list=PLACES.filter(function(p){return p.city===city&&p.g===g&&(!unvisOnly||!placeVis[p.id])&&(!q||plSearchable(p).indexOf(q)>-1);});
      if(nearPos)list=list.slice().sort(function(a,b){return (a.ll?hav(nearPos,a.ll):1e9)-(b.ll?hav(nearPos,b.ll):1e9);});lists[g]=list;});
    /* L-01: with a live position, groups follow their nearest member (the Haram / Prophet's Mosque stay first) */
    if(nearPos){var pin=function(g){return g==='haram'||g==='mharam';},gd=function(g){var l=lists[g];return l.length&&l[0].ll?hav(nearPos,l[0].ll):1e9;};groups.sort(function(a,b){if(pin(a)!==pin(b))return pin(a)?-1:1;return gd(a)-gd(b);});}
    groups.forEach(function(g){
      if(city==='madinah'&&g==='tour'&&!q){ch+=tourCard();cityAny=true;}
      var list=lists[g];if(!list.length)return;cityAny=true;
      var inner=list.map(function(p){return placeCard(p,q);}).join(''),sid='grp-'+city+'-'+g;
      if(!q&&GFOLD[city].indexOf(g)>-1){var vis=list.filter(function(p){return placeVis[p.id];}).length,openG=secOpen['sec-'+sid]||(HJ&&g==='hajj');ch+=mkSec({id:sid,ico:mk(emk(GLABEL[g].split(' ')[0],'pin')),title:GLABEL[g].replace(/^\S+\s/,''),sub:list.length+' sites · '+vis+' visited · tap to show'},!openG,inner);}
      else ch+='<div class="subt" id="'+sid+'">'+markify(GLABEL[g])+'</div>'+inner;
    });
    if(!cityAny)return;
    h+='<div class="cityhd" id="city-'+city+'">'+markify(city==='makkah'?'🕋 Makkah al-Mukarramah':'🕌 Madinah al-Munawwarah')+'</div>';
    if(!q)h+='<div class="jumps">'+groups.map(function(g){return lists[g].length?'<button onclick="plJump(\''+city+'\',\''+g+'\')">'+markify(GSHORT[g])+'</button>':'';}).join('')+'</div>';
    if(!q)h+='<button class="btn ghost" style="margin:0 0 12px" onclick="planRoute(\''+city+'\')">'+markify('🧭 Plan a ziyarah route for ')+CITY_N[city]+'</button><div id="route-'+city+'"></div>';
    h+=ch;
  });
  c0.innerHTML=h||'<div class="note" style="margin:0">'+(unvisOnly&&!q?'Everything in this list is visited — mashallah! Switch off “Unvisited” to see all sites.':'No places match — try "Quba", "Uhud", "Hira" or "bus".')+'</div>';
  Object.keys(openSet).forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('open');});
  c0.querySelectorAll('.sec').forEach(function(s){var ct=s.querySelector('.sec-ct');if(ct)ct.textContent=s.querySelectorAll('.place').length+' sites';});
  ['makkah','madinah'].forEach(function(c){if(lastRoute[c])drawRoute(c);});
  updUnvisPill();
}
/* jump chips un-fold a collapsed group before scrolling to it (L-09) */
function plJump(city,g){var id='grp-'+city+'-'+g,s=document.getElementById('sec-'+id);if(s){s.classList.remove('shut');var hd=s.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');jumpTo('sec-'+id);}else jumpTo(id);}
/* open a card that is already in the DOM (un-folding its group); false when the filters hide it */
function plShow(id){var el=document.getElementById('pl-'+id);if(!el)return false;var s=el.closest('.sec');if(s&&s.classList.contains('shut')){s.classList.remove('shut');var hd=s.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');}el.classList.add('open');return true;}
function plGo(id){if(plShow(id))jumpTo('pl-'+id);else openPlace(id);}
/* L-10: mark visited from the icon; the card is patched in place (scroll and open state untouched); the visit day is stored */
function patchPlace(id){var el=document.getElementById('pl-'+id);if(!el)return;var on=!!placeVis[id];el.classList.toggle('vis',on);
  var ico=el.querySelector('.place-ico');if(ico)ico.setAttribute('aria-label',on?'Visited — tap to unmark':'Mark visited');
  var mv=el.querySelector('.place-a .mv');if(mv)mv.textContent=on?'✓ Visited':'Mark visited';
  var t=el.querySelector('.vtick');if(t)t.remove();
  if(on){var b=el.querySelector('.place-t'),sp=document.createElement('span');sp.className='vtick';sp.textContent='✓ '+(typeof placeVis[id]==='number'?'Visited · Day '+placeVis[id]:'Visited');b.insertBefore(sp,b.querySelector('p'));}}
function togPlace(id){if(placeVis[id])delete placeVis[id];else placeVis[id]=ST.day||1;save('us-places',placeVis);patchPlace(id);updPlaces();updUnvisPill();
  ['makkah','madinah'].forEach(function(c){if(lastRoute[c])drawRoute(c);});
  /* D-06: a real ziyarah site (not the Haram, a day trip or a bus stop) logs today's ziyarah row once */
  if(placeVis[id]){vib(25);var p=placeById(id);if(p&&['tour','trip','haram','mharam'].indexOf(p.g)<0){var k=dayKey(),d=dailyChk[k]||{};if(!d.ziyarah){d.ziyarah=true;dailyChk[k]=d;save('us-daily',dailyChk);updDaily();updStats();toast('📍 Ziyarah logged for Day '+ST.day);}}}
  chkBadges();}
/* L-01: the city pill is remembered; a quiet call (deep links) does not overwrite the choice */
function filterCity(c,quiet){cityFilter=c;if(!quiet){ST.placesCity=c;saveST();}syncPills();renderPlaces();updPlaces();}
function syncPills(){['All','Makkah','Madinah'].forEach(function(x){var e=document.getElementById('pill'+x);if(e)e.classList.toggle('on',cityFilter===x.toLowerCase());});}
function placesBoot(){if(['all','makkah','madinah'].indexOf(ST.placesCity)>-1){cityFilter=ST.placesCity;syncPills();}}
function placesSeed(){if(!ST.placesCity)filterCity(ST.city==='Madinah'?'madinah':'makkah');}
/* L-12: a fourth pill narrows the current city scope to what is still unvisited */
function togUnvis(){unvisOnly=!unvisOnly;var e=document.getElementById('pillUnvis');if(e){e.classList.toggle('on',unvisOnly);e.setAttribute('aria-pressed',unvisOnly?'true':'false');}renderPlaces();}
function updUnvisPill(){var e=document.getElementById('pillUnvis');if(!e)return;var n=PLACES.filter(function(p){return (cityFilter==='all'||p.city===cityFilter)&&!placeVis[p.id];}).length;e.textContent='⬜ Unvisited · '+n;}
/* L-08: the hero counts visits per city (no denominator, no ring) and points at the nearest unvisited site */
function updPlaces(){var cnt={makkah:0,madinah:0};Object.keys(placeVis).forEach(function(k){if(!placeVis[k])return;var p=placeById(k);if(p&&countable(p))cnt[p.city]++;});
  var s=document.getElementById('plHeroS');if(s)s.innerHTML='<span class="hs-mi"><small class="hs-ml">Makkah </small><b class="hs-mv">'+cnt.makkah+' visited</b></span><span class="hs-mi"><small class="hs-ml">Madinah </small><b class="hs-mv">'+cnt.madinah+' visited</b></span>';
  var pn=document.getElementById('plHeroN'),po=document.getElementById('plHeroOf');if(pn)pn.textContent=cnt.makkah+cnt.madinah;if(po)po.textContent='of '+PLACES.filter(countable).length+' places visited';
  var slot=document.getElementById('plNear');if(!slot)return;
  var city=cityFilter==='madinah'?'madinah':cityFilter==='makkah'?'makkah':(ST.city==='Madinah'?'madinah':'makkah');
  if(nearPos){var c2=cityOf(nearPos);if(c2)city=c2;}
  var from=nearPos||hotelPin(city);
  function pill(ey,ln,go){return '<span class="hs-cw"><small class="hs-ce">'+ey+'</small><span class="hs-ct">'+ln+'</span></span>'+(go?'<span class="hs-go">'+mk(go)+'</span>':'');}
  if(!from){slot.innerHTML='<button class="pl-near dim" onclick="setHotel()">'+pill('Set hotel','See distances &amp; walking times','arrow')+'</button>';return;}
  var best=null,bd=1e9;PLACES.forEach(function(p){if(p.city!==city||!p.ll||placeVis[p.id]||!countable(p))return;var d=hav(from,p.ll);if(d<bd){bd=d;best=p;}});
  if(!best||bd>100){slot.innerHTML='<div class="pl-near dim">'+pill(best?'Distances':'Alhamdulillah',best?'Too far to measure':'Every '+CITY_N[city]+' site visited','')+'</div>';return;}
  slot.innerHTML='<button class="pl-near" onclick="plGo(\''+best.id+'\')">'+pill('Nearest unvisited · ≈ '+kmStr(bd)+(nearPos?' from you':' from hotel'),esc(best.n),'arrow')+'</button>';}
/* ── route planner (L-07, L-13, L-02) ── */
function togRoute(id){var p=placeById(id);if(!p)return;var c=p.city;routeSel[c]=routeSel[c]||[];var i=routeSel[c].indexOf(id);if(i>-1)routeSel[c].splice(i,1);else routeSel[c].push(id);save('us-route',routeSel);
  var el=document.querySelector('#pl-'+id+' .place-a .rt');if(el){el.classList.toggle('on',i<0);el.textContent=i<0?'✓ In route':'＋ Route';}
  if(routeSel[c].length)planRoute(c);else if(lastRoute[c]){lastRoute[c]=null;drawRoute(c);}
  if(i<0)toast('＋ Added to your '+CITY_N[c]+' route ('+routeSel[c].length+')','','See route',function(){jumpTo('route-'+c);});else toast('Removed from your route');}
function clearRoute(c){lastRoute[c]=null;routeSel[c]=[];save('us-route',routeSel);routeClimbs[c]=false;renderPlaces();toast('Route cleared');}
function planRoute(city,withClimbs){
  if(withClimbs!==undefined)routeClimbs[city]=!!withClimbs;
  var el=document.getElementById('route-'+city);if(!el)return;
  var from=originFor(city);
  if(!from){routeWant=city;el.innerHTML='<div class="card card-pad rt-need"><b>To plan a route I need a start point</b><p style="font-size:var(--t-3);color:var(--ink2);margin-top:4px">Distances and the order of stops depend on where you begin.</p><button class="btn" onclick="setHotelGPS()">🏨 I’m at my hotel now — save it</button><button class="btn ghost" onclick="nearMe()">📡 Use my current location</button><button class="lnk" style="margin-top:10px;font-size:var(--t-3)" onclick="hotelSheet()">Not there yet? Pick a landmark near your hotel →</button></div>';return;}
  routeWant=null;
  var sel=routeSel[city]||[],pool,mode;
  if(sel.length){pool=sel.map(placeById).filter(function(p){return p&&p.ll;});mode='sel';}
  else{pool=PLACES.filter(function(p){return p.city===city&&routable(p)&&!placeVis[p.id]&&p.g!=='hajj'&&(routeClimbs[city]||!p.climb);});mode='auto';}
  var route=[],cur=from,pl=pool.slice();
  while(pl.length){pl.sort(function(a,b){return hav(cur,a.ll)-hav(cur,b.ll);});var nx=pl.shift();route.push(nx);cur=nx.ll;}
  if(mode==='auto')route=route.slice(0,8);
  lastRoute[city]={ids:route.map(function(p){return p.id;}),mode:mode};
  drawRoute(city);
}
function drawRoute(city){var el=document.getElementById('route-'+city);if(!el)return;var lr=lastRoute[city];if(!lr){el.innerHTML='';return;}
  var from=originFor(city),route=lr.ids.map(placeById).filter(function(p){return p&&p.ll;}),origin=from?from[0]+','+from[1]:'';
  var hajj=[],notes=[];
  if(city==='makkah'&&lr.mode==='auto'){hajj=['arafat','muzdalifah','mina','jamarat'].map(placeById).filter(function(p){return p&&p.ll&&!placeVis[p.id];});}
  if(!route.length&&!hajj.length){el.innerHTML='<div class="note" style="margin:0 0 12px">Everything nearby is already visited — mashallah! <button class="lnk" style="font-size:1em" onclick="clearRoute(\''+city+'\')">Clear</button></div>';return;}
  var legs=[],tot=0,allWalk=true,cur=from;route.forEach(function(p){var km=from?hav(cur,p.ll):0;legs.push(km);tot+=km;if(km>=2)allWalk=false;cur=p.ll;});
  var mins=Math.round(tot/4.5*60),wp=route.map(function(p){return p.ll[0]+','+p.ll[1];});
  var url=route.length?'https://www.google.com/maps/dir/?api=1'+(origin?'&origin='+origin:'')+'&destination='+wp[wp.length-1]+(wp.length>1?'&waypoints='+wp.slice(0,-1).join('|'):'')+'&travelmode='+(allWalk&&from?'walking':'driving'):'';
  var rows=route.map(function(p,i){var km=legs[i],v=placeVis[p.id],warn=(p.tags||[]).filter(function(t){return /^(🕐|📅|🎫|👤)/.test(t);});
    var d=from?(km<2?'≈ '+kmStr(km)+' · 🚶 '+Math.max(1,Math.round(km/4.5*60))+' min':'🚕 ≈ '+kmStr(km)):'';
    return '<div class="lg on rl'+(v?' vis':'')+'"><span class="lg-i">'+(i+1)+'</span><span class="lg-t"><b>'+p.i+' '+p.n+(p.climb?' <span class="distchip climb">⛰️ climb</span>':'')+'</b>'+(d?'<em>'+d+'</em>':'')+(warn.length?'<span class="rl-w">⚠️ '+warn.join(' · ')+'</span>':'')+'</span><button class="chip-btn rv'+(v?' on':'')+'" onclick="togPlace(\''+p.id+'\')" aria-pressed="'+(v?'true':'false')+'">'+(v?'✓ Visited':'Visited')+'</button></div>';}).join('');
  if(hajj.length){var hw=hajj.map(function(p){return p.ll[0]+','+p.ll[1];}),hu='https://www.google.com/maps/dir/?api=1'+(origin?'&origin='+origin:'')+'&destination='+hw[hw.length-1]+(hw.length>1?'&waypoints='+hw.slice(0,-1).join('|'):'')+'&travelmode=driving';
    rows+='<div class="lg on hj"><span class="lg-i">'+mk('car')+'</span><span class="lg-t"><b>Hajj sites ('+hajj.map(function(p){return p.n.split(' &')[0].replace('Mount ','').replace('The ','');}).join(' · ')+')</b><em>one half-day taxi tour — agree the price first</em></span><a class="chip-btn" href="'+hu+'" target="_blank" rel="noopener">Maps</a></div>';}
  if(lr.mode==='auto'&&!routeClimbs[city]){var cl=PLACES.filter(function(p){return p.city===city&&p.climb&&!placeVis[p.id];});if(cl.length)notes.push('⛰️ Left out: '+cl.map(function(p){return p.n.split(' &')[0];}).join(', ')+' (45–90 min climbs — not for young children or the elderly). <button class="lnk" style="font-size:1em" onclick="planRoute(\''+city+'\',true)">Include climbs</button>');}
  var nr=PLACES.filter(function(p){return p.city===city&&!p.ll&&!placeVis[p.id]&&countable(p);});if(nr.length)notes.push('Not routable: '+nr.map(function(p){return '<a href="'+mapsSearch(p)+'" target="_blank" rel="noopener">'+p.n+'</a>';}).join(', ')+' (open in Maps).');
  notes.push((lr.mode==='sel'?'Your picks, nearest-first':'Nearest-first, unvisited sites only')+' from '+(nearPos?'your location':'your hotel')+'. Check opening times; Baqi’ and Mu’alla open after Fajr/Asr.');
  el.innerHTML='<div class="card card-pad rtc" style="margin-bottom:12px"><h3 style="font-size:1em">'+(lr.mode==='sel'?'🧭 Your route':'🧭 Suggested order')+(route.length?' · ≈ '+kmStr(tot)+' · '+(allWalk?'🚶 ':'')+(mins>=60?Math.floor(mins/60)+' h '+(mins%60?mins%60+' min':''):mins+' min'):'')+'</h3>'+rows
    +(url?'<a class="btn" style="text-align:center;text-decoration:none" href="'+url+'" target="_blank" rel="noopener">🗺️ Open route in Google Maps</a>':'')
    +'<div class="rt-acts"><button class="chip-btn" onclick="shareRoute(\''+city+'\')">📤 Share route</button><button class="lnk" style="font-size:var(--t-3)" onclick="clearRoute(\''+city+'\')">Clear route</button></div>'
    +'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:8px;line-height:var(--lh-body)">'+notes.join(' ')+'</p></div>';
}
function shareRoute(city){var lr=lastRoute[city];if(!lr)return;var from=originFor(city),route=lr.ids.map(placeById).filter(Boolean),cur=from,lines=[];
  route.forEach(function(p,i){var km=(from&&p.ll)?hav(cur,p.ll):null;if(p.ll)cur=p.ll;lines.push((i+1)+'. '+p.n+(p.ar?' ('+p.ar+')':'')+(km!==null?' — ≈ '+kmStr(km):''));});
  var wp=route.filter(function(p){return p.ll;}).map(function(p){return p.ll[0]+','+p.ll[1];}),url=wp.length?'https://www.google.com/maps/dir/?api=1'+(from?'&origin='+from[0]+','+from[1]:'')+'&destination='+wp[wp.length-1]+(wp.length>1?'&waypoints='+wp.slice(0,-1).join('|'):''):'';
  shareText('Ziyarah route · '+CITY_N[city],'🧭 Ziyarah route · '+CITY_N[city]+'\n'+lines.join('\n')+'\n(planned with Miqah)',url);}
/* L-05: the same offline driver card serves the hotel and every place (Arabic name in big type) */
function showDriverCard(o){var tp=document.getElementById('drvTop');if(tp)tp.textContent=o.top||'🚕 Please take me here';
  var lead=document.getElementById('drvLead');if(lead)lead.textContent=o.lead||'من فضلك خذني إلى';
  var an=document.getElementById('drvArName');if(an){if(o.arH)an.innerHTML=o.arH;else an.textContent=o.ar||'';an.hidden=!(o.ar||o.arH);}
  document.getElementById('drvName').textContent=o.en||'—';document.getElementById('drvAddr').textContent=o.sub||'';document.getElementById('drvPhone').innerHTML=o.tel?mk('phone','mkt')+esc(o.tel):'';
  var online=navigator.onLine!==false;
  document.getElementById('drvActs').innerHTML=(o.tel?'<a href="tel:'+telOf(o.tel)+'" class="btn" onclick="event.stopPropagation()">'+(o.telL||mk('phone','mkt')+'Call hotel')+'</a>':'')+(o.maps?'<a class="btn ghost'+(online?'':' off')+'" href="'+o.maps+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+(online?'🗺️ Open in Maps':'🗺️ Map needs signal')+'</a>':'');
  document.getElementById('driver').classList.add('on');vib(8);reqWake();}
function showPlaceDriver(id){var p=placeById(id);if(!p)return;showDriverCard({top:'🚕 Please take me here',ar:p.ar,en:p.n,sub:CITY_N[p.city]+' · '+(p.g==='trip'?'day trip':p.g==='hajj'?'Hajj site':'ziyarah site')+' — agree the price (and a return) before you set off',maps:mapsSearch(p)});}

/* ════════════════════════ BADGES ════════════════════════ */
/* D-19: every badge reports progress as {cur,need} so locked ones can show "2/3" and how to earn them */
function badgeProg(id){
  var i,n=0,d;
  switch(id){
    case 'firstUmrah':return {cur:Math.min(ST.umrahs,1),need:1};
    case 'again':return {cur:Math.min(ST.umrahs,2),need:2};
    case 'quizMaster':return {cur:qzPassedCount(),need:qzVisible().length||1};
    case 'hajji':return {cur:Math.min(ST.hajjs||0,1),need:1};
    case 'prepped':{var P=planTotals();return {cur:P.done,need:P.tot||1};}
    case 'explorer':return {cur:Object.keys(placeVis).filter(function(k){return placeVis[k];}).length,need:8};
    case 'devoted':for(i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>=80)n++;}return {cur:n,need:3};
    case 'quranComp':for(i=1;i<=ST.tripLen;i++){d=dailyChk['d'+i];if(d&&(d.recite||d.tadabbur||d.memorize))n++;}return {cur:n,need:5};
    case 'nightHaram':for(i=1;i<=ST.tripLen;i++){d=dailyChk['d'+i];if(d&&d.tahajjud)n++;}return {cur:n,need:3};
    case 'littlePilgrim':return {cur:kdBestStars(),need:3};
  }
  return {cur:0,need:1};
}
function badgeOK(id){var p=badgeProg(id);return p.cur>=p.need;}
function chkBadges(){
  BADGES.forEach(function(b){
    if(!earned[b.id]&&badgeOK(b.id)){earned[b.id]=true;save('us-badges',earned);toast(b.icon+' Achievement unlocked: '+b.name+'!',true);vib([40,50,90]);}
  });
  renderBadges();
}
function renderBadges(){
  var g=document.getElementById('bdgGrid');if(!g)return;
  var n=0,h='';
  BADGES.forEach(function(b){var ok=!!earned[b.id];if(ok)n++;var how=esc(b.how||''),p=ok?null:badgeProg(b.id),cur=p?Math.min(p.cur,p.need):0;
    h+='<div class="bdg '+(ok?'ok':'no')+'" role="button" tabindex="0" aria-expanded="false" aria-label="'+b.name+(ok?', earned':', locked, '+cur+' of '+p.need+' — '+how)+'" onclick="togBadge(this)"><div class="i">'+mkOr(b.icon,'star')+'</div><div class="n">'+b.name+'</div>'
      +(ok?'<div class="how">✓ '+how+'</div>':'<div class="p">'+cur+'/'+p.need+'</div><div class="mini"><i style="width:'+Math.round(cur/p.need*100)+'%"></i></div><div class="how">'+how+'</div>')+'</div>';});
  g.innerHTML=h;document.getElementById('bdgCnt').textContent=n;var bt=document.getElementById('bdgTot');if(bt)bt.textContent=BADGES.length;
}
function togBadge(el){var open=!el.classList.contains('open');el.classList.toggle('open',open);el.setAttribute('aria-expanded',open?'true':'false');vib(6);}

/* ════════════════════════ DUAS / DATA ════════════════════════ */
function renderDuas(){
  var h='';
  DUAS.forEach(function(d,i){if(!forMe(d))return;h+='<div class="duacard"><div class="dua-top"><h4 style="margin:0">'+d.t+'</h4><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'<span>Listen</span></button></div><div class="dua tapable" role="button" tabindex="0" aria-label="Open '+d.t.replace(/"/g,'')+' full screen" style="margin:0;background:transparent;border:none;padding:0" onclick="openDua('+i+')"><span class="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span><span class="src">'+d.s+'</span><span class="enl">⛶ tap to enlarge</span></div></div>';});
  document.getElementById('duaContainer').innerHTML=h;
}
function exportData(){
  var ls={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('us-')===0&&k!=='us-ptcache'&&k!=='us-remlast')ls[k]=localStorage.getItem(k);}
  var data={v:3,exported:new Date().toISOString(),settings:ST,plan:planChk,rites:riteChk,daily:dailyChk,places:placeVis,badges:earned,ls:ls};
  var b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='miqah-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);
  toast('📤 Backup exported');
}
function importData(ev){
  var f=ev.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){try{
    var d=JSON.parse(r.result);
    if(!d||typeof d!=='object'||(!d.ls&&!d.settings))throw new Error('bad');
    if(!confirm('Replace all current data with this backup?')){ev.target.value='';return;}
    if(d.ls&&typeof d.ls==='object'){
      Object.keys(d.ls).forEach(function(k){if(k.indexOf('us-')===0&&typeof d.ls[k]==='string')localStorage.setItem(k,d.ls[k]);});
    }else{
      if(d.settings)ST=Object.assign(ST,d.settings);
      planChk=d.plan||{};riteChk=d.rites||{};dailyChk=d.daily||{};placeVis=d.places||{};earned=d.badges||{};
      saveST();save('us-plan',planChk);save('us-rites',riteChk);save('us-daily',dailyChk);save('us-places',placeVis);save('us-badges',earned);
    }
    toast('📥 Backup imported — reloading…');setTimeout(function(){location.reload();},600);
  }catch(e){toast('Import failed — invalid file');}};
  r.readAsText(f);ev.target.value='';
}
function confirmReset(){
  openSheet('<div class="sheet-h danger">'+mk('trash')+'</div><h3>Reset everything?</h3><p>This wipes every checklist, counter, quiz score, dua list, journal and setting on this device — and the encrypted vault. It cannot be undone.</p><button class="btn" onclick="exportData()">'+markify('📤 Export backup first')+'</button><button class="btn danger" onclick="doReset()">'+markify('🗑️ Reset everything')+'</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>');
}
function doReset(){
  var keys=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('us-')===0)keys.push(k);}
  keys.forEach(function(k){localStorage.removeItem(k);});
  try{if(vDB){vDB.close();vDB=null;}indexedDB.deleteDatabase('us-vault');}catch(e){}
  setTimeout(function(){location.reload();},150);
}

/* ════════════════════════ HOME ════════════════════════ */
function fmtTime(ts){return new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function fmtDur(ms){var m=Math.round(ms/60000);return m<60?m+' min':Math.floor(m/60)+'h '+(m%60)+'m';}
/* H-04: an in-progress count that Home, the header chip and boot should return to */
function activeCount(){if(ST.tawaf>0&&ST.tawaf<7)return 'tawaf';if(ST.tawaf>=7&&ST.sai>0&&ST.sai<7&&tmode()!=='nafl'&&tmT('sai'))return 'sai';return null;}
function saiPending(){var t=tmT('sai');return !!t&&tmode()!=='nafl'&&ST.tawaf>=7&&ST.sai===0&&!tmLog(t)[t.log+'End'];}
function resumeCount(k){goTab('umrah');goSub('umrah','count',true);enterFocus(k);}
function homeOn(){var v=document.getElementById('view-home');return !!(v&&v.classList.contains('on'));}
function homeRefresh(){if(homeOn())renderHome();}
/* H-03: quick-tool actions */
function homeDriver(){if((ST.hotelInfo||{}).n)showDriver();else{goTab('plan','prep','hotelCard');setTimeout(function(){var e=document.getElementById('hName');if(e)e.focus();},700);}}
function homeRefl(){goPost();setTimeout(function(){jumpTo('postNotes',true);},450);}
/* H-03: tiny full-screen help overlay — the four Saudi numbers, the meeting point and the two offline cards */
/* a show-to-a-stranger phone row: the whole 48px row is the link */
function telRow(lbl,tel,num){return '<a class="lost-kv" href="tel:'+tel+'"><span>'+lbl+'</span><b class="num">'+num+'</b></a>';}
var HELP_TEL=[['🚓','Police · ambulance · fire','911'],['🏥','Health (Ministry of Health)','937'],['🕋','Hajj &amp; Umrah care line','1966'],['ℹ️','Tourism helpline','930']];
function showHelp(){var hi=ST.hotelInfo||{},ph=leadPhone(),h='';
  h+='<div class="lost-en" style="margin:10px 0 6px">Emergency numbers — free from any phone in Saudi Arabia</div>';
  HELP_TEL.forEach(function(t){h+=telRow(mkOr(t[0])+' '+t[1],t[2],t[2]);});
  if(ph)h+=telRow(mkOr('👥')+' '+esc(leadName()||'Companion'),telOf(ph),esc(ph));
  var cp=ST.camp||{};if(journey()==='hajj'&&cp.p)h+=telRow(mkOr('⛺')+' '+esc(cp.l||'Group leader')+(cp.n?' · camp '+esc(cp.n):''),telOf(cp.p),esc(cp.p));
  if(hi.p)h+=telRow(mkOr('🏨')+' '+esc(hi.n||'Hotel'),telOf(hi.p),esc(hi.p));
  h+='<div class="lost-kv"><span>'+mkOr('🤝')+' Family meeting point</span>'+(hi.m?'<b style="text-align:right">'+esc(hi.m)+'</b>':'<button class="lnk" style="font-size:1em" onclick="closeHelp();goTab(\'plan\',\'prep\',\'hotelCard\')">Set one →</button>')+'</div>';
  h+='<p style="font-size:var(--t-3);color:var(--show-ink2);text-align:center;margin:14px 0 6px">If separated: go to the meeting point after the next prayer, stay put, and call.</p>';
  h+='<div class="drv-acts" style="margin-top:12px"><button class="btn danger" onclick="closeHelp();showLost()">'+markify('🆘 I’m lost')+'</button><button class="btn ghost" onclick="closeHelp();homeDriver()">'+markify('🚕 To my hotel')+'</button>'+(journey()==='hajj'?'<button class="btn ghost" onclick="closeHelp();showCampDriver()">'+markify('⛺ To my camp')+'</button>':'')+'</div>';
  h+='<div class="focus-hint" style="margin-top:22px;text-align:center" onclick="closeHelp()">tap here to close</div>';
  var b=document.getElementById('helpBody');if(!b)return;b.innerHTML=h;document.getElementById('help').classList.add('on');vib(10);}
function closeHelp(){var e=document.getElementById('help');if(e)e.classList.remove('on');}
/* H-05: the planner's next moves — dated buckets when there is a departure date, the travel-blocking basics otherwise */
function planNext(){var B=tlBuckets(),rows=[];
  if(B){B.over.forEach(function(o){var bl=TL_BLOCK.indexOf(o.it.id)>-1;rows.push({o:o,cls:bl?'over':'late',when:bl?'overdue':'late',pre:'Overdue: '});});
    B.now.forEach(function(o){rows.push({o:o,cls:'now',when:'this week',pre:'This week: '});});
    B.soon.forEach(function(o){rows.push({o:o,cls:'soon',when:'coming up',pre:'Next: '});});}
  else activePlan().forEach(function(sec){sec.items.forEach(function(it){if(TL_BLOCK.indexOf(it.id)>-1&&forMe(it)&&!planChk[it.id])rows.push({o:{it:it,sec:sec},cls:'soon',when:'first',pre:'Next: '});});});
  return rows;}
/* 6.2 status card: the phase string split into kicker · hero · unit. "⛺ Hajj 1448 · 30 days until you fly" → (Hajj 1448 · ) "30" "days until you fly";
   "🕋 Day 2 of 10 in the Haramain" → small "Day", "2", "of 10 in the Haramain"; "⛺ Hajj 1448 — when do you fly?" → (Hajj 1448 — ) title "when do you fly?".
   Only the kicker (shown by .hs-k), the separators and a closing "— alhamdulillah" sit in display:none .hs-x spans, so the hero b's textContent is still the phase. */
function hsPhase(s){var t=stripEmoji(s),i=t.indexOf(' — '),head=i>-1?t.slice(0,i):t,tail=i>-1?t.slice(i):'',k='',ti=head,
  x=function(v){return v?'<span class="hs-x">'+v+'</span>':'';},m=/^(.+? · )?(Day )?(\d+)( .+)?$/.exec(head);
  if(m)return {k:m[1]?m[1].slice(0,-3):'',num:true,h:x(m[1])+'<span class="hs-nr">'+(m[2]?'<span class="hs-pre">'+m[2]+'</span>':'')+'<span class="hs-n'+(m[3].length>3?' hs-nl':'')+'">'+m[3]+'</span></span>'+(m[4]?'<span class="hs-u">'+m[4]+'</span>':'')+x(tail)};
  if(tail&&tail!==' — alhamdulillah'){k=head;ti=tail.slice(3);return {k:k,num:false,h:x(head+' — ')+'<span class="hs-n hs-nt">'+ti+'</span>'};}
  var j=head.indexOf(' · ');if(j>0){k=head.slice(0,j);ti=head.slice(j+3);}
  return {k:k,num:false,h:x(k?k+' · ':'')+'<span class="hs-n hs-nt">'+ti+'</span>'+x(tail)};}
function renderHome(){
  var a=document.getElementById('homeArea');if(!a)return;
  var name=ST.name?', '+ST.name:'';
  var hij=(ptData&&ptData.h)?ptData.h:hijriIntl();
  var greg=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  var d=depDays();
  var phase,cta,pct,lbl,stageNow,dp=0,hsK='trip';
  var pd=postData||{},pc=0;Object.keys(pd).forEach(function(h){pc+=Object.keys(pd[h]||{}).filter(function(k){return pd[h][k];}).length;});
  var tripOver=d!==null&&d<-ST.tripLen,tu=totalUmrahs(),lg=ST.log||{},act=activeCount(),inHaram=onTrip(),nextRows=[];
  /* J-06: Hajj mode — the Hijri days of Hajj drive the phase once flying; before that the planner and the "Umrah first" chain */
  var HJ=journey()==='hajj',hd=HJ?hajjDay():null,hy=HJ?curHajjYear():0,HD=HJ?hajjDates(hy):{},hdayHTML='',hsec=null,tuT=HJ?tripUmrahs():ST.umrahs;
  /* (review) once this year's Hajj is recorded the "Hajj completed" state wins over the day card */
  if(HJ&&d!==null&&d<=0&&typeof hd==='number'&&!(ST.post&&ST.hajjs)){
    HAJJ_RITES.forEach(function(s){if(s.hd===hd&&!s.night)hsec=s;});
    var hsteps=hsec?hsec.steps.filter(forMe):[],hdone=hsteps.filter(function(s){return hajjChk[s.id];}).length,hnx=null;hsteps.forEach(function(s){if(!hnx&&!hajjChk[s.id]&&!s.info)hnx=s;});
    pct=hsteps.length?Math.round(hdone/hsteps.length*100):0;phase='⛺ '+hd+' Dhul Hijjah · '+DH_NAME[hd];
    cta=hnx?[fcText(hnx.b),'umrah','steps','rw-'+hnx.id]:['Today’s steps all ticked — log your worship','daily','today'];
    lbl=(hsec?hsec.sub+' · ':'')+hdone+' of '+hsteps.length+' steps today';stageNow=2;hsK='hday';
    if(act)cta=['Resume '+(act==='tawaf'?'tawaf':'sa’i')+' ('+ST[act]+'/7)','umrah','count'];
    var conf=ST.hajjConf===hy;
    hdayHTML='<div class="card card-pad hday"><div class="hday-h"><span class="hp-i" style="background:var(--gold-soft)">'+mk(hsec?emk(hsec.ico,'tent'):'tent')+'</span><div><small>Today · Hajj '+hy+'</small><b>'+(conf?hd+' Dhul Hijjah · '+DH_NAME[hd]:'Is today '+hd+' Dhul Hijjah?')+'</b></div></div>'
      +(conf?'<div class="hshift"><span>✓ '+hd+' Dhul Hijjah confirmed</span><button class="lnk" style="font-size:var(--t-3)" onclick="hajjConfReset()">change</button></div>'
        :'<div class="hshift" role="group" aria-label="Correct the Hijri day — today is '+hd+' Dhul Hijjah, correct?"><div><button class="chip-btn" onclick="hajjShiftBy(1)"'+((parseInt(ST.hajjShift)||0)>=1?' disabled':'')+' aria-label="No, it is one day earlier">◀ Earlier</button><button class="chip-btn on" onclick="hajjConfirm()" aria-label="Yes, correct">✓ Yes</button><button class="chip-btn" onclick="hajjShiftBy(-1)"'+((parseInt(ST.hajjShift)||0)<=-1?' disabled':'')+' aria-label="No, it is one day later">Later ▶</button></div></div>')
      +(hsec?'<p style="font-size:var(--t-3);color:var(--ink2);line-height:var(--lh-body)">'+hsec.sub+'</p>':'')+'<button class="btn" style="margin-top:10px" onclick="goTab(\'umrah\',\'steps\',\'hajjContainer\')">'+markify('📋 Open today’s steps →')+'</button></div>';}
  else if((ST.post&&(d===null||d<=0))||tripOver){pct=ST.post?Math.round(pc/90*100):((tu||ST.hajjs)?100:0);phase=(HJ&&ST.hajjs)?'⛺ Hajj completed — alhamdulillah':tu?'🕋 '+tu+' Umrah'+(tu===1?'':'s')+' completed — alhamdulillah':'🧭 Your '+(HJ?'Hajj':'Umrah')+' journey';
    if(ST.post){cta=['Log today’s habits','more','guide','postCard'];lbl=pc+' habit-day'+(pc===1?'':'s')+' logged of 90 · keep the Haram version of you'+(HJ&&typeof hd==='number'?' · today '+hd+' Dhul Hijjah':'');}
    else{cta=['Plan your next journey','more','guide','nextCard'];lbl='Umrah or Hajj — the checklists and countdown are ready when Allah invites you again';}
    /* (review) Part 2 ticks waiting with no Hajj recorded: say so before offering the next journey */
    if(HJ&&!ST.hajjs&&Object.keys(hajjChk).some(function(k){return hajjChk[k];})){phase='⛺ Your Hajj — not yet recorded';cta=['Record completed Hajj','umrah','steps','hajjDone'];lbl='Your Part 2 ticks are waiting — record the Hajj to keep its timeline and keepsake';pct=0;var HT0=hajjTotals();if(HT0.tot)pct=Math.round(HT0.done/HT0.tot*100);}
    stageNow=4;hsK='after';}
  else if(d===null||d>0){var P=planTotals(),tot=P.tot,done=P.done;pct=P.pct;
    if(HJ){phase=d===null?'⛺ Hajj '+hy+' — when do you fly?':'⛺ Hajj '+hy+' · '+d+' day'+(d===1?'':'s')+' until you fly';lbl=(HD[9]?'Arafah on '+fmtDate(HD[9],true)+' · ':'')+done+' of '+tot+' prep items';}
    else{phase=d===null?'🧭 Planning — set your departure date':'✈️ '+d+' day'+(d===1?'':'s')+' until departure';lbl=done+' of '+tot+' prep items · '+qzPassedCount()+'/'+qzVisible().length+' quiz levels';}
    cta=[pct<100?'Continue preparing':'Study & quiz','plan',pct<100?'prep':'learn',pct<100?(ST.dep?'tlCard':'cdCard'):null];stageNow=0;hsK='plan';
    /* H-05: the CTA names the first thing to do next */
    if(ST.onboarded){nextRows=planNext();if(nextRows.length){var r0=nextRows[0];cta=[r0.pre+fcText(r0.o.it.label),'plan','prep',ST.dep?'tlCard':'sec-'+r0.o.sec.id];}}}
  else if(d===0&&!tu&&!dayHasTicks(1)){pct=planTotals().pct;phase='🛫 Departure day — safe travels, labbayk!';cta=['Open the rites guide','umrah','steps'];lbl='Ihram at the miqat → tawaf → sa’i → halq — every step and dua is in the guide';stageNow=1;hsK='dep';}
  else{var ed=expectedDay()||ST.day;dp=dayPct(ed)||0;pct=dp;phase='🕋 Day '+ed+' of '+ST.tripLen+' in the Haramain';cta=['Log today’s worship','daily','today'];lbl=dp+'% of today’s deeds · '+tu+' Umrah'+(tu===1?'':'s')+' completed';stageNow=tuT?2:1;
    var hLeft=(HJ&&HD[8])?daysUntil(HD[8]):null,qf=HJ&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu';
    /* (review) the Hajj phase keys off THIS trip's Umrah (tripUmrahs), never the lifetime count; a Qarin / Mufrid is "in ihram" only once the type is confirmed */
    if(HJ&&hd==='pre'){phase=tuT?'🌱 Out of ihram until 8 Dhul Hijjah':qf?'🤍 In ihram until the 10th':'🕋 Umrah first · Hajj begins in '+hLeft+' day'+(hLeft===1?'':'s');
      lbl=(tuT||qf?'Mina on '+fmtDate(HD[8],true)+' · ':'')+dp+'% of today’s deeds';}
    else if(HJ&&hd==='post'){var wd=!!(hajjChk.hwada||hajjChk.hwadaw),ifd=!!hajjChk.h10ifadah;phase='🕋 After the days of Mina';
      /* (review) a pillar outstanding (e.g. a sister whose period delayed the ifadah) comes before the farewell tawaf */
      cta=!ifd?['Tawaf al-ifadah + sa’i first — the pillar that completes your Hajj','umrah','steps','rw-h10ifadah']:wd?['Log today’s worship','daily','today']:['Tawaf al-wada before you leave Makkah','umrah','steps','hajjContainer'];
      lbl=!ifd?'Tawaf al-ifadah is still open — your Hajj is intact; do it when you can (sisters: once pure)':wd?'Tawaf al-wada done · '+dp+'% of today’s deeds':'Tawaf al-wada is the last thing you do in Makkah (waived for sisters on their period)';stageNow=2;}
    /* H-02 / H-04: until this trip's Umrah is recorded the CTA follows the rites, and an in-progress count always comes first */
    if(act){cta=['Resume '+(act==='tawaf'?'tawaf':'sa’i')+' ('+ST[act]+'/7)','umrah','count'];if(!tuT&&!tmHajj()){lbl='Step '+(act==='tawaf'?'2':'3')+' of 4 · '+(act==='tawaf'?'7 rounds of the Kaaba, in wudu':'Safa → Marwah, 7 laps');pct=umrahPct();}}
    else if(!tuT&&!(HJ&&hd==='post')&&!qf){var ih=!!(lg.ihram||riteChk.niyyah),tE=!!(lg.tawafEnd||riteChk.rounds||umrahTawaf()>=7),sE=!!(lg.saiEnd||riteChk.laps||umrahSai()>=7),hq=!!(lg.halq||riteChk.cut||riteChk.cutw);
      if(!ih){cta=['Begin your Umrah: Ihram','umrah','steps'];lbl='Step 1 of 4 · ihram before the miqat';}
      else if(!tE){cta=['Start tawaf','umrah','count'];lbl='Step 2 of 4 · 7 rounds of the Kaaba, in wudu';}
      else if(!sE){cta=['2 rakahs, Zamzam, then sa’i','umrah','count'];lbl='Step 3 of 4 · Safa → Marwah, 7 laps';}
      else if(!hq&&halqUnconfirmed()){cta=['Before cutting: what did you say at the miqat?','js','halqGateHome()'];lbl='Step 4 of 4 · Tamattu’ cuts now · Qiran / Ifrad stay in ihram until the 10th';}
      else if(!hq){cta=['Halq / taqsir — finish your Umrah','umrah','steps'];lbl='Step 4 of 4 · shave or trim, then record it';}
      else if(HJ&&typeof hd!=='number'){cta=['Record your Umrah','umrah','steps','riteDone'];lbl='Umrah done — record it; Part 2 then takes over';}
      if(!hq)pct=umrahPct();}}
  /* a CTA may carry a JS call instead of a goTab triple: ['label','js','fn()'] */
  var ctaGo=cta[1]==='js'?cta[2]:'goTab('+(cta[1]?'\''+cta[1]+'\'':'null')+','+(cta[2]?'\''+cta[2]+'\'':'null')+','+(cta[3]?'\''+cta[3]+'\'':'null')+')';
  var due=fcDue();var fc0=due.length?FC_MAP[due[0]]:null;
  var nh=0;[HISTORY,VIRTUES,MADINAH,FIQHQA,KNOW,SISTERS,SCAMS].forEach(function(x){nh+=x.filter(forMe).length;});
  var nq=0;QUIZ_LEVELS.forEach(function(l){if(forMe(l))nq+=l.qs.length;});
  var NL=qzVisible().length,NP=PLACES.length,ND=DUAS.filter(forMe).length;
  var stages=[
    {i:mk('bag'),t:'Before you fly',s:'Prepare with ihsan',d:'Begin with your intention — then checklists for documents, packing and health, a departure countdown and a generated day-by-day itinerary. Then learn: the history of the Kaaba and Madinah, the virtues, the fiqh Q&A, a scam-awareness guide — and prove it in a '+NL+'-level quiz.',f:['Checklists','Itinerary','Knowledge hub',NL+'-level quiz','Flashcards','Document vault',['Kids quiz','goTab(\'plan\',\'quiz\',\'kidsCard\')']],go:['plan','prep'],c:'Start preparing'},
    {i:mk(HJ?'tent':'kaaba'),t:HJ?'During your Hajj':'During your Umrah',s:HJ?'Umrah first → Mina → Arafah → Muzdalifah → the 10th → tashriq':'Ihram → Tawaf → Sa’i → Halq/Taqsir (shave or trim)',d:(HJ?'Part 1 is your Umrah, Part 2 the five days of Hajj — each day folded until its date, every step with its ruling (rukn · wajib · sunnah) and what to do if you miss it. ':'')+'A step-by-step walkthrough with every dua in Arabic, transliteration and audio, and a "Why?" behind each step. Giant tap counters for tawaf and sa’i with a full-screen focus mode so you never lose count, a map of the mataf, and an automatic timeline that becomes a keepsake.',f:['Rites guide','Duas + audio','Tawaf & Sa’i counters','Focus mode','Mataf map','Keepsake card'],go:['umrah','steps'],c:'Open the rites guide'},
    {i:mk('beads'),t:'Every day in the Haramain',s:'Make every prayer count',d:'One prayer in the Haram is worth 100,000 prayers elsewhere (Ibn Majah 1406) — track all five in congregation, tahajjud, Quran, dhikr and extra deeds. Prayer times with reminders, a qibla compass, a tasbih counter, your personal dua list and a water counter, with streaks and achievements.',f:['Daily tracker','Prayer times','Qibla','Tasbih','Dua list','Streaks & badges'],go:['daily','today'],c:'Track today'},
    {i:mk('pin'),t:'Ziyarah with purpose',s:NP+' places, Makkah & Madinah',d:'Every sacred and historic site with why it matters, an etiquette tip and one-tap Google Maps. Save your hotel to see walking distances, sort by what’s near you, plan a nearest-first route, and book the Madinah hop-on hop-off bus.',f:[NP+' sites','Maps & distances','Route planner','Hop-on hop-off'],go:['places',null],c:'Explore places'},
    {i:mk('sprout'),t:'After you return',s:'Don’t let it fade',d:'A 30-day habit keeper for prayers on time, daily Quran and dhikr, plus a reflections journal — so the person who came back from the Haram stays.',f:['Habit keeper','Reflections'],go:['more','guide','postCard'],oc:'goPost(true)',c:'Keep it alive'}
  ];
  function q(v){return v?'\''+v+'\'':'null';}
  function goStr(g){return 'goTab('+q(g[0])+','+q(g[1])+','+q(g[2])+')';}
  /* H-03: quick tools follow the stage — safety tools during the trip, planning tools before, habits after */
  var TOOLS={
    trip:[['refresh','Counters',goStr(['umrah','count'])],['list','Rites',goStr(['umrah','steps'])],['compass','Qibla',goStr(['daily','tools','qiblaCard'])],['beads','Tasbih',goStr(['daily','tools','tbCard'])],['hands','Duas',goStr(['more','duas'])],['pin','Places',goStr(['places'])],['car','Driver','homeDriver()'],['sos','Help','showHelp()'],['dome','Prayer times',goStr(['daily','today','ptSec'])]],
    plan:[['calendar','Itinerary',goStr(['plan','prep','itinCard'])],['cards','Flashcards',goStr(['plan','learn','fcCard'])],['lock','Documents',goStr(['plan','prep','vaultCard'])],['list','Rites',goStr(['umrah','steps'])],['hands','Duas',goStr(['more','duas'])],['pin','Places',goStr(['places'])],['kid','Kids',goStr(['plan','quiz','kidsCard'])],['quiz','Quiz',goStr(['plan','quiz','qzCard'])],['hotel','Hotel',goStr(['plan','prep','hotelCard'])]],
    post:[['sprout','Habits','goPost()'],['book','Reflections','homeRefl()'],['hands','Duas',goStr(['more','duas'])],['beads','Tasbih',goStr(['daily','tools','tbCard'])],['pin','Places',goStr(['places'])],['cards','Flashcards',goStr(['plan','learn','fcCard'])]]
  };
  var tools=stageNow===4?TOOLS.post:stageNow===0?TOOLS.plan:TOOLS.trip;
  /* J-06: on a Hajj trip two more tools — the rami counter (Part 2) and the Mina camp card */
  if(HJ&&tools===TOOLS.trip)tools=tools.slice(0,2).concat([['stone','Rami','goRami()'],['tent','Camp','campSheet()']],tools.slice(2));
  var toolsHTML='<div class="qa-grid">'+tools.map(function(x){return '<button class="qa" onclick="'+x[2]+'" aria-label="'+x[1]+'"><span>'+mk(x[0])+'</span>'+x[1]+'</button>';}).join('')+'</div>';
  var installHTML=deferPrompt?'<button class="chip-btn" onclick="installApp()" aria-label="Install the app on your phone">📲 Install</button>':(/iPhone|iPad/.test(navigator.userAgent)&&!window.navigator.standalone?'<small class="hb-ios">📲 Share → Add to Home Screen</small>':'');
  /* 6.2 status card (dark aubergine · Manrope): kicker → hero numeral beside the ring → hairline metrics → the rites bar → one note → a glass pill.
     Every value is one this function already computes (depDays, planTotals, quiz levels, Hajj dates, today's Hajj steps, the rite ticks, trip day, deeds, habit-days). */
  var hp=hsPhase(phase),sK='',sS=[],sR='Ready',sNote='',sBar='';
  function M(l,v,of){sS.push([l,String(v),of===undefined?'':'/'+of]);}
  if(hsK==='hday'){sK='⛺ Hajj '+hy;sR='Today';if(act)M(act==='tawaf'?'Tawaf':'Sa’i',ST[act],7);M('Steps today',hdone,hsteps.length);var ed9=expectedDay();if(ed9)M('Trip day',Math.min(ed9,ST.tripLen),ST.tripLen);}
  else if(hsK==='after'){sK=ST.post?'🌱 Back home':'🧭 After your journey';
    if(phase.indexOf('not yet recorded')>-1){sK='⛺ Your Hajj';sR='Part 2';var HT1=hajjTotals();if(HT1.tot)M('Part 2 steps',HT1.done,HT1.tot);sNote=lbl;}
    else if(ST.post){sR='Habits';POST_HABITS.forEach(function(h,i){var o=pd[i]||{},n=Object.keys(o).filter(function(k){return o[k];}).length,l=stripEmoji(h).replace(/^(Five|Daily) /,'');M(l.charAt(0).toUpperCase()+l.slice(1),n,30);});sNote='Alhamdulillah — keep the Haram version of you';}
    else{sR='Complete';sNote=lbl;}}
  else if(hsK==='plan'){sK=HJ?'⛺ Hajj '+hy:d===null?'🧭 Planning your Umrah':'✈️ Your Umrah';sR='Prepared';M('Prep',done,tot);M('Quiz levels',qzPassedCount(),qzVisible().length);if(HJ&&HD[9])M('Arafah',fmtDate(HD[9]));}
  else if(hsK==='dep'){sK='🛫 Departure day';sR='Prepared';var P2=planTotals();M('Prep',P2.done,P2.tot);sNote='Ihram at the miqat, then tawaf, sa’i and halq — every step and dua is in the guide';}
  else{var stp=/^Step (\d) of 4 · (.*)$/.exec(lbl||'');sK=HJ?(hp.k?leadEmoji(phase)+' '+hp.k:'⛺ Hajj '+hy):'🕋 Umrah';sR=stp?'Rites':'Today';
    if(!hp.num)M('Trip day',Math.min(ed,ST.tripLen),ST.tripLen);
    if(act&&!stp)M(act==='tawaf'?'Tawaf':'Sa’i',ST[act],7);
    if(HJ&&hd==='pre'&&(tuT||qf)&&HD[8])M('Mina',fmtDate(HD[8]));
    M('Today’s deeds',dp+'%');
    if(sS.length<3&&tu&&!(HJ&&hd==='post'))M('Umrahs',tu);
    if(stp){sNote=stp[2].replace(/ → /g,' to ');
      /* the four rites from the same chain that wrote "Step n of 4": done ones full, the current one filled by its own count */
      var cur=+stp[1]-1,RL=['Ihram','Tawaf','Sa’i','Halq'],sb='',sl='';
      RL.forEach(function(r,i){var f=i<cur?1:i>cur?0:i===1?Math.min(7,umrahTawaf())/7:i===2?Math.min(7,umrahSai())/7:0;
        sb+='<i class="hs-sb'+(i===cur?' on':'')+'"><b style="width:'+Math.round(f*100)+'%"></b></i>';sl+='<small class="hs-sl'+(i===cur?' on':'')+'">'+r+'</small>';});
      sBar='<div class="hs-sg">'+sb+sl+'</div>';}
    else if(lbl.indexOf('% of today’s deeds')<0)sNote=lbl;}
  /* the planner's when-word becomes the pill's eyebrow (Overdue gets a rose dot as a non-colour cue); every other CTA says Today or Next step */
  var sCe=/^(Overdue|This week|Next): (.+)$/.exec(cta[0]),sLb=sCe?sCe[2]:cta[0],sEb=sCe?sCe[1]:(hsK==='hday'&&!act&&!/today/i.test(sLb))?'Today':'Next step';
  /* a long "head — tail" step keeps the head in the pill and the tail as the note (the aria-label still reads the whole step) */
  var sDash=sLb.indexOf(' — ');if(sDash>0&&!sNote){sNote=sLb.slice(sDash+3);sLb=sLb.slice(0,sDash);}
  /* the Hijri month spelled out: a sans "Jumada I" reads as "Jumada l" */
  var hijC=String(hij).replace(/\b(Rabi\S?|Jumada) (II|I)\b/,function(a,m,n){return /^J/.test(m)?(n==='I'?'Jumada al-Ula':'Jumada al-Akhirah'):(n==='I'?'Rabi al-Awwal':'Rabi al-Thani');});
  var sDesc='hsHero'+(sS.length?' hsMet':'')+(sNote?' hsNote':'');
  var sMet=sS.length?'<div class="hs-m" id="hsMet">'+sS.slice(0,3).map(function(m){return '<div class="hs-mi"><small class="hs-ml">'+esc(m[0])+'</small><span class="hs-mv">'+esc(m[1])+(m[2]?'<i>'+m[2]+'</i>':'')+'</span></div>';}).join('')+'</div>':'';
  var statusHTML='<div class="hstatus hs-o" role="button" tabindex="0" aria-label="'+esc(cta[0])+'" aria-describedby="'+sDesc+'" onclick="'+ctaGo+'"><div class="hs-t"><small class="hs-g">As-salamu alaykum'+esc(name)+'</small><small class="hs-d">'+greg+' · <span class="hs-hj">'+hijC+'</span></small><span class="hs-l">'+lbl+'</span>'
    +'<div class="hs-hero" id="hsHero"><div class="hs-main"><small class="hs-k">'+markify(sK)+'</small><b class="hs-b">'+hp.h+'</b></div>'
    +'<div class="hs-r"><div class="ring-wrap"><svg viewBox="0 0 92 92" aria-hidden="true" focusable="false"><defs><linearGradient id="hsGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--hs-ring-a)"/><stop offset="1" style="stop-color:var(--hs-ring-b)"/></linearGradient></defs><circle class="ring-bg" cx="46" cy="46" r="38"/>'+(pct>0?'<circle class="hs-nub" cx="84" cy="46" r="3"/>':'')+'<circle class="ring-fg" id="hRing" cx="46" cy="46" r="38"/></svg><div class="ring-num"><span id="hPct">'+pct+'%</span><small>'+esc(sR)+'</small></div></div></div></div>'
    +sMet+sBar+(sNote?'<span class="hs-note" id="hsNote">'+esc(sNote)+'</span>':'')
    +'<span class="hcta"><span class="hs-cw"><small class="hs-ce'+(sEb==='Overdue'?' hs-due':'')+'">'+(sEb==='Overdue'?'<i class="hs-dot" aria-hidden="true"></i>':'')+sEb+'<span class="hs-x">: </span></small><span class="hs-ct">'+esc(sLb)+'</span></span><i class="hs-go">'+mk('arrow')+'</i></span>'
    +(ST.post&&stageNow===4?'<span class="hcta hs-alt" role="button" tabindex="0" aria-label="Plan your next journey" onclick="event.stopPropagation();goTab(\'more\',\'guide\',\'nextCard\')">'+mk('compass','mkt')+'<span class="hs-ct">Plan your next journey</span></span>':'')+'</div></div>';
  var prayerHTML='<div class="card card-pad hprayer" role="button" tabindex="0" aria-label="Prayer times" onclick="goTab(\'daily\',\'today\')"><div class="hp-i">'+mk('dome')+'</div><div class="hp-t"><small>'+(inHaram?'Next prayer':'Next prayer in '+esc(ST.city||'Makkah'))+'</small><div id="hNext">Loading…</div></div><span class="hp-go">›</span></div>';
  var fcHTML=fc0?'<div class="card card-pad hfc" role="button" tabindex="0" aria-label="Study today’s knowledge card" onclick="startFC();goTab(\'plan\',\'learn\',\'fcCard\')"><small>'+mk('cards','mkt')+'Today’s knowledge card · '+due.length+(fcStarted()?' due':' ready')+'</small><b>'+markify(fc0.f)+'</b><span>Tap to study →</span></div>':'';
  var postHTML='';
  if(tripOver&&!ST.post)postHTML+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Start the 30-day habit keeper" onclick="startPost()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('sprout')+'</div><div class="hp-t"><small>Back home?</small><div>Start the 30-day habit keeper <span>· prayers on time, Quran, dhikr</span></div></div><span class="hp-go">›</span></div>';
  if(ST.post)postHTML+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Open post-'+(HJ?'Hajj':'Umrah')+' habits" onclick="goPost()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('sprout')+'</div><div class="hp-t"><small>Post-'+(HJ?'Hajj':'Umrah')+' mode · on</small><div>'+pc+' habit-days logged of 90 <span>· keep the Haram version of you</span></div></div><span class="hp-go">›</span></div>';
  /* J-07: after a trip, the next journey is a choice, not a repeat — nothing is archived or deleted here */
  if(tripOver||(ST.post&&(d===null||d<=0)))postHTML+='<div class="card card-pad hnext" id="hNextJ"><h3>'+mk('compass','mkt')+'Plan your next journey</h3><p style="font-size:var(--t-3);color:var(--ink2);margin:0 0 10px;line-height:var(--lh-body)">"Umrah to Umrah is an expiation for what is between them" (Bukhari 1773). Past journeys stay under More › After › My journeys.</p><div class="jbtns"><button class="btn ghost" onclick="nextJourney(\'umrah\')">'+mk('kaaba','mkt')+'Umrah</button><button class="btn ghost" onclick="nextJourney(\'hajj\')">'+mk('tent','mkt')+'Hajj</button></div></div>';
  /* J-06: one-time primer for Hajj planners — the five days in four minutes */
  var readHTML=(HJ&&stageNow===0&&!ST.hajjRead)?'<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Read: your Hajj in five days" onclick="hajjReadGo()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('tent')+'</div><div class="hp-t"><small>Start here · 4-minute read</small><div>Your Hajj in five days <span>· 8 to 13 Dhul Hijjah at a glance</span></div></div><button class="lnk hc-reset" onclick="event.stopPropagation();hajjReadDone()" aria-label="Dismiss">✕</button></div>':'';
  var askHTML=ST.hajjAsk?'<div class="hajjask" role="button" tabindex="0" onclick="showOnboard()">'+mk('tent','mkt')+'Going for Hajj? Tap here<span class="x" role="button" aria-label="Dismiss" onclick="event.stopPropagation();hajjAskOff()">✕</span></div>':'';
  var quoteHTML='<div class="note" style="margin:0 0 12px">'+QUOTES[Math.floor(Date.now()/86400000)%QUOTES.length]+'</div>';
  var faqHTML='<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is it really free? <span class="acc-c">▶</span></div><div class="acc-b">Yes — no ads, no subscriptions, no “pro” tier. Built as sadaqah jariyah for the Ummah. If it helps you, share it and make dua for those who built it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Does it work in the Haram without signal? <span class="acc-c">▶</span></div><div class="acc-b">Yes. Open it once with internet and it caches itself; the counters, rites guide, duas, places and your data all work offline. Prayer times work offline too (the Umm al-Qura month is cached, and computed times fill any gap); the map links need signal — the Show driver card on every place works offline.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Where is my data stored? <span class="acc-c">▶</span></div><div class="acc-b">Only on your phone. There is no account and no server. Export a backup from Settings before changing phones; the document vault is encrypted with your PIN and cannot be recovered without it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is the religious content reliable? <span class="acc-c">▶</span></div><div class="acc-b">Every hadith is cited to its collection and was checked against the source text; weak narrations are avoided or marked. It is a study companion, not a fatwa service — ask a scholar for rulings on your situation. Scholar review is pending; corrections are welcome.</div></div>';
  var numsHTML='<div class="nums"><div><b>'+NP+'</b><small>sacred &amp; historic places</small></div><div><b>'+nq+'</b><small>quiz questions in '+NL+' levels</small></div><div><b>'+nh+'</b><small>knowledge topics</small></div><div><b>'+ND+'</b><small>essential duas with audio</small></div></div>';
  var shareHTML='<div class="card card-pad" style="text-align:center"><h3 style="margin-bottom:6px">Made for the Ummah</h3><p style="font-size:var(--t-3);color:var(--ink2);line-height:var(--lh-body)">Free, no ads, no tracking. The sister app of <a href="https://www.ramadanstrivers.com/" target="_blank" rel="noopener" style="color:var(--brand-2);font-weight:700;text-decoration:none">Ramadan Strivers</a>. Share it with anyone going to Umrah.</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn ghost" style="margin-top:6px" onclick="shareApp()">📤 Share</button><button class="btn ghost" style="margin-top:6px" onclick="showQR()">▦ Show QR</button></div><p style="font-size:var(--t-2);color:var(--ink3);margin-top:12px"><a href="install" style="color:var(--brand-2);font-weight:600;text-decoration:none">How to install it →</a><span> · </span><a href="privacy" style="color:var(--brand-2);font-weight:600;text-decoration:none">Privacy</a></p></div>';
  function stageRow(st,i,mini){var now=i===stageNow,open=!mini||now;return '<div class="stage'+(now?' now':'')+(mini&&!now?' cmp':'')+'" role="button" tabindex="0" aria-label="'+st.t+' — '+st.c+'" onclick="'+(st.oc||goStr(st.go))+'"><div class="stage-n">'+(i+1)+'</div><div class="stage-b"><div class="stage-h"><span class="stage-i">'+st.i+'</span><div><b>'+st.t+'</b><small>'+st.s+'</small></div>'+(now?'<span class="nowtag">You are here</span>':(mini?'<span class="stage-go" aria-hidden="true">›</span>':''))+'</div>'+(open?'<p>'+st.d+'</p><div class="fchips">'+st.f.map(function(f){return typeof f==='string'?'<span>'+f+'</span>':'<span class="go" role="button" tabindex="0" onclick="event.stopPropagation();'+f[1]+'">'+f[0]+' →</span>';}).join('')+'</div><div class="stage-cta">'+st.c+' →</div>':'')+'</div></div>';}
  var h='';
  if(!ST.onboarded){
    /* ── first launch: the landing page explains the app ── */
    h+='<div class="hhero"><div class="hhero-mark'+(HJ?'':' kaaba')+'" aria-hidden="true">'+(HJ?mk('tent'):'')+'</div><h2>Your complete '+(ST.journeyAsked?(HJ?'Hajj':'Umrah'):'Hajj & Umrah')+' companion</h2><p>Everything you need <b>before, during and after</b> '+(ST.journeyAsked?(HJ?'Hajj':'Umrah'):'your journey')+' — in one free, private app that works offline in the Haram.</p><div class="trust"><span>✓ Free</span><span>✓ Works offline</span><span>✓ Private — no account</span><span>✓ Every hadith verified</span></div><button class="btn" style="max-width:300px;margin:16px auto 0" onclick="'+ctaGo+'">'+(d===null&&!tu?'Begin your journey →':esc(cta[0])+' →')+'</button>'+(deferPrompt?'<button class="btn ghost" style="max-width:300px;margin:8px auto 0" onclick="installApp()">📲 Install on your phone</button>':(/iPhone|iPad/.test(navigator.userAgent)&&!window.navigator.standalone?'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:10px">📲 On iPhone: tap Share → “Add to Home Screen” to install</p>':''))+'</div>';
    h+=statusHTML+postHTML+prayerHTML;
    h+='<div class="vh" style="margin-top:8px"><h2 style="font-size:var(--t-6)">'+mk('compass','mkt')+'How it works — your journey in 5 stages</h2><p>Tap a stage to jump in. The app follows you from your living room to the mataf and back.</p></div>';
    h+='<div class="stages">'+stages.map(function(st,i){return stageRow(st,i,false);}).join('')+'</div>';
    h+=numsHTML;
    h+='<div class="vh" style="margin-top:6px"><h2 style="font-size:var(--t-5)">'+mk('grid','mkt')+'Quick tools</h2></div>'+toolsHTML.replace('</div>','<button class="qa wide" onclick="sosSheet()" aria-label="Hotel and emergency help"><span>'+mk('car')+'</span>Hotel / SOS <span style="font-size:1em;color:var(--ink3);font-weight:600">· driver card · I’m lost · 911 · 1966</span></button></div>');
    h+=fcHTML+quoteHTML+'<div class="card card-pad"><h3>Common questions</h3>'+faqHTML+'</div>'+shareHTML;
  }else{
    /* ── dashboard (H-01): brand strip → status → continue / do next → prayer → tools → cards → quote → compact stages → about ── */
    h+='<div class="hbrand"><span class="hb-n"><i class="kmark" aria-hidden="true"></i><small>Free · offline · private</small></span>'+installHTML+'</div>';
    h+=askHTML+statusHTML+hdayHTML;
    /* H-04: one Continue card — in-progress count, then the sa'i hand-off, then an unfinished day log, then today's flashcard */
    var cont='',fcUsed=false;
    if(act)cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Resume '+(act==='tawaf'?'tawaf':'sa’i')+'" onclick="resumeCount(\''+act+'\')"><div class="hp-i" style="background:var(--gold-soft)">'+mk(act==='tawaf'?'kaaba':'hills')+'</div><div class="hp-t"><small>Continue</small><div>'+(act==='tawaf'?'Tawaf':'Sa’i')+' in progress · <span class="ty-nw">'+(act==='tawaf'?'round':'lap')+' '+ST[act]+' of 7</span></div></div><button class="lnk hc-reset" onclick="event.stopPropagation();cntrReset(\''+act+'\')" aria-label="Reset this counter">Reset</button></div>';
    else if(saiPending())cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Start sa’i" onclick="startSai()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('hills')+'</div><div class="hp-t"><small>Continue</small><div>Tawaf done ✓ — 2 rakahs, Zamzam, then start sa’i →</div></div><span class="hp-go">›</span></div>';
    else if(inHaram&&dp>0&&dp<100&&cta[1]!=='daily')cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Continue today’s log" onclick="goTab(\'daily\',\'today\')"><div class="hp-i">'+mk('beads')+'</div><div class="hp-t"><small>Continue</small><div>Today’s log — '+dp+'% done <span>· tick what you prayed</span></div></div><span class="hp-go">›</span></div>';
    else if(fc0){cont=fcHTML;fcUsed=true;}
    if(stageNow!==0)h+=cont;
    /* H-05: what to do next (planners) — above the flashcard card */
    if(stageNow===0){var rows=nextRows.slice(0,3),nq0=qzPassedCount()<NL?qzNext():-1,nx='';
      rows.forEach(function(r){nx+='<div class="tli" role="checkbox" tabindex="0" aria-checked="false" onclick="tlTick(this,\''+r.o.it.id+'\')"><span class="tick"></span><div class="tli-t">'+r.o.it.label+'<small>'+r.o.sec.title+(r.o.it.wk!==undefined?' · <span class="ty-nw">ideally '+(r.o.it.wk>=1?r.o.it.wk+' week'+(r.o.it.wk>1?'s':''):'days')+' before</span>':'')+'</small></div><span class="tli-when '+r.cls+'">'+r.when+'</span></div>';});
      if(nq0>-1&&rows.length<4)nx+='<div class="tli" role="button" tabindex="0" onclick="goTab(\'plan\',\'learn\',\'lnQuizCard\')"><span class="tli-i">'+mkOr('🧠')+'</span><div class="tli-t">Quiz level '+(nq0+1)+' not passed<small>'+qzLvName(nq0,1)+' · 80% to pass</small></div><span class="tli-when soon">Study →</span></div>';
      if(nx)h+='<div class="card card-pad hnext"><h3>'+mk('tack','mkt')+'Do next</h3>'+nx+'<button class="lnk hn-all" onclick="goTab(\'plan\',\'prep\',\''+(ST.dep?'tlCard':'cdCard')+'\')">'+(ST.dep?'See full timeline →':'Set a departure date for a dated timeline →')+'</button></div>';
      h+=readHTML+cont;}
    h+=prayerHTML;
    h+='<div class="vh hq"><h2>'+mk('grid','mkt')+'Quick tools</h2></div>'+toolsHTML;
    h+=(fcUsed?'':fcHTML)+postHTML+quoteHTML;
    h+='<div class="vh hq"><h2>'+mk('compass','mkt')+'Your journey</h2></div><div class="stages">'+stages.map(function(st,i){return stageRow(st,i,true);}).join('')+'</div>';
    h+=mkSec({id:'about',ico:'ℹ️',title:'About this app',sub:'Free · offline · private · every hadith verified'},true,numsHTML+faqHTML+shareHTML);
  }
  a.innerHTML=h;
  setTimeout(function(){setRing('hRing',pct);},50);
  loadPT();
}
function hajjReadGo(){ST.hajjRead=true;saveST();openKnowT('five days');}
function hajjReadDone(){ST.hajjRead=true;saveST();renderHome();vib(6);}
function hajjAskOff(){delete ST.hajjAsk;saveST();renderHome();vib(6);}
/* J-07: choose the next journey — sets the journey, archives nothing; Hajj re-asks the flight date through its own onboarding screen */
function nextJourney(j){ST.journey=j==='hajj'?'hajj':'umrah';ST.journeyAsked=true;delete ST.hajjAsk;delete ST.hajjRead;ST.hajjTypeConfirmed=false;if(tmHajj())ST.tmode='nafl';
  /* (review) a new journey starts clean: post mode, the confirmed Hijri day and the moon shift belong to the last trip, and a departure date in the past is never carried over (the date input opens empty, min = today) */
  delete ST.post;delete ST.hajjConf;delete ST.hajjShift;var dd=depDays();if(dd!==null&&dd<0)ST.dep='';
  saveST();renderPost();applyJourney();journeyRefresh();updCountdown();renderTimeline();renderItin();renderTodayTop();updToolsOrder();renderDuaSec();updDaily();vib(10);
  if(j==='hajj'){obPrevJ=null;showOnboard('hajj');return;}
  goTab('plan','prep','cdCard');toast('🕋 Umrah — set your new departure date',true);}
/* J-07: every recorded journey, newest first, from us-umrahlog + us-hajjlog — nothing here is ever deleted */
function renderJourneys(){var a=document.getElementById('journeysArea');if(!a)return;var U=[],H=[];try{U=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}try{H=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}
  var dt=function(t){return t?new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';};
  var rows=U.map(function(u){var lg=u.log||{};return {t:lg.done||0,h:'<div class="lg on"><span class="lg-i">'+mk('kaaba')+'</span><span class="lg-t">Umrah #'+(u.n+(ST.umrahsPrev||0))+' <em>'+dt(lg.done)+(u.est?' · recorded on arrival':'')+'</em></span><button class="chip-btn" onclick="makeKeepsake('+u.n+')">🎴 Keepsake</button></div>'};})
    .concat(H.map(function(x,i){var lg=x.log||{},ty=(HAJJ_TYPES[x.type]||{}).t||'';return {t:lg.done||0,h:'<div class="lg on"><span class="lg-i">'+mk('tent')+'</span><span class="lg-t">Hajj '+(x.y||'')+(ty?' · '+ty:'')+' <em>'+dt(lg.done)+'</em></span>'+(typeof makeHajjKeepsake==='function'?'<button class="chip-btn" onclick="makeHajjKeepsake('+i+')">🎴 Keepsake</button>':'')+'</div>'};}));
  rows.sort(function(a,b){return b.t-a.t;});
  var pre=[];if(ST.umrahsPrev)pre.push(ST.umrahsPrev+' Umrah'+(ST.umrahsPrev===1?'':'s'));if(ST.hajjsPrev)pre.push(ST.hajjsPrev+' Hajj'+(ST.hajjsPrev===1?'':'s'));
  a.innerHTML=(pre.length?'<p style="font-size:var(--t-2);color:var(--ink2);margin-bottom:6px">🔁 '+pre.join(' and ')+' before this app, alhamdulillah.</p>':'')+(rows.length?rows.map(function(r){return r.h;}).join(''):'<p style="font-size:var(--t-3);color:var(--ink3)">No journey recorded yet — every Umrah or Hajj you record appears here with its keepsake.</p>');}

/* ════════════════════════ PREP STREAK ════════════════════════ */
function prepStreak(){
  var days={};try{days=JSON.parse(localStorage.getItem('us-prepdays')||'{}');}catch(e){}
  var t=fcToday(),n=0,d=days[t]?t:(days[t-1]?t-1:null);
  if(d===null)return 0;
  while(days[d]){n++;d--;}
  return n;
}
function markPrepDay(){var days={};try{days=JSON.parse(localStorage.getItem('us-prepdays')||'{}');}catch(e){}days[fcToday()]=1;localStorage.setItem('us-prepdays',JSON.stringify(days));}

/* ════════════════════════ SWIPE BETWEEN SUB-TABS ════════════════════════ */
(function(){
  var sx=0,sy=0,ok=false;
  document.addEventListener('touchstart',function(e){var t=e.target;ok=ST.swipe!==false&&!(t&&t.closest&&t.closest('.tapring,.tb-btn,input,textarea,.jumps,.stops,.tb-chips,.focus,#duaFocus,.sheet-o,.heat,.ph-grid,.fc,.cnt,.wudu,.cnt-acts,.row'));sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',function(e){if(!ok)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)<90||Math.abs(dx)<=2.5*Math.abs(dy))return;
    var view=document.querySelector('.view.on');if(!view)return;var btns=view.querySelectorAll('.seg button');if(!btns.length)return;
    var cur=0;btns.forEach(function(b,i){if(b.classList.contains('on'))cur=i;});
    var nx=dx<0?cur+1:cur-1;if(nx<0||nx>=btns.length)return;
    goSub(view.id.replace('view-',''),btns[nx].getAttribute('data-sub'));
    if(!ST.swipeHint){ST.swipeHint=true;saveST();toast('Tip: swipe left/right to move between sections');}
  },{passive:true});
})();

function togSwipe(){ST.swipe=ST.swipe===false;saveST();updSwipeSw();}
function updSwipeSw(){var sw=document.getElementById('swipeSw');if(!sw)return;var on=ST.swipe!==false;sw.classList.toggle('on',on);sw.setAttribute('aria-checked',on?'true':'false');}
/* keyboard: Enter/Space activates role=button/checkbox/switch divs (M-14) */
document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=e.target;if(!t||t.tagName==='BUTTON'||t.tagName==='A'||t.tagName==='INPUT'||t.tagName==='TEXTAREA')return;var r=t.getAttribute&&t.getAttribute('role');if(r==='button'||r==='checkbox'||r==='switch'){e.preventDefault();t.click();}});

/* ════════════════════════ FOCUS MODE (big counter) ════════════════════════ */
var focusKey='tawaf',wakeLock=null,fdOpen=false;
/* U-09: the "screen stays awake" promise is made only once the wake lock is actually held */
function reqWake(){if(!('wakeLock' in navigator))return;
  navigator.wakeLock.request('screen').then(function(w){wakeLock=w;var h=document.getElementById('focusHint');if(h)h.textContent='tap anywhere to count · screen stays awake';
    try{w.addEventListener('release',function(){if(wakeLock===w)wakeLock=null;var h2=document.getElementById('focusHint');if(h2)h2.textContent='tap anywhere to count';});}catch(e){}
  }).catch(function(){});}
function enterFocus(k){
  focusKey=k;fdOpen=false;var f=document.getElementById('focus');f.classList.add('on');f.classList.toggle('tasbih',k==='tasbih');document.body.style.overflow='hidden';
  var tap=f.querySelector('.focus-tap');if(tap)tap.setAttribute('aria-label','Tap to count one '+(k==='tasbih'?'dhikr':k==='rami'?'pebble':k==='tawaf'?'round':'lap'));
  document.getElementById('focusHint').hidden=false;
  /* D-15: the same overlay doubles as a full-screen tasbih (wake lock, giant number, Arabic of the phrase) */
  if(k==='tasbih'){document.getElementById('focusHint').textContent='tap anywhere to count';renderFocusTB();reqWake();return;}
  /* J-08: the rami counter — one jamarah at a time, 7 pebbles each */
  if(k==='rami'){document.getElementById('focusHint').textContent='tap anywhere to count';if(!ramiDay)ramiDay=ramiDefaultDay();renderFocusDua();updWudu();renderFocusRami();if(!ramiDone(ramiDay))reqWake();return;}
  document.getElementById('focusTitle').innerHTML=markify(k==='tawaf'?TM[tmode()].h:(tmHajj()?'⛰️ Sa’i of Hajj':'⛰️ Sa’i'));
  document.getElementById('focusOf').textContent=k==='tawaf'?'of 7 rounds':'of 7 laps';
  document.getElementById('focusHint').textContent='tap anywhere to count';
  var t=tmT(k);if(k==='tawaf'&&t&&ST.wudu){var lg=tmLog(t);if(!lg[t.log+'Start']){lg[t.log+'Start']=Date.now();saveST();}renderLog();renderHlog();}
  renderFocusDua();updWudu();renderCnt(k);
  if(ST[k]<7)reqWake();
}
function exitFocus(){document.getElementById('focus').classList.remove('on');document.body.style.overflow='';if(wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}
  if(walkReturn){walkReturn=false;openWalkAt(walkI);}}
function focusTap(){if(focusKey==='tasbih')tbTap();else if(focusKey==='rami')ramiTap(ramiJams(ramiDay||ramiDefaultDay())[ramiJ],1);else cntr(focusKey,1);}
function focusUndo(){if(focusKey==='tasbih')tbUndo();else if(focusKey==='rami')ramiTap(ramiJams(ramiDay||ramiDefaultDay())[ramiJ],-1);else cntr(focusKey,-1);}
function renderFocusTB(){var t=document.getElementById('focusTitle'),o=document.getElementById('focusOf'),n=document.getElementById('focusN'),tip=document.getElementById('focusTip'),d=document.getElementById('focusDone');if(!t)return;
  t.innerHTML=mk('beads','mkt')+esc(TB_PHRASES[tbPhrase]);n.textContent=tbCount;o.textContent=(tbTargetN?'of '+tbTargetN:'no target')+' · today '+(tasbih[dayKey()]||0);
  var fl=document.getElementById('focusLive');if(fl)fl.textContent=tbCount+(tbTargetN?' of '+tbTargetN:'');
  tip.hidden=false;tip.innerHTML='<span lang="ar">'+TB_AR[tbPhrase]+'</span>';if(d)d.hidden=true;}
/* U-03: at 7/7 the big number stays, the tip becomes the hand-off */
function renderFocusDone(){var p=document.getElementById('focusDone'),t=document.getElementById('focusTip'),h=document.getElementById('focusHint');if(!p||focusKey==='tasbih'||focusKey==='rami')return;
  var v=ST[focusKey],done=v>=7,open=document.getElementById('focus').classList.contains('on');
  p.hidden=!done;if(t)t.hidden=done;if(h)h.hidden=done;
  if(!done){p.innerHTML='';return;}
  if(open&&wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}
  var m=tmode();
  if(focusKey==='tawaf'){
    if(m==='nafl'){var d=dailyChk[dayKey()]||{},n=(d.ntawafN||(d.ntawaf?1:0))+1;p.innerHTML='<p>Nafl tawaf complete — 2 rakahs anywhere in the mosque, then Zamzam.</p><button class="btn" onclick="event.stopPropagation();logNafl()">✅ Log nafl tawaf #'+n+' · Count another</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';}
    else if(m==='wada')p.innerHTML='<p>Tawaf al-wada complete — 2 rakahs if you can, a last Zamzam, a last dua, then leave Makkah with Allah’s peace.</p><button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'hajjDone\')">Exit → Record your Hajj</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';
    else if(tmHajj())p.innerHTML='<p>'+TM[m].h.replace(/^\S+ /,'')+' complete. 2 rakahs anywhere in the mosque, Zamzam'+(hajjSaiNeeded()?', then the sa’i of Hajj — Safa to Marwah.':' — your sa’i is already done. '+hajjSaiDoneCopy())+'</p>'+(hajjSaiNeeded()?'<button class="btn" onclick="event.stopPropagation();startSai()">Start the sa’i of Hajj →</button>':'<button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'rw-h10night\')">Exit → Part 2</button>')+'<button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';
    else p.innerHTML='<p>Tawaf complete. Men: cover both shoulders. 2 rakahs behind Maqam Ibrahim — anywhere in the mosque if crowded — then Zamzam, then Safa.</p><button class="btn" onclick="event.stopPropagation();startSai()">Start Sa’i →</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';
  }else if(tmHajj())p.innerHTML='<p>Sa’i of Hajj complete. '+hajjSaiDoneCopy()+'</p><button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'rw-h10night\')">Exit → Part 2</button>';
  else if(journey()==='hajj'&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu')p.innerHTML='<p>Sa’i done — as a '+HAJJ_TYPES[hajjType()].t+' pilgrim you stay in ihram: no cutting until the 10th.</p><button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'riteLock\')">Exit → Part 2</button>';
  else if(halqUnconfirmed())p.innerHTML='<p>Sa’i done. Before anything is cut: what did you say at the miqat? Tamattu’ cuts now; Qiran / Ifrad stay in ihram until the 10th.</p><button class="btn" onclick="event.stopPropagation();exitFocus();halqGate(cutId())">🤍 Answer now</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';
  else p.innerHTML='<p>Sa’i done → halq / taqsir. Men shave (best) or trim; women trim a fingertip’s length — never shave. Ihram ends only after cutting.</p><button class="btn" onclick="event.stopPropagation();exitFocus();openRitePhase(\'ph4\')">Exit → tick halq / taqsir</button>';
}
/* U-09: the dua of this rite in a fixed strip outside the tap zone; tap = transliteration + meaning */
function focusDuaOf(){var i=duaIdx(focusKey==='rami'?'pebble':focusKey==='tawaf'?'Yamani':'Safa');return i<0?null:DUAS[i];}
function renderFocusDua(){var e=document.getElementById('focusDua'),d=focusDuaOf();if(!e||!d)return;
  e.innerHTML='<span class="ar" lang="ar">'+d.ar+'</span>'+(fdOpen?'<span class="fd-s"><i>'+d.tl+'</i><br>'+d.tr+'</span>':'')+'<span class="fd-k">'+d.t+' · tap for '+(fdOpen?'less':'meaning')+'</span>';}
function fdToggle(){fdOpen=!fdOpen;renderFocusDua();vib(6);}
/* U-09: personal dua list without leaving the big counter (never touches the count) */
function myDuasSheet(){var h='<div class="sheet-h">'+mk('hands')+'</div><h3>My duas</h3><p>Tick each one as you ask — the counter is not touched.</p>';
  if(!duas.length)h+='<p class="lead" style="text-align:center;color:var(--ink2)">Your list is empty — start with the people who asked you to pray for them.</p>';
  else h+=duas.map(function(d,i){return '<div class="brg'+(d.done?' done':'')+'" role="checkbox" tabindex="0" aria-checked="'+(d.done?'true':'false')+'" onclick="togDua('+i+');myDuasSheet()"><span class="tick"></span><span>'+esc(d.t)+'</span></div>';}).join('');
  h+='<div style="display:flex;gap:8px;margin-top:10px"><input class="srch" id="duaIn2" placeholder="Add a dua…" style="margin:0" onkeydown="if(event.key===\'Enter\')addDuaSheet()" aria-label="Add a dua"><button class="chip-btn" onclick="addDuaSheet()" aria-label="Add">＋</button></div><button class="btn ghost" onclick="closeSheet()">Close</button>';
  openSheet(h);}
function addDuaSheet(){var i=document.getElementById('duaIn2'),v=((i&&i.value)||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();renderDuaList();myDuasSheet();vib(15);}
document.addEventListener('visibilitychange',function(){if(document.visibilityState!=='visible'||!('wakeLock' in navigator))return;
  var fo=document.getElementById('focus').classList.contains('on');
  if(fo&&(focusKey==='tasbih'||focusKey==='rami'||ST[focusKey]<7))reqWake();else if(document.getElementById('duaFocus').classList.contains('on'))navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});});

/* ════════════════════════ DUA READER (full-screen, M-11) ════════════════════════ */
var dfList=[],dfIdx=0;
/* i is the global DUAS index; the reader pages through the duas of this journey only */
function openDua(i){dfList=DUAS.filter(forMe);dfIdx=dfList.indexOf(DUAS[i]);if(dfIdx<0){dfList=[DUAS[i]];dfIdx=0;}renderDF();}
function openRiteDua(stepId,i){var st=riteStep(stepId);if(!st)return;var L=stDuas(st);if(!L.length)return;dfList=L.map(function(d){return {t:fcText(st.b)+(d.opt?' · optional':''),ar:d.ar,tl:d.tl,tr:d.tr,s:d.s||(d.opt||'')};});dfIdx=Math.min(L.length-1,i||0);renderDF();}
function renderDF(){
  var d=dfList[dfIdx];if(!d)return;
  document.getElementById('dfTitle').innerHTML=mk('hands','mkt')+esc(d.t);document.getElementById('dfAr').textContent=d.ar;document.getElementById('dfTl').textContent=d.tl||'';document.getElementById('dfTr').textContent=d.tr||'';document.getElementById('dfSrc').textContent=d.s||'';
  document.getElementById('dfSay').setAttribute('data-ar',d.ar);
  var multi=dfList.length>1;document.getElementById('dfPrev').hidden=!multi;document.getElementById('dfNext').hidden=!multi;
  document.getElementById('dfPrev').disabled=dfIdx===0;document.getElementById('dfNext').disabled=dfIdx>=dfList.length-1;
  var f=document.getElementById('duaFocus');if(!f.classList.contains('on')){f.classList.add('on');document.body.style.overflow='hidden';if('wakeLock' in navigator){navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});}}
  f.querySelector('.df-body').scrollTop=0;vib(8);
}
function duaNav(d){var n=dfIdx+d;if(n<0||n>=dfList.length)return;dfIdx=n;renderDF();}
function closeDua(){document.getElementById('duaFocus').classList.remove('on');document.body.style.overflow='';try{speechSynthesis.cancel();}catch(e){}if(wakeLock&&!document.getElementById('focus').classList.contains('on')){wakeLock.release().catch(function(){});wakeLock=null;}}

/* ════════════════════════ UMRAH TIMELINE & KEEPSAKE ════════════════════════ */
function renderLog(){
  var a=document.getElementById('logArea');if(!a)return;
  var lg=ST.log||{};
  var rows=[['🤍','Ihram (intention)',lg.ihram],['🕋','Tawaf started',lg.tawafStart],['✅','Tawaf complete',lg.tawafEnd,lg.tawafStart],['⛰️','Sa’i started',lg.saiStart],['✅','Sa’i complete',lg.saiEnd,lg.saiStart],['✂️','Halq / taqsir',lg.halq]];
  var any=false,h='';
  rows.forEach(function(r){var on=!!r[2];if(on)any=true;h+='<div class="lg'+(on?' on':'')+'"><span class="lg-i">'+mkOr(r[0],'')+'</span><span class="lg-t">'+r[1]+(on&&r[3]?' <em>'+fmtDur(r[2]-r[3])+'</em>':'')+'</span><span class="lg-v">'+(on?fmtTime(r[2]):'—')+'</span></div>';});
  if(any&&lg.ihram&&lg.halq)h+='<div class="note" style="margin:8px 0 0">Total from ihram to halq: <b>'+fmtDur(lg.halq-lg.ihram)+'</b></div>';
  /* U-13: ticks older than a day with no halq are almost certainly a rehearsal */
  if(lg.ihram&&!lg.halq&&Date.now()-lg.ihram>86400000)h='<div class="note stale" style="margin:0 0 10px">These ticks are from <b>'+new Date(lg.ihram).toLocaleDateString('en-GB',{day:'numeric',month:'short'})+'</b> — practising earlier? <button class="lnk" onclick="startFresh()">Start fresh</button></div>'+h;
  if(any)h+='<button class="lnk fresh" onclick="startFresh()">↺ Start fresh (nothing recorded)</button>';
  a.innerHTML=h;
}
function renderUmrahs(){
  var a=document.getElementById('umrahsArea');if(!a)return;
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}
  if(!hist.length){a.innerHTML='<p style="font-size:var(--t-3);color:var(--ink3)">No Umrah recorded yet — when you tap "Record completed Umrah", it appears here with a keepsake card.</p>';return;}
  a.innerHTML=(ST.umrahsPrev?'<p style="font-size:var(--t-2);color:var(--ink2);margin-bottom:6px">🔁 '+ST.umrahsPrev+' Umrah'+(ST.umrahsPrev===1?'':'s')+' before this app, alhamdulillah.</p>':'')+hist.slice().reverse().map(function(u){var d=new Date(u.log.done||Date.now());return '<div class="lg on"><span class="lg-i">'+mk('kaaba')+'</span><span class="lg-t">Umrah #'+(u.n+(ST.umrahsPrev||0))+' <em>'+d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+(u.est?' · recorded on arrival':'')+'</em></span><button class="chip-btn" onclick="makeKeepsake('+u.n+')">🎴 Keepsake</button></div>';}).join('');
}
function makeKeepsake(no){
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}
  var u=hist.filter(function(x){return x.n===no;})[0];if(!u)return;var lg=u.log;
  var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d');
  kCloth(x,1080,1350);kBadge(x,540,250,'kaaba');
  x.textAlign='center';kLabel(x,'My Umrah · #'+(u.n+(ST.umrahsPrev||0)),540,400,40);
  x.font='600 64px '+KF;x.fillStyle=K.ihram;x.fillText(ST.name||'A guest of Allah',540,500);
  x.font='30px '+KB;x.fillStyle=K.ihram2;x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  var y=680;x.textAlign='left';x.font='32px '+KB;
  [['Ihram',lg.ihram],['Tawaf',lg.tawafStart,lg.tawafEnd],['Sa’i',lg.saiStart,lg.saiEnd],['Halq / taqsir',lg.halq]].forEach(function(r){
    x.fillStyle=K.gold3;x.fillText(r[0],180,y);x.fillStyle=K.ihram;x.textAlign='right';
    x.fillText(r[1]?fmtTime(r[1])+(r[2]?' – '+fmtTime(r[2])+'  ('+fmtDur(r[2]-r[1])+')':''):'—',900,y);x.textAlign='left';y+=70;});
  if(lg.ihram&&lg.halq){x.fillStyle=K.gold2;x.font='600 34px '+KB;x.textAlign='center';x.fillText('Ihram to halq: '+fmtDur(lg.halq-lg.ihram),540,y+40);}
  x.textAlign='center';x.font='500 30px '+KB;x.fillStyle=K.gold3;x.fillText('“Umrah to Umrah is an expiation for what is between them.”',540,1140);
  kFoot(x,'Bukhari 1773 · umrah-strivers.vercel.app',540,1190);
  exportImage(c,'my-umrah-'+u.n+'.png','My Umrah keepsake');
}
/* ════════════════════════ AUBERGINE CANVAS (keepsakes, progress card, certificate) ════════════════════════ */
/* One cloth for every exported image: the Home card's aubergine object — a near-black violet gradient, a violet glow, one lavender frame,
   a lavender hairline where the band was, violet-tinted ink and lavender labels, all in Manrope.
   The colours are the --hs-* tokens (identical in both themes by design), so the export never depends on the screen theme. */
var K={kiswah:'#0F0819',kiswah2:'#1A1030',kiswah3:'#1F1037',ihram:'#F5F1FF',ihram2:'#DDD5F5',ihram3:'#B4A7D8',gold:'#A78BFA',gold2:'#C4B5FD',gold3:'#EDE9FE',goldHair:'rgba(196,181,253,.28)',well:'rgba(237,233,254,.07)'};
var KF='Manrope,-apple-system,"Segoe UI",sans-serif',KB=KF;
/* canvases draw only once the faces they use are loaded (Manrope 300–700) */
function kFonts(fn){var F=document.fonts,done=false,go=function(){if(done)return;done=true;clearTimeout(tm);fn();},tm=setTimeout(go,2500);
  if(!F||!F.load){go();return;}Promise.all(['300 64px Manrope','400 30px Manrope','500 30px Manrope','600 30px Manrope','700 30px Manrope'].map(function(q){return F.load(q).catch(function(){});})).then(go,go);}
/* the divider: a lavender hairline that fades at both ends, a small lavender dot at its centre */
function kRule(x,x0,x1,y){x.save();var g=x.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'rgba(167,139,250,0)');g.addColorStop(.5,K.gold);g.addColorStop(1,'rgba(167,139,250,0)');
  x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(x0,y);x.lineTo(x1,y);x.stroke();x.fillStyle=K.gold2;x.beginPath();x.arc((x0+x1)/2,y,4,0,6.2832);x.fill();x.restore();}
function kCloth(x,w,h){var g=x.createLinearGradient(w,0,0,h);g.addColorStop(0,K.kiswah3);g.addColorStop(.46,'#150B27');g.addColorStop(1,K.kiswah);x.fillStyle=g;x.fillRect(0,0,w,h);
  var r=x.createRadialGradient(0,h*1.05,20,0,h*1.05,w*.9);r.addColorStop(0,'rgba(91,33,182,.30)');r.addColorStop(1,'rgba(91,33,182,0)');x.fillStyle=r;x.fillRect(0,0,w,h);
  var t=x.createRadialGradient(w/2,0,20,w/2,0,w*.8);t.addColorStop(0,'rgba(139,92,246,.20)');t.addColorStop(1,'rgba(139,92,246,0)');x.fillStyle=t;x.fillRect(0,0,w,h);
  x.strokeStyle=K.goldHair;x.lineWidth=2;x.beginPath();x.roundRect(44,44,w-88,h-88,48);x.stroke();
  kRule(x,w*.22,w*.78,45);}
/* the Kaaba mark (or a stroke mark from MARKS) in an aubergine roundel with a lavender edge and a violet halo */
function kBadge(x,cx,cy,name,size){var s=size||170,r=s*.3;x.save();
  var h=x.createRadialGradient(cx,cy,s*.3,cx,cy,s*.95);h.addColorStop(0,'rgba(139,92,246,.30)');h.addColorStop(1,'rgba(139,92,246,0)');x.fillStyle=h;x.fillRect(cx-s,cy-s,s*2,s*2);
  var g=x.createLinearGradient(cx+s/2,cy-s/2,cx-s/2,cy+s/2);g.addColorStop(0,K.kiswah3);g.addColorStop(1,K.kiswah);x.fillStyle=g;x.beginPath();x.roundRect(cx-s/2,cy-s/2,s,s,r);x.fill();
  x.strokeStyle=K.goldHair;x.lineWidth=2;x.stroke();
  if(name==='kaaba'){var u=s/40;x.translate(cx-20*u,cy-20*u);x.scale(u,u);x.lineWidth=1.1;x.lineJoin='round';x.strokeStyle=K.gold2;
    x.fillStyle='#251A3B';x.beginPath();x.moveTo(9,11);x.lineTo(12,8);x.lineTo(34,8);x.lineTo(34,27);x.lineTo(31,30);x.closePath();x.fill();x.stroke();
    x.fillStyle=K.kiswah;x.fillRect(9,11,22,19);x.strokeRect(9,11,22,19);
    x.fillStyle=K.gold2;x.fillRect(9.6,15.4,20.8,2.2);x.fillStyle=K.gold3;x.fillRect(23.4,21.4,4,8.6);}
  else if(MARKS[name]&&window.Path2D){var v=s*.55/24;x.translate(cx-12*v,cy-12*v);x.scale(v,v);x.strokeStyle=K.gold2;x.lineWidth=1.5;x.lineCap='round';x.lineJoin='round';
    var ds=MARKS[name].match(/ d="([^"]+)"/g)||[];ds.forEach(function(d){x.stroke(new Path2D(d.slice(4,-1)));});
    var cs=MARKS[name].match(/<circle[^>]*>/g)||[];cs.forEach(function(c){var m=/cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/.exec(c);if(m){x.beginPath();x.arc(+m[1],+m[2],+m[3],0,6.2832);x.stroke();}});}
  x.restore();}
/* the kicker: sentence case, Manrope 600, lavender (the Home card's "Hajj 1448") */
function kLabel(x,t,cx,y,px){x.save();x.font='600 '+px+'px '+KB;x.fillStyle=K.gold2;x.fillText(String(t),cx,y);x.restore();}
/* the wordmark on canvases: Manrope 700, tight */
function kBrand(x,cx,y,px){x.save();x.font='700 '+px+'px '+KF;x.fillStyle=K.gold2;x.textAlign='center';try{x.letterSpacing=Math.round(-px*.02)+'px';}catch(e){}x.fillText('Miqah',cx,y);x.restore();}
function kFoot(x,t,cx,y){x.save();x.font='500 24px '+KB;x.fillStyle=K.ihram3;x.textAlign='center';x.fillText(t,cx,y);x.restore();}
/* ════════════════════════ IMAGE EXPORT (share sheet → in-app preview, M-07) ════════════════════════ */
var imgExp=null;
function inAppBrowser(){var ua=navigator.userAgent||'';return /FBAN|FBAV|Instagram|Line\/|Twitter|; wv\)|WebView/i.test(ua);}
function exportImage(c,filename,title){
  var url=c.toDataURL('image/png');imgExp={url:url,name:filename,title:title};
  var canDl=!window.navigator.standalone&&!inAppBrowser();
  var show=function(){openSheet('<div class="sheet-h">🖼️</div><h3>'+title+'</h3><p>'+(canDl?'Press and hold the image to save it to Photos, or download it.':'Press and hold the image to save it to Photos.')+'</p><img src="'+url+'" alt="'+title+'">'+(canDl?'<button class="btn" onclick="dlImage()">⬇️ Download</button>':'')+'<button class="btn ghost" onclick="closeSheet()">Close</button>');};
  var done=function(){if(!c.toBlob){show();return;}
    c.toBlob(function(blob){
      var file=null;try{file=new File([blob],filename,{type:'image/png'});}catch(e){}
      if(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
        navigator.share({files:[file],title:title}).then(function(){toast('✅ Shared — '+title,true);}).catch(function(err){if(err&&err.name==='AbortError')return;show();});
      }else show();
    },'image/png');};
  done();
}
function dlImage(){if(!imgExp)return;var a=document.createElement('a');a.href=imgExp.url;a.download=imgExp.name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);toast('⬇️ '+imgExp.title+' downloaded',true);}

/* ════════════════════════ INTENTION ════════════════════════ */
function saveNiyyah(){
  var v=(document.getElementById('niyText').value||'').trim();
  localStorage.setItem('us-niyyah',v);
  var had=!!planChk['niyyah'];
  if(v&&!had){planChk['niyyah']=true;save('us-plan',planChk);markPrepDay();toast('🤍 Intention set — may Allah accept it',true);vib([30,40,60]);niyOpen=true;}
  if(!v&&had){planChk['niyyah']=false;save('us-plan',planChk);}
  loadNiyyah();updPlan();chkBadges();
}
var niyOpen=false;
function loadNiyyah(){
  var t=document.getElementById('niyText'),st=document.getElementById('niyStatus'),card=document.getElementById('niyCard');if(!t)return;
  var v=localStorage.getItem('us-niyyah')||'';if(document.activeElement!==t)t.value=v;
  var words=v?v.split(/\s+/).length:0;
  st.innerHTML=v?'✓ Intention set · '+words+' words — re-read it every morning of the trip.'+(niyOpen?'<button class="chip-btn" onclick="niyToggle()">▴ Collapse</button>':''):'Write it down — it becomes your compass for the whole trip.';
  /* P-01: a saved intention collapses to one tappable row until re-opened */
  var set=!!v&&document.activeElement!==t&&!niyOpen;
  if(card){card.classList.toggle('set',set);var col=document.getElementById('niyCol');if(col)col.setAttribute('aria-expanded',set?'false':'true');
    var ct=document.getElementById('niyColT'),cf=document.getElementById('niyColF');if(ct)ct.textContent='✓ Intention set · '+words+' word'+(words===1?'':'s');if(cf)cf.textContent=v.split(/\n/)[0].slice(0,90);}
}
function niyToggle(){niyOpen=!niyOpen;loadNiyyah();vib(8);if(niyOpen)setTimeout(function(){jumpTo('niyCard',true);},40);}

/* ════════════════════════ PLAN TIMELINE · TILES · HOTEL ════════════════════════ */
var CLIMATE={makkah:[30,32,35,38,41,43,42,42,41,38,34,31],madinah:[24,27,31,36,40,43,43,43,41,36,30,26]};
var TL_BLOCK=['passport','visa','menacwy','flights','hotels'],tlOpen={};
/* shared buckets (P-02/P-35): over = should already be done (blocking first, then longest lead), now = this week, soon = coming up */
function tlBuckets(){
  var d=depDays();if(d===null||d<0)return null;var wl=d/7,over=[],now=[],soon=[];
  activePlan().forEach(function(sec){sec.items.forEach(function(it){if(!forMe(it)||planChk[it.id]||it.wk===undefined)return;var o={it:it,sec:sec};if(it.wk>wl+1)over.push(o);else if(it.wk>=wl-1)now.push(o);else soon.push(o);});});
  over.sort(function(x,y){var bx=TL_BLOCK.indexOf(x.it.id)>-1?1:0,by=TL_BLOCK.indexOf(y.it.id)>-1?1:0;return by-bx||y.it.wk-x.it.wk;});
  now.sort(function(x,y){return y.it.wk-x.it.wk;});soon.sort(function(x,y){return y.it.wk-x.it.wk;});
  return {d:d,wl:wl,over:over,now:now,soon:soon,blocking:over.filter(function(o){return TL_BLOCK.indexOf(o.it.id)>-1;}).length};
}
function tlExpand(g){tlOpen[g]=true;renderTimeline();}
function tlTick(el,id){if(el)el.classList.add('done');setTimeout(function(){togPlanTL(id);},350);}
/* P-04: ticking from the timeline offers an Undo toast */
function togPlanTL(id){togPlan(id);if(planChk[id]){var it=findPlanItem(id);toast((it?it.label.replace(/<[^>]+>/g,''):'Item')+' ✓','','Undo',function(){togPlan(id);});}}
function renderTimeline(){
  var a=document.getElementById('tlArea'),sub=document.getElementById('tlSub'),card=document.getElementById('tlCard');if(!a)return;
  if(!ST.dep){if(card)card.hidden=true;a.innerHTML='';sub.textContent='Set your departure date above to get a dated to-do timeline.';return;}
  if(card)card.hidden=false;
  var B=tlBuckets();
  if(!B){a.innerHTML='';sub.textContent='You’re on your journey — this timeline is done. Switch to the Umrah and Daily tabs.';return;}
  var over=B.over,now=B.now,soon=B.soon,wl=B.wl,d=B.d;
  var tot=over.length+now.length+soon.length;
  sub.textContent=d+' day'+(d===1?'':'s')+' to go · '+tot+' not ticked yet'+(B.blocking?' · '+B.blocking+' travel-blocking':'');
  function row(o,cls,lbl){return '<div class="tli" role="checkbox" tabindex="0" aria-checked="false" onclick="tlTick(this,\''+o.it.id+'\')"><span class="tick"></span><div class="tli-t">'+o.it.label+'<small>'+o.sec.title+' · <span class="ty-nw">ideally '+(o.it.wk>=1?o.it.wk+' week'+(o.it.wk>1?'s':''):'days')+' before</span></small></div><span class="tli-when '+cls+'">'+lbl+'</span></div>';}
  function group(list,title,fn,key,cap){var open=!!tlOpen[key],show=open?list:list.slice(0,cap);return '<div class="tli-h">'+title+'</div>'+show.map(fn).join('')+(list.length>cap&&!open?'<button class="tli-more" onclick="tlExpand(\''+key+'\')">+ '+(list.length-cap)+' more ▾</button>':'');}
  var h='';
  if(over.length)h+=group(over,'Should already be done — tap to tick',function(o){var bl=TL_BLOCK.indexOf(o.it.id)>-1;return row(o,bl?'over':'late',bl?'overdue':'late');},'over',4);
  if(now.length)h+=group(now,'This week',function(o){return row(o,'now','this week');},'now',4);
  if(soon.length)h+=group(soon,'Coming up',function(o){return row(o,'soon',(o.it.wk>=1?'in '+Math.max(1,Math.round(wl-o.it.wk))+' wk':'last days'));},'soon',5);
  if(!tot)h='<div class="note" style="margin:0">✅ Everything on the list is done. Fully prepared — now study and make dua.</div>';
  a.innerHTML=h;
}
/* P-35: one-tap readiness summary for the group leader */
function sharePrep(){
  var P=planTotals(),d=depDays(),lines=[],HJ=journey()==='hajj',J=HJ?'Hajj':'Umrah';
  lines.push((ST.name?ST.name+'’s':'My')+' '+J+' readiness'+(d!==null&&d>=0?' · '+d+' day'+(d===1?'':'s')+' to departure':'')+' — '+P.pct+'% ready');
  lines.push(activePlan().map(function(sec){var c=P.secs[sec.id];return sec.ico+' '+(sec.short||sec.title)+' '+c.done+'/'+c.tot;}).join(' · '));
  lines.push('📚 Quiz '+qzPassedCount()+'/'+qzVisible().length+' levels');
  var KL={passport:'Passport',visa:'Visa',hajjvisa:'Hajj visa',hajjpermit:'Nusuk Hajj permit',menacwy:'MenACWY',nusuk:'Nusuk',rawdah:'Rawdah permit',insurance:'Insurance',ihram:'Ihram',abaya:'Ihram clothing'};
  var keys=HJ?['passport','hajjpermit','hajjvisa','menacwy','insurance',ST.profile==='w'?'abaya':'ihram']:['passport','visa','menacwy','nusuk','rawdah','insurance',ST.profile==='w'?'abaya':'ihram'];
  lines.push('Key items: '+keys.map(function(k){return (planChk[k]?'✓':'✗')+' '+KL[k];}).join(' · '));
  var B=tlBuckets();if(B&&B.over.length)lines.push('Overdue: '+B.over.length+(B.blocking?' ('+B.blocking+' travel-blocking)':''));
  lines.push('via Miqah');
  shareText(J+' readiness',lines.join('\n'),APP_URL+(ST.dep?'?dep='+ST.dep+'&j='+journey():''));
}
function renderCatTiles(){
  var a=document.getElementById('catTiles');if(!a)return;
  var secs=activePlan();a.classList.toggle('five',secs.length>4);
  a.innerHTML=secs.map(function(sec){var c=planCounts(sec.items),p=c.tot?Math.round(c.done/c.tot*100):0,lbl=sec.short||sec.title;return '<div class="st'+(p===100?' on':'')+'" role="button" tabindex="0" aria-label="'+lbl+' '+p+'% — open checklist" onclick="openPlanSec(\''+sec.id+'\')"><div class="i">'+mkOr(sec.ico,'list')+'</div><div class="n">'+p+'%</div><div class="l">'+lbl+'</div><div class="mini"><i style="width:'+p+'%"></i></div></div>';}).join('');
}
/* P-03: a tile opens exactly its section (others fold) and scrolls to it */
function openPlanSec(id){document.querySelectorAll('#planContainer .sec').forEach(function(sc){var me=sc.id==='sec-'+id;sc.classList.toggle('shut',!me);sc.classList.toggle('hl',me);var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded',me?'true':'false');});setTimeout(function(){jumpTo('sec-'+id);},60);setTimeout(function(){var el=document.getElementById('sec-'+id);if(el)el.classList.remove('hl');},1800);}
function renderWeather(){
  var w=document.getElementById('cdW');if(!w)return;
  if(!ST.dep){w.textContent='';return;}
  var m=new Date(ST.dep+'T00:00:00').getMonth(),mk=CLIMATE.makkah[m],md=CLIMATE.madinah[m];
  w.textContent='🌡️ Typical highs: Makkah ~'+mk+'°C · Madinah ~'+md+'°C — '+(mk>=40?'extreme heat: umbrella, electrolytes, tawaf at night.':mk>=35?'hot: hydrate, sunscreen (unscented), pace yourself.':'mild: still bring sun protection; nights can be cool.');
}
function hv(id){var e=document.getElementById(id);return e?e.value.trim():'';}
function saveHotelInfo(){ST.hotelInfo={n:hv('hName'),a:hv('hAddr'),p:hv('hPhone'),m:hv('hMeet'),l:hv('hLead')};saveST();updHotelLbl();renderCntHd();renderTodayTop();}
function loadHotelInfo(){var hi=ST.hotelInfo||{};var e=document.getElementById('hName');if(!e)return;e.value=hi.n||'';document.getElementById('hAddr').value=hi.a||'';document.getElementById('hPhone').value=hi.p||'';document.getElementById('hMeet').value=hi.m||'';document.getElementById('hLead').value=hi.l||'';}
function quickHotel(v){v=(v||'').trim();if(!v)return;ST.hotelInfo=Object.assign(ST.hotelInfo||{},{n:v});saveST();loadHotelInfo();updHotelLbl();renderTodayTop();toast('🏨 Hotel saved — add the address & phone in Plan › Prepare','', 'Open',function(){goTab('plan','prep','hotelCard');});}
function telOf(v){return String(v||'').replace(/[^\d+]/g,'');}
/* the leader field is free text ("Ahmed · +966 5x xxx xxxx"): pull the number out of it */
function leadPhone(){var l=(ST.hotelInfo||{}).l||'';var m=l.match(/\+?\d[\d\s\-().]{6,}\d/);return m?m[0]:'';}
function leadName(){var l=(ST.hotelInfo||{}).l||'',p=leadPhone();return (p?l.replace(p,''):l).replace(/^[\s·,:\-–|()]+|[\s·,:\-–|()]+$/g,'').trim();}
function mapsUrl(){var hi=ST.hotelInfo||{},pin=hotelPin(ST.city==='Madinah'?'madinah':'makkah')||anyPin();return 'https://www.google.com/maps/dir/?api=1&destination='+(pin?pin[0]+','+pin[1]:encodeURIComponent((hi.n||'')+' '+(hi.a||'')+' Saudi Arabia'));}
function showDriver(){var hi=ST.hotelInfo||{};
  if(!hi.n){toast('Enter your hotel name first','','Add it',function(){goTab('plan','prep','hotelCard');setTimeout(function(){var e=document.getElementById('hName');if(e)e.focus();},700);});return;}
  showDriverCard({top:'🚕 Please take me to my hotel',lead:'من فضلك خذني إلى هذا الفندق',en:hi.n,sub:hi.a||'',tel:hi.p||'',maps:mapsUrl()});}
function closeDriver(){document.getElementById('driver').classList.remove('on');if(wakeLock&&!document.getElementById('focus').classList.contains('on')){wakeLock.release().catch(function(){});wakeLock=null;}}
/* P-08: offline reunification card — leader's number, hotel, meeting point, 911 / 1966 in big type */
function showLost(){var hi=ST.hotelInfo||{},ph=leadPhone(),nm=leadName();
  var h='<div class="lost-ar">'+(ST.profile==='w'?'أنا ضائعة':'أنا ضائع')+'، من فضلك اتصل بهذا الرقم</div>';
  if(hi.l){h+='<div class="lost-en">I am with '+esc(nm||hi.l)+'. Please call:</div>'+(ph?'<a class="lost-tel" href="tel:'+telOf(ph)+'">'+esc(ph)+'</a>':'<div class="lost-tel" style="font-size:var(--t-6)">'+esc(hi.l)+'</div>');}
  else h+='<div class="lost-en">I am lost. Please help me reach my hotel, or call the emergency line.</div><div style="height:12px"></div>';
  if(hi.n)h+='<div class="lost-kv"><span>'+mkOr('🏨')+' Hotel</span><b>'+esc(hi.n)+'</b></div>';
  if(hi.a)h+='<div class="lost-kv"><span>'+mkOr('📍')+' Address</span><b style="text-align:right">'+esc(hi.a)+'</b></div>';
  if(hi.p)h+='<div class="lost-kv"><span>'+mkOr('☎','phone')+' Hotel phone</span><a href="tel:'+telOf(hi.p)+'">'+esc(hi.p)+'</a></div>';
  if(hi.m)h+='<div class="lost-kv"><span>'+mkOr('🤝','pin')+' Family meeting point</span><b style="text-align:right">'+esc(hi.m)+'</b></div>';
  /* J-05: in Hajj mode the Mina camp, maktab and group leader sit on the same card — the numbers a steward or policeman needs */
  var cp=ST.camp||{};if(journey()==='hajj'&&(cp.n||cp.m||cp.l||cp.p)){
    if(cp.n||cp.m)h+='<div class="lost-ar" style="font-size:var(--t-5);margin-top:10px">مخيمي في منى'+(cp.n?' · مخيم <bdi>'+esc(campN(cp))+'</bdi>':'')+(cp.m?' · مكتب <bdi>'+esc(campM(cp))+'</bdi>':'')+'</div>';
    if(cp.n)h+='<div class="lost-kv"><span>'+mkOr('⛺')+' Mina camp / tent</span><b>'+esc(cp.n)+'</b></div>';if(cp.m)h+='<div class="lost-kv"><span>'+mkOr('🏢','hotel')+' Maktab</span><b>'+esc(cp.m)+'</b></div>';
    if(cp.l||cp.p)h+=cp.p?telRow(mkOr('👥')+' '+esc(cp.l||'Group leader'),telOf(cp.p),esc(cp.p)):'<div class="lost-kv"><span>'+mkOr('👥')+' '+esc(cp.l)+'</span><b></b></div>';}
  h+=telRow(mkOr('🚓','alert')+' Police · ambulance','911','911')+telRow(mkOr('🕋')+' Hajj &amp; Umrah care line','1966','1966');
  if(!hi.l||!hi.n)h+='<button class="btn ghost" style="margin-top:16px" onclick="closeLost();goTab(\'plan\',\'prep\',\'hotelCard\')">'+markify('✍️ Add ')+(!hi.l&&!hi.n?'your hotel & a companion’s number':!hi.l?'a companion’s number':'your hotel')+'</button>';
  h+='<div class="focus-hint" style="margin-top:26px;text-align:center" onclick="closeLost()">tap here to close</div>';
  document.getElementById('lostBody').innerHTML=h;document.getElementById('lost').classList.add('on');vib([20,30,20]);}
function closeLost(){document.getElementById('lost').classList.remove('on');}
/* Home quick tool + Daily trip card → one sheet with every safety action */
function sosSheet(){var hi=ST.hotelInfo||{};
  openSheet('<div class="sheet-h danger">'+mk('car')+'</div><h3>Hotel &amp; SOS</h3><p>'+(hi.n?esc(hi.n)+(hi.m?' · meet at '+esc(hi.m):''):'No hotel saved yet — add it in Plan › Prepare so the driver card works offline.')+'</p><button class="btn" onclick="closeSheet();showDriver()">'+markify('🚕 Show to driver')+'</button>'+(journey()==='hajj'?'<button class="btn" onclick="closeSheet();showCampDriver()">'+markify('⛺ Take me to my camp in Mina')+'</button>':'')+'<button class="btn danger" onclick="closeSheet();showLost()">'+markify('🆘 I’m lost — show this')+'</button><div style="display:flex;gap:8px;margin-top:10px"><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:911">☎ 911</a><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:1966">☎ 1966 care</a></div><button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'prep\',\'hotelCard\')">'+markify('✍️ Edit hotel &amp; contacts')+'</button>');}
/* ── J-05: Mina camp / maktab / group leader (Settings card) — feeds the driver card, the lost card, Help and the Camp quick tool ── */
/* a camp or maktab value that already starts with its own label ("Camp 43", "maktab 12") is shown once, never "camp Camp 43" */
function campStrip(v,re){v=String(v||'').trim();var x=v.replace(re,'').trim();return x||v;}
function campN(c){return campStrip(c.n,/^(?:camp|tent)(?:\s*\/\s*tent)?\b[\s:#.\-]*/i);}
function campM(c){return campStrip(c.m,/^maktab\b[\s:#.\-]*/i);}
function saveCamp(){ST.camp={n:hv('cN'),m:hv('cM'),l:hv('cL'),p:hv('cP')};saveST();}
function loadCamp(){var c=ST.camp||{},e=document.getElementById('cN');if(!e)return;e.value=c.n||'';document.getElementById('cM').value=c.m||'';document.getElementById('cL').value=c.l||'';document.getElementById('cP').value=c.p||'';}
function showCampDriver(){var c=ST.camp||{};
  if(!c.n&&!c.m){toast('Add your camp or maktab number first','','Add it',function(){goTab('more','settings','campCard');setTimeout(function(){var e=document.getElementById('cN');if(e)e.focus();},700);});return;}
  var cn=campN(c),cm=campM(c);
  showDriverCard({top:'🚕 Please take me to my camp in Mina',lead:'من فضلك خذني إلى مخيمي في منى',arH:(c.n?'مخيم <bdi>'+esc(cn)+'</bdi>':'')+(c.n&&c.m?' · ':'')+(c.m?'مكتب <bdi>'+esc(cm)+'</bdi>':''),en:'Mina'+(c.n?' · camp / tent '+cn:'')+(c.m?' · maktab '+cm:''),sub:c.l?'Group leader: '+c.l:'',tel:c.p||'',telL:'☎ Call leader',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mina Makkah'+(c.m?' maktab '+c.m:''))});}
function campSheet(){var c=ST.camp||{},has=!!(c.n||c.m||c.l||c.p);
  openSheet('<div class="sheet-h">'+mk('tent')+'</div><h3>Mina camp</h3><p>'+(has?[c.n?'Camp / tent '+esc(campN(c)):'',c.m?'Maktab '+esc(campM(c)):'',c.l?esc(c.l):''].filter(Boolean).join(' · '):'Save your camp and maktab number and the group leader’s phone — the way back when every tent looks the same.')+'</p>'
    +(c.p?'<a class="btn" href="tel:'+telOf(c.p)+'" style="text-align:center;text-decoration:none">'+mk('phone','mkt')+'Call '+esc(c.l||'group leader')+'</a>':'')+'<button class="btn" onclick="closeSheet();showCampDriver()">'+markify('🚕 Take me to my camp')+'</button><button class="btn danger" onclick="closeSheet();showLost()">'+markify('🆘 I’m lost — show this')+'</button><button class="btn ghost" onclick="closeSheet();goTab(\'more\',\'settings\',\'campCard\')">'+markify('✍️ '+(has?'Edit':'Add')+' camp details')+'</button>');}
/* Rami counter arrives with Part 2; until then the quick tool lands on the rites */
function goRami(){if(typeof openRami==='function')openRami();else goTab('umrah','steps','hajjContainer');}
/* Umrah › Counters header: lost / hotel / meeting point */
function renderCntHd(){var a=document.getElementById('cntHd');if(!a)return;var hi=ST.hotelInfo||{};
  a.innerHTML='<button class="chip-btn sos" onclick="showLost()">'+markify('🆘 I’m lost')+'</button><button class="chip-btn" onclick="showDriver()">'+markify('🚕 Hotel')+'</button>'+(hi.m?'<button class="meetchip" style="margin:0" onclick="showLost()" aria-label="Family meeting point: '+esc(hi.m)+'"><span>📍 Meet: '+esc(hi.m)+'</span></button>':'');}
/* Daily › Today: today's itinerary line (P-11) and the trip card while on trip (P-07) */
function renderTodayTop(){var a=document.getElementById('todayTop');if(!a)return;var h='';
  var days=itinDays(),it=days[ST.day-1];
  if(it)h+='<div class="card todayit" role="button" tabindex="0" aria-label="Today’s itinerary: '+esc(it.e[1])+' — edit" title="'+esc(it.e[1])+'" onclick="goTab(\'plan\',\'prep\',\'itinCard\')"><span class="ti-i">🗓️</span><div class="ti-t"><b>'+(it.city==='Makkah'?'🕋':'🕌')+' '+it.city+'</b>'+it.e[0]+' '+esc(it.e[1])+'</div><span class="xchip">Edit →</span></div>';
  if(onTrip()){var hi=ST.hotelInfo||{};
    h+='<div class="card tripc"><div class="tc-h"><span>'+mkOr('🏨')+'</span><b'+(hi.m?' title="Meeting point: '+esc(hi.m)+'"':'')+'>'+(hi.n?esc(hi.n):'Your hotel')+'</b><button class="chip-btn" onclick="showDriver()" aria-label="Show to driver">'+markify('🚕 Driver')+'</button><button class="chip-btn sos" onclick="showLost()" aria-label="I’m lost — show this">'+markify('🆘 Lost')+'</button><button class="chip-btn" onclick="sosSheet()" aria-label="Emergency numbers 911 and 1966, hotel actions">'+markify('☎ SOS')+'</button></div>'
      +(hi.n?'':'<input class="srch" id="tcName" placeholder="Hotel name — so the driver card works" onchange="quickHotel(this.value)" aria-label="Hotel name">')+'</div>';}
  a.innerHTML=h;}

/* ════════════════════════ PACKING BAGS ════════════════════════ */
function bagFilter(btn,bag){
  btn.parentNode.querySelectorAll('.pill').forEach(function(b){b.classList.toggle('on',b===btn);});
  document.querySelectorAll('#planContainer [data-bag]').forEach(function(r){r.style.display=(bag==='all'||r.getAttribute('data-bag')===bag)?'':'none';});
}

/* ════════════════════════ DUA LIST ════════════════════════ */
var duas=[];try{duas=JSON.parse(localStorage.getItem('us-dualist')||'[]');}catch(e){}
var DUA_SUG=['Parents','Forgiveness','Shifa for…','Righteous spouse','Guidance for family','The Ummah','Husn al-khatimah','Hajj next year'];
var lastDeleted=null;
function saveDuas(){localStorage.setItem('us-dualist',JSON.stringify(duas));}
/* D-11: once flying, the in-Haram tools (tasbih, qibla) come first in the Tools column */
function updToolsOrder(){var col=document.getElementById('toolsCol');if(!col)return;var d=depDays(),trip=d!==null&&d<=0,o=trip?{tbCard:1,qiblaCard:2,waterCard:3,duaCard:4}:{duaCard:1,waterCard:2,tbCard:3,qiblaCard:4};Object.keys(o).forEach(function(id){var e=document.getElementById(id);if(e)e.style.order=o[id];});}
/* D-11: the dua card is a collapsible section — shut by default once flying when the list already has entries */
function renderDuaSec(){var c=document.getElementById('duaCard');if(!c)return;var d=depDays(),shut=d!==null&&d<=0&&duas.length>0;
  var inner='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 8px"><p style="font-size:var(--t-3);color:var(--ink2);margin:0;flex:1">Write them before you fly; tick them as you ask in the Haram.</p><button class="xchip" style="margin:0;flex-shrink:0" onclick="goTab(\'more\',\'duas\')">📖 Essential duas →</button></div>'
    +'<div style="display:flex;gap:8px;margin-bottom:8px"><input class="srch" id="duaIn" placeholder="Add a dua…" style="margin:0" onkeydown="if(event.key===\'Enter\')addDua()" aria-label="Add a dua"><button class="chip-btn" onclick="addDua()" aria-label="Add">＋</button></div><div id="duaList"></div>';
  c.innerHTML=mkSec({id:'dualist',ico:'🤲',title:'My dua list'},shut,inner);renderDuaList();}
function addDua(){var i=document.getElementById('duaIn'),v=(i.value||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();i.value='';renderDuaList();updStats();vib(15);}
function togDua(i){duas[i].done=!duas[i].done;saveDuas();renderDuaList();updStats();vib(10);}
/* D-12: a delete can be undone from the toast */
function delDua(i){var d=duas.splice(i,1)[0];if(!d)return;lastDeleted={i:i,d:d};saveDuas();renderDuaList();updStats();vib(8);
  toast('Removed “'+d.t.slice(0,32)+(d.t.length>32?'…':'')+'”',false,'Undo',function(){if(!lastDeleted)return;duas.splice(Math.min(lastDeleted.i,duas.length),0,lastDeleted.d);lastDeleted=null;saveDuas();renderDuaList();updStats();vib(10);});}
function duaNewRound(){duas.forEach(function(d){d.done=false;});saveDuas();renderDuaList();updStats();vib(10);toast('🤲 New round — every dua is unticked');}
function duaSuggest(el){var i=document.getElementById('duaIn');if(!i)return;i.value=el.textContent;i.focus();try{i.setSelectionRange(i.value.length,i.value.length);}catch(e){}vib(6);}
function renderDuaList(){
  var a=document.getElementById('duaList');if(!a)return;
  var done=duas.filter(function(d){return d.done;}).length,ct=document.getElementById('sp-dualist');if(ct)ct.textContent=duas.length?done+'/'+duas.length+' asked':'';
  if(!duas.length){a.innerHTML='<p style="font-size:var(--t-3);color:var(--ink3);margin:0 0 4px">Your list is empty. Start with the people who asked you to pray for them — or tap a starter:</p><div class="dua-sug">'+DUA_SUG.map(function(x){return '<button class="chip-btn" onclick="duaSuggest(this)">'+x+'</button>';}).join('')+'</div>';return;}
  var today=(dailyChk[dayKey()]||{}).dualist;
  a.innerHTML=duas.map(function(d,i){return '<div class="row'+(d.done?' done':'')+'" style="padding:8px 6px"><span class="tick" role="checkbox" tabindex="0" aria-checked="'+(d.done?'true':'false')+'" aria-label="'+esc(d.t)+'" onclick="togDua('+i+')"></span><div class="row-t" onclick="togDua('+i+')"><b>'+esc(d.t)+'</b></div><button class="chip-btn" style="padding:4px 10px" onclick="delDua('+i+')" aria-label="Remove '+esc(d.t)+'">✕</button></div>';}).join('')
    +'<div class="dua-acts"><span>'+done+' of '+duas.length+' asked</span>'+(done?'<button class="chip-btn" onclick="duaNewRound()">↺ Untick all — new round</button>':'')+'<button class="lnk" onclick="togDaily(\'dualist\')">'+(today?'✓ went through my list today':'Went through my list today? Tick it')+'</button></div>';
}

/* ════════════════════════ WATER & DISTANCE ════════════════════════ */
var waterD={};try{waterD=JSON.parse(localStorage.getItem('us-water')||'{}');}catch(e){}
function water(d){var k=dayKey();waterD[k]=Math.max(0,(waterD[k]||0)+d);localStorage.setItem('us-water',JSON.stringify(waterD));vib(10);renderWater();updStats();if(d>0&&waterD[k]===8)toast('💧 8 cups — good, keep going in the heat');}
/* D-13: the card does one thing; the 8 is a floor, not a cap */
function renderWater(){
  var l=document.getElementById('waterLbl'),b=document.getElementById('waterBar');if(!l)return;
  var c=waterD[dayKey()]||0;l.textContent=c+' cup'+(c===1?'':'s')+' today · aim for 8, 10–12 in summer heat';if(b)b.style.width=Math.min(100,c/8*100)+'%';
}
function cupsTotal(){var n=0;Object.keys(waterD).forEach(function(k){n+=waterD[k]||0;});return n;}
/* D-13/D-17: one shared estimate — 6 km per recorded Umrah, the live counters, and every logged nafl tawaf */
function kmEst(){var km=ST.umrahs*6+ST.tawaf*0.4+ST.sai*0.45;for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d)km+=(d.ntawafN||(d.ntawaf?1:0))*2.8;}return Math.round(km*10)/10;}

/* ════════════════════════ ITINERARY ════════════════════════ */
function itinST(){var it=ST.itin=ST.itin||{};if(it.mad===undefined)it.mad=3;if(!it.first)it.first='makkah';if(!it.custom)it.custom={};return it;}
function itinHasCustom(){return Object.keys(itinST().custom).length>0;}
function itinClearOK(){if(!itinHasCustom())return true;if(confirm('Changing this resets the days you edited. Continue?')){itinST().custom={};return true;}return false;}
function setItin(first){if(!itinClearOK()){renderItin();return;}itinST().first=first;saveST();renderItin();renderTodayTop();}
function setItinDays(v){if(!itinClearOK()){renderItin();return;}itinST().mad=Math.max(0,Math.min(20,parseInt(v)||0));saveST();renderItin();renderTodayTop();}
function setPace(p){if(!itinClearOK()){renderItin();return;}itinST().pace=p||'';saveST();renderItin();renderTodayTop();}
var MK=[['🛬','Arrive · ihram at the miqat (in flight) · Umrah tonight when rested'],['🕌','All five prayers in the Haram · nafl tawaf after Fajr · rest'],['🚐','Ziyarah taxi loop: Hira → Arafat → Muzdalifah → Mina → Thawr'],['🤍','Second Umrah from Tan’eem (or Ji’ranah) · Zamzam & long dua'],['📖','Quran facing the Kaaba · Hijr Isma’il late night · Clock Tower museum'],['🕋','Nafl tawaf · Jannat al-Mu’alla · Masjid al-Jinn · rest'],['🌙','Tahajjud in the Haram · dua list at the Multazam · shopping']];
var MD=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'],['🕌','Rawdah (Nusuk permit) · Baqi’ after Fajr (brothers enter; sisters give salam from the gate) · Quba with wudu from the hotel'],['🚌','Hop-on hop-off: Qiblatayn → Trench → Uhud → Hijaz Railway'],['📿','Masjid al-Ijabah · Quran & Seerah museums · Ajwa dates market'],['🌙','Tahajjud in the Nabawi · Quba Avenue walk · long dua']];
/* P-33 family pace: later Umrah, one site a day, no climbs, midday rest */
var REST=' · ☀️ 12–4pm rest in hotel';
var MK_F=[['🛬','Arrive in ihram · settle, rest · Isha in the Haram — you stay in ihram until tomorrow’s Umrah'],['🕋','Umrah after Fajr while it is cool · sleep after Dhuhr'+REST],['🕌','Prayers in the Haram · Zamzam · one short visit: Jannat al-Mu’alla'+REST],['🚐','One site by taxi: Arafat (view from the car, no climbing)'+REST],['📖','Quran after Fajr · Clock Tower museum (indoors, cool)'+REST],['🤍','Optional second Umrah from Tan’eem after Fajr — skip if anyone is tired'+REST],['🌙','Nafl tawaf after Isha when it is cooler · dua list'+REST]];
var MD_F=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'+REST],['🕌','Rawdah (Nusuk permit) · Baqi’ from the gate after Fajr'+REST],['🚌','One site: Quba by hop-on hop-off or taxi, wudu from the hotel'+REST],['⛰️','One site: Uhud after Asr (short, flat visit) · Ajwa dates market'+REST],['🌙','Prayers in the Nabawi · Quba Avenue walk after Maghrib'+REST]];
/* P-11: day builder shared by the card, Daily › Today and the share text; a 1-day leg never loses the Umrah */
function itinDays(){
  var it=itinST(),N=ST.tripLen,mad=Math.min(it.mad,N-1),mk=N-mad,fam=it.pace==='family',A=fam?MK_F:MK,B=fam?MD_F:MD,days=[];
  function push(arr,cnt,city){for(var i=0;i<cnt;i++)days.push({city:city,e:arr[Math.min(i,arr.length-1)]});}
  if(it.first==='makkah'){push(A,mk,'Makkah');if(mk===1&&fam)days[0]={city:'Makkah',e:['🛬','Arrive in ihram · Umrah tonight when rested — your only Makkah day']};push(B,mad,'Madinah');}
  else{push(B,mad,'Madinah');days.push({city:'Makkah',e:['🚄','Train to Makkah · ihram at Masjid al-Miqat (Abyar Ali) · '+(fam?'Umrah on arrival if the children are fresh, else after Fajr tomorrow (stay in ihram)':'Umrah on arrival')]});push(A.slice(1),mk-1,'Makkah');}
  var last=days[days.length-1],leg=0;for(var i=days.length-1;i>=0&&days[i].city===last.city;i--)leg++;
  if(last.city==='Makkah')last.e=leg>=2?['🕋','Farewell tawaf (tawaf al-wada’) · last dua at the Multazam · depart']:['🕋','Train to Makkah · ihram at Abyar Ali · Umrah on arrival · farewell tawaf before departing'];
  else last.e=leg>=2?['🕌','Last salam to the Prophet ﷺ · depart']:['🕌','Salam to the Prophet ﷺ · Rawdah if permitted · depart'];
  days.forEach(function(d,idx){var c=it.custom[idx];if(typeof c==='string'&&c){d.cus=true;d.e=[d.e[0],c];}});
  return days;
}
function renderItin(){
  var a=document.getElementById('itinArea');if(!a)return;
  var it=itinST(),N=ST.tripLen;
  document.getElementById('itMk').classList.toggle('on',it.first==='makkah');document.getElementById('itMd').classList.toggle('on',it.first==='madinah');
  document.getElementById('itPaceN').classList.toggle('on',it.pace!=='family');document.getElementById('itPaceF').classList.toggle('on',it.pace==='family');
  var madIn=document.getElementById('itMad');madIn.max=N-1;if(it.mad>N-1){it.mad=N-1;saveST();}madIn.value=it.mad;
  var ms=document.getElementById('itMadSub');if(ms)ms.textContent='The rest of your '+N+'-day trip go to Makkah';
  var base=ST.dep?new Date(ST.dep+'T00:00:00'):null;
  var subEl=document.getElementById('itinSub');if(subEl){if(base){var end=new Date(base.getTime()+(N-1)*86400000);subEl.textContent=N+'-day trip · '+base.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' – '+end.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+(it.pace==='family'?' · family pace':'')+' — tap a day to edit it';}else subEl.textContent='Set your departure and return dates above · '+N+'-day plan — tap a day to edit it';}
  var days=itinDays(),trip=onTrip();
  a.innerHTML=days.map(function(d,idx){var dt=base?new Date(base.getTime()+idx*86400000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):'';var today=trip&&idx+1===ST.day;
    return '<div class="it'+(today?' today':'')+'" id="it-'+idx+'"><div class="it-d"><b>Day '+(idx+1)+(today?' · today':'')+'</b><small>'+(dt||d.city)+'</small></div><div class="it-t" role="button" tabindex="0" aria-label="Edit day '+(idx+1)+'" onclick="itEdit('+idx+')"><span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span>'+d.e[0]+' '+(d.cus?esc(d.e[1])+'<span class="cus" title="Edited">✎</span>':linkPlaces(d.e[1]))+'</div></div>';}).join('')
    +'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:8px">A suggestion, not a rule — worship comes first; drop ziyarah if you are tired. Tap any day to rewrite it'+(itinHasCustom()?' (✎ = edited)':'')+'.</p>';
}
function itEdit(idx){var row=document.getElementById('it-'+idx);if(!row)return;var d=itinDays()[idx];if(!d)return;var t=row.querySelector('.it-t');if(!t||t.querySelector('textarea'))return;
  t.onclick=null;t.innerHTML='<span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span><textarea class="it-ed" id="itEd-'+idx+'" aria-label="Plan for day '+(idx+1)+'">'+esc(d.e[1])+'</textarea><div class="it-acts"><button class="chip-btn" style="background:var(--act-bg);color:var(--act-ink);border-color:var(--brand)" onclick="itSave('+idx+')">Save</button><button class="chip-btn" onclick="renderItin()">Cancel</button>'+(d.cus?'<button class="chip-btn" onclick="itReset('+idx+')">↺ Reset day</button>':'')+'</div>';
  var ta=document.getElementById('itEd-'+idx);if(ta)ta.focus();}
function itSave(idx){var ta=document.getElementById('itEd-'+idx);if(!ta)return;var v=ta.value.trim(),it=itinST();if(v&&v!==itinDaysDefault(idx))it.custom[idx]=v.slice(0,300);else delete it.custom[idx];saveST();renderItin();renderTodayTop();vib(10);}
function itinDaysDefault(idx){var it=itinST(),keep=it.custom;it.custom={};var d=itinDays()[idx];it.custom=keep;return d?d.e[1]:'';}
function itReset(idx){var it=itinST();delete it.custom[idx];saveST();renderItin();renderTodayTop();}
function shareItin(){var base=ST.dep?new Date(ST.dep+'T00:00:00'):null,it=itinST();
  var lines=[(ST.name?ST.name+'’s':'Our')+' Umrah itinerary · '+ST.tripLen+' days'+(base?' from '+fmtDate(ST.dep):'')+(it.pace==='family'?' · family pace':'')];
  itinDays().forEach(function(d,idx){var dt=base?new Date(base.getTime()+idx*86400000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})+' · ':'';lines.push('Day '+(idx+1)+' · '+dt+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+' — '+d.e[0]+' '+d.e[1]);});
  lines.push('via Miqah');shareText('Umrah itinerary',lines.join('\n'),APP_URL);}

var ITIN_PLACES={'Tan’eem':'taneem','Ji’ranah':'jiranah','Quba Avenue':'qubasq','Quba':'quba','Uhud':'uhud','Rawdah':'rawdah','Abyar Ali':'miqat','Hira':'hira','Arafat':'arafat','Muzdalifah':'muzdalifah','Mina':'mina','Thawr':'thawr','Baqi’':'baqi','Qiblatayn':'qiblatain','Trench':'khandaq','Hijaz Railway':'hijazrail','Masjid al-Jinn':'jinn','Jannat al-Mu’alla':'mualla','Masjid al-Ijabah':'ijabah','Clock Tower museum':'clock','Quran & Seerah museums':'quranmuseum','Hijr Isma’il':'hijr','Zamzam':'zamzam'};
var ITIN_RE=new RegExp(Object.keys(ITIN_PLACES).sort(function(a,b){return b.length-a.length;}).map(function(k){return k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|'),'g');
function linkPlaces(str){return str.replace(ITIN_RE,function(m){return '<span class="pl-link" onclick="event.stopPropagation();openPlace(\''+ITIN_PLACES[m]+'\')">'+m+'</span>';});}

/* ════════════════════════ SHARE PROGRESS CARD ════════════════════════ */
function shareCard(){
  if(statsEmpty()){toast('Tick a few deeds in Today first');return;}
  var c=document.createElement('canvas');c.width=1080;c.height=1080;var x=c.getContext('2d');
  kCloth(x,1080,1080);
  var logged=0,sum=0;for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0){logged++;sum+=p;}}
  var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length,tb=tbTotal();
  var nt=0;for(var j=1;j<=ST.tripLen;j++){var dd=dailyChk['d'+j];if(dd)nt+=(dd.ntawafN||(dd.ntawaf?1:0));}
  kBadge(x,540,172,'kaaba',130);x.textAlign='center';kBrand(x,540,292,40);
  x.font='600 56px '+KF;x.fillStyle=K.ihram;x.fillText((ST.name||'My')+(ST.name?'’s':'')+' journey',540,362);
  x.font='500 30px '+KB;x.fillStyle=K.ihram2;x.fillText('Day '+ST.day+' of '+ST.tripLen+' · '+logged+' day'+(logged===1?'':'s')+' logged',540,412);
  /* the Home card's metrics: label over value, split by hairlines — a 3 × 2 grid, no boxed tiles */
  var tiles=[[ST.umrahs,'Umrahs'],[nt,'Nafl tawafs'],[(logged?Math.round(sum/logged):0)+'%','Avg. daily deeds'],[pv,'Places visited'],[tb,'Dhikr counted'],[streakOf('fajr'),'Fajr streak']];
  var X0=96,CW=296,Y0=476,RH=226;x.strokeStyle=K.goldHair;x.lineWidth=1.5;
  for(var r=0;r<3;r++){x.beginPath();x.moveTo(X0,Y0+r*RH);x.lineTo(X0+3*CW,Y0+r*RH);x.stroke();}
  for(var cI=1;cI<3;cI++)for(var r2=0;r2<2;r2++){x.beginPath();x.moveTo(X0+cI*CW,Y0+r2*RH+34);x.lineTo(X0+cI*CW,Y0+(r2+1)*RH-34);x.stroke();}
  x.textAlign='left';
  tiles.forEach(function(t,i){var lx=X0+(i%3)*CW+(i%3?36:0),ty=Y0+Math.floor(i/3)*RH;x.fillStyle=K.ihram3;x.font='500 26px '+KB;x.fillText(t[1],lx,ty+66);x.fillStyle=K.ihram;x.font='300 84px '+KB;try{x.letterSpacing='-3px';}catch(e){}x.fillText(String(t[0]),lx-3,ty+160);try{x.letterSpacing='0px';}catch(e){}});
  x.textAlign='center';
  kFoot(x,'Make dua for me · umrah-strivers.vercel.app',540,1010);
  exportImage(c,'umrah-progress.png','My progress card');
}

/* ════════════════════════ DOCUMENT VAULT (AES-GCM, IndexedDB) ════════════════════════ */
var vKey=null,vDB=null;
function vOpen(){return new Promise(function(res,rej){if(vDB)return res(vDB);var r=indexedDB.open('us-vault',1);r.onupgradeneeded=function(){r.result.createObjectStore('docs',{keyPath:'id'});};r.onsuccess=function(){vDB=r.result;res(vDB);};r.onerror=function(){rej(r.error);};});}
function vAll(){return vOpen().then(function(db){return new Promise(function(res){var t=db.transaction('docs').objectStore('docs').getAll();t.onsuccess=function(){res(t.result||[]);};});});}
function vPut(d){return vOpen().then(function(db){return new Promise(function(res){var t=db.transaction('docs','readwrite');t.objectStore('docs').put(d);t.oncomplete=res;});});}
function vDel(id){return vOpen().then(function(db){return new Promise(function(res){var t=db.transaction('docs','readwrite');t.objectStore('docs').delete(id);t.oncomplete=res;});});}
function vDerive(pin,salt){var enc=new TextEncoder();return crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveKey']).then(function(k){return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:120000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);});}
function vSalt(){var st=localStorage.getItem('us-vault-salt');if(st)return Uint8Array.from(atob(st),function(c){return c.charCodeAt(0);});var sa=crypto.getRandomValues(new Uint8Array(16));localStorage.setItem('us-vault-salt',btoa(String.fromCharCode.apply(null,sa)));return sa;}
function vUnlock(){
  var pin=(document.getElementById('vPin')||{}).value||'';if(pin.length<4){toast('PIN needs at least 4 digits');return;}
  vDerive(pin,vSalt()).then(function(k){
    var chk=localStorage.getItem('us-vault-chk');
    var iv=new Uint8Array(12);
    return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,new TextEncoder().encode('umrah')).then(function(buf){
      var sig=btoa(String.fromCharCode.apply(null,new Uint8Array(buf)));
      if(!chk){localStorage.setItem('us-vault-chk',sig);vKey=k;toast('🔐 Vault created');}
      else if(chk===sig){vKey=k;toast('🔓 Vault unlocked');}
      else{toast('❌ Wrong PIN');return;}
      renderVault();
    });
  }).catch(function(){toast('Encryption not available in this browser');});
}
function vLock(){vKey=null;renderVault();}
function vAdd(ev){
  var f=ev.target.files[0];if(!f||!vKey)return;
  var proceed=function(blob,type){blob.arrayBuffer().then(function(ab){var iv=crypto.getRandomValues(new Uint8Array(12));return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},vKey,ab).then(function(enc){return vPut({id:Date.now(),name:f.name,type:type,iv:Array.from(iv),data:enc});});}).then(function(){toast('🔐 Saved to vault');renderVault();});};
  if(f.type.indexOf('image/')===0){var img=new Image();img.onload=function(){var sc=Math.min(1,1400/Math.max(img.width,img.height));var c=document.createElement('canvas');c.width=img.width*sc;c.height=img.height*sc;c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(function(b){proceed(b,'image/jpeg');},'image/jpeg',.82);};img.src=URL.createObjectURL(f);}
  else if(f.size<3000000)proceed(f,f.type||'application/octet-stream');else toast('File too large (3 MB max)');
  ev.target.value='';
}
function vView(id){vAll().then(function(all){var d=all.filter(function(x){return x.id===id;})[0];if(!d||!vKey)return;return crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(d.iv)},vKey,d.data).then(function(buf){var url=URL.createObjectURL(new Blob([buf],{type:d.type}));var w=window.open(url,'_blank');if(!w){var a=document.createElement('a');a.href=url;a.download=d.name;a.click();}});}).catch(function(){toast('Could not open — wrong PIN?');});}
function vRemove(id){if(!confirm('Delete this document from the vault?'))return;vDel(id).then(renderVault);}
function renderVault(){
  var a=document.getElementById('vaultArea');if(!a)return;
  if(!('crypto' in window)||!crypto.subtle){a.innerHTML='<p style="font-size:var(--t-3);color:var(--ink3)">Secure storage needs HTTPS — open the app from umrah-strivers.vercel.app.</p>';return;}
  var has=!!localStorage.getItem('us-vault-chk');
  if(!vKey){a.innerHTML='<div style="display:flex;gap:8px"><input class="srch" id="vPin" type="password" inputmode="numeric" placeholder="'+(has?'Enter your PIN':'Choose a PIN (4+ digits)')+'" style="margin:0" onkeydown="if(event.key===\'Enter\')vUnlock()"><button class="chip-btn" onclick="vUnlock()">'+(has?'🔓 Unlock':'🔐 Create')+'</button></div><p style="font-size:var(--t-2);color:var(--ink3);margin-top:8px">Forgotten PIN = lost documents. There is no reset — that is the point.</p>';return;}
  vAll().then(function(all){
    a.innerHTML='<div style="display:flex;gap:8px;margin-bottom:10px"><label class="btn ghost" style="margin:0;text-align:center;flex:1;cursor:pointer">📎 Add photo / PDF<input type="file" accept="image/*,application/pdf" style="display:none" onchange="vAdd(event)"></label><button class="chip-btn" onclick="vLock()">🔒 Lock</button></div>'+(all.length?all.map(function(d){return '<div class="lg on"><span class="lg-i">'+(d.type.indexOf('image')===0?'🖼️':'📄')+'</span><span class="lg-t">'+d.name.replace(/</g,'&lt;')+'</span><button class="chip-btn" onclick="vView('+d.id+')">View</button><button class="chip-btn" onclick="vRemove('+d.id+')">✕</button></div>';}).join(''):'<p style="font-size:var(--t-3);color:var(--ink3)">Empty — add your passport photo page, visa, hotel and flight confirmations.</p>');
  });
}

/* ════════════════════════ HOTEL · NEAR ME · ROUTE ════════════════════════ */
/* ════════════════════════ HELPERS ════════════════════════ */
function jumpTo(id,quiet){var el=document.getElementById(id);if(!el)return;var off=118,strip=document.getElementById('riteNow');if(strip&&el.closest&&el.closest('#sub-umrah-steps')&&strip.offsetParent)off+=strip.offsetHeight+8;var y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:smooth()});if(!quiet)vib(8);}
function shareApp(){
  var data={title:'Miqah',text:'Miqah — Hajj & Umrah companion. Plan, learn, perform & track your Umrah or Hajj — rites walkthrough, tawaf counter, prayer times, ziyarah places & a knowledge quiz. Free, offline, private.',url:APP_URL};
  if(ST.dep){var dt=new Date(ST.dep+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});data.url=APP_URL+'?dep='+ST.dep+'&j='+journey();data.text='We fly on '+dt+(journey()==='hajj'?' for Hajj':'')+'. Install Miqah (free, offline, no account): 1) open the link and Add to Home Screen — it sets the journey and the departure date ('+dt+') for you, 2) do the Prepare checklist and pass Quiz levels 1–3 before we go.';}
  if(navigator.share){navigator.share(data).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(data.text+' '+data.url).then(function(){toast('🔗 Link copied — share it with your group');}).catch(function(){toast(data.url);});}
  else toast(data.url);
}
function showQR(){document.getElementById('qrShow').classList.add('on');vib(8);}
/* group link: ?dep=YYYY-MM-DD pre-sets the departure date on first open */
var depLinked=false,linkJourney='',pendingDep=null;
function applyDepLink(){
  var m=/[?&]dep=(\d{4}-\d{2}-\d{2})/.exec(location.search||''),j=/[?&]j=(hajj|umrah)/.exec(location.search||''),jv=j?j[1]:'';if(!m&&!j)return;
  try{history.replaceState(null,'',location.pathname);}catch(e){}
  var dt=m?new Date(m[1]+'T00:00:00'):null,ok=!!(dt&&!isNaN(dt)),future=ok&&dt>new Date();
  if(ok&&future&&!ST.dep){ST.dep=m[1];ST.onboarded=true;ST.stage=ST.stage||'plan';ST.sub=Object.assign(ST.sub||{},{plan:'prep'});ST.tab='plan';depLinked=true;
    /* J-04: ?dep=…&j=hajj is the zero-question path — the journey comes with the date */
    if(jv){ST.journey=jv;ST.journeyAsked=true;delete ST.hajjAsk;}
    saveST();hajjFitTrip();setTimeout(function(){toast((journey()==='hajj'?'⛺ Hajj — departure':'✈️ Departure')+' set to '+dt.toLocaleDateString('en-GB',{day:'numeric',month:'long'})+' from your group’s link',true);},600);return;}
  /* (review) never silent: a date already past gets a word; an existing user with a date gets a confirm sheet (nothing changes until they say so) */
  if(ok&&!future){setTimeout(function(){toast('📅 This link’s date has passed — ask your group leader for a fresh one');},700);return;}
  if(ok&&future){pendingDep={dep:m[1],j:jv};return;}
  /* ?dep=&j=hajj — a leader with no date yet: the journey comes from the link, only the date is asked */
  if(jv==='hajj'&&journey()!=='hajj'){if(!ST.onboarded){ST.journey='hajj';ST.journeyAsked=true;delete ST.hajjAsk;saveST();linkJourney='hajj';}else pendingDep={dep:'',j:'hajj'};}
}
function depLinkSheet(){var g=pendingDep;if(!g)return;var HJ=g.j==='hajj',y=HJ?hajjYearFor(g.dep||''):0;
  openSheet('<div class="sheet-h">'+(HJ?'⛺':'✈️')+'</div><h3>Your group’s link</h3><p><b>'+(HJ?'Hajj '+y:(g.j==='umrah'?'Umrah':'Your trip'))+(g.dep?' — flying '+fmtDate(g.dep,true):'')+'</b></p><p style="font-size:var(--t-2)">Switch to it? Only the journey and the date change — your checklists, counters, records and keepsakes stay exactly as they are'+(ST.dep?' (your current date: '+fmtDate(ST.dep,true)+')':'')+'.</p><button class="btn" onclick="depLinkApply()">✅ Switch to it</button><button class="btn ghost" onclick="pendingDep=null;closeSheet()">Keep mine</button>');}
function depLinkApply(){var g=pendingDep;if(!g)return;pendingDep=null;closeSheet();
  if(g.dep)ST.dep=g.dep;if(g.j){ST.journey=g.j;ST.journeyAsked=true;delete ST.hajjAsk;}delete ST.post;delete ST.hajjConf;delete ST.hajjShift;ST.hajjTypeConfirmed=false;ST.onboarded=true;ST.stage=ST.stage||'plan';saveST();hajjFitTrip();
  renderPost();applyJourney();journeyRefresh();updCountdown();renderItin();renderTimeline();renderTodayTop();updToolsOrder();renderDuaSec();updDaily();updStats();
  if(g.j==='hajj'&&!g.dep){obPrevJ=null;showOnboard('hajj');return;}
  goTab('plan','prep',g.dep?'tlCard':'cdCard');toast((g.j==='hajj'?'⛺ Hajj':'✈️ Trip')+(g.dep?' — flying '+fmtDate(g.dep):'')+' — from your group’s link',true);vib([30,40,60]);}
/* Manifest app shortcuts: ?go=count|steps|daily|places|plan|quiz|duas (long-press the launcher icon) */
var linkGo='';
var GO_TARGETS={count:['umrah','count'],steps:['umrah','steps'],daily:['daily','today'],
  places:['places',''],plan:['plan','prep'],quiz:['plan','quiz'],duas:['more','duas']};
function parseGoLink(){var m=/[?&]go=([a-z]+)/.exec(location.search||'');
  if(m&&GO_TARGETS[m[1]])linkGo=m[1];
  if(m){try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}}}

/* P-34 group setup link: #g=<base64 json> carries only trip settings — never progress */
var pendingGroup=null;
function shareSetup(){var hi=ST.hotelInfo||{},HJ=journey()==='hajj',J=HJ?'Hajj':'Umrah';
  var g={by:ST.name||'',dep:ST.dep||'',tripLen:ST.tripLen,itin:ST.itin||null,city:ST.city||'Makkah',hotelInfo:hi,hotel:ST.hotel||null,journey:journey(),hajjType:hajjType(),camp:HJ?(ST.camp||null):null};
  var url=APP_URL+'#g='+btoa(encodeURIComponent(JSON.stringify(g)));
  var txt=(ST.name?ST.name+'’s':'Our')+' '+J+' trip setup'+(ST.dep?' — flying '+fmtDate(ST.dep,true):'')+(hi.n?' · '+hi.n:'')+(HJ&&(ST.camp||{}).n?' · Mina camp '+ST.camp.n:'')+'. Open the link on your phone and tap Apply: it sets the dates, itinerary'+(HJ?', Hajj type, camp':'')+' and hotel card in Miqah (free, offline). Your own checklists are untouched.';
  shareText(J+' trip setup',txt,url);}
function parseGroupLink(){var h=location.hash||'';if(h.indexOf('#g=')!==0)return null;var out=null;
  try{var g=JSON.parse(decodeURIComponent(atob(h.slice(3))));if(g&&typeof g==='object'){out={};['by','dep','tripLen','itin','city','hotelInfo','hotel','journey','hajjType','camp'].forEach(function(k){if(g[k]!==undefined)out[k]=g[k];});}}catch(e){out=null;}
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  return out;}
function showGroupSheet(g){var parts=[],lead=g.journey==='hajj'?mk('tent','mkt'):'';if(g.journey==='hajj')parts.push('Hajj'+(HAJJ_TYPES[g.hajjType]?' ('+HAJJ_TYPES[g.hajjType].t+')':''));if(g.dep)parts.push('Departure '+fmtDate(g.dep,true));if(g.tripLen)parts.push(g.tripLen+' days');if(g.itin&&typeof g.itin==='object')parts.push((g.itin.first==='madinah'?'Madinah':'Makkah')+' first'+(g.itin.mad!==undefined?' ('+g.itin.mad+' Madinah day'+(g.itin.mad===1?'':'s')+')':''));if(g.hotelInfo&&g.hotelInfo.n)parts.push(g.hotelInfo.n);
  openSheet('<div class="sheet-h">👥</div><h3>Apply '+(g.by?esc(g.by)+'’s':'the group’s')+' trip setup?</h3><p><b>'+lead+esc(parts.join(' · ')||'Shared trip settings')+'</b></p><p style="font-size:var(--t-2)">Only the dates, itinerary, prayer city and hotel card are copied — your checklists, counters, quiz and journal stay exactly as they are.</p><button class="btn" onclick="applyGroup()">✅ Apply</button><button class="btn ghost" onclick="declineGroup()">Not now</button>');}
function applyGroup(){var g=pendingGroup;if(!g)return;var cl=function(v,a,b,d){v=parseInt(v);return isNaN(v)?d:Math.max(a,Math.min(b,v));};
  if(typeof g.dep==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(g.dep)&&!isNaN(new Date(g.dep+'T00:00:00')))ST.dep=g.dep;
  if(g.tripLen!==undefined){ST.tripLen=cl(g.tripLen,3,TRIP_MAX,ST.tripLen);if(ST.day>ST.tripLen)ST.day=ST.tripLen;}
  /* J-04: the group link carries the journey, the Hajj type and the Mina camp card (settings, never progress) */
  if(g.journey==='hajj'||g.journey==='umrah'){ST.journey=g.journey;ST.journeyAsked=true;delete ST.hajjAsk;}
  if(typeof g.hajjType==='string'&&HAJJ_TYPES[g.hajjType])ST.hajjType=g.hajjType;
  if(g.camp&&typeof g.camp==='object'){var cp={n:'',m:'',l:'',p:''};['n','m','l','p'].forEach(function(k){if(typeof g.camp[k]==='string')cp[k]=g.camp[k].slice(0,200);});ST.camp=cp;}
  if(g.itin&&typeof g.itin==='object'){var cus={};if(g.itin.custom&&typeof g.itin.custom==='object')Object.keys(g.itin.custom).forEach(function(k){if(/^\d+$/.test(k)&&typeof g.itin.custom[k]==='string')cus[k]=g.itin.custom[k].slice(0,300);});ST.itin={first:g.itin.first==='madinah'?'madinah':'makkah',mad:cl(g.itin.mad,0,20,3),pace:g.itin.pace==='family'?'family':'',custom:cus};}
  if(g.city==='Makkah'||g.city==='Madinah')ST.city=g.city;
  if(g.hotelInfo&&typeof g.hotelInfo==='object'){var hi={};['n','a','p','m','l'].forEach(function(k){if(typeof g.hotelInfo[k]==='string')hi[k]=g.hotelInfo[k].slice(0,200);});ST.hotelInfo=hi;}
  if(g.hotel){var nh=(ST.hotel&&!Array.isArray(ST.hotel)&&typeof ST.hotel==='object')?ST.hotel:{},okLL=function(v){return Array.isArray(v)&&v.length===2&&isFinite(v[0])&&isFinite(v[1]);};
    if(okLL(g.hotel)){var hc=cityOf([+g.hotel[0],+g.hotel[1]]);if(hc)nh[hc]=[+g.hotel[0],+g.hotel[1]];}else if(typeof g.hotel==='object')['makkah','madinah'].forEach(function(c){if(okLL(g.hotel[c]))nh[c]=[+g.hotel[c][0],+g.hotel[c][1]];});
    ST.hotel=nh;}
  ST.onboarded=true;ST.stage=ST.stage||'plan';saveST();hajjFitTrip();pendingGroup=null;closeSheet();
  var tl=document.getElementById('tripLen');if(tl)tl.value=ST.tripLen;var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');if(cm){cm.classList.toggle('on',ST.city==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  applyJourney();journeyRefresh();loadHotelInfo();updHotelLbl();updDaily();updStats();renderItin();updCountdown();renderCntHd();
  goTab('plan','prep','cdCard');toast('👥 Trip setup applied'+(g.by?' from '+g.by:''),true);vib([30,40,60]);
  /* the link answers every trip question, so only the personal ones remain — asked once, never again */
  if(!(ST.profAsked||ST.name||ST.profile))setTimeout(obMini,500);}
function declineGroup(){pendingGroup=null;closeSheet();if(!ST.onboarded)setTimeout(showOnboard,300);}
/* mini step after a group link: name, Brother/Sister, larger text */
function obMini(){openSheet('<div class="sheet-h">👋</div><h3>Two quick things</h3><p>Both can be changed later in Settings.</p><input class="srch" id="obMName" placeholder="Your name (optional — for your certificate)" value="'+esc(ST.name||'')+'" aria-label="Your name"><div class="setrow"><div><b>I am a…</b><small>Tailors ihram, packing &amp; the hair-cutting steps</small></div>'+profSegHTML('obProf3')+'</div><div class="setrow"><div><b>Larger text</b><small>Easier to read without glasses</small></div>'+textSwHTML('obText1')+'</div><button class="btn" onclick="obMiniDone()">Done</button>');applyProfile();applyText();}
function obMiniDone(){var nm=((document.getElementById('obMName')||{}).value||'').trim();if(nm)ST.name=nm;ST.profAsked=true;saveST();var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';closeSheet();vib(8);}

/* ════════════════════════ SUB-NAV ════════════════════════ */
function goSub(tab,sub,silent){
  ST.sub=ST.sub||{};ST.sub[tab]=sub;saveST();
  var view=document.getElementById('view-'+tab);if(!view)return;
  view.querySelectorAll('.sub').forEach(function(e){e.classList.toggle('on',e.id==='sub-'+tab+'-'+sub);});
  view.querySelectorAll('.seg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-sub')===sub);});
  if(!silent){vib(8);var top=view.querySelector('.seg');if(top){var y=top.getBoundingClientRect().top+window.scrollY-(62);if(window.scrollY>y)window.scrollTo({top:y,behavior:smooth()});}}
  if(tab==='daily'&&sub==='stats'){updStats();}
  if(tab==='daily'&&sub==='tools'){updToolsOrder();}
  qbAutoStop();
  if(tab==='plan'&&sub==='learn'){renderFC();}
  if(tab==='umrah'&&sub==='count'&&!silent&&cntStarted()){updCntLayout();setTimeout(function(){jumpTo(cntActive()+'Card',true);},40);}
  if(tab==='umrah'&&!silent){if(ST.subAuto&&ST.subAuto.umrah){delete ST.subAuto.umrah;saveST();}if(sub==='steps')focusRites(true);}
}
function applySubs(){
  ST.sub=ST.sub||{};
  /* U-18: until the pilgrim taps the Umrah segment themselves, the tab opens on the rites before departure and on the counters once flying */
  ST.subAuto=ST.subAuto||{};var dd=depDays();
  if(!ST.sub.umrah||ST.subAuto.umrah){ST.sub.umrah=(dd!==null&&dd<=0)?'count':'steps';ST.subAuto.umrah=true;}
  ['plan','umrah','daily','more'].forEach(function(t){
    var v=document.getElementById('view-'+t),first=v&&v.querySelector('.seg button');
    var sub=ST.sub[t]||(first?first.getAttribute('data-sub'):null);
    if(sub)goSub(t,sub,true);
  });
}

/* ════════════════════════ JOURNEY CHIP ════════════════════════ */
function updChip(){
  var c=document.getElementById('jChip');if(!c)return;
  var txt='🧭 Plan',go=['plan','prep',null],fn=null,act=activeCount();
  if(act){txt=(act==='tawaf'?'🕋 Tawaf ':'⛰️ Sa’i ')+ST[act]+'/7';fn=function(){resumeCount(act);};}
  else if(saiPending()){txt='🕋 Tawaf ✓ · sa’i';fn=function(){startSai();};}
  else if(ST.post){txt=journey()==='hajj'?'🌱 After Hajj':'🌱 Post-Umrah';fn=function(){goPost();};}
  else if(ST.dep){
    var d=depDays(),HJ=journey()==='hajj',hd=HJ?hajjDay():null;
    /* J-05: the chip follows the Hijri days once flying for Hajj — Umrah first, then the day of Mina/Arafah/Nahr/tashriq */
    if(HJ&&d<=0&&typeof hd==='number'){txt='⛺ '+DH_SHORT[hd]+' · '+hd+' DH';go=['umrah','steps',null];}
    else if(HJ&&d>0){txt='⛺ Hajj · '+d+' day'+(d===1?'':'s');go=['plan','prep','tlCard'];}
    else if(d===0){txt='🛫 Today';go=['umrah','count',null];}
    else if(d<-ST.tripLen){txt=HJ?'🌱 After Hajj':'🌱 After Umrah';fn=function(){goPost();};}
    else if(HJ&&hd==='pre'&&!tripUmrahs()&&!(ST.hajjTypeConfirmed&&hajjType()!=='tamattu')){txt='🕋 Umrah first';go=['umrah','count',null];}
    else if(HJ&&hd==='pre'){var hu=daysUntil(hajjDates(curHajjYear())[8]);txt='⛺ Hajj in '+hu+' d';go=['daily','today',null];}
    else if(d>0){txt='✈️ '+d+' day'+(d===1?'':'s');go=['plan','prep','tlCard'];}
    else{txt='🕋 Day '+(expectedDay()||ST.day)+' / '+ST.tripLen;go=['daily','today',null];}
  }
  else if(journey()==='hajj'){txt='⛺ Hajj '+curHajjYear();go=['plan','prep','cdCard'];}
  c.innerHTML=markify(txt);c.onclick=fn||function(){goTab(go[0],go[1],go[2]);};
  var sl=document.getElementById('stageLbl');if(sl){var names={plan:'Planning my trip',soon:'Flying soon',now:'In Makkah / Madinah',back:'Returned',before:'Been before'};sl.textContent=(ST.stage&&names[ST.stage]?'Now: '+names[ST.stage]+' · ':'')+'re-declare where you are — nothing is reset';}
}

/* ════════════════════════ ONBOARDING ════════════════════════ */
var obStage=null;
/* J-03: the sheet opens on the journey question (step 0). step 'stage' = the Umrah stage list straight away (Settings › Journey stage); step 'hajj' = the Hajj screen */
var obPrevJ=null;
function showOnboard(step){var o=document.getElementById('obSheet');if(!o)return;var s0=document.getElementById('obStep0'),s1=document.getElementById('obStep1'),s2=document.getElementById('obStep2');
  if(s0)s0.hidden=step!==undefined;s1.hidden=step!=='stage';s2.hidden=true;if(step!==undefined)obPrevJ=null;
  /* (review) the stage list speaks the journey's language */
  var p1=document.querySelector('#obStep1 p');if(p1)p1.textContent='Where are you on your '+(journey()==='hajj'?'Hajj':'Umrah')+' journey? We’ll take you straight to the right place.';
  var n=document.getElementById('obName');if(n)n.value=ST.name||'';applyText();applyProfile();o.classList.add('on');
  if(step==='hajj')obHajj();}
/* ✕ on first launch: the journey stays 'umrah' and Home offers a one-line "Going for Hajj?" chip until a journey is chosen.
   (review) ✕ on the Hajj screen reached from the journey question, with no date set, goes back to the journey it came from — a mis-tap on Hajj is not a decision */
function closeOnboard(){var o=document.getElementById('obSheet');if(!o)return;o.classList.remove('on');var s2=document.getElementById('obStep2');
  if(s2&&!s2.hidden&&obPrevJ&&obPrevJ!=='hajj'&&journey()==='hajj'&&!ST.dep){ST.journey=obPrevJ;if(!ST.onboarded)ST.journeyAsked=false;saveST();applyJourney();journeyRefresh();}
  obPrevJ=null;if(!ST.onboarded){ST.onboarded=true;if(!ST.journeyAsked)ST.hajjAsk=true;saveST();homeRefresh();}}
function chooseJourney(j){var was=journey();obPrevJ=was;ST.journey=j==='hajj'?'hajj':'umrah';ST.journeyAsked=true;delete ST.hajjAsk;saveST();vib(8);
  if(journey()!==was){applyJourney();journeyRefresh();}
  if(j==='hajj'){obHajj();return;}
  var p1=document.querySelector('#obStep1 p');if(p1)p1.textContent='Where are you on your Umrah journey? We’ll take you straight to the right place.';
  document.getElementById('obStep0').hidden=true;document.getElementById('obStep2').hidden=true;document.getElementById('obStep1').hidden=false;}
/* the Hajj screen: "Hajj <year>, when do you fly?" — nothing else is asked (type, trip length, city and return date live in Settings) */
function obHajj(){var s2=document.getElementById('obStep2'),y=hajjYearFor(ST.dep||''),today=isoOf(new Date());
  var h='<div class="sheet-h">'+mk('tent')+'</div><h3 id="obHTitle">Hajj '+y+' — when do you fly?</h3><p id="obHIntro">Your flight date drives the countdown and the dated to-do list. The days of Hajj themselves follow the Hijri calendar.</p>'
    +'<input type="date" class="srch" id="obHDep" value="'+(ST.dep||'')+'" aria-label="Departure date" oninput="obHajjDate(this.value)"><small class="ob-hint" id="obHHint">'+hajjHint(y)+'</small>'
    +'<div class="setrow"><div><b>I am a…</b><small>Tailors ihram, packing &amp; the hair-cutting steps</small></div>'+profSegHTML('obProf2')+'</div>'
    +'<input class="srch" id="obHName" placeholder="Your name (optional — for your keepsakes)" value="'+esc(ST.name||'')+'" aria-label="Your name" style="margin:0 0 10px">'
    +'<div id="obHere" hidden><div class="subt" style="margin:4px 0 2px">Already there</div>'+obStepper('obHDay','Which day of your trip?',ST.day||1,1,TRIP_MAX,'Day 1 = the day you arrived')
    +'<div class="setrow"><div><b>Have you already done your Umrah of Tamattu’?</b><small>Tawaf, sa’i and the hair cut on arrival</small></div><div class="segmini" id="obUmSeg"><button data-u="1"'+(ST.umrahs?' class="on"':'')+' onclick="obUmPick(1)">Yes</button><button data-u="0"'+(ST.umrahs?'':' class="on"')+' onclick="obUmPick(0)">No</button></div></div>'
    +'<button class="btn" onclick="obHajjHereApply()">Continue →</button></div>'
    +'<div id="obHMain"><button class="btn" onclick="obHajjApply()">Continue →</button><button class="btn ghost" onclick="obHajjHere()">'+markify('🕋 I’m already in Saudi Arabia')+'</button></div>'
    +'<button class="lnk" style="display:block;margin:10px auto 0;font-size:var(--t-3)" onclick="obHajjSkip()">Skip, I don’t know yet</button>'
    +(obPrevJ&&obPrevJ!=='hajj'?'<button class="lnk" style="display:block;margin:8px auto 0;font-size:var(--t-3)" onclick="chooseJourney(\'umrah\')">← Umrah instead</button>':'');
  s2.innerHTML=h;document.getElementById('obStep0').hidden=true;document.getElementById('obStep1').hidden=true;s2.hidden=false;applyProfile();obUm=ST.umrahs?1:0;
  var di=document.getElementById('obHDep');if(di&&!ST.dep)di.min=today;}
var obUm=0;
function obUmPick(v){obUm=v?1:0;document.querySelectorAll('#obUmSeg button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-u')==='1')===!!obUm);});vib(6);}
function obHajjDate(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return;var y=hajjYearFor(v),t=document.getElementById('obHTitle'),hh=document.getElementById('obHHint');if(t)t.textContent='Hajj '+y+' — when do you fly?';if(hh)hh.textContent=hajjHint(y);}
/* (review) "already there": the flight-date field and its hint make way for the trip-day stepper, and the title says so */
function obHajjHere(){var e=document.getElementById('obHere'),m=document.getElementById('obHMain');if(e)e.hidden=false;if(m)m.hidden=true;var di=document.getElementById('obHDep'),hh=document.getElementById('obHHint'),t=document.getElementById('obHTitle');if(di){di.removeAttribute('min');di.hidden=true;}if(hh)hh.hidden=true;var hi=document.getElementById('obHIntro');if(hi)hi.textContent='The day counter, prayer times and Part 2 start from where you are; the days of Hajj follow the Hijri calendar.';if(t)t.textContent='Hajj '+hajjYearFor('')+' — you are already there';vib(6);}
function obStepper(id,lbl,val,min,max,hint){return '<div class="setrow"><div><b>'+lbl+'</b>'+(hint?'<small>'+hint+'</small>':'')+'</div><div class="stepper"><button class="chip-btn" type="button" onclick="obStepBy(\''+id+'\',-1)" aria-label="One less">−</button><input type="number" class="numin" id="'+id+'" value="'+val+'" min="'+min+'" max="'+max+'" aria-label="'+lbl+'"><button class="chip-btn" type="button" onclick="obStepBy(\''+id+'\',1)" aria-label="One more">+</button></div></div>';}
function obStepBy(id,d){var e=document.getElementById(id);if(!e)return;var v=(parseInt(e.value)||parseInt(e.min)||1)+d;v=Math.max(parseInt(e.min)||1,Math.min(parseInt(e.max)||TRIP_MAX,v));e.value=v;vib(6);}
function obHajjName(){var nm=((document.getElementById('obHName')||{}).value||'').trim();if(nm)ST.name=nm;var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';}
function obHajjApply(){obHajjName();var v=(document.getElementById('obHDep')||{}).value||'';
  if(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(new Date(v+'T00:00:00')))ST.dep=v;
  var dd=depDays();ST.stage=(dd!==null&&dd<=0)?'now':'plan';obStage=ST.stage;
  obHajjFinish(ST.stage==='now'?['umrah','count',null]:['plan','prep',ST.dep?'tlCard':'cdCard']);}
function obHajjHereApply(){obHajjName();
  var day=parseInt((document.getElementById('obHDay')||{}).value)||1;day=Math.max(1,Math.min(TRIP_MAX,day));
  var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(day-1));ST.dep=isoOf(d);ST.day=day;ST.dayAuto=true;if(ST.tripLen<day)ST.tripLen=Math.min(TRIP_MAX,day+5);
  ST.stage='now';obStage='now';
  if(obUm&&!ST.umrahs)recordEstUmrah();
  obHajjFinish(['umrah',ST.umrahs?'steps':'count',null]);}
function obHajjSkip(){obHajjName();ST.stage=ST.stage||'plan';obStage='plan';obHajjFinish(['plan','prep','cdCard']);}
function obHajjFinish(go){ST.onboarded=true;ST.profAsked=true;saveST();hajjFitTrip();
  document.getElementById('obSheet').classList.remove('on');
  var t=document.getElementById('tripLen');if(t)t.value=ST.tripLen;
  applyJourney();journeyRefresh();renderPost();updCountdown();updDaily();updStats();renderItin();renderTimeline();renderTodayTop();updToolsOrder();renderDuaSec();
  goTab(go[0],go[1],go[2]);
  toast((ST.name?'Welcome, '+ST.name:'Welcome')+' — labbayk Allahumma Hajjan ⛺');vib([30,40,60]);}
/* "Have you already done your Umrah of Tamattu'?" → an Umrah on record, flagged est:true (no timeline), so Part 2 is never blocked */
function recordEstUmrah(){var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}hist.push({n:ST.umrahs+1,est:true,log:{done:Date.now()}});localStorage.setItem('us-umrahlog',JSON.stringify(hist));
  ST.umrahs++;ST.tmode='nafl';saveST();renderUmrahs();renderJourneys();}
function obNum(id,lbl,val,min,max,hint){return '<div class="setrow"><div><b>'+lbl+'</b>'+(hint?'<small>'+hint+'</small>':'')+'</div><input type="number" class="numin" id="'+id+'" value="'+val+'" min="'+min+'" max="'+max+'" aria-label="'+lbl+'"></div>';}
function chooseStage(st){
  var nm=(document.getElementById('obName').value||'').trim();if(nm)ST.name=nm;
  /* (review) in Hajj mode "I'm in Makkah / Madinah" is the Hajj already-there screen (trip day + the Umrah of Tamattu' question), not the Umrah stage flow */
  if(st==='now'&&journey()==='hajj'){saveST();obPrevJ=null;obHajj();obHajjHere();return;}
  ST.onboarded=true;ST.stage=st;obStage=st;ST.profAsked=true;ST.journeyAsked=true;delete ST.hajjAsk;
  if(st==='plan'||st==='soon'){ST.sub=Object.assign(ST.sub||{},{umrah:'steps'});ST.subAuto=ST.subAuto||{};delete ST.subAuto.umrah;goSub('umrah','steps',true);}
  saveST();
  var s2=document.getElementById('obStep2'),h='';
  var today=new Date();today.setHours(0,0,0,0);
  if(st==='plan'||st==='soon'){
    h='<div class="sheet-h">'+mk('plane')+'</div><h3>When do you fly?</h3><p>Your departure date drives the countdown, the dated to-do timeline and the itinerary. You can change it any time in Plan › Prepare.</p><input type="date" class="srch" id="obDep" value="'+(ST.dep||'')+'" aria-label="Departure date">';
  }else if(st==='now'){
    var cur=ST.city||'Makkah';
    h='<div class="sheet-h">'+mk('kaaba')+'</div><h3>Where are you today?</h3><p>So the prayer times, the day counter and the trip heatmap start in the right place.</p><div class="pills sm" style="justify-content:center;margin-bottom:10px"><button class="pill'+(cur==='Makkah'?' on':'')+'" id="obMk" onclick="obCity(\'Makkah\')">'+markify('🕋 Makkah')+'</button><button class="pill'+(cur==='Madinah'?' on':'')+'" id="obMd" onclick="obCity(\'Madinah\')">'+markify('🕌 Madinah')+'</button></div>'+obNum('obDay','Which day of your trip?',ST.day||1,1,TRIP_MAX,'Day 1 = the day you arrived')+obNum('obLen','How many days in total?',ST.tripLen||10,3,TRIP_MAX,'Both cities together');
  }else if(st==='before'){
    h='<div class="sheet-h">'+mk('refresh')+'</div><h3>Alhamdulillah — again!</h3><p>Umrahs you completed before using this app are counted in your totals (badges count only what this app records).</p>'+obNum('obPrev','How many Umrahs so far?',ST.umrahsPrev||1,0,99,'Before this trip');
  }
  if(!h){obFinish();return;}
  h+='<button class="btn" onclick="obApply()">Continue →</button><button class="btn ghost" onclick="obFinish()">Skip</button>';
  s2.innerHTML=h;document.getElementById('obStep1').hidden=true;s2.hidden=false;
}
function obCity(c){ST.city=c;saveST();document.getElementById('obMk').classList.toggle('on',c==='Makkah');document.getElementById('obMd').classList.toggle('on',c==='Madinah');var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');if(cm){cm.classList.toggle('on',c==='Makkah');cd.classList.toggle('on',c==='Madinah');}}
function obApply(){
  var st=obStage;
  if(st==='plan'||st==='soon'){var v=(document.getElementById('obDep')||{}).value;if(v)setDep(v);}
  if(st==='now'){
    var len=parseInt((document.getElementById('obLen')||{}).value)||ST.tripLen||10;len=Math.max(3,Math.min(TRIP_MAX,len));
    var day=parseInt((document.getElementById('obDay')||{}).value)||1;day=Math.max(1,Math.min(len,day));
    ST.tripLen=len;ST.day=day;ST.dayAuto=true;var t=document.getElementById('tripLen');if(t)t.value=len;
    var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(day-1));ST.dep=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
    saveST();updDaily();updStats();renderItin();updCountdown();
  }
  if(st==='before'){var p=parseInt((document.getElementById('obPrev')||{}).value);ST.umrahsPrev=Math.max(0,Math.min(99,isNaN(p)?0:p));saveST();updRites();updStats();}
  obFinish();
}
function obFinish(){
  var st=obStage,nm=ST.name;
  if(st==='now'&&!ST.dep){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((ST.day||1)-1));ST.dep=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  if(st==='back')ST.post=true;
  saveST();
  document.getElementById('obSheet').classList.remove('on');
  renderPost();updChip();updCountdown();
  if(st==='plan')goTab('plan','prep',ST.dep?'tlCard':'cdCard');
  else if(st==='soon'){if(ST.dep)goTab('plan','learn');else goTab('plan','prep','cdCard');}
  else if(st==='now')goTab('umrah','count');
  else if(st==='back')goPost(true);
  else if(st==='before')goTab('plan','prep',ST.dep?'tlCard':'cdCard');
  else goTab('home');
  toast(nm?'Welcome, '+nm+' 🕋':'Welcome 🕋');vib([30,40,60]);
}

/* ════════════════════════ CONFETTI ════════════════════════ */
function confetti(count){
  var c=document.getElementById('confetti');if(!c||RM.matches)return;
  var x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.style.display='block';
  var cols=['#C4B5FD','#EDE9FE','#A78BFA','#7C3AED','#FFFFFF','#4ADE80'];
  var ps=[];for(var i=0;i<(count||90);i++)ps.push({x:c.width/2+(Math.random()-.5)*120,y:c.height*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:4+Math.random()*5,c:cols[i%cols.length],a:Math.random()*Math.PI,s:(Math.random()-.5)*.3});
  var t0=Date.now();
  (function f(){var dt=(Date.now()-t0)/1000;x.clearRect(0,0,c.width,c.height);
    ps.forEach(function(p){p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=p.s;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.globalAlpha=Math.max(0,1-dt/1.8);x.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);x.restore();});
    if(dt<1.9)requestAnimationFrame(f);else{c.style.display='none';x.clearRect(0,0,c.width,c.height);}
  })();
}

/* ════════════════════════ COUNT-UP ════════════════════════ */
var SEG_OF={planPct:'plan',ritePct:'umrah',dPct:'daily'};
function animPct(id,to){
  var el=document.getElementById(id);if(!el)return;
  var sg=SEG_OF[id]&&document.querySelector('.seg[data-tab="'+SEG_OF[id]+'"]');if(sg)sg.style.setProperty('--p',Math.min(100,to)/100);
  var from=parseInt(el.textContent)||0;if(from===to||RM.matches){el.textContent=to+'%';return;}
  var t0=performance.now(),dur=650;
  (function f(now){var k=Math.min(1,(now-t0)/dur);k=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*k)+'%';if(k<1)requestAnimationFrame(f);})(t0);
}

/* ════════════════════════ CERTIFICATE ════════════════════════ */
function makeCert(){
  openSheet('<div class="sheet-h">🎖️</div><h3>Your certificate</h3><p>The name printed on your Certificate of Knowledge.</p><input class="srch" id="certName" value="'+(ST.name||'').replace(/"/g,'&quot;')+'" placeholder="Your name" aria-label="Name on certificate" onkeydown="if(event.key===\'Enter\')makeCertGo()"><button class="btn gold" onclick="makeCertGo()">🎖️ Make certificate</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>');
  setTimeout(function(){var i=document.getElementById('certName');if(i)i.focus();},300);
}
function makeCertGo(){
  var name=((document.getElementById('certName')||{}).value||'').trim()||'A Striving Pilgrim';
  ST.name=name;saveST();var ni=document.getElementById('nameIn');if(ni)ni.value=name;
  var c=document.createElement('canvas');c.width=1080;c.height=1350;
  var x=c.getContext('2d');
  kCloth(x,1080,1350);kBadge(x,540,235,'kaaba');
  x.textAlign='center';kBrand(x,540,372,48);
  x.font='500 30px '+KB;x.fillStyle=K.ihram2;x.fillText('Certificate of Knowledge',540,425);
  x.font='600 72px '+KF;x.fillStyle=K.ihram;x.fillText(name,540,580);
  kRule(x,340,740,625);
  x.font='30px '+KB;x.fillStyle=K.ihram;
  x.fillText('has completed the full '+qzVisible().length+'-level',540,700);
  x.fillText('Umrah Knowledge Circuit —',540,750);
  x.fillText('foundations, ihram, tawaf & sa’i, history,',540,800);
  x.fillText('virtues, Madinah and fiqh essentials.',540,850);
  x.font='500 28px '+KB;x.fillStyle=K.gold3;
  x.fillText('“Whoever travels a path seeking knowledge,',540,960);
  x.fillText('Allah makes easy for him a path to Paradise.”',540,1005);
  kFoot(x,'— Muslim 2699',540,1050);
  x.font='26px '+KB;x.fillStyle=K.ihram2;
  x.fillText(new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,1170);
  x.fillText('umrah-strivers.vercel.app',540,1215);
  exportImage(c,'umrah-knowledge-certificate.png','Certificate of Knowledge');
}

/* ════════════════════════ FLASHCARDS ════════════════════════ */
/* P-16: string keys — 'l#q#' quiz cards (front = question, back = options + explanation), 'know3' / 'qa1' / 'hist0' / 'virt0' / 'mad0' / 'sis0' / 'scam2' read cards.
   Deck order mirrors the Learn reading path; fcDue() puts your quiz mistakes first and, inside 28 days of departure, the ihram/tawaf levels + Know-before-you-go next. */
var FC_DECK=[],FC_MAP={},fcQueue=[],fcIdx=0,fcST={};
function fcToday(){return Math.floor(Date.now()/86400000);}
function fcSave(){localStorage.setItem('us-cards',JSON.stringify(fcST));}
function fcStarted(){return Object.keys(fcST).length>0;}
function buildDeck(){
  FC_DECK=[];FC_MAP={};
  function add(c){FC_DECK.push(c);FC_MAP[c.k]=c;}
  /* keys keep the global index so a graded card survives journey gating (j:'hajj' rows simply drop out of the deck) */
  function read(arr,pre,src){arr.forEach(function(it,i){if(!forMe(it))return;add({k:pre+i,f:it.t,b:it.b,src:'Read · '+src,type:'read'});});}
  function quiz(lv){var L=QUIZ_LEVELS[lv];if(!L||!forMe(L))return;L.qs.forEach(function(q,i){add({k:'l'+lv+'q'+i,f:q.q,q:q,lv:lv,src:'Quiz · '+L.name.split(' · ')[0],type:'quiz'});});}
  quiz(0);read(KNOW,'know','Know before you go');quiz(1);quiz(2);read(FIQHQA,'qa','Fiqh Q&A');quiz(6);read(HISTORY,'hist','History');quiz(3);read(VIRTUES,'virt','Virtues');quiz(4);read(MADINAH,'mad','Madinah');quiz(5);read(SISTERS,'sis','For sisters');read(SCAMS,'scam','Scams');
  for(var xl=7;xl<QUIZ_LEVELS.length;xl++)quiz(xl);
  try{fcST=JSON.parse(localStorage.getItem('us-cards')||'{}');}catch(e){fcST={};}
  /* migrate v1 numeric keys (old deck order: HISTORY, VIRTUES, MADINAH, FIQHQA) once */
  var mig=false,old=[['hist',HISTORY.length],['virt',VIRTUES.length],['mad',MADINAH.length],['qa',FIQHQA.length]];
  Object.keys(fcST).forEach(function(k){if(!/^\d+$/.test(k))return;mig=true;var i=+k,st=fcST[k];delete fcST[k];for(var j=0;j<old.length;j++){if(i<old[j][1]){var nk=old[j][0]+i;if(FC_MAP[nk]&&!fcST[nk])fcST[nk]=st;break;}i-=old[j][1];}});
  if(mig)fcSave();
}
function fcDue(){
  var t=fcToday(),d=depDays(),soon=d!==null&&d<=28,due=[],idx={};
  FC_DECK.forEach(function(c){var st=fcST[c.k];if(!st||st.due<=t){idx[c.k]=due.length;due.push(c.k);}});
  function tier(k){var c=FC_MAP[k];if(c.type==='quiz'&&qzST.wrong[k])return 0;if(soon&&((c.type==='quiz'&&(c.lv===1||c.lv===2))||k.indexOf('know')===0))return 1;return 2;}
  due.sort(function(a,b){return tier(a)-tier(b)||idx[a]-idx[b];});
  return due;
}
function fcBack(c){
  if(c.type!=='quiz')return c.b;
  var q=c.q,ans=qzAns(q);
  return '<div class="fc-q">'+q.q+'</div><div class="fc-opts">'+qzOpts(q).map(function(o,i){return '<div class="'+(i===ans?'ok':'')+'">'+(i===ans?'✓ ':'')+o+'</div>';}).join('')+'</div>'+q.e;
}
function renderFC(){
  var area=document.getElementById('fcArea');if(!area)return;
  var due=fcDue(),started=fcStarted(),lbl=document.getElementById('fcDueLbl');
  if(lbl)lbl.textContent=due.length?(started?due.length+' due today.':due.length+' cards ready.'):'';
  if(!fcQueue.length){
    if(!due.length){area.innerHTML='<div class="note" style="margin:0">✅ Cards caught up — back tomorrow.</div>';return;}
    var n=Math.min(started?12:5,due.length);
    area.innerHTML='<button class="btn gold" onclick="startFC()">🃏 '+(started?'Review next '+n+' ('+due.length+' due)':'Start with '+n+' cards')+'</button>'+(qzWrongCount()?'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:8px;text-align:center">Your quiz mistakes come first.</p>':'');return;
  }
  var k=fcQueue[fcIdx],c=FC_MAP[k];if(!c){fcEnd();return;}
  var wrong=c.type==='quiz'&&!!qzST.wrong[k];
  area.innerHTML='<div class="fc-prog">Card '+(fcIdx+1)+' / '+fcQueue.length+'</div>'
   +'<div class="fc-wrap" id="fcWrap"><div class="fc" id="fcFlip" role="button" tabindex="0" aria-label="Reveal the answer" onclick="fcFlip()"><div class="fc-in">'
   +'<div class="fc-face fc-front"><span class="fc-src'+(wrong?' wrong':'')+'">'+(wrong?'🔁 from your quiz':c.src)+'</span><div class="t">'+c.f+'</div><div class="hint">Tap to reveal · then grade yourself</div></div>'
   +'<div class="fc-face fc-back">'+fcBack(c)+'<span class="fc-showq" role="button" tabindex="0" onclick="event.stopPropagation();fcUnflip()">'+mk('chevl','mkt')+'Show question</span></div>'
   +'</div></div>'
   +'<div class="fc-acts"><button onclick="fcGrade(false)">↺ Again</button><button class="good" onclick="fcGrade(true)">✓ Got it</button></div></div>'
   +'<button class="fc-end" onclick="fcEnd()">✕ End session</button>';
}
function fcFlip(){var w=document.getElementById('fcWrap');if(w&&!w.classList.contains('flip')){w.classList.add('flip');vib(6);}}
function fcUnflip(){var w=document.getElementById('fcWrap');if(w)w.classList.remove('flip');}
function fcEnd(){fcQueue=[];fcIdx=0;renderFC();}
function startFC(){fcQueue=fcDue().slice(0,fcStarted()?12:5);fcIdx=0;renderFC();}
function fcGrade(ok){
  var k=fcQueue[fcIdx],st=fcST[k]||{box:0};
  var box=ok?Math.min(3,(st.box||0)+1):1;
  var gap=box===1?1:box===2?3:7;
  fcST[k]={box:box,due:fcToday()+gap};fcSave();
  vib(ok?20:[40,30,40]);
  fcIdx++;
  if(fcIdx>=fcQueue.length){var n=fcQueue.length;fcQueue=[];fcIdx=0;var rem=fcDue().length;
    if(rem)toast('🃏 '+n+' done · '+rem+' more due — keep going?','','Next '+Math.min(12,rem),function(){startFC();});
    else toast('🃏 Session done — all caught up until tomorrow',true);}
  renderFC();
}

/* ════════════════════════ KIDS CORNER (quiz + story time) ════════════════════════ */
var kqI=0,kqScore=0,kqLock=false,kqList=[],kqVoice=false;
function kidsBestLbl(){var kb=document.getElementById('kidsBest'),v=localStorage.getItem('us-kids');if(kb&&v)kb.textContent=v+'/'+KIDSQ.length;}
/* P-28: shuffled copy, inline in the collapsed card, ✕ Done restores the Start row */
function startKids(){kqList=qzShuffle(KIDSQ.slice());kqI=0;kqScore=0;kqVoice=false;var a=document.getElementById('kidsArea');if(a)a.hidden=false;var sb=document.getElementById('kidsStart');if(sb)sb.hidden=true;renderKQ();jumpTo('kidsCard',true);}
function kidsDone(){try{speechSynthesis.cancel();}catch(e){}var a=document.getElementById('kidsArea');if(a){a.hidden=true;a.innerHTML='';}var sb=document.getElementById('kidsStart');if(sb)sb.hidden=false;kqList=[];}
function renderKQ(){
  kqLock=false;
  var q=kqList[kqI];if(!q){kidsDone();return;}
  var h='<div class="fc-prog kq-hd"><span>Question '+(kqI+1)+' / '+kqList.length+'</span><button class="chip-btn" onclick="kidsDone()" aria-label="Finish the kids quiz">✕ Done</button></div><div class="kq-q">'+q.q+'</div>';
  q.o.forEach(function(o,i){h+='<button class="kq-o" id="kqo-'+i+'" onclick="answerKQ('+i+')">'+o+'</button>';});
  h+='<button class="say kq-say" onclick="kqSpeak()">🔊 Read it to me</button><div id="kqFb"></div>';
  document.getElementById('kidsArea').innerHTML=h;
}
function kqSpeak(){var q=kqList[kqI];if(!q)return;try{if(speechSynthesis.speaking){speechSynthesis.cancel();return;}}catch(e){}kqVoice=true;speakEn(q.q+'. '+q.o.map(function(o,i){return 'Option '+(i+1)+': '+o;}).join('. '));}
function answerKQ(i){
  if(kqLock)return;kqLock=true;
  var q=kqList[kqI],ok=i===q.a;
  if(ok){kqScore++;vib([30,30,30]);}else vib(80);
  document.getElementById('kqo-'+q.a).classList.add('right');
  if(!ok)document.getElementById('kqo-'+i).classList.add('wrong');
  document.getElementById('kqFb').innerHTML='<div class="qz-x">'+(ok?mk('starf','mkt')+'Yes! ':mk('heart','mkt')+'Almost! ')+q.e+'</div><button class="btn" onclick="nextKQ()">'+(kqI<kqList.length-1?'Next →':'See my stars!')+'</button>';
  if(kqVoice)speakEn((ok?'Yes! ':'Almost! ')+q.e);
}
function nextKQ(){
  if(kqI<kqList.length-1){kqI++;renderKQ();return;}
  var stars=Math.max(1,Math.round(kqScore/kqList.length*5));
  var best=+(localStorage.getItem('us-kids')||0);
  if(kqScore>best){best=kqScore;localStorage.setItem('us-kids',String(best));}
  document.getElementById('kidsArea').innerHTML='<div class="qz-final"><div class="kq-stars" role="img" aria-label="'+stars+' star'+(stars===1?'':'s')+'">'+new Array(stars+1).join(mk('starf'))+'</div><p style="font-size:1em"><b>'+kqScore+' / '+kqList.length+'</b> — '+(kqScore===kqList.length?'Mashallah, a little hafiz of Umrah!':'Great job — play again and get all the stars!')+'</p><button class="btn gold" onclick="startKids()">↺ Play again</button><button class="btn ghost" onclick="kidsDone()">✕ Done</button></div>';
  kidsBestLbl();
  vib([50,50,50,50,120]);if(kqScore===kqList.length)confetti(120);
}
/* P-37: story time — read-aloud stories under the kids quiz; openStory() is the target of the rite-step chips */
function renderStories(){var a=document.getElementById('storyList');if(!a)return;
  a.innerHTML=KIDS_STORIES.map(function(st){return '<div class="acc story" id="st-'+st.id+'"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+st.emoji+' '+st.title+' <span class="acc-c">▶</span></div><div class="acc-b"><p>'+st.text+'</p><div class="story-when">'+mk('clock','mkt')+st.when+'</div><div class="story-acts"><button class="say" data-text="'+esc(st.title+'. '+st.text)+'" data-lang="en" data-rate=".9" onclick="speakBtn(this)" aria-label="Read the story aloud">🔊 Read aloud</button><span class="src">'+st.src+'</span></div></div></div>';}).join('');}
function togStories(el,open){var l=document.getElementById('storyList');if(!l)return;var on=open===undefined?l.hidden:!!open;l.hidden=!on;if(el){el.classList.toggle('open',on);el.setAttribute('aria-expanded',on?'true':'false');}}
function openStory(id){var hd=document.querySelector('#kidsCard .story-h');togStories(hd,true);
  document.querySelectorAll('#storyList .acc').forEach(function(a){var me=a.id==='st-'+id;a.classList.toggle('open',me);var h=a.querySelector('.acc-h');if(h)h.setAttribute('aria-expanded',me?'true':'false');});
  goTab('plan','quiz','st-'+id);}

/* ════════════════════════ AUDIO (dua recitation · read-aloud) ════════════════════════ */
/* U-16: one Arabic voice chosen up front, a visible playing state, and an honest message when the device has no Arabic voice */
var AR_VOICE=null,voicesReady=false,curSay=null;
function pickArVoice(){try{var vs=speechSynthesis.getVoices();if(vs.length)voicesReady=true;var ar=vs.filter(function(v){return /^ar/i.test(v.lang||'');}),sa=ar.filter(function(v){return /^ar[-_]SA/i.test(v.lang);});AR_VOICE=sa[0]||ar[0]||null;}catch(e){}}
if('speechSynthesis' in window){pickArVoice();try{speechSynthesis.onvoiceschanged=pickArVoice;}catch(e){}}
function sayReset(){if(!curSay)return;var b=curSay;curSay=null;b.textContent=b.getAttribute('data-lbl')||'🔊 Listen';b.classList.remove('playing');b.setAttribute('aria-pressed','false');}
function speakText(text,lang,rate,btn){
  try{
    var same=!!btn&&btn===curSay;
    if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();
    sayReset();if(same)return true;
    var pre=lang.split('-')[0];
    if(pre==='ar'&&!AR_VOICE&&voicesReady){toast('No Arabic voice on this device — follow the transliteration');return false;}
    var u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=rate;
    if(pre==='ar'&&AR_VOICE)u.voice=AR_VOICE;
    else{var v=speechSynthesis.getVoices().filter(function(x){return x.lang&&x.lang.replace('_','-').indexOf(pre)===0;});if(v.length){var ex=v.filter(function(x){return x.lang.replace('_','-')===lang;});u.voice=ex[0]||v[0];}}
    if(btn){curSay=btn;if(!btn.getAttribute('data-lbl'))btn.setAttribute('data-lbl',btn.textContent);var on=function(){if(curSay!==btn)return;btn.textContent='⏹ Stop';btn.classList.add('playing');btn.setAttribute('aria-pressed','true');};on();u.onstart=on;}
    u.onend=u.onerror=function(){if(curSay===btn)sayReset();};
    speechSynthesis.speak(u);return true;
  }catch(e){toast('Audio not supported on this browser');return false;}
}
function speakEn(text){return speakText(String(text||'').replace(/<[^>]+>/g,' '),'en',.9);}
/* data-ar (Arabic dua, default) or data-text + data-lang / data-rate (stories); tapping the playing button stops it */
function speakBtn(el){
  if(window.event)window.event.stopPropagation();
  if(!('speechSynthesis' in window)){toast('Audio not supported on this browser');return;}
  speakText(el.getAttribute('data-text')||el.getAttribute('data-ar')||'',el.getAttribute('data-lang')||'ar-SA',parseFloat(el.getAttribute('data-rate'))||.8,el);
}
function testVoice(el){var t=DUAS[0];speakText(t.ar,'ar-SA',.8,el);}

/* ════════════════════════ WALKTHROUGH (U-14) · PRINT SHEET ════════════════════════ */
var walkOpen=false,walkI=0,walkReturn=false;
function startWalk(){var L=riteList(),nx=nextRite(),i=0;if(nx&&!nx.hajj){L.forEach(function(x,k){if(x.st.id===nx.st.id)i=k;});}else i=L.length;openWalkAt(i);vib(8);}
function openWalkAt(i){walkI=i;walkOpen=true;document.getElementById('walk').classList.add('on');document.body.style.overflow='hidden';renderWalk();}
function renderWalk(){
  var L=riteList(),hd=document.getElementById('walkHd'),b=document.getElementById('walkBody'),nb=document.getElementById('walkNext'),bb=document.getElementById('walkBack');if(!b)return;
  if(walkI>=L.length){hd.textContent='All '+L.length+' steps';
    if(journey()==='hajj'&&hajjType()!=='tamattu'){b.innerHTML='<div class="wk-done"><div class="big">'+mk('heart')+'</div><h3>Part 1 complete — stay in ihram</h3><p>No cutting until after Arafah and the stoning on the 10th. Part 2 continues on 8 Dhul Hijjah.</p><button class="btn gold" onclick="closeWalk(true);setSecOpen(\'hd8\',true);goTab(\'umrah\',\'steps\',\'hajjContainer\')">⛺ Open Part 2</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
    var cut=!!(riteChk.cut||riteChk.cutw);
    if(!cut&&halqUnconfirmed()){b.innerHTML='<div class="wk-done"><div class="big">'+mk('heart')+'</div><h3>Before anything is cut</h3><p>What did you say at the miqat? Tamattu’ cuts now; Qiran / Ifrad stay in ihram until the 10th.</p><button class="btn gold" onclick="closeWalk(true);halqGate(cutId())">🤍 Answer now</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
    b.innerHTML='<div class="wk-done"><div class="big">'+mk('check')+'</div><h3>'+(cut?'Your Umrah is complete':'Every step ticked?')+'</h3><p>'+(cut?'All ihram restrictions are lifted. Record it to keep the timeline and start a fresh checklist for the next one.':'Tick halq / taqsir when the hair is cut — ihram ends only then.')+'</p><button class="btn gold" onclick="finishUmrah()">'+markify('🎉 Record completed Umrah')+'</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';
    nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
  var x=L[walkI],st=x.st,on=!!riteChk[st.id],k=st.id==='rounds'?'tawaf':st.id==='laps'?'sai':null;
  hd.textContent='Step '+x.n+' of '+L.length+' · '+x.ph.title.replace(/^Phase \d+ · /,'').split(' — ')[0];
  var h='<div class="wk-n'+(on?' on':'')+'">'+(on?'✓ done':mkOr(x.ph.ico,'kaaba'))+'</div><h2 class="wk-t">'+st.b+'</h2><p class="wk-p">'+st.p+'</p>';
  if(st.why)h+='<div class="wk-why"><small>Why?</small>'+st.why+'</div>';
  if(k)h+='<div class="wk-cnt"><b>'+ST[k]+' / 7</b><span>'+(k==='tawaf'?'rounds':'laps')+' counted'+(ST[k]>=7?' — complete':'')+'</span><button class="btn" onclick="walkReturn=true;closeWalk(true);enterFocus(\''+k+'\')">⛶ Open counter</button></div>';
  h+=stDuas(st).map(function(d,i){return duaHTML(st,d,i);}).join('');
  if(st.kid)h+='<button class="xchip" onclick="closeWalk(true);openStory(\''+st.kid+'\')">🧒 Story for the kids →</button>';
  b.innerHTML=h;b.scrollTop=0;
  nb.hidden=false;nb.textContent=on?'Next →':'✓ Done → Next';bb.hidden=walkI===0;
}
function walkNav(d){var L=riteList();walkI=Math.max(0,Math.min(L.length,walkI+d));renderWalk();vib(6);}
function walkDone(){var L=riteList(),x=L[walkI];if(x&&!riteChk[x.st.id])togRite(x.st.id,true);walkNav(1);}
function closeWalk(quiet){var L=riteList(),x=L[walkI];walkOpen=false;document.getElementById('walk').classList.remove('on');document.body.style.overflow='';
  if(!quiet){if(x)openRiteStep(x.st.id);else{setSecOpen('ph4',true);jumpTo('riteDone',true);}}}
/* U-14: a printable briefing — rites with duas, the packing list and the emergency numbers */
function buildPrint(){var e=document.getElementById('printSheet');if(!e)return;var hi=ST.hotelInfo||{},n=0,h='<h1>Miqah — rites &amp; duas</h1><p class="pr-sub">Printed '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+(ST.name?' for '+esc(ST.name):'')+' · umrah-strivers.vercel.app</p>';
  RITES.forEach(function(ph){h+='<h2>'+ph.title+'</h2><ol start="'+(n+1)+'">';ph.steps.forEach(function(st){if(!riteVis(st))return;n++;var v=riteStepView(st);h+='<li><b>'+v.b+'</b> — '+v.p+stDuas(v).map(function(d){return '<div class="pr-dua"><span class="ar">'+d.ar+'</span><i>'+d.tl+'</i><br>'+d.tr+'</div>';}).join('')+'</li>';});h+='</ol>';});
  if(journey()==='hajj')hajjSecs().forEach(function(sc){h+='<h2>'+sc.title+'</h2><ol>';sc.steps.forEach(function(st){if(!forMe(st))return;var v=riteStepView(st);h+='<li><b>'+v.b+'</b> ('+v.req+') — '+v.p+stDuas(v).map(function(d){return '<div class="pr-dua"><span class="ar">'+d.ar+'</span><i>'+d.tl+'</i><br>'+d.tr+'</div>';}).join('')+'</li>';});h+='</ol>';});
  var pack=PLAN.filter(function(sc){return sc.id==='pack';})[0];if(pack)h+='<h2>Packing</h2><ul class="pr-pack">'+pack.items.filter(forMe).map(function(it){return '<li>'+it.label+'</li>';}).join('')+'</ul>';
  h+='<h2>Emergency &amp; help</h2><p>Police · ambulance · fire <b>911</b> · Health line <b>937</b> · Hajj &amp; Umrah care <b>1966</b> · Tourism <b>930</b>'+(hi.n?'<br>Hotel: <b>'+esc(hi.n)+'</b>'+(hi.a?' · '+esc(hi.a):'')+(hi.p?' · phone '+esc(hi.p):''):'')+(hi.m?'<br>Meeting point: <b>'+esc(hi.m)+'</b>':'')+(hi.l?'<br>Companion / leader: <b>'+esc(hi.l)+'</b>':'')+'</p>';
  e.innerHTML=dropEmoji(h);}
function printSheet(){buildPrint();toast('🖨️ Use “Save as PDF” in the print dialog to keep a copy');setTimeout(function(){try{window.print();}catch(e){}},150);}

/* ════════════════════════ KIDS' DAY (D-21) ════════════════════════ */
/* one row per child (ST.kidNames), five emoji tiles, no adult points; 'us-kids-daily' = {d<day>:{<childIdx>:{<tile>:true}}} */
var KD_TILES=[['🕌','Prayed with us'],['💧','Zamzam + a dua'],['📿','SubhanAllah ×10 / talbiyah'],['🤝','Patient in the crowd'],['📖','Learned one thing']];
var kidsD={};try{kidsD=JSON.parse(localStorage.getItem('us-kids-daily')||'{}');}catch(e){kidsD={};}
function kidNames(){return Array.isArray(ST.kidNames)?ST.kidNames:[];}
function kdFull(day,ci){var r=(kidsD['d'+day]||{})[ci]||{};return KD_TILES.every(function(t,i){return !!r[i];});}
function kdStars(ci){var n=0;for(var i=1;i<=ST.tripLen;i++)if(kdFull(i,ci))n++;return n;}
function kdBestStars(){var b=0;kidNames().forEach(function(_,i){b=Math.max(b,kdStars(i));});return b;}
function renderKidsDay(){var a=document.getElementById('kidsDay');if(!a)return;var names=kidNames();
  if(!names.length){a.innerHTML=ST.kids?'<div class="card kd"><div class="kd-h"><b>🧒 Kids’ day</b><button class="chip-btn" onclick="goTab(\'plan\',\'quiz\',\'kidsCard\')">+ Add a child</button></div><small style="font-size:var(--t-2);color:var(--ink2);line-height:var(--lh-meta);display:block">Add their names in Kids corner — each child then gets five stars to earn every day, separate from your own tracker.</small></div>':'';return;}
  var D=kidsD['d'+ST.day]||{};
  a.innerHTML='<div class="card kd"><div class="kd-h"><b>🧒 Kids’ day</b><small>tap what they did · 5 of 5 = ⭐</small></div>'+names.map(function(n,ci){var r=D[ci]||{},st=kdStars(ci);
    return '<div class="kd-row"><div class="kd-name" title="'+esc(n)+'">'+esc(n)+'<small aria-label="'+st+' full day'+(st===1?'':'s')+'">'+(st?new Array(Math.min(st,6)+1).join(mk('starf'))+(st>6?'+'+(st-6):''):'')+'</small></div><div class="kd-tiles" role="group" aria-label="'+esc(n)+'’s day">'+KD_TILES.map(function(t,i){return '<button class="kd-t'+(r[i]?' on':'')+'" aria-pressed="'+(r[i]?'true':'false')+'" title="'+t[1]+'" aria-label="'+esc(n)+': '+t[1]+'" onclick="kdTap('+ci+','+i+')">'+t[0]+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';}
function kdTap(ci,i){var k='d'+ST.day,D=kidsD[k]||{},r=D[ci]||{};r[i]=!r[i];D[ci]=r;kidsD[k]=D;save('us-kids-daily',kidsD);vib(15);
  if(kdFull(ST.day,ci)){confetti(60);vib([40,60,100]);toast('⭐ '+(kidNames()[ci]||'Little pilgrim')+' — 5 of 5 today, mashallah!',true);}
  renderKidsDay();chkBadges();}
function addKid(){var i=document.getElementById('kidIn'),v=((i&&i.value)||'').trim().slice(0,24);if(!v)return;var n=kidNames().slice();if(n.length>=6){toast('Up to 6 children');return;}n.push(v);ST.kidNames=n;if(!ST.kids){ST.kids=true;updKidsSw();renderPlan();updPlan();}saveST();if(i)i.value='';renderKidNames();renderKidsDay();vib(10);toast('🧒 '+v+' added — their stars live in Daily › Today');}
function delKid(ci){var n=kidNames().slice();n.splice(ci,1);ST.kidNames=n;saveST();Object.keys(kidsD).forEach(function(k){var D=kidsD[k]||{},nd={};Object.keys(D).forEach(function(c){c=+c;if(c<ci)nd[c]=D[c];else if(c>ci)nd[c-1]=D[c];});kidsD[k]=nd;});save('us-kids-daily',kidsD);renderKidNames();renderKidsDay();}
function renderKidNames(){var a=document.getElementById('kidNames');if(!a)return;var n=kidNames();
  a.innerHTML=(n.length?'<div class="kd-list">'+n.map(function(x,i){var st=kdStars(i);return '<span class="chip-btn" style="display:inline-flex;align-items:center;gap:6px">'+esc(x)+(st?' <span style="color:var(--gold-ink)">'+mk('starf')+st+'</span>':'')+'<button class="lnk" style="text-decoration:none;color:var(--ink3)" onclick="delKid('+i+')" aria-label="Remove '+esc(x)+'">✕</button></span>';}).join('')+'</div>':'')
    +'<div class="kd-add"><input class="srch" id="kidIn" placeholder="Child’s name" maxlength="24" aria-label="Child’s name" onkeydown="if(event.key===\'Enter\')addKid()"><button class="chip-btn" onclick="addKid()">+ Add a child</button></div><p style="font-size:var(--t-2);color:var(--ink3);margin-top:6px">Each child gets five daily stars on Daily › Today — prayed with us, Zamzam, dhikr, patience, learned one thing. Three 5-of-5 days earn the Little Pilgrim badge.</p>';}

/* ════════════════════════ POST-UMRAH MODE ════════════════════════ */
var POST_HABITS=['🕌 Five prayers on time','📖 Daily Quran','📿 Daily dhikr'];
var postData={};
function togPost(){ST.post=!ST.post;saveST();renderPost();updChip();}
function renderPost(){
  var sw=document.getElementById('postSw'),area=document.getElementById('postArea');
  if(!sw)return;
  sw.classList.toggle('on',!!ST.post);sw.setAttribute('aria-checked',ST.post?'true':'false');
  var ph=document.getElementById('postHero');if(ph)ph.hidden=!ST.post;
  if(!ST.post){area.innerHTML='';return;}
  try{postData=JSON.parse(localStorage.getItem('us-post')||'{}');}catch(e){postData={};}
  var h='',kept={},mh='';
  POST_HABITS.forEach(function(hb,hi){var d=postData[hi]||{},c=0;Object.keys(d).forEach(function(k){if(d[k]){c++;kept[k]=1;}});var l=stripEmoji(hb).replace(/^(Five|Daily) /,'');
    mh+='<span class="hs-mi"><small class="hs-ml">'+l.charAt(0).toUpperCase()+l.slice(1).replace(/ on time$/,'')+'</small><b class="hs-mv">'+c+'<i>/30</i></b></span>';});
  if(ph)ph.innerHTML='<div class="hero-t"><div class="k">'+mk('sprout','mkt')+'Back home</div><span class="hs-n">'+Object.keys(kept).length+'</span><div class="s hs-u">of 30 days kept · hold the Haram version of you</div><div class="hs-m">'+mh+'</div></div>';
  POST_HABITS.forEach(function(hb,hi){
    var d=postData[hi]||{},cnt=Object.keys(d).filter(function(k){return d[k];}).length;
    h+='<div class="ph-row"><div class="ph-hd"><span>'+markify(hb)+'</span><span>'+cnt+'/30</span></div><div class="ph-grid">';
    for(var i=1;i<=30;i++)h+='<div class="pchip'+(d[i]?' on':'')+'" onclick="togPostDay('+hi+','+i+')">'+i+'</div>';
    h+='</div></div>';
  });
  h+='<textarea class="pnotes" id="postNotes" placeholder="Reflections — what did the journey change in you? Which duas were answered?" onchange="localStorage.setItem(\'us-postnotes\',this.value)">'+(localStorage.getItem('us-postnotes')||'')+'</textarea>';
  area.innerHTML=h;
}
function togPostDay(hi,day){
  var d=postData[hi]||{};d[day]=!d[day];postData[hi]=d;
  localStorage.setItem('us-post',JSON.stringify(postData));vib(15);renderPost();
}

/* ════════════════════════ PRAYER REMINDERS (local, no push) ════════════════════════ */
function togRem(){
  if(!ST.rem){
    if(!('Notification' in window)){toast('Notifications not supported here');return;}
    Notification.requestPermission().then(function(p){
      if(p==='granted'){ST.rem=true;saveST();updRemSw();toast('🔔 Reminders on — while the app is open. For screen-off alarms add the week to your calendar (Settings)');}
      else toast('Notifications blocked — allow them in browser settings');
    });
  }else{ST.rem=false;saveST();updRemSw();toast('🔕 Reminders off');}
}
function updRemSw(){var sw=document.getElementById('remSw');if(sw){sw.classList.toggle('on',!!ST.rem);sw.setAttribute('aria-checked',ST.rem?'true':'false');}
  var bell=document.getElementById('ptBell');if(bell){bell.classList.toggle('on',!!ST.rem);bell.setAttribute('aria-pressed',ST.rem?'true':'false');bell.title=ST.rem?'Reminders on (while the app is open) — tap to turn off':'Turn on prayer reminders';}}
/* D-07: Jumu'ah gets a 60-minute lead — the Haram fills 1–2 h before */
function remTick(){
  if(!ST.rem||!ptData||!('Notification' in window)||Notification.permission!=='granted')return;
  var now=riyadhNow(),nowMin=now.getHours()*60+now.getMinutes(),fri=now.getDay()===5;
  for(var i=0;i<PT_NAMES.length;i++){
    var nm=PT_NAMES[i],jum=fri&&nm==='Dhuhr',m=ptMin(ptData.t[nm]),diff=m-nowMin,lead=jum?60:20,lbl=jum?'Jumu’ah':nm;
    if(diff>0&&diff<=lead){
      var key=(ST.city||'Makkah')+'|'+now.getDate()+'|'+nm;
      if(localStorage.getItem('us-remlast')===key)return;
      localStorage.setItem('us-remlast',key);
      try{new Notification('🕌 '+lbl+' in '+diff+' min ('+(ST.city||'Makkah')+')',{body:jum?'Jumu’ah — the Haram fills 1–2 hours before. Head out with wudu.':'Head out with wudu — the Haram fills early. May it be accepted.'});}catch(e){}
      toast('🔔 '+lbl+' in '+diff+' minutes');vib([60,40,60]);
      return;
    }
  }
}
setInterval(remTick,60000);

/* ════════════════════════ PRAYER TIMES ════════════════════════ */
var PT_NAMES=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
var PT_LL={Makkah:[21.4225,39.8262],Madinah:[24.4672,39.6112]};
var ptData=null,ptTimer=null,ptSrc='calc',ptFetched={},ptBusy={};
function setCity(c){ST.city=c;saveST();document.getElementById('cityMakkah').classList.toggle('on',c==='Makkah');document.getElementById('cityMadinah').classList.toggle('on',c==='Madinah');loadPT();}
function riyadhNow(){try{return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Riyadh'}));}catch(e){return new Date();}}
/* Hijri via Intl (Umm al-Qura calendar) evaluated in Makkah's zone, so it rolls at Makkah midnight */
function hijriIntl(d){try{return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'}).format(d||new Date());}catch(e){return '';}}
function hijriMonth(d){try{var p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{month:'numeric',timeZone:'Asia/Riyadh'}).formatToParts(d||new Date());for(var i=0;i<p.length;i++)if(p[i].type==='month')return parseInt(p[i].value);}catch(e){}return 0;}
/* y/m/d name a Riyadh-calendar day; noon Riyadh = 09:00 UTC keeps the Hijri lookup inside that day */
function hijriFor(y,m,d){return hijriIntl(new Date(Date.UTC(y,m,d,9)));}
function isRamadanFor(y,m,d){return hijriMonth(new Date(Date.UTC(y,m,d,9)))===9;}
function cl(v){return String(v||'').split(' ')[0];}
function ptMin(v){var p=cl(v).split(':');return (parseInt(p[0])||0)*60+(parseInt(p[1])||0);}
function minHM(m){m=((Math.round(m)%1440)+1440)%1440;return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+(m%60)).slice(-2);}
function fmtDiff(diff){var hh=Math.floor(diff/60),mm=diff%60;return (hh>0?hh+'h ':'')+mm+'m';}
function isFriday(){return riyadhNow().getDay()===5;}
function ptLabel(nm){return (nm==='Dhuhr'&&isFriday())?'Jumu’ah':nm;}
/* D-03: solar computation with Umm al-Qura parameters — Fajr 18.5°, Dhuhr = solar noon + 1 min, Asr shadow factor 1, Maghrib = sunset,
   Isha = Maghrib + 90 min (120 in Ramadan), fixed coordinates, UTC+3. Lands within ±2 min of the official table; the fetched table overrides it. */
function computePT(city,y,m,d){
  var ll=PT_LL[city]||PT_LL.Makkah,lat=ll[0],lng=ll[1],TZ=3,R=Math.PI/180;
  var sin=function(x){return Math.sin(x*R);},cos=function(x){return Math.cos(x*R);},tan=function(x){return Math.tan(x*R);},asin=function(x){return Math.asin(x)/R;},acos=function(x){return Math.acos(Math.max(-1,Math.min(1,x)))/R;},atan2=function(a,b){return Math.atan2(a,b)/R;},acot=function(x){return Math.atan(1/x)/R;};
  var fix=function(a,b){a=a-b*Math.floor(a/b);return a<0?a+b:a;};
  var Y=y,M=m+1;if(M<=2){Y-=1;M+=12;}var A=Math.floor(Y/100),B=2-A+Math.floor(A/4);
  var jd=Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(M+1))+d+B-1524.5-lng/360;
  function sun(t){var D=jd+t-2451545.0,g=fix(357.529+0.98560028*D,360),q=fix(280.459+0.98564736*D,360),L=fix(q+1.915*sin(g)+0.020*sin(2*g),360),e=23.439-0.00000036*D;var RA=fix(atan2(cos(e)*sin(L),cos(L))/15,24);return {dec:asin(sin(e)*sin(L)),eq:q/15-RA};}
  function noon(t){return fix(12-sun(t).eq,24);}
  function angleTime(ang,t,ccw){var dec=sun(t).dec,n=noon(t),v=acos((-sin(ang)-sin(dec)*sin(lat))/(cos(dec)*cos(lat)))/15;return n+(ccw?-v:v);}
  function asr(t){var dec=sun(t).dec;return angleTime(-acot(1+tan(Math.abs(lat-dec))),t,false);}
  var T={Fajr:5/24,Sunrise:6/24,Dhuhr:12/24,Asr:13/24,Maghrib:18/24};
  for(var i=0;i<2;i++){T.Fajr=angleTime(18.5,T.Fajr,true)/24;T.Sunrise=angleTime(0.833,T.Sunrise,true)/24;T.Dhuhr=noon(T.Dhuhr)/24;T.Asr=asr(T.Asr)/24;T.Maghrib=angleTime(0.833,T.Maghrib,false)/24;}
  var out={},adj=TZ-lng/15;Object.keys(T).forEach(function(k){out[k]=T[k]*24+adj;});
  out.Dhuhr+=1/60;out.Isha=out.Maghrib+(isRamadanFor(y,m,d)?120:90)/60;
  var hm=function(h){return minHM(fix(h,24)*60);};
  return {t:{Fajr:hm(out.Fajr),Dhuhr:hm(out.Dhuhr),Asr:hm(out.Asr),Maghrib:hm(out.Maghrib),Isha:hm(out.Isha)},s:hm(out.Sunrise),h:hijriFor(y,m,d),calc:true};
}
/* cache: 'City|Y-M-D' → {t,s,h} per day, '_mCity|Y-M' month markers; pruned past ~40 days */
function ptCache(){try{var c=JSON.parse(localStorage.getItem('us-ptcache')||'{}');return (c&&typeof c==='object')?c:{};}catch(e){return {};}}
function ptKeyOf(city,y,m,d){return city+'|'+y+'-'+(m+1)+'-'+d;}
function ptSaveCache(c){var cut=Date.now()-40*86400000;
  Object.keys(c).forEach(function(k){var p=((k.split('|')[1])||'').split('-'),t=k[0]==='_'?new Date(+p[0],+p[1],1).getTime():new Date(+p[0],+p[1]-1,+p[2]).getTime();if(isNaN(t)||t<cut)delete c[k];});
  try{localStorage.setItem('us-ptcache',JSON.stringify(c));}catch(e){}}
/* the exact Umm al-Qura row for a Riyadh-calendar day when cached, else the computed baseline — never null */
function ptFor(city,y,m,d){var c=ptCache(),k=ptKeyOf(city,y,m,d);return c[k]||computePT(city,y,m,d);}
function loadPT(){
  var city=ST.city||'Makkah',now=riyadhNow(),y=now.getFullYear(),m=now.getMonth(),d=now.getDate(),cache=ptCache(),ck=ptKeyOf(city,y,m,d);
  if(cache[ck]){ptData=cache[ck];ptSrc=ptFetched[ck]?'live':'cache';}else{ptData=computePT(city,y,m,d);ptSrc='calc';}
  renderPT();ptFetchMonths(city,y,m);
}
/* D-03 / D-23: once per city per month pull the whole Umm al-Qura month (this month + next, both cities) so every offline day is exact */
function ptFetchMonths(city,y,m){
  if(navigator.onLine===false||typeof fetch!=='function')return;
  var other=city==='Makkah'?'Madinah':'Makkah',n=new Date(y,m+1,1),cache=ptCache();
  var jobs=[[city,y,m],[city,n.getFullYear(),n.getMonth()],[other,y,m],[other,n.getFullYear(),n.getMonth()]].filter(function(j){var mk='_m'+j[0]+'|'+j[1]+'-'+(j[2]+1);return !cache[mk]&&!ptBusy[mk];});
  if(!jobs.length)return;
  (function run(i){if(i>=jobs.length)return;var j=jobs[i],mk='_m'+j[0]+'|'+j[1]+'-'+(j[2]+1);ptBusy[mk]=true;
    var ctrl=('AbortController' in window)?new AbortController():null;if(ctrl)setTimeout(function(){ctrl.abort();},10000);
    fetch('https://api.aladhan.com/v1/calendarByCity?city='+j[0]+'&country=Saudi%20Arabia&method=4&month='+(j[2]+1)+'&year='+j[1],ctrl?{signal:ctrl.signal}:{})
    .then(function(r){return r.json();}).then(function(res){
      var arr=Array.isArray(res.data),rows=arr?res.data:(res.data&&res.data.timings?[res.data]:[]);if(!rows.length)throw new Error('empty');
      var c=ptCache(),nn=riyadhNow();
      rows.forEach(function(r,k){var t=r.timings||{},hj=(r.date&&r.date.hijri)||{},g=(r.date&&r.date.gregorian&&r.date.gregorian.date)?r.date.gregorian.date.split('-'):null;
        var dd=g?+g[0]:nn.getDate(),mm=g?+g[1]-1:nn.getMonth(),yy=g?+g[2]:nn.getFullYear();if(!t.Fajr)return;
        var key=ptKeyOf(j[0],yy,mm,dd);c[key]={t:{Fajr:cl(t.Fajr),Dhuhr:cl(t.Dhuhr),Asr:cl(t.Asr),Maghrib:cl(t.Maghrib),Isha:cl(t.Isha)},s:cl(t.Sunrise),h:hj.day?hj.day+' '+((hj.month&&hj.month.en)||'')+' '+hj.year+' AH':''};ptFetched[key]=true;});
      if(arr)c[mk]=1;
      ptSaveCache(c);delete ptBusy[mk];
      var k0=ptKeyOf(ST.city||'Makkah',nn.getFullYear(),nn.getMonth(),nn.getDate());if(c[k0]&&(ptSrc!=='live'||JSON.stringify(ptData)!==JSON.stringify(c[k0]))){ptData=c[k0];ptSrc='live';renderPT();}
      run(i+1);
    }).catch(function(){delete ptBusy[mk];});
  })(0);
}
function ptNextOf(){
  var now=riyadhNow(),nowMin=now.getHours()*60+now.getMinutes(),name=null,min=null;
  PT_NAMES.forEach(function(nm){var m=ptMin(ptData.t[nm]);if(name===null&&m>nowMin){name=nm;min=m;}});
  if(name===null){name='Fajr';min=ptMin(ptData.t.Fajr)+1440;}
  return {name:name,min:min,diff:min-nowMin,nowMin:nowMin};
}
/* D-02 strip + panel, D-04 tickable tiles, D-07 Jumu'ah/Duha, D-22 meeting point in the Home strip */
function renderPT(){
  var g=document.getElementById('ptGrid'),nx=document.getElementById('ptNext'),hj=document.getElementById('ptHijri'),hn=document.getElementById('hNext');
  if(!ptData){if(hn){hn.innerHTML='Times unavailable · <b>tap to retry</b>';hn.onclick=function(e){e.stopPropagation();loadPT();};}return;}
  if(!g)return;
  var city=ST.city||'Makkah';
  if(hj)hj.textContent=(ptData.h||hijriIntl())+' · '+city;
  var note=document.getElementById('ptNote');if(note)note.textContent=(ptSrc==='live'?'✓ Umm al-Qura (live)':ptSrc==='cache'?'Umm al-Qura (cached)':'Computed · ±2 min · follow the adhan')+(ptData.s?' · Duha from ~'+minHM(ptMin(ptData.s)+15):'')+' · '+city+' time';
  var N=ptNextOf(),d=dailyChk[dayKey()]||{},exc=!!d._excused,fri=isFriday();
  g.innerHTML=PT_NAMES.map(function(nm){var id=nm.toLowerCase(),on=!!d[id]&&!exc;return '<div class="pt'+(on?' done':'')+(exc?' excused':'')+'" id="pt-'+nm+'" role="checkbox" tabindex="0" aria-checked="'+(on?'true':'false')+'" aria-label="'+ptLabel(nm)+' '+cl(ptData.t[nm])+(on?', prayed in congregation':', tap when prayed in congregation')+'" onclick="togDaily(\''+id+'\')"><div class="pn">'+ptLabel(nm)+'</div><div class="pv">'+cl(ptData.t[nm])+'</div></div>';}).join('');
  var el=document.getElementById('pt-'+N.name);if(el)el.classList.add('next');
  var lbl=ptLabel(N.name),tm=cl(ptData.t[N.name]),jum=fri&&N.name==='Dhuhr',friNote=jum?' <span class="ptc">· arrive early — the Haram fills 1–2 h before</span>':'';
  var pi=PT_NAMES.indexOf(N.name),prev=pi>0?PT_NAMES[pi-1]:null,miss=(prev&&!exc&&!d[prev.toLowerCase()]&&expectedDay()===ST.day)?' <span class="ptc">· '+ptLabel(prev)+' not ticked</span>':'';
  nx.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span class="ptc">· '+tm+' · '+city+'</span>'+friNote+miss;
  var meet=(ST.hotelInfo||{}).m,src=ptSrc==='calc'?' · computed ±2 min':ptSrc==='cache'?' · cached':'';
  if(hn){hn.onclick=null;if(onTrip())hn.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span>· '+tm+(meet?' · meet: '+esc(meet):'')+(jum?' · arrive early':'')+src+'</span>';
    else{var rn=riyadhNow();hn.innerHTML='<b>'+lbl+'</b> at '+tm+' <span>· '+city+' time now '+minHM(rn.getHours()*60+rn.getMinutes())+(meet?' · meet: '+esc(meet):'')+src+'</span>';}}
  updRemSw();
  var mi=document.getElementById('ptMeet');if(mi&&document.activeElement!==mi)mi.value=meet||'';var ml=document.getElementById('ptLead');if(ml)ml.value=ST.meetLead?String(ST.meetLead):'';
  if(ptTimer)clearInterval(ptTimer);
  ptTimer=setInterval(function(){if(document.getElementById('view-daily').classList.contains('on')||homeOn())renderPT_tick();},30000);
}
function renderPT_tick(){if(ptData)renderPT();}
/* D-04: the grid mirrors the salah rows the moment either is tapped */
function syncPTTiles(){var d=dailyChk[dayKey()]||{},exc=!!d._excused;PT_NAMES.forEach(function(nm){var e=document.getElementById('pt-'+nm);if(!e)return;var on=!!d[nm.toLowerCase()]&&!exc;e.classList.toggle('done',on);e.classList.toggle('excused',exc);e.setAttribute('aria-checked',on?'true':'false');});}
/* D-22: one meeting point (shared with the hotel card / lost card) and a one-tap timings message for the group */
function setMeet(v){v=(v||'').trim().slice(0,120);ST.hotelInfo=Object.assign(ST.hotelInfo||{},{m:v});saveST();var e=document.getElementById('hMeet');if(e)e.value=v;renderCntHd();renderTodayTop();renderPT_tick();if(v)toast('📍 Meeting point saved — shown on Home, the lost card and the counters');}
function setMeetLead(v){ST.meetLead=parseInt(v)||0;saveST();}
function sharePT(){if(!ptData)return;var city=ST.city||'Makkah',ex=expectedDay(),hi=ST.hotelInfo||{},lead=ST.meetLead||0,lines=[];
  lines.push('🕌 Prayer times · '+city+' · '+(ptData.h||hijriIntl())+(ST.dep?' · '+dayDateStr(ST.day):''));
  if(ex)lines.push('Day '+ex+' of '+ST.tripLen);
  PT_NAMES.forEach(function(nm){var t=cl(ptData.t[nm]);lines.push(ptLabel(nm)+' '+t+(lead?' → leave hotel '+minHM(ptMin(t)-lead):''));});
  if(hi.m)lines.push('📍 Meet: '+hi.m);
  if(isFriday())lines.push('Jumu’ah today — arrive 1–2 h early');
  lines.push((ptSrc==='calc'?'Computed times (±2 min) — follow the adhan':'Umm al-Qura times')+' · via Miqah');
  shareText('Prayer times · '+city,lines.join('\n'),APP_URL);}
/* D-23: a week of prayer alerts as .ics (TZID=Asia/Riyadh) — share sheet on phones, download elsewhere */
function icsDT(y,m,d,hm){return y+('0'+(m+1)).slice(-2)+('0'+d).slice(-2)+'T'+cl(hm).replace(':','')+'00';}
function buildICS(city,days){var now=riyadhNow(),ev=[],calc=0,stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  for(var i=0;i<days;i++){var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),P=ptFor(city,y,m,d);if(P.calc)calc++;
    PT_NAMES.forEach(function(nm){var t=cl(P.t[nm]),jum=dt.getDay()===5&&nm==='Dhuhr',lbl=jum?'Jumu’ah':nm;
      ev.push(['BEGIN:VEVENT','UID:us-'+city.toLowerCase()+'-'+icsDT(y,m,d,t)+'-'+nm.toLowerCase()+'@umrah-strivers','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Riyadh:'+icsDT(y,m,d,t),'DTEND;TZID=Asia/Riyadh:'+icsDT(y,m,d,minHM(ptMin(t)+30)),'SUMMARY:'+lbl+' — '+city,'DESCRIPTION:'+(P.calc?'Computed times (±2 min) · follow the adhan':'Umm al-Qura times')+' · Miqah','BEGIN:VALARM','TRIGGER:-PT'+(jum?'60':'20')+'M','ACTION:DISPLAY','DESCRIPTION:'+lbl+' in '+(jum?'60':'20')+' min — '+city,'END:VALARM','END:VEVENT'].join('\r\n'));});}
  return {calc:calc,n:ev.length,ics:['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Miqah//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:Asia/Riyadh','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0300','TZOFFSETTO:+0300','TZNAME:AST','END:STANDARD','END:VTIMEZONE'].join('\r\n')+'\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR\r\n'};}
function exportICS(){var city=ST.city||'Makkah',B=buildICS(city,7),name='prayer-times-'+city.toLowerCase()+'-week.ics',blob=new Blob([B.ics],{type:'text/calendar'});
  var s=document.getElementById('icsSub');if(s)s.textContent='7 days · '+city+' · '+(B.calc?B.calc+' day'+(B.calc===1?'':'s')+' computed (±2 min), the rest Umm al-Qura':'Umm al-Qura times')+' · 20-min alert (60 for Jumu’ah)';
  var file=null;try{file=new File([blob],name,{type:'text/calendar'});}catch(e){}
  var dl=function(){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);toast('📅 '+B.n+' prayer alerts saved — open the .ics file to add them to your calendar',true);};
  if(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Prayer times · '+city}).then(function(){toast('📅 Sent — open it in Calendar to add the alerts',true);}).catch(function(err){if(err&&err.name==='AbortError')return;dl();});
  else dl();
}

/* ════════════════════════ TASBIH ════════════════════════ */
var TB_PHRASES=['SubhanAllah','Alhamdulillah','Allahu Akbar','La ilaha illallah','Astaghfirullah','Salawat ﷺ'];
var TB_AR=['سُبْحَانَ اللهِ','الْحَمْدُ لِلهِ','اللهُ أَكْبَرُ','لَا إِلَهَ إِلَّا اللهُ','أَسْتَغْفِرُ اللهَ','اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ'];
/* D-06: the two ×100 phrases keep their own target and tick their checklist row at 100 */
var TB_LONG={4:'istighfar',5:'salawat'};
/* D-14: pickable targets; 0 = no target (∞) */
var TB_TARGETS=[33,34,100,1000,0];
var tbPhrase=0,tbCount=0,tbTargetN=33;
var tasbihP={};try{tasbihP=JSON.parse(localStorage.getItem('us-tasbih-p')||'{}');}catch(e){}
function tbDefault(i){return TB_LONG[i]?100:33;}
function tbTarget(){return tbTargetN;}
/* the live cycle survives a reload — stored beside the day totals under a non-day key (us-tasbih._cur) */
function tbPersist(){tasbih._cur={p:tbPhrase,c:tbCount,t:tbTargetN};save('us-tasbih',tasbih);}
function tbRestore(){var c=tasbih._cur;if(c&&typeof c==='object'){tbPhrase=TB_PHRASES[c.p]?c.p:0;tbCount=Math.max(0,parseInt(c.c,10)||0);tbTargetN=TB_TARGETS.indexOf(c.t)>-1?c.t:tbDefault(tbPhrase);}else tbTargetN=tbDefault(tbPhrase);}
/* total dhikr counted on the trip — only the day keys, never the _cur record */
function tbTotal(){var n=0;Object.keys(tasbih).forEach(function(k){if(k[0]==='d'&&typeof tasbih[k]==='number')n+=tasbih[k];});return n;}
function renderTB(){
  var c=document.getElementById('tbChips');if(!c)return;
  var h='';TB_PHRASES.forEach(function(ph,i){h+='<button class="tb-chip'+(i===tbPhrase?' on':'')+'" aria-pressed="'+(i===tbPhrase?'true':'false')+'" onclick="tbSet('+i+')">'+ph+'</button>';});
  c.innerHTML=h;
  var tg=document.getElementById('tbTargets');if(tg)tg.innerHTML=TB_TARGETS.map(function(t){return '<button class="tb-tg'+(t===tbTargetN?' on':'')+'" role="radio" aria-checked="'+(t===tbTargetN?'true':'false')+'" aria-label="Target '+(t||'unlimited')+'" onclick="tbSetTarget('+t+')">'+(t||'∞')+'</button>';}).join('');
  document.getElementById('tbN').textContent=tbCount;
  var of=document.getElementById('tbOf');if(of)of.innerHTML=!tbTargetN?'<span id="tbTarget">∞</span> · tap':tbCount>tbTargetN?'<span id="tbTarget">'+tbTargetN+'</span> done · keep going':'of <span id="tbTarget">'+tbTargetN+'</span> · tap';
  document.getElementById('tbToday').textContent=tasbih[dayKey()]||0;
  var pe=document.getElementById('tbPhraseN'),pp=(tasbihP[dayKey()]||{})[tbPhrase]||0;if(pe)pe.textContent='· '+TB_PHRASES[tbPhrase]+' '+pp+(TB_LONG[tbPhrase]?'/100':'');
  var f=document.getElementById('focus');if(focusKey==='tasbih'&&f&&f.classList.contains('on'))renderFocusTB();
}
/* picking a phrase keeps a deliberate 1000/∞ target; 33/34/100 follow the phrase */
function tbSet(i){tbPhrase=i;tbCount=0;if(tbTargetN!==1000&&tbTargetN!==0)tbTargetN=tbDefault(i);tbPersist();renderTB();vib(6);}
function tbSetTarget(t){tbTargetN=t;tbPersist();renderTB();vib(6);}
function tbTap(){
  var k=dayKey(),ph=tbPhrase,long=TB_LONG[ph],T=tbTargetN;
  tbCount++;tasbih[k]=(tasbih[k]||0)+1;
  var P=tasbihP[k]||{};P[ph]=(P[ph]||0)+1;tasbihP[k]=P;save('us-tasbih-p',tasbihP);
  if(T&&tbCount===T){
    vib([40,60,100]);
    /* the post-salah chain only: SubhanAllah 33 → Alhamdulillah 33 → Allahu Akbar 34 → stop; anything else keeps counting */
    if((T===33||T===34)&&ph<3){
      if(ph===2){tbCount=0;toast('✨ Post-salah tasbih complete — 33 · 33 · 34, alhamdulillah',true);}
      else{tbCount=0;tbPhrase=ph+1;tbTargetN=tbPhrase===2?34:33;toast('✨ '+TB_PHRASES[ph]+' ×'+T+' — now '+TB_PHRASES[tbPhrase]+(tbPhrase===2?' ×34':''));}
    }else toast('✨ '+TB_PHRASES[ph]+' ×'+T+' complete — keep going');
  }else vib(12);
  tbPersist();
  var d=dailyChk[k]||{},changed=false;
  if(long&&P[ph]>=100&&!d[long]){d[long]=true;changed=true;toast('📿 '+TB_PHRASES[ph]+' ×100 today — checklist ticked!');}
  if((tasbih[k]||0)>=100&&!d.dhikr100){d.dhikr100=true;changed=true;toast('📿 100 dhikr today — checklist updated!');}
  if(changed){dailyChk[k]=d;save('us-daily',dailyChk);updDaily();updStats();chkBadges();}
  renderTB();
}
/* D-15: one back for a mis-tap — the day and phrase totals follow */
function tbUndo(){if(tbCount<=0){vib(6);return;}var k=dayKey(),ph=tbPhrase;tbCount--;tasbih[k]=Math.max(0,(tasbih[k]||0)-1);var P=tasbihP[k]||{};if(P[ph])P[ph]=Math.max(0,P[ph]-1);tasbihP[k]=P;save('us-tasbih-p',tasbihP);tbPersist();renderTB();vib(6);}
function tbReset(){tbCount=0;tbPersist();renderTB();}
/* ════════════════════════ QIBLA ════════════════════════ */
var KAABA={lat:21.4225,lng:39.8262};
var qbBearing=null,qbActive=false,qbEvt=null;
function qbCalc(lat,lng){
  var φ1=lat*Math.PI/180,φ2=KAABA.lat*Math.PI/180,Δλ=(KAABA.lng-lng)*Math.PI/180;
  var y=Math.sin(Δλ)*Math.cos(φ2);
  var x=Math.cos(φ1)*Math.sin(φ2)-Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
function qbSetNeedle(deg){var n=document.getElementById('qbNeedle');if(n)n.style.transform='translate(-50%,-100%) rotate('+deg+'deg)';}
/* D-16: one module-level listener; it idles until a bearing exists */
function qbOri(e){
  var heading=null;
  if(typeof e.webkitCompassHeading==='number')heading=e.webkitCompassHeading;
  else if(typeof e.alpha==='number'&&(e.absolute||e.type==='deviceorientationabsolute'))heading=360-e.alpha;
  if(heading===null||qbBearing===null)return;
  qbSetNeedle(qbBearing-heading);
  var st=document.getElementById('qbStatus');if(st&&!st.getAttribute('data-live')){st.setAttribute('data-live','1');st.textContent='Hold the phone flat, away from metal, and rotate until the 🕋 points up';}
}
function qbListen(){if(qbEvt||typeof DeviceOrientationEvent==='undefined')return;qbEvt=('ondeviceorientationabsolute' in window)?'deviceorientationabsolute':'deviceorientation';window.addEventListener(qbEvt,qbOri);}
function qbUnlisten(){if(qbEvt){window.removeEventListener(qbEvt,qbOri);qbEvt=null;}}
function qbBtnUpd(){var b=document.getElementById('qbBtn');if(!b)return;b.innerHTML=qbActive?'■ Stop compass':markify('🧭 Start compass');b.classList.toggle('on',qbActive);b.setAttribute('aria-pressed',qbActive?'true':'false');}
function stopQibla(quiet){qbUnlisten();qbActive=false;qbBtnUpd();var st=document.getElementById('qbStatus');if(st){st.removeAttribute('data-live');if(!quiet)st.textContent=qbBearing!==null?'Compass stopped — qibla is '+qbBearing+'° from North.':'Tap start and allow location & motion access.';}}
/* leaving Daily › Tools releases the sensors */
function qbAutoStop(){if(!qbActive)return;var v=document.getElementById('view-daily'),su=document.getElementById('sub-daily-tools');if(!v||!v.classList.contains('on')||!su||!su.classList.contains('on'))stopQibla(true);}
function qbSetBearing(b,note,motion){qbBearing=Math.round(b);document.getElementById('qbDeg').textContent=qbBearing+'°';qbSetNeedle(qbBearing);var st=document.getElementById('qbStatus'),fb=document.getElementById('qbFallback');if(fb)fb.innerHTML='';if(!st)return;st.removeAttribute('data-live');
  st.innerHTML=(note||'')+'Qibla is <b>'+qbBearing+'°</b> from North. '+(motion===false?'No compass access — face North yourself (a map app helps), then turn '+qbBearing+'° clockwise.':'Hold the phone flat, away from metal, and rotate until the 🕋 points up.');}
function qbUseMadinah(){qbSetBearing(176,'Madinah (approx.) · ',qbEvt?true:false);}
function startQibla(){
  var st=document.getElementById('qbStatus'),fb=document.getElementById('qbFallback');
  if(qbActive){stopQibla();return;}
  qbActive=true;qbBtnUpd();if(fb)fb.innerHTML='';
  /* iOS grants motion access only inside the tap — ask first, synchronously, then locate */
  var perm=(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')?DeviceOrientationEvent.requestPermission().catch(function(){return 'denied';}):Promise.resolve('granted');
  qbListen();
  st.textContent='Locating…';
  perm.then(function(p){
    if(!qbActive)return;
    var motion=p==='granted'&&!!qbEvt;
    if(!motion)qbUnlisten();
    function fail(){
      qbBearing=null;
      if(ST.city==='Madinah'){st.textContent='Location unavailable.';if(fb)fb.innerHTML='<button class="chip-btn" onclick="qbUseMadinah()">Use Madinah (approx. 176°)</button>';}
      else st.textContent='Location unavailable. In Makkah the direction changes street to street — use the qibla sticker on the hotel ceiling, or allow location in your browser settings and retry.';
    }
    if(!navigator.geolocation){fail();return;}
    navigator.geolocation.getCurrentPosition(function(pos){if(!qbActive)return;qbSetBearing(qbCalc(pos.coords.latitude,pos.coords.longitude),'',motion);},fail,{timeout:12000,maximumAge:600000});
  });
}

/* ════════════════════════ PWA INSTALL + SW ════════════════════════ */
var deferPrompt=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferPrompt=e;var r=document.getElementById('installRow');if(r)r.style.display='flex';});
function installApp(){if(deferPrompt){deferPrompt.prompt();deferPrompt=null;var r=document.getElementById('installRow');if(r)r.style.display='none';}}

var swReg=null,swWaiting=null,swReloading=false;
function showUpdate(w){swWaiting=w;var c=document.getElementById('updChip');if(c&&!sessionStorage.getItem('us-upd-dismiss'))c.hidden=false;}
function dismissUpdate(){var c=document.getElementById('updChip');if(c)c.hidden=true;try{sessionStorage.setItem('us-upd-dismiss','1');}catch(e){}}
function applyUpdate(){var c=document.getElementById('updChip');if(c)c.hidden=true;if(swWaiting){swReloading=true;swWaiting.postMessage({type:'SKIP_WAITING'});setTimeout(function(){location.reload();},1500);}else location.reload();}
function checkUpdates(){
  if(!swReg){toast(location.protocol==='https:'?'Checking… open the app again in a moment':'Updates arrive automatically when opened from umrah-strivers.vercel.app');return;}
  toast('Checking for updates…');
  swReg.update().then(function(){setTimeout(function(){if(swReg.waiting){showUpdate(swReg.waiting);toast('⬆️ Update ready — tap the chip to reload',true);}else if(swReg.installing)toast('⬆️ Update found — installing…');else toast('✅ You have the latest version (v'+APP_VERSION+')');},800);}).catch(function(){toast('Could not check — are you online?');});
}
function registerSW(){
  if(!('serviceWorker' in navigator)||location.protocol!=='https:')return;
  navigator.serviceWorker.register('sw.js').then(function(reg){
    swReg=reg;
    if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
    reg.addEventListener('updatefound',function(){var nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',function(){if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdate(nw);});});
  }).catch(function(){});
  navigator.serviceWorker.addEventListener('controllerchange',function(){if(swReloading){swReloading=false;location.reload();}});
}

/* ════════════════════════ INIT ════════════════════════ */
function initUI(){
  fillMarks();applyTheme();applyText();updSwipeSw();applyJourney();
  document.querySelectorAll('#verLbl,#verLbl2').forEach(function(e){e.textContent=APP_VERSION;});
  document.getElementById('quoteLine').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('tripLen').value=ST.tripLen;
  var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';
  renderPlan();renderRites();renderDaily();placesBoot();renderPlaces();renderDuas();tbRestore();renderTB();
  buildDeck();renderFC();renderPost();updRemSw();applySubs();updChip();renderItin();renderVault();renderDuaSec();renderWater();updToolsOrder();updHotelLbl();loadHotelInfo();loadNiyyah();updKidsSw();applyProfile();renderCntHd();renderJourneys();
  if(!ST.onboarded&&!pendingGroup)setTimeout(function(){showOnboard(linkJourney==='hajj'?'hajj':undefined);},400);
  kidsBestLbl();renderStories();
  var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');
  if(cm){cm.classList.toggle('on',(ST.city||'Makkah')==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  renderKidNames();
  updPlan();updRites();updDaily();updPlaces();updStats();renderBadges();
  syncDay();
  /* H-04: an interrupted count (started < 4 h ago) reopens straight into the big counter; on trip the last tab is restored */
  var act=activeCount(),lg0=ST.log||{},fresh=act&&lg0[act+'Start']&&Date.now()-lg0[act+'Start']<4*3600000;
  if(linkGo){var g=GO_TARGETS[linkGo];goTab(g[0],g[1]||undefined);
    if(linkGo==='count'&&fresh)enterFocus(act);return;}
  if(fresh){goTab('umrah');goSub('umrah','count',true);enterFocus(act);}
  else if(onTrip()&&ST.tab&&ST.tab!=='home'&&document.getElementById('view-'+ST.tab))goTab(ST.tab);
  else if(depLinked)goTab('plan','prep');
  else goTab('home');
}
/* Places: the sticky filter row is see-through until it sticks, so the hero's shadow and halo never end in a hard edge */
document.addEventListener('DOMContentLoaded',function(){var s=document.querySelector('.pl-sent'),row=document.querySelector('.pills.pl-sticky');if(!s||!row||!window.IntersectionObserver)return;row.classList.add('io');
  new IntersectionObserver(function(e){row.classList.toggle('stuck',!e[e.length-1].isIntersecting);},{rootMargin:'-57px 0px 0px 0px'}).observe(s);});
document.addEventListener('DOMContentLoaded',function(){loadAll();pendingGroup=parseGroupLink();applyDepLink();parseGoLink();initUI();if(pendingGroup)setTimeout(function(){showGroupSheet(pendingGroup);},350);else if(pendingDep)setTimeout(depLinkSheet,350);registerSW();});

/* ════════ chrome typography pass (6.1 "Disciplined" type system) ════════
   Chrome strings (buttons, chips, labels, list rows) render their emoji as stroke marks (or drop them) and their
   ▶ ◀ ▾ ✕ ⛶ ＋ → glyphs as stroke chevrons — content strings are untouched. ﷺ is set in Scheherazade New; straight quotes curl. */
var CHROME_SEL='button,a,.res .i,.btn,.chip-btn,.lnk,.pill,.xchip,.chip,label,.acc-h,.res .g,.focus-top,.lost-kv>span,.it-t,.it-d,.todayit,.ti-t,.tli-t,.hcta,.sec-chev,.qa,.hn-all,.tli-more,.stage-cta,.app-go,.place-a,.say,.why,.whyb,.cd2-r label,.dua .enl,.fchips span,.hp-go,.stage-go,.rarr,.lg-t,.tour-h,.kr-t,.daynav,.hcard,.trust span,.ob-x,.iconbtn,.tb-chip,.tb-tg,.meetchip,.stopchip,.distchip,.ptag,.nowtag,.tli-when,.pillmini,.prio,.ph-hd,.pt-next,.dtools,.rd-foot,.hs-t span,.go,.hp-t div span,.kn,.stk-h,.apps-h,.tli-h,.subt,.niy-c,.sheet .opt small,.kd-h,.wk-why,.place-ico,.st .l,.rtile small,.tour-note,.pl-near,.hotelrow span,.hleg span,.co-i,.app-i,#cdW,#hotelLbl2,.hs-r,.ring-wrap';
var GLYPH_MK={'↻':'refresh','✓':'check','✔':'check','▶':'chevr','►':'chevr','◀':'chevl','◄':'chevl','←':'chevl','▾':'chevd','▼':'chevd','▴':'chevu','▲':'chevu','✕':'close','✖':'close','×':'close','⛶':'expand','＋':'plus','↗':'ext','→':'arrow','↺':'refresh','↔':'lr'};
var CHROME_RE=/(?:[⌚⌛⏩-⏺☀-✒✔-➿⬆⬇⬛⬜⭐]|[\ud83c-\ud83e][\udc00-\udfff])(?:[️‍]|[\ud83c-\ud83e][\udc00-\udfff]|[☀-➿])*|[↻↺↔✓✔▶►◀◄←▾▼▴▲✕✖⛶＋↗→]/g;
function chromeText(tn){
  var el=tn.parentElement;if(!el||el.closest('.ar,[lang="ar"],script,style,textarea,svg'))return;
  var v=tn.nodeValue;
  if(v.indexOf('"')>=0)curlBlock(el);v=tn.nodeValue;
  if(v.indexOf('ﷺ')>=0){var f=document.createDocumentFragment(),parts=[];v.split('ﷺ').forEach(function(p,i){if(i){var sp=document.createElement('span');sp.className='ty-saw';sp.lang='ar';sp.textContent='ﷺ';f.appendChild(sp);}var t=document.createTextNode(p);parts.push(t);f.appendChild(t);});tn.parentNode.replaceChild(f,tn);parts.forEach(function(t){if(t.nodeValue)chromeText(t);});return;}
  if(el.classList.contains('place-ico')){var m0=v.trim();if(m0){el.innerHTML=mk(emk(m0,'pin'));}return;}
  var t0=v.trim();if(t0==='›'||t0==='‹'){tn.parentNode.replaceChild(document.createRange().createContextualFragment(mk(t0==='›'?'chevr':'chevl','ty-g ty-solo')),tn);return;}
  var host=el.closest(CHROME_SEL);if(!host&&(GLYPH_MK[t0]||/^\s*[✓↻↺]/.test(v)||/\s→\s*$/.test(v))&&!el.closest('p,.note,.acc-b'))host=el;if(!host){tn=contentEmoji(tn);if(tn)copyGlyphs(tn);return;}
  CHROME_RE.lastIndex=0;if(!CHROME_RE.test(v))return;CHROME_RE.lastIndex=0;
  var BTN=host.matches('button,.btn,.chip-btn,.pill,.chip,.xchip,.lnk,a');var row=BTN?host:(host.closest('.todayit,.it,.tli,.acc-h,.lost-kv,.tc-h,.place-h,.res')||host);var out='',last=0,m,used=row.getAttribute('data-ty')==='1'||!!row.querySelector('svg.mk:not(.ty-g)');
  while((m=CHROME_RE.exec(v))){var g=m[0],name=GLYPH_MK[g]||'';
    var pre=v.slice(last,m.index);out+=escT(pre);last=m.index+g.length;
    if(name){var lead=/^\s*$/.test(out+pre),trail=!lead&&/^\s*$/.test(v.slice(last));out+=mk(name,'ty-g ty-'+name+(lead?' ty-lead':trail?' ty-trail':''));if(lead&&v.charAt(last)===' ')last++;if(trail)out=out.replace(/\s+(<svg[^>]*ty-trail[^>]*>[\s\S]*<\/svg>)$/,'$1');if(trail&&inFlow(el))out=out.replace(/([^\s<>]+)(<svg[^>]*ty-trail[^>]*>[\s\S]*?<\/svg>)$/,'<span class="ty-nw">$1$2</span>');continue;}
    var en=emk(g);if(en&&!used){out+=mk(en,'mkt');used=true;}
    if(v.slice(last,last+1)===' '&&!out.length)last++;}
  out+=escT(v.slice(last));
  row.setAttribute('data-ty','1');
  var tp=document.createElement('template');tp.innerHTML=out.replace(/^\s+/,'');tn.parentNode.replaceChild(tp.content,tn);
}
/* content copy (notes, answers, stories, quiz text): no colour emoji. An emoji that opens its block becomes its stroke mark;
   any other is dropped with the space before it. Returns the text node that replaces tn (or tn). */
function contentEmoji(tn){var v=tn.nodeValue;EMO_RE.lastIndex=0;if(!EMO_RE.test(v))return tn;
  var el=tn.parentElement;if(!el||el.closest('input,textarea,select,option,title,.ar,[lang="ar"],svg,script,style'))return tn;
  EMO_RE.lastIndex=0;var m=EMO_RE.exec(v),lead='';if(m&&!v.slice(0,m.index).trim()&&atBlockStart(tn))lead=emk(m[0]);
  EMO_RE.lastIndex=0;var nv=v.replace(EMO_RE,'\u0001').replace(/(\s*)\u0001+(\s*)/g,function(s,a,b,off,str){if(!str.slice(0,off).trim())return a&&!atBlockStart(tn)?' ':'';return (a||b)?' ':'';});
  var nt=document.createTextNode(nv);tn.parentNode.replaceChild(nt,tn);
  if(lead){var tp=document.createElement('template');tp.innerHTML=mk(lead,'mkt');nt.parentNode.insertBefore(tp.content,nt);}
  return nv?nt:null;}
function atBlockStart(tn){var n=tn;for(var up=0;n&&up<6;up++){var p=n.previousSibling;while(p){if(p.nodeType===1&&(p.tagName==='svg'||p.tagName==='IMG'))return false;if((p.textContent||'').trim())return false;p=p.previousSibling;}n=n.parentNode;if(!n||n.nodeType!==1)return true;var d='';try{d=getComputedStyle(n).display;}catch(e){}if(d&&d!=='inline')return true;}return true;}
/* a trailing mark is tied to its last word only in inline flow (in a flex box the tie span would swallow the space before it) */
function inFlow(el){try{return !/flex|grid/.test(getComputedStyle(el).display);}catch(e){return true;}}
/* in copy (paragraphs, notes, meta lines) → ✓ ↺ ↻ ↔ would fall back to a system font: each becomes its stroke mark, in place */
var COPY_RE=/[→✓✔↺↻↔]/g;
function copyGlyphs(tn){var el=tn.parentElement;if(!el||el.closest('input,textarea,select,option,title,.ar,[lang="ar"],svg,script,style'))return;var v=tn.nodeValue;COPY_RE.lastIndex=0;if(!COPY_RE.test(v))return;COPY_RE.lastIndex=0;
  var out='',last=0,m;while((m=COPY_RE.exec(v))){var g=m[0],pre=v.slice(last,m.index),lead=!out&&/^\s*$/.test(pre),trail=/^\s*$/.test(v.slice(m.index+1));out+=escT(lead?'':pre);out+=mk(GLYPH_MK[g]||'check','ty-g ty-'+(GLYPH_MK[g]||'check')+(lead?' ty-lead':trail?' ty-trail':' ty-mid'));last=m.index+1;if(lead&&v.charAt(last)===' ')last++;}
  out+=escT(v.slice(last));if(/ty-trail[^>]*>[\s\S]*<\/svg>$/.test(out))out=out.replace(/\s+(<svg[^>]*ty-trail[^>]*>[\s\S]*?<\/svg>)$/,'$1');if(inFlow(el))out=out.replace(/([^\s<>]+)(<svg[^>]*ty-trail[^>]*>[\s\S]*?<\/svg>)$/,'<span class="ty-nw">$1$2</span>');
  var tp=document.createElement('template');tp.innerHTML=out;tn.parentNode.replaceChild(tp.content,tn);}
/* straight quotes → curly, paired across the whole block (a quote may span a ﷺ or a link) */
function curlBlock(el){var bl=el.closest('p,li,.note,.tr,.vh,.acc-b,.card,div')||el;if(bl.closest('input,textarea,code,pre'))return;var all=bl.textContent;if((all.match(/"/g)||[]).length%2)return;
  var tw=document.createTreeWalker(bl,NodeFilter.SHOW_TEXT),n,open=false;while((n=tw.nextNode())){if(n.nodeValue.indexOf('"')<0)continue;n.nodeValue=n.nodeValue.replace(/"/g,function(){open=!open;return open?'“':'”';});}}
function stripPh(root){(root.querySelectorAll?root:document).querySelectorAll('[placeholder]').forEach(function(e){var p=e.getAttribute('placeholder');if(p&&EMOJI_RE.test(p))e.setAttribute('placeholder',stripEmoji(p));});}
function escT(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function chromeGlyphs(root){if(!root)return;if(root.nodeType===3){chromeText(root);return;}if(root.nodeType!==1)return;
  stripPh(root);var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),a=[],n;while((n=tw.nextNode()))if(n.nodeValue&&/[^\x00-\x7F]|"/.test(n.nodeValue))a.push(n);a.forEach(chromeText);tieAll(root);}
/* typographic ties: a number stays with its noun ("0 of 5 steps", "30 days", "Hajj 1448 ·"), a separator stays on the line
   it closes, and a short last word never drops to a line of its own. Tied runs are wrapped in nowrap spans, so the text
   (and textContent) is unchanged. Only titles, hero lines and short instruction copy are touched. */
var TIE_SEL='.fd-k,.focus-hint,.df-hint,.ptc,#hNext span,.tli-t small,.row-t .x,h1,h2,h3,h4,.hero-t .v,.hero-t .s,.hs-t b,.hs-t>span,.hs-t small,.hcta,.tip-a,.tip-r,.lost-en,.tli-t,.hday-h b,.stage-h b,.stage-h small,.rite-done>b,.vh p,.focus-of,.cnt .sub,.cd2-r>span,.ob-hint,small,p';
var TIE_W=/^(?:Hajj|Umrah|Day|day|Step|step|Round|round|Level|level|Part|Lap|lap|Q)$/;
function tieAll(root){if(!root)return;if(root.nodeType===3)root=root.parentElement;if(!root||!root.closest)return;var els=[],c=root.closest(TIE_SEL);if(c)els.push(c);if(root.querySelectorAll)els=els.concat([].slice.call(root.querySelectorAll(TIE_SEL)));
  els.forEach(function(el){var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),a=[],n,last=null;while((n=tw.nextNode())){if(n.nodeValue.trim())last=n;if(/ \S/.test(n.nodeValue))a.push(n);}a.forEach(function(t){tieNode(t,t===last);});});}
function tieNode(tn,isLast){var p=tn.parentElement;if(!p||p.closest('.ty-nw,.ar,[lang="ar"],input,textarea,svg,script,style'))return;
  var w=tn.nodeValue.split(' '),N=w.length;if(N<2)return;var tie=[],any=false,i,a,b;
  for(i=1;i<N;i++){a=w[i-1];b=w[i];var t=false;
    if(a&&b&&/\d[%+]?[,.:;]?$/.test(a)&&/^[\w%’'\/]{1,8}[.,;:)?!]?$/.test(b))t=true;           // 30 days · 5 steps · 1448 AH · 0 of
    else if((a==='of'||a==='/')&&/^\d/.test(b))t=true;                                              // of 5 · / 10
    else if(a&&(b==='—'||b==='–'))t=true;                                                             // word — (a dash closes its line)
    else if(a==='·'&&b)t=true;                                                                        // · next (a dot never ends a line)
    else if(TIE_W.test(a)&&/^\d/.test(b))t=true;                                                     // Hajj 1448 · Step 3 · Day 2
    else if(/^(?:Dhul|Dhu|Rabi|Rabi’|Jumada)$/.test(a)&&b)t=true;
    else if(/^(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)$/.test(a)&&/^\d{4}\b/.test(b))t=true; // 15 May 2027                                    // Dhul Hijjah · Rabi’ al-Awwal (a month name never splits)
    else if(/^(?:I|II)$/.test(b)&&/^[A-Z][a-z]+$/.test(a)||/^(?:I|II)$/.test(a)&&/^\d/.test(b))t=true; // Jumada I 26
    else if(isLast&&i===N-1&&a&&a!=='·'&&a!=='—'&&/^\S{1,7}$/.test(b)&&N>3)t=true;                   // no lone last word
    tie[i]=t;if(t)any=true;}
  if(!any)return;var f=document.createDocumentFragment(),run=[w[0]],txt='';
  function flush(){if(run.length>1){if(txt){f.appendChild(document.createTextNode(txt));txt='';}var sp=document.createElement('span');sp.className='ty-nw';if(run[0]==='·'){var dt=document.createElement('span');dt.className='ty-dot';dt.textContent='· ';sp.appendChild(dt);sp.appendChild(document.createTextNode(run.slice(1).join(' ')));sepFix();}else sp.textContent=run.join(' ');f.appendChild(sp);}else txt+=run[0];}
  for(i=1;i<N;i++){if(tie[i])run.push(w[i]);else{flush();txt+=' ';run=[w[i]];}}flush();if(txt)f.appendChild(document.createTextNode(txt));
  tn.parentNode.replaceChild(f,tn);}
/* a separator never starts a line: when a "· next" run wraps, its dot is hidden (re-measured after every layout change) */
var sepQ=0;
function sepFix(){if(sepQ)return;sepQ=(window.requestAnimationFrame||setTimeout)(function(){sepQ=0;var ds=[].slice.call(document.querySelectorAll('.ty-dot')),hit=[];
  ds.forEach(function(d){d.classList.remove('ty-sol','ty-br');});
  ds.forEach(function(d){if(!d.getClientRects().length)return;var r=d.getBoundingClientRect(),pr=prevRect(d.parentNode);if(pr&&r.top>pr.top+pr.height*.5)hit.push(d);});
  /* hiding a dot narrows its run: if the run would then fit back on the line above, the dot becomes a hard break instead */
  hit.forEach(function(d){d.classList.add('ty-sol');var w=d.parentNode,wr=w.getClientRects()[0],pr=prevRect(w);if(!wr||!pr||wr.top<=pr.top+pr.height*.5){d.classList.remove('ty-sol');d.classList.add('ty-br');}});});}
function prevRect(n){for(var up=0;n&&up<3;up++){var p=n.previousSibling;while(p){if(p.nodeType===3&&p.nodeValue.trim()){var rg=document.createRange();rg.selectNodeContents(p);var rs=rg.getClientRects();if(rs.length)return rs[rs.length-1];}else if(p.nodeType===1){var es=p.getClientRects();if(es.length)return es[es.length-1];}p=p.previousSibling;}n=n.parentNode;if(!n||n.nodeType!==1||/^(P|DIV|LI|H\d|B|BUTTON)$/.test(n.tagName)&&getComputedStyle(n).display!=='inline')return null;}return null;}
if(window.ResizeObserver)try{new ResizeObserver(sepFix).observe(document.documentElement);}catch(e){}
window.addEventListener('resize',sepFix);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sepFix);
(function(){var busy=false;function run(muts){if(busy)return;busy=true;try{muts.forEach(function(m){if(m.type==='characterData'){chromeText(m.target);tieAll(m.target);}else m.addedNodes.forEach(chromeGlyphs);});}catch(e){}busy=false;}
  function start(){chromeGlyphs(document.body);new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,0);});else start();})();
/* canvas exporters wait for their webfonts (no Georgia/Arial flash on the keepsake, certificate or progress card) */
['makeKeepsake','makeHajjKeepsake','shareCard','makeCertGo'].forEach(function(n){var f=window[n];if(typeof f!=='function')return;window[n]=function(){var a=arguments,s=this;kFonts(function(){f.apply(s,a);});};});
