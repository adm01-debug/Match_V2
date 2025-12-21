import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'invalid');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-destructive, .error')).toBeVisible();
  });
});
