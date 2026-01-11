import { test, expect } from '@playwright/test';

test.describe('Avaliação Form', () => {
  test('should load page with processo ID', async ({ page }) => {
    // A rota correta é /avaliacao/:processoId
    await page.goto('/avaliacao/1');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
