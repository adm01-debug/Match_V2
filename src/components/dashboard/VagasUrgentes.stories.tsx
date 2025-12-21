import type { Meta, StoryObj } from '@storybook/react';
import { VagasUrgentes } from './VagasUrgentes';

const meta: Meta<typeof VagasUrgentes> = {
  title: 'Components/dashboard/VagasUrgentes',
  component: VagasUrgentes,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VagasUrgentes>;

export const Default: Story = {
  args: {},
};
