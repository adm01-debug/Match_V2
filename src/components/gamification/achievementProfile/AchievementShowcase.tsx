import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TIER_GRADIENTS, type ProfileAchievement } from './types';

interface Props {
  achievement: ProfileAchievement;
  index: number;
}

export const AchievementShowcase = memo(({ achievement, index }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="relative group"
    >
      <div
        className={cn(
          'p-4 rounded-2xl border-2 transition-all duration-300',
          achievement.unlocked
            ? `bg-gradient-to-br ${TIER_GRADIENTS[achievement.tier]} text-primary-foreground border-transparent shadow-lg`
            : 'bg-muted/50 border-border/50 opacity-50 grayscale'
        )}
      >
        <motion.div
          className="text-4xl mb-2"
          animate={achievement.unlocked ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {achievement.icon}
        </motion.div>
        <p className="font-semibold text-sm">{achievement.name}</p>
        {achievement.unlocked && (
          <Badge className="mt-2 bg-background/20 text-primary-foreground border-0 text-xs">
            {achievement.tier}
          </Badge>
        )}
      </div>

      {achievement.unlocked && (
        <motion.div
          className={cn(
            'absolute inset-0 -z-10 rounded-2xl blur-xl opacity-40',
            `bg-gradient-to-br ${TIER_GRADIENTS[achievement.tier]}`
          )}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
});

AchievementShowcase.displayName = 'AchievementShowcase';
