import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('dashboard renders on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/People Lovers/);
  });

  test('navigation menu works on mobile', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.locator('[data-testid="mobile-menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('forms are usable on mobile', async ({ page }) => {
    await page.goto('/auth');
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });
});
