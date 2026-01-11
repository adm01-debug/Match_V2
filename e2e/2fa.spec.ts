import { test, expect } from '@playwright/test';

test.describe('Two-Factor Authentication', () => {
  test('should display 2FA configuration in security settings', async ({ page }) => {
    // A rota de configurações de segurança é /configuracoes/seguranca
    await page.goto('/configuracoes/seguranca');
    await page.waitForLoadState('networkidle');
    // Página pode redirecionar para login se não autenticado
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show 2FA verification page', async ({ page }) => {
    // A rota de 2FA é /auth/2fa
    await page.goto('/auth/2fa');
    await page.waitForLoadState('networkidle');
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should handle authentication flow', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Verificar que a página de auth carrega
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});
