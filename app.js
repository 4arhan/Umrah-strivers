/* Umrah Strivers — application logic */
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
function toast(m,gold){var c=document.getElementById('toastC');var t=document.createElement('div');t.className='toast'+(gold?' gold':'');t.textContent=m;c.appendChild(t);setTimeout(function(){t.remove();},3200);}
function vib(ms){if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}
function toggleTheme(){ST.theme=ST.theme==='light'?'dark':'light';applyTheme();saveST();}
function applyTheme(){document.documentElement.setAttribute('data-theme',ST.theme);document.getElementById('themeIcon').textContent=ST.theme==='dark'?'☀️':'🌙';var t=document.getElementById('dmTgl');if(t)t.classList.toggle('on',ST.theme==='dark');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',ST.theme==='dark'?'#0B120F':'#0E3B2E');}
function togSec(el){el.closest('.sec').classList.toggle('shut');}
function setRing(id,pct){var el=document.getElementById(id);if(el)el.style.strokeDashoffset=239*(1-Math.min(100,pct)/100);}
function goTab(t){ST.tab=t;saveST();
  document.querySelectorAll('.view').forEach(function(e){e.classList.remove('on');});
  document.getElementById('view-'+t).classList.add('on');
  document.querySelectorAll('.nav button').forEach(function(e){e.classList.toggle('on',e.getAttribute('data-v')===t);});
  if(t==='daily'){updDaily();updStats();loadPT();renderTB();}
  if(t==='places')updPlaces();
  if(t==='umrah')updRites();
  if(t==='plan')updPlan();
  if(t==='home')renderHome();
  window.scrollTo({top:0,behavior:'smooth'});}
function mkSec(sec,shut,inner,countId){
  return '<div class="sec'+(shut?' shut':'')+'"><div class="sec-hd" onclick="togSec(this)"><div class="sec-ico">'+(sec.ico||'•')+'</div><h2>'+sec.title+(sec.sub?'<small>'+sec.sub+'</small>':'')+'</h2><span class="sec-ct" id="sp-'+sec.id+'"></span><span class="sec-chev">▼</span></div><div class="sec-bd">'+(sec.hn?'<div class="note">'+sec.hn+'</div>':'')+inner+'</div></div>';
}

/* ════════════════════════ PLAN ════════════════════════ */
function renderPlan(){
  var h='';
  PLAN.forEach(function(sec,i){
    var inner='';
    sec.items.forEach(function(it){
      inner+='<div class="row" id="pw-'+it.id+'"'+(it.bag?' data-bag="'+it.bag+'"':'')+' onclick="togPlan(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+'</div></div>';
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
  var tot=0,done=0;
  PLAN.forEach(function(sec){
    var sd=0;
    sec.items.forEach(function(it){tot++;var on=!!planChk[it.id];if(on){done++;sd++;}
      var w=document.getElementById('pw-'+it.id);if(w)w.classList.toggle('done',on);});
    var sp=document.getElementById('sp-'+sec.id);if(sp)sp.textContent=sd+'/'+sec.items.length;
  });
  var pct=tot?Math.round(done/tot*100):0;
  animPct('planPct',pct);setRing('planRing',pct);
  document.getElementById('planHeroT').textContent=pct>=100?'Fully prepared! 🎉':pct>=70?'Almost there':pct>=30?'Good progress':pct>0?'Getting started':'Let’s get ready';
  var stk=prepStreak();document.getElementById('planHeroS').textContent=done+' of '+tot+' preparation items done'+(stk>1?' · 🔥 '+stk+'-day streak':'');
  updCountdown();
  renderLevels();
}
function setDep(v){ST.dep=v;saveST();updCountdown();updChip();renderItin();}
function updCountdown(){
  var n=document.getElementById('cdNum'),t=document.getElementById('cdT'),s=document.getElementById('cdS'),inp=document.getElementById('depDate');
  if(ST.dep){inp.value=ST.dep;
    var d=Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);
    var u=document.getElementById('cdU');
    if(d>1){n.textContent=d;u.textContent='days';t.textContent='until departure';s.textContent='Prepare with excellence — the countdown is on.';}
    else if(d===1){n.textContent='1';u.textContent='day';t.textContent='Tomorrow!';s.textContent='Final checks — passport, ihram, dua list.';}
    else if(d===0){n.textContent='🛫';u.textContent='today';t.textContent='Today is the day!';s.textContent='Safe travels — labbayk!';}
    else{n.textContent='🕋';u.textContent='on trip';t.textContent='You’re on your journey';s.textContent='Switch to the Umrah & Daily tabs.';}
  }else{n.textContent='—';document.getElementById('cdU').textContent='days';t.textContent='Departure countdown';s.textContent='Set your date and watch the days melt away';}
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
    h+='<div class="lvl'+(un?'':' locked')+(ps?' passed':'')+'" onclick="startLevel('+i+')">'
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
function qzDots(n){var h='';for(var i=0;i<n;i++){h+='<i class="'+(i<qzHist.length?(qzHist[i]?'f':'w'):'')+'"></i>';}return '<div class="qz-dots">'+h+'</div>';}
function renderQz(){
  qzLock=false;
  var q=curQ(),tot=qzTotal();
  var head=qzMode==='mist'?'🔁 Mistake review':QUIZ_LEVELS[qzLevel].icon+' '+QUIZ_LEVELS[qzLevel].name.split(' · ')[0];
  var h='<div class="qz-top"><span>'+head+' · Q'+(qzI+1)+'/'+tot+'</span><span class="qz-exit" onclick="renderLevels()">✕ Exit</span></div>'+qzDots(tot)+'<div class="qz-q">'+q.q+'</div>';
  qzOpts(q).forEach(function(o,i){h+='<button class="qz-o" id="qzo-'+i+'" onclick="answerQz('+i+')">'+(q.o?String.fromCharCode(65+i)+'. ':'')+o+'</button>';});
  h+='<div id="qzFb"></div>';
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
      n++;
      inner+='<div class="stp" id="rw-'+st.id+'" onclick="togRite(\''+st.id+'\')"><div class="stp-n">'+n+'</div><div class="stp-t"><b>'+st.b+'</b><p>'+st.p+'</p>'+(st.why?'<button class="why" onclick="event.stopPropagation();this.nextSibling.classList.toggle(\'on\')">Why?</button><div class="whyb">'+st.why+'</div>':'')+(st.dua?'<div class="dua" onclick="event.stopPropagation()"><button class="say" data-ar="'+st.dua.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊</button><span class="ar">'+st.dua.ar+'</span><span class="tl">'+st.dua.tl+'</span><span class="tr">'+st.dua.tr+'</span></div>':'')+'</div></div>';
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
  var tot=0,done=0;
  RITES.forEach(function(ph){var sd=0;ph.steps.forEach(function(st){tot++;var on=!!riteChk[st.id];if(on){done++;sd++;}var w=document.getElementById('rw-'+st.id);if(w)w.classList.toggle('done',on);});var sp=document.getElementById('sp-'+ph.id);if(sp)sp.textContent=sd+'/'+ph.steps.length;});
  var pct=tot?Math.round(done/tot*100):0;
  animPct('ritePct',pct);setRing('riteRing',pct);
  document.getElementById('riteHeroT').textContent=pct>=100?'Taqabbal Allah! 🎉':pct>0?done+' of '+tot+' steps':'Step by step';
  document.getElementById('riteHeroS').textContent='🕋 Umrahs completed: '+ST.umrahs;
  renderCnt('tawaf');renderCnt('sai');renderLog();renderUmrahs();
}
var TAWAF_TIPS=['Start at the Black Stone line: "Bismillahi wallahu akbar" — Kaaba on your left.','Round 1 · men walk briskly (raml). Touch the Yamani corner if easy, then "Rabbana atina…"','Round 2 · keep the raml. Any dhikr or dua you love — nothing fixed.','Round 3 · last raml round. Guard your gaze and your tongue in the crowd.','Round 4 · normal pace now. Dua for your parents and those who asked you.','Round 5 · istighfar. Don’t push at the Stone — point and say Allahu Akbar.','Round 6 · salawat on the Prophet ﷺ. Stay close to your group.','Tawaf complete → cover both shoulders, 2 rakahs behind Maqam Ibrahim, then Zamzam.'];
var SAI_TIPS=['On Safa: face the Kaaba, praise Allah, repeat the dhikr 3× with your own duas.','Lap 1 · Safa → Marwah. Men jog lightly between the green lights.','Lap 2 · back to Safa. Remember Hajar’s trust: "He will not abandon us."','Lap 3 · dua is accepted here — pour out your heart.','Lap 4 · halfway. Sip Zamzam from the coolers if you need to.','Lap 5 · dua for the ummah — the angel says "Amin, and for you the same."','Lap 6 · one to go. Salawat and istighfar.','Sa’i complete → halq or taqsir, then your Umrah is done. Taqabbal Allah!'];
function renderCnt(k){
  var v=ST[k];
  var tip=document.getElementById(k+'Tip');if(tip)tip.textContent=(k==='tawaf'?TAWAF_TIPS:SAI_TIPS)[v]||'';
  if(k===focusKey){var fn=document.getElementById('focusN'),ft=document.getElementById('focusTip');if(fn)fn.textContent=v;if(ft)ft.textContent=(k==='tawaf'?TAWAF_TIPS:SAI_TIPS)[v]||'';}
  document.getElementById(k+'N').textContent=v;
  var ring=document.getElementById(k+'Ring');
  if(ring)ring.style.strokeDashoffset=565*(1-v/7);
  document.getElementById(k+'Done').style.display=v>=7?'block':'none';
}
function cntr(k,d){
  var v=Math.max(0,Math.min(7,ST[k]+d));
  if(v===ST[k])return;ST[k]=v;saveST();
  if(v===1&&d>0)stamp(k+'Start');if(v===7)stamp(k+'End');renderLog();vib(v===7?[50,60,140]:35);renderCnt(k);
  if(v===7)confetti(50);
  if(v===7)toast(k==='tawaf'?'🕋 Tawaf complete! Pray 2 rakahs at Maqam Ibrahim':'⛰️ Sa’i complete! Proceed to halq/taqsir');
}
function cntrReset(k){ST[k]=0;saveST();renderCnt(k);}
function finishUmrah(){
  var done=0,tot=0;RITES.forEach(function(p){p.steps.forEach(function(s){tot++;if(riteChk[s.id])done++;});});
  if(done<tot&&!confirm('Only '+done+' of '+tot+' steps are ticked. Record this Umrah as complete anyway?'))return;
  var lg=ST.log||{};lg.done=Date.now();var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}hist.push({n:ST.umrahs+1,log:lg});localStorage.setItem('us-umrahlog',JSON.stringify(hist));
  ST.umrahs++;ST.tawaf=0;ST.sai=0;ST.log={};saveST();renderUmrahs();
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
      inner+='<div class="row" id="dw-'+it.id+'" onclick="togDaily(\''+it.id+'\')"><span class="tick"></span><div class="row-t"><b>'+it.label+'</b>'+(it.exp?'<div class="x">'+it.exp+'</div>':'')+(it.ref?'<div class="rf">'+it.ref+'</div>':'')+'</div><span class="pts">+'+it.pts+'</span></div>';
    });
    h+=mkSec(sec,i>0,inner);
  });
  document.getElementById('dailyContainer').innerHTML=h;
}
function dayKey(){return 'd'+ST.day;}
function togDaily(id){var d=dailyChk[dayKey()]||{};d[id]=!d[id];dailyChk[dayKey()]=d;save('us-daily',dailyChk);vib(15);updDaily();updStats();chkBadges();}
function changeDay(d){var n=ST.day+d;if(n>=1&&n<=ST.tripLen){ST.day=n;saveST();updDaily();updChip();}}
function dayPct(n){
  var d=dailyChk['d'+n];if(!d)return null;
  var tot=0,done=0;DAILY.forEach(function(s){s.items.forEach(function(it){tot++;if(d[it.id])done++;});});
  return Math.round(done/tot*100);
}
function updDaily(){renderTB();renderWater();
  document.getElementById('dayDisp').innerHTML='Day '+ST.day+'<small>of '+ST.tripLen+'</small>';
  var d=dailyChk[dayKey()]||{};var tot=0,done=0,pts=0;
  DAILY.forEach(function(sec){var sd=0;sec.items.forEach(function(it){tot++;var on=!!d[it.id];if(on){done++;sd++;pts+=it.pts;}
    var w=document.getElementById('dw-'+it.id);if(w)w.classList.toggle('done',on);});
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
  document.getElementById('stUmrahs').textContent=ST.umrahs;
  var pv=Object.keys(placeVis).filter(function(k){return placeVis[k];}).length;
  document.getElementById('stPlaces').textContent=pv+' / '+PLACES.length;
  renderBadges();
}
function setTripLen(v){var n=parseInt(v)||10;n=Math.max(3,Math.min(30,n));ST.tripLen=n;if(ST.day>n)ST.day=n;saveST();document.getElementById('tripLen').value=n;updDaily();updStats();renderItin();}

/* ════════════════════════ PLACES ════════════════════════ */
var cityFilter='all';
function renderPlaces(){
  var h='';
  var q=(document.getElementById('plSearch')||{}).value||'';q=q.trim().toLowerCase();
  function tourCard(){
    var st=TOUR.stops.map(function(x){return '<span class="stopchip '+x.r+'"><i></i>'+x.n+' · '+x.t+'</span>';}).join('');
    return '<div class="tour"><div class="tour-h"><span class="tour-i">🚌</span><div><b>Madinah Hop-On Hop-Off — the easy ziyarah</b><small>City Sightseeing · 2 routes · 12 stops · buses every 30 min · 05:30–23:59</small></div></div>'
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
        ch+='<div class="place'+(placeVis[p.id]?' vis':'')+(q?' open':'')+'" id="pl-'+p.id+'"><div class="place-h" onclick="this.parentNode.classList.toggle(\'open\')"><div class="place-ico">'+p.i+'</div><div class="place-t"><b>'+p.n+(placeVis[p.id]?' <span class="vtick">✓</span>':'')+'</b>'+stop+'<p>'+p.d+'</p><div class="tip">💡 '+p.tip+'</div></div><span class="place-ch">▾</span></div><div class="place-a"><a href="'+url+'" target="_blank" rel="noopener">🗺️ Open in Maps</a><button onclick="togPlace(\''+p.id+'\')">'+(placeVis[p.id]?'✓ Visited':'Mark visited')+'</button></div></div>';
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
    case 'prepped':{var tot=0,done=0;PLAN.forEach(function(s){s.items.forEach(function(it){tot++;if(planChk[it.id])done++;});});return tot>0&&done===tot;}
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
  DUAS.forEach(function(d){h+='<div class="duacard"><h4>'+d.t+'</h4><div class="dua" style="margin:0;background:transparent;border:none;padding:0"><button class="say" data-ar="'+d.ar+'" onclick="speakBtn(this)" aria-label="Play recitation">🔊</button><span class="ar">'+d.ar+'</span><span class="tl">'+d.tl+'</span><span class="tr">'+d.tr+'</span><span class="src">'+d.s+'</span></div></div>';});
  document.getElementById('duaContainer').innerHTML=h;
}
function exportData(){
  var data={settings:ST,plan:planChk,rites:riteChk,daily:dailyChk,places:placeVis,badges:earned,v:2};
  var b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='umrah-strivers-backup.json';a.click();
  toast('📤 Backup exported');
}
function importData(ev){
  var f=ev.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){try{
    var d=JSON.parse(r.result);
    if(d.settings)ST=Object.assign(ST,d.settings);
    planChk=d.plan||{};riteChk=d.rites||{};dailyChk=d.daily||{};placeVis=d.places||{};earned=d.badges||{};
    saveST();save('us-plan',planChk);save('us-rites',riteChk);save('us-daily',dailyChk);save('us-places',placeVis);save('us-badges',earned);
    initUI();toast('📥 Backup imported!');
  }catch(e){toast('Import failed — invalid file');}};
  r.readAsText(f);ev.target.value='';
}
function confirmReset(){
  if(!confirm('Reset ALL data? This cannot be undone. Export a backup first!'))return;
  ['us-settings','us-plan','us-rites','us-daily','us-places','us-badges'].forEach(function(k){localStorage.removeItem(k);});
  location.reload();
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
  if(ST.post){phase='🌱 Post-Umrah — keep it alive';cta=['Open habit keeper','more','guide'];var pd=postData||{};var c=0;Object.keys(pd).forEach(function(h){c+=Object.keys(pd[h]).filter(function(k){return pd[h][k];}).length;});pct=Math.min(100,Math.round(c/90*100));lbl=c+' habit-days logged';stageNow=4;}
  else if(d===null||d>0){var tot=0,done=0;PLAN.forEach(function(sc){sc.items.forEach(function(it){tot++;if(planChk[it.id])done++;});});pct=Math.round(done/tot*100);phase=d===null?'🧭 Planning — set your departure date':'✈️ '+d+' day'+(d===1?'':'s')+' until departure';cta=[pct<100?'Continue preparing':'Study & quiz','plan',pct<100?'prep':'learn'];lbl=done+' of '+tot+' prep items · '+qzPassedCount()+'/'+QUIZ_LEVELS.length+' quiz levels';stageNow=0;}
  else{pct=dayPct(ST.day)||0;phase='🕋 Day '+ST.day+' of '+ST.tripLen+' in the Haramain';cta=['Log today’s worship','daily','today'];lbl=pct+'% of today’s deeds · '+ST.umrahs+' Umrah'+(ST.umrahs===1?'':'s')+' completed';stageNow=ST.umrahs?2:1;}
  var due=fcDue();var fcIdx0=due.length?due[0]:null;
  var nh=0;[HISTORY,VIRTUES,MADINAH,FIQHQA,KNOW,SCAMS].forEach(function(x){nh+=x.length;});
  var nq=0;QUIZ_LEVELS.forEach(function(l){nq+=l.qs.length;});
  var stages=[
    {i:'🧳',t:'Before you fly',s:'Prepare with ihsan',d:'Checklists for documents, packing and health, a departure countdown and a generated day-by-day itinerary. Then learn: the history of the Kaaba and Madinah, the virtues, the fiqh Q&A, a scam-awareness guide — and prove it in a 7-level quiz.',f:['Checklists','Itinerary','Knowledge hub','7-level quiz','Flashcards','Document vault'],go:['plan','prep'],c:'Start preparing'},
    {i:'🕋',t:'During your Umrah',s:'Ihram → Tawaf → Sa’i → Halq',d:'A step-by-step walkthrough with every dua in Arabic, transliteration and audio, and a "Why?" behind each step. Giant tap counters for tawaf and sa’i with a full-screen focus mode so you never lose count, a map of the mataf, and an automatic timeline that becomes a keepsake.',f:['Rites guide','Duas + audio','Tawaf & Sa’i counters','Focus mode','Mataf map','Keepsake card'],go:['umrah','count'],c:'Open the rites guide'},
    {i:'📿',t:'Every day in the Haramain',s:'Make every prayer count',d:'One prayer in the Haram is worth 100,000 — track all five in congregation, tahajjud, Quran, dhikr and extra deeds. Prayer times with reminders, a qibla compass, a tasbih counter, your personal dua list and a water counter, with streaks and achievements.',f:['Daily tracker','Prayer times','Qibla','Tasbih','Dua list','Streaks & badges'],go:['daily','today'],c:'Track today'},
    {i:'📍',t:'Ziyarah with purpose',s:'51 places, Makkah & Madinah',d:'Every sacred and historic site with why it matters, an etiquette tip and one-tap Google Maps. Save your hotel to see walking distances, sort by what’s near you, plan a nearest-first route, and book the Madinah hop-on hop-off bus.',f:['51 sites','Maps & distances','Route planner','Hop-on hop-off'],go:['places',null],c:'Explore places'},
    {i:'🌱',t:'After you return',s:'Don’t let it fade',d:'A 30-day habit keeper for prayers on time, daily Quran and dhikr, plus a reflections journal — so the person who came back from the Haram stays.',f:['Habit keeper','Reflections'],go:['more','guide'],c:'Keep it alive'}
  ];
  var acts=[['🔄','Counters','umrah','count'],['📋','Rites','umrah','steps'],['📿','Tasbih','daily','tools'],['🧭','Qibla','daily','tools'],['📍','Places','places',null],['🤲','Duas','more','duas'],['🃏','Cards','plan','learn'],['🗓️','Itinerary','plan','prep'],['🔐','Vault','plan','prep']];
  function goStr(g){return 'goTab(\''+g[0]+'\');'+(g[1]?'goSub(\''+g[0]+'\',\''+g[1]+'\',true);':'');}
  var h='';
  // 1. What this app is
  h+='<div class="hhero"><div class="hhero-mark">🕋</div><h2>Your complete Umrah companion</h2><p>Everything you need <b>before, during and after</b> Umrah — in one free, private app that works offline in the Haram.</p><div class="trust"><span>✓ Free</span><span>✓ Works offline</span><span>✓ Private — no account</span><span>✓ Every hadith verified</span></div></div>';
  // 2. Personal status
  h+='<div class="hstatus" onclick="'+goStr([cta[1],cta[2]])+'"><div class="hs-t"><small>As-salamu alaykum'+name+' · '+greg+' · '+hij+'</small><b>'+phase+'</b><span>'+lbl+'</span></div><div class="hs-r"><div class="ring-wrap" style="width:64px;height:64px"><svg width="64" height="64" viewBox="0 0 92 92" style="width:64px;height:64px"><circle class="ring-bg" cx="46" cy="46" r="38"/><circle class="ring-fg" id="hRing" cx="46" cy="46" r="38"/></svg><div class="ring-num" style="font-size:.9em"><span id="hPct">'+pct+'%</span></div></div><em>'+cta[0]+' →</em></div></div>';
  // 3. Next prayer
  h+='<div class="card card-pad hprayer" onclick="goTab(\'daily\');goSub(\'daily\',\'today\',true)"><div class="hp-i">🕌</div><div class="hp-t"><small>Next prayer</small><div id="hNext">Loading…</div></div><span class="hp-go">›</span></div>';
  // 4. Journey stages
  h+='<div class="vh" style="margin-top:8px"><h2 style="font-size:1.35em">How it works — your journey in 5 stages</h2><p>Tap a stage to jump in. The app follows you from your living room to the mataf and back.</p></div>';
  h+='<div class="stages">'+stages.map(function(st,i){return '<div class="stage'+(i===stageNow?' now':'')+'" onclick="'+goStr(st.go)+'"><div class="stage-n">'+(i+1)+'</div><div class="stage-b"><div class="stage-h"><span class="stage-i">'+st.i+'</span><div><b>'+st.t+'</b><small>'+st.s+'</small></div>'+(i===stageNow?'<span class="nowtag">You are here</span>':'')+'</div><p>'+st.d+'</p><div class="fchips">'+st.f.map(function(f){return '<span>'+f+'</span>';}).join('')+'</div><div class="stage-cta">'+st.c+' →</div></div></div>';}).join('')+'</div>';
  // 5. Numbers
  h+='<div class="nums"><div><b>'+PLACES.length+'</b><small>sacred &amp; historic places</small></div><div><b>'+nq+'</b><small>quiz questions in '+QUIZ_LEVELS.length+' levels</small></div><div><b>'+nh+'</b><small>knowledge topics</small></div><div><b>'+DUAS.length+'</b><small>essential duas with audio</small></div></div>';
  // 6. Quick tools
  h+='<div class="vh" style="margin-top:6px"><h2 style="font-size:1.2em">Quick tools</h2></div>';
  h+='<div class="qa-grid">'+acts.map(function(x){return '<button class="qa" onclick="'+goStr([x[2],x[3]])+'"><span>'+x[0]+'</span>'+x[1]+'</button>';}).join('')+'</div>';
  if(fcIdx0!==null)h+='<div class="card card-pad hfc" onclick="goTab(\'plan\');goSub(\'plan\',\'learn\',true)"><small>🃏 Today’s knowledge card · '+due.length+' due</small><b>'+FC_DECK[fcIdx0].f+'</b><span>Tap to study →</span></div>';
  h+='<div class="note" style="margin:0 0 12px">'+QUOTES[Math.floor(Date.now()/86400000)%QUOTES.length]+'</div>';
  h+='<div class="card card-pad" style="text-align:center"><h3 style="margin-bottom:6px">Made for the Ummah</h3><p style="font-size:.84em;color:var(--ink2);line-height:1.6">Free, no ads, no tracking. The sister app of <a href="https://www.ramadanstrivers.com/" target="_blank" rel="noopener" style="color:var(--brand-2);font-weight:700;text-decoration:none">Ramadan Strivers</a>. Share it with anyone going to Umrah.</p><button class="btn ghost" onclick="shareApp()">📤 Share the app</button></div>';
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
  document.addEventListener('touchstart',function(e){var t=e.target;ok=!(t&&t.closest&&t.closest('.tapring,.tb-btn,input,textarea,.jumps,.stops,.tb-chips,.focus,.sheet-o,.heat,.ph-grid,.fc'));sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',function(e){if(!ok)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)<70||Math.abs(dy)>50)return;
    var view=document.querySelector('.view.on');if(!view)return;var btns=view.querySelectorAll('.seg button');if(!btns.length)return;
    var cur=0;btns.forEach(function(b,i){if(b.classList.contains('on'))cur=i;});
    var nx=dx<0?cur+1:cur-1;if(nx<0||nx>=btns.length)return;
    goSub(view.id.replace('view-',''),btns[nx].getAttribute('data-sub'));
  },{passive:true});
})();

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
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&document.getElementById('focus').classList.contains('on')&&'wakeLock' in navigator){navigator.wakeLock.request('screen').then(function(w){wakeLock=w;}).catch(function(){});}});

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
  a.innerHTML=hist.slice().reverse().map(function(u){var d=new Date(u.log.done||Date.now());return '<div class="lg on"><span class="lg-i">🕋</span><span class="lg-t">Umrah #'+u.n+' <em>'+d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+'</em></span><button class="chip-btn" onclick="makeKeepsake('+u.n+')">🎴 Keepsake</button></div>';}).join('');
}
function makeKeepsake(no){
  var hist=[];try{hist=JSON.parse(localStorage.getItem('us-umrahlog')||'[]');}catch(e){}
  var u=hist.filter(function(x){return x.n===no;})[0];if(!u)return;var lg=u.log;
  var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#0E3B2E');g.addColorStop(1,'#13402F');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.strokeStyle='#D9B45E';x.lineWidth=6;x.strokeRect(50,50,980,1250);
  x.textAlign='center';x.font='140px serif';x.fillText('🕋',540,300);
  x.font='700 40px Georgia,serif';x.fillStyle='#D9B45E';x.fillText('MY UMRAH · #'+u.n,540,400);
  x.font='700 64px Georgia,serif';x.fillStyle='#fff';x.fillText(ST.name||'A guest of Allah',540,500);
  x.font='30px Georgia,serif';x.fillStyle='rgba(255,255,255,.75)';x.fillText(new Date(lg.done||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),540,555);
  var y=680;x.textAlign='left';x.font='32px Georgia,serif';
  [['Ihram',lg.ihram],['Tawaf',lg.tawafStart,lg.tawafEnd],['Sa’i',lg.saiStart,lg.saiEnd],['Halq / taqsir',lg.halq]].forEach(function(r){
    x.fillStyle='#EFD494';x.fillText(r[0],180,y);x.fillStyle='rgba(255,255,255,.85)';x.textAlign='right';
    x.fillText(r[1]?fmtTime(r[1])+(r[2]?' → '+fmtTime(r[2])+'  ('+fmtDur(r[2]-r[1])+')':''):'—',900,y);x.textAlign='left';y+=70;});
  if(lg.ihram&&lg.halq){x.fillStyle='#D9B45E';x.font='700 34px Georgia,serif';x.textAlign='center';x.fillText('Ihram to halq: '+fmtDur(lg.halq-lg.ihram),540,y+40);}
  x.textAlign='center';x.font='italic 30px Georgia,serif';x.fillStyle='#EFD494';x.fillText('"Umrah to Umrah is an expiation for what is between them."',540,1140);
  x.font='24px Georgia,serif';x.fillStyle='rgba(255,255,255,.55)';x.fillText('Bukhari 1773 · umrah-strivers.vercel.app',540,1190);
  var a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='my-umrah-'+u.n+'.png';a.click();toast('🎴 Keepsake saved',true);
}

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
function setItin(first){ST.itin=ST.itin||{};ST.itin.first=first;saveST();renderItin();}
function setItinDays(v){ST.itin=ST.itin||{};ST.itin.mad=Math.max(0,Math.min(20,parseInt(v)||0));saveST();renderItin();}
function renderItin(){
  var a=document.getElementById('itinArea');if(!a)return;
  var it=ST.itin||{first:'makkah',mad:3};if(it.mad===undefined)it.mad=3;if(!it.first)it.first='makkah';
  document.getElementById('itMk').classList.toggle('on',it.first==='makkah');document.getElementById('itMd').classList.toggle('on',it.first==='madinah');
  document.getElementById('itMad').value=it.mad;
  var N=ST.tripLen,mad=Math.min(it.mad,N-1),mk=N-mad;
  var MK=[['🛬','Arrive · ihram at the miqat (in flight) · Umrah tonight when rested'],['🕌','All five prayers in the Haram · nafl tawaf after Fajr · rest'],['🚐','Ziyarah taxi loop: Hira → Arafat → Muzdalifah → Mina → Thawr'],['🤍','Second Umrah from Tan’eem (or Ji’ranah) · Zamzam & long dua'],['📖','Quran facing the Kaaba · Hijr Isma’il late night · Clock Tower museum'],['🕋','Nafl tawaf · Jannat al-Mu’alla · Masjid al-Jinn · rest'],['🌙','Tahajjud in the Haram · dua list at the Multazam · shopping']];
  var MD=[['🚄','Haramain train · settle · Maghrib & Isha in Masjid an-Nabawi · salam to the Prophet ﷺ'],['🕌','Rawdah (Nusuk permit) · Baqi’ after Fajr · Quba with wudu from the hotel'],['🚌','Hop-on hop-off: Qiblatayn → Trench → Uhud → Hijaz Railway'],['📿','Masjid al-Ijabah · Quran & Seerah museums · Ajwa dates market'],['🌙','Tahajjud in the Nabawi · Quba Avenue walk · long dua']];
  var days=[],i;
  function push(arr,cnt,city){for(i=0;i<cnt;i++)days.push({city:city,e:arr[Math.min(i,arr.length-1)]});}
  if(it.first==='makkah'){push(MK,mk,'Makkah');push(MD,mad,'Madinah');}else{push(MD,mad,'Madinah');days.push({city:'Makkah',e:['🚄','Train to Makkah · ihram at Masjid al-Miqat (Abyar Ali) · Umrah on arrival']});push(MK.slice(1),mk-1,'Makkah');}
  if(days.length){var last=days[days.length-1];last.e=[last.city==='Makkah'?'🕋':'🕌',last.city==='Makkah'?'Farewell tawaf (tawaf al-wada’) · last dua at the Multazam · depart':'Last salam to the Prophet ﷺ · depart'];}
  var base=ST.dep?new Date(ST.dep+'T00:00:00'):null;
  a.innerHTML=days.map(function(d,idx){var dt=base?new Date(base.getTime()+idx*86400000).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):'';return '<div class="it"><div class="it-d"><b>Day '+(idx+1)+'</b><small>'+(dt||d.city)+'</small></div><div class="it-t"><span class="it-c">'+(d.city==='Makkah'?'🕋':'🕌')+' '+d.city+'</span>'+d.e[0]+' '+d.e[1]+'</div></div>';}).join('')+'<p style="font-size:.72em;color:var(--ink3);margin-top:8px">A suggestion, not a rule — worship comes first; drop ziyarah if you are tired. Adjust the day split above.</p>';
}

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
  var a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='umrah-progress.png';a.click();toast('📸 Progress card saved',true);
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
function updHotelLbl(){var l=document.getElementById('hotelLbl');if(l)l.textContent=ST.hotel?'🏨 Hotel saved ('+ST.hotel[0].toFixed(3)+', '+ST.hotel[1].toFixed(3)+')':'🏨 No hotel saved';}
function setHotel(){if(!navigator.geolocation){toast('Location not supported');return;}toast('Locating…');navigator.geolocation.getCurrentPosition(function(pos){ST.hotel=[pos.coords.latitude,pos.coords.longitude];saveST();updHotelLbl();renderPlaces();toast('🏨 Hotel saved — distances now show from here');},function(){toast('Location denied');});}
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
function jumpTo(id){var el=document.getElementById(id);if(!el)return;var y=el.getBoundingClientRect().top+window.scrollY-118;window.scrollTo({top:y,behavior:'smooth'});vib(8);}
function shareApp(){
  var data={title:'Umrah Strivers',text:'Plan, learn, perform & track your Umrah — rites walkthrough, tawaf counter, prayer times, ziyarah places & a knowledge quiz. Free, offline, private.',url:'https://umrah-strivers.vercel.app/'};
  if(navigator.share){navigator.share(data).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(data.url).then(function(){toast('🔗 Link copied — share it with your group');});}
  else toast('umrah-strivers.vercel.app');
}

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
  var txt='🧭 Plan',go='plan';
  if(ST.post){txt='🌱 Post-Umrah';go='more';}
  else if(ST.dep){
    var d=Math.ceil((new Date(ST.dep+'T00:00:00')-new Date())/86400000);
    if(d>0){txt='✈️ '+d+' day'+(d===1?'':'s');go='plan';}
    else if(d===0){txt='🛫 Today';go='umrah';}
    else{txt='🕋 Day '+ST.day+' / '+ST.tripLen;go='daily';}
  }
  c.textContent=txt;c.onclick=function(){goTab(go);};
}

/* ════════════════════════ ONBOARDING ════════════════════════ */
function showOnboard(){var o=document.getElementById('obSheet');if(o)o.classList.add('on');}
function chooseStage(st){
  var nm=(document.getElementById('obName').value||'').trim();if(nm)ST.name=nm;
  ST.onboarded=true;
  if(st==='plan'){ST.tab='home';ST.sub=Object.assign(ST.sub||{},{plan:'prep'});}
  if(st==='soon'){ST.tab='plan';ST.sub=Object.assign(ST.sub||{},{plan:'quiz'});}
  if(st==='now'){ST.tab='umrah';ST.sub=Object.assign(ST.sub||{},{umrah:'count'});if(!ST.dep){var d=new Date();d.setDate(d.getDate()-1);ST.dep=d.toISOString().slice(0,10);}}
  if(st==='back'){ST.tab='more';ST.post=true;ST.sub=Object.assign(ST.sub||{},{more:'guide'});}
  saveST();
  document.getElementById('obSheet').classList.remove('on');
  applySubs();renderPost();updChip();updCountdown();goTab(ST.tab);
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
  var name=ST.name||prompt('Name to print on the certificate:','');
  if(name===null)return;
  name=(name||'A Striving Pilgrim').trim()||'A Striving Pilgrim';
  ST.name=name;saveST();
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
  var a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='umrah-knowledge-certificate.png';a.click();
  toast('🎖️ Certificate downloaded — share it & inspire someone!',true);
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
   +'<div class="fc" id="fcCard" onclick="this.classList.toggle(\'flip\')"><div class="fc-in">'
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
  if(event)event.stopPropagation();
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
  sw.classList.toggle('on',!!ST.post);
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
function updRemSw(){var sw=document.getElementById('remSw');if(sw)sw.classList.toggle('on',!!ST.rem);}
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

/* ════════════════════════ INIT ════════════════════════ */
function initUI(){
  applyTheme();
  document.getElementById('quoteLine').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('tripLen').value=ST.tripLen;
  var ni=document.getElementById('nameIn');if(ni)ni.value=ST.name||'';
  renderPlan();renderRites();renderDaily();renderPlaces();renderDuas();renderTB();
  buildDeck();renderFC();renderPost();updRemSw();applySubs();updChip();renderItin();renderVault();renderDuaList();renderWater();updHotelLbl();
  if(!ST.onboarded)setTimeout(showOnboard,400);
  var kb=document.getElementById('kidsBest'),kbv=localStorage.getItem('us-kids');if(kb&&kbv)kb.textContent=kbv+'/'+KIDSQ.length;
  var cm=document.getElementById('cityMakkah'),cd=document.getElementById('cityMadinah');
  if(cm){cm.classList.toggle('on',(ST.city||'Makkah')==='Makkah');cd.classList.toggle('on',ST.city==='Madinah');}
  updPlan();updRites();updDaily();updPlaces();updStats();renderBadges();
  goTab('home');
}
document.addEventListener('DOMContentLoaded',function(){loadAll();initUI();
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
});
