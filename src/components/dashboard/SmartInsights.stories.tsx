import type { Meta, StoryObj } from '@storybook/react';
import { SmartInsights } from './SmartInsights';

const meta: Meta<typeof SmartInsights> = {
  title: 'Components/dashboard/SmartInsights',
  component: SmartInsights,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SmartInsights>;

export const Default: Story = { args: {} };
