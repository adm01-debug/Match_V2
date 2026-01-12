/**
 * @fileoverview Premium Skeleton Loading Components
 * Shimmer animations with gradient effects for premium UX
 */

import { cn } from "@/lib/utils";

interface PremiumSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "button" | "badge";
  animate?: boolean;
}

export function PremiumSkeleton({ 
  className, 
  variant = "default",
  animate = true 
}: PremiumSkeletonProps) {
  const baseClasses = "relative overflow-hidden bg-muted/50 rounded-md";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    text: "h-3 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
    badge: "h-6 w-16 rounded-full"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animate && "skeleton-shimmer",
        className
      )}
      aria-hidden="true"
    />
  );
}

interface PremiumSkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
  showBadge?: boolean;
  showActions?: boolean;
}

export function PremiumSkeletonCard({ 
  className,
  showAvatar = true,
  lines = 3,
  showBadge = true,
  showActions = true,
  style,
  ...props
}: PremiumSkeletonCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4",
        className
      )}
      style={style}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {showAvatar && <PremiumSkeleton variant="avatar" />}
        <div className="flex-1 space-y-2">
          <PremiumSkeleton className="h-5 w-2/3" />
          <PremiumSkeleton className="h-3 w-1/2" />
        </div>
        {showBadge && <PremiumSkeleton variant="badge" />}
      </div>
      
      {/* Content lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <PremiumSkeleton 
            key={i} 
            variant="text" 
            className={i === lines - 1 ? "w-1/2" : "w-full"}
          />
        ))}
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-2">
          <PremiumSkeleton variant="button" />
          <PremiumSkeleton variant="button" className="w-20" />
        </div>
      )}
    </div>
  );
}

// Re-export as SkeletonCard for backward compatibility
export { PremiumSkeletonCard as SkeletonCard };

interface PremiumSkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function PremiumSkeletonTable({ 
  rows = 5, 
  columns = 4,
  className 
}: PremiumSkeletonTableProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <PremiumSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div 
          key={rowIdx} 
          className="flex gap-4 p-4 border border-border/30 rounded-lg"
          style={{ animationDelay: `${rowIdx * 100}ms` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <PremiumSkeleton 
              key={colIdx} 
              className={cn(
                "h-4 flex-1",
                colIdx === 0 && "w-1/4",
                colIdx === columns - 1 && "w-20"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Re-export as SkeletonTable for backward compatibility
export { PremiumSkeletonTable as SkeletonTable };

interface SkeletonKanbanProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

export function SkeletonKanban({ 
  columns = 4, 
  cardsPerColumn = 3,
  className 
}: SkeletonKanbanProps) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {Array.from({ length: columns }).map((_, colIdx) => (
        <div 
          key={colIdx} 
          className="flex-shrink-0 w-72 space-y-3"
          style={{ animationDelay: `${colIdx * 150}ms` }}
        >
          {/* Column header */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <PremiumSkeleton className="h-5 w-24" />
            <PremiumSkeleton variant="badge" />
          </div>
          
          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIdx) => (
              <PremiumSkeletonCard 
                key={cardIdx}
                className="p-4"
                lines={2}
                showActions={false}
                style={{ animationDelay: `${(colIdx * cardsPerColumn + cardIdx) * 50}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonDashboardProps {
  className?: string;
}

export function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <PremiumSkeleton className="h-4 w-20" />
              <PremiumSkeleton variant="avatar" className="h-8 w-8" />
            </div>
            <PremiumSkeleton className="h-8 w-24" />
            <PremiumSkeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
          <PremiumSkeleton className="h-6 w-32" />
          <PremiumSkeleton variant="card" className="h-64" />
        </div>
        <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
          <PremiumSkeleton className="h-6 w-40" />
          <PremiumSkeleton variant="card" className="h-64" />
        </div>
      </div>
      
      {/* Table */}
      <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
        <PremiumSkeleton className="h-6 w-48" />
        <PremiumSkeletonTable rows={4} columns={5} />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
  variant?: "simple" | "detailed";
}

export function SkeletonList({ 
  items = 5, 
  className,
  variant = "simple"
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50",
            "transition-all duration-300"
          )}
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <PremiumSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <PremiumSkeleton className="h-4 w-1/3" />
            {variant === "detailed" && (
              <PremiumSkeleton className="h-3 w-2/3" />
            )}
          </div>
          <PremiumSkeleton variant="badge" />
        </div>
      ))}
    </div>
  );
}

export default PremiumSkeleton;
