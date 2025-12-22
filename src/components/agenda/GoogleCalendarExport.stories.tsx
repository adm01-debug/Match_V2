import type { Meta, StoryObj } from '@storybook/react';
import { GoogleCalendarExport } from './GoogleCalendarExport';

const meta: Meta<typeof GoogleCalendarExport> = {
  title: 'Components/GoogleCalendarExport',
  component: GoogleCalendarExport,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
