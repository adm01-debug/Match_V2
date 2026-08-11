import { test, expect } from '@playwright/test';

test.describe('Vaga Detalhes', () => {
  test('should load page', async ({ page }) => {
    // A rota correta é /vagas/:id (não /vaga/:id)
    await page.goto('/vagas/1');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
