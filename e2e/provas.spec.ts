import { test, expect } from '@playwright/test';

test.describe('Provas Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/provas');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/provas'));
  });

  test('should render content', async ({ page }) => {
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
