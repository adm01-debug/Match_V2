import { test, expect } from '@playwright/test';

test.describe('Portal Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    // A rota correta é /portal (não /portal/auth)
    await page.goto('/portal');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/portal'));
  });

  test('should render content', async ({ page }) => {
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('should show login form', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });
});
