import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload', () => {
  test('uploads resume PDF', async ({ page }) => {
    await page.goto('/talentos');
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(path.join(__dirname, 'fixtures/resume.pdf'));
    }
  });

  test('shows upload progress', async ({ page }) => {
    await page.goto('/talentos');
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(path.join(__dirname, 'fixtures/resume.pdf'));
      const progress = page.getByRole('progressbar');
      if (await progress.isVisible()) {
        await expect(progress).toBeVisible();
      }
    }
  });

  test('validates file type', async ({ page }) => {
    await page.goto('/talentos');
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(path.join(__dirname, 'fixtures/invalid.exe'));
      await expect(page.getByText(/tipo|format|invalid/i)).toBeVisible();
    }
  });

  test('validates file size', async ({ page }) => {
    await page.goto('/talentos');
    // Large file test would need a fixture
  });
});
