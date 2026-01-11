import { test, expect } from '@playwright/test';

test.describe('Bulk Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/talentos');
  });

  test('should show selection bar when items selected', async ({ page }) => {
    // Selecionar primeiro candidato
    await page.locator('[data-testid="candidate-checkbox"]').first().click();
    
    // Verificar barra de seleção
    await expect(page.getByText(/1 de .* selecionados/)).toBeVisible();
  });

  test('should select all items', async ({ page }) => {
    // Clicar em "Selecionar todos"
    await page.locator('[data-testid="select-all-checkbox"]').click();
    
    // Verificar que todos estão selecionados
    const total = await page.locator('[data-testid="candidate-checkbox"]').count();
    await expect(page.getByText(new RegExp(`${total} de ${total} selecionados`))).toBeVisible();
  });

  test('should clear selection', async ({ page }) => {
    await page.locator('[data-testid="candidate-checkbox"]').first().click();
    await page.getByRole('button', { name: /limpar/i }).click();
    
    await expect(page.getByText(/selecionados/)).not.toBeVisible();
  });

  test('should show bulk actions dropdown', async ({ page }) => {
    await page.locator('[data-testid="candidate-checkbox"]').first().click();
    await page.getByRole('button', { name: /ações/i }).click();
    
    await expect(page.getByText('Mover para etapa')).toBeVisible();
    await expect(page.getByText('Adicionar tags')).toBeVisible();
    await expect(page.getByText('Enviar email')).toBeVisible();
  });

  test('should show progress modal during bulk action', async ({ page }) => {
    // Selecionar múltiplos candidatos
    const checkboxes = page.locator('[data-testid="candidate-checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    
    // Executar ação
    await page.getByRole('button', { name: /ações/i }).click();
    await page.getByText('Adicionar tags').click();
    
    // Selecionar tag (modal de tags)
    await page.getByText('Tag Exemplo').click();
    await page.getByRole('button', { name: /aplicar/i }).click();
    
    // Verificar modal de progresso
    await expect(page.getByText(/processando/i)).toBeVisible();
  });

  test('should handle bulk action errors gracefully', async ({ page }) => {
    await page.locator('[data-testid="candidate-checkbox"]').first().click();
    await page.getByRole('button', { name: /ações/i }).click();
    await page.getByText('Excluir').click();
    
    // Confirmar exclusão
    await page.getByRole('button', { name: /confirmar/i }).click();
    
    // Modal deve mostrar resultado
    await expect(page.locator('[data-testid="bulk-progress-modal"]')).toBeVisible();
  });

  test('should allow canceling bulk operation', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="candidate-checkbox"]');
    for (let i = 0; i < 5; i++) {
      await checkboxes.nth(i).click();
    }
    
    await page.getByRole('button', { name: /ações/i }).click();
    await page.getByText('Arquivar').click();
    
    // Cancelar durante processamento
    await page.getByRole('button', { name: /cancelar/i }).click();
    
    await expect(page.getByText(/operação cancelada/i)).toBeVisible();
  });
});

test.describe('Bulk Operations - Vagas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vagas');
  });

  test('should show vaga-specific actions', async ({ page }) => {
    await page.locator('[data-testid="vaga-checkbox"]').first().click();
    await page.getByRole('button', { name: /ações/i }).click();
    
    await expect(page.getByText('Publicar')).toBeVisible();
    await expect(page.getByText('Despublicar')).toBeVisible();
    await expect(page.getByText('Duplicar')).toBeVisible();
  });

  test('should bulk publish vagas', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="vaga-checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    
    await page.getByRole('button', { name: /ações/i }).click();
    await page.getByText('Publicar').click();
    
    await expect(page.getByText(/publicando/i)).toBeVisible();
  });
});
