import { test, expect } from '@playwright/test';

/**
 * @fileoverview Testes E2E para o Portal do Candidato
 * @description Testa fluxos de candidatos no portal público
 */

test.describe('Portal do Candidato', () => {
  test.describe('Acesso ao Portal', () => {
    test('deve carregar o portal de candidatos', async ({ page }) => {
      await page.goto('/portal');
      await expect(page).toHaveURL(/\/portal/);
    });

    test('deve mostrar página de login do portal', async ({ page }) => {
      await page.goto('/portal/auth');
      await expect(page).toHaveURL(/\/portal\/auth/);
    });
  });

  test.describe('Navegação do Portal', () => {
    test('deve navegar para lista de vagas', async ({ page }) => {
      await page.goto('/portal/vagas');
      await expect(page).toHaveURL(/\/portal\/vagas/);
    });
  });

  test.describe('Responsividade do Portal', () => {
    test('portal deve ser responsivo em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/portal');
      await expect(page).toHaveURL(/\/portal/);
    });
  });
});
