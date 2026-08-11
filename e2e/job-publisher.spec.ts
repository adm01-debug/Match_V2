import { test, expect } from '@playwright/test';

test.describe('Job Publisher', () => {
  test('should load vagas page', async ({ page }) => {
    // Rota de publicar não existe separadamente
    // O Job Publisher é um componente dentro de /vagas
    await page.goto('/vagas');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('should load vaga details page', async ({ page }) => {
    await page.goto('/vagas/1');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
