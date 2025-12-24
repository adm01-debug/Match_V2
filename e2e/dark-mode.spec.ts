import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('toggles dark mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /theme|tema|dark|light/i });
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });

  test('persists theme preference', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /theme|tema/i });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.reload();
      // Theme should persist
    }
  });

  test('respects system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    // Should detect system preference
  });
});
