import type { Meta, StoryObj } from '@storybook/react';
import { WhiteLabelSettings } from './WhiteLabelSettings';

const meta: Meta<typeof WhiteLabelSettings> = {
  title: 'Admin/WhiteLabelSettings',
  component: WhiteLabelSettings,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Configurações de white label para personalização da plataforma.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Configured: Story = {};

export const WithPreview: Story = {};
