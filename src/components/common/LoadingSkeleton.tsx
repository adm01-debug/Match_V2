import { CSSProperties, memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'list';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
  'aria-label'?: string;
}

interface SkeletonBaseProps {
  className?: string;
  animate?: boolean;
  style?: CSSProperties;
}

const SkeletonBase = memo(function SkeletonBase({ 
  className, 
  animate = true, 
  style 
}: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'bg-muted rounded',
        animate && 'animate-pulse',
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
});

SkeletonBase.displayName = 'SkeletonBase';

function LoadingSkeletonComponent({
  className,
  variant = 'text',
  lines = 1,
  width,
  height,
  animate = true,
  'aria-label': ariaLabel,
}: LoadingSkeletonProps) {
  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const containerProps = {
    role: 'status' as const,
    'aria-label': ariaLabel || 'Carregando...',
    'aria-busy': true as const,
  };

  switch (variant) {
    case 'circular':
      return (
        <div {...containerProps}>
          <SkeletonBase
            className={cn('rounded-full', className)}
            animate={animate}
            style={{ 
              ...style, 
              width: width ?? '40px', 
              height: height ?? '40px' 
            }}
          />
        </div>
      );

    case 'rectangular':
      return (
        <div {...containerProps}>
          <SkeletonBase
            className={cn('rounded-lg', className)}
            animate={animate}
            style={{ 
              ...style, 
              width: width ?? '100%', 
              height: height ?? '120px' 
            }}
          />
        </div>
      );

    case 'card':
      return (
        <div {...containerProps} className={cn('space-y-3 p-4 border rounded-lg', className)}>
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
        <div {...containerProps} className={cn('space-y-2', className)}>
          <div className="flex gap-4 p-3 bg-muted/50 rounded-t-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBase key={`header-${i}`} className="h-4 w-1/4" animate={animate} />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-4 p-3 border-b">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <SkeletonBase 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  className="h-4 w-1/4" 
                  animate={animate} 
                />
              ))}
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div {...containerProps} className={cn('space-y-3', className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={`list-item-${i}`} className="flex items-center gap-3">
              <SkeletonBase className="h-10 w-10 rounded-full flex-shrink-0" animate={animate} />
              <div className="flex-1 space-y-2 min-w-0">
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
        <div {...containerProps} className={cn('space-y-2', className)} style={style}>
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBase
              key={`text-line-${i}`}
              className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
              animate={animate}
            />
          ))}
        </div>
      );
  }
}

LoadingSkeletonComponent.displayName = 'LoadingSkeleton';

export const LoadingSkeleton = memo(LoadingSkeletonComponent);

// Componentes de conveniência com displayName
export const SkeletonText = memo(function SkeletonText({ 
  lines = 3, 
  className,
  'aria-label': ariaLabel,
}: { 
  lines?: number; 
  className?: string;
  'aria-label'?: string;
}) {
  return <LoadingSkeleton variant="text" lines={lines} className={className} aria-label={ariaLabel} />;
});
SkeletonText.displayName = 'SkeletonText';

export const SkeletonCard = memo(function SkeletonCard({ 
  className,
  'aria-label': ariaLabel,
}: { 
  className?: string;
  'aria-label'?: string;
}) {
  return <LoadingSkeleton variant="card" className={className} aria-label={ariaLabel} />;
});
SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonTable = memo(function SkeletonTable({ 
  className,
  'aria-label': ariaLabel,
}: { 
  className?: string;
  'aria-label'?: string;
}) {
  return <LoadingSkeleton variant="table" className={className} aria-label={ariaLabel} />;
});
SkeletonTable.displayName = 'SkeletonTable';

export const SkeletonAvatar = memo(function SkeletonAvatar({ 
  className,
  'aria-label': ariaLabel,
}: { 
  className?: string;
  'aria-label'?: string;
}) {
  return <LoadingSkeleton variant="circular" className={className} aria-label={ariaLabel} />;
});
SkeletonAvatar.displayName = 'SkeletonAvatar';
