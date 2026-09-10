# Launching Umrah Strivers

Everything in this repository is ready. What remains needs your accounts and your signing key, which only you should hold.

---

## 1. The website (done, no action needed)

| Page | URL | Purpose |
|---|---|---|
| The app | `/` | The PWA itself |
| Download page | `/install` | Platform-aware install instructions, linked from the app |
| Privacy policy | `/privacy` | Required by both stores |

Every push to the production branch auto-deploys to Vercel.

**If you attach a custom domain**, update these four places:
- `APP_URL` in `app.js`
- `og:url` and `og:image` in `index.html`, `install.html`, `privacy.html`
- `host`, `iconUrl`, `maskableIconUrl`, `webManifestUrl`, `fullScopeUrl` in `twa-manifest.json`
- The share text and QR code in `app.js` (`showQR`, `shareApp`)

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
   | Phone screenshots, 1080×1920 | ask me for the framed set, or use `icons/shot-*.png` |
   | Short and full description | The **Umrah Strivers Brief**, copy blocks section |
   | Privacy policy URL | `https://umrah-strivers.vercel.app/privacy` |

5. **Data safety form.** Answer *no data collected* and *no data shared*. This is accurate. Declare the optional location, sensor and notification permissions as used on-device only.

6. **Content rating.** Complete the IARC questionnaire. It is free and instant. Expect a rating suitable for everyone.

7. **Closed testing, the long pole.** New personal developer accounts must run a closed test with **at least 12 testers opted in for 14 continuous days**, and Google now checks that they actually opened the app. Recruit twelve people from family or the masjid, send them the opt-in link, and ask them to keep it installed. Start this clock as early as you can.

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
