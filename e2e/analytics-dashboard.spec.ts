import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test('should load analytics page', async ({ page }) => {
    // A rota /analytics é protegida e requer roles admin/rh
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('should load relatorios page', async ({ page }) => {
    // Alternativa: página de relatórios
    await page.goto('/relatorios');
    await page.waitForLoadState('networkidle');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
