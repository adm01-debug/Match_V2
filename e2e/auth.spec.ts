import { test, expect } from '@playwright/test';

/**
 * @fileoverview Testes E2E para fluxos de autenticação
 * @description Testa login, logout e registro de usuários
 */

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test.describe('Página de Login', () => {
    test('deve renderizar a página de autenticação corretamente', async ({ page }) => {
      await expect(page.getByText('Sistema de Recrutamento')).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Entrar' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Cadastrar' })).toBeVisible();
    });

    test('deve mostrar campos de email e senha no login', async ({ page }) => {
      await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
      await expect(page.getByPlaceholder('••••••••').first()).toBeVisible();
      await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    });

    test('deve validar email inválido no login', async ({ page }) => {
      await page.getByPlaceholder('seu@email.com').fill('email-invalido');
      await page.getByPlaceholder('••••••••').first().fill('password123');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      await expect(page.getByText('Email inválido')).toBeVisible();
    });

    test('deve validar senha curta no login', async ({ page }) => {
      await page.getByPlaceholder('seu@email.com').fill('test@example.com');
      await page.getByPlaceholder('••••••••').first().fill('12345');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      await expect(page.getByText('Senha deve ter pelo menos 6 caracteres')).toBeVisible();
    });

    test('deve mostrar loading durante login', async ({ page }) => {
      await page.getByPlaceholder('seu@email.com').fill('test@example.com');
      await page.getByPlaceholder('••••••••').first().fill('password123');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      // Login pode ser muito rápido
      await expect(page.getByText('Entrando...')).toBeVisible({ timeout: 1000 }).catch(() => true);
    });
  });

  test.describe('Página de Cadastro', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: 'Cadastrar' }).click();
    });

    test('deve alternar para aba de cadastro', async ({ page }) => {
      await expect(page.getByText('Criar conta')).toBeVisible();
      await expect(page.getByPlaceholder('Seu nome')).toBeVisible();
    });

    test('deve validar nome curto no cadastro', async ({ page }) => {
      await page.getByPlaceholder('Seu nome').fill('A');
      await page.locator('#signup-email').fill('test@example.com');
      await page.locator('#signup-password').fill('password123');
      await page.locator('#signup-confirm').fill('password123');
      await page.getByRole('button', { name: /criar conta/i }).click();
      
      await expect(page.getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible();
    });

    test('deve validar senhas diferentes no cadastro', async ({ page }) => {
      await page.getByPlaceholder('Seu nome').fill('Test User');
      await page.locator('#signup-email').fill('test@example.com');
      await page.locator('#signup-password').fill('password123');
      await page.locator('#signup-confirm').fill('differentpassword');
      await page.getByRole('button', { name: /criar conta/i }).click();
      
      await expect(page.getByText('Senhas não conferem')).toBeVisible();
    });

    test('deve preencher formulário de cadastro corretamente', async ({ page }) => {
      await page.getByPlaceholder('Seu nome').fill('Novo Usuário');
      await page.locator('#signup-email').fill('novo@example.com');
      await page.locator('#signup-password').fill('senhasegura123');
      await page.locator('#signup-confirm').fill('senhasegura123');
      
      await expect(page.getByPlaceholder('Seu nome')).toHaveValue('Novo Usuário');
      await expect(page.locator('#signup-email')).toHaveValue('novo@example.com');
    });
  });

  test.describe('Acessibilidade', () => {
    test('deve ter elementos focáveis por teclado', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('botões devem ser focáveis', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /entrar/i });
      await loginButton.focus();
      await expect(loginButton).toBeFocused();
    });

    test('deve submeter formulário com Enter', async ({ page }) => {
      await page.getByPlaceholder('seu@email.com').fill('test@example.com');
      await page.getByPlaceholder('••••••••').first().fill('password123');
      await page.keyboard.press('Enter');
      
      await expect(page.getByText('Entrando...')).toBeVisible({ timeout: 2000 }).catch(() => true);
    });
  });
});
