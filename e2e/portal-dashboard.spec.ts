import { test, expect } from '@playwright/test';

test.describe('Portal Dashboard', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/portal/dashboard');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
