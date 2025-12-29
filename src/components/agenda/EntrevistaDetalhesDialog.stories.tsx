import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import EntrevistaDetalhesDialog from './EntrevistaDetalhesDialog';

const meta: Meta<typeof EntrevistaDetalhesDialog> = {
  title: 'Components/EntrevistaDetalhesDialog',
  component: EntrevistaDetalhesDialog,
  argTypes: {},
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },
};

