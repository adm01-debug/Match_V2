/**
 * @fileoverview Algoritmos avançados de cálculo para ferramentas comportamentais
 * @module advancedBehavioralCalculator
 * 
 * Implementa:
 * - Normalização de scores
 * - Detecção de perfil dominante com confiança
 * - Perfil secundário
 * - Cross-referência entre frameworks
 */

import type { BehavioralResult } from '@/types/behavioral';
import type { GenerationType, BrainType, StressResponse } from '@/types/advancedBehavioral';
import { 
  GENERATIONS_INFO, 
  DISC_STRESS_INFO, 
  TRIUNE_BRAIN_INFO,
} from '@/types/advancedBehavioral';

// ============================================================
// TIPOS DE RESULTADO AVANÇADOS
// ============================================================

export interface GenerationalResult extends BehavioralResult {
  generationType: GenerationType;
  confidence: number; // 0-100
  secondaryGeneration?: GenerationType;
  generationScores: Record<string, number>;
}

export interface StressProfileResult extends BehavioralResult {
  discProfile: 'D' | 'I' | 'S' | 'C';
  stressResponse: StressResponse;
  stressIntensity: number; // 0-100
  vulnerabilityAreas: string[];
  resilience: number; // 0-100
}

export interface TriuneBrainResult extends BehavioralResult {
  dominant: BrainType;
  secondary: BrainType;
  reptilianoScore: number;
  limbicoScore: number;
  neocortexScore: number;
  balance: 'balanced' | 'dominated' | 'dual';
  decisionStyle: string;
}

export interface CrossFrameworkAnalysis {
  discProfile?: 'D' | 'I' | 'S' | 'C';
  generationType?: GenerationType;
  stressResponse?: StressResponse;
  dominantBrain?: BrainType;
  synergies: string[];
  tensions: string[];
  recommendations: string[];
  overallConsistency: number; // 0-100
  communicationStrategy: string;
  managementApproach: string;
}

// ============================================================
// CÁLCULO - INTELIGÊNCIA GERACIONAL
// ============================================================

export function calculateGenerationalResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number
): GenerationalResult {
  const generationScores: Record<string, number> = {
    silent: 0,
    baby_boomer: 0,
    gen_x: 0,
    millennial: 0,
    gen_z: 0,
    gen_alpha: 0,
  };

  // Processar respostas
  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    
    // Detectar geração baseado na escolha
    const genMap = ['silent_boomer', 'gen_x', 'millennial', 'gen_z'];
    const selectedGen = genMap[answerIndex];
    
    if (selectedGen) {
      if (selectedGen === 'silent_boomer') {
        generationScores['silent'] = (generationScores['silent'] ?? 0) + 2;
        generationScores['baby_boomer'] = (generationScores['baby_boomer'] ?? 0) + 2;
      } else if (selectedGen === 'gen_x') {
        generationScores['gen_x'] = (generationScores['gen_x'] ?? 0) + 4;
      } else if (selectedGen === 'millennial') {
        generationScores['millennial'] = (generationScores['millennial'] ?? 0) + 4;
      } else if (selectedGen === 'gen_z') {
        generationScores['gen_z'] = (generationScores['gen_z'] ?? 0) + 3;
        generationScores['gen_alpha'] = (generationScores['gen_alpha'] ?? 0) + 1;
      }
    }
  });

  // Normalizar para 0-100
  const maxScore = Object.keys(answers).length * 4;
  const normalizedScores: Record<string, number> = {};
  Object.entries(generationScores).forEach(([gen, score]) => {
    normalizedScores[gen] = Math.round((score / Math.max(maxScore, 1)) * 100);
  });

  // Encontrar dominante e secundário
  const sorted = Object.entries(normalizedScores)
    .sort(([, a], [, b]) => b - a);
  
  const primary = sorted[0]?.[0] as GenerationType || 'millennial';
  const secondary = sorted[1]?.[0] as GenerationType;
  const primaryScore = sorted[0]?.[1] || 0;
  const secondaryScore = sorted[1]?.[1] || 0;

  // Calcular confiança (diferença entre primeiro e segundo)
  const confidence = Math.min(100, Math.round((primaryScore - secondaryScore) + 50));

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: normalizedScores,
    primaryProfile: primary,
    secondaryProfile: secondary,
    rawAnswers: answers,
    generationType: primary,
    confidence,
    secondaryGeneration: secondary,
    generationScores: normalizedScores,
  };
}

// ============================================================
// CÁLCULO - PERFIL SOB STRESS
// ============================================================

export function calculateStressProfileResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number,
  existingDISCProfile?: 'D' | 'I' | 'S' | 'C'
): StressProfileResult {
  const discScores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  
  // Processar respostas
  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    
    const profiles: ('D' | 'I' | 'S' | 'C')[] = ['D', 'I', 'S', 'C'];
    const selectedProfile = profiles[answerIndex];
    
    if (selectedProfile) {
      discScores[selectedProfile] = (discScores[selectedProfile] ?? 0) + 4;
    }
  });

  // Determinar perfil dominante sob stress
  const sorted = Object.entries(discScores)
    .sort(([, a], [, b]) => b - a);
  
  const stressProfile = (sorted[0]?.[0] || existingDISCProfile || 'S') as 'D' | 'I' | 'S' | 'C';
  const stressInfo = DISC_STRESS_INFO[stressProfile];

  // Calcular intensidade do stress (baseado na concentração de respostas)
  const maxScore = Object.keys(answers).length * 4;
  const topScore = sorted[0]?.[1] || 0;
  const stressIntensity = Math.round((topScore / Math.max(maxScore, 1)) * 100);

  // Identificar áreas de vulnerabilidade
  const vulnerabilityAreas = stressInfo?.gatilhos || [];

  // Calcular resiliência (baseado na distribuição de scores - mais distribuído = mais resiliente)
  const totalScore = Object.values(discScores).reduce((a, b) => a + b, 0);
  const distribution = Object.values(discScores).map(s => (s / totalScore) * 100);
  const variance = distribution.reduce((acc, val) => {
    const mean = 25; // 100/4 perfis
    return acc + Math.pow(val - mean, 2);
  }, 0) / 4;
  const resilience = Math.max(0, Math.min(100, 100 - Math.sqrt(variance)));

  // Normalizar scores para 0-100
  const normalizedScores: Record<string, number> = {};
  Object.entries(discScores).forEach(([profile, score]) => {
    normalizedScores[profile] = Math.round((score / Math.max(maxScore, 1)) * 100);
  });

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: normalizedScores,
    primaryProfile: stressProfile,
    secondaryProfile: sorted[1]?.[0],
    rawAnswers: answers,
    discProfile: stressProfile,
    stressResponse: stressInfo?.respostaPrimaria || 'freeze',
    stressIntensity,
    vulnerabilityAreas,
    resilience: Math.round(resilience),
  };
}

// ============================================================
// CÁLCULO - MODELO 3 CÉREBROS
// ============================================================

export function calculateTriuneBrainResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number
): TriuneBrainResult {
  const brainScores: Record<BrainType, number> = {
    reptiliano: 0,
    limbico: 0,
    neocortex: 0,
  };

  // Processar respostas
  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    
    const brains: BrainType[] = ['reptiliano', 'limbico', 'neocortex'];
    const selectedBrain = brains[answerIndex];
    
    if (selectedBrain) {
      brainScores[selectedBrain] += 4;
    }
  });

  // Normalizar para 0-100
  const total = Object.values(brainScores).reduce((a, b) => a + b, 0);
  const reptilianoScore = Math.round((brainScores.reptiliano / Math.max(total, 1)) * 100);
  const limbicoScore = Math.round((brainScores.limbico / Math.max(total, 1)) * 100);
  const neocortexScore = Math.round((brainScores.neocortex / Math.max(total, 1)) * 100);

  // Determinar dominante e secundário
  const sorted = Object.entries(brainScores)
    .sort(([, a], [, b]) => b - a);
  
  const dominant = sorted[0]?.[0] as BrainType || 'limbico';
  const secondary = sorted[1]?.[0] as BrainType || 'neocortex';

  // Determinar equilíbrio
  const maxScore = sorted[0]?.[1] || 0;
  const secondScore = sorted[1]?.[1] || 0;
  const thirdScore = sorted[2]?.[1] || 0;

  let balance: 'balanced' | 'dominated' | 'dual' = 'dominated';
  if (maxScore - thirdScore < 2) {
    balance = 'balanced';
  } else if (maxScore - secondScore < 2) {
    balance = 'dual';
  }

  // Determinar estilo de decisão
  const decisionStyles: Record<BrainType, string> = {
    reptiliano: 'Decide baseado em segurança e proteção - evita riscos, busca garantias',
    limbico: 'Decide baseado em emoção e conexão - precisa sentir que é certo',
    neocortex: 'Decide baseado em lógica e dados - analisa, compara, calcula',
  };

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: {
      reptiliano: reptilianoScore,
      limbico: limbicoScore,
      neocortex: neocortexScore,
    },
    primaryProfile: dominant,
    secondaryProfile: secondary,
    rawAnswers: answers,
    dominant,
    secondary,
    reptilianoScore,
    limbicoScore,
    neocortexScore,
    balance,
    decisionStyle: decisionStyles[dominant],
  };
}

// ============================================================
// CROSS-FRAMEWORK ANALYSIS
// ============================================================

export function performCrossFrameworkAnalysis(
  discProfile?: 'D' | 'I' | 'S' | 'C',
  generationType?: GenerationType,
  stressResponse?: StressResponse,
  dominantBrain?: BrainType
): CrossFrameworkAnalysis {
  const synergies: string[] = [];
  const tensions: string[] = [];
  const recommendations: string[] = [];
  let consistencyScore = 50;

  // Análise DISC x Geração
  if (discProfile && generationType) {
    // Sinergias naturais
    if (discProfile === 'D' && (generationType === 'gen_x' || generationType === 'gen_z')) {
      synergies.push('Perfil D alinha com pragmatismo e velocidade geracional');
      consistencyScore += 10;
    }
    if (discProfile === 'I' && generationType === 'millennial') {
      synergies.push('Perfil I combina com foco em propósito e colaboração dos Millennials');
      consistencyScore += 10;
    }
    if (discProfile === 'S' && generationType === 'baby_boomer') {
      synergies.push('Perfil S harmoniza com valores tradicionais da geração');
      consistencyScore += 10;
    }
    if (discProfile === 'C' && (generationType === 'gen_x' || generationType === 'silent')) {
      synergies.push('Perfil C alinha com abordagem metódica e processual');
      consistencyScore += 10;
    }

    // Tensões potenciais
    if (discProfile === 'D' && generationType === 'silent') {
      tensions.push('Urgência do D pode conflitar com formalidade tradicional');
      consistencyScore -= 5;
    }
    if (discProfile === 'S' && generationType === 'gen_z') {
      tensions.push('Estabilidade do S pode contrastar com dinamismo da Gen Z');
      consistencyScore -= 5;
    }
  }

  // Análise DISC x 3 Cérebros
  if (discProfile && dominantBrain) {
    if (discProfile === 'D' && dominantBrain === 'reptiliano') {
      synergies.push('D + Reptiliano = foco extremo em resultados e sobrevivência');
      consistencyScore += 10;
    }
    if (discProfile === 'I' && dominantBrain === 'limbico') {
      synergies.push('I + Límbico = forte conexão emocional e social');
      consistencyScore += 10;
    }
    if (discProfile === 'C' && dominantBrain === 'neocortex') {
      synergies.push('C + Neocórtex = análise profunda e decisões baseadas em dados');
      consistencyScore += 10;
    }
    if (discProfile === 'S' && dominantBrain === 'limbico') {
      synergies.push('S + Límbico = forte foco em harmonia e relacionamentos');
      consistencyScore += 10;
    }

    // Tensões
    if (discProfile === 'D' && dominantBrain === 'limbico') {
      tensions.push('Urgência do D pode ser temperada por necessidade de conexão emocional');
    }
    if (discProfile === 'C' && dominantBrain === 'reptiliano') {
      tensions.push('Análise do C pode conflitar com instinto de ação imediata');
    }
  }

  // Análise Stress x Cérebro
  if (stressResponse && dominantBrain) {
    if (stressResponse === 'fight' && dominantBrain === 'reptiliano') {
      synergies.push('Resposta fight alinha com cérebro reptiliano - ação defensiva rápida');
      consistencyScore += 5;
    }
    if (stressResponse === 'flight' && dominantBrain === 'limbico') {
      synergies.push('Resposta flight busca segurança social - alinha com límbico');
      consistencyScore += 5;
    }
    if (stressResponse === 'freeze' && dominantBrain === 'neocortex') {
      synergies.push('Resposta freeze permite análise - alinha com neocórtex');
      consistencyScore += 5;
    }
  }

  // Gerar recomendações
  if (discProfile) {
    const stressInfo = DISC_STRESS_INFO[discProfile];
    recommendations.push(...(stressInfo?.comoApoiar || []));
  }

  if (generationType) {
    const genInfo = GENERATIONS_INFO[generationType];
    recommendations.push(...(genInfo?.comoGerenciar || []));
  }

  if (dominantBrain) {
    const brainInfo = TRIUNE_BRAIN_INFO[dominantBrain];
    recommendations.push(...(brainInfo?.abordagemVenda || []));
  }

  // Estratégia de comunicação
  let communicationStrategy = '';
  if (generationType) {
    const genInfo = GENERATIONS_INFO[generationType];
    communicationStrategy = genInfo?.comunicacao.join(', ') || '';
  }

  // Abordagem de gestão
  let managementApproach = '';
  if (discProfile) {
    const stressInfo = DISC_STRESS_INFO[discProfile];
    managementApproach = stressInfo?.comoApoiar.join('; ') || '';
  }

  return {
    discProfile,
    generationType,
    stressResponse,
    dominantBrain,
    synergies: [...new Set(synergies)].slice(0, 5),
    tensions: [...new Set(tensions)].slice(0, 5),
    recommendations: [...new Set(recommendations)].slice(0, 8),
    overallConsistency: Math.max(0, Math.min(100, consistencyScore)),
    communicationStrategy,
    managementApproach,
  };
}

// ============================================================
// UTILITY: Detectar perfil DISC de resultados anteriores
// ============================================================

export function extractDISCFromResults(results: BehavioralResult[]): 'D' | 'I' | 'S' | 'C' | undefined {
  const discResult = results.find(r => r.toolId === 'disc');
  if (discResult?.primaryProfile) {
    const profile = discResult.primaryProfile.toUpperCase();
    if (['D', 'I', 'S', 'C'].includes(profile)) {
      return profile as 'D' | 'I' | 'S' | 'C';
    }
  }
  return undefined;
}

// ============================================================
// INTEGRAÇÃO: Calcular resultado baseado no toolId
// ============================================================

export function calculateAdvancedResult(
  toolId: string,
  answers: Record<string, number | string>,
  timeSpent: number,
  existingResults?: BehavioralResult[]
): BehavioralResult {
  const existingDISC = existingResults ? extractDISCFromResults(existingResults) : undefined;

  switch (toolId) {
    case 'generational':
      return calculateGenerationalResult(answers, toolId, timeSpent);
    
    case 'stress_profile':
      return calculateStressProfileResult(answers, toolId, timeSpent, existingDISC);
    
    case 'triune_brain':
      return calculateTriuneBrainResult(answers, toolId, timeSpent);
    
    default:
      // Fallback para cálculo básico
      return {
        toolId,
        completedAt: new Date().toISOString(),
        timeSpent,
        scores: {},
        primaryProfile: '',
        rawAnswers: answers,
      };
  }
}
