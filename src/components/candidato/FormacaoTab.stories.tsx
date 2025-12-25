import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { FormacaoTab } from './FormacaoTab';
const meta: Meta<typeof FormacaoTab> = { title: 'Components/FormacaoTab', component: FormacaoTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
