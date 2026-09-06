/* Umrah Strivers — application logic */
/* Release note: bump APP_VERSION here AND in sw.js for every release (the SW cache name is derived from it). */
var APP_VERSION='4.6.0';
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
  if(anchor){requestAnimationFrame(function(){setTimeout(function(){jumpTo(anchor,true);},30);});}
  else window.scrollTo({top:0,behavior:'smooth'});}
/* deep links used by chips in checklists and knowledge bodies (M-05) */
function goRef(tab,sub,anchor){if(tab==='places')placesReset();goTab(tab,sub||null,anchor||null);}
function placesReset(){if(cityFilter!=='all')filterCity('all');var sr=document.getElementById('plSearch');if(sr&&sr.value){sr.value='';renderPlaces();}}
function openPlace(id){var p=PLACES.filter(function(x){return x.id===id;})[0];if(!p)return;placesReset();var el=document.getElementById('pl-'+id);if(el)el.classList.add('open');goTab('places',null,'pl-'+id);}
function openTour(){placesReset();goTab('places',null,'tourCard');}
function goPost(enable){if(enable&&!ST.post){ST.post=true;saveST();renderPost();}goTab('more','guide','postCard');}
function startPost(){goPost(true);toast('🌱 Post-Umrah mode on — 30 days, 3 habits',true);}
function refChip(it){var q=function(v){return v?'\''+v+'\'':'null';};if(it.place)return '<button class="xchip" onclick="event.stopPropagation();openPlace('+q(it.place)+')">'+(it.goL||'📍 Open')+' →</button>';if(it.go)return '<button class="xchip" onclick="event.stopPropagation();goRef('+q(it.go[0])+','+q(it.go[1])+','+q(it.go[2])+')">'+(it.goL||'Open')+' →</button>';return '';}
function mkSec(sec,shut,inner,countId){
  var apps='';
  if(sec.apps)apps='<div class="apps">'+sec.apps.map(function(x){var go=x.u?'href="'+x.u+'" target="_blank" rel="noopener"':'href="#" onclick="event.preventDefault();goTab(\''+x.go[0]+'\');goSub(\''+x.go[0]+'\',\''+x.go[1]+'\',true)"';return '<a class="applink" '+go+'><span class="app-i">'+x.i+'</span><span class="app-t"><b>'+x.n+'</b>'+x.d+'</span><span class="app-go">'+(x.u?'Open ↗':'Go →')+'</span></a>';}).join('')+'</div>';
  return '<div class="sec'+(shut?' shut':'')+'" id="sec-'+sec.id+'"><div class="sec-hd" role="button" tabindex="0" aria-expanded="'+(shut?'false':'true')+'" onclick="togSec(this)"><div class="sec-ico">'+(sec.ico||'•')+'</div><h2>'+sec.title+(sec.sub?'<small>'+sec.sub+'</small>':'')+'</h2><span class="sec-ct" id="sp-'+sec.id+'"></span><span class="sec-chev">▼</span></div><div class="sec-bd">'+(sec.hn?'<div class="note">'+sec.hn+'</div>':'')+apps+inner+'</div></div>';
}

/* ════════════════════════ PLAN ════════════════════════ */
function renderPlan(){
  var h='';
  activePlan().forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      if(!forMe(it))return;
      inner+='<div class="row" id="pw-'+it.id+'"'+(it.bag?' data-bag="'+it.bag+'"':'')+' role="checkbox" tabindex="0" aria-checked="false" onclick="togPlan(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+refChip(it)+'</div></div>';
    });
    if(sec.id==='pack')inner='<div class="pills sm bagpills" style="margin:6px 0 10px;flex-wrap:wrap"><button class="pill on" onclick="event.stopPropagation();bagFilter(this,\'all\')">All</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'ihram\')">🤍 Ihram bag</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'carry\')">✈️ Carry-on</button><button class="pill" onclick="event.stopPropagation();bagFilter(this,\'case\')">🧳 Suitcase</button></div>'+inner;
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('planContainer').innerHTML=h;
  function accs(arr){var k='';arr.forEach(function(g){k+='<div class="acc" onclick="this.classList.toggle(\'open\')"><div class="acc-h">'+g.t+' <span class="acc-c">▶</span></div><div class="acc-b">'+g.b+'</div></div>';});return k;}
  document.getElementById('knowContainer').innerHTML=accs(KNOW);
  document.getElementById('histContainer').innerHTML=accs(HISTORY);
  document.getElementById('virtContainer').innerHTML=accs(VIRTUES);
  document.getElementById('madContainer').innerHTML=accs(MADINAH);
  document.getElementById('qaContainer').innerHTML=accs(FIQHQA);
  document.getElementById('scamContainer').innerHTML=accs(SCAMS);
}
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
  renderLevels();
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
var qzLevel=0,qzI=0,qzScore=0,qzLock=false,qzHist=[],qzMode='level',qzQueue=[];
if(!qzST.wrong)qzST.wrong={};
function qzSave(){localStorage.setItem('us-quiz',JSON.stringify(qzST));}
function qzWrongCount(){return Object.keys(qzST.wrong).length;}
function curRef(){return qzMode==='level'?{lv:qzLevel,qi:qzI}:qzQueue[qzI];}
function curQ(){var r=curRef();return QUIZ_LEVELS[r.lv].qs[r.qi];}
function curKey(){var r=curRef();return 'l'+r.lv+'q'+r.qi;}
function qzTotal(){return qzMode==='level'?QUIZ_LEVELS[qzLevel].qs.length:qzQueue.length;}
function qzPassed(i){return (qzST.best[i]||0)>=80;}
function qzUnlocked(i){return i===0||qzPassed(i-1);}
function qzPassedCount(){var n=0;QUIZ_LEVELS.forEach(function(_,i){if(qzPassed(i))n++;});return n;}
function qzAllPassed(){return qzPassedCount()===QUIZ_LEVELS.length;}
function renderLevels(){
  var h='';
  QUIZ_LEVELS.forEach(function(lv,i){
    var un=qzUnlocked(i),ps=qzPassed(i),best=qzST.best[i];
    h+='<div class="lvl'+(un?'':' locked')+(ps?' passed':'')+'" role="button" tabindex="0"'+(un?'':' aria-disabled="true"')+' aria-label="'+lv.name.replace(/"/g,'')+(ps?', passed '+best+'%':(un?'':', locked'))+'" onclick="startLevel('+i+')">'
      +'<div class="lvl-n">'+(un?lv.icon:'🔒')+'</div>'
      +'<div class="lvl-t"><b>'+lv.name+'</b><small>'+lv.desc+' · '+lv.qs.length+' questions</small></div>'
      +'<div class="lvl-s">'+(ps?'✓ '+best+'%':(best!==undefined?best+'%':(un?'Start →':'Locked')))+'</div></div>';
  });
  var wc=qzWrongCount();
  if(wc>0)h+='<button class="btn ghost" onclick="startMistakes()">🔁 Review my mistakes ('+wc+')</button>';
  if(qzAllPassed())h+='<div class="note" style="margin-top:10px">🏆 Circuit complete! You have the knowledge — now go with presence of heart. Taqabbal Allah.</div><button class="btn gold" onclick="makeCert()">🎖️ Download my certificate</button>';
  document.getElementById('qzArea').innerHTML=h;
  var pc=qzPassedCount();
  document.getElementById('qzBest').textContent=pc+'/'+QUIZ_LEVELS.length;
  var m=document.getElementById('qzMeter');if(m)m.style.width=Math.round(pc/QUIZ_LEVELS.length*100)+'%';
}
function startLevel(i){
  if(!qzUnlocked(i)){toast('🔒 Pass '+QUIZ_LEVELS[i-1].name.split(' · ')[0]+' first (80%+)');vib([50,40,50]);return;}
  qzMode='level';qzLevel=i;qzI=0;qzScore=0;qzHist=[];renderQz();
}
function startMistakes(){
  qzQueue=Object.keys(qzST.wrong).map(function(k){var m=k.match(/^l(\d+)q(\d+)$/);return m?{lv:+m[1],qi:+m[2]}:null;}).filter(function(x){return x&&QUIZ_LEVELS[x.lv]&&QUIZ_LEVELS[x.lv].qs[x.qi];});
  if(!qzQueue.length){toast('No mistakes to review — mashallah!');return;}
  qzMode='mist';qzI=0;qzScore=0;qzHist=[];renderQz();
}
function qzOpts(q){return q.o?q.o:['True','False'];}
function qzAns(q){return q.o?q.a:(q.a===0?0:1);}
function qzDots(n){var h='';for(var i=0;i<n;i++){h+='<i class="'+(i<qzHist.length?(qzHist[i]?'f':'w'):'')+'"></i>';}return '<div class="qz-dots" role="img" aria-label="Question '+(qzI+1)+' of '+n+'">'+h+'</div>';}
function renderQz(){
  qzLock=false;
  var q=curQ(),tot=qzTotal();
  var head=qzMode==='mist'?'🔁 Mistake review':QUIZ_LEVELS[qzLevel].icon+' '+QUIZ_LEVELS[qzLevel].name.split(' · ')[0];
  var h='<div class="qz-top"><span>'+head+' · Q'+(qzI+1)+'/'+tot+'</span><span class="qz-exit" onclick="renderLevels()">✕ Exit</span></div>'+qzDots(tot)+'<div class="qz-q">'+q.q+'</div>';
  qzOpts(q).forEach(function(o,i){h+='<button class="qz-o" id="qzo-'+i+'" onclick="answerQz('+i+')">'+(q.o?String.fromCharCode(65+i)+'. ':'')+o+'</button>';});
  h+='<div id="qzFb" aria-live="polite"></div>';
  document.getElementById('qzArea').innerHTML=h;
}
function answerQz(i){
  if(qzLock)return;qzLock=true;
  var q=curQ(),ans=qzAns(q),ok=i===ans;
  qzHist.push(ok);
  if(ok){qzScore++;vib(30);delete qzST.wrong[curKey()];}else{vib([60,40,60]);qzST.wrong[curKey()]=1;}
  qzSave();
  document.getElementById('qzo-'+ans).classList.add('right');
  if(!ok)document.getElementById('qzo-'+i).classList.add('wrong');
  document.getElementById('qzFb').innerHTML='<div class="qz-x">'+(ok?'✅ Correct! ':'❌ ')+q.e+'</div><button class="btn" onclick="nextQz()">'+(qzI<qzTotal()-1?'Next question →':'See my score')+'</button>';
}
function nextQz(){
  if(qzI<qzTotal()-1){qzI++;renderQz();return;}
  if(qzMode==='mist'){
    var cleared=qzScore,tot0=qzQueue.length;
    document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+cleared+'/'+tot0+'</div><p>mistakes cleared'+(qzWrongCount()?' — '+qzWrongCount()+' still to master.':' — clean slate, mashallah! 🎉')+'</p><button class="btn ghost" onclick="renderLevels()">← All levels</button>'+(qzWrongCount()?'<button class="btn gold" onclick="startMistakes()">↺ Review remaining</button>':'')+'</div>';
    return;
  }
  var lv=QUIZ_LEVELS[qzLevel];
  var pct=Math.round(qzScore/lv.qs.length*100);
  var prevBest=qzST.best[qzLevel]||0;
  if(pct>prevBest){qzST.best[qzLevel]=pct;}
  qzSave();
  var passed=pct>=80;
  var msg;
  if(passed&&qzLevel<QUIZ_LEVELS.length-1)msg='Level passed! '+QUIZ_LEVELS[qzLevel+1].icon+' '+QUIZ_LEVELS[qzLevel+1].name.split(' · ')[1]+' is now unlocked.';
  else if(passed)msg='Final level passed — the whole circuit is yours!';
  else msg='You need 80% to pass — review the knowledge cards above and retake.';
  if(passed){toast('🎉 '+lv.name.split(' · ')[0]+' passed!',true);vib([40,60,120]);confetti(qzAllPassed()?160:70);}
  if(qzAllPassed()&&!planChk['quiz80']){planChk['quiz80']=true;save('us-plan',planChk);updPlan();toast('🏆 Knowledge circuit complete!',true);}
  ST.quizBest=Math.max(ST.quizBest||0,pct);saveST();
  chkBadges();
  var pc=qzPassedCount();
  document.getElementById('qzBest').textContent=pc+'/'+QUIZ_LEVELS.length;
  var m=document.getElementById('qzMeter');if(m)m.style.width=Math.round(pc/QUIZ_LEVELS.length*100)+'%';
  document.getElementById('qzArea').innerHTML='<div class="qz-final"><div class="big">'+pct+'%</div><p>'+qzScore+' of '+lv.qs.length+' correct — '+msg+'</p><button class="btn gold" onclick="startLevel('+qzLevel+')">↺ Retake level</button><button class="btn ghost" onclick="renderLevels()">← All levels</button></div>';
}

/* ════════════════════════ RITES ════════════════════════ */
function renderRites(){
  var h='',n=0;
  RITES.forEach(function(ph,i){
    var inner='';
    ph.steps.forEach(function(st){
      if(!forMe(st))return;
      n++;
      inner+='<div class="stp" id="rw-'+st.id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="togRite(\''+st.id+'\')"><div class="stp-n">'+n+'</div><div class="stp-t"><b>'+st.b+'</b><p>'+st.p+(st.why?' <button class="why" onclick="event.stopPropagation();this.parentNode.nextSibling.classList.toggle(\'on\')">Why?</button>':'')+'</p>'+(st.why?'<div class="whyb">'+st.why+'</div>':'')+(st.dua?'<div class="dua tapable" onclick="event.stopPropagation();openRiteDua(\''+st.id+'\')"><div class="dua-top"><small>Dua</small><button class="say" data-ar="'+st.dua.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊 Listen</button></div><span class="ar">'+st.dua.ar+'</span><span class="tl">'+st.dua.tl+'</span><span class="tr">'+st.dua.tr+'</span><span class="enl">⛶ tap to enlarge</span></div>':'')+'</div></div>';
    });
    h+=mkSec(ph,i>0,inner);
  });
  document.getElementById('riteContainer').innerHTML=h;
  renderCnt('tawaf');renderCnt('sai');
}
function stamp(k){ST.log=ST.log||{};if(!ST.log[k]){ST.log[k]=Date.now();saveST();}}
function togRite(id){riteChk[id]=!riteChk[id];save('us-rites',riteChk);vib(15);
  if(riteChk[id]){if(id==='niyyah')stamp('ihram');if(id==='cut'||id==='cutw')stamp('halq');}
  updRites();renderLog();}
function updRites(){
  var R=riteTotals(),tot=R.tot,done=R.done;
  RITES.forEach(function(ph){ph.steps.forEach(function(st){var on=!!riteChk[st.id];var w=document.getElementById('rw-'+st.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});var c=riteCounts(ph.steps);var sp=document.getElementById('sp-'+ph.id);if(sp)sp.textContent=c.done+'/'+c.tot;});
  var pct=tot?Math.round(done/tot*100):0;
  animPct('ritePct',pct);setRing('riteRing',pct);
  document.getElementById('riteHeroT').textContent=pct>=100?'Taqabbal Allah! 🎉':pct>0?done+' of '+tot+' steps':'Step by step';
  document.getElementById('riteHeroS').textContent='🕋 Umrahs completed: '+totalUmrahs()+(ST.umrahsPrev?' (incl. '+ST.umrahsPrev+' before this app)':'');
  renderCnt('tawaf');renderCnt('sai');renderLog();renderUmrahs();updWudu();renderCntHd();
}
var TAWAF_TIPS=['Wudu first — then start at the Black Stone line: "Bismillahi wallahu akbar", Kaaba on your left.','Round 1 · men walk briskly (raml). Touch the Yamani corner if easy, then "Rabbana atina…"','Round 2 · keep the raml. Any dhikr or dua you love — nothing fixed.','Round 3 · last raml round. Guard your gaze and your tongue in the crowd.','Round 4 · normal pace now. Dua for your parents and those who asked you.','Round 5 · istighfar. Don’t push at the Stone — point and say Allahu Akbar.','Round 6 · salawat on the Prophet ﷺ. Stay close to your group.','Tawaf complete → cover both shoulders, 2 rakahs behind Maqam Ibrahim, then Zamzam.'];
var SAI_TIPS=['On Safa: face the Kaaba, praise Allah, repeat the dhikr 3× with your own duas.','Lap 1 · Safa → Marwah. Men jog lightly between the green lights.','Lap 2 · back to Safa. Remember Hajar’s trust: "He will not abandon us."','Lap 3 · dua is accepted here — pour out your heart.','Lap 4 · halfway. Sip Zamzam from the coolers if you need to.','Lap 5 · dua for the ummah — the angel says "Amin, and for you the same."','Lap 6 · one to go. Salawat and istighfar.','Sa’i complete → halq or taqsir, then your Umrah is done. Taqabbal Allah!'];
function renderCnt(k){
  var v=ST[k];
  var tip=document.getElementById(k+'Tip');if(tip)tip.textContent=(k==='tawaf'?TAWAF_TIPS:SAI_TIPS)[v]||'';
  if(k===focusKey){var fn=document.getElementById('focusN'),ft=document.getElementById('focusTip');if(fn)fn.textContent=v;if(ft)ft.textContent=(k==='tawaf'?TAWAF_TIPS:SAI_TIPS)[v]||'';}
  document.getElementById(k+'N').textContent=v;
  var ring=document.getElementById(k+'Ring');
  if(ring)ring.style.strokeDashoffset=565*(1-v/7);
  document.getElementById(k+'Done').style.display=v>=7?'block':'none';
  var tp=document.getElementById(k+'Tap');if(tp)tp.textContent=v>=7?'Complete ✓':'tap to count';
  var rb=document.getElementById(k+'RingBtn');if(rb)rb.setAttribute('aria-label',v>=7?(k==='tawaf'?'Tawaf complete, 7 of 7 rounds':'Sa’i complete, 7 of 7 laps'):(k==='tawaf'?'Count a tawaf round, '+v+' of 7 done':'Count a sa’i lap, '+v+' of 7 done'));
}
function togWudu(){ST.wudu=!ST.wudu;saveST();updWudu();if(ST.wudu)toast('💧 Wudu confirmed — bismillah, begin at the Black Stone line');}
function updWudu(){var c=document.getElementById('wuduCard'),sw=document.getElementById('wuduSw');if(!c)return;c.classList.toggle('ok',!!ST.wudu);sw.classList.toggle('on',!!ST.wudu);sw.setAttribute('aria-checked',ST.wudu?'true':'false');}
function cntr(k,d){
  if(k==='tawaf'&&d>0&&ST.tawaf===0&&!ST.wudu){
    if(confirm('Tawaf requires wudu. Are you in wudu right now?')){ST.wudu=true;saveST();updWudu();}
    else{toast('💧 Make wudu first — tawaf is like salah');vib([60,40,60]);return;}
  }
  var v=Math.max(0,Math.min(7,ST[k]+d));
  if(v===ST[k])return;ST[k]=v;saveST();
  if(v===1&&d>0)stamp(k+'Start');if(v===7)stamp(k+'End');renderLog();vib(v===7?[50,60,140]:35);renderCnt(k);
  if(v===7)confetti(50);
  if(v===7)toast(k==='tawaf'?'🕋 Tawaf complete! Pray 2 rakahs at Maqam Ibrahim':'⛰️ Sa’i complete! Proceed to halq/taqsir');
}
function cntrReset(k){ST[k]=0;if(k==='tawaf')ST.wudu=false;saveST();renderCnt(k);updWudu();}
function finishUmrah(){
  var R=riteTotals(),done=R.done,tot=R.tot;
  if(done<tot&&!confirm('Only '+done+' of '+tot+' steps are ticked. Record this Umrah as complete anyway?'))return;
  var lg=ST.log||{};lg.done=Date.now();var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}hist.push({n:ST.umrahs+1,log:lg});localStorage.setItem('us-umrahlog',JSON.stringify(hist));
  ST.umrahs++;ST.tawaf=0;ST.sai=0;ST.wudu=false;ST.log={};saveST();renderUmrahs();updWudu();
  riteChk={};save('us-rites',riteChk);
  updRites();renderLog();chkBadges();
  toast('🎉 Umrah #'+ST.umrahs+' recorded — may Allah accept it!',true);confetti(140);
}

/* ════════════════════════ DAILY ════════════════════════ */
function renderDaily(){
  var h='';
  DAILY.forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      inner+='<div class="row" id="dw-'+it.id+'" role="checkbox" tabindex="0" aria-checked="false" onclick="togDaily(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+(it.ref?'<div class="rf">'+it.ref+'</div>':'')+refChip(it)+'</div><span class="pts">+'+it.pts+'</span></div>';
    });
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('dailyContainer').innerHTML=h;
}
function dayKey(){return 'd'+ST.day;}
function togDaily(id){var d=dailyChk[dayKey()]||{};d[id]=!d[id];dailyChk[dayKey()]=d;save('us-daily',dailyChk);vib(15);updDaily();updStats();chkBadges();}
function changeDay(d){var n=ST.day+d;if(n>=1&&n<=ST.tripLen){ST.day=n;saveST();updDaily();updChip();renderItin();var it=itinDays()[ST.day-1];if(it&&it.city!==(ST.city||'Makkah'))setCity(it.city);}}
function dayPct(n){
  var d=dailyChk['d'+n];if(!d)return null;
  var tot=0,done=0;DAILY.forEach(function(s){s.items.forEach(function(it){tot++;if(d[it.id])done++;});});
  return Math.round(done/tot*100);
}
function updDaily(){renderTB();renderWater();renderTodayTop();
  document.getElementById('dayDisp').innerHTML='Day '+ST.day+'<small>of '+ST.tripLen+'</small>';
  var d=dailyChk[dayKey()]||{};var tot=0,done=0,pts=0;
  DAILY.forEach(function(sec){var sd=0;sec.items.forEach(function(it){tot++;var on=!!d[it.id];if(on){done++;sd++;pts+=it.pts;}
    var w=document.getElementById('dw-'+it.id);if(w){w.classList.toggle('done',on);w.setAttribute('aria-checked',on?'true':'false');}});
    var sp=document.getElementById('sp-'+sec.id);if(sp)sp.textContent=sd+'/'+sec.items.length;});
  var pct=tot?Math.round(done/tot*100):0;
  animPct('dPct',pct);setRing('dRing',pct);
  document.getElementById('dHeroT').textContent=pct>=100?'Perfect day! 🌟':pct>=70?'Strong day':pct>=35?'Keep going':pct>0?'Good start':'Bismillah';
  document.getElementById('dHeroS').textContent=done+' of '+tot+' completed · '+pts+' pts';
  updStreaks();renderHeat();
}
function streakOf(stk){
  var ids=[];DAILY.forEach(function(s){s.items.forEach(function(it){if(it.stk===stk)ids.push(it.id);});});
  var n=0;
  for(var day=ST.day;day>=1;day--){
    var d=dailyChk['d'+day];var hit=d&&ids.some(function(id){return d[id];});
    if(hit)n++;else if(day<ST.day)break;
  }
  return n;
}
function updStreaks(){
  var m={fajr:'skFajr',tahaj:'skTahaj',quran:'skQuran',tawaf:'skTawaf'};
  Object.keys(m).forEach(function(k){var n=streakOf(k);document.getElementById(m[k]+'N').textContent=n;document.getElementById(m[k]).classList.toggle('on',n>=3);});
}
function renderHeat(){
  var h='';
  for(var i=1;i<=ST.tripLen;i++){
    var p=dayPct(i),cls='';
    if(p!==null&&p>0){cls=p>=90?'h4':p>=70?'h3':p>=40?'h2':'h1';}
    h+='<div class="hc '+cls+(i===ST.day?' now':'')+'" title="Day '+i+(p!==null?': '+p+'%':'')+'">'+i+'</div>';
  }
  document.getElementById('heatGrid').innerHTML=h;
}
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
function setTripLen(v){var n=parseInt(v)||10;n=Math.max(3,Math.min(30,n));ST.tripLen=n;if(ST.day>n)ST.day=n;saveST();document.getElementById('tripLen').value=n;updRetDate();updDaily();updStats();renderItin();updChip();renderPrepJumps();}

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
function togPlace(id){placeVis[id]=!placeVis[id];save('us-places',placeVis);renderPlaces();updPlaces();chkBadges();if(placeVis[id])vib(25);}
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
  g.innerHTML=h;document.getElementById('bdgCnt').textContent=n;
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
  else{pct=dayPct(ST.day)||0;phase='🕋 Day '+ST.day+' of '+ST.tripLen+' in the Haramain';cta=['Log today’s worship','daily','today'];lbl=pct+'% of today’s deeds · '+tu+' Umrah'+(tu===1?'':'s')+' completed';stageNow=ST.umrahs?2:1;}
  var due=fcDue();var fcIdx0=due.length?due[0]:null;
  var nh=0;[HISTORY,VIRTUES,MADINAH,FIQHQA,KNOW,SCAMS].forEach(function(x){nh+=x.length;});
  var nq=0;QUIZ_LEVELS.forEach(function(l){nq+=l.qs.length;});
  var stages=[
    {i:'🧳',t:'Before you fly',s:'Prepare with ihsan',d:'Begin with your intention — then checklists for documents, packing and health, a departure countdown and a generated day-by-day itinerary. Then learn: the history of the Kaaba and Madinah, the virtues, the fiqh Q&A, a scam-awareness guide — and prove it in a 7-level quiz.',f:['Checklists','Itinerary','Knowledge hub','7-level quiz','Flashcards','Document vault'],go:['plan','prep'],c:'Start preparing'},
    {i:'🕋',t:'During your Umrah',s:'Ihram → Tawaf → Sa’i → Halq',d:'A step-by-step walkthrough with every dua in Arabic, transliteration and audio, and a "Why?" behind each step. Giant tap counters for tawaf and sa’i with a full-screen focus mode so you never lose count, a map of the mataf, and an automatic timeline that becomes a keepsake.',f:['Rites guide','Duas + audio','Tawaf & Sa’i counters','Focus mode','Mataf map','Keepsake card'],go:['umrah','count'],c:'Open the rites guide'},
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
  h+='<div class="stages">'+stages.map(function(st,i){return '<div class="stage'+(i===stageNow?' now':'')+'" role="button" tabindex="0" aria-label="'+st.t+' — '+st.c+'" onclick="'+(st.oc||goStr(st.go))+'"><div class="stage-n">'+(i+1)+'</div><div class="stage-b"><div class="stage-h"><span class="stage-i">'+st.i+'</span><div><b>'+st.t+'</b><small>'+st.s+'</small></div>'+(i===stageNow?'<span class="nowtag">You are here</span>':'')+'</div><p>'+st.d+'</p><div class="fchips">'+st.f.map(function(f){return '<span>'+f+'</span>';}).join('')+'</div><div class="stage-cta">'+st.c+' →</div></div></div>';}).join('')+'</div>';
  // 5. Numbers
  h+='<div class="nums"><div><b>'+PLACES.length+'</b><small>sacred &amp; historic places</small></div><div><b>'+nq+'</b><small>quiz questions in '+QUIZ_LEVELS.length+' levels</small></div><div><b>'+nh+'</b><small>knowledge topics</small></div><div><b>'+DUAS.length+'</b><small>essential duas with audio</small></div></div>';
  // 6. Quick tools
  h+='<div class="vh" style="margin-top:6px"><h2 style="font-size:1.2em">Quick tools</h2></div>';
  h+='<div class="qa-grid">'+acts.map(function(x){return '<button class="qa" onclick="'+goStr([x[2],x[3]])+'"><span>'+x[0]+'</span>'+x[1]+'</button>';}).join('')+'<button class="qa wide" onclick="sosSheet()" aria-label="Hotel and emergency help"><span>🚕</span>Hotel / SOS <span style="font-size:1em;opacity:.55;font-weight:600">· driver card · I’m lost · 911 · 1966</span></button></div>';
  if(fcIdx0!==null)h+='<div class="card card-pad hfc" role="button" tabindex="0" aria-label="Study today’s knowledge card" onclick="startFC();goTab(\'plan\',\'learn\',\'fcCard\')"><small>🃏 Today’s knowledge card · '+due.length+' due</small><b>'+FC_DECK[fcIdx0].f+'</b><span>Tap to study →</span></div>';
  h+='<div class="note" style="margin:0 0 12px">'+QUOTES[Math.floor(Date.now()/86400000)%QUOTES.length]+'</div>';
  h+='<div class="card card-pad"><h3>Common questions</h3>'
    +'<div class="acc" onclick="this.classList.toggle(\'open\')"><div class="acc-h">Is it really free? <span class="acc-c">▶</span></div><div class="acc-b">Yes — no ads, no subscriptions, no “pro” tier. Built as sadaqah jariyah for the Ummah. If it helps you, share it and make dua for those who built it.</div></div>'
    +'<div class="acc" onclick="this.classList.toggle(\'open\')"><div class="acc-h">Does it work in the Haram without signal? <span class="acc-c">▶</span></div><div class="acc-b">Yes. Open it once with internet and it caches itself; the counters, rites guide, duas, places and your data all work offline. Prayer times cache for the day; the map links need signal.</div></div>'
    +'<div class="acc" onclick="this.classList.toggle(\'open\')"><div class="acc-h">Where is my data stored? <span class="acc-c">▶</span></div><div class="acc-b">Only on your phone. There is no account and no server. Export a backup from Settings before changing phones; the document vault is encrypted with your PIN and cannot be recovered without it.</div></div>'
    +'<div class="acc" onclick="this.classList.toggle(\'open\')"><div class="acc-h">Is the religious content reliable? <span class="acc-c">▶</span></div><div class="acc-b">Every hadith is cited to its collection and was checked against the source text; weak narrations are avoided or marked. It is a study companion, not a fatwa service — ask a scholar for rulings on your situation. Scholar review is pending; corrections are welcome.</div></div>'
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

/* ════════════════════════ FOCUS MODE ════════════════════════ */
var focusKey='tawaf',wakeLock=null;
function enterFocus(k){
  focusKey=k;document.getElementById('focus').classList.add('on');document.body.style.overflow='hidden';
  document.getElementById('focusTitle').textContent=k==='tawaf'?'🕋 Tawaf':'⛰️ Sa’i';
  document.getElementById('focusOf').textContent=k==='tawaf'?'of 7 rounds':'of 7 laps';
  renderCnt(k);
  if('wakeLock' in navigator){navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});}
}
function exitFocus(){document.getElementById('focus').classList.remove('on');document.body.style.overflow='';if(wakeLock){wakeLock.release().catch(function(){});wakeLock=null;}}
function focusTap(){cntr(focusKey,1);}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&(document.getElementById('focus').classList.contains('on')||document.getElementById('duaFocus').classList.contains('on'))&&'wakeLock' in navigator){navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});}});

/* ════════════════════════ DUA READER (full-screen, M-11) ════════════════════════ */
var dfList=[],dfIdx=0;
function openDua(i){dfList=DUAS;dfIdx=i;renderDF();}
function openRiteDua(stepId){var d=null,title='';RITES.forEach(function(ph){ph.steps.forEach(function(st){if(st.id===stepId&&st.dua){d=st.dua;title=st.b;}});});if(!d)return;dfList=[{t:title,ar:d.ar,tl:d.tl,tr:d.tr,s:d.s||''}];dfIdx=0;renderDF();}
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
    h+='<div class="card tripc"><div class="tc-h"><span>🏨</span><b>'+(hi.n?esc(hi.n):'Your hotel')+'</b>'+(hi.m?'<button class="xchip" style="margin:0" onclick="showLost()">📍 '+esc(hi.m)+'</button>':'')+'</div>'
      +(hi.n?'':'<input class="srch" id="tcName" placeholder="Hotel name — so the driver card works" onchange="quickHotel(this.value)" aria-label="Hotel name">')
      +'<div class="hcard"><button class="main" onclick="showDriver()">🚕 Show to driver</button><button class="sos" onclick="showLost()">🆘 I’m lost</button><a href="tel:911">☎ 911</a><a href="tel:1966">☎ 1966 care line</a></div></div>';}
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
  a.innerHTML=duas.map(function(d,i){return '<div class="row'+(d.done?' done':'')+'" style="padding:8px 6px"><span class="tick" onclick="togDua('+i+')"></span><div class="row-t" onclick="togDua('+i+')"><b>'+d.t.replace(/</g,'&lt;')+'</b></div><button class="chip-btn" style="padding:4px 10px" onclick="delDua('+i+')">✕</button></div>';}).join('')+'<p style="font-size:.74em;color:var(--ink3);margin-top:6px">'+duas.filter(function(d){return d.done;}).length+' of '+duas.length+' asked</p>';
}

/* ════════════════════════ WATER & DISTANCE ════════════════════════ */
var waterD={};try{waterD=JSON.parse(localStorage.getItem('us-water')||'{}');}catch(e){}
function water(d){var k=dayKey();waterD[k]=Math.max(0,(waterD[k]||0)+d);localStorage.setItem('us-water',JSON.stringify(waterD));vib(10);renderWater();if(waterD[k]===8)toast('💧 8 cups — well hydrated, alhamdulillah');}
function renderWater(){
  var l=document.getElementById('waterLbl'),b=document.getElementById('waterBar'),k=document.getElementById('kmLbl');if(!l)return;
  var c=waterD[dayKey()]||0;l.textContent=c+' of 8 cups';b.style.width=Math.min(100,c/8*100)+'%';
  var km=ST.umrahs*6+ST.tawaf*0.4+ST.sai*0.45;
  for(var i=1;i<=ST.tripLen;i++){var d=dailyChk['d'+i];if(d&&d.ntawaf)km+=2.8;}
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
  x.textAlign='center';x.font='110px serif';x.fillText('🕋',540,220);
  x.font='700 40px Georgia,serif';x.fillStyle='#D9B45E';x.fillText('UMRAH STRIVERS',540,300);
  x.font='700 56px Georgia,serif';x.fillStyle='#fff';x.fillText((ST.name||'My')+(ST.name?'’s':'')+' journey · Day '+ST.day+' of '+ST.tripLen,540,390);
  var tiles=[[ST.umrahs,'Umrahs'],[(logged?Math.round(sum/logged):0)+'%','avg. daily deeds'],[pv,'places visited'],[tb,'dhikr counted'],[streakOf('fajr'),'Fajr streak'],[logged,'days logged']];
  tiles.forEach(function(t,i){var cx=230+(i%3)*310,cy=560+Math.floor(i/3)*230;x.fillStyle='rgba(255,255,255,.08)';x.beginPath();x.roundRect(cx-130,cy-90,260,180,28);x.fill();x.fillStyle='#EFD494';x.font='700 64px Georgia,serif';x.fillText(String(t[0]),cx,cy+10);x.fillStyle='rgba(255,255,255,.7)';x.font='24px Inter,sans-serif';x.fillText(t[1],cx,cy+55);});
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
function jumpTo(id,quiet){var el=document.getElementById(id);if(!el)return;var y=el.getBoundingClientRect().top+window.scrollY-118;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});if(!quiet)vib(8);}
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
}
function applySubs(){
  ST.sub=ST.sub||{};
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
    else{txt='🕋 Day '+ST.day+' / '+ST.tripLen;go=['daily','today',null];}
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
  ST.onboarded=true;ST.stage=st;obStage=st;saveST();
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
    ST.tripLen=len;ST.day=day;var t=document.getElementById('tripLen');if(t)t.value=len;
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
var FC_DECK=[],fcQueue=[],fcIdx=0,fcST={};
function fcToday(){return Math.floor(Date.now()/86400000);}
function buildDeck(){
  FC_DECK=[];
  [HISTORY,VIRTUES,MADINAH,FIQHQA].forEach(function(arr){arr.forEach(function(it){
    FC_DECK.push({f:it.t,b:it.b.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()});
  });});
  try{fcST=JSON.parse(localStorage.getItem('us-cards')||'{}');}catch(e){fcST={};}
}
function fcDue(){
  var t=fcToday(),due=[];
  FC_DECK.forEach(function(c,i){var st=fcST[i];if(!st||st.due<=t)due.push(i);});
  return due;
}
function renderFC(){
  var area=document.getElementById('fcArea');if(!area)return;
  var due=fcDue();
  document.getElementById('fcDueLbl').textContent=due.length?due.length+' cards due today.':'';
  if(!fcQueue.length){
    if(!due.length){area.innerHTML='<div class="note" style="margin:0">✅ All caught up — new cards return tomorrow. Consistency builds hearts.</div>';return;}
    area.innerHTML='<button class="btn gold" onclick="startFC()">🃏 Review '+Math.min(12,due.length)+' cards</button>';return;
  }
  var i=fcQueue[fcIdx],c=FC_DECK[i];
  area.innerHTML='<div class="fc-prog">Card '+(fcIdx+1)+' / '+fcQueue.length+'</div>'
   +'<div class="fc" id="fcFlip" role="button" tabindex="0" aria-label="Flip the card" onclick="this.classList.toggle(\'flip\')"><div class="fc-in">'
   +'<div class="fc-face fc-front"><div class="t">'+c.f+'</div><div class="hint">Tap to reveal</div></div>'
   +'<div class="fc-face fc-back">'+c.b+'</div>'
   +'</div></div>'
   +'<div class="fc-acts"><button onclick="fcGrade(false)">↺ Again</button><button class="good" onclick="fcGrade(true)">✓ Got it</button></div>';
}
function startFC(){fcQueue=fcDue().slice(0,12);fcIdx=0;renderFC();}
function fcGrade(ok){
  var i=fcQueue[fcIdx],st=fcST[i]||{box:0};
  var box=ok?Math.min(3,(st.box||0)+1):1;
  var gap=box===1?1:box===2?3:7;
  fcST[i]={box:box,due:fcToday()+gap};
  localStorage.setItem('us-cards',JSON.stringify(fcST));
  vib(ok?20:[40,30,40]);
  fcIdx++;
  if(fcIdx>=fcQueue.length){fcQueue=[];fcIdx=0;toast('🃏 Session done — see you tomorrow!');}
  renderFC();
}

/* ════════════════════════ KIDS QUIZ ════════════════════════ */
var kqI=0,kqScore=0,kqLock=false;
function startKids(){kqI=0;kqScore=0;renderKQ();}
function renderKQ(){
  kqLock=false;
  var q=KIDSQ[kqI];
  var h='<div class="fc-prog">Question '+(kqI+1)+' / '+KIDSQ.length+'</div><div class="kq-q">'+q.q+'</div>';
  q.o.forEach(function(o,i){h+='<button class="kq-o" id="kqo-'+i+'" onclick="answerKQ('+i+')">'+o+'</button>';});
  h+='<div id="kqFb"></div>';
  document.getElementById('kidsArea').innerHTML=h;
}
function answerKQ(i){
  if(kqLock)return;kqLock=true;
  var q=KIDSQ[kqI],ok=i===q.a;
  if(ok){kqScore++;vib([30,30,30]);}else vib(80);
  document.getElementById('kqo-'+q.a).classList.add('right');
  if(!ok)document.getElementById('kqo-'+i).classList.add('wrong');
  document.getElementById('kqFb').innerHTML='<div class="qz-x">'+(ok?'⭐ Yes! ':'💛 Almost! ')+q.e+'</div><button class="btn" onclick="nextKQ()">'+(kqI<KIDSQ.length-1?'Next →':'See my stars!')+'</button>';
}
function nextKQ(){
  if(kqI<KIDSQ.length-1){kqI++;renderKQ();return;}
  var stars=Math.max(1,Math.round(kqScore/KIDSQ.length*5));
  var best=+(localStorage.getItem('us-kids')||0);
  if(kqScore>best){best=kqScore;localStorage.setItem('us-kids',String(best));}
  document.getElementById('kidsArea').innerHTML='<div class="qz-final"><div class="kq-stars">'+'⭐'.repeat(stars)+'</div><p style="font-size:1em"><b>'+kqScore+' / '+KIDSQ.length+'</b> — '+(kqScore===KIDSQ.length?'Mashallah, a little hafiz of Umrah! 🎉':'Great job — play again and get all the stars!')+'</p><button class="btn gold" onclick="startKids()">↺ Play again</button></div>';
  var kb=document.getElementById('kidsBest');if(kb)kb.textContent=best+'/'+KIDSQ.length;
  vib([50,50,50,50,120]);if(kqScore===KIDSQ.length)confetti(120);
}

/* ════════════════════════ AUDIO (dua recitation) ════════════════════════ */
function speakBtn(el){
  if(window.event)window.event.stopPropagation();
  try{
    if(window.speechSynthesis.speaking){speechSynthesis.cancel();return;}
    var u=new SpeechSynthesisUtterance(el.getAttribute('data-ar'));
    u.lang='ar-SA';u.rate=.8;
    var v=speechSynthesis.getVoices().filter(function(x){return x.lang&&x.lang.indexOf('ar')===0;});
    if(v.length)u.voice=v[0];
    speechSynthesis.speak(u);
  }catch(e){toast('Audio not supported on this browser');}
}

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
      if(p==='granted'){ST.rem=true;saveST();updRemSw();toast('🔔 Reminders on — while the app is open');}
      else toast('Notifications blocked — allow them in browser settings');
    });
  }else{ST.rem=false;saveST();updRemSw();}
}
function updRemSw(){var sw=document.getElementById('remSw');if(sw){sw.classList.toggle('on',!!ST.rem);sw.setAttribute('aria-checked',ST.rem?'true':'false');}}
function remTick(){
  if(!ST.rem||!ptData||!('Notification' in window)||Notification.permission!=='granted')return;
  var now=riyadhNow(),nowMin=now.getHours()*60+now.getMinutes();
  for(var i=0;i<PT_NAMES.length;i++){
    var nm=PT_NAMES[i],v=(ptData.t[nm]||'').split(' ')[0].split(':');
    var m=parseInt(v[0])*60+parseInt(v[1]),diff=m-nowMin;
    if(diff>0&&diff<=20){
      var key=(ST.city||'Makkah')+'|'+now.getDate()+'|'+nm;
      if(localStorage.getItem('us-remlast')===key)return;
      localStorage.setItem('us-remlast',key);
      try{new Notification('🕌 '+nm+' in '+diff+' min ('+(ST.city||'Makkah')+')',{body:'Head out with wudu — the Haram fills early. May it be accepted.'});}catch(e){}
      toast('🔔 '+nm+' in '+diff+' minutes');vib([60,40,60]);
      return;
    }
  }
}
setInterval(remTick,60000);

/* ════════════════════════ PRAYER TIMES ════════════════════════ */
var PT_NAMES=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
var ptData=null,ptTimer=null,ptStale=false;
function setCity(c){ST.city=c;saveST();document.getElementById('cityMakkah').classList.toggle('on',c==='Makkah');document.getElementById('cityMadinah').classList.toggle('on',c==='Madinah');loadPT();}
function riyadhNow(){try{return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Riyadh'}));}catch(e){return new Date();}}
function hijriIntl(){try{return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){return '';}}
function loadPT(){
  var city=ST.city||'Makkah';
  var today=riyadhNow();var dk=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var cache={};try{cache=JSON.parse(localStorage.getItem('us-ptcache')||'{}');}catch(e){}
  var ck=city+'|'+dk;
  if(cache[ck]){ptData=cache[ck];ptStale=false;renderPT();return;}
  renderPTLoading();
  var ctrl=('AbortController' in window)?new AbortController():null;
  if(ctrl)setTimeout(function(){ctrl.abort();},8000);
  fetch('https://api.aladhan.com/v1/timingsByCity?city='+city+'&country=Saudi%20Arabia&method=4',ctrl?{signal:ctrl.signal}:{})
  .then(function(r){return r.json();})
  .then(function(j){
    var t=j.data.timings,h=j.data.date.hijri;
    ptData={t:{Fajr:t.Fajr,Dhuhr:t.Dhuhr,Asr:t.Asr,Maghrib:t.Maghrib,Isha:t.Isha},h:h.day+' '+h.month.en+' '+h.year+' AH'};
    ptStale=false;
    var nc={};nc[ck]=ptData;localStorage.setItem('us-ptcache',JSON.stringify(nc));
    renderPT();
  }).catch(function(){
    // offline: fall back to the most recent cached times for this city, marked stale
    ptData=null;ptStale=false;
    Object.keys(cache).forEach(function(k){if(k.indexOf(city+'|')===0){ptData=cache[k];ptStale=true;}});
    renderPT();
  });
}
function renderPTLoading(){var n=document.getElementById('ptNext');if(n)n.textContent='Loading times…';var g=document.getElementById('ptGrid');if(g&&!g.children.length){var h='';for(var i=0;i<5;i++)h+='<div class="pt sk"></div>';g.innerHTML=h;}}
function renderPT(){
  var g=document.getElementById('ptGrid'),nx=document.getElementById('ptNext'),hj=document.getElementById('ptHijri');
  if(!g)return;
  hj.textContent=(ptData&&ptData.h)?ptData.h:hijriIntl();
  if(!ptData){g.innerHTML='';nx.textContent='Times unavailable offline — reconnect to load.';var hn0=document.getElementById('hNext');if(hn0)hn0.textContent='Times unavailable offline';return;}
  var note=document.getElementById('ptNote');if(note)note.textContent=(ptStale?'Cached times · reconnect to refresh · ':'')+'Umm al-Qura · local Makkah/Madinah time';
  var now=riyadhNow(),nowMin=now.getHours()*60+now.getMinutes();
  var nextName=null,nextMin=null;
  var h='';
  PT_NAMES.forEach(function(nm){
    var v=(ptData.t[nm]||'').split(' ')[0];
    var parts=v.split(':'),m=parseInt(parts[0])*60+parseInt(parts[1]);
    if(nextName===null&&m>nowMin){nextName=nm;nextMin=m;}
    h+='<div class="pt" id="pt-'+nm+'"><div class="pn">'+nm+'</div><div class="pv">'+v+'</div></div>';
  });
  g.innerHTML=h;
  if(nextName===null){
    var f=(ptData.t.Fajr||'').split(' ')[0].split(':');
    nextName='Fajr';nextMin=(parseInt(f[0])*60+parseInt(f[1]))+1440;
  }
  var el=document.getElementById('pt-'+nextName);if(el)el.classList.add('next');
  var diff=nextMin-nowMin,hh=Math.floor(diff/60),mm=diff%60;
  nx.innerHTML='Next: <b>'+nextName+'</b> in '+(hh>0?hh+'h ':'')+mm+'m';
  var hn=document.getElementById('hNext');if(hn)hn.innerHTML='<b>'+nextName+'</b> in '+(hh>0?hh+'h ':'')+mm+'m <span>· '+(ST.city||'Makkah')+' · '+(ptData.t[nextName]||'').split(' ')[0]+'</span>';
  if(ptTimer)clearInterval(ptTimer);
  ptTimer=setInterval(function(){if(document.getElementById('view-daily').classList.contains('on'))renderPT_tick();},30000);
}
function renderPT_tick(){if(ptData)renderPT();}

/* ════════════════════════ TASBIH ════════════════════════ */
var TB_PHRASES=['SubhanAllah','Alhamdulillah','Allahu Akbar','La ilaha illallah','Astaghfirullah','Salawat ﷺ'];
var tbPhrase=0,tbCount=0,tbTargetN=33;
function renderTB(){
  var c=document.getElementById('tbChips');if(!c)return;
  var h='';TB_PHRASES.forEach(function(ph,i){h+='<button class="tb-chip'+(i===tbPhrase?' on':'')+'" onclick="tbSet('+i+')">'+ph+'</button>';});
  c.innerHTML=h;
  document.getElementById('tbN').textContent=tbCount;
  document.getElementById('tbTarget').textContent=tbTargetN;
  document.getElementById('tbToday').textContent=tasbih[dayKey()]||0;
}
function tbSet(i){tbPhrase=i;tbCount=0;renderTB();}
function tbTap(){
  tbCount++;tasbih[dayKey()]=(tasbih[dayKey()]||0)+1;save('us-tasbih',tasbih);
  if(tbCount>=tbTargetN){
    vib([40,60,100]);toast('✨ '+TB_PHRASES[tbPhrase]+' ×'+tbTargetN+' complete');
    tbCount=0;tbPhrase=(tbPhrase+1)%TB_PHRASES.length;
  }else vib(12);
  var d=dailyChk[dayKey()]||{};
  if((tasbih[dayKey()]||0)>=100&&!d.dhikr100){d.dhikr100=true;dailyChk[dayKey()]=d;save('us-daily',dailyChk);toast('📿 100 dhikr today — checklist updated!');updDaily();updStats();chkBadges();}
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
  var kb=document.getElementById('kidsBest'),kbv=localStorage.getItem('us-kids');if(kb&&kbv)kb.textContent=kbv+'/'+KIDSQ.length;
  var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');
  if(cm){cm.classList.toggle('on',(ST.city||'Makkah')==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  updPlan();updRites();updDaily();updPlaces();updStats();renderBadges();
  goTab('home');
}
document.addEventListener('DOMContentLoaded',function(){loadAll();pendingGroup=parseGroupLink();applyDepLink();initUI();if(pendingGroup)setTimeout(function(){showGroupSheet(pendingGroup);},350);registerSW();});
