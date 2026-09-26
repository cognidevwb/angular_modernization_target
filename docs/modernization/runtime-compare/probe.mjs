// Same user journey on two builds of ThingsBoard's UI: log in as the tenant
// admin, then open each screen; per screen: console errors, page errors,
// failed /api calls, visible text, a screenshot.
// usage: node probe.mjs <base-url> <label> <out-dir>
import { createRequire } from 'module';
const require = createRequire(process.env.FREEHAND_NODE + '/node_modules/x.js');
const { chromium } = require('playwright-core');
const [base, label, out] = process.argv.slice(2);
const routes = [
  ['home', '/home'], ['devices', '/devices'], ['assets', '/assets'], ['entity-views', '/entityViews'],
  ['customers', '/customers'], ['customer-users', '/customers/a8b46b30-b9c8-11f1-a5ef-479889dd16ff/users'],
  ['dashboards', '/dashboards'], ['dashboard-view', '/dashboards/a96062a0-b9c8-11f1-a5ef-479889dd16ff'],
  ['widgets-bundles', '/widgets-bundles'], ['rule-chains', '/ruleChains'],
  ['rule-chain', '/ruleChains/a8901a50-b9c8-11f1-a5ef-479889dd16ff'], ['audit-logs', '/auditLogs'], ['profile', '/profile'],
];
const fs = require('fs');
fs.mkdirSync(`${out}/${label}`, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let bucket = { console: [], pageerrors: [], failed: [] };
page.on('console', (m) => { if (m.type() === 'error') bucket.console.push(m.text().slice(0, 400)); });
page.on('pageerror', (e) => bucket.pageerrors.push(String(e.message).slice(0, 400)));
page.on('response', (r) => { if (r.url().includes('/api/') && r.status() >= 400) bucket.failed.push(`${r.status()} ${r.request().method()} ${r.url().replace(base, '')}`); });
const result = { base, label, login: null, screens: [] };
await page.goto(base + '/login', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2000);
const user = page.locator('input[type=email], input[name=username], input[type=text]').first();
const pass = page.locator('input[type=password]').first();
try {
  await user.fill('tenant@thingsboard.org');
  await pass.fill('tenant');
  await pass.press('Enter');
  await page.waitForTimeout(5000);
  result.login = { url: page.url().replace(base, ''), token: await page.evaluate(() => !!localStorage.getItem('jwt_token')), ...bucket };
} catch (e) {
  result.login = { error: String(e.message).slice(0, 300), ...bucket };
}
await page.screenshot({ path: `${out}/${label}/00-after-login.png` });
for (const [name, path] of routes) {
  bucket = { console: [], pageerrors: [], failed: [] };
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(4000);
  const text = (await page.evaluate(() => document.body.innerText || '')).replace(/\s+/g, ' ').trim();
  await page.screenshot({ path: `${out}/${label}/${name}.png` });
  result.screens.push({ name, path, url: page.url().replace(base, ''), textLength: text.length, text: text.slice(0, 600), ...bucket });
}
await browser.close();
fs.writeFileSync(`${out}/${label}.json`, JSON.stringify(result, null, 1));
console.log(JSON.stringify({ label, login: result.login?.url, screens: result.screens.map((s) => `${s.name}:${s.textLength}t/${s.pageerrors.length}pe/${s.console.length}ce/${s.failed.length}f`) }));
