/* Miqah — offline service worker */
/* Release note: bump APP_VERSION here AND at the top of app.js for every release. */
var APP_VERSION = '6.10.2';
var CACHE = 'umrah-strivers-' + APP_VERSION;
/* 6.7 (G3 #33): web fonts live in their own unversioned cache, kept across updates — an update applied in Mina without data keeps Manrope and Scheherazade */
var FONTS = 'miqah-fonts';
var CORE = ['./', './index.html', './data.js', './cites.js', './app.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png',
  './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './icons/shortcut-sos-192.png', './icons/shortcut-help-192.png'];
var SHELL = ['/', '/index.html', '/app.js', '/data.js', '/cites.js'];

self.addEventListener('install', function (e) {
  // No skipWaiting here: the new worker waits until the page asks (update chip) so the app never reloads under the pilgrim's feet.
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    // before an old versioned cache goes, its font files move to FONTS (earlier releases kept them in the versioned cache)
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== FONTS; }).map(function (k) {
      return caches.open(k).then(function (c) {
        return c.keys().then(function (reqs) {
          return Promise.all(reqs.filter(function (r) { return /\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.url); }).map(function (r) {
            return c.match(r).then(function (res) { return res ? caches.open(FONTS).then(function (f) { return f.put(r, res); }) : null; });
          }));
        });
      }).catch(function () {}).then(function () { return caches.delete(k); });
    }));
  }).then(function () { return self.clients.claim(); }));
});

/* 6.9 (G5 #47): a tap on a prayer or medicine reminder brings the open app forward, or opens it on Daily */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) return list[i].focus(); }
    return self.clients.openWindow ? self.clients.openWindow('./?go=daily') : null;
  }));
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/* Standalone pages (marketing / legal) must never be answered with the app shell. */
var PAGES = ['/install', '/install.html', '/privacy', '/privacy.html'];
function isPage(url) {
  var p = url.pathname.replace(/\/+$/, '') || '/';
  return PAGES.indexOf(p) > -1;
}
function isShell(url, req) {
  if (isPage(url)) return false;
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

  // Standalone pages: network-first so edits publish immediately, cache as an offline fallback.
  if (url.origin === location.origin && isPage(url)) {
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // Fonts: cache-first (they never change per URL), kept in FONTS so an update never drops them; an older copy in a versioned cache still answers
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(FONTS).then(function (c) { c.put(req, copy); }); }
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
