import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { EntrevistasChart } from './EntrevistasChart';

const meta: Meta<typeof EntrevistasChart> = {
  title: 'Components/EntrevistasChart',
  component: EntrevistasChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
