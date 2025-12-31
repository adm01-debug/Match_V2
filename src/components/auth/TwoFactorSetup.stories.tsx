import type { Meta, StoryObj } from '@storybook/react';
import { TwoFactorSetup } from './TwoFactorSetup';

const meta: Meta<typeof TwoFactorSetup> = {
  title: 'Auth/TwoFactorSetup',
  component: TwoFactorSetup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para configuração inicial do 2FA com QR Code e verificação.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onComplete: () => console.log('2FA configurado!'),
    onCancel: () => console.log('Configuração cancelada'),
  },
};

export const WithComplete: Story = {
  args: {
    onComplete: () => alert('2FA configurado com sucesso!'),
  },
};

export const WithCancel: Story = {
  args: {
    onComplete: () => console.log('2FA configurado!'),
    onCancel: () => alert('Configuração cancelada!'),
  },
};
