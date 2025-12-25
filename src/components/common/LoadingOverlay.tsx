/**
 * @fileoverview LoadingOverlay component
 * @module LoadingOverlay
 */

import { memo , memo} from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({
  isLoading,
  message = 'Carregando...',
  className,
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div data-testid="loading-overlay" className={cn(
        'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
