import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { PerfilHeader } from './PerfilHeader';
import { mockCandidatoPerfil } from '@/data/candidatoPerfilData';

const meta: Meta<typeof PerfilHeader> = {
  title: 'Components/candidato/PerfilHeader',
  component: PerfilHeader,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PerfilHeader>;

export const Default: Story = {
  args: { candidato: mockCandidatoPerfil },
};

export const Loading: Story = {
  args: { candidato: mockCandidatoPerfil },
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: { candidato: mockCandidatoPerfil },
  parameters: { mockData: { error: 'Erro ao carregar' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { candidato: mockCandidatoPerfil },
  parameters: { mockData: { data: [] } },
};