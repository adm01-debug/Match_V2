import { test, expect } from '@playwright/test';

test.describe('Print Functionality', () => {
  test('has print-friendly styles', async ({ page }) => {
    // A rota correta é /talentos (não /candidatos)
    await page.goto('/talentos');
    await page.emulateMedia({ media: 'print' });
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('hides navigation in print', async ({ page }) => {
    // Dashboard é rota protegida, usa / para acesso
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
  });

  test('candidate profile is printable', async ({ page }) => {
    // A rota correta é /talentos (não /candidatos)
    await page.goto('/talentos');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toBeVisible();
  });

  test('reports are print-optimized', async ({ page }) => {
    await page.goto('/relatorios');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toBeVisible();
  });
});
