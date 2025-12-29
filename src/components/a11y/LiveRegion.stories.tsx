import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { LiveRegion } from './LiveRegion';

const meta: Meta<typeof LiveRegion> = {
  title: 'Components/LiveRegion',
  component: LiveRegion,
  argTypes: {},
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

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
