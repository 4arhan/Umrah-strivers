# 🕋 Umrah Strivers

**The Journey of a Lifetime** — plan, learn, perform and track your Umrah. The sister app to [Ramadan Strivers](https://www.ramadanstrivers.com/).

An offline-first web app (`index.html` + `data.js` + `app.js`, zero build step). No accounts, no servers, no tracking — all data stays on your device, with export/import backup and an encrypted document vault.

## Features

### 🧳 Plan — before you fly
- **Departure countdown** with a live day counter and typical Makkah/Madinah temperatures for your travel month
- **"What to do when" timeline** — every checklist item has an ideal lead time; from your departure date the app shows what's overdue, due this week, and coming up
- **Readiness tiles** per category (documents, packing, health, knowledge)
- **Budget planner** — per-person costs × travellers, in your currency, saved on device
- **Hotel & emergency card** — save your hotel; a full-screen "Show to driver" page in Arabic + English; Saudi emergency numbers (911, 937, 1966, 930)
- **Preparation checklists** — documents & bookings (Nusuk visa, Rawdah permit), packing (ihram, unscented toiletries…), health (Meningitis ACWY certificate, walking training), and knowledge & spiritual prep
- **Knowledge Hub** — five study sections: **History & significance** (the Kaaba, Hajar & Zamzam, the Black Stone, Hira, the Year of the Elephant, the Kaaba's rebuilds, the talbiyah's meaning, the qibla change, the Hijrah & conquest), **Virtues of Umrah & the Haram** (sin expiation, poverty removal, guests of Allah, the Prophet's ﷺ own four Umrahs, 100,000× prayers, Zamzam), a dedicated **Madinah section** (1,000× prayers, the Rawdah, greeting the Prophet ﷺ, the sanctuary, Quba, Uhud, Ajwa), a **fiqh Q&A** (badal Umrah, wudu breaking mid-tawaf, menstruation, wheelchair tawaf, traveller's prayer…), and the practical **Know Before You Go** topics (miqats, ihram rules, how to wear the ihram, Nusuk, transport, sisters' notes, common mistakes)
- **Knowledge circuit quiz** — 7 unlockable levels, ~75 true/false & multiple-choice questions with referenced explanations; score 80% to unlock the next level and complete the circuit before you fly
- **Every hadith citation verified** against its collection (Bukhari, Muslim, Tirmidhi, Ibn Majah, Nasai, Abu Dawud) — paraphrases marked, weak-hadith claims avoided
- **Daily knowledge flashcards** — spaced repetition (1/3/7-day boxes) over the whole knowledge hub, paced for the run-up to departure
- **Donation & scam awareness** — 10 guides to the common rip-offs: fake packages & visas, badal-Umrah traps, Nusuk phishing, "VIP access" touts, street begging gangs, QR-code "sadaqah", prize scams — with the official alternatives (umrah.nusuk.sa, Ehsan) and how to report (911 / care line 1966)
- **Kids corner** — an 8-question big-button mini quiz with stars, so children prepare too
- **Quiz upgrades** — "Review my mistakes" mode re-drills only the questions you got wrong; completing the 7-level circuit unlocks a downloadable **certificate**

### 🕋 Umrah — during the rites
- **Step-by-step rites checklist** across 4 phases: Ihram at the miqat → Tawaf → Sa'i → Halq/Taqsir, with the key duas inline (Arabic, transliteration, translation)
- **Tawaf counter & Sa'i counter** — big tap targets, progress dots, haptic feedback, so you never lose count mid-round
- **Multiple Umrahs** — record a completed Umrah and reset the steps for the next one (ihram from Masjid Aisha / Tan'eem)

### 📿 Daily — maximise every day in the Haramain
- Daily worship tracker: five prayers in congregation, tahajjud, Quran, dhikr & dua, nafl tawaf, sadaqah, serving pilgrims…
- Points, streaks (Fajr jama'ah, tahajjud, Quran, nafl tawaf), a trip consistency heatmap, trip stats and 8 unlockable achievements
- Configurable trip length (3–30 days)

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

## Development & testing

```
npm install            # playwright-core only
npm test               # end-to-end smoke suite (32 checks) in headless Chromium
```
Set `CHROME=/path/to/chromium` if Playwright cannot find a browser. Content lives in `data.js` (places, quiz, knowledge, duas); logic in `app.js`.

## Tech

Mobile-first vanilla HTML/CSS/JS, zero build step, zero dependencies (Google Fonts only, with system fallbacks). Design system: desert emerald & gold, Fraunces + Inter, SVG progress rings, floating pill navigation, tap-ring counters, light & dark themes.

---

*May Allah invite you to His House and accept your Umrah.* 🕋
