const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/online-orders?login=true');
    await page.locator('#login-email').fill('simulated.client@gmail.com');
    await page.locator('#login-password').fill('hofherr123');
    await page.locator('form.loginFields button[type="submit"]').click();
    await page.waitForTimeout(3000);
    const error = await page.locator('p[class*="authErrorLine"]').textContent().catch(() => null);
    console.log("Error:", error);
    console.log("URL:", page.url());
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
