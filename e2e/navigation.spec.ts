import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main routes', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation links exist
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
