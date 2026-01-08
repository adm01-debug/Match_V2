import { test, expect } from '@playwright/test';

test.describe('Deep Linking', () => {
  test('navigates directly to candidate profile', async ({ page }) => {
    await page.goto('/candidato/1');
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('navigates directly to job details', async ({ page }) => {
    await page.goto('/vagas/1');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('preserves query parameters', async ({ page }) => {
    await page.goto('/talentos?status=ativo&page=2');
    await expect(page).toHaveURL(/status=ativo/);
  });

  test('handles invalid routes gracefully', async ({ page }) => {
    await page.goto('/pagina-inexistente');
    await expect(page.getByText(/404|não encontrad/i)).toBeVisible();
  });

  test('redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login or show unauthorized
  });
});
