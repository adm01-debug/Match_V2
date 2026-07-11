import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Clock, Sparkles } from 'lucide-react';
import { IMMERSIVE_SCENARIOS } from '@/config/behavioralPillars';

const STATS = [
  { icon: Brain, value: '10', label: 'Pilares', bg: 'bg-primary/10', color: 'text-primary' },
  { icon: Zap, value: String(IMMERSIVE_SCENARIOS.length), label: 'Cenários', bg: 'bg-accent/10', color: 'text-accent-foreground' },
  { icon: Clock, value: '15-20', label: 'Minutos', bg: 'bg-warning/10', color: 'text-warning' },
  { icon: Sparkles, value: 'IA', label: 'Análise Preditiva', bg: 'bg-success/10', color: 'text-success' },
];

export function BehavioralHeroStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map(({ icon: Icon, value, label, bg, color }) => (
        <Card key={label}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
