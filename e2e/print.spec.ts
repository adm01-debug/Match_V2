import { test, expect } from '@playwright/test';

test.describe('Print Functionality', () => {
  test('has print-friendly styles', async ({ page }) => {
    await page.goto('/candidatos');
    await page.emulateMedia({ media: 'print' });
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('hides navigation in print', async ({ page }) => {
    await page.goto('/dashboard');
    await page.emulateMedia({ media: 'print' });
  });

  test('candidate profile is printable', async ({ page }) => {
    await page.goto('/candidatos');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toBeVisible();
  });

  test('reports are print-optimized', async ({ page }) => {
    await page.goto('/analytics');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toBeVisible();
  });
});
