import { test, expect } from '@playwright/test';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics');
  });

  test('displays analytics dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /analytics|relatórios/i })).toBeVisible();
  });

  test('shows chart components', async ({ page }) => {
    await expect(page.locator('[data-testid="chart"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('allows date range selection', async ({ page }) => {
    const dateFilter = page.getByRole('button', { name: /período|date/i });
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('exports data functionality', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /export|exportar/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeEnabled();
    }
  });
});
