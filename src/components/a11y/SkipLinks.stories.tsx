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

export const Default: Story = {};
