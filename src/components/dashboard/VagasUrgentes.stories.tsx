import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { VagasUrgentes } from './VagasUrgentes';

const meta: Meta<typeof VagasUrgentes> = {
  title: 'Components/dashboard/VagasUrgentes',
  component: VagasUrgentes,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VagasUrgentes>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: {}, parameters: { mockData: { loading: true } } };
export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
export const Empty: Story = { args: {}, parameters: { mockData: { data: [] } } };
