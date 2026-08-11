import { test, expect } from '@playwright/test';

test.describe('Portal Perfil', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/portal/perfil');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
