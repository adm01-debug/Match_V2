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

export const Default: Story = {
  args: {
    settings: {
      companyName: 'Minha Empresa',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      logoUrl: '',
      faviconUrl: '',
      customDomain: '',
      emailFromName: 'Recrutamento',
    },
    onSave: (settings) => console.log('Salvando:', settings),
  },
};

export const Configured: Story = {
  args: {
    settings: {
      companyName: 'Tech Corp',
      primaryColor: '#7C3AED',
      secondaryColor: '#F59E0B',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: 'https://example.com/favicon.ico',
      customDomain: 'recrutamento.techcorp.com.br',
      emailFromName: 'Tech Corp Talentos',
    },
    onSave: (settings) => console.log('Salvando:', settings),
  },
};

export const WithPreview: Story = {
  args: {
    ...Configured.args,
    showPreview: true,
  },
};

export const Saving: Story = {
  args: {
    ...Default.args,
    isSaving: true,
  },
};

export const WithErrors: Story = {
  args: {
    ...Default.args,
    errors: {
      customDomain: 'Domínio inválido',
      primaryColor: 'Cor inválida',
    },
  },
};
