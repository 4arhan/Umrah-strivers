# Launching Miqah

Store title: **Miqah: Hajj & Umrah**. Android package id: `com.miqah.app` (set in `twa-manifest.json` and `well-known/assetlinks.json`). The web address `umrah-strivers.vercel.app` is the historical name and stays as is.

Everything in this repository is ready. What remains needs your accounts and your signing key, which only you should hold.

---

## 1. The website (done, no action needed)

| Page | URL | Purpose |
|---|---|---|
| The app | `/` | The PWA itself |
| Download page | `/install` | Platform-aware install instructions, linked from the app |
| Privacy policy | `/privacy` | Required by both stores |

Every push to the production branch auto-deploys to Vercel.

**If you attach a custom domain**, update every place the address is written (search the repository for `vercel.app`: the label under the QR code breaks the address with `<wbr>`, so a search for the full address misses it):
- `APP_URL` in `app.js`, plus the address drawn on the keepsake, progress-card and certificate images, printed in the print sheet’s subtitle, and shown in the secure-storage and Check-for-updates messages in `app.js`
- `og:url` and `og:image` in `index.html` and `install.html`, and the install address in the desktop steps of `install.html`
- `host`, `iconUrl`, `maskableIconUrl`, `webManifestUrl`, `fullScopeUrl` and each shortcut’s `chosenIconUrl` in `twa-manifest.json`
- The QR code in `index.html` (a fixed SVG in the `qrShow` overlay — generate a new one for the new address), the address printed under it, and the QR check in `test/smoke.js`
- The links in `README.md` and in this file

---

## 2. Google Play

Realistic time: **five to seven weeks**, almost all of it waiting on Google's rules, not on work.

### Cost
One payment of **$25**. It never renews.

### Step by step

1. **Create the developer account** at [play.google.com/console](https://play.google.com/console). Pay the $25. Complete identity verification, which holds the account in a limited state for a few business days.

2. **Generate the Android package.** On a machine with Node and a JDK:
   ```bash
   npm i -g @bubblewrap/cli
   bubblewrap init --manifest https://umrah-strivers.vercel.app/manifest.json
   # when asked, accept the values already prepared in twa-manifest.json
   bubblewrap build
   ```
   This produces `app-release-bundle.aab` for upload and `app-release-signed.apk` for testing on your own phone.

   > **Keep the keystore safe.** Bubblewrap creates `android.keystore`. Back it up somewhere permanent and never commit it. Losing it means you can never update the app again. It is already covered by `.gitignore`.

3. **Fix the asset links file.** After your first upload, Play Console shows the app signing certificate under *Release → Setup → App signing*. Copy the **SHA-256 certificate fingerprint** and paste it into `well-known/assetlinks.json`, replacing `REPLACE_WITH_SHA256_FINGERPRINT_FROM_PLAY_CONSOLE`. Push, and confirm it is live at `https://umrah-strivers.vercel.app/.well-known/assetlinks.json`.

   Until this matches, the app opens with a browser address bar visible instead of full screen.

4. **Fill in the store listing.** Everything you need is prepared:

   | Asset | Where it is |
   |---|---|
   | App icon, 512×512 | `icons/store-icon-512.png` |
   | Feature graphic, 1024×500 | `icons/feature-graphic.png` |
   | Phone screenshots, 1080×1920 | the six framed screenshots `store/store-home.png`, `store-steps.png`, `store-counter.png`, `store-daily.png`, `store-places.png` and `store-learn.png`. Do not upload `icons/shot-*.png`: at 390×844 the long side is more than twice the short side, which Play rejects |
   | Store title | `Miqah: Hajj & Umrah` |
   | Short and full description | The **Miqah Brief**, copy blocks section |
   | Privacy policy URL | `https://umrah-strivers.vercel.app/privacy` |

5. **Data safety form.** Answer *no data collected* and *no data shared*. This is accurate. Declare the optional location, sensor and notification permissions as used on-device only.

6. **Content rating.** Complete the IARC questionnaire. It is free and instant. Expect a rating suitable for everyone.

7. **Closed testing, the long pole.** New personal developer accounts must run a closed test with **at least 12 testers opted in for 14 continuous days**, and Google may require more testing if tester engagement was insufficient. Recruit twelve people from family or the masjid, send them the opt-in link, and ask them to keep it installed. Start this clock as early as you can.

8. **Apply for production access**, then submit. Review usually takes a few days for a new account.

### Keeping it updated afterwards
Content and feature changes ship instantly through Vercel with no review. You only rebuild and resubmit when Google raises the required target API level, roughly once a year.

---

## 3. Apple App Store

Be aware of three things before committing to this.

- **It costs $99 every year**, not once.
- **You need a Mac.** Apple does not accept a web app directly. It must be wrapped in a native shell and submitted through Xcode, which only runs on macOS. A rented cloud Mac works.
- **Rejection risk is real.** Apple's guideline 4.2 rejects apps that are mostly a website in a wrapper. This app is far richer than that bar, but the review is subjective, so lead the listing with the offline counters, the rites walkthrough and the places, not with the web origin.

If you proceed, [PWABuilder](https://www.pwabuilder.com/) generates the iOS project, which you then open in Xcode, sign with your Apple Developer certificate and submit. You will need the same privacy policy URL, an App Privacy questionnaire answered as *no data collected*, and a 1024×1024 icon, which you can render from `icons/icon-512.png`.

### My recommendation
Ship Android first. iPhone users can already add the app to their home screen from `/install`, which gives them the icon and the full screen without the $99 and without the review risk. Revisit the App Store once the Play listing has real users and reviews behind it.

---

## 4. Before you submit anywhere

- [ ] Open `/install` on a real iPhone and a real Android phone, and complete the install both ways
- [ ] Turn on airplane mode and confirm the rites, places and prayer times still work
- [ ] Check the icon on a home screen against a circular launcher shape
- [ ] Read `/privacy` once more and confirm every statement is still true of the app
- [ ] Have someone who has performed Umrah read the rites section end to end

---

## 5. Re-verify before each season

Rules for visas, vaccines, permits, phone numbers and transport change from season to season. Every such item in the app ends with a “Checked” date. Before each Umrah season, each Ramadan and each Hajj, go down this list, check each item against its official source, correct the text if it has changed, and move the date forward.

How the dates work:
- `CK` at the top of `data.js` is the date shown on every row and topic that carries `ck:CK`. Move it only after the whole list below has been checked.
- Each pack item (`RAM_PACK`, `HEAT_PACK`, `WAY_PACK`) has its own `on` date.
- A link is only shown where a verified official page exists (`CK_SRC`). Do not add a link from memory.
- After any change to a hadith or Quran reference, regenerate `cites.js`; the test suite fails if the registry and the text disagree.
- The year-bound limits from the verified packs still apply: the six Ramadan 1448 items, the visa-dates card that leaves after Shawwal 1448, and the heat advice to re-check in April–May 2027.

<!-- reverify:start (generated from data.js by the group 6 build; every item that carries a “Checked” date in the app) -->
### Plan › Prepare rows (`ck` on the PLAN item in `data.js`)
- [ ] Passport valid 6+ months (`passport`, checked 11 Nov 2026)
- [ ] Nusuk Hajj permit / package confirmed (`hajjpermit`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Hajj visa issued through your package (`hajjvisa`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Umrah visa / eVisa obtained (Nusuk) (`visa`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Nusuk app installed & account created (`nusuk`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Rawdah permit booked on Nusuk (`rawdah`, checked 11 Nov 2026) — https://haj.gov.sa/en/E-Services/Permit-to-Visit-Al-Rawdah-Al-Sharifiyah-for-Men-Women
- [ ] Hady (Adahi voucher) bought (`hady`, checked 11 Nov 2026)
- [ ] Travel insurance arranged (`insurance`, checked 11 Nov 2026)
- [ ] Madinah ziyarah bus booked (optional) (`hoho`, checked 11 Nov 2026)
- [ ] Meningitis ACWY vaccination certificate (`menacwy`, checked 11 Nov 2026) — https://www.moh.gov.sa/en/HealthAwareness/Pilgrims-Health/Documents/Health-Regulations-Umrah-EN.pdf and https://www.moh.gov.sa/HealthAwareness/Pilgrims-Health/Documents/Hajj-Health-Requirements-English-language.pdf
- [ ] Routine vaccines / flu shot up to date (`jabs`, checked 11 Nov 2026) — https://www.moh.gov.sa/en/HealthAwareness/Pilgrims-Health/Documents/Health-Regulations-Umrah-EN.pdf and https://www.moh.gov.sa/HealthAwareness/Pilgrims-Health/Documents/Hajj-Health-Requirements-English-language.pdf
- [ ] Children’s passports valid 6+ months (`kidspass`, checked 11 Nov 2026)
- [ ] Umrah visa for each child (`kidsvisa`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Hajj permit & age rule checked for each child (`kidshajj`, checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Children’s Meningitis ACWY certificates (`kidsmenacwy`, checked 11 Nov 2026) — https://www.moh.gov.sa/en/HealthAwareness/Pilgrims-Health/Documents/Health-Regulations-Umrah-EN.pdf and https://www.moh.gov.sa/HealthAwareness/Pilgrims-Health/Documents/Hajj-Health-Requirements-English-language.pdf
- [ ] Decide: stroller or carrier? (`stroller`, checked 11 Nov 2026)

### Learn topics, places and cards (`ck` on the item)
- [ ] Learn · Nusuk & permits (checked 11 Nov 2026) — https://haj.gov.sa/en/FAQ
- [ ] Learn · Getting around (checked 11 Nov 2026)
- [ ] For sisters · Women’s areas, the mataf & the Rawdah (checked 11 Nov 2026)
- [ ] Madinah · The Rawdah — a garden of Paradise (checked 11 Nov 2026) — https://haj.gov.sa/en/E-Services/Permit-to-Visit-Al-Rawdah-Al-Sharifiyah-for-Men-Women
- [ ] Scams · Rule #1 — permits are free, donations go through official channels (checked 11 Nov 2026) — https://www.nusuk.sa/
- [ ] Scams · Fake Umrah & Hajj packages, visa fraud (checked 11 Nov 2026)
- [ ] Scams · Phishing: fake Nusuk sites, apps & OTP theft (checked 11 Nov 2026)
- [ ] Scams · If it happens: report it (checked 11 Nov 2026)
- [ ] Hajj help · I lost my group in Mina (checked 11 Nov 2026)
- [ ] Places · The Rawdah (`rawdah`, checked 11 Nov 2026) — https://haj.gov.sa/en/E-Services/Permit-to-Visit-Al-Rawdah-Al-Sharifiyah-for-Men-Women
- [ ] Places · Ziyarah bus (hop-on hop-off) card: operator, routes, stops and the booking link (`TOUR`, checked 11 Nov 2026) — https://city-sightseeing.com/en/125/medina/478/hop-on-hop-off-al-madinah

### Phone numbers and links (date is `CK` in `data.js`)
- [ ] Emergency and help numbers: 911, 997, 937, 1966 and 930. They appear in `HELP_TEL` (`app.js`), the Help card, Plan › Prepare, the Scams “report it” topic, “I lost my group in Mina” and the wayfinding “Numbers to call” card (checked 11 Nov 2026)
- [ ] Official & helpful links card in More › Settings: every link still opens the right page (checked 11 Nov 2026)
- [ ] The official pages behind the “official page” links (`CK_SRC` in `data.js`): https://www.nusuk.sa/ · https://haj.gov.sa/en/E-Services/Permit-to-Visit-Al-Rawdah-Al-Sharifiyah-for-Men-Women · https://haj.gov.sa/en/FAQ · https://www.moh.gov.sa/en/HealthAwareness/Pilgrims-Health/Documents/Health-Regulations-Umrah-EN.pdf · https://www.moh.gov.sa/HealthAwareness/Pilgrims-Health/Documents/Hajj-Health-Requirements-English-language.pdf

### Ramadan pack (`on` on each item of `RAM_PACK`)
- [ ] An Umrah in Ramadan (`ram-umrah-virtue`, checked 9 Nov 2026)
- [ ] Laylat al-Qadr: seek it in the odd nights (`ram-qadr`, checked 9 Nov 2026)
- [ ] The dua for Laylat al-Qadr (`ram-qadr-dua`, checked 9 Nov 2026)
- [ ] How the Prophet ﷺ spent the last ten nights (`ram-last-ten`, checked 9 Nov 2026)
- [ ] The busiest nights of the year (`ram-crowds`, checked 9 Nov 2026)
- [ ] Taraweeh and tahajjud in the Haram (`ram-taraweeh`, checked 9 Nov 2026)
- [ ] The reward of your fast (`ram-fasting`, checked 9 Nov 2026)
- [ ] Give iftar (`ram-give-iftar`, checked 9 Nov 2026)
- [ ] Iftar in the Haram (`ram-iftar-haram`, checked 9 Nov 2026)
- [ ] After breaking your fast (`ram-iftar-dua`, checked 9 Nov 2026)
- [ ] Suhoor, and when to stop (`ram-suhoor`, checked 9 Nov 2026)
- [ ] Who may skip a fast (`ram-excused`, checked 9 Nov 2026)
- [ ] Fasting while travelling, and during your stay (`ram-traveller`, checked 9 Nov 2026)
- [ ] Umrah permits in Ramadan (`ram-nusuk`, checked 9 Nov 2026)
- [ ] I’tikaf in the Haram (`ram-itikaf`, checked 9 Nov 2026)
- [ ] Umrah visa dates for Ramadan 1448 (`ram-season-1448`, checked 9 Nov 2026)
- [ ] Fasting, tawaf and sleep (`ram-energy`, checked 9 Nov 2026)

### Heat pack (`on` on each item of `HEAT_PACK`)
- [ ] Why heat needs a plan this Hajj (`heat-why-1448`, checked 9 Nov 2026)
- [ ] Keep out of the sun from 10 am to 4 pm (`heat-hours`, checked 9 Nov 2026)
- [ ] Jamarat: keep to your group’s time (`heat-jamarat-slot`, checked 9 Nov 2026)
- [ ] Heat exhaustion: cool down now (`heat-exhaustion`, checked 9 Nov 2026)
- [ ] Heatstroke is an emergency: call 911 (`heat-stroke`, checked 9 Nov 2026)
- [ ] Drink before you feel thirsty (`heat-hydration`, checked 9 Nov 2026)
- [ ] Shade in ihram: what men may use (`heat-ihram-shade`, checked 9 Nov 2026)
- [ ] Cool off with water: ihram allows it (`heat-wet-head`, checked 9 Nov 2026)
- [ ] Your heat kit for Arafah and Mina (`heat-kit`, checked 9 Nov 2026)
- [ ] Watch each other (`heat-companions`, checked 9 Nov 2026)

### Wayfinding and transport pack (`on` on each item of `WAY_PACK`)
- [ ] The three jamarat, in order (`jam-order`, checked 9 Nov 2026)
- [ ] What you aim at: the wall and the basin (`jam-wall-basin`, checked 9 Nov 2026)
- [ ] From pillars to walls (`jam-history`, checked 9 Nov 2026)
- [ ] The Jamarat facility (`jam-facility`, checked 9 Nov 2026)
- [ ] The 10th: where to stand at Jamrat al-Aqabah (`jam-aqabah-stance`, checked 9 Nov 2026)
- [ ] 11th to 13th: where to pause for dua (`jam-dua-spots`, checked 9 Nov 2026)
- [ ] Getting to the Jamarat (`jam-getting-there`, checked 9 Nov 2026)
- [ ] Your Mina camp card (`camp-card`, checked 9 Nov 2026)
- [ ] Finding your way back in Mina (`camp-finding-way`, checked 9 Nov 2026)
- [ ] Numbers to call (`help-numbers`, checked 9 Nov 2026)
- [ ] Haramain High Speed Railway (`go-haramain`, checked 9 Nov 2026) — https://pep.gov.sa/en/news/962 · https://www.sar.com.sa/
- [ ] The Mashaer metro (Holy Sites train) (`go-mashaer-metro`, checked 9 Nov 2026) — https://www.sar.com.sa/featured/almashaertrain/ · https://haj.gov.sa/-/media/Project/HAJJ/PDF-and-FILES/Awareness-Guides/Arafah-Guide/French/FR-Arafah-Guide.pdf
- [ ] Makkah Bus (`go-makkah-bus`, checked 9 Nov 2026)
- [ ] Madinah Buses (`go-madinah-bus`, checked 9 Nov 2026)
- [ ] Taxis and ride-hailing apps (`go-taxi`, checked 9 Nov 2026)
- [ ] Walking between the holy sites (`go-walking`, checked 9 Nov 2026) — https://haj.gov.sa/-/media/Project/HAJJ/PDF-and-FILES/Awareness-Guides/Arafah-Guide/French/FR-Arafah-Guide.pdf
- [ ] Am I inside Arafah? (`bound-arafah`, checked 9 Nov 2026)
- [ ] Muzdalifah and Mina: where they begin and end (`bound-muzdalifah-mina`, checked 9 Nov 2026)
- [ ] Save your camp's location (`gps-save-camp`, checked 9 Nov 2026)
<!-- reverify:end -->

---

## 6. Owner’s to-do list

These need a person, not code.

- [ ] **Scholar review of the rites content.** The app says “scholar review: pending” in More › Settings and in Sources. Ask a qualified scholar to read the Umrah steps, the Hajj steps (all three types), Today’s rulings, the Fiqh Q&A and the troubleshooting sheets. More › Settings › Sources lists every hadith and Quran reference with where it is used, which makes the review faster. When it is done, change the “Review status” line in `index.html`, the answer under “Is the religious content reliable?” in `app.js`, and the note at the top of the Sources sheet.
- [ ] **A native Arabic speaker’s check of the show-a-phrase cards and the lost-child card.** Read every card in “Show a phrase in Arabic” (`SAY` in `data.js`), the “I’m lost” card, the driver card, the camp card and the lost-child card, on a phone, as a stranger would be shown them. Check the wording, the vowel marks and that each reads naturally to a Saudi security officer or driver.
- [ ] Re-verify the season list in section 5 before each Umrah season, each Ramadan and each Hajj.
