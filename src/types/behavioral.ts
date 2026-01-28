/**
 * @fileoverview Tipos para as 10 ferramentas de comportamento humano
 * @module types/behavioral
 */

// ============================================================
// 1. DISC - Perfis Comportamentais
// ============================================================
export type DISCProfile = 'D' | 'I' | 'S' | 'C';

export interface DISCResult {
  readonly dominancia: number; // 0-100
  readonly influencia: number; // 0-100
  readonly estabilidade: number; // 0-100
  readonly conformidade: number; // 0-100
  readonly perfilPrimario: DISCProfile;
  readonly perfilSecundario: DISCProfile;
  readonly descricao: string;
  readonly pontosFortes: string[];
  readonly areasDesenvolvimento: string[];
  readonly estiloTrabalho: string;
  readonly comunicacao: string;
  readonly motivadores: string[];
  readonly estressores: string[];
}

export const DISC_PROFILES_INFO: Record<DISCProfile, {
  nome: string;
  titulo: string;
  descricao: string;
  caracteristicas: string[];
  cor: string;
}> = {
  D: {
    nome: 'Dominância',
    titulo: 'Executor',
    descricao: 'Focado em resultados, direto, decidido, competitivo',
    caracteristicas: ['Orientado a resultados', 'Toma decisões rápidas', 'Aceita desafios', 'Gosta de estar no controle'],
    cor: 'bg-red-500'
  },
  I: {
    nome: 'Influência',
    titulo: 'Comunicador',
    descricao: 'Entusiasta, otimista, colaborativo, expressivo',
    caracteristicas: ['Sociável e persuasivo', 'Entusiasta', 'Colaborativo', 'Otimista'],
    cor: 'bg-yellow-500'
  },
  S: {
    nome: 'Estabilidade',
    titulo: 'Planejador',
    descricao: 'Calmo, paciente, previsível, consistente',
    caracteristicas: ['Confiável', 'Bom ouvinte', 'Trabalha bem em equipe', 'Paciente'],
    cor: 'bg-green-500'
  },
  C: {
    nome: 'Conformidade',
    titulo: 'Analista',
    descricao: 'Preciso, analítico, sistemático, cauteloso',
    caracteristicas: ['Focado em qualidade', 'Sistemático', 'Analítico', 'Atento aos detalhes'],
    cor: 'bg-blue-500'
  }
};

// ============================================================
// 2. VAK/D - Sistemas Representacionais
// ============================================================
export type VAKDChannel = 'visual' | 'auditivo' | 'cinestesico' | 'digital';

export interface VAKDResult {
  readonly visual: number; // 0-100
  readonly auditivo: number; // 0-100
  readonly cinestesico: number; // 0-100
  readonly digital: number; // 0-100
  readonly canalPrimario: VAKDChannel;
  readonly canalSecundario: VAKDChannel;
  readonly descricao: string;
  readonly comoAprende: string[];
  readonly comoSeComunica: string[];
  readonly palavrasChave: string[];
  readonly ambienteIdeal: string;
}

export const VAKD_CHANNELS_INFO: Record<VAKDChannel, {
  nome: string;
  descricao: string;
  indicadores: string[];
  dicasComunicacao: string[];
  cor: string;
  icone: string;
}> = {
  visual: {
    nome: 'Visual',
    descricao: 'Processa informações através de imagens e representações visuais',
    indicadores: ['Usa expressões como "vejo", "parece", "claramente"', 'Prefere diagramas e gráficos', 'Memória visual forte'],
    dicasComunicacao: ['Use recursos visuais', 'Mostre exemplos', 'Desenhe ou diagramme'],
    cor: 'bg-purple-500',
    icone: 'Eye'
  },
  auditivo: {
    nome: 'Auditivo',
    descricao: 'Processa informações através de sons e conversas',
    indicadores: ['Usa expressões como "ouço", "soa bem", "ressoa"', 'Prefere discussões verbais', 'Aprende ouvindo'],
    dicasComunicacao: ['Explique verbalmente', 'Use tom de voz variado', 'Permita discussões'],
    cor: 'bg-blue-500',
    icone: 'Ear'
  },
  cinestesico: {
    nome: 'Cinestésico',
    descricao: 'Processa informações através de sensações e experiências físicas',
    indicadores: ['Usa expressões como "sinto", "toque", "concreto"', 'Prefere aprender fazendo', 'Valoriza conforto físico'],
    dicasComunicacao: ['Proporcione experiências práticas', 'Permita movimento', 'Use exemplos concretos'],
    cor: 'bg-green-500',
    icone: 'Hand'
  },
  digital: {
    nome: 'Digital/Auditivo Digital',
    descricao: 'Processa informações através de lógica e análise interna',
    indicadores: ['Usa expressões como "penso", "analiso", "faz sentido"', 'Prefere dados e fatos', 'Analítico e lógico'],
    dicasComunicacao: ['Apresente dados e estatísticas', 'Use lógica sequencial', 'Forneça documentação'],
    cor: 'bg-cyan-500',
    icone: 'Brain'
  }
};

// ============================================================
// 3. Metaprogramas - Padrões de Processamento Mental
// ============================================================
export type MetaprogramType = 
  | 'aproximacao_afastamento'
  | 'interno_externo'
  | 'opcoes_procedimentos'
  | 'global_especifico'
  | 'proativo_reativo'
  | 'igual_diferente'
  | 'tempo';

export interface MetaprogramResult {
  readonly aproximacaoAfastamento: {
    aproximacao: number; // 0-100
    afastamento: number;
    descricao: string;
  };
  readonly internoExterno: {
    interno: number;
    externo: number;
    descricao: string;
  };
  readonly opcoesProcedimentos: {
    opcoes: number;
    procedimentos: number;
    descricao: string;
  };
  readonly globalEspecifico: {
    global: number;
    especifico: number;
    descricao: string;
  };
  readonly proativoReativo: {
    proativo: number;
    reativo: number;
    descricao: string;
  };
  readonly igualDiferente: {
    igual: number;
    diferente: number;
    descricao: string;
  };
  readonly tempo: {
    passado: number;
    presente: number;
    futuro: number;
    descricao: string;
  };
  readonly resumo: string;
  readonly recomendacoes: string[];
}

export const METAPROGRAMS_INFO: Record<MetaprogramType, {
  nome: string;
  polos: string[];
  descricao: string;
  perguntasExemplo: string[];
}> = {
  aproximacao_afastamento: {
    nome: 'Motivação',
    polos: ['Aproximação (busca prazer)', 'Afastamento (evita dor)'],
    descricao: 'Como a pessoa é motivada - pelo que quer alcançar ou pelo que quer evitar',
    perguntasExemplo: ['O que você busca em um emprego?', 'Por que esse tipo de trabalho é importante para você?']
  },
  interno_externo: {
    nome: 'Referência',
    polos: ['Interno (próprios critérios)', 'Externo (feedback de outros)'],
    descricao: 'Onde a pessoa busca validação e critérios de decisão',
    perguntasExemplo: ['Como você sabe que fez um bom trabalho?', 'Quem decide se algo está bom?']
  },
  opcoes_procedimentos: {
    nome: 'Razão',
    polos: ['Opções (alternativas)', 'Procedimentos (passo a passo)'],
    descricao: 'Como a pessoa prefere trabalhar - com flexibilidade ou seguindo processos',
    perguntasExemplo: ['Por que você escolheu seu trabalho atual?', 'Como você aborda uma nova tarefa?']
  },
  global_especifico: {
    nome: 'Escopo',
    polos: ['Global (visão geral)', 'Específico (detalhes)'],
    descricao: 'Nível de detalhe preferido para processar informações',
    perguntasExemplo: ['Me conte sobre seu último projeto', 'Como você descreve seu trabalho?']
  },
  proativo_reativo: {
    nome: 'Ação',
    polos: ['Proativo (inicia)', 'Reativo (responde)'],
    descricao: 'Tendência para iniciar ações ou esperar e responder',
    perguntasExemplo: ['Como você lida com novas situações?', 'O que você faz quando há um problema?']
  },
  igual_diferente: {
    nome: 'Mudança',
    polos: ['Igualdade (similaridades)', 'Diferença (mudanças)'],
    descricao: 'Como a pessoa percebe e processa mudanças',
    perguntasExemplo: ['Compare seu trabalho atual com o anterior', 'O que você busca em mudanças?']
  },
  tempo: {
    nome: 'Orientação Temporal',
    polos: ['Passado', 'Presente', 'Futuro'],
    descricao: 'Foco temporal predominante da pessoa',
    perguntasExemplo: ['Me fale sobre suas experiências', 'Onde você se vê em 5 anos?']
  }
};

// ============================================================
// 4. Gatilhos Mentais - Princípios de Persuasão
// ============================================================
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
  readonly triggers: Record<MentalTrigger, {
    sensibilidade: number; // 0-100
    descricao: string;
  }>;
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
// 5. Sleight of Mouth - Padrões de Reframe
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
  readonly habilidades: Record<SleightPattern, {
    nivel: number; // 0-100
    exemplo: string;
  }>;
  readonly pontosFortes: SleightPattern[];
  readonly areasDesenvolvimento: SleightPattern[];
  readonly estiloArgumentacao: string;
  readonly flexibilidadeCognitiva: number;
}

// ============================================================
// 6. Estados Emocionais & Âncoras
// ============================================================
export type EmotionalState = 
  | 'confianca'
  | 'motivacao'
  | 'calma'
  | 'foco'
  | 'criatividade'
  | 'determinacao'
  | 'empatia'
  | 'entusiasmo'
  | 'resiliencia'
  | 'curiosidade';

export interface EmotionalStateResult {
  readonly estadosPredominantes: EmotionalState[];
  readonly estadosDesafiadores: EmotionalState[];
  readonly regulacaoEmocional: number; // 0-100
  readonly conscienciaEmocional: number;
  readonly expressaoEmocional: number;
  readonly gatilhosPositivos: string[];
  readonly gatilhosNegativos: string[];
  readonly estrategiasRegulacao: string[];
  readonly ancorasNaturais: {
    estado: EmotionalState;
    gatilho: string;
    intensidade: number;
  }[];
}

// ============================================================
// 7. Valores & Critérios de Decisão
// ============================================================
export type ValueCategory = 
  | 'realizacao'
  | 'seguranca'
  | 'relacionamento'
  | 'autonomia'
  | 'crescimento'
  | 'contribuicao'
  | 'reconhecimento'
  | 'equilibrio'
  | 'desafio'
  | 'criatividade';

export interface ValuesResult {
  readonly valoresPrioritarios: {
    valor: ValueCategory;
    peso: number; // 1-10
    evidencias: string[];
  }[];
  readonly criteriosDecisao: {
    criterio: string;
    importancia: number;
    descricao: string;
  }[];
  readonly motivadoresInternos: string[];
  readonly motivadoresExternos: string[];
  readonly conflitosValores: string[];
  readonly alinhamentoCultural: number; // 0-100
}

export const VALUES_INFO: Record<ValueCategory, {
  nome: string;
  descricao: string;
  manifestacoes: string[];
  perguntasExploratorias: string[];
}> = {
  realizacao: {
    nome: 'Realização',
    descricao: 'Busca por resultados e conquistas',
    manifestacoes: ['Define metas ambiciosas', 'Celebra conquistas', 'Busca superação'],
    perguntasExploratorias: ['O que significa sucesso para você?', 'Qual sua maior conquista?']
  },
  seguranca: {
    nome: 'Segurança',
    descricao: 'Necessidade de estabilidade e previsibilidade',
    manifestacoes: ['Planeja cuidadosamente', 'Evita riscos', 'Busca garantias'],
    perguntasExploratorias: ['O que te dá tranquilidade?', 'Como você lida com incertezas?']
  },
  relacionamento: {
    nome: 'Relacionamento',
    descricao: 'Valorização de conexões e pertencimento',
    manifestacoes: ['Cultiva amizades', 'Trabalha em equipe', 'Valoriza lealdade'],
    perguntasExploratorias: ['Como são seus relacionamentos no trabalho?', 'O que busca em uma equipe?']
  },
  autonomia: {
    nome: 'Autonomia',
    descricao: 'Necessidade de independência e liberdade',
    manifestacoes: ['Prefere trabalhar sozinho', 'Toma decisões próprias', 'Resiste a controle'],
    perguntasExploratorias: ['Como você prefere ser gerenciado?', 'Qual seu estilo de trabalho ideal?']
  },
  crescimento: {
    nome: 'Crescimento',
    descricao: 'Busca por desenvolvimento e aprendizado',
    manifestacoes: ['Busca novos conhecimentos', 'Aceita desafios', 'Investe em si mesmo'],
    perguntasExploratorias: ['O que você quer aprender?', 'Como você se desenvolve?']
  },
  contribuicao: {
    nome: 'Contribuição',
    descricao: 'Desejo de fazer diferença e ajudar',
    manifestacoes: ['Ajuda os outros', 'Busca propósito', 'Valoriza impacto'],
    perguntasExploratorias: ['Qual legado quer deixar?', 'Como você contribui para sua equipe?']
  },
  reconhecimento: {
    nome: 'Reconhecimento',
    descricao: 'Necessidade de ser valorizado e apreciado',
    manifestacoes: ['Busca feedback', 'Gosta de elogios', 'Valoriza status'],
    perguntasExploratorias: ['Como você gosta de ser reconhecido?', 'O que significa valorização?']
  },
  equilibrio: {
    nome: 'Equilíbrio',
    descricao: 'Busca por harmonia entre vida pessoal e profissional',
    manifestacoes: ['Define limites', 'Prioriza bem-estar', 'Busca qualidade de vida'],
    perguntasExploratorias: ['Como você equilibra trabalho e vida pessoal?', 'O que é qualidade de vida?']
  },
  desafio: {
    nome: 'Desafio',
    descricao: 'Motivação por situações desafiadoras',
    manifestacoes: ['Busca dificuldades', 'Se entedia com rotina', 'Gosta de resolver problemas'],
    perguntasExploratorias: ['Que tipo de desafio te motiva?', 'Como você lida com obstáculos?']
  },
  criatividade: {
    nome: 'Criatividade',
    descricao: 'Expressão criativa e inovação',
    manifestacoes: ['Propõe ideias novas', 'Pensa fora da caixa', 'Inova constantemente'],
    perguntasExploratorias: ['Como você expressa sua criatividade?', 'Qual foi sua ideia mais inovadora?']
  }
};

// ============================================================
// 8. Inteligência Emocional (EQ) - 5 Pilares de Goleman
// ============================================================
export interface EQResult {
  readonly autoconsciencia: {
    score: number; // 0-100
    conscienciaEmocional: number;
    autoavaliacao: number;
    autoconfianca: number;
    descricao: string;
  };
  readonly autorregulacao: {
    score: number;
    autocontrole: number;
    confiabilidade: number;
    adaptabilidade: number;
    inovacao: number;
    descricao: string;
  };
  readonly motivacao: {
    score: number;
    orientacaoRealizacao: number;
    comprometimento: number;
    iniciativa: number;
    otimismo: number;
    descricao: string;
  };
  readonly empatia: {
    score: number;
    compreensaoOutros: number;
    desenvolvimentoOutros: number;
    orientacaoServico: number;
    conscienciaPolitica: number;
    descricao: string;
  };
  readonly habilidadesSociais: {
    score: number;
    influencia: number;
    comunicacao: number;
    lideranca: number;
    catalisadorMudanca: number;
    colaboracao: number;
    descricao: string;
  };
  readonly scoreGeral: number;
  readonly pontosFortes: string[];
  readonly areasDesenvolvimento: string[];
  readonly recomendacoes: string[];
}

// ============================================================
// 9. Vieses Cognitivos
// ============================================================
export type CognitiveBias = 
  | 'confirmacao'
  | 'ancoragem'
  | 'disponibilidade'
  | 'excesso_confianca'
  | 'aversao_perda'
  | 'efeito_manada'
  | 'retrospectiva'
  | 'projecao'
  | 'atribuicao'
  | 'enquadramento';

export interface CognitiveBiasResult {
  readonly viesesIdentificados: {
    vies: CognitiveBias;
    intensidade: number; // 0-100
    exemplos: string[];
    impacto: string;
  }[];
  readonly conscienciaCognitiva: number;
  readonly flexibilidadePensamento: number;
  readonly tomadaDecisao: {
    estilo: 'analitico' | 'intuitivo' | 'misto';
    velocidade: 'rapida' | 'moderada' | 'deliberada';
    toleranciaRisco: 'baixa' | 'media' | 'alta';
  };
  readonly estrategiasMitigacao: string[];
}

export const COGNITIVE_BIASES_INFO: Record<CognitiveBias, {
  nome: string;
  descricao: string;
  exemplos: string[];
  comoMitigar: string[];
}> = {
  confirmacao: {
    nome: 'Viés de Confirmação',
    descricao: 'Tendência a buscar informações que confirmam crenças existentes',
    exemplos: ['Ignora feedbacks contrários', 'Busca só opiniões similares'],
    comoMitigar: ['Busque ativamente visões contrárias', 'Questione suas premissas']
  },
  ancoragem: {
    nome: 'Ancoragem',
    descricao: 'Dependência excessiva da primeira informação recebida',
    exemplos: ['Foca no primeiro número apresentado', 'Dificuldade em ajustar estimativas'],
    comoMitigar: ['Considere múltiplas referências', 'Revise estimativas sistematicamente']
  },
  disponibilidade: {
    nome: 'Heurística de Disponibilidade',
    descricao: 'Julgamentos baseados em exemplos que vêm facilmente à mente',
    exemplos: ['Superestima eventos recentes', 'Ignora estatísticas'],
    comoMitigar: ['Use dados objetivos', 'Considere a base rate']
  },
  excesso_confianca: {
    nome: 'Excesso de Confiança',
    descricao: 'Superestimação das próprias habilidades e conhecimentos',
    exemplos: ['Subestima dificuldades', 'Não pede ajuda'],
    comoMitigar: ['Busque feedback', 'Documente acertos e erros']
  },
  aversao_perda: {
    nome: 'Aversão à Perda',
    descricao: 'Perdas parecem maiores que ganhos equivalentes',
    exemplos: ['Evita riscos excessivamente', 'Mantém posições perdedoras'],
    comoMitigar: ['Analise objetivamente', 'Considere custo de oportunidade']
  },
  efeito_manada: {
    nome: 'Efeito Manada',
    descricao: 'Seguir a maioria sem análise própria',
    exemplos: ['Segue tendências cegamente', 'Dificuldade em ir contra o grupo'],
    comoMitigar: ['Analise independentemente', 'Questione consensos']
  },
  retrospectiva: {
    nome: 'Viés de Retrospectiva',
    descricao: 'Tendência a ver eventos passados como previsíveis',
    exemplos: ['"Eu sabia que isso ia acontecer"', 'Subestima incerteza passada'],
    comoMitigar: ['Documente previsões antes', 'Revise com humildade']
  },
  projecao: {
    nome: 'Viés de Projeção',
    descricao: 'Projetar sentimentos atuais no futuro',
    exemplos: ['Decisões baseadas em humor', 'Dificuldade em prever mudanças'],
    comoMitigar: ['Considere contextos diferentes', 'Planeje para cenários']
  },
  atribuicao: {
    nome: 'Erro de Atribuição',
    descricao: 'Atribuir comportamento a traços em vez de situações',
    exemplos: ['Julga pessoas rapidamente', 'Ignora contexto'],
    comoMitigar: ['Considere fatores situacionais', 'Evite julgamentos rápidos']
  },
  enquadramento: {
    nome: 'Efeito de Enquadramento',
    descricao: 'Decisões influenciadas pela forma de apresentação',
    exemplos: ['Reage diferente a "90% sucesso" vs "10% falha"', 'Manipulado por framing'],
    comoMitigar: ['Reframe informações', 'Analise múltiplas perspectivas']
  }
};

// ============================================================
// 10. Rapport & Espelhamento
// ============================================================
export interface RapportResult {
  readonly habilidadesRapport: {
    espelhamentoFisico: number; // 0-100
    espelhamentoVerbal: number;
    escutaAtiva: number;
    sintonia: number;
    flexibilidade: number;
  };
  readonly estiloConexao: 'caloroso' | 'profissional' | 'reservado' | 'adaptavel';
  readonly velocidadeConexao: 'rapida' | 'moderada' | 'gradual';
  readonly sinaisConfianca: string[];
  readonly barreirasConexao: string[];
  readonly recomendacoes: string[];
  readonly scoreGeral: number;
}

// ============================================================
// Assessment Completo Comportamental
// ============================================================
export interface BehavioralAssessmentType {
  id: string;
  nome: string;
  descricao: string;
  duracao: number; // minutos
  icone: string;
  cor: string;
  ativo: boolean;
}

export const BEHAVIORAL_ASSESSMENTS: BehavioralAssessmentType[] = [
  { id: 'disc', nome: 'DISC', descricao: 'Perfis comportamentais', duracao: 15, icone: 'Users', cor: 'bg-red-500', ativo: true },
  { id: 'vakd', nome: 'VAK/D', descricao: 'Sistemas representacionais', duracao: 10, icone: 'Eye', cor: 'bg-purple-500', ativo: true },
  { id: 'metaprogramas', nome: 'Metaprogramas', descricao: 'Padrões de processamento mental', duracao: 20, icone: 'Brain', cor: 'bg-indigo-500', ativo: true },
  { id: 'gatilhos', nome: 'Gatilhos Mentais', descricao: 'Princípios de persuasão', duracao: 12, icone: 'Zap', cor: 'bg-yellow-500', ativo: true },
  { id: 'sleight', nome: 'Sleight of Mouth', descricao: 'Padrões de reframe', duracao: 15, icone: 'MessageSquare', cor: 'bg-orange-500', ativo: true },
  { id: 'emocional', nome: 'Estados Emocionais', descricao: 'Detecção e gestão de emoções', duracao: 15, icone: 'Heart', cor: 'bg-pink-500', ativo: true },
  { id: 'valores', nome: 'Valores & Critérios', descricao: 'Mapeamento de motivadores', duracao: 12, icone: 'Target', cor: 'bg-green-500', ativo: true },
  { id: 'eq', nome: 'Inteligência Emocional', descricao: '5 Pilares de Goleman', duracao: 25, icone: 'Sparkles', cor: 'bg-cyan-500', ativo: true },
  { id: 'vieses', nome: 'Vieses Cognitivos', descricao: 'Padrões de pensamento', duracao: 15, icone: 'Lightbulb', cor: 'bg-amber-500', ativo: true },
  { id: 'rapport', nome: 'Rapport & Espelhamento', descricao: 'Técnicas de conexão', duracao: 10, icone: 'Handshake', cor: 'bg-teal-500', ativo: true }
];

export interface FullBehavioralProfile {
  readonly candidatoId: string;
  readonly dataAvaliacao: string;
  readonly disc?: DISCResult;
  readonly vakd?: VAKDResult;
  readonly metaprogramas?: MetaprogramResult;
  readonly gatilhosMentais?: MentalTriggerResult;
  readonly sleight?: SleightResult;
  readonly estadosEmocionais?: EmotionalStateResult;
  readonly valores?: ValuesResult;
  readonly eq?: EQResult;
  readonly viesesCognitivos?: CognitiveBiasResult;
  readonly rapport?: RapportResult;
  readonly perfilGeral: string;
  readonly scoreCompatibilidade?: number;
  readonly recomendacaoFinal: 'altamente_recomendado' | 'recomendado' | 'com_ressalvas' | 'nao_recomendado';
}

// ============================================================
// Types for the Assessment System
// ============================================================

/** Interface for tool configuration */
export interface BehavioralTool {
  id: string;
  name: string;
  description: string;
  color: string;
  estimatedTime: number;
  dimensions: string[];
  questionCount: number;
}

/** Interface for questions */
export interface BehavioralQuestion {
  id: string;
  toolId: string;
  text: string;
  dimension: string;
  type: 'scale' | 'forced_choice' | 'situational' | 'ranking';
  options?: {
    text: string;
    dimension: string;
    score: number;
  }[];
  scaleLabels?: {
    min: string;
    max: string;
  };
}

/** Interface for assessment results */
export interface BehavioralResult {
  toolId: string;
  candidatoId?: string;
  completedAt: string;
  timeSpent: number;
  scores: Record<string, number>;
  primaryProfile: string;
  secondaryProfile?: string;
  rawAnswers: Record<string, number | string>;
}

/** Array of all 14 behavioral tools (10 originais + 4 avançadas) */
export const BEHAVIORAL_TOOLS: BehavioralTool[] = [
  {
    id: 'disc',
    name: 'DISC',
    description: 'Avalia perfis comportamentais: Dominância, Influência, Estabilidade e Conformidade',
    color: '#ef4444',
    estimatedTime: 15,
    dimensions: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'],
    questionCount: 8,
  },
  {
    id: 'vakd',
    name: 'VAK/D',
    description: 'Identifica sistemas representacionais: Visual, Auditivo, Cinestésico e Digital',
    color: '#8b5cf6',
    estimatedTime: 10,
    dimensions: ['Visual', 'Auditivo', 'Cinestésico', 'Digital'],
    questionCount: 6,
  },
  {
    id: 'metaprograms',
    name: 'Metaprogramas',
    description: 'Mapeia padrões de processamento mental e tomada de decisão',
    color: '#6366f1',
    estimatedTime: 20,
    dimensions: ['Aproximação', 'Referência', 'Opções', 'Escopo', 'Mudança', 'Iniciativa', 'Afiliação'],
    questionCount: 8,
  },
  {
    id: 'mental_triggers',
    name: 'Gatilhos Mentais',
    description: 'Avalia sensibilidade aos princípios de persuasão de Cialdini',
    color: '#eab308',
    estimatedTime: 12,
    dimensions: ['Escassez', 'Autoridade', 'Prova Social', 'Reciprocidade', 'Compromisso', 'Afinidade'],
    questionCount: 6,
  },
  {
    id: 'sleight_of_mouth',
    name: 'Sleight of Mouth',
    description: 'Mede habilidade em padrões de reframe linguístico',
    color: '#f97316',
    estimatedTime: 15,
    dimensions: ['Reframe', 'Consequência', 'Contra-exemplo', 'Redefinição', 'Meta-Frame'],
    questionCount: 3,
  },
  {
    id: 'emotional_states',
    name: 'Estados Emocionais',
    description: 'Avalia detecção e gestão de emoções e âncoras',
    color: '#ec4899',
    estimatedTime: 15,
    dimensions: ['Autoconsciência', 'Gestão de Estados', 'Empatia', 'Ancoragem', 'Recuperação'],
    questionCount: 6,
  },
  {
    id: 'values',
    name: 'Valores & Critérios',
    description: 'Mapeia valores prioritários e critérios de decisão',
    color: '#22c55e',
    estimatedTime: 12,
    dimensions: ['Autonomia', 'Reconhecimento', 'Segurança', 'Crescimento', 'Propósito'],
    questionCount: 6,
  },
  {
    id: 'emotional_intelligence',
    name: 'Inteligência Emocional',
    description: 'Avalia os 5 pilares de Goleman: autoconsciência, autorregulação, motivação, empatia e habilidades sociais',
    color: '#06b6d4',
    estimatedTime: 25,
    dimensions: ['Autoconsciência', 'Autorregulação', 'Motivação', 'Empatia', 'Habilidades Sociais'],
    questionCount: 10,
  },
  {
    id: 'cognitive_biases',
    name: 'Vieses Cognitivos',
    description: 'Identifica padrões de pensamento e vieses na tomada de decisão',
    color: '#f59e0b',
    estimatedTime: 15,
    dimensions: ['Confirmação', 'Ancoragem', 'Disponibilidade', 'Excesso de Confiança', 'Aversão à Perda'],
    questionCount: 5,
  },
  {
    id: 'rapport',
    name: 'Rapport & Espelhamento',
    description: 'Avalia habilidades de conexão, sintonia e espelhamento',
    color: '#14b8a6',
    estimatedTime: 10,
    dimensions: ['Espelhamento Físico', 'Espelhamento Verbal', 'Escuta Ativa', 'Sintonia', 'Flexibilidade'],
    questionCount: 6,
  },
  // ============ NOVAS FERRAMENTAS AVANÇADAS ============
  {
    id: 'generational',
    name: 'Inteligência Geracional',
    description: 'Identifica perfil geracional e adapta comunicação, motivadores e estilo de trabalho',
    color: '#a855f7',
    estimatedTime: 12,
    dimensions: ['Silent/Boomer', 'Gen X', 'Millennial', 'Gen Z'],
    questionCount: 8,
  },
  {
    id: 'stress_profile',
    name: 'Perfil sob Stress',
    description: 'Avalia como você reage sob pressão e quais gatilhos de stress te afetam',
    color: '#dc2626',
    estimatedTime: 10,
    dimensions: ['Gatilhos', 'Comportamentos', 'Recuperação', 'Riscos'],
    questionCount: 6,
  },
  {
    id: 'triune_brain',
    name: 'Modelo 3 Cérebros',
    description: 'Identifica dominância cerebral: Reptiliano (segurança), Límbico (emoção), Neocórtex (lógica)',
    color: '#0891b2',
    estimatedTime: 12,
    dimensions: ['Reptiliano', 'Límbico', 'Neocórtex'],
    questionCount: 8,
  },
  {
    id: 'disc_compatibility',
    name: 'Compatibilidade DISC',
    description: 'Analisa compatibilidade entre perfis DISC para prever sinergia e conflitos em equipe',
    color: '#059669',
    estimatedTime: 5,
    dimensions: ['Sinergia', 'Conflitos', 'Comunicação', 'Estilo de Trabalho'],
    questionCount: 0, // Usa resultado do DISC, não tem questões próprias
  },
];
