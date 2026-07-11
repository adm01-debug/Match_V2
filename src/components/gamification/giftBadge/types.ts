export interface GiftableBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  xpCost: number;
  xpReward: number;
  category: 'recognition' | 'achievement' | 'celebration';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Colleague {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  department?: string;
}

export interface GiftHistory {
  id: string;
  badge: GiftableBadge;
  from: Colleague;
  to: Colleague;
  message?: string;
  timestamp: Date;
}
