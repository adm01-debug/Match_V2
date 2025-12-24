import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ComunicacaoHistorico } from './ComunicacaoHistorico';
const meta: Meta<typeof ComunicacaoHistorico> = { title: 'Components/ComunicacaoHistorico', component: ComunicacaoHistorico, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
