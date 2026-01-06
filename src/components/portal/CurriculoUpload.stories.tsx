import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import CurriculoUpload from './CurriculoUpload';

const meta: Meta<typeof CurriculoUpload> = {
  title: 'Portal/CurriculoUpload',
  component: CurriculoUpload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const WithCurriculo: Story = {
  args: {
    curriculoUrl: 'user123/curriculo.pdf',
    curriculoNome: 'meu_curriculo.pdf',
  },
};
