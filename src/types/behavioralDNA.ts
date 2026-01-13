// ==========================================
// DNA COMPORTAMENTAL - SISTEMA DISRUPTIVO
// O Tinder Corporativo baseado em 10 pilares
// ==========================================

// 5 Hélices do DNA Comportamental
export interface DNAHelix {
  strategic: number;    // 0-100: Mente Estratégica
  emotional: number;    // 0-100: Coração Emocional  
  influence: number;    // 0-100: Voz Influenciadora
  values: number;       // 0-100: Bússola de Valores
  adaptive: number;     // 0-100: Força Adaptativa
}

export interface DNAStrand {
  id: keyof DNAHelix;
  name: string;
  description: string;
  icon: string;
  color: string;
  pillars: string[]; // Os 2 pilares que compõem cada hélice
}

export const DNA_STRANDS: DNAStrand[] = [
  {
    id: 'strategic',
    name: 'Mente Estratégica',
    description: 'Capacidade analítica e visão sistêmica',
    icon: 'Brain',
    color: '#8B5CF6',
    pillars: ['Pensamento Analítico', 'Visão de Futuro']
  },
  {
    id: 'emotional',
    name: 'Coração Emocional',
    description: 'Inteligência emocional e empatia',
    icon: 'Heart',
    color: '#EC4899',
    pillars: ['Autoconsciência', 'Gestão Relacional']
  },
  {
    id: 'influence',
    name: 'Voz Influenciadora',
    description: 'Comunicação e liderança natural',
    icon: 'Mic2',
    color: '#F59E0B',
    pillars: ['Comunicação Assertiva', 'Persuasão Ética']
  },
  {
    id: 'values',
    name: 'Bússola de Valores',
    description: 'Ética, propósito e integridade',
    icon: 'Compass',
    color: '#10B981',
    pillars: ['Integridade', 'Propósito']
  },
  {
    id: 'adaptive',
    name: 'Força Adaptativa',
    description: 'Resiliência e flexibilidade',
    icon: 'Zap',
    color: '#06B6D4',
    pillars: ['Resiliência', 'Agilidade Mental']
  }
];

// Cenário Imersivo
export interface ScenarioChoice {
  id: string;
  text: string;
  consequence: string;
  helixImpact: DNAHelix;
}

export interface ImmersiveScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  imageUrl?: string;
  ambiance: 'tense' | 'reflective' | 'dramatic' | 'celebratory';
  choices: ScenarioChoice[];
}

// Mini-Jogos Comportamentais
export type MiniGameType = 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';

export interface BehavioralMiniGame {
  id: string;
  type: MiniGameType;
  name: string;
  description: string;
  duration: number; // segundos
  targetHelix: keyof DNAHelix;
}

// Perfil DNA Completo
export interface DNAProfile {
  id: string;
  type: 'candidate' | 'company';
  name: string;
  helix: DNAHelix;
  dnaCode: string; // Ex: "S85-E72-I68-V91-A77"
  archetype: DNAArchetypeId;
  strengths: string[];
  challenges: string[];
  idealEnvironment: string;
  completedAt: string;
}

// 10 Arquétipos Comportamentais
export type DNAArchetypeId = 
  | 'visionary'      // Visionário
  | 'strategist'     // Estrategista  
  | 'innovator'      // Inovador
  | 'connector'      // Conector
  | 'guardian'       // Guardião
  | 'catalyst'       // Catalisador
  | 'harmonizer'     // Harmonizador
  | 'executor'       // Executor
  | 'mentor'         // Mentor
  | 'pioneer';       // Pioneiro

export interface DNAArchetype {
  id: DNAArchetypeId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  dominantHelix: keyof DNAHelix;
  secondaryHelix: keyof DNAHelix;
  strengths: string[];
  challenges: string[];
  compatibleWith: DNAArchetypeId[];
  tensionWith: DNAArchetypeId[];
}

export const DNA_ARCHETYPES: DNAArchetype[] = [
  {
    id: 'visionary',
    name: 'Visionário',
    emoji: '🔮',
    description: 'Enxerga possibilidades onde outros veem obstáculos',
    color: '#8B5CF6',
    dominantHelix: 'strategic',
    secondaryHelix: 'adaptive',
    strengths: ['Pensamento disruptivo', 'Inspiração natural', 'Visão de longo prazo'],
    challenges: ['Impaciência com detalhes', 'Pode parecer desconectado', 'Dificuldade em executar'],
    compatibleWith: ['executor', 'catalyst', 'innovator'],
    tensionWith: ['guardian', 'harmonizer']
  },
  {
    id: 'strategist',
    name: 'Estrategista',
    emoji: '♟️',
    description: 'Mestre em planejamento e análise complexa',
    color: '#6366F1',
    dominantHelix: 'strategic',
    secondaryHelix: 'influence',
    strengths: ['Análise profunda', 'Planejamento preciso', 'Visão sistêmica'],
    challenges: ['Paralisia por análise', 'Pode ser frio', 'Resistência a improvisos'],
    compatibleWith: ['executor', 'guardian', 'mentor'],
    tensionWith: ['pioneer', 'catalyst']
  },
  {
    id: 'innovator',
    name: 'Inovador',
    emoji: '💡',
    description: 'Criatividade é sua segunda natureza',
    color: '#F59E0B',
    dominantHelix: 'adaptive',
    secondaryHelix: 'strategic',
    strengths: ['Criatividade ilimitada', 'Resolução criativa', 'Questionamento produtivo'],
    challenges: ['Dificuldade com rotina', 'Pode ser disperso', 'Frustração com burocracia'],
    compatibleWith: ['visionary', 'catalyst', 'pioneer'],
    tensionWith: ['guardian', 'executor']
  },
  {
    id: 'connector',
    name: 'Conector',
    emoji: '🤝',
    description: 'Constrói pontes entre pessoas e ideias',
    color: '#EC4899',
    dominantHelix: 'emotional',
    secondaryHelix: 'influence',
    strengths: ['Networking natural', 'Empatia profunda', 'Facilitação de conflitos'],
    challenges: ['Pode evitar confrontos', 'Dificuldade em dizer não', 'Sobrecarga emocional'],
    compatibleWith: ['harmonizer', 'mentor', 'catalyst'],
    tensionWith: ['strategist', 'executor']
  },
  {
    id: 'guardian',
    name: 'Guardião',
    emoji: '🛡️',
    description: 'Protege valores e garante qualidade',
    color: '#10B981',
    dominantHelix: 'values',
    secondaryHelix: 'emotional',
    strengths: ['Integridade inabalável', 'Consistência', 'Proteção da equipe'],
    challenges: ['Resistência a mudanças', 'Pode ser inflexível', 'Julgamento rápido'],
    compatibleWith: ['strategist', 'executor', 'harmonizer'],
    tensionWith: ['innovator', 'pioneer', 'visionary']
  },
  {
    id: 'catalyst',
    name: 'Catalisador',
    emoji: '⚡',
    description: 'Acelera transformações e energiza equipes',
    color: '#EF4444',
    dominantHelix: 'influence',
    secondaryHelix: 'adaptive',
    strengths: ['Energia contagiante', 'Mobilização rápida', 'Impulso para ação'],
    challenges: ['Pode ser impulsivo', 'Dificuldade com paciência', 'Burnout frequente'],
    compatibleWith: ['visionary', 'innovator', 'pioneer'],
    tensionWith: ['guardian', 'strategist']
  },
  {
    id: 'harmonizer',
    name: 'Harmonizador',
    emoji: '☯️',
    description: 'Cria equilíbrio e bem-estar coletivo',
    color: '#06B6D4',
    dominantHelix: 'emotional',
    secondaryHelix: 'values',
    strengths: ['Mediação natural', 'Ambiente positivo', 'Escuta ativa'],
    challenges: ['Pode evitar decisões difíceis', 'Prioriza paz sobre verdade', 'Lentidão em crises'],
    compatibleWith: ['connector', 'guardian', 'mentor'],
    tensionWith: ['catalyst', 'visionary', 'executor']
  },
  {
    id: 'executor',
    name: 'Executor',
    emoji: '🎯',
    description: 'Transforma planos em resultados tangíveis',
    color: '#84CC16',
    dominantHelix: 'adaptive',
    secondaryHelix: 'values',
    strengths: ['Foco em resultados', 'Disciplina', 'Entrega consistente'],
    challenges: ['Pode ser inflexível', 'Foco excessivo em metas', 'Impaciente com ideias'],
    compatibleWith: ['strategist', 'guardian', 'visionary'],
    tensionWith: ['connector', 'harmonizer', 'innovator']
  },
  {
    id: 'mentor',
    name: 'Mentor',
    emoji: '🌟',
    description: 'Desenvolve potencial e transmite sabedoria',
    color: '#A855F7',
    dominantHelix: 'influence',
    secondaryHelix: 'emotional',
    strengths: ['Desenvolvimento de pessoas', 'Paciência', 'Sabedoria prática'],
    challenges: ['Pode ser paternalista', 'Dificuldade em delegar', 'Frustração com desinteresse'],
    compatibleWith: ['connector', 'harmonizer', 'strategist'],
    tensionWith: ['pioneer', 'catalyst']
  },
  {
    id: 'pioneer',
    name: 'Pioneiro',
    emoji: '🚀',
    description: 'Explora territórios desconhecidos com coragem',
    color: '#F97316',
    dominantHelix: 'adaptive',
    secondaryHelix: 'influence',
    strengths: ['Coragem excepcional', 'Adaptabilidade extrema', 'Inovação prática'],
    challenges: ['Pode ser temerário', 'Dificuldade com estabilidade', 'Impaciente com processos'],
    compatibleWith: ['innovator', 'catalyst', 'visionary'],
    tensionWith: ['guardian', 'strategist', 'mentor']
  }
];

// Funções auxiliares
export function calculateDNACode(helix: DNAHelix): string {
  return `S${Math.round(helix.strategic)}-E${Math.round(helix.emotional)}-I${Math.round(helix.influence)}-V${Math.round(helix.values)}-A${Math.round(helix.adaptive)}`;
}

export function determineArchetype(helix: DNAHelix): DNAArchetypeId {
  const scores: { id: DNAArchetypeId; score: number }[] = DNA_ARCHETYPES.map(arch => {
    const dominantScore = helix[arch.dominantHelix];
    const secondaryScore = helix[arch.secondaryHelix];
    return {
      id: arch.id,
      score: dominantScore * 0.6 + secondaryScore * 0.4
    };
  });
  
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.id ?? 'visionary';
}

export function calculateMatchCompatibility(profile1: DNAProfile, profile2: DNAProfile): number {
  const arch1 = DNA_ARCHETYPES.find(a => a.id === profile1.archetype);
  const arch2 = DNA_ARCHETYPES.find(a => a.id === profile2.archetype);
  
  if (!arch1 || !arch2) return 50;
  
  // Base score from helix similarity
  let helixScore = 0;
  const helixKeys: (keyof DNAHelix)[] = ['strategic', 'emotional', 'influence', 'values', 'adaptive'];
  
  helixKeys.forEach(key => {
    const diff = Math.abs(profile1.helix[key] - profile2.helix[key]);
    helixScore += (100 - diff) / 5;
  });
  
  // Archetype compatibility bonus
  let archetypeBonus = 0;
  if (arch1.compatibleWith.includes(arch2.id)) {
    archetypeBonus = 15;
  } else if (arch1.tensionWith.includes(arch2.id)) {
    archetypeBonus = -10;
  }
  
  return Math.min(100, Math.max(0, helixScore + archetypeBonus));
}

export function archetypeChemistry(arch1: DNAArchetypeId, arch2: DNAArchetypeId): 'synergy' | 'complementary' | 'tension' | 'neutral' {
  const archetype1 = DNA_ARCHETYPES.find(a => a.id === arch1);
  const archetype2 = DNA_ARCHETYPES.find(a => a.id === arch2);
  
  if (!archetype1 || !archetype2) return 'neutral';
  
  if (archetype1.compatibleWith.includes(arch2) && archetype2.compatibleWith.includes(arch1)) {
    return 'synergy';
  } else if (archetype1.compatibleWith.includes(arch2) || archetype2.compatibleWith.includes(arch1)) {
    return 'complementary';
  } else if (archetype1.tensionWith.includes(arch2) || archetype2.tensionWith.includes(arch1)) {
    return 'tension';
  }
  
  return 'neutral';
}
