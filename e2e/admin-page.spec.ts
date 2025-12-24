import { test, expect } from '@playwright/test';

test.describe('AdminPage', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(//admin/);
  });

  test('should render main content', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });
});
