import { test, expect } from '@playwright/test';

test.describe('Pipeline', () => {
  test('should load pipeline page', async ({ page }) => {
    await page.goto('/pipeline');
    await expect(page).toHaveURL(/pipeline/);
  });
});
