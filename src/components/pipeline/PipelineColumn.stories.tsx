import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { PipelineColumn } from './PipelineColumn';
const meta: Meta<typeof PipelineColumn> = { title: 'Components/PipelineColumn', component: PipelineColumn,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
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
