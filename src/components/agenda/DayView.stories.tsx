import type { Meta, StoryObj } from '@storybook/react';
import { DayView } from './DayView';
const meta: Meta<typeof DayView> = { title: 'Components/agenda/DayView', component: DayView, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DayView>;
export const Default: Story = { args: {} };
