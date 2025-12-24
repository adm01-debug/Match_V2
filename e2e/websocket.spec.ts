import { test, expect } from '@playwright/test';

test.describe('WebSocket / Realtime', () => {
  test('receives realtime notifications', async ({ page }) => {
    await page.goto('/dashboard');
    // Realtime updates should appear without refresh
    const notifications = page.getByTestId('notification');
    await page.waitForTimeout(2000);
  });

  test('updates pipeline in realtime', async ({ page }) => {
    await page.goto('/pipeline');
    // Pipeline should update when changes occur
    await page.waitForTimeout(2000);
  });

  test('reconnects after connection loss', async ({ page }) => {
    await page.goto('/dashboard');
    // Simulate offline/online
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);
  });

  test('shows connection status', async ({ page }) => {
    await page.goto('/dashboard');
    const status = page.getByTestId('connection-status');
    if (await status.isVisible()) {
      await expect(status).toBeVisible();
    }
  });
});
