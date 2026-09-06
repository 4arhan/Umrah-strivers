/* Umrah Strivers — offline service worker */
/* Release note: bump APP_VERSION here AND at the top of app.js for every release. */
var APP_VERSION = '4.9.0';
var CACHE = 'umrah-strivers-' + APP_VERSION;
var CORE = ['./', './index.html', './data.js', './app.js', './manifest.json'];
var SHELL = ['/', '/index.html', '/app.js', '/data.js'];

self.addEventListener('install', function (e) {
  // No skipWaiting here: the new worker waits until the page asks (update chip) so the app never reloads under the pilgrim's feet.
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isShell(url, req) {
  if (req.mode === 'navigate') return true;
  var p = url.pathname;
  for (var i = 0; i < SHELL.length; i++) { if (p === SHELL[i] || p.endsWith(SHELL[i])) return true; }
  return false;
}
function withTimeout(p, ms) {
  return new Promise(function (res, rej) {
    var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
    p.then(function (v) { clearTimeout(t); res(v); }, function (err) { clearTimeout(t); rej(err); });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // App shell (index, app.js, data.js): stale-while-revalidate — instant from cache, refreshed in the background.
  if (url.origin === location.origin && isShell(url, req)) {
    var key = req.mode === 'navigate' ? './index.html' : req;
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(key).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) c.put(key, res.clone());
          return res;
        });
        if (hit) { net.catch(function () {}); return hit; }
        // Nothing cached yet: on a poor signal do not hang — race the network against 3 s, then fall back to the shell.
        return (req.mode === 'navigate' ? withTimeout(net, 3000) : net).catch(function () { return c.match('./index.html'); });
      });
    }));
    return;
  }

  // Fonts: cache-first (they never change per URL)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  // Other same-origin assets: cache-first with network fill
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
  }
  // Cross-origin API calls (prayer times) pass through untouched — the app has its own localStorage cache.
});
