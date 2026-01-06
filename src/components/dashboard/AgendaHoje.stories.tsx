import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AgendaHoje } from './AgendaHoje';

const meta: Meta<typeof AgendaHoje> = {
  title: 'Components/dashboard/AgendaHoje',
  component: AgendaHoje,
  argTypes: {},
  tags: ['autodocs'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export default meta;
type Story = StoryObj<typeof AgendaHoje>;

export const Default: Story = { args: {} };
