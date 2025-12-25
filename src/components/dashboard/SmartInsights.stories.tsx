import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { SmartInsights } from './SmartInsights';

const meta: Meta<typeof SmartInsights> = {
  title: 'Components/dashboard/SmartInsights',
  component: SmartInsights,
  argTypes: {},
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

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
