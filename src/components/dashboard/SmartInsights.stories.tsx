import type { Meta, StoryObj } from '@storybook/react';
import { SmartInsights } from './SmartInsights';

const meta: Meta<typeof SmartInsights> = {
  title: 'Components/dashboard/SmartInsights',
  component: SmartInsights,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SmartInsights>;

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
