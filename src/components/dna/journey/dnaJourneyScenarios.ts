import type { DNAHelix } from '@/types/behavioralDNA';

export interface JourneyChoice {
  id: string;
  text: string;
  consequence: string;
  helixImpact: DNAHelix;
}

export interface JourneyScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  imageUrl: string;
  ambiance: 'tense' | 'reflective' | 'dramatic';
  choices: JourneyChoice[];
}

export const JOURNEY_SCENARIOS: JourneyScenario[] = [
  {
    id: 'crisis-decision',
    title: 'Decisão de Crise',
    description: 'Você é o CEO de uma startup. Uma crise inesperada surge...',
    context:
      'Segunda-feira, 8h da manhã. Seu celular toca insistentemente. O maior cliente da empresa descobriu uma falha crítica no produto e ameaça cancelar o contrato de R$2 milhões.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ambiance: 'tense',
    choices: [
      {
        id: 'a',
        text: 'Reunir a equipe imediatamente para brainstorm de soluções',
        consequence: 'Você mobiliza todos, criando união mas também ansiedade coletiva',
        helixImpact: { strategic: 70, emotional: 60, influence: 80, values: 75, adaptive: 65 },
      },
      {
        id: 'b',
        text: 'Ligar pessoalmente para o cliente e assumir responsabilidade',
        consequence: 'O cliente aprecia a honestidade, mas espera soluções concretas',
        helixImpact: { strategic: 60, emotional: 85, influence: 90, values: 95, adaptive: 70 },
      },
      {
        id: 'c',
        text: 'Analisar dados da falha antes de qualquer comunicação',
        consequence: 'Você ganha informação valiosa, mas o cliente fica impaciente',
        helixImpact: { strategic: 95, emotional: 50, influence: 55, values: 70, adaptive: 80 },
      },
      {
        id: 'd',
        text: 'Delegar para a equipe técnica e focar em novos clientes',
        consequence: 'Você mantém a visão de futuro, mas a equipe sente-se abandonada',
        helixImpact: { strategic: 75, emotional: 40, influence: 50, values: 45, adaptive: 85 },
      },
    ],
  },
  {
    id: 'team-conflict',
    title: 'Conflito de Equipe',
    description: 'Dois talentos essenciais estão em conflito aberto...',
    context:
      'Dois dos seus melhores funcionários não conseguem mais trabalhar juntos. A tensão está afetando toda a equipe e a produtividade caiu 30%.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ambiance: 'reflective',
    choices: [
      {
        id: 'a',
        text: 'Mediar uma conversa honesta entre os dois',
        consequence: 'O diálogo é difícil mas revela questões importantes',
        helixImpact: { strategic: 65, emotional: 90, influence: 85, values: 88, adaptive: 70 },
      },
      {
        id: 'b',
        text: 'Separar em projetos diferentes e monitorar',
        consequence: 'A tensão diminui mas o problema não é resolvido',
        helixImpact: { strategic: 80, emotional: 55, influence: 60, values: 65, adaptive: 85 },
      },
      {
        id: 'c',
        text: 'Propor um desafio conjunto que exija colaboração',
        consequence: 'Arriscado, mas pode transformar rivais em aliados',
        helixImpact: { strategic: 85, emotional: 70, influence: 75, values: 80, adaptive: 90 },
      },
      {
        id: 'd',
        text: 'Consultar cada um individualmente primeiro',
        consequence: 'Você entende ambos os lados antes de agir',
        helixImpact: { strategic: 75, emotional: 85, influence: 70, values: 82, adaptive: 65 },
      },
    ],
  },
  {
    id: 'ethical-dilemma',
    title: 'Dilema Ético',
    description: 'Uma oportunidade questionável surge...',
    context:
      'Um concorrente oferece informações confidenciais sobre o mercado. É ilegal, mas poderia salvar sua empresa de uma decisão errada.',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    ambiance: 'dramatic',
    choices: [
      {
        id: 'a',
        text: 'Recusar imediatamente e reportar a tentativa',
        consequence: 'Você mantém a integridade mas perde uma vantagem',
        helixImpact: { strategic: 60, emotional: 75, influence: 70, values: 100, adaptive: 55 },
      },
      {
        id: 'b',
        text: 'Ouvir a proposta sem se comprometer',
        consequence: 'Você ganha informação sobre o concorrente, mas flerta com o limite',
        helixImpact: { strategic: 85, emotional: 50, influence: 65, values: 55, adaptive: 80 },
      },
      {
        id: 'c',
        text: 'Consultar jurídico antes de qualquer decisão',
        consequence: 'Prudente, mas pode parecer indeciso',
        helixImpact: { strategic: 70, emotional: 60, influence: 55, values: 85, adaptive: 75 },
      },
      {
        id: 'd',
        text: 'Usar isso como oportunidade de fortalecer cultura ética',
        consequence: 'Você transforma uma ameaça em momento de liderança',
        helixImpact: { strategic: 75, emotional: 80, influence: 90, values: 95, adaptive: 70 },
      },
    ],
  },
];

export const JOURNEY_MINIGAMES: Array<'value-tower' | 'reaction' | 'pressure' | 'emotional-radar'> = [
  'value-tower',
  'reaction',
  'pressure',
  'emotional-radar',
];
