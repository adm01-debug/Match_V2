import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';
import { MatchScore, getScoreBg, getScoreColor } from './types';

export const MatchScoreBadge = ({ matchScore }: { matchScore: MatchScore }) => (
  <div className={cn('flex-shrink-0 px-3 py-1.5 rounded-lg border', getScoreBg(matchScore.score_total))}>
    <div className="flex items-center gap-1.5">
      <Target className={cn('h-4 w-4', getScoreColor(matchScore.score_total))} />
      <span className={cn('text-lg font-bold', getScoreColor(matchScore.score_total))}>
        {matchScore.score_total}%
      </span>
    </div>
    <p className="text-xs text-muted-foreground truncate max-w-[80px]">{matchScore.vaga_titulo}</p>
  </div>
);
