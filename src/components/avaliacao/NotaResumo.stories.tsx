import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { NotaResumo } from './NotaResumo';
const meta: Meta<typeof NotaResumo> = { title: 'Components/NotaResumo', component: NotaResumo,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
