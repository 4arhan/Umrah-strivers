# 🕋 Miqah

**Hajj & Umrah companion** — plan, learn, perform and track your Umrah. The sister app to [Ramadan Strivers](https://www.ramadanstrivers.com/).

> The app was previously called *Umrah Strivers*; the repository name `Umrah-strivers` and the `umrah-strivers.vercel.app` address are historical and still work.

An offline-first web app (`index.html` + `data.js` + `app.js`, zero build step). No accounts, no servers, no tracking — all data stays on your device, with export/import backup and an encrypted document vault.

## Features

### 🧳 Plan — before you fly
- **Departure countdown** with a live day counter and typical Makkah/Madinah temperatures for your travel month
- **"What to do when" timeline** — every checklist item has an ideal lead time; from your departure date the app shows what's overdue, due this week, and coming up
- **Readiness tiles** per category (documents, packing, health, knowledge)
- **Hotel & emergency card** — save your hotel; a full-screen "Show to driver" page in Arabic + English; Saudi emergency numbers (911, 937, 1966, 930)
- **Preparation checklists** — documents & bookings (Nusuk visa, Rawdah permit), packing (ihram, unscented toiletries…), health (Meningitis ACWY certificate, walking training), and knowledge & spiritual prep
- **Knowledge Hub** — six study sections: **History & significance** (the Kaaba, Hajar & Zamzam, the Black Stone, Hira, the Year of the Elephant, the Kaaba's rebuilds, the talbiyah's meaning, the qibla change, the Hijrah & conquest), **Virtues of Umrah & the Haram** (sin expiation, poverty removal, guests of Allah, the Prophet's ﷺ own four Umrahs, 100,000× prayers, Zamzam), a dedicated **Madinah section** (1,000× prayers, the Rawdah, greeting the Prophet ﷺ, the sanctuary, Quba, Uhud, Ajwa), a **fiqh Q&A** (badal Umrah, wudu breaking mid-tawaf, menstruation, wheelchair tawaf, traveller's prayer…), and the practical **Know Before You Go** topics (miqats, ihram rules, how to wear the ihram, Nusuk, transport, common mistakes) and a **For sisters** section
- **Knowledge circuit quiz** — one track per journey (the app counts the levels and questions from `QUIZ_ORDER` and the journey gating: today 7 Umrah levels, or 10 Hajj levels in the order of the five days with the Tawaf, History, Virtues and Madinah levels shared), true/false & multiple-choice questions with referenced explanations; score 80% to unlock the next level and complete the circuit before you fly
- **Hadith citations checked** against their collections (mostly Bukhari, Muslim, Tirmidhi, Ibn Majah, Nasai and Abu Dawud, plus a few from other collections) — paraphrases kept faithful, weak narrations avoided or marked
- **Daily knowledge flashcards** — spaced repetition (1/3/7-day boxes) over the whole knowledge hub, paced for the run-up to departure
- **Donation & scam awareness** — 10 guides to the common rip-offs: fake packages & visas, badal-Umrah traps, Nusuk phishing, "VIP access" touts, street begging gangs, QR-code "sadaqah", prize scams — with the official alternatives (umrah.nusuk.sa, Ehsan) and how to report (911 / care line 1966)
- **Kids corner** — an 8-question big-button mini quiz with stars and read-aloud (on a Hajj journey at least five of the eight are about the Hajj), plus story-time tales for ages 6–10 (two more for Hajj), so children prepare too
- **Quiz upgrades** — "Review my mistakes" mode re-drills only the questions you got wrong; completing the circuit of your journey's track unlocks a downloadable **certificate**

### 🕋 Umrah — during the rites
- **Step-by-step rites checklist** across 4 phases: Ihram at the miqat → Tawaf → Sa'i → Halq/Taqsir, with the key duas inline (Arabic, transliteration, translation)
- **Tawaf counter & Sa'i counter** — big tap targets, round-by-round coaching, an accidental-tap guard, a nafl-tawaf mode and a full-screen big counter with the rite's dua, so you never lose count mid-round
- **Multiple Umrahs** — record a completed Umrah and reset the steps for the next one (ihram from Masjid Aisha / Tan'eem)

### 📿 Daily — maximise every day in the Haramain
- Daily worship tracker: five prayers in congregation, tahajjud, Quran, dhikr & dua, nafl tawaf, sadaqah, serving pilgrims…
- The day follows your departure date automatically (Day 1 = arrival), with the real date and Hijri date, weighted progress, labelled streaks (Fajr jama'ah, tahajjud, Quran, nafl tawaf), a tappable trip heatmap, trip stats and 10 unlockable achievements
- **Excused days** for sisters (salah/tawaf rows pause without breaking streaks) and an opt-in **Kids' day** — five emoji tiles per child, stars for a 5/5 day, a Little Pilgrim badge
- Configurable trip length (3–45 days) — or set a return date next to the departure date

### 📍 Places — ziyarah with purpose
- **51 sites** across Makkah (29) and Madinah (22), grouped — Makkah: The Haram · Ziyarah · The Hajj sites · Museums & culture · Day trips; Madinah: The Prophet's Mosque & around · Historic mosques · Battlefields, wells & history · Hop-on hop-off & practical
- Every site has its historical significance (with Quran/hadith references checked against the sources where applicable), an etiquette/practical tip, its **Arabic name** and an offline **🚕 Show driver** card, a **one-tap Google Maps** button, and a one-tap "visited" tracker that remembers the trip day; search box across all sites (English or Arabic)
- **Access tags** on the collapsed card — men-only cemeteries, after-Fajr/Asr hours, Nusuk permits, climbs — so nobody is turned away at a gate; a ⬜ Unvisited pill, folded Hajj/museum/day-trip groups and a hotel pin per city (GPS or a landmark, set before you fly)
- **Route planner** — nearest-first from your hotel or live position, per-stop walking time, Hajj sites as one taxi line, climbs left out unless you ask, your own ＋ Route shortlist, Visited ticks that keep the plan, Share route
- **Madinah Hop-On Hop-Off card** — the City Sightseeing stops as city-sightseeing.com lists them (Red history loop, Green Haram loop) with route-coloured chips, a booking link, and stop badges on the matching places
- New Makkah sites include Hijr Isma'il & Maqam Ibrahim, Zamzam, the Mas'a, the Prophet's ﷺ birthplace, Jabal Abu Qubays, Masjid ar-Rayah, Ji'ranah, Hudaybiyyah, Namirah, al-Mash'ar, al-Khayf, al-Bay'ah, the Jamarat, the Hira Cultural District, the Kiswah factory, Makkah Museum, Ta'if and historic Jeddah; new Madinah sites include Bab as-Salam, Al Manakha, the Quran & Seerah museums, Masjid al-Jumu'ah, al-Ijabah, al-Miqat (Abyar Ali), Wadi al-Aqiq, Bir Uthman, Salman's garden, the Hijaz Railway, Quba Avenue and the practical stops

### 🕌 Live tools
- **Audio duas** — tap 🔊 on any dua (rites steps and the library) to hear the Arabic recited via speech synthesis
- **Prayer reminders** — opt-in local notifications ~20 minutes before each prayer while the app is open (60 for Jumu'ah; no server, no push backend) — plus **Add this week's prayer times to my calendar** (.ics with alarms, TZID Asia/Riyadh) for alerts with the screen off
- **Post-Umrah mode** — a 30-day, 3-habit keeper (prayers on time, daily Quran, daily dhikr) plus a reflections journal, so the journey's change sticks
- **Prayer times** for Makkah & Madinah (Umm al-Qura method) with next-prayer countdown and Hijri date — the whole month is cached for both cities, and a built-in solar computation (Fajr 18.5°, Isha +90 min, +120 in Ramadan, ±2 min) guarantees times even with no cache; the grid doubles as the salah checklist, Friday shows Jumu'ah, and a one-tap message shares today's times with a meeting point
- **Qibla compass** — device compass points a 🕋 needle at the Kaaba from anywhere (with a degrees-from-North fallback)
- **Digital tasbih** — six dhikr phrases, 33-count cycles with haptics, per-phrase daily counts; 100 dhikr, 100 istighfar and 100 salawat tick their checklist rows; marking a ziyarah site visited logs today's ziyarah
- **Offline PWA** — service worker caches the app shell; installable from the browser with an in-app install button

### ⚙️ More
- Essential duas library (talbiyah, tawaf, sa'i, Zamzam, travel…)
- Resources: Nusuk, Haramain High-Speed Rail, Tarteel, Sunnah.com
- Dark/light theme, backup export/import, full reset

## Getting the app

| Where | Link |
|---|---|
| Web app | https://umrah-strivers.vercel.app |
| Install instructions | https://umrah-strivers.vercel.app/install |
| Privacy policy | https://umrah-strivers.vercel.app/privacy |

Installable from any modern browser as a home-screen app. See **[LAUNCH.md](LAUNCH.md)** for the Google Play and App Store process, including what is already prepared and what still needs your developer accounts.

Store and install assets live in `icons/` (app icons, screenshots, feature graphic, Open Graph image) and `store/` (framed 1080×1920 listing screenshots).

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F4arhan%2FUmrah-strivers)

Or manually, in about a minute:

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (with GitHub).
2. **Import** the `4arhan/Umrah-strivers` repository.
3. Leave everything default (Framework Preset: **Other**, no build command, no output directory) and hit **Deploy**.
4. Done — you get `umrah-strivers.vercel.app` (rename in Project Settings → Domains, or attach a custom domain).

Every push to the production branch auto-deploys. A `vercel.json` is included with sensible security headers.

## Running locally

No build step: open `index.html` in a browser (it loads `data.js` and `app.js` from the same folder), or run `npm start`. The service worker registers only over https, so offline caching does not run locally — check offline use and the installed app on the deployed site.

## v6.4 — Hajj learning

- **Journey tracks**: `QUIZ_LEVELS` is append-only (stored progress stays `l<index>q<index>`); every level has a stable `key`, and `QUIZ_ORDER[journey]` sets the display order, so level numbers ("Level 3") are computed per track. Levels and questions are gated by `j` / `ht` through `forMe()`; `j:'off'` retires a level (the old "days of Hajj" level, whose questions now live, corrected, in the six Hajj levels — mistakes and card boxes moved once).
- **Hajj track**: Foundations of Hajj · Ihram for Hajj & the talbiyah · Tawaf, Sa’i & Halq (shared) · the 8th & 9th · Muzdalifah & the 10th · Tashreeq & the farewell · Hajj fiqh · History, Virtues (Hajj set) and Madinah (shared). Umrah-only questions are hidden for Hajj; Tamattu’ sees its Part 1 Umrah questions, Qiran and Ifrad never do.
- **Quiz**: per-level rings, a track header, source chips, a review list after every run with "Retry the ones I missed", keyboard answering (1–4 / A–D / T–F, Enter, Esc), type tags ("Tamattu’ only"), and on a Hajj journey a knowledge-only readiness score (quiz, cards and the five days read).
- **Flashcards**: the deck follows the journey and the Hajj type (Hajj first; the phase — departure near, before the 8th, each day of Hajj, after — decides the focus), topic chips with due counts, new / learning / mastered counts, swipe or keys to grade (no drag under reduced motion), "Again" comes back once in the same session, "Open in Learn" / "Open the day" on the back, and a session summary.
- **Learn**: "Hajj in 5 days" tiles (expected dates from the Umm al-Qura calendar, today's day highlighted) open each day in the rites guide; Umrah-only topics are gated and the shared ones worded for both journeys.

## v4.0 — Home, during-Umrah tools, planning tools
- **Home dashboard** — greeting with Hijri date, your journey phase with a progress ring and next-step CTA, next prayer countdown, 9 quick actions, today's flashcard, daily quote
- **Focus mode** for the Tawaf/Sa'i counters — full-screen giant tap zone, screen kept awake (Wake Lock), round-by-round coaching
- **Umrah timeline & keepsake** — ihram, tawaf, sa'i and halq are time-stamped automatically; every recorded Umrah gets a downloadable keepsake card with durations
- **Mataf schematic** — where the Black Stone corner, Hijr, Maqam, Multazam, Yamani corner, Zamzam and the Safa exit are
- **"Why?" explainers** on every rite step — the evidence behind each action (references checked against the sources)
- **Itinerary generator** — a worship-first day plan from your dates, Makkah- or Madinah-first, with adjustable day split
- **Encrypted document vault** — passport/visa/bookings stored in IndexedDB, AES-256-GCM with a PIN-derived key (PBKDF2); nothing leaves the device
- **Packing by bag** — filter the packing list by ihram bag / carry-on / suitcase; **prep streak** on the Plan hero
- **My dua list** — editable personal duas, ticked as asked; **water counter** and **estimated km walked in worship**
- **Share my progress card** — a 1080×1080 image of your trip stats
- **Places**: coordinates on 38 sites, save your hotel once for **distance & walking time** on every card, **Near me** sort, and a **ziyarah route planner** (nearest-first, unvisited only, opens as a multi-stop Google Maps route)
- **Swipe** between sub-tabs; sticky progress line under the segmented control; contrast-corrected gold text and aria labels

## UI (v3.1)
- **Segmented sub-navigation** inside every tab (Plan: Prepare · Learn · Quiz; Umrah: Counters · Steps; Daily: Today · Tools · Stats; More: Guide · Duas · Settings) — sticky under the header, remembered per tab
- **First-launch onboarding sheet** — "Where are you on your journey?" jumps you to the right screen and captures your name for the certificate
- **Journey chip** in the header — days to departure, current trip day, or post-Umrah state — tap to jump
- Confetti celebrations, animated count-ups on progress rings, skeleton loading for prayer times, places search
- **v3.3 screen-by-screen polish** — gold departure countdown card, jump-chips on the long Learn and Places pages, compact tap-to-expand place cards, round-by-round guidance under the Tawaf/Sa'i counters, wrapped tasbih phrases, name + share-the-app in Settings

## v5.1 — Journey engine (Hajj)
- **One question first**: onboarding opens with "What has Allah invited you to?" — 🕋 Umrah (the existing flow, unchanged) or ⛺ Hajj ("Hajj 1448 — when do you fly?" with the Gregorian dates of 8–13 Dhul Hijjah, Brother/Sister, name; "I'm already in Saudi Arabia" asks the trip day and whether the Umrah of Tamattu' is done; Skip). Closing with ✕ keeps Umrah and offers a one-line "Going for Hajj?" chip on Home
- **Hajj is a superset of Umrah**: the Rites tab shows *Part 1 · Your Umrah* (the same steps, counters and stamps) and a rulings note; Part 2 (the five days) renders through `renderHajjRites()` when present
- **Two calendars**: Umrah stays anchored to the departure date; the days of Hajj follow the Hijri calendar (`hajjDates(year)` from the `HAJJ_D8` table, checked against Umm al-Qura, with Intl `islamic-umalqura` for years outside it, `ST.hajjShift` ±1 for moon sighting). Home shows "Today is 9 Dhul Hijjah, correct? ◀ ✓ ▶" on each day of Hajj — the app never says "you missed it" from the calendar alone
- **Gating**: rows carrying `j:'hajj'|'umrah'` and `ht:[…]` pass through `forMe()`, so checklists, rites, duas, quiz levels and knowledge topics follow the journey and the Hajj type (Tamattu' / Qiran / Ifrad in Settings)
- **Links**: `?dep=YYYY-MM-DD&j=hajj` is the zero-question path; the `#g=` group link carries the journey, Hajj type and Mina camp card (camp / maktab / group leader — on the driver, I'm-lost and Help cards)
- **After a trip**: "Plan your next journey" (Umrah / Hajj) and a "My journeys" archive under More › After; trip length up to 45 days

## v5.2 — Hajj rites, counters and record
- **Part 2 · The days of Hajj** under the Umrah steps in Hajj mode: one section per day from `HAJJ_RITES` (8 Dhul Hijjah → tawaf al-wada), each folded until its date and auto-opened on its day, never hidden once past; every step carries a *rukn / wajib / sunnah* pill, a **Missed it?** expander with the ruling (dam etc., always ending "tell your group leader / ask a scholar"), the dua with audio and a Why?; elderly concessions and women's rulings are steps, not footnotes. Ticks live in their own store (`hajjChk` → `us-hajj`, stamps in `ST.hlog`), so recording the Umrah never wipes them; the sticky *Now* strip follows Part 1 until the Umrah is recorded, then Part 2
- **The halq gate**: in Hajj mode the hair cannot be ticked until "What did you say at the miqat?" is answered — Tamattu' ticks as usual; Qiran / Ifrad replace Phase 4 with a locked *You stay in ihram* panel and swap the niyyah to the matching talbiyah. A soft hint on the intention row lists the three phrasings
- **Counter target table** `TM` — the tawaf counter writes to exactly one target per mode (Umrah tawaf → `riteChk.rounds` + `ST.log`; nafl → nothing; qudum / ifadah / wada → Part 2 + `ST.hlog`), so a Hajj tawaf can never overwrite the Umrah record; the mode segment shows only the modes that are due (qudum for Qiran / Ifrad before Arafah, ifadah from the 10th or once Arafah is ticked, wada after ifadah) and the coaching drops raml / idtiba' where they do not apply
- **Rami counter** (Counters, days 10–13): the day's jamarat in order, a 7-tap ring per jamarah with the takbir, a *Delegated* toggle per day, Focus mode, Problem? sheet with the Hajj troubleshooting answers; stored in `ST.rami[day][jamarah]`
- **Record completed Hajj** enables only with Arafah + rami of the 10th + tawaf al-ifadah + the sa'i of Hajj (unless a Qarin / Mufrid already did it) + tawaf al-wada or its exemption; it writes `us-hajjlog`, awards the *Hajji* badge, makes a Hajj keepsake card, clears the Hajj stores and switches the chip to *After Hajj*. *Start fresh* for Part 2 clears without recording

## v5.2.1 — Hajj mode: review fixes
- **Fiqh wording**: the four schools are named wherever they differ instead of one view being stated as *the* ruling — shortening prayers in Mina / Arafah (residents of Makkah by the Hanafi 15-day rule; for Shafi'is, by the 4-day rule together with staying on in Makkah after the Hajj; for Hanbalis, by staying on in Makkah after the Hajj), the stoning time for the weak who leave Muzdalifah early (Hanafis / Malikis: from Fajr), the dam for a day's rami delayed to the next day (Hanafis / Malikis), leaving Arafah before sunset (Malikis: the night is a pillar), the fidyah for an ihram violation done in forgetfulness, the first tahallul (Shafi'is and Hanbalis: two of three; Malikis: hunting stays forbidden and perfume is disliked until the ifadah), intimacy before Arafah (Hanafis), the fasting days of one without a hady (7th–9th for Hanafis / Hanbalis; tashriq days, Bukhari 1997–1998; Hanafis: the hady becomes owed), raml in the ifadah (Hanafis and Shafi'is), the gap between tawaf and sa'i (Malikis), the Maliki end of the talbiyah, ihram assumed late in Mina / Arafah (valid with a dam), tawaf al-ifadah done last counting as the farewell tawaf
- **Citations**: weak narrations are marked where used (Ibn Majah 3038 — delegation is permitted by all four schools; Ibn Majah 3012 — Uranah; Abu Dawud 1833; Tirmidhi 3585 marked hasan); Tirmidhi 885 replaced by Muslim 1218; the Muzdalifah takbir wording attributed to Ibn Mas'ud (RA); `HAJJ_D8` extended to 1455
- **Second tahallul** is announced only when the ticks say so (rami of the 10th + the cut + ifadah): `hajjSaiLeft()` / `tahallul2()` drive the sa'i completion copy, toast, hero, tips and big-counter panel; a Qarin / Mufrid's arrival sa'i is Part 1 in *umrah* mode — the phantom `qudum` counter mode is gone
- **The halq gate comes before the cut**: with the type unconfirmed (`halqUnconfirmed()`), the sa'i completion panel, toast, hero, big counter, walkthrough end and the Home CTA (`halqGateHome()`) all ask "what did you say at the miqat?" instead of "next: halq"; the Part 1 subtitle says *type unconfirmed until the halq step*
- **Trip-scoped Umrah**: `tripUmrahs()` (entries of `us-umrahlog` done on/after the departure date) replaces the lifetime count in `hajjPart2Active()`, Home and the chip — a returning pilgrim with earlier Umrahs is no longer told they are out of ihram. Part 2 also drives the Now strip on any calendar day of Hajj, with an *Umrah not recorded* nudge in Part 1
- **Counter safety**: `tmAuto()` moves the counter out of *umrah* mode (to *ifadah*, or *nafl* before the 10th) once the Umrah tawaf is done and the days of Hajj begin, so a Hajj tawaf can never be stamped as the Umrah or a reset delete its record (`ST.tmAuto` remembers the year); `umrah` leaves the mode segment then; in Hajj mode a sa'i after a nafl tawaf writes nothing; `goHajjCounter()` never opens another mode — it asks "stood at Arafah?" inline
- **Record Hajj** also needs the ihram of Hajj (Tamattu') and halq / taqsir; the other wajibs still unticked are listed (not blocking) so *Missed it?* can be read first; once this year's Hajj is recorded Home shows *Hajj completed* instead of the day card and Part 2 says *Hajj recorded* (from `us-hajjlog`, so it survives a reload); the trip-over state nudges to record a Hajj whose ticks are waiting; after the 13th an untouched ifadah comes before the farewell tawaf
- **Links & next journey**: an existing user opening `?dep=…&j=hajj` gets a confirm sheet (*Switch to it / Keep mine*), a past date gets a toast, `?dep=&j=hajj` opens the Hajj date screen; *Plan your next journey* clears post mode, the confirmed day, the shift and a past departure date (the date input opens empty, min = today)
- **Onboarding**: ✕ on the Hajj screen reached from the journey question (no date set) returns to Umrah, and the screen offers *← Umrah instead*; *I'm already in Saudi Arabia* retitles the sheet, hides the flight date and uses a −/+ stepper; Settings › Journey stage speaks the journey's language and routes a Hajji's *I'm in Makkah* to the already-there screen
- **Touch targets**: the *Today is 9 Dhul Hijjah, correct?* row is three full-width ≥ 44 px text buttons (*◀ One day earlier · ✓ Yes · One day later ▶*) and its toast speaks from the pilgrim's side; Part 2's *Missed it? / Delegated / Open counter* chips are 44 px buttons; rukn / wajib / sunnah pills are legible; segment buttons are 40 px; the rami counter asks before counting a jamarah out of order; the Home CTA skips the informational *sunnah order* row (`info:true`)

## Releasing an update
The service-worker cache is named after `APP_VERSION`. For every release **bump `APP_VERSION` in both `app.js` and `sw.js`** — installed apps then pick the new version up automatically (an "Update" chip appears in the header; Settings › Check for updates forces a check). The app shell is served stale-while-revalidate, so it opens instantly from cache regardless of signal.

## v4.14 — Home
- **Dashboard once onboarded** — the landing page (hero, 5 full stages, FAQ) is shown only on first launch; afterwards Home opens with a one-line brand strip (+ install prompt), the personal status card, then your prayer line, quick tools and cards. The 5 stages become compact rows with only the current one expanded; the numbers, FAQ and share card fold into an **About this app** section
- **The CTA is your real next action** — on trip, before this trip’s Umrah is recorded, it follows the rites (Begin ihram → Start / Resume tawaf (n/7) → 2 rakahs, Zamzam, then sa’i → Halq / taqsir); for planners it names the first overdue / this-week item from the timeline
- **Resume where you left off** — reopening the app within 4 h of an interrupted tawaf or sa’i lands straight in the big counter; the header chip shows `🕋 Tawaf 3/7` (or `Tawaf ✓ · sa’i`) and a **Continue** card on Home resumes the count (with a Reset link), or an unfinished day log, or today’s flashcard
- **📌 Do next** for planners — up to 3 timeline rows (overdue → this week → coming up; the travel-blocking basics when no date is set) plus the next unpassed quiz level, tickable from Home with Undo
- **Stage-aware quick tools** — on trip: Counters, Rites, Qibla, Tasbih, Duas, Places, 🚕 Driver, 🆘 Help (full-screen card with 911 · 937 · 1966 · 930 and the meeting point), Prayer times; before: Itinerary, Flashcards, Documents, Rites, Duas, Places, Kids, Quiz, Hotel; after: Habits, Reflections, Duas, Tasbih, Places, Flashcards
- **Next prayer** counts down only while you are in the Haramain; elsewhere it shows the prayer time with the Makkah clock (“Fajr at 05:12 · Makkah time now 16:19”) and a cached / computed hint
- Copy: full 100,000-prayers wording with its citation, “Halq/Taqsir (shave or trim)”, greeting and date on separate readable lines

## v4.13 — Places
- **Opens where you are**: the city pill is seeded from your prayer city and remembered; **Near me** switches to the city you are standing in, orders groups by distance and reads as a clearable state; distances say *inside the Haram*, *≈ 350 m · 5 min walk* or *you're here*
- **Nothing resets under you**: marking a place visited patches the card in place (from the 44 px icon, storing *Visited · Day N*); routes and open cards survive filter, Near me and hotel changes
- **Hotel per city**: GPS when you are there, a landmark picker (Clock Tower, King Abdulaziz Gate, Jarwal… Bab as-Salam, Qiblatayn Rd, Quba Avenue…) when you are not, ✕ per city, labelled by name never coordinates — shared with the Prepare hotel card and the group link
- **Route planner v2**: a start-point prompt instead of a dead end, non-visitable sites (Namirah, Abu Qubays, al-Bay'ah) excluded, Hajj sites as one half-day taxi line with its own Maps link, climbs left out by default (*Include climbs*), ⚠️ access tags on routed stops, per-stop *≈ km · 🚶 min*, total km + time, walking mode when every leg is short, **＋ Route** shortlist (*Your route*, persisted), Visited toggles per stop, Clear and **Share route**
- **Access tags** (👤 Men enter · 🕐 After Fajr & Asr · 🌸 Sisters: salam from outside · 🎫 Free Nusuk permit · 🥾 45–90 min climb · 📅 Arafah day only) on the collapsed header; a *Get the free Rawdah permit on Nusuk* link; the Madinah itinerary tells sisters to give salam at the Baqi' gate
- **Arabic names** on all 51 sites (as a driver reads them) with a per-place **🚕 Show driver** card that works offline — the same overlay the hotel card uses; coordinates added to the 13 sites that lacked them
- **Hero**: per-city visit counts (no ring, no percentage), a *Nearest unvisited* chip that opens the card, and the three-mosques hadith framed as "ziyarah is a virtuous extra, never a rite"
- **Navigation**: short jump chips with a right-edge fade, the city pills stick under the header, Hajj / Museums / Day trips and Bus stops fold into counted sections (Makkah drops from 29 to 14 visible rows), the hop-on hop-off card is a collapsed row with tappable stops placed right before the bus-stop group

## v4.5 — global polish
- Deep links everywhere: `goTab(tab, sub, anchor)` lands on the exact card (Qibla, Tasbih, Itinerary, Vault, Cards, After-Umrah…); `openPlace(id)` opens a place card from any cross-reference; checklist items carry "Open →" chips; itinerary site names are tappable
- Post-Umrah mode has its own **After** section (first in More) and a one-tap "Back home? Start the habit keeper" card on Home when the trip is over
- Full-screen **dua reader** (tap any dua — library or inline rite duas) with Listen and prev/next, screen kept awake
- Onboarding: captures the departure date, city/day/trip length for pilgrims already there, "I've been before" (earlier Umrahs counted in totals), and can be re-run from Settings without touching data
- Share: QR code overlay, briefing-ready share message with the group's date, and `?dep=YYYY-MM-DD` links that pre-set the departure date
- Certificates, keepsakes and progress cards go through the OS share sheet (or an in-app preview with press-and-hold) so they reach Photos on iOS PWAs
- Backup now covers every `us-` key; reset is a two-step sheet with "Export backup first" and also clears the vault
- Accessibility: pinch-zoom allowed, Normal/Large text size, bigger nav labels, better contrast, keyboard & screen-reader roles on rows, steps, counters and switches, live regions for counters and quiz feedback
- Swipe between sections is stricter (no accidental switches), discoverable (first-time tip + pill nudge) and can be turned off

## v4.6 — Prepare
- **Countdown first**: with no date set, a single "Set my departure date" card sits at the top of Prepare (the timeline stays hidden until then); a **return date** next to it drives the trip length
- **Intention** collapses to one row once written (tap to re-read / edit); a **jump bar** under the hero reaches every part of Prepare (trip-time cards first while on trip)
- **Timeline**: "Should already be done" is capped and ordered with travel-blocking items (passport, visa, MenACWY, flights, hotels) in red first; ticking a row offers **Undo**; category tiles open exactly their checklist
- **Brother / Sister profile** (onboarding + Settings): men-only / women-only packing and rite steps are shown and counted only for you; sisters get scissors for taqsir, sanitary supplies, hijab pins and a period-medication prompt
- **Travelling with children**: an optional checklist (passports, visas, MenACWY, boys' ihram, stroller vs carrier, medicines, ID wristband, briefing) that joins the timeline and tiles
- **Hotel & SOS**: meeting point and companion / group-leader fields; an offline **"I'm lost — show this"** card (Arabic + English, big tel: links, hotel, meeting point, 911 / 1966); the driver card can now **Call hotel** and **Open in Maps**; reachable from Umrah › Counters, Daily › Today (trip card) and a Home quick tool
- **Itinerary**: a 1-day leg never drops the Umrah; today's day is highlighted and shown on Daily › Today; **Family pace** (later Umrah, one site a day, midday rest); every day is editable; **Share itinerary** as text
- **Group tools**: "Share trip setup with group" sends one `#g=` link that applies dates, itinerary, prayer city and the hotel card on each phone without touching anyone's progress; "Share my readiness" posts a one-message checklist summary

## v4.7 — Learn
- **Reading path mirrors the quiz**: an "Umrah in 4 steps" index (ihram → tawaf → sa'i → halq, each tile opens that phase of the rites guide) sits first, then Know before you go (*Start here*), fiqh Q&A, History, Virtues, Madinah, a new **For sisters** section, scams — and a closing "Test what you learned" card that starts the next unlocked quiz level (or the mistakes drill)
- **For sisters**: ihram clothing (Bukhari 1838, Abu Dawud 1833), pace and talbiyah, exiting ihram (Abu Dawud 1984), what to do when a period starts (Bukhari 305, 1757), women's areas and the Rawdah, Baqi'/Uhud, safety — in one place
- **Search Learn** across every topic (a single match opens itself); each section shows its topic count and reading time; accordions toggle from the header only and are keyboard/screen-reader accessible
- **Flashcards v2**: cards are built from the quiz questions (options shown on the back) plus every reading section; your quiz mistakes come first, then — inside 28 days of departure — the ihram/tawaf levels and the essentials. First session is 5 cards, then 12; grading appears only after the reveal; honest end-of-session copy with a "Next" action

## v4.8 — Quiz
- **The list answers "what next?"**: one gold *Continue → Level N* button under the meter (or *Review N mistakes* / *Download my certificate* once the circuit is done), the current level outlined in gold, a "questions correct in your best runs" line, per-level "· k to review" counts and a *📚 study* link on every open level
- **Nothing is lost**: leaving the tab, ticking a checklist item or reloading no longer wipes a running level — the list shows *▶ Resume Level 3 · Q6/11* with a Discard option
- **Pass mark as a number**: every row says *pass = 9 correct*; the question header counts *5 ✓ · 4 more to pass* (and tells you honestly when the pass is out of reach); the fail screen says *you got 7 — you need 9 of 11*
- **Fail → study → re-drill**: the fail screen lists the questions you missed and offers *Study this level* (jumps to the Learn card that teaches it; Level 3 also opens the rites guide), *Review the N I missed* and Retake; the pass screen starts the next level in one tap (certificate on the final one)
- **Retakes shuffle** the answer options every time (True/False excepted) and the question order on a passed level
- **Gating for veterans**: a locked row explains the gate and offers *Unlock all levels*; post-Umrah mode and any Umrah on record open every level automatically; the certificate still requires every level at 80%
- **Kids corner** moved above the circuit as a one-row card (shuffled 8-question quiz with *🔊 Read it to me*, spoken feedback and a Done button) plus **Story time** — five read-aloud stories for ages 6–10 (Ibrahim & Isma'il build the Kaaba · Hajar and Zamzam · the Year of the Elephant · young Muhammad ﷺ and the Black Stone · why everyone wears white), each with its source cited and a "tell it when…" hint, reachable from *Story for the kids* chips on the ihram, Black Stone and Safa steps and a *Kids quiz* chip on Home

## v4.9 — Counters
- **Live hero**: the Counters screen now answers "where am I in the Umrah right now" — Ready to begin → Next: Tawaf → Tawaf · round N of 7 → Next: Sa'i → Sa'i · lap N → Next: Halq → Taqabbal Allah — with a stamped stage strip (Ihram ✓ 14:02 · Tawaf ✓ 38 min …) and a ring that fills 25% per rite
- **One big ring per moment**: the rite you are not doing collapses to a one-line summary with *Show*; the tab opens on the active counter; the hero and wudu card shrink once counting begins
- **Coaching that matches your feet**: tips describe the round you are *in* ("Now: round 3 of 7 · Last raml round for men"), round 7 and lap 7 have their own lines, sa'i always says which hill you are on, and every line states the men/women difference (raml, jogging, shoulders, halq vs trim)
- **Hand-offs at 7/7**: a *Between tawaf and sa'i* strip (2 rakahs · Zamzam · Safa dhikr, ticked straight into the rites checklist) with *Start Sa'i →*; sa'i's 7/7 points to halq and, once cut, offers *Record this Umrah* — in the big counter too, with the wake lock released at 7
- **Counters feed the checklist**: 7 rounds / 7 laps tick the rites steps; the steps carry a live "3 / 7 rounds · Open counter" chip; each counter card links to its steps & duas
- **Trustworthy taps**: a second tap within 800 ms is ignored, every tap toasts the new count, Undo is a full-width 56 px button under the ring, Reset is a low-emphasis link behind a confirmation sheet
- **Nafl tawaf mode**: Umrah tawaf | Nafl tawaf switch (auto: nafl after recording an Umrah, Umrah when you tick the intention); nafl tips have no raml/idtiba', nothing is stamped on the Umrah timeline, and 7/7 offers *Log nafl tawaf #N today · Count another*, which shows as a ×N badge in Daily, counts in the km estimate and on the progress card
- **Wudu**: the card shows *✓ Wudu made · 21:14* / *Not yet — tap to confirm* and toggles from anywhere on it; the gate is a sheet with two big buttons instead of `confirm()`; a wudu chip in the big counter answers "my wudu broke in round 5" in place (rounds are kept); a counter reset never clears wudu; sa'i stays ungated
- **Duas where you count**: the Yamani-corner dua sits under the tawaf ring and the Safa/Marwah dhikr under the sa'i ring; the big counter has a fixed dua strip outside the tap zone (tap for meaning) and a *My duas* sheet that never touches the count; "screen stays awake" is shown only once the wake lock is actually held
- **For sisters**: a *Period started? Your ihram is still valid* line under the wudu card opens the ruling (Bukhari 305) with what to keep doing and who to ask before flying

## v4.10 — Steps & duas
- **You are here**: a sticky *Now · step 9 of 17* strip under the Umrah segment names the next unticked step with a ✓ Done button (or *Umrah complete — record it*); opening Steps unfolds only the phase you are in, finished phases fold to *✓ done*, chips carry global numbering (*steps 6–12*, *3/7*); the first counted round ticks wudu + the Black Stone start
- **Reading order = doing order**: Phase 2 is wudu → idtiba' → Black Stone (with *Bismillahi wallahu akbar*) → Yamani corner → 7 rounds → 2 rakahs → Zamzam (with the Zamzam dua); Phase 3 is Safa (with *Innas-Safa wal-Marwah…*) → Marwah → 7 laps; recurring duas carry an *↻ every round / every lap* pill; the optional conditional intention (ishtirat, Bukhari 5089) sits under the niyyah; a ✈️ *Flying?* callout links to the miqat article
- **Safe ticking**: ticking dims only the title (the dua stays readable), toasts *tap again to undo*, and un-ticking removes the step's stamp; a counter reset removes its stamps; *↺ Start fresh (nothing recorded)* clears rehearsal ticks without recording an Umrah, and the timeline flags ticks older than a day
- **▶ Walk me through it**: a one-step-at-a-time overlay (step n of N, why, duas with audio, live count + *Open counter* on the tawaf/sa'i steps, *✓ Done → Next*), and a **🖨️ Print / save PDF** briefing sheet (rites + duas, packing list, emergency numbers, hotel card)
- **Closing the loop**: Phase 4 ends in a completion block with the gold *Record completed Umrah* button (pulses once the hair is cut) and, after recording, *🎴 Keepsake* / *📿 Log today's worship*; the mataf schematic now opens under Phase 2 with legible labels and a Hijr Isma'il warning
- **🆘 If something goes wrong**: lost count · wudu broke · resting · forbidden by mistake (Bukhari 1536) · upper floors · talking · menses · missed the miqat — under Phase 4, inside the Learn Q&A and behind a ⚠️ *Problem?* chip in the big counter
- **Audio**: one Arabic voice picked up front, a *⏹ Stop* playing state, and an honest toast when the device has no Arabic voice (with a test button in Settings); a children's fiqh entry and a 🧒 note at the top of Tawaf; the Umrah tab opens on Steps before departure and on Counters once flying

## v4.11 — Daily
- **The day is right by itself**: Day N follows the departure date (Day 1 = arrival) at boot, on return to the app and at midnight; a deliberately parked day gets a *Today is Day N — switch* pill instead; ◀ ▶ still work (a past/ahead day is labelled), the heatmap is a day picker, the journey chip and Home agree, and departure day has its own Home phase
- **Checklist first**: the day nav lives inside the hero with the real date + Hijri date; prayer times are a one-line strip (*Fajr in 1h 12m · 05:12 · Makkah* + 🔔) that expands to the grid, city pills, meeting point and *Share today's times*; streak tiles moved below the checklist under a *Streaks · consecutive days* header, read *3d*, and open their row
- **Prayer times that never dead-end**: the Umm al-Qura month is fetched once for both cities (current + next) and cached per day; a solar computation (Fajr 18.5°, Dhuhr = noon + 1, Asr factor 1, Isha = Maghrib + 90 / +120 in Ramadan) is the always-present baseline, verified within ±2 min; the note says *live*, *cached* or *Computed · follow the adhan*, with *Duha from ~HH:MM*
- **One system, not five counters**: prayer tiles tick the salah rows (✓ badges sync both ways); the tasbih counts each phrase — 100× istighfar / salawat tick their rows and stop auto-advancing; a visited ziyarah site logs today's ziyarah; the dua list has a *Went through my list today?* tick; tools are compact chips *after* the tick rows (built-in ones first, external ones marked *needs internet*)
- **Honest numbers**: progress honours the point weights (points pills gone, *Priority* on the 15-pt rows); salah rows run in the order of the day (tahajjud → Fajr → morning adhkar → Duha → Dhuhr → Asr → evening adhkar → Maghrib → Isha); Friday's Dhuhr is *Jumu'ah* with a 60-min reminder lead; ◀/▶ disable at the ends and the last day offers Stats / Post-Umrah habits
- **For sisters**: *🌸 Excused today* — salah, tahajjud, duha and nafl tawaf drop out of the day's total (100% stays reachable), streaks pause instead of breaking, the heatmap marks the day, the hero links the ruling (Bukhari 305)
- **For children**: *Kids' day* — one row per child with five big tiles (prayed with us · Zamzam + dua · SubhanAllah ×10 / talbiyah · patient in the crowd · learned one thing), confetti and a ⭐ for 5/5, a *Little Pilgrim* badge for three full days; names are added in Kids corner; nothing touches the adult points
- **Group timing**: meeting point (shared with the hotel/lost cards, echoed in Home's prayer strip), *leave hotel 30/45/60 min before*, *Share today's times* as one message; **calendar export** — a week of prayer alerts as .ics (TZID Asia/Riyadh, 20-min alarms, 60 for Jumu'ah) via the share sheet or download

## v4.12 — Daily › Tools & Stats
- **Tools in the order you need them**: a jump row (Tasbih · Qibla · Water · Duas) and, once flying, the tasbih and compass move to the top; the dua list becomes a collapsible section (shut by default in-trip once it has entries) with a *3/7 asked* count in its header
- **Dua list that lasts the trip**: starter chips for an empty list (parents, forgiveness, shifa, spouse, family, the Ummah, husn al-khatimah, Hajj), *Untick all — new round* after a round of asking, and an **Undo** toast on delete
- **Tasbih that counts like a pilgrim**: pickable targets 33 · 34 · 100 · 1000 · ∞; the post-salah chain runs SubhanAllah 33 → Alhamdulillah 33 → Allahu Akbar 34 and stops, every other phrase/target keeps counting past the mark; a **−1** for mis-taps; the live cycle survives a reload; a full-screen **Focus** mode (giant number, Arabic of the phrase, wake lock, Undo)
- **Qibla compass that starts on iPhone**: motion permission is requested inside the tap, the sensor listener is registered up front, the button toggles Start/Stop and the sensors are released on leaving Tools; without location, Madinah offers *Use Madinah (approx. 176°)* and Makkah explains why a fixed bearing would mislead
- **Water card does one thing**: *Zamzam & water* with *X cups today · aim for 8, 10–12 in summer heat* (8 is a floor, not a cap); the km estimate and the trip's Zamzam total moved to Trip stats
- **One scoreboard**: Trip stats add Fajr streak, nafl tawafs, dhikr counted, duas asked, walked in worship (est.) and Zamzam cups; an empty Stats tab points to Today instead of a wall of zeros and holds the share card back until there is something to share
- **Achievements that say how**: locked badges show progress (*2/3* + a bar) and, on tap, how to earn them

## Development & testing

```
npm install            # playwright-core only
npm test               # end-to-end smoke suite (400+ checks) in headless Chromium
```
Set `CHROME=/path/to/chromium` if Playwright cannot find a browser. Content lives in `data.js` (places, quiz, knowledge, duas); logic in `app.js`.

## Tech

Mobile-first vanilla HTML/CSS/JS, zero build step, zero dependencies (Google Fonts only, with system fallbacks), light & dark themes.

**Design (6.3, aubergine).** The Home status card sets the language for the whole app: lilac-grey paper with white cards and violet-tinted hairlines by day, an aubergine-black page with deep aubergine cards by night. Every moment (heroes, the tap-ring counters, the floating pill nav, focus mode, toasts and the primary buttons) is the card's aubergine object: a near-black violet gradient with a fine lavender edge, a soft violet halo and lavender progress. Manrope is the only Latin face, with a light 300 for the big numerals, and Scheherazade New carries the Arabic; violet is kept for links, progress and small marks, and green means done. Since 6.3.1 every hero (Prepare, Counters, Today, Stats, Places, After) speaks the card's grammar: a lavender kicker, one light numeral, hairline label-over-value metrics, the four-rite bar and the glass pill with a go-disc; ticked rows keep full contrast, and no colour emoji or sparkle is drawn anywhere.

---

*May Allah invite you to His House and accept your Umrah.* 🕋
