import { test, expect } from '@playwright/test';

test.describe('Candidatos', () => {
  test('should load candidatos page', async ({ page }) => {
    await page.goto('/talentos');
    await expect(page).toHaveURL(/talentos/);
  });
});
