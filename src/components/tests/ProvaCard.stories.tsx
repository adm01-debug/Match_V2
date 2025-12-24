import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ProvaCard } from './ProvaCard';

const meta: Meta<typeof ProvaCard> = {
  title: 'Components/tests/ProvaCard',
  component: ProvaCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProvaCard>;

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

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
