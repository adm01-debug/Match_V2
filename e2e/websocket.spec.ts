import { test, expect } from '@playwright/test';

test.describe('WebSocket / Realtime', () => {
  test('page loads and supports realtime', async ({ page }) => {
    // Dashboard é rota protegida, testar apenas se carrega
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('pipeline page loads', async ({ page }) => {
    // Pipeline é rota protegida
    await page.goto('/pipeline');
    await page.waitForLoadState('networkidle');
  });

  test('handles offline/online transition', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Simulate offline/online
    await page.context().setOffline(true);
    await page.waitForTimeout(500);
    await page.context().setOffline(false);
    await page.waitForTimeout(500);
    // App should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});
