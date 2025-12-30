import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics');
  });

  test('should display analytics dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  });

  test('should show key metrics cards', async ({ page }) => {
    await expect(page.getByText(/tempo médio de contratação/i)).toBeVisible();
    await expect(page.getByText(/taxa de conversão/i)).toBeVisible();
    await expect(page.getByText(/vagas abertas/i)).toBeVisible();
  });

  test('should allow date range selection', async ({ page }) => {
    await page.getByRole('button', { name: /período/i }).click();
    await page.getByText(/últimos 30 dias/i).click();
    await expect(page.getByText(/30 dias/i)).toBeVisible();
  });

  test('should display time to hire chart', async ({ page }) => {
    await expect(page.locator('[data-testid="time-to-hire-chart"]')).toBeVisible();
  });

  test('should display source analytics', async ({ page }) => {
    await expect(page.getByText(/fontes de candidatos/i)).toBeVisible();
  });

  test('should show recruiter leaderboard', async ({ page }) => {
    await page.getByRole('tab', { name: /recrutadores/i }).click();
    await expect(page.getByText(/ranking/i)).toBeVisible();
  });

  test('should allow exporting data', async ({ page }) => {
    await page.getByRole('button', { name: /exportar/i }).click();
    await expect(page.getByText(/csv/i)).toBeVisible();
    await expect(page.getByText(/excel/i)).toBeVisible();
  });

  test('should show pipeline velocity', async ({ page }) => {
    await page.getByRole('tab', { name: /pipeline/i }).click();
    await expect(page.getByText(/velocidade/i)).toBeVisible();
  });

  test('should display diversity metrics', async ({ page }) => {
    await page.getByRole('tab', { name: /diversidade/i }).click();
    await expect(page.getByText(/índice de diversidade/i)).toBeVisible();
  });
});
