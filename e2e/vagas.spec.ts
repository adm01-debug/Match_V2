import { test, expect } from '@playwright/test';

test.describe('Vagas', () => {
  test('should load vagas page', async ({ page }) => {
    await page.goto('/vagas');
    await expect(page).toHaveURL(/vagas/);
  });

  test('should have create vaga button', async ({ page }) => {
    await page.goto('/vagas');
    await expect(page.getByRole('link', { name: /nova|criar/i })).toBeVisible();
  });
});
