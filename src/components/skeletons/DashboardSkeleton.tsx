/**
 * @fileoverview Skeleton contextualizado para Dashboard
 * @module DashboardSkeleton
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardSkeletonProps {
  className?: string;
}

const SkeletonPulse = memo(function SkeletonPulse({ 
  className,
  style
}: { 
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div 
      className={cn('relative overflow-hidden bg-muted rounded', className)}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' as const }}
      />
    </div>
  );
});

SkeletonPulse.displayName = 'SkeletonPulse';

// KPI Card Skeleton
const KPICardSkeleton = memo(function KPICardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonPulse className="h-8 w-20" />
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-4 w-12" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
});

KPICardSkeleton.displayName = 'KPICardSkeleton';

// Chart Skeleton
const ChartSkeleton = memo(function ChartSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card">
      <div className="flex items-center justify-between mb-6">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-8 w-24 rounded-md" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonPulse 
            key={i} 
            className="flex-1 rounded-t-md"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';

// Agenda Skeleton
const AgendaSkeleton = memo(function AgendaSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card">
      <div className="flex items-center justify-between mb-4">
        <SkeletonPulse className="h-5 w-28" />
        <SkeletonPulse className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <SkeletonPulse className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-4 w-3/4" />
              <SkeletonPulse className="h-3 w-1/2" />
            </div>
            <SkeletonPulse className="h-6 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
});

AgendaSkeleton.displayName = 'AgendaSkeleton';

// Ações Pendentes Skeleton
const AcoesPendentesSkeleton = memo(function AcoesPendentesSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-card">
      <div className="flex items-center justify-between mb-4">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-5 w-5 rounded" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <SkeletonPulse className="h-4 w-4 rounded" />
            <SkeletonPulse className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
});

AcoesPendentesSkeleton.displayName = 'AcoesPendentesSkeleton';

// Dashboard Complete Skeleton
function DashboardSkeletonComponent({ className }: DashboardSkeletonProps) {
  return (
    <div 
      role="status" 
      aria-label="Carregando dashboard..."
      aria-busy="true"
      className={cn('space-y-6 animate-in fade-in-50 duration-300', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-48" />
          <SkeletonPulse className="h-4 w-64" />
        </div>
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AgendaSkeleton />
        <AgendaSkeleton />
        <AcoesPendentesSkeleton />
      </div>
    </div>
  );
}

DashboardSkeletonComponent.displayName = 'DashboardSkeleton';

export const DashboardSkeleton = memo(DashboardSkeletonComponent);
export { KPICardSkeleton, ChartSkeleton, AgendaSkeleton, AcoesPendentesSkeleton, SkeletonPulse };
