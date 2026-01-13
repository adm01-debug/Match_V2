/**
 * @fileoverview Configuração de gamificação para avaliações comportamentais
 * @module behavioralGamification
 * 
 * Integra os 10 Pilares Comportamentais com o sistema de XP, conquistas e níveis
 */

import { BEHAVIORAL_TOOLS } from '@/types/behavioral';

// XP por ferramenta comportamental (baseado em complexidade e tempo)
export const BEHAVIORAL_XP_REWARDS: Record<string, number> = {
  disc: 50,
  vakd: 35,
  metaprograms: 75,
  mental_triggers: 45,
  sleight_of_mouth: 55,
  emotional_states: 55,
  values: 45,
  emotional_intelligence: 85,
  cognitive_biases: 55,
  rapport: 35,
};

// Bônus por performance
export const BEHAVIORAL_BONUS = {
  // Tempo - completar mais rápido que o estimado
  speedBonus: {
    fast: 1.2,      // < 80% do tempo estimado
    superFast: 1.5, // < 50% do tempo estimado
  },
  // Consistência - respostas consistentes
  consistencyBonus: 1.3,
  // Combo - completar múltiplos em sequência
  comboBonus: {
    2: 1.1,
    3: 1.2,
    5: 1.3,
    10: 1.5, // Todas as ferramentas
  },
  // Primeiro assessment do dia
  dailyFirstBonus: 1.1,
};

// Conquistas específicas comportamentais
export interface BehavioralAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'behavioral' | 'mastery' | 'speed' | 'dedication';
  xpReward: number;
  condition: {
    type: 'tools_completed' | 'specific_tool' | 'score_threshold' | 'time_challenge' | 'streak';
    value: number | string;
    toolIds?: string[];
  };
}

export const BEHAVIORAL_ACHIEVEMENTS: BehavioralAchievement[] = [
  // Conquistas de Progresso
  {
    id: 'behavioral_first',
    title: 'Autoconhecimento',
    description: 'Complete seu primeiro assessment comportamental',
    icon: '🧠',
    tier: 'bronze',
    category: 'behavioral',
    xpReward: 25,
    condition: { type: 'tools_completed', value: 1 },
  },
  {
    id: 'behavioral_half',
    title: 'Meio Caminho',
    description: 'Complete 5 ferramentas comportamentais',
    icon: '🌟',
    tier: 'silver',
    category: 'behavioral',
    xpReward: 100,
    condition: { type: 'tools_completed', value: 5 },
  },
  {
    id: 'behavioral_master',
    title: 'Mestre Comportamental',
    description: 'Complete todas as 10 ferramentas',
    icon: '👑',
    tier: 'diamond',
    category: 'mastery',
    xpReward: 500,
    condition: { type: 'tools_completed', value: 10 },
  },

  // Conquistas por Ferramenta Específica
  {
    id: 'disc_complete',
    title: 'Perfil DISC Mapeado',
    description: 'Complete a avaliação DISC',
    icon: '🎯',
    tier: 'bronze',
    category: 'behavioral',
    xpReward: 15,
    condition: { type: 'specific_tool', value: 'disc' },
  },
  {
    id: 'vakd_complete',
    title: 'Canais Sensoriais',
    description: 'Descubra seu sistema VAK/D',
    icon: '👁️',
    tier: 'bronze',
    category: 'behavioral',
    xpReward: 15,
    condition: { type: 'specific_tool', value: 'vakd' },
  },
  {
    id: 'emotional_intelligence_complete',
    title: 'QE Revelado',
    description: 'Complete a avaliação de Inteligência Emocional',
    icon: '💖',
    tier: 'silver',
    category: 'behavioral',
    xpReward: 30,
    condition: { type: 'specific_tool', value: 'emotional_intelligence' },
  },
  {
    id: 'metaprograms_complete',
    title: 'Mente Mapeada',
    description: 'Complete os Metaprogramas',
    icon: '🧩',
    tier: 'silver',
    category: 'behavioral',
    xpReward: 25,
    condition: { type: 'specific_tool', value: 'metaprograms' },
  },

  // Conquistas de Performance
  {
    id: 'behavioral_speedster',
    title: 'Velocista Mental',
    description: 'Complete qualquer assessment em menos de 50% do tempo estimado',
    icon: '⚡',
    tier: 'gold',
    category: 'speed',
    xpReward: 75,
    condition: { type: 'time_challenge', value: 0.5 },
  },
  {
    id: 'behavioral_marathon',
    title: 'Maratonista',
    description: 'Complete 3 assessments em um único dia',
    icon: '🏃',
    tier: 'gold',
    category: 'dedication',
    xpReward: 100,
    condition: { type: 'streak', value: 3 },
  },
  {
    id: 'behavioral_dedication',
    title: 'Dedicação Total',
    description: 'Complete todos os assessments em 3 dias ou menos',
    icon: '🔥',
    tier: 'platinum',
    category: 'dedication',
    xpReward: 250,
    condition: { type: 'streak', value: 10 },
  },

  // Conquistas de Score
  {
    id: 'high_scorer',
    title: 'Alto Desempenho',
    description: 'Obtenha score acima de 80% em qualquer assessment',
    icon: '📈',
    tier: 'silver',
    category: 'mastery',
    xpReward: 50,
    condition: { type: 'score_threshold', value: 80 },
  },
  {
    id: 'perfect_score',
    title: 'Perfeccionista',
    description: 'Obtenha score máximo em qualquer dimensão',
    icon: '💯',
    tier: 'gold',
    category: 'mastery',
    xpReward: 100,
    condition: { type: 'score_threshold', value: 100 },
  },
];

// Níveis específicos para avaliações comportamentais
export const BEHAVIORAL_LEVELS = [
  { level: 1, title: 'Curioso', minAssessments: 0, icon: '🌱', color: 'text-slate-500' },
  { level: 2, title: 'Explorador', minAssessments: 2, icon: '🔍', color: 'text-green-500' },
  { level: 3, title: 'Analista', minAssessments: 4, icon: '📊', color: 'text-blue-500' },
  { level: 4, title: 'Especialista', minAssessments: 6, icon: '🎓', color: 'text-purple-500' },
  { level: 5, title: 'Mestre Comportamental', minAssessments: 10, icon: '👑', color: 'text-yellow-500' },
];

// Calcular XP total possível
export function calculateTotalBehavioralXP(): number {
  const toolsXP = Object.values(BEHAVIORAL_XP_REWARDS).reduce((a, b) => a + b, 0);
  const achievementsXP = BEHAVIORAL_ACHIEVEMENTS.reduce((a, b) => a + b.xpReward, 0);
  return toolsXP + achievementsXP;
}

// Calcular XP com bônus
export function calculateBehavioralXP(
  toolId: string,
  timeSpent: number,
  dailyCombo: number = 0,
  isFirstToday: boolean = false
): { baseXP: number; bonusXP: number; totalXP: number; bonuses: string[] } {
  const tool = BEHAVIORAL_TOOLS.find(t => t.id === toolId);
  if (!tool) {
    return { baseXP: 0, bonusXP: 0, totalXP: 0, bonuses: [] };
  }

  const baseXP = BEHAVIORAL_XP_REWARDS[toolId] || 50;
  const bonuses: string[] = [];
  let multiplier = 1;

  // Speed bonus
  const estimatedSeconds = tool.estimatedTime * 60;
  const timeRatio = timeSpent / estimatedSeconds;
  
  if (timeRatio < 0.5) {
    multiplier *= BEHAVIORAL_BONUS.speedBonus.superFast;
    bonuses.push('Super Rápido (1.5x)');
  } else if (timeRatio < 0.8) {
    multiplier *= BEHAVIORAL_BONUS.speedBonus.fast;
    bonuses.push('Rápido (1.2x)');
  }

  // Combo bonus
  const comboBonusValue = BEHAVIORAL_BONUS.comboBonus[dailyCombo as keyof typeof BEHAVIORAL_BONUS.comboBonus];
  if (comboBonusValue) {
    multiplier *= comboBonusValue;
    bonuses.push(`Combo x${dailyCombo} (${comboBonusValue}x)`);
  }

  // First of day bonus
  if (isFirstToday) {
    multiplier *= BEHAVIORAL_BONUS.dailyFirstBonus;
    bonuses.push('Primeiro do Dia (1.1x)');
  }

  const bonusXP = Math.round(baseXP * (multiplier - 1));
  const totalXP = Math.round(baseXP * multiplier);

  return { baseXP, bonusXP, totalXP, bonuses };
}

// Verificar conquistas desbloqueadas
export function checkBehavioralAchievements(
  completedToolIds: string[],
  assessmentResults: { toolId: string; timeSpent: number; score: number }[]
): BehavioralAchievement[] {
  const unlocked: BehavioralAchievement[] = [];

  for (const achievement of BEHAVIORAL_ACHIEVEMENTS) {
    const { condition } = achievement;

    switch (condition.type) {
      case 'tools_completed':
        if (completedToolIds.length >= (condition.value as number)) {
          unlocked.push(achievement);
        }
        break;

      case 'specific_tool':
        if (completedToolIds.includes(condition.value as string)) {
          unlocked.push(achievement);
        }
        break;

      case 'score_threshold':
        const hasHighScore = assessmentResults.some(r => r.score >= (condition.value as number));
        if (hasHighScore) {
          unlocked.push(achievement);
        }
        break;

      case 'time_challenge':
        const tool = BEHAVIORAL_TOOLS.find(t => 
          assessmentResults.some(r => r.toolId === t.id && r.timeSpent < t.estimatedTime * 60 * (condition.value as number))
        );
        if (tool) {
          unlocked.push(achievement);
        }
        break;
    }
  }

  return unlocked;
}

// Obter nível comportamental
export function getBehavioralLevel(completedCount: number) {
  for (let i = BEHAVIORAL_LEVELS.length - 1; i >= 0; i--) {
    const level = BEHAVIORAL_LEVELS[i];
    if (level && completedCount >= level.minAssessments) {
      return level;
    }
  }
  return BEHAVIORAL_LEVELS[0]!;
}
