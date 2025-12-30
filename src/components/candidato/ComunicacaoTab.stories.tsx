import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ComunicacaoTab } from './ComunicacaoTab';
const meta: Meta<typeof ComunicacaoTab> = { title: 'Components/ComunicacaoTab', component: ComunicacaoTab,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
