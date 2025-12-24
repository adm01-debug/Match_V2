import { test, expect } from '@playwright/test';

test.describe('Tests Page', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/tests');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
