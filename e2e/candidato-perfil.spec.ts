import { test, expect } from '@playwright/test';

test.describe('Candidato Perfil', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/candidato/1');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
