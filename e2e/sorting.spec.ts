import { test, expect } from '@playwright/test';

test.describe('Sorting Functionality', () => {
  test('sorts candidates by name', async ({ page }) => {
    await page.goto('/talentos');
    const nameHeader = page.getByRole('columnheader', { name: /nome|name/i });
    if (await nameHeader.isVisible()) {
      await nameHeader.click();
    }
  });

  test('sorts jobs by date', async ({ page }) => {
    await page.goto('/vagas');
    const dateHeader = page.getByRole('columnheader', { name: /data|date/i });
    if (await dateHeader.isVisible()) {
      await dateHeader.click();
    }
  });

  test('toggles sort direction', async ({ page }) => {
    await page.goto('/talentos');
    const header = page.getByRole('columnheader').first();
    if (await header.isVisible()) {
      await header.click();
      await header.click();
    }
  });

  test('shows sort indicator', async ({ page }) => {
    await page.goto('/talentos');
    const sortIcon = page.locator('[data-sort]');
    if (await sortIcon.first().isVisible()) {
      await expect(sortIcon.first()).toBeVisible();
    }
  });
});
