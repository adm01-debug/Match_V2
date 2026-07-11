import type { GiftableBadge, Colleague } from './types';

export const GIFTABLE_BADGES: GiftableBadge[] = [
  { id: 'kudos', name: 'Kudos', icon: '👏', description: 'Reconhecimento por um ótimo trabalho', xpCost: 50, xpReward: 25, category: 'recognition', rarity: 'common' },
  { id: 'helper', name: 'Grande Ajuda', icon: '🤝', description: 'Por ajudar quando mais precisava', xpCost: 100, xpReward: 50, category: 'recognition', rarity: 'common' },
  { id: 'innovator', name: 'Inovador', icon: '💡', description: 'Por uma ideia brilhante', xpCost: 150, xpReward: 75, category: 'achievement', rarity: 'rare' },
  { id: 'rockstar', name: 'Rockstar', icon: '🌟', description: 'Performance excepcional', xpCost: 200, xpReward: 100, category: 'achievement', rarity: 'rare' },
  { id: 'mentor', name: 'Mentor', icon: '🎓', description: 'Por ensinar e guiar outros', xpCost: 250, xpReward: 125, category: 'recognition', rarity: 'epic' },
  { id: 'champion', name: 'Champion', icon: '🏆', description: 'Verdadeiro campeão do time', xpCost: 300, xpReward: 150, category: 'achievement', rarity: 'epic' },
  { id: 'legend', name: 'Lenda', icon: '👑', description: 'Status lendário alcançado', xpCost: 500, xpReward: 250, category: 'celebration', rarity: 'legendary' },
];

export const DEMO_COLLEAGUES: Colleague[] = [
  { id: 'c1', name: 'Ana Silva', department: 'RH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaSilva' },
  { id: 'c2', name: 'Carlos Santos', department: 'Tech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosSantos' },
  { id: 'c3', name: 'Maria Oliveira', department: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaOliveira' },
  { id: 'c4', name: 'João Pedro', department: 'Vendas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoPedro' },
  { id: 'c5', name: 'Fernanda Costa', department: 'RH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FernandaCosta' },
];

export const rarityGradients: Record<GiftableBadge['rarity'], string> = {
  common: 'from-muted-foreground/60 to-muted-foreground/80',
  rare: 'from-primary/60 to-primary',
  epic: 'from-accent to-primary',
  legendary: 'from-warning to-warning/70',
};

export const rarityBorder: Record<GiftableBadge['rarity'], string> = {
  common: '',
  rare: 'border-primary text-primary',
  epic: 'border-accent text-accent-foreground',
  legendary: 'border-warning text-warning',
};
