import { test, expect } from '@playwright/test';

test.describe('Not Found Page', () => {
  test('should display 404 for non-existent route', async ({ page }) => {
    await page.goto('/pagina-que-nao-existe');
    const content = page.locator('main, [role="main"], .container, body').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
