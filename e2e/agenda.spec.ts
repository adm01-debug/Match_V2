import { test, expect } from '@playwright/test';

test.describe('Agenda', () => {
  test('loads agenda page', async ({ page }) => {
    await page.goto('/agenda');
    await expect(page).toHaveURL(/agenda/);
  });
});
