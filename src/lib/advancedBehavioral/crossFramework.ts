import type { GenerationType, BrainType, StressResponse } from '@/types/advancedBehavioral';
import {
  GENERATIONS_INFO,
  DISC_STRESS_INFO,
  TRIUNE_BRAIN_INFO,
} from '@/types/advancedBehavioral';
import type { BehavioralResult } from '@/types/behavioral';
import type { CrossFrameworkAnalysis } from './types';

type DISC = 'D' | 'I' | 'S' | 'C';

function analyzeDiscGeneration(
  disc: DISC,
  gen: GenerationType,
  synergies: string[],
  tensions: string[]
): number {
  let delta = 0;
  const synMap: Array<[DISC, GenerationType[], string]> = [
    [disc, disc === 'D' ? ['gen_x', 'gen_z'] : [], 'Perfil D alinha com pragmatismo e velocidade geracional'],
    [disc, disc === 'I' ? ['millennial'] : [], 'Perfil I combina com foco em propósito e colaboração dos Millennials'],
    [disc, disc === 'S' ? ['baby_boomer'] : [], 'Perfil S harmoniza com valores tradicionais da geração'],
    [disc, disc === 'C' ? ['gen_x', 'silent'] : [], 'Perfil C alinha com abordagem metódica e processual'],
  ];
  synMap.forEach(([, gens, msg]) => {
    if (gens.includes(gen)) {
      synergies.push(msg);
      delta += 10;
    }
  });

  if (disc === 'D' && gen === 'silent') {
    tensions.push('Urgência do D pode conflitar com formalidade tradicional');
    delta -= 5;
  }
  if (disc === 'S' && gen === 'gen_z') {
    tensions.push('Estabilidade do S pode contrastar com dinamismo da Gen Z');
    delta -= 5;
  }
  return delta;
}

function analyzeDiscBrain(
  disc: DISC,
  brain: BrainType,
  synergies: string[],
  tensions: string[]
): number {
  const synMap: Array<[DISC, BrainType, string]> = [
    ['D', 'reptiliano', 'D + Reptiliano = foco extremo em resultados e sobrevivência'],
    ['I', 'limbico', 'I + Límbico = forte conexão emocional e social'],
    ['C', 'neocortex', 'C + Neocórtex = análise profunda e decisões baseadas em dados'],
    ['S', 'limbico', 'S + Límbico = forte foco em harmonia e relacionamentos'],
  ];
  let delta = 0;
  synMap.forEach(([d, b, msg]) => {
    if (disc === d && brain === b) {
      synergies.push(msg);
      delta += 10;
    }
  });
  if (disc === 'D' && brain === 'limbico') {
    tensions.push('Urgência do D pode ser temperada por necessidade de conexão emocional');
  }
  if (disc === 'C' && brain === 'reptiliano') {
    tensions.push('Análise do C pode conflitar com instinto de ação imediata');
  }
  return delta;
}

function analyzeStressBrain(
  stress: StressResponse,
  brain: BrainType,
  synergies: string[]
): number {
  const map: Array<[StressResponse, BrainType, string]> = [
    ['fight', 'reptiliano', 'Resposta fight alinha com cérebro reptiliano - ação defensiva rápida'],
    ['flight', 'limbico', 'Resposta flight busca segurança social - alinha com límbico'],
    ['freeze', 'neocortex', 'Resposta freeze permite análise - alinha com neocórtex'],
  ];
  let delta = 0;
  map.forEach(([s, b, msg]) => {
    if (stress === s && brain === b) {
      synergies.push(msg);
      delta += 5;
    }
  });
  return delta;
}

export function performCrossFrameworkAnalysis(
  discProfile?: DISC,
  generationType?: GenerationType,
  stressResponse?: StressResponse,
  dominantBrain?: BrainType
): CrossFrameworkAnalysis {
  const synergies: string[] = [];
  const tensions: string[] = [];
  const recommendations: string[] = [];
  let consistencyScore = 50;

  if (discProfile && generationType) {
    consistencyScore += analyzeDiscGeneration(discProfile, generationType, synergies, tensions);
  }
  if (discProfile && dominantBrain) {
    consistencyScore += analyzeDiscBrain(discProfile, dominantBrain, synergies, tensions);
  }
  if (stressResponse && dominantBrain) {
    consistencyScore += analyzeStressBrain(stressResponse, dominantBrain, synergies);
  }

  if (discProfile) recommendations.push(...(DISC_STRESS_INFO[discProfile]?.comoApoiar || []));
  if (generationType) recommendations.push(...(GENERATIONS_INFO[generationType]?.comoGerenciar || []));
  if (dominantBrain) recommendations.push(...(TRIUNE_BRAIN_INFO[dominantBrain]?.abordagemVenda || []));

  const communicationStrategy = generationType
    ? GENERATIONS_INFO[generationType]?.comunicacao.join(', ') || ''
    : '';
  const managementApproach = discProfile
    ? DISC_STRESS_INFO[discProfile]?.comoApoiar.join('; ') || ''
    : '';

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

export function extractDISCFromResults(
  results: BehavioralResult[]
): DISC | undefined {
  const discResult = results.find((r) => r.toolId === 'disc');
  if (discResult?.primaryProfile) {
    const profile = discResult.primaryProfile.toUpperCase();
    if (['D', 'I', 'S', 'C'].includes(profile)) return profile as DISC;
  }
  return undefined;
}
