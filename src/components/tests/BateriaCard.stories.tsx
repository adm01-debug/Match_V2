import type { Meta, StoryObj } from '@storybook/react';
import { BateriaCard } from './BateriaCard';

const meta: Meta<typeof BateriaCard> = {
  title: 'Components/tests/BateriaCard',
  component: BateriaCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BateriaCard>;

export const Default: Story = { args: {} };
