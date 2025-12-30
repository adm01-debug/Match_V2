import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AvaliacoesTab } from './AvaliacoesTab';

const meta: Meta<typeof AvaliacoesTab> = {
  title: 'Components/candidato/AvaliacoesTab',
  component: AvaliacoesTab,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AvaliacoesTab>;

export const Default: Story = { args: {} };

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro ao carregar' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
