import type { Meta, StoryObj } from '@storybook/react';
import { AgendarEntrevistaDialog } from './AgendarEntrevistaDialog';

const meta: Meta<typeof AgendarEntrevistaDialog> = {
  title: 'Components/AgendarEntrevistaDialog',
  component: AgendarEntrevistaDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
