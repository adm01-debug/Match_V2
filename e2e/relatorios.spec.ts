import { test, expect } from '@playwright/test';
test.describe('Relatorios', () => {
  test('loads', async ({ page }) => {
    await page.goto('/relatorios');
    await expect(page).toHaveURL(/relatorios/);
  });
});
