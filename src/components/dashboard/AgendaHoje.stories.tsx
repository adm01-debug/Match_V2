import type { Meta, StoryObj } from '@storybook/react';
import { AgendaHoje } from './AgendaHoje';

const meta: Meta<typeof AgendaHoje> = {
  title: 'Components/dashboard/AgendaHoje',
  component: AgendaHoje,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AgendaHoje>;

export const Default: Story = { args: {} };
