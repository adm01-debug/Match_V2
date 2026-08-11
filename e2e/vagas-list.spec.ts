import { test, expect } from '@playwright/test';

test.describe('VagasList', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/vagas');
    await page.waitForLoadState('networkidle');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/vagas');
    const main = page.locator('main, [role="main"], .container, body');
    await expect(main.first()).toBeVisible();
  });
});
