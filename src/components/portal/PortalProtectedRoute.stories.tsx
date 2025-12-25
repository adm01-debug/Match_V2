import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { PortalProtectedRoute } from './PortalProtectedRoute';
const meta: Meta<typeof PortalProtectedRoute> = { title: 'Components/PortalProtectedRoute', component: PortalProtectedRoute,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
