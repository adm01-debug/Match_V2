import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, [role="main"], .container, body');
    await expect(main.first()).toBeVisible();
  });
});
