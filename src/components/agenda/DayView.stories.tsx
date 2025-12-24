import { within, userEvent, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { DayView } from './DayView';
const meta: Meta<typeof DayView> = { title: 'Components/agenda/DayView', component: DayView, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DayView>;
export const Default: Story = { args: {} };

export const Loading: Story = {
  args: {},
  parameters: {
    mockData: { loading: true },
  },
};

export const WithError: Story = {
  args: {},
  parameters: {
    mockData: { error: 'Erro ao carregar dados' },
  },
};

export const Empty: Story = {
  args: {},
  parameters: {
    mockData: { data: [] },
  },
};
