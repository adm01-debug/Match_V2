/**
 * @fileoverview Centralized exports for contextual skeleton components
 * @module components/skeletons
 */

// Dashboard Skeletons
export {
  DashboardSkeleton,
  KPICardSkeleton,
  ChartSkeleton,
  AgendaSkeleton as DashboardAgendaSkeleton,
  AcoesPendentesSkeleton,
  SkeletonPulse
} from './DashboardSkeleton';

// Candidatos Skeletons
export {
  CandidatosSkeleton,
  CandidatoCardSkeleton,
  CandidatoRowSkeleton,
  ToolbarSkeleton
} from './CandidatosSkeleton';

// Vagas Skeletons
export {
  VagasSkeleton,
  VagaCardSkeleton,
  VagasStatsSkeleton
} from './VagasSkeleton';

// Pipeline Skeletons
export {
  PipelineSkeleton,
  KanbanCardSkeleton,
  KanbanColumnSkeleton
} from './PipelineSkeleton';

// Agenda Skeletons
export {
  AgendaSkeleton,
  EntrevistaCardSkeleton,
  TimeSlotSkeleton,
  CalendarDaySkeleton,
  WeekViewSkeleton,
  DayViewSkeleton
} from './AgendaSkeleton';

// Generic Skeleton (re-export from common)
export { LoadingSkeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonAvatar } from '../common/LoadingSkeleton';
