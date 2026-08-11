import { levels, UserLevel } from './constants';

/**
 * Calcula o nível baseado na quantidade de XP.
 */
export function calculateLevel(xp: number): number {
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    if (level && xp >= level.minXP) {
      return level.level;
    }
  }
  return 1;
}

/**
 * Obtém as informações do nível atual.
 */
export function getLevelInfo(levelNumber: number): UserLevel {
  return levels.find(l => l.level === levelNumber) ?? levels[0]!;
}

/**
 * Calcula o progresso (0-100) para o próximo nível.
 */
export function calculateLevelProgress(xp: number, level: number): number {
  const current = getLevelInfo(level);
  const next = levels.find(l => l.level === level + 1);
  
  if (!next) return 100;
  
  const xpInCurrentLevel = xp - current.minXP;
  const xpNeededForLevel = next.minXP - current.minXP;
  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
}
