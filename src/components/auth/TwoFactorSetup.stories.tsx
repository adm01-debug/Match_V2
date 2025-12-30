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
    secret: 'JBSWY3DPEHPK3PXP',
    accountName: 'usuario@empresa.com.br',
    issuer: 'Match ATS',
    onVerify: async (code) => {
      console.log('Verificando código:', code);
      return code === '123456';
    },
    onComplete: () => console.log('2FA configurado!'),
  },
};

export const WithCustomIssuer: Story = {
  args: {
    ...Default.args,
    issuer: 'Minha Empresa',
  },
};

export const VerificationError: Story = {
  args: {
    ...Default.args,
    onVerify: async () => false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    onVerify: async () => {
      await new Promise((r) => setTimeout(r, 3000));
      return true;
    },
  },
};
