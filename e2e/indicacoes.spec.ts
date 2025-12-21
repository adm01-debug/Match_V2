import { test, expect } from '@playwright/test';
test.describe('Indicacoes', () => {
  test('loads', async ({ page }) => {
    await page.goto('/indicacoes');
    await expect(page).toHaveURL(/indicacoes/);
  });
});
