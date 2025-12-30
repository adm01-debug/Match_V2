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
    onVerify: async (code) => {
      console.log('Verificando:', code);
      return code === '123456';
    },
    onUseRecoveryCode: () => console.log('Usar código de recuperação'),
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    onVerify: async () => false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    onVerify: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return true;
    },
  },
};

export const WithRecoveryOption: Story = {
  args: {
    ...Default.args,
    showRecoveryOption: true,
  },
};

export const Locked: Story = {
  args: {
    ...Default.args,
    remainingAttempts: 0,
    lockoutTime: 300,
  },
};
