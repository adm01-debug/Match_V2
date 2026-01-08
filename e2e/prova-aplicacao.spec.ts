import { test, expect } from '@playwright/test';

test.describe('Prova Aplicação', () => {
  test('should load prova aplicação page', async ({ page }) => {
    await page.goto('/testes/1/aplicar');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
