import { test, expect } from '@playwright/test';

test.describe('Portal Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portal/auth');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/portal/auth'));
  });

  test('should render content', async ({ page }) => {
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
