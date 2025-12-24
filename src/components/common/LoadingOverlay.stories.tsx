import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingOverlay } from './LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Common/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-64 w-full border rounded-lg">
        <div className="p-4">
          <h2>Content behind overlay</h2>
          <p>This content is covered by the loading overlay.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  args: {
    isLoading: true,
  },
};

export const CustomMessage: Story = {
  args: {
    isLoading: true,
    message: 'Salvando alterações...',
  },
};

export const Hidden: Story = {
  args: {
    isLoading: false,
  },
};
