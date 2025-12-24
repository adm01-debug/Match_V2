import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { TopCandidatos } from './TopCandidatos';

const meta: Meta<typeof TopCandidatos> = {
  title: 'Components/dashboard/TopCandidatos',
  component: TopCandidatos,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopCandidatos>;

export const Default: Story = {
  args: {},
};
