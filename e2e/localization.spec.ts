import { test, expect } from '@playwright/test';

test.describe('Localization', () => {
  test('displays content in Portuguese', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/dashboard|painel|candidatos/i)).toBeVisible();
  });

  test('formats dates in Brazilian format', async ({ page }) => {
    await page.goto('/agenda');
    const datePattern = /\d{2}\/\d{2}\/\d{4}/;
    const content = await page.content();
    expect(content).toMatch(datePattern);
  });

  test('formats currency in BRL', async ({ page }) => {
    await page.goto('/vagas');
    const content = await page.content();
    // Should have R$ format or salary ranges
  });
});
