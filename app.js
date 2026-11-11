/* Miqah — application logic */
/* Release note: bump APP_VERSION here AND in sw.js for every release (the SW cache name is derived from it). */
var APP_VERSION='6.10.0';
var APP_URL='https://umrah-strivers.vercel.app/';
/* prefers-reduced-motion: JS motion (confetti, the % count-up, smooth scrolling) honours it like the CSS does */
var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
function smooth(){return RM.matches?'auto':'smooth';}
/* ════════════════════════ MARKS ════════════════════════ */
/* Marks: one small inline-SVG set (24x24, 1.5px stroke, currentColor) drawn in the line style of the Kaaba mark.
   Heroes, segment labels, stage cards, card titles, counter titles, the journey chip and the onboarding rows carry these instead of emoji;
   content rows (checklist items, places, FAQ, toasts) keep their emoji. Colour comes from context: lavender on aubergine, --brand-2 on paper (see .mk in index.html). */
var MARKS={
  out:'<path d="M8 16 16 8"/><path d="M9.5 8H16v6.5"/>',
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
  clip:'<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9 4.5V3.5h6v1"/><path d="M9 10h6M9 13.5h6M9 17h3.5"/>',
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
    /* 6.7 (G3 #22): in Hajj mode flights and hotels are one row — a pilgrim who had ticked both keeps them ticked */
    if(planChk.flights&&planChk.hotels&&planChk.hajjtravel===undefined)planChk.hajjtravel=true;
    /* 6.9 (G3 review): the "learned the rites" row has a Hajj wording of its own — a tick made in Hajj mode carries over once */
    if(planChk.learn&&planChk.learnh===undefined&&ST.journey==='hajj')planChk.learnh=true;
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
  /* a toast that carries an action has 44px buttons, a dismiss, and is never pushed out by a plain toast */
  if(actLabel){var b=document.createElement('button');b.textContent=actLabel;b.onclick=function(){t.remove();if(actFn)actFn();};t.appendChild(b);var x=document.createElement('button');x.className='toast-x';x.setAttribute('aria-label','Dismiss');x.textContent='✕';x.onclick=function(){t.remove();};t.appendChild(x);
    [].slice.call(c.querySelectorAll('.toast.act')).forEach(function(o){if(o.getAttribute('data-m')===tm)o.remove();});t.setAttribute('data-m',tm);
    var acts=[].slice.call(c.querySelectorAll('.toast.act'));while(acts.length>=2)acts.shift().remove();}
  var plain=[].slice.call(c.children).filter(function(o){return !o.classList.contains('act');});while(plain.length&&c.children.length>=3)plain.shift().remove();
  /* an action toast stays 12 s (the one irreversible case, a restored backup, never relies on a toast — see bkUndoOffer) and waits while it is touched or focused */
  c.appendChild(t);if(!actLabel){setTimeout(function(){t.remove();},3200);return;}
  var left=12000,tick=setInterval(function(){if(!t.parentNode){clearInterval(tick);return;}if(t.matches(':hover')||t.contains(document.activeElement))return;left-=500;if(left<=0){clearInterval(tick);t.remove();}},500);}
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
/* 6.7 (G3 #23): the journey's word, and a static block that has a Hajj wording — the Umrah HTML is kept byte-for-byte in data-u and restored */
function jw(){return journey()==='hajj'?'Hajj':'Umrah';}
function jSwap(id,hajjHTML){var e=document.getElementById(id);if(!e)return;if(e.getAttribute('data-u')===null)e.setAttribute('data-u',e.innerHTML);e.innerHTML=journey()==='hajj'?hajjHTML:e.getAttribute('data-u');}
function artN(n){return /^(8|11|18|8\d)$/.test(String(n))?'an':'a';}
function hajjType(){return (typeof HAJJ_TYPES!=='undefined'&&HAJJ_TYPES[ST.hajjType])?ST.hajjType:'tamattu';}
function forMe(it){return (!it.who||!ST.profile||it.who===ST.profile)&&(!it.j||it.j===journey())&&(!it.ht||it.ht.indexOf(hajjType())>-1)&&(!it.ram||ramTrip());}
function setProfile(v){ST.profile=v||'';saveST();applyProfile();renderPlan();updPlan();renderRites();updRites();vib(8);}
function applyProfile(){document.querySelectorAll('#profSeg button,#obProf button,#obProf2 button,#obProf3 button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-p')||'')===(ST.profile||''));});}
function profSegHTML(id){return '<div class="segmini" id="'+id+'"><button data-p="m" onclick="setProfile(\'m\')">Brother</button><button data-p="w" onclick="setProfile(\'w\')">Sister</button><button data-p="" onclick="setProfile(\'\')">Both</button></div>';}
function textSwHTML(id){return '<button class="sw" id="'+id+'" role="switch" aria-checked="false" aria-label="Larger text" onclick="setText(ST.text===\'lg\'?\'\':\'lg\')"></button>';}

/* ════════════════════════ HAJJ CALENDAR (J-03) ════════════════════════ */
/* Umrah stays anchored to ST.dep (depDays/onTrip/expectedDay untouched). The days of Hajj anchor to the Hijri calendar: Intl 'islamic-umalqura' only goes Gregorian → Hijri,
   so hajjD8() takes the HAJJ_D8 table (checked against Umm al-Qura) when it holds the year — Intl puts 8 Dhul Hijjah 1454 a day late in current Chrome and Node — and otherwise walks the days around a guess until Intl gives 8/12/<year>, falling back to the guess; the result is cached in ST. ST.hajjShift (−1|0|+1) absorbs a moon-sighting difference. */
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
  var found=T[y]||'';
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
function setHajjType(t){if(!HAJJ_TYPES[t])return;ST.hajjType=t;ST.hajjTypeConfirmed=true;saveST();if(!planChk.hajjtype){planChk.hajjtype=true;save('us-plan',planChk);}applyJourney();journeyRefresh();vib(8);
  /* G3 review: an Umrah "marked done on arrival" belongs to Tamattu' — on Qiran or Ifrad the mark is offered for removal */
  var est=null;if(t!=='tamattu'){try{var since=ST.dep?new Date(ST.dep+'T00:00:00').getTime():0;JSON.parse(localStorage.getItem('us-umrahlog')||'[]').forEach(function(u){if(u&&u.est&&((u.log||{}).done||0)>=since)est=u;});}catch(e){}}
  if(est)toast('⛺ '+HAJJ_TYPES[t].t+' — an Umrah is marked done on arrival',false,'Remove the mark',function(){estRemoveSheet(est.n);});
  else toast('⛺ '+HAJJ_TYPES[t].t+' — '+HAJJ_TYPES[t].s);}
/* everything that filters through forMe() is rebuilt when the journey or the Hajj type changes */
function journeyRefresh(){renderPlan();buildDeck();updPlan();renderRites();updRites();renderDuas();renderFC();renderPlaces();updPlaces();renderJourneys();renderStories();kidsBestLbl();updChip();homeRefresh();qzJourneyNote();}
/* J-05: labels that follow the journey — header tagline, nav label (data-v="umrah" and the ids never change), Rites intro, Settings rows, After card */
function applyJourney(){var HJ=journey()==='hajj',y=HJ?curHajjYear():0;
  var tg=document.querySelector('.brand h1 small');if(tg)tg.textContent=HJ?'Hajj '+y+' companion':'Hajj & Umrah companion';
  var nl=document.querySelector('.nav button[data-v="umrah"] .l');if(nl)nl.textContent=HJ?'Hajj':'Umrah';
  var hk=document.querySelector('#riteHero .k');if(hk)hk.innerHTML=mk(HJ?'tent':'kaaba','mkt')+(HJ?'Hajj · live':'Umrah · live');
  var vp=document.getElementById('umrahVhP');if(vp)vp.textContent=HJ?'Part 1 — your Umrah. Part 2 — the five days of Hajj. Counters keep count for you.':'Every step from miqat to halq — with counters that keep count for you.';
  var jl=document.getElementById('journeyLbl');if(jl)jl.innerHTML=markify(HJ?'⛺ Hajj '+y+' · '+HAJJ_TYPES[hajjType()].t:'🕋 Umrah');
  var hs=document.getElementById('hajjSet');if(hs)hs.hidden=!HJ;var cc=document.getElementById('campCard');if(cc)cc.hidden=!HJ;
  document.querySelectorAll('#hajjTypeSeg button,#planHtSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-ht')===hajjType()&&(b.parentNode.id!=='planHtSeg'||!!ST.hajjTypeConfirmed));});
  var sh=String(parseInt(ST.hajjShift)||0);document.querySelectorAll('#hajjShiftSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-s')===sh);});
  var sl=document.getElementById('hajjShiftLbl');if(sl&&HJ){var D=hajjDates(y);sl.textContent='Moon sighting can move the days by one · Arafah on '+fmtDate(D[9],true)+(ST.hajjShift?' (shifted '+(ST.hajjShift>0?'+1':'−1')+')':'');}
  var ph=document.getElementById('postH3');if(ph)ph.innerHTML=markify('🌱 After '+(HJ?'Hajj':'Umrah')+' — keep it alive');
  var hn=document.getElementById('hajjNote');if(hn)hn.hidden=!HJ;
  /* G2 #17: the footer prayer and the dua list hint follow the journey */
  var fj=document.getElementById('footJ');if(fj)fj.textContent=(!ST.onboarded&&!ST.journeyAsked)?'Hajj and Umrah':HJ?'Hajj':'Umrah';var dh=document.getElementById('duaHint');if(dh)dh.textContent=duaHintT();
  /* 6.7 (G3 #23): Hajj mode says Hajj — the intention card, More's subtitle, the after-trip switch, the next-journey hadith (the other half of Bukhari 1773), the Nusuk Umrah row */
  jSwap('niyP','Hajj is answered by the heart before it is booked by the hands. Three foundations, then everything else.');
  jSwap('niyB1','Define your specific spiritual goals for this journey — what you are asking Allah for, what you want to leave behind. "The accepted Hajj has no reward except Paradise" (Bukhari 1773). Decide now what you will ask for at Arafah. Go purely for Allah, not for the photos.');
  jSwap('stEmptyJ','record your Hajj in the Hajj tab');
  jSwap('moreP','Keep the change alive after Hajj, the essential duas, and your settings &amp; data.');
  jSwap('postLbl','After-Hajj mode');var psw=document.getElementById('postSw');if(psw)psw.setAttribute('aria-label',HJ?'After-Hajj mode':'Post-Umrah mode');
  jSwap('nextP','"…and the accepted Hajj has no reward except Paradise" (Bukhari 1773). When Allah invites you again, the checklists and countdown are ready — nothing from this journey is deleted.');
  var nu=document.getElementById('nusukUm');if(nu)nu.hidden=HJ;
  /* G3 #29: a written intention ticks the row of the journey now chosen (and migrates a Hajj intention saved on the Umrah row) */
  if(niyText().trim()&&!planChk[niyKey()]){planChk[niyKey()]=true;save('us-plan',planChk);}
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
  /* G3 #31: the hotel card opens on today's city (the itinerary may have moved on since the app was opened) — never while a field in it is being edited */
  if(t==='plan'&&!hotelTabC){var hae=document.activeElement;if(!(hae&&hae.closest&&hae.closest('#hotelCard')))loadHotelInfo();}
  var view=document.getElementById('view-'+t);if(!view)return;
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('on');});
  view.classList.add('on');
  document.querySelectorAll('.nav button').forEach(function(e){var on=e.getAttribute('data-v')===t;e.classList.toggle('on',on);if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');});
  if(sub)goSub(t,sub,true);
  else if(t==='more'&&ST.subAuto&&ST.subAuto.more&&(ST.sub||{}).more!==moreAutoSub())goSub('more',moreAutoSub(),true);
  if(t==='daily'){updDaily();updStats();loadPT();renderTB();}
  if(t==='places'){placesSeed();updPlaces();}
  if(t==='umrah'){cntNavAt=Date.now();updRites();}
  if(t==='plan')updPlan();
  if(t==='home')renderHome();
  updChip();qbAutoStop();
  if(!ST.segNudged&&view.querySelector('.seg')){ST.segNudged=true;saveST();var on=view.querySelector('.seg button[data-sub].on');if(on)on.classList.add('nudge');}
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='count'&&cntStarted())anchor=cntActive()+'Card';
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='steps'){focusRites(false);var nxr=nextRite();anchor=nxr?'rw-'+nxr.st.id:(hajjPart2Active()?'hajjDone':'riteDone');}
  if(anchor){requestAnimationFrame(function(){setTimeout(function(){jumpTo(anchor,true);},30);});}
  else window.scrollTo({top:0,behavior:smooth()});}
/* deep links used by chips in checklists and knowledge bodies (M-05) */
function goRef(tab,sub,anchor){if(tab==='places')placesReset();goTab(tab,sub||null,anchor||null);}
function placesReset(){var sr=document.getElementById('plSearch');if(sr&&sr.value)sr.value='';if(unvisOnly){unvisOnly=false;var e=document.getElementById('pillUnvis');if(e){e.classList.remove('on');e.setAttribute('aria-pressed','false');}}if(cityFilter!=='all')filterCity('all',true);else renderPlaces();}
function openPlace(id){var p=placeById(id);if(!p)return;placesSeed(); /* 6.10: seed the city filter first, or the first visit to Places re-filters to one city and drops the card being opened */
  placesReset();plShow(id);goTab('places',null,'pl-'+id);}
function openTour(){tourOpen=true;placesReset();var t=document.getElementById('tourCard');if(t){t.classList.add('open');var hd=t.querySelector('.tour-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('places',null,'tourCard');}
function goPost(enable){if(enable&&!ST.post){ST.post=true;saveST();renderPost();}goTab('more','guide','postCard');}
function startPost(){goPost(true);toast('🌱 '+(journey()==='hajj'?'After-Hajj':'Post-Umrah')+' mode on — 30 days, 3 habits',true);}
function refChip(it){var q=function(v){return v?'\''+v+'\'':'null';};if(typeof it.go==='string')return '<button class="xchip" onclick="event.stopPropagation();'+it.go+'">'+(it.goL||'Open')+' →</button>';if(it.place)return '<button class="xchip" onclick="event.stopPropagation();openPlace('+q(it.place)+')">'+(it.goL||'📍 Open')+' →</button>';if(it.go)return '<button class="xchip" onclick="event.stopPropagation();goRef('+q(it.go[0])+','+q(it.go[1])+','+q(it.go[2])+')">'+(it.goL||'Open')+' →</button>';return '';}
function mkSec(sec,shut,inner,countId){
  var apps='';
  /* D-05: the tick rows come first; tools are a wrapping row of chips underneath (external ones say they need signal) */
  if(sec.apps)apps='<div class="apps"><span class="apps-h">Helpful tools</span>'+sec.apps.map(function(x){if(x.n==='Umrah duas with audio'&&journey()==='hajj')x=Object.assign({},x,{n:'Hajj duas with audio'});var go=x.u?'href="'+x.u+'" target="_blank" rel="noopener" title="'+esc(x.d||'')+' — opens in browser, needs internet"':'href="#" title="'+esc(x.d||'')+'" onclick="event.preventDefault();goTab(\''+x.go[0]+'\',\''+x.go[1]+'\''+(x.go[2]?',\''+x.go[2]+'\'':'')+')"';return '<a class="applink" '+go+'><span class="app-i">'+x.i+'</span><span class="app-t"><b>'+x.n+'</b></span><span class="app-go">'+(x.u?'Open ↗':'Go →')+'</span></a>';}).join('')+'</div>';
  return '<div class="sec'+(shut?' shut':'')+'" id="sec-'+sec.id+'"><div class="sec-hd" role="button" tabindex="0" aria-expanded="'+(shut?'false':'true')+'" onclick="togSec(this)"><div class="sec-ico">'+(sec.ico?mkOr(sec.ico,''):'•')+'</div><h2>'+sec.title+(sec.sub?'<small>'+sec.sub+'</small>':'')+'</h2><span class="sec-ct" id="sp-'+sec.id+'"></span><span class="sec-chev">▼</span></div><div class="sec-bd">'+(sec.hn?'<div class="note">'+sec.hn+'</div>':'')+inner+apps+'</div></div>';
}

/* ════════════════════════ PLAN ════════════════════════ */
function renderPlan(){
  var h='';
  activePlan().forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      if(!forMe(it))return;
      var exp=it.id==='quiz80'?'Pass all '+numWord(qzVisible().length)+' levels in the Quiz tab (80%+ each). This ticks itself when the circuit is complete.':(it.exh&&journey()==='hajj')?it.exh:it.exp;
      /* G2 #24: "Know which Hajj you’ll intend" carries the Tamattu’ / Qiran / Ifrad picker inline (setHajjType confirms the type and ticks the row) */
      var ht=it.id==='hajjtype'?'<div class="segmini plan-ht" id="planHtSeg" role="group" aria-label="Hajj type" onclick="event.stopPropagation()">'+['tamattu','qiran','ifrad'].map(function(t){return '<button data-ht="'+t+'"'+(ST.hajjTypeConfirmed&&hajjType()===t?' class="on"':'')+' onclick="setHajjType(\''+t+'\')">'+HAJJ_TYPES[t].t+'</button>';}).join('')+'</div>':'';
      inner+='<div class="row" id="pw-'+it.id+'"'+(it.bag?' data-bag="'+it.bag+'"':'')+' role="checkbox" tabindex="0" aria-checked="false" onclick="togPlan(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(exp?'<div class="x">'+exp+ckLine(it)+'</div>':'')+ht+refChip(it)+'</div></div>';
    });
    if(sec.id==='pack')inner='<div class="pills sm bagpills" style="margin:6px 0 10px;flex-wrap:wrap"><button class="pill on" onclick="event.stopPropagation();bagFilter(this,\'all\')">All</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'ihram\')">'+markify('🤍 Ihram bag')+'</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'carry\')">'+markify('✈️ Carry-on')+'</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'case\')">'+markify('🧳 Suitcase')+'</button></div>'+inner;
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('planContainer').innerHTML=h;
  /* J-02: knowledge topics carry j:'hajj' — gated like every other row */
  /* 6.4: on a Hajj journey the Hajj topics lead the essentials; every topic carries its card key (data-k) so a flashcard can open it */
  LN_CARDS.forEach(function(c){var arr=c[2].filter(forMe),el=document.getElementById(c[1]);if(c[0]==='knowCard'&&journey()==='hajj')arr=arr.filter(function(x){return x.j==='hajj';}).concat(arr.filter(function(x){return x.j!=='hajj';}));
    /* G5: the verified packs as reading — Ramadan leads on a Ramadan trip; the Hajj packs follow the Hajj topics; getting around closes the list */
    if(c[0]==='knowCard'){var PL=pkLearn(),nh=arr.filter(function(x){return x.j==='hajj';}).length;arr=PL.lead.concat(arr.slice(0,nh),PL.slice(0,PL.length-1),arr.slice(nh),PL.slice(PL.length-1));}
    if(el){el.innerHTML=accs(arr);var A=el.querySelectorAll(':scope>.acc');arr.forEach(function(it,i){if(!A[i])return;var k=c[3]+c[2].indexOf(it);A[i].setAttribute('data-k',k);var bd=A[i].querySelector('.acc-b');if(bd)bd.insertAdjacentHTML('beforeend',corrBtn('learn',k));});}lnMeta(c[0],arr);});
  renderRiteTiles();renderLnRefs();filterLearn();
}
/* accordions (P-19): the header alone toggles, so links and text inside an open topic are usable */
function accs(arr){return arr.map(function(g){return '<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+g.t+' <span class="acc-c">▶</span></div><div class="acc-b">'+g.b+ckLine(g)+'</div></div>';}).join('');}
function accToggle(h){var a=h.parentNode,o=a.classList.toggle('open');h.setAttribute('aria-expanded',o?'true':'false');}
/* Learn hub: reading sections in reading order (P-13/P-21), topic counts (P-20), search (P-20), rites index (P-14) */
var LN_CARDS=[['knowCard','knowContainer',KNOW,'know'],['qaCard','qaContainer',FIQHQA.concat(TROUBLE),'qa'],['histCard','histContainer',HISTORY,'hist'],['virtCard','virtContainer',VIRTUES,'virt'],['madCard','madContainer',MADINAH,'mad'],['sisCard','sisContainer',SISTERS,'sis'],['scamCard','scamContainer',SCAMS,'scam']];
var LN_OTHER=['ritesCard','fcCard','lnQuizCard'],lnAuto=null;
function fcText(html){return String(html||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function lnMeta(cardId,arr){var h3=document.querySelector('#'+cardId+' h3');if(!h3)return;var w=0;arr.forEach(function(g){w+=fcText(g.t+' '+g.b).split(' ').length;});var m=h3.querySelector('.lnm');if(!m){m=document.createElement('small');m.className='lnm';h3.appendChild(m);}m.textContent=arr.length+' topics · ≈'+Math.max(1,Math.round(w/200))+' min read';}
function filterLearn(){
  var inp=document.getElementById('lnSearch');if(!inp)return;var q=(inp.value||'').trim().toLowerCase(),none=document.getElementById('lnNone'),shown=[],total=0;
  if(lnAuto&&(!q||lnTxt(lnAuto).indexOf(q)<0)){lnAuto.classList.remove('open');var ah=lnAuto.querySelector('.acc-h');if(ah)ah.setAttribute('aria-expanded','false');lnAuto=null;}
  LN_CARDS.forEach(function(c){var card=document.getElementById(c[0]);if(!card)return;var vis=0;
    card.querySelectorAll('.acc').forEach(function(a){var hit=!q||lnTxt(a).indexOf(q)>-1;a.hidden=!hit;if(hit){vis++;shown.push(a);}});
    card.classList.toggle('ln-hide',!!q&&!vis);var j=document.querySelector('#lnJumps [data-for="'+c[0]+'"]');if(j)j.classList.toggle('ln-hide',!!q&&!vis);total+=vis;});
  LN_OTHER.forEach(function(id){var e=document.getElementById(id);if(e)e.classList.toggle('ln-hide',!!q);var j=document.querySelector('#lnJumps [data-for="'+id+'"]');if(j)j.classList.toggle('ln-hide',!!q);});
  if(none)none.hidden=!q||total>0;
  if(q&&shown.length===1&&lnAuto!==shown[0]){lnAuto=shown[0];lnAuto.classList.add('open');var hd=lnAuto.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');try{lnAuto.scrollIntoView({behavior:smooth(),block:'center'});}catch(e){}}
}
function umrahTilesHTML(){return RITES.map(function(ph,i){var t=ph.title.replace(/^Phase \d+ · /,''),n=riteCounts(ph.steps).tot;
    return '<div class="rtile" role="button" tabindex="0" aria-label="Step '+(i+1)+', '+t.replace(/"/g,'')+' — open in the rites guide" onclick="openRitePhase(\''+ph.id+'\')"><span class="i">'+mkOr(ph.ico,'kaaba')+'</span><b>'+t+'</b><small>Step '+(i+1)+' · '+n+' to-dos</small></div>'+(i===0||i===2?'<span class="rarr" aria-hidden="true">→</span>':'')+(i===1?'<span class="rarr dn" aria-hidden="true">↓</span>':'');}).join('');}
/* Learn › the rites index follows the journey: Umrah in 4 steps, or Hajj in 5 days (HAJJ_PATH) with a "Before" row for the Hajj type.
   A day's tile carries its expected date (hajjDates: Umm al-Qura + ST.hajjShift) and its step count; today's tile is the aubergine object. */
function hpWd(iso){var d=new Date(iso+'T00:00:00');return isNaN(d)?'':d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});}
function hpTileHds(t){var hds=[],n=0;[t.sec].concat(t.also||[]).forEach(function(id){var S=null;HAJJ_RITES.forEach(function(x){if(x.id===id)S=x;});if(!S||(S.opt&&!ST[S.opt]))return;n+=S.steps.filter(forMe).length;if(S.hd&&hds.indexOf(S.hd)<0)hds.push(S.hd);});return {hds:hds,n:n};}
function hpTileNow(t,hd){return typeof hd==='number'&&!/n$/.test(t.sec)&&hpTileHds(t).hds.indexOf(hd)>-1;}
function renderRiteTiles(){var a=document.getElementById('riteTiles');if(!a)return;var HJ=journey()==='hajj',T=document.getElementById('ritesT'),sub=document.getElementById('ritesSub'),bt=document.getElementById('riteBtns');
  a.classList.toggle('hj',HJ);
  if(!HJ){if(T)T.textContent='Umrah in 4 steps';if(sub)sub.textContent='The whole rite in order — learn this first, then the cards below.';a.innerHTML=umrahTilesHTML();
    if(bt)bt.innerHTML='<button class="btn ghost" onclick="goTab(\'umrah\',\'steps\')">'+mk('list','mkt')+'Full walkthrough &amp; duas</button>';return;}
  var P=HAJJ_PATH,ty=hajjType(),hd=hajjDay(),D=hajjDates(curHajjYear()),pre=P.pre[ty]||P.pre.tamattu,rd=ST.hpRead||{};
  if(T)T.textContent=P.t;if(sub)sub.textContent=P.sub+(D[8]?' Dates are expected (Umm al-Qura); the moon sighting can move them by a day.':'');
  var h='<div class="rpre" role="button" tabindex="0" aria-label="'+esc(pre.t)+' — open in the rites guide" onclick="openRitePhase(\''+pre.ph+'\')"><span class="i">'+mk(ty==='tamattu'?'kaaba':'refresh')+'</span><span class="rpre-t">'+pre.t+'</span><span class="rpre-go" aria-hidden="true">'+mk('chevr')+'</span></div>';
  P.tiles.forEach(function(t){var x=hpTileHds(t),d1=x.hds.length?D[x.hds[0]]:'',d2=x.hds.length>1?D[x.hds[x.hds.length-1]]:'',dt=d1?hpWd(d1)+(d2&&d2!==d1?' – '+hpWd(d2):''):'',now=hpTileNow(t,hd),line=(t.v&&t.v[ty])||t.s,meta=(dt?dt+' · ':'')+x.n+' step'+(x.n===1?'':'s');
    h+='<div class="rtile hd'+(now?' now':'')+(rd[t.sec]?' seen':'')+'" role="button" tabindex="0"'+(now?' aria-current="date"':'')+' aria-label="'+esc(t.n+', '+t.t+' — '+line+' · '+meta+(now?', today':'')+' — open the day in the rites guide')+'" onclick="openHajjDay(\''+t.sec+'\')"><span class="i">'+mk(t.mk)+'</span><small class="rt-n">'+(now?'Today · ':'')+t.n+'</small><b>'+t.t+'</b><small class="rt-s">'+line+'</small><small class="rt-m">'+meta+'</small></div>';});
  a.innerHTML=h;
  if(bt)bt.innerHTML='<button class="btn ghost" onclick="goTab(\'umrah\',\'steps\',\'hajjContainer\')">'+mk('list','mkt')+'Full walkthrough &amp; duas</button><button class="btn ghost" onclick="hpQuiz()">'+mk('quiz','mkt')+(typeof hd==='number'?'Quiz the day you are on':'Quiz the days of Hajj')+'</button>';}
function openRitePhase(id){var sc=document.getElementById('sec-'+id);if(sc){sc.classList.remove('shut');var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');}goTab('umrah','steps','sec-'+id);}
/* a Hajj day in the rites guide (Part 2 section #sec-hd8 … #sec-hdw); opening a tile is remembered per tile for the readiness score */
function openHajjDay(sec){var tile=null;(HAJJ_PATH.tiles||[]).forEach(function(t){if(t.sec===sec||(t.also||[]).indexOf(sec)>-1)tile=t;});
  if(tile){ST.hpRead=ST.hpRead||{};if(!ST.hpRead[tile.sec]){ST.hpRead[tile.sec]=1;saveST();}}
  if(journey()!=='hajj'){goTab('umrah','steps');return;}
  if(!document.getElementById('sec-'+sec))renderRites();setSecOpen(sec,true);goTab('umrah','steps','sec-'+sec);}
/* "Quiz the day you are on": the level that covers today's rites; before the days, the first of them not yet passed */
function hpQuiz(){var hd=hajjDay(),k='';
  if(typeof hd==='number')HAJJ_PATH.tiles.forEach(function(t){if(!k&&hpTileNow(t,hd))k=t.quiz;});
  if(!k){var ks=['h-arafah','h-nahr','h-tashreeq'];ks.forEach(function(x){var i=qzKeyIdx(x);if(!k&&i>-1&&!qzPassed(i))k=x;});k=k||(hd==='post'?'h-tashreeq':'h-arafah');}
  var i=qzKeyIdx(k);goTab('plan','quiz');if(i>-1)startLevel(i);}
/* P-15: hand-off from reading to the quiz — next level of this track, or the mistakes drill once all are passed */
function lnNextLevel(){var s=qzSeq();for(var k=0;k<s.length;k++){if(!qzPassed(s[k]))return s[k];}return -1;}
function renderLearnQuiz(){
  var a=document.getElementById('lnQuizArea'),sb=document.getElementById('lnQuizSub');if(!a)return;
  var next=lnNextLevel(),wc=qzWrongCount(),N=qzSeq().length,h,W=numWord(N);W=W.charAt(0).toUpperCase()+W.slice(1);
  if(next<0){sb.textContent='All '+N+' levels passed — mashallah.';h='<div class="lnq"><div class="lvl-n">'+mk('medal')+'</div><div class="t"><b>Circuit complete</b>'+(wc?wc+' question'+(wc===1?'':'s')+' still to master.':'Nothing left to review — go with presence of heart.')+'</div></div><button class="btn'+(wc?' gold':' ghost')+'" onclick="lnQuizGo()">'+(wc?'🔁 Review my mistakes ('+wc+')':'🧠 Open the quiz')+'</button>';}
  else{var best=qzST.best[next];sb.textContent=W+' levels · 80% unlocks the next. Next up: '+qzLvName(next)+' · '+qzLvName(next,1)+(best!==undefined?' · best so far '+best+'%':'');
    h='<div class="lnq">'+qzDisc(next,true)+'<div class="t"><b>'+qzLvName(next,1)+'</b>'+qzLvDesc(next)+' · '+qzN(next)+' questions · 80% unlocks the next level</div></div><button class="btn gold" onclick="lnQuizGo()">🧠 Start '+qzLvName(next)+' →</button>';}
  a.innerHTML=h;
}
function lnQuizGo(){var next=lnNextLevel();goTab('plan','quiz');if(next<0){if(qzWrongCount())startMistakes();}else startLevel(next);}
/* Q9: the Learn cards name the level that covers them in THIS track, and follow the journey's titles */
var LN_REF={qaCard:{umrah:'u-fiqh',hajj:'h-fiqh'},histCard:'u-hist',virtCard:'u-virt',madCard:'u-mad'};
function renderLnRefs(){var HJ=journey()==='hajj';
  Object.keys(LN_REF).forEach(function(id){var r=LN_REF[id],k=typeof r==='string'?r:r[journey()],i=qzKeyIdx(k),el=document.querySelector('#'+id+' .lvlref');if(!el)return;el.textContent=(i>-1&&qzVis(i))?'Covered in '+qzLvName(i)+(HJ?' · '+qzShort(i):''):'';});
  var vt=document.getElementById('virtT'),vi=qzKeyIdx('u-virt');if(vt&&vi>-1)vt.textContent=qzLvName(vi,1);
  var ks=document.getElementById('knowSub');if(ks)ks.textContent=HJ?'The three kinds of Hajj, the five days and the hady — then miqats & ihram. Tap a topic to expand.':'Miqats, ihram & the common mistakes — the knowledge that turns a trip into worship. Tap a topic to expand.';}
function togPlan(id){
  /* G2 review: the Hajj-type row is done by picking a type, never by a bare tick */
  if(id==='hajjtype'&&!planChk[id]&&!ST.hajjTypeConfirmed){var hs=document.querySelector('#planHtSeg button');if(hs)hs.focus();vib(8);toast('Pick Tamattu’, Qiran or Ifrad');return;}
  planChk[id]=!planChk[id];save('us-plan',planChk);vib(15);if(planChk[id])markPrepDay();updPlan();chkBadges();}
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
/* 6.5 (G1 #1): a Hajj departure date refits the trip through 13 Dhul Hijjah (never shortens it) and says so */
function setDep(v){var first=!ST.dep&&!!v;ST.dep=v;if(ST.there)ST.there=false;saveST();var was=ST.tripLen;if(v)hajjFitTrip();var grew=ST.tripLen>was;updCountdown();updChip();renderItin();renderTimeline();renderTodayTop();updToolsOrder();renderDuaSec();if(grew){updDaily();updStats();}
  /* (G1 review) the end date is read after the fit: a trip capped at TRIP_MAX that still ends before the 13th says so instead of claiming it runs past it */
  var D13=v&&journey()==='hajj'?hajjDates(curHajjYear())[13]:null,short=D13&&addDays(v,ST.tripLen-1)<D13;
  if(v)toast(short?'⛺ '+fmtDate(v)+' — the trip is at the '+TRIP_MAX+'-day maximum and still ends before the days of Hajj ('+fmtDate(D13)+') — check the departure date':grew?'⛺ '+fmtDate(v)+' — trip lengthened to '+ST.tripLen+' days so it runs past 13 Dhul Hijjah ('+fmtDate(D13)+')':'✈️ '+fmtDate(v)+' — countdown, timeline & itinerary are now dated',true);
  if(first)sortedAsk();}
/* return date (P-05): derives the trip length; #tripLen in Settings stays as a mirror */
function setRet(v){if(!v)return;if(!ST.dep){toast('Set your departure date first');updRetDate();return;}var days=Math.round((new Date(v+'T00:00:00')-new Date(ST.dep+'T00:00:00'))/86400000)+1;if(days<3||days>TRIP_MAX){toast(days<3?'Trips here are at least 3 days — return date adjusted':'Trips here are up to '+TRIP_MAX+' days — return date adjusted');}setTripLen(Math.max(3,Math.min(TRIP_MAX,days)));
  /* 6.5 (G1 #1): a Hajj trip that comes home before 13 Dhul Hijjah is flagged, never silently accepted — the real flight date is kept unless the pilgrim taps to fit it */
  if(journey()==='hajj'&&days>=3&&days<=TRIP_MAX){var D=hajjDates(curHajjYear()),end=addDays(ST.dep,ST.tripLen-1);if(D[13]&&end<D[13])setTimeout(function(){toast('⛺ Home on '+fmtDate(end)+' — before 13 Dhul Hijjah ('+fmtDate(D[13])+')',false,'Lengthen',hajjFitGo);},350);}}
function updRetDate(){var r=document.getElementById('retDate');if(!r)return;if(!ST.dep){r.value='';r.removeAttribute('min');return;}var d=new Date(ST.dep+'T00:00:00');r.min=ST.dep;d.setDate(d.getDate()+(ST.tripLen-1));r.value=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function pickDep(){var inp=document.getElementById('depDate');if(!inp)return;var ok=false;try{if(inp.showPicker){inp.showPicker();ok=true;}}catch(e){}if(!ok){document.getElementById('cdCard').classList.remove('cd2-empty');inp.focus();try{inp.click();}catch(e){}}}
/* jump bar under the Prepare hero (P-06); on trip the trip-time cards come first */
function renderPrepJumps(){var a=document.getElementById('prepJumps');if(!a)return;
  var J=[['niyCard','🤍 Intention'],['cdCard','📅 Countdown'],['tlCard','⏳ Timeline'],['planContainer','✅ Checklists'],['hotelCard','🏨 Hotel & SOS'],['itinCard','🗓️ Itinerary'],['vaultCard','🔐 Vault']];
  /* G2 #24: in Hajj mode the Mina camp has its own jump, beside the hotel */
  if(journey()==='hajj')J.splice(5,0,['campBlk','⛺ Camp']);
  if(!ST.dep)J=J.filter(function(j){return j[0]!=='tlCard';});
  if(onTrip()){var first=journey()==='hajj'?['hotelCard','campBlk','itinCard','vaultCard']:['hotelCard','itinCard','vaultCard'];J=first.map(function(id){return J.filter(function(j){return j[0]===id;})[0];}).concat(J.filter(function(j){return first.indexOf(j[0])<0;}));}
  a.innerHTML=J.map(function(j){return '<button onclick="jumpTo(\''+j[0]+'\')">'+markify(j[1])+'</button>';}).join('');}
function updCountdown(){
  var n=document.getElementById('cdNum'),t=document.getElementById('cdT'),s=document.getElementById('cdS'),inp=document.getElementById('depDate');
  var card=document.getElementById('cdCard'),niy=document.getElementById('niyCard'),setBtn=document.getElementById('cdSetBtn');
  var tripL=!!(card&&card.parentNode&&card.parentNode.id==='prepBeforeB');
  if(card&&niy&&!tripL){var empty=!ST.dep;card.classList.toggle('cd2-empty',empty);if(setBtn)setBtn.hidden=!empty;
    if(empty&&card.nextElementSibling!==niy)niy.parentNode.insertBefore(card,niy);
    if(!empty&&card.previousElementSibling!==niy)niy.parentNode.insertBefore(card,niy.nextSibling);}
  prepLayout();updRetDate();renderPrepJumps();
  if(ST.dep){inp.value=ST.dep;
    var d=Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);
    var u=document.getElementById('cdU');
    if(d>1){n.textContent=d;u.textContent='days';t.textContent='until departure';s.textContent='Prepare with excellence — the countdown is on.';}
    else if(d===1){n.textContent='1';u.textContent='day';t.textContent='Tomorrow!';s.textContent='Final checks — passport, ihram, dua list.';}
    else if(d===0){n.textContent='🛫';u.textContent='today';t.textContent='Today is the day!';s.textContent='Safe travels — labbayk!';}
    else{n.textContent='🕋';u.textContent='on trip';t.textContent='You’re on your journey';s.textContent='Switch to the '+jw()+' & Daily tabs.';}
  }else{n.textContent='—';document.getElementById('cdU').textContent='days';t.textContent='When do you fly?';s.textContent='Your date unlocks the countdown, a dated to-do timeline, the itinerary and the journey chip.';}
}

/* ════════════════════════ QUIZ (levels) ════════════════════════ */
var qzST={best:{}};
try{qzST=Object.assign(qzST,JSON.parse(localStorage.getItem('us-quiz')||'{}'));}catch(e){}
/* qzActive (P-23) keeps updPlan from wiping a running level; qzPerm (P-27) is the display order of the current options;
   qzOrder shuffles question order on a retake of a passed level; qzRun (6.4) logs every answer of this run for the review list */
var qzLevel=0,qzI=0,qzScore=0,qzLock=false,qzHist=[],qzMode='level',qzQueue=[],qzActive=false,qzPerm=[],qzOrder=null,qzRun=[];
if(!qzST.wrong)qzST.wrong={};
function qzSave(){try{localStorage.setItem('us-quiz',JSON.stringify(qzST));}catch(e){}}
/* 6.4 journey tracks: QUIZ_LEVELS is append-only (stored keys stay l<index>q<index>, qzST.best is by index); QUIZ_ORDER[journey()] is the
   display order, so a level's number is its place in the active track. A level and each of its questions pass through forMe() (j / ht);
   j:'off' retires a level everywhere. */
function qzKeyIdx(k){for(var i=0;i<QUIZ_LEVELS.length;i++)if(QUIZ_LEVELS[i].key===k)return i;return -1;}
function qzVis(i){var L=QUIZ_LEVELS[i];return !!L&&forMe(L);}
function qzSeq(){var o=(typeof QUIZ_ORDER!=='undefined'&&QUIZ_ORDER[journey()])||[],s=[];
  o.forEach(function(k){var i=qzKeyIdx(k);if(i>-1&&qzVis(i)&&s.indexOf(i)<0)s.push(i);});
  QUIZ_LEVELS.forEach(function(_,i){if(qzVis(i)&&s.indexOf(i)<0)s.push(i);});return s;}
function qzVisible(){return qzSeq().map(function(i){return QUIZ_LEVELS[i];});}
/* the questions of level i this pilgrim sees, as indices into L.qs (the stored keys never move) */
function qzQs(i){var L=QUIZ_LEVELS[i],r=[];if(L)L.qs.forEach(function(q,k){if(forMe(q))r.push(k);});return r;}
function qzN(i){return qzQs(i).length;}
function qzPos(i){return qzSeq().indexOf(i);}
function qzPrevVis(i){var s=qzSeq(),p=s.indexOf(i);return p>0?s[p-1]:-1;}
function qzNextVis(i){var s=qzSeq(),p=s.indexOf(i);return p>-1&&p<s.length-1?s[p+1]:-1;}
/* a stored key that this pilgrim can see → {lv,qi}; a gated or retired question counts nowhere */
function qzRef(k){var m=/^l(\d+)q(\d+)$/.exec(k);if(!m)return null;var L=QUIZ_LEVELS[+m[1]],q=L&&L.qs[+m[2]];return q&&forMe(L)&&forMe(q)?{lv:+m[1],qi:+m[2]}:null;}
function qzWrongCount(){return Object.keys(qzST.wrong).filter(qzRef).length;}
function qzWrongIn(lv){return Object.keys(qzST.wrong).filter(function(k){var r=qzRef(k);return r&&r.lv===lv;}).length;}
function qzShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function curRef(){return qzMode==='level'?{lv:qzLevel,qi:qzQs(qzLevel)[qzOrder?qzOrder[qzI]:qzI]}:qzQueue[qzI];}
function curQ(){var r=curRef();return QUIZ_LEVELS[r.lv].qs[r.qi];}
function curKey(){var r=curRef();return 'l'+r.lv+'q'+r.qi;}
function qzTotal(){return qzMode==='level'?qzN(qzLevel):qzQueue.length;}
function qzPassed(i){return (qzST.best[i]||0)>=80;}
/* P-29: the smallest score that rounds to the 80% pass mark — same formula as nextQz */
function qzNeed(n){for(var k=0;k<=n;k++){if(Math.round(k/n*100)>=80)return k;}return n;}
/* P-30: returning pilgrims (post mode, or THIS journey done before) and "Unlock all levels" (qzST.free) open every level — an Umrah on record no longer opens the Hajj track */
function qzFreeAll(){return !!(qzST.free||ST.post||(journey()==='hajj'?(ST.hajjs||0)+(ST.hajjsPrev||0)>=1:totalUmrahs()>=1));}
function qzUnlocked(i){var p=qzPrevVis(i);return p<0||qzPassed(p)||qzFreeAll();}
function qzPassedCount(){return qzSeq().filter(qzPassed).length;}
function qzAllPassed(){var s=qzSeq();return s.length>0&&s.every(qzPassed);}
function qzNext(){var s=qzSeq();for(var k=0;k<s.length;k++){if(qzUnlocked(s[k])&&!qzPassed(s[k]))return s[k];}return -1;}
/* a level reads "Level n" (its place in this track) + its journey title; jx[journey] overrides name / desc */
function qzJx(i,f){var L=QUIZ_LEVELS[i]||{},J=L.jx||{},t=journey()==='hajj'?J[hajjType()]:null,x=J[journey()];return (t&&t[f])||(x&&x[f])||L[f]||'';}
function qzLvName(i,part){return part?qzJx(i,'name'):'Level '+(qzPos(i)+1);}
function qzLvDesc(i){return qzJx(i,'desc');}
function qzLvMk(i){var L=QUIZ_LEVELS[i]||{};return L.mk||emk(L.icon,'quiz');}
function qzShort(i){var L=QUIZ_LEVELS[i]||{};return L.short||qzLvName(i,1);}
/* Q6: a question kept for some Hajj types says so ("Tamattu’ only", "Qiran & Ifrad") */
function qzHtTag(q){if(!q||!q.ht||!q.ht.length)return '';var n=q.ht.map(function(t){return (HAJJ_TYPES[t]||{}).t||t;});return n.length===1?n[0]+' only':n.join(' & ');}
function qzSrc(q){return q&&q.src?'<span class="src-chip">'+esc(q.src)+'</span>':'';}
/* 6.4 one-time move: the retired "days of Hajj" level (index 7, j:'off') — its 13 questions live on, corrected, in the Hajj track,
   and a 1447 pilgrim's misses and card boxes follow them there. Nothing else is rewritten (append-only data keeps every other key valid). */
var QZ_MOVED={0:'h-arafah#2',1:'h-arafah#3',2:'h-arafah#4',3:'h-nahr#5',4:'h-tashreeq#2',5:'h-nahr#2',6:'h-found#8',7:'h-ihram#6',8:'h-tashreeq#4',9:'h-tashreeq#9',10:'h-tashreeq#3',11:'h-tashreeq#6',12:'h-fiqh#0'};
function qzMovedKey(qi){var t=QZ_MOVED[qi];if(!t)return '';var p=t.split('#'),i=qzKeyIdx(p[0]);return i>-1?'l'+i+'q'+p[1]:'';}
(function qzMigrate(){if(qzST.m64)return;var cards={},cm=false;try{cards=JSON.parse(localStorage.getItem('us-cards')||'{}')||{};}catch(e){cards={};}
  Object.keys(QZ_MOVED).forEach(function(qi){var ok='l7q'+qi,nk=qzMovedKey(+qi);if(!nk)return;
    if(qzST.wrong[ok]){if(!qzST.wrong[nk])qzST.wrong[nk]=qzST.wrong[ok];delete qzST.wrong[ok];}
    if(cards[ok]){if(!cards[nk])cards[nk]=cards[ok];delete cards[ok];cm=true;}});
  if(qzST.cur&&qzST.cur.mode!=='mist'&&qzST.cur.lv===7)delete qzST.cur;
  qzST.m64=1;qzSave();if(cm)try{localStorage.setItem('us-cards',JSON.stringify(cards));}catch(e){}})();
/* Q8: switching to Hajj says what carries over (the shared levels keep their best scores) and how many Hajj levels are new */
function qzJourneyNote(){var j=journey(),was=ST.qzJ;if(was===j)return;ST.qzJ=j;saveST();if(!was||j!=='hajj')return;
  var U=(QUIZ_ORDER.umrah||[]),H=(QUIZ_ORDER.hajj||[]),shared=[],fresh=0,any=Object.keys(qzST.best||{}).length>0;
  H.forEach(function(k){var i=qzKeyIdx(k);if(U.indexOf(k)<0){fresh++;return;}if(i>-1&&qzST.best[i]!==undefined)shared.push(qzShort(i));});
  if(!any)return;
  var names=shared.length>1?shared.slice(0,-1).join(', ')+' and '+shared[shared.length-1]:shared[0];
  toast(shared.length?'Your '+names+' progress carries over — '+fresh+' Hajj levels are new.':fresh+' Hajj levels are new — your Umrah quiz progress stays saved.');}
/* P-26: each level names the Learn card that teaches it */
function qzStudyGo(i){var st=QUIZ_LEVELS[i].study||{};if(/^sec-/.test(st.id||'')){openHajjDay(st.id.slice(4));return;}goTab(st.tab||'plan',st.sub||'learn',st.id||'knowCard');}
function qzFree(on){qzST.free=!!on;qzSave();renderLevels();toast(on?'🔓 All levels unlocked — the certificate still needs every level at 80%':'🔒 Guided order restored');vib(8);}
/* Q3: a level's disc — the aubergine object with a lavender ring at its best score; passed = full ring; locked = no ring, a faint lock */
function qzDisc(i,un,cls){var b=qzST.best[i],p=qzPassed(i)?100:(b||0),C=113.1;
  return '<span class="lvl-n'+(un?'':' lk')+(cls?' '+cls:'')+'" aria-hidden="true">'+(un?'<svg class="lvl-r" viewBox="0 0 40 40" focusable="false"><circle class="lr-b" cx="20" cy="20" r="18"/>'+(p>0?'<circle class="lr-f" cx="20" cy="20" r="18" style="stroke-dashoffset:'+(C*(1-p/100)).toFixed(1)+'"/>':'')+'</svg>':'')+mk(un?qzLvMk(i):'lock')+'</span>';}
/* Q4: the track header — one segment per level of the active track (full = passed, half = attempted) */
function qzTrackHTML(){var s=qzSeq(),pc=0,at=0,segs='';
  s.forEach(function(i){var ps=qzPassed(i),tr=qzST.best[i]!==undefined;if(ps)pc++;else if(tr)at++;segs+='<i class="'+(ps?'on':tr?'half':'')+'"></i>';});
  var HJ=journey()==='hajj';
  return '<div class="qz-trk-h"><b>'+(HJ?'Hajj':'Umrah')+' · '+s.length+' levels'+(HJ?' · '+HAJJ_TYPES[hajjType()].t:'')+'</b><span>Passed <b id="qzBest">'+pc+'/'+s.length+'</b></span></div>'
    +'<div class="qz-segs" role="img" aria-label="'+pc+' of '+s.length+' levels passed'+(at?', '+at+' attempted':'')+'">'+segs+'</div>';}
function qzMeterUpd(){var t=document.getElementById('qzTrack');if(t)t.innerHTML=qzTrackHTML();renderReady();}
/* Q7: Hajj readiness — knowledge only. 60% quiz (best % over the Hajj levels + the Tawaf level, weighted by their questions),
   25% cards (those levels' cards in box 2 or higher), 15% the five days read (Learn › Hajj in 5 days tiles opened). Never a measure of the heart. */
var HR_LEVELS=['h-found','h-ihram','u-rites','h-arafah','h-nahr','h-tashreeq','h-fiqh'],HP_SECS=['hd8','hd9','hd9n','hd10','hd11','hdw'];
function hajjReadiness(){if(journey()!=='hajj')return null;var qs=0,qn=0,cs=0,cn=0,weak=-1,ww=0,wb=101,rd=0,hr=ST.hpRead||{};
  HR_LEVELS.forEach(function(k){var i=qzKeyIdx(k);if(i<0||!qzVis(i))return;var Q=qzQs(i),b=qzST.best[i]||0,w=qzWrongIn(i);qs+=b*Q.length;qn+=Q.length;
    Q.forEach(function(qi){cn++;var st=fcST['l'+i+'q'+qi];if(st&&st.box>=2)cs++;});
    if(w>ww||(ww===0&&w===0&&b<wb)){if(w>0||b<100){weak=i;ww=w;wb=b;}}});
  HP_SECS.forEach(function(s){if(hr[s])rd++;});
  var q=qn?qs/qn:0,c=cn?cs/cn:0;
  return {pct:Math.round(.6*q+25*c+15*rd/HP_SECS.length),quiz:Math.round(q),cards:Math.round(c*100),read:rd,readOf:HP_SECS.length,weak:weak};}
function hajjPractise(i){goTab('plan','quiz');if(qzWrongIn(i))startMistakes(i);else startLevel(i);}
function renderReady(){var a=document.getElementById('qzReady');if(!a)return;var R=hajjReadiness();if(!R){a.hidden=true;a.innerHTML='';return;}a.hidden=false;
  a.innerHTML='<div class="hero-t"><div class="k">'+mk('tent','mkt')+'Hajj '+curHajjYear()+' · knowledge</div><div class="v">Your Hajj readiness</div><div class="s">What you know of the rites and their fiqh</div></div>'
    +'<div class="ring-wrap"><svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true" focusable="false"><circle class="ring-bg" cx="46" cy="46" r="38"/><circle class="ring-fg" cx="46" cy="46" r="38" style="stroke-dashoffset:'+(239*(1-Math.min(100,R.pct)/100)).toFixed(1)+'"/></svg><div class="ring-num"><span id="qzReadyN">'+R.pct+'%</span><small>Ready</small></div></div>'
    +'<div class="hs-m"><span class="hs-mi"><small class="hs-ml">Quiz</small><b class="hs-mv">'+R.quiz+'%</b></span><span class="hs-mi"><small class="hs-ml">Cards</small><b class="hs-mv">'+R.cards+'%</b></span><span class="hs-mi"><small class="hs-ml">Days read</small><b class="hs-mv">'+R.read+'<i>/'+R.readOf+'</i></b></span></div>'
    +(R.weak>-1?'<button class="hs-pill" onclick="hajjPractise('+R.weak+')" aria-label="Practise your weakest level: '+esc(qzLvName(R.weak,1))+'"><span class="hs-cw"><small class="hs-ce">Weakest · '+qzLvName(R.weak)+'</small><span class="hs-ct">'+qzLvName(R.weak,1)+'</span></span><span class="hs-go">'+mk('arrow')+'</span></button>':'')
    +'<p class="qr-note">Knowledge only — your quiz, cards and the five days read. It cannot measure intention or acceptance; that is with Allah.</p>';}
function renderLevels(){
  qzActive=false;
  var h='',wc=qzWrongCount(),nx=qzNext(),cur=qzST.cur,qc=0,qt=0,S=qzSeq();
  S.forEach(function(i){var n=qzN(i);qt+=n;qc+=Math.round((qzST.best[i]||0)/100*n);});
  /* P-23: a half-finished level survives tab changes and reloads (a level hidden by the journey is dropped) */
  if(cur&&cur.hist&&cur.hist.length){var lvOK=cur.mode==='mist'||qzVis(cur.lv),tot=cur.mode==='mist'?(cur.queue||[]).length:(lvOK?qzN(cur.lv):0);
    if(lvOK&&tot&&cur.i<=tot)h+='<div class="qz-resume"><div class="t"><b>Resume '+(cur.mode==='mist'?'Mistake review':qzLvName(cur.lv)+' · '+qzLvName(cur.lv,1))+'</b><small>Q'+(Math.min(cur.i,tot-1)+1)+'/'+tot+' · '+cur.score+' ✓ so far</small></div><button class="btn gold" onclick="qzResume()">Resume</button><button class="chip-btn" onclick="qzDiscard()" aria-label="Discard the unfinished level">✕ Discard</button></div>';
    else{delete qzST.cur;qzSave();}}
  /* P-25: one primary answer to "what next?" */
  function qzPill(ey,ln,ic){return '<span class="hs-cw"><small class="hs-ce">'+ey+'</small><span class="hs-ct">'+ln+'</span></span><span class="hs-go">'+mk(ic)+'</span>';}
  if(nx>-1)h+='<button class="btn gold qz-cta" onclick="startLevel('+nx+')">'+qzPill((qzST.best[nx]!==undefined?'Retake':'Continue')+' · '+qzLvName(nx)+'<span class="qzc-n"> · '+qzN(nx)+' questions</span>',qzLvName(nx,1),qzST.best[nx]!==undefined?'refresh':'arrow')+'</button>';
  else if(wc>0)h+='<button class="btn gold qz-cta" onclick="startMistakes()">'+qzPill('Practice','Review '+wc+' mistake'+(wc===1?'':'s'),'refresh')+'</button>';
  else h+='<button class="btn gold qz-cta" onclick="makeCert()">'+qzPill('All levels passed','Download my certificate','medal')+'</button>';
  h+='<div class="qz-sub"><span>'+qc+' of '+qt+' questions correct in your best runs</span>'+(nx>-1&&wc>0?'<button class="chip-btn gsoft" onclick="startMistakes()">🔁 Review '+wc+' mistake'+(wc===1?'':'s')+'</button>':'')+'</div>';
  S.forEach(function(i){
    var un=qzUnlocked(i),ps=qzPassed(i),best=qzST.best[i],w=qzWrongIn(i),n=qzN(i),need=qzNeed(n),nm=qzLvName(i)+' · '+qzLvName(i,1);
    h+='<div class="lvl'+(un?'':' locked')+(ps?' passed':'')+(i===nx?' next':'')+'" role="button" tabindex="0"'+(un?'':' aria-disabled="true"')+' aria-label="'+esc(nm)+(ps?', passed '+best+'%':(best!==undefined?', best '+best+'%':''))+(un?(i===nx?', up next':''):', locked')+'" onclick="startLevel('+i+')">'
      +qzDisc(i,un)
      +'<div class="lvl-t"><b>'+nm+'</b><small>'+qzLvDesc(i)+' · <span class="ty-nw">'+n+' questions</span> · <span class="ty-nw">pass = '+need+' correct</span>'+(ps&&w?' · <span class="ty-nw">'+w+' to review</span>':'')+'</small>'+(un&&!ps?'<button class="lvl-study" onclick="event.stopPropagation();qzStudyGo('+i+')" aria-label="Study for '+qzLvName(i)+'">📚 study</button>':'')+'</div>'
      +'<div class="lvl-s">'+(ps?'✓ '+best+'%':(best!==undefined?best+'%':(un?'Start →':'Locked')))+'</div></div>';
  });
  if(qzST.free)h+='<p class="qz-free">🔓 All levels unlocked · <button class="lnk" onclick="qzFree(false)">Restore guided order</button></p>';
  else if(qzFreeAll())h+='<p class="qz-free">🔓 All levels open — you have been before.</p>';
  if(qzAllPassed())h+='<div class="note" style="margin-top:10px">🏆 Circuit complete! You have the knowledge — now go with presence of heart. Taqabbal Allah.</div>'+(wc>0?'<button class="btn ghost" onclick="makeCert()">🎖️ Download my certificate</button>':'');
  document.getElementById('qzArea').innerHTML=h;
  qzMeterUpd();renderLearnQuiz();
}
function startLevel(i){
  if(!qzVis(i))return;
  if(!qzUnlocked(i)){qzLockCard(i);return;}
  qzMode='level';qzLevel=i;qzI=0;qzScore=0;qzHist=[];qzRun=[];qzActive=true;
  qzOrder=null;if(qzPassed(i)){qzOrder=qzShuffle(qzQs(i).map(function(_,k){return k;}));}
  delete qzST.cur;qzSave();renderQz();jumpTo('qzArea',true);
}
/* P-30: a locked row explains the gate and offers to open every level */
function qzLockCard(i){var pi=qzPrevVis(i),n=qzN(pi),need=qzNeed(n);vib([50,40,50]);
  document.getElementById('qzArea').innerHTML='<div class="qz-lock"><div class="big">'+mk('lock')+'</div><h4>'+qzLvName(i)+' is locked</h4><p>Pass '+qzLvName(pi)+' · '+qzLvName(pi,1)+' first — '+need+' of '+n+' correct (80%). Been before, or want the harder levels now? Open them all; the certificate still needs every level passed.</p><button class="btn gold" onclick="startLevel('+pi+')">▶ Take '+qzLvName(pi)+'</button><button class="btn ghost" onclick="qzFree(true)">🔓 Unlock all levels</button><button class="btn ghost" onclick="renderLevels()">← All levels</button></div>';
  jumpTo('qzArea',true);}
function startMistakes(level){
  var S=qzSeq();
  qzQueue=Object.keys(qzST.wrong).map(qzRef).filter(function(x){return x&&(level===undefined||x.lv===level);})
    .sort(function(a,b){return S.indexOf(a.lv)-S.indexOf(b.lv)||a.qi-b.qi;});
  if(!qzQueue.length){toast('No mistakes to review — mashallah!');return;}
  qzMode='mist';qzI=0;qzScore=0;qzHist=[];qzRun=[];qzOrder=null;qzActive=true;qzLevel=level===undefined?-1:level;delete qzST.cur;qzSave();renderQz();jumpTo('qzArea',true);
}
/* P-23: resume state = the next unanswered question */
function qzCurSave(){qzST.cur={mode:qzMode,lv:qzLevel,i:qzHist.length,score:qzScore,hist:qzHist.slice(),queue:qzMode==='mist'?qzQueue:null,order:qzOrder,run:qzRun.slice()};}
function qzResume(){var c=qzST.cur;if(!c||!c.hist||!c.hist.length){renderLevels();return;}
  qzMode=c.mode==='mist'?'mist':'level';qzLevel=c.lv===undefined?0:c.lv;qzQueue=(c.queue||[]).filter(function(x){return x&&qzRef('l'+x.lv+'q'+x.qi);});
  if((qzMode==='level'&&!qzVis(qzLevel))||(qzMode==='mist'&&!qzQueue.length)){qzDiscard();return;}
  var tot=qzTotal();qzHist=c.hist.slice(0,tot);qzScore=Math.min(c.score||0,qzHist.length);qzRun=(c.run||[]).slice(0,qzHist.length);qzOrder=(c.order&&c.order.length===tot)?c.order:null;qzActive=true;
  if(c.i>=tot){qzI=tot-1;nextQz();return;}
  qzI=Math.max(0,c.i);renderQz();jumpTo('qzArea',true);}
function qzDiscard(){delete qzST.cur;qzSave();renderLevels();}
function qzExit(){if(qzHist.length)qzCurSave();else delete qzST.cur;qzSave();renderLevels();vib(8);}
function qzOpts(q){return q.o?q.o:['True','False'];}
function qzAns(q){return q.o?q.a:(q.a===0?0:1);}
function qzDots(n){var h='';for(var i=0;i<n;i++){h+='<i class="'+(i<qzHist.length?(qzHist[i]?'f':'w'):'')+'"></i>';}return '<div class="qz-dots" role="img" aria-label="Question '+(qzI+1)+' of '+n+'">'+h+'</div>';}
function renderQz(){
  qzLock=false;
  var q=curQ(),tot=qzTotal(),opts=qzOpts(q),r=curRef();
  qzPerm=opts.map(function(_,i){return i;});if(q.o)qzShuffle(qzPerm);
  var head=qzMode==='mist'?mk('refresh','mkt')+'Mistake review':mk(qzLvMk(qzLevel),'mkt')+qzLvName(qzLevel),need='',tag=qzHtTag(q);
  if(qzMode==='level'){var left=qzNeed(tot)-qzScore,rem=tot-qzI;
    need=left<=0?'<span class="qz-need ok">pass secured ✓</span>':left<=rem?'<span class="qz-need gold">'+left+' more to pass</span>':'<span class="qz-need">keep going — mistakes go to your review list</span>';}
  else need='<span class="qz-need">'+qzLvName(r.lv)+' · '+qzLvName(r.lv,1)+'</span>';
  var h='<div class="qz-top"><span>'+head+' · Q'+(qzI+1)+'/'+tot+(qzMode==='level'?' · '+qzScore+' ✓':'')+'</span><span class="qz-exit" role="button" tabindex="0" onclick="qzExit()">✕ Exit</span></div>'
    +'<div class="qz-needrow">'+(tag?'<span class="qz-ht">'+tag+'</span>':'')+need+'</div>'+qzDots(tot)+'<div class="qz-q">'+q.q+'</div>';
  qzPerm.forEach(function(j,i){h+='<button class="qz-o" id="qzo-'+i+'" onclick="answerQz('+i+')">'+(q.o?String.fromCharCode(65+i)+'. ':'')+opts[j]+'</button>';});
  h+='<div id="qzFb" aria-live="polite"></div><p class="qz-keys">Keys: '+(q.o?'1–'+opts.length+' or A–'+String.fromCharCode(64+opts.length):'T or F')+' to answer · Enter for next · Esc to exit</p>';
  document.getElementById('qzArea').innerHTML=h;
}
function answerQz(i){
  if(qzLock)return;qzLock=true;
  var q=curQ(),ans=qzAns(q),ok=qzPerm[i]===ans,r=curRef();
  qzHist.push(ok);qzRun.push({lv:r.lv,qi:r.qi,ok:ok,ch:qzPerm[i]});
  if(ok){qzScore++;vib(30);delete qzST.wrong[curKey()];}else{vib([60,40,60]);qzST.wrong[curKey()]=1;}
  qzCurSave();qzSave();
  var re=document.getElementById('qzo-'+qzPerm.indexOf(ans));if(re)re.classList.add('right');
  if(!ok)document.getElementById('qzo-'+i).classList.add('wrong');
  document.querySelectorAll('#qzArea .qz-o').forEach(function(b){b.setAttribute('aria-disabled','true');});
  document.getElementById('qzFb').innerHTML='<div class="qz-x">'+(ok?mk('check','mkt')+'Correct! ':mk('close','mkt')+'<span class="srx">Not quite. </span>')+q.e+(q.src?' '+qzSrc(q):'')+'</div><button class="btn" id="qzNextBtn" onclick="nextQz()">'+(qzI<qzTotal()-1?'Next question →':'See my score')+'</button>';
  if(document.documentElement.classList.contains('kbd')){var nb=document.getElementById('qzNextBtn');if(nb)try{nb.focus({preventScroll:true});}catch(e){}}
}
/* Q2: the review list after every run — ✓ / ✗, your answer struck through, the right one, the explanation folded, the source chip */
function qzReviewHTML(){if(!qzRun.length)return '';var nOk=qzRun.filter(function(x){return x.ok;}).length;
  return '<div class="qz-rev"><div class="qz-rev-h"><b>Review this run</b><small>'+nOk+' right · '+(qzRun.length-nOk)+' missed</small></div><ol>'+qzRun.map(function(x){var L=QUIZ_LEVELS[x.lv],q=L&&L.qs[x.qi];if(!q)return '';var O=qzOpts(q),A=qzAns(q);
    return '<li class="'+(x.ok?'ok':'no')+'"><span class="qz-rm">'+mk(x.ok?'check':'close')+'<span class="srx">'+(x.ok?'Right: ':'Missed: ')+'</span></span><div class="qz-rb"><p class="qz-rq">'+q.q+'</p>'
      +'<p class="qz-ra">'+(x.ok?'':'<s>'+O[x.ch]+'</s><span class="srx"> (your answer)</span> ')+'<b>'+O[A]+'</b></p>'
      +'<details><summary>Why</summary><p>'+q.e+'</p>'+qzSrc(q)+'</details></div></li>';}).join('')+'</ol></div>';}
function nextQz(){
  if(qzI<qzTotal()-1){qzI++;renderQz();return;}
  qzActive=false;delete qzST.cur;
  if(qzMode==='mist'){
    var cleared=qzScore,tot0=qzQueue.length,lvM=qzLevel,left=lvM>-1?qzWrongIn(lvM):qzWrongCount();qzSave();
    document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+cleared+'/'+tot0+'</div><p>mistakes cleared'+(left?' — '+left+' still to master.':' — clean slate, mashallah!')+'</p>'+(left?'<button class="btn gold" onclick="startMistakes('+(lvM>-1?lvM:'')+')">↺ Retry the '+left+' I missed</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>'+qzReviewHTML()+'</div>';
    qzMeterUpd();renderLearnQuiz();return;
  }
  var lv=QUIZ_LEVELS[qzLevel],n=qzN(qzLevel),need=qzNeed(n);
  var pct=Math.round(qzScore/n*100);
  var prevBest=qzST.best[qzLevel]||0;
  if(pct>prevBest){qzST.best[qzLevel]=pct;}
  qzSave();
  var passed=pct>=80,all=qzAllPassed(),msg,btns,nx=-1,nxv=qzNextVis(qzLevel);
  if(passed&&!all)nx=(nxv>-1&&!qzPassed(nxv))?nxv:qzNext();
  if(passed&&all)msg=nxv<0?'Final level passed — the whole circuit is yours!':'Level passed — and that completes the whole circuit!';
  else if(passed)msg='Level passed!'+(nx===nxv&&nx>-1?' '+qzLvName(nx,1)+' is now unlocked.':'');
  else msg='you need '+need+' to pass. Study the section below, then retake.';
  if(passed){toast('🎉 '+qzLvName(qzLevel)+' passed!',true);vib([40,60,120]);confetti(all?160:70);}
  if(all&&!planChk['quiz80']){planChk['quiz80']=true;save('us-plan',planChk);updPlan();toast('🏆 Knowledge circuit complete!',true);}
  ST.quizBest=Math.max(ST.quizBest||0,pct);saveST();
  chkBadges();qzMeterUpd();
  var wl=qzWrongIn(qzLevel),wc=qzWrongCount(),retry='<button class="btn '+(passed?'gold':'ghost')+'" onclick="startMistakes('+qzLevel+')">↺ Retry the '+wl+' I missed</button>';
  /* P-24 / P-26: the primary button is always the next step — on a pass with misses, that is the misses (Q2) */
  if(passed&&all)btns='<button class="btn gold" onclick="makeCert()">🎖️ Get my certificate</button>'+(wl?retry.replace('btn gold','btn ghost'):'')+(wc>wl?'<button class="btn ghost" onclick="startMistakes()">🔁 Review all my mistakes ('+wc+')</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else if(passed)btns=(wl?retry:'')+'<button class="btn '+(wl?'ghost':'gold')+'" onclick="startLevel('+nx+')">▶ Start '+qzLvName(nx,1)+'</button>'+(pct<100&&!wl?'<button class="btn ghost" onclick="startLevel('+qzLevel+')">↺ Retake level</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else btns='<button class="btn gold" onclick="startLevel('+qzLevel+')">↺ Retake level</button>'+(wl?retry:'')+'<button class="btn ghost" onclick="qzStudyGo('+qzLevel+')">📚 Study this level</button>'+(lv.rites?'<button class="btn ghost" onclick="goTab(\'umrah\',\'steps\','+(journey()==='hajj'?'\'hajjContainer\'':'null')+')">📋 Open the rites guide</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+pct+'%</div><p>'+qzScore+' of '+n+' correct — '+msg+'</p>'+btns+qzReviewHTML()+'</div>';
  renderLearnQuiz();
}
/* Q5: in a level — 1–4 or A–D answers, T / F for true or false, Enter or Space goes on, Esc exits (the resume row keeps your place).
   F5: on a flashcard — Space / Enter flips; then ← or 1 = Again, → or 2 = Got it; Esc ends the session. The key hint shows to keyboard users only. */
function qzKeys(e){var a=document.getElementById('qzArea');if(!a||!a.offsetParent||!a.querySelector('.qz-top'))return false;var k=e.key,onCtl=e.target&&e.target.closest&&e.target.closest('button,a,summary,[role="button"],[role="checkbox"]');
  if(k==='Escape'){qzExit();return true;}
  if(!qzLock){var q=curQ(),n=qzOpts(q).length,i=-1;
    if(/^[1-9]$/.test(k))i=+k-1;else if(q.o&&/^[a-z]$/i.test(k))i=k.toUpperCase().charCodeAt(0)-65;else if(!q.o&&/^[tf]$/i.test(k))i=qzPerm.indexOf(/t/i.test(k)?0:1);
    if(i>-1&&i<n){answerQz(i);return true;}return false;}
  if((k==='Enter'||k===' ')&&!onCtl){nextQz();return true;}
  return false;}
document.addEventListener('keydown',function(e){if(e.altKey||e.ctrlKey||e.metaKey)return;var t=e.target,tg=(t&&t.tagName)||'';
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(tg)||(t&&t.isContentEditable))return;
  if(e.key==='Tab'||/^Arrow/.test(e.key))document.documentElement.classList.add('kbd');
  if(document.querySelector('.sheet-o.on,.focus.on'))return;
  if((qzActive&&qzKeys(e))||(fcQueue.length&&fcKeys(e))){document.documentElement.classList.add('kbd');e.preventDefault();}});
document.addEventListener('pointerdown',function(){document.documentElement.classList.remove('kbd');},true);

/* ════════════════════════ RITES ════════════════════════ */
/* U-17: a step may carry one dua or an array of duas (an optional one is marked opt:'label') */
function stDuas(st){return st.dua?(Array.isArray(st.dua)?st.dua:[st.dua]):[];}
function duaHTML(st,d,i){var lbl=d.opt?d.opt:'Dua'+(st.rep?' · <span class="rep">↻ '+st.rep+'</span>':'');
  return '<div class="dua tapable'+(d.opt?' duaopt':'')+'" onclick="event.stopPropagation();openRiteDua(\''+st.id+'\','+(i||0)+')"><div class="dua-top"><small>'+lbl+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'<span>Listen</span></button></div><span class="ar" lang="ar" dir="rtl">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span>'+(d.s?'<span class="src">'+d.s+'</span>':'')+'<button type="button" class="enl" aria-label="Open this dua full screen">⛶ tap to enlarge</button></div>';}
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
function troubleSheet(src){var HJ=journey()==='hajj',rm=HJ&&(src==='rami'||ramiFocusOn()),hj=HJ&&(rm||focusKey==='rami'||tmHajj());
  /* G2 #15: at the jamarat the pebble problems come first, each with its counter action; the days-of-Hajj problems follow */
  openSheet('<div class="sheet-h danger">'+mk('alert')+'</div><h3>Something wrong?</h3><p>Tap a question — your count is not touched'+(rm?' unless you tap its button':'')+'.</p>'+(rm?'<div class="rp-list" id="ramiProb">'+ramiProbHTML()+'</div><div class="subt" style="margin-top:14px">Other problems in the days of Hajj</div>':'')+accs(hj?TROUBLE_HAJJ:troubleList())+'<button class="btn ghost" onclick="closeSheet()">Back to the counter</button>');}
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
function nextRite(){if(hajjPart2Active())return hajjNow();var L=riteList();for(var i=0;i<L.length;i++){var st=L[i].st;if(riteChk[st.id])continue;
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
  else{s.classList.remove('done');var k=nx.today?'Today · '+secShort(nx.ph)+' · step '+nx.n+' of '+L.length:(nx.hajj?'Part 2 · step ':'Step ')+nx.n+' of '+L.length;
    s.innerHTML='<div class="now-l" role="button" tabindex="0" aria-label="Go to step '+nx.n+'" onclick="openRiteStep(\''+nx.st.id+'\')"><span class="now-k">'+k+'</span><b class="now-t">'+fcText(riteStepView(nx.st).b)+'</b></div><button class="now-tick" onclick="'+(nx.hajj?'togHajj':'togRite')+'(\''+nx.st.id+'\')" aria-label="Mark step '+nx.n+' done">✓ Done</button>';}}
function updRites(){
  tmAuto();
  var R=riteTotals(),tot=R.tot,done=R.done;
  var L=riteList();
  RITES.forEach(function(ph){ph.steps.forEach(function(st){var on=!!riteChk[st.id];var w=document.getElementById('rw-'+st.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});
    var c=riteCounts(ph.steps),sp=document.getElementById('sp-'+ph.id);
    if(sp){var mine=L.filter(function(x){return x.ph===ph;}),lo=mine.length?mine[0].n:0,hi=mine.length?mine[mine.length-1].n:0;
      /* U-10: global numbering — pending 'steps 6–12', in progress '3/7', finished '✓ done' */
      /* Qiran / Ifrad: Phase 4 has no step here (no cut until the 10th) — the chip points to Part 2, never "step 0" */
      sp.textContent=c.done>=c.tot&&c.tot?'✓ done':c.done?c.done+'/'+c.tot:!mine.length?(journey()==='hajj'?'in Part 2':''):(lo===hi?'step '+lo:'steps '+lo+'–'+hi);sp.classList.toggle('ok',c.tot>0&&c.done>=c.tot);}});
  var rd=document.getElementById('riteDone');if(rd)rd.classList.toggle('ready',!!(riteChk.cut||riteChk.cutw));
  updHajjRites();if(journey()!=='hajj')renderCatch();renderRami();
  renderRiteNow();if(walkOpen)renderWalk();
  renderCnt('tawaf');renderCnt('sai');renderLog();renderUmrahs();updWudu();renderCntHd();renderRiteHero();renderHajjCnt();updCntLayout();
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
  /* 6.5 (G1 #3): on the days of Hajj the hero answers "what now?" from hajjNow() — unless a tawaf or sa'i count is running, which always wins */
  var hero=document.getElementById('riteHero'),hk=hero?hero.querySelector('.k'):null,kick=HJ?'Hajj · live':'Umrah · live',tap='',P2=hajjPart2Active(),subLive=null;
  /* a Hajj tawaf / sa'i that has just been completed keeps its hand-off copy for 3 hours, then "what now?" takes over again */
  var hl=ST.hlog||{},hEnd=Math.max(hl.ifadahEnd||0,hl.hsaiEnd||0,hl.wadaEnd||0);
  var running=(ST.tawaf>0&&ST.tawaf<7)||(ST.sai>0&&ST.sai<7)||(ST.tawaf>=7&&ST.sai===0&&saiPending()&&(m!=='ifadah'||hajjSaiNeeded()))||(tmHajj()&&(ST.tawaf>0||ST.sai>0)&&Date.now()-hEnd<3*3600e3);
  if(P2&&!running){var hd=hajjDay(),x=hajjNow(),rh=ramiHero(hd);
    if(rh){kick='Hajj · '+hd+' Dhul Hijjah · Rami';title=rh.t;sub=rh.s;tap='openRami('+hd+')';}
    else if(x){var sv=riteStepView(x.st);kick=x.today?'Hajj · '+(x.today==='post'?'':x.today+' Dhul Hijjah · ')+secShort(x.ph):'Hajj · live';title=fcText(sv.b);if(title.length>32&&title.indexOf(' — ')>=12)title=title.split(' — ')[0];if(x.st.counter==='rami'&&title.indexOf(', ')>24)title=title.slice(0,title.indexOf(', '));sub=secSub(x.ph);
      if(x.today===9&&x.ph.id==='hd9'){var A=arafahNow();sub=A.ph==='set'?'Sunset ≈ '+A.sun+' has passed — when the disc has gone, leave calmly with your group':(A.ph==='last'?'The last hour of Arafah — make dua · ':'Sunset ≈ '+A.sun+' · ')+'{L} left · follow your group';subLive=A.sunM;}
      tap='openRiteStep(\''+x.st.id+'\')';}
    else{title=hajjReady()?'Every step is ticked — record your Hajj':'Hajj complete? Check the pillars';sub='Part 2 · '+(hajjReady()?'may Allah accept it':'still to tick: '+hajjMissing().join(' · '));tap='jumpTo(\'hajjDone\')';}}
  else if(tmHajj()){var hn=TM[m].h.replace(/^\S+ /,''),hs=TM[m].sai,t2=tahallul2(),left=hajjSaiLeft().join(' and ');
    if(ST.tawaf>0&&ST.tawaf<7){title=hn+' · round '+(ST.tawaf+1)+' of 7';sub='Ordinary pace, no raml · Kaaba on your left · tap the ring after each round';}
    else if(ST.tawaf>=7&&hs&&ST.sai>0&&ST.sai<7){title='Sa’i of Hajj · lap '+(ST.sai+1)+' of 7';sub=saiHill(ST.sai);}
    else if(ST.tawaf>=7&&hs&&ST.sai>=7){title=t2?'Second tahallul — alhamdulillah':'Tawaf & sa’i of Hajj done';sub=t2?'Tawaf and sa’i of Hajj done · everything is allowed again · back to Mina':'Still to do: '+left+' · the full release (second tahallul) comes only after that';}
    else if(ST.tawaf>=7&&hs){title=hajjSaiNeeded()?'Next: the sa’i of Hajj':hn+' done'+(t2?' — second tahallul':'');sub=hajjSaiNeeded()?'2 rakahs, Zamzam, then Safa — the sa’i counter is below':(t2?'Your sa’i is already done — nothing more is needed':'Your sa’i is already done · still to do: '+left);}
    else if(ST.tawaf>=7){title=hn+' done — go with Allah’s peace';sub='2 rakahs if you can, a last Zamzam, a last dua — then leave Makkah';}
    else{title='Ready: '+hn.toLowerCase();sub=ST.wudu?'Ordinary clothes, no raml · start at the Black Stone corner':'Make wudu, then start at the Black Stone corner';}}
  else if(m==='nafl'&&ST.tawaf>0&&ST.tawaf<7){title='Nafl tawaf · round '+(ST.tawaf+1)+' of 7';sub='Normal pace · Kaaba on your left · tap the ring after each round';}
  else if(hq){title='Taqabbal Allah!';sub='Umrah complete — record it under the sa’i counter';}
  else if(sa>=7&&HJ&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu'){title='Stay in ihram — Part 2 on 8 Dhul Hijjah';sub='Arrival tawaf &amp; sa’i done · no cutting until the 10th · keep the talbiyah';}
  else if(sa>=7&&halqUnconfirmed()){title='Before cutting: what did you say at the miqat?';sub='Tamattu’ cuts now · Qiran / Ifrad stay in ihram until the 10th — the app asks at the halq step';}
  else if(sa>=7){title='Next: Halq / taqsir';sub='Men shave or trim · women trim a fingertip — ihram ends after cutting';}
  else if(sa>0){title='Sa’i · lap '+(sa+1)+' of 7';sub=saiHill(sa);}
  else if(tw>=7){title='Next: Sa’i';sub='2 rakahs at Maqam Ibrahim, Zamzam, then Safa';}
  else if(tw>0){title='Tawaf · round '+(tw+1)+' of 7';sub='Kaaba on your left · tap the ring after each round';}
  else if(ih){title='Next: Tawaf';sub=ST.wudu?'Start at the Black Stone corner':'Make wudu, then start at the Black Stone corner';}
  else{title='Ready to begin';sub='Ghusl & ihram at the miqat · wudu before tawaf';}
  t.classList.toggle('long',String(title).length>56);
  var tq=/^(.*\S) · ((?:round|lap|pebble) \d of 7)$/.exec(title);if(tq)t.innerHTML=esc(tq[1])+'<span class="rh-dot"> ·</span> <span class="rh-2">'+tq[2]+'</span>';else t.textContent=title;
  if(hk)hk.innerHTML=mk(HJ?'tent':'kaaba','mkt')+esc(kick);if(hero){hero.classList.toggle('hj-go',/ · pebble \d of 7$/.test(title));hero.classList.toggle('hj-p2',P2&&!running);}
  if(hero){if(tap){hero.setAttribute('role','button');hero.setAttribute('tabindex','0');hero.setAttribute('aria-label',kick+': '+title+' — open');hero.setAttribute('onclick',tap);hero.classList.add('tapable');}
    else{hero.removeAttribute('role');hero.removeAttribute('tabindex');hero.removeAttribute('aria-label');hero.removeAttribute('onclick');hero.classList.remove('tapable');}}
  /* the four Umrah rites as the Home card's segmented bar (the ihram time and durations live in the log under the counters) */
  var cur=!ih?0:tw<7?1:sa<7?2:!hq?3:4,segs=(tmHajj()||hajjPart2Active())?'':riteSegs(cur,[ih?1:0,Math.min(7,tw)/7,Math.min(7,sa)/7,hq?1:0]);
  var n=totalUmrahs();
  var sgEl=document.getElementById('riteSegs');if(sgEl){sgEl.innerHTML=segs;sgEl.hidden=!segs;}
  s.innerHTML='<span class="rh-s">'+(subLive!==null?esc(sub).replace('{L}',hjLiveHTML(subLive)):esc(sub))+'</span>'+(sgEl?'':segs)+(n?'<span class="rh-n">'+mk('kaaba','mkt')+n+' Umrah'+(n===1?'':'s')+' completed'+(ST.umrahsPrev?' (incl. '+ST.umrahsPrev+' before this app)':'')+'</span>':'');
  var pct=umrahPct();if(hajjPart2Active()){var HT=hajjTotals();pct=HT.tot?Math.round(HT.done/HT.tot*100):0;}animPct('ritePct',pct);setRing('riteRing',pct);
  var rk=document.querySelector('#riteHero .ring-num small');if(rk)rk.textContent=hajjPart2Active()?'Hajj':'Umrah';
}
/* ── round-by-round coaching (U-01 / U-21 / U-07): index k = guidance for the round you are NOW in (k rounds done), index 7 = completion.
   Each entry = [action line, reflective line]. Religious content unchanged; men/women differences stated where they exist. ── */
var TAWAF_TIPS=[
 ['Start at the Black Stone corner — "Bismillahi wallahu akbar", Kaaba on your left.','Men: brisk short steps (raml); women: normal pace. Touch the Yamani corner only if easy, then "Rabbana atina…".'],
 ['Keep your pace (raml for men).','Any dhikr or dua you love — nothing fixed.'],
 ['Last raml round for men.','Guard your gaze and tongue; crowded? use the outer ring or upper floor — it counts.'],
 ['Normal pace now.','Dua for your parents and those who asked you.'],
 ['Istighfar.','Don’t push at the Stone — point and say Allahu Akbar.'],
 ['Salawat on the Prophet ﷺ.','Keep your group in sight — agree a meeting point now.'],
 ['Last round — finish at the Black Stone corner.','Then men cover both shoulders; 2 rakahs behind Maqam Ibrahim.'],
 ['Tawaf complete.','Men: cover both shoulders again. 2 rakahs behind Maqam Ibrahim — anywhere in the mosque if crowded — then Zamzam.']];
var SAI_TIPS=[
 ['On Safa: face the Kaaba, praise Allah, repeat the dhikr 3× with your own duas.','Safa → Marwah. Men jog lightly between the green lights; women walk throughout.'],
 ['Back to Safa.','Remember Hajar’s trust: "He will not abandon us" (Bukhari 3364).'],
 ['The Prophet ﷺ made dua on Safa and Marwah — pour out your heart.','Ask for yourself, your family and everyone who asked you.'],
 ['Halfway.','Sip Zamzam from the coolers if you need to.'],
 ['Dua for the ummah.','The angel says "Amin, and for you the same" (Muslim 2733).'],
 ['One to go.','Salawat and istighfar.'],
 ['Last lap · Safa → Marwah — you finish on Marwah.','Then halq / taqsir.'],
 ['Sa’i complete.','Men: shave (best) or trim; women: trim a fingertip’s length — never shave. Your Umrah is done. Taqabbal Allah!']];
var NAFL_TIPS=[
 ['Start at the Black Stone corner — "Bismillahi wallahu akbar", Kaaba on your left.','Normal pace for everyone — no raml or idtiba’ in a nafl tawaf. Touch the Yamani corner only if easy, then "Rabbana atina…".'],
 ['Any dhikr or dua you love — nothing fixed.','Every step is worship — there is no set formula.'],
 ['Guard your gaze and your tongue.','Crowded? The upper floors count just the same.'],
 ['Dua for your parents and those who asked you.','Between the Yamani corner and the Stone: "Rabbana atina…".'],
 ['Istighfar.','Don’t push at the Stone — point and say Allahu Akbar.'],
 ['Salawat on the Prophet ﷺ.','Keep your group in sight.'],
 ['Last round — finish at the Black Stone corner.','Then 2 rakahs anywhere in the mosque.'],
 ['Nafl tawaf complete.','2 rakahs anywhere in the mosque, then Zamzam.']];
function saiHill(v){return v>=7?'Finished on Marwah':(v%2===0?'On Safa → walk to Marwah':'On Marwah → walk to Safa');}
function tipHTML(k,v){var T=k==='tawaf'?tawafTips(tmode()):saiTips(),t=T[Math.min(7,v)]||['',''],u=k==='tawaf'?'round':'lap';
  return (k==='sai'?'<span class="tip-h">'+saiHill(v)+'</span>':'')+'<b class="tip-a">'+(v<7?'Now: '+u+' '+(v+1)+' of 7 · ':'')+t[0]+'</b>'+(t[1]?'<span class="tip-r">'+t[1]+'</span>':'');}
function duaIdx(word){for(var i=0;i<DUAS.length;i++){if(DUAS[i].t.indexOf(word)>-1)return i;}return -1;}
/* U-09: the dua of this rite, always under the counter */
function cntDuaHTML(k){var i=duaIdx(k==='tawaf'?'Yamani':'Safa');if(i<0)return '';var d=DUAS[i];
  return '<div class="dua tapable" onclick="openDua('+i+')"><div class="dua-top"><small>'+d.t+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar" dir="rtl">'+d.ar+'</span><span class="tl">'+d.tl+'</span><button type="button" class="enl" aria-label="Open '+d.t.replace(/"/g,'')+' full screen">⛶ tap to enlarge</button></div>';}
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
    var sb=document.getElementById('tawafSub');if(sb)sb.innerHTML=(m==='nafl'?'7 rounds at a normal pace — no raml or idtiba’. Wudu is still required.':m==='umrah'?'7 rounds, counter-clockwise, from the Black Stone corner.':m==='wada'?'The last thing you do in Makkah — 7 rounds in ordinary clothes, no raml, no sa’i after it. Ticks Part 2; your Umrah record is untouched.':'The pillar that completes your Hajj — 7 rounds in ordinary clothes, no raml or idtiba’ (Hanafis and Shafi’is: raml if a sa’i follows), with wudu. Ticks Part 2; your Umrah record is untouched.')+'<br><b>Tap the circle after each round.</b>';
    renderTmodeSeg();}
  renderCntSum(k);
}
/* ── U-04: one big ring per moment ── */
var cntForce={},saiGo=false,layoutHold=0,lastAct='';
function cntActive(){if(tmode()==='nafl'||!tmT('sai'))return 'tawaf';if(ST.tawaf>=7&&(ST.sai>0||saiGo))return 'sai';return 'tawaf';}
function cntStarted(){return ST.tawaf>0||ST.sai>0;}
/* 6.5 (G1 #11): the Counters tab follows the day of Hajj. 8th, 9th and the Muzdalifah night: the day card leads, tawaf and sa'i fold to their rows, wudu and the period link
   wait behind Show. 10th until its stoning is done, and 11th–13th until that day's: the rami card leads above wudu and tawaf / sa'i fold; once the 10th's stoning is done tawaf
   leads again (ifadah). The order changes only on render or navigation (cntNavAt), never under a tap; a running count never folds; a ring the pilgrim opened (cntForce) stays open. */
var cntHM=null,cntNavAt=0;
function cntHajjMode(){if(journey()!=='hajj')return '';var hd=hajjDay();if(typeof hd!=='number')return '';
  if(hd===8||hd===9||(hd===10&&nowMin()<siteTimes('Mina').rise&&!ramiAny(10)))return 'day';
  if(hd>=10&&!(hd===13&&!ST.stay13)&&!ramiClosed(hd))return 'rami';return '';}
function cntVisible(){var v=document.getElementById('view-umrah'),s=document.getElementById('sub-umrah-count');return !!(v&&s&&v.classList.contains('on')&&s.classList.contains('on'));}
function updCntLayout(){var sub=document.getElementById('sub-umrah-count');if(!sub)return;
  if(Date.now()<layoutHold){setTimeout(updCntLayout,layoutHold-Date.now()+60);return;}
  var act=cntActive();if(act!==lastAct){cntForce={};lastAct=act;}
  var want=cntHajjMode();if(want!==cntHM&&(cntHM===null||!cntVisible()||Date.now()-cntNavAt<1500))cntHM=want;
  var hm=cntHM,busy=!!activeCount();
  sub.classList.toggle('started',cntStarted());sub.classList.toggle('rite-tawaf',act==='tawaf');sub.classList.toggle('rite-sai',act==='sai');sub.classList.toggle('hj-'+'day',hm==='day');sub.classList.toggle('hj-rami',hm==='rami');
  var at=document.getElementById('cntHd');(['hajjDayCard'].concat(hm==='rami'?['ramiCard','wuduCard','sisLine','tawafCard','saiCard']:['wuduCard','sisLine','tawafCard','saiCard','ramiCard'])).forEach(function(id){var e=document.getElementById(id);if(!e||!at)return;if(at.nextElementSibling!==e)sub.insertBefore(e,at.nextElementSibling);at=e;});
  var dc=document.getElementById('hajjDayCard');if(dc)dc.hidden=hm!=='day'||!dc.innerHTML;
  var hideW=hm==='day'&&!busy&&!cntForce.tawaf;['wuduCard','sisLine'].forEach(function(id){var e=document.getElementById(id);if(e)e.hidden=hideW;});
  var sl=document.getElementById('sisLine'),slt=periodLineT();if(sl&&sl.getAttribute('data-t')!==slt){sl.setAttribute('data-t',slt);sl.innerHTML=markify(slt);}
  ['tawaf','sai'].forEach(function(k){var c=document.getElementById(k+'Card');if(c)c.classList.toggle('compact',(k!==act||(!!hm&&!busy))&&!cntForce[k]);});}
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
function togWudu(){ST.wudu=!ST.wudu;ST.wuduAt=ST.wudu?Date.now():null;saveST();updWudu();renderRiteHero();vib(10);if(ST.wudu)toast('💧 Wudu confirmed — bismillah, begin at the Black Stone corner');}
function updWudu(){var c=document.getElementById('wuduCard'),sw=document.getElementById('wuduSw'),st=document.getElementById('wuduSt');if(!c)return;
  c.classList.toggle('ok',!!ST.wudu);c.setAttribute('aria-checked',ST.wudu?'true':'false');if(sw)sw.classList.toggle('on',!!ST.wudu);
  if(st)st.textContent=ST.wudu?'✓ Wudu made'+(ST.wuduAt?' · '+fmtTime(ST.wuduAt):''):'Not yet — tap to confirm';
  var fw=document.getElementById('focusWudu');if(fw){fw.innerHTML=mk('drop','mkt')+(ST.wudu?'Wudu ✓':'Wudu?');fw.classList.toggle('on',!!ST.wudu);fw.setAttribute('aria-pressed',ST.wudu?'true':'false');fw.hidden=focusKey!=='tawaf';}}
function wuduSheet(){openSheet('<div class="sheet-h">'+mk('drop')+'</div><h3>Are you in wudu?</h3><p>"Tawaf around the House is like salah" (Tirmidhi 960) — it needs wudu. Sa’i does not.</p><button class="btn tall" onclick="wuduYes()">✓ Yes, I have wudu — begin</button><button class="btn ghost tall" onclick="closeSheet()">'+markify('💧 Not yet — I’ll make wudu first')+'</button>');}
function wuduYes(){ST.wudu=true;ST.wuduAt=Date.now();saveST();updWudu();renderRiteHero();closeSheet();cntr('tawaf',1);}
function focusWudu(){
  if(ST.wudu&&ST.tawaf>=1&&ST.tawaf<=6){ST.wudu=false;ST.wuduAt=null;saveST();updWudu();renderRiteHero();
    openSheet('<div class="sheet-h">'+mk('drop')+'</div><h3>Wudu broke mid-tawaf?</h3><p class="lead">Renew your wudu and return. Hanafis and Shafi’is build on the completed rounds — resume where you stopped in the current round, or repeat that round to be safe; Malikis and Hanbalis restart the tawaf from round 1 (reset the counter), which is valid on every view. <b>Building on? Resume round '+(ST.tawaf+1)+'.</b></p><p>Crowding makes this common — no panic, it does not ruin your Umrah. Nothing has been reset.</p><button class="btn tall" onclick="closeSheet()">Got it</button>');return;}
  togWudu();}
/* U-20: a sister whose period starts after ihram — the ruling in seconds, no shaming CTAs */
/* 6.6 (G2 #10): during Part 2 the answer is the Hajj one — TROUBLE_HAJJ hmenses word for word, then what it means for this pilgrim's ticks */
function periodHajj(){return journey()==='hajj'&&hajjPart2Active()&&!hajjRecordedNow();}
function periodLineT(){return periodHajj()?'🌸 Period started? Your Hajj is still valid\u00a0— what\u00a0to\u00a0do':'🌸 Period started? Your ihram is still valid\u00a0— what\u00a0to\u00a0do';}
function periodWada(){togHajj('hwadaEx',true);closeSheet();toast('🌸 Tawaf al-wada marked waived for you — if you are pure before you leave, untick it in Steps');}
function periodSheet(){
  if(periodHajj()){var hm=TROUBLE_HAJJ.filter(function(x){return x.id==='hmenses';})[0]||{b:''},wadaOpen=!(hajjChk.hwada||hajjChk.hwadaw||hajjChk.hwadaEx),saiOpen=hajjSaiNeeded()&&!hajjChk.h10sai;
    openSheet('<div class="sheet-h rose">'+mk('flower')+'</div><h3>Period started? Your Hajj is intact</h3><div class="sheet-txt" id="periodHajj">'+hm.b+'</div>'
      +(!hajjChk.h10ifadah?'<div class="note" id="periodLeft">'+mk('clock','mkt')+'Still to do when pure: <b>tawaf al-ifadah</b>'+(saiOpen?' (and the sa’i after it)':'')+'</div>':'')
      +(dayExcused()?'':'<button class="btn rose" onclick="setExcused(true)">'+markify('🌸 Mark today excused')+'</button>')
      +(wadaOpen?'<button class="btn ghost" id="periodWadaBtn" onclick="periodWada()">Still on my period when I leave: tawaf al-wada is waived — tick it</button>':'')
      +'<button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'learn\',\'sisCard\')">'+markify('🌸 Read the full sisters’ guide')+'</button><button class="btn" onclick="closeSheet()">Got it</button>');return;}
  openSheet('<div class="sheet-h rose">🌸</div><h3>Period started? Your ihram is still valid</h3>'
  +'<p class="lead">When Aishah (RA) got her period at Sarif, the Prophet ﷺ told her: <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p>'
  +'<ul><li>Your ihram stays valid — stay in it.</li><li>Keep up the talbiyah, dhikr and dua; the Haram courtyards are open to you.</li><li>Do not enter tawaf. Delay tawaf — and the sa’i after it — until you are pure, then ghusl, tawaf and sa’i. Nothing is lost.</li><li>If you leave Makkah while still on your period, no farewell tawaf is owed (Bukhari 1755) — and for Umrah many scholars require none at all.</li></ul>'
  +'<p class="lead"><b>Departing within days?</b> Ask a scholar or your group’s alim about the concessions — do not decide alone.</p>'
  +'<p class="lead" style="color:var(--ink2)"><b>Meanwhile</b>, everything else in Daily still counts: dhikr and dua, Quran by listening or tafsir (the Malikis and many scholars, including Ibn Baz, also allow reciting from memory), sadaqah, serving pilgrims, Zamzam, your dua list.</p>'
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
  vib(v===7?[50,60,140]:35);sayCountCnt(k,v,d);
  if(v===7){layoutHold=now+1300;confetti(50);if(k==='tawaf')safaOpen=false;var m=tmode();
    if(k==='tawaf'&&m==='umrah')toast('🕋 Tawaf complete! 2 rakahs at Maqam Ibrahim, Zamzam, then Safa',true);
    else if(k==='tawaf'&&m==='wada')toast('👋 Tawaf al-wada complete — 2 rakahs if you can, Zamzam, and leave with Allah’s peace',true);
    else if(k==='tawaf'&&tmHajj())toast('🕋 '+TM[m].h.replace(/^\S+ /,'')+' complete! 2 rakahs, Zamzam'+(hajjSaiNeeded()?', then the sa’i of Hajj':(tahallul2()?' — second tahallul':' — still to do: '+hajjSaiLeft().join(' and '))),true);
    else if(k==='sai'&&tmHajj())toast('⛰️ Sa’i of Hajj complete — '+(tahallul2()?'the second tahallul, everything is allowed again':'still to do: '+hajjSaiLeft().join(' and ')+' — the full release (second tahallul) comes only after that'),true);
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
  bkNudgeDone('Umrah');
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
  return 'Tawaf and sa’i of Hajj done. Still to do: '+L.join(' and ')+'. The first tahallul comes with any two of stoning, cut and tawaf for Shafi’is and Hanbalis (Hanafis: the cut; Malikis: the stoning); the second — full release, intimacy included — only once all three are done.';}
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
  var T=NAFL_TIPS.map(function(r){return r.slice();});T[0]=[T[0][0],'Normal pace for everyone — no raml or idtiba’ in this tawaf (Hanafis and Shafi’is: raml if a sa’i follows). Touch the Yamani corner only if easy, then "Rabbana atina…".'];
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
/* ── 6.5 (G1) · the days of Hajj, live ──
   hajjNow(): one answer to "what now?" on a day of Hajj — the first open forMe step of TODAY's section(s) (hajjDay() 8–13: the 9th is Arafah + the Muzdalifah night,
   the 10th before sunrise still offers the Muzdalifah night, 'post' and a 13th you are not staying for are the farewell tawaf), then the next open step after them, then hajjNext().
   Info rows are never "now". siteTimes(): today's computed Dhuhr / sunrise / sunset at a site of PT_LL, in minutes after midnight Makkah time — ±2 min, so it is always shown with ≈. */
function nowMin(){var n=riyadhNow();return n.getHours()*60+n.getMinutes();}
function siteTimes(site){var n=riyadhNow(),P=computePT(site,n.getFullYear(),n.getMonth(),n.getDate());return {dhuhr:ptMin(P.t.Dhuhr),asr:ptMin(P.t.Asr),sun:ptMin(P.t.Maghrib),rise:ptMin(P.s)};}
function hajjDaySecs(d){var S=hajjSecs(),L;if(d==='post')return S.filter(function(s){return s.hd===null;});if(typeof d!=='number')return [];L=S.filter(function(s){return s.hd===d;});
  if(d===10&&nowMin()<siteTimes('Mina').rise)L=S.filter(function(s){return s.id==='hd9n';}).concat(L);
  if(!L.length&&d===13)L=S.filter(function(s){return s.hd===null;});return L;}
/* (G1 review) h10udhiyah (Ifrad: no hady owed, an optional udhiyah) never blocks "what now?" — the hero, the Now strip and the Home order card agree on Halq */
function hajjOpen(x,L){var st=x.st;if(hajjChk[st.id]||st.info||st.id==='h10udhiyah')return false;return !(st.pair&&L.some(function(y){return y.st.pair===st.pair&&y.st.id!==st.id&&hajjChk[y.st.id];}));}
function hajjNow(){if(!hajjPart2Active())return null;var hd=hajjDay();if(typeof hd!=='number'&&hd!=='post')return hajjNext();
  var L=hajjList(),ids=hajjDaySecs(hd).map(function(s){return s.id;}),last=-1,i;
  for(i=0;i<L.length;i++)if(ids.indexOf(L[i].ph.id)>-1){last=i;if(hajjOpen(L[i],L)){L[i].today=hd;return L[i];}}
  for(i=last+1;i<L.length;i++)if(hajjOpen(L[i],L))return L[i];
  return hajjNext();}
/* "Arafah", "Muzdalifah", "Yawm an-Nahr", "Tawaf al-Wada" — the place or name part of a Part 2 section title */
function secShort(s){var t=String(s.title||'').split(' — ')[0],i=t.indexOf(' · ');return i>-1?t.slice(i+3):t;}
/* the Arafah sunset (G1 #2/#5/#8): computed for Arafah itself (PT_LL.Arafah, from the 'arafat' place), always ≈ ±2 min and "follow your group" — never "you may leave now" */
function arafahNow(){var S=siteTimes('Arafah'),m=nowMin(),left=S.sun-m;return {sun:minHM(S.sun),sunM:S.sun,dhuhr:minHM(S.dhuhr),left:left,ph:left<=0?'set':left<=60?'last':m<S.dhuhr?'pre':'wuquf',frac:Math.max(0,Math.min(1,left/Math.max(1,S.sun-S.dhuhr)))};}
/* a live countdown: refreshed every 30 s (text only — nothing moves); when one runs out the day cards re-render into their next phase */
function hjLiveHTML(untilMin,cls){var l=untilMin-nowMin();return '<span class="hj-live'+(cls?' '+cls:'')+'" data-until="'+untilMin+'">'+(l>0?fmtDiff(l):'0m')+'</span>';}
function hjLive(){var out=false;document.querySelectorAll('[data-until]').forEach(function(e){var l=+e.getAttribute('data-until')-nowMin();if(l<=0)out=true;var v=l>0?fmtDiff(l):'0m';if(e.textContent!==v)e.textContent=v;});if(out)hjRefresh();}
function hjRefresh(){try{homeRefresh();renderRiteHero();renderCatch();renderHajjCnt();renderRami();renderDuaToday();if(document.getElementById('view-daily').classList.contains('on'))updDaily();}catch(e){}}
setInterval(function(){if(journey()==='hajj'&&document.visibilityState!=='hidden')hjLive();},30000);
function togOn(id){var e=document.getElementById(id);if(e)e.classList.toggle('on');}
function togStay13(){ST.stay13=!ST.stay13;saveST();vib(8);updRites();toast(ST.stay13?'🌅 The 13th is in your plan — stone after midday, then leave':'Leaving on the 12th — be outside Mina before sunset');}
/* one tick row (shared by Part 1 and Part 2): req pill, Why?, Missed it?, delegation toggle, live counter chip, duas */
/* G5 #21: the boundary explainers open from the steps they belong to */
var STEP_WAY={h9arrive:["waySheet('bound-arafah')",'Am I inside Arafah?'],h9nstay:["waySheet('bound-muzdalifah-mina')",'Where Muzdalifah begins and ends']};
function stepRowHTML(st,n,tog,hajj){var v=hajj?riteStepView(st):st,id=st.id,ctr=v.counter,chip='';
  if(id==='rounds'||id==='laps')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goCounter(\''+(id==='rounds'?'tawaf':'sai')+'\')">🔄 Open counter →</button>';
  if(hajj&&ctr==='rami')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();openRami('+st.id.replace(/\D/g,'')+')">🪨 Open the rami counter →</button>';
  else if(hajj&&(ctr==='ifadah'||ctr==='wada'))chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goHajjCounter(\''+ctr+'\')">🔄 Open counter →</button>';
  else if(hajj&&id==='h10sai')chip='<button class="xchip" id="live-'+id+'" onclick="event.stopPropagation();goHajjCounter(\'ifadah\',\'sai\')">🔄 Open the sa’i counter →</button>';
  var acts=(hajj&&v.miss?'<button class="xchip" aria-expanded="false" onclick="event.stopPropagation();togOn(\'miss-'+id+'\');this.setAttribute(\'aria-expanded\',document.getElementById(\'miss-'+id+'\').classList.contains(\'on\'))">🆘 Missed it?</button>':'')
    +(hajj&&v.del?'<button class="xchip del" id="del-'+id+'" role="switch" aria-checked="false" onclick="event.stopPropagation();ramiDel('+st.id.replace(/\D/g,'')+')">🤝 Delegated</button>':'')+chip
    +(hajj&&STEP_WAY[id]?'<button class="xchip" id="way-'+id+'" onclick="event.stopPropagation();'+STEP_WAY[id][0]+'">'+STEP_WAY[id][1]+' →</button>':'')+(hajj&&ctr==='rami'?'<button class="xchip" id="jam-'+id+'" onclick="event.stopPropagation();jamSheet('+st.id.replace(/\D/g,'')+')">The Jamarat, drawn →</button>':'');
  return '<div class="stp" id="rw-'+id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="'+tog+'(\''+id+'\')"><div class="stp-n">'+n+'</div><div class="stp-t"><b>'+v.b+(hajj&&v.req?' <span class="req '+v.req+'">'+v.req+'</span>':'')+'</b><p>'+v.p+(v.why?' <button class="why" onclick="event.stopPropagation();this.parentNode.nextSibling.classList.toggle(\'on\')" aria-label="Why this step?">Why?</button>':'')+'</p>'+(v.why?'<div class="whyb">'+v.why+'</div>':'')
    +(hajj&&v.miss?'<div class="whyb miss" id="miss-'+id+'"><b>Missed it?</b> '+esc(v.miss)+'</div>':'')
    +(v.kid?'<button class="xchip" onclick="event.stopPropagation();openStory(\''+v.kid+'\')">🧒 Story for the kids →</button>':'')
    +(hajj?(acts?'<div class="stp-acts">'+acts+'</div>':''):chip)
    +stDuas(v).map(function(d,k){return duaHTML(st,d,k);}).join('')+corrBtn('step',id)+'</div></div>';}
/* Part 2 · The days of Hajj — one section per day, folded until its date, auto-opened on its day, never hidden once past */
function renderHajjRites(){var hc=document.getElementById('hajjContainer');if(!hc)return;if(journey()!=='hajj'){hc.innerHTML='';return;}
  var hd=hajjDay(),y=curHajjYear(),D=hajjDates(y),ty=hajjType(),n=0,h='';
  h+='<div class="subt" id="hajjPart2">Part 2 · The days of Hajj '+y+'</div><p class="hajj-rule" id="hajjRule">'+mk('alert','mkt')+'<b>Hajj rulings:</b> confirm with your group leader or a scholar.</p>';
  h+='<div class="note" style="margin:0 2px 12px">'+HAJJ_TYPES[ty].t+' — '+HAJJ_TYPES[ty].s+'. <button class="lnk tap44" style="font-size:1em" onclick="goTab(\'more\',\'settings\',\'hajjSet\')">Change type</button> · <button class="lnk tap44" style="font-size:1em" id="hajjIcsLnk" onclick="exportHajjICS()">Add the days to my calendar</button>'+(D[8]?'<br>8 Dhul Hijjah ≈ '+fmtDate(D[8],true)+' · each day opens on its date; nothing closes because a day has passed.':'')+'</div>';
  HAJJ_RITES.forEach(function(s){var inner='',open;
    if(typeof hd==='number')open=s.hd===hd;else open=s.hd===null&&(hd==='post'||!!(hajjChk.h12leave||hajjChk.h13rami));
    if(s.opt==='stay13')inner+='<div class="brg'+(ST.stay13?' done':'')+'" id="stay13Row" role="checkbox" tabindex="0" aria-checked="'+(ST.stay13?'true':'false')+'" onclick="togStay13()"><span class="tick"></span><span>I am staying for the 13th (nafr ath-thani — what the Prophet ﷺ did)</span></div>';
    if(s.kn)inner+='<div class="kn">🧒 '+s.kn+'</div>';
    s.steps.forEach(function(st){if(!forMe(st))return;n++;inner+=stepRowHTML(st,n,'togHajj',true);});
    if(s.id==='hdw')inner+='<div class="brg" id="rw-hwadaEx" role="checkbox" tabindex="0" aria-checked="false" onclick="togHajj(\'hwadaEx\')"><span class="tick"></span><span>'+mk('flower','mkt')+'Waived for me — on my period (sisters) or I live in Makkah</span></div>';
    var sec={id:s.id,ico:s.ico,title:s.title+(D[s.hd]?'<small>'+fmtDate(D[s.hd],true)+(s.night?' · night':'')+(s.sub?' · '+secSub(s):'')+'</small>':(s.sub?'<small>'+secSub(s)+'</small>':'')),hn:s.hn};
    h+=mkSec(sec,!open,inner).replace('<div class="sec-bd">','<div class="sec-catch" id="catch-'+s.id+'" hidden></div><div class="sec-bd">');});
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
/* ── 6.6 (G2 #53) · today's rulings on each day of Hajj (8–13), in Steps and on Home ──
   HAJJ_RULINGS is the verified heat-rulings pack verbatim, filtered by its "use" days ("9n" = the Muzdalifah night: shown on the 9th and, first, until sunrise on the 10th).
   The school differences are shown exactly as written; no madhhab picker and no post-prayer reminders. Short chip labels are interface words only. */
var RUL_SHORT={'rule-d9-no-fast':'Fasting at Arafah?','rule-d9-way-talbiyah':'Talbiyah on the way','rule-d9-arafah-prayers':'Prayers at Arafah','rule-d9n-muzdalifah-prayers':'Prayers at Muzdalifah','rule-mina-prayers':'Prayer in Mina','rule-d10-no-eid-prayer':'Eid prayer?','rule-d10-hady-udhiyah':'Hady and udhiyah','rule-d10-13-no-fasting':'Fasting these days?','rule-takbir-words':'Takbir: the words','rule-takbir-times':'Takbir: when'};
function rulesToday(){if(journey()!=='hajj'||typeof HAJJ_RULINGS==='undefined')return null;var hd=hajjDay();if(typeof hd!=='number')return null;
  var night=(hd===9&&arafahNow().left<=0)||(hd===10&&nowMin()<siteTimes('Mina').rise);
  var L=HAJJ_RULINGS.filter(function(r){if(r.id==='rule-mina-prayers'&&hd===13&&!ST.stay13)return false;return r.d.indexOf(hd)>-1||(r.d.indexOf('9n')>-1&&(hd===9||night));});
  if(night)L=L.filter(function(r){return r.d.indexOf('9n')>-1;}).concat(L.filter(function(r){return r.d.indexOf('9n')<0;}));
  return L.length?{hd:hd,L:L,night:night}:null;}
function rulesRowHTML(where){var R=rulesToday();if(!R)return '';var D=hajjDates(curHajjYear());
  return '<div class="card rul" id="rul-'+where+'"><div class="rul-h">'+mk('book','mkt')+'<b>Today’s rulings</b><small>'+R.hd+' Dhul Hijjah · '+(R.night&&R.hd===9?'Muzdalifah night':DH_NAME[R.hd])+'</small></div><div class="rul-l">'
    +R.L.map(function(r){return '<button class="rul-c" onclick="rulingSheet(\''+r.id+'\')">'+esc(RUL_SHORT[r.id]||r.t)+'</button>';}).join('')+'</div></div>';}
function renderRulesRow(){var a=document.getElementById('riteRules');if(!a)return;var h=rulesRowHTML('steps');a.hidden=!h;if(a.innerHTML!==h)a.innerHTML=h;}
function rulingSheet(id){var R=rulesToday(),r=HAJJ_RULINGS.filter(function(x){return x.id===id;})[0];if(!r)return;var others=R?R.L.filter(function(x){return x.id!==id;}):[];
  openSheet('<div class="sheet-h">'+mk('book')+'</div><h3>'+esc(r.t)+'</h3>'+(r.ar?'<p class="ar" lang="ar" style="font-size:var(--t-ar);text-align:center;line-height:1.9">'+r.ar+'</p><p class="tl" style="text-align:center">'+r.tl+'</p>':'')+'<div class="rul-b" id="rulB">'+(r.id==='rule-d9-no-fast'&&curHajjYear()!==1448?r.b.replace('In mid-May heat, eat','Eat'):r.b)+'</div>'
    +'<p class="hajj-rule">'+mk('alert','mkt')+'<b>Hajj rulings:</b> confirm with your group leader or a scholar.</p>'
    +(others.length?'<div class="subt" style="margin-top:12px">More rulings today</div><div class="rul-l">'+others.map(function(x){return '<button class="rul-c" onclick="rulingSheet(\''+x.id+'\')">'+esc(RUL_SHORT[x.id]||x.t)+'</button>';}).join('')+'</div>':'')
    +'<button class="btn ghost" onclick="closeSheet()">Close</button>');}
/* ── 6.6 (G2 #12) · catch up a past day of Hajj ──
   A section whose date has passed (the Muzdalifah night: from sunrise on the 10th) with forMe steps still unticked gets a pill in the Now area and under its header.
   The sheet pre-ticks the sunnah steps (not the conditional ones), leaves rukn / wajib unticked with their pill and "Missed it?", and sends a rami step to its counter so pebble counts stay honest.
   Stamps take the section's date (local noon; 23:00 for the night) and hlog[id+'Est']=true, so the log shows the date and never a made-up clock time. */
var CATCH_NOPRE=['h9nweak','h10udhiyah'];
function hajjRecordedNow(){var H=[];try{H=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}if(!Array.isArray(H)||!H.length)return false;var last=H[H.length-1];return !!(last&&last.y===curHajjYear()&&!Object.keys(hajjChk).some(function(k){return hajjChk[k];}));}
function secPast(s){if(journey()!=='hajj'||s.hd===null||!hajjSecOn(s))return false;var D=hajjDates(curHajjYear()),t=isoOf(riyadhNow());if(!D[8])return false;
  if(s.night)return t>D[10]||(t===D[10]&&nowMin()>=siteTimes('Mina').rise);return t>D[s.hd];}
function catchSteps(s){var L=hajjList();return s.steps.filter(function(st){if(!forMe(st)||st.info||hajjChk[st.id])return false;
  /* G2 review: a concession or a conditional row is never "missing" — h9nweak (the weak leaving early), h10udhiyah (optional for a Mufrid), h10sai for a Qarin / Mufrid who made sa'i after the arrival tawaf */
  if(CATCH_NOPRE.indexOf(st.id)>-1||(st.id==='h10sai'&&!hajjSaiNeeded()))return false;if(st.id==='h12leave'&&ST.stay13)return false;
  return !(st.pair&&L.some(function(y){return y.st.pair===st.pair&&y.st.id!==st.id&&hajjChk[y.st.id];}));});}
function catchSecs(){if(journey()!=='hajj'||hajjRecordedNow())return [];return hajjSecs().filter(function(s){return secPast(s)&&catchSteps(s).length>0;});}
function catchWhen(s){return s.night?'the Muzdalifah night':'the '+s.hd+'th';}
function catchPillHTML(s,id){var n=catchSteps(s).length;return '<button class="catch-pill" id="'+id+'" onclick="catchSheet(\''+s.id+'\')" aria-label="'+n+' step'+(n===1?'':'s')+' from '+catchWhen(s)+' unticked — catch up">'+mk('clock','mkt')+'<span><b>'+n+'</b> from '+catchWhen(s)+' unticked</span><i>Catch up</i></button>';}
function renderCatch(){renderRulesRow();var C=catchSecs(),a=document.getElementById('riteCatch');
  if(a){var on=C.length>0&&hajjPart2Active();a.hidden=!on;a.innerHTML=on?catchPillHTML(C[0],'catchNow')+(C.length>1?'<span class="catch-more">+'+(C.length-1)+' more day'+(C.length>2?'s':'')+' below</span>':''):'';}
  HAJJ_RITES.forEach(function(s){var e=document.getElementById('catch-'+s.id);if(!e)return;var on=C.indexOf(s)>-1;e.hidden=!on;e.innerHTML=on?catchPillHTML(s,'catchp-'+s.id):'';});}
function catchStamp(s){var D=hajjDates(curHajjYear()),iso=D[s.hd];return iso?new Date(iso+(s.night?'T23:00:00':'T12:00:00')).getTime():Date.now();}
function catchSheet(sid){var s=HAJJ_RITES.filter(function(x){return x.id===sid;})[0];if(!s)return;var L=catchSteps(s),D=hajjDates(curHajjYear()),h='';
  if(!L.length){closeSheet();return;}
  L.forEach(function(st){var v=riteStepView(st),rami=st.counter==='rami',pre=v.req==='sunnah'&&CATCH_NOPRE.indexOf(st.id)<0;
    if(rami){h+='<div class="catch-row rami"><span class="catch-rl"><b>'+fcText(v.b)+(v.req?' <span class="req '+v.req+'">'+v.req+'</span>':'')+'</b><small>Pebbles are counted in the rami counter, so the count stays honest.</small></span><button class="xchip" onclick="closeSheet();openRami('+s.hd+')">'+markify('🪨 Count it in the rami counter →')+'</button></div>';return;}
    h+='<div class="catch-row"><label class="catch-rl"><input type="checkbox" class="catch-cb" data-id="'+st.id+'"'+(pre?' checked':'')+'><span><b>'+fcText(v.b)+(v.req?' <span class="req '+v.req+'">'+v.req+'</span>':'')+'</b></span></label>'
      +(v.miss&&v.req!=='sunnah'?'<button class="why" aria-expanded="false" onclick="var m=this.nextElementSibling;m.classList.toggle(\'on\');this.setAttribute(\'aria-expanded\',m.classList.contains(\'on\'))">Missed it?</button><div class="whyb miss"><b>Missed it?</b> '+esc(v.miss)+'</div>':'')+'</div>';});
  openSheet('<div class="sheet-h">'+mk('clock')+'</div><h3>Catch up · '+esc(secShort(s))+'</h3><p>'+(D[s.hd]?fmtDate(D[s.hd],true)+(s.night?' · night':'')+' — ':'')+'tick what you did. The log keeps the date only, never a made-up time. Sunnah steps start ticked; the pillars and duties start unticked — read “Missed it?” on any you did not do.</p><div class="catch-list" id="catchList">'+h+'</div>'
    +'<button class="btn" id="catchGo" onclick="catchGo(\''+sid+'\')">Tick the ones I did</button><button class="btn ghost" onclick="closeSheet()">Not now</button>');}
function catchGo(sid){var s=HAJJ_RITES.filter(function(x){return x.id===sid;})[0];if(!s)return;var ts=catchStamp(s),n=0;if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  document.querySelectorAll('#catchList .catch-cb').forEach(function(cb){var id=cb.getAttribute('data-id');if(!cb.checked||hajjChk[id])return;hajjChk[id]=true;ST.hlog[id]=ts;ST.hlog[id+'Est']=true;n++;});
  save('us-hajj',hajjChk);saveST();closeSheet();updRites();focusRites(false);vib(15);toast(n?'✓ '+n+' step'+(n===1?'':'s')+' from '+catchWhen(s)+' ticked — logged with the date only':'Nothing ticked');}
/* ── 6.6 (G2 #18) · the Hajj log as a day-by-day timeline (shared by Part 2 and the keepsake) ──
   rows: [label, start, end, est]; a step caught up later shows its date only */
function hlogDays(lg,ty,st13,rami){lg=lg||{};rami=rami||{};var est=function(id){return !!lg[id+'Est'];},R=function(t,id,a,b){var e=b||lg[id];return {t:t,a:a&&e&&e>a&&!est(id)?a:0,b:e||0,est:est(id)};};
  var forTxt=function(d){var p=(rami[d]||{}).p||{},nm=Object.keys(p);return nm.length?' · and for '+nm.join(', '):'';},del=function(d){return (rami[d]||{}).del?' (delegated)':'';};
  var G=[{d:8,rows:[ty==='tamattu'?R('Ihram for Hajj','h8niyyah'):R('To Mina','h8mina')]},
    {d:9,rows:[R('Arafah','h9wuquf'),R('Muzdalifah','h9nstay')]},
    {d:10,rows:[R('Jamrat al-Aqabah'+del(10)+forTxt(10),'h10rami',lg.rami10Start,lg.rami10||lg.h10rami),R('Halq / taqsir',lg.h10halq?'h10halq':'h10halqw'),R('Tawaf al-ifadah','h10ifadah',lg.ifadahStart,lg.ifadahEnd||lg.h10ifadah)]},
    {d:11,rows:[R('Stoning'+del(11)+forTxt(11),'h11rami',lg.rami11Start,lg.rami11||lg.h11rami)]},
    {d:12,rows:[R('Stoning'+del(12)+forTxt(12),'h12rami',lg.rami12Start,lg.rami12||lg.h12rami)].concat(st13?[]:[R('Left Mina','h12leave')])}];
  if(ty==='tamattu'||lg.h10sai||lg.hsaiEnd)G[2].rows.push(R('Sa’i of Hajj','h10sai',lg.hsaiStart,lg.hsaiEnd||lg.h10sai));
  if(st13)G.push({d:13,rows:[R('Stoning'+del(13)+forTxt(13),'h13rami',lg.rami13Start,lg.rami13||lg.h13rami)]});
  G.push({d:0,rows:[lg.hwadaEx&&!(lg.wadaEnd||lg.hwada||lg.hwadaw)?{t:'Tawaf al-wada',a:0,b:lg.hwadaEx,est:false,waived:true}:R('Tawaf al-wada',lg.hwada?'hwada':'hwadaw',lg.wadaStart,lg.wadaEnd||lg.hwada||lg.hwadaw)]});
  return G;}
/* a start–end range keeps one AM/PM when both share it: "07:05–07:48 AM" */
function hlogRange(a,b){var fa=fmtTime(a),fb=fmtTime(b),re=/\s?([AaPp]\.?\s?[Mm]\.?)$/,ma=fa.match(re),mb=fb.match(re);if(ma&&mb&&ma[1].toLowerCase()===mb[1].toLowerCase())fa=fa.replace(re,'');return fa+'–'+fb;}
function hlogVal(r,dOnly){if(!r.b)return '—';if(r.est||dOnly)return new Date(r.b).toLocaleDateString('en-GB',{day:'numeric',month:'short'});return r.a?hlogRange(r.a,r.b):fmtTime(r.b);}
function renderHlog(){var a=document.getElementById('hlogArea');if(!a)return;var D=hajjDates(curHajjYear()),h='';
  hlogDays(ST.hlog,hajjType(),!!ST.stay13,ST.rami).forEach(function(g){h+='<div class="lg-day">'+(g.d?g.d+' Dhul Hijjah'+(D[g.d]?' · '+fmtDate(D[g.d]):''):'Before you leave Makkah')+'</div>';
    g.rows.forEach(function(r){var on=!!r.b;h+='<div class="lg'+(on?' on':'')+(r.est?' est':'')+'"><span class="lg-t">'+r.t+(on&&r.a?' <em>'+fmtDur(r.b-r.a)+'</em>':'')+(r.est?' <em>caught up</em>':'')+'</span><span class="lg-v">'+(r.waived?'waived':hlogVal(r))+'</span></div>';});});
  a.innerHTML=h;renderCatch();}
/* ticks go to hajjChk ('us-hajj') and stamp ST.hlog — never riteChk / ST.log */
function togHajj(id,quiet){hajjChk[id]=!hajjChk[id];save('us-hajj',hajjChk);vib(15);if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(hajjChk[id]){if(!ST.hlog[id])ST.hlog[id]=Date.now();}else{delete ST.hlog[id];delete ST.hlog[id+'Est'];}saveST();
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
  ['tamattu','qiran','ifrad'].forEach(function(t){var T=HAJJ_TYPES[t];h+='<button class="opt big" onclick="halqGateGo(\''+t+'\',\''+id+'\')"><span lang="ar" dir="rtl" style="font-size:var(--t-5)">'+T.ar.split(' ').slice(2).join(' ')+'</span><div><b>'+T.talb+'</b><small>'+T.t+' · '+T.s+(t==='tamattu'?' — cut now':' — stay in ihram')+'</small></div></button>';});
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
function renderRami(){renderHeatCnt();var c=document.getElementById('ramiCard');if(!c)return;var HJ=journey()==='hajj';c.hidden=!HJ;if(!HJ)return;
  if(!ramiVisible()){c.classList.add('compact');c.innerHTML='<div class="cnt-sum" style="display:flex"><b>'+mk('stone','mkt')+'Rami — opens on 10&nbsp;Dhul&nbsp;Hijjah</b><button class="chip-btn" onclick="ramiForce=true;renderRami()">Open now</button></div>';return;}
  c.classList.remove('compact');if(!ramiDay)ramiDay=ramiDefaultDay();var d=ramiDay,r=(ST.rami||{})[d]||{},js=ramiJams(d),i=duaIdx('pebble'),dua=i>-1?DUAS[i]:null;
  var h='<h3>'+mk('stone','mkt')+'Rami — '+d+' Dhul Hijjah'+(DH_NAME[d]?' · '+DH_NAME[d]:'')+'</h3><div class="segmini rami-days" role="group" aria-label="Day of stoning">'+[10,11,12,13].map(function(x){return '<button'+(x===d?' class="on"':'')+' onclick="ramiSetDay('+x+')">'+x+(ramiAllDone(x)?' ✓':'')+'</button>';}).join('')+'</div>';
  h+=ramiWinHTML(d)+ramiMakeupHTML(d);
  h+='<div class="cnt-sub">'+(d===10?'Jamrat al-Aqabah only — the big one nearest Makkah. From sunrise; the weak who left Muzdalifah early: Shafi’is / Hanbalis from after midnight, Hanafis / Malikis from Fajr — if unsure, wait for Fajr. Stop the talbiyah at the first pebble.':'After midday: small → middle → Aqabah, in this order. One pebble at a time, "Allahu akbar" with each, into the basin. Dua after the first two, not after Aqabah.')+'<br><b>Tap the number after each pebble.</b></div><button class="chip-btn rami-jam" id="ramiJam" onclick="jamSheet('+d+')">'+mk('stone','mkt')+'The Jamarat, drawn</button>';
  /* G2 #13: with people to stone for, each jamrah counts in blocks of 7 — "7 for you ✓ · 3 of 7 for Mum" — one row of pebble dots per person */
  var FN=r.del?[]:ramiForN(d),pebRow=function(n,lbl){return '<div class="pebs'+(lbl?' named':'')+'" aria-hidden="true">'+(lbl?'<span class="peb-l">'+esc(lbl)+'</span>':'')+[1,2,3,4,5,6,7].map(function(x){return '<i'+(x<=n?' class="on"':'')+'></i>';}).join('')+'</div>';};
  js.forEach(function(j,k){var own=Math.min(7,r[j]||0),ok=ramiJDone(d,j),prev=k>0&&!ramiJDone(d,js[k-1]),b=ramiBlock(d,j,1),n=b.full?7:b.n,anyC=own>0||FN.some(function(nm){return ramiPC(r,nm,j)>0;});
    var blk=FN.length?'<span class="rami-blk">'+[own>=7?'7 for you ✓':own+' of 7 for you'].concat(FN.map(function(nm){var c=ramiPC(r,nm,j);return c>=7?'7 for '+esc(nm)+' ✓':c+' of 7 for '+esc(nm);})).join(' · ')+'</span>':'';
    h+='<div class="rami-j'+(r.del?' dis':'')+(FN.length?' multi':'')+'" id="rj-'+j+'"><div class="rami-t"><b>'+(k+1)+'. '+JAM[j][0]+(ok?' ✓':'')+'</b><small>'+JAM[j][1]+(prev&&!ok?' · after the previous one':'')+'</small>'+blk+pebRow(own,FN.length?'you':'')+FN.map(function(nm){return pebRow(ramiPC(r,nm,j),nm);}).join('')+'</div>'
      +'<button class="rring'+(ok?' ok':'')+'" aria-label="'+JAM[j][0]+': '+n+' of 7 pebbles'+(b.who&&!b.full?' for '+esc(b.who):'')+' — tap to count one" onclick="ramiTap(\''+j+'\',1)">'+n+'<small>of 7</small>'+(b.who&&!b.full?'<small class="rr-who">'+esc(b.who)+'</small>':'')+'</button><button class="chip-btn" aria-label="Undo one pebble at '+JAM[j][0]+'" onclick="ramiTap(\''+j+'\',-1)"'+(anyC?'':' disabled')+'>−1</button></div>';});
  if(!r.del)h+=ramiForRowHTML(d);
  h+='<div class="brg'+(r.del?' done':'')+'" role="switch" tabindex="0" aria-checked="'+(r.del?'true':'false')+'" onclick="ramiDel('+d+')"><span class="tick"></span><span>'+mk('group','mkt')+'Delegated — someone who has stoned for themselves threw my pebbles today</span></div>';
  if(dua)h+='<div class="cnt-dua"><div class="dua tapable" onclick="openDua('+i+')"><div class="dua-top"><small>'+dua.t+'</small><button class="say" data-ar="'+dua.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar" dir="rtl">'+dua.ar+'</span><span class="tl">'+dua.tl+'</span><button type="button" class="enl" aria-label="Open the takbir full screen">⛶ tap to enlarge</button></div></div>';
  h+='<div class="cnt-acts"><button class="btn big" onclick="enterFocus(\'rami\')">⛶ Big counter</button><button class="chip-btn" onclick="troubleSheet(\'rami\')">'+markify('⚠️ Problem?')+'</button></div>';
  h+='<div class="cnt-done" id="ramiDone" style="display:'+(ramiAllDone(d)?'block':'none')+'">'+(r.del?mk('group','mkt')+'Delegated for today — the step is ticked in Part 2.':mk('check','mkt')+'Rami complete for the '+d+'th'+(d===10?(hajjType()==='ifrad'?' — next: halq, then tawaf al-ifadah.':' — next: hady, halq, then tawaf al-ifadah.'):d===12?(ST.stay13?' — staying for the 13th: back to the tent, takbir after every prayer.':' — leaving? Be out of Mina before sunset.'):' — back to the tent, takbir after every prayer.'))+' <button class="xchip" onclick="goTab(\'umrah\',\'steps\',\'rw-h'+d+'rami\')">Open day '+d+' →</button></div>';
  h+='<button class="lnk reset" onclick="ramiReset('+d+')">Reset the '+d+'th to 0</button>';
  c.innerHTML=h;}
function ramiStep(d){return hajjStep('h'+d+'rami');}
/* the rami heads the Counters hero (G1 #3): while today's stoning is under way, and on the 10th from sunrise until it is done */
function ramiHero(hd){if(typeof hd!=='number'||hd<10||hd>13)return null;if(ramiClosed(hd))return null;var r=(ST.rami||{})[hd]||{},js=ramiJams(hd),go=ramiAny(hd);
  if(!go&&!(hd===10&&nowMin()>=siteTimes('Mina').rise))return null;
  if(!go){var st=ramiStep(10);return {t:st?fcText(riteStepView(st).b):'Rami of Jamrat al-Aqabah',s:'From sunrise ≈ '+minHM(siteTimes('Mina').rise)+' · tap to open the rami counter'};}
  var j=js.filter(function(x){return !ramiJDone(hd,x);})[0]||js[js.length-1],bk=ramiBlock(hd,j,1),n=Math.min(7,bk.n);return {t:'Rami · '+JAM[j][0]+' · pebble '+Math.min(7,n+1)+' of 7'+(bk.who?' for '+esc(bk.who):''),s:'One pebble at a time, "Allahu akbar" with each · tap to keep counting'};}
/* ── 6.5 (G1 #5 / #11): the day card that leads the Counters tab on the 8th, the 9th and the Muzdalifah night ──
   The 9th: the wuquf countdown (an aubergine card with a ring — sunset computed for Arafah, ±2 min, "follow your group, not the phone"), the dua of Arafah as a tap counter
   with no target that feeds the tasbih day totals (us-tasbih / us-tasbih-p, key 'arafah'), the big counter, and the personal dua list. */
function duaListLbl(){var n=duas.length,dn=duas.filter(function(d){return d.done;}).length;return n?dn+' of '+n+' asked':'empty — add the first';}
function arafahN(){return ((tasbihP[dayKey()]||{}).arafah)||0;}
function arafahTap(d){var k=dayKey(),P=tasbihP[k]||{},n=(P.arafah||0)+d;if(n<0){vib(6);return;}P.arafah=n;tasbihP[k]=P;save('us-tasbih-p',tasbihP);tasbih[k]=Math.max(0,(tasbih[k]||0)+d);save('us-tasbih',tasbih);vib(d>0?12:6);
  if(d>0&&(tasbih[k]||0)>=100){var dd=dailyChk[k]||{};if(!dd.dhikr100){dd.dhikr100=true;dailyChk[k]=dd;save('us-daily',dailyChk);toast('📿 100 dhikr today — checklist updated!');updDaily();updStats();chkBadges();}}
  var e=document.getElementById('afN');if(e)e.textContent=n;var t=document.getElementById('afToday');if(t)t.textContent=n;var b=document.getElementById('afBtn');if(b)b.setAttribute('aria-label','Count one dua of Arafah — '+n+' today');
  var f=document.getElementById('focus');if(f&&f.classList.contains('on')&&focusKey==='arafah')renderFocusTB();renderTB();}
function arafahCardHTML(){var A=arafahNow(),i=duaIdx('dua of Arafah'),D=i>-1?DUAS[i]:null,n=arafahN(),h='';
  var num=A.ph==='set'?'':'<span class="hs-n">'+hjLiveHTML(A.sunM)+'</span><span class="hs-u">until sunset ≈ '+A.sun+' at Arafah</span>';
  var note=A.ph==='set'?'<span class="hs-u hjd-set">Sunset ≈ '+A.sun+' has passed. When the disc has gone, leave calmly with your group for Muzdalifah — Maghrib and Isha together on arrival.</span>':A.ph==='last'?'<span class="hs-note">The last hour of Arafah — make dua</span>':A.ph==='pre'?'<span class="hs-note">Dhuhr + Asr together at Dhuhr ≈ '+A.dhuhr+', with your group, then the standing until sunset</span>':'';
  h+='<div class="hero hero-o hjd" id="arafahCard"><div class="hero-t"><div class="k">'+mk('hills','mkt')+'<span>Wuquf · Arafah</span></div>'+num+note+'</div>'
    +'<div class="ring-wrap" aria-hidden="true"><svg width="92" height="92" viewBox="0 0 92 92"><circle class="ring-bg" cx="46" cy="46" r="38"/><circle class="ring-fg" cx="46" cy="46" r="38" style="stroke-dashoffset:'+Math.round(239*(1-(A.ph==='set'?0:A.frac)))+'"/></svg><div class="ring-num">'+mk('sun')+'<small>'+(A.ph==='set'?'set':'left')+'</small></div></div>'
    +'<p class="hjd-hedge">Computed for Arafah, ±2 min — follow your group, not the phone.</p>'
    +'<button class="hs-pill" id="arfDuas" onclick="'+(duas.length?'openMyDuas()':'myDuasSheet()')+'" aria-label="'+(duas.length?'Read my dua list full-screen':'My dua list')+' — '+duaListLbl()+'"><span class="hs-cw"><small class="hs-ce">My dua list</small><span class="hs-ct">'+duaListLbl()+'</span></span><span class="hs-go">'+mk('arrow')+'</span></button></div>';
  if(D)h+='<div class="card card-pad cnt hjd-dhikr" id="arafahDhikr" style="text-align:center"><h3>'+mk('hands','mkt')+'The dua of Arafah</h3><p class="cnt-sub">Say it slowly, again and again, with your own duas between. <b>Tap after each one</b> — no target.</p>'
    +'<div class="tb-btn" id="afBtn" role="button" tabindex="0" aria-label="Count one dua of Arafah — '+n+' today" onclick="arafahTap(1)"><div class="n" id="afN">'+n+'</div><div class="t">∞ · tap</div></div>'
    +'<div class="tb-meta"><span>Today: <b id="afToday">'+n+'</b></span><button class="chip-btn" onclick="arafahTap(-1)" aria-label="Remove one mis-tap">−1</button><button class="chip-btn" onclick="enterFocus(\'arafah\')">⛶ Big counter</button></div>'
    +'<div class="cnt-dua"><div class="dua tapable" onclick="openDua('+i+')"><div class="dua-top"><small>'+D.t+'</small><button class="say" data-ar="'+D.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar" dir="rtl">'+D.ar+'</span><span class="tl">'+D.tl+'</span><button type="button" class="enl" aria-label="Open the dua of Arafah full screen">⛶ tap to enlarge</button></div></div></div>';
  return h;}
/* the 8th and the Muzdalifah night: the dhikr of the moment (the step that carries it, its dua) and the way into today's steps — the hero above already says "what now" */
function hajjDayCardHTML(sid,stepId,di){var sec=HAJJ_RITES.filter(function(x){return x.id===sid;})[0],st=hajjStep(stepId),D=di>-1?DUAS[di]:null;if(!sec||!st)return '';var v=riteStepView(st);
  return '<div class="card card-pad hjd-day" id="hjdDay"><small class="hjd-k">'+mk(emk(sec.ico,'tent'),'mkt')+'<span>Today · '+esc(sec.title.split(' — ')[0])+'</span></small><b class="hjd-t">'+fcText(v.b)+'</b>'+(v.rep?'<p class="hjd-s">'+mk('refresh','mkt')+v.rep+'</p>':'')
    +(D?'<div class="cnt-dua"><div class="dua tapable" onclick="openDua('+di+')"><div class="dua-top"><small>'+D.t+'</small><button class="say" data-ar="'+D.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'</button></div><span class="ar" lang="ar" dir="rtl">'+D.ar+'</span><span class="tl">'+D.tl+'</span><button type="button" class="enl" aria-label="Open '+esc(D.t)+' full screen">⛶ tap to enlarge</button></div></div>':'')
    +'<button class="btn gold qz-cta" onclick="openHajjDay(\''+sid+'\')"><span class="hs-cw"><small class="hs-ce">Steps &amp; duas</small><span class="hs-ct">Open today’s steps</span></span><span class="hs-go">'+mk('arrow')+'</span></button></div>';}
function renderHajjCnt(){var c=document.getElementById('hajjDayCard');if(!c)return;var hd=journey()==='hajj'?hajjDay():null,h='';
  /* (G1 review) the evening of the 9th: once the sunset step is ticked (or an hour after sunset) the counters lead with the Muzdalifah night, as the hero already does */
  if(hd===9){var A9=arafahNow();h=A9.ph==='set'&&(hajjChk.h9sunset||nowMin()>=A9.sunM+60)?hajjDayCardHTML('hd9n','h9ndhikr',duaIdx('Muzdalifah')):arafahCardHTML();}
  else if(hd===8)h=hajjDayCardHTML('hd8','h8talb',duaIdx('Talbiyah'));
  else if(hd===10&&nowMin()<siteTimes('Mina').rise&&!ramiAny(10))h=hajjDayCardHTML('hd9n','h9ndhikr',duaIdx('Muzdalifah'));
  if(c.getAttribute('data-h')!==h){c.innerHTML=h;c.setAttribute('data-h',h);}
  if(!h)c.hidden=true;}
/* (review) on the 11th–13th the jamarat are stoned in order: a tap on a later jamarah while an earlier one is unfinished asks first instead of counting silently */
var ramiOrderOK=false,ramiEarlyOK={};
/* 6.5 (G1 #6): the time window under the day pills — computed for Mina, ±2 min, shown only for today's day: the 10th from sunrise, the 11th–13th after midday,
   and on the 12th once done (not staying for the 13th) the leave-Mina-before-sunset countdown */
function ramiAny(d){var r=(ST.rami||{})[d]||{};return ramiJams(d).some(function(j){return (r[j]||0)>0;});}
function ramiWinHTML(d){if(d!==hajjDay())return '';var S=siteTimes('Mina'),m=nowMin(),t;
  /* (G1 review) after sunset the window has not simply closed: the corrected h10rami / h11rami wording on stoning at night, and the step's "Missed it?" */
  if(m>=S.sun&&!ramiDone(d))return '<div class="rami-win night" id="ramiWin">'+mk('moon','mkt')+'<span>Sunset ≈ '+minHM(S.sun)+' has passed — '+(d===13?'after sunset of the 13th the days of stoning are over and a dam is owed for a day’s stoning left undone (for a pebble or two the schools differ)':'most scholars allow those who could not make it to stone at night (the Hanbali school has it done the next day after midday instead)')+' · ask your group leader <small>· computed ±2 min</small><button class="lnk" onclick="openStepMiss(\'h'+d+'rami\')">Read “Missed it?”</button></span></div>';
  if(d===10)t=m<S.rise?'From sunrise ≈ '+minHM(S.rise)+' · in '+hjLiveHTML(S.rise):'From sunrise ≈ '+minHM(S.rise)+' · until sunset ≈ '+minHM(S.sun);
  else if(m<S.dhuhr)t='Opens after midday · Dhuhr ≈ '+minHM(S.dhuhr)+' in Mina · in '+hjLiveHTML(S.dhuhr);
  else if(d===12&&!ST.stay13&&ramiDone(12)&&m<S.sun)t='Leaving today? Out of Mina before sunset ≈ '+minHM(S.sun)+' · '+hjLiveHTML(S.sun);
  else t='After midday · until sunset ≈ '+minHM(S.sun);
  return '<div class="rami-win" id="ramiWin">'+mk('clock','mkt')+'<span>'+t+' <small>· computed ±2 min, follow your group</small></span></div>';}
/* open a Hajj step with its "Missed it?" unfolded (from the counters / focus) */
function openStepMiss(id){var fz=document.getElementById('focus');if(fz&&fz.classList.contains('on'))exitFocus();closeSheet();openRiteStep(id);
  setTimeout(function(){var m=document.getElementById('miss-'+id);if(!m)return;m.classList.add('on');var r=document.getElementById('rw-'+id);if(r)r.querySelectorAll('.xchip').forEach(function(b){if(/Missed it/.test(b.textContent))b.setAttribute('aria-expanded','true');});},400);}
/* the day before is not counted: stone it first, in order, then today's (TROUBLE_HAJJ "I missed the stoning time") — shown for a day that has come, never a block */
function ramiMakeupHTML(d){if(d<11||d>hajjDayN())return '';var p=d-1;if(ramiDone(p)||hajjChk['h'+p+'rami'])return '';
  return '<div class="rami-mk" id="ramiMakeup"><b>'+mk('alert','mkt')+'The '+p+'th is not counted here</b><p>If it is still to do, stone it first — '+(p===10?'Jamrat al-Aqabah only':'small → middle → Aqabah')+' — then today’s.</p><div class="rami-mk-a"><button class="chip-btn" onclick="ramiSetDay('+p+')">Open the '+p+'th</button><button class="chip-btn" onclick="hajjTroubleSheet(\'hmissrami\')">Read: I missed the stoning time</button></div></div>';}
function hajjTroubleSheet(id){var g=TROUBLE_HAJJ.filter(function(x){return x.id===id;})[0];if(!g)return;openSheet('<div class="sheet-h">'+mk(emk(leadEmoji(g.t),'alert'))+'</div><h3>'+esc(stripEmoji(g.t))+'</h3>'+g.b+ckLine(g)+'<button class="btn ghost" onclick="closeSheet()">Back</button>');}
/* the first tap before midday on the 11th–13th asks once — it warns, it never blocks */
function ramiEarlySheet(j,d){var S=siteTimes('Mina');openSheet('<div class="sheet-h">'+mk('clock')+'</div><h3>It is '+minHM(nowMin())+' — before midday</h3><p>The stoning of the '+d+'th is after midday (Dhuhr ≈ '+minHM(S.dhuhr)+' in Mina, computed ±2 min). Count anyway?</p><p style="font-size:var(--t-2)">Stoned before midday already? Read “Missed it?” on today’s rami step.</p><button class="btn tall" onclick="closeSheet()">Wait for midday</button><button class="btn ghost tall" onclick="closeSheet();ramiEarlyOK['+d+']=true;ramiTap(\''+j+'\',1)">Count it anyway</button><button class="lnk" style="display:block;margin:6px auto 0" onclick="closeSheet();exitFocus();goTab(\'umrah\',\'steps\',\'rw-h'+d+'rami\')">Open today’s rami step</button>');}
function ramiOrderSheet(j,p,d){openSheet('<div class="sheet-h danger">🪨</div><h3>'+JAM[p][0]+' first</h3><p>On the '+d+'th the jamarat are stoned in order: small → middle → Aqabah. '+JAM[p][0]+' is at '+(ramiD(d)[p]||0)+' of 7'+(ramiForN(d).length&&(ramiD(d)[p]||0)>=7?' for you — the blocks for '+esc(ramiForN(d).join(', '))+' are not finished':'')+'. Count at '+JAM[j][0]+' anyway?</p><p style="font-size:var(--t-2)">If you really stoned out of order, read "Missed it?" on today’s rami step — most scholars count the order as a condition.</p><button class="btn ghost tall" onclick="closeSheet();ramiOrderOK=true;ramiTap(\''+j+'\',1);ramiOrderOK=false">Yes, count it anyway</button><button class="btn tall" onclick="closeSheet()">No — '+JAM[p][0]+' first</button>');}
/* ── 6.6 (G2 #13) · stoning on behalf of others ──
   ST.ramiFor[d] = ['Mum', …] (from the children list or typed); ST.rami[d][j] stays the pilgrim's OWN count, ST.rami[d].p[name][j] counts each further block of 7.
   At each jamrah: seven for yourself first, then seven for each person, then move on (verified pack rami-delegate). The step h{d}rami ticks on the pilgrim's own pebbles, exactly as before;
   the next jamrah opens once every block of this one is done. −1 and Undo take from the last block. */
function ramiForN(d){var L=(ST.ramiFor||{})[d];return Array.isArray(L)?L:[];}
function ramiPC(r,nm,j){return Math.min(7,((r.p||{})[nm]||{})[j]||0);}
function ramiJDone(d,j){var r=(ST.rami||{})[d]||{};return (r[j]||0)>=7&&ramiForN(d).every(function(nm){return ramiPC(r,nm,j)>=7;});}
/* G2 review: today's stoning is closed when every block is thrown (or delegated), or the step was ticked by hand with no count; own pebbles done with a block for someone else still open is NOT closed */
function ramiClosed(d){return ramiAllDone(d)||(!!hajjChk['h'+d+'rami']&&!ramiDone(d));}
function ramiAllDone(d){var r=(ST.rami||{})[d]||{};return !!r.del||ramiJams(d).every(function(j){return ramiJDone(d,j);});}
function ramiBlock(d,j,dlt){var r=(ST.rami||{})[d]||{},N=ramiForN(d),own=Math.min(7,r[j]||0),i;
  if(dlt>0){if(own<7)return {who:'',n:own};for(i=0;i<N.length;i++)if(ramiPC(r,N[i],j)<7)return {who:N[i],n:ramiPC(r,N[i],j)};return {who:N.length?N[N.length-1]:'',n:7,full:true};}
  for(i=N.length-1;i>=0;i--)if(ramiPC(r,N[i],j)>0)return {who:N[i],n:ramiPC(r,N[i],j)};return {who:'',n:own};}
function ramiFocusOn(){var f=document.getElementById('focus');return !!(f&&f.classList.contains('on')&&focusKey==='rami');}
/* the block being thrown now: the jamrah on the big counter (or the first one not done), its first unfinished block (or its last one when all are full) */
function ramiCur(d){var js=ramiJams(d),j=ramiFocusOn()?js[Math.min(ramiJ,js.length-1)]:(js.filter(function(x){return !ramiJDone(d,x);})[0]||js[js.length-1]),b=ramiBlock(d,j,1);if(b.full)b=ramiBlock(d,j,-1);return {d:d,j:j,who:b.who,n:b.n};}
function ramiTap(j,dlt){var d=ramiDay||ramiDefaultDay(),r=ramiD(d),b=ramiBlock(d,j,dlt),n=b.n,v=Math.max(0,Math.min(7,n+dlt));if(v===n||(dlt>0&&b.full))return;
  if(dlt>0&&!r.del&&d>=11&&d===hajjDay()&&!ramiEarlyOK[d]&&!ramiAny(d)&&nowMin()<siteTimes('Mina').dhuhr){ramiEarlySheet(j,d);vib([40,40,40]);return;}
  if(dlt>0&&!r.del&&!ramiOrderOK){var js0=ramiJams(d),prev=js0.slice(0,js0.indexOf(j)).filter(function(x){return !ramiJDone(d,x);});if(prev.length){ramiOrderSheet(j,prev[0],d);vib([40,40,40]);return;}}
  var now=Date.now();if(dlt>0){if(now-ramiLast<800){vib([40,40,40]);toast('Already counted — tap −1 if wrong');return;}ramiLast=now;}
  if(dlt<0&&ramiPause&&ramiPause.d===d&&ramiPause.j===j)ramiPauseEnd();
  ramiSetBlock(d,j,b.who,v,dlt);}
/* one block's count changes (a tap, −1, or "Set to …" from the Problem? sheet): the own-pebble tick and timeline stamps, then the toast and the hand-off */
function ramiSetBlock(d,j,who,v,dlt){var r=ramiD(d),now=Date.now(),js=ramiJams(d),stId='h'+d+'rami',fo=ramiFocusOn(),k=js.indexOf(j);
  if(who){r.p=r.p||{};r.p[who]=r.p[who]||{};r.p[who][j]=v;}else r[j]=v;
  var all=js.every(function(x){return (r[x]||0)>=7;});
  if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(v>=1&&dlt>=0&&!ST.hlog['rami'+d+'Start'])ST.hlog['rami'+d+'Start']=now;
  if(all){ST.hlog['rami'+d]=ST.hlog['rami'+d]||now;if(!hajjChk[stId]){hajjChk[stId]=true;ST.hlog[stId]=ST.hlog[stId]||now;delete ST.hlog[stId+'Est'];save('us-hajj',hajjChk);}}
  else if(hajjChk[stId]&&!r.del){delete hajjChk[stId];delete ST.hlog[stId];delete ST.hlog[stId+'Est'];delete ST.hlog['rami'+d];save('us-hajj',hajjChk);}
  saveST();vib(v===7?[50,60,140]:35);
  var forW=who?' for '+who:'';
  if(dlt)sayCount(dlt<0?'Back to '+v:ramiAllDone(d)?'Rami complete':v===7?'Seven'+forW+', '+JAM[j][0]+' done':'Pebble '+v+forW+', '+JAM[j][0]);
  if(v===7&&dlt>0){
    if(ramiAllDone(d)){if(fo)ramiPauseEnd();confetti(50);toast('🪨 Rami of the '+d+'th complete'+(ramiForN(d).length?' — and for '+ramiForN(d).join(', '):'')+' — '+(d===10?'stop here, no dua after Aqabah; next the hady and halq':'back to Mina, takbir after every prayer'),true);}
    else if(!ramiJDone(d,j)){var nb=ramiBlock(d,j,1);toast('✓ 7'+(who?forW:' for you')+' — now 7 for '+nb.who+' at '+JAM[j][0],true);}
    else{var nxj=js.slice(k+1).concat(js.slice(0,k)).filter(function(x){return !ramiJDone(d,x);})[0];
      /* G2 #14: after as-Sughra and al-Wusta (11th–13th) the big counter pauses for the long dua; taps do not count until "Walk on" */
      if(fo&&d>=11&&k<2){ramiPauseStart(d,j);}
      toast('✓ '+JAM[j][0]+' done — now '+JAM[nxj][0]+(k<2?' (make dua facing the qiblah first)':''),true);if(fo&&!ramiPause)ramiJ=js.indexOf(nxj);}}
  else if(dlt)cntToast(dlt>0?'Allahu akbar · '+v+' of 7'+forW+' · '+JAM[j][0]:'↶ Back to '+v+' of 7'+forW);
  else toast('Count set to '+v+' of 7'+forW+' at '+JAM[j][0]+(v<7?' — throw the rest one at a time':''));
  updRites();if(fo)renderFocusRami();}
/* G2 #13: who else the pilgrim is stoning for today */
function ramiForSet(d,L){ST.ramiFor=ST.ramiFor&&typeof ST.ramiFor==='object'?ST.ramiFor:{};if(L.length)ST.ramiFor[d]=L;else delete ST.ramiFor[d];saveST();}
function ramiForAdd(d,nm){nm=String(nm||'').trim().slice(0,24);if(!nm)return;var L=ramiForN(d).slice();if(L.some(function(x){return x.toLowerCase()===nm.toLowerCase();})){toast(nm+' is already in today’s list');return;}
  if(L.length>=4){toast('Up to four people a day');return;}L.push(nm);ramiForSet(d,L);closeSheet();updRites();if(ramiFocusOn())renderFocusRami();vib(10);toast('🪨 '+nm+' added for the '+d+'th — seven for you first, then seven for '+nm+' at each jamrah');}
function ramiForDel(d,nm){var r=ramiD(d),keep=r.p&&r.p[nm]?JSON.parse(JSON.stringify(r.p[nm])):null,L=ramiForN(d),i=L.indexOf(nm);if(i<0)return;
  ramiForSet(d,L.filter(function(x){return x!==nm;}));if(r.p){delete r.p[nm];if(!Object.keys(r.p).length)delete r.p;}saveST();updRites();vib(8);
  toast('Removed '+nm+' from the '+d+'th',false,'Undo',function(){var L2=ramiForN(d).slice();L2.splice(Math.min(i,L2.length),0,nm);ramiForSet(d,L2);if(keep){var r2=ramiD(d);r2.p=r2.p||{};r2.p[nm]=keep;}saveST();updRites();});}
function ramiForSheet(d){var L=ramiForN(d),K=kidNames().map(function(k){return typeof k==='string'?k:(k&&k.n)||'';}).filter(function(k){return k&&L.indexOf(k)<0;}),prev=d>10?ramiForN(d-1).filter(function(x){return L.indexOf(x)<0;}):[];
  var ri=RAMI_PROB.filter(function(x){return x.id==='rami-delegate';})[0];
  openSheet('<div class="sheet-h">'+mk('group')+'</div><h3>Also stoning for…</h3><p>At each jamrah you throw seven for yourself first, then seven for each person, then move on. The counter keeps a block of seven for each.</p>'
    +(prev.length?'<button class="chip-btn rf-same" onclick="ramiForSame('+d+')">Same as the '+(d-1)+'th: '+esc(prev.join(', '))+'</button>':'')
    +(K.length?'<div class="rf-kids">'+K.map(function(k){return '<button class="chip-btn" onclick="ramiForAdd('+d+',this.textContent)">'+esc(k)+'</button>';}).join('')+'</div>':'')
    +'<div class="rf-add"><input class="srch" id="rfName" maxlength="24" placeholder="Name (e.g. Mum)" aria-label="Name of the person you are stoning for" onkeydown="if(event.key===\'Enter\')ramiForAdd('+d+',this.value)"><button class="chip-btn" onclick="ramiForAdd('+d+',document.getElementById(\'rfName\').value)">＋ Add</button></div>'
    +(ri?'<div class="acc rf-rule"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+esc(ri.t)+' <span class="acc-c">▶</span></div><div class="acc-b">'+ri.b+'</div></div>':'')
    +'<button class="btn ghost" onclick="closeSheet()">Close</button>');}
function ramiForSame(d){var L=ramiForN(d).slice(),over=false;ramiForN(d-1).forEach(function(x){if(L.indexOf(x)>-1)return;if(L.length>=4){over=true;return;}L.push(x);});ramiForSet(d,L);closeSheet();updRites();if(over)toast('Up to four people a day');}
function ramiForRowHTML(d){var L=ramiForN(d);return '<div class="rami-for" id="ramiFor"><span class="rf-l">Also stoning for:</span>'+L.map(function(nm){return '<button class="rf-chip" onclick="ramiForDel('+d+',\''+esc(nm).replace(/'/g,'\\\'')+'\')" aria-label="Remove '+esc(nm)+' from today’s stoning">'+esc(nm)+' <span aria-hidden="true">✕</span></button>';}).join('')+(L.length<4?'<button class="rf-chip add" onclick="ramiForSheet('+d+')" aria-label="Add someone you are stoning for">＋ Add</button>':'')+'</div>';}
/* ── 6.6 (G2 #14) · the pause for dua between the jamarat (big counter, 11th–13th, after as-Sughra and al-Wusta) ── */
var ramiPause=null,ramiPauseTm=0;
function ramiPauseStart(d,j){ramiPause={d:d,j:j,at:Date.now()};clearInterval(ramiPauseTm);ramiPauseTm=setInterval(ramiPauseTick,1000);}
function ramiPauseEnd(){ramiPause=null;clearInterval(ramiPauseTm);ramiPauseTm=0;}
function ramiPauseTick(){var e=document.getElementById('ramiPauseT');if(!ramiPause||!e){if(!ramiPause){clearInterval(ramiPauseTm);ramiPauseTm=0;}return;}var s=Math.floor((Date.now()-ramiPause.at)/1000),v=Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);if(e.textContent!==v)e.textContent=v;}
function ramiWalkOn(){if(!ramiPause)return;var d=ramiPause.d,js=ramiJams(d),k=js.indexOf(ramiPause.j);ramiPauseEnd();var nx=js.slice(k+1).filter(function(x){return !ramiJDone(d,x);})[0];if(nx)ramiJ=js.indexOf(nx);vib(12);renderFocusRami();}
/* ── 6.6 (G2 #15) · the rami Problem? sheet leads with the pebble problems (verified pack, verbatim); each offers its counter action, and the count changes only on that tap ── */
var ramiSetV=0;
function ramiProbHTML(){var d=ramiDay||ramiDefaultDay(),c=ramiCur(d),wh=JAM[c.j][0]+' · '+c.n+' of 7'+(c.who?' for '+esc(c.who):''),h='';ramiSetV=c.n;
  RAMI_PROB.forEach(function(x){var act='';
    if(x.a==='keep')act='<button class="chip-btn rp-keep" onclick="closeSheet();toast(\'Count stays at '+c.n+' of 7 — throw another pebble\')">Keep count at '+c.n+'</button>';
    else if(x.a==='minus')act='<button class="chip-btn rp-minus" onclick="closeSheet();ramiTap(\''+c.j+'\',-1)"'+(c.n?'':' disabled')+'>−1 — count them as one</button>';
    else if(x.a==='set')act='<div class="rp-set" role="group" aria-label="Set the count to the number you are sure of"><button class="chip-btn" onclick="ramiSetStep(-1)" aria-label="One fewer">−</button><output id="rpSetV" aria-live="polite">'+c.n+'</output><button class="chip-btn" onclick="ramiSetStep(1)" aria-label="One more">+</button><button class="chip-btn rp-setgo" id="rpSetGo" onclick="ramiSetGo(\''+c.j+'\','+esc(JSON.stringify(c.who))+')">Set to '+c.n+'</button></div>';
    h+='<div class="acc rp-acc" data-id="'+x.id+'"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+esc(x.t)+' <span class="acc-c">▶</span></div><div class="acc-b">'+(act?'<div class="rp-act"><small>Now: '+wh+'</small>'+act+'</div>':'')+x.b+'</div></div>';});
  return h;}
function ramiSetStep(dl){ramiSetV=Math.max(0,Math.min(7,ramiSetV+dl));var o=document.getElementById('rpSetV'),g=document.getElementById('rpSetGo');if(o)o.textContent=ramiSetV;if(g)g.textContent='Set to '+ramiSetV;vib(6);}
function ramiSetGo(j,who){var d=ramiDay||ramiDefaultDay();closeSheet();ramiSetBlock(d,j,who||'',ramiSetV,0);}
function ramiDel(d){var r=ramiD(d),stId='h'+d+'rami';r.del=!r.del;if(!ST.hlog||typeof ST.hlog!=='object')ST.hlog={};
  if(r.del){if(!hajjChk[stId]){hajjChk[stId]=true;ST.hlog[stId]=ST.hlog[stId]||Date.now();}}else if(!ramiJams(d).every(function(x){return (r[x]||0)>=7;})&&hajjChk[stId]){delete hajjChk[stId];delete ST.hlog[stId];}
  save('us-hajj',hajjChk);saveST();vib(10);ramiDay=d;updRites();toast(r.del?'🤝 Delegated — the rami of the '+d+'th is ticked for you':'Delegation removed for the '+d+'th');}
function ramiReset(d){openSheet('<div class="sheet-h danger">↺</div><h3>Reset the '+d+'th to 0?</h3><p>Clears today’s pebble counts and the delegation flag. To fix one extra tap, use −1 instead.</p><button class="btn danger tall" onclick="ramiResetGo('+d+')">↺ Reset to 0</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function ramiResetGo(d){closeSheet();var stId='h'+d+'rami';delete ST.rami[d];if(hajjChk[stId]){delete hajjChk[stId];save('us-hajj',hajjChk);}if(ST.hlog){delete ST.hlog[stId];delete ST.hlog['rami'+d];delete ST.hlog['rami'+d+'Start'];}saveST();ramiJ=0;ramiLast=0;updRites();toast('Rami of the '+d+'th reset to 0');}
function openRami(d){ramiForce=true;if(d>=10&&d<=13)ramiDay=d;else if(!ramiDay)ramiDay=ramiDefaultDay();ramiJ=0;renderRami();goTab('umrah','count','ramiCard');}
function renderFocusRami(){var d=ramiDay||ramiDefaultDay(),r=ramiD(d),js=ramiJams(d);if(ramiJ>=js.length)ramiJ=js.length-1;
  var pz=ramiPause&&ramiPause.d===d?ramiPause:null;if(pz&&!ramiJDone(d,pz.j)){ramiPauseEnd();pz=null;}if(pz)ramiJ=js.indexOf(pz.j);
  if(!pz)while(ramiJ<js.length-1&&ramiJDone(d,js[ramiJ]))ramiJ++;var j=js[ramiJ],b=ramiBlock(d,j,1),n=b.full?7:b.n,who=b.full?'':b.who,done=ramiAllDone(d),FN=r.del?[]:ramiForN(d);
  document.getElementById('focusTitle').innerHTML=mk('stone','mkt')+esc(JAM[j][0])+'<span class="ft-d"> · '+d+'&nbsp;DH</span>';document.getElementById('focusOf').innerHTML=(pz?'all done here':'of 7 pebbles'+(who?' · for '+esc(who):FN.length?' · for you':''))+' · '+(ramiJ+1)+' of '+js.length+'<span class="fo-d"> · '+d+'&nbsp;DH</span>';
  var fn=document.getElementById('focusN'),fl=document.getElementById('focusLive'),t=document.getElementById('focusTip'),p=document.getElementById('focusDone'),h=document.getElementById('focusHint'),f=document.getElementById('focus');
  if(fn)fn.textContent=n;if(fl)fl.textContent=JAM[j][0]+' '+n+' of 7'+(who?' for '+who:'');if(f)f.classList.toggle('rpause',!!pz);
  if(t){t.hidden=done||!!pz;t.innerHTML='<b class="tip-a">'+(n<7?'Pebble '+(n+1)+' of 7'+(who?' · for '+esc(who):'')+' · "Allahu akbar"':'7 of 7 — done')+'</b><span class="tip-r">'+(who?'Seven for yourself first, then seven for each person, then move on. ':'')+(d===10?'One at a time, into the basin. Stop the talbiyah at the first pebble. No dua after Aqabah.':ramiJ<2?'One at a time, into the basin. Then step aside, face the qiblah and make dua.':'One at a time, into the basin. No dua after Aqabah — back to the tent.')+'</span>';}
  if(h)h.hidden=done||!!pz;
  if(p){var nx=pz?js.slice(js.indexOf(pz.j)+1).filter(function(x){return !ramiJDone(d,x);})[0]:null;
    p.hidden=!(done||pz);
    if(pz&&!done){var s0=Math.floor((Date.now()-pz.at)/1000);
      p.innerHTML='<div class="rami-pause" id="ramiPause"><span class="rp-mk" aria-hidden="true">'+mk('hands')+'</span><b class="rp-h">Step out of the path · face the qiblah · raise your hands — make a long dua</b><span class="rp-t">Dua · <span id="ramiPauseT">'+Math.floor(s0/60)+':'+('0'+(s0%60)).slice(-2)+'</span></span><button class="chip-btn rp-my" onclick="event.stopPropagation();myDuasSheet()">'+mk('hands','mkt')+'My duas</button>'
        +'<button class="btn rp-go" id="ramiWalkOn" onclick="event.stopPropagation();ramiWalkOn()"><span>Walk on to '+(nx?JAM[nx][0]:'the next jamrah')+'</span><span class="hs-go" aria-hidden="true">'+mk('arrow')+'</span></button></div>';}
    else p.innerHTML=done?'<p>'+(r.del?'Delegated for today.':'Rami of the '+d+'th complete'+(FN.length?' — and for '+esc(FN.join(', ')):'')+' — '+(d===10?'next: hady, halq, then tawaf al-ifadah.':'no dua after Aqabah: back to the tent.'))+'</p><button class="btn" onclick="event.stopPropagation();exitFocus();goTab(\'umrah\',\'steps\',\'rw-h'+d+'rami\')">Exit → Part 2, day '+d+'</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>':'';}
  if(done&&wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}}
/* ── finishing the Hajj: its own log ('us-hajjlog'), counter, badge and keepsake — Part 1's Umrah record is untouched ── */
function finishHajj(){var miss=hajjMissing();if(miss.length){toast('Not yet — still to tick: '+miss.join(', '));vib([40,40,40]);return;}
  var lg={};Object.keys(ST.hlog||{}).forEach(function(k){lg[k]=ST.hlog[k];});lg.done=Date.now();
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}if(!Array.isArray(hist))hist=[];
  hist.push({y:curHajjYear(),type:hajjType(),umrahN:ST.umrahs||0,name:ST.name||'',log:lg,st13:!!ST.stay13,rami:JSON.parse(JSON.stringify(ST.rami||{}))});localStorage.setItem('us-hajjlog',JSON.stringify(hist));var idx=hist.length-1;
  ST.hajjs=(ST.hajjs||0)+1;ST.hlog={};ST.rami={};ST.ramiFor={};ST.hajjTypeConfirmed=false;ST.tawaf=0;ST.sai=0;ST.tmode='nafl';ST.post=true;delete ST.stay13;saveST();
  hajjChk={};save('us-hajj',hajjChk);saiGo=false;cntForce={};lastTap={};ramiDay=0;ramiJ=0;ramiForce=false;
  renderPost();updRites();renderJourneys();chkBadges();applyJourney();updChip();homeRefresh();confetti(160);
  var note=document.getElementById('hajjDoneNote');if(note)note.innerHTML='<div class="rd-note">'+mk('medal','mkt')+'Hajj '+hist[idx].y+' recorded — may Allah accept it!<div class="rd-acts"><button class="chip-btn" onclick="makeHajjKeepsake('+idx+')">🎴 Keepsake</button><button class="chip-btn" onclick="goTab(\'more\',\'guide\',\'journeysArea\')">📜 My journeys</button></div></div>';
  toast('⛺ Hajj '+hist[idx].y+' recorded — may Allah accept it. "The accepted Hajj has no reward but Paradise" (Bukhari 1773)',true);bkNudgeDone('Hajj');
  if(document.getElementById('view-umrah').classList.contains('on'))setTimeout(function(){jumpTo('hajjDone',true);},400);}
function startFreshHajj(){openSheet('<div class="sheet-h danger">↺</div><h3>Start Part 2 fresh?</h3><p>Clears every Hajj tick, the pebble counts and this Hajj’s timeline <b>without recording a Hajj</b>. Your Umrah record, recorded Hajjs and keepsakes are kept.</p><button class="btn danger tall" onclick="startFreshHajjGo()">↺ Clear — nothing recorded</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function startFreshHajjGo(){closeSheet();hajjChk={};save('us-hajj',hajjChk);ST.hlog={};ST.rami={};ST.ramiFor={};ST.hajjTypeConfirmed=false;delete ST.stay13;if(tmHajj())ST.tmode='umrah';saveST();ramiDay=0;ramiJ=0;var n=document.getElementById('hajjDoneNote');if(n)n.innerHTML='';updRites();focusRites(false);toast('Cleared — nothing was recorded');vib(10);}
function makeHajjKeepsake(i){var hist=[];try{hist=JSON.parse(localStorage.getItem('us-hajjlog')||'[]');}catch(e){}var u=hist[i];if(!u)return;var lg=u.log||{},ty=(HAJJ_TYPES[u.type]||{}).t||'';
  var JK=jrKeep(),JH=JK?JK.h:0,c=document.createElement('canvas');c.width=1080;c.height=1350+JH;var x=c.getContext('2d');
  kCloth(x,1080,1350+JH);kBadge(x,540,250,'tent');
  x.textAlign='center';kLabel(x,'My Hajj · '+(u.y||'')+(ty?' · '+ty:''),540,400,40);
  x.font='600 64px '+KF;x.fillStyle=K.ihram;x.fillText(u.name||ST.name||'A guest of Allah',540,500);
  x.font='30px '+KB;x.fillStyle=K.ihram2;x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  /* G2 #18: day by day in two columns (8–10 | 11–13 + wada); a caught-up step shows its date only; the "for Mum" detail stays in the app */
  var st13=u.st13||!!(lg.h13rami||lg.rami13),G=hlogDays(lg,u.type,st13,{}),cols=[G.filter(function(g){return g.d&&g.d<=10;}),G.filter(function(g){return !g.d||g.d>10;})];
  cols.forEach(function(col,ci){var x0=ci?565:105,x1=ci?975:515,y=640;col.forEach(function(g){x.textAlign='left';x.font='700 24px '+KB;x.fillStyle=K.gold3;x.fillText(g.d?g.d+' DHUL HIJJAH':'BEFORE LEAVING',x0,y);y+=44;
    g.rows.forEach(function(r){var t=r.t.replace(/ \(delegated\)| · and for .*/g,''),v=r.waived?'waived':hlogVal(r),fs=28,w=function(){x.font=fs+'px '+KB;var a=x.measureText(t).width;x.font='600 '+fs+'px '+KB;return a+x.measureText(v).width+18;};
      while(fs>18&&w()>x1-x0)fs--;x.textAlign='left';x.font=fs+'px '+KB;x.fillStyle=K.ihram2;x.fillText(t,x0,y);x.textAlign='right';x.font='600 '+fs+'px '+KB;x.fillStyle=K.ihram;x.fillText(v,x1,y);y+=48;});y+=14;});});
  x.textAlign='center';x.font='500 28px '+KB;x.fillStyle=K.gold3;jrDraw(x,JK,1150);x.fillText('“…he will return as if he were born anew.” — Bukhari 1521',540,1185+JH);
  kFoot(x,'Miqah · umrah-strivers.vercel.app',540,1235+JH);
  exportImage(c,'my-hajj-'+(u.y||'')+'.png','My Hajj keepsake');}

/* ════════════════════════ DAILY ════════════════════════ */
/* D-20: rows a menstruating sister is excused from on a day flagged dailyChk['d<n>']._excused */
var EXCUSED_IDS=['fajr','dhuhr','asr','maghrib','isha','tahajjud','duha','ntawaf'];
function dayExcused(n){var d=dailyChk['d'+(n===undefined?ST.day:n)];return !!(d&&d._excused);}
/* D-09 / D-20: totals for one day — excused rows drop out, points carry the weight */
/* 6.5 (G1 #7): on a day of Hajj some rows cannot happen (no nafl tawaf, ziyarah or Haram recitation in Mina or at Arafah; no tahajjud on the Muzdalifah night) — they take the
   excused style with "Not today — Mina", drop out of the percentage and pause streaks. The takbir row (j:'hajj', hdays 10–13) counts only on its days. Rite ticks stay in Part 2. */
var HAJJDAY_OFF={8:{ntawaf:'Mina',ziyarah:'Mina',listen:'Mina'},9:{ntawaf:'Arafah',ziyarah:'Arafah',listen:'Arafah'},10:{tahajjud:'Muzdalifah night',ziyarah:'Yawm an-Nahr',ntawaf:'tawaf al-ifadah is in Part 2'},11:{ntawaf:'Mina',ziyarah:'Mina',listen:'Mina'},12:{ntawaf:'Mina',ziyarah:'Mina',listen:'Mina'},13:{ntawaf:'Mina',ziyarah:'Mina',listen:'Mina'}};
/* the Hijri day (8..13) a trip day falls on — today's from hajjDay(), any other from its date — or null */
function tripHajjDay(n){if(journey()!=='hajj')return null;var ex=expectedDay();if(ex===n||(ex===null&&n===ST.day)){var hd=hajjDay();return typeof hd==='number'?hd:null;}
  var dt=dayDateObj(n);if(!dt)return null;var D=hajjDates(curHajjYear()),iso=isoOf(dt);for(var k=8;k<=13;k++)if(D[k]===iso)return k;return null;}
function hajjOffMap(n){var hd=tripHajjDay(n);if(!hd||(hd===13&&!ST.stay13))return {};return HAJJDAY_OFF[hd]||{};}
function dailyOn(it,n){if(!forMe(it))return false;if(!it.hdays)return true;var hd=tripHajjDay(n);return !!hd&&it.hdays.indexOf(hd)>-1;}
function itemCounts(n){var d=dailyChk['d'+n]||{},ex=!!d._excused,off=hajjOffMap(n),acc={tot:0,done:0,max:0,pts:0};DAILY.forEach(function(s){s.items.forEach(function(it){if(ex&&EXCUSED_IDS.indexOf(it.id)>-1)return;if(off[it.id]||!dailyOn(it,n))return;acc.tot++;acc.max+=it.pts;if(d[it.id]){acc.done++;acc.pts+=it.pts;}});});return acc;}
function renderDaily(){
  var h='';
  DAILY.forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      inner+='<div class="row" id="dw-'+it.id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="togDaily(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b><span class="rl">'+it.label+'</span>'+(it.pts>=15?'<span class="prio">Priority</span>':'')+(it.id==='ntawaf'?'<span class="xn" id="ntawafN" hidden></span>':'')+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+(it.ref?'<div class="rf">'+it.ref+'</div>':'')+refChip(it)+'</div></div>';
    });
    /* D-02: the tick rows come first; the section's hadith sits under them */
    var s2={};for(var k in sec)if(k!=='hn')s2[k]=sec[k];s2.title='<span id="dt-'+sec.id+'">'+sec.title+'</span>';
    if(sec.hn)inner+='<div class="note" id="dn-'+sec.id+'">'+sec.hn+'</div>';
    h+=mkSec(s2,i>0,inner);
  });
  document.getElementById('dailyContainer').innerHTML=h;
}
function dayKey(){return 'd'+ST.day;}
function togDaily(id){var d=dailyChk[dayKey()]||{};if(d._excused&&EXCUSED_IDS.indexOf(id)>-1){toast('🌸 Set aside today — you are excused');return;}
  /* (G1 review) a Hajj-day "Not today" row is excused for the day: a tap explains instead of ticking a hidden box that would feed the badges */
  var off=hajjOffMap(ST.day);if(off[id]){toast('Not today — '+off[id]);return;}d[id]=!d[id];if(id==='ntawaf'&&!d[id])delete d.ntawafN;dailyChk[dayKey()]=d;save('us-daily',dailyChk);vib(15);updDaily();updStats();chkBadges();}
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
function updDaily(){renderTB();renderWater();renderTodayTop();renderHomePT();renderRamDay();renderKidsDay();renderJournal();
  var ex=expectedDay(),off=!!ex&&ex!==ST.day,dd=document.getElementById('dayDisp');
  if(dd){var hdd=(!off&&journey()==='hajj')?hajjDay():null;
    /* J-08: during the days of Hajj the label leads with the Hijri day; nothing else about the day changes */
    dd.innerHTML=typeof hdd==='number'?hdd+' Dhul Hijjah <small>· day '+ST.day+' of '+ST.tripLen+'</small>':'Day '+ST.day+' <small>of '+ST.tripLen+'</small>';dd.setAttribute('aria-label',(typeof hdd==='number'?hdd+' Dhul Hijjah, ':'')+'Day '+ST.day+' of '+ST.tripLen+(off?(ST.day<ex?', a past day':', a day ahead'):'')+' — open trip stats');}
  var dl=document.getElementById('dayDate');if(dl){var dt=dayDateObj(ST.day),ds=dayDateStr(ST.day),hj=dt?hijriFor(dt.getFullYear(),dt.getMonth(),dt.getDate()):'';dl.textContent=(off?(ST.day<ex?'Past day · ':'Ahead · '):'')+(ds?ds+(hj?' · '+hj:''):'Set your departure date in Plan › Prepare for real dates');}
  var pv=document.getElementById('dayPrev'),nx=document.getElementById('dayNext'),td=document.getElementById('dayToday');
  if(pv){pv.disabled=ST.day<=1;pv.setAttribute('aria-disabled',pv.disabled?'true':'false');}if(nx){nx.disabled=ST.day>=ST.tripLen;nx.setAttribute('aria-disabled',nx.disabled?'true':'false');}if(td)td.hidden=!off;
  var d=dailyChk[dayKey()]||{},exc=!!d._excused,off=hajjOffMap(ST.day);
  DAILY.forEach(function(sec){var sd=0,st=0;sec.items.forEach(function(it){var on=!!d[it.id],vis=dailyOn(it,ST.day),ho=!!off[it.id],skip=(exc&&EXCUSED_IDS.indexOf(it.id)>-1)||ho;if(!skip&&vis){st++;if(on)sd++;}
    var w=document.getElementById('dw-'+it.id);if(w){w.hidden=!vis;w.classList.toggle('done',on&&!skip);w.classList.toggle('excused',skip);w.classList.toggle('hoff',ho&&!(exc&&EXCUSED_IDS.indexOf(it.id)>-1));w.setAttribute('aria-checked',on&&!skip?'true':'false');w.setAttribute('aria-disabled',skip?'true':'false');
      var wb=w.querySelector('.row-t b');if(wb){if(ho)wb.setAttribute('data-off',/^tawaf/.test(off[it.id])?'Today’s tawaf: '+off[it.id].replace(/^tawaf al-ifadah is/,'al-ifadah,'):'Not today — '+off[it.id]);else wb.removeAttribute('data-off');}}});
    var sp=document.getElementById('sp-'+sec.id);if(sp)sp.textContent=sd+'/'+st;});
  var xn=document.getElementById('ntawafN');if(xn){var nn=d.ntawafN||0;xn.hidden=nn<2;xn.textContent='×'+nn;}
  var C=itemCounts(ST.day),pct=C.max?Math.round(C.pts/C.max*100):0;
  animPct('dPct',pct);setRing('dRing',pct);
  document.getElementById('dHeroT').textContent=pct>=100?'Perfect day':pct>=70?'Strong day':pct>=35?'Keep going':pct>0?'Good start':'Bismillah';
  var dhn=document.getElementById('dHeroN');if(dhn)dhn.textContent=C.done;
  document.getElementById('dHeroS').innerHTML='of '+C.tot+(exc?' that count today<span class="exc-line">Ihram, dhikr, dua and listening continue — tawaf waits until you are pure (<a href="#" onclick="event.preventDefault();openQA(\'menses\')">Bukhari 305</a>); salah is not prayed now and is not made up (Bukhari 321)</span>':' completed');
  /* D-07: the real Friday's Dhuhr row is Jumu'ah */
  var rl=document.querySelector('#dw-dhuhr .rl');if(rl)rl.textContent=(ST.day===ex&&isFriday())?'Jumu’ah in congregation':'Dhuhr in congregation';
  hajjDailyHead(ST.day);
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
  openSheet('<div class="sheet-h rose">🌸</div><h3>'+(exc?'Day '+ST.day+' is excused':'Excused today?')+'</h3><p class="lead">Menstruating? The Prophet ﷺ told Aishah (RA): <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p><ul><li>Salah, tahajjud, duha and nafl tawaf are <b>set aside</b> today — they are not performed during menses, and missed salah is not made up (Bukhari 321). They will not count against you.</li><li>Quran (listening or tafsir; the Malikis and many scholars, including Ibn Baz, also allow reciting from memory without touching the mushaf), adhkar, dhikr, dua, sadaqah, serving pilgrims, ziyarah and Zamzam continue and still count.</li><li>Streaks pause — they neither grow nor break on an excused day.</li></ul>'
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
    var hoff=hajjOffMap(day);if(ids.length&&ids.every(function(id){return hoff[id];}))continue;
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
    /* G2 #19: a day of Hajj carries a small tent mark and its name ("9 Dhul Hijjah · Arafah") */
    var hd=heatHajjDay(i),hn=hd?hd+' Dhul Hijjah · '+DH_NAME[hd]:'';
    h+='<div class="hc '+cls+(i===ST.day?' now':'')+(ex?' exc':'')+(hd?' hj':'')+'" role="button" tabindex="0" onclick="heatGo('+i+')" title="Day '+i+(dt?' · '+dt:'')+(hn?' · '+hn:'')+(p!==null?': '+p+'%':'')+(ex?' (excused)':'')+'" aria-label="Day '+i+(dt?', '+dt:'')+(hn?', '+hn:'')+(p!==null?', '+p+'%':', not logged')+(ex?', excused':'')+' — open to log it">'+i+(hd?'<span class="hc-hj" aria-hidden="true">'+mk('tent')+'</span>':'')+'</div>';
  }
  g.style.gridTemplateColumns='repeat('+Math.min(ST.tripLen,7)+',minmax(0,1fr))';
  g.innerHTML=h;
  var lg=document.getElementById('heatLeg');if(lg)lg.innerHTML='<i class="hc h1"></i>&lt;40% <i class="hc h2"></i>40% <i class="hc h3"></i>70% <i class="hc h4"></i>90%+ <span class="hleg-h">Tap a day to log it</span>';
}
function heatHajjDay(i){var hd=tripHajjDay(i);return hd&&(hd<13||ST.stay13)?hd:0;}
function heatGo(i,force){var hd=heatHajjDay(i);
  if(hd&&!force){var sec=HAJJ_RITES.filter(function(x){return x.hd===hd&&!x.night;})[0];openSheet('<div class="sheet-h">'+mk('tent')+'</div><h3>Day '+i+' · '+hd+' Dhul Hijjah · '+DH_NAME[hd]+'</h3><p>Log the day’s worship in Daily, or open the day’s rites in Part 2.</p><button class="btn" id="heatHajjGo" onclick="closeSheet();openHajjDay(\''+(sec?sec.id:'hd'+hd)+'\')">Open day '+hd+' in Part 2</button><button class="btn ghost" onclick="closeSheet();heatGo('+i+',true)">Daily log for day '+i+'</button>');vib(8);return;}
  setDay(i,true);goSub('daily','today',true);setTimeout(function(){jumpTo('dayNav',true);},60);vib(8);}
/* G2 #19: the Hajj itself in the stats — steps ticked, own pebbles thrown (delegated days marked, pebbles for others apart), whole days of Hajj done */
function hajjPebbles(){var R=ST.rami||{},days=[10,11,12].concat(ST.stay13||R[13]?[13]:[]),o={thrown:0,need:0,del:[],oth:0};
  days.forEach(function(d){var r=R[d]||{},js=ramiJams(d);if(r.del){o.del.push(d);return;}o.need+=7*js.length;js.forEach(function(j){o.thrown+=Math.min(7,r[j]||0);});Object.keys(r.p||{}).forEach(function(nm){js.forEach(function(j){o.oth+=ramiPC(r,nm,j);});});});return o;}
function hajjDaysDone(){var days=[8,9,10,11,12].concat(ST.stay13?[13]:[]),S=hajjSecs(),n=0;days.forEach(function(d){var L=S.filter(function(s){return s.hd===d;});if(L.length&&L.every(function(s){return s.steps.some(forMe)&&catchSteps(s).length===0;}))n++;});return {done:n,tot:days.length};}
function statsEmpty(){var logged=0;for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0)logged++;}var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;return logged===0&&!totalUmrahs()&&pv===0&&tbTotal()===0;}
function updStats(){
  var logged=0,sum=0,best=0,bestD=0,perf=0,nt=0;
  for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0){logged++;sum+=p;if(p>best){best=p;bestD=i;}if(p>=80)perf++;}var dd=dailyChk['d'+i];if(dd)nt+=(dd.ntawafN||(dd.ntawaf?1:0));}
  function set(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  set('stDays',logged);set('stAvg',(logged?Math.round(sum/logged):0)+'%');set('stBest',bestD?'Day '+bestD+' ('+best+'%)':'—');set('stPerf',perf);
  set('stHeroN',logged);set('stHeroOf','of '+ST.tripLen+' days with worship logged');set('stHeroAvg',(logged?Math.round(sum/logged):0)+'%');set('stHeroBest',bestD?'Day '+bestD:'—');
  var HJ=journey()==='hajj',rec=HJ&&hajjRecordedNow(),HT=HJ?hajjTotals():null;set('stHeroUL',HJ?'Hajj steps':'Umrahs');set('stHeroU',!HJ?totalUmrahs():rec?'done ✓':HT.done+'/'+HT.tot);
  ['stHajjRow','stPebRow','stHdRow'].forEach(function(id){var e=document.getElementById(id);if(e)e.hidden=!HJ;});
  if(HJ){var PB=hajjPebbles(),DD=hajjDaysDone();set('stHajj',rec?'recorded ✓':HT.done+' of '+HT.tot);set('stPeb',PB.thrown+' of '+PB.need);
    set('stPebN',[PB.del.length?'the '+PB.del.map(function(d){return d+'th';}).join(', ')+' delegated':'',PB.oth?'+'+PB.oth+' thrown for others':''].filter(Boolean).join(' · '));set('stHd',rec?'recorded ✓':DD.done+' of '+DD.tot);}
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
function migrateHotel(){if(ST.hotelInfo&&typeof ST.hotelInfo==='object'&&!ST.hotelInfo.mk&&!ST.hotelInfo.md){ST.hotelInfo=hiNorm(ST.hotelInfo);saveST();}var h=ST.hotel;if(Array.isArray(h)){var c=cityOf([+h[0],+h[1]]);ST.hotel={};if(c)ST.hotel[c]=[+h[0],+h[1]];saveST();}else if(h&&typeof h!=='object'){ST.hotel={};saveST();}}
function nearAnchor(city,ll){var best=null,bd=1e9;(HOTEL_ANCHORS[city]||[]).forEach(function(a){var d=hav(ll,[a[1],a[2]]);if(d<bd){bd=d;best=a[0];}});return bd<=2.5?best:CITY_N[city]+' pin';}
function pinName(city){var r=hiOf(city);return r.n?r.n:nearAnchor(city,hotelPin(city));}
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
  return '<div class="tour'+(tourOpen?' open':'')+'" id="tourCard"><div class="tour-h" role="button" tabindex="0" aria-expanded="'+(tourOpen?'true':'false')+'" onclick="togTour(this)"><span class="tour-i">🚌</span><div><b>Ziyarah bus (hop-on hop-off)</b><small>City Sightseeing · 2 routes · tap for stops &amp; booking</small></div><span class="place-ch" aria-hidden="true">▾</span></div>'
    +'<p>One ticket, two loops: the Red route is the history loop (Uhud, Qiblatayn, Quba), the Green route starts at the Prophet’s Mosque. Stops can change, so check the operator’s current route map (csmadinah.com), timetable and price when booking.</p>'+ckLine(TOUR)
    +'<div class="stops">'+st+'</div>'
    +'<a class="btn gold" style="margin-top:12px;text-align:center;text-decoration:none" href="'+TOUR.url+'" target="_blank" rel="noopener">🎟️ Book on city-sightseeing.com →</a>'
    +'<div class="tour-note">Tip: ride the full Red loop once for orientation, then hop off at Quba and Uhud around Fajr/Asr when they are calmest. Tap a stop to open its card.</div></div>';
}
function togTour(h){var t=h.parentNode;tourOpen=!t.classList.contains('open');t.classList.toggle('open',tourOpen);h.setAttribute('aria-expanded',tourOpen?'true':'false');}
/* one place card — collapsed header carries the Arabic name, access tags, distance and the visited day (L-04, L-05, L-10) */
var PL_WAY={arafat:[["waySheet('bound-arafah')",'Am I inside Arafah?']],muzdalifah:[["waySheet('bound-muzdalifah-mina')",'Where it begins and ends']],mina:[["campWaySheet()",'Finding your way back'],["showCampCard()",'My camp card']],jamarat:[["jamSheet()",'The Jamarat, drawn'],["goSheet('go-walking')",'Getting there']]};
function placeCard(p,q){
  var dist=distLbl(p),inR=inRoute(p.id),on=!!placeVis[p.id];
  var meta=(p.stop?'<span class="stopbadge '+(p.stop[0]==='R'?'red':'green')+'" role="button" tabindex="0" aria-label="Hop-on hop-off stop — open the bus card" onclick="event.stopPropagation();openTour()">🚌 Stop '+p.stop.slice(1)+' · '+(p.stop[0]==='R'?'Red':'Green')+'</span>':'')
    +(p.tags||[]).map(function(t){return '<span class="ptag">'+t+'</span>';}).join('')+(dist?'<span class="distchip">'+dist+'</span>':'')+visLbl(p.id);
  return '<div class="place'+(on?' vis':'')+(q?' open':'')+'" id="pl-'+p.id+'"><div class="place-h" onclick="plTog(this)"><div class="place-ico" role="button" tabindex="0" aria-label="'+(on?'Visited — tap to unmark':'Mark visited')+'" onclick="event.stopPropagation();togPlace(\''+p.id+'\')">'+p.i+'</div><div class="place-t"><div class="place-tg" role="button" tabindex="0" aria-expanded="'+(q?'true':'false')+'" onclick="event.stopPropagation();plTog(this)"><b>'+p.n+'</b>'+(p.ar?'<span class="plar" lang="ar" dir="rtl">'+p.ar+'</span>':'')+meta+'</div><p>'+p.d+'</p><div class="tip">'+mk('bulb','mkt')+p.tip+'</div></div><span class="place-ch" aria-hidden="true">▾</span></div>'
    +'<div class="place-a"><a href="'+mapsSearch(p)+'" target="_blank" rel="noopener">🗺️ Open in Maps</a><button onclick="showPlaceDriver(\''+p.id+'\')">🚕 Show driver</button>'+(routable(p)?'<button class="rt'+(inR?' on':'')+'" onclick="togRoute(\''+p.id+'\')">'+(inR?'✓ In route':'＋ Route')+'</button>':'')+'<button class="mv" onclick="togPlace(\''+p.id+'\')">'+(on?'✓ Visited':'Mark visited')+'</button></div>'
    +(p.id==='rawdah'?'<div class="place-a" style="margin-top:8px"><a href="https://www.nusuk.sa/" target="_blank" rel="noopener">🎫 Get the free Rawdah permit on Nusuk</a></div>':'')
    +(PL_WAY[p.id]&&journey()==='hajj'?'<div class="place-a" style="margin-top:8px">'+PL_WAY[p.id].map(function(w){return '<button onclick="'+w[0]+'">'+w[1]+'</button>';}).join('')+'</div>':'')
    +(['taneem','jiranah','miqat'].indexOf(p.id)>-1?'<div class="place-a" style="margin-top:8px"><button onclick="goTab(\'umrah\',\'steps\')">🤍 Umrah steps — ihram from here</button></div>':'')+'<div class="place-x">'+ckLine(p)+corrBtn('place',p.id)+'</div></div>';
}
/* the header row is the pointer target; the title block inside it is the one keyboard / screen-reader toggle, a sibling of “Mark visited” — never a button inside a button */
function plTog(el){var c=el.closest('.place');if(!c)return;var open=c.classList.toggle('open'),t=c.querySelector('.place-tg');if(t)t.setAttribute('aria-expanded',open?'true':'false');}
function renderPlaces(){var wr=document.getElementById('wayRowBox');if(wr)wr.innerHTML=wayRowHTML();
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
  if(lr.mode==='auto'&&!routeClimbs[city]){var cl=PLACES.filter(function(p){return p.city===city&&p.climb&&!placeVis[p.id];});if(cl.length)notes.push('⛰️ Left out: '+cl.map(function(p){return p.n.split(' &')[0];}).join(', ')+' (steep climbs — about 45–90 min up Hira, 1–2 hours up Thawr — not for young children or the elderly). <button class="lnk" style="font-size:1em" onclick="planRoute(\''+city+'\',true)">Include climbs</button>');}
  var nr=PLACES.filter(function(p){return p.city===city&&!p.ll&&!placeVis[p.id]&&countable(p);});if(nr.length)notes.push('Not routable: '+nr.map(function(p){return '<a href="'+mapsSearch(p)+'" target="_blank" rel="noopener">'+p.n+'</a>';}).join(', ')+' (open in Maps).');
  notes.push((lr.mode==='sel'?'Your picks, nearest-first':'Nearest-first, unvisited sites only')+' from '+(nearPos?'your location':'your hotel')+'. Check opening times; Baqi’ usually opens to men after Fajr and Asr, and Mu’alla’s visiting hours are limited.');
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
  var lead=document.getElementById('drvLead');if(lead){lead.textContent=String(o.lead||'من فضلك خذني إلى').trim();lead.hidden=!lead.textContent;}
  var an=document.getElementById('drvArName');if(an){if(o.arH)an.innerHTML=o.arH;else an.textContent=o.ar||'';an.hidden=!(o.ar||o.arH);}
  document.getElementById('drvName').textContent=o.en||'—';document.getElementById('drvAddr').textContent=o.sub||'';document.getElementById('drvPhone').innerHTML=o.tel?mk('phone','mkt')+esc(o.tel):'';
  var online=navigator.onLine!==false;
  document.getElementById('drvActs').innerHTML=(o.alt?'<button class="btn ghost drv-alt" id="drvAlt" onclick="event.stopPropagation();'+o.alt.go+'">'+mk(o.alt.ic,'mkt')+esc(o.alt.l)+'</button>':'')+(o.tel?'<a href="tel:'+telOf(o.tel)+'" class="btn" onclick="event.stopPropagation()">'+(o.telL||mk('phone','mkt')+'Call hotel')+'</a>':'')+(o.maps?'<a class="btn ghost'+(online?'':' off')+'" href="'+o.maps+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+(online?'🗺️ Open in Maps':'🗺️ Map needs signal')+'</a>':'');
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
/* 6.5 (G1 #8): on a day of Hajj the day's duas come first under a "Today" strip (8th: intention (Tamattu’) + talbiyah; 9th: the dua of Arafah + talbiyah, with the sunset
   countdown; 10th–13th: the pebble takbir + the takbir of tashriq), and from the 9th the mosque and Madinah cards go last. DUAS indices never change (duaIdx / openDua). */
var duaViewOrder=[];
function duaTodayIdx(hd){var L=[];if(hd===8){if(hajjType()==='tamattu')L.push(duaIdx('Intention for Hajj'));L.push(duaIdx('Talbiyah'));}else if(hd===9)L=[duaIdx('dua of Arafah'),duaIdx('Talbiyah')];else if(hd>=10&&hd<=13)L=[duaIdx('pebble'),duaIdx('Muzdalifah')];
  return L.filter(function(i){return i>-1&&forMe(DUAS[i]);});}
function duaTodayStrip(hd){var h='<span class="dt-k">'+mk('calendar','mkt')+'Today · '+hd+' Dhul Hijjah · '+DH_NAME[hd]+'</span>';
  if(hd===9){var A=arafahNow();h+='<span class="dt-s">'+(A.ph==='set'?'Sunset ≈ '+A.sun+' has passed — leave calmly with your group':'Sunset ≈ '+A.sun+' · '+hjLiveHTML(A.sunM)+' left · computed ±2 min, follow your group')+'</span>';}
  return h;}
function renderDuaToday(){var e=document.getElementById('duaToday'),hd=journey()==='hajj'?hajjDay():null;if(!e)return;if(typeof hd==='number'){var v=duaTodayStrip(hd);if(e.getAttribute('data-v')!==v){e.innerHTML=v;e.setAttribute('data-v',v);}}}
function openDuaV(i){dfList=duaViewOrder.map(function(k){return DUAS[k];});dfIdx=dfList.indexOf(DUAS[i]);if(dfIdx<0){openDua(i);return;}renderDF();}
function renderDuas(){
  var h='',hd=journey()==='hajj'?hajjDay():null,day=typeof hd==='number'?hd:0,top=day?duaTodayIdx(day):[],last=day>=9?[duaIdx('Entering the mosque'),duaIdx('Leaving the mosque'),duaIdx('Salam upon the Prophet')]:[],order=top.slice();
  /* Ramadan trip: on a last-ten night the dua for Laylat al-Qadr leads; around Maghrib (the last hour of the fast, the first hour after) the dua after breaking the fast leads */
  var RS=day?null:ramNow(),ramT='';if(RS){var rq=duaIdx('Laylat al-Qadr'),ri=duaIdx('After breaking your fast'),nearM=RS.fast&&((RS.k==='iftar'&&RS.left<=60)||(RS.sinceM>=0&&RS.sinceM<=60));
    if(nearM&&ri>-1&&forMe(DUAS[ri]))top.push(ri);if(RS.ten&&rq>-1&&forMe(DUAS[rq]))top.push(rq);order=top.slice();
    if(top.length)ramT='<div class="dua-today" id="duaRam" role="note"><span class="dt-k">'+mk('moon','mkt')+(RS.ten?'Tonight · the night of the '+ordN(RS.tonight)+(RS.odd?' — an odd night of the last ten':' — one of the last ten nights'):'Ramadan · day '+RS.dayN+' · Maghrib '+(RS.calc0?'≈ ':'')+RS.magh)+'</span></div>';}
  DUAS.forEach(function(d,i){if(forMe(d)&&order.indexOf(i)<0&&last.indexOf(i)<0)order.push(i);});last.forEach(function(i){if(i>-1&&forMe(DUAS[i])&&order.indexOf(i)<0)order.push(i);});
  duaViewOrder=order;
  if(duas.length)h+='<div class="dua-mine" id="duaMine"><span>'+mk('hands','mkt')+'My dua list · '+duaListLbl()+'</span>'+myDuasReadBtn('duasRead')+'</div>';
  if(top.length)h+=day?'<div class="dua-today" id="duaToday" role="note">'+duaTodayStrip(day)+'</div>':ramT;
  order.forEach(function(i,k){var d=DUAS[i];if(top.length&&k===top.length)h+='<div class="subt dua-rest">More duas</div>';h+='<div class="duacard'+(k<top.length?' today':'')+'"><div class="dua-top"><h4 style="margin:0">'+d.t+'</h4><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">'+mk('speaker')+'<span>Listen</span></button></div><div class="dua tapable" style="margin:0;background:transparent;border:none;padding:0" onclick="openDuaV('+i+')"><span class="ar" lang="ar" dir="rtl">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span><span class="src">'+d.s+'</span><button type="button" class="enl" aria-label="Open '+d.t.replace(/"/g,'')+' full screen">⛶ tap to enlarge</button></div>'+corrBtn('dua',i)+'</div>';});
  document.getElementById('duaContainer').innerHTML=h;
}
function exportData(){
  var ls={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('us-')===0&&k!=='us-ptcache'&&k!=='us-remlast')ls[k]=localStorage.getItem(k);}
  var data={v:3,exported:new Date().toISOString(),settings:ST,plan:planChk,rites:riteChk,daily:dailyChk,places:placeVis,badges:earned,ls:ls};
  /* 6.9 (G5 #48): the phone's share sheet first (Files, Drive, WhatsApp to yourself) — the same path as the calendar export — then the plain download */
  var name='miqah-'+new Date().toISOString().slice(0,10)+'.json',b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),file=null;try{file=new File([b],name,{type:'application/json'});}catch(e){}
  var done=function(msg){ST.bkAt=Date.now();saveST();updBkLine();toast(msg);};
  var dl=function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);done('📤 Backup exported');};
  var can=false;try{can=!!(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]}));}catch(e){}
  if(can)navigator.share({files:[file],title:'Miqah backup'}).then(function(){done('📤 Backup shared — keep the file somewhere safe');}).catch(function(err){if(err&&err.name==='AbortError')return;dl();});
  else dl();
}
function bkAgo(){var t=ST.bkAt||0;if(!t)return 'never';var d=Math.floor((Date.now()-t)/864e5);return d<=0?'today':d===1?'yesterday':d+' days ago';}
function updBkLine(){var e=document.getElementById('bkLine');if(e)e.textContent='Last backup: '+bkAgo();updStoreRow();}
/* quiet nudges, never a push: the day before departure, after a journey is recorded, and on the trip when the last backup is over 14 days old (asked again after 3 days at most) */
function bkNudge(msg){if(document.querySelector('.sheet-o.on,.focus.on'))return;toast(msg,false,'Back up',exportData);}
function bkNudgeCheck(){if(!ST.onboarded)return;var d=depDays(),N=ST.bkN||{},age=ST.bkAt?(Date.now()-ST.bkAt)/864e5:9999,today=isoOf(new Date());
  if(d===1&&N.pre!==ST.dep&&age>1){N.pre=ST.dep;ST.bkN=N;saveST();bkNudge('You fly tomorrow — save a backup of your checklists and duas');return;}
  if(onTrip()&&d<0&&age>14&&(!N.at||(Date.now()-N.at)>3*864e5)){N.at=Date.now();ST.bkN=N;saveST();bkNudge(ST.bkAt?'Last backup '+bkAgo()+' — save your journal and counts':'No backup yet — save your journal and counts');}}
function bkNudgeDone(what){setTimeout(function(){bkNudge(what+' recorded — save a backup so the keepsake is safe');},5000);}
/* the keys a restore replaces: everything of the app's except the prayer-time cache and, when this phone has a vault, the vault's own keys (its documents are never in a backup) */
function bkKeys(){var ks=[],keepV=!!localStorage.getItem('us-vault-chk');for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('us-')===0&&k!=='us-ptcache'&&!(keepV&&/^us-vault-/.test(k)))ks.push(k);}return ks;}
function bkRestore(map){var keepV=!!localStorage.getItem('us-vault-chk');bkKeys().forEach(function(k){localStorage.removeItem(k);});Object.keys(map).forEach(function(k){if(k.indexOf('us-')===0&&k!=='us-ptcache'&&typeof map[k]==='string'&&!(keepV&&/^us-vault-/.test(k)))localStorage.setItem(k,map[k]);});}
/* the copy of what an import replaced waits in this tab (sessionStorage 'miqah-undo') until the pilgrim answers: Undo, Keep, or another import. Never on a timer. */
function bkUndoGet(){var raw=null,old=null;try{raw=sessionStorage.getItem('miqah-undo');}catch(e){}if(!raw)return null;try{old=JSON.parse(raw);}catch(e){}return old&&typeof old==='object'&&!Array.isArray(old)?old:null;}
function bkUndoRow(){var e=document.getElementById('bkUndoRow');if(!e)return;var on=!!bkUndoGet();e.hidden=!on;e.innerHTML=on?'<div><b>Backup imported</b><small>It replaced what was on this phone. Your old data is kept until you choose, or until this tab is closed.</small></div><div class="bk-undo-a"><button class="chip-btn" id="bkUndoBtn" onclick="bkUndoDo()">Undo</button><button class="chip-btn" id="bkKeepBtn" onclick="bkUndoKeep()">Keep</button></div>':'';}
function bkUndoDo(){var old=bkUndoGet();if(!old)return;bkRestore(old);try{sessionStorage.removeItem('miqah-undo');}catch(e){}closeSheet();toast('Putting your data back…');setTimeout(function(){location.reload();},500);}
function bkUndoKeep(){try{sessionStorage.removeItem('miqah-undo');}catch(e){}bkUndoRow();if(document.getElementById('bkUndoSheet'))closeSheet();toast('✓ Backup kept');}
function bkUndoOffer(){bkUndoRow();if(!bkUndoGet())return;
  setTimeout(function(){if(!bkUndoGet()||document.querySelector('.sheet-o.on,.focus.on'))return;openSheet('<div class="sheet-h" id="bkUndoSheet">'+mk('check')+'</div><h3>Backup imported</h3><p>It replaced what was on this phone. If it was the wrong file, you can put your old data back now.</p><button class="btn tall" onclick="bkUndoKeep()">Keep the backup</button><button class="btn ghost tall" onclick="bkUndoDo()">Undo — put my old data back</button><p style="font-size:var(--t-2);color:var(--ink3)">The same choice stays in More › Settings › Your data until you answer or close this tab.</p>');},900);}
function importData(ev){
  var f=ev.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){try{
    var d=JSON.parse(r.result);
    if(!d||typeof d!=='object'||Array.isArray(d)||(!d.ls&&!d.settings))throw new Error('bad');
    /* checked before anything is touched: a known version, and settings that really parse — a damaged or foreign file changes nothing */
    if(d.v!=null&&!(typeof d.v==='number'&&d.v>=1&&d.v<=3))throw new Error('bad');
    if(d.ls!=null){if(typeof d.ls!=='object'||Array.isArray(d.ls)||typeof d.ls['us-settings']!=='string')throw new Error('bad');var ps=JSON.parse(d.ls['us-settings']);if(!ps||typeof ps!=='object'||Array.isArray(ps))throw new Error('bad');}
    else if(!d.settings||typeof d.settings!=='object'||Array.isArray(d.settings))throw new Error('bad');
    if(!confirm('Replace all current data with this backup? Anything that is not in the backup is removed.')){ev.target.value='';return;}
    if(d.ls&&typeof d.ls==='object'){
      /* 6.9 (G5 #48): a restore really replaces — the app's keys are cleared first, and the old values wait in this tab for one Undo */
      var old={};bkKeys().forEach(function(k){old[k]=localStorage.getItem(k);});try{sessionStorage.setItem('miqah-undo',JSON.stringify(old));}catch(e){}
      bkRestore(d.ls);
      /* the file just restored from is a backup: do not say 'never' */
      try{var rs=JSON.parse(localStorage.getItem('us-settings'));rs.bkAt=Date.now();localStorage.setItem('us-settings',JSON.stringify(rs));}catch(e){}
    }else{
      if(d.settings)ST=Object.assign(ST,d.settings);ST.bkAt=Date.now();
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
/* G3 review: a pilgrim who onboarded as already in Saudi Arabia is never in "the last 48 hours before leaving home" */
function alreadyThere(){return ST.there===true||(ST.there===undefined&&ST.stage==='now'&&journey()!=='hajj');}
/* G3 review: a re-render of Home keeps the keyboard focus on the control that caused it */
function homeRefreshKeep(){var a=document.activeElement,id=a&&a.id;homeRefresh();if(id){var e=document.getElementById(id);if(e&&e!==document.activeElement)try{e.focus({preventScroll:true});}catch(x){}}}
/* H-03: quick-tool actions */
function homeDriver(){if(hiOf().n)showDriver();else{goTab('plan','prep','hotelCard');setTimeout(function(){var e=document.getElementById('hName');if(e)e.focus();},700);}}
function homeRefl(){goPost();setTimeout(function(){jumpTo('postNotes',true);},450);}
/* H-03: tiny full-screen help overlay — the four Saudi numbers, the meeting point and the two offline cards */
/* a show-to-a-stranger phone row: the whole 48px row is the link */
function telRow(lbl,tel,num){return '<a class="lost-kv" href="tel:'+tel+'"><span>'+lbl+'</span><b class="num">'+num+'</b></a>';}
var HELP_TEL=[['🚓','Police · ambulance · fire','911'],['🩺','Saudi Red Crescent','997'],['🏥','Health (Ministry of Health)','937'],['🕋','Hajj &amp; Umrah care line','1966'],['ℹ️','Tourism helpline','930']];
function showHelp(){var hi=hiOf(),ph=leadPhone(),h='',cp=ST.camp||{},cd=campDay(),campRow='';
  /* G2 #9: campN() — "camp 43", never "camp Camp 43"; on a tent day the group leader's row leads */
  if(journey()==='hajj'&&cp.p)campRow=telRow(mkOr('⛺')+' '+esc(cp.l||'Group leader')+(cp.n?' · camp '+esc(campN(cp)):'')+(cp.m?' · maktab '+esc(campM(cp)):''),telOf(cp.p),esc(cp.p));
  h+='<div class="lost-en" style="margin:10px 0 6px">Emergency &amp; help numbers in Saudi Arabia — 911 is free from any phone</div>';
  if(cd)h+=campRow;
  HELP_TEL.forEach(function(t){h+=telRow(mkOr(t[0])+' '+t[1],t[2],t[2]);});
  if(ph)h+=telRow(mkOr('👥')+' '+esc(leadName()||'Companion'),telOf(ph),esc(ph));
  if(!cd)h+=campRow;
  if(hi.p)h+=telRow(mkOr('🏨')+' '+esc(hi.n||'Hotel'),telOf(hi.p),esc(hi.p));
  h+='<small class="ck-on help-ck" id="helpCk">Saudi numbers checked '+ckDate(CK)+'</small>';
  /* the Haram meeting point does not apply in Mina or Arafah: the app's own guidance (TROUBLE_HAJJ hlost; on the 9th the verified wayfinding camp-finding-way line) takes its place */
  if(cd){h+=(cp.n||cp.m)?'<div class="lost-kv"><span>'+mkOr('⛺')+' My camp</span><b style="text-align:right">'+esc(campChipT(cp))+'</b></div>':'<div class="lost-kv"><span>'+mkOr('⛺')+' My camp</span><button class="lnk" style="font-size:1em" onclick="closeHelp();goCampEdit()">Add it →</button></div>';
    h+='<p class="help-camp" id="helpCamp" style="font-size:var(--t-3);color:var(--show-ink2);text-align:center;margin:14px 0 6px">'+(campAtArafah()||campAtMuz()?'If you are lost, show your Nusuk card to security staff, a scout or a Nusuk Care point — the Ministry calls the card the main way to identify you and get you help.':'Lost in Mina? Show your maktab / camp number (on your wristband or card) to any scout (kashaf), security officer or the guides for lost pilgrims — they will walk you there. Never leave Mina to look for your group in Makkah.')+'</p>';}
  else{h+='<div class="lost-kv"><span>'+mkOr('🤝')+' Family meeting point</span>'+(hi.m?'<b style="text-align:right">'+esc(hi.m)+'</b>':'<button class="lnk" style="font-size:1em" onclick="closeHelp();goTab(\'plan\',\'prep\',\'hotelCard\')">Set one →</button>')+'</div>';
  h+='<p style="font-size:var(--t-3);color:var(--show-ink2);text-align:center;margin:14px 0 6px">If separated: go to the meeting point after the next prayer, stay put, and call.</p>';}
  /* G4 #44 / #42 / #41: the phrase cards, the child cards and who I am */
  h+='<button class="say-row" id="helpSay" onclick="showSayList()"><span class="say-rt"><b>'+mk('speaker','mkt')+'Show a phrase</b><small>Doctor, wheelchair, gate, toilets, wudu — in Arabic, full screen</small></span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';
  if(ST.kids||kidNames().length)h+='<button class="say-row" id="helpKids" onclick="showKids()"><span class="say-rt"><b>'+mk('kid','mkt')+'Child cards · my child is lost</b><small>A card for each child, in Arabic and English</small></span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';
  h+=meLostHTML('help');
  h+='<div class="drv-acts" style="margin-top:12px"><button class="btn danger" onclick="closeHelp();showLost()">'+markify('🆘 I’m lost')+'</button><button class="btn ghost" onclick="closeHelp();homeDriver()">'+markify('🚕 To my hotel')+'</button>'+(journey()==='hajj'?'<button class="btn ghost" onclick="closeHelp();showCampDriver()">'+markify('⛺ To my camp')+'</button>':'')+'</div>';
  h+='<div class="focus-hint" style="margin-top:22px;text-align:center" onclick="closeHelp()">tap here to close</div>';
  var b=document.getElementById('helpBody');if(!b)return;b.innerHTML=h;document.getElementById('help').classList.add('on');vib(10);}
function closeHelp(){var e=document.getElementById('help');if(e)e.classList.remove('on');obAfterCardGo();}
/* H-05: the planner's next moves — dated buckets when there is a departure date, the travel-blocking basics otherwise */
function planNext(){var B=tlBuckets(),rows=[];
  if(B){B.over.forEach(function(o){var bl=tlBlock().indexOf(o.it.id)>-1;rows.push({o:o,cls:bl?'over':'late',when:bl?'overdue':'late',pre:'Overdue: '});});
    B.now.forEach(function(o){rows.push({o:o,cls:'now',when:'this week',pre:'This week: '});});
    B.soon.forEach(function(o){rows.push({o:o,cls:'soon',when:'coming up',pre:'Next: '});});}
  else{activePlan().forEach(function(sec){sec.items.forEach(function(it){if(tlBlock().indexOf(it.id)>-1&&forMe(it)&&!planChk[it.id])rows.push({o:{it:it,sec:sec},cls:'soon',when:'first',pre:'Next: '});});});
    if(journey()==='hajj')rows.sort(function(a,b){return tlBlock().indexOf(a.o.it.id)-tlBlock().indexOf(b.o.it.id);});}
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
  var tripOver=d!==null&&d<-ST.tripLen,tu=totalUmrahs(),lg=ST.log||{},act=activeCount(),inHaram=onTrip(),nextRows=[],estOffer=false;
  /* J-06: Hajj mode — the Hijri days of Hajj drive the phase once flying; before that the planner and the "Umrah first" chain */
  var HJ=journey()==='hajj',hd=HJ?hajjDay():null,hy=HJ?curHajjYear():0,HD=HJ?hajjDates(hy):{},hdayHTML='',hsec=null,tuT=HJ?tripUmrahs():ST.umrahs;
  /* (review) once this year's Hajj is recorded the "Hajj completed" state wins over the day card */
  if(HJ&&d!==null&&d<=0&&typeof hd==='number'&&!(ST.post&&ST.hajjs)){
    HAJJ_RITES.forEach(function(s){if(s.hd===hd&&!s.night)hsec=s;});
    var hsteps=hsec?hsec.steps.filter(forMe):[],hdone=hsteps.filter(function(s){return hajjChk[s.id];}).length,hnx=null;hsteps.forEach(function(s){if(!hnx&&!hajjChk[s.id]&&!s.info)hnx=s;});
    pct=hsteps.length?Math.round(hdone/hsteps.length*100):0;phase='⛺ '+hd+' Dhul Hijjah · '+DH_NAME[hd];
    cta=hnx?[fcText(hnx.b),'umrah','steps','rw-'+hnx.id]:['Today’s steps all ticked — log your worship','daily','today'];
    lbl=(hsec?secSub(hsec)+' · ':'')+hdone+' of '+hsteps.length+' steps today';stageNow=1;hsK='hday';
    if(act)cta=['Resume '+(act==='tawaf'?'tawaf':'sa’i')+' ('+ST[act]+'/7)','umrah','count'];
    var conf=ST.hajjConf===hy;
    hdayHTML='<div class="card card-pad hday"><div class="hday-h"><span class="hp-i" style="background:var(--gold-soft)">'+mk(hsec?emk(hsec.ico,'tent'):'tent')+'</span><div><small>Today · Hajj '+hy+'</small><b>'+(conf?hd+' Dhul Hijjah · '+DH_NAME[hd]:'Is today '+hd+' Dhul Hijjah?')+'</b></div></div>'
      +(conf?'<div class="hshift"><span>✓ '+hd+' Dhul Hijjah confirmed</span><button class="lnk" style="font-size:var(--t-3)" onclick="hajjConfReset()">change</button></div>'
        :'<div class="hshift" role="group" aria-label="Correct the Hijri day — today is '+hd+' Dhul Hijjah, correct?"><div><button class="chip-btn" onclick="hajjShiftBy(1)"'+((parseInt(ST.hajjShift)||0)>=1?' disabled':'')+' aria-label="No, it is one day earlier">◀ Earlier</button><button class="chip-btn on" onclick="hajjConfirm()" aria-label="Yes, correct">✓ Yes</button><button class="chip-btn" onclick="hajjShiftBy(-1)"'+((parseInt(ST.hajjShift)||0)<=-1?' disabled':'')+' aria-label="No, it is one day later">Later ▶</button></div></div>')
      +(hsec?'<p style="font-size:var(--t-3);color:var(--ink2);line-height:var(--lh-body)">'+secSub(hsec)+'</p>':'')+'<button class="btn" style="margin-top:10px" onclick="goTab(\'umrah\',\'steps\',\'hajjContainer\')">'+markify('📋 Open today’s steps →')+'</button></div>';}
  else if((ST.post&&(d===null||d<=0))||tripOver){pct=ST.post?Math.round(pc/90*100):((tu||ST.hajjs)?100:0);phase=(HJ&&ST.hajjs)?'⛺ Hajj completed — alhamdulillah':tu?'🕋 '+tu+' Umrah'+(tu===1?'':'s')+' completed — alhamdulillah':'🧭 Your '+(HJ?'Hajj':'Umrah')+' journey';
    if(ST.post){cta=['Log today’s habits','more','guide','postCard'];lbl=pc+' habit-day'+(pc===1?'':'s')+' logged of 90 · keep the Haram version of you'+(HJ&&typeof hd==='number'?' · today '+hd+' Dhul Hijjah':'');}
    else{cta=['Open the 30-day habit keeper','more','guide','postCard'];lbl='Keep it alive at home — the habit keeper and your reflections are under More › After';}
    /* (review) Part 2 ticks waiting with no Hajj recorded: say so before offering the next journey */
    if(HJ&&!ST.hajjs&&Object.keys(hajjChk).some(function(k){return hajjChk[k];})){phase='⛺ Your Hajj — not yet recorded';cta=['Record completed Hajj','umrah','steps','hajjDone'];lbl='Your Part 2 ticks are waiting — record the Hajj to keep its timeline and keepsake';pct=0;var HT0=hajjTotals();if(HT0.tot)pct=Math.round(HT0.done/HT0.tot*100);}
    stageNow=4;hsK='after';}
  else if(d===null||d>0){var P=planTotals(),tot=P.tot,done=P.done;pct=P.pct;
    if(HJ){phase=d===null?'⛺ Hajj '+hy+' — when do you fly?':'⛺ Hajj '+hy+' · '+d+' day'+(d===1?'':'s')+' until you fly';lbl=(HD[9]?'Arafah on '+fmtDate(HD[9],true)+' · ':'')+done+' of '+tot+' prep items';}
    else{phase=d===null?'🧭 Planning — set your departure date':'✈️ '+d+' day'+(d===1?'':'s')+' until departure';lbl=done+' of '+tot+' prep items · '+qzPassedCount()+'/'+qzVisible().length+' quiz levels';}
    cta=[pct<100?'Continue preparing':'Study & quiz','plan',pct<100?'prep':'learn',pct<100?(ST.dep?'tlCard':'cdCard'):null];stageNow=0;hsK='plan';
    /* H-05: the CTA names the first thing to do next */
    if(ST.onboarded){nextRows=planNext();if(nextRows.length){var r0=nextRows[0];cta=[r0.pre+fcText(r0.o.it.label),'plan','prep',ST.dep?'tlCard':'sec-'+r0.o.sec.id];}
      /* 6.7 (G3 #28): with no date the card names one task and does it — the pill sets the date in place (a native date input over it) */
      if(!ST.dep)cta=['Set my departure date','js','hsDatePick()'];
      /* G3 #26: in the last 48 hours the pill stops naming overdue paperwork — it leads to the leave-home list */
      else if(d<=2&&!alreadyThere())cta=['Before you leave home','js','hsLeaveGo()'];}}
  else if(d===0&&!tu&&!dayHasTicks(1)){pct=planTotals().pct;phase='🛫 Departure day — safe travels, labbayk!';cta=['Open the rites guide','umrah','steps'];lbl=HJ?'Ihram at the miqat — every step and dua is in the guide':'Ihram at the miqat → tawaf → sa’i → halq — every step and dua is in the guide';stageNow=1;hsK='dep';}
  else{var ed=expectedDay()||ST.day;dp=dayPct(ed)||0;pct=dp;phase='🕋 Day '+ed+' of '+ST.tripLen+' in the Haramain';cta=['Log today’s worship','daily','today'];lbl=dp+'% of today’s deeds · '+tu+' Umrah'+(tu===1?'':'s')+' completed';stageNow=tuT?2:1;
    var hLeft=(HJ&&HD[8])?daysUntil(HD[8]):null,qf=HJ&&ST.hajjTypeConfirmed&&hajjType()!=='tamattu';
    /* (review) the Hajj phase keys off THIS trip's Umrah (tripUmrahs), never the lifetime count; a Qarin / Mufrid is "in ihram" only once the type is confirmed */
    if(HJ&&hd==='pre'){if(qf)stageNow=1;phase=qf?'🤍 In ihram until the 10th':tuT?'🌱 Out of ihram until 8 Dhul Hijjah':'🕋 Umrah first · Hajj begins in '+hLeft+' day'+(hLeft===1?'':'s');
      lbl=(tuT||qf?'Mina on '+fmtDate(HD[8],true)+' · ':'')+dp+'% of today’s deeds';}
    else if(HJ&&hd==='post'){var wd=!!(hajjChk.hwada||hajjChk.hwadaw),ifd=!!hajjChk.h10ifadah;phase='🕋 After the days of Mina';
      /* (review) a pillar outstanding (e.g. a sister whose period delayed the ifadah) comes before the farewell tawaf */
      cta=!ifd?['Tawaf al-ifadah + sa’i first — the pillar that completes your Hajj','umrah','steps','rw-h10ifadah']:wd?['Log today’s worship','daily','today']:['Tawaf al-wada before you leave Makkah','umrah','steps','hajjContainer'];
      lbl=!ifd?'Tawaf al-ifadah is still open — your Hajj is intact; do it when you can (sisters: once pure)':wd?'Tawaf al-wada done · '+dp+'% of today’s deeds':'Tawaf al-wada is the last thing you do in Makkah (waived for sisters on their period)';stageNow=2;}
    /* H-02 / H-04: until this trip's Umrah is recorded the CTA follows the rites, and an in-progress count always comes first */
    if(act){cta=['Resume '+(act==='tawaf'?'tawaf':'sa’i')+' ('+ST[act]+'/7)','umrah','count'];if(!tuT&&!tmHajj()){lbl='Step '+(act==='tawaf'?'2':'3')+' of 4 · '+(act==='tawaf'?'7 rounds of the Kaaba, in wudu':'Safa → Marwah, 7 laps');pct=umrahPct();}}
    else if(!tuT&&!(HJ&&hd==='post')&&!qf){var ih=!!(lg.ihram||riteChk.niyyah),tE=!!(lg.tawafEnd||riteChk.rounds||umrahTawaf()>=7),sE=!!(lg.saiEnd||riteChk.laps||umrahSai()>=7),hq=!!(lg.halq||riteChk.cut||riteChk.cutw);
      if(!ih){cta=['Begin your Umrah: Ihram','umrah','steps'];lbl='Step 1 of 4 · ihram before the miqat';
        /* 6.7 (G3 #25): from day 2, with no rite tick and no stamp, a quiet "Already did your Umrah?" under the pill */
        if((expectedDay()||ST.day)>=2&&!Object.keys(lg).length&&!Object.keys(riteChk).some(function(k){return riteChk[k];}))estOffer=true;}
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
  var nq=0;qzSeq().forEach(function(i){nq+=qzN(i);});
  var NL=qzVisible().length,NP=PLACES.length,ND=DUAS.filter(forMe).length;
  var stages=[
    {i:mk('bag'),t:'Before you fly',s:'Prepare with ihsan',d:'Begin with your intention — then checklists for documents, packing and health, a departure countdown and a generated day-by-day itinerary. Then learn: the history of the Kaaba and Madinah, the virtues, the fiqh Q&A, a scam-awareness guide — and prove it in '+artN(NL)+' '+NL+'-level quiz.',f:['Checklists','Itinerary','Knowledge hub',NL+'-level quiz','Flashcards','Document vault',['Kids quiz','goTab(\'plan\',\'quiz\',\'kidsCard\')']],go:['plan','prep'],c:'Start preparing'},
    {i:mk(HJ?'tent':'kaaba'),t:HJ?'During your Hajj':'During your Umrah',s:HJ?(hajjType()==='tamattu'?'Umrah first → Mina → Arafah → Muzdalifah → the 10th → tashriq':'Arrival tawaf → Mina → Arafah → Muzdalifah → the 10th → tashriq'):'Ihram → Tawaf → Sa’i → Halq/Taqsir (shave or trim)',d:(HJ?(hajjType()==='tamattu'?'Part 1 is your Umrah':'Part 1 is your arrival tawaf (and sa’i, if you do it now) — you stay in ihram')+', Part 2 the five days of Hajj — each day folded until its date, every step with its ruling (rukn · wajib · sunnah) and what to do if you miss it. ':'')+'A step-by-step walkthrough with every dua in Arabic, transliteration and audio, and a "Why?" behind each step. Giant tap counters for tawaf and sa’i with a full-screen focus mode so you never lose count, a map of the mataf, and an automatic timeline that becomes a keepsake.',f:['Rites guide','Duas + audio','Tawaf & Sa’i counters','Focus mode','Mataf map','Keepsake card'],go:['umrah','steps'],c:'Open the rites guide'},
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
  var installHTML=deferPrompt?'<button class="chip-btn" onclick="installApp()" aria-label="Install the app on your phone">📲 Install</button>':(iosTab()?'<small class="hb-ios">📲 Share → Add to Home Screen</small>':'');
  var iosKeepHTML=iosTab()?'<a class="ios-keep-h" id="iosKeep" href="install">'+mk('disk','mkt')+'<span>'+iosKeepT()+'</span></a>':'';
  /* 6.2 status card (dark aubergine · Manrope): kicker → hero numeral beside the ring → hairline metrics → the rites bar → one note → a glass pill.
     Every value is one this function already computes (depDays, planTotals, quiz levels, Hajj dates, today's Hajj steps, the rite ticks, trip day, deeds, habit-days). */
  var hp=hsPhase(phase),sK='',sS=[],sR='Ready',sNote='',sBar='';
  function M(l,v,of){sS.push([l,String(v),of===undefined?'':'/'+of]);}
  if(hsK==='hday'){sK='⛺ Hajj '+hy;sR='Today';if(act)M(act==='tawaf'?'Tawaf':'Sa’i',ST[act],7);M('Steps today',hdone,hsteps.length);var ed9=expectedDay();if(ed9)M('Trip day',Math.min(ed9,ST.tripLen),ST.tripLen);}
  else if(hsK==='after'){sK=ST.post?'🌱 Back home':'🧭 After your journey';
    if(phase.indexOf('not yet recorded')>-1){sK='⛺ Your Hajj';sR='Part 2';var HT1=hajjTotals();if(HT1.tot)M('Part 2 steps',HT1.done,HT1.tot);sNote=lbl;}
    else if(ST.post){sR='Habits';POST_HABITS.forEach(function(h,i){var o=pd[i]||{},n=Object.keys(o).filter(function(k){return o[k];}).length,l=stripEmoji(h).replace(/^(Five|Daily) /,'');M(l.charAt(0).toUpperCase()+l.slice(1),n,30);});sNote='Alhamdulillah — keep the Haram version of you';}
    else{sR='Complete';sNote=lbl;}}
  else if(hsK==='plan'){sK=HJ?'⛺ Hajj '+hy:d===null?'🧭 Planning your Umrah':'✈️ Your Umrah';sR='Prepared';M('Prep',done,tot);var HR0=HJ?hajjReadiness():null;if(HR0)M('Knowledge',HR0.pct+'%');else M('Quiz levels',qzPassedCount(),qzVisible().length);if(HJ&&HD[9])M('Arafah',fmtDate(HD[9]));}
  else if(hsK==='dep'){sK='🛫 Departure day';sR='Prepared';var P2=planTotals();M('Prep',P2.done,P2.tot);sNote=(journey()==='hajj'&&hajjType()!=='tamattu')?'Ihram at the miqat, then the arrival tawaf (and sa’i if you do it now) — you stay in ihram until the 10th':journey()==='hajj'?'Ihram at the miqat — every step and dua is in the guide':'Ihram at the miqat, then tawaf, sa’i and halq — every step and dua is in the guide';}
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
    +'<span class="hcta'+(cta[2]==='hsDatePick()'?' hs-dt':'')+'"><span class="hs-cw"><small class="hs-ce'+(sEb==='Overdue'?' hs-due':'')+'">'+(sEb==='Overdue'?'<i class="hs-dot" aria-hidden="true"></i>':'')+sEb+'<span class="hs-x">: </span></small><span class="hs-ct">'+esc(sLb)+'</span></span><i class="hs-go">'+mk('arrow')+'</i>'+(cta[2]==='hsDatePick()'?'<input type="date" class="hs-date" id="hsDate" min="'+isoOf(new Date())+'" aria-label="Departure date — opens the date picker" onclick="event.stopPropagation();hsDateOpen(this)" onkeydown="event.stopPropagation()" onchange="hsDateSet(this.value)">':'')+'</span>'
    +(ST.post&&stageNow===4&&ST.essentials?'<span class="hcta hs-alt" role="button" tabindex="0" aria-label="Plan your next journey" onclick="event.stopPropagation();goTab(\'more\',\'guide\',\'nextCard\')">'+mk('compass','mkt')+'<span class="hs-ct">Plan your next journey</span></span>':'')
    +(estOffer?'<span class="hcta hs-alt" id="hsEst" role="button" tabindex="0" aria-label="Already did your Umrah? Mark it done" onclick="event.stopPropagation();estUmrahSheet()" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();event.stopPropagation();estUmrahSheet();}">'+mk('check','mkt')+'<span class="hs-ct">Already did your Umrah? Mark it done</span></span>':'')+'</div></div>';
  var prayerHTML='<div class="card card-pad hprayer" role="button" tabindex="0" aria-label="Prayer times" onclick="goTab(\'daily\',\'today\')"><div class="hp-i">'+mk('dome')+'</div><div class="hp-t"><small>'+(inHaram?'Next prayer':'Next prayer in '+esc(ST.city||'Makkah'))+'</small><div id="hNext">Loading…</div></div><span class="hp-go">›</span></div>';
  var fcHTML=fc0?'<div class="card card-pad hfc" role="button" tabindex="0" aria-label="Study today’s knowledge card" onclick="startFC();goTab(\'plan\',\'learn\',\'fcCard\')"><small>'+mk('cards','mkt')+'Today’s knowledge card · '+due.length+(fcStarted()?' due':' ready')+'</small><b>'+markify(fc0.f)+'</b><span>Tap to study →</span></div>':'';
  var postHTML='';
  if(tripOver&&!ST.post)postHTML+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Start the 30-day habit keeper" onclick="startPost()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('sprout')+'</div><div class="hp-t"><small>Back home?</small><div>Start the 30-day habit keeper <span>· prayers on time, Quran, dhikr</span></div></div><span class="hp-go">›</span></div>';
  if(ST.post)postHTML+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Open '+(HJ?'after-Hajj':'post-Umrah')+' habits" onclick="goPost()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('sprout')+'</div><div class="hp-t"><small>'+(HJ?'After-Hajj':'Post-Umrah')+' mode · on</small><div>'+pc+' habit-days logged of 90 <span>· keep the Haram version of you</span></div></div><span class="hp-go">›</span></div>';
  /* J-07: after a trip, the next journey is a choice, not a repeat — nothing is archived or deleted here */
  if(tripOver||(ST.post&&(d===null||d<=0)))postHTML+='<div class="card card-pad hnext" id="hNextJ"><h3>'+mk('compass','mkt')+'Plan your next journey</h3><p style="font-size:var(--t-3);color:var(--ink2);margin:0 0 10px;line-height:var(--lh-body)">'+(HJ?'"…and the accepted Hajj has no reward except Paradise" (Bukhari 1773).':'"Umrah to Umrah is an expiation for what is between them" (Bukhari 1773).')+' Past journeys stay under More › After › My journeys.</p><div class="jbtns"><button class="btn ghost" onclick="nextJourney(\'umrah\')">'+mk('kaaba','mkt')+'Umrah</button><button class="btn ghost" onclick="nextJourney(\'hajj\')">'+mk('tent','mkt')+'Hajj</button></div></div>';
  /* J-06: one-time primer for Hajj planners — the five days in four minutes */
  var readHTML=(HJ&&stageNow===0&&!ST.hajjRead)?'<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Read: your Hajj in five days" onclick="hajjReadGo()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('tent')+'</div><div class="hp-t"><small>Start here · 2-minute read</small><div>Your Hajj in five days <span>· 8 to 12 Dhul Hijjah (the 13th if you stay) at a glance</span></div></div><button class="lnk hc-reset" onclick="event.stopPropagation();hajjReadDone()" aria-label="Dismiss">✕</button></div>':'';
  var askHTML=ST.hajjAsk?'<div class="hajjask" role="button" tabindex="0" onclick="showOnboard()">'+mk('tent','mkt')+'Going for Hajj? Tap here<span class="x" role="button" aria-label="Dismiss" onclick="event.stopPropagation();hajjAskOff()">✕</span></div>':'';
  var quoteHTML='<div class="note" style="margin:0 0 12px">'+QUOTES[Math.floor(Date.now()/86400000)%QUOTES.length]+'</div>';
  var faqHTML='<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is it really free? <span class="acc-c">▶</span></div><div class="acc-b">Yes — no ads, no subscriptions, no “pro” tier. Built as sadaqah jariyah for the Ummah. If it helps you, share it and make dua for those who built it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Does it work in the Haram without signal? <span class="acc-c">▶</span></div><div class="acc-b">Yes. Open it once with internet and it caches itself; the counters, rites guide, duas, places and your data all work offline. Prayer times work offline too (the Umm al-Qura month is cached, and computed times fill any gap); the map links need signal — the Show driver card on every place works offline.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Where is my data stored? <span class="acc-c">▶</span></div><div class="acc-b">Only on your phone. There is no account and no server. Export a backup from Settings before changing phones; the document vault is encrypted with your PIN and cannot be recovered without it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is the religious content reliable? <span class="acc-c">▶</span></div><div class="acc-b">Every hadith quoted is cited to its collection and was checked against the source text; weak narrations are avoided or marked. It is a study companion, not a fatwa service — ask a scholar for rulings on your situation. Scholar review is pending; corrections are welcome.</div></div>';
  var numsHTML='<div class="nums"><div><b>'+NP+'</b><small>places &amp; sites</small></div><div><b>'+nq+'</b><small>quiz questions in '+NL+' levels</small></div><div><b>'+nh+'</b><small>knowledge topics</small></div><div><b>'+ND+'</b><small>essential duas with audio</small></div></div>';
  var shareHTML='<div class="card card-pad" style="text-align:center"><h3 style="margin-bottom:6px">Made for the Ummah</h3><p style="font-size:var(--t-3);color:var(--ink2);line-height:var(--lh-body)">Free, no ads, no tracking. The sister app of <a href="https://www.ramadanstrivers.com/" target="_blank" rel="noopener" style="color:var(--brand-2);font-weight:700;text-decoration:none">Ramadan Strivers</a>. Share it with anyone going to '+(HJ?'Hajj':'Umrah')+'.</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn ghost" style="margin-top:6px" onclick="shareApp()">📤 Share</button><button class="btn ghost" style="margin-top:6px" onclick="showQR()">▦ Show QR</button></div><p style="font-size:var(--t-2);color:var(--ink3);margin-top:12px"><a href="install" style="color:var(--brand-2);font-weight:600;text-decoration:none">How to install it →</a><span> · </span><a href="privacy" style="color:var(--brand-2);font-weight:600;text-decoration:none">Privacy</a></p></div>';
  /* G4 #36: once onboarded the five stages are compact rows — no brochure prose or chips; the first-launch landing page keeps the full version */
  function stageRow(st,i,mini){var now=i===stageNow,open=!mini;return '<div class="stage'+(now?' now':'')+(mini&&!now?' cmp':'')+'" role="button" tabindex="0" aria-label="'+st.t+' — '+st.c+'" onclick="'+(st.oc||goStr(st.go))+'"><div class="stage-n">'+(i+1)+'</div><div class="stage-b"><div class="stage-h"><span class="stage-i">'+st.i+'</span><div><b>'+st.t+'</b><small>'+st.s+'</small></div>'+(now?'<span class="nowtag">You are here</span>':(mini?'<span class="stage-go" aria-hidden="true">›</span>':''))+'</div>'+(open?'<p>'+st.d+'</p><div class="fchips">'+st.f.map(function(f){return typeof f==='string'?'<span>'+f+'</span>':'<span class="go" role="button" tabindex="0" onclick="event.stopPropagation();'+f[1]+'">'+f[0]+' →</span>';}).join('')+'</div><div class="stage-cta">'+st.c+' →</div>':'')+'</div></div>';}
  var h='';
  if(!ST.onboarded){
    /* ── first launch: the landing page explains the app ── */
    h+='<div class="hhero"><div class="hhero-mark'+(HJ?'':' kaaba')+'" aria-hidden="true">'+(HJ?mk('tent'):'')+'</div><h2>Your complete '+(ST.journeyAsked?(HJ?'Hajj':'Umrah'):'Hajj & Umrah')+' companion</h2><p>Everything you need <b>before, during and after</b> '+(ST.journeyAsked?(HJ?'Hajj':'Umrah'):'your journey')+' — in one free, private app that works offline in the Haram.</p><div class="trust"><span>✓ Free</span><span>✓ Works offline</span><span>✓ Private — no account</span><span>✓ Hadith checked against the sources</span></div><button class="btn" style="max-width:300px;margin:16px auto 0" onclick="'+ctaGo+'">'+(d===null&&!tu?'Begin your journey →':esc(cta[0])+' →')+'</button>'+(deferPrompt?'<button class="btn ghost" style="max-width:300px;margin:8px auto 0" onclick="installApp()">📲 Install on your phone</button>':(/iPhone|iPad/.test(navigator.userAgent)&&!window.navigator.standalone?'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:10px">📲 On iPhone: tap Share → “Add to Home Screen” to install</p>':''))+'</div>';
    h+=statusHTML+postHTML+prayerHTML;
    h+='<div class="vh" style="margin-top:8px"><h2 style="font-size:var(--t-6)">'+mk('compass','mkt')+'How it works — your journey in 5 stages</h2><p>Tap a stage to jump in. The app follows you from your living room to the mataf and back.</p></div>';
    h+='<div class="stages">'+stages.map(function(st,i){return stageRow(st,i,false);}).join('')+'</div>';
    h+=numsHTML;
    h+='<div class="vh" style="margin-top:6px"><h2 style="font-size:var(--t-5)">'+mk('grid','mkt')+'Quick tools</h2></div>'+toolsHTML.replace('</div>','<button class="qa wide" onclick="sosSheet()" aria-label="Hotel and emergency help"><span>'+mk('car')+'</span>Hotel / SOS <span style="font-size:1em;color:var(--ink3);font-weight:600">· driver card · I’m lost · 911 · 1966</span></button></div>');
    h+=fcHTML+quoteHTML+'<div class="card card-pad"><h3>Common questions</h3>'+faqHTML+'</div>'+shareHTML;
  }else{
    /* ── dashboard (H-01): brand strip → status → continue / do next → prayer → tools → cards → quote → compact stages → about ── */
    h+='<div class="hbrand"><span class="hb-n"><i class="kmark" aria-hidden="true"></i><small>Free · offline · private</small></span>'+installHTML+'</div>'+iosKeepHTML;
    /* G3 #32: Essentials Home — the status card, the Hajj-day row and the Arafah / day card when they apply, four big tiles; nothing else */
    var last48=d!==null&&d>=0&&d<=2&&(stageNow===0||hsK==='dep')&&!alreadyThere();
    if(ST.essentials){h+=statusHTML+hdayHTML+(hsK==='hday'?hajjHomeCard(hd):'')+ramHomeHTML()+heatHomeHTML()+(last48?leaveHTML():'')+essTilesHTML()+'<p class="ess-off"><button class="lnk" onclick="togEssentials()">Show the full Home</button></p>';a.innerHTML=h;setTimeout(function(){setRing('hRing',pct);},50);loadPT();return;}
    h+=askHTML+statusHTML+hdayHTML+niyHomeHTML(hd)+ramHomeHTML();
    /* H-04: one Continue card — in-progress count, then the sa'i hand-off, then an unfinished day log, then today's flashcard */
    var cont='',fcUsed=false;
    if(act)cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Resume '+(act==='tawaf'?'tawaf':'sa’i')+'" onclick="resumeCount(\''+act+'\')"><div class="hp-i" style="background:var(--gold-soft)">'+mk(act==='tawaf'?'kaaba':'hills')+'</div><div class="hp-t"><small>Continue</small><div>'+(act==='tawaf'?'Tawaf':'Sa’i')+' in progress · <span class="ty-nw">'+(act==='tawaf'?'round':'lap')+' '+ST[act]+' of 7</span></div></div><button class="lnk hc-reset" onclick="event.stopPropagation();cntrReset(\''+act+'\')" aria-label="Reset this counter">Reset</button></div>';
    else if(saiPending())cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Start sa’i" onclick="startSai()"><div class="hp-i" style="background:var(--gold-soft)">'+mk('hills')+'</div><div class="hp-t"><small>Continue</small><div>Tawaf done ✓ — 2 rakahs, Zamzam, then start sa’i →</div></div><span class="hp-go">›</span></div>';
    else if(inHaram&&dp>0&&dp<100&&cta[1]!=='daily')cont='<div class="card card-pad hcont" role="button" tabindex="0" aria-label="Continue today’s log" onclick="goTab(\'daily\',\'today\')"><div class="hp-i">'+mk('beads')+'</div><div class="hp-t"><small>Continue</small><div>Today’s log — '+dp+'% done <span>· tick what you prayed</span></div></div><span class="hp-go">›</span></div>';
    else if(hsK==='hday')cont=hajjHomeCard(hd);
    /* G4 #34: on an ordinary trip day the Continue slot is today's plan from the itinerary; the flashcard moves below Quick tools */
    else if(hsK==='trip'&&homePlanHTML())cont=homePlanHTML();
    else if(fc0){cont=fcHTML;fcUsed=true;}
    if(hsK==='hday')fcUsed=true;
    if(stageNow!==0)h+=cont;
    if(hsK==='hday')h+=rulesRowHTML('home')+heatHomeHTML();
    /* H-05: what to do next (planners) — above the flashcard card */
    if(last48&&stageNow!==0)h+=leaveHTML();
    if(stageNow===0&&last48){h+=leaveHTML()+readHTML+cont;}
    else if(stageNow===0){var rows=nextRows.slice(0,3),nq0=qzPassedCount()<NL?qzNext():-1,nx='';
      rows.forEach(function(r){nx+='<div class="tli" role="checkbox" tabindex="0" aria-checked="false" onclick="tlTick(this,\''+r.o.it.id+'\')"><span class="tick"></span><div class="tli-t">'+r.o.it.label+'<small>'+r.o.sec.title+(r.o.it.wk!==undefined?' · <span class="ty-nw">ideally '+(r.o.it.wk>=1?r.o.it.wk+' week'+(r.o.it.wk>1?'s':''):'days')+' before</span>':'')+'</small></div><span class="tli-when '+r.cls+'">'+r.when+'</span></div>';});
      if(nq0>-1&&rows.length<4)nx+='<div class="tli" role="button" tabindex="0" onclick="goTab(\'plan\',\'learn\',\'lnQuizCard\')"><span class="tli-i">'+mkOr('🧠')+'</span><div class="tli-t">Quiz level '+(qzPos(nq0)+1)+' not passed<small>'+qzLvName(nq0,1)+' · 80% to pass</small></div><span class="tli-when soon">Study →</span></div>';
      /* 6.7 (G3 #27): three or more overdue rows → "Done these already? Tick them" opens the same sheet as after the first date */
      var B0=ST.dep?tlBuckets():null,srt=B0&&B0.over.length>=3&&sortedIds().some(function(id){return !planChk[id];})?'<button class="lnk hn-srt" onclick="sortedSheet()">Done these already? Tick them</button>':'';
      if(nx)h+='<div class="card card-pad hnext"><h3>'+mk('tack','mkt')+'Do next</h3>'+srt+nx+'<button class="lnk hn-all" onclick="goTab(\'plan\',\'prep\',\''+(ST.dep?'tlCard':'cdCard')+'\')">'+(ST.dep?'See full timeline →':'Set a departure date for a dated timeline →')+'</button></div>';
      h+=readHTML+cont;}
    /* G4 #36: once the trip is over the prayer card (another city's times) steps aside for the habit / next-journey cards */
    h+=stageNow===4?postHTML:prayerHTML;
    h+='<div class="vh hq"><h2>'+mk('grid','mkt')+'Quick tools</h2></div>'+toolsHTML;
    h+=(fcUsed?'':fcHTML)+(stageNow===4?'':postHTML)+quoteHTML;
    h+='<div class="vh hq"><h2>'+mk('compass','mkt')+'Your journey</h2></div><div class="stages">'+stages.map(function(st,i){return stageRow(st,i,true);}).join('')+'</div>';
    h+=mkSec({id:'about',ico:'ℹ️',title:'About this app',sub:'Free · offline · private · hadith checked against the sources'},true,numsHTML+faqHTML+shareHTML);
  }
  a.innerHTML=h;
  setTimeout(function(){setRing('hRing',pct);},50);
  loadPT();
}
/* 6.5 (G1 #2): Home on a day of Hajj — the Continue slot holds the day's aubergine card instead of a flashcard.
   9th: the wuquf countdown to sunset at Arafah + the personal dua list. 10th: the sunnah order as four chips ticked from hajjChk. 12th (not staying for the 13th): out of Mina before sunset.
   Times are computed (±2 min) for Arafah / Mina and always say so; the cards never say "you may leave now". */
function hjdRing(frac,ic,lbl){return '<div class="ring-wrap" aria-hidden="true"><svg width="92" height="92" viewBox="0 0 92 92"><circle class="ring-bg" cx="46" cy="46" r="38"/><circle class="ring-fg" cx="46" cy="46" r="38" style="stroke-dashoffset:'+Math.round(239*(1-Math.max(0,Math.min(1,frac))))+'"/></svg><div class="ring-num">'+mk(ic)+'<small>'+lbl+'</small></div></div>';}
function hjdPill(ey,ln,go,aria){return '<button class="hs-pill" onclick="event.stopPropagation();'+go+'" aria-label="'+esc(aria||ey+' — '+ln)+'"><span class="hs-cw"><small class="hs-ce">'+ey+'</small><span class="hs-ct">'+ln+'</span></span><span class="hs-go">'+mk('arrow')+'</span></button>';}
function hajjHomeCard(hd){
  if(hd===9){var A=arafahNow();
    return '<div class="hero hero-o hjd" id="hjdHome"><div class="hero-t"><div class="k">'+mk('hills','mkt')+'<span>Wuquf · Arafah</span></div>'
      +(A.ph==='set'?'<span class="hs-u hjd-set">Sunset ≈ '+A.sun+' has passed. When the disc has gone, leave calmly with your group for Muzdalifah.</span>':'<span class="hs-n">'+hjLiveHTML(A.sunM)+'</span><span class="hs-u">until sunset ≈ '+A.sun+' — stay in Arafah until the sun has set</span>'+(A.ph==='last'?'<span class="hs-note">The last hour of Arafah — make dua</span>':''))
      +'</div>'+(A.ph==='set'?'':hjdRing(A.frac,'sun','left'))+'<p class="hjd-hedge">Computed for Arafah, ±2 min — follow your group, not the phone.</p>'+hjdPill('My dua list',duaListLbl(),'myDuasSheet()')+'</div>';}
  if(hd===10){var ty=hajjType(),C=[['h10rami','Aqabah',!!hajjChk.h10rami,'openRami(10)']];if(ty!=='ifrad')C.push(['h10hady','Hady',!!hajjChk.h10hady]);C.push(['h10halq','Halq / taqsir',!!(hajjChk.h10halq||hajjChk.h10halqw)],['h10ifadah','Ifadah',!!hajjChk.h10ifadah]);
    var nx=C.filter(function(c){return !c[2];})[0],dn=C.filter(function(c){return c[2];}).length,ns=hajjStep('h10night');
    var chips='<ol class="hjd-chips" aria-label="The sunnah order today: '+C.map(function(c){return c[1]+(c[2]?' done':'');}).join(', ')+'">'+C.map(function(c,i){return '<li><button class="hjd-chip'+(c[2]?' on':'')+'" onclick="event.stopPropagation();'+(c[3]||'openRiteStep(\''+c[0]+'\')')+'" aria-label="'+(i+1)+'. '+c[1]+(c[2]?', done':', to do')+'"><i>'+(c[2]?mk('check'):(i+1))+'</i>'+c[1]+'</button></li>';}).join('')+'</ol>';
    return '<div class="hero hero-o hjd" id="hjdHome"><div class="hero-t"><div class="k">'+mk('kaaba','mkt')+'<span>Yawm an-Nahr · the sunnah order</span></div><span class="hs-n">'+dn+'<i class="hjd-of"> of '+C.length+'</i></span><span class="hs-u">Follow it if you can — if the order changes, the schools differ on what is owed</span><button class="lnk hjd-13" onclick="event.stopPropagation();openStepMiss(\'h10order\')">Read “Missed it?”</button></div>'+hjdRing(dn/C.length,'kaaba','done')
      +chips+(nx?hjdPill('Next in order',nx[1],nx[3]||'openRiteStep(\''+nx[0]+'\')'):hjdPill('Tonight',ns?fcText(ns.b):'Back to Mina','openRiteStep(\'h10night\')'))+'</div>';}
  if(hd===12&&!ST.stay13){var S=siteTimes('Mina'),m=nowMin(),left=S.sun-m,rd=ramiDone(12)||!!hajjChk.h12rami;
    return '<div class="hero hero-o hjd" id="hjdHome"><div class="hero-t"><div class="k">'+mk('stone','mkt')+'<span>Leaving Mina today?</span></div>'
      +(left>0?'<span class="hs-n">'+hjLiveHTML(S.sun)+'</span><span class="hs-u">Be out of Mina before sunset ≈ '+minHM(S.sun)+' — otherwise stay and stone on the 13th</span>':'<span class="hs-u hjd-set">Sunset ≈ '+minHM(S.sun)+' has passed. Still inside Mina? The majority say you now stay the night and stone on the 13th (Hanafis: only if you are still there at Fajr). Ask your group leader.</span>')
      +'<button class="lnk hjd-13" onclick="event.stopPropagation();togStay13()">Staying for the 13th instead? Tell the app</button></div>'+(left>0?hjdRing(Math.min(1,left/Math.max(1,S.sun-S.dhuhr)),'sun','left'):'')
      +'<p class="hjd-hedge">Computed for Mina, ±2 min — follow your group, not the phone.</p>'+(rd?hjdPill('Today','Leaving: out of Mina before sunset','openRiteStep(\'h12leave\')'):hjdPill('First','Rami of the 12th · after midday','openRami(12)'))+'</div>';}
  return '';}
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
  var rows=U.map(function(u){var lg=u.log||{};return {t:lg.done||0,h:'<div class="lg on"><span class="lg-i">'+mk('kaaba')+'</span><span class="lg-t">Umrah #'+(u.n+(ST.umrahsPrev||0))+' <em>'+dt(lg.done)+(u.est?' · recorded on arrival':'')+'</em></span><button class="chip-btn" onclick="makeKeepsake('+u.n+')">🎴 Keepsake</button>'+(u.est?'<button class="chip-btn" onclick="estRemoveSheet('+u.n+')" aria-label="Remove the Umrah marked on arrival">Remove</button>':'')+'</div>'};})
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
    var view=document.querySelector('.view.on');if(!view)return;var btns=view.querySelectorAll('.seg button[data-sub]');if(!btns.length)return;
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
  var tap=f.querySelector('.focus-tap');if(tap)tap.setAttribute('aria-label','Tap to count one '+(k==='tasbih'||k==='arafah'?'dhikr':k==='rami'?'pebble':k==='tawaf'?'round':'lap'));
  document.getElementById('focusHint').hidden=false;updSayCount();
  /* D-15: the same overlay doubles as a full-screen tasbih (wake lock, giant number, Arabic of the phrase) */
  if(k==='tasbih'||k==='arafah'){f.classList.add('tasbih');f.classList.toggle('arafah',k==='arafah');document.getElementById('focusHint').textContent='tap anywhere to count';renderFocusTB();reqWake();return;}
  f.classList.remove('arafah');
  /* J-08: the rami counter — one jamarah at a time, 7 pebbles each */
  if(k==='rami'){document.getElementById('focusHint').textContent='tap anywhere to count';if(!ramiDay)ramiDay=ramiDefaultDay();renderFocusDua();updWudu();renderFocusRami();if(!ramiAllDone(ramiDay))reqWake();return;}
  document.getElementById('focusTitle').innerHTML=markify(k==='tawaf'?TM[tmode()].h:(tmHajj()?'⛰️ Sa’i of Hajj':'⛰️ Sa’i'));
  document.getElementById('focusOf').textContent=k==='tawaf'?'of 7 rounds':'of 7 laps';
  document.getElementById('focusHint').textContent='tap anywhere to count';
  var t=tmT(k);if(k==='tawaf'&&t&&ST.wudu){var lg=tmLog(t);if(!lg[t.log+'Start']){lg[t.log+'Start']=Date.now();saveST();}renderLog();renderHlog();}
  renderFocusDua();updWudu();renderCnt(k);
  if(ST[k]<7)reqWake();
}
function exitFocus(){if(typeof ramiPauseEnd==='function')ramiPauseEnd();var fz=document.getElementById('focus');if(fz)fz.classList.remove('rpause');document.getElementById('focus').classList.remove('on');document.body.style.overflow='';if(wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}
  if(walkReturn){walkReturn=false;openWalkAt(walkI);}}
function focusTap(){if(focusKey==='rami'&&ramiPause)return;if(focusKey==='arafah')arafahTap(1);else if(focusKey==='tasbih')tbTap();else if(focusKey==='rami')ramiTap(ramiJams(ramiDay||ramiDefaultDay())[ramiJ],1);else cntr(focusKey,1);}
function focusUndo(){if(focusKey==='arafah')arafahTap(-1);else if(focusKey==='tasbih')tbUndo();else if(focusKey==='rami')ramiTap(ramiJams(ramiDay||ramiDefaultDay())[ramiJ],-1);else cntr(focusKey,-1);}
function renderFocusTB(){var t=document.getElementById('focusTitle'),o=document.getElementById('focusOf'),n=document.getElementById('focusN'),tip=document.getElementById('focusTip'),d=document.getElementById('focusDone');if(!t)return;
  if(focusKey==='arafah'){var ai=duaIdx('dua of Arafah'),an=arafahN();t.innerHTML=mk('hands','mkt')+'The dua of Arafah';n.textContent=an;o.textContent='no target · today '+an;var fa=document.getElementById('focusLive');if(fa)fa.textContent=an+' today';tip.hidden=false;tip.innerHTML=ai>-1?'<span lang="ar">'+DUAS[ai].ar+'</span>':'';if(d)d.hidden=true;return;}
  t.innerHTML='<button class="ft-cycle" id="ftCycle" onclick="event.stopPropagation();tbCycle()" aria-label="Phrase: '+esc(tbName(tbPhrase))+' — tap for the next phrase">'+mk('beads','mkt')+'<span>'+esc(tbName(tbPhrase))+'</span><span class="ft-nx" aria-hidden="true">'+mk('refresh','mkt')+'</span></button>';n.textContent=tbCount;o.textContent=(tbTargetN?'of '+tbTargetN:'no target')+' · today '+(tasbih[dayKey()]||0);
  var fl=document.getElementById('focusLive');if(fl)fl.textContent=tbCount+(tbTargetN?' of '+tbTargetN:'');
  tip.hidden=false;tip.innerHTML='<span lang="ar">'+tbArOf(tbPhrase)+'</span>';if(d)d.hidden=true;}
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
  e.innerHTML='<span class="ar" lang="ar" dir="rtl">'+d.ar+'</span>'+(fdOpen?'<span class="fd-s"><i>'+d.tl+'</i><br>'+d.tr+'</span>':'')+'<span class="fd-k">'+d.t+' · tap for '+(fdOpen?'less':'meaning')+'</span>';}
function fdToggle(){fdOpen=!fdOpen;renderFocusDua();vib(6);}
/* U-09: personal dua list without leaving the big counter (never touches the count) */
/* G3 #29: on trip day 1 and on 9 Dhul Hijjah Home shows the intention's first line only (private text — never on a share card); a tap reads it whole */
function niyHomeHTML(hd){var nv=niyText().trim();if(!nv||!onTrip())return '';var ed=expectedDay();if(!(ed===1||hd===9))return '';
  var first=nv.split(/\n/)[0];return '<div class="card card-pad hniy" id="hNiy" role="button" tabindex="0" aria-label="Your intention — read it before you begin" onclick="niySheet()"><small>'+mk('heart','mkt')+'<span>Your intention — read it before you begin</span></small><span class="hniy-l">'+esc(first)+'</span></div>';}
function niySheet(){var nv=niyText().trim();if(!nv)return;openSheet('<div class="sheet-h">'+mk('heart')+'</div><h3>Why you came</h3><p class="niy-read">'+esc(nv).replace(/\n/g,'<br>')+'</p><button class="btn tall" onclick="closeSheet()">Bismillah</button><button class="btn ghost tall" onclick="closeSheet();goTab(\'plan\',\'prep\',\'niyCard\')">Edit it in Prepare</button>');}
function myDuasSheet(){var h='<div class="sheet-h">'+mk('hands')+'</div><h3>My duas</h3>',nv=niyText().trim();
  /* G3 #29: the written intention first, read-only — "Why you came" */
  if(nv)h+='<div class="why-came" id="whyCame"><small>'+mk('heart','mkt')+'<span>Why you came</span></small><p>'+esc(nv).replace(/\n/g,'<br>')+'</p></div>';
  h+='<p>Tick each one as you ask — the counter is not touched.</p>'+myDuasReadBtn('mdRead');
  if(!duas.length)h+='<p class="lead" style="text-align:center;color:var(--ink2)">Your list is empty — start with the people who asked you to pray for them.</p>';
  else h+=duas.map(function(d,i){return '<div class="brg'+(d.done?' done':'')+'" role="checkbox" tabindex="0" aria-checked="'+(d.done?'true':'false')+'" onclick="togDua('+i+');myDuasSheet()"><span class="tick"></span><span>'+esc(d.t)+'</span></div>';}).join('');
  h+='<div style="display:flex;gap:8px;margin-top:10px"><input class="srch" id="duaIn2" placeholder="Add a dua…" style="margin:0" onkeydown="if(event.key===\'Enter\')addDuaSheet()" aria-label="Add a dua"><button class="chip-btn" onclick="addDuaSheet()" aria-label="Add">＋</button></div><button class="btn ghost" onclick="closeSheet()">Close</button>';
  openSheet(h);}
function addDuaSheet(){var i=document.getElementById('duaIn2'),v=((i&&i.value)||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();renderDuaList();myDuasSheet();vib(15);}
document.addEventListener('visibilitychange',function(){if(document.visibilityState!=='visible'||!('wakeLock' in navigator))return;
  var fo=document.getElementById('focus').classList.contains('on');
  if(fo&&(focusKey==='tasbih'||focusKey==='arafah'||focusKey==='rami'||ST[focusKey]<7))reqWake();else if(document.getElementById('duaFocus').classList.contains('on'))navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});});
/* 6.5 (G1 #11): coming back to the app is a moment the Counters tab may re-order for the day; the live countdowns catch up at once */
document.addEventListener('visibilitychange',function(){if(document.visibilityState!=='visible'||journey()!=='hajj')return;cntNavAt=Date.now();try{updCntLayout();hjLive();}catch(e){}});

/* ════════════════════════ DUA READER (full-screen, M-11) ════════════════════════ */
var dfList=[],dfIdx=0;
/* i is the global DUAS index; the reader pages through the duas of this journey only */
function openDua(i){dfList=DUAS.filter(forMe);dfIdx=dfList.indexOf(DUAS[i]);if(dfIdx<0){dfList=[DUAS[i]];dfIdx=0;}renderDF();}
function openRiteDua(stepId,i){var st=riteStep(stepId);if(!st)return;var L=stDuas(st);if(!L.length)return;dfList=L.map(function(d){return {t:fcText(st.b)+(d.opt?' · optional':''),ar:d.ar,tl:d.tl,tr:d.tr,s:d.s||(d.opt||'')};});dfIdx=Math.min(L.length-1,i||0);renderDF();}
function renderDF(){
  var d=dfList[dfIdx];if(!d)return;var mine=d.mine!==undefined,dfo=document.getElementById('duaFocus');dfo.classList.toggle('mine',mine);dfo.classList.toggle('end',mine&&dfEnd);
  var ask=document.getElementById('dfAsk'),endB=document.getElementById('dfEndB');if(ask){ask.hidden=!mine||dfEnd;var dn=mine&&duas[d.mine]&&duas[d.mine].done,last=dfIdx>=dfList.length-1;ask.innerHTML='<span>'+'Asked ✓'+(last?'':' → next')+'</span><span class="hs-go" aria-hidden="true">'+mk(last?'check':'arrow')+'</span>';ask.classList.toggle('was',!!dn);}
  if(endB){endB.hidden=!(mine&&dfEnd);if(mine&&dfEnd)endB.innerHTML='<b>All '+duas.length+' asked</b><span>May Allah accept every one.</span><button class="btn" onclick="dfNewRound()">'+mk('refresh','mkt')+'New round</button><button class="chip-btn" onclick="closeDua()">Close</button>';}
  document.getElementById('dfSay').hidden=mine;var dh=dfo.querySelector('.df-hint');if(dh)dh.textContent=mine?(duas[d.mine]&&duas[d.mine].done?'already asked this round · ':'')+'screen stays awake':'screen stays awake · swipe-free reading';
  document.getElementById('dfTitle').innerHTML=mk('hands','mkt')+esc(d.t);document.getElementById('dfAr').textContent=d.ar;document.getElementById('dfTl').textContent=d.tl||'';document.getElementById('dfTr').textContent=d.tr||'';document.getElementById('dfSrc').textContent=d.s||'';
  document.getElementById('dfSay').setAttribute('data-ar',d.ar);
  var multi=dfList.length>1;document.getElementById('dfPrev').hidden=!multi;document.getElementById('dfNext').hidden=!multi;
  document.getElementById('dfPrev').disabled=dfIdx===0;document.getElementById('dfNext').disabled=dfIdx>=dfList.length-1;
  var f=document.getElementById('duaFocus');if(!f.classList.contains('on')){f.classList.add('on');document.body.style.overflow='hidden';if('wakeLock' in navigator){navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});}}
  f.querySelector('.df-body').scrollTop=0;vib(8);
}
function duaNav(d){dfEnd=false;var n=dfIdx+d;if(n<0||n>=dfList.length)return;dfIdx=n;renderDF();}
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
  var JK=jrKeep(),JH=JK?JK.h:0,c=document.createElement('canvas');c.width=1080;c.height=1350+JH;var x=c.getContext('2d');
  kCloth(x,1080,1350+JH);kBadge(x,540,250,'kaaba');
  x.textAlign='center';kLabel(x,'My Umrah · #'+(u.n+(ST.umrahsPrev||0)),540,400,40);
  x.font='600 64px '+KF;x.fillStyle=K.ihram;x.fillText(ST.name||'A guest of Allah',540,500);
  x.font='30px '+KB;x.fillStyle=K.ihram2;x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  var y=680;x.textAlign='left';x.font='32px '+KB;
  [['Ihram',lg.ihram],['Tawaf',lg.tawafStart,lg.tawafEnd],['Sa’i',lg.saiStart,lg.saiEnd],['Halq / taqsir',lg.halq]].forEach(function(r){
    x.fillStyle=K.gold3;x.fillText(r[0],180,y);x.fillStyle=K.ihram;x.textAlign='right';
    x.fillText(r[1]?fmtTime(r[1])+(r[2]?' – '+fmtTime(r[2])+'  ('+fmtDur(r[2]-r[1])+')':''):'—',900,y);x.textAlign='left';y+=70;});
  if(lg.ihram&&lg.halq){x.fillStyle=K.gold2;x.font='600 34px '+KB;x.textAlign='center';x.fillText('Ihram to halq: '+fmtDur(lg.halq-lg.ihram),540,y+40);}
  x.textAlign='center';x.font='500 30px '+KB;x.fillStyle=K.gold3;jrDraw(x,JK,1085);x.fillText('“Umrah to Umrah is an expiation for what is between them.”',540,1140+JH);
  kFoot(x,'Bukhari 1773 · umrah-strivers.vercel.app',540,1190+JH);
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
/* 6.9 (G5 #49): ask the browser to keep the data (it may say no without a word), say so in Settings, and warn where the data is at risk:
   Safari on an iPhone outside the Home Screen, and the in-app browsers of social apps (a separate store that cannot be installed). */
var storeKept=null;
function askPersist(loud){try{if(navigator.storage&&navigator.storage.persist){navigator.storage.persist().then(function(g){storeKept=!!g;updStoreRow();if(loud)toast(g?'The phone will keep the app’s data':'The phone decides this itself — installing the app and keeping a backup are the safe way');}).catch(function(){});}else if(loud)toast('This browser does not offer it — keep a backup');}catch(e){}}
function updStoreRow(){var s=document.getElementById('storeS'),b=document.getElementById('storeBtn');if(!s)return;
  var set=function(p){storeKept=p;s.textContent=p===true?'Protected — the phone will not clear it when space runs low':p===false?'Not protected yet — the phone may clear it when space runs low. Install the app and keep a backup.':'This browser does not say — keep a backup';if(b)b.hidden=p!==false;};
  try{if(navigator.storage&&navigator.storage.persisted)navigator.storage.persisted().then(function(p){set(!!p);}).catch(function(){set(null);});else set(null);}catch(e){set(null);}
  var k=document.getElementById('iosKeepSet');if(k){k.hidden=!iosTab();if(iosTab())k.innerHTML=iosKeepT()+' <a href="install">How to add it →</a>';}}
function isStandalone(){try{return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(e){return false;}}
function iosTab(){var ua=navigator.userAgent||'';return (/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))&&!isStandalone()&&!inAppBrowser();}
function iosKeepT(){return 'Add to Home Screen to keep your data — Safari can clear websites you haven’t opened for a week.';}
function iabShow(){var e=document.getElementById('iabBar');if(!e)return;var on=inAppBrowser()&&ST.iabX!==isoOf(new Date());e.hidden=!on;if(on)e.innerHTML='<span class="iab-t">'+mk('alert','mkt')+'<span>Open in Safari or Chrome to install and keep your data — this in-app browser keeps it apart and cannot install.</span></span><span class="iab-a"><button class="chip-btn" onclick="iabCopy()">Copy link</button><button class="chip-btn" onclick="iabClose()" aria-label="Dismiss this notice">✕</button></span>';}
function iabClose(){ST.iabX=isoOf(new Date());saveST();iabShow();}
function iabCopy(){var u=location.origin+location.pathname,ok=function(){toast('✓ Link copied — paste it in Safari or Chrome');},no=function(){toast(u);};try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(ok,no);else no();}catch(e){no();}}
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
/* 6.7 (G3 #29): the written intention ticks the journey's own row — niyyahh for Hajj, niyyah for Umrah */
function niyKey(){return journey()==='hajj'?'niyyahh':'niyyah';}
function niyText(){try{return localStorage.getItem('us-niyyah')||'';}catch(e){return '';}}
function saveNiyyah(){
  var v=(document.getElementById('niyText').value||'').trim(),k=niyKey();
  localStorage.setItem('us-niyyah',v);
  var had=!!planChk[k];
  if(v&&!had){planChk[k]=true;save('us-plan',planChk);markPrepDay();toast('🤍 Intention set — may Allah accept it',true);vib([30,40,60]);niyOpen=true;}
  if(!v&&had){planChk[k]=false;save('us-plan',planChk);}
  loadNiyyah();updPlan();chkBadges();
}
var niyOpen=false;
function loadNiyyah(){
  var t=document.getElementById('niyText'),st=document.getElementById('niyStatus'),card=document.getElementById('niyCard');if(!t)return;
  var v=localStorage.getItem('us-niyyah')||'';if(document.activeElement!==t)t.value=v;
  var words=v?v.split(/\s+/).length:0;
  st.innerHTML=v?'✓ Intention set · '+words+' words — re-read it every morning of the trip.'+(niyOpen?'<button class="chip-btn" onclick="niyToggle()">▴ Collapse</button>':''):'Write it down — it becomes your compass for the whole trip.';
  /* P-01: a saved intention collapses to one tappable row until re-opened */
  /* on the trip it is one row in both states — “Your intention” opens to the text box, and the three-foundations essay stays out of the way */
  var trip=prepTripOn(),set=(!!v||trip)&&document.activeElement!==t&&!niyOpen;
  if(trip&&niyOpen)st.innerHTML=(v?'✓ Intention set · '+words+' words':'Write it down — it becomes your compass for the rest of the trip.')+'<button class="chip-btn" onclick="niyToggle()">▴ Collapse</button>';
  if(card){card.classList.toggle('set',set);card.classList.toggle('trip',trip);var col=document.getElementById('niyCol');if(col)col.setAttribute('aria-expanded',set?'false':'true');
    var ct=document.getElementById('niyColT'),cf=document.getElementById('niyColF'),cb=col&&col.querySelector('.chip-btn');if(ct)ct.textContent=v?'✓ Intention set · '+words+' word'+(words===1?'':'s'):'Your intention';if(cf)cf.textContent=v?v.split(/\n/)[0].slice(0,90):'Not written yet — tap to write it';if(cb)cb.textContent=v?'Re-read / edit ▾':'Write ▾';}
}
function niyToggle(){niyOpen=!niyOpen;loadNiyyah();vib(8);if(niyOpen)setTimeout(function(){jumpTo('niyCard',true);},40);}

/* ════════════════════════ PLAN TIMELINE · TILES · HOTEL ════════════════════════ */
var CLIMATE={makkah:[31,33,35,39,42,44,43,43,43,40,36,33],madinah:[24,27,31,36,40,43,43,44,42,37,30,26]};
var TL_BLOCK=['passport','visa','menacwy','flights','hotels'],TL_BLOCK_H=['hajjpermit','passport','hajjvisa','menacwy'],tlOpen={};
/* 6.7 (G3 #22): the travel-blocking basics follow the journey — for Hajj the permit first, then the passport, the Hajj visa and MenACWY */
function tlBlock(){return journey()==='hajj'?TL_BLOCK_H:TL_BLOCK;}
/* shared buckets (P-02/P-35): over = should already be done (blocking first, then longest lead), now = this week, soon = coming up */
function tlBuckets(){
  var d=depDays();if(d===null||d<0)return null;var wl=d/7,over=[],now=[],soon=[];
  activePlan().forEach(function(sec){sec.items.forEach(function(it){if(!forMe(it)||planChk[it.id]||it.wk===undefined)return;var o={it:it,sec:sec};if(it.wk>wl+1)over.push(o);else if(it.wk>=wl-1)now.push(o);else soon.push(o);});});
  over.sort(function(x,y){var bx=tlBlock().indexOf(x.it.id)>-1?1:0,by=tlBlock().indexOf(y.it.id)>-1?1:0;return by-bx||y.it.wk-x.it.wk;});
  now.sort(function(x,y){return y.it.wk-x.it.wk;});soon.sort(function(x,y){return y.it.wk-x.it.wk;});
  return {d:d,wl:wl,over:over,now:now,soon:soon,blocking:over.filter(function(o){return tlBlock().indexOf(o.it.id)>-1;}).length};
}
function tlExpand(g){tlOpen[g]=true;renderTimeline();}
function tlTick(el,id){if(el)el.classList.add('done');setTimeout(function(){togPlanTL(id);},350);}
/* P-04: ticking from the timeline offers an Undo toast */
function togPlanTL(id){togPlan(id);if(planChk[id]){var it=findPlanItem(id);toast((it?it.label.replace(/<[^>]+>/g,''):'Item')+' ✓','','Undo',function(){togPlan(id);});}}
/* ── 6.7 (G3 #27) · "Already sorted?" — a date usually means the basics are booked: one sheet of large toggle chips, one Save, one Undo (it only ticks, via the same path as togPlan) ── */
var SORTED_LBL={passport:'Passport valid 6+ months',visa:'Umrah visa',menacwy:'MenACWY certificate',flights:'Flights booked',hotels:'Hotels booked',insurance:'Travel insurance',nusuk:'Nusuk app',hajjpermit:'Nusuk Hajj permit / package',hajjvisa:'Hajj visa',hajjtravel:'Flights & hotels',hady:'Hady (Adahi voucher)'},sortedPick={};
/* 6.7 (G3 #28): the status card's date pill — showPicker() where it exists, else the Prepare countdown card's own date field */
function hsDatePick(){var i=document.getElementById('hsDate');if(i&&hsDateOpen(i))return;goTab('plan','prep','cdCard');setTimeout(pickDep,350);}
function hsDateOpen(i){try{if(i.showPicker){i.showPicker();return true;}}catch(e){}try{i.focus();}catch(e){}return false;}
function hsDateSet(v){if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v))return;if(v<isoOf(new Date())){toast('That date has passed — pick your departure date');return;}var dd=document.getElementById('depDate');if(dd)dd.value=v;setDep(v);updRetDate();renderHome();var sc=document.querySelector('#homeArea .hstatus');if(sc){try{sc.focus({preventScroll:true});}catch(x){}}}
function sortedIds(){var L=journey()==='hajj'?TL_BLOCK_H.concat(['hajjtravel','hady','insurance']):TL_BLOCK.concat(['insurance','nusuk']);return L.filter(function(id){var it=findPlanItem(id);return it&&forMe(it);});}
function docsTicked(){var n=0;activePlan().forEach(function(sec){if(sec.id==='docs')sec.items.forEach(function(it){if(forMe(it)&&planChk[it.id])n++;});});return n;}
/* asked once, after the first departure date is saved — only for a trip still ahead and while nothing in Documents is ticked */
function sortedAsk(){var d=depDays();if(d===null||d<=0||docsTicked())return;setTimeout(function(){if(!document.querySelector('#gSheet.on'))sortedSheet();},500);}
function sortedSheet(){var ids=sortedIds();sortedPick={};
  var chips=ids.map(function(id){var on=!!planChk[id];return '<button class="srt-chip'+(on?' done':'')+'" id="srt-'+id+'" aria-pressed="'+(on?'true':'false')+'"'+(on?' disabled':'')+' onclick="sortedTog(\''+id+'\')"><i aria-hidden="true">'+mk('check')+'</i>'+esc(SORTED_LBL[id]||id)+(on?' <small>· ticked</small>':'')+'</button>';}).join('');
  openSheet('<div class="sheet-h">'+mk('check')+'</div><h3>Already sorted?</h3><p>Tap what is already booked or done — Save ticks them all at once (Undo puts them back).</p><div class="srt-chips" role="group" aria-label="Travel basics">'+chips+'</div><button class="btn tall" id="srtSave" onclick="sortedSave()" disabled>Save</button><button class="btn ghost tall" onclick="closeSheet()">Not yet</button>');}
function sortedTog(id){if(planChk[id])return;sortedPick[id]=!sortedPick[id];var b=document.getElementById('srt-'+id);if(b){b.classList.toggle('on',!!sortedPick[id]);b.setAttribute('aria-pressed',sortedPick[id]?'true':'false');}
  var n=Object.keys(sortedPick).filter(function(k){return sortedPick[k];}).length,sv=document.getElementById('srtSave');if(sv){sv.disabled=!n;sv.textContent=n?'Save — tick '+n:'Save';}vib(6);}
function sortedSave(){var ids=Object.keys(sortedPick).filter(function(k){return sortedPick[k]&&!planChk[k];});closeSheet();if(!ids.length)return;
  ids.forEach(function(id){planChk[id]=true;});save('us-plan',planChk);markPrepDay();updPlan();chkBadges();vib(15);
  toast(ids.length+' ticked — '+ids.map(function(id){return SORTED_LBL[id]||id;}).join(', '),'','Undo',function(){ids.forEach(function(id){delete planChk[id];});save('us-plan',planChk);updPlan();chkBadges();});}
function renderTimeline(){
  var a=document.getElementById('tlArea'),sub=document.getElementById('tlSub'),card=document.getElementById('tlCard');if(!a)return;
  if(!ST.dep){if(card)card.hidden=true;a.innerHTML='';sub.textContent='Set your departure date above to get a dated to-do timeline.';return;}
  if(card)card.hidden=false;
  var B=tlBuckets();
  if(!B){a.innerHTML='';sub.textContent='You’re on your journey — this timeline is done. Switch to the '+jw()+' and Daily tabs.';return;}
  var over=B.over,now=B.now,soon=B.soon,wl=B.wl,d=B.d;
  var tot=over.length+now.length+soon.length;
  sub.textContent=d+' day'+(d===1?'':'s')+' to go · '+tot+' not ticked yet'+(B.blocking?' · '+B.blocking+' travel-blocking':'');
  function row(o,cls,lbl){return '<div class="tli" role="checkbox" tabindex="0" aria-checked="false" onclick="tlTick(this,\''+o.it.id+'\')"><span class="tick"></span><div class="tli-t">'+o.it.label+'<small>'+o.sec.title+' · <span class="ty-nw">ideally '+(o.it.wk>=1?o.it.wk+' week'+(o.it.wk>1?'s':''):'days')+' before</span></small></div><span class="tli-when '+cls+'">'+lbl+'</span></div>';}
  function group(list,title,fn,key,cap){var open=!!tlOpen[key],show=open?list:list.slice(0,cap);return '<div class="tli-h">'+title+'</div>'+show.map(fn).join('')+(list.length>cap&&!open?'<button class="tli-more" onclick="tlExpand(\''+key+'\')">+ '+(list.length-cap)+' more ▾</button>':'');}
  var h='';
  if(over.length)h+=group(over,'Should already be done — tap to tick',function(o){var bl=tlBlock().indexOf(o.it.id)>-1;return row(o,bl?'over':'late',bl?'overdue':'late');},'over',4);
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
function saveHotelInfo(){var H=hiNorm(ST.hotelInfo),k=hotelTabC||hiCity();H[k]={n:hv('hName'),a:hv('hAddr'),p:hv('hPhone'),m:hv('hMeet'),ar:hv('hAr'),g:hv('hGate')};H.l=hv('hLead');ST.hotelInfo=H;saveST();updHotelSeg();updHotelLbl();renderCntHd();renderTodayTop();}
function loadHotelInfo(){var k=hotelTabC||hiCity(),hi=hiOf(k);var e=document.getElementById('hName');if(!e)return;updHotelSeg();e.placeholder=k==='md'?'Hotel name in Madinah (e.g. near Masjid an-Nabawi)':'Hotel name (e.g. Swissôtel Makkah)';e.value=hi.n||'';document.getElementById('hAddr').value=hi.a||'';document.getElementById('hPhone').value=hi.p||'';document.getElementById('hMeet').value=hi.m||'';document.getElementById('hLead').value=hi.l||'';var ha=document.getElementById('hAr'),hg=document.getElementById('hGate');if(ha)ha.value=hi.ar||'';if(hg)hg.value=hi.g||'';}
function quickHotel(v){v=(v||'').trim();if(!v)return;hiSet(hiCity(),{n:v});loadHotelInfo();updHotelLbl();renderTodayTop();toast('🏨 Hotel saved — add the address & phone in Plan › Prepare','', 'Open',function(){goTab('plan','prep','hotelCard');});}
function telOf(v){return String(v||'').replace(/[^\d+]/g,'');}
/* the leader field is free text ("Ahmed · +966 5x xxx xxxx"): pull the number out of it */
/* ── 6.7 (G3 #31) · two hotels on one card: ST.hotelInfo = {mk:{n,a,p,m}, md:{n,a,p,m}, l} — the companion / leader (l) is one person for both cities,
   the meeting point is per city. An old one-hotel record {n,a,p,m,l} (a backup, a group link from an older version) is read and moved to the city its name
   says, else the itinerary's first city. hiOf() is the single reader: today's city from the itinerary (else the prayer city), falling back to the other
   city's hotel when today's is empty; hiOf('mk' | 'md') reads one city exactly. ── */
var HI_F=['n','a','p','m','ar','g'],hotelTabC=null;
function hiCk(c){return /^(md|madinah)$/i.test(String(c||''))?'md':'mk';}
function hiPick(o){var r={};HI_F.forEach(function(k){r[k]=(o&&typeof o[k]==='string')?o[k].slice(0,200):'';});return r;}
function hiHas(r){return !!(r&&(r.n||r.a||r.p));}
function hiGuess(o){var t=((o.n||'')+' '+(o.a||'')).toLowerCase();if(/madin|medina|nabaw/.test(t))return 'md';if(/makkah|mecca|makka/.test(t))return 'mk';return ((ST.itin||{}).first==='madinah')?'md':'mk';}
function hiNorm(h){var out={mk:hiPick(null),md:hiPick(null),l:''};if(!h||typeof h!=='object'||Array.isArray(h))return out;out.l=typeof h.l==='string'?h.l.slice(0,200):'';
  if(h.mk||h.md){out.mk=hiPick(h.mk);out.md=hiPick(h.md);return out;}
  var old=hiPick(h);if(hiHas(old)||old.m)out[hiGuess(old)]=old;return out;}
function hiCity(){var ex=onTrip()?expectedDay():null;if(ex){try{var d=itinDays()[ex-1];if(d&&d.city)return hiCk(d.city);}catch(e){}}return hiCk(ST.city);}
function hiOf(c){var H=hiNorm(ST.hotelInfo),k=c?hiCk(c):hiCity(),r=H[k];if(!c&&!hiHas(r)){var o=k==='mk'?'md':'mk';if(hiHas(H[o])){k=o;r=H[o];}}return {n:r.n,a:r.a,p:r.p,m:r.m,ar:r.ar||'',g:r.g||'',l:H.l,c:k,fb:!c&&k!==hiCity()};}
/* G3 review: a hotel shown on a day in the other city says which city it is in */
function hiFbL(hi){return hi&&hi.fb?(hi.c==='md'?'Madinah':'Makkah'):'';}
function hiSet(k,rec){var H=hiNorm(ST.hotelInfo);H[k]=Object.assign(H[k],rec);ST.hotelInfo=H;saveST();}
/* the hotel card's Makkah | Madinah tabs */
function updHotelSeg(){var k=hotelTabC||hiCity(),H=hiNorm(ST.hotelInfo);[['mk','hsegMk'],['md','hsegMd']].forEach(function(x){var b=document.getElementById(x[1]);if(!b)return;var on=x[0]===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false');b.classList.toggle('has',hiHas(H[x[0]]));});}
function hotelTab(k){hotelTabC=hiCk(k);loadHotelInfo();vib(6);}
function leadPhone(){var l=hiOf().l||'';var m=l.match(/\+?\d[\d\s\-().]{6,}\d/);return m?m[0]:'';}
function leadName(){var l=hiOf().l||'',p=leadPhone();return (p?l.replace(p,''):l).replace(/^[\s·,:\-–|()]+|[\s·,:\-–|()]+$/g,'').trim();}
function mapsUrl(c){var hi=hiOf(c),pin=hotelPin(hi.c==='md'?'madinah':'makkah')||(c?null:anyPin());return 'https://www.google.com/maps/dir/?api=1&destination='+(pin?pin[0]+','+pin[1]:encodeURIComponent((hi.n||'')+' '+(hi.a||'')+' Saudi Arabia'));}
var DRV_AR_HOTEL='من فضلك خذني إلى هذا الفندق';
function showDriver(c){var hi=hiOf(c);
  if(!hi.n){toast('Enter your hotel name first','','Add it',function(){goTab('plan','prep','hotelCard');setTimeout(function(){var e=document.getElementById('hName');if(e)e.focus();},700);});return;}
  /* G3 #31: today's city leads; a one-tap switch shows the other city's hotel when there is one */
  var ok=hi.c==='mk'?'md':'mk',other=hiOf(ok);
  showDriverCard({top:'🚕 Please take me to my hotel',lead:DRV_AR_HOTEL,ar:hi.ar||'',en:hi.n,sub:(hiFbL(hi)?'In '+hiFbL(hi)+(hi.a?' · ':''):'')+(hi.a||''),tel:hi.p||'',maps:mapsUrl(hi.c),alt:other.n?{l:(ok==='md'?'Madinah':'Makkah')+' hotel instead',ic:ok==='md'?'dome':'kaaba',go:'showDriver(\''+ok+'\')'}:null});}
function closeDriver(){document.getElementById('driver').classList.remove('on');if(wakeLock&&!document.getElementById('focus').classList.contains('on')){wakeLock.release().catch(function(){});wakeLock=null;}}
/* 6.6 (G2 #9/#17): the tent days — 8–12 Dhul Hijjah, and the 13th when staying. The camp and the group leader lead the stranger cards, the Counters header and Today's trip card.
   On the 9th, until the computed Arafah sunset, the place is Arafah: the Arabic line is two existing labels (عرفات from PLACES, مكتب from the camp driver card) — no new sentence. */
function campDay(){if(journey()!=='hajj')return 0;var hd=hajjDay();return typeof hd==='number'&&(hd<13||ST.stay13)?hd:0;}
function campAtArafah(){return campDay()===9&&arafahNow().left>0;}
/* G2 review: from the Arafah sunset on the 9th until sunrise at Mina on the 10th the pilgrim is at Muzdalifah (the window rulesToday() and secPast() use) */
function campAtMuz(){var cd=campDay();return (cd===9&&arafahNow().left<=0)||(cd===10&&nowMin()<siteTimes('Mina').rise);}
function campHas(c){c=c||ST.camp||{};return !!(c.n||c.m||c.l||c.p);}
/* "Camp 42 · maktab 113": a value typed with its own label ("tent 12") keeps it, never "Camp tent 12" */
function campChipT(c){c=c||ST.camp||{};var n=String(c.n||'').trim();return [n?(/^(camp|tent)\b/i.test(n)?n.charAt(0).toUpperCase()+n.slice(1):'Camp '+n):'',c.m?'maktab '+campM(c):''].filter(Boolean).join(' · ');}
function campArH(c,af){c=c||ST.camp||{};if(af==='muz'){var mzP=placeById('muzdalifah');return c.m&&mzP?mzP.ar+' · مكتب <bdi>'+esc(campM(c))+'</bdi>':'';}if(af)return c.m?'عرفات · مكتب <bdi>'+esc(campM(c))+'</bdi>':'';return (c.n||c.m)?'مخيمي في منى'+(c.n?' · مخيم <bdi>'+esc(campN(c))+'</bdi>':'')+(c.m?' · مكتب <bdi>'+esc(campM(c))+'</bdi>':''):'';}
/* where the camp fields live (Plan › Prepare, in the hotel card) */
function goCampEdit(){goTab('plan','prep','campBlk');setTimeout(function(){var e=document.getElementById('cN');if(e)e.focus();},700);}
/* P-08: offline reunification card — leader's number, hotel, meeting point, 911 / 1966 in big type */
function lostArT(){return (ST.profile==='w'?'أنا ضائعة':'أنا ضائع')+'، من فضلك اتصل بهذا الرقم';}
function showLost(){var hi=hiOf(),ph=leadPhone(),nm=leadName(),cp=ST.camp||{},cd=campDay();
  var lostAr='<div class="lost-ar" lang="ar" dir="rtl">'+lostArT()+'</div>',h=lostAr;
  /* G2 #9: on a tent day the camp line (hero type) and the group leader's number come first; the hotel rows follow, the Haram meeting point does not apply */
  if(cd&&(cp.n||cp.m||cp.p)){var af=campAtArafah(),mz=campAtMuz(),ar=campArH(cp,mz?'muz':af),bigLead=!!cp.p;
    h=(ar?'<div class="lost-ar lost-camp" lang="ar" dir="rtl" id="lostCamp">'+ar+'</div>':'')+lostAr;
    if(bigLead)h+='<div class="lost-en">I am with '+esc(cp.l||'my group')+'. Please call:</div><a class="lost-tel" href="tel:'+telOf(cp.p)+'">'+esc(cp.p)+'</a>';
    else if(ph)h+='<div class="lost-en">I am with '+esc(nm||hi.l)+'. Please call:</div><a class="lost-tel" href="tel:'+telOf(ph)+'">'+esc(ph)+'</a>';
    else if(hi.l)h+='<div class="lost-en">I am with '+esc(hi.l)+'.</div>';
    h+=meLostHTML();
    if((af||mz)&&cp.m)h+='<div class="lost-kv"><span>'+mkOr('⛺')+' '+(mz?'Muzdalifah':'Arafah')+' · maktab</span><b>'+esc(campM(cp))+'</b></div>';
    if(cp.n)h+='<div class="lost-kv"><span>'+mkOr('⛺')+' Mina camp / tent</span><b>'+esc(cp.n)+'</b></div>';if(cp.m&&!af&&!mz)h+='<div class="lost-kv"><span>'+mkOr('🏢','hotel')+' Maktab</span><b>'+esc(cp.m)+'</b></div>';
    if(!bigLead&&cp.l)h+='<div class="lost-kv"><span>'+mkOr('👥')+' Group leader</span><b>'+esc(cp.l)+'</b></div>';
    if(bigLead&&ph)h+=telRow(mkOr('👥')+' '+esc(nm||'Companion'),telOf(ph),esc(ph));
    if(hi.n)h+='<div class="lost-kv"><span>'+mkOr('🏨')+' Hotel'+(hiFbL(hi)?' · in '+hiFbL(hi):'')+'</span><b>'+esc(hi.n)+'</b></div>';
    if(hi.a)h+='<div class="lost-kv"><span>'+mkOr('📍')+' Address</span><b style="text-align:right">'+esc(hi.a)+'</b></div>';
    if(hi.p)h+='<div class="lost-kv"><span>'+mkOr('☎','phone')+' Hotel phone</span><a href="tel:'+telOf(hi.p)+'">'+esc(hi.p)+'</a></div>';
    h+=telRow(mkOr('🚓','alert')+' Police · ambulance','911','911')+telRow(mkOr('🕋')+' Hajj &amp; Umrah care line','1966','1966');
    if(!cp.p)h+='<button class="btn ghost" style="margin-top:16px" onclick="closeLost();goCampEdit()">'+markify('✍️ Add your group leader’s phone')+'</button>';
    h+='<div class="focus-hint" style="margin-top:26px;text-align:center" onclick="closeLost()">tap here to close</div>';
    document.getElementById('lostBody').innerHTML=h;document.getElementById('lost').classList.add('on');vib([20,30,20]);return;}
  if(hi.l){h+='<div class="lost-en">I am with '+esc(nm||hi.l)+'. Please call:</div>'+(ph?'<a class="lost-tel" href="tel:'+telOf(ph)+'">'+esc(ph)+'</a>':'<div class="lost-tel" style="font-size:var(--t-6)">'+esc(hi.l)+'</div>');}
  else h+='<div class="lost-en">I am lost. Please help me reach my hotel, or call the emergency line.</div><div style="height:12px"></div>';
  h+=meLostHTML();
  if(hi.n)h+='<div class="lost-kv"><span>'+mkOr('🏨')+' Hotel'+(hiFbL(hi)?' · in '+hiFbL(hi):'')+'</span><b>'+esc(hi.n)+'</b></div>';
  if(hi.a)h+='<div class="lost-kv"><span>'+mkOr('📍')+' Address</span><b style="text-align:right">'+esc(hi.a)+'</b></div>';
  if(hi.p)h+='<div class="lost-kv"><span>'+mkOr('☎','phone')+' Hotel phone</span><a href="tel:'+telOf(hi.p)+'">'+esc(hi.p)+'</a></div>';
  if(hi.m)h+='<div class="lost-kv"><span>'+mkOr('🤝','pin')+' Family meeting point</span><b style="text-align:right">'+esc(hi.m)+'</b></div>';
  /* J-05: in Hajj mode the Mina camp, maktab and group leader sit on the same card — the numbers a steward or policeman needs */
  var cp=ST.camp||{};if(journey()==='hajj'&&(cp.n||cp.m||cp.l||cp.p)){
    if(cp.n||cp.m)h+='<div class="lost-ar" lang="ar" dir="rtl" style="font-size:var(--t-5);margin-top:10px">مخيمي في منى'+(cp.n?' · مخيم <bdi>'+esc(campN(cp))+'</bdi>':'')+(cp.m?' · مكتب <bdi>'+esc(campM(cp))+'</bdi>':'')+'</div>';
    if(cp.n)h+='<div class="lost-kv"><span>'+mkOr('⛺')+' Mina camp / tent</span><b>'+esc(cp.n)+'</b></div>';if(cp.m)h+='<div class="lost-kv"><span>'+mkOr('🏢','hotel')+' Maktab</span><b>'+esc(cp.m)+'</b></div>';
    if(cp.l||cp.p)h+=cp.p?telRow(mkOr('👥')+' '+esc(cp.l||'Group leader'),telOf(cp.p),esc(cp.p)):'<div class="lost-kv"><span>'+mkOr('👥')+' '+esc(cp.l)+'</span><b></b></div>';}
  h+=telRow(mkOr('🚓','alert')+' Police · ambulance','911','911')+telRow(mkOr('🕋')+' Hajj &amp; Umrah care line','1966','1966');
  if(cd)h+='<button class="btn ghost" style="margin-top:16px" onclick="closeLost();goCampEdit()">'+markify('✍️ Add your Mina camp & group leader')+'</button>';
  else if(!hi.l||!hi.n)h+='<button class="btn ghost" style="margin-top:16px" onclick="closeLost();goTab(\'plan\',\'prep\',\'hotelCard\')">'+markify('✍️ Add ')+(!hi.l&&!hi.n?'your hotel & a companion’s number':!hi.l?'a companion’s number':'your hotel')+'</button>';
  h+='<div class="focus-hint" style="margin-top:26px;text-align:center" onclick="closeLost()">tap here to close</div>';
  document.getElementById('lostBody').innerHTML=h;document.getElementById('lost').classList.add('on');vib([20,30,20]);}
function closeLost(){document.getElementById('lost').classList.remove('on');obAfterCardGo();}
/* Home quick tool + Daily trip card → one sheet with every safety action */
function sosSheet(){var hi=hiOf();
  openSheet('<div class="sheet-h danger">'+mk('car')+'</div><h3>Hotel &amp; SOS</h3><p>'+(hi.n?esc(hi.n)+(hi.m?' · meet at '+esc(hi.m):''):'No hotel saved yet — add it in Plan › Prepare so the driver card works offline.')+'</p><button class="btn" onclick="closeSheet();showDriver()">'+markify('🚕 Show to driver')+'</button>'+(journey()==='hajj'?'<button class="btn" onclick="closeSheet();showCampDriver()">'+markify(campAtMuz()?'⛺ My maktab & group leader':'⛺ Take me to my camp in Mina')+'</button>':'')+'<button class="btn danger" onclick="closeSheet();showLost()">'+markify('🆘 I’m lost — show this')+'</button><button class="btn ghost" id="sosSay" onclick="closeSheet();showSayList()">'+mk('speaker','mkt')+'Show a phrase in Arabic</button><div style="display:flex;gap:8px;margin-top:10px"><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:911">☎ 911</a><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:1966">☎ 1966 care</a></div><button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'prep\',\'hotelCard\')">'+markify('✍️ Edit hotel &amp; contacts')+'</button>');}
/* ── J-05: Mina camp / maktab / group leader (Settings card) — feeds the driver card, the lost card, Help and the Camp quick tool ── */
/* a camp or maktab value that already starts with its own label ("Camp 43", "maktab 12") is shown once, never "camp Camp 43" */
function campStrip(v,re){v=String(v||'').trim();var x=v.replace(re,'').trim();return x||v;}
function campN(c){return campStrip(c.n,/^(?:camp|tent)(?:\s*\/\s*tent)?\b[\s:#.\-]*/i);}
function campM(c){return campStrip(c.m,/^maktab\b[\s:#.\-]*/i);}
function saveCamp(){ST.camp=Object.assign({},ST.camp||{},{n:hv('cN'),m:hv('cM'),l:hv('cL'),p:hv('cP'),z:hv('cZ').slice(0,30),st:hv('cS').slice(0,40),g:hv('cG').slice(0,30),ts:hv('cT').slice(0,20),lm:hv('cLm').slice(0,80)});saveST();campSumUpd();renderCntHd();renderTodayTop();}
/* G2 #24: the fields live in Plan › Prepare (hotel card, Hajj mode); Settings keeps a summary and a link */
function campSumUpd(){var e=document.getElementById('campSum');if(!e)return;var c=ST.camp||{},t=[campChipT(c),c.l?esc(c.l)+(c.p?' · '+esc(c.p):''):''].filter(Boolean).join(' · ');e.innerHTML=t||'Not saved yet — every tent looks the same at 2 am.';}
function loadCamp(){var c=ST.camp||{},e=document.getElementById('cN'),b=document.getElementById('campBlk');if(b)b.hidden=journey()!=='hajj';campSumUpd();if(!e)return;e.value=c.n||'';document.getElementById('cM').value=c.m||'';document.getElementById('cL').value=c.l||'';document.getElementById('cP').value=c.p||'';[['cZ','z'],['cS','st'],['cG','g'],['cT','ts'],['cLm','lm']].forEach(function(f){var x=document.getElementById(f[0]);if(x)x.value=c[f[1]]||'';});}
function showCampDriver(){var c=ST.camp||{};
  if(!c.n&&!c.m){toast('Add your camp or maktab number first','','Add it',goCampEdit);return;}
  var cn=campN(c),cm=campM(c);
  /* G2 #9: on the 9th, until the Arafah sunset, the way back is to the maktab's camp in Arafah — "Please take me to" + the place labels, as for any place */
  if(campAtArafah()&&c.m){showDriverCard({top:'🚕 Please take me to my maktab’s camp in Arafah',lead:'من فضلك خذني إلى',arH:campArH(c,true),en:'Arafah · maktab '+cm,sub:c.l?'Group leader: '+c.l:'',tel:c.p||'',telL:'☎ Call leader',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Arafat Makkah maktab '+c.m)});return;}
  /* the Muzdalifah night: no “take me to Mina” before the stay is done — the maktab and the group leader only */
  if(campAtMuz()){showDriverCard({top:'⛺ My maktab and group leader',lead:' ',arH:campArH(c,'muz'),en:c.m?'Muzdalifah · maktab '+cm:(c.n?'Camp / tent '+cn:'—'),sub:c.l?'Group leader: '+c.l:'',tel:c.p||'',telL:'☎ Call leader'});return;}
  showDriverCard({top:'🚕 Please take me to my camp in Mina',lead:'من فضلك خذني إلى مخيمي في منى',arH:(c.n?'مخيم <bdi>'+esc(cn)+'</bdi>':'')+(c.n&&c.m?' · ':'')+(c.m?'مكتب <bdi>'+esc(cm)+'</bdi>':''),en:'Mina'+(c.n?' · camp / tent '+cn:'')+(c.m?' · maktab '+cm:''),sub:c.l?'Group leader: '+c.l:'',tel:c.p||'',telL:'☎ Call leader',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mina Makkah'+(c.m?' maktab '+c.m:''))});}
function campSheet(){var c=ST.camp||{},has=!!(c.n||c.m||c.l||c.p);
  openSheet('<div class="sheet-h">'+mk('tent')+'</div><h3>Mina camp</h3><p>'+(has?[c.n?'Camp / tent '+esc(campN(c)):'',c.m?'Maktab '+esc(campM(c)):'',c.l?esc(c.l):''].filter(Boolean).join(' · '):'Save your camp and maktab number and the group leader’s phone — the way back when every tent looks the same.')+'</p>'
    +(c.p?'<a class="btn" href="tel:'+telOf(c.p)+'" style="text-align:center;text-decoration:none">'+mk('phone','mkt')+'Call '+esc(c.l||'group leader')+'</a>':'')+'<button class="btn" onclick="closeSheet();showCampDriver()">'+markify('🚕 Take me to my camp')+'</button><button class="btn danger" onclick="closeSheet();showLost()">'+markify('🆘 I’m lost — show this')+'</button><button class="btn ghost" onclick="closeSheet();goCampEdit()">'+markify('✍️ '+(has?'Edit':'Add')+' camp details')+'</button>');}
/* Rami counter arrives with Part 2; until then the quick tool lands on the rites */
function goRami(){if(typeof openRami==='function')openRami();else goTab('umrah','steps','hajjContainer');}
/* Umrah › Counters header: lost / hotel / meeting point */
function renderCntHd(){var a=document.getElementById('cntHd');if(!a)return;var hi=hiOf();
  /* G2 #17: on a tent day the camp takes the hotel's place (and the Haram meeting point steps aside) */
  if(campDay()){var ct=campChipT();a.innerHTML='<button class="chip-btn sos" onclick="showLost()">'+markify('🆘 I’m lost')+'</button><button class="chip-btn" id="cntCamp" onclick="campSheet()" aria-label="'+(ct?'My Mina camp: '+esc(ct):'Add your Mina camp')+'">'+mk('tent','mkt')+esc(ct||'Add camp')+'</button>';return;}
  a.innerHTML='<button class="chip-btn sos" onclick="showLost()">'+markify('🆘 I’m lost')+'</button><button class="chip-btn" onclick="showDriver()">'+markify('🚕 Hotel')+'</button>'+(hi.m?'<button class="meetchip" style="margin:0" onclick="showLost()" aria-label="Family meeting point: '+esc(hi.m)+'"><span>📍 Meet: '+esc(hi.m)+'</span></button>':'');}
/* Daily › Today: today's itinerary line (P-11) and the trip card while on trip (P-07) */
function renderTodayTop(){var a=document.getElementById('todayTop');if(!a)return;var h='';
  var days=itinDays(),it=days[ST.day-1],hsec=hajjTodaySec(ST.day);
  if(hsec)h+='<div class="card todayit hjt" id="hajjTodayRow" role="button" tabindex="0" aria-label="'+esc(hsec.title.split(' — ')[0])+' — '+esc(secSub(hsec))+' — open today’s steps" onclick="openHajjDay(\''+hsec.id+'\')"><span class="ti-i">'+hsec.ico+'</span><div class="ti-t"><b>'+esc(hsec.title.split(' — ')[0])+'</b>'+esc(secSub(hsec))+'</div><span class="xchip">Open today’s steps →</span></div>';
  else if(it)h+='<div class="card todayit" role="button" tabindex="0" aria-label="Today’s itinerary: '+esc(it.e[1])+' — edit" title="'+esc(it.e[1])+'" onclick="goTab(\'plan\',\'prep\',\'itinCard\')"><span class="ti-i">🗓️</span><div class="ti-t"><b>'+(it.city==='Makkah'?'🕋':'🕌')+' '+it.city+'</b>'+it.e[0]+' '+esc(it.e[1])+'</div><span class="xchip">Edit →</span></div>';
  if(onTrip()&&campDay()){var cp=ST.camp||{},ct=campChipT(cp);
    /* G2 #17: from the 8th to the 12th (13th) the pilgrim lives in a Mina tent — the trip card is the camp's */
    h+='<div class="card tripc tripcamp" id="tripCamp"><div class="tc-h"><span>'+mk('tent')+'</span><b'+(cp.l?' title="Group leader: '+esc(cp.l)+'"':'')+'>'+(ct?esc(ct):'Your Mina camp')+'</b>'+(ct?'<button class="chip-btn" onclick="showCampDriver()" aria-label="Show to driver: take me to my camp">'+markify('🚕 Driver')+'</button>':'<button class="chip-btn" onclick="goCampEdit()" aria-label="Add your Mina camp">'+markify('✍️ Add camp')+'</button>')+'<button class="chip-btn sos" onclick="showLost()" aria-label="I’m lost — show this">'+markify('🆘 Lost')+'</button><button class="chip-btn" onclick="sosSheet()" aria-label="Emergency numbers 911 and 1966, camp and hotel actions">'+markify('☎ SOS')+'</button></div></div>';}
  else if(onTrip()){var hi=hiOf();
    h+='<div class="card tripc"><div class="tc-h"><span>'+mkOr('🏨')+'</span><b'+(hi.m?' title="Meeting point: '+esc(hi.m)+'"':'')+'>'+(hi.n?esc(hi.n):'Your hotel')+'</b><button class="chip-btn" onclick="showDriver()" aria-label="Show to driver">'+markify('🚕 Driver')+'</button><button class="chip-btn sos" onclick="showLost()" aria-label="I’m lost — show this">'+markify('🆘 Lost')+'</button><button class="chip-btn" onclick="sosSheet()" aria-label="Emergency numbers 911 and 1966, hotel actions">'+markify('☎ SOS')+'</button></div>'
      +(hi.n?'':'<input class="srch" id="tcName" placeholder="Hotel name — so the driver card works" onchange="quickHotel(this.value)" aria-label="Hotel name">')+'</div>';}
  a.innerHTML=h;}

/* 6.5 (G1 #7): the Part 2 section of a trip day on 8–13 Dhul Hijjah (a 13th you are not staying for is an ordinary day) */
function hajjTodaySec(n){var hd=tripHajjDay(n),sec=null;if(!hd||(hd===13&&!ST.stay13))return null;HAJJ_RITES.forEach(function(x){if(x.hd===hd&&!x.night)sec=x;});return sec;}
/* the Salah section speaks for the day: Mina — shortened, each on time (schools differ: see the 8th); Arafah — Dhuhr + Asr together; its hadith is the day's own */
function hajjDailyHead(n){var t=document.getElementById('dt-salah'),nt=document.getElementById('dn-salah');if(!t||!nt)return;var sec=hajjTodaySec(n),base=DAILY.filter(function(x){return x.id==='salah';})[0]||{},hd=sec?sec.hd:0;
  var tt=!sec?base.title:hd===9?'Arafah — Dhuhr + Asr together':'Salah in Mina — shortened, each on time';if(t.textContent!==tt)t.textContent=tt;
  var nh=!sec?base.hn:sec.hn+(hd===9?'':'<br><span class="dn-sch">Schools differ on shortening — <button class="lnk" style="font-size:1em" onclick="openRiteStep(\'h8mina\')">see the 8th for your school</button>.</span>');
  if(nt.getAttribute('data-hd')!==String(hd)){nt.innerHTML=nh;nt.setAttribute('data-hd',String(hd));}
  /* tahajjud on a day of Hajj is prayed in the camp, not "in the Haram" */
  var tj=document.querySelector('#dw-tahajjud .rl'),tb=null;(base.items||[]).forEach(function(it){if(it.id==='tahajjud')tb=it;});if(tj&&tb){var tl=sec?'Tahajjud':tb.label;if(tj.textContent!==tl)tj.textContent=tl;}
  var tx=document.querySelector('#dw-tahajjud .x');if(tx)tx.hidden=!!sec;}

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
/* G2 #17: the dua list hint speaks to the journey */
function duaHintT(){return journey()==='hajj'?'Write them before you fly; tick them as you ask — at Arafah above all.':'Write them before you fly; tick them as you ask in the Haram.';}
function renderDuaSec(){var c=document.getElementById('duaCard');if(!c)return;var d=depDays(),shut=d!==null&&d<=0&&duas.length>0;
  var inner='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 8px"><p style="font-size:var(--t-3);color:var(--ink2);margin:0;flex:1" id="duaHint">'+duaHintT()+'</p><button class="xchip" style="margin:0;flex-shrink:0" onclick="goTab(\'more\',\'duas\')">📖 Essential duas →</button></div>'
    +'<div style="display:flex;gap:8px;margin-bottom:8px"><input class="srch" id="duaIn" placeholder="Add a dua…" style="margin:0" onkeydown="if(event.key===\'Enter\')addDua()" aria-label="Add a dua"><button class="chip-btn" onclick="addDua()" aria-label="Add">＋</button></div><div id="duaList"></div>';
  c.innerHTML=mkSec({id:'dualist',ico:'🤲',title:'My dua list'},shut,inner);renderDuaList();}
function addDua(){var i=document.getElementById('duaIn'),v=(i.value||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();i.value='';renderDuaList();updStats();vib(15);}
function togDua(i){duas[i].done=!duas[i].done;saveDuas();renderDuaList();var dm0=document.getElementById('duaMine');if(dm0)renderDuas();updStats();vib(10);}
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
    +'<div class="dua-read">'+myDuasReadBtn('dlRead')+'</div><div class="dua-acts"><span>'+done+' of '+duas.length+' asked</span>'+(done?'<button class="chip-btn" onclick="duaNewRound()">↺ Untick all — new round</button>':'')+'<button class="lnk" onclick="togDaily(\'dualist\')">'+(today?'✓ went through my list today':'Went through my list today? Tick it')+'</button></div>';
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
/* D-13/D-17: one shared estimate — 4.2 km per recorded Umrah (7 × 0.2 km ground-floor tawaf + 7 × 394 m sa’i; upper floors are longer), the live counters, and every logged nafl tawaf */
function kmEst(){var km=ST.umrahs*4.2+ST.tawaf*0.2+ST.sai*0.394;for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d)km+=(d.ntawafN||(d.ntawaf?1:0))*1.4;}return Math.round(km*10)/10;}

/* ════════════════════════ ITINERARY ════════════════════════ */
function itinST(){var it=ST.itin=ST.itin||{};if(it.mad===undefined)it.mad=3;if(!it.first)it.first='makkah';if(!it.custom)it.custom={};return it;}
function itinHasCustom(){return Object.keys(itinST().custom).length>0;}
function itinClearOK(){if(!itinHasCustom())return true;if(confirm('Changing this resets the days you edited. Continue?')){itinST().custom={};return true;}return false;}
function setItin(first){if(!itinClearOK()){renderItin();return;}itinST().first=first;saveST();renderItin();renderTodayTop();}
function setItinDays(v){if(!itinClearOK()){renderItin();return;}itinST().mad=Math.max(0,Math.min(20,parseInt(v)||0));saveST();renderItin();renderTodayTop();}
function setPace(p){if(!itinClearOK()){renderItin();return;}itinST().pace=p||'';saveST();renderItin();renderTodayTop();}
var MK=[['🛬','Arrive · ihram at the miqat (in flight) · Umrah tonight when rested'],['🕌','All five prayers in the Haram · nafl tawaf after Fajr · rest'],['🚐','Ziyarah taxi loop: Hira → Arafat → Muzdalifah → Mina → Thawr'],['🤍','Second Umrah from Tan’eem (or Ji’ranah) · Zamzam & long dua'],['📖','Quran facing the Kaaba · Hijr Isma’il late night · Clock Tower museum'],['🕋','Nafl tawaf · Jannat al-Mu’alla · Masjid al-Jinn · rest'],['🌙','Tahajjud in the Haram · dua list at the Multazam · shopping']];
var MD=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'],['🕌','Rawdah (Nusuk permit) · Baqi’ after Fajr (brothers enter; sisters give salam from the gate) · Quba with wudu from the hotel'],['🚌','Hop-on hop-off: Qiblatayn → Uhud · the Hijaz Railway Museum is closed for restoration — check before you go'],['📿','Masjid al-Ijabah · Quran & Seerah museums · Ajwa dates market'],['🌙','Tahajjud in the Nabawi · Quba Avenue walk · long dua']];
/* P-33 family pace: later Umrah, one site a day, no climbs, midday rest */
var REST=' · ☀️ 12–4pm rest in hotel';
var MK_F=[['🛬','Arrive in ihram · settle, rest · Isha in the Haram — you stay in ihram until tomorrow’s Umrah'],['🕋','Umrah after Fajr while it is cool · sleep after Dhuhr'+REST],['🕌','Prayers in the Haram · Zamzam · one short visit: Jannat al-Mu’alla'+REST],['🚐','One site by taxi: Arafat (view from the car, no climbing)'+REST],['📖','Quran after Fajr · Clock Tower museum (indoors, cool)'+REST],['🤍','Optional second Umrah from Tan’eem after Fajr — skip if anyone is tired'+REST],['🌙','Nafl tawaf after Isha when it is cooler · dua list'+REST]];
var MD_F=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'+REST],['🕌','Rawdah (Nusuk permit) · Baqi’ from the gate after Fajr'+REST],['🚌','One site: Quba by hop-on hop-off or taxi, wudu from the hotel'+REST],['⛰️','One site: Uhud after Asr (short, flat visit) · Ajwa dates market'+REST],['🌙','Prayers in the Nabawi · Quba Avenue walk after Maghrib'+REST]];
/* 6.5 (G1 #1): a long stay cycles through repeatable rows instead of repeating its last day — site visits and the second Umrah stay one-offs */
var MK_R=[['🕌','All five prayers in the Haram · nafl tawaf after Fajr · rest'],['📖','Quran facing the Kaaba · Hijr Isma’il late night'],['🕋','Nafl tawaf · Zamzam & long dua · rest'],['🌙','Tahajjud in the Haram · dua list at the Multazam · shopping']];
var MK_FR=[['🕌','Prayers in the Haram · Zamzam'+REST],['📖','Quran after Fajr'+REST],['🌙','Nafl tawaf after Isha when it is cooler · dua list'+REST]];
function itinPick(arr,rep,i){return i<arr.length?arr[i]:rep[(i-arr.length)%rep.length];}
/* P-11: day builder shared by the card, Daily › Today and the share text; a 1-day leg never loses the Umrah */
function itinDays(){
  var it=itinST(),N=ST.tripLen,fam=it.pace==='family';
  if(journey()==='hajj')return itinHajj(it,N,fam);
  var mad=Math.min(it.mad,N-1),mk=N-mad,A=fam?MK_F:MK,B=fam?MD_F:MD,R=fam?MK_FR:MK_R,days=[];
  function push(arr,cnt,city,rep){for(var i=0;i<cnt;i++)days.push({city:city,e:rep?itinPick(arr,rep,i):arr[Math.min(i,arr.length-1)]});}
  if(it.first==='makkah'){push(A,mk,'Makkah',R);if(mk===1&&fam)days[0]={city:'Makkah',e:['🛬','Arrive in ihram · Umrah tonight when rested — your only Makkah day']};push(B,mad,'Madinah');}
  else{push(B,mad,'Madinah');days.push({city:'Makkah',e:['🚄','Train to Makkah · ihram before boarding (the train does not stop at Abyar Ali — make the intention before it passes the miqat) · '+(fam?'Umrah on arrival if the children are fresh, else after Fajr tomorrow (stay in ihram)':'Umrah on arrival')]});push(A.slice(1),mk-1,'Makkah',R);}
  var last=days[days.length-1],leg=0;for(var i=days.length-1;i>=0&&days[i].city===last.city;i--)leg++;
  if(last.city==='Makkah')last.e=leg>=2?['🕋','Farewell tawaf (tawaf al-wada’) · last dua at the Multazam · depart']:['🕋','Train to Makkah · ihram before boarding (the train does not stop at Abyar Ali — make the intention before it passes the miqat) · Umrah on arrival · farewell tawaf before departing'];
  else last.e=leg>=2?['🕌','Last salam to the Prophet ﷺ · depart']:['🕌','Salam to the Prophet ﷺ · Rawdah if permitted · depart'];
  days.forEach(function(d,idx){var c=it.custom[idx];if(typeof c==='string'&&c){d.cus=true;d.e=[d.e[0],c];}});
  return days;
}
/* 6.5 (G1 #1): the Hajj itinerary is built around hajjDates() — fixed, read-only rows for 8–12 Dhul Hijjah (the 13th only with ST.stay13) whose text is the HAJJ_RITES section sub-line;
   no ziyarah loop or Tan’eem Umrah before them (nafl tawaf and rest instead); Madinah wholly before the 7th or after the 13th; tawaf al-wada on the last Makkah day.
   Makkah-first / Madinah-first stays the pilgrim's choice; Madinah days that do not fit are reported, never squeezed into the days of Hajj. */
var MK_H=[MK[1],MK[4],MK[5],MK[6]],MK_HF=[MK_F[2],MK_F[4],MK_F[6]],REST8=['🕋','Nafl tawaf · rest — save your strength for the 8th'];
/* (G1 review) a day's sub-line, adapted to the pilgrim: Qiran / Ifrad are already in ihram on the 8th, Ifrad owes no hady, no "& sa’i" once it is done — one helper for the Steps header, the hero, Today, Home and the itinerary */
function secSub(sec){if(!sec)return '';var sub=sec.sub||'',ty=hajjType(),n=sec.hd;if(sec.night)return sub;
  if(n===8&&ty!=='tamattu')sub=sub.replace(/^Ihram from where you are staying/,'You are already in ihram — stay in it');
  if(n===10){if(ty==='ifrad')sub=sub.replace(' · hady','');if(!hajjSaiNeeded())sub=sub.replace(' & sa’i','');}
  return sub;}
function itinHajjRow(n){var s=null;HAJJ_RITES.forEach(function(x){if(x.hd===n&&!x.night)s=x;});if(!s)return null;var sub=secSub(s),ty=hajjType();
  if(n===9){var nt=HAJJ_RITES.filter(function(x){return x.id==='hd9n';})[0];var lc=function(t){return t.charAt(0).toLowerCase()+t.slice(1);};sub='Arafah — '+lc(sub)+(nt?' · then Muzdalifah — '+nt.sub:'');}
  return {city:'Makkah',hd:n,sec:s.id,e:[s.ico,sub]};}
function itinHajj(it,N,fam){
  var T=hajjType()==='tamattu',D=hajjDates(curHajjYear()),days=[],i,lastH=ST.stay13?13:12;
  var at=function(n){return (ST.dep&&D[n])?Math.round((new Date(D[n]+'T00:00:00')-new Date(ST.dep+'T00:00:00'))/864e5):null;};
  /* no departure date yet: the days of Hajj sit where hajjFitTrip() would put them — the 13th two days before the end */
  var i8=at(8);if(i8===null)i8=Math.max(1,N-8);
  var iL=i8+(lastH-8),i13=i8+5,want=Math.max(0,parseInt(it.mad)||0),pre=0;
  if(it.first==='madinah')pre=Math.min(want,Math.max(0,i8-1));
  var post=Math.min(want-pre,Math.max(0,N-Math.max(iL+2,i13+1))),madStart=N-post;
  var B=fam?MD_F:MD,POOL=fam?MK_HF:MK_H,REP=fam?MK_FR:MK_R;
  var ARR=fam?(T?[MK_F[0],MK_F[1]]:[['🛬','Arrive in ihram · settle, rest · Isha in the Haram — you stay in ihram until the 10th'],['🕋','The arrival tawaf (and sa’i if you do it now) after Fajr while it is cool · sleep after Dhuhr'+REST]])
    :(T?[MK[0]]:[['🛬','Arrive · ihram at the miqat (in flight) · the arrival tawaf (and sa’i if you do it now) when rested — you stay in ihram until the 10th']]);
  var TRAIN=['🚄','Train to Makkah · ihram before boarding (the train does not stop at Abyar Ali — make the intention before it passes the miqat) · '+(T?(fam?'Umrah on arrival if the children are fresh, else after Fajr tomorrow (stay in ihram)':'Umrah on arrival'):'the arrival tawaf (and sa’i if you do it now) on arrival — you stay in ihram until the 10th')];
  var k=0,a=0,q=0;
  for(i=0;i<N;i++){var n=i-i8+8,d;
    if(i<pre)d={city:'Madinah',e:B[Math.min(i,B.length-1)]};
    else if(n>=8&&n<=lastH)d=itinHajjRow(n);
    else if(i>=madStart)d={city:'Madinah',e:B[Math.min(i-madStart,B.length-1)]};
    else if(i<i8){/* before the 8th: the arrival (or the train from Madinah), then nafl tawaf and rest — the 7th is a rest day */
      if(pre&&i===pre)d={city:'Makkah',e:TRAIN};else if(!pre&&a<ARR.length&&i<i8)d={city:'Makkah',e:ARR[a++]};
      else if(i===i8-1)d={city:'Makkah',e:REST8};else d={city:'Makkah',e:itinPick(POOL,REP,k++)};}
    else d={city:'Makkah',e:REP[(q++)%REP.length]};
    days.push(d);}
  /* the last Makkah day after the days of Hajj is the farewell tawaf (then Madinah, or home) */
  var wd=post?madStart-1:N-1,ws=null;HAJJ_RITES.forEach(function(x){if(x.id==='hdw')ws=x;});
  if(wd>iL&&wd<N&&days[wd]&&days[wd].city==='Makkah')days[wd]={city:'Makkah',wada:true,e:['👋','Tawaf al-wada — '+(ws?ws.sub.charAt(0).toLowerCase()+ws.sub.slice(1):'the last thing you do')+(post?' · then the train to Madinah':' · depart')]};
  if(post){var lst=days[N-1];lst.e=post>=2?['🕌','Last salam to the Prophet ﷺ · depart']:['🕌','Salam to the Prophet ﷺ · Rawdah if permitted · depart'];}
  days.forEach(function(d,idx){if(d.hd)return;var c=it.custom[idx];if(typeof c==='string'&&c){d.cus=true;d.e=[d.e[0],c];}});
  days.hajj=true;days.madWant=want;days.madGot=pre+post;days.madPre=pre;days.madPost=post;days.i8=i8;days.short=iL>=N-1;days.d13=D[13]||'';days.noDate=!ST.dep;
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
    if(d.hd)return '<div class="it hj'+(today?' today':'')+'" id="it-'+idx+'"><div class="it-d"><b>Day '+(idx+1)+(today?' · today':'')+'</b><small>'+(dt||d.hd+' DH')+'</small></div><div class="it-t" role="button" tabindex="0" aria-label="Day '+(idx+1)+', '+d.hd+' Dhul Hijjah, a day of Hajj — open its steps" onclick="openHajjDay(\''+d.sec+'\')"><span class="it-c">⛺ '+d.hd+' Dhul Hijjah</span><span class="it-tag">Hajj day</span> '+esc(d.e[1])+'</div></div>';
    return '<div class="it'+(today?' today':'')+(d.wada?' wada':'')+'" id="it-'+idx+'"><div class="it-d"><b>Day '+(idx+1)+(today?' · today':'')+'</b><small>'+(dt||d.city)+'</small></div><div class="it-t" role="button" tabindex="0" aria-label="Edit day '+(idx+1)+'" onclick="itEdit('+idx+')"><span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span>'+d.e[0]+' '+(d.cus?esc(d.e[1])+'<span class="cus" title="Edited">✎</span>':linkPlaces(d.e[1]))+(base?ramItinTag(new Date(base.getTime()+idx*86400000)):'')+'</div></div>';}).join('')
    +(ramTrip()?'<div class="note it-ramn" id="itRam">'+mk('moon','mkt')+'Your trip falls in Ramadan. '+RAM_CAV+' <button class="lnk tap44" style="font-size:1em" onclick="ramSheet()">Ramadan guide</button></div>':'')
    +(days.hajj?itinHajjNote(days):'')
    +'<p style="font-size:var(--t-2);color:var(--ink3);margin-top:8px">A suggestion, not a rule — worship comes first; drop ziyarah if you are tired. Tap any day to rewrite it'+(days.hajj?' (the days of Hajj follow the rites guide)':'')+(itinHasCustom()?' (✎ = edited)':'')+'.</p>';
}
/* the Hajj notes under the list: a return date before the 13th, Madinah days that do not fit outside the days of Hajj */
function itinHajjNote(days){var h='';
  if(days.short&&!days.noDate)h+='<div class="note it-warn" id="itWarn">'+mk('alert','mkt')+'Your trip ends before the days of Hajj are over — 13 Dhul Hijjah is '+fmtDate(days.d13,true)+'. <button class="lnk" style="font-size:1em" onclick="hajjFitGo()">Lengthen the trip</button></div>';
  if(days.madGot<days.madWant)h+='<p class="it-note" id="itMadNote">Madinah: '+days.madGot+' of '+days.madWant+' day'+(days.madWant===1?'':'s')+' fit — Madinah days go wholly before the 7th or after the 13th, never into the days of Hajj.</p>';
  /* (G1 review) Madinah-first days that do not all fit before the 7th go after the 13th: say so — it is a second stay and a second train */
  else if(days.madPre&&days.madPost)h+='<p class="it-note" id="itMadNote">Madinah: '+days.madPre+' day'+(days.madPre===1?'':'s')+' before the 8th, '+days.madPost+' after the 13th — two stays, with a second train. Fewer Madinah days keep it to one stay.</p>';
  return h;}
function hajjFitGo(){var w=ST.tripLen;hajjFitTrip();if(ST.tripLen>w){updRetDate();updDaily();updStats();renderItin();renderPrepJumps();updChip();toast('⛺ Trip lengthened to '+ST.tripLen+' days — it now runs past 13 Dhul Hijjah',true);}else toast('Trips here are up to '+TRIP_MAX+' days');vib(8);}
function itEdit(idx){var row=document.getElementById('it-'+idx);if(!row)return;var d=itinDays()[idx];if(!d)return;if(d.hd){openHajjDay(d.sec);return;}var t=row.querySelector('.it-t');if(!t||t.querySelector('textarea'))return;
  t.onclick=null;t.innerHTML='<span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span><textarea class="it-ed" id="itEd-'+idx+'" aria-label="Plan for day '+(idx+1)+'">'+esc(d.e[1])+'</textarea><div class="it-acts"><button class="chip-btn" style="background:var(--act-bg);color:var(--act-ink);border-color:var(--brand)" onclick="itSave('+idx+')">Save</button><button class="chip-btn" onclick="renderItin()">Cancel</button>'+(d.cus?'<button class="chip-btn" onclick="itReset('+idx+')">↺ Reset day</button>':'')+'</div>';
  var ta=document.getElementById('itEd-'+idx);if(ta)ta.focus();}
function itSave(idx){var ta=document.getElementById('itEd-'+idx);if(!ta)return;var v=ta.value.trim(),it=itinST();if(v&&v!==itinDaysDefault(idx))it.custom[idx]=v.slice(0,300);else delete it.custom[idx];saveST();renderItin();renderTodayTop();vib(10);}
function itinDaysDefault(idx){var it=itinST(),keep=it.custom;it.custom={};var d=itinDays()[idx];it.custom=keep;return d?d.e[1]:'';}
function itReset(idx){var it=itinST();delete it.custom[idx];saveST();renderItin();renderTodayTop();}
function shareItin(){var base=ST.dep?new Date(ST.dep+'T00:00:00'):null,it=itinST(),HJ=journey()==='hajj',T=HJ?'Hajj itinerary':'Umrah itinerary';
  var lines=[(ST.name?ST.name+'’s':'Our')+' '+T+(HJ?' '+curHajjYear()+' · '+HAJJ_TYPES[hajjType()].t:'')+' · '+ST.tripLen+' days'+(base?' from '+fmtDate(ST.dep):'')+(it.pace==='family'?' · family pace':'')];
  itinDays().forEach(function(d,idx){var dt=base?new Date(base.getTime()+idx*86400000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})+' · ':'';lines.push('Day '+(idx+1)+' · '+dt+(d.hd?'⛺ '+d.hd+' Dhul Hijjah (Hajj day) — '+d.e[1]:(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+' — '+d.e[0]+' '+d.e[1]));});
  lines.push('via Miqah');shareText(T,lines.join('\n'),APP_URL);}

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
function jumpTo(id,quiet){prepReveal(id);var el=document.getElementById(id);if(!el)return;var off=118,strip=document.getElementById('riteNow');if(strip&&el.closest&&el.closest('#sub-umrah-steps')&&strip.offsetParent)off+=strip.offsetHeight+8;var y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:smooth()});if(!quiet)vib(8);}
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
  places:['places',''],plan:['plan','prep'],quiz:['plan','quiz'],duas:['more','duas'],lost:['home',''],help:['home','']};
function parseGoLink(){var m=/[?&]go=([a-z]+)/.exec(location.search||'');
  if(m&&GO_TARGETS[m[1]])linkGo=m[1];
  if(m){try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}}}

/* P-34 group setup link: #g=<base64 json> carries only trip settings — never progress */
var pendingGroup=null;
function shareSetup(){var H=hiNorm(ST.hotelInfo),f=((ST.itin||{}).first==='madinah'&&hiHas(H.md))||!hiHas(H.mk)?H.md:H.mk,hi=Object.assign({},f,{l:H.l,mk:H.mk,md:H.md}),HJ=journey()==='hajj',J=HJ?'Hajj':'Umrah';
  var g={by:ST.name||'',dep:ST.dep||'',tripLen:ST.tripLen,itin:ST.itin||null,city:ST.city||'Makkah',hotelInfo:hi,hotel:ST.hotel||null,journey:journey(),hajjType:hajjType(),camp:HJ?(ST.camp||null):null};
  var url=APP_URL+'#g='+btoa(encodeURIComponent(JSON.stringify(g)));
  var txt=(ST.name?ST.name+'’s':'Our')+' '+J+' trip setup'+(ST.dep?' — flying '+fmtDate(ST.dep,true):'')+[H.mk.n,H.md.n].filter(Boolean).map(function(x){return ' · '+x;}).join('')+(HJ&&(ST.camp||{}).n?' · Mina camp '+ST.camp.n:'')+'. Open the link on your phone and tap Apply: it sets the dates, itinerary'+(HJ?', Hajj type, camp':'')+' and hotel card in Miqah (free, offline). Your own checklists are untouched.';
  shareText(J+' trip setup',txt,url);}
function groupDecode(code){var out=null;try{var g=JSON.parse(decodeURIComponent(atob(code)));if(g&&typeof g==='object'&&!Array.isArray(g)){out={};['by','dep','tripLen','itin','city','hotelInfo','hotel','journey','hajjType','camp'].forEach(function(k){if(g[k]!==undefined)out[k]=g[k];});}}catch(e){out=null;}return out;}
function parseGroupLink(){var h=location.hash||'';if(h.indexOf('#g=')!==0)return null;var out=groupDecode(h.slice(3));
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  return out;}
/* ── 6.7 (G3 #32) · set up for someone else (a parent): their name, Brother / Sister, larger text on, hotel and companion — then an Essentials Home:
   the status card (with the Hajj-day row and the Arafah card when they apply) and four big tiles, nothing else. Settings switches it off. ── */
var careProf='m',careLg=true;
function careSheet(){var o=document.getElementById('obSheet');if(o&&o.classList.contains('on'))o.classList.remove('on');careProf=ST.profile==='w'?'w':'m';careLg=true;var H=hiOf(hiCity());
  openSheet('<div class="sheet-h">'+mk('heart')+'</div><h3>Setting this up for someone else?</h3><p>Fill in their details. The app then opens on a simpler Home in large text — the status card and four big buttons. You can switch it off in More › Settings.</p>'
    +'<label class="care-l" for="careName">Their name</label><input class="srch" id="careName" value="'+esc(ST.name||'')+'" placeholder="e.g. Ammi, Abbu, Nana" autocomplete="off">'
    +'<div class="setrow"><div><b>They are a…</b></div><div class="segmini" id="careProfSeg"><button data-p="m" aria-pressed="'+(careProf==='m')+'"'+(careProf==='m'?' class="on"':'')+' onclick="careProfPick(\'m\')">Brother</button><button data-p="w" aria-pressed="'+(careProf==='w')+'"'+(careProf==='w'?' class="on"':'')+' onclick="careProfPick(\'w\')">Sister</button></div></div>'
    +'<div class="setrow"><div><b>Larger text</b><small>On by default for them</small></div><button class="sw on" id="careTextSw" role="switch" aria-checked="true" aria-label="Larger text" onclick="careLgTog()"></button></div>'
    +'<label class="care-l" for="careHotel">Their hotel</label><input class="srch" id="careHotel" value="'+esc(H.n||'')+'" placeholder="Hotel name — for the driver card" autocomplete="off">'
    +'<label class="care-l" for="careLead">Companion or group leader — name &amp; phone</label><input class="srch" id="careLead" value="'+esc(H.l||'')+'" placeholder="e.g. Bilal · +966 55 …" inputmode="text" autocomplete="off">'
    +'<button class="btn tall" onclick="careSave()">Save — turn on Essentials Home</button><button class="btn ghost tall" onclick="closeSheet();if(!ST.onboarded)setTimeout(showOnboard,300)">Cancel</button>');}
function careProfPick(v){careProf=v;document.querySelectorAll('#careProfSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-p')===v);b.setAttribute('aria-pressed',b.getAttribute('data-p')===v?'true':'false');});vib(6);}
function careLgTog(){careLg=!careLg;var b=document.getElementById('careTextSw');if(b){b.classList.toggle('on',careLg);b.setAttribute('aria-checked',careLg?'true':'false');}}
function careSave(){var v=function(id){return ((document.getElementById(id)||{}).value||'').trim().slice(0,200);},nm=v('careName'),ht=v('careHotel'),ld=v('careLead');
  if(nm)ST.name=nm;ST.profAsked=true;ST.essentials=true;var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';
  if(ht)hiSet(hiCity(),{n:ht});if(ld){var H=hiNorm(ST.hotelInfo);H.l=ld;ST.hotelInfo=H;}saveST();
  setProfile(careProf);setText(careLg?'lg':'');loadHotelInfo();updHotelLbl();renderCntHd();updEssSw();closeSheet();
  if(!ST.onboarded)setTimeout(showOnboard,300);else homeRefresh();
  toast('Essentials Home is on'+(nm?' for '+nm:'')+' — switch it off in More › Settings',true);}
function togEssentials(){ST.essentials=!ST.essentials;saveST();updEssSw();homeRefresh();vib(8);}
function updEssSw(){var b=document.getElementById('essSw');if(b){b.classList.toggle('on',!!ST.essentials);b.setAttribute('aria-checked',ST.essentials?'true':'false');}}
function essTilesHTML(){var T=[['refresh','Count tawaf / sa’i',"goTab('umrah','count')",''],['hands','Duas',"goTab('more','duas')",''],['sos','I’m lost','showLost()',' ess-lost'],['dome','Prayer times',"goTab('daily','today','ptSec')",'']];
  return '<div class="ess-grid" id="essGrid">'+T.map(function(t){return '<button class="ess-t'+t[3]+'" onclick="'+t[2]+'">'+mk(t[0])+'<b>'+t[1]+'</b></button>';}).join('')+'</div>';}

/* ── 6.7 (G3 #33) · "Ready for no signal": read-only checks, each failing one with its fix — nothing is sent anywhere ── */
var READY_CORE=['index.html','app.js','data.js','manifest.json'];
function readyChecks(){var R=[],H=hiNorm(ST.hotelInfo),HJ=journey()==='hajj';
  var sa=false;try{sa=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(e){}
  R.push({id:'inst',t:'Installed on the home screen',ok:sa,fix:sa?'':(deferPrompt?['Install','installApp()']:['How to install',"location.href='install'"]),why:'Opens like an app and keeps working without signal'});
  R.push({id:'cache',t:'The app is saved for offline use',ok:null,fix:['Reload once online','location.reload()'],why:'The pages, rites, duas and places'});
  R.push({id:'fonts',t:'Fonts saved',ok:null,fix:['Reload once online','location.reload()'],why:'Manrope and the Arabic script survive an update in Mina'});
  var span=readyPTSpan();R.push({id:'pt',t:'Prayer times saved through your return',ok:span?span.miss===0:null,fix:span&&span.miss?['Save them now','readyPTFetch()']:'',why:span?(span.miss?span.miss+' of '+span.days+' days not saved yet — computed times (±2 min) fill the gap':'Umm al-Qura times for every day of the trip'):'Set your departure date to check'});
  pickArVoice();R.push({id:'voice',t:'Arabic voice for the duas',ok:!!AR_VOICE,fix:AR_VOICE?'':['Open Dua audio',"closeSheet();goTab('more','settings')"],why:AR_VOICE?'Installed on this phone':'Install an Arabic voice in the phone’s text-to-speech settings'});
  var hot=hiHas(H.mk)||hiHas(H.md),comp=!!H.l,camp=!HJ||campHas();
  R.push({id:'cards',t:(HJ?'Hotel, companion and camp':'Hotel and companion')+' saved',ok:hot&&comp&&camp,fix:(hot&&comp&&camp)?'':['Fill them in',(hot&&comp)?"closeSheet();goCampEdit()":"closeSheet();goTab('plan','prep','hotelCard')"],why:'The driver and I’m-lost cards read them offline'+(!hot||!comp||!camp?' — missing: '+[hot?'':'hotel',comp?'':'companion',camp?'':'camp'].filter(Boolean).join(', '):'')});
  R.push({id:'persist',t:'Storage kept by the phone',ok:null,fix:['Ask the phone','readyPersist()'],why:'So the phone does not clear your data when space runs low'});
  var bk=ST.bkAt||0,fresh=bk&&Date.now()-bk<14*864e5;R.push({id:'backup',t:'Backup in the last 14 days',ok:!!fresh,fix:fresh?'':['Export a backup','exportData()'],why:bk?'Last backup '+new Date(bk).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'No backup yet from this phone'});
  return R;}
/* the trip's days from today (or the departure) to the last day, both prayer cities */
function readyPTSpan(){var sp=icsTripSpan();if(!sp)return null;var c=ptCache(),miss=0,cities=['Makkah','Madinah'];
  for(var i=0;i<sp.days;i++){var d=new Date(sp.from.getFullYear(),sp.from.getMonth(),sp.from.getDate()+i),city=itinCityOn(d)||ST.city||'Makkah';if(!c[ptKeyOf(city,d.getFullYear(),d.getMonth(),d.getDate())])miss++;}
  return {days:sp.days,miss:miss};}
function itinCityOn(d){if(!ST.dep)return null;var i=Math.round((d-new Date(ST.dep+'T00:00:00'))/864e5);try{var r=itinDays()[i];return r&&r.city==='Madinah'?'Madinah':r?'Makkah':null;}catch(e){return null;}}
function readyPTFetch(){var sp=icsTripSpan();if(!sp){toast('Set your departure date first');return;}if(navigator.onLine===false){toast('Needs signal — try again on Wi-Fi');return;}var seen={};
  for(var i=0;i<sp.days;i+=7){var d=new Date(sp.from.getFullYear(),sp.from.getMonth(),sp.from.getDate()+i);['Makkah','Madinah'].forEach(function(c){var k=c+d.getFullYear()+d.getMonth();if(!seen[k]){seen[k]=1;ptFetchMonths(c,d.getFullYear(),d.getMonth());}});}
  toast('Saving the prayer times — check again in a moment',true);setTimeout(function(){if(document.querySelector('#gSheet.on #readyList'))readySheet();},4000);}
function readyPersist(){try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().then(function(g){toast(g?'The phone will keep the app’s data':'The phone decides this itself — installing the app usually helps');readySheet();});else toast('This browser does not offer it — installing the app helps');}catch(e){}}
function readyRowHTML(r){var st=r.ok===true?'ok':r.ok===false?'bad':'wait';return '<div class="rdy-r '+st+'" id="rdy-'+r.id+'"><span class="rdy-i" aria-hidden="true">'+mk(r.ok===true?'check':r.ok===false?'alert':'clock')+'</span><div class="rdy-t"><b>'+r.t+'</b><small>'+(r.ok===true?'Ready · ':r.ok===false?'Not yet · ':'Checking… · ')+r.why+'</small></div>'+(r.ok!==true&&r.fix?'<button class="chip-btn" onclick="'+r.fix[1]+'">'+r.fix[0]+'</button>':'')+'</div>';}
function readySheet(){var R=readyChecks();openSheet('<div class="sheet-h">'+mk('antenna')+'</div><h3>Ready for no signal?</h3><p>Before you fly, check the app will work in airplane mode — in the Haram, in Mina, on the bus.</p><div class="rdy" id="readyList">'+R.map(readyRowHTML).join('')+'</div><button class="btn ghost tall" onclick="closeSheet()">Close</button>');
  readyAsync(R);}
function readySet(R,id,ok,why){var r=R.filter(function(x){return x.id===id;})[0];if(!r)return;r.ok=ok;if(why)r.why=why;if(ok)r.fix='';var e=document.getElementById('rdy-'+id);if(e)e.outerHTML=readyRowHTML(r);}
function readyAsync(R){var hasC=typeof caches!=='undefined'&&caches&&caches.match;
  if(hasC){Promise.all(READY_CORE.map(function(f){return caches.match(new URL(f,location.href).href).then(function(x){return !!x;}).catch(function(){return false;});})).then(function(a){var n=a.filter(Boolean).length;readySet(R,'cache',n===a.length,n===a.length?'The pages, rites, duas and places':n+' of '+a.length+' files saved — open the app once with signal');});
    caches.keys().then(function(ks){var fk=ks.filter(function(k){return k==='miqah-fonts';});if(!fk.length)return 0;return caches.open(fk[0]).then(function(c){return c.keys().then(function(x){var u=x.map(function(q){return String(q.url||'').toLowerCase();}),a=u.some(function(s){return /gstatic/.test(s)&&/\/manrope\//.test(s);}),b=u.some(function(s){return /gstatic/.test(s)&&/\/scheherazadenew\//.test(s);});return a&&b?2:a||b||u.length?1:0;});});}).then(function(n){readySet(R,'fonts',n===2,n===2?'Manrope and the Arabic script survive an update in Mina':n?'Not yet · open a dua once with signal so the Arabic font is saved':'Open the app once with signal to save them');}).catch(function(){readySet(R,'fonts',false,'Could not check on this browser');});}
  else{readySet(R,'cache',false,'This browser cannot save the app — open it from the website and install it');readySet(R,'fonts',false,'This browser cannot save fonts offline');}
  try{if(navigator.storage&&navigator.storage.persisted)navigator.storage.persisted().then(function(p){readySet(R,'persist',!!p,p?'The phone will not clear it when space runs low':'The phone may clear it when space runs low');});else readySet(R,'persist',false,'This browser does not say — installing the app helps');}catch(e){readySet(R,'persist',false,'This browser does not say');}}

/* ── 6.7 (G3 #30) · join the group from inside the installed app: on iPhone a home-screen app keeps its storage apart from Safari, so the leader's
   WhatsApp link must be pasted here. The "#g=…" part is cut out of whatever was pasted and handed to the same confirm sheet. ── */
function pasteGroupSheet(){var cb=!!(navigator.clipboard&&navigator.clipboard.readText);
  openSheet('<div class="sheet-h">'+mk('link')+'</div><h3>Paste the leader’s link</h3><p>Copy the trip-setup link your group leader shared (WhatsApp, SMS, email) and paste it here. The dates, itinerary, prayer city and hotel card — and for a Hajj group the journey, Hajj type and camp — are copied. Your checklists stay as they are.</p><textarea class="srch" id="gLinkIn" rows="3" placeholder="https://…#g=…" aria-label="The group leader’s link" style="resize:vertical;min-height:88px"></textarea><p class="ob-err" id="gLinkErr" role="alert" hidden></p>'
    +(cb?'<button class="btn ghost tall" onclick="pasteGroupClip()">'+mk('clip','mkt')+'Paste from clipboard</button>':'')+'<button class="btn tall" onclick="pasteGroupGo()">Check the link</button><button class="btn ghost tall" onclick="closeSheet();if(!ST.onboarded)setTimeout(showOnboard,300)">Cancel</button>');
  var o=document.getElementById('obSheet');if(o&&o.classList.contains('on'))o.classList.remove('on');}
function pasteGroupClip(){try{navigator.clipboard.readText().then(function(t){var i=document.getElementById('gLinkIn');if(i){i.value=t||'';pasteGroupGo();}}).catch(function(){groupLinkErr('The phone did not allow reading the clipboard — long-press the box and choose Paste.');});}catch(e){groupLinkErr('Long-press the box and choose Paste.');}}
function groupLinkErr(t){var e=document.getElementById('gLinkErr');if(e){e.textContent=t;e.hidden=!t;}}
function groupFromText(t){var m=/#g=([A-Za-z0-9+\/=_%-]+)/.exec(String(t||''));return m?groupDecode(decodeURIComponent(m[1]).replace(/-/g,'+').replace(/_/g,'/')):null;}
function pasteGroupGo(){var t=(document.getElementById('gLinkIn')||{}).value||'',g=groupFromText(t);
  if(!g){groupLinkErr(/#g=/.test(t)?'That link looks cut short — copy the whole link again.':'This is not a trip-setup link — it should contain “#g=”. Ask your group leader to share it again.');return;}
  pendingGroup=g;closeSheet();setTimeout(function(){showGroupSheet(g);},250);}
function showGroupSheet(g){var parts=[],lead=g.journey==='hajj'?mk('tent','mkt'):'';if(g.journey==='hajj')parts.push('Hajj'+(HAJJ_TYPES[g.hajjType]?' ('+HAJJ_TYPES[g.hajjType].t+')':''));if(g.dep)parts.push('Departure '+fmtDate(g.dep,true));if(g.tripLen)parts.push(g.tripLen+' days');if(g.itin&&typeof g.itin==='object')parts.push((g.itin.first==='madinah'?'Madinah':'Makkah')+' first'+(g.itin.mad!==undefined?' ('+g.itin.mad+' Madinah day'+(g.itin.mad===1?'':'s')+')':''));if(g.hotelInfo&&typeof g.hotelInfo==='object'){var gh=hiNorm(g.hotelInfo);[gh.mk.n,gh.md.n].filter(Boolean).forEach(function(x){parts.push(x);});}
  openSheet('<div class="sheet-h">👥</div><h3>Apply '+(g.by?esc(g.by)+'’s':'the group’s')+' trip setup?</h3><p><b>'+lead+esc(parts.join(' · ')||'Shared trip settings')+'</b></p><p style="font-size:var(--t-2)">'+(g.journey==='hajj'?'The dates, itinerary, prayer city and hotel card — and the journey (Hajj), Hajj type and camp — are copied.':'Only the dates, itinerary, prayer city and hotel card are copied.')+' Your checklists, counters, quiz and journal stay exactly as they are.</p><button class="btn" onclick="applyGroup()">✅ Apply</button><button class="btn ghost" onclick="declineGroup()">Not now</button>');}
function applyGroup(){var g=pendingGroup;if(!g)return;var cl=function(v,a,b,d){v=parseInt(v);return isNaN(v)?d:Math.max(a,Math.min(b,v));};
  if(typeof g.dep==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(g.dep)&&!isNaN(new Date(g.dep+'T00:00:00')))ST.dep=g.dep;
  if(g.tripLen!==undefined){ST.tripLen=cl(g.tripLen,3,TRIP_MAX,ST.tripLen);if(ST.day>ST.tripLen)ST.day=ST.tripLen;}
  /* J-04: the group link carries the journey, the Hajj type and the Mina camp card (settings, never progress) */
  if(g.journey==='hajj'||g.journey==='umrah'){ST.journey=g.journey;ST.journeyAsked=true;delete ST.hajjAsk;}
  if(typeof g.hajjType==='string'&&HAJJ_TYPES[g.hajjType])ST.hajjType=g.hajjType;
  if(g.camp&&typeof g.camp==='object'){var cp={n:'',m:'',l:'',p:''};['n','m','l','p'].forEach(function(k){if(typeof g.camp[k]==='string')cp[k]=g.camp[k].slice(0,200);});ST.camp=cp;}
  if(g.itin&&typeof g.itin==='object'){var cus={};if(g.itin.custom&&typeof g.itin.custom==='object')Object.keys(g.itin.custom).forEach(function(k){if(/^\d+$/.test(k)&&typeof g.itin.custom[k]==='string')cus[k]=g.itin.custom[k].slice(0,300);});ST.itin={first:g.itin.first==='madinah'?'madinah':'makkah',mad:cl(g.itin.mad,0,20,3),pace:g.itin.pace==='family'?'family':'',custom:cus};}
  if(g.city==='Makkah'||g.city==='Madinah')ST.city=g.city;
  if(g.hotelInfo&&typeof g.hotelInfo==='object')ST.hotelInfo=hiNorm(g.hotelInfo);
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
  view.querySelectorAll('.seg button[data-sub]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-sub')===sub);});
  if(!silent){vib(8);var top=view.querySelector('.seg');if(top){var y=top.getBoundingClientRect().top+window.scrollY-(62);if(window.scrollY>y)window.scrollTo({top:y,behavior:smooth()});}}
  if(tab==='daily'&&sub==='stats'){updStats();}
  if(tab==='daily'&&sub==='tools'){updToolsOrder();}
  if(tab==='more'&&sub==='duas'&&(journey()==='hajj'||ramTrip()))renderDuas();
  qbAutoStop();
  if(tab==='plan'&&sub==='learn'){renderFC();}
  if(tab==='umrah'&&sub==='count'){cntNavAt=Date.now();updCntLayout();}
  if(tab==='umrah'&&sub==='count'&&!silent&&cntStarted()){updCntLayout();setTimeout(function(){jumpTo(cntActive()+'Card',true);},40);}
  if(tab==='more'&&!silent&&ST.subAuto&&ST.subAuto.more){delete ST.subAuto.more;saveST();}
  if(tab==='umrah'&&!silent){if(ST.subAuto&&ST.subAuto.umrah){delete ST.subAuto.umrah;saveST();}if(sub==='steps')focusRites(true);}
}
function applySubs(){
  ST.sub=ST.sub||{};
  /* U-18: until the pilgrim taps the Umrah segment themselves, the tab opens on the rites before departure and on the counters once flying */
  ST.subAuto=ST.subAuto||{};var dd=depDays();
  if(!ST.sub.umrah||ST.subAuto.umrah){ST.sub.umrah=(dd!==null&&dd<=0)?'count':'steps';ST.subAuto.umrah=true;}
  /* G4 #39: More follows the stage too (Duas on the trip, After once it is over) until its segment is tapped; 6.8 turns this on once for existing installs */
  if(!ST.moreAuto68){ST.moreAuto68=true;ST.subAuto.more=true;}
  if(!ST.sub.more||ST.subAuto.more){ST.sub.more=moreAutoSub();ST.subAuto.more=true;}
  ['plan','umrah','daily','more'].forEach(function(t){
    var v=document.getElementById('view-'+t),first=v&&v.querySelector('.seg button[data-sub]');
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
  /* inside an in-app browser the warning is said before setup, not behind it: what is set up here stays in this in-app browser */
  var ib=document.getElementById('obIab');if(ib){var inb=inAppBrowser();ib.hidden=!inb;ib.innerHTML=inb?'<span class="iab-t">'+mk('alert','mkt')+'<span>Open this page in Safari or Chrome first — this in-app browser keeps your data apart and cannot install the app.</span></span><span class="iab-a"><button class="chip-btn" onclick="iabCopy()">Copy link</button></span>':'';}
  if(step==='hajj')obHajj();}
/* ✕ on first launch: the journey stays 'umrah' and Home offers a one-line "Going for Hajj?" chip until a journey is chosen.
   (review) ✕ on the Hajj screen reached from the journey question, with no date set, goes back to the journey it came from — a mis-tap on Hajj is not a decision */
function closeOnboard(){var o=document.getElementById('obSheet');if(!o)return;o.classList.remove('on');var s2=document.getElementById('obStep2');
  if(s2&&!s2.hidden&&obPrevJ&&obPrevJ!=='hajj'&&journey()==='hajj'&&!ST.dep){ST.journey=obPrevJ;if(!ST.onboarded)ST.journeyAsked=false;saveST();applyJourney();journeyRefresh();}
  obPrevJ=null;if(!ST.onboarded){ST.onboarded=true;if(!ST.journeyAsked)ST.hajjAsk=true;saveST();homeRefresh();}}
function chooseJourney(j){var was=journey();obPrevJ=was;ST.journey=j==='hajj'?'hajj':'umrah';ST.journeyAsked=true;delete ST.hajjAsk;saveST();vib(8);
  applyJourney();if(journey()!==was)journeyRefresh();
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
    +'<div class="setrow"><div><b>Have you already done your Umrah of Tamattu’?</b><small>Tawaf, sa’i and the hair cut on arrival</small></div><div class="segmini" id="obUmSeg"><button data-u="1" aria-pressed="'+!!ST.umrahs+'"'+(ST.umrahs?' class="on"':'')+' onclick="obUmPick(1)">Yes</button><button data-u="0" aria-pressed="'+!ST.umrahs+'"'+(ST.umrahs?'':' class="on"')+' onclick="obUmPick(0)">No</button></div></div>'
    +'<button class="btn" onclick="obHajjHereApply()">Continue →</button></div>'
    +'<div id="obHMain"><button class="btn" onclick="obHajjApply()">Continue →</button><button class="btn ghost" onclick="obHajjHere()">'+markify('🕋 I’m already in Saudi Arabia')+'</button></div>'
    +'<button class="lnk" style="display:block;margin:10px auto 0;font-size:var(--t-3)" onclick="obHajjSkip()">Skip, I don’t know yet</button>'
    +(obPrevJ&&obPrevJ!=='hajj'?'<button class="lnk" style="display:block;margin:8px auto 0;font-size:var(--t-3)" onclick="chooseJourney(\'umrah\')">← Umrah instead</button>':'');
  s2.innerHTML=h;document.getElementById('obStep0').hidden=true;document.getElementById('obStep1').hidden=true;s2.hidden=false;applyProfile();obUm=ST.umrahs?1:0;
  var di=document.getElementById('obHDep');if(di&&!ST.dep)di.min=today;}
var obUm=0;
function obUmPick(v){obUm=v?1:0;document.querySelectorAll('#obUmSeg button').forEach(function(b){var on=(b.getAttribute('data-u')==='1')===!!obUm;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});vib(6);}
function obHajjDate(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return;var y=hajjYearFor(v),t=document.getElementById('obHTitle'),hh=document.getElementById('obHHint');if(t)t.textContent='Hajj '+y+' — when do you fly?';if(hh)hh.textContent=hajjHint(y);}
/* (review) "already there": the flight-date field and its hint make way for the trip-day stepper, and the title says so */
function obHajjHere(){var e=document.getElementById('obHere'),m=document.getElementById('obHMain');if(e)e.hidden=false;if(m)m.hidden=true;var di=document.getElementById('obHDep'),hh=document.getElementById('obHHint'),t=document.getElementById('obHTitle');if(di){di.removeAttribute('min');di.hidden=true;}if(hh)hh.hidden=true;var hi=document.getElementById('obHIntro');if(hi)hi.textContent='The day counter, prayer times and Part 2 start from where you are; the days of Hajj follow the Hijri calendar.';if(t)t.textContent='Hajj '+hajjYearFor('')+' — you are already there';vib(6);}
function obStepper(id,lbl,val,min,max,hint){return '<div class="setrow"><div><b>'+lbl+'</b>'+(hint?'<small>'+hint+'</small>':'')+'</div><div class="stepper"><button class="chip-btn" type="button" onclick="obStepBy(\''+id+'\',-1)" aria-label="One less">−</button><input type="number" class="numin" id="'+id+'" value="'+val+'" min="'+min+'" max="'+max+'" aria-label="'+lbl+'"><button class="chip-btn" type="button" onclick="obStepBy(\''+id+'\',1)" aria-label="One more">+</button></div></div>';}
function obStepBy(id,d){var e=document.getElementById(id);if(!e)return;var v=(parseInt(e.value)||parseInt(e.min)||1)+d;v=Math.max(parseInt(e.min)||1,Math.min(parseInt(e.max)||TRIP_MAX,v));e.value=v;vib(6);}
function obHajjName(){var nm=((document.getElementById('obHName')||{}).value||'').trim();if(nm)ST.name=nm;var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';}
function obHajjApply(){obHajjName();var v=(document.getElementById('obHDep')||{}).value||'',first=false;
  if(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!ST.dep&&v<isoOf(new Date())){toast('That date has passed — pick your departure date, or tap “I’m already in Saudi Arabia”');var he=document.getElementById('obHDep');if(he)he.focus();return;}
  if(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(new Date(v+'T00:00:00'))){first=!ST.dep;ST.dep=v;ST.there=false;}
  var dd=depDays();ST.stage=(dd!==null&&dd<=0)?'now':'plan';obStage=ST.stage;
  obHajjFinish(ST.stage==='now'?['umrah','count',null]:['plan','prep',ST.dep?'tlCard':'cdCard']);if(first)sortedAsk();}
function obHajjHereApply(){obHajjName();
  var day=parseInt((document.getElementById('obHDay')||{}).value)||1;day=Math.max(1,Math.min(TRIP_MAX,day));
  var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(day-1));ST.dep=isoOf(d);ST.day=day;ST.dayAuto=true;if(ST.tripLen<day)ST.tripLen=Math.min(TRIP_MAX,day+5);
  ST.stage='now';obStage='now';ST.there=true;
  if(obUm&&!ST.umrahs)recordEstUmrah();
  obHajjFinish(['umrah',ST.umrahs?'steps':'count',null]);}
function obHajjSkip(){obHajjName();ST.stage=ST.stage||'plan';obStage='plan';obHajjFinish(['plan','prep','cdCard']);}
function obHajjFinish(go){ST.onboarded=true;ST.profAsked=true;saveST();hajjFitTrip();askPersist();
  document.getElementById('obSheet').classList.remove('on');
  var t=document.getElementById('tripLen');if(t)t.value=ST.tripLen;
  applyJourney();journeyRefresh();renderPost();updCountdown();updDaily();updStats();renderItin();renderTimeline();renderTodayTop();updToolsOrder();renderDuaSec();
  goTab(go[0],go[1],go[2]);
  toast((ST.name?'Welcome, '+ST.name:'Welcome')+' — labbayk Allahumma Hajjan ⛺');vib([30,40,60]);}
/* ── 6.7 (G3 #26) · the last 48 hours: "Before you leave home" replaces the dated buckets (0–2 days out), the paperwork folds into one line,
   and the landing time gives the ihram window (the existing guidance: ihram before boarding or at the stopover, the intention when the crew announces the miqat,
   about 30–45 min before Jeddah) plus a one-event .ics alarm 60 min before landing. Madinah-first trips get the Abyar Ali line instead. ── */
function leaveRows(){var L=ST.leave||{},h=hiOf(),mad=itinST().first==='madinah',R=[];
  if(!mad)R.push(ST.profile==='w'?{id:'bag',t:'Ready for ihram before boarding',s:'Your ordinary modest clothing — nothing to change at the carousel',on:!!L.bag}:{id:'bag',t:'Ihram kit in your hand luggage, not the suitcase',s:'You change before boarding or at the stopover — not at the carousel',on:!!L.bag});
  R.push({id:'hotel',t:'Hotel card filled in',s:'The driver and I’m-lost cards work offline',on:!!(h.n&&(h.a||h.p)),go:"goTab('plan','prep','hotelCard')"});
  R.push({id:'docs',t:'Document copies in the vault or printed',s:'Passport, visa or permit, bookings',on:!!L.docs});
  R.push({id:'charge',t:'Phone and power bank charged',s:'Save the hotel and group numbers before you fly',on:!!L.charge});
  return R;}
function hsLeaveGo(){var e=document.getElementById('hLeave');if(!e){goTab('plan','prep','tlCard');return;}var y=e.getBoundingClientRect().top+window.scrollY-70;window.scrollTo({top:y,behavior:smooth()});}
function leaveTog(id){ST.leave=ST.leave||{};ST.leave[id]=!ST.leave[id];saveST();vib(10);homeRefreshKeep();}
function landWin(){var t=ST.landT;if(!/^\d\d:\d\d$/.test(t||''))return null;var m=ptMin(t);return {a:minHM((m-45+1440)%1440),b:minHM((m-30+1440)%1440),al:minHM((m-60+1440)%1440)};}
function setLand(v){ST.landT=/^\d\d:\d\d$/.test(v||'')?v:'';saveST();homeRefreshKeep();}
function setLandNext(){ST.landNext=!ST.landNext;saveST();homeRefreshKeep();}
function leaveHTML(){var R=leaveRows(),mad=itinST().first==='madinah',W=landWin(),srt=sortedIds().some(function(id){return !planChk[id];}),h='';
  h+='<div class="card card-pad hnext hleave" id="hLeave"><h3>'+mk('bag','mkt')+'Before you leave home</h3>';
  R.forEach(function(r){h+='<div id="lv-'+r.id+'" class="tli'+(r.on?' done':'')+'" role="'+(r.go?'button':'checkbox')+'" tabindex="0"'+(r.go?'':' aria-checked="'+(r.on?'true':'false')+'"')+' onclick="'+(r.go?r.go:'leaveTog(\''+r.id+'\')')+'"><span class="tick"></span><div class="tli-t">'+r.t+'<small>'+r.s+'</small></div>'+(r.go&&!r.on?'<span class="tli-when soon">Add →</span>':'')+'</div>';});
  if(srt)h+='<button class="lnk hn-srt" onclick="sortedSheet()">Booked and done? Tick the travel basics</button>';
  if(mad)h+='<p class="hl-mad">'+mk('dome','mkt')+'<span>Madinah first? No ihram on this flight — the miqat on your way to Makkah is Dhul-Hulayfah (Abyar Ali), and you enter ihram there. Flying into Jeddah first? Ask your group leader whether to enter ihram on the plane.</span></p>';
  else{h+='<div class="hl-land"><label for="landT">Landing in Jeddah at <small>(Saudi time)</small></label><div class="hl-row"><input type="time" id="landT" value="'+esc(ST.landT||'')+'" onchange="setLand(this.value)"><button id="landNx" class="chip-btn'+(ST.landNext?' on':'')+'" role="switch" aria-checked="'+(ST.landNext?'true':'false')+'" onclick="setLandNext()">Lands the next day</button></div>';
    h+=W?'<p class="hl-win" id="landWin">'+(ST.profile==='w'?'Be ready for ihram before boarding (or at the stopover).':'Ihram clothes on before boarding (or at the stopover).')+' Make the intention when the crew announces the miqat — about 30–45 min before Jeddah, so around <b>'+W.a+'–'+W.b+'</b>. The crew’s announcement is what counts.</p><button class="btn ghost tall" onclick="landICS()">'+mk('bell','mkt')+'Add an alarm — '+W.al+', an hour before landing</button>'
      :'<p class="hl-win">Add your landing time and the app works out when the miqat is likely to be announced.</p>';
    if(W&&ptMin(ST.landT)<360&&!ST.landNext)h+='<p class="hl-win" id="landHint">Landing after midnight? Tick ‘Lands the next day’ so the alarm falls on the right date.</p>';
    h+='</div>';}
  return h+'</div>';}
function landICS(){var W=landWin();if(!W||!ST.dep)return;var d=new Date(ST.dep+'T00:00:00');if(ST.landNext)d.setDate(d.getDate()+1);var y=d.getFullYear(),m=d.getMonth(),dd=d.getDate(),t=ST.landT;
  /* G3 review: a landing that is already past (Riyadh time, UTC+3) is not saved — after midnight it belongs to the next day */
  if(Date.UTC(y,m,dd,0,ptMin(t))-3*3600000<Date.now()){toast('That time has passed — tick ‘Lands the next day’ if you land after midnight');return;}
  var stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  var ev=['BEGIN:VEVENT','UID:us-landing-'+icsDT(y,m,dd,t)+'@umrah-strivers','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Riyadh:'+icsDT(y,m,dd,t),'DTEND;TZID=Asia/Riyadh:'+icsDT(y,m,dd,minHM(Math.min(1439,ptMin(t)+30))),'SUMMARY:Landing in Jeddah — ihram and the intention','DESCRIPTION:'+icsEsc((ST.profile==='w'?'Be ready for ihram before boarding (or at the stopover).':'Ihram clothes on before boarding (or at the stopover).')+' Make the intention when the crew announces the miqat — about 30–45 min before Jeddah. The crew’s announcement is what counts. · Miqah'),'BEGIN:VALARM','TRIGGER:-PT60M','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(ST.profile==='w'?'Landing in an hour — listen for the miqat announcement':'Landing in an hour — ihram on, listen for the miqat announcement'),'END:VALARM','END:VEVENT'].join('\r\n');
  shareICS(icsWrap([ev]),'landing-ihram-alarm.ics','Landing alarm','⏰ Alarm saved — open the .ics file to add it to your calendar');}
/* 6.7 (G3 #25): mark an Umrah done after the fact — it is said plainly that an estimated Umrah has no timeline or keepsake, and the mark can be removed under My journeys */
function estUmrahSheet(){openSheet('<div class="sheet-h">'+mk('kaaba')+'</div><h3>Already did your Umrah?</h3><p>Mark it done and the app moves on to your daily worship — the counter opens on Nafl.</p><p style="font-size:var(--t-2)">It is listed as “recorded on arrival”: the app did not see it, so it has no timeline, and its keepsake card shows the date but no times. You can remove the mark under More › After › My journeys.</p><button class="btn tall" onclick="estUmrahYes()">Yes — mark it done</button><button class="btn ghost tall" onclick="closeSheet()">Not yet</button>');}
function estUmrahYes(){closeSheet();recordEstUmrah();updRites();updStats();homeRefresh();toast('🕋 Umrah marked done — taqabbal Allah',true);vib([30,40,60]);}
function estRemoveSheet(n){openSheet('<div class="sheet-h">'+mk('kaaba')+'</div><h3>Remove this mark?</h3><p>The Umrah you marked as done on arrival is taken off the record and your Umrah count goes down by one. Nothing else changes.</p><button class="btn ghost tall" onclick="estRemove('+n+')">Remove the mark</button><button class="btn tall" onclick="closeSheet()">Keep it</button>');}
function estRemove(n){var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}var i=-1;hist.forEach(function(u,j){if(u.n===n&&u.est)i=j;});closeSheet();if(i<0)return;
  hist.splice(i,1);hist.forEach(function(u){if(u.n>n)u.n--;});localStorage.setItem('us-umrahlog',JSON.stringify(hist));ST.umrahs=Math.max(0,(ST.umrahs||0)-1);saveST();
  renderUmrahs();renderJourneys();updRites();updStats();homeRefresh();toast('Mark removed');vib(10);}
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
    h='<div class="sheet-h">'+mk('plane')+'</div><h3>When do you fly?</h3><p>Your departure date drives the countdown, the dated to-do timeline and the itinerary. You can change it any time in Plan › Prepare.</p><input type="date" class="srch" id="obDep" min="'+isoOf(new Date())+'" value="'+(ST.dep||'')+'" aria-label="Departure date">';
  }else if(st==='now'){
    var cur=ST.city||'Makkah';
    h='<div class="sheet-h">'+mk('kaaba')+'</div><h3>Where are you today?</h3><p>So the prayer times, the day counter and the trip heatmap start in the right place.</p><div class="pills sm" style="justify-content:center;margin-bottom:10px"><button class="pill'+(cur==='Makkah'?' on':'')+'" id="obMk" onclick="obCity(\'Makkah\')">'+markify('🕋 Makkah')+'</button><button class="pill'+(cur==='Madinah'?' on':'')+'" id="obMd" onclick="obCity(\'Madinah\')">'+markify('🕌 Madinah')+'</button></div>'+obStepper('obDay','Which day of your trip?',ST.day||1,1,TRIP_MAX,'Day 1 = the day you arrived')+obStepper('obLen','How many days in total?',ST.tripLen||10,3,TRIP_MAX,'Both cities together')
      /* 6.7 (G3 #25): the person who installs the app in the hotel has often done the Umrah already — ask, as the Hajj already-there screen does */
      +'<div class="setrow"><div><b>Have you already done your Umrah?</b><small>Tawaf, sa’i and the hair cut</small></div><div class="segmini" id="obUmSeg"><button data-u="1" aria-pressed="'+!!ST.umrahs+'"'+(ST.umrahs?' class="on"':'')+' onclick="obUmPick(1)">Yes</button><button data-u="0" aria-pressed="'+!ST.umrahs+'"'+(ST.umrahs?'':' class="on"')+' onclick="obUmPick(0)">No</button></div></div>';
    obUm=ST.umrahs?1:0;
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
  if(st==='plan'||st==='soon'){var v=(document.getElementById('obDep')||{}).value;if(v&&v<isoOf(new Date())){toast('That date has passed — pick your departure date');var oe=document.getElementById('obDep');if(oe)oe.focus();return;}if(v)setDep(v);}
  if(st==='now'){
    var len=parseInt((document.getElementById('obLen')||{}).value)||ST.tripLen||10;len=Math.max(3,Math.min(TRIP_MAX,len));
    var day=parseInt((document.getElementById('obDay')||{}).value)||1;day=Math.max(1,Math.min(len,day));
    ST.tripLen=len;ST.day=day;ST.dayAuto=true;ST.there=true;var t=document.getElementById('tripLen');if(t)t.value=len;
    var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(day-1));ST.dep=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
    saveST();if(obUm&&!ST.umrahs)recordEstUmrah();updDaily();updStats();renderItin();updCountdown();
  }
  if(st==='before'){var p=parseInt((document.getElementById('obPrev')||{}).value);ST.umrahsPrev=Math.max(0,Math.min(99,isNaN(p)?0:p));saveST();updRites();updStats();}
  obFinish();
}
function obFinish(){
  var st=obStage,nm=ST.name;askPersist();
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
  var HJc=journey()==='hajj',CL=HJc?['Hajj Knowledge Circuit — foundations,','ihram & the talbiyah, tawaf & sa’i, Arafah,','Muzdalifah & the 10th, the days of tashreeq,','Hajj fiqh, history, virtues and Madinah.']:['Umrah Knowledge Circuit —','foundations, ihram, tawaf & sa’i, history,','virtues, Madinah and fiqh essentials.'];
  x.fillText('has completed the full '+qzVisible().length+'-level',540,700);
  CL.forEach(function(l,i){x.fillText(l,540,750+i*50);});
  x.font='500 28px '+KB;x.fillStyle=K.gold3;
  x.fillText('“Whoever travels a path seeking knowledge,',540,960);
  x.fillText('Allah makes easy for him a path to Paradise.”',540,1005);
  kFoot(x,'— Muslim 2699',540,1050);
  x.font='26px '+KB;x.fillStyle=K.ihram2;
  x.fillText(new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,1170);
  x.fillText('umrah-strivers.vercel.app',540,1215);
  exportImage(c,(HJc?'hajj':'umrah')+'-knowledge-certificate.png','Certificate of Knowledge');
}

/* ════════════════════════ FLASHCARDS ════════════════════════ */
/* P-16: string keys — 'l#q#' quiz cards (front = question, back = options + explanation), 'know3' / 'qa1' / 'hist0' / 'virt0' / 'mad0' / 'sis0' / 'scam2' read cards.
   6.4: the deck follows the journey and the Hajj type (FC_ORDER, forMe on every level and question), and fcDue() lets the phase decide the focus:
   quiz mistakes first, then the phase boost (FC_PHASE), then everything else in deck order. */
var FC_DECK=[],FC_MAP={},fcQueue=[],fcIdx=0,fcST={},fcFilt='due',fcRq={},fcSes=null,fcDrag=null;
try{fcST=JSON.parse(localStorage.getItem('us-cards')||'{}')||{};}catch(e){fcST={};}
function fcToday(){return Math.floor(Date.now()/86400000);}
function fcSave(){try{localStorage.setItem('us-cards',JSON.stringify(fcST));}catch(e){}}
function fcStarted(){return Object.keys(fcST).length>0;}
/* read-card sources: array, label, Learn container */
var FC_READ={know:[KNOW,'Know before you go','knowContainer'],qa:[FIQHQA,'Fiqh Q&A','qaContainer'],hist:[HISTORY,'History','histContainer'],virt:[VIRTUES,'Virtues','virtContainer'],mad:[MADINAH,'Madinah','madContainer'],sis:[SISTERS,'For sisters','sisContainer'],scam:[SCAMS,'Scams','scamContainer']};
/* deck order per journey: ['q',level key] or ['r',read set,from,to] — the Hajj deck drills Hajj first, then the shared reading */
var FC_ORDER={umrah:[['q','u-found'],['r','know'],['q','u-ihram'],['q','u-rites'],['r','qa'],['q','u-fiqh'],['r','hist'],['q','u-hist'],['r','virt'],['q','u-virt'],['r','mad'],['q','u-mad'],['r','sis'],['r','scam']],
  hajj:[['q','h-found'],['r','know',8,11],['q','h-ihram'],['r','know',0,2],['q','u-rites'],['q','h-arafah'],['q','h-nahr'],['r','qa',11,14],['q','h-tashreeq'],['q','h-fiqh'],['r','qa',2,10],['r','know',4,7],['r','hist'],['q','u-hist'],['r','virt'],['q','u-virt'],['r','mad'],['q','u-mad'],['r','sis'],['r','scam']]};
/* F2 topic filters: a card's groups (level keys and read keys); "The five days" is Hajj-only */
var FC_FILT=[['due','Due'],['mist','My mistakes'],['days','The five days','hajj'],['ihram','Ihram'],['tawaf','Tawaf & sa’i'],['fiqh','Fiqh'],['sis','Sisters'],['heart','History & virtues']];
function fcIn(k,a,b){var m=/^([a-z]+)(\d+)$/.exec(k);return !!m&&+m[2]>=a&&+m[2]<=b?m[1]:'';}
function fcGroups(c){var g=[],lk=c.lk||'',k=c.k,HJ=journey()==='hajj';
  if(/^h-(arafah|nahr|tashreeq)$/.test(lk)||k==='know9'||fcIn(k,11,14)==='qa')g.push('days');
  if(lk==='u-ihram'||lk==='h-ihram'||fcIn(k,0,2)==='know')g.push('ihram');
  if(lk==='u-rites'||fcIn(k,2,7)==='qa')g.push('tawaf');
  if(HJ?(lk==='h-found'||lk==='h-fiqh'||fcIn(k,11,14)==='qa'):(lk==='u-fiqh'||fcIn(k,0,10)==='qa'))g.push('fiqh');
  if(/^sis\d/.test(k)||k==='qa4'||k==='qa13')g.push('sis');
  if(/^(hist|virt|mad)\d/.test(k)||/^u-(hist|virt|mad)$/.test(lk))g.push('heart');
  return g;}
function buildDeck(){
  FC_DECK=[];FC_MAP={};var HJ=journey()==='hajj',T1=HJ&&hajjType()==='tamattu';
  function add(c){if(FC_MAP[c.k])return;c.g=fcGroups(c);FC_DECK.push(c);FC_MAP[c.k]=c;}
  /* keys keep the global index so a graded card survives journey gating (gated rows simply drop out of the deck) */
  function read(pre,a,b){var R=FC_READ[pre];R[0].forEach(function(it,i){if(a!==undefined&&(i<a||i>b))return;if(!forMe(it))return;add({k:pre+i,f:it.t,b:it.b,src:'Read · '+R[1],type:'read',rk:pre});});}
  /* F9 / Tamattu’: a question kept for some types names them; the Tamattu’ Umrah questions are framed as Part 1 */
  function quiz(key){var lv=qzKeyIdx(key),L=QUIZ_LEVELS[lv];if(!L||!forMe(L))return;var t=qzLvName(lv,1);
    L.qs.forEach(function(q,i){if(!forMe(q))return;var p1=T1&&!!q.p1;add({k:'l'+lv+'q'+i,f:q.q,q:q,lv:lv,lk:key,p1:p1,src:(p1?'Part 1 · your Umrah · ':(q.ht&&HJ?qzHtTag(q).replace(/ only$/,'')+' · ':''))+'Quiz · '+t,type:'quiz'});});}
  (FC_ORDER[journey()]||FC_ORDER.umrah).forEach(function(o){if(o[0]==='q')quiz(o[1]);else read(o[1],o[2],o[3]);});
  qzSeq().forEach(function(i){quiz(QUIZ_LEVELS[i].key);});
  try{fcST=JSON.parse(localStorage.getItem('us-cards')||'{}')||{};}catch(e){fcST={};}
  /* migrate v1 numeric keys (old deck order: HISTORY, VIRTUES, MADINAH, FIQHQA) once */
  var mig=false,old=[['hist',HISTORY.length],['virt',VIRTUES.length],['mad',MADINAH.length],['qa',FIQHQA.length]];
  Object.keys(fcST).forEach(function(k){if(!/^\d+$/.test(k))return;mig=true;var i=+k,st=fcST[k];delete fcST[k];for(var j=0;j<old.length;j++){if(i<old[j][1]){var nk=old[j][0]+i;if(fcST[nk]===undefined)fcST[nk]=st;break;}i-=old[j][1];}});
  if(mig)fcSave();
  if(!FC_FILT.some(function(f){return f[0]===fcFilt&&(!f[2]||f[2]===journey());}))fcFilt='due';
}
/* F1: the phase decides the focus — departure near, on the trip before the 8th, each day of Hajj, after it. Umrah keeps its ≤28-day boost (deck order inside it). */
function fcPhase(){var d=depDays(),HJ=journey()==='hajj';
  if(!HJ)return (d!==null&&d<=28)?{b:['u-ihram','u-rites','know'],lbl:'Departure is near — ihram & tawaf cards first.',flat:true}:{b:[],lbl:''};
  var hd=hajjDay(),T=hajjType()==='tamattu',p1=T&&!hajjPart2Active();
  if(hd===8||hd===9)return {b:['h-arafah','h-nahr'],lbl:'Today: the '+hd+'th — '+(hd===8?'Mina & Arafah':'Arafah')+' cards first.'};
  if(hd===10)return {b:['h-nahr','h-tashreeq','qa12'],lbl:'Today: the 10th — the Day of Nahr cards first.'};
  if(typeof hd==='number')return {b:['h-tashreeq','qa14','qa12','h-fiqh'],lbl:'Today: the '+hd+'th — tashreeq & farewell cards first.'};
  if(hd==='post')return {b:['u-virt','u-mad'],lbl:'After your Hajj — virtues & Madinah first.'};
  if(onTrip())return {b:(p1?['u-rites']:[]).concat(['h-arafah','h-nahr','know9','qa11','qa13']),lbl:p1?'In Makkah — your Umrah first, then Arafah & the 10th.':'Before the 8th — Arafah & the 10th cards first.'};
  if(d!==null&&d<=28&&d>0)return {b:['h-found','h-ihram','know8','know9','know0','know1'].concat(T?['u-rites']:[]),lbl:'Departure is near — foundations & ihram first.'};
  return {b:[],lbl:''};}
function fcRank(c,P){var r=P.b.indexOf(c.lk||'');if(r<0)r=P.b.indexOf(c.k);if(r<0&&P.flat&&c.rk==='know')r=P.b.indexOf('know');return r<0?-1:(P.flat?0:r);}
function fcDue(){
  var t=fcToday(),P=fcPhase(),due=[],idx={};
  FC_DECK.forEach(function(c){var st=fcST[c.k];if(!st||st.due<=t){idx[c.k]=due.length;due.push(c.k);}});
  function key(k){var c=FC_MAP[k];if(c.type==='quiz'&&qzST.wrong[k])return [0,0];var r=fcRank(c,P);return r>-1?[1,r]:[2,0];}
  due.sort(function(a,b){var x=key(a),y=key(b);return x[0]-y[0]||x[1]-y[1]||idx[a]-idx[b];});
  return due;
}
/* the cards a filter draws from: Due = fcDue(); My mistakes = every visible quiz mistake; a topic = its due cards, in fcDue order */
function fcFiltCards(f){if(f==='mist')return FC_DECK.filter(function(c){return c.type==='quiz'&&qzST.wrong[c.k];}).map(function(c){return c.k;});
  var due=fcDue();return f==='due'?due:due.filter(function(k){return FC_MAP[k].g.indexOf(f)>-1;});}
function fcAll(f){return FC_DECK.filter(function(c){return f==='due'||f==='mist'?(f==='due'||(c.type==='quiz'&&qzST.wrong[c.k])):c.g.indexOf(f)>-1;});}
/* F3: New (never graded) · Learning (box 1–2) · Mastered (box 3) */
function fcMastery(f){var o={n:0,l:0,m:0,t:0};fcAll(f).forEach(function(c){var st=fcST[c.k],b=st?st.box||0:0;o.t++;if(b>=3)o.m++;else if(b>=1)o.l++;else o.n++;});return o;}
function fcBack(c){
  var h;
  if(c.type!=='quiz')h='<div class="fc-e">'+c.b+'</div>';
  else{var q=c.q,ans=qzAns(q);h='<div class="fc-q">'+q.q+'</div><div class="fc-opts">'+qzOpts(q).map(function(o,i){return '<div class="'+(i===ans?'ok':'')+'">'+(i===ans?'✓ ':'')+o+'</div>';}).join('')+'</div><div class="fc-e">'+q.e+'</div>';}
  /* F7: the source chip, and a way back into the app — the day in the rites guide, or the topic in Learn */
  var go='',st=c.type==='quiz'?(QUIZ_LEVELS[c.lv].study||{}):null;
  if(st&&/^sec-hd/.test(st.id||''))go='<button class="fc-go" onclick="event.stopPropagation();openHajjDay(\''+st.id.slice(4)+'\')">'+mk('tent','mkt')+'Open the day</button>';
  else if(st)go='<button class="fc-go" onclick="event.stopPropagation();qzStudyGo('+c.lv+')">'+mk('book','mkt')+'Open in Learn</button>';
  else go='<button class="fc-go" onclick="event.stopPropagation();fcOpenLearn(\''+c.k+'\')">'+mk('book','mkt')+'Open in Learn</button>';
  return h+'<div class="fc-foot">'+(c.type==='quiz'?qzSrc(c.q):'<span class="src-chip">'+esc(c.src.replace(/^Read · /,''))+'</span>')+go+'</div>';
}
function fcOpenLearn(k){var R=FC_READ[(/^[a-z]+/.exec(k)||[''])[0]];if(!R)return;goTab('plan','learn');var a=document.querySelector('#'+R[2]+' .acc[data-k="'+k+'"]');if(!a)return;
  if(!a.classList.contains('open')){a.classList.add('open');var h=a.querySelector('.acc-h');if(h)h.setAttribute('aria-expanded','true');}
  requestAnimationFrame(function(){setTimeout(function(){var y=a.getBoundingClientRect().top+window.scrollY-118;window.scrollTo({top:Math.max(0,y),behavior:smooth()});},30);});}
function fcFiltHTML(){var HJ=journey()==='hajj';
  return '<div class="fc-filt" role="group" aria-label="Choose cards">'+FC_FILT.filter(function(f){return !f[2]||f[2]===journey();}).map(function(f){var n=fcFiltCards(f[0]).length,on=f[0]===fcFilt;
    return '<button class="pill'+(on?' on':'')+'" aria-pressed="'+(on?'true':'false')+'" onclick="fcSetFilt(\''+f[0]+'\')">'+f[1]+' <span class="fc-n">'+n+'</span></button>';}).join('')+'</div>';}
function fcSetFilt(f){fcFilt=f;renderFC();vib(6);var b=document.querySelector('#fcArea .fc-filt .pill.on');if(b)try{b.focus({preventScroll:true});}catch(e){}}
function fcMastHTML(f){var M=fcMastery(f),t=M.t||1;
  return '<div class="fc-mast"><div class="fc-mbar" role="img" aria-label="'+M.n+' new, '+M.l+' learning, '+M.m+' mastered"><i class="m" style="width:'+(M.m/t*100).toFixed(1)+'%"></i><i class="l" style="width:'+(M.l/t*100).toFixed(1)+'%"></i></div>'
    +'<div class="fc-mrow"><span><i class="dot n"></i>New '+M.n+'</span><span><i class="dot l"></i>Learning '+M.l+'</span><span><i class="dot m"></i>Mastered '+M.m+'</span></div></div>';}
function fcHeadUpd(){var M=fcMastery('due'),el=document.getElementById('fcMastT');if(el)el.textContent=M.m+' of '+M.t+' mastered';
  var sub=document.getElementById('fcSub');if(sub)sub.textContent=journey()==='hajj'?'A few minutes a day — spaced repetition over the Hajj levels first, then everything above and your quiz mistakes, paced to your departure and the days of Hajj.':'A few minutes a day — spaced repetition over everything above and your quiz mistakes, paced to your departure.';}
function renderFC(){
  var area=document.getElementById('fcArea');if(!area)return;
  var due=fcDue(),started=fcStarted(),lbl=document.getElementById('fcDueLbl');
  if(lbl)lbl.textContent=due.length?(started?due.length+' due today.':due.length+' cards ready.'):'';
  fcHeadUpd();
  if(fcSes&&fcSes.done){area.innerHTML=fcSummaryHTML();sepFix();return;}
  if(!fcQueue.length){
    var list=fcFiltCards(fcFilt),P=fcPhase(),wc=qzWrongCount(),n=Math.min(started?12:5,list.length),h=fcFiltHTML()+fcMastHTML(fcFilt);
    if(!list.length)h+='<div class="note" style="margin:0">'+(fcFilt==='due'?'✅ Cards caught up — back tomorrow.':fcFilt==='mist'?'No quiz mistakes to drill — mashallah.':'Nothing due in this topic today — pick another, or come back tomorrow.')+'</div>';
    else{h+='<button class="btn gold fc-start" onclick="startFC()">🃏 '+(started?'Review next '+n+' ('+list.length+(fcFilt==='mist'?' to drill':' due')+')':'Start with '+n+' cards')+'</button>';
      var why=fcFilt!=='due'?'':(wc&&due.length&&FC_MAP[due[0]].type==='quiz'&&qzST.wrong[due[0]])?'Your quiz mistakes come first.':P.lbl;
      if(why)h+='<p class="fc-why">'+why+'</p>';}
    area.innerHTML=h;return;
  }
  var k=fcQueue[fcIdx],c=FC_MAP[k];if(!c){fcEnd();return;}
  var wrong=c.type==='quiz'&&!!qzST.wrong[k],rm=RM&&RM.matches;
  area.innerHTML='<div class="fc-prog">Card '+(fcIdx+1)+' / '+fcQueue.length+(fcRq[k]===fcIdx?' · once more':'')+'</div>'
   +'<div class="fc-wrap'+(rm?' rm':'')+'" id="fcWrap"><div class="fc" id="fcFlip" role="button" tabindex="0" aria-label="Reveal the answer" onclick="fcFlip()"><div class="fc-in">'
   +'<div class="fc-face fc-front"><span class="fc-src'+(wrong?' wrong':'')+'">'+(wrong?'🔁 From your quiz · '+c.src.replace(/^.*Quiz · /,''):c.src)+'</span><div class="t">'+c.f+'</div><div class="hint">Tap to reveal · then grade yourself</div></div>'
   +'<div class="fc-face fc-back">'+fcBack(c)+'<span class="fc-showq" role="button" tabindex="0" onclick="event.stopPropagation();fcUnflip()">'+mk('chevl','mkt')+'Show question</span></div>'
   +'</div></div>'
   +'<div class="fc-acts"><button onclick="fcGrade(false)">↺ Again</button><button class="good" onclick="fcGrade(true)">✓ Got it</button></div>'
   +'<p class="fc-keys">'+(rm?'':'<span>Swipe right for Got it, left for Again</span>')+'<span class="kb">'+(rm?'':' · ')+'Keys: ← or 1 Again · → or 2 Got it · Esc ends</span></p></div>'
   +'<button class="fc-end" onclick="fcEnd()">✕ End session</button>';
  fcSwipeBind();
}
function fcFlip(){if(fcDrag&&fcDrag.moved)return;var w=document.getElementById('fcWrap');if(w&&!w.classList.contains('flip')){w.classList.add('flip');vib(6);var f=document.getElementById('fcFlip');if(f)f.setAttribute('aria-label','Answer shown');}}
function fcUnflip(){var w=document.getElementById('fcWrap');if(w)w.classList.remove('flip');}
function fcEnd(){if(fcSes&&fcSes.n&&!fcSes.done){fcSes.done=true;fcQueue=[];fcIdx=0;renderFC();return;}fcQueue=[];fcIdx=0;fcSes=null;renderFC();}
function startFC(){var L=fcFiltCards(fcFilt);fcQueue=L.slice(0,fcStarted()?12:5);fcIdx=0;fcRq={};fcSes={n:0,good:0,again:0,m0:fcMastery('due').m,f:fcFilt};renderFC();
  var f=document.getElementById('fcFlip');if(f&&document.documentElement.classList.contains('kbd'))try{f.focus({preventScroll:true});}catch(e){}}
function fcGrade(ok){
  var k=fcQueue[fcIdx];if(!k)return;var rep=fcRq[k]===fcIdx;
  /* F6: "Again" sets box 1 (tomorrow) and also re-queues the card once at the end of this session — a learning step that does not move its box again */
  if(!rep){var st=fcST[k]||{box:0},box=ok?Math.min(3,(st.box||0)+1):1,gap=box===1?1:box===2?3:7;fcST[k]={box:box,due:fcToday()+gap};fcSave();
    if(fcSes){fcSes.n++;if(ok)fcSes.good++;else fcSes.again++;}
    if(!ok&&fcRq[k]===undefined){fcRq[k]=fcQueue.length;fcQueue.push(k);}}
  vib(ok?20:[40,30,40]);
  fcIdx++;
  if(fcIdx>=fcQueue.length){fcQueue=[];fcIdx=0;if(fcSes)fcSes.done=true;}
  renderFC();renderReady();
  var kb=document.documentElement.classList.contains('kbd'),f=fcQueue.length?document.getElementById('fcFlip'):document.querySelector('#fcArea .fc-sum .btn');
  if(f&&kb)try{f.focus({preventScroll:true});}catch(e){}
}
/* F8: the end-of-session card — what you did, what moved to Mastered, and the next batch */
function fcSummaryHTML(){var S=fcSes,m1=fcMastery('due').m,dm=m1-S.m0,rem=fcFiltCards(S.f).length,n=Math.min(12,rem);
  return '<div class="fc-sum" role="status"><b class="fc-sum-h">Session done</b><p class="fc-sum-n"><span class="ty-nw">'+S.n+' reviewed</span> <span class="ty-nw"><span class="ty-dot">· </span>'+S.good+' got it</span> <span class="ty-nw"><span class="ty-dot">· </span>'+S.again+' again</span></p>'
    +'<p class="fc-sum-m">Mastered: '+m1+(dm>0?' <span class="up">(+'+dm+' today)</span>':'')+' of '+fcMastery('due').t+'</p>'
    +(rem?'<button class="btn gold" onclick="fcNext()">🃏 Next '+n+'</button>':'<p class="fc-sum-m">All caught up until tomorrow.</p>')+'<button class="btn ghost" onclick="fcSes=null;renderFC()">Done</button></div>';}
function fcNext(){fcSes=null;startFC();}
/* F4: swipe the revealed card — right = Got it, left = Again (80px, or a quick flick); the card tilts up to 6° and its edge glows.
   prefers-reduced-motion: no drag at all — the buttons (and keys) grade. */
function fcSwipeBind(){var el=document.getElementById('fcFlip'),w=document.getElementById('fcWrap');if(!el||!w||(RM&&RM.matches))return;
  el.addEventListener('pointerdown',function(e){if(!w.classList.contains('flip')||e.button>0)return;if(e.target.closest('button,a,.fc-showq,summary'))return;fcDrag={x:e.clientX,y:e.clientY,t:Date.now(),dx:0,moved:false,id:e.pointerId};});
  el.addEventListener('pointermove',function(e){if(!fcDrag||e.pointerId!==fcDrag.id)return;var dx=e.clientX-fcDrag.x,dy=e.clientY-fcDrag.y;
    if(!fcDrag.moved){if(Math.abs(dx)<8||Math.abs(dy)>Math.abs(dx)){if(Math.abs(dy)>12)fcDrag=null;return;}fcDrag.moved=true;try{el.setPointerCapture(e.pointerId);}catch(x){}}
    fcDrag.dx=dx;var r=Math.max(-6,Math.min(6,dx/18));el.style.transform='translateX('+dx+'px) rotate('+r+'deg)';el.classList.toggle('sw-good',dx>30);el.classList.toggle('sw-again',dx<-30);});
  function up(e){if(!fcDrag||e.pointerId!==fcDrag.id)return;var d=fcDrag,v=Math.abs(d.dx)/Math.max(1,Date.now()-d.t);el.style.transform='';el.classList.remove('sw-good','sw-again');
    if(d.moved&&(Math.abs(d.dx)>=80||(v>.6&&Math.abs(d.dx)>30))){vib(20);setTimeout(function(){fcDrag=null;},0);fcGrade(d.dx>0);return;}
    setTimeout(function(){fcDrag=null;},0);}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);}
function fcKeys(e){var w=document.getElementById('fcWrap');if(!w||!w.offsetParent)return false;var k=e.key,onCtl=e.target&&e.target.closest&&e.target.closest('button,a,summary,[role="button"],[role="checkbox"]');
  if(k==='Escape'){fcEnd();return true;}
  if(!w.classList.contains('flip')){if((k===' '||k==='Enter')&&!onCtl){fcFlip();return true;}return false;}
  if(k==='ArrowLeft'||k==='1'){fcGrade(false);return true;}
  if(k==='ArrowRight'||k==='2'){fcGrade(true);return true;}
  return false;}

/* ════════════════════════ KIDS CORNER (quiz + story time) ════════════════════════ */
var kqI=0,kqScore=0,kqLock=false,kqList=[],kqVoice=false;
/* 6.4: the pool follows the journey (KIDSQ.filter(forMe)); a round is 8 questions — on a Hajj journey at least 5 of them about the Hajj — and the best score is kept per journey */
function kidsKey(){return journey()==='hajj'?'us-kids-hajj':'us-kids';}
function kidsN(){return Math.min(8,KIDSQ.filter(forMe).length);}
function kidsBestLbl(){var kb=document.getElementById('kidsBest'),v=null;try{v=localStorage.getItem(kidsKey());}catch(e){}if(kb)kb.textContent=v?v+'/'+kidsN():'—';
  var ks=document.getElementById('kidsQn');if(ks)ks.textContent=kidsN();
  var ss=document.getElementById('storySub'),ns=KIDS_STORIES.filter(forMe).length;if(ss)ss.textContent=ns+' read-aloud stories about the rites and the sites — ages 6–10';}
function kidsRound(){var P=KIDSQ.filter(forMe),n=Math.min(8,P.length);if(journey()!=='hajj')return qzShuffle(P.slice()).slice(0,n);
  var H=qzShuffle(P.filter(function(q){return q.j==='hajj';})),O=qzShuffle(P.filter(function(q){return q.j!=='hajj';})),nh=Math.min(H.length,5+Math.floor(Math.random()*4)),no=Math.min(O.length,n-nh);
  if(nh+no<n)nh=Math.min(H.length,n-no);return qzShuffle(H.slice(0,nh).concat(O.slice(0,no)));}
/* P-28: shuffled copy, inline in the collapsed card, ✕ Done restores the Start row */
function startKids(){kqList=kidsRound();kqI=0;kqScore=0;kqVoice=false;var a=document.getElementById('kidsArea');if(a)a.hidden=false;var sb=document.getElementById('kidsStart');if(sb)sb.hidden=true;renderKQ();jumpTo('kidsCard',true);}
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
  document.getElementById('kqFb').innerHTML='<div class="qz-x">'+(ok?mk('starf','mkt')+'Yes! ':mk('heart','mkt')+'Almost! ')+q.e+(q.src?' '+qzSrc(q):'')+'</div><button class="btn" onclick="nextKQ()">'+(kqI<kqList.length-1?'Next →':'See my stars!')+'</button>';
  if(kqVoice)speakEn((ok?'Yes! ':'Almost! ')+q.e);
}
function nextKQ(){
  if(kqI<kqList.length-1){kqI++;renderKQ();return;}
  var stars=Math.max(1,Math.round(kqScore/kqList.length*5));
  var best=0;try{best=+(localStorage.getItem(kidsKey())||0);if(kqScore>best){best=kqScore;localStorage.setItem(kidsKey(),String(best));}}catch(e){}
  document.getElementById('kidsArea').innerHTML='<div class="qz-final"><div class="kq-stars" role="img" aria-label="'+stars+' star'+(stars===1?'':'s')+'">'+new Array(stars+1).join(mk('starf'))+'</div><p style="font-size:1em"><b>'+kqScore+' / '+kqList.length+'</b> — '+(kqScore===kqList.length?(journey()==='hajj'?'Mashallah, a little hajji in training!':'Mashallah, a little hafiz of Umrah!'):'Great job — play again and get all the stars!')+'</p><button class="btn gold" onclick="startKids()">↺ Play again</button><button class="btn ghost" onclick="kidsDone()">✕ Done</button></div>';
  kidsBestLbl();
  vib([50,50,50,50,120]);if(kqScore===kqList.length)confetti(120);
}
/* P-37: story time — read-aloud stories under the kids quiz; openStory() is the target of the rite-step chips */
function renderStories(){var a=document.getElementById('storyList');if(!a)return;
  a.innerHTML=KIDS_STORIES.filter(forMe).map(function(st){return '<div class="acc story" id="st-'+st.id+'"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+st.emoji+' '+st.title+' <span class="acc-c">▶</span></div><div class="acc-b"><p>'+st.text+'</p><div class="story-when">'+mk('clock','mkt')+st.when+'</div><div class="story-acts"><button class="say" data-text="'+esc(st.title+'. '+st.text)+'" data-lang="en" data-rate=".9" onclick="speakBtn(this)" aria-label="Read the story aloud">🔊 Read aloud</button><span class="src">'+st.src+'</span></div></div></div>';}).join('');}
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
/* 6.5 (G1 #4): the walkthrough's list follows the phase — Part 1 (riteList) until Part 2 is live, then the days of Hajj (hajjList), opening on today's step (hajjNow).
   While Part 2 is live the Umrah end screen and its Record-Umrah button never render; Part 1 behaviour is unchanged. */
function walkHajj(){return hajjPart2Active();}
function walkList(){return walkHajj()?hajjList():riteList();}
function startWalk(){var H=walkHajj(),L=walkList(),nx=nextRite(),i=L.length;if(nx&&(H||!nx.hajj))L.forEach(function(x,k){if(x.st.id===nx.st.id)i=k;});openWalkAt(i);vib(8);}
function openWalkAt(i){walkI=i;walkOpen=true;document.getElementById('walk').classList.add('on');document.body.style.overflow='hidden';renderWalk();}
/* a counter step inside the walkthrough: the count so far and a button into the big counter (it comes back here on exit) */
function walkCntHTML(st,v){var c=v.counter,mode=tmode();
  if(c==='rami'){var d=+st.id.replace(/\D/g,''),r=(ST.rami||{})[d]||{},js=ramiJams(d),dn=js.filter(function(j){return (r[j]||0)>=7;}).length;
    return '<div class="wk-cnt"><b>'+dn+' / '+js.length+'</b><span>'+(js.length===1?'jamarah':'jamarat')+' done'+(r.del?' · delegated':'')+'</span><button class="btn" onclick="walkRami('+d+')">⛶ Open the rami counter</button></div>';}
  if(c==='ifadah'||c==='wada'){var mine=mode===c;return '<div class="wk-cnt"><b>'+(mine?ST.tawaf:0)+' / 7</b><span>rounds counted'+(mine&&ST.tawaf>=7?' — complete':'')+'</span><button class="btn" onclick="walkTawaf(\''+c+'\')">⛶ Open counter</button></div>';}
  if(st.id==='h10sai'){var ms=!!(TM[mode].sai&&TM[mode].sai.chk==='h10sai');return '<div class="wk-cnt"><b>'+(ms?ST.sai:0)+' / 7</b><span>laps counted'+(ms&&ST.sai>=7?' — complete':'')+'</span><button class="btn" onclick="walkTawaf(\'ifadah\',\'sai\')">⛶ Open the sa’i counter</button></div>';}
  return '';}
function walkRami(d){ramiForce=true;ramiDay=d;ramiJ=0;renderRami();walkReturn=true;closeWalk(true);enterFocus('rami');}
function walkTawaf(m,k){if(tmodesDue().indexOf(m)<0){closeWalk(true);goHajjCounter(m,k);return;}setTmode(m,true);if(k==='sai')saiGo=true;walkReturn=true;closeWalk(true);enterFocus(k||'tawaf');}
function renderWalk(){
  var H=walkHajj(),L=walkList(),hd=document.getElementById('walkHd'),b=document.getElementById('walkBody'),nb=document.getElementById('walkNext'),bb=document.getElementById('walkBack');if(!b)return;
  if(walkI>L.length)walkI=L.length;
  if(walkI>=L.length&&H){var ok=hajjReady(),ms=hajjMissing();hd.textContent='All '+L.length+' Hajj steps';
    b.innerHTML='<div class="wk-done" id="wkHajjDone"><div class="big">'+mk('tent')+'</div><h3>'+(ok?'Every pillar and duty is ticked':'Not every pillar is ticked yet')+'</h3><p>'+(ok?'May Allah accept it. Record it to keep its timeline and keepsake.':'Still to tick: '+ms.join(' · ')+'.')+'</p>'
      +(ok?'<button class="btn gold" onclick="closeWalk(true);finishHajj()">'+markify('🎉 Record completed Hajj')+'</button>':'<button class="btn" onclick="closeWalk(true);goTab(\'umrah\',\'steps\',\'hajjDone\')">'+markify('⛺ Open Part 2 →')+'</button>')+'<button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';
    nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
  if(walkI>=L.length){hd.textContent='All '+L.length+' steps';
    if(journey()==='hajj'&&hajjType()!=='tamattu'){b.innerHTML='<div class="wk-done"><div class="big">'+mk('heart')+'</div><h3>Part 1 complete — stay in ihram</h3><p>No cutting until after Arafah and the stoning on the 10th. Part 2 continues on 8 Dhul Hijjah.</p><button class="btn gold" onclick="closeWalk(true);setSecOpen(\'hd8\',true);goTab(\'umrah\',\'steps\',\'hajjContainer\')">⛺ Open Part 2</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
    var cut=!!(riteChk.cut||riteChk.cutw);
    if(!cut&&halqUnconfirmed()){b.innerHTML='<div class="wk-done"><div class="big">'+mk('heart')+'</div><h3>Before anything is cut</h3><p>What did you say at the miqat? Tamattu’ cuts now; Qiran / Ifrad stay in ihram until the 10th.</p><button class="btn gold" onclick="closeWalk(true);halqGate(cutId())">🤍 Answer now</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
    b.innerHTML='<div class="wk-done"><div class="big">'+mk('check')+'</div><h3>'+(cut?'Your Umrah is complete':'Every step ticked?')+'</h3><p>'+(cut?'All ihram restrictions are lifted. Record it to keep the timeline and start a fresh checklist for the next one.':'Tick halq / taqsir when the hair is cut — ihram ends only then.')+'</p><button class="btn gold" onclick="finishUmrah()">'+markify('🎉 Record completed Umrah')+'</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';
    nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
  var x=L[walkI],st=x.st,h,on,k;
  if(H){var v=riteStepView(st),D=hajjDates(curHajjYear()),dt=x.ph.hd&&D[x.ph.hd]?D[x.ph.hd]:'',isT=x.ph.hd!==null&&x.ph.hd===hajjDay();on=!!hajjChk[st.id];
    hd.textContent=x.ph.title.split(' — ')[0]+' · step '+x.n+' of '+L.length;
    h='<div class="wk-n'+(on?' on':'')+'">'+(on?'✓ done':mkOr(x.ph.ico,'tent'))+'</div>'+(dt?'<small class="wk-date">'+(isT?'Today · ':'')+fmtDate(dt,true)+(x.ph.night?' · night':'')+'</small>':'')
      +'<h2 class="wk-t">'+v.b+'</h2>'+(v.req?'<span class="req '+v.req+' wk-req">'+v.req+'</span>':'')+'<p class="wk-p">'+v.p+'</p>';
    if(v.why)h+='<div class="wk-why"><small>Why?</small>'+v.why+'</div>';
    if(v.miss)h+='<div class="wk-miss"><button class="xchip" aria-expanded="false" aria-controls="wkMiss" onclick="togOn(\'wkMiss\');this.setAttribute(\'aria-expanded\',document.getElementById(\'wkMiss\').classList.contains(\'on\'))">🆘 Missed it?</button><div class="whyb miss" id="wkMiss"><b>Missed it?</b> '+esc(v.miss)+'</div></div>';
    h+=walkCntHTML(st,v);
    h+=stDuas(v).map(function(d,i){return duaHTML(st,d,i);}).join('');}
  else{on=!!riteChk[st.id];k=st.id==='rounds'?'tawaf':st.id==='laps'?'sai':null;
    hd.textContent='Step '+x.n+' of '+L.length+' · '+x.ph.title.replace(/^Phase \d+ · /,'').split(' — ')[0];
    h='<div class="wk-n'+(on?' on':'')+'">'+(on?'✓ done':mkOr(x.ph.ico,'kaaba'))+'</div><h2 class="wk-t">'+st.b+'</h2><p class="wk-p">'+st.p+'</p>';
    if(st.why)h+='<div class="wk-why"><small>Why?</small>'+st.why+'</div>';
    if(k)h+='<div class="wk-cnt"><b>'+ST[k]+' / 7</b><span>'+(k==='tawaf'?'rounds':'laps')+' counted'+(ST[k]>=7?' — complete':'')+'</span><button class="btn" onclick="walkReturn=true;closeWalk(true);enterFocus(\''+k+'\')">⛶ Open counter</button></div>';
    h+=stDuas(st).map(function(d,i){return duaHTML(st,d,i);}).join('');}
  if(st.kid)h+='<button class="xchip" onclick="closeWalk(true);openStory(\''+st.kid+'\')">🧒 Story for the kids →</button>';
  b.innerHTML=h;b.scrollTop=0;
  nb.hidden=false;nb.textContent=on?'Next →':'✓ Done → Next';bb.hidden=walkI===0;
}
function walkNav(d){var L=walkList();walkI=Math.max(0,Math.min(L.length,walkI+d));renderWalk();vib(6);}
function walkDone(){var H=walkHajj(),L=walkList(),x=L[walkI];if(x){if(H){if(!hajjChk[x.st.id])togHajj(x.st.id,true);}else if(!riteChk[x.st.id])togRite(x.st.id,true);}walkNav(1);}
function closeWalk(quiet){var H=walkHajj(),L=walkList(),x=L[walkI];walkOpen=false;document.getElementById('walk').classList.remove('on');document.body.style.overflow='';
  if(!quiet){if(x)openRiteStep(x.st.id);else if(H)jumpTo('hajjDone',true);else{setSecOpen('ph4',true);jumpTo('riteDone',true);}}}
/* U-14: a printable briefing — rites with duas, the packing list and the emergency numbers */
function buildPrint(){var e=document.getElementById('printSheet');if(!e)return;var H=hiNorm(ST.hotelInfo),hi={l:H.l},n=0,h=printCardsHTML()+'<h1 class="pr-full">Full rites &amp; duas</h1><p class="pr-sub">Miqah · printed '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+(ST.name?' for '+esc(ST.name):'')+' · umrah-strivers.vercel.app</p>';
  RITES.forEach(function(ph){h+='<h2>'+ph.title+'</h2><ol start="'+(n+1)+'">';ph.steps.forEach(function(st){if(!riteVis(st))return;n++;var v=riteStepView(st);h+='<li><b>'+v.b+'</b> — '+v.p+stDuas(v).map(function(d){return '<div class="pr-dua"><span class="ar" lang="ar" dir="rtl">'+d.ar+'</span><i>'+d.tl+'</i><br>'+d.tr+'</div>';}).join('')+'</li>';});h+='</ol>';});
  if(journey()==='hajj')hajjSecs().forEach(function(sc){h+='<h2>'+sc.title+'</h2><ol>';sc.steps.forEach(function(st){if(!forMe(st))return;var v=riteStepView(st);h+='<li><b>'+v.b+'</b> ('+v.req+') — '+v.p+stDuas(v).map(function(d){return '<div class="pr-dua"><span class="ar" lang="ar" dir="rtl">'+d.ar+'</span><i>'+d.tl+'</i><br>'+d.tr+'</div>';}).join('')+'</li>';});h+='</ol>';});
  var pack=PLAN.filter(function(sc){return sc.id==='pack';})[0];if(pack)h+='<h2>Packing</h2><ul class="pr-pack">'+pack.items.filter(forMe).map(function(it){return '<li>'+it.label+'</li>';}).join('')+'</ul>';
  h+='<h2>Emergency &amp; help</h2><p>Police · ambulance · fire <b>911</b> · Health line <b>937</b> · Hajj &amp; Umrah care <b>1966</b> · Tourism <b>930</b>'+['mk','md'].map(function(k){var r=H[k],cn=k==='md'?'Madinah':'Makkah';return (r.n?'<br>Hotel · '+cn+': <b>'+esc(r.n)+'</b>'+(r.a?' · '+esc(r.a):'')+(r.p?' · phone '+esc(r.p):''):'')+(r.m?'<br>Meeting point · '+cn+': <b>'+esc(r.m)+'</b>':'');}).join('')+(hi.l?'<br>Companion / leader: <b>'+esc(hi.l)+'</b>':'')+(function(){var cp=ST.camp||{};return journey()==='hajj'&&campHas(cp)?'<br>Mina camp: <b>'+esc(campChipT(cp)||'—')+'</b>'+(cp.l||cp.p?' · group leader: <b>'+esc([cp.l,cp.p].filter(Boolean).join(' · '))+'</b>':''):'';})()+'</p>';
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
function delKid(ci){var n=kidNames().slice(),gone=n[ci];if(gone&&n.filter(function(q){return q===gone;}).length===1){if(ST.kidInfo)delete ST.kidInfo[gone];var KP=kidPics();if(KP[gone]){delete KP[gone];try{localStorage.setItem('us-kidpics',JSON.stringify(KP));}catch(e){}}}n.splice(ci,1);ST.kidNames=n;saveST();Object.keys(kidsD).forEach(function(k){var D=kidsD[k]||{},nd={};Object.keys(D).forEach(function(c){c=+c;if(c<ci)nd[c]=D[c];else if(c>ci)nd[c-1]=D[c];});kidsD[k]=nd;});save('us-kids-daily',kidsD);renderKidNames();renderKidsDay();}
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
/* ════════════════════════ 6.9 (G5) · THE VERIFIED PACKS ════════════════════════
   RAM_PACK, HEAT_PACK and WAY_PACK (data.js) are the fact-checked packs, verbatim. This block only lays them out: paragraphs, lists, the Arabic line with its
   source, the date each item was checked. Nothing here adds a ruling, a number or a date; the few dates and clock times inside the text come from the app's
   own Hijri table and prayer-time engine. */
function pkOf(P,id){for(var i=0;i<P.length;i++)if(P[i].id===id)return P[i];return null;}
function pkBody(x){var out='',ul='';String(x||'').split('\n').forEach(function(l){var m=/^(- |\d+\. )(.*)$/.exec(l);
    if(m){var t=m[1]==='- '?'ul':'ol';if(ul!==t){if(ul)out+='</'+ul+'>';ul=t;out+='<'+t+' class="pk-l">';}out+='<li>'+esc(m[2])+'</li>';}
    else{if(ul){out+='</'+ul+'>';ul='';}if(l.trim()){var k=/^(Signs|What to do): /.exec(l);out+='<p>'+(k?'<b>'+k[1]+':</b> '+esc(l.slice(k[0].length)):esc(l))+'</p>';}}});
  return out+(ul?'</'+ul+'>':'');}
/* which hadith an Arabic line is (from each item's own note in the pack) */
var PK_AR={'ram-umrah-virtue':'Bukhari 1782','ram-qadr':'Bukhari 2017','ram-last-ten':'Bukhari 2024','ram-fasting':'Bukhari 38','ram-give-iftar':'Tirmidhi 807','jam-aqabah-stance':'Bukhari 1748','jam-dua-spots':'Bukhari 1753','bound-arafah':'Muslim 1218','bound-muzdalifah-mina':'Muslim 1218'};
function pkOn(x){var d=new Date(x.on+'T00:00:00');return 'Checked '+(isNaN(d)?x.on:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}));}
function pkSrc(x){return '<small class="pk-on">'+pkOn(x)+(x.src?' · official pages: '+x.src.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'+(/\/French\//.test(s[1])?' (French PDF)':'');}).join(', ')+' (need signal)':'')+'</small>';}
function pkArHTML(x){if(!x.ar)return '';var s=x.s||PK_AR[x.id]||'';return '<div class="pk-ar"><span class="ar" lang="ar" dir="rtl">'+x.ar+'</span>'+(x.tl?'<span class="tl">'+esc(x.tl)+'</span>':'')+(x.tr?'<span class="tr">'+esc(x.tr)+'</span>':'')+(s?'<span class="src">'+esc(s)+'</span>':'')+'</div>';}
function pkCard(x,txt){return '<div class="pk" id="pk-'+x.id+'"><h4>'+esc(x.t)+'</h4>'+pkArHTML(x)+pkBody(txt||x.x)+pkSrc(x)+corrBtn('pack',x.id)+'</div>';}
function pkAcc(x,open,txt){return '<div class="acc'+(open?' open':'')+'" id="pka-'+x.id+'"><div class="acc-h" role="button" tabindex="0" aria-expanded="'+(open?'true':'false')+'" onclick="accToggle(this)">'+esc(x.t)+' <span class="acc-c">▶</span></div><div class="acc-b">'+pkArHTML(x)+pkBody(txt||x.x)+pkSrc(x)+corrBtn('pack',x.id)+'</div></div>';}
function pkSheet(mark,title,intro,body,openId){openSheet('<div class="sheet-h">'+mk(mark)+'</div><h3>'+title+'</h3>'+(intro?'<p>'+intro+'</p>':'')+'<div class="pk-list">'+body+'</div><button class="btn ghost tall" onclick="closeSheet()">Close</button>');
  if(openId){var e=document.getElementById('pka-'+openId)||document.getElementById('pk-'+openId);if(e)setTimeout(function(){try{e.scrollIntoView({block:'start'});}catch(x){}},90);}}
function ordN(n){var v=n%100;return n+(v>10&&v<14?'th':['th','st','nd','rd','th','th','th','th','th','th'][n%10]);}

/* ── #51 · Ramadan Umrah mode ──
   Everything hangs on the Umm al-Qura calendar the app already uses (Intl, evaluated in Makkah's zone). A fasting day is a day of Ramadan; a Ramadan NIGHT belongs
   to the Hijri day that follows it, so it begins at Maghrib of the evening before — the odd nights are never hard-coded. */
function hijriP(dt){var o={};try{new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric',timeZone:'Asia/Riyadh'}).formatToParts(dt).forEach(function(p){if(p.type==='day')o.d=parseInt(p.value);else if(p.type==='month')o.m=parseInt(p.value);else if(p.type==='year')o.y=parseInt(p.value);});}catch(e){}return o;}
function hijriAt(y,m,d){return hijriP(new Date(Date.UTC(y,m,d,9)));}
function ramDay(y,m,d){var H=hijriAt(y,m,d),N=hijriAt(y,m,d+1);return {fast:H.m===9,d:H.m===9?H.d:0,night:N.m===9?N.d:0,y:H.m===9?H.y:(N.m===9?N.y:0)};}
var ramMemo={k:'',v:false,y:0};
function ramTrip(){if(journey()!=='umrah'||!ST.dep)return false;var k=ST.dep+'|'+ST.tripLen;if(ramMemo.k===k)return ramMemo.v;var b=new Date(ST.dep+'T00:00:00'),v=false,yy=0;
  if(!isNaN(b))for(var i=0;i<ST.tripLen&&!v;i++){var R=ramDay(b.getFullYear(),b.getMonth(),b.getDate()+i);if(R.fast||R.night){v=true;yy=R.y;}}
  ramMemo={k:k,v:v,y:yy};return v;}
function ramYear(){return ramTrip()?ramMemo.y:0;}
/* items tied to the 1448 season (permits, visa dates, named-year figures, that year's programme and temperatures) are shown for a Ramadan 1448 trip only;
   the visa-dates card also leaves once Shawwal 1448 is over (its last date is 30 Shawwal) */
var RAM_1448=['ram-crowds','ram-energy','ram-season-1448','ram-nusuk','ram-itikaf','ram-give-iftar'];
function ramShow(id){if(RAM_1448.indexOf(id)<0)return true;if(ramYear()!==1448)return false;if(id==='ram-season-1448'){var H=hijriP(new Date());return !(H.y>1448||(H.y===1448&&H.m>10));}return true;}
var RAM_CAV='Dates follow the Umm al-Qura calendar; the official start can differ by a day.';
var RAM_GROUPS=[['Your Umrah in Ramadan',['ram-umrah-virtue','ram-fasting','ram-energy']],['Suhoor and iftar',['ram-suhoor','ram-iftar-haram','ram-iftar-dua','ram-give-iftar']],['The nights',['ram-taraweeh','ram-qadr','ram-qadr-dua','ram-last-ten','ram-itikaf','ram-crowds']],['Fasting and travel',['ram-excused','ram-traveller']],['Permits and dates',['ram-nusuk','ram-season-1448']]];
function ramItems(){var L=[];RAM_GROUPS.forEach(function(g){g[1].forEach(function(id){var x=pkOf(RAM_PACK,id);if(x&&ramShow(id))L.push(x);});});return L;}
/* where the pilgrim is in the fasting day, on the prayer city's clock. Fetched Umm al-Qura rows are the timetable; a computed row (±2 min) is said to be computed,
   and the suhoor countdown then ends 5 minutes before the computed Fajr. Never called imsak, never called official. */
function ramNow(){if(!ramTrip()||!onTrip())return null;var n=riyadhNow(),y=n.getFullYear(),m=n.getMonth(),d=n.getDate(),R=ramDay(y,m,d),now=n.getHours()*60+n.getMinutes(),city=ST.city||'Makkah',P=ptFor(city,y,m,d),t2=new Date(y,m,d+1),P2=ptFor(city,t2.getFullYear(),t2.getMonth(),t2.getDate());
  var F=ptMin(P.t.Fajr),M=ptMin(P.t.Maghrib),S={city:city,now:now,dayN:R.d,fajr:cl(P.t.Fajr),magh:cl(P.t.Maghrib),calc:!!P.calc,calc0:!!P.calc,fast:R.fast,sinceM:now-M};
  if(R.fast&&now<F){S.k='suhoor';S.until=F-(P.calc?5:0);S.at=cl(P.t.Fajr);S.tonight=R.d;}
  else if(R.fast&&now<M){S.k='iftar';S.until=M;S.at=cl(P.t.Maghrib);S.tonight=R.night;}
  else if(R.night&&now>=M){S.k='suhoor';S.calc=!!P2.calc;S.until=1440+ptMin(P2.t.Fajr)-(P2.calc?5:0);S.at=cl(P2.t.Fajr);S.tonight=R.night;}
  else if(R.fast){S.k='end';S.tonight=0;}
  else if(R.night){S.k='eve';S.tonight=0;}
  else return null;
  S.left=S.until!==undefined?Math.max(0,S.until-now):0;S.ten=S.tonight>=21;S.odd=S.ten&&S.tonight%2===1;return S;}
function ramHomeHTML(){if(!ramTrip())return '';var S=ramNow();
  if(!S){if(onTrip()||ST.post||depDays()===null||depDays()<0)return '';
    return '<div class="hero hero-o ram" id="ramHome"><div class="hero-t"><div class="k">'+mk('moon','mkt')+'<span>Your trip falls in Ramadan</span></div><span class="hs-u ram-q">“…an Umrah in Ramadan is equal to a Hajj” (Bukhari 1782; Muslim 1256)</span><span class="hs-note">'+RAM_CAV+'</span></div>'+hjdPill('Ramadan guide',ramShow('ram-nusuk')?'Fasting and travel, permits, the last ten nights':'Fasting and travel, the last ten nights','ramSheet()')+'</div>';}
  var num='',u='',note=S.calc?'Calculated on this phone, ±2 min — not an official timetable':'Umm al-Qura timetable · '+S.city;
  if(S.k==='iftar'){num=fmtDiff(S.left);u='until iftar · Maghrib '+(S.calc?'≈ ':'')+S.at+' in '+S.city;}
  else if(S.k==='suhoor'&&S.left<=0){u='Stop eating now · Fajr '+(S.calc?'≈ ':'')+S.at+' in '+S.city;}
  else if(S.k==='suhoor'){num=fmtDiff(S.left);u=S.calc?'to stop eating — 5 minutes before Fajr ≈ '+S.at+' in '+S.city:'until suhoor ends · Fajr '+S.at+' in '+S.city;}
  else if(S.k==='end')u='By the Umm al-Qura calendar this was the last fast of Ramadan — follow the official announcement.';
  else u='By the Umm al-Qura calendar Ramadan begins at sunset tonight — follow the official announcement.';
  var h='<div class="hero hero-o ram" id="ramHome"><div class="hero-t"><div class="k">'+mk('moon','mkt')+'<span>Ramadan'+(S.dayN?' · day '+S.dayN:'')+'</span></div>'+(num?'<span class="hs-n" id="ramLeft">'+num+'</span>':'')+'<span class="hs-u">'+u+'</span>'
    +(S.ten?'<span class="hs-note" id="ramTonight">Tonight: the night of the '+ordN(S.tonight)+(S.odd?' — an odd night of the last ten':' — one of the last ten nights')+'</span>':'')+'<span class="hs-note ram-src">'+note+'.'+(S.ten||!num?' '+RAM_CAV:'')+'</span></div>';
  if(S.ten)h+=hjdPill('The last ten nights',S.tonight===27&&ramShow('ram-crowds')?'The 27th night — arrive long before the prayer':'Laylat al-Qadr and its dua','ramSheet(\''+(S.tonight===27&&ramShow('ram-crowds')?'ram-crowds':'ram-qadr')+'\')');
  return h+hjdPill('Ramadan guide',S.k==='iftar'?'Iftar in the Haram, taraweeh, fasting and travel':'Suhoor, fasting and travel, taraweeh','ramSheet(\''+(S.k==='iftar'?'ram-iftar-haram':'ram-suhoor')+'\')')+'</div>';}
/* Daily › Today: the two times of the fasting day, with their source, and the way into the guide */
function renderRamDay(){var a=document.getElementById('ramDay');if(!a)return;var S=ramNow();if(!S||!S.fast){a.innerHTML=S?'<div class="hpt ramd" id="ramDayCard"><div class="hpt-hd"><div class="hpt-t"><b>'+mk('moon','mkt')+'Ramadan · '+esc(S.city)+'</b><small>'+RAM_CAV+'</small></div><button class="chip-btn" onclick="ramSheet()">Ramadan guide</button></div></div>':'';return;}
  /* calc0 is today's row (S.calc may speak for tomorrow's Fajr after Maghrib) */
  var q=S.calc0?'≈ ':'';
  a.innerHTML='<div class="hpt ramd" id="ramDayCard"><div class="hpt-hd"><div class="hpt-t"><b>'+mk('moon','mkt')+'Ramadan · day '+S.dayN+'</b><small>'+esc(S.city)+' · '+(S.calc0?'calculated on this phone, ±2 min — stop eating a few minutes before Fajr; not an official timetable':'Umm al-Qura timetable')+'</small></div><button class="chip-btn" onclick="ramSheet()">Ramadan guide</button></div>'
    +'<div class="ramd-g"><div class="pt hpt-c"><div class="pn">Suhoor ends · Fajr</div><div class="pv">'+q+S.fajr+'</div></div><div class="pt hpt-c"><div class="pn">Iftar · Maghrib</div><div class="pv">'+q+S.magh+'</div></div></div>'
    +'<div class="ramd-c"><button class="rul-c" onclick="ramSheet(\'ram-traveller\')">Fasting and travel</button><button class="rul-c" onclick="ramSheet(\'ram-iftar-haram\')">Iftar in the Haram</button><button class="rul-c" onclick="ramSheet(\'ram-taraweeh\')">Taraweeh</button>'+(S.ten?'<button class="rul-c" onclick="ramSheet(\'ram-qadr\')">The last ten nights</button>':'')+'</div><p class="hpt-n">'+RAM_CAV+'</p></div>';}
function ramSheet(openId){var h='';RAM_GROUPS.forEach(function(g){var L=g[1].map(function(id){return ramShow(id)?pkOf(RAM_PACK,id):null;}).filter(Boolean);if(!L.length)return;h+='<div class="subt">'+g[0]+'</div>'+L.map(function(x){return pkAcc(x,x.id===openId);}).join('');});
  pkSheet('moon','Umrah in Ramadan',RAM_CAV,h,openId);}
function ramItinTag(dt){if(!ramTrip())return '';var R=ramDay(dt.getFullYear(),dt.getMonth(),dt.getDate());if(!R.fast&&!R.night)return '';
  return '<span class="it-ram">'+mk('moon','mkt')+'<span>'+(R.fast?'Ramadan '+R.d+(R.night?' · taraweeh after Isha':''):'Taraweeh after Isha — the first night of Ramadan')+(R.night>=21?' · tonight: the night of the '+ordN(R.night)+(R.night%2?', an odd night of the last ten':''):'')+'</span></span>';}
function ramTick(){if(!ramTrip()||document.visibilityState==='hidden')return;var e=document.getElementById('ramHome');if(e&&homeOn()&&!e.contains(document.activeElement)){var t=document.createElement('div');t.innerHTML=ramHomeHTML();if(t.firstChild)e.parentNode.replaceChild(t.firstChild,e);else e.remove();}
  if(document.getElementById('ramDayCard'))renderRamDay();}
setInterval(ramTick,30000);
/* Learn: the packs as reading — the Ramadan topics for a Ramadan trip, the heat plan and the routes for Hajj, getting around for everyone */
function pkLearn(){var L=[];L.lead=[];
  if(ramTrip())L.lead.push({t:'🌙 Umrah in Ramadan',b:'<p class="pk-cav">'+RAM_CAV+'</p>'+ramItems().map(function(x){return pkCard(x);}).join('')});
  if(journey()==='hajj')L.push({t:'🌅 Heat plan for Arafah and the Mina days',b:heatList().map(function(x){return pkCard(x,heatTxt(x));}).join('')},
    {t:'🪨 The Jamarat: order, where you aim, the building',b:['jam-order','jam-wall-basin','jam-aqabah-stance','jam-dua-spots','jam-facility','jam-getting-there','jam-history'].map(function(id){return pkCard(pkOf(WAY_PACK,id));}).join('')},
    {t:'⛺ Your Mina camp, and the boundaries of Arafah, Muzdalifah and Mina',b:['camp-card','camp-finding-way','help-numbers','bound-arafah','bound-muzdalifah-mina'].map(function(id){return pkCard(pkOf(WAY_PACK,id));}).join('')});
  L.push({t:'🚄 Transport in detail: trains, buses, taxis'+(journey()==='hajj'?', walking':''),b:goIds().map(function(id){return pkCard(pkOf(WAY_PACK,id));}).join('')});
  return L;}

/* ── #52 · the heat plan (8–13 Dhul Hijjah): static first aid and prevention. No symptom checker, no "you are fine", no verdict from a temperature.
   Call 911 is the first and largest action. ── */
function heatOn(){if(journey()!=='hajj')return 0;var hd=hajjDay();return typeof hd==='number'&&hd>=8&&hd<=13?hd:0;}
var HEAT_ORDER=['heat-stroke','heat-exhaustion','heat-hours','heat-jamarat-slot','heat-hydration','heat-wet-head','heat-ihram-shade','heat-kit','heat-companions','heat-why-1448'];
function heatList(){return HEAT_ORDER.map(function(id){return pkOf(HEAT_PACK,id);}).filter(function(x){return x&&(x.id!=='heat-why-1448'||curHajjYear()===1448);});}
function wdm(iso){var d=new Date(iso+'T00:00:00');return isNaN(d)?iso:d.toLocaleDateString('en-GB',{weekday:'long'})+' '+d.getDate()+' '+d.toLocaleDateString('en-GB',{month:'long'});}
function ampm(hm){var m=ptMin(hm),h=Math.floor(m/60),mm=m%60;return ((h+11)%12+1)+':'+('0'+mm).slice(-2)+(h<12?' am':' pm');}
/* the two dates of 1448 come from the app's Umm al-Qura table (HAJJ_D8), and the Mina midday and sunset from its prayer-time engine for the 11th — the pack's own figures when both agree */
function heatTxt(x){var t=x.x,y=curHajjYear();
  if(x.id==='heat-why-1448'){var d8=hajjD8(1448);if(d8)t=t.replace('Friday 14 May',wdm(d8)).replace('Saturday 15 May',wdm(addDays(d8,1)));}
  if(x.id==='heat-jamarat-slot'){var b=hajjD8(y);if(b){var d=new Date(addDays(b,3)+'T00:00:00'),P=computePT('Mina',d.getFullYear(),d.getMonth(),d.getDate());t=t.replace('12:17 pm',ampm(P.t.Dhuhr)).replace('6:52 pm',ampm(P.t.Maghrib));}if(y!==1448)t=t.replace(' in mid-May 2027','');}
  if(x.id==='heat-hours'&&y!==1448)t=t.replace('the Ministry’s advice for 2027','the Ministry’s advice for your Hajj year');
  return t;}
function heatHomeHTML(id){var hd=heatOn();if(!hd)return '';var a=pkOf(HEAT_PACK,'heat-hours'),b=pkOf(HEAT_PACK,'heat-hydration');
  return '<div class="hero hero-o heat" id="'+(id||'heatHome')+'"><div class="hero-t"><div class="k">'+mk('sun','mkt')+'<span>Heat plan · '+hd+' Dhul Hijjah</span></div><span class="hs-u">'+esc(a.t)+'. '+esc(b.t)+'.</span></div>'
    +hjdPill('Heatstroke','The signs, and what to do — call 911','heatSheet(\'heat-stroke\')')+hjdPill('The heat plan','Hours, shade in ihram, water, your kit','heatSheet()')+'</div>';}
function renderHeatCnt(){var e=document.getElementById('heatCnt');if(e)e.innerHTML=heatHomeHTML('heatCntCard');}
function heatSheet(openId){var o=openId||'heat-stroke';
  var top='<a class="btn danger tall heat-911" id="heat911" href="tel:911">'+mk('phone','mkt')+'Call 911 — heatstroke is an emergency</a><div class="heat-tel"><a class="chip-btn" href="tel:997">997 · Saudi Red Crescent</a><a class="chip-btn" href="tel:937">937 · Ministry of Health line</a></div><p class="pk-cav">First aid and prevention only. This page cannot tell you that someone is fine — if you are unsure, call.</p>';
  pkSheet('sun','Heat plan','',top+heatList().map(function(x){return pkAcc(x,x.id===o,heatTxt(x));}).join(''),openId);}

/* ── #54 · the Jamarat, as a schematic. Not to scale. North is up, Makkah on the left: Jamrat al-Aqabah, al-Wusta, as-Sughra, then Masjid al-Khayf and the camps.
   No lengths, no capacity, no levels mapped to a direction, and NO standing position at Aqabah (which sides are open on each level is not verified) — the stance is text only. ── */
var jamView=11;
function jamSVG(v){var J=[[80,'Aqabah','3',true],[158,'al-Wusta','2',v!==10],[236,'as-Sughra','1',v!==10]],s='<svg class="jam-svg" viewBox="0 -18 340 232" role="img" aria-label="Schematic, not to scale, north up. From Mina walking towards Makkah you meet the small jamrah (as-Sughra) first, after Masjid al-Khayf, then the middle one (al-Wusta), then Jamrat al-Aqabah at the Makkah end.'+(v===10?' On the 10th only Jamrat al-Aqabah is stoned.':' On the 11th to 13th all three are stoned in that order.')+'">';
  s+='<text x="8" y="-3" class="jm-s">Not to scale</text><g class="jm-n"><path d="M318 14V-6M318 -6l-5 7M318 -6l5 7"/><text x="318" y="29" text-anchor="middle" class="jm-s">N</text></g>';
  s+='<path class="jm-road" d="M22 96H318"/>';
  s+='<text x="6" y="67" class="jm-e">Makkah</text><path class="jm-arr" d="M30 76H8M8 76l6-4M8 76l6 4"/>';
  s+='<g class="jm-lm"><rect x="40" y="36" width="12" height="10" rx="2"/><text x="58" y="46" class="jm-s">Masjid al-Bay’ah</text></g>';
  J.forEach(function(j){s+='<g class="jm-j'+(j[3]?' on':'')+'"><ellipse cx="'+j[0]+'" cy="96" rx="30" ry="15"/><path d="M'+(j[0]-17)+' 96h34"/><circle class="jm-b" cx="'+j[0]+'" cy="64" r="11"/><text class="jm-bn" x="'+j[0]+'" y="68.5" text-anchor="middle">'+j[2]+'</text><text class="jm-l" x="'+j[0]+'" y="131" text-anchor="middle">'+j[1]+'</text><text class="jm-s" x="'+j[0]+'" y="149" text-anchor="middle">'+(v===10?(j[3]?'7 pebbles':'not today'):(j[2]==='3'?'do not stop':'then dua'))+'</text></g>';});
  s+='<g class="jm-lm"><path d="M294 120v-8a8 8 0 0 1 16 0v8z"/><text x="336" y="137" text-anchor="end" class="jm-s">Masjid</text><text x="336" y="153" text-anchor="end" class="jm-s">al-Khayf</text></g>';
  s+='<text x="334" y="67" text-anchor="end" class="jm-e">Mina camps</text>';
  s+='<path class="jm-flow" d="M318 176H40M40 176l8-5M40 176l8 5"/><text x="170" y="196" text-anchor="middle" class="jm-s">You walk this way, from Mina</text><text x="170" y="210" text-anchor="middle" class="jm-s">towards Makkah</text>';
  return s+'</svg>';}
function jamBody(v){var W=function(id){return pkOf(WAY_PACK,id);},o=W('jam-order'),lead=v===10?W('jam-aqabah-stance'):W('jam-dua-spots');
  return '<div class="segmini jam-seg" role="group" aria-label="Which day"><button aria-pressed="'+(v===10)+'"'+(v===10?' class="on"':'')+' onclick="jamSet(10)">The 10th</button><button aria-pressed="'+(v!==10)+'"'+(v!==10?' class="on"':'')+' onclick="jamSet(11)">11th – 13th</button></div>'
    +'<div class="jam-fig">'+jamSVG(v)+'<p class="jam-ar"><span class="ar" lang="ar" dir="rtl">'+o.ar+'</span><span class="tl">'+esc(o.tl)+'</span></p><p class="jam-cap">Not to scale. The circles give the order you meet them in. The drawing shows no level, entrance or standing place: your group is given a route, a level and a time.</p></div>'
    +pkCard(lead)+['jam-order','jam-wall-basin','jam-facility','jam-getting-there','jam-history'].map(function(id){return pkAcc(W(id),false);}).join('');}
function jamSheet(day){jamView=day===10?10:11;openSheet('<div class="sheet-h">'+mk('stone')+'</div><h3>The Jamarat</h3><div class="pk-list" id="jamBody">'+jamBody(jamView)+'</div><button class="btn ghost tall" onclick="closeSheet()">Close</button>');}
function jamSet(v){jamView=v;var e=document.getElementById('jamBody');if(e){e.innerHTML=jamBody(v);var b=e.querySelector('.jam-seg .on');if(b)b.focus();}vib(6);}

/* ── #55 · the Mina camp card and finding the way back (a map of Mina's camps is not built: no zone, colour, street or numbering scheme could be verified).
   The fields and their Arabic labels are the Ministry guide's own (camp-card). ── */
var CAMP_F=[['z','Area number','cZ'],['st','Street','cS'],['n','Camp number','cN'],['g','Gate','cG'],['lm','Nearest building or landmark','cLm'],['ts','Train station number','cT'],['l','Group supervisor','cL']];
function campArL(){var x=pkOf(WAY_PACK,'camp-card');return x&&x.ar?x.ar.split(' · '):[];}
function showCampCard(){var c=ST.camp||{},AR=campArL(),h='<div class="lost-en camp-h">My camp in Mina</div>',any=false;
  CAMP_F.forEach(function(f,i){var v=c[f[0]];if(!v)return;any=true;h+='<div class="lost-kv camp-kv"><span>'+f[1]+(AR[i]?'<i class="camp-ar" lang="ar" dir="rtl">'+AR[i]+'</i>':'')+'</span><b><bdi>'+esc(v)+'</bdi></b></div>';});
  if(c.m)h+='<div class="lost-kv camp-kv"><span>Maktab</span><b><bdi>'+esc(c.m)+'</bdi></b></div>';
  if(c.p)h+=telRow(mkOr('👥')+' '+esc(c.l||'Group supervisor'),telOf(c.p),esc(c.p));
  if(!any&&!c.m)h+='<div class="lost-en">Nothing saved yet. Add your area, street, camp number, gate, a landmark and your supervisor.</div>';
  h+=telRow(mkOr('🚓','alert')+' Police · ambulance','911','911')+telRow(mkOr('🕋')+' Hajj &amp; Umrah care line','1966','1966');
  h+='<div class="say-acts"><button class="say-b" id="campPinBtn" onclick="closeSay();campPinSheet()">'+mk('pin','mkt')+'My saved pin</button><button class="say-b ghost" onclick="closeSay();campWaySheet()">'+mk('tent','mkt')+'Finding your way back</button><button class="say-b ghost" onclick="closeSay();goCampEdit()">'+mk('pen','mkt')+'Edit the camp card</button></div>';
  sayOpen(mk('tent','mkt')+'My camp card','<div class="camp-card" id="campCardB">'+h+'</div>'+sayFoot('',''));}
function campWaySheet(openId){var W=function(id){return pkOf(WAY_PACK,id);};
  pkSheet('tent','Finding your way back in Mina','',pkCard(W('camp-finding-way')).replace('<h4>'+esc(W('camp-finding-way').t)+'</h4>','')+pkAcc(W('camp-card'),openId==='camp-card')+pkAcc(W('help-numbers'),openId==='help-numbers')+pkAcc(W('bound-muzdalifah-mina'),openId==='bound-muzdalifah-mina')
    +'<div class="pk-acts"><button class="btn tall" onclick="closeSheet();showCampCard()">Show my camp card</button><button class="btn ghost tall" onclick="closeSheet();campPinSheet()">My saved pin</button></div>',openId);}
/* ── #21 (safe alternatives) · the boundary explainers, and "save my camp pin". The app holds NO boundary of Arafah, Muzdalifah or Mina and never says inside or outside.
   The pin is kept on this phone only. The answer is a straight-line distance and a map bearing in words — never an arrow driven by the compass — with the phone's own
   accuracy radius; the distance is hidden when that radius is larger than the distance. ── */
function waySheet(id){var x=pkOf(WAY_PACK,id);if(!x)return;var other=id==='bound-arafah'?'bound-muzdalifah-mina':'bound-arafah';
  pkSheet('pin',esc(x.t),'',pkCard(x).replace('<h4>'+esc(x.t)+'</h4>','')+pkAcc(pkOf(WAY_PACK,other),false)+'<p class="pk-cav">Miqah does not check this with GPS: there is no published official boundary to check against, and a phone’s position is not exact enough at the edge. Read the signs, and ask your group leader.</p>');}
function pinBearing(a,b){var R=Math.PI/180,y=Math.sin((b[1]-a[1])*R)*Math.cos(b[0]*R),x=Math.cos(a[0]*R)*Math.sin(b[0]*R)-Math.sin(a[0]*R)*Math.cos(b[0]*R)*Math.cos((b[1]-a[1])*R);return (Math.atan2(y,x)/R+360)%360;}
function pinDir(deg){return ['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(deg/45)%8];}
function pinDistT(m){return m<950?'about '+(Math.round(m/10)*10)+' m':'about '+(Math.round(m/100)/10).toFixed(1)+' km';}
/* pure: the words for a reading. acc = the larger of the two accuracy radii (the saved pin's and the current fix's) */
function pinAnswer(pin,pos){var m=hav([pin.lat,pin.lng],[pos.lat,pos.lng])*1000,acc=Math.max(pin.acc||0,pos.acc||0),near=acc>=m;
  return {m:m,acc:acc,near:near,deg:pinBearing([pos.lat,pos.lng],[pin.lat,pin.lng]),t:near?'You are within the phone’s margin of error of your saved pin (± '+Math.round(acc)+' m). Look for your gate and your landmark.':'Your saved pin is '+pinDistT(m)+' away in a straight line, to the '+pinDir(pinBearing([pos.lat,pos.lng],[pin.lat,pin.lng]))+'.'};}
function pinResHTML(res){return '<b>'+esc(res.t)+'</b>'+(res.near?'':'<small>This reading is accurate to about ± '+Math.round(res.acc)+' m. A map direction: north is the top of a map. A phone’s compass can be badly wrong near metal and inside tents — check the direction against the signs or a landmark.</small>');}
function campPinSheet(res){var p=ST.campPin,x=pkOf(WAY_PACK,'gps-save-camp'),geo=!!navigator.geolocation,h='';
  if(p)h+='<div class="pin-box" id="pinSaved"><b>Your saved pin</b><small>Saved '+new Date(p.t).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+' · the phone’s reading was accurate to about ± '+Math.round(p.acc||0)+' m</small></div>';
  /* the answer box is always in the sheet as a live region; a new reading fills it in place and takes focus (campPinFind) */
  h+='<div class="pin-res" id="pinRes" role="status" tabindex="-1"'+(res?'':' hidden')+'>'+(res?pinResHTML(res):'')+'</div>';
  h+='<p class="ob-err" id="pinErr" role="alert" hidden></p>';
  if(geo)h+=(p?'<button class="btn tall" id="pinFind" onclick="campPinFind()">'+mk('pin','mkt')+'How far is my saved pin?</button><a class="btn ghost tall" href="https://www.google.com/maps/search/?api=1&query='+p.lat+','+p.lng+'" target="_blank" rel="noopener">Open in Google Maps (sends this spot to Google, needs signal)</a>':'')+'<button class="btn '+(p?'ghost ':'')+'tall" id="pinSave" onclick="campPinSave()">'+(p?'Save a new pin here':mk('pin','mkt')+'Save this spot — stand at your camp gate')+'</button>'+(p?'<button class="btn ghost tall" onclick="campPinClear()">Remove the pin</button>':'');
  else h+='<p class="pk-cav">This phone does not share its location with the browser, so a pin cannot be saved here. Use your camp card and your phone’s map app.</p>';
  pkSheet('pin','My saved pin','',pkCard(x).replace('<h4>'+esc(x.t)+'</h4>','')+h+'<p class="pk-cav">It shows where you saved the pin — nothing else. It never tells you whether a place is inside or outside Mina, Muzdalifah or Arafah.</p>');}
function pinErr(t){var e=document.getElementById('pinErr');if(e){e.textContent=t||'';e.hidden=!t;}}
function pinRead(btn,ok){var b=document.getElementById(btn);if(b)b.disabled=true;navigator.geolocation.getCurrentPosition(function(g){if(b)b.disabled=false;ok({lat:g.coords.latitude,lng:g.coords.longitude,acc:g.coords.accuracy||0});},function(){if(b)b.disabled=false;pinErr('The phone did not give a position. Step outside the tent, wait a moment and try again — GPS works without mobile data.');},{enableHighAccuracy:true,timeout:25000,maximumAge:0});}
function campPinSave(){pinRead('pinSave',function(p){if(p.acc>100){pinErr('The reading is only accurate to about ± '+Math.round(p.acc)+' m — too rough to save. Stand in the open at the gate and try again.');return;}ST.campPin={lat:p.lat,lng:p.lng,acc:p.acc,t:Date.now()};saveST();vib(12);campPinSheet();toast('✓ Pin saved on this phone only');});}
function campPinFind(){var pin=ST.campPin;if(!pin)return;pinRead('pinFind',function(p){var res=pinAnswer(pin,p),e=document.getElementById('pinRes');if(!e){campPinSheet(res);e=document.getElementById('pinRes');}else{e.innerHTML=pinResHTML(res);e.hidden=false;}pinErr('');if(e){try{e.focus();}catch(x){}if(e.scrollIntoView)e.scrollIntoView({block:'nearest'});}});}
function campPinClear(){delete ST.campPin;saveST();campPinSheet();toast('Pin removed');}

/* ── #56 · getting around: dated facts, no fares. The Mashaer train and the walking distances are for the days of Hajj only. ── */
function goIds(){var L=['go-haramain','go-makkah-bus','go-madinah-bus','go-taxi'];if(journey()==='hajj')L.splice(1,0,'go-mashaer-metro','go-walking');return L;}
function goSheet(openId){pkSheet('bus','Getting around','Each fact carries the year it describes — routes and rules change, so check before you rely on one. No fares are given.',goIds().map(function(id){return pkAcc(pkOf(WAY_PACK,id),id===openId);}).join(''),openId);}
function wayRowHTML(){var HJ=journey()==='hajj';return '<div class="way-row" id="wayRow"><button class="rul-c" onclick="goSheet()">'+mk('bus','mkt')+'Getting around</button>'+(HJ?'<button class="rul-c" onclick="jamSheet()">'+mk('stone','mkt')+'The Jamarat</button><button class="rul-c" onclick="campWaySheet()">'+mk('tent','mkt')+'Finding your camp</button><button class="rul-c" onclick="waySheet(\'bound-arafah\')">'+mk('hills','mkt')+'Am I inside Arafah?</button>':'')+'</div>';}

/* 6.9 (G5 #47): a system notification goes through the service worker's registration — Chrome on Android refuses `new Notification()`.
   The constructor is the fallback where there is no worker (desktop, file://). Still only while the app is open. */
function sysNotify(title,body,tag){try{if(!('Notification' in window)||Notification.permission!=='granted')return false;
  var o={body:body,tag:tag||'us',icon:'icons/icon-192.png',badge:'icons/favicon-32.png',renotify:false};
  if(swReg&&swReg.showNotification){var p=swReg.showNotification(title,o);if(p&&p.catch)p.catch(function(){});return true;}
  new Notification(title,{body:body,tag:o.tag});return true;}catch(e){return false;}}
function remTick(){
  if(!ST.rem||!ptData||!('Notification' in window)||Notification.permission!=='granted')return;
  var now=riyadhNow(),nowMin=now.getHours()*60+now.getMinutes(),fri=isFriday();
  for(var i=0;i<PT_NAMES.length;i++){
    var nm=PT_NAMES[i],jum=fri&&nm==='Dhuhr',m=ptMin(ptData.t[nm]),diff=m-nowMin,lead=jum?60:20,lbl=jum?'Jumu’ah':nm;
    if(diff>0&&diff<=lead){
      var key=(ST.city||'Makkah')+'|'+now.getDate()+'|'+nm;
      if(localStorage.getItem('us-remlast')===key)return;
      localStorage.setItem('us-remlast',key);
      sysNotify(lbl+' in '+diff+' min ('+(ST.city||'Makkah')+')',jum?'Jumu’ah — the Haram fills 1–2 hours before. Head out with wudu.':'Head out with wudu — the Haram fills early. May it be accepted.',key);
      toast('🔔 '+lbl+' in '+diff+' minutes');vib([60,40,60]);
      return;
    }
  }
}
setInterval(remTick,60000);

/* ════════════════════════ PRAYER TIMES ════════════════════════ */
var PT_NAMES=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
var PT_LL={Makkah:[21.4225,39.8262],Madinah:[24.4672,39.6112]};
/* 6.5 (G1): Arafah and Mina for the sunset / midday hints of the days of Hajj — taken from the 'arafat' and 'mina' places (computed only, ±2 min; never a city of the prayer-time picker) */
(function(){[['Arafah','arafat'],['Mina','mina'],['Muzdalifah','muzdalifah']].forEach(function(x){var pl=(typeof PLACES!=='undefined'?PLACES:[]).filter(function(q){return q.id===x[1];})[0];if(pl&&pl.ll)PT_LL[x[0]]=pl.ll;});})();
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
/* false on the days of Hajj (8th–13th): the pilgrim is in Mina, Arafah or Muzdalifah, so the strip keeps the plain Dhuhr label and no “the Haram fills early” note */
function isFriday(){if(typeof hajjDay()==='number')return false;return riyadhNow().getDay()===5;}
function ptLabel(nm){return (nm==='Dhuhr'&&isFriday())?'Jumu’ah':nm;}
/* D-03: solar computation with Umm al-Qura parameters — Fajr 18.5°, Dhuhr = solar noon + 1 min, Asr shadow factor 1, Maghrib = sunset,
   Isha = Maghrib + 90 min (120 in Ramadan), fixed coordinates, UTC+3. Lands within ±2 min of the official table; the fetched table overrides it. */
function computePT(city,y,m,d){var ll=PT_LL[city]||PT_LL.Makkah,out=ptCore(ll[0],ll[1],3,y,m,d,18.5,null,1);
  out.Dhuhr+=1/60;out.Isha=out.Maghrib+(isRamadanFor(y,m,d)?120:90)/60;
  var fix=function(a,b){a=a-b*Math.floor(a/b);return a<0?a+b:a;},hm=function(h){return minHM(fix(h,24)*60);};
  return {t:{Fajr:hm(out.Fajr),Dhuhr:hm(out.Dhuhr),Asr:hm(out.Asr),Maghrib:hm(out.Maghrib),Isha:hm(out.Isha)},s:hm(out.Sunrise),h:hijriFor(y,m,d),calc:true};
}
/* 6.9 (G5 #58): the same solar maths for any place — latitude, longitude, the clock's offset from UTC, the Fajr and Isha angles and the Asr shadow factor.
   Returns hours as numbers; `bad` lists a twilight angle the sun never reaches that night (high latitudes in summer). */
function ptCore(lat,lng,TZ,y,m,d,fajrA,ishaA,asrF){
  var R=Math.PI/180,bad={};
  var sin=function(x){return Math.sin(x*R);},cos=function(x){return Math.cos(x*R);},tan=function(x){return Math.tan(x*R);},asin=function(x){return Math.asin(x)/R;},acos=function(x){return Math.acos(Math.max(-1,Math.min(1,x)))/R;},atan2=function(a,b){return Math.atan2(a,b)/R;},acot=function(x){return Math.atan(1/x)/R;};
  var fix=function(a,b){a=a-b*Math.floor(a/b);return a<0?a+b:a;};
  var Y=y,M=m+1;if(M<=2){Y-=1;M+=12;}var A=Math.floor(Y/100),B=2-A+Math.floor(A/4);
  var jd=Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(M+1))+d+B-1524.5-lng/360;
  function sun(t){var D=jd+t-2451545.0,g=fix(357.529+0.98560028*D,360),q=fix(280.459+0.98564736*D,360),L=fix(q+1.915*sin(g)+0.020*sin(2*g),360),e=23.439-0.00000036*D;var RA=fix(atan2(cos(e)*sin(L),cos(L))/15,24);return {dec:asin(sin(e)*sin(L)),eq:q/15-RA};}
  function noon(t){return fix(12-sun(t).eq,24);}
  function angleTime(ang,t,ccw,nm){var dec=sun(t).dec,n=noon(t),x=(-sin(ang)-sin(dec)*sin(lat))/(cos(dec)*cos(lat));if(nm)bad[nm]=!(x>=-1&&x<=1);var v=acos(x)/15;return n+(ccw?-v:v);}
  function asr(t){var dec=sun(t).dec;return angleTime(-acot((asrF||1)+tan(Math.abs(lat-dec))),t,false);}
  var T={Fajr:5/24,Sunrise:6/24,Dhuhr:12/24,Asr:13/24,Maghrib:18/24};
  if(ishaA)T.Isha=20/24;
  for(var i=0;i<2;i++){T.Fajr=angleTime(fajrA,T.Fajr,true,'Fajr')/24;T.Sunrise=angleTime(0.833,T.Sunrise,true,'Sunrise')/24;T.Dhuhr=noon(T.Dhuhr)/24;T.Asr=asr(T.Asr)/24;T.Maghrib=angleTime(0.833,T.Maghrib,false,'Maghrib')/24;if(ishaA)T.Isha=angleTime(ishaA,T.Isha,false,'Isha')/24;}
  var out={},adj=TZ-lng/15;Object.keys(T).forEach(function(k){out[k]=T[k]*24+adj;});out.bad=bad;
  return out;
}
/* The published method definitions (PrayTimes.org): the sun's angle below the horizon at Fajr and at Isha. Umm al-Qura sets Isha 90 minutes after Maghrib (120 in Ramadan).
   Dhuhr is solar noon, Maghrib is sunset; Asr is when a shadow is the object's length (standard) or twice it (Hanafi). */
var PT_METHODS={MWL:{n:'Muslim World League',f:18,i:17},ISNA:{n:'ISNA (North America)',f:15,i:15},Egypt:{n:'Egyptian General Authority',f:19.5,i:17.5},Karachi:{n:'University of Islamic Sciences, Karachi',f:18,i:18},Makkah:{n:'Umm al-Qura, Makkah',f:18.5,i:0}};
function homeOK(){var H=ST.home;return !!(H&&typeof H.lat==='number'&&typeof H.lng==='number'&&Math.abs(H.lat)<=90&&Math.abs(H.lng)<=180);}
function homeMethod(){var H=ST.home||{};return PT_METHODS[H.m]?H.m:'MWL';}
/* today at home, on the phone's own clock and time zone */
function homePT(dt){var H=ST.home,n=dt||new Date(),y=n.getFullYear(),m=n.getMonth(),d=n.getDate(),M=PT_METHODS[homeMethod()],tz=-new Date(y,m,d,12).getTimezoneOffset()/60;
  var o=ptCore(H.lat,H.lng,tz,y,m,d,M.f,M.i||null,H.asr===2?2:1);if(!M.i)o.Isha=o.Maghrib+(isRamadanFor(y,m,d)?120:90)/60;
  var fix=function(h){h=h-24*Math.floor(h/24);return minHM(h*60);},b=o.bad||{},t={};
  ['Fajr','Dhuhr','Asr','Maghrib','Isha'].forEach(function(k){var miss=(k==='Fajr'&&b.Fajr)||(k==='Isha'&&M.i&&b.Isha)||((k==='Maghrib'||k==='Isha')&&b.Maghrib)||isNaN(o[k]);t[k]=miss?'':fix(o[k]);});
  return {t:t,s:b.Sunrise||isNaN(o.Sunrise)?'':fix(o.Sunrise),gap:!t.Fajr||!t.Isha||!t.Maghrib};}
/* Daily › Today, before the trip only: the home block sits under the Makkah / Madinah strip and leaves by itself once the trip starts */
/* the times are worked out for the phone's own clock: a longitude more than about 2 hours from the phone's UTC offset usually means the wrong zone (or a typing slip) */
function homeTzOdd(lng){var tz=-new Date().getTimezoneOffset()/60,d=lng/15-tz;while(d>12)d-=24;while(d<-12)d+=24;return Math.abs(d)>2.5;}
function homePTOne(on){var e=document.getElementById('homePTone'),s=document.getElementById('sec-salah');if(!on||!s){if(e)e.remove();return;}if(e&&e.previousElementSibling===s)return;if(e)e.remove();e=document.createElement('div');e.id='homePTone';e.innerHTML='<button class="lnk hpt-one" id="hptSet1" onclick="homePTSheet()">'+mk('dome','mkt')+'<span>Prayer times at home until you fly? Use my home city</span></button>';s.insertAdjacentElement('afterend',e);}
function renderHomePT(){var a=document.getElementById('homePT'),b=document.getElementById('homePTin');if(!a||!b)return;var d=depDays();
  if(onTrip()||ST.post||(d!==null&&d<-ST.tripLen)){a.innerHTML='';b.innerHTML='';homePTOne(false);return;}
  /* not set: the offer waits inside the opened prayer-times section, and as one line under the five prayers of Today (seen without opening anything, and the checklist stays above the fold); once set, the block sits under the strip */
  if(!homeOK()){a.innerHTML='';b.innerHTML='<div class="hpt hpt-off"><div class="hpt-t"><b>Prayer times at home</b><small>Until you fly — worked out on this phone, no internet needed</small></div><button class="chip-btn" id="hptSet" onclick="homePTSheet()">Use my home city</button></div>';homePTOne(true);return;}
  homePTOne(false);
  var H=ST.home,P=homePT(),n=new Date(),now=n.getHours()*60+n.getMinutes(),nx='';PT_NAMES.forEach(function(k){if(!nx&&P.t[k]&&ptMin(P.t[k])>now)nx=k;});
  var h='<div class="hpt" id="hptOn"><div class="hpt-hd"><div class="hpt-t"><b>'+mk('dome','mkt')+'At home · '+esc(H.n||'Home')+'</b><small>'+esc(PT_METHODS[homeMethod()].n)+(H.asr===2?' · Hanafi Asr':'')+' · your phone’s clock</small></div><button class="chip-btn" onclick="homePTSheet()" aria-label="Change the home city or method">Change</button></div><div class="pt-grid hpt-g">';
  PT_NAMES.forEach(function(k){h+='<div class="pt hpt-c'+(k===nx?' next':'')+'"><div class="pn">'+k+'</div><div class="pv">'+(P.t[k]||'—')+'</div></div>';});
  h+='</div><p class="hpt-n">Calculated on this phone'+(P.s?' · sunrise '+P.s:'')+'. It can differ by a few minutes from your mosque’s timetable — follow your mosque.'+(P.gap?' At your latitude the sky does not reach this method’s twilight angle tonight, so a time is left blank — for that prayer, follow your mosque’s timetable.':'')+(homeTzOdd(H.lng)?' <b id="hptTz">These times use this phone’s clock. Is the phone set to your home time zone?</b>':'')+' The strip above stays on '+esc(ST.city||'Makkah')+' time and takes over on your trip.</p></div>';
  b.innerHTML='';a.innerHTML=h;}
var homeDraft=null;
function homePTSheet(){var H=homeOK()?ST.home:{},m=homeMethod();homeDraft={lat:H.lat,lng:H.lng};
  openSheet('<div class="sheet-h">'+mk('dome')+'</div><h3>Prayer times at home</h3><p>Used only before your trip. The place stays on this phone; the times are worked out here, with no internet.</p>'
    +'<button class="btn ghost tall" id="hptGeo" onclick="homePTGeo()">'+mk('pin','mkt')+'Use my location once</button><p class="ob-err" id="hptErr" role="alert" hidden></p>'
    +'<label class="care-l" for="hptName">Name of the place</label><input class="srch" id="hptName" maxlength="30" autocomplete="off" placeholder="e.g. Leicester" value="'+esc(H.n||'')+'">'
    +'<div class="hpt-ll"><div><label class="care-l" for="hptLat">Latitude</label><input class="srch" id="hptLat" inputmode="decimal" autocomplete="off" placeholder="52.63" value="'+(typeof H.lat==='number'?H.lat:'')+'"></div><div><label class="care-l" for="hptLng">Longitude</label><input class="srch" id="hptLng" inputmode="decimal" autocomplete="off" placeholder="-1.13" value="'+(typeof H.lng==='number'?H.lng:'')+'"></div></div>'
    +'<label class="care-l" for="hptM">Calculation method</label><select class="srch" id="hptM">'+Object.keys(PT_METHODS).map(function(k){var M=PT_METHODS[k];return '<option value="'+k+'"'+(k===m?' selected':'')+'>'+M.n+' — Fajr '+M.f+'°, Isha '+(M.i?M.i+'°':'90 min after Maghrib (120 in Ramadan)')+'</option>';}).join('')+'</select>'
    +'<div class="setrow"><div><b>Asr</b><small>Shadow one length (standard) or two (Hanafi)</small></div><div class="segmini" id="hptAsr"><button data-a="1" aria-pressed="'+(H.asr!==2)+'"'+(H.asr!==2?' class="on"':'')+' onclick="homePTAsr(1)">Standard</button><button data-a="2" aria-pressed="'+(H.asr===2)+'"'+(H.asr===2?' class="on"':'')+' onclick="homePTAsr(2)">Hanafi</button></div></div>'
    +'<button class="btn tall" onclick="homePTSave()">Save</button>'+(homeOK()?'<button class="btn ghost tall" onclick="homePTClear()">Remove the home city</button>':'')+'<button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');homeDraft.asr=H.asr===2?2:1;}
function homePTAsr(v){if(homeDraft)homeDraft.asr=v;document.querySelectorAll('#hptAsr button').forEach(function(b){var on=+b.getAttribute('data-a')===v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});vib(6);}
function homePTErr(t){var e=document.getElementById('hptErr');if(e){e.textContent=t||'';e.hidden=!t;}}
function homePTGeo(){if(!navigator.geolocation){homePTErr('This phone does not share its location with the browser — type the latitude and longitude instead.');return;}var b=document.getElementById('hptGeo');if(b)b.disabled=true;
  navigator.geolocation.getCurrentPosition(function(p){if(b)b.disabled=false;var la=document.getElementById('hptLat'),lo=document.getElementById('hptLng');if(la)la.value=(Math.round(p.coords.latitude*100)/100);if(lo)lo.value=(Math.round(p.coords.longitude*100)/100);homePTErr('');toast('✓ Location read once — rounded to about a kilometre');},
    function(){if(b)b.disabled=false;homePTErr('The phone did not give a location — type the latitude and longitude instead (a map app shows them).');},{enableHighAccuracy:false,timeout:15000,maximumAge:600000});}
function homePTSave(){var num=function(id){return parseFloat(String((document.getElementById(id)||{}).value||'').replace(',','.'));},la=num('hptLat'),lo=num('hptLng');
  if(isNaN(la)||isNaN(lo)||Math.abs(la)>90||Math.abs(lo)>180){homePTErr('Enter a latitude between −90 and 90 and a longitude between −180 and 180 — or use your location once.');return;}
  var m=(document.getElementById('hptM')||{}).value;ST.home={lat:Math.round(la*100)/100,lng:Math.round(lo*100)/100,n:((document.getElementById('hptName')||{}).value||'').trim().slice(0,30),m:PT_METHODS[m]?m:'MWL',asr:homeDraft&&homeDraft.asr===2?2:1};saveST();closeSheet();renderHomePT();vib(10);toast(homeTzOdd(ST.home.lng)?'Saved — these times use this phone’s clock. Is the phone set to your home time zone?':'✓ Home prayer times on — until you fly');}
function homePTClear(){delete ST.home;saveST();closeSheet();renderHomePT();toast('Home city removed');}
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
/* (G1 review) the 9th, prayer by prayer: before dawn Fajr as usual; Dhuhr — combined with Asr, with your group; Asr keeps its own time
   (Hanafis combine only behind the Hajj imam, otherwise each at its own time — h9salah); Maghrib / Isha (and the night after Isha) — together on arrival at Muzdalifah */
function d9PrayerLine(N,cls,src){var c=cls?' class="'+cls+'"':'';
  if(N.name==='Fajr'&&N.min<1440)return '';
  if(N.name==='Dhuhr')return '<b>Dhuhr + Asr</b> combined, with your group <span'+c+'>· in '+fmtDiff(N.diff)+' · Dhuhr '+cl(ptData.t.Dhuhr)+src+'</span>';
  if(N.name==='Asr')return '<b>Asr</b> in '+fmtDiff(N.diff)+' <span'+c+'>· ≈ '+cl(ptData.t.Asr)+' · prayed with Dhuhr if your group combined'+src+'</span>';
  return '<b>Maghrib + Isha</b> together at Muzdalifah, on arrival <span'+c+'>· after sunset ≈ '+arafahNow().sun+' · follow your group</span>';}
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
  var pi=PT_NAMES.indexOf(N.name),prev=pi>0?PT_NAMES[pi-1]:null,miss=ptMissHTML(N,d,exc);
  nx.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span class="ptc">· '+tm+' · '+city+'</span>'+friNote+miss;
  /* 6.5 (G1 #2): on the 9th the prayers are combined — Dhuhr + Asr at Arafah, Maghrib + Isha on arrival at Muzdalifah (the tiles stay tickable) */
  if(journey()==='hajj'&&hajjDay()===9&&expectedDay()===ST.day){var d9p=d9PrayerLine(N,'ptc','');if(d9p)nx.innerHTML=d9p;}
  var meet=hiOf().m,src=ptSrc==='calc'?' · computed ±2 min':ptSrc==='cache'?' · cached':'',d9h=hn&&journey()==='hajj'&&hajjDay()===9&&onTrip()?d9PrayerLine(N,'',src):'';
  if(d9h){hn.onclick=null;hn.innerHTML=d9h;}
  else if(hn){hn.onclick=null;if(onTrip())hn.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span>· '+tm+(meet?' · meet: '+esc(meet):'')+(jum?' · arrive early':'')+src+'</span>'+miss;
    else{var rn=riyadhNow();hn.innerHTML='<b>'+lbl+'</b> at '+tm+' <span>· '+city+' time now '+minHM(rn.getHours()*60+rn.getMinutes())+(meet?' · meet: '+esc(meet):'')+src+'</span>';}}
  updRemSw();
  var mi=document.getElementById('ptMeet');if(mi&&document.activeElement!==mi)mi.value=meet||'';var ml=document.getElementById('ptLead');if(ml)ml.value=ST.meetLead?String(ST.meetLead):'';
  if(ptTimer)clearInterval(ptTimer);
  ptTimer=setInterval(function(){if(document.getElementById('view-daily').classList.contains('on')||homeOn())renderPT_tick();},30000);
}
function renderPT_tick(){if(ptData)renderPT();renderHomePT();}
/* D-04: the grid mirrors the salah rows the moment either is tapped */
function syncPTTiles(){var d=dailyChk[dayKey()]||{},exc=!!d._excused;PT_NAMES.forEach(function(nm){var e=document.getElementById('pt-'+nm);if(!e)return;var on=!!d[nm.toLowerCase()]&&!exc;e.classList.toggle('done',on);e.classList.toggle('excused',exc);e.setAttribute('aria-checked',on?'true':'false');});}
/* D-22: one meeting point (shared with the hotel card / lost card) and a one-tap timings message for the group */
function setMeet(v){v=(v||'').trim().slice(0,120);hiSet(hiCity(),{m:v});var e=document.getElementById('hMeet');if(e)e.value=v;renderCntHd();renderTodayTop();renderPT_tick();if(v)toast('📍 Meeting point saved — shown on Home, the lost card and the counters');}
function setMeetLead(v){ST.meetLead=parseInt(v)||0;saveST();}
function sharePT(){if(!ptData)return;var city=ST.city||'Makkah',ex=expectedDay(),hi=hiOf(),lead=ST.meetLead||0,lines=[];
  lines.push('🕌 Prayer times · '+city+' · '+(ptData.h||hijriIntl())+(ST.dep?' · '+dayDateStr(ST.day):''));
  if(ex)lines.push('Day '+ex+' of '+ST.tripLen);
  PT_NAMES.forEach(function(nm){var t=cl(ptData.t[nm]);lines.push(ptLabel(nm)+' '+t+(lead?' → leave hotel '+minHM(ptMin(t)-lead):''));});
  if(hi.m)lines.push('📍 Meet: '+hi.m);
  if(isFriday())lines.push('Jumu’ah today — arrive 1–2 h early');
  lines.push((ptSrc==='calc'?'Computed times (±2 min) — follow the adhan':'Umm al-Qura times')+' · via Miqah');
  shareText('Prayer times · '+city,lines.join('\n'),APP_URL);}
/* D-23: a week of prayer alerts as .ics (TZID=Asia/Riyadh) — share sheet on phones, download elsewhere */
function icsDT(y,m,d,hm){return y+('0'+(m+1)).slice(-2)+('0'+d).slice(-2)+'T'+cl(hm).replace(':','')+'00';}
var ICS_HEAD=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Miqah//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:Asia/Riyadh','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0300','TZOFFSETTO:+0300','TZNAME:AST','END:STANDARD','END:VTIMEZONE'].join('\r\n');
/* RFC 5545 §3.1: content lines are folded at 75 octets (CRLF + one space), never inside a UTF-8 character */
function icsFold(t){return t.split('\r\n').map(function(l){var out='',cur='',n=0;Array.from(l).forEach(function(ch){var c=ch.codePointAt(0),b=c<0x80?1:c<0x800?2:c<0x10000?3:4;if(n+b>(out?74:75)){out+=cur+'\r\n ';cur='';n=0;}cur+=ch;n+=b;});return out+cur;}).join('\r\n');}
function icsWrap(ev){return icsFold(ICS_HEAD+'\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR')+'\r\n';}
function icsEsc(t){return String(t).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');}
/* start: the first day (a Date at local midnight); default today in Makkah */
function buildICS(city,days,start){var now=start||riyadhNow(),ev=[],calc=0,stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  for(var i=0;i<days;i++){var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),P=ptFor(city,y,m,d);if(P.calc)calc++;
    PT_NAMES.forEach(function(nm){var t=cl(P.t[nm]),jum=dt.getDay()===5&&nm==='Dhuhr',lbl=jum?'Jumu’ah':nm;
      ev.push(['BEGIN:VEVENT','UID:us-'+city.toLowerCase()+'-'+icsDT(y,m,d,t)+'-'+nm.toLowerCase()+'@umrah-strivers','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Riyadh:'+icsDT(y,m,d,t),'DTEND;TZID=Asia/Riyadh:'+icsDT(y,m,d,minHM(ptMin(t)+30)),'SUMMARY:'+lbl+' — '+city,'DESCRIPTION:'+(P.calc?'Computed times (±2 min) · follow the adhan':'Umm al-Qura times')+' · Miqah','BEGIN:VALARM','TRIGGER:-PT'+(jum?'60':'20')+'M','ACTION:DISPLAY','DESCRIPTION:'+lbl+' in '+(jum?'60':'20')+' min — '+city,'END:VALARM','END:VEVENT'].join('\r\n'));});}
  return {calc:calc,n:ev.length,ics:icsWrap(ev)};}
/* one share-or-download path for every .ics the app makes (offline, nothing uploaded) */
function shareICS(ics,name,title,done){var blob=new Blob([ics],{type:'text/calendar'}),file=null;try{file=new File([blob],name,{type:'text/calendar'});}catch(e){}
  var dl=function(){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);toast(done,true);};
  if(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:title}).then(function(){toast('📅 Sent — open it in Calendar to add the alerts',true);}).catch(function(err){if(err&&err.name==='AbortError')return;dl();});
  else dl();}
/* the trip's days still ahead: from today (or the departure, if later) to the last day of the trip */
function icsTripSpan(){if(!ST.dep)return null;var st=new Date(ST.dep+'T00:00:00'),t=riyadhNow();t=new Date(t.getFullYear(),t.getMonth(),t.getDate());var end=new Date(st.getFullYear(),st.getMonth(),st.getDate()+ST.tripLen-1);if(end<t)return null;var from=st>t?st:t;return {from:from,days:Math.round((end-from)/86400000)+1};}
function exportICS(whole){var city=ST.city||'Makkah',sp=whole?icsTripSpan():null;if(whole&&!sp){toast('Set your departure date first — or the trip is already over');return;}
  var n=sp?sp.days:7,B=buildICS(city,n,sp?sp.from:null),name='prayer-times-'+city.toLowerCase()+(sp?'-trip':'-week')+'.ics';
  var s=document.getElementById('icsSub');if(s)s.textContent=n+' days · '+city+' · '+(B.calc?B.calc+' day'+(B.calc===1?'':'s')+' computed (±2 min), the rest Umm al-Qura':'Umm al-Qura times')+' · 20-min alert (60 for Jumu’ah)';
  shareICS(B.ics,name,'Prayer times · '+city,'📅 '+B.n+' prayer alerts saved — open the .ics file to add them to your calendar');}
/* ── 6.6 (G2 #20) · the days of Hajj in the phone's calendar: alarms that ring with the screen off, no push and no server ──
   One event per moment that matters, titled with the HAJJ_RITES wording; times computed for the site (Arafah, Muzdalifah, Mina) with the moon-sighting shift, ±2 min,
   and every event says "follow your group". */
function buildHajjICS(){var y=curHajjYear(),D=hajjDates(y),ev=[],stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),ty=hajjType();if(!D[8])return null;
  var at=function(iso,site){var p=iso.split('-').map(Number),P=computePT(site,p[0],p[1]-1,p[2]);return {y:p[0],m:p[1]-1,d:p[2],P:P};};
  var add=function(id,iso,site,min,sum,desc,mins){var x=at(iso,site),t=minHM(min(x.P));ev.push(['BEGIN:VEVENT','UID:us-hajj'+y+'-'+id+'@umrah-strivers','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Riyadh:'+icsDT(x.y,x.m,x.d,t),'DTEND;TZID=Asia/Riyadh:'+icsDT(x.y,x.m,x.d,minHM(min(x.P)+(mins||30))),'SUMMARY:'+icsEsc(sum),'DESCRIPTION:'+icsEsc(desc+'\n'+(site?'Time computed for '+site+', ±2 min':'A morning reminder')+' — follow your group, not the phone. · Miqah'),'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(sum),'END:VALARM','END:VEVENT'].join('\r\n'));};
  var b=function(id){var st=hajjStep(id);return st?fcText(riteStepView(st).b):'';},sec=function(id){var x=HAJJ_RITES.filter(function(q){return q.id===id;})[0];return x?x.title:'';},PM=function(k){return function(P){return ptMin(P.t[k]);};};
  add('d8',D[8],'',function(){return 7*60;},sec('hd8'),(ty==='tamattu'?b('h8niyyah')+' · ':'')+b('h8talb')+' · '+b('h8mina'),30);
  add('d9dhuhr',D[9],'Arafah',PM('Dhuhr'),'Arafah — Dhuhr time · the standing begins',b('h9wuquf')+'. Pray Dhuhr and Asr as your group does (schools differ).');
  add('d9sunset',D[9],'Arafah',function(P){return ptMin(P.t.Maghrib)-30;},'Sunset in 30 min — stay inside Arafah',b('h9sunset')+'.',30);
  add('d10fajr',D[10],'Muzdalifah',PM('Fajr'),sec('hd10'),b('h9nstay')+' · then '+b('h10rami')+'.');
  [11,12,13].forEach(function(n){if(n===13&&!ST.stay13)return;add('d'+n+'rami',D[n],'Mina',PM('Dhuhr'),'Rami opens after midday — '+n+' Dhul Hijjah',b('h'+n+'rami')+'.');});
  if(!ST.stay13)add('d12leave',D[12],'Mina',function(P){return ptMin(P.t.Maghrib)-90;},'Leaving today? Be out of Mina before sunset',b('h12leave')+'.',30);
  return {n:ev.length,ics:icsWrap(ev),y:y};}
function exportHajjICS(){if(journey()!=='hajj'){toast('Switch to the Hajj journey first');return;}var B=buildHajjICS();if(!B){toast('Set your Hajj year first');return;}
  shareICS(B.ics,'hajj-'+B.y+'-days.ics','Hajj '+B.y+' · the days','📅 '+B.n+' Hajj alerts saved — open the .ics file to add them to your calendar');}

/* ════════════════════════ TASBIH ════════════════════════ */
var TB_PHRASES=['SubhanAllah','Alhamdulillah','Allahu Akbar','La ilaha illallah','Astaghfirullah','Salawat ﷺ'];
var TB_AR=['سُبْحَانَ اللهِ','الْحَمْدُ لِلهِ','اللهُ أَكْبَرُ','لَا إِلَهَ إِلَّا اللهُ','أَسْتَغْفِرُ اللهَ','اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ'];
/* D-06: the two ×100 phrases keep their own target and tick their checklist row at 100 */
var TB_LONG={4:'istighfar',5:'salawat'};
/* D-14: pickable targets; 0 = no target (∞) */
var TB_TARGETS=[33,34,100,1000,0];
var tbPhrase=0,tbCount=0,tbTargetN=33;
var tasbihP={};try{tasbihP=JSON.parse(localStorage.getItem('us-tasbih-p')||'{}');}catch(e){}
/* ── 6.6 (G2 #16) · the Hajj dhikr chip (phrase 6) follows the day: the talbiyah on the 8th, the dua of Arafah on the 9th until sunset, the talbiyah again until the first
   pebble at Aqabah on the 10th (switched when that pebble is logged, never at midnight), then the takbir to the 13th. Arabic + transliteration are read from DUAS
   (byte-identical to the verified pack); its count is kept per dhikr in us-tasbih-p (talb / arafah / takbir — the same "arafah" count as the Counters card) and adds to the day total. */
var TB_HJ=6,TB_HJ_LBL={talb:'Talbiyah',arafah:'Dua of Arafah',takbir:'Takbir'};
function tbHajjKey(){if(journey()!=='hajj')return '';var hd=hajjDay();
  /* a Qarin / Mufrid on the trip before the 8th is already in the ihram of Hajj: the talbiyah */
  if(hd==='pre'&&hajjType()!=='tamattu'&&ST.hajjTypeConfirmed&&onTrip())return 'talb';if(typeof hd!=='number')return '';
  if(hd===8)return 'talb';if(hd===9)return arafahNow().left>0?'arafah':'talb';
  if(hd===10){var r=(ST.rami||{})[10]||{};return ((r.aqabah||0)>0||r.del||hajjChk.h10rami)?'takbir':'talb';}return 'takbir';}
function tbHajjDua(key){var x=TB_HAJJ[key];if(!x)return null;for(var i=0;i<DUAS.length;i++)if(DUAS[i].ar===x.ar)return DUAS[i];return null;}
function tbOrder(){var L=[0,1,2,3,4,5];return tbHajjKey()?[TB_HJ].concat(L):L;}
function tbName(i){return i===TB_HJ?(TB_HJ_LBL[tbHajjKey()]||'Hajj dhikr'):TB_PHRASES[i];}
function tbArOf(i){if(i===TB_HJ){var d=tbHajjDua(tbHajjKey());return d?d.ar:'';}return TB_AR[i];}
function tbPKey(i){return i===TB_HJ?(tbHajjKey()||'talb'):i;}
function tbDefault(i){return i===TB_HJ?0:TB_LONG[i]?100:33;}
function tbTarget(){return tbTargetN;}
/* the live cycle survives a reload — stored beside the day totals under a non-day key (us-tasbih._cur); the Hajj chip also keeps which dhikr it was counting */
function tbPersist(){tasbih._cur={p:tbPhrase,c:tbCount,t:tbTargetN};if(tbPhrase===TB_HJ)tasbih._cur.hk=tbHajjKey();save('us-tasbih',tasbih);}
function tbRestore(){var c=tasbih._cur;if(c&&typeof c==='object'){tbPhrase=TB_PHRASES[c.p]||(c.p===TB_HJ&&tbHajjKey())?c.p:0;tbCount=Math.max(0,parseInt(c.c,10)||0);tbTargetN=TB_TARGETS.indexOf(c.t)>-1?c.t:tbDefault(tbPhrase);}else tbTargetN=tbDefault(tbPhrase);}
/* the day moved on (the Hajj chip is gone, or its dhikr changed): fall back / start the new dhikr's cycle at 0 */
function tbSync(){if(tbPhrase!==TB_HJ)return;var k=tbHajjKey();if(!k){tbPhrase=0;tbCount=0;tbTargetN=tbDefault(0);tbPersist();return;}var c=tasbih._cur||{};if(c.hk&&c.hk!==k){tbCount=0;tbPersist();}}
/* total dhikr counted on the trip — only the day keys, never the _cur record */
function tbTotal(){var n=0;Object.keys(tasbih).forEach(function(k){if(k[0]==='d'&&typeof tasbih[k]==='number')n+=tasbih[k];});return n;}
function renderTB(){
  var c=document.getElementById('tbChips');if(!c)return;tbSync();var hk=tbHajjKey();
  var h='';tbOrder().forEach(function(i){h+='<button class="tb-chip'+(i===tbPhrase?' on':'')+(i===TB_HJ?' hj':'')+'" aria-pressed="'+(i===tbPhrase?'true':'false')+'" onclick="tbSet('+i+')"'+(i===TB_HJ?' id="tbHajj" aria-label="'+esc(tbName(i))+' — today’s dhikr"':'')+'>'+esc(tbName(i))+(i===TB_HJ?' <span class="tb-today">Today</span>':'')+'</button>';});
  c.innerHTML=h;
  var hj=document.getElementById('tbHj');if(hj){var D=tbPhrase===TB_HJ&&hk?tbHajjDua(hk):null;hj.hidden=!D;hj.innerHTML=D?'<span class="ar" lang="ar" dir="rtl">'+D.ar+'</span><span class="tl">'+D.tl+'</span><button class="lnk" onclick="tbHajjInfo()">About this dhikr · when to say it</button>':'';}
  var tg=document.getElementById('tbTargets');if(tg)tg.innerHTML=TB_TARGETS.map(function(t){return '<button class="tb-tg'+(t===tbTargetN?' on':'')+'" role="radio" aria-checked="'+(t===tbTargetN?'true':'false')+'" aria-label="Target '+(t||'unlimited')+'" onclick="tbSetTarget('+t+')">'+(t||'∞')+'</button>';}).join('');
  document.getElementById('tbN').textContent=tbCount;
  var of=document.getElementById('tbOf');if(of)of.innerHTML=!tbTargetN?'<span id="tbTarget">∞</span> · tap':tbCount>tbTargetN?'<span id="tbTarget">'+tbTargetN+'</span> done · keep going':'of <span id="tbTarget">'+tbTargetN+'</span> · tap';
  document.getElementById('tbToday').textContent=tasbih[dayKey()]||0;
  var pe=document.getElementById('tbPhraseN'),pp=(tasbihP[dayKey()]||{})[tbPKey(tbPhrase)]||0;if(pe)pe.textContent='· '+tbName(tbPhrase)+' '+pp+(TB_LONG[tbPhrase]?'/100':'');
  var f=document.getElementById('focus');if(focusKey==='tasbih'&&f&&f.classList.contains('on'))renderFocusTB();
}
function tbHajjInfo(){var k=tbHajjKey(),x=TB_HAJJ[k],D=tbHajjDua(k);if(!x)return;openSheet('<div class="sheet-h">'+mk('beads')+'</div><h3>'+esc(x.t)+'</h3>'+(D?'<p class="ar" lang="ar" style="font-size:var(--t-ar-l);text-align:center">'+D.ar+'</p><p class="tl" style="text-align:center">'+D.tl+'</p>':'')+'<div class="tbhj-b">'+x.b+'</div><button class="btn ghost" onclick="closeSheet()">Back to the counter</button>');}
/* picking a phrase keeps a deliberate 1000/∞ target; 33/34/100 follow the phrase (the Hajj chip has no target) */
var tbHjAuto=false;
function tbSet(i){var was=tbPhrase;tbPhrase=i;tbCount=0;
  /* the Today chip counts with no target; that ∞ is the chip's, not the user's — leaving the chip restores the phrase's own target */
  if(i===TB_HJ){if(was!==TB_HJ)tbHjAuto=tbTargetN!==0;tbTargetN=0;}else if(was===TB_HJ&&tbHjAuto){tbHjAuto=false;tbTargetN=tbDefault(i);}else if(tbTargetN!==1000&&tbTargetN!==0)tbTargetN=tbDefault(i);tbPersist();renderTB();vib(6);}
/* G2 #16: on the big counter the title is a glass pill that steps through the phrases; the tap zone below stays the counter */
function tbCycle(){var L=tbOrder(),i=L.indexOf(tbPhrase);tbSet(L[(i+1)%L.length]);}
function tbSetTarget(t){tbHjAuto=false;tbTargetN=t;tbPersist();renderTB();vib(6);}
function tbTap(){tbSync();
  var k=dayKey(),ph=tbPhrase,pk=tbPKey(ph),long=TB_LONG[ph],T=tbTargetN;
  tbCount++;tasbih[k]=(tasbih[k]||0)+1;
  var P=tasbihP[k]||{};P[pk]=(P[pk]||0)+1;tasbihP[k]=P;save('us-tasbih-p',tasbihP);
  if(T&&tbCount===T){
    vib([40,60,100]);
    /* the post-salah chain only: SubhanAllah 33 → Alhamdulillah 33 → Allahu Akbar 34 → stop; anything else keeps counting */
    if((T===33||T===34)&&ph<3){
      if(ph===2){tbCount=0;toast('✨ Post-salah tasbih complete — 33 · 33 · 34, alhamdulillah',true);}
      else{tbCount=0;tbPhrase=ph+1;tbTargetN=tbPhrase===2?34:33;toast('✨ '+TB_PHRASES[ph]+' ×'+T+' — now '+TB_PHRASES[tbPhrase]+(tbPhrase===2?' ×34':''));}
    }else toast('✨ '+tbName(ph)+' ×'+T+' complete — keep going');
  }else vib(12);
  tbPersist();
  var d=dailyChk[k]||{},changed=false;
  if(long&&P[pk]>=100&&!d[long]){d[long]=true;changed=true;toast('📿 '+TB_PHRASES[ph]+' ×100 today — checklist ticked!');}
  if((tasbih[k]||0)>=100&&!d.dhikr100){d.dhikr100=true;changed=true;toast('📿 100 dhikr today — checklist updated!');}
  if(changed){dailyChk[k]=d;save('us-daily',dailyChk);updDaily();updStats();chkBadges();}
  renderTB();
}
/* D-15: one back for a mis-tap — the day and phrase totals follow */
function tbUndo(){if(tbCount<=0){vib(6);return;}var k=dayKey(),pk=tbPKey(tbPhrase);tbCount--;tasbih[k]=Math.max(0,(tasbih[k]||0)-1);var P=tasbihP[k]||{};if(P[pk])P[pk]=Math.max(0,P[pk]-1);tasbihP[k]=P;save('us-tasbih-p',tasbihP);tbPersist();renderTB();vib(6);}
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
/* ════════════════════════ 6.8 (G4) · ON THE TRIP, SAFETY AND FAMILY ════════════════════════
   About me (#41) and medicines (#57) on the lost card · show-a-phrase cards (#44) · lost-child cards (#42 / #43) · the hotel check-in card (#66).
   Every Arabic line comes from SAY (data.js: the verified arabic-phrases pack, verbatim) or from lines the app already shows; nothing is composed here.
   The cards live in the white stranger-card overlay (#say) — white with dark ink in both themes. Nothing leaves the phone. */
function sayBy(id){return SAY.filter(function(x){return x.id===id;})[0]||null;}
/* fill the {slots} of a verified phrase; in HTML each value is escaped and isolated (left-to-right unless it is Arabic script) inside the right-to-left line */
function sayFill(t,v,html){return String(t).replace(/\{(\w+)\}/g,function(m,k){var x=v&&v[k]!=null&&String(v[k]).trim()!==''?String(v[k]).trim():'…';if(!html)return x;return '<bdi'+(/[\u0600-\u06FF]/.test(x)?'':' dir="ltr"')+(/^[+\d\s().\-]+$/.test(x)?' class="num"':'')+'>'+esc(x)+'</bdi>';});}
function sayTitle(x){return String(x.t).replace(/ \((?:man|woman|boy|girl)\)$/,'');}
function sayPick(id){if(id==='say-lost-m'&&ST.profile==='w')return 'say-lost-w';if(id==='say-toilet'&&ST.profile==='w')return 'say-toilet-w';return id;}
var SAY_LIST=[['Medical','cross',['say-doctor','say-diabetic-low','say-wheelchair','say-ambulance']],['Finding the way','compass',['say-lost-m','say-call-number','say-gate','say-way-haram','say-way-nabawi','say-women-prayer']],['Needs','hands',['say-toilet','say-wudu','say-go-hotel','say-no-arabic','say-thanks']]];
function sayOpen(title,html){var o=document.getElementById('say');if(!o)return;document.getElementById('sayTop').innerHTML=title;var b=document.getElementById('sayBody');b.innerHTML=html;b.scrollTop=0;if(!o.classList.contains('on')){o.classList.add('on');reqWake();}vib(8);}
function closeSay(){var o=document.getElementById('say');if(o)o.classList.remove('on');try{speechSynthesis.cancel();}catch(e){}sayReset();if(wakeLock&&!document.getElementById('focus').classList.contains('on')){wakeLock.release().catch(function(){});wakeLock=null;}obAfterCardGo();}
function sayFoot(back,backL){return '<div class="say-acts">'+(back?'<button class="say-b ghost" onclick="'+back+'">'+mk('chevl','mkt')+esc(backL)+'</button>':'')+'</div><div class="focus-hint" role="button" tabindex="0" onclick="closeSay()">tap here to close</div>';}
function sayListenHTML(ar){return ('speechSynthesis' in window)&&AR_VOICE?'<button class="say-b ghost say-listen" data-ar="'+esc(ar)+'" onclick="speakBtn(this)">'+mk('speaker','mkt')+'Listen</button>':'';}
/* the number a stranger should call: my own phone (About me), else the companion / leader, else the camp's group leader */
/* the child cards say “call my parents on this number” / “my phone number”: the pilgrim's own number only, or a leader's once the parent has chosen it (ST.kidLead) */
function leadAnyPhone(){return leadPhone()||((ST.camp||{}).p||'');}
function kidPhone(){return meOf().ph||(ST.kidLead?leadAnyPhone():'');}
function kidLeadUse(i){ST.kidLead=true;saveST();showKidCard(i,'child');}
function mePhone(){var m=meOf();return m.ph||leadPhone()||((ST.camp||{}).p||'');}
function showSayList(){closeHelp();var h='<p class="say-lead">Tap a phrase, then show the screen. Arabic first, English underneath.</p>';
  SAY_LIST.forEach(function(g){h+='<div class="say-g">'+mk(g[1],'mkt')+esc(g[0])+'</div>';
    g[2].forEach(function(id){var x=sayBy(sayPick(id));if(!x)return;h+='<button class="say-row" data-id="'+x.id+'" onclick="showSay(\''+x.id+'\')"><span class="say-rt"><b>'+esc(sayTitle(x))+'</b>'+(x.id==='say-diabetic-low'?'<small>Only for a known low blood sugar</small>':'')+'</span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';});});
  h+='<div class="say-g">'+mk('hotel','mkt')+'At the hotel</div><button class="say-row" id="sayHotelRow" onclick="showCheckin()"><span class="say-rt"><b>Hotel check-in card</b><small>Reservation, meals, floor, nearest gate</small></span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';
  if(ST.kids||kidNames().length)h+='<div class="say-g">'+mk('kid','mkt')+'Children</div><button class="say-row" id="sayKidsRow" onclick="showKids()"><span class="say-rt"><b>Child cards</b><small>A card for each child, and “my child is lost”</small></span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';
  h+='<p class="say-note">The Arabic was checked letter by letter against its sources; a native speaker’s final read is still pending.</p>';
  sayOpen(mk('speaker','mkt')+'Show a phrase',h+sayFoot('closeSay();showHelp()','Help numbers'));}
var sayNumV='';
function sayVals(x){var v={};if(/\{gate\}/.test(x.ar))v.gate=ST.sayGate||1;if(/\{number\}/.test(x.ar))v.number=sayNumV||mePhone();if(/\{name\}/.test(x.ar))v.name=ST.name||'';return v;}
function showSay(id,back){var x=sayBy(id);if(!x)return;var v=sayVals(x),long=x.ar.length>120,h='';
  h+='<div class="say-ar'+(long?' long':'')+'" id="sayAr" lang="ar" dir="rtl">'+sayFill(x.ar,v,true)+'</div><div class="say-en" id="sayEn">'+sayFill(x.en,v,true)+'</div><div class="say-tl">'+esc(sayFill(x.tl,v))+'</div>';
  if(v.gate!==undefined)h+='<div class="say-step" role="group" aria-label="Gate number"><button class="say-b ghost" onclick="sayGate(-1)" aria-label="One lower">−</button><input class="say-in" id="sayGateIn" type="number" inputmode="numeric" min="1" max="999" value="'+v.gate+'" aria-label="Gate number" onchange="sayGateSet(this.value)"><button class="say-b ghost" onclick="sayGate(1)" aria-label="One higher">+</button></div>';
  if(v.number!==undefined)h+='<label class="say-lbl" for="sayNumIn">The number to call</label><input class="say-in wide" id="sayNumIn" type="tel" inputmode="tel" value="'+esc(v.number)+'" placeholder="Phone number" onchange="sayNumV=this.value.trim().slice(0,40);showSay(\''+id+'\''+(back?',\''+back+'\'':'')+')">'+(v.number?'<a class="lost-tel" href="tel:'+telOf(v.number)+'">'+esc(v.number)+'</a>':'');
  if(id==='say-go-hotel'){var hi=hiOf();h+=hi.n?'<div class="say-hotel">'+(hi.ar?'<div class="drv-arn" lang="ar" dir="rtl" style="margin:10px 0 4px">'+esc(hi.ar)+'</div>':'')+'<div class="drv-name">'+esc(hi.n)+'</div>'+(hi.a?'<div class="drv-addr">'+esc(hi.a)+'</div>':'')+'</div>':'<button class="say-b ghost" onclick="closeSay();goTab(\'plan\',\'prep\',\'hotelCard\')">'+mk('pen','mkt')+'Add your hotel</button>';}
  if(id==='say-diabetic-low')h+='<p class="say-note">Show this only for a known low blood sugar.</p>';
  if(x.g==='medical')h+=telRow(mkOr('🚓','alert')+' Police · ambulance','911','911');
  h+='<div class="say-acts">'+sayListenHTML(sayFill(x.ar,v))+'<button class="say-b ghost" onclick="'+(back||'showSayList')+'()">'+mk('chevl','mkt')+(back==='showCheckin'?'Check-in card':'All phrases')+'</button></div><div class="focus-hint" role="button" tabindex="0" onclick="closeSay()">tap here to close</div>';
  sayOpen(mk('speaker','mkt')+esc(sayTitle(x)),h);}
function sayGateSet(v){var a=document.activeElement,lab=a&&a.getAttribute&&a.closest&&a.closest('#say')?a.getAttribute('aria-label'):'';ST.sayGate=Math.max(1,Math.min(999,parseInt(v)||1));saveST();showSay('say-gate');
  /* the card is re-drawn: put keyboard and screen-reader focus back on the control that was pressed */
  if(lab){var e=document.querySelector('#say .say-step [aria-label="'+lab+'"]');if(e)e.focus();}}
/* Escape closes the show-to-a-stranger overlays (a sheet on top closes first) */
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var on=function(id){var o=document.getElementById(id);return !!(o&&o.classList.contains('on'));};if(document.querySelector('.sheet-o.on'))return;if(on('say')){closeSay();e.preventDefault();}else if(on('lost')){closeLost();e.preventDefault();}else if(on('help')){closeHelp();e.preventDefault();}});
function sayGate(d){sayGateSet((ST.sayGate||1)+d);vib(6);}

/* ── #66 · the hotel check-in card: the user's own hotel (name in Arabic and nearest Haram gate as they typed them) and the verified check-in phrases ── */
function showCheckin(){var hi=hiOf(),n=riyadhNow(),ram=isRamadanFor(n.getFullYear(),n.getMonth(),n.getDate()),ids=['hotel-reservation',ram?'hotel-suhur':'hotel-breakfast','hotel-floor','hotel-nearest-gate','hotel-write-address'],h='';
  h+='<div class="say-hotel" id="ckHotel">'+(hi.ar?'<div class="drv-arn" lang="ar" dir="rtl" style="margin:6px 0 4px">'+esc(hi.ar)+'</div>':'')+(hi.n?'<div class="drv-name">'+esc(hi.n)+'</div>':'<div class="lost-en">Your hotel</div>')+(hi.a?'<div class="drv-addr">'+esc(hi.a)+'</div>':'')+(hi.g?'<div class="lost-kv"><span>'+mk('pin')+' Nearest Haram gate</span><b style="text-align:right">'+esc(hi.g)+'</b></div>':'')+'</div>';
  if(!hi.n||!hi.ar||!hi.g)h+='<button class="say-b ghost" id="ckAdd" onclick="closeSay();goTab(\'plan\',\'prep\',\'hotelCard\');setTimeout(function(){var e=document.getElementById(\''+(!hi.n?'hName':!hi.ar?'hAr':'hGate')+'\');if(e)e.focus();},700)">'+mk('pen','mkt')+(!hi.n?'Add your hotel':!hi.ar?'Add the hotel’s name in Arabic':'Add the nearest Haram gate')+'</button>';
  ids.forEach(function(id){var x=sayBy(id);if(!x)return;var v={name:ST.name||''};h+='<button class="ck-row" data-id="'+id+'" onclick="showSay(\''+id+'\',\'showCheckin\')" aria-label="'+esc(sayTitle(x))+' — show full screen"><span class="ck-ar" lang="ar" dir="rtl">'+sayFill(x.ar,v,true)+'</span><span class="ck-en">'+sayFill(x.en,v,true)+'</span></button>';});
  if(!ST.name)h+='<p class="say-note">Add your name in More › Settings › About me and the reservation line carries it.</p>';
  sayOpen(mk('hotel','mkt')+'Hotel check-in',h+sayFoot('showSayList()','All phrases'));}

/* ── #41 · About me: who the pilgrim is, for the steward or paramedic reading the lost card. ST.name + ST.me {c,lang,med,blood,ph,home,hideMed} — only on this phone ── */
function meOf(){var m=ST.me&&typeof ST.me==='object'?ST.me:{},s=function(k){return typeof m[k]==='string'?m[k]:'';};return {c:s('c'),lang:s('lang'),med:s('med'),blood:s('blood'),ph:s('ph'),home:s('home'),hideMed:!!m.hideMed};}
function meHas(){var m=meOf();return !!((ST.name||'').trim()||m.c||m.lang||m.med||m.blood||m.ph||m.home);}
function meMedOn(){var m=meOf();return !m.hideMed&&!!(m.med||m.blood||(ST.medsShow&&medsL().length));}
function saveMe(){var m=meOf();ST.name=hv('nameIn').slice(0,60);ST.me={c:hv('meC').slice(0,60),lang:hv('meLang').slice(0,60),med:hv('meMed').slice(0,300),blood:hv('meBlood').slice(0,12),ph:hv('mePh').slice(0,40),home:hv('meHome').slice(0,120),hideMed:m.hideMed};saveST();meSumUpd();}
function togMeMed(){var m=meOf();m.hideMed=!m.hideMed;ST.me=m;saveST();loadMe();vib(8);}
function meSumUpd(){var e=document.getElementById('meSum');if(!e)return;var m=meOf(),t=[(ST.name||'').trim(),m.c,m.med||m.blood?'medical notes':'',medsL().length?medsL().length+' medicine'+(medsL().length===1?'':'s'):''].filter(Boolean).join(' · ');e.textContent=t||'Name, country, language, medical notes — for the “I’m lost” card';}
function loadMe(){var m=meOf(),set=function(id,v){var e=document.getElementById(id);if(e&&document.activeElement!==e)e.value=v||'';};set('nameIn',ST.name);set('meC',m.c);set('meLang',m.lang);set('meMed',m.med);set('meBlood',m.blood);set('mePh',m.ph);set('meHome',m.home);
  var sw=document.getElementById('meMedSw');if(sw){sw.classList.toggle('on',!m.hideMed);sw.setAttribute('aria-checked',m.hideMed?'false':'true');}meSumUpd();renderMeds();}
/* "اِسْمِي {name}" / "My name is {name}." are the opening sentence of the verified child card */
function meNameAr(){var P=sayBy('child-card-boy');return P?P.ar.split('.')[0]:'';}
function meMedHTML(px){px=px||'lost';var m=meOf(),ml=ST.medsShow?medLine():'';if(!meMedOn())return '';
  return '<div class="lost-med" id="'+px+'Med"><b>'+mk('cross','mkt')+'Medical information</b>'+(m.med?'<p>'+esc(m.med)+'</p>':'')+(m.blood?'<p><span>Blood type</span> '+esc(m.blood)+'</p>':'')+(ml?'<p id="'+px+'Meds"><span>Medicines</span> '+esc(ml)+'</p>':'')+'</div>';}
function meLostHTML(px){px=px||'lost';if(!meHas()&&!meMedOn())return '';var m=meOf(),nm=(ST.name||'').trim(),h='<div class="lost-me" id="'+px+'Me">',ar=meNameAr(),hp=(m.home.match(/\+?\d[\d\s\-().]{6,}\d/)||[''])[0];
  if(nm)h+='<div class="lost-me-n">'+(ar?'<span lang="ar" dir="rtl" class="lost-me-ar">'+sayFill(ar,{name:nm},true)+'</span>':'')+'<b>My name is '+esc(nm)+'</b></div>';
  if(m.c)h+='<div class="lost-kv"><span>'+mk('compass')+' I am from</span><b style="text-align:right">'+esc(m.c)+'</b></div>';
  if(m.lang)h+='<div class="lost-kv"><span>'+mk('speaker')+' I speak</span><b style="text-align:right">'+esc(m.lang)+'</b></div>';
  h+=meMedHTML(px);
  if(m.ph)h+=telRow(mk('phone')+' My phone',telOf(m.ph),esc(m.ph));
  if(m.home)h+=hp?telRow(mk('heart')+' Family at home'+(m.home.replace(hp,'').replace(/^[\s·,:\-–|()]+|[\s·,:\-–|()]+$/g,'')?' · '+esc(m.home.replace(hp,'').replace(/^[\s·,:\-–|()]+|[\s·,:\-–|()]+$/g,'')):''),telOf(hp),esc(hp)):'<div class="lost-kv"><span>'+mk('heart')+' Family at home</span><b style="text-align:right">'+esc(m.home)+'</b></div>';
  return h+'</div>';}

/* ── #57 · medicines: name, dose, times. A reminder while the app is open (a notification where the phone allows it, a toast otherwise), and an optional line on the lost card. No medical advice. ── */
function medsL(){return Array.isArray(ST.meds)?ST.meds.filter(function(m){return m&&typeof m.n==='string'&&m.n;}):[];}
function medLine(){return medsL().map(function(m){return m.n+(m.d?' '+m.d:'');}).join(' · ');}
function renderMeds(){var a=document.getElementById('medList');if(!a)return;var L=medsL(),h='';
  L.forEach(function(m,i){h+='<button class="med-row" onclick="medSheet('+i+')" aria-label="Edit '+esc(m.n)+'"><span class="med-t"><b>'+esc(m.n)+(m.d?' <span>'+esc(m.d)+'</span>':'')+'</b><small>'+((m.t||[]).length?(m.t||[]).join(' · '):'No times set')+'</small></span><span class="say-go" aria-hidden="true">'+mk('chevr')+'</span></button>';});
  h+=(L.length<8?'<button class="chip-btn" id="medAdd" onclick="medSheet(-1)">'+mk('plus','mkt')+'Add a medicine</button>':'');
  if(L.length)h+='<div class="setrow"><div><b>Remind me at these times</b><small>While the app is open — follows this phone’s clock. A notification where the phone allows it.</small></div><button class="sw'+(ST.medRem?' on':'')+'" id="medRemSw" role="switch" aria-checked="'+(ST.medRem?'true':'false')+'" aria-label="Medicine reminders" onclick="togMedRem()"></button></div>'
    +'<div class="setrow"><div><b>List them on the “I’m lost” card</b><small>Names and doses, in the medical block</small></div><button class="sw'+(ST.medsShow?' on':'')+'" id="medShowSw" role="switch" aria-checked="'+(ST.medsShow?'true':'false')+'" aria-label="List my medicines on the I’m lost card" onclick="togMedShow()"></button></div>';
  a.innerHTML=h;meSumUpd();}
function medSheet(i){var m=i>=0?medsL()[i]:null,t=(m&&m.t)||[];
  openSheet('<div class="sheet-h">'+mk('cross')+'</div><h3>'+(m?'Edit medicine':'Add a medicine')+'</h3><p>Stored only on this phone. The app reminds; it gives no medical advice — follow your doctor.</p>'
    +'<label class="care-l" for="medN">Name</label><input class="srch" id="medN" maxlength="40" value="'+esc(m?m.n:'')+'" placeholder="e.g. Metformin" autocomplete="off">'
    +'<label class="care-l" for="medD">Dose</label><input class="srch" id="medD" maxlength="30" value="'+esc(m?m.d||'':'')+'" placeholder="e.g. 500 mg, 1 tablet" autocomplete="off">'
    +'<div class="care-l" id="medTL">Times (up to four)</div><div class="med-times" role="group" aria-labelledby="medTL">'+[0,1,2,3].map(function(k){return '<input type="time" class="srch med-time" id="medT'+k+'" value="'+esc(t[k]||'')+'" aria-label="Time '+(k+1)+'">';}).join('')+'</div>'
    +'<button class="btn tall" id="medSave" onclick="medSave('+i+')">Save</button>'+(m?'<button class="btn ghost tall" onclick="medDel('+i+')">'+mk('trash','mkt')+'Remove</button>':'')+'<button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function medSave(i){var n=hv('medN').slice(0,40),d=hv('medD').slice(0,30),t=[];if(!n){toast('Give the medicine a name');return;}
  [0,1,2,3].forEach(function(k){var v=hv('medT'+k);if(/^\d\d:\d\d$/.test(v)&&t.indexOf(v)<0)t.push(v);});t.sort();
  var L=medsL().slice(),rec={n:n,d:d,t:t};if(i>=0&&L[i])L[i]=rec;else{if(L.length>=8){toast('Up to eight medicines');return;}L.push(rec);}
  ST.meds=L;saveST();closeSheet();renderMeds();vib(10);toast('✓ '+n+' saved'+(t.length&&!ST.medRem?' — turn on “Remind me” for alerts':''));}
function medDel(i){var L=medsL().slice(),m=L[i];if(!m)return;L.splice(i,1);ST.meds=L;saveST();closeSheet();renderMeds();toast('Removed '+m.n,false,'Undo',function(){var L2=medsL().slice();L2.splice(Math.min(i,L2.length),0,m);ST.meds=L2;saveST();renderMeds();});}
function togMedShow(){ST.medsShow=!ST.medsShow;saveST();renderMeds();vib(8);}
function togMedRem(){if(ST.medRem){ST.medRem=false;saveST();renderMeds();toast('Medicine reminders off');return;}
  /* on first, so a permission prompt the browser never settles cannot leave the switch off; the notification is an optional upgrade */
  var ok=function(){return ('Notification' in window)&&Notification.permission==='granted';},said=false,up=function(){if(said||!ST.medRem||!ok())return;said=true;toast('Notifications allowed — medicine reminders also notify while the app is open');};
  ST.medRem=true;saveST();renderMeds();toast(ok()?'Medicine reminders on — a notification while the app is open':'Medicine reminders on — shown in the app while it is open');
  try{if(('Notification' in window)&&Notification.permission==='default'){var p=Notification.requestPermission(up);if(p&&p.then)p.then(up,function(){});}}catch(e){}}
function medNotify(title,body){return sysNotify(title,body,'us-med');}
/* due = a time reached within the last 30 minutes and not yet shown today (us-medlast = {d:'2027-05-15',k:{'Metformin|08:00':1}}) */
function medDue(now){var L=medsL(),n=now||new Date(),mins=n.getHours()*60+n.getMinutes(),day=isoOf(n),seen={};try{seen=JSON.parse(localStorage.getItem('us-medlast')||'{}')||{};}catch(e){}
  if(seen.d!==day)seen={d:day,k:{}};if(!seen.k||typeof seen.k!=='object')seen.k={};var due=[];
  L.forEach(function(m){(m.t||[]).forEach(function(t){var tm=ptMin(t),k=m.n+'|'+t;if(mins>=tm&&mins<tm+30&&!seen.k[k]){seen.k[k]=1;if(due.indexOf(m)<0)due.push(m);}});});
  return {due:due,seen:seen};}
function medTick(now){if(!ST.medRem||!medsL().length)return 0;var R=medDue(now);if(!R.due.length)return 0;try{localStorage.setItem('us-medlast',JSON.stringify(R.seen));}catch(e){}
  var txt=R.due.map(function(m){return m.n+(m.d?' '+m.d:'');}).join(' · ');medNotify('Medicine time',txt);toast('🩺 Medicine time — '+txt,true);vib([60,40,60]);return R.due.length;}
setInterval(function(){medTick();},60000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(function(){medTick();},800);});

/* ── #42 / #43 · lost-child cards. ST.kidInfo = {<name>:{g:'b'|'g', ar:'<name in Arabic, optional>'}}; photos in 'us-kidpics' = {<name>:<small JPEG data URL>} ── */
function kidInfo(nm){var K=ST.kidInfo&&typeof ST.kidInfo==='object'?ST.kidInfo:{},k=K[nm]||{};return {g:k.g==='g'?'g':'b',ar:typeof k.ar==='string'?k.ar:''};}
function kidSet(i,o){var nm=kidNames()[i];if(!nm)return;if(!ST.kidInfo||typeof ST.kidInfo!=='object')ST.kidInfo={};ST.kidInfo[nm]=Object.assign(kidInfo(nm),o);saveST();}
function kidPics(){var P={};try{P=JSON.parse(localStorage.getItem('us-kidpics')||'{}')||{};}catch(e){}return P&&typeof P==='object'?P:{};}
function kidPicSet(i,inp){var nm=kidNames()[i],f=inp&&inp.files&&inp.files[0];if(!nm||!f)return;var rd=new FileReader();
  rd.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,560/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    var P=kidPics();P[nm]=c.toDataURL('image/jpeg',.78);try{localStorage.setItem('us-kidpics',JSON.stringify(P));}catch(e){toast('Not enough space to keep the photo');return;}toast('✓ Photo kept on this phone only');showKidCard(i,'parent');};im.onerror=function(){toast('That file is not a photo');};im.src=rd.result;};rd.readAsDataURL(f);}
function kidPicDel(i){var nm=kidNames()[i],P=kidPics();delete P[nm];try{localStorage.setItem('us-kidpics',JSON.stringify(P));}catch(e){}showKidCard(i,'parent');}
function kidGSet(i,g){kidSet(i,{g:g});showKids();vib(6);}
function showKids(){closeHelp();var N=kidNames(),h='<p class="say-lead">One card per child, in Arabic and English. Set boy or girl so the Arabic is right; the name in Arabic is optional.</p>';
  if(!N.length)h+='<p class="say-note">No children added yet.</p><div class="say-kadd"><input class="say-in wide" id="sayKidIn" maxlength="24" placeholder="Child’s name" aria-label="Child’s name" onkeydown="if(event.key===\'Enter\')sayKidAdd()"><button class="say-b" onclick="sayKidAdd()">'+mk('plus','mkt')+'Add</button></div>';
  N.forEach(function(nm,i){var k=kidInfo(nm);h+='<div class="kidc" id="kidc-'+i+'"><div class="kidc-h"><b>'+esc(nm)+'</b><div class="kidc-g" role="group" aria-label="'+esc(nm)+' is a"><button class="say-b ghost'+(k.g==='b'?' on':'')+'" aria-pressed="'+(k.g==='b')+'" onclick="kidGSet('+i+',\'b\')">Boy</button><button class="say-b ghost'+(k.g==='g'?' on':'')+'" aria-pressed="'+(k.g==='g')+'" onclick="kidGSet('+i+',\'g\')">Girl</button></div></div>'
    +'<input class="say-in wide" lang="ar" dir="auto" maxlength="40" value="'+esc(k.ar)+'" placeholder="Name in Arabic (optional)" aria-label="'+esc(nm)+'’s name in Arabic, optional" onchange="kidSet('+i+',{ar:this.value.trim().slice(0,40)})">'
    +'<div class="kidc-a"><button class="say-b" onclick="showKidCard('+i+',\'child\')">'+mk('kid','mkt')+'Child’s card</button><button class="say-b danger" onclick="showKidCard('+i+',\'parent\')">'+mk('sos','mkt')+'My child is lost</button><button class="say-b ghost" onclick="makeKidCard('+i+')">'+mk('image','mkt')+'Pocket card image</button></div></div>';});
  if(N.length&&!meOf().ph)h+='<button class="say-b ghost" id="kidPhAdd" onclick="closeSay();goTab(\'more\',\'settings\',\'meCard\');setTimeout(meOpen,500)">'+mk('pen','mkt')+'Add your phone — the cards need a number to call</button>';
  sayOpen(mk('kid','mkt')+'Child cards',h+sayFoot('showSayList()','All phrases'));}
function sayKidAdd(){var v=((document.getElementById('sayKidIn')||{}).value||'').trim().slice(0,24);if(!v)return;var n=kidNames().slice();if(n.length>=6){toast('Up to 6 children');return;}n.push(v);ST.kidNames=n;saveST();renderKidNames();renderKidsDay();showKids();}
function kidStayHTML(){var hi=hiOf(),cp=ST.camp||{},h='';if(campDay()&&(cp.n||cp.m))h+='<div class="lost-kv"><span>'+mk('tent')+' Camp</span><b style="text-align:right">'+esc(campChipT(cp))+'</b></div>';
  if(hi.n)h+='<div class="lost-kv"><span>'+mk('hotel')+' Hotel</span><b style="text-align:right">'+esc(hi.n)+'</b></div>';if(hi.p)h+=telRow(mk('phone')+' Hotel phone',telOf(hi.p),esc(hi.p));return h;}
function showKidCard(i,kind){var nm=kidNames()[i];if(!nm)return;var k=kidInfo(nm),P=sayBy((kind==='parent'?'parent-card-':'child-card-')+(k.g==='g'?'girl':'boy'));if(!P)return;var ph=kind==='parent'?meOf().ph:kidPhone(),h='',pic=kidPics()[nm],lp=leadAnyPhone();
  if(kind==='parent')h+=pic?'<div class="kid-pic"><img src="'+pic+'" alt="Photo of '+esc(nm)+'"><button class="lnk" onclick="kidPicDel('+i+')">Remove photo</button></div>':'<label class="kid-pic none" id="kidPicAdd"><input type="file" accept="image/*" class="srx" onchange="kidPicSet('+i+',this)" aria-label="Add a photo of '+esc(nm)+'"><span>'+mk('image')+'</span><b>Add a photo of '+esc(nm)+'</b><small>The card says “this is '+(k.g==='g'?'her':'his')+' photo”. It stays on this phone — or show one from your gallery.</small></label>';
  h+='<div class="say-ar long" lang="ar" dir="rtl" id="sayAr" lang="ar" dir="rtl">'+sayFill(P.ar,{name:k.ar||nm,phone:ph},true)+'</div><div class="say-en" id="sayEn">'+sayFill(P.en,{name:nm,phone:ph},true)+'</div>';
  h+=ph?'<a class="lost-tel" href="tel:'+telOf(ph)+'">'+esc(ph)+'</a>':'<button class="say-b ghost" id="kidPhNeed" onclick="closeSay();goTab(\'more\',\'settings\',\'meCard\');setTimeout(meOpen,500)">'+mk('pen','mkt')+'Add your phone number</button>'+(kind!=='parent'&&lp?'<button class="say-b ghost" id="kidLeadUse" onclick="kidLeadUse('+i+')">'+mk('phone','mkt')+'Use the group leader’s number instead ('+esc(lp)+')</button>':'');
  h+=kidStayHTML()+telRow(mkOr('🚓','alert')+' Police · ambulance','911','911');
  if(kind==='parent')h+='<p class="say-note" id="kidTip">'+esc(SAY_CHILD_TIP)+'</p>';
  sayOpen(mk(kind==='parent'?'sos':'kid','mkt')+(kind==='parent'?'My child is lost':esc(nm)+' — if I am lost'),h+sayFoot('showKids()','Child cards'));}
/* the verified child card as lines: "اِسْمِي {name}." / "أَنَا تَائِهٌ." / "رَجَاءً، … الرَّقْمِ:" — the phone is drawn on its own line in large digits */
function kidLines(P){return P.split(/(?<=\.)\s+/).map(function(s){return s.replace(/\s*\{phone\}\s*$/,'').trim();}).filter(Boolean);}
function kWrap(x,t,max){var w=String(t).split(' '),L=[],c='';w.forEach(function(q){var n=c?c+' '+q:q;if(c&&x.measureText(n).width>max){L.push(c);c=q;}else c=n;});if(c)L.push(c);return L;}
function makeKidCard(i){var nm=kidNames()[i];if(!nm)return;var k=kidInfo(nm),P=sayBy('child-card-'+(k.g==='g'?'girl':'boy')),ph=kidPhone(),hi=hiOf(),cp=ST.camp||{};if(!P)return;
  if(!ph){toast('Add a phone number for the card first','','Add it',function(){closeSay();goTab('more','settings','meCard');setTimeout(meOpen,500);});return;}
  var AF='"Scheherazade New","Amiri","Noto Naskh Arabic",serif',F=document.fonts,draw=function(){
    var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d'),y=0,INK='#111111',ACC='#3B1478',SUB='#4A4A4A';
    x.fillStyle='#FFFFFF';x.fillRect(0,0,1080,1350);x.strokeStyle=ACC;x.lineWidth=14;x.strokeRect(27,27,1026,1296);x.setLineDash([18,14]);x.lineWidth=2;x.strokeStyle='#9C8BC4';x.strokeRect(52,52,976,1246);x.setLineDash([]);
    x.textAlign='center';x.fillStyle=ACC;x.font='700 34px '+KF;x.fillText('IF I AM LOST',540,128);
    x.fillStyle=INK;x.font='700 '+(nm.length>14?84:108)+'px '+KF;x.fillText(nm,540,250);y=270;
    x.save();x.direction='rtl';x.fillStyle=ACC;x.font='500 58px '+AF;kidLines(P.ar).forEach(function(l){kWrap(x,sayFill(l,{name:k.ar||nm}),900).forEach(function(q){y+=90;x.fillText(q,540,y);});});x.restore();
    y+=44;x.fillStyle=SUB;x.font='500 34px '+KF;kWrap(x,sayFill(kidLines(P.en).join(' '),{name:nm}),900).forEach(function(q){y+=50;x.fillText(q,540,y);});
    var px=ph.length>15?88:108;x.fillStyle=INK;x.font='600 '+px+'px '+KF;while(x.measureText(ph).width>940&&px>56){px-=6;x.font='600 '+px+'px '+KF;}y+=px+34;x.fillText(ph,540,y);
    y+=44;x.strokeStyle='#E5E5E5';x.lineWidth=2;x.beginPath();x.moveTo(110,y);x.lineTo(970,y);x.stroke();
    var rows=[];if(hi.p)rows.push(['Hotel phone',hi.p]);if(hi.n)rows.push(['Hotel',hi.n]);if(journey()==='hajj'&&(cp.n||cp.m))rows.push(['Mina camp',campChipT(cp)]);if(hi.m)rows.push(['Meeting point',hi.m]);
    rows.slice(0,4).forEach(function(r){if(y+60>1160)return;y+=60;x.textAlign='left';x.fillStyle=SUB;x.font='500 32px '+KF;x.fillText(r[0],110,y);x.textAlign='right';x.fillStyle=INK;x.font='600 36px '+KF;var v=r[1];while(x.measureText(v).width>600&&v.length>8)v=v.slice(0,-2);x.fillText(v===r[1]?v:v+'…',970,y);});
    x.textAlign='center';x.fillStyle='#B4350F';x.font='700 46px '+KF;x.fillText('Police · ambulance  911',540,1236);x.fillStyle=SUB;x.font='500 24px '+KF;x.fillText('Miqah · made on this phone',540,1284);
    exportImage(c,'if-lost-'+nm.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png',nm+' — pocket card');};
  if(F&&F.load)Promise.all(['66px "Scheherazade New"','600 36px Manrope','700 36px Manrope'].map(function(q){return F.load(q,P.ar).catch(function(){});})).then(draw,draw);else draw();}
function meOpen(){var c=document.getElementById('meCard');if(c&&!c.classList.contains('open')){var h=c.querySelector('.acc-h');if(h)accToggle(h);}var e=document.getElementById('mePh');if(e)e.focus();}

/* ── #45 · printable pocket cards: the first printed page, cut along the lines. Arabic: the lines the app's own cards show, and the verified child card ── */
function printCardsHTML(){var H=hiNorm(ST.hotelInfo),hi=hiOf(),ph=leadPhone(),nm=leadName(),cp=ST.camp||{},m=meOf(),HJ=journey()==='hajj',C=[],box=function(t,b){C.push('<div class="pr-card"><div class="pr-ct">'+t+'</div>'+b+'</div>');};
  var callP=(HJ&&cp.p)||ph||m.ph;
  box('I am lost','<div class="pr-ar ar" lang="ar" dir="rtl">'+lostArT()+'</div><div class="pr-big">'+(callP?esc(callP):'________________')+'</div><div class="pr-s">I am lost — please call this number'+((HJ&&cp.p&&cp.l)||nm?' ('+esc((HJ&&cp.p&&cp.l)||nm)+')':'')+'. Police · ambulance 911</div>');
  ['mk','md'].forEach(function(k){var r=H[k];if(!r.n)return;box('Take me to my hotel · '+(k==='md'?'Madinah':'Makkah'),'<div class="pr-ar ar" lang="ar" dir="rtl">'+DRV_AR_HOTEL+'</div>'+(r.ar?'<div class="pr-ar ar pr-arn" lang="ar" dir="rtl">'+esc(r.ar)+'</div>':'')+'<div class="pr-big sm">'+esc(r.n)+'</div><div class="pr-s">'+[r.a,r.p?'phone '+r.p:'',r.g?'gate: '+r.g:'',r.m?'meet: '+r.m:''].filter(Boolean).map(esc).join(' · ')+'</div>');});
  if(HJ&&(cp.n||cp.m||cp.p))box('My camp in Mina',(cp.n||cp.m?'<div class="pr-ar ar" lang="ar" dir="rtl">'+campArH(cp)+'</div>':'')+'<div class="pr-big sm">'+esc(campChipT(cp)||'Mina camp')+'</div><div class="pr-s">'+[cp.l?'Group leader: '+cp.l:'',cp.p].filter(Boolean).map(esc).join(' · ')+'</div>');
  if(meHas()){var ar=meNameAr(),n0=(ST.name||'').trim();box('About me',(n0&&ar?'<div class="pr-ar ar" lang="ar" dir="rtl">'+sayFill(ar,{name:n0},true)+'</div>':'')+'<div class="pr-big sm">'+esc(n0||'—')+'</div><div class="pr-s">'+[m.c?'From: '+m.c:'',m.lang?'I speak: '+m.lang:'',m.ph?'My phone: '+m.ph:'',m.home?'Family at home: '+m.home:''].filter(Boolean).map(esc).join(' · ')+'</div>'+(meMedOn()?'<div class="pr-med"><b>Medical:</b> '+[m.med,m.blood?'blood type '+m.blood:'',ST.medsShow&&medLine()?'medicines: '+medLine():''].filter(Boolean).map(esc).join(' · ')+'</div>':''));}
  kidNames().forEach(function(k0){var k=kidInfo(k0),P=sayBy('child-card-'+(k.g==='g'?'girl':'boy')),p2=kidPhone();if(!P)return;C.push('<div class="pr-card pr-kid"><div class="pr-ct">'+esc(k0)+' · if I am lost</div><div class="pr-ar ar" lang="ar" dir="rtl">'+sayFill(P.ar,{name:k.ar||k0,phone:p2||'____________'},true)+'</div><div class="pr-big sm">'+esc(p2||'____________')+'</div><div class="pr-s">'+sayFill(P.en,{name:k0,phone:p2||'____________'},true)+'</div></div>');});
  if(HJ){var D=hajjDates(curHajjYear()),rows=hajjSecs().filter(function(s){return typeof s.hd==='number'&&!s.night&&(s.hd<13||ST.stay13);}).map(function(s){return '<li><b>'+s.hd+'</b> '+esc(String(s.title).replace(/^\d+\s*Dhul Hijjah\s*·\s*/,''))+(D[s.hd]?' <i>'+fmtDate(D[s.hd])+'</i>':'')+'</li>';}).join('');if(rows)C.push('<div class="pr-card pr-days"><div class="pr-ct">The days of Hajj</div><ul>'+rows+'</ul></div>');}
  return '<h1>Pocket cards</h1><p class="pr-sub">Cut along the lines and keep one in every pocket — for when the phone dies.</p><div class="pr-cards">'+C.join('')+'</div>';}

/* ── #38 · hear the count through earphones: off until the pilgrim turns it on in the big counter (ST.sayCount); the device's own voice, nothing downloaded ── */
function sayCountOn(){return !!ST.sayCount&&('speechSynthesis' in window);}
function sayCount(t){if(!sayCountOn())return;var f=document.getElementById('focus');if(!f||!f.classList.contains('on'))return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(String(t));u.lang='en';u.rate=1;speechSynthesis.speak(u);}catch(e){}}
function updSayCount(){var b=document.getElementById('focusSay');if(!b)return;var ok='speechSynthesis' in window;b.hidden=!ok;b.classList.toggle('on',!!ST.sayCount);b.setAttribute('aria-pressed',ST.sayCount?'true':'false');}
function togSayCount(){if(!('speechSynthesis' in window)){toast('This phone has no voice for the count');return;}ST.sayCount=!ST.sayCount;saveST();updSayCount();vib(8);
  if(ST.sayCount){toast('Say the count is on — use earphones in the Haram');sayCount('Say the count is on');}else{try{speechSynthesis.cancel();}catch(e){}toast('Say the count is off');}}
function sayCountCnt(k,v,d){if(d<0){sayCount('Back to '+v);return;}if(k==='tawaf')sayCount(v>=7?'Tawaf complete':'Round '+v+' of 7');else sayCount(v>=7?'Sa’i complete, on Marwah':'Lap '+v+', on '+(v%2?'Marwah':'Safa'));}

/* ── #40 · my own dua list, full screen, one dua at a time (the dua reader with its wake lock) ── */
function openMyDuas(){if(!duas.length){toast('Your dua list is empty — add the first one');return;}closeSheet();var n=duas.length;dfList=duas.map(function(d,i){return {mine:i,t:'My dua '+(i+1)+' of '+n,tr:d.t,ar:'',tl:'',s:''};});var f=0;for(var i=0;i<n;i++){if(!duas[i].done){f=i;break;}}dfIdx=f;dfEnd=false;renderDF();}
var dfEnd=false;
function dfAsk(){var d=dfList[dfIdx];if(!d||d.mine===undefined)return;var i=d.mine;if(duas[i]&&!duas[i].done)togDua(i);if(dfIdx>=dfList.length-1){if(duas.every(function(q){return q.done;})){dfEnd=true;renderDF();}else{var nx=-1;duas.forEach(function(q,j){if(nx<0&&!q.done)nx=j;});dfIdx=nx<0?dfIdx:nx;renderDF();}return;}duaNav(1);}
function dfNewRound(){duaNewRound();dfEnd=false;dfIdx=0;renderDF();}
function myDuasReadBtn(id){return duas.length?'<button class="chip-btn df-read" id="'+id+'" onclick="openMyDuas()">'+mk('expand','mkt')+'Read my list full-screen</button>':'';}

/* ── #37 · tick the prayer just missed, straight from the prayer strip and Home's prayer card ── */
var ptJust='';
function ptMissHTML(N,d,exc){var pi=PT_NAMES.indexOf(N.name),prev=pi>0?PT_NAMES[pi-1]:null;if(!prev||exc||!onTrip()||expectedDay()!==ST.day)return '';var id=prev.toLowerCase(),key=dayKey()+'|'+id;
  if(d[id])return ptJust===key?' <span class="pt-tick done">'+mk('check','mkt')+ptLabel(prev)+'</span>':'';
  if(hajjOffMap(ST.day)[id])return '';
  return ' <button class="pt-tick" data-p="'+id+'" onclick="event.stopPropagation();ptTickPrev(\''+id+'\')" aria-label="Tick '+ptLabel(prev)+' as prayed">'+mk('check','mkt')+'Prayed '+ptLabel(prev)+'</button>';}
function ptTickPrev(id){var d=dailyChk[dayKey()]||{};if(d[id])return;togDaily(id);if(!(dailyChk[dayKey()]||{})[id])return;ptJust=dayKey()+'|'+id;renderPT_tick();
  var nm=PT_NAMES.filter(function(n){return n.toLowerCase()===id;})[0]||id;toast('✓ '+ptLabel(nm)+' ticked',false,'Undo',function(){if((dailyChk[dayKey()]||{})[id])togDaily(id);ptJust='';renderPT_tick();});}

/* ── #34 · Home on an ordinary trip day: today's plan from the itinerary in the Continue slot ── */
function homePlanHTML(){if(!onTrip())return '';var ed=expectedDay()||ST.day,it=itinDays()[ed-1];if(!it||it.hd)return '';
  return '<div class="card card-pad hplan" id="hPlan"><div class="hpl-h"><small>'+mk('calendar','mkt')+'Today’s plan · day '+ed+' of '+ST.tripLen+'</small><button class="xchip" onclick="goTab(\'plan\',\'prep\',\'it-'+(ed-1)+'\')" aria-label="Edit today’s plan">Edit →</button></div><div class="hpl-b"><span class="hpl-c">'+mk(it.city==='Makkah'?'kaaba':'dome','mkt')+esc(it.city)+'</span><span class="hpl-t">'+(it.cus?esc(it.e[1]):linkPlaces(it.e[1]))+'</span></div></div>';}

/* ── #39 · More opens on Duas during the trip and on After once it is over, until the pilgrim picks a segment themselves ── */
function moreAutoSub(){var dd=depDays();return (dd!==null&&dd<=0&&dd>=-ST.tripLen&&!ST.post)?'duas':'guide';}

/* ── #35 · Prepare during the trip: the hotel card, the itinerary and the vault first; the intention as one row; the paperwork folded into "Before you flew" ── */
var PREP_ORDER=['planHero','prepJumps','niyCard','cdCard','tlCard','catTiles','hotelCard','planContainer','kidsRow','itinCard','vaultCard'],PREP_FOLD=['planHero','cdCard','tlCard','catTiles','planContainer','kidsRow'],prepFoldOpen=false;
function prepTripOn(){return onTrip()&&!!ST.onboarded;}
function prepFoldTog(open){prepFoldOpen=open===undefined?!prepFoldOpen:!!open;var b=document.getElementById('prepBeforeB'),h=document.getElementById('prepBeforeH');if(b)b.hidden=!prepFoldOpen;if(h)h.setAttribute('aria-expanded',prepFoldOpen?'true':'false');var w=document.getElementById('prepBefore');if(w)w.classList.toggle('open',prepFoldOpen);}
function prepLayout(){var sub=document.getElementById('sub-plan-prep');if(!sub)return;var on=prepTripOn(),w=document.getElementById('prepBefore'),G=function(id){return document.getElementById(id);};
  if(on===(sub.getAttribute('data-trip')==='1')){if(on)prepFoldLbl();return;}
  if(on){if(!w){w=document.createElement('div');w.className='prep-before';w.id='prepBefore';w.innerHTML='<button class="pb-h" id="prepBeforeH" aria-expanded="false" aria-controls="prepBeforeB" onclick="prepFoldTog()"><span class="pb-t"><b>Before you flew</b><small id="prepBeforeS"></small></span><span class="sec-chev" aria-hidden="true">'+mk('chevd')+'</span></button><div class="pb-b" id="prepBeforeB" hidden></div>';}
    var J=G('prepJumps');['vaultCard','itinCard','hotelCard'].forEach(function(id){var e=G(id);if(e&&J)sub.insertBefore(e,J.nextSibling);});
    var n=G('niyCard');if(n)sub.appendChild(n);sub.appendChild(w);var B=w.querySelector('#prepBeforeB');PREP_FOLD.forEach(function(id){var e=G(id);if(e)B.appendChild(e);});
    sub.setAttribute('data-trip','1');prepFoldTog(false);prepFoldLbl();loadNiyyah();}
  else{PREP_ORDER.forEach(function(id){var e=G(id);if(e)sub.appendChild(e);});if(w&&w.parentNode)w.parentNode.removeChild(w);sub.removeAttribute('data-trip');
    var card=G('cdCard'),niy=G('niyCard');if(card&&niy&&!ST.dep)sub.insertBefore(card,niy);loadNiyyah();}}
function prepFoldLbl(){var s=document.getElementById('prepBeforeS');if(!s)return;var T=planTotals();s.textContent=T.done+' of '+T.tot+' items · countdown, timeline and checklists';}
/* a jump into the folded paperwork opens it first */
function prepReveal(id){var e=document.getElementById(id),b=document.getElementById('prepBeforeB');if(e&&b&&b.hidden&&b.contains(e))prepFoldTog(true);}

window.addEventListener('appinstalled',function(){askPersist();if(ST.instTip)return;ST.instTip=true;saveST();setTimeout(function(){toast('Installed — on Android, press and hold the Miqah icon for “I’m lost” and “Help numbers”',true);},1200);});
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
var obAfterCard=false;
function obAfterCardGo(){if(!obAfterCard)return;setTimeout(function(){if(!obAfterCard||ST.onboarded)return;if(document.querySelector('#lost.on,#help.on,#say.on'))return;obAfterCard=false;showOnboard(linkJourney==='hajj'?'hajj':undefined);},60);}
function initUI(){
  fillMarks();applyTheme();applyText();updSwipeSw();applyJourney();
  document.querySelectorAll('#verLbl,#verLbl2').forEach(function(e){e.textContent=APP_VERSION;});
  document.getElementById('quoteLine').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('tripLen').value=ST.tripLen;
  loadMe();
  renderPlan();renderRites();renderDaily();placesBoot();renderPlaces();renderDuas();tbRestore();renderTB();
  buildDeck();renderFC();renderPost();updRemSw();applySubs();updChip();renderItin();renderVault();renderDuaSec();renderWater();updToolsOrder();updHotelLbl();loadHotelInfo();loadNiyyah();updKidsSw();applyProfile();renderCntHd();renderJourneys();updEssSw();
  /* an “I’m lost” / “Help” shortcut opened before setup shows its card first — it works with nothing saved (911, 1966) — and setup follows when the card is closed */
  obAfterCard=!ST.onboarded&&!pendingGroup&&(linkGo==='lost'||linkGo==='help');
  if(!ST.onboarded&&!pendingGroup&&!obAfterCard)setTimeout(function(){showOnboard(linkJourney==='hajj'?'hajj':undefined);},400);
  kidsBestLbl();renderStories();qzJourneyNote();
  var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');
  if(cm){cm.classList.toggle('on',(ST.city||'Makkah')==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  renderKidNames();
  updPlan();updRites();updDaily();updPlaces();updStats();renderBadges();
  syncDay();
  /* H-04: an interrupted count (started < 4 h ago) reopens straight into the big counter; on trip the last tab is restored */
  var act=activeCount(),lg0=ST.log||{},fresh=act&&lg0[act+'Start']&&Date.now()-lg0[act+'Start']<4*3600000;
  if(linkGo){var g=GO_TARGETS[linkGo];goTab(g[0],g[1]||undefined);
    /* G4 #46: the home-screen shortcuts open the stranger cards straight away */
    if(linkGo==='lost')showLost();if(linkGo==='help')showHelp();
    if(linkGo==='count'&&fresh)enterFocus(act);return;}
  if(fresh){goTab('umrah');goSub('umrah','count',true);enterFocus(act);}
  else if(onTrip()&&ST.tab&&ST.tab!=='home'&&document.getElementById('view-'+ST.tab))goTab(ST.tab);
  else if(depLinked)goTab('plan','prep');
  else goTab('home');
}
/* Places: the sticky filter row is see-through until it sticks, so the hero's shadow and halo never end in a hard edge */
document.addEventListener('DOMContentLoaded',function(){var s=document.querySelector('.pl-sent'),row=document.querySelector('.pills.pl-sticky');if(!s||!row||!window.IntersectionObserver)return;row.classList.add('io');
  new IntersectionObserver(function(e){row.classList.toggle('stuck',!e[e.length-1].isIntersecting);},{rootMargin:'-57px 0px 0px 0px'}).observe(s);});
document.addEventListener('DOMContentLoaded',function(){loadAll();pendingGroup=parseGroupLink();applyDepLink();parseGoLink();initUI();if(pendingGroup)setTimeout(function(){showGroupSheet(pendingGroup);},350);else if(pendingDep)setTimeout(depLinkSheet,350);registerSW();updBkLine();iabShow();bkUndoOffer();if(isStandalone())askPersist();setTimeout(bkNudgeCheck,3000);g6Init();setTimeout(whatsNewCheck,1400);});

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
  /* the leading space goes, except after an element that carries text ("<span>8</span> big-button questions" keeps its word gap) */
  var pv=tn.previousSibling,keep=pv&&pv.nodeType===1&&!/^(svg|BR)$/.test(pv.tagName)&&/\S$/.test(pv.textContent||'');
  var tp=document.createElement('template');tp.innerHTML=out.replace(/^\s+/,keep?' ':'');tn.parentNode.replaceChild(tp.content,tn);
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
/* ════════════════════════ 6.10 · TRUST AND POLISH (group 6: #59 #60 #61 #62 #64 #65) ════════════════════════ */
/*CITE-SCAN*/
/* 6.10 (#60): the one place that knows what a citation looks like. Returns every numbered hadith and Quran reference in a text as
   {k:'bukhari:1773',i:index}. The Sources page, the "used in" links and the smoke check all read citations through this. */
var CITE_SLUG={'bukhari':'bukhari','muslim':'muslim','tirmidhi':'tirmidhi','abu dawud':'abudawud','nasai':'nasai','ibn majah':'ibnmajah','ahmad':'ahmad','musnad ahmad':'ahmad'};
function citeScan(t){var out=[],m,s=String(t||'');
  var H=/(Musnad Ahmad|Bukhari|Muslim|Tirmidhi|Abu Dawud|Nasa[’']?i|Ibn Majah|Ahmad)\s+(\d{1,5}(?![\d:])(?:(?:\s*[,–-]\s*|\s+and\s+)\d{3,5}(?![\d:]))*)/g;
  while((m=H.exec(s))){var c=CITE_SLUG[m[1].toLowerCase().replace(/[’']/g,'')];(m[2].match(/\d+/g)||[]).forEach(function(n){out.push({k:c+':'+n,i:m.index});});}
  var T=/Tirmidhi, after hadith (\d+)/g;while((m=T.exec(s)))out.push({k:'tirmidhi:'+m[1],i:m.index});
  var V='\\d{1,3}:\\d{1,3}(?:[–-]\\d{1,3})?',Q=new RegExp('Quran\\s+('+V+'(?:\\s*(?:[,;]|and)\\s*'+V+')*)','g'),one=new RegExp(V,'g');
  while((m=Q.exec(s)))(m[1].match(one)||[]).forEach(function(v){out.push({k:'quran:'+v.replace('–','-'),i:m.index});});
  var P=new RegExp('\\(('+V+')\\)','g');while((m=P.exec(s)))out.push({k:'quran:'+m[1].replace('–','-'),i:m.index});
  var S=/(?:Quran\s+|Surah [A-Za-z’'‘-]+ \()(\d{1,3})(?![\d:])/g;while((m=S.exec(s)))out.push({k:'quran:'+m[1],i:m.index});
  return out;}
/*END-CITE-SCAN*/
/* ── #61 “Checked on” ── */
function ckDate(iso){var d=new Date(iso+'T00:00:00');return isNaN(d)?String(iso):d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
function ckSrc(it){var k=it&&it.cks;if(k==='moh'&&journey()==='hajj')k='mohh';return k?CK_SRC[k]:null;}
/* the one line every regulation, contact, transport and permit item ends with: the day it was last checked, and the official page where a verified one exists */
function ckLine(it){if(!it||!it.ck)return '';var s=ckSrc(it);
  return '<small class="ck-on">Checked '+ckDate(it.ck)+(s?' · official page (needs signal): <a href="'+s[1]+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+s[0]+mk('out','mkt')+'</a>':' · rules change, so confirm before you travel')+'</small>';}

/* ── #62 Report a correction ── */
var CORR_TO='m.farhan.bava@gmail.com',corrCur=null;
function corrBtn(kind,id){return '<button type="button" class="corr" onclick="event.stopPropagation();corrSheet(\''+kind+'\',\''+String(id).replace(/[^\w-]/g,'')+'\')">'+mk('pen','mkt')+'Report a correction</button>';}
function corrItem(kind,id){var t='',w='';
  if(kind==='learn'){var m=/^([a-z]+)(\d+)$/.exec(id)||[],c=LN_CARDS.filter(function(x){return x[3]===m[1];})[0],it=c&&c[2][+m[2]];t=it?it.t:'';w='Learn';}
  else if(kind==='dua'){t=(DUAS[+id]||{}).t||'';w='Dua';}
  else if(kind==='step'){RITES.concat(HAJJ_RITES).forEach(function(p){p.steps.forEach(function(x){if(x.id===id)t=(p.hd?riteStepView(x):x).b;});});w='Step';}
  else if(kind==='place'){t=(placeById(id)||{}).n||'';w='Place';}
  else if(kind==='pack'){[RAM_PACK,HEAT_PACK,WAY_PACK].forEach(function(P){var x=pkOf(P,id);if(x)t=x.t;});w='Guide';}
  else if(kind==='source'){t=id.replace('_',' ');w='Source';}
  return {kind:kind,id:id,w:w,t:fcText(dropEmoji(t))};}
function corrText(note){var c=corrCur||{};return (note||'').trim()+'\n\n— — —\nItem: '+c.kind+':'+c.id+'\nTitle: '+c.t+'\nApp version: '+APP_VERSION+'\nJourney: '+journey()+(journey()==='hajj'?' ('+hajjType()+')':'')+'\n';}
function corrSheet(kind,id){corrCur=corrItem(kind,id);var c=corrCur;
  openSheet('<div class="sheet-h">'+mk('pen')+'</div><h3>Report a correction</h3><p>'+esc(c.w)+': <b id="corrT">'+esc(c.t||c.id)+'</b></p>'
    +'<label class="care-l" for="corrNote">What should be corrected? A source helps.</label><textarea class="pnotes" id="corrNote" maxlength="1500" placeholder="e.g. the hadith number, a date or a rule that has changed"></textarea>'
    +'<p class="corr-p">Opens your mail app with this item, the app version and your note filled in. Miqah sends nothing itself: no server, no account.</p>'
    +'<button class="btn tall" id="corrGo" onclick="corrSend()">'+mk('share','mkt')+'Open my mail app</button><button class="btn ghost" id="corrCopy" onclick="corrCopy()">Copy the report instead</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>');
  setTimeout(function(){var e=document.getElementById('corrNote');if(e)try{e.focus({preventScroll:true});}catch(x){}},120);}
function corrHref(note){var c=corrCur||{};return 'mailto:'+CORR_TO+'?subject='+encodeURIComponent('Miqah correction · '+c.kind+':'+c.id+' · '+c.t)+'&body='+encodeURIComponent(corrText(note));}
function corrSend(){var e=document.getElementById('corrNote'),note=e?e.value:'';if(!note.trim()){toast('Write what should be corrected first');if(e)e.focus();return;}
  var h=corrHref(note);try{window.location.href=h;}catch(x){}toast('Opening your mail app — if nothing opens, copy the report instead',true);}
function corrCopy(){var e=document.getElementById('corrNote'),txt='To: '+CORR_TO+'\n'+corrText(e?e.value:'');
  var done=function(){toast('Copied — paste it into an email to '+CORR_TO,true);};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,function(){toast('Could not copy — write to '+CORR_TO);});else toast('Write to '+CORR_TO);}
function lnTxt(a){return a.textContent.replace(/Report a correction/g,'').toLowerCase();}

/* ── #59 Sources page (built from CITES, #60) ── */
var CITE_COLS=[['quran','Quran'],['bukhari','Bukhari'],['muslim','Muslim'],['abudawud','Abu Dawud'],['tirmidhi','Tirmidhi'],['nasai','Nasai'],['ibnmajah','Ibn Majah'],['ahmad','Musnad Ahmad']];
function citeColName(c){var r=CITE_COLS.filter(function(x){return x[0]===c;})[0];return r?r[1]:c;}
function citeName(e){return citeColName(e.c)+' '+String(e.n).replace('-','–');}
var citeIdx=null,citeActs=[];
/* where each citation is used: every content array is read through citeScan, so the list can never drift from the text */
function citeUses(){if(citeIdx)return citeIdx;var I={},HJ=journey()==='hajj';citeActs=[];
  function add(text,label,go){var seen={};citeScan(fcText(typeof text==='string'?text:JSON.stringify(text))).forEach(function(o){if(seen[o.k])return;seen[o.k]=1;var L=I[o.k]=I[o.k]||[];if(L.some(function(u){return u.l===label;}))return;var u={l:label};if(go){u.a=citeActs.length;citeActs.push(go);}L.push(u);});}
  var T=function(s){return fcText(dropEmoji(String(s||'')));};
  QUOTES.forEach(function(q){add(q,'Home · a daily quote',function(){goTab('home');});});
  PLAN.forEach(function(s){s.items.forEach(function(it){add(it,'Plan · '+T(it.label),forMe(it)?function(){goTab('plan','prep');setTimeout(function(){openPlanSec(s.id);},80);}:null);});});
  LN_CARDS.forEach(function(c){c[2].forEach(function(it,i){add(it,'Learn · '+T(it.t),forMe(it)?function(){fcOpenLearn(c[3]+i);}:null);});});
  RITES.forEach(function(p){add({hn:p.hn,kn:p.kn,sub:p.sub},'Umrah steps · '+T(p.title),function(){goTab('umrah','steps');});p.steps.forEach(function(st){add(st,'Umrah steps · '+T(st.b),function(){goTab('umrah','steps');setTimeout(function(){openRiteStep(st.id);},80);});});});
  HAJJ_RITES.forEach(function(p){var go=HJ?function(){goTab('umrah','steps');}:null;add({hn:p.hn,kn:p.kn,sub:p.sub},'Hajj steps · '+T(p.title),go);p.steps.forEach(function(st){add(st,'Hajj steps · '+T(st.b),HJ?function(){goTab('umrah','steps');setTimeout(function(){openRiteStep(st.id);},80);}:null);});});
  DUAS.forEach(function(d,i){add(d,'Duas · '+T(d.t),function(){openDua(i);});});
  PLACES.forEach(function(p){add(p,'Places · '+T(p.n),function(){openPlace(p.id);});});
  QUIZ_LEVELS.forEach(function(L){add(L,'Quiz · '+T(L.name),function(){goTab('plan','quiz');});});
  add(KIDSQ,'Kids quiz',function(){goTab('plan','quiz','kidsCard');});
  KIDS_STORIES.forEach(function(s){add(s,'Kids story · '+T(s.title),forMe(s)?function(){openStory(s.id);}:null);});
  DAILY.forEach(function(g){add({hn:g.hn},'Daily · '+T(g.title),function(){goTab('daily','today');});g.items.forEach(function(it){add(it,'Daily · '+T(it.label),function(){goTab('daily','today');});});});
  TROUBLE_HAJJ.forEach(function(g){add(g,'Hajj help · '+T(g.t),function(){hajjTroubleSheet(g.id);});});
  RAMI_PROB.forEach(function(g){add(g,'Pebble problems · '+T(g.t),null);});
  Object.keys(TB_HAJJ).forEach(function(k){add(TB_HAJJ[k],'Tasbih · '+T(TB_HAJJ[k].t),function(){goTab('daily','tools','tbCard');});});
  Object.keys(HAJJ_TYPES).forEach(function(k){add(HAJJ_TYPES[k],'Hajj type · '+T(HAJJ_TYPES[k].t),null);});
  HAJJ_RULINGS.forEach(function(r){add(r,'Hajj rulings · '+T(r.t),function(){rulingSheet(r.id);});});
  RAM_PACK.forEach(function(x){add(x,'Ramadan · '+T(x.t),function(){ramSheet(x.id);});});
  HEAT_PACK.forEach(function(x){add(x,'Heat plan · '+T(x.t),function(){heatSheet(x.id);});});
  WAY_PACK.forEach(function(x){add(x,'Wayfinding · '+T(x.t),/^go-/.test(x.id)?function(){goSheet(x.id);}:/^bound-/.test(x.id)?function(){waySheet(x.id);}:null);});
  add([HAJJ_PATH,BADGES,SAY,SCAMS.length?[]:[]],'Learn · Hajj in 5 days',null);
  CITES.forEach(function(e){var k=e.c+':'+e.n;if(e.a||!I[k]){(I[k]=I[k]||[]).push({l:'Screens and cards in the app'});}});
  citeIdx=I;return I;}
function citeGo(n){var f=citeActs[n];if(!f)return;closeSheet();setTimeout(function(){try{f();}catch(e){}},60);}
function citeUsesHTML(e){var U=citeUses()[e.c+':'+e.n]||[],h=U.map(function(u,i){return (u.a!==undefined?'<button type="button" class="lnk src-l'+(i>2?' more':'')+'" onclick="citeGo('+u.a+')">'+esc(u.l)+'</button>':'<span class="src-l'+(i>2?' more':'')+'">'+esc(u.l)+'</span>');}).join('');
  if(U.length>3)h+='<button type="button" class="lnk src-m" aria-expanded="false" onclick="var p=this.parentNode,o=p.classList.toggle(\'all\');this.setAttribute(\'aria-expanded\',o);this.textContent=o?\'Show fewer\':\'and '+(U.length-3)+' more\'">and '+(U.length-3)+' more</button>';
  return h;}
function citeRowHTML(e){return '<div class="src-r" id="src-'+e.c+'-'+String(e.n).replace(/[^\d]/g,'_')+'" data-q="'+esc((citeName(e)+' '+e.n+' '+e.t).toLowerCase())+'"><div class="src-k"><b>'+esc(citeName(e))+'</b>'+(e.g?'<span class="src-g">'+esc(e.g)+'</span>':'')+'</div><p class="src-t">'+esc(e.t)+'</p><div class="src-u"><span class="src-ul">Used in</span>'+citeUsesHTML(e)+'</div></div>';}
function citeColTog(b){var bd=b.nextElementSibling,o=bd.hidden;if(o&&!bd.innerHTML){var c=b.getAttribute('data-c');bd.innerHTML=CITES.filter(function(e){return e.c===c;}).map(citeRowHTML).join('');}bd.hidden=!o;b.setAttribute('aria-expanded',o?'true':'false');}
function citeFilter(v){var q=String(v||'').trim().toLowerCase(),n=0;document.querySelectorAll('#srcList .src-c').forEach(function(c){var b=c.querySelector('.src-ch'),bd=c.querySelector('.src-cb'),hit=0;
    if(q&&!bd.innerHTML){bd.innerHTML=CITES.filter(function(e){return e.c===b.getAttribute('data-c');}).map(citeRowHTML).join('');}
    bd.querySelectorAll('.src-r').forEach(function(r){var ok=!q||r.getAttribute('data-q').indexOf(q)>-1;r.hidden=!ok;if(ok)hit++;});
    if(q){bd.hidden=!hit;b.setAttribute('aria-expanded',hit?'true':'false');c.hidden=!hit;n+=hit;}else{c.hidden=false;bd.hidden=true;b.setAttribute('aria-expanded','false');}});
  var e=document.getElementById('srcNone');if(e)e.hidden=!q||n>0;}
function sourcesSheet(openKey){citeIdx=null;var nH=CITES.filter(function(e){return e.c!=='quran';}).length,nQ=CITES.length-nH,on=CITES.length?CITES.map(function(e){return e.v;}).sort().pop():'';
  var h='<div class="sheet-h">'+mk('book')+'</div><h3>Sources</h3><p>Every numbered hadith and Quran reference in Miqah: '+nH+' hadith and '+nQ+' Quran references, each with the sentence that carries it and where it is used.</p>'
    +'<div class="note src-note" id="srcNote"><b>Numbering.</b> Hadith numbers follow sunnah.com; Sahih Muslim is numbered as in the Abdul Baqi edition. The Quran is cited as surah:ayah. A grade is shown only where the app states one. Reports the app cites without a number (such as the Muwatta) are not listed here.<br><b>Checked</b> against the source texts on '+ckDate(on)+'. Scholar review is still pending.</div>'
    +'<label class="care-l" for="srcQ">Find a reference</label><input class="srch" id="srcQ" type="search" placeholder="e.g. 1773, 2:196 or Arafah" autocomplete="off" oninput="citeFilter(this.value)">'
    +'<div class="pk-list" id="srcList">'+CITE_COLS.map(function(c){var n=CITES.filter(function(e){return e.c===c[0];}).length;return n?'<div class="src-c"><button type="button" class="src-ch" data-c="'+c[0]+'" aria-expanded="false" onclick="citeColTog(this)"><b>'+c[1]+'</b><span>'+n+'</span><i class="acc-c" aria-hidden="true">▶</i></button><div class="src-cb" hidden></div></div>':'';}).join('')+'</div>'
    +'<p class="src-none" id="srcNone" hidden>Nothing matches. Try the number alone.</p>'
    +'<button class="btn ghost" onclick="corrSheet(\'source\',\'general\')">'+mk('pen','mkt')+'Report a wrong reference</button><button class="btn ghost tall" onclick="closeSheet()">Close</button>';
  openSheet(h);if(openKey){var b=document.querySelector('#srcList .src-ch[data-c="'+openKey+'"]');if(b)citeColTog(b);}}

/* ── #64 What’s new ── */
var WHATS_NEW={v:'6.10.0',items:[
  ['book','Sources','Every hadith and Quran reference in one list, with its number and where the app uses it. More › Settings › Sources.'],
  ['calendar','“Checked” dates','Visa, vaccine, permit, phone-number and transport rules now show the day they were last checked, with the official page where there is one.'],
  ['pen','Report a correction','A button under every article, dua, step and place opens an email with the item already named.'],
  ['scroll','Trip journal','One line a day on Daily › Today. It stays on this phone, goes into your backup, and one line can sit on your keepsake.']]};
function whatsNewSheet(){var W=WHATS_NEW;
  openSheet('<div class="sheet-h">'+mk('info')+'</div><h3>What’s new</h3><p>Version '+esc(W.v)+'</p><div class="pk-list wn-list" id="wnList">'+W.items.map(function(x){return '<div class="wn-r"><span class="wn-i">'+mk(x[0])+'</span><div><b>'+esc(x[1])+'</b><p>'+esc(x[2])+'</p></div></div>';}).join('')+'</div>'
    +'<p class="corr-p">Find this again in More › Settings › What’s new.</p><button class="btn tall" id="wnOk" onclick="closeSheet()">Got it</button>');}
/* once after an update: a phone that has opened an earlier version sees the sheet on the first quiet launch of this one. A first install, and a profile from before 6.10 (no seenVer yet), are marked silently. The registry itself is cites.js. */
function whatsNewCheck(){if(!ST.onboarded)return false;if(!ST.seenVer){ST.seenVer=APP_VERSION;return false;} /* kept in memory: it is written with the next save, so opening the app never rewrites storage by itself */
 if(ST.seenVer===APP_VERSION)return false;
  if(document.querySelector('.sheet-o.on,.focus.on,#obSheet.on'))return false;
  ST.seenVer=APP_VERSION;saveST();if(WHATS_NEW.v!==APP_VERSION)return false;whatsNewSheet();return true;}

/* ── #65 Private trip journal: one line a day, on this phone only (ST.journal → us-settings, so it is in every backup) ── */
var JR_MAX=160;
function jrAll(){return (ST.journal&&typeof ST.journal==='object')?ST.journal:{};}
function jrKeys(){return Object.keys(jrAll()).filter(function(k){return jrAll()[k]&&jrAll()[k].t;}).sort();}
/* the date the card writes to: the day being viewed once the trip has begun (never a day still to come), today before it */
function jrDay(){var ex=ST.dep?expectedDay():null;if(!ex)return {d:new Date(),n:0};var n=ST.day||1,d=dayDateObj(n);if(!d)return {d:new Date(),n:0};return {d:d,n:n,future:n>ex};}
function jrCityFor(J){if(!J.n)return '';var hd=null;try{hd=journey()==='hajj'?tripHajjDay(J.n):null;}catch(e){}if(hd===9)return 'Arafah';if(hd>=8&&hd<=13)return 'Mina';return itinCityOn(J.d)||ST.city||'';}
function jrFmt(iso,long){var d=new Date(iso+'T00:00:00');return isNaN(d)?iso:d.toLocaleDateString('en-GB',long?{weekday:'long',day:'numeric',month:'long',year:'numeric'}:{weekday:'short',day:'numeric',month:'short'});}
function renderJournal(){var a=document.getElementById('jrCard');if(!a)return;var J=jrDay(),iso=isoOf(J.d),e=jrAll()[iso]||{},n=jrKeys().length,city=e.c!==undefined&&e.t?e.c:jrCityFor(J);
  var h='<div class="card card-pad jr" id="jrBox"><h3>'+mk('scroll')+'One line for today</h3>';
  if(J.future)h+='<p class="jr-meta" id="jrMeta">'+esc(jrFmt(iso))+' · Day '+J.n+'</p><p class="jr-wait">This day has not come yet. Its line opens on the day.</p>';
  else h+='<p class="jr-meta" id="jrMeta">'+esc(jrFmt(iso))+(J.n?' · Day '+J.n:'')+'</p>'
    +'<label class="care-l" for="jrIn">What do you want to remember from today?</label><textarea class="pnotes jr-in" id="jrIn" rows="2" maxlength="'+JR_MAX+'" data-iso="'+iso+'" placeholder="One line, in your own words" oninput="jrCount()" onchange="jrSave()">'+esc(e.t||'')+'</textarea>'
    +'<div class="jr-row"><label class="care-l" for="jrCity">Where</label><input class="srch jr-city" id="jrCity" maxlength="40" value="'+esc(city)+'" placeholder="City or place" autocomplete="off" onchange="jrSave()"><span class="jr-cnt" id="jrCnt" aria-live="off">'+(e.t||'').length+'/'+JR_MAX+'</span></div>';
  h+='<div class="jr-foot"><small>'+mk('lock','mkt')+'Kept only on this phone, and in your backup.</small>'+(n?'<button type="button" class="lnk" id="jrAllBtn" onclick="jrSheet()">My '+n+' line'+(n===1?'':'s')+' →</button>':'')+'</div></div>';
  a.innerHTML=h;}
function jrCount(){var i=document.getElementById('jrIn'),c=document.getElementById('jrCnt');if(i&&c)c.textContent=i.value.length+'/'+JR_MAX;}
function jrSave(){var i=document.getElementById('jrIn'),c=document.getElementById('jrCity');if(!i)return;var iso=i.getAttribute('data-iso'),t=i.value.replace(/\s+/g,' ').trim().slice(0,JR_MAX),had=!!(jrAll()[iso]&&jrAll()[iso].t);
  if(!ST.journal||typeof ST.journal!=='object')ST.journal={};
  if(t)ST.journal[iso]={t:t,c:c?c.value.trim().slice(0,40):''};else{delete ST.journal[iso];if(ST.jrPick===iso)delete ST.jrPick;}
  saveST();if(t&&!had)toast('Saved to your journal',true);
  /* refresh the count link without stealing the caret from the field being typed in */
  var act=document.activeElement&&document.activeElement.id;renderJournal();if(act==='jrIn'||act==='jrCity'){var el=document.getElementById(act);if(el)try{el.focus({preventScroll:true});}catch(x){}}}
function jrPick(){var k=ST.jrPick,e=k&&jrAll()[k];return e&&e.t?{iso:k,t:e.t,c:e.c||''}:null;}
function jrSetPick(iso){ST.jrPick=ST.jrPick===iso?null:iso;if(!ST.jrPick)delete ST.jrPick;saveST();jrSheet();toast(ST.jrPick?'This line will sit on your next keepsake':'Removed from the keepsake',true);}
function jrDel(iso){var e=jrAll()[iso];if(!e)return;var keep=JSON.stringify(e),wasPick=ST.jrPick===iso;delete ST.journal[iso];if(wasPick)delete ST.jrPick;saveST();renderJournal();
  if(jrKeys().length)jrSheet();else closeSheet();
  toast('Line deleted',true,'Undo',function(){ST.journal[iso]=JSON.parse(keep);if(wasPick)ST.jrPick=iso;saveST();renderJournal();jrSheet();});}
function jrSheet(){var K=jrKeys().reverse(),all=jrAll();
  openSheet('<div class="sheet-h">'+mk('scroll')+'</div><h3>My journal</h3><p>'+K.length+' line'+(K.length===1?'':'s')+', newest first. Stored only on this phone; export a backup in More › Settings to keep them.</p><div class="pk-list" id="jrList">'
    +K.map(function(k){var e=all[k],on=ST.jrPick===k;return '<div class="jr-e" id="jr-'+k+'"><small class="jr-d">'+esc(jrFmt(k,true))+(e.c?' · '+esc(e.c):'')+'</small><p class="jr-t">'+esc(e.t)+'</p><div class="jr-acts"><button type="button" class="chip-btn jr-pick'+(on?' on':'')+'" aria-pressed="'+(on?'true':'false')+'" onclick="jrSetPick(\''+k+'\')">'+mk(on?'check':'cards','mkt')+(on?'On my keepsake':'Put on my keepsake')+'</button><button type="button" class="chip-btn" aria-label="Delete the line for '+esc(jrFmt(k))+'" onclick="jrDel(\''+k+'\')">'+mk('trash','mkt')+'Delete</button></div></div>';}).join('')
    +'</div><p class="corr-p">The chosen line is drawn on the next keepsake image you make (Umrah or Hajj).</p><button class="btn ghost tall" onclick="closeSheet()">Close</button>');}
/* the chosen line on a keepsake canvas: wrapped lines and the extra height they need (0 when no line is chosen) */
function jrKeep(){var p=jrPick();if(!p)return null;var c=document.createElement('canvas').getContext('2d');c.font='500 30px '+KB;var L=kWrap(c,'“'+p.t+'”',860).slice(0,4);return {L:L,k:jrFmt(p.iso)+(p.c?' · '+p.c:''),h:70+L.length*44};}
function jrDraw(x,J,y){if(!J)return;x.save();x.textAlign='center';kLabel(x,'From my journal · '+J.k,540,y,24);x.font='500 30px '+KB;x.fillStyle=K.ihram;J.L.forEach(function(l,i){x.fillText(l,540,y+48+i*44);});x.restore();}

function g6Init(){var e=document.getElementById('telCk');if(e)e.innerHTML='Numbers checked '+ckDate(CK);
  e=document.getElementById('linksCk');if(e)e.innerHTML='Links checked '+ckDate(CK)+' · they open in your browser and need signal';
  e=document.getElementById('verLbl3');if(e)e.textContent=APP_VERSION;renderJournal();}
/* canvas exporters wait for their webfonts (no Georgia/Arial flash on the keepsake, certificate or progress card) */
['makeKeepsake','makeHajjKeepsake','shareCard','makeCertGo'].forEach(function(n){var f=window[n];if(typeof f!=='function')return;window[n]=function(){var a=arguments,s=this;kFonts(function(){f.apply(s,a);});};});
