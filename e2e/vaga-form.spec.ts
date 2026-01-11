import { test, expect } from '@playwright/test';

test.describe('Vaga Form', () => {
  test('should load page', async ({ page }) => {
    // A rota correta é /vagas/nova (não /vaga/nova)
    await page.goto('/vagas/nova');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
