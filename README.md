# 🕋 Umrah Strivers

**The Journey of a Lifetime** — plan, learn, perform and track your Umrah. The sister app to [Ramadan Strivers](https://www.ramadanstrivers.com/).

An offline-first web app (`index.html` + `data.js` + `app.js`, zero build step). No accounts, no servers, no tracking — all data stays on your device, with export/import backup and an encrypted document vault.

## Features

### 🧳 Plan — before you fly
- **Departure countdown** with a live day counter and typical Makkah/Madinah temperatures for your travel month
- **"What to do when" timeline** — every checklist item has an ideal lead time; from your departure date the app shows what's overdue, due this week, and coming up
- **Readiness tiles** per category (documents, packing, health, knowledge)
- **Hotel & emergency card** — save your hotel; a full-screen "Show to driver" page in Arabic + English; Saudi emergency numbers (911, 937, 1966, 930)
- **Preparation checklists** — documents & bookings (Nusuk visa, Rawdah permit), packing (ihram, unscented toiletries…), health (Meningitis ACWY certificate, walking training), and knowledge & spiritual prep
- **Knowledge Hub** — six study sections: **History & significance** (the Kaaba, Hajar & Zamzam, the Black Stone, Hira, the Year of the Elephant, the Kaaba's rebuilds, the talbiyah's meaning, the qibla change, the Hijrah & conquest), **Virtues of Umrah & the Haram** (sin expiation, poverty removal, guests of Allah, the Prophet's ﷺ own four Umrahs, 100,000× prayers, Zamzam), a dedicated **Madinah section** (1,000× prayers, the Rawdah, greeting the Prophet ﷺ, the sanctuary, Quba, Uhud, Ajwa), a **fiqh Q&A** (badal Umrah, wudu breaking mid-tawaf, menstruation, wheelchair tawaf, traveller's prayer…), and the practical **Know Before You Go** topics (miqats, ihram rules, how to wear the ihram, Nusuk, transport, common mistakes) and a **For sisters** section
- **Knowledge circuit quiz** — 7 unlockable levels, ~75 true/false & multiple-choice questions with referenced explanations; score 80% to unlock the next level and complete the circuit before you fly
- **Every hadith citation verified** against its collection (Bukhari, Muslim, Tirmidhi, Ibn Majah, Nasai, Abu Dawud) — paraphrases marked, weak-hadith claims avoided
- **Daily knowledge flashcards** — spaced repetition (1/3/7-day boxes) over the whole knowledge hub, paced for the run-up to departure
- **Donation & scam awareness** — 10 guides to the common rip-offs: fake packages & visas, badal-Umrah traps, Nusuk phishing, "VIP access" touts, street begging gangs, QR-code "sadaqah", prize scams — with the official alternatives (umrah.nusuk.sa, Ehsan) and how to report (911 / care line 1966)
- **Kids corner** — an 8-question big-button mini quiz with stars and read-aloud, plus five story-time tales for ages 6–10, so children prepare too
- **Quiz upgrades** — "Review my mistakes" mode re-drills only the questions you got wrong; completing the 7-level circuit unlocks a downloadable **certificate**

### 🕋 Umrah — during the rites
- **Step-by-step rites checklist** across 4 phases: Ihram at the miqat → Tawaf → Sa'i → Halq/Taqsir, with the key duas inline (Arabic, transliteration, translation)
- **Tawaf counter & Sa'i counter** — big tap targets, round-by-round coaching, an accidental-tap guard, a nafl-tawaf mode and a full-screen big counter with the rite's dua, so you never lose count mid-round
- **Multiple Umrahs** — record a completed Umrah and reset the steps for the next one (ihram from Masjid Aisha / Tan'eem)

### 📿 Daily — maximise every day in the Haramain
- Daily worship tracker: five prayers in congregation, tahajjud, Quran, dhikr & dua, nafl tawaf, sadaqah, serving pilgrims…
- Points, streaks (Fajr jama'ah, tahajjud, Quran, nafl tawaf), a trip consistency heatmap, trip stats and 8 unlockable achievements
- Configurable trip length (3–30 days) — or set a return date next to the departure date

### 📍 Places — ziyarah with purpose
- **51 sites** across Makkah (29) and Madinah (22), grouped — Makkah: The Haram · Ziyarah · The Hajj sites · Museums & culture · Day trips; Madinah: The Prophet's Mosque & around · Historic mosques · Battlefields, wells & history · Hop-on hop-off & practical
- Every site has its historical significance (with verified Quran/hadith references where applicable), an etiquette/practical tip, a **one-tap Google Maps** button, and a "visited" tracker; search box across all sites
- **Madinah Hop-On Hop-Off card** — all 12 City Sightseeing stops (Red history loop, Green Haram loop) with route-coloured chips, a booking link, and stop badges on the matching places
- New Makkah sites include Hijr Isma'il & Maqam Ibrahim, Zamzam, the Mas'a, the Prophet's ﷺ birthplace, Jabal Abu Qubays, Masjid ar-Rayah, Ji'ranah, Hudaybiyyah, Namirah, al-Mash'ar, al-Khayf, al-Bay'ah, the Jamarat, the Hira Cultural District, the Kiswah factory, Makkah Museum, Ta'if and historic Jeddah; new Madinah sites include Bab as-Salam, Al Manakha, the Quran & Seerah museums, Masjid al-Jumu'ah, al-Ijabah, al-Miqat (Abyar Ali), Wadi al-Aqiq, Bir Uthman, Salman's garden, the Hijaz Railway, Quba Avenue and the practical stops

### 🕌 Live tools
- **Audio duas** — tap 🔊 on any dua (rites steps and the library) to hear the Arabic recited via speech synthesis
- **Prayer reminders** — opt-in local notifications ~20 minutes before each prayer while the app is open (no server, no push backend)
- **Post-Umrah mode** — a 30-day, 3-habit keeper (prayers on time, daily Quran, daily dhikr) plus a reflections journal, so the journey's change sticks
- **Prayer times** for Makkah & Madinah (Umm al-Qura method) with next-prayer countdown and Hijri date — cached for offline use
- **Qibla compass** — device compass points a 🕋 needle at the Kaaba from anywhere (with a degrees-from-North fallback)
- **Digital tasbih** — six dhikr phrases, 33-count cycles with haptics, daily totals that auto-tick your checklist at 100
- **Offline PWA** — service worker caches the app shell; installable from the browser with an in-app install button

### ⚙️ More
- Essential duas library (talbiyah, tawaf, sa'i, Zamzam, travel…)
- Resources: Nusuk, Haramain High-Speed Rail, Tarteel, Sunnah.com
- Dark/light theme, backup export/import, full reset

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F4arhan%2FUmrah-strivers)

Or manually, in about a minute:

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (with GitHub).
2. **Import** the `4arhan/Umrah-strivers` repository.
3. Leave everything default (Framework Preset: **Other**, no build command, no output directory) and hit **Deploy**.
4. Done — you get `umrah-strivers.vercel.app` (rename in Project Settings → Domains, or attach a custom domain).

Every push to the production branch auto-deploys. A `vercel.json` is included with sensible security headers.

## Running locally

It's one file — just open `index.html` in a browser. Installable to the home screen as a PWA-style app.

## v4.0 — Home, during-Umrah tools, planning tools
- **Home dashboard** — greeting with Hijri date, your journey phase with a progress ring and next-step CTA, next prayer countdown, 9 quick actions, today's flashcard, daily quote
- **Focus mode** for the Tawaf/Sa'i counters — full-screen giant tap zone, screen kept awake (Wake Lock), round-by-round coaching
- **Umrah timeline & keepsake** — ihram, tawaf, sa'i and halq are time-stamped automatically; every recorded Umrah gets a downloadable keepsake card with durations
- **Mataf schematic** — where the Black Stone line, Hijr, Maqam, Multazam, Yamani corner, Zamzam and the Safa exit are
- **"Why?" explainers** on every rite step — the evidence behind each action (verified references)
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

## Releasing an update
The service-worker cache is named after `APP_VERSION`. For every release **bump `APP_VERSION` in both `app.js` and `sw.js`** — installed apps then pick the new version up automatically (an "Update" chip appears in the header; Settings › Check for updates forces a check). The app shell is served stale-while-revalidate, so it opens instantly from cache regardless of signal.

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
- **Kids corner** moved above the circuit as a one-row card (shuffled 8-question quiz with *🔊 Read it to me*, spoken feedback and a Done button) plus **Story time** — five read-aloud stories for ages 6–10 (Ibrahim & Isma'il build the Kaaba · Hajar and Zamzam · the Year of the Elephant · young Muhammad ﷺ and the Black Stone · why everyone wears white), each with a verified source and a "tell it when…" hint, reachable from *Story for the kids* chips on the ihram, Black Stone and Safa steps and a *Kids quiz* chip on Home

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

## Development & testing

```
npm install            # playwright-core only
npm test               # end-to-end smoke suite (~90 checks) in headless Chromium
```
Set `CHROME=/path/to/chromium` if Playwright cannot find a browser. Content lives in `data.js` (places, quiz, knowledge, duas); logic in `app.js`.

## Tech

Mobile-first vanilla HTML/CSS/JS, zero build step, zero dependencies (Google Fonts only, with system fallbacks). Design system: desert emerald & gold, Fraunces + Inter, SVG progress rings, floating pill navigation, tap-ring counters, light & dark themes.

---

*May Allah invite you to His House and accept your Umrah.* 🕋
