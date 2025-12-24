import { within, expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Inbox, Search, FileX } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Common/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'Nenhum item encontrado',
    description: 'Não há itens para exibir no momento.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Inbox className="h-12 w-12" />,
    title: 'Caixa de entrada vazia',
    description: 'Você não tem novas mensagens.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <FileX className="h-12 w-12" />,
    title: 'Nenhum documento',
    description: 'Comece criando seu primeiro documento.',
    action: <Button>Criar Documento</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <Search className="h-12 w-12" />,
    title: 'Nenhum resultado',
    description: 'Tente ajustar os filtros ou termos de busca.',
    action: <Button variant="outline">Limpar Filtros</Button>,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement).toBeInTheDocument();
  },

};
