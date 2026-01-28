/**
 * @fileoverview Tipos para ferramentas comportamentais avançadas
 * @module types/advancedBehavioral
 * 
 * Novas ferramentas baseadas em análise de CRM:
 * - Inteligência Geracional
 * - Perfil sob Stress
 * - Compatibilidade DISC
 * - Modelo 3 Cérebros
 */

// ============================================================
// 1. INTELIGÊNCIA GERACIONAL
// ============================================================
export type GenerationType = 'silent' | 'baby_boomer' | 'gen_x' | 'millennial' | 'gen_z' | 'gen_alpha';

export interface GenerationalProfile {
  readonly generation: GenerationType;
  readonly confidence: number; // 0-100
  readonly characteristics: string[];
  readonly communicationPreferences: string[];
  readonly motivators: string[];
  readonly workStyle: string;
  readonly preferredChannels: string[];
  readonly managementApproach: string;
}

export const GENERATIONS_INFO: Record<GenerationType, {
  nome: string;
  anos: string;
  descricao: string;
  caracteristicas: string[];
  motivadores: string[];
  comunicacao: string[];
  canaisPreferidos: string[];
  comoGerenciar: string[];
  cor: string;
}> = {
  silent: {
    nome: 'Geração Silenciosa',
    anos: '1928-1945',
    descricao: 'Valorizam tradição, lealdade e formalidade',
    caracteristicas: ['Tradicionais', 'Leais', 'Formais', 'Disciplinados', 'Respeito à hierarquia'],
    motivadores: ['Estabilidade', 'Reconhecimento por tempo de serviço', 'Segurança'],
    comunicacao: ['Formal', 'Pessoal', 'Respeitosa', 'Clara'],
    canaisPreferidos: ['Telefone', 'Presencial', 'Carta formal'],
    comoGerenciar: ['Respeite experiência', 'Comunicação formal', 'Valorize lealdade'],
    cor: 'bg-gray-600'
  },
  baby_boomer: {
    nome: 'Baby Boomers',
    anos: '1946-1964',
    descricao: 'Focados em status, conquista e relacionamentos',
    caracteristicas: ['Workaholics', 'Competitivos', 'Orientados a carreira', 'Valorizam títulos'],
    motivadores: ['Status', 'Reconhecimento público', 'Promoções', 'Títulos'],
    comunicacao: ['Direta', 'Detalhada', 'Formal mas acessível'],
    canaisPreferidos: ['Email', 'Telefone', 'Reuniões presenciais'],
    comoGerenciar: ['Reconheça conquistas', 'Dê títulos e status', 'Valorize dedicação'],
    cor: 'bg-blue-600'
  },
  gen_x: {
    nome: 'Geração X',
    anos: '1965-1980',
    descricao: 'Pragmáticos, independentes, valorizam equilíbrio',
    caracteristicas: ['Independentes', 'Pragmáticos', 'Céticos', 'Adaptáveis', 'Autossuficientes'],
    motivadores: ['Equilíbrio vida-trabalho', 'Autonomia', 'Resultados', 'Flexibilidade'],
    comunicacao: ['Direta ao ponto', 'Informal', 'Eficiente'],
    canaisPreferidos: ['Email', 'Mensagens', 'Videochamadas'],
    comoGerenciar: ['Dê autonomia', 'Foque em resultados', 'Respeite tempo pessoal'],
    cor: 'bg-green-600'
  },
  millennial: {
    nome: 'Millennials (Gen Y)',
    anos: '1981-1996',
    descricao: 'Buscam propósito, experiência e autenticidade',
    caracteristicas: ['Colaborativos', 'Tecnológicos', 'Buscam propósito', 'Feedback constante'],
    motivadores: ['Propósito', 'Desenvolvimento', 'Feedback', 'Impacto social', 'Experiências'],
    comunicacao: ['Casual', 'Transparente', 'Colaborativa', 'Digital'],
    canaisPreferidos: ['Slack/Teams', 'WhatsApp', 'Redes sociais', 'Videochamadas'],
    comoGerenciar: ['Dê propósito', 'Feedback frequente', 'Oportunidades de crescimento'],
    cor: 'bg-purple-600'
  },
  gen_z: {
    nome: 'Geração Z',
    anos: '1997-2012',
    descricao: 'Nativos digitais, visuais, valorizam diversidade e velocidade',
    caracteristicas: ['Nativos digitais', 'Multitarefa', 'Visuais', 'Diversos', 'Empreendedores'],
    motivadores: ['Autenticidade', 'Diversidade', 'Velocidade', 'Impacto imediato', 'Criatividade'],
    comunicacao: ['Visual', 'Curta', 'Autêntica', 'Instantânea'],
    canaisPreferidos: ['Instagram', 'TikTok', 'Discord', 'Vídeos curtos'],
    comoGerenciar: ['Use vídeos', 'Seja autêntico', 'Ações imediatas', 'Diversidade'],
    cor: 'bg-pink-600'
  },
  gen_alpha: {
    nome: 'Geração Alpha',
    anos: '2013+',
    descricao: 'IA nativos, sustentabilidade, totalmente digitais',
    caracteristicas: ['IA nativos', 'Sustentáveis', 'Hiperconectados', 'Aprendizado visual'],
    motivadores: ['Tecnologia', 'Sustentabilidade', 'Gamificação', 'Interatividade'],
    comunicacao: ['Visual/Vídeo', 'Interativa', 'Gamificada', 'IA-assistida'],
    canaisPreferidos: ['Assistentes IA', 'Realidade aumentada', 'Jogos', 'YouTube'],
    comoGerenciar: ['Gamifique tudo', 'Use IA', 'Sustentabilidade como valor'],
    cor: 'bg-cyan-600'
  }
};

// ============================================================
// 2. PERFIL SOB STRESS (DISC)
// ============================================================
export type StressResponse = 'fight' | 'flight' | 'freeze' | 'fawn';

export interface DISCStressProfile {
  readonly discProfile: 'D' | 'I' | 'S' | 'C';
  readonly stressResponse: StressResponse;
  readonly stressTriggers: string[];
  readonly stressBehaviors: string[];
  readonly recoveryStrategies: string[];
  readonly communicationUnderStress: string;
  readonly warningSignals: string[];
  readonly supportNeeds: string[];
}

export const DISC_STRESS_INFO: Record<'D' | 'I' | 'S' | 'C', {
  respostaPrimaria: StressResponse;
  gatilhos: string[];
  comportamentos: string[];
  sinaisAlerta: string[];
  comoApoiar: string[];
  comunicacaoSobStress: string;
  recuperacao: string[];
}> = {
  D: {
    respostaPrimaria: 'fight',
    gatilhos: ['Perda de controle', 'Processos lentos', 'Burocracia', 'Incompetência percebida'],
    comportamentos: ['Autoritário', 'Impaciente', 'Agressivo verbalmente', 'Controlador extremo'],
    sinaisAlerta: ['Tom de voz mais alto', 'Interrompe frequentemente', 'Impõe decisões'],
    comoApoiar: ['Dê controle onde possível', 'Seja direto', 'Mostre resultados rápidos'],
    comunicacaoSobStress: 'Torna-se ainda mais direto, pode parecer rude ou insensível',
    recuperacao: ['Exercício físico', 'Resolver problemas', 'Tomar decisões', 'Ação imediata']
  },
  I: {
    respostaPrimaria: 'flight',
    gatilhos: ['Rejeição social', 'Isolamento', 'Críticas públicas', 'Ambiente negativo'],
    comportamentos: ['Fala demais', 'Desorganizado', 'Busca aprovação', 'Evita problemas'],
    sinaisAlerta: ['Fala acelerada', 'Otimismo excessivo', 'Mudanças bruscas de humor'],
    comoApoiar: ['Reconheça sentimentos', 'Mantenha ambiente positivo', 'Não critique publicamente'],
    comunicacaoSobStress: 'Fala ainda mais, pode divagar e evitar assuntos difíceis',
    recuperacao: ['Socialização', 'Atividades divertidas', 'Reconhecimento', 'Expressão criativa']
  },
  S: {
    respostaPrimaria: 'freeze',
    gatilhos: ['Mudanças súbitas', 'Conflitos', 'Pressão por decisões rápidas', 'Instabilidade'],
    comportamentos: ['Passivo', 'Indeciso', 'Resistência silenciosa', 'Procrastinação'],
    sinaisAlerta: ['Silêncio prolongado', 'Concordância excessiva', 'Evita decisões'],
    comoApoiar: ['Dê tempo', 'Ambiente estável', 'Passo a passo', 'Não pressione'],
    comunicacaoSobStress: 'Torna-se mais quieto, pode concordar sem realmente concordar',
    recuperacao: ['Rotina estável', 'Apoio de pessoas próximas', 'Tempo para processar', 'Ambiente calmo']
  },
  C: {
    respostaPrimaria: 'freeze',
    gatilhos: ['Erros e falhas', 'Falta de informação', 'Decisões sem dados', 'Caos e desorganização'],
    comportamentos: ['Perfeccionismo extremo', 'Paralisia por análise', 'Crítico', 'Isolamento'],
    sinaisAlerta: ['Pedidos de mais dados', 'Revisões infinitas', 'Críticas detalhadas'],
    comoApoiar: ['Forneça dados', 'Defina prazos claros', 'Aceite imperfeição', 'Estruture processos'],
    comunicacaoSobStress: 'Torna-se ainda mais detalhista, pode parecer crítico ou pessimista',
    recuperacao: ['Análise do problema', 'Documentação', 'Planejamento', 'Ambiente organizado']
  }
};

// ============================================================
// 3. MODELO 3 CÉREBROS (Neuromarketing)
// ============================================================
export type BrainType = 'reptiliano' | 'limbico' | 'neocortex';

export interface TriuneBrainProfile {
  readonly reptiliano: number; // 0-100
  readonly limbico: number; // 0-100
  readonly neocortex: number; // 0-100
  readonly dominante: BrainType;
  readonly motivadoresPrimarios: string[];
  readonly gatilhosEfetivos: string[];
  readonly abordagemRecomendada: string;
  readonly tomadaDecisao: string;
}

export const TRIUNE_BRAIN_INFO: Record<BrainType, {
  nome: string;
  foco: string;
  motivadores: string[];
  gatilhos: string[];
  comunicacao: string[];
  abordagemVenda: string[];
  exemplos: string[];
  cor: string;
}> = {
  reptiliano: {
    nome: 'Cérebro Reptiliano',
    foco: 'Sobrevivência, segurança, instintos básicos',
    motivadores: ['Segurança', 'Proteção', 'Sobrevivência', 'Recursos básicos'],
    gatilhos: ['Escassez', 'Urgência', 'Medo de perda', 'Proteção da família'],
    comunicacao: ['Simples', 'Visual', 'Contraste claro', 'Benefícios tangíveis'],
    abordagemVenda: [
      'Mostre o risco de não agir',
      'Use escassez genuína',
      'Destaque segurança e garantias',
      'Seja visual e concreto'
    ],
    exemplos: ['Seguro de vida', 'Planos de saúde', 'Sistemas de segurança'],
    cor: 'bg-red-600'
  },
  limbico: {
    nome: 'Cérebro Límbico',
    foco: 'Emoções, conexão, pertencimento',
    motivadores: ['Pertencimento', 'Status', 'Prazer', 'Conexão emocional', 'Amor'],
    gatilhos: ['Prova social', 'Exclusividade', 'Storytelling', 'Emoção', 'Comunidade'],
    comunicacao: ['Emocional', 'Histórias', 'Testemunhos', 'Conexão pessoal'],
    abordagemVenda: [
      'Conte histórias emocionantes',
      'Mostre depoimentos',
      'Crie senso de comunidade',
      'Conecte com valores pessoais'
    ],
    exemplos: ['Marcas de luxo', 'Clubes exclusivos', 'Experiências únicas'],
    cor: 'bg-orange-600'
  },
  neocortex: {
    nome: 'Neocórtex',
    foco: 'Lógica, análise, planejamento racional',
    motivadores: ['Dados', 'ROI', 'Eficiência', 'Lógica', 'Comparativos'],
    gatilhos: ['Estatísticas', 'Estudos de caso', 'Comparativos', 'Análise custo-benefício'],
    comunicacao: ['Detalhada', 'Baseada em dados', 'Estruturada', 'Comparativa'],
    abordagemVenda: [
      'Apresente dados e estatísticas',
      'Mostre ROI calculado',
      'Compare com alternativas',
      'Forneça documentação técnica'
    ],
    exemplos: ['Software B2B', 'Investimentos', 'Equipamentos técnicos'],
    cor: 'bg-blue-600'
  }
};

// ============================================================
// 4. COMPATIBILIDADE DISC
// ============================================================
export interface DISCCompatibility {
  readonly profile1: 'D' | 'I' | 'S' | 'C';
  readonly profile2: 'D' | 'I' | 'S' | 'C';
  readonly compatibilityScore: number; // 0-100
  readonly synergies: string[];
  readonly potentialConflicts: string[];
  readonly communicationTips: string[];
  readonly workStyle: string;
}

export const DISC_COMPATIBILITY_MATRIX: Record<string, {
  score: number;
  sinergias: string[];
  conflitos: string[];
  dicasComunicacao: string[];
  estiloTrabalho: string;
}> = {
  'D-D': {
    score: 60,
    sinergias: ['Foco em resultados', 'Decisões rápidas', 'Ambiente competitivo'],
    conflitos: ['Disputa por controle', 'Ego forte', 'Pouca paciência mútua'],
    dicasComunicacao: ['Definam papéis claros', 'Foquem em resultados', 'Evitem disputas de poder'],
    estiloTrabalho: 'Competitivo mas produtivo se houver divisão clara de responsabilidades'
  },
  'D-I': {
    score: 75,
    sinergias: ['D traz foco', 'I traz entusiasmo', 'Complementam energia'],
    conflitos: ['D pode achar I superficial', 'I pode achar D frio'],
    dicasComunicacao: ['D deve ouvir mais', 'I deve ser mais objetivo'],
    estiloTrabalho: 'Dupla dinâmica - D executa, I motiva e vende'
  },
  'D-S': {
    score: 55,
    sinergias: ['D lidera', 'S implementa', 'Estabilidade com ação'],
    conflitos: ['D é rápido demais para S', 'S é lento demais para D'],
    dicasComunicacao: ['D deve dar mais tempo', 'S deve se posicionar mais'],
    estiloTrabalho: 'Funciona se D respeitar ritmo de S e S aceitar mudanças'
  },
  'D-C': {
    score: 50,
    sinergias: ['D decide rápido', 'C valida com dados', 'Equilíbrio ação-análise'],
    conflitos: ['D ignora detalhes', 'C demora demais para D'],
    dicasComunicacao: ['D deve pedir dados', 'C deve ser mais conciso'],
    estiloTrabalho: 'Tensão produtiva se houver respeito mútuo pelo estilo diferente'
  },
  'I-I': {
    score: 85,
    sinergias: ['Ambiente positivo', 'Criatividade alta', 'Colaboração natural'],
    conflitos: ['Falta de foco', 'Desorganização', 'Pouca execução'],
    dicasComunicacao: ['Definam prazos', 'Tenham alguém para organizar'],
    estiloTrabalho: 'Altamente criativo mas precisa de estrutura externa'
  },
  'I-S': {
    score: 80,
    sinergias: ['Ambiente harmonioso', 'Boa comunicação', 'Suporte mútuo'],
    conflitos: ['Podem evitar conflitos necessários', 'Decisões lentas'],
    dicasComunicacao: ['Abordem problemas diretamente', 'Estabeleçam metas claras'],
    estiloTrabalho: 'Excelente para ambiente colaborativo e atendimento'
  },
  'I-C': {
    score: 45,
    sinergias: ['I traz criatividade', 'C traz estrutura'],
    conflitos: ['I muito casual para C', 'C muito crítico para I'],
    dicasComunicacao: ['I deve respeitar processos', 'C deve ser menos crítico'],
    estiloTrabalho: 'Difícil mas complementar quando funciona'
  },
  'S-S': {
    score: 75,
    sinergias: ['Ambiente estável', 'Lealdade', 'Trabalho consistente'],
    conflitos: ['Mudanças são difíceis', 'Podem estagnar'],
    dicasComunicacao: ['Introduzam mudanças gradualmente', 'Celebrem pequenas vitórias'],
    estiloTrabalho: 'Altamente confiável mas pode faltar inovação'
  },
  'S-C': {
    score: 70,
    sinergias: ['S implementa', 'C planeja', 'Qualidade alta'],
    conflitos: ['Ambos são lentos para decidir', 'Podem ser muito cautelosos'],
    dicasComunicacao: ['Estabeleçam prazos', 'Um deve tomar iniciativa'],
    estiloTrabalho: 'Excelente qualidade, precisa de pressão externa para velocidade'
  },
  'C-C': {
    score: 65,
    sinergias: ['Alta qualidade', 'Análise profunda', 'Processos organizados'],
    conflitos: ['Paralisia por análise', 'Críticas mútuas', 'Perfeccionismo'],
    dicasComunicacao: ['Aceitem imperfeição', 'Definam "bom o suficiente"'],
    estiloTrabalho: 'Excelente para trabalho técnico que exige precisão'
  }
};

// Função helper para obter compatibilidade (ordem não importa)
export function getDISCCompatibility(profile1: 'D' | 'I' | 'S' | 'C', profile2: 'D' | 'I' | 'S' | 'C') {
  const key1 = `${profile1}-${profile2}`;
  const key2 = `${profile2}-${profile1}`;
  return DISC_COMPATIBILITY_MATRIX[key1] || DISC_COMPATIBILITY_MATRIX[key2] || null;
}
