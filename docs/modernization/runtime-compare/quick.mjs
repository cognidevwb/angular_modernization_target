// quick debug: login, then visit given paths; prints all errors with full stacks and non-2xx responses
import { createRequire } from 'module';
const require = createRequire(process.env.FREEHAND_NODE + '/node_modules/x.js');
const { chromium } = require('playwright-core');
const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const seen = new Set();
const short = (t) => t.split('\n').slice(0, +(process.env.DEPTH || 4)).map((l) => l.replace(/http:\/\/localhost:4200\/@fs\/[^ )]*\/deps\//, 'deps/').replace(/\?v=\w+/, '')).join('\n');
const log = (k, t) => { const s = short(t); if (seen.has(s)) return; seen.add(s); console.log(k, s); };
page.on('console', (m) => { if (m.type() === 'error') log('CONSOLE', m.text()); });
page.on('pageerror', (e) => log('PAGEERR', e.stack || e.message));
page.on('response', (r) => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await page.goto(base + '/login', { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(1500);
await page.locator('input[type=email], input[name=username], input[type=text]').first().fill('tenant@thingsboard.org');
await page.locator('input[type=password]').first().fill('tenant');
await page.locator('input[type=password]').first().press('Enter');
await page.waitForTimeout(4000);
console.log('AFTER LOGIN', page.url());
for (const p of paths) {
  console.log('==== ', p);
  await page.goto(base + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const text = (await page.evaluate(() => document.body.innerText || '')).replace(/\s+/g, ' ').trim();
  console.log('URL', page.url(), 'TEXT', text.length, text.slice(0, 300));
  await page.screenshot({ path: `/tmp/q-${p.replace(/\W/g, '_')}.png` });
}
await browser.close();
