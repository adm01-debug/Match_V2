import { test, expect } from '@playwright/test';

test.describe('Two-Factor Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Login como usuário de teste
    await page.goto('/auth');
  });

  test('should display 2FA setup page correctly', async ({ page }) => {
    await page.goto('/settings/security');
    
    // Verificar elementos da página de setup
    await expect(page.getByText('Configurar 2FA')).toBeVisible();
    await expect(page.getByText('Autenticação de dois fatores')).toBeVisible();
  });

  test('should show QR code on setup', async ({ page }) => {
    await page.goto('/settings/security/2fa-setup');
    
    // Aguardar QR code carregar
    await expect(page.locator('img[alt="QR Code 2FA"]')).toBeVisible({ timeout: 10000 });
  });

  test('should validate verification code format', async ({ page }) => {
    await page.goto('/settings/security/2fa-setup');
    
    // Clicar em próximo para ir para verificação
    await page.getByRole('button', { name: /próximo/i }).click();
    
    // Tentar verificar com código inválido
    await page.fill('input[maxlength="6"]', '123');
    await page.getByRole('button', { name: /verificar/i }).click();
    
    // Deve mostrar erro
    await expect(page.getByText(/6 dígitos/i)).toBeVisible();
  });

  test('should show recovery codes after setup', async ({ page }) => {
    await page.goto('/settings/security/2fa-setup');
    
    // Simular setup completo (mock)
    // Este teste assumiria um mock do backend
    
    // Verificar que existem 10 códigos de recuperação
    const badges = page.locator('[data-testid="recovery-code"]');
    await expect(badges).toHaveCount(10);
  });

  test('should allow download of recovery codes', async ({ page }) => {
    await page.goto('/settings/security/2fa-setup');
    
    // Ir para step de recovery
    // ...setup steps...
    
    // Verificar botão de download
    const downloadButton = page.getByRole('button', { name: /baixar códigos/i });
    await expect(downloadButton).toBeVisible();
  });

  test('should display 2FA verification on login', async ({ page }) => {
    // Logout primeiro
    await page.goto('/auth/logout');
    
    // Tentar login com conta que tem 2FA
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test-2fa@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Deve mostrar tela de verificação 2FA
    await expect(page.getByText('Verificação 2FA')).toBeVisible();
  });

  test('should have remember device option', async ({ page }) => {
    await page.goto('/auth/2fa-verify');
    
    // Verificar checkbox de lembrar dispositivo
    await expect(page.getByLabel(/lembrar este dispositivo/i)).toBeVisible();
  });

  test('should have recovery code option', async ({ page }) => {
    await page.goto('/auth/2fa-verify');
    
    // Verificar link para código de recuperação
    await expect(page.getByText(/código de recuperação/i)).toBeVisible();
  });

  test('should switch to recovery code input', async ({ page }) => {
    await page.goto('/auth/2fa-verify');
    
    // Clicar no link de recuperação
    await page.getByText(/código de recuperação/i).click();
    
    // Verificar que mudou para modo de recuperação
    await expect(page.getByText('Código de Recuperação')).toBeVisible();
    await expect(page.locator('input[maxlength="8"]')).toBeVisible();
  });

  test('should validate recovery code format', async ({ page }) => {
    await page.goto('/auth/2fa-verify');
    await page.getByText(/código de recuperação/i).click();
    
    // Tentar com código curto
    await page.fill('input[maxlength="8"]', 'ABC');
    await page.getByRole('button', { name: /verificar/i }).click();
    
    // Deve mostrar erro
    await expect(page.getByText(/8 caracteres/i)).toBeVisible();
  });
});
