import { test, expect } from '@playwright/test';
test.describe('Admin', () => {
  test('loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/admin/);
  });
});
