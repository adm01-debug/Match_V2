import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { TestFilters } from './TestFilters';
const meta: Meta<typeof TestFilters> = { title: 'UI/TestFilters', component: TestFilters,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
