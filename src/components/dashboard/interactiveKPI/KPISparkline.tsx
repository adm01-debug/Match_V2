import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { KPIVariant, TrendData } from './types';

interface KPISparklineProps {
  data: TrendData[];
  variant: KPIVariant;
  index: number;
}

export function KPISparkline({ data, variant, index }: KPISparklineProps) {
  return (
    <div className="h-12 mt-3 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`hsl(var(--${variant}))`} stopOpacity={0.3} />
              <stop offset="95%" stopColor={`hsl(var(--${variant}))`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={`hsl(var(--${variant}))`}
            strokeWidth={2}
            fill={`url(#gradient-${index})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
