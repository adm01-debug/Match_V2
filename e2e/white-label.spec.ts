import { test, expect } from '@playwright/test';

test.describe('White Label Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/white-label');
  });

  test('should display white label configuration page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /white label/i })).toBeVisible();
  });

  test('should allow changing company name', async ({ page }) => {
    const input = page.getByLabel(/nome da empresa/i);
    await input.fill('Minha Empresa ATS');
    await page.getByRole('button', { name: /salvar/i }).click();
    await expect(page.getByText(/configurações salvas/i)).toBeVisible();
  });

  test('should allow uploading logo', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'logo.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    });
    await expect(page.getByText(/logo enviado/i)).toBeVisible();
  });

  test('should allow changing primary color', async ({ page }) => {
    const colorInput = page.getByLabel(/cor primária/i);
    await colorInput.fill('#3B82F6');
    await page.getByRole('button', { name: /salvar/i }).click();
    await expect(page.getByText(/configurações salvas/i)).toBeVisible();
  });

  test('should preview changes in real-time', async ({ page }) => {
    const input = page.getByLabel(/nome da empresa/i);
    await input.fill('Preview Test');
    await expect(page.locator('.preview-header')).toContainText('Preview Test');
  });

  test('should allow configuring custom domain', async ({ page }) => {
    await page.getByRole('tab', { name: /domínio/i }).click();
    const domainInput = page.getByLabel(/domínio personalizado/i);
    await domainInput.fill('ats.minhaempresa.com.br');
    await page.getByRole('button', { name: /verificar dns/i }).click();
  });

  test('should show favicon configuration', async ({ page }) => {
    await page.getByRole('tab', { name: /ícones/i }).click();
    await expect(page.getByText(/favicon/i)).toBeVisible();
  });
});
