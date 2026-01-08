import { test, expect } from '@playwright/test';

test.describe('Resume Parser', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/parser-curriculo');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
