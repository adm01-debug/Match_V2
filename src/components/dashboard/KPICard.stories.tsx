import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'Components/dashboard/KPICard',
  component: KPICard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {},
};

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
