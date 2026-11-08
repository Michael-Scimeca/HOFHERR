import { test, expect } from '@playwright/test';

/**
 * iPhone visual + menu check.
 *   npm run test:iphone
 * Full-page screenshots land in mobile-screenshots/<device>/<page>.png
 */

const PAGES: { name: string; path: string }[] = [
  { name: 'home', path: '/' },
  { name: 'specials', path: '/specials' },
  { name: 'bbq', path: '/bbq' },
  { name: 'catering', path: '/catering' },
  { name: 'visit', path: '/visit' },
  { name: 'our-story', path: '/our-story' },
  { name: 'gift-cards', path: '/gift-cards' },
  { name: 'online-orders', path: '/online-orders' },
  { name: 'faq', path: '/faq' },
];

test.describe('iPhone screenshots', () => {
  test.describe.configure({ timeout: 90_000 });
  for (const pg of PAGES) {
    test(`screenshot ${pg.name}`, async ({ page, isMobile }, testInfo) => {
      test.skip(!isMobile, 'iPhone projects only');
      await page.goto(pg.path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `mobile-screenshots/${testInfo.project.name.replace(/\s+/g, '-')}/${pg.name}.png`,
        fullPage: true,
      });
    });
  }
});

test.describe('iPhone menu', () => {
  test('mobile hamburger menu opens and closes', async ({ page, isMobile }, testInfo) => {
    test.skip(!isMobile, 'iPhone projects only');
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);

    const toggle = page.locator('header button[aria-label="Toggle menu"]');
    await expect(toggle).toBeVisible();

    const box = await toggle.boundingBox();
    expect(box && box.width >= 40 && box.height >= 40, 'menu button should be at least 40×40 to tap').toBeTruthy();

    await toggle.tap();
    await page.screenshot({
      path: `mobile-screenshots/${testInfo.project.name.replace(/\s+/g, '-')}/menu-open.png`,
    });

    await toggle.tap();
  });
});

