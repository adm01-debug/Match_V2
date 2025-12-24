import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { departamentosInfo, niveisInfo } from '@/config/testsConfig';
import { Clock, FileText, Play } from 'lucide-react';

interface BateriaProvas {
  id: string;
  nome: string;
  descricao?: string;
  departamento: string;
  nivel: string;
  duracao_total: number;
  ativo: boolean;
}

interface BateriaCardProps {
  bateria: BateriaProvas;
  onSelect?: (bateria: BateriaProvas) => void;
}

export const BateriaCard = memo(function BateriaCard({ bateria, onSelect }: BateriaCardProps) {
  const departamento = departamentosInfo[bateria.departamento] || { nome: bateria.departamento };
  const nivel = niveisInfo[bateria.nivel] || { nome: bateria.nivel };

  return (
    <Card role="article" aria-label="Bateria de testes" className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div data-testid="bateria-card" className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{bateria.nome}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{bateria.descricao}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant="default">{departamento.nome}</Badge>
            <Badge variant="secondary">{nivel.nome}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {Math.floor(bateria.duracao_total / 60)}h {bateria.duracao_total % 60}min
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Bateria de provas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={bateria.ativo ? "default" : "secondary"}>
            {bateria.ativo ? "Ativa" : "Inativa"}
          </Badge>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onSelect?.(bateria)}
        >
          <Play className="h-4 w-4 mr-2" />
          Aplicar Bateria
        </Button>
      </CardContent>
    </Card>
  );
});

BateriaCard.displayName = "BateriaCard";
