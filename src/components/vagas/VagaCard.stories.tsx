import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { VagaCard } from './VagaCard';

const meta: Meta<typeof VagaCard> = {
  title: 'Components/vagas/VagaCard',
  component: VagaCard,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VagaCard>;

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
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
