import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
const meta: Meta<typeof Layout> = { title: 'Components/Layout', component: Layout,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
