/**
 * @fileoverview IPGuard Component Stories
 * @module components/security/IPGuard.stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IPGuard, IPCheckLoading, AccessBlocked, IPCheckError } from './IPGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof IPGuard> = {
  title: 'Security/IPGuard',
  component: IPGuard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de proteção de rotas baseado em whitelist de IPs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showIPOnBlock: {
      control: 'boolean',
      description: 'Mostrar IP do usuário quando bloqueado',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof IPGuard>;

/**
 * Estado de loading durante verificação de IP
 */
export const Loading: Story = {
  render: () => <IPCheckLoading />,
  parameters: {
    docs: {
      description: {
        story: 'Exibido enquanto o sistema verifica se o IP está autorizado.',
      },
    },
  },
};

/**
 * Estado quando IP é bloqueado
 */
export const Blocked: Story = {
  render: () => (
    <AccessBlocked 
      clientIP="192.168.1.100" 
      showIP={true} 
      onRetry={() => console.log('Retry clicked')} 
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exibido quando o IP do usuário não está na whitelist.',
      },
    },
  },
};

/**
 * Estado quando IP é bloqueado (sem mostrar IP)
 */
export const BlockedHiddenIP: Story = {
  render: () => (
    <AccessBlocked 
      clientIP="192.168.1.100" 
      showIP={false} 
      onRetry={() => console.log('Retry clicked')} 
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Versão que não exibe o IP do usuário por segurança.',
      },
    },
  },
};

/**
 * Estado de erro na verificação
 */
export const Error: Story = {
  render: () => (
    <IPCheckError 
      error={new Error('Não foi possível conectar ao servidor')} 
      onRetry={() => console.log('Retry clicked')} 
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exibido quando ocorre um erro durante a verificação.',
      },
    },
  },
};

/**
 * Conteúdo protegido (IP permitido)
 */
export const Allowed: Story = {
  render: () => (
    <div className="p-8 bg-green-50 rounded-lg">
      <h1 className="text-2xl font-bold text-green-800">Acesso Permitido!</h1>
      <p className="text-green-600 mt-2">
        Este conteúdo só é visível para IPs autorizados.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de conteúdo exibido quando o IP está autorizado.',
      },
    },
  },
};
