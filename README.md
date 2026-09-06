# 🕋 Umrah Strivers

**The Journey of a Lifetime** — plan, learn, perform and track your Umrah. The sister app to [Ramadan Strivers](https://www.ramadanstrivers.com/).

A single-file, offline-first web app. No accounts, no servers, no tracking — all data stays on your device (localStorage), with export/import backup.

## Features

### 🧳 Plan — before you fly
- **Departure countdown** with a live day counter
- **Preparation checklists** — documents & bookings (Nusuk visa, Rawdah permit), packing (ihram, unscented toiletries…), health (Meningitis ACWY certificate, walking training), and knowledge & spiritual prep
- **Knowledge Hub** — five study sections: **History & significance** (the Kaaba, Hajar & Zamzam, the Black Stone, Hira, the Year of the Elephant, the Kaaba's rebuilds, the talbiyah's meaning, the qibla change, the Hijrah & conquest), **Virtues of Umrah & the Haram** (sin expiation, poverty removal, guests of Allah, the Prophet's ﷺ own four Umrahs, 100,000× prayers, Zamzam), a dedicated **Madinah section** (1,000× prayers, the Rawdah, greeting the Prophet ﷺ, the sanctuary, Quba, Uhud, Ajwa), a **fiqh Q&A** (badal Umrah, wudu breaking mid-tawaf, menstruation, wheelchair tawaf, traveller's prayer…), and the practical **Know Before You Go** topics (miqats, ihram rules, Nusuk, transport, sisters' notes, common mistakes)
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

## UI (v3.1)
- **Segmented sub-navigation** inside every tab (Plan: Prepare · Learn · Quiz; Umrah: Counters · Steps; Daily: Today · Tools · Stats; More: Guide · Duas · Settings) — sticky under the header, remembered per tab
- **First-launch onboarding sheet** — "Where are you on your journey?" jumps you to the right screen and captures your name for the certificate
- **Journey chip** in the header — days to departure, current trip day, or post-Umrah state — tap to jump
- Confetti celebrations, animated count-ups on progress rings, skeleton loading for prayer times, places search
- **v3.3 screen-by-screen polish** — gold departure countdown card, jump-chips on the long Learn and Places pages, compact tap-to-expand place cards, round-by-round guidance under the Tawaf/Sa'i counters, wrapped tasbih phrases, name + share-the-app in Settings

## Tech

Mobile-first vanilla HTML/CSS/JS, zero build step, zero dependencies (Google Fonts only, with system fallbacks). Design system: desert emerald & gold, Fraunces + Inter, SVG progress rings, floating pill navigation, tap-ring counters, light & dark themes.

---

*May Allah invite you to His House and accept your Umrah.* 🕋
