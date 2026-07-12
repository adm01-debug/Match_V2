import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Team } from './types';

export const TeamPodium = memo(({ teams }: { teams: Team[] }) => {
  const topTeams = teams.slice(0, 3);
  const podiumOrder = [1, 0, 2];

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {podiumOrder.map((orderIndex) => {
        const team = topTeams[orderIndex];
        if (!team) return null;
        const heights = { 0: 'h-32', 1: 'h-24', 2: 'h-20' };
        const podiumHeight = heights[orderIndex as keyof typeof heights];

        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: orderIndex * 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2',
                `bg-gradient-to-br ${team.color} shadow-lg`
              )}
              animate={orderIndex === 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {team.icon}
            </motion.div>
            <p className="font-semibold text-sm text-center mb-1">{team.name}</p>
            <Badge
              className={cn(
                'mb-2',
                orderIndex === 0 && 'bg-warning text-warning-foreground',
                orderIndex === 1 && 'bg-muted-foreground text-background',
                orderIndex === 2 && 'bg-accent text-accent-foreground'
              )}
            >
              {team.totalXP.toLocaleString()} XP
            </Badge>
            <div
              className={cn(
                'w-20 rounded-t-xl flex items-end justify-center pb-2',
                podiumHeight,
                orderIndex === 0 && 'bg-gradient-to-t from-warning to-warning/70',
                orderIndex === 1 && 'bg-gradient-to-t from-muted-foreground to-muted',
                orderIndex === 2 && 'bg-gradient-to-t from-accent to-accent/70'
              )}
            >
              <span className="text-2xl font-bold text-white">
                {orderIndex === 0 ? '🥇' : orderIndex === 1 ? '🥈' : '🥉'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

TeamPodium.displayName = 'TeamPodium';
