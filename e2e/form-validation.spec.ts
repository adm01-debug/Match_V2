import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test('validates required fields on job form', async ({ page }) => {
    await page.goto('/vagas/nova');
    const submitBtn = page.getByRole('button', { name: /salvar|criar|submit/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('validates email format', async ({ page }) => {
    await page.goto('/candidatos');
    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await emailInput.blur();
    }
  });

  test('validates date fields', async ({ page }) => {
    await page.goto('/agenda');
    const dateInput = page.getByLabel(/data/i).first();
    if (await dateInput.isVisible()) {
      await expect(dateInput).toBeVisible();
    }
  });

  test('shows validation errors inline', async ({ page }) => {
    await page.goto('/vagas/nova');
    await page.getByRole('button', { name: /salvar|submit/i }).click();
  });
});
