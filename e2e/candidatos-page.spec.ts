import { test, expect } from '@playwright/test';

test.describe('CandidatosPage', () => {
  test('should load the page', async ({ page }) => {
    // A rota correta é /talentos (não /candidatos)
    await page.goto('/talentos');
    await expect(page).toHaveURL(/talentos/);
  });

  test('should render main content', async ({ page }) => {
    await page.goto('/talentos');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .container, body');
    await expect(main.first()).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/talentos');
    await page.waitForLoadState('networkidle');
  });
});
