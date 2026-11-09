import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/8c0c9b97-b9b2-4aa6-a45c-5807f44c7e89';
const BASE_URL = 'https://vvflorielle.pages.dev';

async function auditLive() {
  const browser = await chromium.launch({ headless: true });

  console.log('--- 1. Testing Live Storefront Mobile (390px) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });

  // Scroll to bottom to view footer
  await mobilePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await mobilePage.waitForTimeout(1000);

  const footerVisible = await mobilePage.locator('footer').isVisible();
  const footerBox = await mobilePage.locator('footer').boundingBox();
  const bodyScrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);

  console.log(`Live Mobile Footer: visible=${footerVisible}, height=${footerBox?.height}, scrollWidth=${bodyScrollWidth}, clientWidth=${clientWidth}`);
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'live_audit_mobile_footer_390.png') });

  console.log('--- 2. Testing Live #admin (No Footer) ---');
  const adminPage = await mobileContext.newPage();
  await adminPage.goto(`${BASE_URL}/#admin`, { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(1000);
  const adminFooterCount = await adminPage.locator('footer').count();
  console.log(`Live #admin Footer Count: ${adminFooterCount}`);
  await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'live_audit_admin_no_footer.png') });

  console.log('--- 3. Testing Live #owner (No Footer) ---');
  const ownerPage = await mobileContext.newPage();
  await ownerPage.goto(`${BASE_URL}/#owner`, { waitUntil: 'networkidle' });
  await ownerPage.waitForTimeout(1000);
  const ownerFooterCount = await ownerPage.locator('footer').count();
  console.log(`Live #owner Footer Count: ${ownerFooterCount}`);
  await ownerPage.screenshot({ path: path.join(ARTIFACT_DIR, 'live_audit_owner_no_footer.png') });

  console.log('--- 4. Testing Live #customer (No Footer) ---');
  const customerPage = await mobileContext.newPage();
  await customerPage.goto(`${BASE_URL}/#customer`, { waitUntil: 'networkidle' });
  await customerPage.waitForTimeout(1000);
  const customerFooterCount = await customerPage.locator('footer').count();
  console.log(`Live #customer Footer Count: ${customerFooterCount}`);
  await customerPage.screenshot({ path: path.join(ARTIFACT_DIR, 'live_audit_customer_no_footer.png') });

  console.log('--- 5. Testing Live Desktop (1280px) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'live_audit_desktop_footer.png') });

  await browser.close();
  console.log('Live audit finished successfully!');
}

auditLive().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
