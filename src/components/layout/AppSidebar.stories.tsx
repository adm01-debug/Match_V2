import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
const meta: Meta<typeof AppSidebar> = { title: 'Components/layout/AppSidebar', component: AppSidebar,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AppSidebar>;
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
