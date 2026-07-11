import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BULLETS = [
  'Dilemas éticos sem resposta "certa"',
  'Situações de pressão com tempo limitado',
  'Análise de padrões de hesitação',
  'Detecção de respostas "socialmente desejáveis"',
];

const TIPOS = [
  { label: 'Dilemas Éticos', count: 2, color: 'bg-warning' },
  { label: 'Sob Pressão', count: 1, color: 'bg-destructive' },
  { label: 'Conflitos', count: 1, color: 'bg-accent' },
  { label: 'Gestão de Crise', count: 1, color: 'bg-destructive' },
  { label: 'Inovação', count: 1, color: 'bg-success' },
  { label: 'Decisão Estratégica', count: 0, color: 'bg-primary' },
];

interface Props {
  onStart: () => void;
}

export function BehavioralIntroTab({ onStart }: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Avaliação Imersiva
          </CardTitle>
          <CardDescription>Cenários situacionais que revelam comportamentos reais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {BULLETS.map(b => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>{b}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="w-full gap-2 mt-4" onClick={onStart}>
            Iniciar Avaliação Demo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Cenários</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {TIPOS.map(tipo => (
            <div key={tipo.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', tipo.color)} />
                <span className="text-sm">{tipo.label}</span>
              </div>
              <Badge variant="secondary">{tipo.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
