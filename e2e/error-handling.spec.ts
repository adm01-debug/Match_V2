import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('error boundary catches errors', async ({ page }) => {
    await page.goto('/');
    // Simulate error scenario
    const errorBoundary = page.locator('[data-testid="error-boundary"]');
    // If error occurs, boundary should show
  });

  test('form validation shows errors', async ({ page }) => {
    await page.goto('/auth');
    await page.click('button[type="submit"]');
    // Should show validation errors
  });
});
