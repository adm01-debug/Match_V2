import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { EnviarEmailDialog } from './EnviarEmailDialog';

const meta: Meta<typeof EnviarEmailDialog> = {
  title: 'Components/comunicacao/EnviarEmailDialog',
  component: EnviarEmailDialog,
  tags: ['autodocs'],

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export default meta;
type Story = StoryObj<typeof EnviarEmailDialog>;

export const Default: Story = {
  args: {},
};
