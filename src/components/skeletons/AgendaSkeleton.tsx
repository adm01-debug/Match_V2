/**
 * @fileoverview Skeleton contextualizado para página de Agenda
 * @module AgendaSkeleton
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { SkeletonPulse } from './DashboardSkeleton';

interface AgendaSkeletonProps {
  className?: string;
  view?: 'day' | 'week' | 'month';
}

// Entrevista Card Skeleton
const EntrevistaCardSkeleton = memo(function EntrevistaCardSkeleton() {
  return (
    <div className="p-3 border-l-4 border-l-muted bg-card rounded-r-lg space-y-2">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonPulse className="h-6 w-6 rounded-full" />
        <SkeletonPulse className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
});

EntrevistaCardSkeleton.displayName = 'EntrevistaCardSkeleton';

// Time Slot Skeleton
const TimeSlotSkeleton = memo(function TimeSlotSkeleton({ 
  hasEvent = false 
}: { 
  hasEvent?: boolean 
}) {
  return (
    <div className="flex gap-3 min-h-[60px]">
      <SkeletonPulse className="h-4 w-12 flex-shrink-0" />
      <div className="flex-1 border-t border-dashed pt-2">
        {hasEvent && <EntrevistaCardSkeleton />}
      </div>
    </div>
  );
});

TimeSlotSkeleton.displayName = 'TimeSlotSkeleton';

// Calendar Day Skeleton
const CalendarDaySkeleton = memo(function CalendarDaySkeleton({ 
  isToday = false 
}: { 
  isToday?: boolean 
}) {
  return (
    <div className={cn(
      'p-2 border rounded-lg min-h-[100px]',
      isToday && 'ring-2 ring-primary/20'
    )}>
      <SkeletonPulse className={cn(
        'h-6 w-6 rounded-full mb-2',
        isToday && 'bg-primary/30'
      )} />
      <div className="space-y-1">
        <SkeletonPulse className="h-4 w-full rounded" />
        <SkeletonPulse className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
});

CalendarDaySkeleton.displayName = 'CalendarDaySkeleton';

// Week View Skeleton
const WeekViewSkeleton = memo(function WeekViewSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Header */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={`header-${i}`} className="text-center p-2">
          <SkeletonPulse className="h-4 w-12 mx-auto mb-1" />
          <SkeletonPulse className="h-8 w-8 rounded-full mx-auto" />
        </div>
      ))}
      {/* Days */}
      {Array.from({ length: 7 }).map((_, i) => (
        <CalendarDaySkeleton key={`day-${i}`} isToday={i === 3} />
      ))}
    </div>
  );
});

WeekViewSkeleton.displayName = 'WeekViewSkeleton';

// Day View Skeleton
const DayViewSkeleton = memo(function DayViewSkeleton() {
  const hours = [9, 10, 11, 12, 14, 15, 16, 17];
  const eventsAt = [10, 14, 16];

  return (
    <div className="space-y-1">
      {hours.map((hour) => (
        <TimeSlotSkeleton 
          key={hour} 
          hasEvent={eventsAt.includes(hour)} 
        />
      ))}
    </div>
  );
});

DayViewSkeleton.displayName = 'DayViewSkeleton';

// Agenda Complete Skeleton
function AgendaSkeletonComponent({ 
  className, 
  view = 'week' 
}: AgendaSkeletonProps) {
  return (
    <div 
      role="status" 
      aria-label="Carregando agenda..."
      aria-busy="true"
      className={cn('space-y-6 animate-in fade-in-50 duration-300', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="h-4 w-48" />
        </div>
        <SkeletonPulse className="h-10 w-40 rounded-lg" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-9 w-9 rounded" />
          <SkeletonPulse className="h-9 w-9 rounded" />
          <SkeletonPulse className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-9 w-20 rounded-lg" />
          <SkeletonPulse className="h-9 w-20 rounded-lg" />
          <SkeletonPulse className="h-9 w-20 rounded-lg" />
        </div>
        <SkeletonPulse className="h-9 w-24 rounded-lg" />
      </div>

      {/* Content based on view */}
      <div className="bg-card border rounded-xl p-4">
        {view === 'day' ? <DayViewSkeleton /> : <WeekViewSkeleton />}
      </div>

      {/* Sidebar - Próximas entrevistas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Already rendered above */}
        </div>
        <div className="space-y-4">
          <SkeletonPulse className="h-5 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <EntrevistaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

AgendaSkeletonComponent.displayName = 'AgendaSkeleton';

export const AgendaSkeleton = memo(AgendaSkeletonComponent);
export { EntrevistaCardSkeleton, TimeSlotSkeleton, CalendarDaySkeleton, WeekViewSkeleton, DayViewSkeleton };
