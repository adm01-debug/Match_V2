import { test, expect } from '@playwright/test';

test.describe('Job Publisher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vagas/1/publicar');
  });

  test('should display job publishing options', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /publicar vaga/i })).toBeVisible();
  });

  test('should show available job boards', async ({ page }) => {
    await expect(page.getByText(/linkedin/i)).toBeVisible();
    await expect(page.getByText(/indeed/i)).toBeVisible();
    await expect(page.getByText(/catho/i)).toBeVisible();
  });

  test('should allow selecting multiple job boards', async ({ page }) => {
    await page.getByLabel(/linkedin/i).check();
    await page.getByLabel(/indeed/i).check();
    const selected = page.locator('input[type="checkbox"]:checked');
    await expect(selected).toHaveCount(2);
  });

  test('should show job preview before publishing', async ({ page }) => {
    await page.getByRole('button', { name: /visualizar/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/preview da vaga/i)).toBeVisible();
  });

  test('should publish to selected boards', async ({ page }) => {
    await page.getByLabel(/linkedin/i).check();
    await page.getByRole('button', { name: /publicar/i }).click();
    await expect(page.getByText(/vaga publicada/i)).toBeVisible();
  });

  test('should show publishing status for each board', async ({ page }) => {
    await page.getByLabel(/linkedin/i).check();
    await page.getByRole('button', { name: /publicar/i }).click();
    await expect(page.getByText(/publicando/i)).toBeVisible();
  });

  test('should allow scheduling publication', async ({ page }) => {
    await page.getByRole('button', { name: /agendar/i }).click();
    await expect(page.getByLabel(/data de publicação/i)).toBeVisible();
  });

  test('should show estimated reach', async ({ page }) => {
    await page.getByLabel(/linkedin/i).check();
    await page.getByLabel(/indeed/i).check();
    await expect(page.getByText(/alcance estimado/i)).toBeVisible();
  });
});
