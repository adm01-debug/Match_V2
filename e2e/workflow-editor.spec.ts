import { test, expect } from '@playwright/test';

test.describe('Workflow Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/workflow');
  });

  test('should display workflow editor canvas', async ({ page }) => {
    await expect(page.getByTestId('workflow-canvas')).toBeVisible();
    await expect(page.getByTestId('node-palette')).toBeVisible();
    await expect(page.getByTestId('node-properties')).toBeVisible();
  });

  test('should add trigger node to canvas', async ({ page }) => {
    const palette = page.getByTestId('node-palette');
    const canvas = page.getByTestId('workflow-canvas');

    const triggerNode = palette.getByText('Trigger');
    await triggerNode.dragTo(canvas);

    await expect(page.getByTestId('trigger-node')).toBeVisible();
  });

  test('should connect two nodes', async ({ page }) => {
    // Add trigger node
    await page.getByTestId('add-trigger-btn').click();
    
    // Add action node
    await page.getByTestId('add-action-btn').click();

    // Connect nodes
    const sourceHandle = page.getByTestId('trigger-node').getByTestId('source-handle');
    const targetHandle = page.getByTestId('action-node').getByTestId('target-handle');
    
    await sourceHandle.dragTo(targetHandle);
    
    await expect(page.getByTestId('edge-trigger-action')).toBeVisible();
  });

  test('should show node properties when selected', async ({ page }) => {
    await page.getByTestId('add-trigger-btn').click();
    await page.getByTestId('trigger-node').click();

    const propertiesPanel = page.getByTestId('node-properties');
    await expect(propertiesPanel.getByText('Trigger')).toBeVisible();
    await expect(propertiesPanel.getByLabel('Trigger Type')).toBeVisible();
  });

  test('should save workflow', async ({ page }) => {
    await page.getByTestId('add-trigger-btn').click();
    await page.getByTestId('add-action-btn').click();

    await page.getByTestId('save-workflow-btn').click();

    await expect(page.getByText('Workflow salvo')).toBeVisible();
  });

  test('should delete node', async ({ page }) => {
    await page.getByTestId('add-trigger-btn').click();
    await page.getByTestId('trigger-node').click();
    
    await page.keyboard.press('Delete');
    
    await expect(page.getByTestId('trigger-node')).not.toBeVisible();
  });

  test('should undo/redo actions', async ({ page }) => {
    await page.getByTestId('add-trigger-btn').click();
    await expect(page.getByTestId('trigger-node')).toBeVisible();

    await page.keyboard.press('Control+z');
    await expect(page.getByTestId('trigger-node')).not.toBeVisible();

    await page.keyboard.press('Control+Shift+z');
    await expect(page.getByTestId('trigger-node')).toBeVisible();
  });

  test('should load workflow template', async ({ page }) => {
    await page.getByTestId('templates-btn').click();
    await page.getByText('Onboarding Template').click();

    await expect(page.getByTestId('trigger-node')).toBeVisible();
    await expect(page.getByTestId('action-node')).toBeVisible();
  });

  test('should validate workflow before save', async ({ page }) => {
    // Try to save empty workflow
    await page.getByTestId('save-workflow-btn').click();

    await expect(page.getByText('Workflow precisa ter pelo menos um trigger')).toBeVisible();
  });

  test('should export workflow as JSON', async ({ page }) => {
    await page.getByTestId('add-trigger-btn').click();
    
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-btn').click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
  });
});
