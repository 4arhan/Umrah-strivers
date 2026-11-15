// Miqah product page: theme switch, the phone that changes screen as you scroll,
// the live demo, and the older-updates button. The page reads fine without any of it.
(function () {
  var root = document.documentElement;

  // ── theme ──
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() { return root.dataset.theme ? root.dataset.theme === 'dark' : mq.matches; }
  var tb = document.getElementById('themeBtn');
  if (tb) tb.addEventListener('click', function () {
    var t = isDark() ? 'light' : 'dark'; root.dataset.theme = t;
    try { localStorage.setItem('miqah-site-theme', t); } catch (e) { }
  });

  // ── the sticky phone: the beat crossing the middle of the screen picks the screenshot ──
  var wide = window.matchMedia('(min-width: 900px)');
  document.querySelectorAll('.story').forEach(function (story) {
    var beats = [].slice.call(story.querySelectorAll('.beat')), shots = story.querySelectorAll('.story-stage .shot'), dots = story.querySelectorAll('.dots i');
    function set(i) {
      beats.forEach(function (b, j) { b.classList.toggle('on', j === i); });
      shots.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    }
    if (!('IntersectionObserver' in window)) { root.classList.remove('js'); return; }
    var io = new IntersectionObserver(function (es) {
      if (!wide.matches) return;
      es.forEach(function (e) { if (e.isIntersecting) set(beats.indexOf(e.target)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    beats.forEach(function (b) { io.observe(b); });
  });

  // ── nav: mark the section in view ──
  var links = [].slice.call(document.querySelectorAll('.nav-links a'));
  if (links.length && 'IntersectionObserver' in window) {
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a, i) { a.classList.toggle('on', secs[i] === e.target); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) nio.observe(s); });
  }

  // ── live demo: the real app in a frame, loaded only when asked for ──
  var db = document.getElementById('demoBtn'), ds = document.getElementById('demoScreen');
  if (db && ds) db.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.title = 'Miqah, live'; f.src = 'https://miqah.app/'; f.setAttribute('referrerpolicy', 'no-referrer');
    function fit() { f.style.transform = 'scale(' + (ds.clientWidth / 390) + ')'; f.style.height = Math.ceil(ds.clientHeight / (ds.clientWidth / 390)) + 'px'; }
    ds.innerHTML = ''; ds.appendChild(f); fit(); window.addEventListener('resize', fit); f.focus();
  });

  // ── older updates ──
  var um = document.getElementById('updMore');
  if (um) um.addEventListener('click', function () {
    document.querySelectorAll('#upd .u[hidden]').forEach(function (li) { li.hidden = false; });
    um.remove();
  });
})();
