import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { STAT_COLOR_CLASSES, type StatColor } from './types';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: StatColor;
}

export const StatCard = memo(({ icon: Icon, label, value, color }: StatCardProps) => {
  const c = STAT_COLOR_CLASSES[color];
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn('flex items-center gap-3 p-4 rounded-xl border', c.bg, c.border)}
    >
      <div className={cn('p-2 rounded-lg', c.iconBg)}>
        <Icon className={cn('h-5 w-5', c.icon)} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';
