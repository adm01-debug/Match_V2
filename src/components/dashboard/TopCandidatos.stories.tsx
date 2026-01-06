import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { TopCandidatos } from './TopCandidatos';

const meta: Meta<typeof TopCandidatos> = {
  title: 'Components/dashboard/TopCandidatos',
  component: TopCandidatos,
  argTypes: {},
  tags: ['autodocs'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export default meta;
type Story = StoryObj<typeof TopCandidatos>;

export const Default: Story = { args: {} };
