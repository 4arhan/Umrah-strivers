# Miqah

A free, offline, private Hajj and Umrah companion. Vanilla HTML, CSS and JS with no build step for the app:
`index.html` (markup and all CSS), `app.js`, `data.js`, `cites.js`, `sw.js`. The app is live at https://miqah.app.

Tests: `npm test` runs `test/smoke.js` and needs Chromium (`CHROME=/path/to/chromium`, and `NODE_PATH` if
`playwright-core` is not installed locally).

## Languages

The app is written in English and stays English inside. `i18n.js` translates what is on the screen: each line is
reduced to a canonical form (numbers, dates, prayer names and the pilgrim's own words become placeholders) and
looked up in a language pack, `i18n/<code>.js`. A line with no entry stays in English. Arabic text is never touched.
A language shows in the picker only when `i18n/index.js` lists its pack.

When the app's text changes (any release):

1. `node tools/i18n-extract.js` reads every screen and rewrites `i18n/src/units.json` (about 5 minutes).
2. `node tools/i18n-build.js chunks` puts the lines that are new into new batches under `i18n/src/chunks/`.
   Batches that exist keep their lines, so only what changed needs translating.
3. Translate each new batch into each language, then have it checked by someone who did not translate it:
   `i18n/src/BRIEF.md` and `i18n/src/VERIFY.md` are the instructions; translations live in `i18n/tr/<lang>/`.
   `node tools/i18n-build.js status` shows what is missing.
4. `node tools/i18n-build.js pack` checks every line and writes the packs. A refused line is listed in
   `i18n/tr/<lang>/_rejects.json` and stays in English until it is fixed.
5. `npm test`. The checks that start with `i18n` fail when the inventory is not from the running version or a
   shipped line breaks a rule below.

Rules for translations:

- Miqah never translates a verse of the Quran itself. A pack quotes one named, published translation per language
  (`tools/i18n-sources.js` lists them; `i18n/src/quran.json` holds the text).
- A hadith line is the app's own wording. Its translation is checked against the Arabic text
  (`i18n/src/hadith.json`), not only against the English.
- No translation may change a number, a reference, a web address, an arrow or ﷺ. They are placeholders or protected
  marks, and `tools/i18n-build.js` refuses a line that breaks them.
- Each pack carries a note, shown in the language sheet, that says how it was made and checked. Keep it true: a pack
  that no scholar or native editor has reviewed says so.
- Text drawn into pictures (the keepsake, the certificate) and search stay in English for now.

## Standing instruction: the product page keeps up with the app

The owner asked on 15 November 2026 that **every time a feature is added or the app is updated, it is
included on the product page, with screenshots**. The page is https://about.miqah.app. It lives in `site/`
and is its own Vercel project (`miqah-demo`), separate from the app's project (`umrah-strivers`).

Any change that bumps `APP_VERSION` is not finished until these are done:

1. Add an entry at the top of `updates` in `tools/site-content.js` for the new version: a title and, in
   plain words, what changed for a pilgrim. A release of fixes still gets an entry.
2. Put the feature in its category in `tools/site-content.js`. The page is grouped by what a feature
   gives a pilgrim (Plan, Learn, Perform, Duas, Track, Explore, Safety, Together, Trust), and every
   feature sits in exactly one group: as a `beat` (the showcase) or a `more` entry, with `since` set
   to the version it arrived in so it gets a “New” tag. If it has a screen worth showing, add or
   adjust its scene in `tools/site-shots.js`. If it changed how an existing screen looks, the
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
- The owner asked (15 November 2026) for features to be grouped by their value, not by where they sit
  in the app. A new kind of value gets a new category; do not start a miscellaneous one.
- `site/index.html` is generated. Edit `tools/site-content.js` (words), `tools/site-build.js` (structure),
  `site/site.css` and `site/site.js`, then rebuild.
