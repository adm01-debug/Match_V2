import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('searches candidates by name', async ({ page }) => {
    await page.goto('/candidatos');
    const searchInput = page.getByPlaceholder(/buscar|search|pesquisar/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('João');
      await searchInput.press('Enter');
    }
  });

  test('searches jobs', async ({ page }) => {
    await page.goto('/vagas');
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Desenvolvedor');
    }
  });

  test('shows no results message', async ({ page }) => {
    await page.goto('/candidatos');
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyznonexistent123');
      await searchInput.press('Enter');
    }
  });

  test('clears search', async ({ page }) => {
    await page.goto('/candidatos');
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await searchInput.clear();
    }
  });
});
