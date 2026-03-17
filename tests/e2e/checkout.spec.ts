import { test, expect } from '@playwright/test';

/**
 * End-to-End Checkout Tests for Hofherr Meat Co.
 * Covers Registered and Guest purchase flows.
 */
test.describe('Checkout Flows', () => {

  const TEST_USER = {
    email: 'simulated.client@gmail.com',
    password: 'hofherr123',
    name: 'James Peterson',
    phone: '(847) 508-1122'
  };

  test.beforeEach(async ({ page }) => {
    // Start at online orders
    await page.goto('/online-orders');
  });

  test('Registered user can add to cart and purchase (Pay In-Store)', async ({ page }) => {
    // 1. Login first to simulate a registered flow
    await page.goto('/online-orders?login=true');
    await page.locator('#login-email').fill(TEST_USER.email);
    await page.locator('#login-password').fill(TEST_USER.password);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('**/dashboard');
    
    // Go back to shop
    await page.goto('/online-orders');

    // 2. Add the first available item to cart
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    
    // 3. Confirm in modal
    await page.getByRole('button', { name: /add to order/i }).click();

    // Using the "data-cart-icon" selector defined in the Navbar
    await page.locator('[data-cart-icon]').click();

    // 5. Proceed to Checkout
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // 6. Verify Info is pre-filled (since logged in)
    await page.locator('#checkout-name').fill(TEST_USER.name);
    await page.locator('#checkout-email').fill(TEST_USER.email);

    // 7. Select a Pickup Slot
    // Select the first available date if not already selected
    const dateBtn = page.locator('button[class*="dateBtn"]').nth(1);
    await dateBtn.click();
    
    // Select a time slot
    const timeBtn = page.locator('button[class*="timeSlotBtn"]').first();
    await timeBtn.click();

    // 8. Choose "Pay In-Store" to avoid Stripe real payment in test
    await page.getByText('Pay In-Store').click();

    // 9. Place Order
    await page.getByRole('button', { name: /place order/i }).click();

    // 10. Assert Success / Confirmation
    // Assuming redirection to /order/success or a success message
    await expect(page).toHaveURL(/.*success/);
    await expect(page.getByText(/thank you/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /order received/i })).toBeVisible();
  });

  test('Guest can purchase from The Depot without an account', async ({ page }) => {
    // Navigate straight to The Depot
    await page.goto('/online-orders?store=depot');
    
    // 1. Add item to cart (Depot item)
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.getByRole('button', { name: /add to order/i }).click();

    // 2. Open drawer and Proceed
    await page.locator('[data-cart-icon]').click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // 3. Select "Checkout as Guest"
    await page.getByRole('button', { name: /checkout as guest/i }).click();

    // 4. Fill in Guest Info
    await page.locator('#checkout-name').fill('Guest Tester');
    await page.locator('#checkout-email').fill('guest@example.com');
    await page.locator('#checkout-phone').fill('555-0199-222');

    // 5. Select Pickup
    // Depot may have different pickup slots or dates
    const dateBtn = page.locator('button[class*="dateBtn"]').nth(1);
    await dateBtn.click();
    
    // Select a time slot
    await page.locator('button[class*="timeSlotBtn"]').first().click();

    // 6. Select "Pay In-Store"
    await page.getByText('Pay In-Store').click();

    // 7. Complete Purchase
    await page.getByRole('button', { name: /place order/i }).click();

    // 8. Assert Success
    await expect(page).toHaveURL(/.*success/);
    await expect(page.getByRole('heading', { name: /order received/i })).toBeVisible();
  });
});
