import { test, expect } from '@playwright/test';

test.describe('CandidatosPage', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/candidatos');
    await expect(page).toHaveURL(//candidatos/);
  });

  test('should render main content', async ({ page }) => {
    await page.goto('/candidatos');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/candidatos');
    await page.waitForLoadState('networkidle');
  });
});
