import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { CategoriaCard } from './CategoriaCard';

const meta: Meta<typeof CategoriaCard> = {
  title: 'Components/CategoriaCard',
  component: CategoriaCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
