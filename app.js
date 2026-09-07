/* Umrah Strivers — application logic */
/* Release note: bump APP_VERSION here AND in sw.js for every release (the SW cache name is derived from it). */
var APP_VERSION='4.11.0';
var APP_URL='https://umrah-strivers.vercel.app/';
/* ════════════════════════ STATE ════════════════════════ */
var ST={day:1,tripLen:10,theme:'light',tab:'home',dep:'',umrahs:0,tawaf:0,sai:0,quizBest:0,city:'Makkah'};
var tasbih={};
var planChk={},riteChk={},dailyChk={},placeVis={},earned={};

function loadAll(){
  try{
    var s=localStorage.getItem('us-settings');if(s)ST=Object.assign(ST,JSON.parse(s));
    planChk=JSON.parse(localStorage.getItem('us-plan')||'{}');
    riteChk=JSON.parse(localStorage.getItem('us-rites')||'{}');
    dailyChk=JSON.parse(localStorage.getItem('us-daily')||'{}');
    placeVis=JSON.parse(localStorage.getItem('us-places')||'{}');
    earned=JSON.parse(localStorage.getItem('us-badges')||'{}');
    tasbih=JSON.parse(localStorage.getItem('us-tasbih')||'{}');
  }catch(e){}
}
function saveST(){localStorage.setItem('us-settings',JSON.stringify(ST));}
function save(k,o){localStorage.setItem(k,JSON.stringify(o));}

/* ════════════════════════ GENERIC UI ════════════════════════ */
function toast(m,gold,actLabel,actFn){var c=document.getElementById('toastC');if(!c)return;var t=document.createElement('div');t.className='toast'+(gold?' gold':'')+(actLabel?' act':'');t.setAttribute('role','status');t.textContent=m;
  if(actLabel){var b=document.createElement('button');b.textContent=actLabel;b.onclick=function(){t.remove();if(actFn)actFn();};t.appendChild(b);}
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
/* brother/sister profile (P-10): who:'m'|'w' rows are shown & counted only for the matching profile */
function forMe(it){return !it.who||!ST.profile||it.who===ST.profile;}
function setProfile(v){ST.profile=v||'';saveST();applyProfile();renderPlan();updPlan();renderRites();updRites();vib(8);}
function applyProfile(){document.querySelectorAll('#profSeg button,#obProf button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-p')||'')===(ST.profile||''));});}
/* optional PLAN sections (P-32): sec.opt names an ST flag */
function activePlan(){return PLAN.filter(function(sc){return !sc.opt||ST[sc.opt];});}
function findPlanItem(id){var f=null;PLAN.forEach(function(sc){sc.items.forEach(function(it){if(it.id===id)f=it;});});return f;}
/* counts: with a profile, mismatched rows vanish; with no profile, gendered rows are visible but only count once ticked */
function planCounts(items){var tot=0,done=0;items.forEach(function(it){if(!forMe(it))return;var on=!!planChk[it.id];if(it.who&&!ST.profile&&!on)return;tot++;if(on)done++;});return {tot:tot,done:done};}
function planTotals(){var tot=0,done=0,secs={};activePlan().forEach(function(sc){var c=planCounts(sc.items);secs[sc.id]=c;tot+=c.tot;done+=c.done;});return {tot:tot,done:done,secs:secs,pct:tot?Math.round(done/tot*100):0};}
function riteCounts(steps){var tot=0,done=0,seen={};steps.forEach(function(st){if(!forMe(st))return;var on=!!riteChk[st.id];
  if(st.pair&&!ST.profile){if(seen[st.pair])return;seen[st.pair]=true;tot++;if(steps.some(function(x){return x.pair===st.pair&&riteChk[x.id];}))done++;return;}
  if(st.who&&!ST.profile&&!on)return;tot++;if(on)done++;});return {tot:tot,done:done};}
function riteTotals(){var tot=0,done=0;RITES.forEach(function(ph){var c=riteCounts(ph.steps);tot+=c.tot;done+=c.done;});return {tot:tot,done:done};}
function togKids(){ST.kids=!ST.kids;saveST();updKidsSw();renderPlan();updPlan();vib(10);if(ST.kids){toast('👨‍👩‍👧 Children’s to-dos added to your timeline');setTimeout(function(){if(document.getElementById('view-plan').classList.contains('on'))openPlanSec('kids');},150);}}
function updKidsSw(){document.querySelectorAll('#kidsSw,#kidsSw2').forEach(function(sw){sw.classList.toggle('on',!!ST.kids);sw.setAttribute('aria-checked',ST.kids?'true':'false');});}
/* text size (M-09) */
function applyText(){document.documentElement.setAttribute('data-text',ST.text||'');document.querySelectorAll('#textSeg button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-t')||'')===(ST.text||''));});var o=document.getElementById('obText');if(o){o.classList.toggle('on',ST.text==='lg');o.setAttribute('aria-checked',ST.text==='lg'?'true':'false');}}
function setText(v){ST.text=v||'';saveST();applyText();vib(8);}
/* generic bottom sheet (reset, image export, certificate name…) */
function openSheet(html){var o=document.getElementById('gSheet'),b=document.getElementById('gSheetBody');if(!o)return;b.innerHTML=html;o.classList.add('on');}
function closeSheet(){var o=document.getElementById('gSheet');if(o)o.classList.remove('on');}
function vib(ms){if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}
function toggleTheme(){ST.theme=ST.theme==='light'?'dark':'light';applyTheme();saveST();}
function applyTheme(){document.documentElement.setAttribute('data-theme',ST.theme);document.getElementById('themeIcon').textContent=ST.theme==='dark'?'☀️':'🌙';var t=document.getElementById('dmTgl');if(t){t.classList.toggle('on',ST.theme==='dark');t.setAttribute('aria-checked',ST.theme==='dark'?'true':'false');}var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',ST.theme==='dark'?'#0B120F':'#0E3B2E');}
function togSec(el){var sec=el.closest('.sec');sec.classList.toggle('shut');el.setAttribute('aria-expanded',sec.classList.contains('shut')?'false':'true');}
function setRing(id,pct){var el=document.getElementById(id);if(el)el.style.strokeDashoffset=239*(1-Math.min(100,pct)/100);}
function goTab(t,sub,anchor){ST.tab=t;saveST();
  var view=document.getElementById('view-'+t);if(!view)return;
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('on');});
  view.classList.add('on');
  document.querySelectorAll('.nav button').forEach(function(e){var on=e.getAttribute('data-v')===t;e.classList.toggle('on',on);if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');});
  if(sub)goSub(t,sub,true);
  if(t==='daily'){updDaily();updStats();loadPT();renderTB();}
  if(t==='places')updPlaces();
  if(t==='umrah')updRites();
  if(t==='plan')updPlan();
  if(t==='home')renderHome();
  updChip();
  if(!ST.segNudged&&view.querySelector('.seg')){ST.segNudged=true;saveST();var on=view.querySelector('.seg button.on');if(on)on.classList.add('nudge');}
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='count'&&cntStarted())anchor=cntActive()+'Card';
  if(!anchor&&t==='umrah'&&(ST.sub||{}).umrah==='steps'){focusRites(false);var nxr=nextRite();anchor=nxr?'rw-'+nxr.st.id:'riteDone';}
  if(anchor){requestAnimationFrame(function(){setTimeout(function(){jumpTo(anchor,true);},30);});}
  else window.scrollTo({top:0,behavior:'smooth'});}
/* deep links used by chips in checklists and knowledge bodies (M-05) */
function goRef(tab,sub,anchor){if(tab==='places')placesReset();goTab(tab,sub||null,anchor||null);}
function placesReset(){if(cityFilter!=='all')filterCity('all');var sr=document.getElementById('plSearch');if(sr&&sr.value){sr.value='';renderPlaces();}}
function openPlace(id){var p=PLACES.filter(function(x){return x.id===id;})[0];if(!p)return;placesReset();var el=document.getElementById('pl-'+id);if(el)el.classList.add('open');goTab('places',null,'pl-'+id);}
function openTour(){placesReset();goTab('places',null,'tourCard');}
function goPost(enable){if(enable&&!ST.post){ST.post=true;saveST();renderPost();}goTab('more','guide','postCard');}
function startPost(){goPost(true);toast('🌱 Post-Umrah mode on — 30 days, 3 habits',true);}
function refChip(it){var q=function(v){return v?'\''+v+'\'':'null';};if(typeof it.go==='string')return '<button class="xchip" onclick="event.stopPropagation();'+it.go+'">'+(it.goL||'Open')+' →</button>';if(it.place)return '<button class="xchip" onclick="event.stopPropagation();openPlace('+q(it.place)+')">'+(it.goL||'📍 Open')+' →</button>';if(it.go)return '<button class="xchip" onclick="event.stopPropagation();goRef('+q(it.go[0])+','+q(it.go[1])+','+q(it.go[2])+')">'+(it.goL||'Open')+' →</button>';return '';}
function mkSec(sec,shut,inner,countId){
  var apps='';
  /* D-05: the tick rows come first; tools are a wrapping row of chips underneath (external ones say they need signal) */
  if(sec.apps)apps='<div class="apps"><span class="apps-h">Helpful tools</span>'+sec.apps.map(function(x){var go=x.u?'href="'+x.u+'" target="_blank" rel="noopener" title="'+esc(x.d||'')+' — opens in browser, needs internet"':'href="#" title="'+esc(x.d||'')+'" onclick="event.preventDefault();goTab(\''+x.go[0]+'\',\''+x.go[1]+'\''+(x.go[2]?',\''+x.go[2]+'\'':'')+')"';return '<a class="applink" '+go+'><span class="app-i">'+x.i+'</span><span class="app-t"><b>'+x.n+'</b></span><span class="app-go">'+(x.u?'Open ↗':'Go →')+'</span></a>';}).join('')+'</div>';
  return '<div class="sec'+(shut?' shut':'')+'" id="sec-'+sec.id+'"><div class="sec-hd" role="button" tabindex="0" aria-expanded="'+(shut?'false':'true')+'" onclick="togSec(this)"><div class="sec-ico">'+(sec.ico||'•')+'</div><h2>'+sec.title+(sec.sub?'<small>'+sec.sub+'</small>':'')+'</h2><span class="sec-ct" id="sp-'+sec.id+'"></span><span class="sec-chev">▼</span></div><div class="sec-bd">'+(sec.hn?'<div class="note">'+sec.hn+'</div>':'')+inner+apps+'</div></div>';
}

/* ════════════════════════ PLAN ════════════════════════ */
function renderPlan(){
  var h='';
  activePlan().forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      if(!forMe(it))return;
      var exp=it.id==='quiz80'?'Pass all '+numWord(QUIZ_LEVELS.length)+' levels in the Quiz tab (80%+ each). This ticks itself when the circuit is complete.':it.exp;
      inner+='<div class="row" id="pw-'+it.id+'"'+(it.bag?' data-bag="'+it.bag+'"':'')+' role="checkbox" tabindex="0" aria-checked="false" onclick="togPlan(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(exp?'<div class="x">'+exp+'</div>':'')+refChip(it)+'</div></div>';
    });
    if(sec.id==='pack')inner='<div class="pills sm bagpills" style="margin:6px 0 10px;flex-wrap:wrap"><button class="pill on" onclick="event.stopPropagation();bagFilter(this,\'all\')">All</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'ihram\')">🤍 Ihram bag</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'carry\')">✈️ Carry-on</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'case\')">🧳 Suitcase</button></div>'+inner;
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('planContainer').innerHTML=h;
  LN_CARDS.forEach(function(c){var el=document.getElementById(c[1]);if(el)el.innerHTML=accs(c[2]);lnMeta(c[0],c[2]);});
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
  if(q&&shown.length===1&&lnAuto!==shown[0]){lnAuto=shown[0];lnAuto.classList.add('open');var hd=lnAuto.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');try{lnAuto.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}}
}
function renderRiteTiles(){var a=document.getElementById('riteTiles');if(!a)return;
  a.innerHTML=RITES.map(function(ph,i){var t=ph.title.replace(/^Phase \d+ · /,''),n=riteCounts(ph.steps).tot;
    return '<div class="rtile" role="button" tabindex="0" aria-label="Step '+(i+1)+', '+t.replace(/"/g,'')+' — open in the rites guide" onclick="openRitePhase(\''+ph.id+'\')"><span class="i">'+ph.ico+'</span><b>'+t+'</b><small>Step '+(i+1)+' · '+n+' to-dos</small></div>'+(i===0||i===2?'<span class="rarr" aria-hidden="true">→</span>':'')+(i===1?'<span class="rarr dn" aria-hidden="true">↓</span>':'');}).join('');}
function openRitePhase(id){var sc=document.getElementById('sec-'+id);if(sc){sc.classList.remove('shut');var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded','true');}goTab('umrah','steps','sec-'+id);}
/* P-15: hand-off from reading to the quiz — next unlocked level, or the mistakes drill once all are passed */
function lnNextLevel(){for(var i=0;i<QUIZ_LEVELS.length;i++){if(!qzPassed(i))return i;}return -1;}
function renderLearnQuiz(){
  var a=document.getElementById('lnQuizArea'),sb=document.getElementById('lnQuizSub');if(!a)return;
  var next=lnNextLevel(),wc=qzWrongCount(),h;
  if(next<0){sb.textContent='All '+QUIZ_LEVELS.length+' levels passed — mashallah.';h='<div class="lnq"><div class="lvl-n">🏆</div><div class="t"><b>Circuit complete</b>'+(wc?wc+' question'+(wc===1?'':'s')+' still to master.':'Nothing left to review — go with presence of heart.')+'</div></div><button class="btn'+(wc?' gold':' ghost')+'" onclick="lnQuizGo()">'+(wc?'🔁 Review my mistakes ('+wc+')':'🧠 Open the quiz')+'</button>';}
  else{var L=QUIZ_LEVELS[next],best=qzST.best[next];sb.textContent='Next up: '+L.name+(best!==undefined?' · best so far '+best+'%':'');
    h='<div class="lnq"><div class="lvl-n">'+L.icon+'</div><div class="t"><b>'+L.name.split(' · ')[1]+'</b>'+L.desc+' · '+L.qs.length+' questions · 80% unlocks the next level</div></div><button class="btn gold" onclick="lnQuizGo()">🧠 Start '+L.name.split(' · ')[0]+' →</button>';}
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
  document.getElementById('planHeroT').textContent=pct>=100?'Fully prepared! 🎉':pct>=70?'Almost there':pct>=30?'Good progress':pct>0?'Getting started':'Let’s get ready';
  renderTimeline();renderCatTiles();renderWeather();
  var stk=prepStreak();document.getElementById('planHeroS').textContent=done+' of '+tot+' preparation items done'+(stk>1?' · 🔥 '+stk+'-day streak':'');
  updCountdown();
  if(qzActive){qzMeterUpd();renderLearnQuiz();}else renderLevels();
}
function setDep(v){ST.dep=v;saveST();updCountdown();updChip();renderItin();renderTimeline();renderTodayTop();if(v)toast('✈️ '+fmtDate(v)+' — countdown, timeline & itinerary are now dated',true);}
/* return date (P-05): derives the trip length; #tripLen in Settings stays as a mirror */
function setRet(v){if(!v)return;if(!ST.dep){toast('Set your departure date first');updRetDate();return;}var days=Math.round((new Date(v+'T00:00:00')-new Date(ST.dep+'T00:00:00'))/86400000)+1;if(days<3||days>30){toast(days<3?'Trips here are at least 3 days — return date adjusted':'Trips here are up to 30 days — return date adjusted');}setTripLen(Math.max(3,Math.min(30,days)));}
function updRetDate(){var r=document.getElementById('retDate');if(!r)return;if(!ST.dep){r.value='';r.removeAttribute('min');return;}var d=new Date(ST.dep+'T00:00:00');r.min=ST.dep;d.setDate(d.getDate()+(ST.tripLen-1));r.value=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function pickDep(){var inp=document.getElementById('depDate');if(!inp)return;var ok=false;try{if(inp.showPicker){inp.showPicker();ok=true;}}catch(e){}if(!ok){document.getElementById('cdCard').classList.remove('cd2-empty');inp.focus();try{inp.click();}catch(e){}}}
/* jump bar under the Prepare hero (P-06); on trip the trip-time cards come first */
function renderPrepJumps(){var a=document.getElementById('prepJumps');if(!a)return;
  var J=[['niyCard','🤍 Intention'],['cdCard','📅 Countdown'],['tlCard','⏳ Timeline'],['planContainer','✅ Checklists'],['hotelCard','🏨 Hotel & SOS'],['itinCard','🗓️ Itinerary'],['vaultCard','🔐 Vault']];
  if(!ST.dep)J=J.filter(function(j){return j[0]!=='tlCard';});
  if(onTrip()){var first=['hotelCard','vaultCard','itinCard'];J=first.map(function(id){return J.filter(function(j){return j[0]===id;})[0];}).concat(J.filter(function(j){return first.indexOf(j[0])<0;}));}
  a.innerHTML=J.map(function(j){return '<button onclick="jumpTo(\''+j[0]+'\')">'+j[1]+'</button>';}).join('');}
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
function qzWrongCount(){return Object.keys(qzST.wrong).length;}
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
function qzUnlocked(i){return i===0||qzPassed(i-1)||qzFreeAll();}
function qzPassedCount(){var n=0;QUIZ_LEVELS.forEach(function(_,i){if(qzPassed(i))n++;});return n;}
function qzAllPassed(){return qzPassedCount()===QUIZ_LEVELS.length;}
function qzNext(){for(var i=0;i<QUIZ_LEVELS.length;i++){if(qzUnlocked(i)&&!qzPassed(i))return i;}return -1;}
function qzMeterUpd(){var pc=qzPassedCount(),b=document.getElementById('qzBest');if(b)b.textContent=pc+'/'+QUIZ_LEVELS.length;var m=document.getElementById('qzMeter');if(m)m.style.width=Math.round(pc/QUIZ_LEVELS.length*100)+'%';}
function qzLvName(i,part){return QUIZ_LEVELS[i].name.split(' · ')[part===undefined?0:part];}
/* P-26: each level names the Learn card that teaches it */
function qzStudyGo(i){var st=QUIZ_LEVELS[i].study||{};goTab(st.tab||'plan',st.sub||'learn',st.id||'knowCard');}
function qzFree(on){qzST.free=!!on;qzSave();renderLevels();toast(on?'🔓 All levels unlocked — the certificate still needs every level at 80%':'🔒 Guided order restored');vib(8);}
function renderLevels(){
  qzActive=false;
  var h='',wc=qzWrongCount(),nx=qzNext(),cur=qzST.cur,qc=0,qt=0;
  QUIZ_LEVELS.forEach(function(lv,i){qt+=lv.qs.length;qc+=Math.round((qzST.best[i]||0)/100*lv.qs.length);});
  /* P-23: a half-finished level survives tab changes and reloads */
  if(cur&&cur.hist&&cur.hist.length){var L=cur.mode==='mist'?null:QUIZ_LEVELS[cur.lv],tot=cur.mode==='mist'?(cur.queue||[]).length:(L?L.qs.length:0);
    if(tot&&cur.i<=tot)h+='<div class="qz-resume"><div class="t"><b>▶ Resume '+(L?L.name:'Mistake review')+'</b><small>Q'+(Math.min(cur.i,tot-1)+1)+'/'+tot+' · '+cur.score+' ✓ so far</small></div><button class="btn gold" onclick="qzResume()">Resume</button><button class="chip-btn" onclick="qzDiscard()" aria-label="Discard the unfinished level">✕ Discard</button></div>';
    else{delete qzST.cur;qzSave();}}
  /* P-25: one primary answer to "what next?" */
  if(nx>-1)h+='<button class="btn gold qz-cta" onclick="startLevel('+nx+')">'+(qzST.best[nx]!==undefined?'↺ Retake':'Continue →')+' '+qzLvName(nx)+' · '+qzLvName(nx,1)+' ('+QUIZ_LEVELS[nx].qs.length+' q)</button>';
  else if(wc>0)h+='<button class="btn gold qz-cta" onclick="startMistakes()">🔁 Review '+wc+' mistake'+(wc===1?'':'s')+'</button>';
  else h+='<button class="btn gold qz-cta" onclick="makeCert()">🎖️ Download my certificate</button>';
  h+='<div class="qz-sub"><span>'+qc+' of '+qt+' questions correct in your best runs</span>'+(nx>-1&&wc>0?'<button class="chip-btn gsoft" onclick="startMistakes()">🔁 Review '+wc+' mistake'+(wc===1?'':'s')+'</button>':'')+'</div>';
  QUIZ_LEVELS.forEach(function(lv,i){
    var un=qzUnlocked(i),ps=qzPassed(i),best=qzST.best[i],w=qzWrongIn(i),need=qzNeed(lv.qs.length);
    h+='<div class="lvl'+(un?'':' locked')+(ps?' passed':'')+(i===nx?' next':'')+'" role="button" tabindex="0" aria-label="'+lv.name.replace(/"/g,'')+(ps?', passed '+best+'%':(un?(i===nx?', up next':''):', locked'))+'" onclick="startLevel('+i+')">'
      +'<div class="lvl-n">'+(un?lv.icon:'🔒')+'</div>'
      +'<div class="lvl-t"><b>'+lv.name+'</b><small>'+lv.desc+' · '+lv.qs.length+' questions · pass = '+need+' correct'+(ps&&w?' · '+w+' to review':'')+'</small>'+(un&&!ps?'<button class="lvl-study" onclick="event.stopPropagation();qzStudyGo('+i+')" aria-label="Study for '+qzLvName(i)+'">📚 study</button>':'')+'</div>'
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
function qzLockCard(i){var p=QUIZ_LEVELS[i-1],need=qzNeed(p.qs.length);vib([50,40,50]);
  document.getElementById('qzArea').innerHTML='<div class="qz-lock"><div class="big">🔒</div><h4>'+qzLvName(i)+' is locked</h4><p>Pass '+p.name+' first — '+need+' of '+p.qs.length+' correct (80%). Been before, or want the harder levels now? Open them all; the certificate still needs every level passed.</p><button class="btn gold" onclick="startLevel('+(i-1)+')">▶ Take '+qzLvName(i-1)+'</button><button class="btn ghost" onclick="qzFree(true)">🔓 Unlock all levels</button><button class="btn ghost" onclick="renderLevels()">← All levels</button></div>';
  jumpTo('qzArea',true);}
function startMistakes(level){
  qzQueue=Object.keys(qzST.wrong).map(function(k){var m=k.match(/^l(\d+)q(\d+)$/);return m?{lv:+m[1],qi:+m[2]}:null;}).filter(function(x){return x&&QUIZ_LEVELS[x.lv]&&QUIZ_LEVELS[x.lv].qs[x.qi]&&(level===undefined||x.lv===level);});
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
  var head=qzMode==='mist'?'🔁 Mistake review':QUIZ_LEVELS[qzLevel].icon+' '+qzLvName(qzLevel),need='';
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
  document.getElementById('qzFb').innerHTML='<div class="qz-x">'+(ok?'✅ Correct! ':'❌ ')+q.e+'</div><button class="btn" onclick="nextQz()">'+(qzI<qzTotal()-1?'Next question →':'See my score')+'</button>';
}
function nextQz(){
  if(qzI<qzTotal()-1){qzI++;renderQz();return;}
  qzActive=false;delete qzST.cur;
  if(qzMode==='mist'){
    var cleared=qzScore,tot0=qzQueue.length;qzSave();
    document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+cleared+'/'+tot0+'</div><p>mistakes cleared'+(qzWrongCount()?' — '+qzWrongCount()+' still to master.':' — clean slate, mashallah! 🎉')+'</p><button class="btn ghost" onclick="renderLevels()">← All levels</button>'+(qzWrongCount()?'<button class="btn gold" onclick="startMistakes()">↺ Review remaining</button>':'')+'</div>';
    return;
  }
  var lv=QUIZ_LEVELS[qzLevel],n=lv.qs.length,need=qzNeed(n);
  var pct=Math.round(qzScore/n*100);
  var prevBest=qzST.best[qzLevel]||0;
  if(pct>prevBest){qzST.best[qzLevel]=pct;}
  qzSave();
  var passed=pct>=80,all=qzAllPassed(),msg,btns,nx=-1;
  if(passed&&!all)nx=(qzLevel+1<QUIZ_LEVELS.length&&!qzPassed(qzLevel+1))?qzLevel+1:qzNext();
  if(passed&&all)msg=qzLevel===QUIZ_LEVELS.length-1?'Final level passed — the whole circuit is yours!':'Level passed — and that completes the whole circuit!';
  else if(passed)msg='Level passed!'+(nx===qzLevel+1?' '+QUIZ_LEVELS[nx].icon+' '+qzLvName(nx,1)+' is now unlocked.':'');
  else msg='You got '+qzScore+' — you need '+need+' of '+n+' to pass. Study the section below, then retake.';
  if(passed){toast('🎉 '+qzLvName(qzLevel)+' passed!',true);vib([40,60,120]);confetti(all?160:70);}
  if(all&&!planChk['quiz80']){planChk['quiz80']=true;save('us-plan',planChk);updPlan();toast('🏆 Knowledge circuit complete!',true);}
  ST.quizBest=Math.max(ST.quizBest||0,pct);saveST();
  chkBadges();qzMeterUpd();
  var wl=qzWrongIn(qzLevel),wc=qzWrongCount();
  /* P-24 / P-26: the primary button is always the next step */
  if(passed&&all)btns='<button class="btn gold" onclick="makeCert()">🎖️ Get my certificate</button>'+(wc?'<button class="btn ghost" onclick="startMistakes()">🔁 Review my mistakes ('+wc+')</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else if(passed)btns='<button class="btn gold" onclick="startLevel('+nx+')">▶ Start '+QUIZ_LEVELS[nx].icon+' '+qzLvName(nx,1)+'</button>'+(pct<100?'<button class="btn ghost" onclick="startLevel('+qzLevel+')">↺ Retake level</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  else btns='<button class="btn gold" onclick="startLevel('+qzLevel+')">↺ Retake level</button><button class="btn ghost" onclick="qzStudyGo('+qzLevel+')">📚 Study this level</button>'+(lv.rites?'<button class="btn ghost" onclick="goTab(\'umrah\',\'steps\')">📋 Open the rites guide</button>':'')+(wl?'<button class="btn ghost" onclick="startMistakes('+qzLevel+')">🔁 Review the '+wl+' I missed</button>':'')+'<button class="btn ghost" onclick="renderLevels()">← All levels</button>';
  var missed=(!passed&&qzMissed.length)?'<div class="qz-missed"><b>Missed this run</b><ul>'+qzMissed.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div>':'';
  document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+pct+'%</div><p>'+qzScore+' of '+n+' correct — '+msg+'</p>'+missed+btns+'</div>';
}

/* ════════════════════════ RITES ════════════════════════ */
/* U-17: a step may carry one dua or an array of duas (an optional one is marked opt:'label') */
function stDuas(st){return st.dua?(Array.isArray(st.dua)?st.dua:[st.dua]):[];}
function duaHTML(st,d,i){var lbl=d.opt?d.opt:'Dua'+(st.rep?' · <span class="rep">↻ '+st.rep+'</span>':'');
  return '<div class="dua tapable'+(d.opt?' duaopt':'')+'" role="button" tabindex="0" aria-label="Open this dua full screen" onclick="event.stopPropagation();openRiteDua(\''+st.id+'\','+(i||0)+')"><div class="dua-top"><small>'+lbl+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊 Listen</button></div><span class="ar" lang="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span>'+(d.s?'<span class="src">'+d.s+'</span>':'')+'<span class="enl">⛶ tap to enlarge</span></div>';}
/* the ordered list of visible steps with their global number (U-10) */
function riteList(){var L=[],n=0;RITES.forEach(function(ph){ph.steps.forEach(function(st){if(!forMe(st))return;n++;L.push({st:st,ph:ph,n:n});});});return L;}
/* U-19: the mataf schematic moves from the top of the tab into Phase 2, where tawaf begins */
var MATAF_HTML='';
function troubleList(){var qa={};FIQHQA.forEach(function(g){if(g.id)qa[g.id]=g;});var L=[TROUBLE[0],qa.wudu,qa.rest,TROUBLE[2],qa.floors,qa.talk,qa.menses,TROUBLE[1]].filter(function(x){return !!x;});return L.slice(0,8);}
function renderRites(){
  var m=document.getElementById('matafSec');if(m){MATAF_HTML=m.outerHTML;m.parentNode.removeChild(m);}
  var h='',n=0;
  RITES.forEach(function(ph,i){
    var inner='';
    if(ph.id==='ph2'&&MATAF_HTML)inner+=MATAF_HTML;
    if(ph.kn)inner+='<div class="kn">🧒 '+ph.kn+'</div>';
    ph.steps.forEach(function(st){
      if(!forMe(st))return;
      n++;
      inner+='<div class="stp" id="rw-'+st.id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="togRite(\''+st.id+'\')"><div class="stp-n">'+n+'</div><div class="stp-t"><b>'+st.b+'</b><p>'+st.p+(st.why?' <button class="why" onclick="event.stopPropagation();this.parentNode.nextSibling.classList.toggle(\'on\')" aria-label="Why this step?">Why?</button>':'')+'</p>'+(st.why?'<div class="whyb">'+st.why+'</div>':'')+(st.kid?'<button class="xchip" onclick="event.stopPropagation();openStory(\''+st.kid+'\')">🧒 Story for the kids →</button>':'')+(st.id==='rounds'||st.id==='laps'?'<button class="xchip" id="live-'+st.id+'" onclick="event.stopPropagation();goCounter(\''+(st.id==='rounds'?'tawaf':'sai')+'\')">🔄 Open counter →</button>':'')+stDuas(st).map(function(d,k){return duaHTML(st,d,k);}).join('')+'</div></div>';
      if(st.call)inner+='<div class="callout"><span class="co-i">'+(st.call.ico||'💡')+'</span><div class="co-t">'+st.call.t+(st.call.go?' <button class="xchip" onclick="'+st.call.go+'">'+(st.call.goL||'Read more')+' →</button>':'')+'</div></div>';
    });
    if(ph.id==='ph4')inner+='<div class="rite-done" id="riteDone"><b>🎉 Your Umrah is complete</b><p>All ihram restrictions are lifted. May Allah accept it — make shukr, and keep filling your days with worship.</p><button class="btn gold" id="recordBtn" onclick="finishUmrah()">🎉 Record completed Umrah &amp; reset</button><div id="riteDoneNote"></div><button class="lnk fresh" onclick="startFresh()">↺ Start fresh (nothing recorded)</button><p class="rd-foot">Another Umrah? Take ihram from <button class="xchip" onclick="openPlace(\'taneem\')">📍 Masjid Aisha (Tan’eem) →</button></p></div>';
    h+=mkSec(ph,i>0,inner);
  });
  h+=mkSec({id:'trouble',ico:'🆘',title:'If something goes wrong',sub:'Lost count · wudu broke · forbidden by mistake · missed the miqat'},true,accs(troubleList()));
  document.getElementById('riteContainer').innerHTML=h;
  renderCnt('tawaf');renderCnt('sai');renderRiteTiles();
}
/* U-22: the same answers inside the big counter — the sheet sits above the tap zone, so the count is untouched */
function troubleSheet(){openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,var(--danger),#7c2d12)">⚠️</div><h3>Something wrong?</h3><p>Tap a question — your count is not touched.</p>'+accs(troubleList())+'<button class="btn ghost" onclick="closeSheet()">Back to the counter</button>');}
/* U-17: deep link into a Know-before-you-go topic (0 = miqats, 2 = how to wear the ihram) */
function openKnow(i){var a=document.querySelectorAll('#knowContainer .acc')[i];if(a){a.classList.add('open');var hd=a.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('plan','learn',a?null:'knowCard');if(a)requestAnimationFrame(function(){setTimeout(function(){try{a.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}},60);});}
function stamp(k){ST.log=ST.log||{};if(!ST.log[k]){ST.log[k]=Date.now();saveST();}}
function togRite(id,quiet){riteChk[id]=!riteChk[id];save('us-rites',riteChk);vib(15);
  if(riteChk[id]){if(id==='niyyah'){stamp('ihram');if(ST.tmode==='nafl')setTmode('umrah',true);}if(id==='start')stamp('tawafStart');if(id==='cut'||id==='cutw')stamp('halq');}
  else{/* U-13: an un-ticked step takes its stamp with it — practice ticks never poison the keepsake */
    var lg=ST.log||{};if(id==='niyyah'&&lg.ihram){delete lg.ihram;saveST();}if((id==='cut'||id==='cutw')&&lg.halq&&!riteChk.cut&&!riteChk.cutw){delete lg.halq;saveST();}}
  updRites();renderLog();focusRites(false);
  if(!quiet){var st=riteStep(id);if(riteChk[id])toast('✓ '+fcText(st?st.b:'Step')+' — tap again to undo');}}
/* U-10: where am I in the rites? */
function nextRite(){var L=riteList();for(var i=0;i<L.length;i++){var st=L[i].st;if(riteChk[st.id])continue;
  if(st.pair&&L.some(function(x){return x.st.pair===st.pair&&x.st.id!==st.id&&riteChk[x.st.id];}))continue;return L[i];}return null;}
function phaseDone(ph){var c=riteCounts(ph.steps);return c.tot>0&&c.done>=c.tot;}
function setSecOpen(id,open){var sc=document.getElementById('sec-'+id);if(!sc)return;sc.classList.toggle('shut',!open);var hd=sc.querySelector('.sec-hd');if(hd)hd.setAttribute('aria-expanded',open?'true':'false');}
/* open the phase that holds the next step; fully ticked phases fold away. scroll=true (fresh navigation) also folds every other phase and lands on the step */
function focusRites(scroll){var nx=nextRite(),cur=nx?nx.ph.id:'ph4';
  RITES.forEach(function(ph){if(ph.id===cur)setSecOpen(ph.id,true);else if(phaseDone(ph)||scroll)setSecOpen(ph.id,false);});
  if(scroll){setTimeout(function(){jumpTo(nx?'rw-'+nx.st.id:'riteDone',true);},40);}}
function openRiteStep(id){var st=null,ph=null;RITES.forEach(function(p){p.steps.forEach(function(x){if(x.id===id){st=x;ph=p;}});});if(!ph)return;setSecOpen(ph.id,true);
  if(document.getElementById('view-umrah').classList.contains('on')&&(ST.sub||{}).umrah==='steps')jumpTo('rw-'+id);else goTab('umrah','steps','rw-'+id);}
function renderRiteNow(){var s=document.getElementById('riteNow');if(!s)return;var nx=nextRite(),L=riteList();
  if(!nx){s.classList.add('done');s.innerHTML='<div class="now-l" role="button" tabindex="0" onclick="setSecOpen(\'ph4\',true);jumpTo(\'riteDone\')"><span class="now-k">All '+L.length+' steps ticked</span><b class="now-t">Umrah complete — record it</b></div><button class="now-tick" onclick="finishUmrah()" aria-label="Record completed Umrah">🎉 Record</button>';}
  else{s.classList.remove('done');s.innerHTML='<div class="now-l" role="button" tabindex="0" aria-label="Go to step '+nx.n+'" onclick="openRiteStep(\''+nx.st.id+'\')"><span class="now-k">Now · step '+nx.n+' of '+L.length+' · '+nx.ph.title.replace(/^Phase \d+ · /,'').split(' — ')[0]+'</span><b class="now-t">'+fcText(nx.st.b)+'</b></div><button class="now-tick" onclick="togRite(\''+nx.st.id+'\')" aria-label="Mark step '+nx.n+' done">✓ Done</button>';}}
function updRites(){
  var R=riteTotals(),tot=R.tot,done=R.done;
  var L=riteList();
  RITES.forEach(function(ph){ph.steps.forEach(function(st){var on=!!riteChk[st.id];var w=document.getElementById('rw-'+st.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});
    var c=riteCounts(ph.steps),sp=document.getElementById('sp-'+ph.id);
    if(sp){var mine=L.filter(function(x){return x.ph===ph;}),lo=mine.length?mine[0].n:0,hi=mine.length?mine[mine.length-1].n:0;
      /* U-10: global numbering — pending 'steps 6–12', in progress '3/7', finished '✓ done' */
      sp.textContent=c.done>=c.tot&&c.tot?'✓ done':c.done?c.done+'/'+c.tot:(lo===hi?'step '+lo:'steps '+lo+'–'+hi);sp.classList.toggle('ok',c.tot>0&&c.done>=c.tot);}});
  var rd=document.getElementById('riteDone');if(rd)rd.classList.toggle('ready',!!(riteChk.cut||riteChk.cutw));
  renderRiteNow();if(walkOpen)renderWalk();
  renderCnt('tawaf');renderCnt('sai');renderLog();renderUmrahs();updWudu();renderCntHd();renderRiteHero();updCntLayout();
}
/* ── live hero (U-05): where am I in the Umrah right now ── */
function umrahTawaf(){var lg=ST.log||{};return ST.tmode==='nafl'?((riteChk.rounds||lg.tawafEnd)?7:0):ST.tawaf;}
function umrahPct(){var lg=ST.log||{},ih=(riteChk.niyyah||lg.ihram)?1:0,hq=(riteChk.cut||riteChk.cutw||lg.halq)?1:0;return Math.round(25*ih+25*umrahTawaf()/7+25*Math.min(7,ST.sai)/7+25*hq);}
function renderRiteHero(){
  var t=document.getElementById('riteHeroT'),s=document.getElementById('riteHeroS');if(!t)return;
  var lg=ST.log||{},ih=!!(riteChk.niyyah||lg.ihram),hq=!!(riteChk.cut||riteChk.cutw||lg.halq),tw=umrahTawaf(),sa=ST.sai,title,sub;
  if(ST.tmode==='nafl'&&ST.tawaf>0&&ST.tawaf<7){title='Nafl tawaf · round '+(ST.tawaf+1)+' of 7';sub='Normal pace · Kaaba on your left · tap the ring after each round';}
  else if(hq){title='Taqabbal Allah! 🎉';sub='Umrah complete — record it under the sa’i counter';}
  else if(sa>=7){title='Next: Halq / taqsir';sub='Men shave or trim · women trim a fingertip — ihram ends after cutting';}
  else if(sa>0){title='Sa’i · lap '+(sa+1)+' of 7';sub=saiHill(sa);}
  else if(tw>=7){title='Next: Sa’i';sub='2 rakahs at Maqam Ibrahim, Zamzam, then Safa';}
  else if(tw>0){title='Tawaf · round '+(tw+1)+' of 7';sub='Kaaba on your left · tap the ring after each round';}
  else if(ih){title='Next: Tawaf';sub=ST.wudu?'Start at the Black Stone line':'Make wudu, then start at the Black Stone line';}
  else{title='Ready to begin';sub='Ghusl & ihram at the miqat · wudu before tawaf';}
  t.textContent=title;
  var strip='Ihram '+(lg.ihram?'✓ '+fmtTime(lg.ihram):(ih?'✓':'–'))+' · Tawaf '+(lg.tawafEnd?'✓'+(lg.tawafStart?' '+fmtDur(lg.tawafEnd-lg.tawafStart):''):(tw>=7?'✓':'–'))+' · Sa’i '+(lg.saiEnd?'✓'+(lg.saiStart?' '+fmtDur(lg.saiEnd-lg.saiStart):''):(sa>=7?'✓':'–'))+' · Halq '+(lg.halq?'✓ '+fmtTime(lg.halq):(hq?'✓':'–'));
  var n=totalUmrahs();
  s.innerHTML=esc(sub)+'<br><span style="opacity:.85">'+esc(strip)+'</span>'+(n?'<br><span style="opacity:.7">🕋 '+n+' Umrah'+(n===1?'':'s')+' completed'+(ST.umrahsPrev?' (incl. '+ST.umrahsPrev+' before this app)':'')+'</span>':'');
  var pct=umrahPct();animPct('ritePct',pct);setRing('riteRing',pct);
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
function tipHTML(k,v){var T=k==='tawaf'?(ST.tmode==='nafl'?NAFL_TIPS:TAWAF_TIPS):SAI_TIPS,t=T[Math.min(7,v)]||['',''],u=k==='tawaf'?'round':'lap';
  return (k==='sai'?'<span class="tip-h">'+saiHill(v)+'</span>':'')+'<b class="tip-a">'+(v<7?'Now: '+u+' '+(v+1)+' of 7 · ':'')+t[0]+'</b>'+(t[1]?'<span class="tip-r">'+t[1]+'</span>':'');}
function duaIdx(word){for(var i=0;i<DUAS.length;i++){if(DUAS[i].t.indexOf(word)>-1)return i;}return -1;}
/* U-09: the dua of this rite, always under the counter */
function cntDuaHTML(k){var i=duaIdx(k==='tawaf'?'Yamani':'Safa');if(i<0)return '';var d=DUAS[i];
  return '<div class="dua tapable" role="button" tabindex="0" aria-label="Open '+d.t.replace(/"/g,'')+' full screen" onclick="openDua('+i+')"><div class="dua-top"><small>'+d.t+'</small><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊</button></div><span class="ar" lang="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="enl">⛶ tap to enlarge</span></div>';}
function riteStep(id){var f=null;RITES.forEach(function(ph){ph.steps.forEach(function(st){if(st.id===id)f=st;});});return f;}
function brg(id,label){var on=!!riteChk[id];return '<div class="brg'+(on?' done':'')+'" role="checkbox" tabindex="0" aria-checked="'+(on?'true':'false')+'" onclick="togRite(\''+id+'\')"><span class="tick"></span><span>'+label+'</span></div>';}
var safaOpen=false;
function togSafaDhikr(){safaOpen=!safaOpen;renderCnt('tawaf');}
/* U-03: what the 7/7 state hands you on to */
function doneHTML(k){
  if(k==='tawaf'){
    if(ST.tmode==='nafl'){var d=dailyChk[dayKey()]||{},n=(d.ntawafN||(d.ntawaf?1:0))+1;return '<h4>✅ Nafl tawaf complete</h4><p>2 rakahs anywhere in the mosque, then Zamzam.</p><button class="btn gold" onclick="logNafl()">✅ Log nafl tawaf #'+n+' today · Count another</button>';}
    if(ST.sai>0)return '<h4>✅ Tawaf complete</h4><p>Sa’i is under way — keep going below.</p>';
    var safa=riteStep('safa');
    return '<h4>Between tawaf and sa’i</h4>'+brg('maqam','Cover shoulders (men) · 2 rakahs behind Maqam Ibrahim')+brg('zamzam','Drink Zamzam + dua')+brg('safa','On Safa: face the Kaaba, dhikr 3×')
      +'<button class="lnk" onclick="togSafaDhikr()" aria-expanded="'+(safaOpen?'true':'false')+'">'+(safaOpen?'▴ Hide Safa dhikr':'▾ Show Safa dhikr')+'</button>'
      +(safaOpen&&safa?stDuas(safa).map(function(d,k){return duaHTML(safa,d,k);}).join(''):'')
      +'<button class="btn gold" onclick="startSai()">Start Sa’i →</button>';
  }
  var cut=!!(riteChk.cut||riteChk.cutw);
  return '<h4>✅ Sa’i complete</h4><p>'+(cut?'Halq / taqsir done — the ihram restrictions are lifted. Record this Umrah to keep its timeline and reset the steps for the next one.':'Next: halq / taqsir. Men shave (best) or trim; women trim a fingertip’s length — never shave. <b>Ihram restrictions end only after cutting.</b>')+'</p>'
    +(cut?'<button class="btn gold" onclick="finishUmrah()">Record this Umrah 🎉</button>':'<button class="btn" onclick="openRitePhase(\'ph4\')">Next: halq / taqsir →</button>');
}
function renderCnt(k){
  var v=ST[k],nafl=k==='tawaf'&&ST.tmode==='nafl';
  var tip=document.getElementById(k+'Tip');if(tip)tip.innerHTML=tipHTML(k,v);
  if(k===focusKey){var fn=document.getElementById('focusN'),ft=document.getElementById('focusTip');if(fn)fn.textContent=v;if(ft)ft.innerHTML=tipHTML(k,v);renderFocusDone();}
  document.getElementById(k+'N').textContent=v;
  var ring=document.getElementById(k+'Ring');
  if(ring)ring.style.strokeDashoffset=565*(1-v/7);
  var dn=document.getElementById(k+'Done');if(dn){dn.innerHTML=v>=7?doneHTML(k):'';dn.style.display=v>=7?'block':'none';}
  var tp=document.getElementById(k+'Tap');if(tp)tp.textContent=v>=7?'Complete ✓':'tap to count';
  var rb=document.getElementById(k+'RingBtn');if(rb)rb.setAttribute('aria-label',v>=7?(k==='tawaf'?'Tawaf complete, 7 of 7 rounds':'Sa’i complete, 7 of 7 laps'):(k==='tawaf'?'Count a tawaf round, '+v+' of 7 done':'Count a sa’i lap, '+v+' of 7 done'));
  var un=document.getElementById(k+'Undo');if(un)un.disabled=v===0;
  var du=document.getElementById(k+'Dua');if(du&&!du.innerHTML)du.innerHTML=cntDuaHTML(k);
  var lc=document.getElementById('live-'+(k==='tawaf'?'rounds':'laps'));if(lc)lc.textContent=nafl?'🔄 Open counter →':'🔄 '+v+' / 7 '+(k==='tawaf'?'rounds':'laps')+' · Open counter →';
  if(k==='tawaf'){var h3=document.getElementById('tawafH');if(h3)h3.textContent=nafl?'🔁 Nafl tawaf':'🕋 Tawaf';
    var sb=document.getElementById('tawafSub');if(sb)sb.innerHTML=nafl?'7 rounds at a normal pace — no raml or idtiba’. Wudu is still required.<br><b>Tap the circle after each round.</b>':'7 rounds, counter-clockwise, from the Black Stone line.<br><b>Tap the circle after each round.</b>';
    document.querySelectorAll('#tmodeSeg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-m')===(ST.tmode||'umrah'));});}
  renderCntSum(k);
}
/* ── U-04: one big ring per moment ── */
var cntForce={},saiGo=false,layoutHold=0,lastAct='';
function cntActive(){if(ST.tmode==='nafl')return 'tawaf';if(ST.tawaf>=7&&(ST.sai>0||saiGo))return 'sai';return 'tawaf';}
function cntStarted(){return ST.tawaf>0||ST.sai>0;}
function updCntLayout(){var sub=document.getElementById('sub-umrah-count');if(!sub)return;
  if(Date.now()<layoutHold){setTimeout(updCntLayout,layoutHold-Date.now()+60);return;}
  var act=cntActive();if(act!==lastAct){cntForce={};lastAct=act;}
  sub.classList.toggle('started',cntStarted());sub.classList.toggle('rite-tawaf',act==='tawaf');sub.classList.toggle('rite-sai',act==='sai');
  ['tawaf','sai'].forEach(function(k){var c=document.getElementById(k+'Card');if(c)c.classList.toggle('compact',k!==act&&!cntForce[k]);});}
function renderCntSum(k){var e=document.getElementById(k+'Sum');if(!e)return;var v=ST[k],lbl;
  if(k==='tawaf')lbl=(ST.tmode==='nafl'?'🔁 Nafl tawaf':'🕋 Tawaf')+(v>=7?' ✅ 7/7':' · '+v+'/7');
  else lbl='⛰️ Sa’i'+(v>=7?' ✅ 7/7':' · '+v+'/7'+(ST.tmode==='nafl'?' · not part of a nafl tawaf':(ST.tawaf<7?' · after tawaf':'')));
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
  var fw=document.getElementById('focusWudu');if(fw){fw.textContent=ST.wudu?'💧 wudu ✓':'💧 wudu?';fw.classList.toggle('on',!!ST.wudu);fw.setAttribute('aria-pressed',ST.wudu?'true':'false');fw.hidden=focusKey!=='tawaf';}}
function wuduSheet(){openSheet('<div class="sheet-h">💧</div><h3>Are you in wudu?</h3><p>"Tawaf around the House is like salah" (Tirmidhi 960) — it needs wudu. Sa’i does not.</p><button class="btn tall" onclick="wuduYes()">✓ Yes, I have wudu — begin</button><button class="btn ghost tall" onclick="closeSheet()">💧 Not yet — I’ll make wudu first</button>');}
function wuduYes(){ST.wudu=true;ST.wuduAt=Date.now();saveST();updWudu();renderRiteHero();closeSheet();cntr('tawaf',1);}
function focusWudu(){
  if(ST.wudu&&ST.tawaf>=1&&ST.tawaf<=6){ST.wudu=false;ST.wuduAt=null;saveST();updWudu();renderRiteHero();
    openSheet('<div class="sheet-h">💧</div><h3>Wudu broke mid-tawaf?</h3><p class="lead">Renew your wudu and return — completed rounds are not lost. The majority hold you resume from where you stopped in the current round, or repeat that round to be safe. <b>Resume round '+(ST.tawaf+1)+'.</b></p><p>Crowding makes this common — no panic, it does not ruin your Umrah. Nothing has been reset.</p><button class="btn tall" onclick="closeSheet()">Got it</button>');return;}
  togWudu();}
/* U-20: a sister whose period starts after ihram — the ruling in seconds, no shaming CTAs */
function periodSheet(){openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,#b0457a,#7c2d5a)">🌸</div><h3>Period started? Your ihram is still valid</h3>'
  +'<p class="lead">When Aishah (RA) got her period at Sarif, the Prophet ﷺ told her: <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p>'
  +'<ul><li>Your ihram stays valid — stay in it.</li><li>Keep up the talbiyah, dhikr and dua; the Haram courtyards are open to you.</li><li>Do not enter tawaf. Delay tawaf — and the sa’i after it — until you are pure, then ghusl, tawaf and sa’i. Nothing is lost.</li><li>Umrah has no separate farewell tawaf.</li></ul>'
  +'<p class="lead"><b>Departing within days?</b> Ask a scholar or your group’s alim about the concessions — do not decide alone.</p>'
  +'<p class="lead" style="color:var(--ink2)"><b>Meanwhile</b>, everything else in Daily still counts: dhikr and dua, Quran by listening or tafsir, sadaqah, serving pilgrims, Zamzam, your dua list.</p>'
  +'<button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'learn\',\'sisCard\')">🌸 Read the full sisters’ guide</button><button class="btn" onclick="closeSheet()">Got it</button>');}
/* ── U-07: Umrah tawaf vs nafl tawaf ── */
function setTmode(m,quiet){m=m==='nafl'?'nafl':'umrah';if((ST.tmode||'umrah')===m&&!quiet)return;ST.tmode=m;saveST();cntForce={};if(document.getElementById('focus').classList.contains('on')&&focusKey==='tawaf')document.getElementById('focusTitle').textContent=m==='nafl'?'🔁 Nafl tawaf':'🕋 Tawaf';updRites();
  if(!quiet){toast(m==='nafl'?'🔁 Nafl tawaf — normal pace, no raml; logs to today’s tracker at 7':'🕋 Umrah tawaf — feeds your rites checklist & timeline');vib(8);}}
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
  var um=!(k==='tawaf'&&ST.tmode==='nafl');
  if(um){if(v===1&&d>0)stamp(k+'Start');if(v===7)stamp(k+'End');
    var rk=k==='tawaf'?'rounds':'laps',on=v>=7,ch=false;if(!!riteChk[rk]!==on){riteChk[rk]=on;ch=true;}
    /* U-10: the first counted round means you made wudu and started at the Stone line */
    if(k==='tawaf'&&v===1&&d>0&&!riteChk.start){riteChk.start=true;riteChk.wudu=true;ch=true;}
    if(ch)save('us-rites',riteChk);}
  vib(v===7?[50,60,140]:35);
  if(v===7){layoutHold=now+1300;confetti(50);if(k==='tawaf')safaOpen=false;
    if(um)toast(k==='tawaf'?'🕋 Tawaf complete! 2 rakahs at Maqam Ibrahim, Zamzam, then Safa':'⛰️ Sa’i complete! Next: halq / taqsir',true);}
  else cntToast(d>0?(k==='tawaf'?'Round ':'Lap ')+v+' of 7':'↶ Back to '+v+' of 7');
  updRites();
}
/* per-tap count toast: replaces the previous one; skipped inside the big counter where the number is the feedback */
function cntToast(m){if(document.getElementById('focus').classList.contains('on'))return;var c=document.getElementById('toastC');if(c)c.querySelectorAll('.toast[data-cnt]').forEach(function(t){t.remove();});toast(m);if(c&&c.lastElementChild)c.lastElementChild.setAttribute('data-cnt','1');}
function cntrReset(k){var n=ST[k];if(!n){toast((k==='tawaf'?'Tawaf':'Sa’i')+' counter is already at 0');return;}
  openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,var(--danger),#7c2d12)">↺</div><h3>Reset '+(k==='tawaf'?'tawaf':'sa’i')+' to 0?</h3><p>Your '+n+' completed '+(k==='tawaf'?'round':'lap')+(n===1?'':'s')+' will be cleared'+(k==='tawaf'?' — your wudu status is kept':'')+'. To fix one extra tap, use Undo instead.</p><button class="btn danger tall" onclick="cntrResetGo(\''+k+'\')">↺ Reset to 0</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function cntrResetGo(k){closeSheet();ST[k]=0;if(ST.log&&(k==='sai'||ST.tmode!=='nafl')){delete ST.log[k+'Start'];delete ST.log[k+'End'];}saveST();var rk=k==='tawaf'?'rounds':'laps';if(riteChk[rk]&&(k==='sai'||ST.tmode!=='nafl')){delete riteChk[rk];save('us-rites',riteChk);}if(k==='sai')saiGo=false;cntForce={};lastTap[k]=0;updRites();toast((k==='tawaf'?'Tawaf':'Sa’i')+' counter reset to 0');}
function finishUmrah(){
  var R=riteTotals(),done=R.done,tot=R.tot;
  if(done<tot&&!confirm('Only '+done+' of '+tot+' steps are ticked. Record this Umrah as complete anyway?'))return;
  var lg=ST.log||{};lg.done=Date.now();var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}hist.push({n:ST.umrahs+1,log:lg});localStorage.setItem('us-umrahlog',JSON.stringify(hist));
  ST.umrahs++;ST.tawaf=0;ST.sai=0;ST.wudu=false;ST.wuduAt=null;ST.log={};ST.tmode='nafl';saveST();saiGo=false;cntForce={};lastTap={};renderUmrahs();updWudu();
  riteChk={};save('us-rites',riteChk);
  updRites();renderLog();chkBadges();confetti(140);
  var onSteps=document.getElementById('view-umrah').classList.contains('on')&&(ST.sub||{}).umrah==='steps';
  /* U-15: close the loop where the pilgrim is — keepsake + today's log in the completion block, or the hero on the counters */
  var note=document.getElementById('riteDoneNote'),no=ST.umrahs;
  if(note)note.innerHTML='<div class="rd-note">🎉 Umrah #'+totalUmrahs()+' recorded — may Allah accept it!<div class="rd-acts"><button class="chip-btn" onclick="makeKeepsake('+no+')">🎴 Keepsake</button><button class="chip-btn" onclick="goTab(\'daily\',\'today\')">📿 Log today’s worship</button></div></div>';
  if(onSteps){if(walkOpen)closeWalk(true);setSecOpen('ph4',true);setTimeout(function(){jumpTo('umrahsCard',true);},400);}
  else{toast('🎉 Umrah #'+totalUmrahs()+' recorded — may Allah accept it!',true);if(document.getElementById('view-umrah').classList.contains('on'))setTimeout(function(){jumpTo('riteHero',true);},400);}
}
/* U-13: clear practice ticks without recording a fake Umrah */
function startFresh(){openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,var(--danger),#7c2d12)">↺</div><h3>Start fresh?</h3><p>Clears every tick, both counters and this Umrah’s timeline <b>without recording an Umrah</b>. Recorded Umrahs and keepsakes are kept.</p><button class="btn danger tall" onclick="startFreshGo()">↺ Clear — nothing recorded</button><button class="btn ghost tall" onclick="closeSheet()">Cancel</button>');}
function startFreshGo(){closeSheet();riteChk={};save('us-rites',riteChk);ST.log={};ST.tawaf=0;ST.sai=0;ST.wudu=false;ST.wuduAt=null;saveST();saiGo=false;cntForce={};lastTap={};var n=document.getElementById('riteDoneNote');if(n)n.innerHTML='';updRites();renderLog();focusRites(false);toast('Cleared — nothing was recorded');vib(10);}

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
    h+=mkSec(sec,i>0,inner);
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
  if(dd){dd.innerHTML='Day '+ST.day+' <small>of '+ST.tripLen+'</small>';dd.setAttribute('aria-label','Day '+ST.day+' of '+ST.tripLen+(off?(ST.day<ex?', a past day':', a day ahead'):'')+' — open trip stats');}
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
  document.getElementById('dHeroT').textContent=pct>=100?'Perfect day! 🌟':pct>=70?'Strong day':pct>=35?'Keep going':pct>0?'Good start':'Bismillah';
  document.getElementById('dHeroS').innerHTML=C.done+' of '+C.tot+(exc?' that count today<span class="exc-line">Ihram, dhikr, dua and listening continue — tawaf and salah wait until you are pure (<a href="#" onclick="event.preventDefault();openQA(\'menses\')">Bukhari 305</a>)</span>':' completed');
  /* D-07: the real Friday's Dhuhr row is Jumu'ah */
  var rl=document.querySelector('#dw-dhuhr .rl');if(rl)rl.textContent=(ST.day===ex&&isFriday())?'Jumu’ah in congregation':'Dhuhr in congregation';
  renderDayTools(ex,off,exc);syncPTTiles();
  updStreaks();renderHeat();
}
/* D-01 / D-10 / D-20: the small row of day-level actions under the hero */
function renderDayTools(ex,off,exc){var a=document.getElementById('dayTools');if(!a)return;var h='';
  if(off&&daySyncPending===ex&&daySyncHide!==ex)h+='<button class="chip-btn sync" onclick="goToday()">📅 Today is Day '+ex+' — switch ▶</button><button class="chip-btn" onclick="dismissSync()" aria-label="Dismiss">✕</button>';
  if(ST.profile!=='m')h+='<button class="chip-btn exc'+(exc?' on':'')+'" onclick="excusedSheet()" aria-pressed="'+(exc?'true':'false')+'">🌸 '+(exc?'Excused today ✓':'Excused today')+'</button>';
  if(ST.day>=ST.tripLen&&ST.tripLen>1)h+='<button class="chip-btn" onclick="goSub(\'daily\',\'stats\')">🏁 Trip finished? Stats &amp; share card</button>'+(ST.post?'':'<button class="chip-btn" onclick="startPost()">🌱 Turn on Post-Umrah habits</button>');
  a.innerHTML=h;}
/* D-20: the ruling in one sheet, reversible */
function excusedSheet(){var exc=dayExcused();
  openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,#b0457a,#7c2d5a)">🌸</div><h3>'+(exc?'Day '+ST.day+' is excused':'Excused today?')+'</h3><p class="lead">Menstruating? The Prophet ﷺ told Aishah (RA): <b>"Do what all the pilgrims do, except that you do not perform tawaf around the Ka’bah until you are clean"</b> (Bukhari 305).</p><ul><li>Salah, tahajjud, duha and nafl tawaf are <b>not required</b> today — they will not count against you.</li><li>Quran (listening or tafsir), adhkar, dhikr, dua, sadaqah, serving pilgrims, ziyarah and Zamzam continue and still count.</li><li>Streaks pause — they neither grow nor break on an excused day.</li></ul>'
    +(exc?'<button class="btn tall" onclick="setExcused(false)">↩ Not excused today</button>':'<button class="btn tall" style="background:#b0457a;color:#fff" onclick="setExcused(true)">🌸 Mark Day '+ST.day+' excused</button>')+'<button class="btn ghost" onclick="closeSheet();openQA(\'menses\')">📖 Read the ruling</button><button class="btn ghost" onclick="closeSheet()">Close</button>');}
function setExcused(on){var d=dailyChk[dayKey()]||{};if(on)d._excused=true;else delete d._excused;dailyChk[dayKey()]=d;save('us-daily',dailyChk);closeSheet();updDaily();updStats();chkBadges();toast(on?'🌸 Day '+ST.day+' marked excused — everything else still counts':'Day '+ST.day+' is a full day again');vib(10);}
/* open one fiqh Q&A accordion by its id (FIQHQA/TROUBLE carry ids) */
function openQA(id){var L=FIQHQA.concat(TROUBLE),i=-1;L.forEach(function(g,k){if(g.id===id)i=k;});var a=i>-1?document.querySelectorAll('#qaContainer .acc')[i]:null;if(a){a.classList.add('open');var hd=a.querySelector('.acc-h');if(hd)hd.setAttribute('aria-expanded','true');}goTab('plan','learn',a?null:'qaCard');if(a)requestAnimationFrame(function(){setTimeout(function(){try{a.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}},60);});}
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
  g.style.gridTemplateColumns='repeat('+Math.min(ST.tripLen,7)+',1fr)';
  g.innerHTML=h;
  var lg=document.getElementById('heatLeg');if(lg)lg.innerHTML='<i class="hc h1"></i>&lt;40% <i class="hc h2"></i>40% <i class="hc h3"></i>70% <i class="hc h4"></i>90%+ <span>· tap a day to log it</span>';
}
function heatGo(i){setDay(i,true);goSub('daily','today',true);setTimeout(function(){jumpTo('dayNav',true);},60);vib(8);}
function updStats(){
  var logged=0,sum=0,best=0,bestD=0,perf=0;
  for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0){logged++;sum+=p;if(p>best){best=p;bestD=i;}if(p>=80)perf++;}}
  document.getElementById('stDays').textContent=logged;
  document.getElementById('stAvg').textContent=(logged?Math.round(sum/logged):0)+'%';
  document.getElementById('stBest').textContent=bestD?'Day '+bestD+' ('+best+'%)':'—';
  document.getElementById('stPerf').textContent=perf;
  document.getElementById('stUmrahs').textContent=totalUmrahs();
  var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;
  document.getElementById('stPlaces').textContent=pv+' / '+PLACES.length;
  renderBadges();
}
function setTripLen(v){var n=parseInt(v)||10;n=Math.max(3,Math.min(30,n));ST.tripLen=n;if(ST.day>n)ST.day=n;delete ST.dayAuto;saveST();document.getElementById('tripLen').value=n;updRetDate();updDaily();updStats();renderItin();updChip();renderPrepJumps();}

/* ════════════════════════ PLACES ════════════════════════ */
var cityFilter='all';
function renderPlaces(){
  var h='';
  var q=(document.getElementById('plSearch')||{}).value||'';q=q.trim().toLowerCase();
  function tourCard(){
    var st=TOUR.stops.map(function(x){return '<span class="stopchip '+x.r+'"><i></i>'+x.n+' · '+x.t+'</span>';}).join('');
    return '<div class="tour" id="tourCard"><div class="tour-h"><span class="tour-i">🚌</span><div><b>Madinah Hop-On Hop-Off — the easy ziyarah</b><small>City Sightseeing · 2 routes · 12 stops · buses every 30 min · 05:30–23:59</small></div></div>'
      +'<p>One 24-hour ticket covers Quba, Qiblatayn, Uhud, the Trench, Baqi’ and the Haram gates with audio commentary in 16 languages — no taxi haggling, wheelchair accessible, free cancellation up to 24 h before. The Red route is the history loop, the Green route circles the Prophet’s Mosque.</p>'
      +'<div class="stops">'+st+'</div>'
      +'<a class="btn gold" style="margin-top:12px;text-align:center;text-decoration:none" href="'+TOUR.url+'" target="_blank" rel="noopener">🎟️ Book the ziyarah bus on city-sightseeing.com →</a>'
      +'<div class="tour-note">Tip: ride the full Red loop once for orientation, then hop off at Quba and Uhud around Fajr/Asr when they are calmest.</div></div>';
  }
  ['makkah','madinah'].forEach(function(city){
    if(cityFilter!=='all'&&cityFilter!==city)return;
    var cityAny=false,ch='';
    GORDER[city].forEach(function(g){
      var list=PLACES.filter(function(p){return p.city===city&&p.g===g&&(!q||(p.n+' '+p.d+' '+p.tip+' '+(p.stop?'hop-on hop-off bus stop':'')).toLowerCase().indexOf(q)>-1);});
      if(nearPos)list=list.slice().sort(function(a,b){return (a.ll?hav(nearPos,a.ll):1e9)-(b.ll?hav(nearPos,b.ll):1e9);});
      if(!list.length)return;
      cityAny=true;
      ch+='<div class="subt" id="grp-'+city+'-'+g+'">'+GLABEL[g]+'</div>';
      list.forEach(function(p){
        var url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.q);
        var dist=distLbl(p);
        var stop=(p.stop?'<span class="stopbadge '+(p.stop[0]==='R'?'red':'green')+'">🚌 Stop '+p.stop.slice(1)+' · '+(p.stop[0]==='R'?'Red':'Green')+'</span>':'')+(dist?'<span class="distchip">'+dist+'</span>':'');
        ch+='<div class="place'+(placeVis[p.id]?' vis':'')+(q?' open':'')+'" id="pl-'+p.id+'"><div class="place-h" onclick="this.parentNode.classList.toggle(\'open\')"><div class="place-ico">'+p.i+'</div><div class="place-t"><b>'+p.n+(placeVis[p.id]?' <span class="vtick">✓</span>':'')+'</b>'+stop+'<p>'+p.d+'</p><div class="tip">💡 '+p.tip+'</div></div><span class="place-ch">▾</span></div><div class="place-a"><a href="'+url+'" target="_blank" rel="noopener">🗺️ Open in Maps</a><button onclick="togPlace(\''+p.id+'\')">'+(placeVis[p.id]?'✓ Visited':'Mark visited')+'</button></div>'+(['taneem','jiranah','miqat'].indexOf(p.id)>-1?'<div class="place-a" style="margin-top:8px"><button style="background:var(--gold-soft);color:var(--gold-ink);border-color:transparent" onclick="goTab(\'umrah\',\'steps\')">🤍 Umrah steps — ihram from here</button></div>':'')+'</div>';
      });
    });
    if(!cityAny)return;
    h+='<div class="cityhd" id="city-'+city+'">'+(city==='makkah'?'🕋 Makkah al-Mukarramah':'🕌 Madinah al-Munawwarah')+'</div>';
    if(!q)h+='<div class="jumps">'+GORDER[city].map(function(g){return '<button onclick="jumpTo(\'grp-'+city+'-'+g+'\')">'+GLABEL[g]+'</button>';}).join('')+'</div>';
    if(city==='madinah'&&!q)h+=tourCard();
    if(!q)h+='<button class="btn ghost" style="margin:0 0 12px" onclick="planRoute(\''+city+'\')">🧭 Plan a ziyarah route for '+(city==='makkah'?'Makkah':'Madinah')+'</button><div id="route-'+city+'"></div>';
    h+=ch;
  });
  document.getElementById('placesContainer').innerHTML=h||'<div class="note" style="margin:0">No places match — try "Quba", "Uhud", "Hira" or "bus".</div>';
}
function togPlace(id){placeVis[id]=!placeVis[id];save('us-places',placeVis);renderPlaces();updPlaces();
  /* D-06: a real ziyarah site (not the Haram, a day trip or a bus stop) logs today's ziyarah row once */
  if(placeVis[id]){vib(25);var p=PLACES.filter(function(x){return x.id===id;})[0];if(p&&['tour','trip','haram','mharam'].indexOf(p.g)<0){var k=dayKey(),d=dailyChk[k]||{};if(!d.ziyarah){d.ziyarah=true;dailyChk[k]=d;save('us-daily',dailyChk);updDaily();updStats();toast('📍 Ziyarah logged for Day '+ST.day);}}}
  chkBadges();}
function filterCity(c){cityFilter=c;['All','Makkah','Madinah'].forEach(function(x){document.getElementById('pill'+x).classList.toggle('on',c===x.toLowerCase());});renderPlaces();}
function updPlaces(){
  var v=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;
  var pct=Math.round(v/PLACES.length*100);
  animPct('plPct',pct);setRing('plRing',pct);
  document.getElementById('plHeroS').textContent=v+' of '+PLACES.length+' visited';
}

/* ════════════════════════ BADGES ════════════════════════ */
function badgeOK(id){
  switch(id){
    case 'firstUmrah':return ST.umrahs>=1;
    case 'again':return ST.umrahs>=2;
    case 'quizMaster':return qzAllPassed();
    case 'prepped':{var P=planTotals();return P.tot>0&&P.done===P.tot;}
    case 'explorer':return Object.keys(placeVis).filter(function(k){return placeVis[k];}).length>=8;
    case 'devoted':{var n=0;for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>=80)n++;}return n>=3;}
    case 'quranComp':{var n=0;for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d&&(d.recite||d.tadabbur||d.memorize))n++;}return n>=5;}
    case 'nightHaram':{var n=0;for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d&&d.tahajjud)n++;}return n>=3;}
    case 'littlePilgrim':return kdBestStars()>=3;
  }
  return false;
}
function chkBadges(){
  BADGES.forEach(function(b){
    if(!earned[b.id]&&badgeOK(b.id)){earned[b.id]=true;save('us-badges',earned);toast(b.icon+' Achievement unlocked: '+b.name+'!',true);vib([40,50,90]);}
  });
  renderBadges();
}
function renderBadges(){
  var g=document.getElementById('bdgGrid');if(!g)return;
  var n=0,h='';
  BADGES.forEach(function(b){var ok=!!earned[b.id];if(ok)n++;h+='<div class="bdg '+(ok?'ok':'no')+'"><div class="i">'+b.icon+'</div><div class="n">'+b.name+'</div></div>';});
  g.innerHTML=h;document.getElementById('bdgCnt').textContent=n;var bt=document.getElementById('bdgTot');if(bt)bt.textContent=BADGES.length;
}

/* ════════════════════════ DUAS / DATA ════════════════════════ */
function renderDuas(){
  var h='';
  DUAS.forEach(function(d,i){h+='<div class="duacard"><div class="dua-top"><h4 style="margin:0">'+d.t+'</h4><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊 Listen</button></div><div class="dua tapable" role="button" tabindex="0" aria-label="Open '+d.t.replace(/"/g,'')+' full screen" style="margin:0;background:transparent;border:none;padding:0" onclick="openDua('+i+')"><span class="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span><span class="src">'+d.s+'</span><span class="enl">⛶ tap to enlarge</span></div></div>';});
  document.getElementById('duaContainer').innerHTML=h;
}
function exportData(){
  var ls={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('us-')===0&&k!=='us-ptcache'&&k!=='us-remlast')ls[k]=localStorage.getItem(k);}
  var data={v:3,exported:new Date().toISOString(),settings:ST,plan:planChk,rites:riteChk,daily:dailyChk,places:placeVis,badges:earned,ls:ls};
  var b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='umrah-strivers-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);
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
  openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,var(--danger),#7c2d12)">🗑️</div><h3>Reset everything?</h3><p>This wipes every checklist, counter, quiz score, dua list, journal and setting on this device — and the encrypted vault. It cannot be undone.</p><button class="btn" onclick="exportData()">📤 Export backup first</button><button class="btn danger" onclick="doReset()">🗑️ Reset everything</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>');
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
function renderHome(){
  var a=document.getElementById('homeArea');if(!a)return;
  var name=ST.name?', '+ST.name:'';
  var hij=(ptData&&ptData.h)?ptData.h:hijriIntl();
  var greg=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  var d=ST.dep?Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000):null;
  var phase,cta,pct,lbl,stageNow;
  var pd=postData||{},pc=0;Object.keys(pd).forEach(function(h){pc+=Object.keys(pd[h]||{}).filter(function(k){return pd[h][k];}).length;});
  var tripOver=d!==null&&d<-ST.tripLen,tu=totalUmrahs();
  if((ST.post&&(d===null||d<=0))||tripOver){pct=ST.post?Math.round(pc/90*100):(tu?100:0);phase=tu?'🕋 '+tu+' Umrah'+(tu===1?'':'s')+' completed — alhamdulillah':'🧭 Your Umrah journey';
    if(ST.post){cta=['Log today’s habits','more','guide','postCard'];lbl=pc+' habit-day'+(pc===1?'':'s')+' logged of 90 · keep the Haram version of you';}
    else{cta=['Plan your next Umrah','plan','prep','cdCard'];lbl='Set a new departure date to start again';}
    stageNow=4;}
  else if(d===null||d>0){var P=planTotals(),tot=P.tot,done=P.done;pct=P.pct;phase=d===null?'🧭 Planning — set your departure date':'✈️ '+d+' day'+(d===1?'':'s')+' until departure';cta=[pct<100?'Continue preparing':'Study & quiz','plan',pct<100?'prep':'learn',pct<100?(ST.dep?'tlCard':'cdCard'):null];lbl=done+' of '+tot+' prep items · '+qzPassedCount()+'/'+QUIZ_LEVELS.length+' quiz levels';stageNow=0;}
  else if(d===0&&!tu&&!dayHasTicks(1)){pct=planTotals().pct;phase='🛫 Departure day — safe travels, labbayk!';cta=['Open the rites guide','umrah','steps'];lbl='Ihram at the miqat → tawaf → sa’i → halq — every step and dua is in the guide';stageNow=1;}
  else{var ed=expectedDay()||ST.day;pct=dayPct(ed)||0;phase='🕋 Day '+ed+' of '+ST.tripLen+' in the Haramain';cta=['Log today’s worship','daily','today'];lbl=pct+'% of today’s deeds · '+tu+' Umrah'+(tu===1?'':'s')+' completed';stageNow=ST.umrahs?2:1;}
  var due=fcDue();var fc0=due.length?FC_MAP[due[0]]:null;
  var nh=0;[HISTORY,VIRTUES,MADINAH,FIQHQA,KNOW,SISTERS,SCAMS].forEach(function(x){nh+=x.length;});
  var nq=0;QUIZ_LEVELS.forEach(function(l){nq+=l.qs.length;});
  var stages=[
    {i:'🧳',t:'Before you fly',s:'Prepare with ihsan',d:'Begin with your intention — then checklists for documents, packing and health, a departure countdown and a generated day-by-day itinerary. Then learn: the history of the Kaaba and Madinah, the virtues, the fiqh Q&A, a scam-awareness guide — and prove it in a 7-level quiz.',f:['Checklists','Itinerary','Knowledge hub','7-level quiz','Flashcards','Document vault',['Kids quiz','goTab(\'plan\',\'quiz\',\'kidsCard\')']],go:['plan','prep'],c:'Start preparing'},
    {i:'🕋',t:'During your Umrah',s:'Ihram → Tawaf → Sa’i → Halq',d:'A step-by-step walkthrough with every dua in Arabic, transliteration and audio, and a "Why?" behind each step. Giant tap counters for tawaf and sa’i with a full-screen focus mode so you never lose count, a map of the mataf, and an automatic timeline that becomes a keepsake.',f:['Rites guide','Duas + audio','Tawaf & Sa’i counters','Focus mode','Mataf map','Keepsake card'],go:['umrah','steps'],c:'Open the rites guide'},
    {i:'📿',t:'Every day in the Haramain',s:'Make every prayer count',d:'One prayer in the Haram is worth 100,000 — track all five in congregation, tahajjud, Quran, dhikr and extra deeds. Prayer times with reminders, a qibla compass, a tasbih counter, your personal dua list and a water counter, with streaks and achievements.',f:['Daily tracker','Prayer times','Qibla','Tasbih','Dua list','Streaks & badges'],go:['daily','today'],c:'Track today'},
    {i:'📍',t:'Ziyarah with purpose',s:'51 places, Makkah & Madinah',d:'Every sacred and historic site with why it matters, an etiquette tip and one-tap Google Maps. Save your hotel to see walking distances, sort by what’s near you, plan a nearest-first route, and book the Madinah hop-on hop-off bus.',f:['51 sites','Maps & distances','Route planner','Hop-on hop-off'],go:['places',null],c:'Explore places'},
    {i:'🌱',t:'After you return',s:'Don’t let it fade',d:'A 30-day habit keeper for prayers on time, daily Quran and dhikr, plus a reflections journal — so the person who came back from the Haram stays.',f:['Habit keeper','Reflections'],go:['more','guide','postCard'],oc:'goPost(true)',c:'Keep it alive'}
  ];
  var acts=[['🔄','Counters','umrah','count'],['📋','Rites','umrah','steps'],['📿','Tasbih','daily','tools','tbCard'],['🧭','Qibla','daily','tools','qiblaCard'],['📍','Places','places',null],['🤲','Duas','more','duas'],['🃏','Cards','plan','learn','fcCard'],['🗓️','Itinerary','plan','prep','itinCard'],['🔐','Vault','plan','prep','vaultCard']];
  function q(v){return v?'\''+v+'\'':'null';}
  function goStr(g){return 'goTab('+q(g[0])+','+q(g[1])+','+q(g[2])+')';}
  var h='';
  // 1. What this app is
  h+='<div class="hhero"><div class="hhero-mark">🕋</div><h2>Your complete Umrah companion</h2><p>Everything you need <b>before, during and after</b> Umrah — in one free, private app that works offline in the Haram.</p><div class="trust"><span>✓ Free</span><span>✓ Works offline</span><span>✓ Private — no account</span><span>✓ Every hadith verified</span></div><button class="btn" style="max-width:300px;margin:16px auto 0" onclick="'+goStr([cta[1],cta[2],cta[3]])+'">'+(d===null&&!tu?'Begin your journey →':cta[0]+' →')+'</button>'+(deferPrompt?'<button class="btn ghost" style="max-width:300px;margin:8px auto 0" onclick="installApp()">📲 Install on your phone</button>':(/iPhone|iPad/.test(navigator.userAgent)&&!window.navigator.standalone?'<p style="font-size:.74em;color:var(--ink3);margin-top:10px">📲 On iPhone: tap Share → “Add to Home Screen” to install</p>':''))+'</div>';
  // 2. Personal status
  h+='<div class="hstatus" role="button" tabindex="0" aria-label="'+cta[0]+'" onclick="'+goStr([cta[1],cta[2],cta[3]])+'"><div class="hs-t"><small>As-salamu alaykum'+name+' · '+greg+' · '+hij+'</small><b>'+phase+'</b><span>'+lbl+'</span>'+(ST.post&&stageNow===4?'<span class="hcta" onclick="event.stopPropagation();goTab(\'plan\',\'prep\',\'cdCard\')">🧳 Plan your next Umrah →</span>':'')+'</div><div class="hs-r"><div class="ring-wrap" style="width:64px;height:64px"><svg width="64" height="64" viewBox="0 0 92 92" style="width:64px;height:64px"><circle class="ring-bg" cx="46" cy="46" r="38"/><circle class="ring-fg" id="hRing" cx="46" cy="46" r="38"/></svg><div class="ring-num" style="font-size:.9em"><span id="hPct">'+pct+'%</span></div></div><em>'+cta[0]+' →</em></div></div>';
  if(tripOver&&!ST.post)h+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Start the 30-day habit keeper" onclick="startPost()"><div class="hp-i" style="background:var(--gold-soft)">🌱</div><div class="hp-t"><small>Back home?</small><div>Start the 30-day habit keeper <span>· prayers on time, Quran, dhikr</span></div></div><span class="hp-go">›</span></div>';
  if(ST.post)h+='<div class="card card-pad hpost" role="button" tabindex="0" aria-label="Open post-Umrah habits" onclick="goPost()"><div class="hp-i" style="background:var(--gold-soft)">🌱</div><div class="hp-t"><small>Post-Umrah mode · on</small><div>'+pc+' habit-days logged of 90 <span>· keep the Haram version of you</span></div></div><span class="hp-go">›</span></div>';
  // 3. Next prayer
  h+='<div class="card card-pad hprayer" role="button" tabindex="0" aria-label="Prayer times" onclick="goTab(\'daily\',\'today\')"><div class="hp-i">🕌</div><div class="hp-t"><small>Next prayer</small><div id="hNext">Loading…</div></div><span class="hp-go">›</span></div>';
  // 4. Journey stages
  h+='<div class="vh" style="margin-top:8px"><h2 style="font-size:1.35em">How it works — your journey in 5 stages</h2><p>Tap a stage to jump in. The app follows you from your living room to the mataf and back.</p></div>';
  h+='<div class="stages">'+stages.map(function(st,i){return '<div class="stage'+(i===stageNow?' now':'')+'" role="button" tabindex="0" aria-label="'+st.t+' — '+st.c+'" onclick="'+(st.oc||goStr(st.go))+'"><div class="stage-n">'+(i+1)+'</div><div class="stage-b"><div class="stage-h"><span class="stage-i">'+st.i+'</span><div><b>'+st.t+'</b><small>'+st.s+'</small></div>'+(i===stageNow?'<span class="nowtag">You are here</span>':'')+'</div><p>'+st.d+'</p><div class="fchips">'+st.f.map(function(f){return typeof f==='string'?'<span>'+f+'</span>':'<span class="go" role="button" tabindex="0" onclick="event.stopPropagation();'+f[1]+'">'+f[0]+' →</span>';}).join('')+'</div><div class="stage-cta">'+st.c+' →</div></div></div>';}).join('')+'</div>';
  // 5. Numbers
  h+='<div class="nums"><div><b>'+PLACES.length+'</b><small>sacred &amp; historic places</small></div><div><b>'+nq+'</b><small>quiz questions in '+QUIZ_LEVELS.length+' levels</small></div><div><b>'+nh+'</b><small>knowledge topics</small></div><div><b>'+DUAS.length+'</b><small>essential duas with audio</small></div></div>';
  // 6. Quick tools
  h+='<div class="vh" style="margin-top:6px"><h2 style="font-size:1.2em">Quick tools</h2></div>';
  h+='<div class="qa-grid">'+acts.map(function(x){return '<button class="qa" onclick="'+goStr([x[2],x[3]])+'"><span>'+x[0]+'</span>'+x[1]+'</button>';}).join('')+'<button class="qa wide" onclick="sosSheet()" aria-label="Hotel and emergency help"><span>🚕</span>Hotel / SOS <span style="font-size:1em;opacity:.55;font-weight:600">· driver card · I’m lost · 911 · 1966</span></button></div>';
  if(fc0)h+='<div class="card card-pad hfc" role="button" tabindex="0" aria-label="Study today’s knowledge card" onclick="startFC();goTab(\'plan\',\'learn\',\'fcCard\')"><small>🃏 Today’s knowledge card · '+due.length+(fcStarted()?' due':' ready')+'</small><b>'+fc0.f+'</b><span>Tap to study →</span></div>';
  h+='<div class="note" style="margin:0 0 12px">'+QUOTES[Math.floor(Date.now()/86400000)%QUOTES.length]+'</div>';
  h+='<div class="card card-pad"><h3>Common questions</h3>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is it really free? <span class="acc-c">▶</span></div><div class="acc-b">Yes — no ads, no subscriptions, no “pro” tier. Built as sadaqah jariyah for the Ummah. If it helps you, share it and make dua for those who built it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Does it work in the Haram without signal? <span class="acc-c">▶</span></div><div class="acc-b">Yes. Open it once with internet and it caches itself; the counters, rites guide, duas, places and your data all work offline. Prayer times work offline too (the Umm al-Qura month is cached, and computed times fill any gap); the map links need signal.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Where is my data stored? <span class="acc-c">▶</span></div><div class="acc-b">Only on your phone. There is no account and no server. Export a backup from Settings before changing phones; the document vault is encrypted with your PIN and cannot be recovered without it.</div></div>'
    +'<div class="acc"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">Is the religious content reliable? <span class="acc-c">▶</span></div><div class="acc-b">Every hadith is cited to its collection and was checked against the source text; weak narrations are avoided or marked. It is a study companion, not a fatwa service — ask a scholar for rulings on your situation. Scholar review is pending; corrections are welcome.</div></div>'
    +'</div>';
  h+='<div class="card card-pad" style="text-align:center"><h3 style="margin-bottom:6px">Made for the Ummah</h3><p style="font-size:.84em;color:var(--ink2);line-height:1.6">Free, no ads, no tracking. The sister app of <a href="https://www.ramadanstrivers.com/" target="_blank" rel="noopener" style="color:var(--brand-2);font-weight:700;text-decoration:none">Ramadan Strivers</a>. Share it with anyone going to Umrah.</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn ghost" style="margin-top:6px" onclick="shareApp()">📤 Share</button><button class="btn ghost" style="margin-top:6px" onclick="showQR()">▦ Show QR</button></div></div>';
  a.innerHTML=h;
  setTimeout(function(){setRing('hRing',pct);},50);
  loadPT();
}

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
  focusKey=k;fdOpen=false;document.getElementById('focus').classList.add('on');document.body.style.overflow='hidden';
  document.getElementById('focusTitle').textContent=k==='tawaf'?(ST.tmode==='nafl'?'🔁 Nafl tawaf':'🕋 Tawaf'):'⛰️ Sa’i';
  document.getElementById('focusOf').textContent=k==='tawaf'?'of 7 rounds':'of 7 laps';
  document.getElementById('focusHint').textContent='tap anywhere to count';
  if(k==='tawaf'&&ST.tmode!=='nafl'&&ST.wudu){stamp('tawafStart');renderLog();}
  renderFocusDua();updWudu();renderCnt(k);
  if(ST[k]<7)reqWake();
}
function exitFocus(){document.getElementById('focus').classList.remove('on');document.body.style.overflow='';if(wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}
  if(walkReturn){walkReturn=false;openWalkAt(walkI);}}
function focusTap(){cntr(focusKey,1);}
/* U-03: at 7/7 the big number stays, the tip becomes the hand-off */
function renderFocusDone(){var p=document.getElementById('focusDone'),t=document.getElementById('focusTip'),h=document.getElementById('focusHint');if(!p)return;
  var v=ST[focusKey],done=v>=7,open=document.getElementById('focus').classList.contains('on');
  p.hidden=!done;if(t)t.hidden=done;if(h)h.hidden=done;
  if(!done){p.innerHTML='';return;}
  if(open&&wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}
  if(focusKey==='tawaf'){
    if(ST.tmode==='nafl'){var d=dailyChk[dayKey()]||{},n=(d.ntawafN||(d.ntawaf?1:0))+1;p.innerHTML='<p>Nafl tawaf complete — 2 rakahs anywhere in the mosque, then Zamzam.</p><button class="btn" onclick="event.stopPropagation();logNafl()">✅ Log nafl tawaf #'+n+' · Count another</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';}
    else p.innerHTML='<p>Tawaf complete. Men: cover both shoulders. 2 rakahs behind Maqam Ibrahim — anywhere in the mosque if crowded — then Zamzam, then Safa.</p><button class="btn" onclick="event.stopPropagation();startSai()">Start Sa’i →</button><button class="chip-btn" onclick="event.stopPropagation();exitFocus()">✕ Exit</button>';
  }else p.innerHTML='<p>Sa’i done → halq / taqsir. Men shave (best) or trim; women trim a fingertip’s length — never shave. Ihram ends only after cutting.</p><button class="btn" onclick="event.stopPropagation();exitFocus();openRitePhase(\'ph4\')">Exit → tick halq / taqsir</button>';
}
/* U-09: the dua of this rite in a fixed strip outside the tap zone; tap = transliteration + meaning */
function focusDuaOf(){var i=duaIdx(focusKey==='tawaf'?'Yamani':'Safa');return i<0?null:DUAS[i];}
function renderFocusDua(){var e=document.getElementById('focusDua'),d=focusDuaOf();if(!e||!d)return;
  e.innerHTML='<span class="ar" lang="ar">'+d.ar+'</span>'+(fdOpen?'<span class="fd-s"><i>'+d.tl+'</i><br>'+d.tr+'</span>':'')+'<span class="fd-k">'+d.t+' · tap for '+(fdOpen?'less':'meaning')+'</span>';}
function fdToggle(){fdOpen=!fdOpen;renderFocusDua();vib(6);}
/* U-09: personal dua list without leaving the big counter (never touches the count) */
function myDuasSheet(){var h='<div class="sheet-h">🤲</div><h3>My duas</h3><p>Tick each one as you ask — the counter is not touched.</p>';
  if(!duas.length)h+='<p class="lead" style="text-align:center;color:var(--ink2)">Your list is empty — start with the people who asked you to pray for them.</p>';
  else h+=duas.map(function(d,i){return '<div class="brg'+(d.done?' done':'')+'" role="checkbox" tabindex="0" aria-checked="'+(d.done?'true':'false')+'" onclick="togDua('+i+');myDuasSheet()"><span class="tick"></span><span>'+esc(d.t)+'</span></div>';}).join('');
  h+='<div style="display:flex;gap:8px;margin-top:10px"><input class="srch" id="duaIn2" placeholder="Add a dua…" style="margin:0" onkeydown="if(event.key===\'Enter\')addDuaSheet()" aria-label="Add a dua"><button class="chip-btn" onclick="addDuaSheet()" aria-label="Add">＋</button></div><button class="btn ghost" onclick="closeSheet()">Close</button>';
  openSheet(h);}
function addDuaSheet(){var i=document.getElementById('duaIn2'),v=((i&&i.value)||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();renderDuaList();myDuasSheet();vib(15);}
document.addEventListener('visibilitychange',function(){if(document.visibilityState!=='visible'||!('wakeLock' in navigator))return;
  var fo=document.getElementById('focus').classList.contains('on');
  if(fo&&ST[focusKey]<7)reqWake();else if(document.getElementById('duaFocus').classList.contains('on'))navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});});

/* ════════════════════════ DUA READER (full-screen, M-11) ════════════════════════ */
var dfList=[],dfIdx=0;
function openDua(i){dfList=DUAS;dfIdx=i;renderDF();}
function openRiteDua(stepId,i){var st=riteStep(stepId);if(!st)return;var L=stDuas(st);if(!L.length)return;dfList=L.map(function(d){return {t:fcText(st.b)+(d.opt?' · optional':''),ar:d.ar,tl:d.tl,tr:d.tr,s:d.s||(d.opt||'')};});dfIdx=Math.min(L.length-1,i||0);renderDF();}
function renderDF(){
  var d=dfList[dfIdx];if(!d)return;
  document.getElementById('dfTitle').textContent='🤲 '+d.t;document.getElementById('dfAr').textContent=d.ar;document.getElementById('dfTl').textContent=d.tl||'';document.getElementById('dfTr').textContent=d.tr||'';document.getElementById('dfSrc').textContent=d.s||'';
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
  rows.forEach(function(r){var on=!!r[2];if(on)any=true;h+='<div class="lg'+(on?' on':'')+'"><span class="lg-i">'+r[0]+'</span><span class="lg-t">'+r[1]+(on&&r[3]?' <em>'+fmtDur(r[2]-r[3])+'</em>':'')+'</span><span class="lg-v">'+(on?fmtTime(r[2]):'—')+'</span></div>';});
  if(any&&lg.ihram&&lg.halq)h+='<div class="note" style="margin:8px 0 0">Total from ihram to halq: <b>'+fmtDur(lg.halq-lg.ihram)+'</b></div>';
  /* U-13: ticks older than a day with no halq are almost certainly a rehearsal */
  if(lg.ihram&&!lg.halq&&Date.now()-lg.ihram>86400000)h='<div class="note stale" style="margin:0 0 10px">These ticks are from <b>'+new Date(lg.ihram).toLocaleDateString('en-GB',{day:'numeric',month:'short'})+'</b> — practising earlier? <button class="lnk" onclick="startFresh()">Start fresh</button></div>'+h;
  if(any)h+='<button class="lnk fresh" onclick="startFresh()">↺ Start fresh (nothing recorded)</button>';
  a.innerHTML=h;
}
function renderUmrahs(){
  var a=document.getElementById('umrahsArea');if(!a)return;
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}
  if(!hist.length){a.innerHTML='<p style="font-size:.82em;color:var(--ink3)">No Umrah recorded yet — when you tap "Record completed Umrah", it appears here with a keepsake card.</p>';return;}
  a.innerHTML=(ST.umrahsPrev?'<p style="font-size:.78em;color:var(--ink2);margin-bottom:6px">🔁 '+ST.umrahsPrev+' Umrah'+(ST.umrahsPrev===1?'':'s')+' before this app, alhamdulillah.</p>':'')+hist.slice().reverse().map(function(u){var d=new Date(u.log.done||Date.now());return '<div class="lg on"><span class="lg-i">🕋</span><span class="lg-t">Umrah #'+(u.n+(ST.umrahsPrev||0))+' <em>'+d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+'</em></span><button class="chip-btn" onclick="makeKeepsake('+u.n+')">🎴 Keepsake</button></div>';}).join('');
}
function makeKeepsake(no){
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}
  var u=hist.filter(function(x){return x.n===no;})[0];if(!u)return;var lg=u.log;
  var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#0E3B2E');g.addColorStop(1,'#13402F');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.strokeStyle='#D9B45E';x.lineWidth=6;x.strokeRect(50,50,980,1250);
  x.textAlign='center';x.font='140px serif';x.fillText('🕋',540,300);
  x.font='700 40px Georgia,serif';x.fillStyle='#D9B45E';x.fillText('MY UMRAH · #'+(u.n+(ST.umrahsPrev||0)),540,400);
  x.font='700 64px Georgia,serif';x.fillStyle='#fff';x.fillText(ST.name||'A guest of Allah',540,500);
  x.font='30px Georgia,serif';x.fillStyle='rgba(255,255,255,.75)';x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  var y=680;x.textAlign='left';x.font='32px Georgia,serif';
  [['Ihram',lg.ihram],['Tawaf',lg.tawafStart,lg.tawafEnd],['Sa’i',lg.saiStart,lg.saiEnd],['Halq / taqsir',lg.halq]].forEach(function(r){
    x.fillStyle='#EFD494';x.fillText(r[0],180,y);x.fillStyle='rgba(255,255,255,.85)';x.textAlign='right';
    x.fillText(r[1]?fmtTime(r[1])+(r[2]?' → '+fmtTime(r[2])+'  ('+fmtDur(r[2]-r[1])+')':''):'—',900,y);x.textAlign='left';y+=70;});
  if(lg.ihram&&lg.halq){x.fillStyle='#D9B45E';x.font='700 34px Georgia,serif';x.textAlign='center';x.fillText('Ihram to halq: '+fmtDur(lg.halq-lg.ihram),540,y+40);}
  x.textAlign='center';x.font='italic 30px Georgia,serif';x.fillStyle='#EFD494';x.fillText('"Umrah to Umrah is an expiation for what is between them."',540,1140);
  x.font='24px Georgia,serif';x.fillStyle='rgba(255,255,255,.55)';x.fillText('Bukhari 1773 · umrah-strivers.vercel.app',540,1190);
  exportImage(c,'my-umrah-'+u.n+'.png','My Umrah keepsake');
}
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
  function row(o,cls,lbl){return '<div class="tli" role="checkbox" tabindex="0" aria-checked="false" onclick="tlTick(this,\''+o.it.id+'\')"><span class="tick"></span><div class="tli-t">'+o.it.label+'<small>'+o.sec.title+' · ideally '+(o.it.wk>=1?o.it.wk+' week'+(o.it.wk>1?'s':''):'days')+' before</small></div><span class="tli-when '+cls+'">'+lbl+'</span></div>';}
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
  var P=planTotals(),d=depDays(),lines=[];
  lines.push((ST.name?ST.name+'’s':'My')+' Umrah readiness'+(d!==null&&d>=0?' · '+d+' day'+(d===1?'':'s')+' to departure':'')+' — '+P.pct+'% ready');
  lines.push(activePlan().map(function(sec){var c=P.secs[sec.id];return sec.ico+' '+(sec.short||sec.title)+' '+c.done+'/'+c.tot;}).join(' · '));
  lines.push('📚 Quiz '+qzPassedCount()+'/'+QUIZ_LEVELS.length+' levels');
  var KL={passport:'Passport',visa:'Visa',menacwy:'MenACWY',nusuk:'Nusuk',rawdah:'Rawdah permit',insurance:'Insurance',ihram:'Ihram',abaya:'Ihram clothing'};
  var keys=['passport','visa','menacwy','nusuk','rawdah','insurance',ST.profile==='w'?'abaya':'ihram'];
  lines.push('Key items: '+keys.map(function(k){return (planChk[k]?'✓':'✗')+' '+KL[k];}).join(' · '));
  var B=tlBuckets();if(B&&B.over.length)lines.push('Overdue: '+B.over.length+(B.blocking?' ('+B.blocking+' travel-blocking)':''));
  lines.push('via Umrah Strivers');
  shareText('Umrah readiness',lines.join('\n'),APP_URL);
}
function renderCatTiles(){
  var a=document.getElementById('catTiles');if(!a)return;
  var secs=activePlan();a.classList.toggle('five',secs.length>4);
  a.innerHTML=secs.map(function(sec){var c=planCounts(sec.items),p=c.tot?Math.round(c.done/c.tot*100):0,lbl=sec.short||sec.title;return '<div class="st'+(p===100?' on':'')+'" role="button" tabindex="0" aria-label="'+lbl+' '+p+'% — open checklist" onclick="openPlanSec(\''+sec.id+'\')"><div class="i">'+sec.ico+'</div><div class="n" style="font-size:1.1em">'+p+'%</div><div class="l">'+lbl+'</div><div class="mini"><i style="width:'+p+'%"></i></div></div>';}).join('');
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
function mapsUrl(){var hi=ST.hotelInfo||{};return 'https://www.google.com/maps/dir/?api=1&destination='+(ST.hotel?ST.hotel[0]+','+ST.hotel[1]:encodeURIComponent((hi.n||'')+' '+(hi.a||'')+' Saudi Arabia'));}
function showDriver(){var hi=ST.hotelInfo||{};
  if(!hi.n){toast('Enter your hotel name first','','Add it',function(){goTab('plan','prep','hotelCard');setTimeout(function(){var e=document.getElementById('hName');if(e)e.focus();},700);});return;}
  document.getElementById('drvName').textContent=hi.n;document.getElementById('drvAddr').textContent=hi.a||'';document.getElementById('drvPhone').textContent=hi.p?'☎ '+hi.p:'';
  var online=navigator.onLine!==false;
  document.getElementById('drvActs').innerHTML=(hi.p?'<a href="tel:'+telOf(hi.p)+'" class="btn" onclick="event.stopPropagation()">☎ Call hotel</a>':'')+'<a class="btn ghost'+(online?'':' off')+'" href="'+mapsUrl()+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+(online?'🗺️ Open in Maps':'🗺️ Map needs signal')+'</a>';
  document.getElementById('driver').classList.add('on');vib(8);}
function closeDriver(){document.getElementById('driver').classList.remove('on');}
/* P-08: offline reunification card — leader's number, hotel, meeting point, 911 / 1966 in big type */
function showLost(){var hi=ST.hotelInfo||{},ph=leadPhone(),nm=leadName();
  var h='<div class="lost-ar">'+(ST.profile==='w'?'أنا ضائعة':'أنا ضائع')+'، من فضلك اتصل بهذا الرقم</div>';
  if(hi.l){h+='<div class="lost-en">I am with '+esc(nm||hi.l)+'. Please call:</div>'+(ph?'<a class="lost-tel" href="tel:'+telOf(ph)+'">☎ '+esc(ph)+'</a>':'<div class="lost-tel" style="font-size:1.4em">'+esc(hi.l)+'</div>');}
  else h+='<div class="lost-en">I am lost. Please help me reach my hotel, or call the emergency line.</div><div style="height:12px"></div>';
  if(hi.n)h+='<div class="lost-kv"><span>🏨 Hotel</span><b>'+esc(hi.n)+'</b></div>';
  if(hi.a)h+='<div class="lost-kv"><span>📍 Address</span><b style="text-align:right">'+esc(hi.a)+'</b></div>';
  if(hi.p)h+='<div class="lost-kv"><span>☎ Hotel phone</span><a href="tel:'+telOf(hi.p)+'">'+esc(hi.p)+'</a></div>';
  if(hi.m)h+='<div class="lost-kv"><span>🤝 Family meeting point</span><b style="text-align:right">'+esc(hi.m)+'</b></div>';
  h+='<div class="lost-kv"><span>🚓 Police · ambulance</span><a href="tel:911">911</a></div><div class="lost-kv"><span>🕋 Hajj &amp; Umrah care line</span><a href="tel:1966">1966</a></div>';
  if(!hi.l||!hi.n)h+='<button class="btn ghost" style="margin-top:16px;border-color:#0E3B2E;color:#0E3B2E;background:#fff" onclick="closeLost();goTab(\'plan\',\'prep\',\'hotelCard\')">✍️ Add '+(!hi.l&&!hi.n?'your hotel & a companion’s number':!hi.l?'a companion’s number':'your hotel')+'</button>';
  h+='<div class="focus-hint" style="color:#999;margin-top:26px;text-align:center" onclick="closeLost()">tap here to close</div>';
  document.getElementById('lostBody').innerHTML=h;document.getElementById('lost').classList.add('on');vib([20,30,20]);}
function closeLost(){document.getElementById('lost').classList.remove('on');}
/* Home quick tool + Daily trip card → one sheet with every safety action */
function sosSheet(){var hi=ST.hotelInfo||{};
  openSheet('<div class="sheet-h" style="background:linear-gradient(145deg,var(--danger),#7c2d12)">🚕</div><h3>Hotel &amp; SOS</h3><p>'+(hi.n?esc(hi.n)+(hi.m?' · meet at '+esc(hi.m):''):'No hotel saved yet — add it in Plan › Prepare so the driver card works offline.')+'</p><button class="btn" onclick="closeSheet();showDriver()">🚕 Show to driver</button><button class="btn danger" onclick="closeSheet();showLost()">🆘 I’m lost — show this</button><div style="display:flex;gap:8px;margin-top:10px"><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:911">☎ 911</a><a class="btn ghost" style="margin:0;text-align:center;text-decoration:none" href="tel:1966">☎ 1966 care</a></div><button class="btn ghost" onclick="closeSheet();goTab(\'plan\',\'prep\',\'hotelCard\')">✍️ Edit hotel &amp; contacts</button>');}
/* Umrah › Counters header: lost / hotel / meeting point */
function renderCntHd(){var a=document.getElementById('cntHd');if(!a)return;var hi=ST.hotelInfo||{};
  a.innerHTML='<button class="chip-btn sos" onclick="showLost()">🆘 I’m lost</button><button class="chip-btn" onclick="showDriver()">🚕 Hotel</button>'+(hi.m?'<button class="meetchip" style="margin:0" onclick="showLost()" aria-label="Family meeting point: '+esc(hi.m)+'"><span>📍 Meet: '+esc(hi.m)+'</span></button>':'');}
/* Daily › Today: today's itinerary line (P-11) and the trip card while on trip (P-07) */
function renderTodayTop(){var a=document.getElementById('todayTop');if(!a)return;var h='';
  var days=itinDays(),it=days[ST.day-1];
  if(it)h+='<div class="card todayit" role="button" tabindex="0" aria-label="Today’s itinerary — edit" onclick="goTab(\'plan\',\'prep\',\'itinCard\')"><span class="ti-i">🗓️</span><div class="ti-t"><b>Day '+ST.day+' · '+(it.city==='Makkah'?'🕋':'🕌')+' '+it.city+'</b>'+it.e[0]+' '+esc(it.e[1])+'</div><span class="xchip">Edit →</span></div>';
  if(onTrip()){var hi=ST.hotelInfo||{};
    h+='<div class="card tripc"><div class="tc-h"><span>🏨</span><b'+(hi.m?' title="Meeting point: '+esc(hi.m)+'"':'')+'>'+(hi.n?esc(hi.n):'Your hotel')+'</b><button class="chip-btn" onclick="showDriver()" aria-label="Show to driver">🚕 Driver</button><button class="chip-btn sos" onclick="showLost()" aria-label="I’m lost — show this">🆘 Lost</button><button class="chip-btn" onclick="sosSheet()" aria-label="Emergency numbers 911 and 1966, hotel actions">☎ SOS</button></div>'
      +(hi.n?'':'<input class="srch" id="tcName" placeholder="Hotel name — so the driver card works" onchange="quickHotel(this.value)" aria-label="Hotel name">')+'</div>';}
  a.innerHTML=h;}

/* ════════════════════════ PACKING BAGS ════════════════════════ */
function bagFilter(btn,bag){
  btn.parentNode.querySelectorAll('.pill').forEach(function(b){b.classList.toggle('on',b===btn);});
  document.querySelectorAll('#planContainer [data-bag]').forEach(function(r){r.style.display=(bag==='all'||r.getAttribute('data-bag')===bag)?'':'none';});
}

/* ════════════════════════ DUA LIST ════════════════════════ */
var duas=[];try{duas=JSON.parse(localStorage.getItem('us-dualist')||'[]');}catch(e){}
function saveDuas(){localStorage.setItem('us-dualist',JSON.stringify(duas));}
function addDua(){var i=document.getElementById('duaIn'),v=(i.value||'').trim();if(!v)return;duas.push({t:v,done:false});saveDuas();i.value='';renderDuaList();vib(15);}
function togDua(i){duas[i].done=!duas[i].done;saveDuas();renderDuaList();vib(10);}
function delDua(i){duas.splice(i,1);saveDuas();renderDuaList();}
function renderDuaList(){
  var a=document.getElementById('duaList');if(!a)return;
  if(!duas.length){a.innerHTML='<p style="font-size:.8em;color:var(--ink3)">Your list is empty. Start with the people who asked you to pray for them.</p>';return;}
  a.innerHTML=duas.map(function(d,i){return '<div class="row'+(d.done?' done':'')+'" style="padding:8px 6px"><span class="tick" onclick="togDua('+i+')"></span><div class="row-t" onclick="togDua('+i+')"><b>'+d.t.replace(/</g,'&lt;')+'</b></div><button class="chip-btn" style="padding:4px 10px" onclick="delDua('+i+')">✕</button></div>';}).join('')+'<p style="font-size:.74em;color:var(--ink3);margin-top:6px">'+duas.filter(function(d){return d.done;}).length+' of '+duas.length+' asked · <button class="lnk" style="font-size:1em" onclick="togDaily(\'dualist\')">'+((dailyChk[dayKey()]||{}).dualist?'✓ went through my list today':'Went through my list today? Tick it')+'</button></p>';
}

/* ════════════════════════ WATER & DISTANCE ════════════════════════ */
var waterD={};try{waterD=JSON.parse(localStorage.getItem('us-water')||'{}');}catch(e){}
function water(d){var k=dayKey();waterD[k]=Math.max(0,(waterD[k]||0)+d);localStorage.setItem('us-water',JSON.stringify(waterD));vib(10);renderWater();if(waterD[k]===8)toast('💧 8 cups — well hydrated, alhamdulillah');}
function renderWater(){
  var l=document.getElementById('waterLbl'),b=document.getElementById('waterBar'),k=document.getElementById('kmLbl');if(!l)return;
  var c=waterD[dayKey()]||0;l.textContent=c+' of 8 cups';b.style.width=Math.min(100,c/8*100)+'%';
  var km=ST.umrahs*6+ST.tawaf*0.4+ST.sai*0.45;
  for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d)km+=(d.ntawafN||(d.ntawaf?1:0))*2.8;}
  k.textContent='≈ '+(Math.round(km*10)/10)+' km';
}

/* ════════════════════════ ITINERARY ════════════════════════ */
function itinST(){var it=ST.itin=ST.itin||{};if(it.mad===undefined)it.mad=3;if(!it.first)it.first='makkah';if(!it.custom)it.custom={};return it;}
function itinHasCustom(){return Object.keys(itinST().custom).length>0;}
function itinClearOK(){if(!itinHasCustom())return true;if(confirm('Changing this resets the days you edited. Continue?')){itinST().custom={};return true;}return false;}
function setItin(first){if(!itinClearOK()){renderItin();return;}itinST().first=first;saveST();renderItin();renderTodayTop();}
function setItinDays(v){if(!itinClearOK()){renderItin();return;}itinST().mad=Math.max(0,Math.min(20,parseInt(v)||0));saveST();renderItin();renderTodayTop();}
function setPace(p){if(!itinClearOK()){renderItin();return;}itinST().pace=p||'';saveST();renderItin();renderTodayTop();}
var MK=[['🛬','Arrive · ihram at the miqat (in flight) · Umrah tonight when rested'],['🕌','All five prayers in the Haram · nafl tawaf after Fajr · rest'],['🚐','Ziyarah taxi loop: Hira → Arafat → Muzdalifah → Mina → Thawr'],['🤍','Second Umrah from Tan’eem (or Ji’ranah) · Zamzam & long dua'],['📖','Quran facing the Kaaba · Hijr Isma’il late night · Clock Tower museum'],['🕋','Nafl tawaf · Jannat al-Mu’alla · Masjid al-Jinn · rest'],['🌙','Tahajjud in the Haram · dua list at the Multazam · shopping']];
var MD=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'],['🕌','Rawdah (Nusuk permit) · Baqi’ after Fajr · Quba with wudu from the hotel'],['🚌','Hop-on hop-off: Qiblatayn → Trench → Uhud → Hijaz Railway'],['📿','Masjid al-Ijabah · Quran & Seerah museums · Ajwa dates market'],['🌙','Tahajjud in the Nabawi · Quba Avenue walk · long dua']];
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
    +'<p style="font-size:.72em;color:var(--ink3);margin-top:8px">A suggestion, not a rule — worship comes first; drop ziyarah if you are tired. Tap any day to rewrite it'+(itinHasCustom()?' (✎ = edited)':'')+'.</p>';
}
function itEdit(idx){var row=document.getElementById('it-'+idx);if(!row)return;var d=itinDays()[idx];if(!d)return;var t=row.querySelector('.it-t');if(!t||t.querySelector('textarea'))return;
  t.onclick=null;t.innerHTML='<span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span><textarea class="it-ed" id="itEd-'+idx+'" aria-label="Plan for day '+(idx+1)+'">'+esc(d.e[1])+'</textarea><div class="it-acts"><button class="chip-btn" style="background:var(--brand);color:#fff;border-color:var(--brand)" onclick="itSave('+idx+')">Save</button><button class="chip-btn" onclick="renderItin()">Cancel</button>'+(d.cus?'<button class="chip-btn" onclick="itReset('+idx+')">↺ Reset day</button>':'')+'</div>';
  var ta=document.getElementById('itEd-'+idx);if(ta)ta.focus();}
function itSave(idx){var ta=document.getElementById('itEd-'+idx);if(!ta)return;var v=ta.value.trim(),it=itinST();if(v&&v!==itinDaysDefault(idx))it.custom[idx]=v.slice(0,300);else delete it.custom[idx];saveST();renderItin();renderTodayTop();vib(10);}
function itinDaysDefault(idx){var it=itinST(),keep=it.custom;it.custom={};var d=itinDays()[idx];it.custom=keep;return d?d.e[1]:'';}
function itReset(idx){var it=itinST();delete it.custom[idx];saveST();renderItin();renderTodayTop();}
function shareItin(){var base=ST.dep?new Date(ST.dep+'T00:00:00'):null,it=itinST();
  var lines=[(ST.name?ST.name+'’s':'Our')+' Umrah itinerary · '+ST.tripLen+' days'+(base?' from '+fmtDate(ST.dep):'')+(it.pace==='family'?' · family pace':'')];
  itinDays().forEach(function(d,idx){var dt=base?new Date(base.getTime()+idx*86400000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})+' · ':'';lines.push('Day '+(idx+1)+' · '+dt+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+' — '+d.e[0]+' '+d.e[1]);});
  lines.push('via Umrah Strivers');shareText('Umrah itinerary',lines.join('\n'),APP_URL);}

var ITIN_PLACES={'Tan’eem':'taneem','Ji’ranah':'jiranah','Quba Avenue':'qubasq','Quba':'quba','Uhud':'uhud','Rawdah':'rawdah','Abyar Ali':'miqat','Hira':'hira','Arafat':'arafat','Muzdalifah':'muzdalifah','Mina':'mina','Thawr':'thawr','Baqi’':'baqi','Qiblatayn':'qiblatain','Trench':'khandaq','Hijaz Railway':'hijazrail','Masjid al-Jinn':'jinn','Jannat al-Mu’alla':'mualla','Masjid al-Ijabah':'ijabah','Clock Tower museum':'clock','Quran & Seerah museums':'quranmuseum','Hijr Isma’il':'hijr','Zamzam':'zamzam'};
var ITIN_RE=new RegExp(Object.keys(ITIN_PLACES).sort(function(a,b){return b.length-a.length;}).map(function(k){return k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|'),'g');
function linkPlaces(str){return str.replace(ITIN_RE,function(m){return '<span class="pl-link" onclick="event.stopPropagation();openPlace(\''+ITIN_PLACES[m]+'\')">'+m+'</span>';});}

/* ════════════════════════ SHARE PROGRESS CARD ════════════════════════ */
function shareCard(){
  var c=document.createElement('canvas');c.width=1080;c.height=1080;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,1080,1080);g.addColorStop(0,'#0E3B2E');g.addColorStop(1,'#0B2E24');x.fillStyle=g;x.fillRect(0,0,1080,1080);
  x.strokeStyle='#D9B45E';x.lineWidth=6;x.strokeRect(46,46,988,988);
  var logged=0,sum=0;for(var i=1;i<=ST.tripLen;i++){var p=dayPct(i);if(p!==null&&p>0){logged++;sum+=p;}}
  var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length,tb=0;Object.keys(tasbih).forEach(function(k){tb+=tasbih[k];});
  var nt=0;for(var j=1;j<=ST.tripLen;j++){var dd=dailyChk['d'+j];if(dd)nt+=(dd.ntawafN||(dd.ntawaf?1:0));}
  x.textAlign='center';x.font='100px serif';x.fillText('🕋',540,200);
  x.font='700 40px Georgia,serif';x.fillStyle='#D9B45E';x.fillText('UMRAH STRIVERS',540,280);
  x.font='700 56px Georgia,serif';x.fillStyle='#fff';x.fillText((ST.name||'My')+(ST.name?'’s':'')+' journey · Day '+ST.day+' of '+ST.tripLen,540,365);
  var tiles=[[ST.umrahs,'Umrahs'],[nt,'nafl tawafs'],[(logged?Math.round(sum/logged):0)+'%','avg. daily deeds'],[pv,'places visited'],[tb,'dhikr counted'],[streakOf('fajr'),'Fajr streak'],[logged,'days logged']];
  tiles.forEach(function(t,i){var cx=230+(i%3)*310,cy=500+Math.floor(i/3)*190;x.fillStyle='rgba(255,255,255,.08)';x.beginPath();x.roundRect(cx-130,cy-80,260,160,28);x.fill();x.fillStyle='#EFD494';x.font='700 58px Georgia,serif';x.fillText(String(t[0]),cx,cy+6);x.fillStyle='rgba(255,255,255,.7)';x.font='23px Inter,sans-serif';x.fillText(t[1],cx,cy+50);});
  x.fillStyle='rgba(255,255,255,.5)';x.font='24px Georgia,serif';x.fillText('Make dua for me · umrah-strivers.vercel.app',540,1010);
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
  if(!('crypto' in window)||!crypto.subtle){a.innerHTML='<p style="font-size:.8em;color:var(--ink3)">Secure storage needs HTTPS — open the app from umrah-strivers.vercel.app.</p>';return;}
  var has=!!localStorage.getItem('us-vault-chk');
  if(!vKey){a.innerHTML='<div style="display:flex;gap:8px"><input class="srch" id="vPin" type="password" inputmode="numeric" placeholder="'+(has?'Enter your PIN':'Choose a PIN (4+ digits)')+'" style="margin:0" onkeydown="if(event.key===\'Enter\')vUnlock()"><button class="chip-btn" onclick="vUnlock()">'+(has?'🔓 Unlock':'🔐 Create')+'</button></div><p style="font-size:.72em;color:var(--ink3);margin-top:8px">Forgotten PIN = lost documents. There is no reset — that is the point.</p>';return;}
  vAll().then(function(all){
    a.innerHTML='<div style="display:flex;gap:8px;margin-bottom:10px"><label class="btn ghost" style="margin:0;text-align:center;flex:1;cursor:pointer">📎 Add photo / PDF<input type="file" accept="image/*,application/pdf" style="display:none" onchange="vAdd(event)"></label><button class="chip-btn" onclick="vLock()">🔒 Lock</button></div>'+(all.length?all.map(function(d){return '<div class="lg on"><span class="lg-i">'+(d.type.indexOf('image')===0?'🖼️':'📄')+'</span><span class="lg-t">'+d.name.replace(/</g,'&lt;')+'</span><button class="chip-btn" onclick="vView('+d.id+')">View</button><button class="chip-btn" onclick="vRemove('+d.id+')">✕</button></div>';}).join(''):'<p style="font-size:.8em;color:var(--ink3)">Empty — add your passport photo page, visa, hotel and flight confirmations.</p>');
  });
}

/* ════════════════════════ HOTEL · NEAR ME · ROUTE ════════════════════════ */
var nearPos=null;
function hav(a,b){var R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180,x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
function distLbl(p){var from=nearPos||ST.hotel;if(!from||!p.ll)return '';var km=hav(from,p.ll);var walk=Math.round(km/4.5*60);return '≈ '+(km<10?(Math.round(km*10)/10)+' km':Math.round(km)+' km')+(km<3?' · '+walk+' min walk':'')+(nearPos?' from you':' from hotel');}
function updHotelLbl(){var hi=ST.hotelInfo||{},pin=ST.hotel?ST.hotel[0].toFixed(3)+', '+ST.hotel[1].toFixed(3):'';
  var l=document.getElementById('hotelLbl');if(l)l.textContent=hi.n?'🏨 '+hi.n+(ST.hotel?' · pinned':' · not pinned'):(ST.hotel?'🏨 Hotel pinned ('+pin+')':'🏨 No hotel saved');
  var l2=document.getElementById('hotelLbl2');if(l2)l2.textContent=ST.hotel?'📍 Pinned at '+pin+' — Places shows distances from here':'📍 Location not pinned — tap while at the hotel';}
function setHotel(){if(!navigator.geolocation){toast('Location not supported');return;}toast('Locating…');navigator.geolocation.getCurrentPosition(function(pos){ST.hotel=[pos.coords.latitude,pos.coords.longitude];saveST();updHotelLbl();renderPlaces();toast('🏨 Hotel location pinned — distances now show from here');},function(){toast('Location denied');});}
function nearMe(){if(nearPos){nearPos=null;document.getElementById('nearBtn').classList.remove('on');renderPlaces();return;}if(!navigator.geolocation){toast('Location not supported');return;}toast('Locating…');navigator.geolocation.getCurrentPosition(function(pos){nearPos=[pos.coords.latitude,pos.coords.longitude];document.getElementById('nearBtn').classList.add('on');renderPlaces();toast('📡 Sorted by distance from you');},function(){toast('Location denied');});}
function planRoute(city){
  var from=nearPos||ST.hotel;
  if(!from){toast('Set your hotel or tap Near me first');return;}
  var pool=PLACES.filter(function(p){return p.city===city&&p.ll&&!placeVis[p.id]&&p.g!=='tour'&&p.g!=='trip'&&['haram','mharam'].indexOf(p.g)<0;});
  var route=[],cur=from;
  while(pool.length&&route.length<8){pool.sort(function(a,b){return hav(cur,a.ll)-hav(cur,b.ll);});var nx=pool.shift();route.push(nx);cur=nx.ll;}
  var el=document.getElementById('route-'+city);if(!el)return;
  if(!route.length){el.innerHTML='<div class="note" style="margin:0 0 12px">Everything nearby is already visited — mashallah!</div>';return;}
  var wp=route.map(function(p){return p.ll[0]+','+p.ll[1];});
  var url='https://www.google.com/maps/dir/?api=1&origin='+from[0]+','+from[1]+'&destination='+wp[wp.length-1]+(wp.length>1?'&waypoints='+wp.slice(0,-1).join('|'):'')+'&travelmode=driving';
  var tot=0;cur=from;route.forEach(function(p){tot+=hav(cur,p.ll);cur=p.ll;});
  el.innerHTML='<div class="card card-pad" style="margin-bottom:12px"><h3 style="font-size:1em">🧭 Suggested order · ≈ '+Math.round(tot)+' km</h3>'+route.map(function(p,i){return '<div class="lg on"><span class="lg-i">'+(i+1)+'</span><span class="lg-t">'+p.i+' '+p.n+'</span></div>';}).join('')+'<a class="btn" style="text-align:center;text-decoration:none" href="'+url+'" target="_blank" rel="noopener">🗺️ Open route in Google Maps</a><p style="font-size:.72em;color:var(--ink3);margin-top:6px">Nearest-first from '+(nearPos?'your location':'your hotel')+', unvisited sites only. Check opening times; Baqi’ and Mu’alla open after Fajr/Asr.</p></div>';
}

/* ════════════════════════ HELPERS ════════════════════════ */
function jumpTo(id,quiet){var el=document.getElementById(id);if(!el)return;var off=118,strip=document.getElementById('riteNow');if(strip&&el.closest&&el.closest('#sub-umrah-steps')&&strip.offsetParent)off+=strip.offsetHeight+8;var y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});if(!quiet)vib(8);}
function shareApp(){
  var data={title:'Umrah Strivers',text:'Plan, learn, perform & track your Umrah — rites walkthrough, tawaf counter, prayer times, ziyarah places & a knowledge quiz. Free, offline, private.',url:APP_URL};
  if(ST.dep){var dt=new Date(ST.dep+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});data.url=APP_URL+'?dep='+ST.dep;data.text='We fly on '+dt+'. Install Umrah Strivers (free, offline, no account): 1) open the link and Add to Home Screen, 2) set the departure date to '+dt+', 3) do the Prepare checklist and pass Quiz levels 1–3 before we go.';}
  if(navigator.share){navigator.share(data).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(data.text+' '+data.url).then(function(){toast('🔗 Link copied — share it with your group');}).catch(function(){toast(data.url);});}
  else toast(data.url);
}
function showQR(){document.getElementById('qrShow').classList.add('on');vib(8);}
/* group link: ?dep=YYYY-MM-DD pre-sets the departure date on first open */
function applyDepLink(){
  var m=/[?&]dep=(\d{4}-\d{2}-\d{2})/.exec(location.search||'');if(!m)return;
  var dt=new Date(m[1]+'T00:00:00');
  if(!isNaN(dt)&&dt>new Date()&&!ST.dep){ST.dep=m[1];ST.onboarded=true;ST.stage=ST.stage||'plan';ST.sub=Object.assign(ST.sub||{},{plan:'prep'});ST.tab='plan';saveST();setTimeout(function(){toast('✈️ Departure set to '+dt.toLocaleDateString('en-GB',{day:'numeric',month:'long'})+' from your group’s link',true);},600);}
  try{history.replaceState(null,'',location.pathname);}catch(e){}
}
/* P-34 group setup link: #g=<base64 json> carries only trip settings — never progress */
var pendingGroup=null;
function shareSetup(){var hi=ST.hotelInfo||{};
  var g={by:ST.name||'',dep:ST.dep||'',tripLen:ST.tripLen,itin:ST.itin||null,city:ST.city||'Makkah',hotelInfo:hi,hotel:ST.hotel||null};
  var url=APP_URL+'#g='+btoa(encodeURIComponent(JSON.stringify(g)));
  var txt=(ST.name?ST.name+'’s':'Our')+' Umrah trip setup'+(ST.dep?' — flying '+fmtDate(ST.dep,true):'')+(hi.n?' · '+hi.n:'')+'. Open the link on your phone and tap Apply: it sets the dates, itinerary and hotel card in Umrah Strivers (free, offline). Your own checklists are untouched.';
  shareText('Umrah trip setup',txt,url);}
function parseGroupLink(){var h=location.hash||'';if(h.indexOf('#g=')!==0)return null;var out=null;
  try{var g=JSON.parse(decodeURIComponent(atob(h.slice(3))));if(g&&typeof g==='object'){out={};['by','dep','tripLen','itin','city','hotelInfo','hotel'].forEach(function(k){if(g[k]!==undefined)out[k]=g[k];});}}catch(e){out=null;}
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  return out;}
function showGroupSheet(g){var parts=[];if(g.dep)parts.push('Departure '+fmtDate(g.dep,true));if(g.tripLen)parts.push(g.tripLen+' days');if(g.itin&&typeof g.itin==='object')parts.push((g.itin.first==='madinah'?'Madinah':'Makkah')+' first'+(g.itin.mad!==undefined?' ('+g.itin.mad+' Madinah day'+(g.itin.mad===1?'':'s')+')':''));if(g.hotelInfo&&g.hotelInfo.n)parts.push(g.hotelInfo.n);
  openSheet('<div class="sheet-h">👥</div><h3>Apply '+(g.by?esc(g.by)+'’s':'the group’s')+' trip setup?</h3><p><b>'+esc(parts.join(' · ')||'Shared trip settings')+'</b></p><p style="font-size:.78em">Only the dates, itinerary, prayer city and hotel card are copied — your checklists, counters, quiz and journal stay exactly as they are.</p><button class="btn" onclick="applyGroup()">✅ Apply</button><button class="btn ghost" onclick="declineGroup()">Not now</button>');}
function applyGroup(){var g=pendingGroup;if(!g)return;var cl=function(v,a,b,d){v=parseInt(v);return isNaN(v)?d:Math.max(a,Math.min(b,v));};
  if(typeof g.dep==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(g.dep)&&!isNaN(new Date(g.dep+'T00:00:00')))ST.dep=g.dep;
  if(g.tripLen!==undefined){ST.tripLen=cl(g.tripLen,3,30,ST.tripLen);if(ST.day>ST.tripLen)ST.day=ST.tripLen;}
  if(g.itin&&typeof g.itin==='object'){var cus={};if(g.itin.custom&&typeof g.itin.custom==='object')Object.keys(g.itin.custom).forEach(function(k){if(/^\d+$/.test(k)&&typeof g.itin.custom[k]==='string')cus[k]=g.itin.custom[k].slice(0,300);});ST.itin={first:g.itin.first==='madinah'?'madinah':'makkah',mad:cl(g.itin.mad,0,20,3),pace:g.itin.pace==='family'?'family':'',custom:cus};}
  if(g.city==='Makkah'||g.city==='Madinah')ST.city=g.city;
  if(g.hotelInfo&&typeof g.hotelInfo==='object'){var hi={};['n','a','p','m','l'].forEach(function(k){if(typeof g.hotelInfo[k]==='string')hi[k]=g.hotelInfo[k].slice(0,200);});ST.hotelInfo=hi;}
  if(Array.isArray(g.hotel)&&g.hotel.length===2&&isFinite(g.hotel[0])&&isFinite(g.hotel[1]))ST.hotel=[+g.hotel[0],+g.hotel[1]];
  ST.onboarded=true;ST.stage=ST.stage||'plan';saveST();pendingGroup=null;closeSheet();
  var tl=document.getElementById('tripLen');if(tl)tl.value=ST.tripLen;var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');if(cm){cm.classList.toggle('on',ST.city==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  loadHotelInfo();updHotelLbl();updPlan();updDaily();updStats();renderItin();updChip();renderCntHd();
  goTab('plan','prep','cdCard');toast('👥 Trip setup applied'+(g.by?' from '+g.by:''),true);vib([30,40,60]);}
function declineGroup(){pendingGroup=null;closeSheet();if(!ST.onboarded)setTimeout(showOnboard,300);}

/* ════════════════════════ SUB-NAV ════════════════════════ */
function goSub(tab,sub,silent){
  ST.sub=ST.sub||{};ST.sub[tab]=sub;saveST();
  var view=document.getElementById('view-'+tab);if(!view)return;
  view.querySelectorAll('.sub').forEach(function(e){e.classList.toggle('on',e.id==='sub-'+tab+'-'+sub);});
  view.querySelectorAll('.seg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-sub')===sub);});
  if(!silent){vib(8);var top=view.querySelector('.seg');if(top){var y=top.getBoundingClientRect().top+window.scrollY-(62);if(window.scrollY>y)window.scrollTo({top:y,behavior:'smooth'});}}
  if(tab==='daily'&&sub==='stats'){updStats();}
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
  var txt='🧭 Plan',go=['plan','prep',null],fn=null;
  if(ST.post){txt='🌱 Post-Umrah';fn=function(){goPost();};}
  else if(ST.dep){
    var d=Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);
    if(d>0){txt='✈️ '+d+' day'+(d===1?'':'s');go=['plan','prep','tlCard'];}
    else if(d===0){txt='🛫 Today';go=['umrah','count',null];}
    else if(d<-ST.tripLen){txt='🌱 After Umrah';fn=function(){goPost();};}
    else{txt='🕋 Day '+(expectedDay()||ST.day)+' / '+ST.tripLen;go=['daily','today',null];}
  }
  c.textContent=txt;c.onclick=fn||function(){goTab(go[0],go[1],go[2]);};
  var sl=document.getElementById('stageLbl');if(sl){var names={plan:'Planning my trip',soon:'Flying soon',now:'In Makkah / Madinah',back:'Returned',before:'Been before'};sl.textContent=(ST.stage&&names[ST.stage]?'Now: '+names[ST.stage]+' · ':'')+'re-declare where you are — nothing is reset';}
}

/* ════════════════════════ ONBOARDING ════════════════════════ */
var obStage=null;
function showOnboard(){var o=document.getElementById('obSheet');if(!o)return;document.getElementById('obStep1').hidden=false;document.getElementById('obStep2').hidden=true;var n=document.getElementById('obName');if(n)n.value=ST.name||'';applyText();applyProfile();o.classList.add('on');}
function closeOnboard(){var o=document.getElementById('obSheet');if(!o)return;o.classList.remove('on');if(!ST.onboarded){ST.onboarded=true;saveST();}}
function obNum(id,lbl,val,min,max,hint){return '<div class="setrow"><div><b>'+lbl+'</b>'+(hint?'<small>'+hint+'</small>':'')+'</div><input type="number" class="numin" id="'+id+'" value="'+val+'" min="'+min+'" max="'+max+'" aria-label="'+lbl+'"></div>';}
function chooseStage(st){
  var nm=(document.getElementById('obName').value||'').trim();if(nm)ST.name=nm;
  ST.onboarded=true;ST.stage=st;obStage=st;
  if(st==='plan'||st==='soon'){ST.sub=Object.assign(ST.sub||{},{umrah:'steps'});ST.subAuto=ST.subAuto||{};delete ST.subAuto.umrah;goSub('umrah','steps',true);}
  saveST();
  var s2=document.getElementById('obStep2'),h='';
  var today=new Date();today.setHours(0,0,0,0);
  if(st==='plan'||st==='soon'){
    h='<div class="sheet-h">✈️</div><h3>When do you fly?</h3><p>Your departure date drives the countdown, the dated to-do timeline and the itinerary. You can change it any time in Plan › Prepare.</p><input type="date" class="srch" id="obDep" value="'+(ST.dep||'')+'" aria-label="Departure date">';
  }else if(st==='now'){
    var cur=ST.city||'Makkah';
    h='<div class="sheet-h">🕋</div><h3>Where are you today?</h3><p>So the prayer times, the day counter and the trip heatmap start in the right place.</p><div class="pills sm" style="justify-content:center;margin-bottom:10px"><button class="pill'+(cur==='Makkah'?' on':'')+'" id="obMk" onclick="obCity(\'Makkah\')">🕋 Makkah</button><button class="pill'+(cur==='Madinah'?' on':'')+'" id="obMd" onclick="obCity(\'Madinah\')">🕌 Madinah</button></div>'+obNum('obDay','Which day of your trip?',ST.day||1,1,30,'Day 1 = the day you arrived')+obNum('obLen','How many days in total?',ST.tripLen||10,3,30,'Both cities together');
  }else if(st==='before'){
    h='<div class="sheet-h">🔁</div><h3>Alhamdulillah — again!</h3><p>Umrahs you completed before using this app are counted in your totals (badges count only what this app records).</p>'+obNum('obPrev','How many Umrahs so far?',ST.umrahsPrev||1,0,99,'Before this trip');
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
    var len=parseInt((document.getElementById('obLen')||{}).value)||ST.tripLen||10;len=Math.max(3,Math.min(30,len));
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
  var c=document.getElementById('confetti');if(!c)return;
  var x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.style.display='block';
  var cols=['#D9B45E','#EFD494','#2FBE83','#3AD695','#FFFFFF','#B8892F'];
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
  var from=parseInt(el.textContent)||0;if(from===to){el.textContent=to+'%';return;}
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
  var g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#0E3B2E');g.addColorStop(.6,'#0B2E24');g.addColorStop(1,'#13402F');
  x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.strokeStyle='#D9B45E';x.lineWidth=6;x.strokeRect(50,50,980,1250);
  x.strokeStyle='rgba(217,180,94,.4)';x.lineWidth=2;x.strokeRect(70,70,940,1210);
  x.textAlign='center';x.fillStyle='#EFD494';
  x.font='120px serif';x.fillText('🕋',540,270);
  x.font='700 44px Georgia,serif';x.fillStyle='#D9B45E';x.fillText('UMRAH STRIVERS',540,370);
  x.font='italic 30px Georgia,serif';x.fillStyle='rgba(255,255,255,.7)';x.fillText('Certificate of Knowledge',540,425);
  x.font='700 72px Georgia,serif';x.fillStyle='#FFFFFF';x.fillText(name,540,580);
  x.strokeStyle='rgba(217,180,94,.6)';x.lineWidth=2;x.beginPath();x.moveTo(240,620);x.lineTo(840,620);x.stroke();
  x.font='30px Georgia,serif';x.fillStyle='rgba(255,255,255,.85)';
  x.fillText('has completed the full 7-level',540,700);
  x.fillText('Umrah Knowledge Circuit —',540,750);
  x.fillText('foundations, ihram, tawaf & sa’i, history,',540,800);
  x.fillText('virtues, Madinah and fiqh essentials.',540,850);
  x.font='italic 28px Georgia,serif';x.fillStyle='#EFD494';
  x.fillText('“Whoever travels a path seeking knowledge,',540,960);
  x.fillText('Allah makes easy for him a path to Paradise.”',540,1005);
  x.font='24px Georgia,serif';x.fillStyle='rgba(255,255,255,.55)';x.fillText('— Muslim 2699',540,1050);
  x.font='26px Georgia,serif';x.fillStyle='rgba(255,255,255,.6)';
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
  function read(arr,pre,src){arr.forEach(function(it,i){add({k:pre+i,f:it.t,b:it.b,src:'Read · '+src,type:'read'});});}
  function quiz(lv){var L=QUIZ_LEVELS[lv];if(!L)return;L.qs.forEach(function(q,i){add({k:'l'+lv+'q'+i,f:q.q,q:q,lv:lv,src:'Quiz · '+L.name.split(' · ')[0],type:'quiz'});});}
  quiz(0);read(KNOW,'know','Know before you go');quiz(1);quiz(2);read(FIQHQA,'qa','Fiqh Q&A');quiz(6);read(HISTORY,'hist','History');quiz(3);read(VIRTUES,'virt','Virtues');quiz(4);read(MADINAH,'mad','Madinah');quiz(5);read(SISTERS,'sis','For sisters');read(SCAMS,'scam','Scams');
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
    area.innerHTML='<button class="btn gold" onclick="startFC()">🃏 '+(started?'Review next '+n+' ('+due.length+' due)':'Start with '+n+' cards')+'</button>'+(qzWrongCount()?'<p style="font-size:.74em;color:var(--ink3);margin-top:8px;text-align:center">Your quiz mistakes come first.</p>':'');return;
  }
  var k=fcQueue[fcIdx],c=FC_MAP[k];if(!c){fcEnd();return;}
  var wrong=c.type==='quiz'&&!!qzST.wrong[k];
  area.innerHTML='<div class="fc-prog">Card '+(fcIdx+1)+' / '+fcQueue.length+'</div>'
   +'<div class="fc-wrap" id="fcWrap"><div class="fc" id="fcFlip" role="button" tabindex="0" aria-label="Reveal the answer" onclick="fcFlip()"><div class="fc-in">'
   +'<div class="fc-face fc-front"><span class="fc-src'+(wrong?' wrong':'')+'">'+(wrong?'🔁 from your quiz':c.src)+'</span><div class="t">'+c.f+'</div><div class="hint">Tap to reveal · then grade yourself</div></div>'
   +'<div class="fc-face fc-back">'+fcBack(c)+'<span class="fc-showq" role="button" tabindex="0" onclick="event.stopPropagation();fcUnflip()">↩ Show question</span></div>'
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
  document.getElementById('kqFb').innerHTML='<div class="qz-x">'+(ok?'⭐ Yes! ':'💛 Almost! ')+q.e+'</div><button class="btn" onclick="nextKQ()">'+(kqI<kqList.length-1?'Next →':'See my stars!')+'</button>';
  if(kqVoice)speakEn((ok?'Yes! ':'Almost! ')+q.e);
}
function nextKQ(){
  if(kqI<kqList.length-1){kqI++;renderKQ();return;}
  var stars=Math.max(1,Math.round(kqScore/kqList.length*5));
  var best=+(localStorage.getItem('us-kids')||0);
  if(kqScore>best){best=kqScore;localStorage.setItem('us-kids',String(best));}
  document.getElementById('kidsArea').innerHTML='<div class="qz-final"><div class="kq-stars">'+'⭐'.repeat(stars)+'</div><p style="font-size:1em"><b>'+kqScore+' / '+kqList.length+'</b> — '+(kqScore===kqList.length?'Mashallah, a little hafiz of Umrah! 🎉':'Great job — play again and get all the stars!')+'</p><button class="btn gold" onclick="startKids()">↺ Play again</button><button class="btn ghost" onclick="kidsDone()">✕ Done</button></div>';
  kidsBestLbl();
  vib([50,50,50,50,120]);if(kqScore===kqList.length)confetti(120);
}
/* P-37: story time — read-aloud stories under the kids quiz; openStory() is the target of the rite-step chips */
function renderStories(){var a=document.getElementById('storyList');if(!a)return;
  a.innerHTML=KIDS_STORIES.map(function(st){return '<div class="acc story" id="st-'+st.id+'"><div class="acc-h" role="button" tabindex="0" aria-expanded="false" onclick="accToggle(this)">'+st.emoji+' '+st.title+' <span class="acc-c">▶</span></div><div class="acc-b"><p>'+st.text+'</p><div class="story-when">🕰️ '+st.when+'</div><div class="story-acts"><button class="say" data-text="'+esc(st.title+'. '+st.text)+'" data-lang="en" data-rate=".9" onclick="speakBtn(this)" aria-label="Read the story aloud">🔊 Read aloud</button><span class="src">'+st.src+'</span></div></div></div>';}).join('');}
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
function startWalk(){var L=riteList(),nx=nextRite(),i=0;if(nx){L.forEach(function(x,k){if(x.st.id===nx.st.id)i=k;});}else i=L.length;openWalkAt(i);vib(8);}
function openWalkAt(i){walkI=i;walkOpen=true;document.getElementById('walk').classList.add('on');document.body.style.overflow='hidden';renderWalk();}
function renderWalk(){
  var L=riteList(),hd=document.getElementById('walkHd'),b=document.getElementById('walkBody'),nb=document.getElementById('walkNext'),bb=document.getElementById('walkBack');if(!b)return;
  if(walkI>=L.length){hd.textContent='All '+L.length+' steps';
    var cut=!!(riteChk.cut||riteChk.cutw);
    b.innerHTML='<div class="wk-done"><div class="big">🎉</div><h3>'+(cut?'Your Umrah is complete':'Every step ticked?')+'</h3><p>'+(cut?'All ihram restrictions are lifted. Record it to keep the timeline and start a fresh checklist for the next one.':'Tick halq / taqsir when the hair is cut — ihram ends only then.')+'</p><button class="btn gold" onclick="finishUmrah()">🎉 Record completed Umrah</button><button class="btn ghost" onclick="closeWalk()">← Back to the list</button></div>';
    nb.hidden=true;bb.hidden=false;b.scrollTop=0;return;}
  var x=L[walkI],st=x.st,on=!!riteChk[st.id],k=st.id==='rounds'?'tawaf':st.id==='laps'?'sai':null;
  hd.textContent='Step '+x.n+' of '+L.length+' · '+x.ph.title.replace(/^Phase \d+ · /,'').split(' — ')[0];
  var h='<div class="wk-n'+(on?' on':'')+'">'+(on?'✓ done':x.ph.ico)+'</div><h2 class="wk-t">'+st.b+'</h2><p class="wk-p">'+st.p+'</p>';
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
function buildPrint(){var e=document.getElementById('printSheet');if(!e)return;var hi=ST.hotelInfo||{},n=0,h='<h1>🕋 Umrah Strivers — rites &amp; duas</h1><p class="pr-sub">Printed '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+(ST.name?' for '+esc(ST.name):'')+' · umrah-strivers.vercel.app</p>';
  RITES.forEach(function(ph){h+='<h2>'+ph.ico+' '+ph.title+'</h2><ol start="'+(n+1)+'">';ph.steps.forEach(function(st){if(!forMe(st))return;n++;h+='<li><b>'+st.b+'</b> — '+st.p+stDuas(st).map(function(d){return '<div class="pr-dua"><span class="ar">'+d.ar+'</span><i>'+d.tl+'</i><br>'+d.tr+'</div>';}).join('')+'</li>';});h+='</ol>';});
  var pack=PLAN.filter(function(sc){return sc.id==='pack';})[0];if(pack)h+='<h2>🧳 Packing</h2><ul class="pr-pack">'+pack.items.filter(forMe).map(function(it){return '<li>☐ '+it.label+'</li>';}).join('')+'</ul>';
  h+='<h2>☎️ Emergency &amp; help</h2><p>Police · ambulance · fire <b>911</b> · Health line <b>937</b> · Hajj &amp; Umrah care <b>1966</b> · Tourism <b>930</b>'+(hi.n?'<br>Hotel: <b>'+esc(hi.n)+'</b>'+(hi.a?' · '+esc(hi.a):'')+(hi.p?' · ☎ '+esc(hi.p):''):'')+(hi.m?'<br>Meeting point: <b>'+esc(hi.m)+'</b>':'')+(hi.l?'<br>Companion / leader: <b>'+esc(hi.l)+'</b>':'')+'</p>';
  e.innerHTML=h;}
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
  if(!names.length){a.innerHTML=ST.kids?'<div class="card kd"><div class="kd-h"><b>🧒 Kids’ day</b><button class="chip-btn" onclick="goTab(\'plan\',\'quiz\',\'kidsCard\')">+ Add a child</button></div><small style="font-size:.78em;color:var(--ink2);line-height:1.45;display:block">Add their names in Kids corner — each child then gets five stars to earn every day, separate from your own tracker.</small></div>':'';return;}
  var D=kidsD['d'+ST.day]||{};
  a.innerHTML='<div class="card kd"><div class="kd-h"><b>🧒 Kids’ day</b><small>tap what they did · 5 of 5 = ⭐</small></div>'+names.map(function(n,ci){var r=D[ci]||{},st=kdStars(ci);
    return '<div class="kd-row"><div class="kd-name" title="'+esc(n)+'">'+esc(n)+'<small aria-label="'+st+' full day'+(st===1?'':'s')+'">'+(st?'⭐'.repeat(Math.min(st,6))+(st>6?'+'+(st-6):''):'')+'</small></div><div class="kd-tiles" role="group" aria-label="'+esc(n)+'’s day">'+KD_TILES.map(function(t,i){return '<button class="kd-t'+(r[i]?' on':'')+'" aria-pressed="'+(r[i]?'true':'false')+'" title="'+t[1]+'" aria-label="'+esc(n)+': '+t[1]+'" onclick="kdTap('+ci+','+i+')">'+t[0]+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';}
function kdTap(ci,i){var k='d'+ST.day,D=kidsD[k]||{},r=D[ci]||{};r[i]=!r[i];D[ci]=r;kidsD[k]=D;save('us-kids-daily',kidsD);vib(15);
  if(kdFull(ST.day,ci)){confetti(60);vib([40,60,100]);toast('⭐ '+(kidNames()[ci]||'Little pilgrim')+' — 5 of 5 today, mashallah!',true);}
  renderKidsDay();chkBadges();}
function addKid(){var i=document.getElementById('kidIn'),v=((i&&i.value)||'').trim().slice(0,24);if(!v)return;var n=kidNames().slice();if(n.length>=6){toast('Up to 6 children');return;}n.push(v);ST.kidNames=n;if(!ST.kids){ST.kids=true;updKidsSw();renderPlan();updPlan();}saveST();if(i)i.value='';renderKidNames();renderKidsDay();vib(10);toast('🧒 '+v+' added — their stars live in Daily › Today');}
function delKid(ci){var n=kidNames().slice();n.splice(ci,1);ST.kidNames=n;saveST();Object.keys(kidsD).forEach(function(k){var D=kidsD[k]||{},nd={};Object.keys(D).forEach(function(c){c=+c;if(c<ci)nd[c]=D[c];else if(c>ci)nd[c-1]=D[c];});kidsD[k]=nd;});save('us-kids-daily',kidsD);renderKidNames();renderKidsDay();}
function renderKidNames(){var a=document.getElementById('kidNames');if(!a)return;var n=kidNames();
  a.innerHTML=(n.length?'<div class="kd-list">'+n.map(function(x,i){var st=kdStars(i);return '<span class="chip-btn" style="display:inline-flex;align-items:center;gap:6px">'+esc(x)+(st?' <span style="color:var(--gold-ink)">⭐'+st+'</span>':'')+'<button class="lnk" style="text-decoration:none;color:var(--ink3)" onclick="delKid('+i+')" aria-label="Remove '+esc(x)+'">✕</button></span>';}).join('')+'</div>':'')
    +'<div class="kd-add"><input class="srch" id="kidIn" placeholder="Child’s name" maxlength="24" aria-label="Child’s name" onkeydown="if(event.key===\'Enter\')addKid()"><button class="chip-btn" onclick="addKid()">+ Add a child</button></div><p style="font-size:.74em;color:var(--ink3);margin-top:6px">Each child gets five daily stars on Daily › Today — prayed with us, Zamzam, dhikr, patience, learned one thing. Three 5-of-5 days earn the Little Pilgrim badge.</p>';}

/* ════════════════════════ POST-UMRAH MODE ════════════════════════ */
var POST_HABITS=['🕌 Five prayers on time','📖 Daily Quran','📿 Daily dhikr'];
var postData={};
function togPost(){ST.post=!ST.post;saveST();renderPost();updChip();}
function renderPost(){
  var sw=document.getElementById('postSw'),area=document.getElementById('postArea');
  if(!sw)return;
  sw.classList.toggle('on',!!ST.post);sw.setAttribute('aria-checked',ST.post?'true':'false');
  if(!ST.post){area.innerHTML='';return;}
  try{postData=JSON.parse(localStorage.getItem('us-post')||'{}');}catch(e){postData={};}
  var h='';
  POST_HABITS.forEach(function(hb,hi){
    var d=postData[hi]||{},cnt=Object.keys(d).filter(function(k){return d[k];}).length;
    h+='<div class="ph-row"><div class="ph-hd"><span>'+hb+'</span><span>'+cnt+'/30</span></div><div class="ph-grid">';
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
  var g=document.getElementById('ptGrid'),nx=document.getElementById('ptNext'),hj=document.getElementById('ptHijri');
  if(!g||!ptData)return;
  var city=ST.city||'Makkah';
  if(hj)hj.textContent=(ptData.h||hijriIntl())+' · '+city;
  var note=document.getElementById('ptNote');if(note)note.textContent=(ptSrc==='live'?'✓ Umm al-Qura (live)':ptSrc==='cache'?'Umm al-Qura (cached)':'Computed · ±2 min · follow the adhan')+(ptData.s?' · Duha from ~'+minHM(ptMin(ptData.s)+15):'')+' · '+city+' time';
  var N=ptNextOf(),d=dailyChk[dayKey()]||{},exc=!!d._excused,fri=isFriday();
  g.innerHTML=PT_NAMES.map(function(nm){var id=nm.toLowerCase(),on=!!d[id]&&!exc;return '<div class="pt'+(on?' done':'')+(exc?' excused':'')+'" id="pt-'+nm+'" role="checkbox" tabindex="0" aria-checked="'+(on?'true':'false')+'" aria-label="'+ptLabel(nm)+' '+cl(ptData.t[nm])+(on?', prayed in congregation':', tap when prayed in congregation')+'" onclick="togDaily(\''+id+'\')"><div class="pn">'+ptLabel(nm)+'</div><div class="pv">'+cl(ptData.t[nm])+'</div></div>';}).join('');
  var el=document.getElementById('pt-'+N.name);if(el)el.classList.add('next');
  var lbl=ptLabel(N.name),tm=cl(ptData.t[N.name]),jum=fri&&N.name==='Dhuhr',friNote=jum?' <span class="ptc">· arrive early — the Haram fills 1–2 h before</span>':'';
  var pi=PT_NAMES.indexOf(N.name),prev=pi>0?PT_NAMES[pi-1]:null,miss=(prev&&!exc&&!d[prev.toLowerCase()]&&expectedDay()===ST.day)?' <span class="ptc">· '+ptLabel(prev)+' not ticked</span>':'';
  nx.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span class="ptc">· '+tm+' · '+city+'</span>'+friNote+miss;
  var hn=document.getElementById('hNext'),meet=(ST.hotelInfo||{}).m;if(hn)hn.innerHTML='<b>'+lbl+'</b> in '+fmtDiff(N.diff)+' <span>· '+city+' · '+tm+(meet?' · meet: '+esc(meet):'')+(jum?' · arrive early':'')+'</span>';
  updRemSw();
  var mi=document.getElementById('ptMeet');if(mi&&document.activeElement!==mi)mi.value=meet||'';var ml=document.getElementById('ptLead');if(ml)ml.value=ST.meetLead?String(ST.meetLead):'';
  if(ptTimer)clearInterval(ptTimer);
  ptTimer=setInterval(function(){if(document.getElementById('view-daily').classList.contains('on'))renderPT_tick();},30000);
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
  lines.push((ptSrc==='calc'?'Computed times (±2 min) — follow the adhan':'Umm al-Qura times')+' · via Umrah Strivers');
  shareText('Prayer times · '+city,lines.join('\n'),APP_URL);}
/* D-23: a week of prayer alerts as .ics (TZID=Asia/Riyadh) — share sheet on phones, download elsewhere */
function icsDT(y,m,d,hm){return y+('0'+(m+1)).slice(-2)+('0'+d).slice(-2)+'T'+cl(hm).replace(':','')+'00';}
function buildICS(city,days){var now=riyadhNow(),ev=[],calc=0,stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  for(var i=0;i<days;i++){var dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),P=ptFor(city,y,m,d);if(P.calc)calc++;
    PT_NAMES.forEach(function(nm){var t=cl(P.t[nm]),jum=dt.getDay()===5&&nm==='Dhuhr',lbl=jum?'Jumu’ah':nm;
      ev.push(['BEGIN:VEVENT','UID:us-'+city.toLowerCase()+'-'+icsDT(y,m,d,t)+'-'+nm.toLowerCase()+'@umrah-strivers','DTSTAMP:'+stamp,'DTSTART;TZID=Asia/Riyadh:'+icsDT(y,m,d,t),'DTEND;TZID=Asia/Riyadh:'+icsDT(y,m,d,minHM(ptMin(t)+30)),'SUMMARY:'+lbl+' — '+city,'DESCRIPTION:'+(P.calc?'Computed times (±2 min) · follow the adhan':'Umm al-Qura times')+' · Umrah Strivers','BEGIN:VALARM','TRIGGER:-PT'+(jum?'60':'20')+'M','ACTION:DISPLAY','DESCRIPTION:'+lbl+' in '+(jum?'60':'20')+' min — '+city,'END:VALARM','END:VEVENT'].join('\r\n'));});}
  return {calc:calc,n:ev.length,ics:['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Umrah Strivers//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:Asia/Riyadh','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0300','TZOFFSETTO:+0300','TZNAME:AST','END:STANDARD','END:VTIMEZONE'].join('\r\n')+'\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR\r\n'};}
function exportICS(){var city=ST.city||'Makkah',B=buildICS(city,7),name='prayer-times-'+city.toLowerCase()+'-week.ics',blob=new Blob([B.ics],{type:'text/calendar'});
  var s=document.getElementById('icsSub');if(s)s.textContent='7 days · '+city+' · '+(B.calc?B.calc+' day'+(B.calc===1?'':'s')+' computed (±2 min), the rest Umm al-Qura':'Umm al-Qura times')+' · 20-min alert (60 for Jumu’ah)';
  var file=null;try{file=new File([blob],name,{type:'text/calendar'});}catch(e){}
  var dl=function(){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},500);toast('📅 '+B.n+' prayer alerts saved — open the .ics file to add them to your calendar',true);};
  if(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Prayer times · '+city}).then(function(){toast('📅 Sent — open it in Calendar to add the alerts',true);}).catch(function(err){if(err&&err.name==='AbortError')return;dl();});
  else dl();
}

/* ════════════════════════ TASBIH ════════════════════════ */
var TB_PHRASES=['SubhanAllah','Alhamdulillah','Allahu Akbar','La ilaha illallah','Astaghfirullah','Salawat ﷺ'];
/* D-06: the two ×100 phrases keep their own target and tick their checklist row at 100 */
var TB_LONG={4:'istighfar',5:'salawat'};
var tbPhrase=0,tbCount=0,tbTargetN=33;
var tasbihP={};try{tasbihP=JSON.parse(localStorage.getItem('us-tasbih-p')||'{}');}catch(e){}
function tbTarget(){return TB_LONG[tbPhrase]?100:33;}
function renderTB(){
  var c=document.getElementById('tbChips');if(!c)return;
  var h='';TB_PHRASES.forEach(function(ph,i){h+='<button class="tb-chip'+(i===tbPhrase?' on':'')+'" onclick="tbSet('+i+')">'+ph+'</button>';});
  c.innerHTML=h;tbTargetN=tbTarget();
  document.getElementById('tbN').textContent=tbCount;
  document.getElementById('tbTarget').textContent=tbTargetN;
  document.getElementById('tbToday').textContent=tasbih[dayKey()]||0;
  var pe=document.getElementById('tbPhraseN'),pp=(tasbihP[dayKey()]||{})[tbPhrase]||0;if(pe)pe.textContent='· '+TB_PHRASES[tbPhrase]+' '+pp+(TB_LONG[tbPhrase]?'/100':'');
}
function tbSet(i){tbPhrase=i;tbCount=0;renderTB();}
function tbTap(){
  var k=dayKey(),ph=tbPhrase,long=TB_LONG[ph];
  tbCount++;tasbih[k]=(tasbih[k]||0)+1;save('us-tasbih',tasbih);
  var P=tasbihP[k]||{};P[ph]=(P[ph]||0)+1;tasbihP[k]=P;save('us-tasbih-p',tasbihP);
  if(tbCount>=tbTarget()){vib([40,60,100]);toast('✨ '+TB_PHRASES[ph]+' ×'+tbTarget()+' complete');tbCount=0;if(!long)tbPhrase=(tbPhrase+1)%TB_PHRASES.length;}
  else vib(12);
  var d=dailyChk[k]||{},changed=false;
  if(long&&P[ph]>=100&&!d[long]){d[long]=true;changed=true;toast('📿 '+TB_PHRASES[ph]+' ×100 today — checklist ticked!');}
  if((tasbih[k]||0)>=100&&!d.dhikr100){d.dhikr100=true;changed=true;toast('📿 100 dhikr today — checklist updated!');}
  if(changed){dailyChk[k]=d;save('us-daily',dailyChk);updDaily();updStats();chkBadges();}
  renderTB();
}
function tbReset(){tbCount=0;renderTB();}
/* ════════════════════════ QIBLA ════════════════════════ */
var KAABA={lat:21.4225,lng:39.8262};
var qbBearing=null;
function qbCalc(lat,lng){
  var φ1=lat*Math.PI/180,φ2=KAABA.lat*Math.PI/180,Δλ=(KAABA.lng-lng)*Math.PI/180;
  var y=Math.sin(Δλ)*Math.cos(φ2);
  var x=Math.cos(φ1)*Math.sin(φ2)-Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
function qbSetNeedle(deg){var n=document.getElementById('qbNeedle');if(n)n.style.transform='translate(-50%,-100%) rotate('+deg+'deg)';}
function startQibla(){
  var st=document.getElementById('qbStatus');
  if(!navigator.geolocation){st.textContent='Location not supported on this device.';return;}
  st.textContent='Locating…';
  navigator.geolocation.getCurrentPosition(function(pos){
    qbBearing=Math.round(qbCalc(pos.coords.latitude,pos.coords.longitude));
    document.getElementById('qbDeg').textContent=qbBearing+'°';
    qbSetNeedle(qbBearing);
    st.innerHTML='Qibla is <b>'+qbBearing+'°</b> from North. Starting compass…';
    startCompass(st);
  },function(){st.textContent='Location denied — enable it in your browser settings and retry.';});
}
function startCompass(st){
  function onOri(e){
    var heading=null;
    if(typeof e.webkitCompassHeading==='number')heading=e.webkitCompassHeading;
    else if(e.absolute&&typeof e.alpha==='number')heading=360-e.alpha;
    if(heading===null||qbBearing===null)return;
    qbSetNeedle(qbBearing-heading);
    st.innerHTML='Rotate until the 🕋 points straight up — that\'s the qibla.';
  }
  if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
    DeviceOrientationEvent.requestPermission().then(function(p){
      if(p==='granted')window.addEventListener('deviceorientation',onOri);
      else st.innerHTML='Compass denied — face North yourself, then turn <b>'+qbBearing+'°</b> clockwise.';
    }).catch(function(){st.innerHTML='No compass — face North, then turn <b>'+qbBearing+'°</b> clockwise.';});
  }else if('ondeviceorientationabsolute' in window){window.addEventListener('deviceorientationabsolute',onOri);}
  else if(window.DeviceOrientationEvent){window.addEventListener('deviceorientation',onOri);}
  else st.innerHTML='No compass sensor — face North, then turn <b>'+qbBearing+'°</b> clockwise.';
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
  applyTheme();applyText();updSwipeSw();
  document.querySelectorAll('#verLbl,#verLbl2').forEach(function(e){e.textContent=APP_VERSION;});
  document.getElementById('quoteLine').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('tripLen').value=ST.tripLen;
  var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';
  renderPlan();renderRites();renderDaily();renderPlaces();renderDuas();renderTB();
  buildDeck();renderFC();renderPost();updRemSw();applySubs();updChip();renderItin();renderVault();renderDuaList();renderWater();updHotelLbl();loadHotelInfo();loadNiyyah();updKidsSw();applyProfile();renderCntHd();
  if(!ST.onboarded&&!pendingGroup)setTimeout(showOnboard,400);
  kidsBestLbl();renderStories();
  var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');
  if(cm){cm.classList.toggle('on',(ST.city||'Makkah')==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  renderKidNames();
  updPlan();updRites();updDaily();updPlaces();updStats();renderBadges();
  syncDay();
  goTab('home');
}
document.addEventListener('DOMContentLoaded',function(){loadAll();pendingGroup=parseGroupLink();applyDepLink();initUI();if(pendingGroup)setTimeout(function(){showGroupSheet(pendingGroup);},350);registerSW();});
