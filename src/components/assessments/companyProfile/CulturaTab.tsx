import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Scale } from 'lucide-react';
import { COMPANY_CULTURE_DIMENSIONS } from '@/config/behavioralPillars';

interface CulturaTabProps {
  culturaDimensoes: Record<string, number>;
  onChange: (dim: string, value: number[]) => void;
}

export function CulturaTab({ culturaDimensoes, onChange }: CulturaTabProps) {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Espectro Cultural
          </CardTitle>
          <CardDescription>Posicione a cultura da empresa em cada dimensão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(COMPANY_CULTURE_DIMENSIONS).map(([key, dim]) => {
            const culturaValue = culturaDimensoes[key] ?? 50;
            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{dim.label}</span>
                  <span className="text-sm text-muted-foreground">{culturaValue}%</span>
                </div>
                <div className="space-y-2">
                  <Slider value={[culturaValue]} onValueChange={(v) => onChange(key, v)} min={0} max={100} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="max-w-[45%] text-left">{dim.extremos[0]}</span>
                    <span className="max-w-[45%] text-right">{dim.extremos[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
