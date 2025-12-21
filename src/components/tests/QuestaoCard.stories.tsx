import type { Meta, StoryObj } from '@storybook/react';
import { QuestaoCard } from './QuestaoCard';

const meta: Meta<typeof QuestaoCard> = {
  title: 'Components/tests/QuestaoCard',
  component: QuestaoCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuestaoCard>;

export const Default: Story = { args: {} };
