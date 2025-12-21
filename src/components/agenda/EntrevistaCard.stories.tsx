import type { Meta, StoryObj } from '@storybook/react';
import { EntrevistaCard } from './EntrevistaCard';

const meta: Meta<typeof EntrevistaCard> = {
  title: 'Components/agenda/EntrevistaCard',
  component: EntrevistaCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EntrevistaCard>;

export const Default: Story = {
  args: {},
};
