import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('page load time should be under 3s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });

  test('LCP should be under 2.5s', async ({ page }) => {
    await page.goto('/');
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries[entries.length - 1]?.startTime || 0);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });
    expect(lcp).toBeLessThan(2500);
  });
});
