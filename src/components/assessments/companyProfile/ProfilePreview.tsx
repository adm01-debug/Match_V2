import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { BEHAVIORAL_PILLARS } from '@/config/behavioralPillars';

interface ProfilePreviewProps {
  topPilares: (typeof BEHAVIORAL_PILLARS)[number][];
  pilaresValorizados: Record<string, number>;
  culturaDimensoes: Record<string, number>;
  dealbreakers: string[];
}

const ritmoLabel = (v: number) => (v > 60 ? 'Intenso' : v < 40 ? 'Tranquilo' : 'Moderado');
const estruturaLabel = (v: number) => (v > 60 ? 'Hierárquica' : v < 40 ? 'Horizontal' : 'Matricial');
const inovacaoLabel = (v: number) => (v > 60 ? 'Disruptiva' : v < 40 ? 'Incremental' : 'Balanceada');

export function ProfilePreview({ topPilares, pilaresValorizados, culturaDimensoes, dealbreakers }: ProfilePreviewProps) {
  const velocidade = culturaDimensoes['velocidade'] ?? 50;
  const hierarquia = culturaDimensoes['hierarquia'] ?? 50;
  const inovacao = culturaDimensoes['inovacao'] ?? 50;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Preview do Perfil de Matching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Top 3 Pilares</p>
            <div className="space-y-1">
              {topPilares.map((p, i) => (
                <p key={p.id}>
                  {i + 1}. {p.nome} <span className="text-primary font-medium">({pilaresValorizados[p.id] ?? 5}/10)</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Cultura</p>
            <p>Ritmo: <span className="font-medium">{ritmoLabel(velocidade)}</span></p>
            <p>Estrutura: <span className="font-medium">{estruturaLabel(hierarquia)}</span></p>
            <p>Inovação: <span className="font-medium">{inovacaoLabel(inovacao)}</span></p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Dealbreakers</p>
            {dealbreakers.length === 0 ? (
              <p className="text-warning">Nenhum definido</p>
            ) : (
              <p>{dealbreakers.length} comportamento(s) eliminatório(s)</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
