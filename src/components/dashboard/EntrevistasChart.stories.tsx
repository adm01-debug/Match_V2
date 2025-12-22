import type { Meta, StoryObj } from '@storybook/react';
import { EntrevistasChart } from './EntrevistasChart';

const meta: Meta<typeof EntrevistasChart> = {
  title: 'Components/EntrevistasChart',
  component: EntrevistasChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
