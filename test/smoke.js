/* Umrah Strivers smoke tests — run: npm test  (needs Chromium; set CHROME=/path/to/chromium if not auto-detected) */
const path = require('path');
const { chromium } = require('playwright-core');
const URL = 'file://' + path.resolve(__dirname, '../index.html');
const exe = process.env.CHROME || process.env.PLAYWRIGHT_CHROMIUM || (process.env.PLAYWRIGHT_BROWSERS_PATH ? process.env.PLAYWRIGHT_BROWSERS_PATH + '/chromium' : undefined);
const PT = { data: { timings: { Fajr: '05:12', Dhuhr: '12:21', Asr: '15:42', Maghrib: '18:33', Isha: '20:03' }, date: { hijri: { day: '24', month: { en: 'Rabi al-Awwal' }, year: '1448' } } } };
let failed = 0;
function check(name, cond, extra) { console.log((cond ? '  ✓ ' : '  ✗ ') + name + (cond ? '' : '  ' + JSON.stringify(extra || ''))); if (!cond) failed++; }

(async () => {
  const browser = await chromium.launch({ executablePath: exe });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, geolocation: { latitude: 21.42, longitude: 39.83 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.accept());
  await page.route('**/api.aladhan.com/**', r => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(PT) }));
  await page.goto(URL);
  await page.evaluate(() => localStorage.setItem('us-settings', JSON.stringify({ onboarded: true, name: 'Test', dep: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), tripLen: 10, day: 1 })));
  await page.reload(); await page.waitForTimeout(900);

  console.log('Home');
  check('opens on Home', (await page.getAttribute('.view.on', 'id')) === 'view-home');
  check('explains the app + greets by name', (await page.textContent('.hhero h2')).includes('Umrah companion') && (await page.textContent('.hs-t')).includes('Test') && (await page.locator('.stage').count()) === 5);
  check('next prayer loaded', (await page.textContent('#hNext')).includes('in '));
  check('9 quick actions', (await page.locator('.qa').count()) === 9);

  console.log('Plan');
  await page.evaluate(() => { goTab('plan'); goSub('plan', 'prep', true); });
  await page.click('#pw-passport');
  check('checklist ticks', (await page.locator('#pw-passport.done').count()) === 1);
  check('itinerary renders 10 days', (await page.locator('.it').count()) === 10);
  await page.evaluate(() => goSub('plan', 'learn', true));
  check('knowledge accordions', (await page.locator('#histCard .acc').count()) >= 9 && (await page.locator('#qaContainer .acc').count()) === 10 && (await page.locator('#scamContainer .acc').count()) === 10);
  check('flashcards due', (await page.textContent('#fcArea')).includes('Review'));
  await page.evaluate(() => goSub('plan', 'quiz', true));
  check('7 quiz levels, 6 locked', (await page.locator('.lvl').count()) === 7 && (await page.locator('.lvl.locked').count()) === 6);
  await page.click('.lvl >> nth=0');
  const n1 = await page.evaluate(() => QUIZ_LEVELS[0].qs.length);
  for (let k = 0; k < n1; k++) { const c = await page.evaluate(kk => { const q = QUIZ_LEVELS[0].qs[kk]; return q.o ? q.a : (q.a === 0 ? 0 : 1); }, k); await page.click('#qzo-' + c); await page.click('#qzFb .btn'); }
  check('level 1 passed at 100%', (await page.textContent('.qz-final .big')) === '100%');
  await page.click('text=← All levels');
  check('level 2 unlocked', (await page.locator('.lvl.locked').count()) === 5);

  console.log('Umrah');
  await page.evaluate(() => { goTab('umrah'); goSub('umrah', 'count', true); });
  for (let i = 0; i < 7; i++) await page.click('.tapring >> nth=0');
  check('tawaf counter reaches 7', (await page.textContent('#tawafN')) === '7' && await page.isVisible('#tawafDone'));
  await page.evaluate(() => { togRite('niyyah'); for (let i = 0; i < 7; i++) cntr('sai', 1); togRite('cut'); });
  check('timeline stamped', (await page.locator('#logArea .lg.on').count()) === 6);
  await page.click('text=⛶ Focus >> nth=0');
  check('focus mode opens', (await page.locator('#focus.on').count()) === 1);
  await page.click('text=✕ Exit');
  await page.evaluate(() => goSub('umrah', 'steps', true));
  await page.click('#rw-ghusl .why');
  check('why explainer toggles', (await page.locator('#rw-ghusl .whyb.on').count()) === 1);
  const dl1 = page.waitForEvent('download', { timeout: 6000 }).catch(() => null);
  await page.click('button.btn.gold:has-text("Record completed Umrah")'); await page.waitForTimeout(300);
  await page.evaluate(() => goSub('umrah', 'steps', true)); await page.click('#umrahsArea .chip-btn');
  check('umrah recorded + keepsake downloads', (await page.evaluate(() => ST.umrahs)) === 1 && !!(await dl1));

  console.log('Daily');
  await page.evaluate(() => { goTab('daily'); goSub('daily', 'today', true); }); await page.waitForTimeout(500);
  check('prayer grid 5 cells + next highlighted', (await page.locator('.pt').count()) === 5 && (await page.locator('.pt.next').count()) === 1);
  await page.click('#dw-fajr');
  check('daily tick + streak', (await page.textContent('#skFajrN')) === '1');
  await page.evaluate(() => goSub('daily', 'tools', true));
  for (let i = 0; i < 33; i++) await page.click('.tb-btn');
  check('tasbih cycle advances phrase', (await page.locator('.tb-chip.on').textContent()) === 'Alhamdulillah');
  await page.fill('#duaIn', 'Test dua'); await page.press('#duaIn', 'Enter'); await page.click('#duaList .tick');
  check('dua list add + tick', (await page.textContent('#duaList')).includes('1 of 1 asked'));
  await page.click('text=＋ cup');
  check('water counter', (await page.textContent('#waterLbl')).startsWith('1 of 8'));
  await page.evaluate(() => startQibla()); await page.waitForTimeout(800);
  check('qibla bearing computed', /\d+°/.test(await page.textContent('#qbDeg')));
  await page.evaluate(() => goSub('daily', 'stats', true));
  const dl2 = page.waitForEvent('download', { timeout: 6000 }).catch(() => null);
  await page.click('text=Share my progress card');
  check('progress card downloads', !!(await dl2));

  console.log('Places');
  await page.evaluate(() => goTab('places'));
  check('51 places', (await page.locator('.place').count()) === 51);
  check('tour card with 12 stops', (await page.locator('.stopchip').count()) === 12);
  await page.click('text=Set hotel here'); await page.waitForTimeout(500);
  check('distance chips from hotel', (await page.locator('.distchip').count()) > 30);
  await page.click('text=Plan a ziyarah route for Makkah');
  check('route planner', (await page.locator('#route-makkah .lg').count()) === 8);
  await page.fill('#plSearch', 'quba');
  check('search', (await page.locator('.place').count()) >= 1 && (await page.locator('#pl-quba').count()) === 1);

  console.log('More');
  await page.evaluate(() => { goTab('more'); goSub('more', 'duas', true); });
  check('8 duas with audio buttons', (await page.locator('.duacard').count()) === 8 && (await page.locator('.duacard .say').count()) === 8);
  await page.evaluate(() => goSub('more', 'guide', true));
  await page.click('#postSw');
  check('post-umrah 90 habit chips', (await page.locator('.pchip').count()) === 90);

  console.log('Persistence');
  await page.reload(); await page.waitForTimeout(700);
  check('state survives reload', (await page.evaluate(() => ST.umrahs)) === 1 && (await page.evaluate(() => JSON.parse(localStorage.getItem('us-plan')).passport)) === true);
  check('no JS errors', errors.length === 0, errors);
  await browser.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
