import { memo } from 'react';
import { motion } from 'framer-motion';
import type { GiftHistory } from './types';

export const GiftHistoryItem = memo(({ gift }: { gift: GiftHistory }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
  >
    <div className="text-2xl">{gift.badge.icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm">
        <span className="font-medium">{gift.from.name}</span>
        {' → '}
        <span className="font-medium">{gift.to.name}</span>
      </p>
      <p className="text-xs text-muted-foreground truncate">{gift.message || gift.badge.name}</p>
    </div>
    <p className="text-xs text-muted-foreground">{gift.timestamp.toLocaleDateString()}</p>
  </motion.div>
));

GiftHistoryItem.displayName = 'GiftHistoryItem';
