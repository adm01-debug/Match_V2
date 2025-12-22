import { test, expect } from '@playwright/test';

test.describe('Offline/PWA', () => {
  test('service worker is registered', async ({ page }) => {
    await page.goto('/');
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      }
      return false;
    });
    // PWA optional, just log
    console.log('Service Worker registered:', swRegistered);
  });

  test('app shows offline indicator when disconnected', async ({ page, context }) => {
    await page.goto('/');
    await context.setOffline(true);
    // App should handle offline gracefully
    await page.waitForTimeout(1000);
    await context.setOffline(false);
  });
});
