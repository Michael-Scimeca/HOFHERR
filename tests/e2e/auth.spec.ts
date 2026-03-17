import { test, expect } from '@playwright/test';

/**
 * End-to-End Authentication Tests for Hofherr Meat Co.
 * Covers Login and Logout flows for registered users.
 */
test.describe('Authentication Flows', () => {
  
  const TEST_USER = {
    email: 'simulated.client@gmail.com',
    password: 'hofherr123',
    name: 'James Peterson'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the online orders page where the login drawer lives
    await page.goto('/online-orders');
  });

  test('Registered user can login successfully', async ({ page }) => {
    // 1. Open the login modal (likely by clicking the profile/cart icon if not logged in)
    // Looking at OnlineOrdersClient, the login drawer is triggered by `setAuthMode('login')`
    // We can trigger it by clicking "Proceed to Checkout" with items, or a login link if present.
    // Let's assume there's a login link in the navbar or sidebar.
    
    // Proactively clicking a "Sign In" link in the navbar
    const signInLink = page.getByRole('link', { name: /sign in/i }).first();
    await signInLink.click();

    // 2. Assert Login form is visible
    await expect(page.getByText('Welcome Back', { exact: false })).toBeVisible();

    // 3. Fill in credentials
    await page.locator('#login-email').fill(TEST_USER.email);
    await page.locator('#login-password').fill(TEST_USER.password);

    // 4. Submit login
    await page.getByRole('button', { name: /log in/i }).click();

    // 5. Assert redirection or success state
    // According to OnlineOrdersClient: if browsing, goes to /dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('Order History')).toBeVisible();
  });

  test('User can logout and session is cleared', async ({ page }) => {
    // First, login to have a session to clear
    await page.goto('/online-orders?login=true');
    await page.locator('#login-email').fill(TEST_USER.email);
    await page.locator('#login-password').fill(TEST_USER.password);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('**/dashboard');

    // 1. Click logout button in dashboard
    await page.getByRole('button', { name: /log out/i }).click();

    // 2. Assert redirected back to online orders (as per dashboard/page.tsx)
    await page.waitForURL('**/online-orders');
    await expect(page).toHaveURL(/.*online-orders/);

    // 3. Verify session is cleared (Check if "Sign In" is visible again)
    // We navigate to dashboard again to see if it redirects us away
    await page.goto('/dashboard');
    // It should redirect to home or online-orders in dev
    await expect(page).not.toHaveURL(/.*dashboard/);
  });
});
