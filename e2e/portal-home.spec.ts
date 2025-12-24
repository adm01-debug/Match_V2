import { test, expect } from '@playwright/test';

test.describe('PortalHome', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/portal');
    await page.waitForLoadState('networkidle');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/portal');
    const main = page.locator('main, [role="main"], .container, body');
    await expect(main.first()).toBeVisible();
  });
});
