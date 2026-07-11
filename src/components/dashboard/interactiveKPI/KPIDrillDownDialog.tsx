import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formatValue,
  variantStyles,
  type DrillDownData,
  type KPIFormat,
  type KPIVariant,
  type TrendData,
} from './types';

interface KPIDrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: number;
  previousValue?: number;
  target?: number;
  format: KPIFormat;
  icon: LucideIcon;
  variant: KPIVariant;
  trendData: TrendData[];
  drillDownData: DrillDownData[];
}

export function KPIDrillDownDialog({
  open,
  onOpenChange,
  title,
  value,
  previousValue,
  target,
  format,
  icon: Icon,
  variant,
  trendData,
  drillDownData,
}: KPIDrillDownDialogProps) {
  const styles = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn('p-2 rounded-lg', styles.iconBg)}>
              <Icon className={cn('h-5 w-5', styles.iconColor)} />
            </div>
            {title} - Detalhamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Valor Atual</p>
              <p className="text-2xl font-bold">{formatValue(value, format)}</p>
            </Card>
            {previousValue && (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Período Anterior</p>
                <p className="text-2xl font-bold">{formatValue(previousValue, format)}</p>
              </Card>
            )}
            {target && (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Meta</p>
                <p className="text-2xl font-bold">{formatValue(target, format)}</p>
              </Card>
            )}
          </div>

          {trendData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evolução Temporal
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="period" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={`hsl(var(--${variant}))`}
                      fill={`hsl(var(--${variant}) / 0.2)`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {drillDownData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Distribuição por Categoria
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={drillDownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="category" type="category" width={100} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="value" fill={`hsl(var(--${variant}))`} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {drillDownData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.value}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
