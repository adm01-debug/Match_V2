import { test, expect } from '@playwright/test';

test.describe('Vaga Form', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/vaga/nova');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
