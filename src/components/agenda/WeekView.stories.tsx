import type { Meta, StoryObj } from '@storybook/react';
import { WeekView } from './WeekView';
const meta: Meta<typeof WeekView> = { title: 'Components/agenda/WeekView', component: WeekView, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof WeekView>;
export const Default: Story = { args: {} };
