import type { Meta, StoryObj } from '@storybook/react';
import { FunilChart } from './FunilChart';

const meta: Meta<typeof FunilChart> = {
  title: 'Components/FunilChart',
  component: FunilChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
