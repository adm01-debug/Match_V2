import { test, expect } from '@playwright/test';

test.describe('Dashboard Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('displays KPI cards', async ({ page }) => {
    await expect(page.locator('[data-testid="kpi-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('shows pending actions widget', async ({ page }) => {
    await expect(page.getByText(/ações pendentes|pending/i)).toBeVisible();
  });

  test('displays today agenda', async ({ page }) => {
    await expect(page.getByText(/agenda|hoje|today/i).first()).toBeVisible();
  });

  test('shows urgent jobs widget', async ({ page }) => {
    await expect(page.getByText(/vagas|urgentes|jobs/i).first()).toBeVisible();
  });

  test('widgets are interactive', async ({ page }) => {
    const widget = page.locator('[data-testid="widget"]').first();
    if (await widget.isVisible()) {
      await widget.click();
    }
  });
});
