/**
 * @fileoverview Gatilhos Mentais e Sleight of Mouth
 */

export type MentalTrigger =
  | 'escassez'
  | 'autoridade'
  | 'prova_social'
  | 'reciprocidade'
  | 'compromisso'
  | 'afinidade'
  | 'urgencia'
  | 'novidade'
  | 'curiosidade'
  | 'exclusividade';

export interface MentalTriggerResult {
  readonly triggers: Record<MentalTrigger, { sensibilidade: number; descricao: string }>;
  readonly triggersPrimarios: MentalTrigger[];
  readonly triggersSecundarios: MentalTrigger[];
  readonly perfil: string;
  readonly estrategiasEngajamento: string[];
}

export const MENTAL_TRIGGERS_INFO: Record<MentalTrigger, {
  nome: string;
  descricao: string;
  indicadores: string[];
  comoUsar: string[];
}> = {
  escassez: {
    nome: 'Escassez',
    descricao: 'Valoriza o que é raro ou limitado',
    indicadores: ['Reage a prazos', 'Valoriza exclusividade', 'Toma decisões sob pressão de tempo'],
    comoUsar: ['Apresente oportunidades únicas', 'Destaque limitações', 'Crie senso de urgência']
  },
  autoridade: {
    nome: 'Autoridade',
    descricao: 'Influenciado por especialistas e credenciais',
    indicadores: ['Busca validação de experts', 'Valoriza títulos', 'Pesquisa credenciais'],
    comoUsar: ['Apresente certificações', 'Mencione especialistas', 'Demonstre expertise']
  },
  prova_social: {
    nome: 'Prova Social',
    descricao: 'Influenciado por ações e opiniões de outros',
    indicadores: ['Busca referências', 'Valoriza testemunhos', 'Segue tendências'],
    comoUsar: ['Compartilhe casos de sucesso', 'Mostre números', 'Apresente depoimentos']
  },
  reciprocidade: {
    nome: 'Reciprocidade',
    descricao: 'Sente obrigação de retribuir favores',
    indicadores: ['Retribui gentilezas', 'Valoriza presentes', 'Responde a ajuda'],
    comoUsar: ['Ofereça valor primeiro', 'Faça gestos genuínos', 'Surpreenda positivamente']
  },
  compromisso: {
    nome: 'Compromisso e Consistência',
    descricao: 'Mantém consistência com compromissos anteriores',
    indicadores: ['Honra promessas', 'Busca coerência', 'Valoriza integridade'],
    comoUsar: ['Obtenha pequenos compromissos', 'Relembre acordos', 'Construa progressivamente']
  },
  afinidade: {
    nome: 'Afinidade',
    descricao: 'Influenciado por pessoas que gosta ou admira',
    indicadores: ['Conecta-se emocionalmente', 'Valoriza relacionamentos', 'Busca similaridades'],
    comoUsar: ['Construa rapport', 'Encontre pontos em comum', 'Seja genuíno']
  },
  urgencia: {
    nome: 'Urgência',
    descricao: 'Motivado por pressão temporal',
    indicadores: ['Age sob pressão', 'Evita procrastinação', 'Responde a deadlines'],
    comoUsar: ['Estabeleça prazos claros', 'Crie momentum', 'Destaque timing']
  },
  novidade: {
    nome: 'Novidade',
    descricao: 'Atraído por coisas novas e inovadoras',
    indicadores: ['Early adopter', 'Busca inovação', 'Evita rotina'],
    comoUsar: ['Destaque inovações', 'Apresente novidades', 'Mostre tendências']
  },
  curiosidade: {
    nome: 'Curiosidade',
    descricao: 'Motivado por descobrir e aprender',
    indicadores: ['Faz muitas perguntas', 'Busca conhecimento', 'Explora possibilidades'],
    comoUsar: ['Crie mistério', 'Provoque reflexão', 'Ofereça insights']
  },
  exclusividade: {
    nome: 'Exclusividade',
    descricao: 'Valoriza pertencer a grupos seletos',
    indicadores: ['Busca status', 'Valoriza distinção', 'Prefere premium'],
    comoUsar: ['Ofereça acesso especial', 'Destaque exclusividade', 'Crie pertencimento']
  }
};

// ============================================================
// Sleight of Mouth
// ============================================================
export type SleightPattern =
  | 'intencao'
  | 'redefinicao'
  | 'consequencia'
  | 'chunk_up'
  | 'chunk_down'
  | 'analogia'
  | 'modelo_mundo'
  | 'estrategia_realidade'
  | 'contra_exemplo'
  | 'hierarquia_criterios'
  | 'aplicar_a_si'
  | 'meta_frame';

export interface SleightResult {
  readonly habilidades: Record<SleightPattern, { nivel: number; exemplo: string }>;
  readonly pontosFortes: SleightPattern[];
  readonly areasDesenvolvimento: SleightPattern[];
  readonly estiloArgumentacao: string;
  readonly flexibilidadeCognitiva: number;
}
