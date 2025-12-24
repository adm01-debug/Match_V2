import { test, expect } from '@playwright/test';

test.describe('Prova Aplicação', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/prova/aplicacao');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
