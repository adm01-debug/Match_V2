import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { NotasTab } from './NotasTab';
const meta: Meta<typeof NotasTab> = { title: 'Components/NotasTab', component: NotasTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { candidatoId: '1' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};