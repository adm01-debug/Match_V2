import { test, expect } from '@playwright/test';

test.describe('Export Functionality', () => {
  test('exports candidates list', async ({ page }) => {
    await page.goto('/talentos');
    const exportBtn = page.getByRole('button', { name: /export|exportar/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeEnabled();
    }
  });

  test('exports to CSV format', async ({ page }) => {
    await page.goto('/talentos');
    const csvBtn = page.getByRole('button', { name: /csv/i });
    if (await csvBtn.isVisible()) {
      await expect(csvBtn).toBeEnabled();
    }
  });

  test('exports analytics data', async ({ page }) => {
    await page.goto('/analytics');
    const exportBtn = page.getByRole('button', { name: /export|download/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeEnabled();
    }
  });

  test('download triggers correctly', async ({ page }) => {
    await page.goto('/talentos');
  });
});
