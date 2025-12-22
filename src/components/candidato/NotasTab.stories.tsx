import type { Meta, StoryObj } from '@storybook/react';
import { NotasTab } from './NotasTab';
const meta: Meta<typeof NotasTab> = { title: 'Components/NotasTab', component: NotasTab, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
