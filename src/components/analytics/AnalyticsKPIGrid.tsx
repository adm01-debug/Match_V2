import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Target, Award, Globe, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPI {
  value: number | string;
  change: number;
  trend: 'up' | 'down';
}

interface AnalyticsKPIGridProps {
  kpis: {
    timeToHire: KPI;
    costPerHire: KPI;
    offerAcceptance: KPI;
    qualityOfHire: KPI;
    sourceROI: KPI;
    retention6m: KPI;
  };
}

const kpiConfig = [
  { key: 'timeToHire' as const, icon: Clock, color: 'text-blue-500', label: 'Time to Hire', suffix: ' dias' },
  { key: 'costPerHire' as const, icon: DollarSign, color: 'text-green-500', label: 'Cost per Hire', prefix: 'R$ ', format: true },
  { key: 'offerAcceptance' as const, icon: Target, color: 'text-purple-500', label: 'Offer Acceptance', suffix: '%' },
  { key: 'qualityOfHire' as const, icon: Award, color: 'text-yellow-500', label: 'Quality of Hire', suffix: '%' },
  { key: 'sourceROI' as const, icon: Globe, color: 'text-cyan-500', label: 'Source ROI', suffix: '%' },
  { key: 'retention6m' as const, icon: Users, color: 'text-pink-500', label: 'Retenção 6 meses', suffix: '%' },
] as const;

export function AnalyticsKPIGrid({ kpis }: AnalyticsKPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpiConfig.map(({ key, icon: Icon, color, label, suffix, prefix, format }) => {
        const kpi = kpis[key];
        const isGoodTrend = (kpi.trend === 'down' && (key === 'timeToHire' || key === 'costPerHire')) || (kpi.trend === 'up' && key !== 'timeToHire' && key !== 'costPerHire');
        const TrendIcon = kpi.trend === 'down' ? TrendingDown : TrendingUp;
        const displayValue = format ? Number(kpi.value).toLocaleString() : kpi.value;

        return (
          <Card key={key}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-5 w-5", color)} />
                <Badge variant="secondary" className={cn("text-xs", isGoodTrend ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  <TrendIcon className="h-3 w-3 mr-1" />{kpi.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{prefix || ''}{displayValue}{suffix || ''}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
