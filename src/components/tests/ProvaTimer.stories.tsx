import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ProvaTimer } from './ProvaTimer';
const meta: Meta<typeof ProvaTimer> = { title: 'UI/ProvaTimer', component: ProvaTimer,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
