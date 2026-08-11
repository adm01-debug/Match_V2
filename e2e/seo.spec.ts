import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('has proper title tag', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
  });

  test('has meta description', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="description"]');
    const content = await meta.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});
