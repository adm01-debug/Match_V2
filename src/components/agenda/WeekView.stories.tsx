import { within, userEvent, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { WeekView } from './WeekView';
const meta: Meta<typeof WeekView> = { title: 'Components/agenda/WeekView', component: WeekView, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof WeekView>;
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
