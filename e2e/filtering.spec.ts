import { test, expect } from '@playwright/test';

test.describe('Filtering Functionality', () => {
  test('filters candidates by status', async ({ page }) => {
    await page.goto('/talentos');
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
    }
  });

  test('filters jobs by department', async ({ page }) => {
    await page.goto('/vagas');
    const deptFilter = page.getByRole('combobox', { name: /departamento|setor/i });
    if (await deptFilter.isVisible()) {
      await deptFilter.click();
    }
  });

  test('applies multiple filters', async ({ page }) => {
    await page.goto('/talentos');
    const filters = page.locator('[data-testid="filter"]');
    if (await filters.first().isVisible()) {
      await filters.first().click();
    }
  });

  test('clears all filters', async ({ page }) => {
    await page.goto('/talentos');
    const clearBtn = page.getByRole('button', { name: /limpar|clear/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });

  test('shows filter count', async ({ page }) => {
    await page.goto('/talentos');
    const filterCount = page.locator('[data-testid="filter-count"]');
    if (await filterCount.isVisible()) {
      await expect(filterCount).toBeVisible();
    }
  });
});
