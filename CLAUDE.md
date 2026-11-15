# Miqah

A free, offline, private Hajj and Umrah companion. Vanilla HTML, CSS and JS with no build step for the app:
`index.html` (markup and all CSS), `app.js`, `data.js`, `cites.js`, `sw.js`. The app is live at https://miqah.app.

Tests: `npm test` runs `test/smoke.js` and needs Chromium (`CHROME=/path/to/chromium`, and `NODE_PATH` if
`playwright-core` is not installed locally).

## Standing instruction: the product page keeps up with the app

The owner asked on 15 November 2026 that **every time a feature is added or the app is updated, it is
included on the product page, with screenshots**. The page is https://demo.miqah.app. It lives in `site/`
and is its own Vercel project (`miqah-demo`), separate from the app's project (`umrah-strivers`).

Any change that bumps `APP_VERSION` is not finished until these are done:

1. Add an entry at the top of `updates` in `tools/site-content.js` for the new version: a title and, in
   plain words, what changed for a pilgrim. A release of fixes still gets an entry.
2. If the change has a screen worth showing, add or adjust its scene in `tools/site-shots.js` and its
   beat, card or tile in `tools/site-content.js`. If it changed how an existing screen looks, the
   screenshots are stale either way.
3. Regenerate: `node tools/site-shots.js` (every scene; `ONLY=id,id` for a few), then
   `node tools/site-build.js`. Delete any screenshot the build reports as unused.
4. Run `npm test`. The checks that start with `site:` fail when the newest entry is not for the running
   version, or when `site/index.html` is not what the builder would write today.
5. Look at the page once at phone and desktop width, in both themes, before deploying.
6. Deploy both projects: the app from the repository root, the page from `site/`
   (`npx vercel link --yes --project miqah-demo --cwd site` once, then
   `npx vercel deploy --prod --yes --cwd site`).

Rules for the page:

- Say only what the app does. Take the wording of rulings, numbers and names from the app itself, and
  never state a count that the app does not show.
- Every screenshot is the real app with sample data. Names, phone numbers and hotels in
  `tools/site-shots.js` are made up; keep them that way.
- Same design language as the app: lilac paper, white cards, one dark aubergine surface, Manrope, and
  Scheherazade New for Arabic. No emoji. Icons come from the app's own `MARKS`.
- `site/index.html` is generated. Edit `tools/site-content.js` (words), `tools/site-build.js` (structure),
  `site/site.css` and `site/site.js`, then rebuild.
