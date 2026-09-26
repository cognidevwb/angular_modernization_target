// login to base, go to path, evaluate a JS expression file, print JSON
import { createRequire } from 'module';
const require = createRequire(process.env.FREEHAND_NODE + '/node_modules/x.js');
const { chromium } = require('playwright-core');
const fs = require('fs');
const [base, path, exprFile] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + '/login', { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(1500);
await page.locator('input[type=email], input[name=username], input[type=text]').first().fill('tenant@thingsboard.org');
await page.locator('input[type=password]').first().fill('tenant');
await page.locator('input[type=password]').first().press('Enter');
await page.waitForTimeout(4000);
await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
await page.waitForTimeout(3000);
const out = await page.evaluate(fs.readFileSync(exprFile, 'utf8'));
console.log(JSON.stringify(out, null, 1));
await browser.close();
