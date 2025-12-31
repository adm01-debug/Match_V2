import type { Meta, StoryObj } from '@storybook/react';
import { TwoFactorVerify } from './TwoFactorVerify';

const meta: Meta<typeof TwoFactorVerify> = {
  title: 'Auth/TwoFactorVerify',
  component: TwoFactorVerify,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para verificação do código 2FA durante o login.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSuccess: () => console.log('Verificação bem sucedida!'),
    onCancel: () => console.log('Verificação cancelada'),
  },
};

export const WithCancel: Story = {
  args: {
    onSuccess: () => console.log('Verificação bem sucedida!'),
    onCancel: () => alert('Cancelado!'),
  },
};

export const LimitedAttempts: Story = {
  args: {
    onSuccess: () => console.log('Verificação bem sucedida!'),
    maxAttempts: 3,
  },
};
