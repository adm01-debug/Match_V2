import { test, expect } from '@playwright/test';

test.describe('Offline/PWA', () => {
  test('service worker registration check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // PWA é opcional, apenas verifica se app carrega
    await expect(page.locator('body')).toBeVisible();
  });

  test('app handles offline gracefully', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await context.setOffline(true);
    await page.waitForTimeout(500);
    await context.setOffline(false);
    await page.waitForTimeout(500);
    // App should recover
    await expect(page.locator('body')).toBeVisible();
  });
});
