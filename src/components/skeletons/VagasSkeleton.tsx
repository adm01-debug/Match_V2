/**
 * @fileoverview Skeleton contextualizado para página de Vagas
 * @module VagasSkeleton
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { SkeletonPulse } from './DashboardSkeleton';

interface VagasSkeletonProps {
  className?: string;
}

// Vaga Card Skeleton
const VagaCardSkeleton = memo(function VagaCardSkeleton() {
  return (
    <div className="p-5 border rounded-xl bg-card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="h-6 w-6 rounded" />
            <SkeletonPulse className="h-5 w-48" />
          </div>
          <SkeletonPulse className="h-4 w-32" />
        </div>
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-4/5" />
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <SkeletonPulse className="h-4 w-4 rounded" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <SkeletonPulse className="h-4 w-4 rounded" />
          <SkeletonPulse className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-1">
          <SkeletonPulse className="h-4 w-4 rounded" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-6 w-6 rounded-full" />
          <SkeletonPulse className="h-6 w-6 rounded-full" />
          <SkeletonPulse className="h-6 w-6 rounded-full" />
          <SkeletonPulse className="h-4 w-8" />
        </div>
        <SkeletonPulse className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
});

VagaCardSkeleton.displayName = 'VagaCardSkeleton';

// Stats Cards Skeleton
const VagasStatsSkeleton = memo(function VagasStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-2">
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-5 w-5 rounded" />
          </div>
          <SkeletonPulse className="h-7 w-12" />
        </div>
      ))}
    </div>
  );
});

VagasStatsSkeleton.displayName = 'VagasStatsSkeleton';

// Vagas Complete Skeleton
function VagasSkeletonComponent({ className }: VagasSkeletonProps) {
  return (
    <div 
      role="status" 
      aria-label="Carregando vagas..."
      aria-busy="true"
      className={cn('space-y-6 animate-in fade-in-50 duration-300', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="h-4 w-48" />
        </div>
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats */}
      <VagasStatsSkeleton />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 flex-1 max-w-md rounded-lg" />
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
        <SkeletonPulse className="h-10 w-10 rounded-lg" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <VagaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

VagasSkeletonComponent.displayName = 'VagasSkeleton';

export const VagasSkeleton = memo(VagasSkeletonComponent);
export { VagaCardSkeleton, VagasStatsSkeleton };
