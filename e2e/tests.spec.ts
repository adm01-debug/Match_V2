import { test, expect } from '@playwright/test';

test.describe('Tests Page', () => {
  test('loads tests page', async ({ page }) => {
    await page.goto('/testes');
    await expect(page).toHaveURL(/testes/);
  });
});
