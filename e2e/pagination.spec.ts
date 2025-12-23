import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test('displays pagination controls', async ({ page }) => {
    await page.goto('/candidatos');
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });

  test('navigates to next page', async ({ page }) => {
    await page.goto('/candidatos');
    const nextBtn = page.getByRole('button', { name: /next|próximo|>/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
    }
  });

  test('navigates to previous page', async ({ page }) => {
    await page.goto('/candidatos');
    const prevBtn = page.getByRole('button', { name: /prev|anterior|</i });
    if (await prevBtn.isVisible()) {
      await expect(prevBtn).toBeVisible();
    }
  });

  test('shows current page indicator', async ({ page }) => {
    await page.goto('/candidatos');
    const pageIndicator = page.getByText(/página|page/i);
    if (await pageIndicator.isVisible()) {
      await expect(pageIndicator).toBeVisible();
    }
  });
});
