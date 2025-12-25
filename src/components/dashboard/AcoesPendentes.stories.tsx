import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { AcoesPendentes } from './AcoesPendentes';

const meta: Meta<typeof AcoesPendentes> = {
  title: 'Components/dashboard/AcoesPendentes',
  component: AcoesPendentes,
  argTypes: {},
  tags: ['autodocs'],

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};

export default meta;
type Story = StoryObj<typeof AcoesPendentes>;

export const Default: Story = { args: {} };
