import type { Meta, StoryObj } from '@storybook/react';
import { LiveRegion } from './LiveRegion';

const meta: Meta<typeof LiveRegion> = {
  title: 'Components/LiveRegion',
  component: LiveRegion,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
