import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { CurriculoTab } from './CurriculoTab';
const meta: Meta<typeof CurriculoTab> = { title: 'Components/candidato/CurriculoTab', component: CurriculoTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof CurriculoTab>;
export const Default: Story = { args: {} };

export const Loading: Story = {
  args: {},
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {},
  parameters: { mockData: { error: 'Erro ao carregar' } },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export const Empty: Story = {
  args: {},
  parameters: { mockData: { data: [] } },
};
