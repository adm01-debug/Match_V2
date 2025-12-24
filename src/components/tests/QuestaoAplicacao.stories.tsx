import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { QuestaoAplicacao } from './QuestaoAplicacao';
const meta: Meta<typeof QuestaoAplicacao> = { title: 'Components/QuestaoAplicacao', component: QuestaoAplicacao, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
