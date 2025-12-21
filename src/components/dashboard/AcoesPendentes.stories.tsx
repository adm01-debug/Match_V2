import type { Meta, StoryObj } from '@storybook/react';
import { AcoesPendentes } from './AcoesPendentes';

const meta: Meta<typeof AcoesPendentes> = {
  title: 'Components/dashboard/AcoesPendentes',
  component: AcoesPendentes,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AcoesPendentes>;

export const Default: Story = { args: {} };
