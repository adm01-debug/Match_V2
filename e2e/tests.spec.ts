import { test, expect } from '@playwright/test';

test.describe('Tests Page', () => {
  test('should load tests page', async ({ page }) => {
    await page.goto('/testes');
    await expect(page).toHaveURL(/testes/);
  });

  test('should render main content', async ({ page }) => {
    await page.goto('/testes');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });
});
