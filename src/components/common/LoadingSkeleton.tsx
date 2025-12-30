import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'list';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

function SkeletonBase({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <div
      className={cn(
        'bg-muted rounded',
        animate && 'animate-pulse',
        className
      )}
    />
  );
}

export function LoadingSkeleton({
  className,
  variant = 'text',
  lines = 1,
  width,
  height,
  animate = true,
}: LoadingSkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  switch (variant) {
    case 'circular':
      return (
        <SkeletonBase
          className={cn('rounded-full', className)}
          animate={animate}
          style={{ ...style, width: width || '40px', height: height || '40px' }}
        />
      );

    case 'rectangular':
      return (
        <SkeletonBase
          className={cn('rounded-lg', className)}
          animate={animate}
          style={{ ...style, width: width || '100%', height: height || '120px' }}
        />
      );

    case 'card':
      return (
        <div className={cn('space-y-3 p-4 border rounded-lg', className)}>
          <SkeletonBase className="h-4 w-3/4" animate={animate} />
          <SkeletonBase className="h-3 w-full" animate={animate} />
          <SkeletonBase className="h-3 w-5/6" animate={animate} />
          <div className="flex gap-2 pt-2">
            <SkeletonBase className="h-8 w-20 rounded-md" animate={animate} />
            <SkeletonBase className="h-8 w-20 rounded-md" animate={animate} />
          </div>
        </div>
      );

    case 'table':
      return (
        <div className={cn('space-y-2', className)}>
          <div className="flex gap-4 p-3 bg-muted/50 rounded-t-lg">
            <SkeletonBase className="h-4 w-1/4" animate={animate} />
            <SkeletonBase className="h-4 w-1/4" animate={animate} />
            <SkeletonBase className="h-4 w-1/4" animate={animate} />
            <SkeletonBase className="h-4 w-1/4" animate={animate} />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 border-b">
              <SkeletonBase className="h-4 w-1/4" animate={animate} />
              <SkeletonBase className="h-4 w-1/4" animate={animate} />
              <SkeletonBase className="h-4 w-1/4" animate={animate} />
              <SkeletonBase className="h-4 w-1/4" animate={animate} />
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={cn('space-y-3', className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBase className="h-10 w-10 rounded-full" animate={animate} />
              <div className="flex-1 space-y-2">
                <SkeletonBase className="h-4 w-3/4" animate={animate} />
                <SkeletonBase className="h-3 w-1/2" animate={animate} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'text':
    default:
      return (
        <div className={cn('space-y-2', className)} style={style}>
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBase
              key={i}
              className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
              animate={animate}
            />
          ))}
        </div>
      );
  }
}

// Componentes de conveniência
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return <LoadingSkeleton variant="text" lines={lines} className={className} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return <LoadingSkeleton variant="card" className={className} />;
}

export function SkeletonTable({ className }: { className?: string }) {
  return <LoadingSkeleton variant="table" className={className} />;
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <LoadingSkeleton variant="circular" className={className} />;
}
