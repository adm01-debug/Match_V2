import { test, expect } from '@playwright/test';

test.describe('Avaliação Form', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/avaliacao');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
