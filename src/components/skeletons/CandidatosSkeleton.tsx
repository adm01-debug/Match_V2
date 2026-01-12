/**
 * @fileoverview Skeleton contextualizado para página de Candidatos
 * @module CandidatosSkeleton
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { SkeletonPulse } from './DashboardSkeleton';

interface CandidatosSkeletonProps {
  className?: string;
  viewMode?: 'grid' | 'list';
}

// Candidato Card Skeleton
const CandidatoCardSkeleton = memo(function CandidatoCardSkeleton() {
  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      {/* Header com Avatar */}
      <div className="flex items-start gap-3">
        <SkeletonPulse className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <SkeletonPulse className="h-5 w-3/4" />
          <SkeletonPulse className="h-4 w-1/2" />
        </div>
        <SkeletonPulse className="h-6 w-16 rounded-full" />
      </div>

      {/* Tags/Skills */}
      <div className="flex flex-wrap gap-2">
        <SkeletonPulse className="h-6 w-16 rounded-full" />
        <SkeletonPulse className="h-6 w-20 rounded-full" />
        <SkeletonPulse className="h-6 w-14 rounded-full" />
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between pt-2 border-t">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
});

CandidatoCardSkeleton.displayName = 'CandidatoCardSkeleton';

// Candidato Row Skeleton (para lista)
const CandidatoRowSkeleton = memo(function CandidatoRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <SkeletonPulse className="h-4 w-4 rounded" />
      <SkeletonPulse className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 grid grid-cols-4 gap-4">
        <div className="space-y-1">
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-3 w-3/4" />
        </div>
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-6 w-20 rounded-full" />
        <SkeletonPulse className="h-8 w-12 rounded-full" />
      </div>
      <SkeletonPulse className="h-8 w-8 rounded" />
    </div>
  );
});

CandidatoRowSkeleton.displayName = 'CandidatoRowSkeleton';

// Toolbar Skeleton
const ToolbarSkeleton = memo(function ToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <SkeletonPulse className="h-10 w-64 rounded-lg" />
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-10 w-10 rounded-lg" />
        <SkeletonPulse className="h-10 w-10 rounded-lg" />
        <SkeletonPulse className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
});

ToolbarSkeleton.displayName = 'ToolbarSkeleton';

// Candidatos Complete Skeleton
function CandidatosSkeletonComponent({ 
  className, 
  viewMode = 'grid' 
}: CandidatosSkeletonProps) {
  return (
    <div 
      role="status" 
      aria-label="Carregando candidatos..."
      aria-busy="true"
      className={cn('space-y-6 animate-in fade-in-50 duration-300', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-40" />
          <SkeletonPulse className="h-4 w-56" />
        </div>
        <SkeletonPulse className="h-10 w-36 rounded-lg" />
      </div>

      {/* Toolbar */}
      <ToolbarSkeleton />

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CandidatoCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 border-b">
            <SkeletonPulse className="h-4 w-4 rounded" />
            <SkeletonPulse className="h-4 w-10" />
            <div className="flex-1 grid grid-cols-4 gap-4">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-4 w-16" />
            </div>
            <SkeletonPulse className="h-4 w-16" />
          </div>
          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <CandidatoRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-8 w-8 rounded" />
          <SkeletonPulse className="h-8 w-8 rounded" />
          <SkeletonPulse className="h-8 w-8 rounded" />
          <SkeletonPulse className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

CandidatosSkeletonComponent.displayName = 'CandidatosSkeleton';

export const CandidatosSkeleton = memo(CandidatosSkeletonComponent);
export { CandidatoCardSkeleton, CandidatoRowSkeleton, ToolbarSkeleton };
