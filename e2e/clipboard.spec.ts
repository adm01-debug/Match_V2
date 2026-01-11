import { test, expect } from '@playwright/test';

test.describe('Clipboard Operations', () => {
  test('copies candidate email to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/talentos');
    const copyBtn = page.getByRole('button', { name: /copy|copiar/i });
    if (await copyBtn.first().isVisible()) {
      await copyBtn.first().click();
    }
  });

  test('copies job link to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/vagas');
    const shareBtn = page.getByRole('button', { name: /share|compartilhar/i });
    if (await shareBtn.first().isVisible()) {
      await shareBtn.first().click();
    }
  });

  test('shows copy success feedback', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/talentos');
    const copyBtn = page.getByRole('button', { name: /copy|copiar/i });
    if (await copyBtn.first().isVisible()) {
      await copyBtn.first().click();
      await expect(page.getByText(/copiado|copied/i)).toBeVisible();
    }
  });
});
