import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { QuestaoForm } from './QuestaoForm';

const meta: Meta<typeof QuestaoForm> = { 
  title: 'Components/tests/QuestaoForm', 
  component: QuestaoForm,
  argTypes: {}, 
  tags: ['autodocs'] 
};

export default meta;
type Story = StoryObj<typeof QuestaoForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
