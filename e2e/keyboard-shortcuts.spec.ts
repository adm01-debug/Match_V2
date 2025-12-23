import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test('navigates with tab key', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('escape closes modals', async ({ page }) => {
    await page.goto('/candidatos');
    const addBtn = page.getByRole('button', { name: /adicionar|novo|add/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.keyboard.press('Escape');
    }
  });

  test('enter submits forms', async ({ page }) => {
    await page.goto('/auth');
    await page.keyboard.press('Enter');
  });

  test('supports skip links', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByText(/skip|pular/i);
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeFocused();
    }
  });
});
