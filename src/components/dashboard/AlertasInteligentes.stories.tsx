import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertasInteligentes } from './AlertasInteligentes';

const meta: Meta<typeof AlertasInteligentes> = {
  title: 'Components/AlertasInteligentes',
  component: AlertasInteligentes,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
