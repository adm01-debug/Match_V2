import { test, expect } from '@playwright/test';

test.describe('Match ATS E2E', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Match/);
  });

  test('should navigate to auth page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('form')).toBeVisible();
  });

  test('should show vagas list', async ({ page }) => {
    await page.goto('/vagas');
    await expect(page.locator('h1, h2')).toBeVisible();
  });
});
