import { expect } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { MatchScoreCard } from './MatchScoreCard';
const meta: Meta<typeof MatchScoreCard> = { title: 'Components/MatchScoreCard', component: MatchScoreCard,
  argTypes: {}, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    candidatoNome: 'Test Candidate',
    vagaTitulo: 'Test Position',
    matchResult: {
      scoreTotal: 85,
      scoreHabilidades: 90,
      scoreExperiencia: 80,
      scoreFormacao: 85,
      habilidadesMatch: ['React', 'TypeScript'],
      habilidadesFaltantes: ['Python'],
      habilidadesExtras: ['Vue'],
      analise: 'Good match',
      recomendacao: 'forte',
      pontosFortes: ['Strong skills'],
      pontosAtencao: ['Limited experience'],
    }
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    candidatoNome: 'Test',
    vagaTitulo: 'Test',
    matchResult: {
      scoreTotal: 50,
      scoreHabilidades: 50,
      scoreExperiencia: 50,
      scoreFormacao: 50,
      habilidadesMatch: [],
      habilidadesFaltantes: [],
      habilidadesExtras: [],
      analise: '',
      recomendacao: 'moderado',
      pontosFortes: [],
      pontosAtencao: [],
    }
  },
  parameters: { mockData: { loading: true } },
};

export const WithError: Story = {
  args: {
    candidatoNome: 'Test',
    vagaTitulo: 'Test',
    matchResult: {
      scoreTotal: 30,
      scoreHabilidades: 30,
      scoreExperiencia: 30,
      scoreFormacao: 30,
      habilidadesMatch: [],
      habilidadesFaltantes: [],
      habilidadesExtras: [],
      analise: '',
      recomendacao: 'nao_recomendado',
      pontosFortes: [],
      pontosAtencao: [],
    }
  },
  parameters: { mockData: { error: 'Erro ao carregar' } },
};

export const Empty: Story = {
  args: {
    candidatoNome: 'Test',
    vagaTitulo: 'Test',
    matchResult: {
      scoreTotal: 0,
      scoreHabilidades: 0,
      scoreExperiencia: 0,
      scoreFormacao: 0,
      habilidadesMatch: [],
      habilidadesFaltantes: [],
      habilidadesExtras: [],
      analise: '',
      recomendacao: 'fraco',
      pontosFortes: [],
      pontosAtencao: [],
    }
  },
  parameters: { mockData: { data: [] } },
};