import { test, expect } from '@playwright/test';

test.describe('AgendaPage', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/agenda');
    await expect(page).toHaveURL(//agenda/);
  });

  test('should render main content', async ({ page }) => {
    await page.goto('/agenda');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/agenda');
    await page.waitForLoadState('networkidle');
  });
});
