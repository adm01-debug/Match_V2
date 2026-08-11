import { test, expect } from '@playwright/test';

test.describe('Prova Editor', () => {
  test('should load new prova page', async ({ page }) => {
    await page.goto('/testes/nova');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('should load edit prova page', async ({ page }) => {
    await page.goto('/testes/1/editar');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
