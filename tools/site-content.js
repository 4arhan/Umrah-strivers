// Everything the product page (about.miqah.app) says, in one place.
// tools/site-build.js turns this into site/index.html; tools/site-shots.js makes the screenshots.
//
// The page is grouped by what a feature gives a pilgrim (plan, learn, perform …), not by where it
// sits in the app. Every feature belongs to exactly one category:
//   beats  the showcase: a screenshot, a headline and a paragraph (the phone that changes as you scroll)
//   more   everything else in the category. An entry with `shot` gets a small screenshot;
//          the rest are one-line rows: [icon, name, line, since?]
//   since  the version a feature arrived in. Features from the current minor line get a “New” tag,
//          and lose it by themselves when the app moves on.
//
// WHEN THE APP CHANGES: add an entry at the top of `updates` for the new version (the smoke test
// fails until you do), put the feature in its category as a beat or a `more` entry with `since`,
// add a scene for it in tools/site-shots.js if it has a screen worth showing, then run both tools
// and deploy `site/`. Say only what the app does. Take wording for rulings, numbers and names from
// the app itself.

const APP = 'https://miqah.app/';

module.exports = {
  url: 'https://about.miqah.app/',
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
  index: { eyebrow: 'What it does for you', h2: 'Everything in Miqah, by what it gives you.' },

  categories: [
    // ───────────────────────────── PLAN ─────────────────────────────
    { id: 'plan', nav: 'Plan', noun: 'Planning', icon: 'plane', cover: 'home-plan',
      value: 'Arrive ready, not rushed.',
      sub: 'Tell Miqah whether you are going for Umrah or Hajj and when you leave. It works out what to do, and when.',
      beats: [
        { shot: 'home-plan', where: 'Home', icon: 'plane', h3: 'A countdown that knows what’s next',
          t: 'Give Miqah your departure date and Home becomes your plan: days to go, how prepared you are, and the next thing to sort out, with anything overdue flagged.',
          chips: ['Umrah or Hajj', 'Tamattu’, Qiran or Ifrad'], alt: 'Home screen 57 days before departure, showing how prepared the pilgrim is and what to do next' },
        { shot: 'prepare', where: 'Plan › Prepare', icon: 'list', h3: 'One checklist for papers, health, packing and the heart',
          t: 'Passport, visa, vaccines, bookings and packing, each with when to do it and why. It begins with the intention. Rules that change, like visas and permits, show the date they were last checked.',
          chips: [], alt: 'The Prepare screen with a readiness ring and the intention card' },
        { shot: 'itinerary', where: 'Plan › Prepare', icon: 'calendar', h3: 'Your days, city by city',
          t: 'A suggested itinerary for the length of your trip: Makkah first or Madinah first, at a standard or a family pace. Tap a day to change it.',
          chips: ['The days of Hajj built in'], alt: 'A suggested ten-day itinerary with Makkah first' },
        { shot: 'leave', since: '6.7', where: 'Home', icon: 'bag', h3: 'The last 48 hours',
          t: 'Two days before you fly, Home turns into a leave-home list: the ihram kit in your hand luggage, the hotel card filled in, your documents saved. It can add a calendar alarm for entering ihram on the flight.',
          chips: [], alt: 'Home screen one day before departure, with a list of things to do before leaving home' },
      ],
      more: [
        { shot: 'hotel', since: '6.7', b: 'Two hotels on one card', s: 'Makkah and Madinah, each with its Arabic name, nearest gate and meeting point.', alt: 'The hotel card with Makkah and Madinah tabs' },
        { shot: 'vault', b: 'Document vault', s: 'Copies of your papers, encrypted with a PIN only you know.', alt: 'The document vault card' },
        ['clock', 'What to do when', 'Every item has an ideal lead time, so you see what is due now and what can wait.'],
        ['check', 'Already sorted?', 'Booked before you installed? Tick it all on one sheet.', '6.7'],
        ['heart', 'The written intention', 'Write why you are going. Miqah brings it back on the first day and on Arafah.', '6.7'],
        ['tent', 'Your Mina camp', 'For Hajj, the camp, maktab and group leader sit beside the hotel.', '6.6'],
        ['bag', 'Packing by bag', 'Filter the list by ihram bag, carry-on or suitcase.'],
        ['kid', 'Travelling with children', 'Their passports, visas and vaccines join your timeline.'],
        ['share', 'Share my readiness', 'Send your group how prepared you are.'],
        ['antenna', 'Ready for no signal', 'A check before you fly that everything is saved on the phone.', '6.7'],
        ['sun', 'Prayer times at home', 'Your own city’s times while you prepare.', '6.9'],
        ['calendar', 'Calendar export', 'Add prayer times and the days of Hajj to your calendar.'],
      ] },

    // ───────────────────────────── LEARN ─────────────────────────────
    { id: 'learn', nav: 'Learn', noun: 'Learning', icon: 'book', cover: 'quiz',
      value: 'Know what you are doing, and why.',
      sub: 'Short lessons before you go, and the evidence behind each step when you are there.',
      beats: [
        { shot: 'learn', where: 'Plan › Learn', icon: 'book', h3: 'The whole rite, then the detail',
          t: 'Learn opens with the rite in order, then goes deeper: essentials, questions and answers, and the history of the places. Search finds anything, from Zamzam to a missed lap.',
          chips: ['Rites', 'Essentials', 'Q&A', 'History'], alt: 'The Learn screen, opening with Umrah in four steps' },
        { shot: 'quiz', where: 'Plan › Quiz', icon: 'quiz', h3: 'A quiz that unlocks as you learn',
          t: 'Multiple choice and true or false, level by level. Score 80% to open the next, and each answer shows its source.',
          chips: ['Separate levels for Hajj', 'A certificate at the end'], alt: 'A quiz question from level 1, Foundations of Umrah' },
        { shot: 'flashcard', where: 'Plan › Learn', icon: 'cards', h3: 'A few cards a day',
          t: 'Daily knowledge cards on spaced repetition, paced to your departure date, with your quiz mistakes mixed in.',
          chips: [], alt: 'A knowledge card from the daily deck' },
        { shot: 'sisters', where: 'Plan › Learn', icon: 'flower', h3: 'For sisters, in one place',
          t: 'Everything that differs for women in a five-minute read: ihram clothing, periods, the women’s areas and staying together.',
          chips: [], alt: 'The For sisters section of Learn' },
      ],
      more: [
        { shot: 'hajj-learn', since: '6.4', b: 'Hajj in 5 days', s: 'One tile for each day of Hajj, with its expected date. Tap a day to open it in the rites guide.', alt: 'Learn in Hajj mode, with a tile for each day of Hajj' },
        { shot: 'quiz-levels', b: 'Quiz levels', s: 'See what each level covers and what it takes to pass.', alt: 'The list of quiz levels' },
        { shot: 'scams', b: 'Donations and scams', s: 'How to give safely, and the common rip-offs to watch for.', alt: 'The Donations and scams section of Learn' },
        ['question', '“Why?” on every step', 'The evidence behind each action, with its reference.'],
        ['scroll', 'Today’s rulings', 'On each day of Hajj, the rulings that matter that day.', '6.6'],
        ['list', 'Where the schools differ', 'The four schools are named, not folded into one view.'],
        ['refresh', 'Review my mistakes', 'Drill only the questions you got wrong.'],
        ['medal', 'Certificate', 'Finish the circuit and get a certificate with your name.'],
      ] },

    // ───────────────────────────── PERFORM ─────────────────────────────
    { id: 'perform', nav: 'Perform', noun: 'Performing the rites', icon: 'kaaba', cover: 'focus-tawaf', coverOne: true,
      value: 'Each rite, one step at a time.',
      sub: 'When you are tired and the crowd is moving, you should not have to remember what comes next.',
      beats: [
        { shot: 'steps', where: 'Umrah › Steps & duas', icon: 'book', h3: 'Every step in order, with its dua',
          t: 'The whole rite as a walkthrough: what to do, what to say and why. Duas come in Arabic, transliteration and meaning.',
          chips: ['Guidance for sisters', 'A story for the kids'], alt: 'The Umrah walkthrough at step 1 of 16' },
        { shot: 'counters', where: 'Umrah › Counters', icon: 'refresh', h3: 'Count rounds without losing your place',
          t: 'One big ring for tawaf and one for sa’i. Tap after each round and Miqah tells you which round you are on, with the dua for where you are standing.',
          chips: ['Wudu check before tawaf', 'Undo a round', 'Nafl tawaf too'], alt: 'The tawaf counter showing round 3 of 7' },
        { shot: 'focus-tawaf', one: true, where: 'Focus mode', icon: 'expand', h3: 'Eyes on the Kaaba, not the screen',
          t: 'Go full-screen and tap anywhere to count. The screen stays awake until you are done.',
          chips: ['Tap anywhere', 'Screen stays awake'], alt: 'Focus mode: a full-screen tawaf counter on round 3 of 7' },
        { shot: 'home-arafah', since: '6.5', where: 'Home, on Hajj', icon: 'hills', h3: 'It knows which day of Hajj it is',
          t: 'From the 8th of Dhul Hijjah, Home shows the rite for the day and when it must happen. On the 9th that is the standing at Arafah, from Dhuhr until sunset.',
          chips: ['Dates you can correct', 'Your camp on every card'], alt: 'Home screen on 9 Dhul Hijjah: stand at Arafah, from Dhuhr until sunset' },
        { shot: 'hajj-counters', where: 'Hajj › Counters', icon: 'stone', h3: 'Seven pebbles, counted per pillar',
          t: 'A counter for each jamrah on each day, with the time window for stoning that day.',
          chips: [], alt: 'The rami counter on 10 Dhul Hijjah at pebble 4 of 7' },
      ],
      more: [
        { shot: 'walk', b: 'Walk me through it', s: 'One step to a screen, with Done and Next.', alt: 'The guided walkthrough, on step 1 of 16' },
        { shot: 'hajj-today', since: '6.5', b: 'A checklist for each day of Hajj', s: 'From the intention on the 8th to the last day of stoning.', alt: 'The Daily screen on the Day of Arafah with the day’s checklist' },
        { shot: 'jamarat', since: '6.9', b: 'The Jamarat, drawn simply', s: 'The three pillars in the order you meet them, and where to pause for dua. Not to scale.', alt: 'A simple sketch of the three Jamarat pillars' },
        ['list', 'Tamattu’, Qiran or Ifrad', 'The steps follow the kind of Hajj you intend.'],
        ['refresh', 'More than one Umrah', 'Record a completed Umrah and start the next.'],
        ['map', 'A map of the mataf', 'Where the Black Stone corner, the Hijr and the Safa exit are.'],
        ['speaker', 'Spoken count', 'On phones with a built-in voice, hear the count through earphones.', '6.8'],
        ['clock', 'Time left on Arafah', 'A countdown to sunset on the 9th.', '6.5'],
        ['stone', 'The stoning window', 'Each day’s time for stoning, and the order if you are making one up.', '6.5'],
        ['hands', 'Stoning on someone’s behalf', 'Count pebbles for the people you are stoning for.', '6.6'],
        ['alert', 'When something goes wrong', 'Lost count, a pebble that missed, a break in wudu: what to do.'],
        ['pen', 'Log it later', 'Could not tap at the time? Add the day afterwards.', '6.6'],
        ['flower', 'If your period starts', 'What changes for the rites, for Umrah and for Hajj.'],
        ['print', 'Print the rites', 'The steps and duas as a page to print or save.'],
      ] },

    // ───────────────────────────── DUAS ─────────────────────────────
    { id: 'duas', nav: 'Duas', noun: 'Duas and dhikr', icon: 'hands', cover: 'duas',
      value: 'The words, when you need them.',
      sub: 'Arabic, transliteration and meaning for the duas of the rites, and a place for your own.',
      beats: [
        { shot: 'duas', where: 'More › Duas', icon: 'speaker', h3: 'Every dua, with a Listen button',
          t: 'The essential duas in Arabic, transliteration and meaning. Tap one to read it full-screen in the Haram, or Listen where your phone has an Arabic voice.',
          chips: [], alt: 'The Duas screen, opening with the Talbiyah' },
        { shot: 'dua-reader', one: true, since: '6.8', where: 'More › Duas', icon: 'hands', h3: 'The duas you were asked to make',
          t: 'Keep a list of your own duas and the ones people asked of you. Read them full-screen, one at a time, and mark each as asked.',
          chips: [], alt: 'A personal dua shown full-screen, number 3 of 5' },
        { shot: 'tools', where: 'Daily › Tools', icon: 'beads', h3: 'A tasbih in your pocket',
          t: 'A dhikr counter with the common phrases and targets of 33, 34, 100 and 1000. On Hajj it adds the Talbiyah, the dua of Arafah and the takbir.',
          chips: [], alt: 'The tasbih counter' },
      ],
      more: [
        ['calendar', 'Duas that follow the day', 'On Hajj, the dua of Arafah comes first on the 9th, and the takbir after it.', '6.5'],
        ['refresh', 'A counter for the dua of Arafah', 'Tap as you repeat it on the day.', '6.5'],
        ['expand', 'Full-screen dhikr', 'The tasbih has a focus mode too.'],
        ['plus', 'Starters for your list', 'Begin with the people who asked you to pray for them.'],
        ['check', 'A new round', 'Asked them all? Start the list again.'],
      ] },

    // ───────────────────────────── TRACK ─────────────────────────────
    { id: 'track', nav: 'Track', noun: 'Tracking', icon: 'chart', cover: 'stats',
      value: 'Make every day there count.',
      sub: 'The days between the rites are the ones that slip away. Miqah gives each of them a shape.',
      beats: [
        { shot: 'today', where: 'Daily › Today', icon: 'clock', h3: 'The day at a glance',
          t: 'Prayer times for Makkah and Madinah, the day’s worship checklist, your hotel and meeting point, and a row for each child’s day.',
          chips: ['Times worked out on the phone when offline'], alt: 'The Daily screen on day 5 of 10 with prayer times and the day’s checklist' },
        { shot: 'ramadan', since: '6.9', where: 'Home, in Ramadan', icon: 'moon', h3: 'Ramadan mode',
          t: 'Travelling in Ramadan? Home counts down to iftar and suhoor, and marks the odd nights of the last ten.',
          chips: [], alt: 'Home screen in Ramadan, counting down to iftar' },
        { shot: 'journal', since: '6.10', where: 'Daily › Today', icon: 'scroll', h3: 'One line a day',
          t: 'A private journal with one line for each day. It stays on your phone and in your backup.',
          chips: [], alt: 'The journal with three one-line entries' },
        { shot: 'keepsake', where: 'After each Umrah or Hajj', icon: 'image', h3: 'A keepsake of the day you did it',
          t: 'Miqah notes the time of each rite as you tick it. When you finish, it becomes an image to keep, with a line from your journal if you choose.',
          chips: [], alt: 'An Umrah keepsake image listing the time of each rite' },
      ],
      more: [
        { shot: 'stats', b: 'Stats and streaks', s: 'The days you logged, and how consistent you were.', alt: 'Trip statistics and a consistency grid' },
        { shot: 'home-after', b: 'Home again', s: 'Thirty days of habits to keep: prayers on time, Quran and dhikr.', alt: 'Home screen after the trip, tracking thirty days of habits' },
        ['check', 'Tick a prayer in one tap', 'Straight from the prayer times row.', '6.8'],
        ['bell', 'Prayer reminders', 'A notice before each prayer, made on the phone.'],
        ['flower', 'Excused days', 'For sisters: prayer and tawaf rows pause without breaking a streak.'],
        ['drop', 'Water', 'A simple tracker for the hot days.'],
        ['list', 'Your Hajj, day by day', 'A record of each day, with a keepsake at the end.', '6.6'],
        ['share', 'Share my progress', 'An image of your trip so far.'],
        ['plane', 'My journeys', 'An archive of past trips, and a start on the next.'],
      ] },

    // ───────────────────────────── EXPLORE ─────────────────────────────
    { id: 'explore', nav: 'Explore', noun: 'Finding your way', icon: 'pin', cover: 'places',
      value: 'Visit with purpose. Find your way back.',
      sub: 'The places worth seeing, what they mean, and how to get there and home again.',
      beats: [
        { shot: 'places', where: 'Places', icon: 'pin', h3: 'Ziyarah with purpose',
          t: 'The sites of Makkah and Madinah, each with what happened there, a practical tip, a one-tap map, and a card to show your driver in Arabic.',
          chips: ['Near me', 'Walking times from your hotel'], alt: 'The Places screen listing sites in Makkah and Madinah' },
        { shot: 'place', where: 'Places', icon: 'info', h3: 'What you need before you go',
          t: 'Where a visit needs a permit, like the Rawdah, Miqah says so, links the official page, and shows the date it last checked.',
          chips: [], alt: 'The Rawdah entry, noting that a free Nusuk permit is required' },
        { shot: 'getting-around', since: '6.9', where: 'Places', icon: 'bus', h3: 'Getting around',
          t: 'The Haramain train, the Makkah and Madinah buses and taxis, and on Hajj the Mashaer metro and the walking routes. Each fact carries the date it was checked. No fares are given, because they change.',
          chips: [], alt: 'The Getting around sheet, open on the Haramain High Speed Railway' },
      ],
      more: [
        { shot: 'qibla', b: 'Qibla compass', s: 'Points to the Kaaba using your phone’s sensors.', alt: 'The qibla compass' },
        { shot: 'boundary', since: '6.9', b: 'Am I inside Arafah?', s: 'How to read the signs that mark Arafah, Muzdalifah and Mina.', alt: 'A sheet explaining the boundary signs of Arafah' },
        ['car', 'Show your driver', 'Any place, in Arabic, on a card to hold up.'],
        ['info', 'Access notes', 'Permits, opening hours, men-only cemeteries and climbs, before you set off.'],
        ['map', 'Route planner', 'Nearest first from your hotel, stop by stop.'],
        ['bus', 'Madinah sightseeing bus', 'The hop-on hop-off stops and routes on one card.'],
        ['tent', 'Save my camp', 'Save where your camp is in Mina, to find it again.', '6.9'],
        ['check', 'Mark visited', 'Keep count of where you have been.'],
      ] },

    // ───────────────────────────── STAY SAFE ─────────────────────────────
    { id: 'safety', nav: 'Safety', noun: 'Staying safe', icon: 'sos', cover: 'lost', coverOne: true, kind: 'cards',
      value: 'When words fail, show the screen.',
      sub: 'Six cards made to be handed to a stranger. Arabic first, your language underneath, and always white so they can be read in full sun.',
      cards: [
        { shot: 'lost', b: 'I’m lost', s: 'Your name, who to call and where you are from. Medical notes only if you choose to show them.', alt: 'The I’m-lost card with Arabic first and a number to call' },
        { shot: 'phrase', since: '6.8', b: 'Show a phrase', s: 'Medical and wayfinding phrases, with Listen where your phone has an Arabic voice.', alt: 'A phrase card reading “I need a doctor” in Arabic and English' },
        { shot: 'child-card', since: '6.8', b: 'If a child is lost', s: 'A card for each child, with your number in large digits.', alt: 'A lost-child card with the parents’ phone number' },
        { shot: 'camp-card', since: '6.9', b: 'My camp in Mina', s: 'Area, street, camp and gate numbers in both languages.', alt: 'The Mina camp card with area, street, camp and gate' },
        { shot: 'driver', b: 'Take me to my hotel', s: 'The hotel’s name in Arabic, with call and map buttons.', alt: 'A card asking a driver to go to the hotel, in Arabic' },
        { shot: 'help', b: 'Emergency numbers', s: '911 and the Saudi help lines, with the date they were last checked.', alt: 'Emergency and help numbers in Saudi Arabia' },
      ],
      more: [
        { shot: 'heat', since: '6.9', b: 'A plan for the heat', s: 'The signs of heatstroke, what to do, and who to call.', alt: 'The heat plan, with emergency numbers at the top' },
        { shot: 'meds', since: '6.8', b: 'Medicine reminders', s: 'Your medicines and their times, with reminders made on the phone.', alt: 'The sheet for adding a medicine and its times' },
        { shot: 'checkin', one: true, since: '6.8', b: 'Hotel check-in', s: 'The questions you need at the desk, in Arabic.', alt: 'A card of hotel check-in phrases in Arabic' },
        ['info', 'About me', 'Country, languages and a contact at home, on the lost card.', '6.8'],
        ['print', 'Pocket cards', 'Print the lost, hotel, camp and child cards for when the phone dies.', '6.8'],
        ['sos', 'Home-screen shortcuts', 'Reach I’m lost and Help from the app icon.', '6.8'],
        ['tent', 'Cards that follow the day', 'On Hajj, the lost and driver cards show your camp, not your hotel.', '6.6'],
        ['pin', 'Family meeting point', 'One place to regroup, shown on the help card.'],
      ] },

    // ───────────────────────────── TOGETHER ─────────────────────────────
    { id: 'together', nav: 'Together', noun: 'Family and group', icon: 'group', cover: 'essentials',
      value: 'Bring the family and the group along.',
      sub: 'Few people make this journey alone. Miqah has something for the children, the parents and the group leader.',
      beats: [
        { shot: 'essentials', since: '6.7', where: 'Home', icon: 'grid', h3: 'A simpler Home for a parent’s phone',
          t: 'Set Miqah up for someone else and Home becomes the status card and four big buttons: count, duas, I’m lost and prayer times.',
          chips: ['Larger text', 'Set up on one sheet'], alt: 'Essentials Home: a status card and four large buttons' },
        { shot: 'kids', where: 'Plan › Quiz', icon: 'kid', h3: 'A quiz made for small hands',
          t: 'Kids’ corner asks big-button questions and can read them aloud.',
          chips: ['Read it to me', 'Stars to earn'], alt: 'A kids’ quiz question with three large answer buttons' },
        { shot: 'story', where: 'Plan › Quiz', icon: 'book', h3: 'Stories for the journey',
          t: 'Read-aloud stories about the rites and the sites for ages 6 to 10, each with a moment to tell it: while you wait for tawaf to begin, for one.',
          chips: [], alt: 'A children’s story about Ibrahim and Isma’il building the Kaaba' },
      ],
      more: [
        ['link', 'Group setup link', 'A leader shares the trip setup. Everyone applies it in one tap, or pastes the link in.'],
        ['share', 'Share the itinerary', 'Send the plan for the days to everyone travelling.'],
        ['star', 'Daily stars', 'Each child earns five a day, apart from your own tracker.'],
        ['book', 'A story at each step', '“Story for the kids” sits inside the rites guide.'],
        ['phone', 'Your group leader on the cards', 'The lost card tells a stranger who to call.'],
      ] },

    // ───────────────────────────── TRUST ─────────────────────────────
    { id: 'trust', nav: 'Trust', noun: 'Trust', icon: 'check', cover: 'sources', kind: 'trust',
      value: 'Every reference numbered. Every changing fact dated.',
      sub: 'A wrong ruling does real harm, so Miqah shows its working. Facts that change, like visas, permits, vaccines, phone numbers and transport, carry the date they were last checked and a link to the official page.',
      cards: [
        { shot: 'sources', since: '6.10', b: 'Sources', s: 'Every hadith and Quran reference in one searchable list, with its number, its grade where one is stated, and where the app uses it.', alt: 'The Sources list of hadith and Quran references' },
        { shot: 'correction', up: 0.86, since: '6.10', b: 'Report a correction', s: 'A button under every article, dua, step and place opens an email with the item already named. Miqah sends nothing itself.', alt: 'The Report a correction sheet' },
        { shot: 'whats-new', since: '6.10', b: 'What’s new', s: 'After each update, a short note says what changed in plain words.', alt: 'The What’s new sheet listing recent changes' },
      ],
      note: '<b>A study companion, not a fatwa service.</b> <span>Citations have been checked against the source texts. Review by a qualified scholar and a native-speaker check of the Arabic phrase cards are still pending, and the app says so. For a ruling on your own situation, ask a scholar you trust.</span>',
      privacy: {
        eyebrow: 'Private by design', h3: 'No account. No ads. No analytics.',
        cells: [
          { icon: 'lock', h: 'Nothing to sign up for', p: 'What you enter is saved in your phone’s own storage. The developer cannot see it.' },
          { icon: 'antenna', h: 'Works with no signal', p: 'Once opened, Miqah runs offline. With a connection it fetches only prayer times, its fonts and its own updates.' },
          { icon: 'disk', h: 'Yours to keep or erase', p: 'Export a backup file whenever you like, import it on a new phone, or reset and wipe everything.' },
        ],
      },
      more: [
        ['calendar', '“Checked” dates', 'Visa, vaccine, permit, phone-number and transport rules show the day they were last checked.', '6.10'],
        ['list', 'An automatic citation check', 'A test fails if any reference in the app is missing from the verified list.', '6.10'],
        ['alert', 'Weak narrations marked', 'Where a weak report is used, the app says so.'],
        ['disk', 'Backups that travel', 'Export to a file, share it, and import it on another phone.', '6.9'],
        ['lock', 'Asks the phone to keep your data', 'So the browser does not clear it when space runs low.', '6.9'],
        ['moon', 'Dark mode', 'Easier on the eyes at night.'],
        ['plus', 'Large text', 'One switch, for tired eyes and small screens.'],
        ['speaker', 'Screen readers', 'Built to work with the phone’s assistive voice.', '6.9'],
      ] },
  ],

  demo: {
    id: 'try', eyebrow: 'Live demo', h2: 'Try it here.',
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
