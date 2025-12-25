import { within, userEvent, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AgendarEntrevistaDialog } from './AgendarEntrevistaDialog';

const meta: Meta<typeof AgendarEntrevistaDialog> = {
  title: 'Components/AgendarEntrevistaDialog',
  component: AgendarEntrevistaDialog,
  argTypes: {},
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },
};
