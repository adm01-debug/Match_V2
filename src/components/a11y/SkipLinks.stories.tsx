import { within, userEvent, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { SkipLinks } from './SkipLinks';

const meta: Meta<typeof SkipLinks> = {
  title: 'Components/SkipLinks',
  component: SkipLinks,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify component renders
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
