import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import PortalProtectedRoute from './PortalProtectedRoute';

const meta: Meta<typeof PortalProtectedRoute> = {
  title: 'Portal/PortalProtectedRoute',
  component: PortalProtectedRoute,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Conteúdo protegido</div>,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};
