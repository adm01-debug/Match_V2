import { test, expect } from '@playwright/test';

test.describe('SSO Authentication', () => {
  test('should display SSO login option', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByRole('button', { name: /entrar com sso/i })).toBeVisible();
  });

  test('should redirect to IdP on SSO click', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: /entrar com sso/i }).click();
    // Verifica redirecionamento ou modal
    await expect(page.url()).toContain('/sso');
  });

  test('should show SSO configuration for admins', async ({ page }) => {
    await page.goto('/admin/sso');
    await expect(page.getByRole('heading', { name: /single sign-on/i })).toBeVisible();
  });

  test('should allow enabling SAML', async ({ page }) => {
    await page.goto('/admin/sso');
    await page.getByRole('switch').click();
    await page.getByRole('tab', { name: /saml/i }).click();
    await expect(page.getByLabel(/entity id/i)).toBeVisible();
  });

  test('should allow enabling OIDC', async ({ page }) => {
    await page.goto('/admin/sso');
    await page.getByRole('switch').click();
    await page.getByRole('tab', { name: /oidc/i }).click();
    await expect(page.getByLabel(/client id/i)).toBeVisible();
  });

  test('should test SSO connection', async ({ page }) => {
    await page.goto('/admin/sso');
    await page.getByRole('button', { name: /testar conexão/i }).click();
    await expect(page.getByText(/testando/i)).toBeVisible();
  });

  test('should configure claim mappings', async ({ page }) => {
    await page.goto('/admin/sso');
    await page.getByRole('switch').click();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/nome/i)).toBeVisible();
  });

  test('should save SSO settings', async ({ page }) => {
    await page.goto('/admin/sso');
    await page.getByRole('switch').click();
    await page.getByRole('button', { name: /salvar/i }).click();
    await expect(page.getByText(/configurações salvas/i)).toBeVisible();
  });

  test('should handle SSO callback', async ({ page }) => {
    await page.goto('/auth/callback?code=test-code&state=test-state');
    // Verifica processamento do callback
    await expect(page.url()).not.toContain('/callback');
  });

  test('should show error on invalid SSO response', async ({ page }) => {
    await page.goto('/auth/callback?error=access_denied');
    await expect(page.getByText(/erro de autenticação/i)).toBeVisible();
  });
});
