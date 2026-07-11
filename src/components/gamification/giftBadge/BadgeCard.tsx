import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GiftableBadge } from './types';
import { rarityGradients, rarityBorder } from './giftBadgeData';

interface Props {
  badge: GiftableBadge;
  canAfford: boolean;
  onSelect: () => void;
}

export const BadgeCard = memo(({ badge, canAfford, onSelect }: Props) => (
  <motion.button
    whileHover={{ scale: canAfford ? 1.05 : 1 }}
    whileTap={{ scale: canAfford ? 0.95 : 1 }}
    onClick={canAfford ? onSelect : undefined}
    disabled={!canAfford}
    className={cn(
      'p-4 rounded-xl border text-left transition-all duration-300 w-full',
      canAfford
        ? 'bg-card/50 border-border/30 hover:bg-card/80 cursor-pointer'
        : 'bg-muted/30 border-muted opacity-50 cursor-not-allowed',
    )}
  >
    <div className="flex items-start gap-3">
      <motion.div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
          `bg-gradient-to-br ${rarityGradients[badge.rarity]}`,
        )}
        animate={canAfford ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        {badge.icon}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold">{badge.name}</p>
          <Badge variant="outline" className={cn('text-xs capitalize', rarityBorder[badge.rarity])}>
            {badge.rarity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-warning font-medium">-{badge.xpCost} XP</span>
          <span className="text-success font-medium">+{badge.xpReward} XP para receptor</span>
        </div>
      </div>
    </div>
  </motion.button>
));

BadgeCard.displayName = 'BadgeCard';
