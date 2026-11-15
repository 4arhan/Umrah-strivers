// Everything the product page (demo.miqah.app) says, in one place.
// tools/site-build.js turns this into site/index.html; tools/site-shots.js makes the screenshots.
//
// WHEN THE APP CHANGES: add an entry at the top of `updates` for the new version (the smoke test
// fails until you do), add or edit the beat, card or tile for the feature, add a scene for it in
// tools/site-shots.js if it has a screen worth showing, then run both tools and deploy `site/`.
// Say only what the app does. Take wording for rulings, numbers and names from the app itself.

const APP = 'https://miqah.app/';

module.exports = {
  url: 'https://demo.miqah.app/',
  app: APP,
  install: APP + 'install',
  privacy: APP + 'privacy',
  title: 'Miqah — Hajj & Umrah companion',
  description: 'A free Hajj and Umrah companion for your phone. It plans the trip, walks you through each rite, counts every round and pebble, and works with no signal. No account, no ads.',

  hero: {
    strap: 'Free · offline · private',
    h1: 'From your first plan to your <em>farewell tawaf.</em>',
    lede: 'Miqah is a Hajj and Umrah companion for your phone. It plans the trip, walks you through each rite, counts every round and pebble, and keeps working when the signal doesn’t.',
    // The opening of the Talbiyah, exactly as the app prints it (data.js).
    ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
    tr: 'Labbayk Allahumma labbayk. Here I am, O Allah, here I am.',
    phones: [['focus-tawaf', 'light', 'The tawaf counter in focus mode, on round 3 of 7'], ['home-arafah', 'dark', 'Miqah’s Home screen on the Day of Arafah'], ['home-trip', 'dark', 'Miqah’s Home screen on day 5 of an Umrah trip']],
  },

  intro: 'Hajj and Umrah ask a lot of you at once: papers, rulings, crowds, heat, and a head full of duas. <span>Miqah holds the practical side, so your attention can stay where it belongs.</span>',

  chapters: [
    { id: 'plan', n: '01', nav: 'Before you fly', hint: 'Plan, pack, learn', h2: 'Ready before the airport.',
      sub: 'Tell Miqah whether you are going for Umrah or Hajj and when you leave. It works out the rest.',
      beats: [
        { shot: 'home-plan', where: 'Home', icon: 'plane', h3: 'A countdown that knows what’s next',
          t: 'Give Miqah your departure date and Home becomes your plan: days to go, how prepared you are, and the next thing to sort out, with anything overdue flagged.',
          chips: ['Umrah or Hajj', 'Tamattu’, Qiran or Ifrad', 'Apply your group’s setup from one link'], alt: 'Home screen 57 days before departure, showing how prepared the pilgrim is and what to do next' },
        { shot: 'prepare', where: 'Plan › Prepare', icon: 'list', h3: 'One checklist for papers, health, packing and the heart',
          t: 'Passport, visa, vaccines, bookings and packing, each with when to do it and why. It begins with the intention. Rules that change, like visas and permits, show the date they were last checked.',
          chips: ['Share your readiness', 'A list for children who travel', 'Documents vault with a PIN'], alt: 'The Prepare screen with a readiness ring and the intention card' },
        { shot: 'itinerary', where: 'Plan › Prepare', icon: 'calendar', h3: 'Your days, city by city',
          t: 'A suggested itinerary for the length of your trip: Makkah first or Madinah first, at a standard or a family pace. Tap a day to change it.',
          chips: ['The days of Hajj built in', 'Share it with your group'], alt: 'A suggested ten-day itinerary with Makkah first' },
        { shot: 'quiz', where: 'Plan › Learn and Quiz', icon: 'quiz', h3: 'Learn it before you live it',
          t: 'Short lessons, a daily deck of knowledge cards, and a quiz that unlocks level by level once you score 80%. Each answer shows its source.',
          chips: ['Separate levels for Hajj', 'Kids’ corner and stories', 'A certificate at the end'], alt: 'A quiz question from level 1, Foundations of Umrah' },
      ] },
    { id: 'rites', n: '02', nav: 'In ihram', hint: 'Steps, counters, duas', h2: 'The rites, one step at a time.',
      sub: 'When you are tired and the crowd is moving, you should not have to remember what comes next.',
      beats: [
        { shot: 'steps', where: 'Umrah › Steps & duas', icon: 'book', h3: 'Every step in order, with its dua',
          t: 'The whole rite as a walkthrough: what to do, what to say and why. Duas come in Arabic, transliteration and meaning, with a Listen button where your phone has an Arabic voice.',
          chips: ['Guidance for sisters', 'A story for the kids', 'Report a correction on any step'], alt: 'The Umrah walkthrough at step 1 of 16' },
        { shot: 'counters', where: 'Umrah › Counters', icon: 'refresh', h3: 'Count rounds without losing your place',
          t: 'One big ring for tawaf and one for sa’i. Tap after each round and Miqah tells you which round you are on, with the dua for where you are standing.',
          chips: ['Wudu check before tawaf', 'Undo a round', 'Nafl tawaf too'], alt: 'The tawaf counter showing round 3 of 7' },
        { shot: 'focus-tawaf', one: true, where: 'Focus mode', icon: 'expand', h3: 'Eyes on the Kaaba, not the screen',
          t: 'Go full-screen and tap anywhere to count. The screen stays awake, and on phones with a built-in voice the count can be read aloud through your earphones.',
          chips: ['Tap anywhere', 'Screen stays awake', 'Spoken count, off by default'], alt: 'Focus mode: a full-screen tawaf counter on round 3 of 7' },
        { shot: 'dua-reader', one: true, where: 'More › Duas', icon: 'hands', h3: 'The duas you were asked to make',
          t: 'Keep a list of your own duas and the ones people asked of you. Read them full-screen, one at a time, and mark each as asked.',
          chips: [], alt: 'A personal dua shown full-screen, number 3 of 5' },
      ] },
    { id: 'hajj', n: '03', nav: 'The days of Hajj', hint: 'Arafah, Mina, Jamarat', h2: 'It knows which day of Hajj it is.',
      sub: 'From the 8th of Dhul Hijjah, the whole app turns to face the day you are in.',
      beats: [
        { shot: 'home-arafah', where: 'Home', icon: 'hills', h3: 'The day’s rite and its window',
          t: 'During the days of Hajj, Home shows the rite for the day and when it must happen. On 9 Dhul Hijjah that is the standing at Arafah, from Dhuhr until sunset.',
          chips: ['Dates you can correct', 'Your camp on every card'], alt: 'Home screen on 9 Dhul Hijjah: stand at Arafah, from Dhuhr until sunset' },
        { shot: 'hajj-today', where: 'Daily › Today', icon: 'check', h3: 'A checklist for the day you are in',
          t: 'Each day of Hajj has its own list, from the intention and the Talbiyah on the 8th to the last day of stoning, beside your prayer times and your camp.',
          chips: [], alt: 'The Daily screen on the Day of Arafah with the day’s checklist' },
        { shot: 'hajj-counters', where: 'Hajj › Counters', icon: 'stone', h3: 'Seven pebbles, counted per pillar',
          t: 'A counter for each jamrah on each day, with the time window for stoning that day.',
          chips: ['Stoning on someone’s behalf', 'If a pebble misses', 'Log it later if you could not tap'], alt: 'The rami counter on 10 Dhul Hijjah at pebble 4 of 7' },
        { shot: 'jamarat', where: 'Hajj › Counters', icon: 'map', h3: 'The Jamarat, drawn simply',
          t: 'A sketch of the three pillars in the order you meet them, and where to pause for dua. It is not to scale: your group gives you the route, the level and the time.',
          chips: [], alt: 'A simple sketch of the three Jamarat pillars' },
        { shot: 'heat', where: 'Home', icon: 'sun', h3: 'A plan for the heat',
          t: 'The signs of heat exhaustion and heatstroke, what to do, and who to call: 911, 997 for the Saudi Red Crescent, and 937 for the Ministry of Health.',
          chips: [], alt: 'The heat plan, with emergency numbers at the top' },
      ] },
    { id: 'daily', n: '04', nav: 'Every day there', hint: 'Prayers, places, journal', h2: 'Make every day count.',
      sub: 'The days between the rites are the ones that slip away. Miqah gives each of them a shape.',
      beats: [
        { shot: 'today', where: 'Daily › Today', icon: 'clock', h3: 'The day at a glance',
          t: 'Prayer times for Makkah and Madinah, the day’s worship checklist, your hotel and meeting point, and a row for each child’s day.',
          chips: ['Tick a prayer in one tap', 'Reminders if you want them', 'Times worked out on the phone when offline'], alt: 'The Daily screen on day 5 of 10 with prayer times and the day’s checklist' },
        { shot: 'ramadan', where: 'Home', icon: 'moon', h3: 'Ramadan mode',
          t: 'Travelling in Ramadan? Home counts down to iftar and suhoor, and marks the odd nights of the last ten.',
          chips: [], alt: 'Home screen in Ramadan, counting down to iftar' },
        { shot: 'places', where: 'Places', icon: 'pin', h3: 'Ziyarah with purpose',
          t: 'The sites of Makkah and Madinah, each with what happened there, a practical tip, a one-tap map, and a card to show your driver in Arabic.',
          chips: ['Near me', 'Walking times from your hotel', 'Mark places visited'], alt: 'The Places screen listing sites in Makkah and Madinah' },
        { shot: 'place', where: 'Places', icon: 'info', h3: 'What you need before you go',
          t: 'Where a visit needs a permit, like the Rawdah, Miqah says so, links the official page, and shows the date it last checked.',
          chips: [], alt: 'The Rawdah entry, noting that a free Nusuk permit is required' },
        { shot: 'journal', where: 'Daily › Today', icon: 'scroll', h3: 'One line a day',
          t: 'A private journal with one line for each day. It stays on your phone and in your backup, and one line can sit on your keepsake image.',
          chips: [], alt: 'The journal with three one-line entries' },
        { shot: 'home-after', where: 'Home', icon: 'sprout', h3: 'Home again',
          t: 'After you return, Miqah turns to keeping the habits: prayers on time, Quran and dhikr for thirty days, and a start on your next journey.',
          chips: [], alt: 'Home screen after the trip, tracking thirty days of habits' },
      ] },
  ],

  safety: {
    id: 'safety', nav: 'Safety', eyebrow: 'Safety and family', h2: 'When words fail, show the screen.',
    sub: 'Six cards made to be handed to a stranger. Arabic first, your language underneath, and always white so they can be read in full sun. Print them as pocket cards before you fly.',
    cards: [
      { shot: 'lost', b: 'I’m lost', s: 'Your name, who to call and where you are from. Medical notes only if you choose to show them.', alt: 'The I’m-lost card with Arabic first and a number to call' },
      { shot: 'phrase', b: 'Show a phrase', s: 'Medical and wayfinding phrases, with Listen where your phone has an Arabic voice.', alt: 'A phrase card reading “I need a doctor” in Arabic and English' },
      { shot: 'child-card', b: 'If a child is lost', s: 'A card for each child, with your number in large digits.', alt: 'A lost-child card with the parents’ phone number' },
      { shot: 'camp-card', b: 'My camp in Mina', s: 'Area, street, camp and gate numbers in both languages.', alt: 'The Mina camp card with area, street, camp and gate' },
      { shot: 'driver', b: 'Take me to my hotel', s: 'The hotel’s name in Arabic, with call and map buttons.', alt: 'A card asking a driver to go to the hotel, in Arabic' },
      { shot: 'help', b: 'Emergency numbers', s: '911 and the Saudi help lines, with the date they were last checked.', alt: 'Emergency and help numbers in Saudi Arabia' },
    ],
  },

  trust: {
    id: 'trust', nav: 'Trust', eyebrow: 'Trust', h2: 'Every reference numbered. Every changing fact dated.',
    sub: 'A wrong ruling does real harm, so Miqah shows its working. Facts that change, like visas, permits, vaccines, phone numbers and transport, carry the date they were last checked and a link to the official page.',
    cards: [
      { shot: 'sources', b: 'Sources', s: 'Every hadith and Quran reference in one searchable list, with its number, its grade where one is stated, and where the app uses it.', alt: 'The Sources list of hadith and Quran references' },
      { shot: 'correction', up: 0.86, b: 'Report a correction', s: 'A button under every article, dua, step and place opens an email with the item already named. Miqah sends nothing itself.', alt: 'The Report a correction sheet' },
      { shot: 'whats-new', b: 'What’s new', s: 'After each update, a short note says what changed in plain words.', alt: 'The What’s new sheet listing recent changes' },
    ],
    note: '<b>A study companion, not a fatwa service.</b> <span>Citations have been checked against the source texts. Review by a qualified scholar and a native-speaker check of the Arabic phrase cards are still pending, and the app says so. For a ruling on your own situation, ask a scholar you trust.</span>',
  },

  privacy: {
    id: 'private', eyebrow: 'Private by design', h2: 'No account. No ads. No analytics.',
    sub: 'Miqah has no server to send your details to.',
    cells: [
      { icon: 'lock', h3: 'Nothing to sign up for', p: 'What you enter is saved in your phone’s own storage. The developer cannot see it.' },
      { icon: 'antenna', h3: 'Works with no signal', p: 'Once opened, Miqah runs offline. With a connection it fetches only prayer times, its fonts and its own updates.' },
      { icon: 'disk', h3: 'Yours to keep or erase', p: 'Export a backup file whenever you like, restore it on a new phone, or reset and wipe everything.' },
    ],
  },

  more: {
    id: 'more', eyebrow: 'Also inside', h2: 'The small things you will be glad of.',
    trio: [['tools', 'The Tools screen with the tasbih counter'], ['stats', 'Trip statistics and consistency'], ['quiz-levels', 'The quiz levels']],
    tiles: [
      ['compass', 'Qibla compass', 'Points to the Kaaba using your phone’s sensors.'],
      ['beads', 'Tasbih', 'A dhikr counter with the common phrases and targets.'],
      ['drop', 'Water', 'A simple tracker for the hot days.'],
      ['cross', 'Medicine reminders', 'Your medicine list, with reminders made on the phone.'],
      ['kid', 'Kids’ corner', 'A quiz, read-aloud stories and daily stars for children.'],
      ['grid', 'Essentials Home', 'A simpler Home with four big buttons, for a parent’s phone.'],
      ['print', 'Pocket cards', 'Print the lost, hotel, camp and child cards to cut out.'],
      ['link', 'Group setup link', 'Share your trip setup; your group applies it in one tap.'],
      ['calendar', 'Calendar export', 'Add prayer times and the days of Hajj to your calendar.'],
      ['chart', 'Stats and streaks', 'See the days you logged and the habits you kept.'],
      ['lock', 'Document vault', 'Copies of your papers, encrypted with a PIN only you know.'],
      ['moon', 'Dark mode and large text', 'Easier at night, and easier on tired eyes.'],
    ],
  },

  demo: {
    id: 'try', nav: 'Try it', eyebrow: 'Live demo', h2: 'Try it here.',
    sub: 'This is the real app, running in your browser. Nothing you enter leaves it.',
    steps: ['Choose Umrah or Hajj.', 'Set a departure date.', 'Open Umrah › Counters and tap the ring.'],
    poster: ['welcome', 'Miqah’s first screen'],
  },

  get: {
    id: 'get', eyebrow: 'Get Miqah', h2: 'Take it with you.',
    sub: 'Open miqah.app on your phone and add it to your Home Screen. From then on it works offline.',
  },

  // Newest first. One entry per version that changed what a pilgrim sees.
  updates: [
    { v: '6.10.2', date: '2026-11-11', title: 'A home of its own: miqah.app',
      items: ['Miqah moved to its own address, miqah.app, with a new QR code to match.', 'The earlier address keeps working, and nothing saved there is lost.'] },
    { v: '6.10', date: '2026-11-11', title: 'Sources you can check',
      items: ['Sources: every hadith and Quran reference in one list, with its number and where the app uses it.', '“Checked” dates on visa, vaccine, permit, phone-number and transport rules.', 'Report a correction under every article, dua, step and place.', 'A What’s new note after each update.', 'A private trip journal: one line a day.'] },
    { v: '6.9', date: '2026-11-11', title: 'Ramadan, heat and finding your way',
      items: ['Ramadan mode, with a countdown to iftar and suhoor.', 'A heat plan with the signs of heatstroke and who to call.', 'A simple sketch of the Jamarat, and a card for your camp in Mina.', 'Prayer times for your home city before you leave.', 'Further rounds of fact-checking across the whole app.'] },
    { v: '6.8', date: '2026-11-11', title: 'On the trip: safety and family',
      items: ['Today’s plan on Home, and one tap to tick a prayer.', 'Show-a-phrase cards and lost-child cards.', '“About me” on the I’m-lost card, with medical notes if you choose.', 'Pocket cards to print, medicine reminders and a hotel check-in card.', 'An optional spoken count in the big counter.'] },
    { v: '6.7', date: '2026-11-11', title: 'Before you fly',
      items: ['Paste a group link to apply your group’s trip setup.', 'Two hotels: one for Makkah, one for Madinah.', 'Essentials Home, a simpler Home for a parent’s phone.', 'A “Ready for no signal” check before you travel.'] },
    { v: '6.6', date: '2026-11-09', title: 'The days of Hajj, continued',
      items: ['Lost, help and driver cards that follow the day of Hajj you are in.', 'Stoning on someone’s behalf, and help when a pebble misses.', 'A day-by-day Hajj record with a keepsake image.', 'Add the days of Hajj to your calendar.'] },
    { v: '6.5', date: '2026-11-09', title: 'The days of Hajj',
      items: ['Home, Counters and Daily turn to face each day of Hajj.', 'A countdown to sunset on the Day of Arafah.', 'The time window for stoning each day.', 'An itinerary that includes the days of Hajj.'] },
    { v: '6.4', date: '2026-11-09', title: 'Learning for Hajj, and a full fact-check',
      items: ['Quiz levels, flashcards and lessons written for Hajj as well as Umrah.', 'Every hadith, verse, ruling and practical fact checked against its source and corrected where it was off.'] },
    { v: '6.3', date: '2026-11-07', title: 'A new look',
      items: ['The dark aubergine Home card, and its style carried across every screen.', 'A new icon.'] },
    { v: '5.0', date: '2026-11-05', title: 'Hajj, and a new name',
      items: ['Umrah Strivers became Miqah.', 'Hajj joined Umrah: Tamattu’, Qiran and Ifrad, with their rites, counters and record.'] },
  ],
};
