import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { HistoricoTab } from './HistoricoTab';
const meta: Meta<typeof HistoricoTab> = { title: 'Components/HistoricoTab', component: HistoricoTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
