import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { BateriaCard } from './BateriaCard';

const meta: Meta<typeof BateriaCard> = {
  title: 'Components/tests/BateriaCard',
  component: BateriaCard,
  tags: ['autodocs'],

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export default meta;
type Story = StoryObj<typeof BateriaCard>;

export const Default: Story = { args: {} };
