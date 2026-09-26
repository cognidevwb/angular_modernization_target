// Interactions on either build: open a device's details, open the Add Device dialog and cancel,
// open a widgets bundle. Per step: console errors, page errors, failed /api calls, a screenshot.
// usage: node probe-interactions.mjs <base-url> <label> <out-dir>
import { createRequire } from 'module';
const require = createRequire(process.env.FREEHAND_NODE + '/node_modules/x.js');
const { chromium } = require('playwright-core');
const fs = require('fs');
const [base, label, out] = process.argv.slice(2);
fs.mkdirSync(`${out}/${label}-ix`, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let bucket = { console: [], pageerrors: [], failed: [] };
page.on('console', (m) => { if (m.type() === 'error') bucket.console.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => bucket.pageerrors.push(String(e.message).slice(0, 300)));
page.on('response', (r) => { if (r.url().includes('/api/') && r.status() >= 400) bucket.failed.push(`${r.status()} ${r.request().method()} ${r.url().replace(base, '')}`); });
const steps = [];
const text = async () => (await page.evaluate(() => document.body.innerText || '')).replace(/\s+/g, ' ').trim();
async function step(name, fn) {
  bucket = { console: [], pageerrors: [], failed: [] };
  let error = null;
  try { await fn(); } catch (e) { error = String(e.message).split('\n')[0].slice(0, 200); }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${label}-ix/${name}.png` });
  const t = await text();
  steps.push({ name, error, textLength: t.length, text: t.slice(0, 400), ...bucket });
}
await page.goto(base + '/login', { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(1500);
await page.locator('input[type=email], input[name=username], input[type=text]').first().fill('tenant@thingsboard.org');
await page.locator('input[type=password]').first().fill('tenant');
await page.locator('input[type=password]').first().press('Enter');
await page.waitForTimeout(4000);
await step('devices', async () => { await page.goto(base + '/devices', { waitUntil: 'networkidle' }); await page.waitForTimeout(2500); });
await step('device-details', async () => { await page.locator('.tb-card-item').filter({ hasText: 'Thermostat T1' }).first().click({ position: { x: 150, y: 150 } }); await page.waitForTimeout(2500); });
await step('device-details-attributes', async () => { await page.getByRole('tab', { name: /attributes/i }).first().click(); await page.waitForTimeout(2500); });
await step('device-details-closed', async () => { await page.locator('.tb-sidenav-details button').filter({ hasText: 'close' }).first().click(); await page.waitForTimeout(1500); });
await step('add-device-dialog', async () => {
  await page.locator('section.tb-footer-buttons button.tb-btn-footer[aria-label="Add"]').first().click();
  await page.waitForTimeout(1000);
  if (!(await page.locator('md-dialog, mat-dialog-container').count())) {
    // the add button opens a speed dial; its first action adds one device
    await page.locator('section.tb-footer-buttons button[aria-label="Add"]:not(.tb-btn-footer)').first().click();
  }
  await page.waitForTimeout(2000);
});
await step('add-device-cancelled', async () => { await page.locator('mat-dialog-container button, md-dialog button').filter({ hasText: /cancel/i }).first().click(); await page.waitForTimeout(1500); });
await step('widgets-bundles', async () => { await page.goto(base + '/widgets-bundles', { waitUntil: 'networkidle' }); await page.waitForTimeout(2500); });
await step('widgets-bundle-open', async () => { await page.locator('.tb-card-item').filter({ hasText: 'Charts' }).first().click({ position: { x: 150, y: 40 } }); await page.waitForTimeout(5000); });
await browser.close();
fs.writeFileSync(`${out}/${label}-ix.json`, JSON.stringify(steps, null, 1));
console.log(JSON.stringify(steps.map((s) => `${s.name}:${s.error ? 'ERR(' + s.error + ')' : 'ok'} ${s.textLength}t/${s.pageerrors.length}pe/${s.console.length}ce/${s.failed.length}f`)));
