import { test, expect } from '@playwright/test';

test.describe('Not Found Page', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/404');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
