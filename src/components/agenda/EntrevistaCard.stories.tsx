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

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro ao carregar' } },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
