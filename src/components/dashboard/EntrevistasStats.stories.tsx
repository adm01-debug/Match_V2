import type { Meta, StoryObj } from '@storybook/react';
import { EntrevistasStats } from './EntrevistasStats';

const meta: Meta<typeof EntrevistasStats> = {
  title: 'Components/EntrevistasStats',
  component: EntrevistasStats,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
