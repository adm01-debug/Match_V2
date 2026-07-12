import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_TEXT, type AchievementTier } from './types';

interface Props {
  byTier: Record<AchievementTier, number>;
}

export const TierProgress = ({ byTier }: Props) => (
  <div className="space-y-3">
    <h3 className="font-semibold flex items-center gap-2">
      <Award className="h-5 w-5 text-primary" />
      Progresso por Tier
    </h3>
    <div className="grid grid-cols-5 gap-2">
      {(Object.entries(byTier) as [AchievementTier, number][]).map(([tier, count]) => (
        <div key={tier} className="text-center">
          <div className={cn('text-2xl font-bold', TIER_TEXT[tier])}>{count}</div>
          <p className="text-xs text-muted-foreground capitalize">{tier}</p>
        </div>
      ))}
    </div>
  </div>
);
