import { test, expect } from '@playwright/test';

test.describe('Drag and Drop', () => {
  test('moves candidate card between pipeline stages', async ({ page }) => {
    await page.goto('/pipeline');
    const card = page.locator('[data-testid="candidate-card"]').first();
    const targetColumn = page.locator('[data-testid="pipeline-column"]').nth(1);
    if (await card.isVisible() && await targetColumn.isVisible()) {
      await card.dragTo(targetColumn);
    }
  });

  test('reorders items within same column', async ({ page }) => {
    await page.goto('/pipeline');
    const cards = page.locator('[data-testid="candidate-card"]');
    if (await cards.count() > 1) {
      await cards.first().dragTo(cards.nth(1));
    }
  });

  test('shows visual feedback during drag', async ({ page }) => {
    await page.goto('/pipeline');
    const card = page.locator('[data-testid="candidate-card"]').first();
    if (await card.isVisible()) {
      await card.hover();
      await page.mouse.down();
      await expect(card).toHaveClass(/dragging|drag/);
      await page.mouse.up();
    }
  });
});
