import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Eye, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JobBoard, PublishResult } from './types';

interface ConnectedBoardCardProps {
  board: JobBoard;
  index: number;
  isSelected: boolean;
  isPublishing: boolean;
  result?: PublishResult;
  onToggle: () => void;
}

export function ConnectedBoardCard({
  board,
  index,
  isSelected,
  isPublishing,
  result,
  onToggle,
}: ConnectedBoardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30',
        result?.success && 'border-success bg-success/5',
        result?.success === false && 'border-destructive bg-destructive/5',
      )}
      onClick={() => !isPublishing && onToggle()}
    >
      <div className="flex items-center gap-4">
        <Checkbox checked={isSelected} disabled={isPublishing} className="pointer-events-none" />
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br text-white',
            board.color,
          )}
        >
          {board.logo}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{board.name}</span>
            {board.isPremium && (
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
          {board.stats && board.stats.views > 0 && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {board.stats.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {board.stats.applications}
              </span>
              <span className="flex items-center gap-1 text-success">
                <TrendingUp className="h-3 w-3" />
                {((board.stats.applications / board.stats.views) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {result?.success === true && (
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
        {result?.success === false && (
          <div className="flex items-center gap-2 text-destructive">
            <X className="h-5 w-5" />
            <span className="text-xs">{result.error}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
