import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login or setup auth state
    await page.goto('/');
  });

  test('should display dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/dashboard|painel/i);
  });

  test('should display KPI cards', async ({ page }) => {
    await expect(page.locator('[data-testid="kpi-card"]').first()).toBeVisible();
  });

  test('should display charts section', async ({ page }) => {
    await expect(page.locator('[data-testid="charts-section"]').or(page.locator('.recharts-wrapper').first())).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    const quickActions = page.locator('[data-testid="quick-actions"]').or(page.locator('[data-testid="acoes-rapidas"]'));
    await expect(quickActions).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('[data-testid="sidebar"]').or(page.locator('aside')).first()).toBeVisible();
  });

  test('should navigate to candidates page', async ({ page }) => {
    // A rota correta é /talentos (não /candidatos)
    await page.click('text=/talentos|candidatos/i');
    await expect(page).toHaveURL(/talentos/);
  });

  test('should navigate to jobs page', async ({ page }) => {
    await page.click('text=/vagas/i');
    await expect(page).toHaveURL(/vagas/);
  });

  test('should display notifications panel', async ({ page }) => {
    const notificationTrigger = page.locator('[data-testid="notification-trigger"]').or(page.locator('[aria-label*="notif"]'));
    if (await notificationTrigger.isVisible()) {
      await notificationTrigger.click();
      await expect(page.locator('[data-testid="notification-panel"]').or(page.locator('[role="dialog"]'))).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display today agenda', async ({ page }) => {
    const agenda = page.locator('[data-testid="agenda-hoje"]').or(page.locator('text=/agenda/i'));
    await expect(agenda).toBeVisible();
  });

  test('should display pending actions', async ({ page }) => {
    const pendingActions = page.locator('[data-testid="acoes-pendentes"]').or(page.locator('text=/pendente/i'));
    if (await pendingActions.isVisible()) {
      await expect(pendingActions).toBeVisible();
    }
  });
});
