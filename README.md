# 🕋 Umrah Strivers

**The Journey of a Lifetime** — plan, learn, perform and track your Umrah. The sister app to [Ramadan Strivers](https://www.ramadanstrivers.com/).

A single-file, offline-first web app. No accounts, no servers, no tracking — all data stays on your device (localStorage), with export/import backup.

## Features

### 🧳 Plan — before you fly
- **Departure countdown** with a live day counter
- **Preparation checklists** — documents & bookings (Nusuk visa, Rawdah permit), packing (ihram, unscented toiletries…), health (Meningitis ACWY certificate, walking training), and knowledge & spiritual prep
- **Know Before You Go** — the 5 miqats, ihram prohibitions, Nusuk & permits, Haramain train & transport, money/SIM/apps, notes for sisters, crowd & timing tips, and common mistakes to avoid
- **Readiness quiz** — 15 questions with instant feedback and explanations; best score saved

### 🕋 Umrah — during the rites
- **Step-by-step rites checklist** across 4 phases: Ihram at the miqat → Tawaf → Sa'i → Halq/Taqsir, with the key duas inline (Arabic, transliteration, translation)
- **Tawaf counter & Sa'i counter** — big tap targets, progress dots, haptic feedback, so you never lose count mid-round
- **Multiple Umrahs** — record a completed Umrah and reset the steps for the next one (ihram from Masjid Aisha / Tan'eem)

### 📿 Daily — maximise every day in the Haramain
- Daily worship tracker: five prayers in congregation, tahajjud, Quran, dhikr & dua, nafl tawaf, sadaqah, serving pilgrims…
- Points, streaks (Fajr jama'ah, tahajjud, Quran, nafl tawaf), a trip consistency heatmap, trip stats and 8 unlockable achievements
- Configurable trip length (3–30 days)

### 📍 Places — ziyarah with purpose
- 20 curated sites across Makkah and Madinah — each with why it matters, an etiquette tip, a **one-tap Google Maps** button, and a "visited" tracker
- Includes Masjid al-Haram landmarks, Jabal an-Nour, Masjid Aisha (Tan'eem), Jannat al-Mu'alla, Arafat/Mina/Muzdalifah, Masjid an-Nabawi & the Rawdah (Nusuk permit), Quba, Qiblatayn, Uhud, and more

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

## Tech

Mobile-first vanilla HTML/CSS/JS, zero build step, zero dependencies (Google Fonts only, with system fallbacks). Design system: desert emerald & gold, Fraunces + Inter, SVG progress rings, floating pill navigation, tap-ring counters, light & dark themes.

---

*May Allah invite you to His House and accept your Umrah.* 🕋
