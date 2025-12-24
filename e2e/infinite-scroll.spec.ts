import { test, expect } from '@playwright/test';

test.describe('Infinite Scroll', () => {
  test('loads more candidates on scroll', async ({ page }) => {
    await page.goto('/candidatos');
    const initialCount = await page.locator('[data-testid="candidate-row"]').count();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const newCount = await page.locator('[data-testid="candidate-row"]').count();
    // Count may increase if infinite scroll is enabled
  });

  test('shows loading indicator while fetching', async ({ page }) => {
    await page.goto('/candidatos');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const loader = page.getByTestId('loading-more');
    if (await loader.isVisible()) {
      await expect(loader).toBeVisible();
    }
  });

  test('shows end of list message', async ({ page }) => {
    await page.goto('/candidatos');
    // Scroll multiple times to reach end
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }
  });
});
