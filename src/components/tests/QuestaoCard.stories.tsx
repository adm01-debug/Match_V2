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

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro' } },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
