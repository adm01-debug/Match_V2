import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { BateriaCard } from './BateriaCard';

const meta: Meta<typeof BateriaCard> = {
  title: 'Components/tests/BateriaCard',
  component: BateriaCard,
  argTypes: {},
  tags: ['autodocs'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export default meta;
type Story = StoryObj<typeof BateriaCard>;

export const Default: Story = { args: {} };
