import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPITrendBadgeProps {
  value: number;
  previousValue: number;
}

export function KPITrendBadge({ value, previousValue }: KPITrendBadgeProps) {
  const change = ((value - previousValue) / previousValue) * 100;
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1',
        isPositive && 'bg-success/10 text-success',
        !isPositive && !isNeutral && 'bg-destructive/10 text-destructive',
        isNeutral && 'bg-muted',
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : isNeutral ? (
        <Minus className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {Math.abs(change).toFixed(1)}%
    </Badge>
  );
}
