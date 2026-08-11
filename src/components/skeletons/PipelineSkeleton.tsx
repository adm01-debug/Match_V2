/**
 * @fileoverview Skeleton contextualizado para Pipeline Kanban
 * @module PipelineSkeleton
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { SkeletonPulse } from './DashboardSkeleton';

interface PipelineSkeletonProps {
  className?: string;
  columns?: number;
}

// Kanban Card Skeleton
const KanbanCardSkeleton = memo(function KanbanCardSkeleton() {
  return (
    <div className="p-3 bg-card border rounded-lg space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-2">
        <SkeletonPulse className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1 min-w-0">
          <SkeletonPulse className="h-4 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-1">
        <SkeletonPulse className="h-5 w-12 rounded" />
        <SkeletonPulse className="h-5 w-16 rounded" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-dashed">
        <SkeletonPulse className="h-6 w-10 rounded-full" />
        <SkeletonPulse className="h-4 w-16" />
      </div>
    </div>
  );
});

KanbanCardSkeleton.displayName = 'KanbanCardSkeleton';

// Kanban Column Skeleton
const KanbanColumnSkeleton = memo(function KanbanColumnSkeleton({ 
  cardsCount = 3 
}: { 
  cardsCount?: number 
}) {
  return (
    <div className="flex-shrink-0 w-72 bg-muted/30 rounded-xl p-3 space-y-3">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-3 w-3 rounded-full" />
          <SkeletonPulse className="h-4 w-24" />
        </div>
        <SkeletonPulse className="h-5 w-6 rounded-full" />
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <KanbanCardSkeleton key={i} />
        ))}
      </div>

      {/* Add Button */}
      <SkeletonPulse className="h-8 w-full rounded-lg" />
    </div>
  );
});

KanbanColumnSkeleton.displayName = 'KanbanColumnSkeleton';

// Pipeline Complete Skeleton
function PipelineSkeletonComponent({ 
  className, 
  columns = 5 
}: PipelineSkeletonProps) {
  // Variação de cards por coluna para parecer mais natural
  const cardCounts = [4, 3, 2, 1, 2];

  return (
    <div 
      role="status" 
      aria-label="Carregando pipeline..."
      aria-busy="true"
      className={cn('space-y-6 animate-in fade-in-50 duration-300', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-10 w-48 rounded-lg" />
          <SkeletonPulse className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
        <SkeletonPulse className="h-9 w-64 rounded-lg" />
        <SkeletonPulse className="h-9 w-32 rounded-lg" />
        <SkeletonPulse className="h-9 w-32 rounded-lg" />
        <div className="ml-auto flex items-center gap-2">
          <SkeletonPulse className="h-8 w-8 rounded" />
          <SkeletonPulse className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <KanbanColumnSkeleton 
            key={i} 
            cardsCount={cardCounts[i] || 2} 
          />
        ))}
      </div>
    </div>
  );
}

PipelineSkeletonComponent.displayName = 'PipelineSkeleton';

export const PipelineSkeleton = memo(PipelineSkeletonComponent);
export { KanbanCardSkeleton, KanbanColumnSkeleton };
