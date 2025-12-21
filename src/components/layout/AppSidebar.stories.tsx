import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
const meta: Meta<typeof AppSidebar> = { title: 'Components/layout/AppSidebar', component: AppSidebar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AppSidebar>;
export const Default: Story = { args: {} };
