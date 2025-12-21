import { test, expect } from '@playwright/test';

test.describe('Comunicacao', () => {
  test('loads comunicacao page', async ({ page }) => {
    await page.goto('/comunicacao');
    await expect(page).toHaveURL(/comunicacao/);
  });
});
