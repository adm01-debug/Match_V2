import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BateriaProvas } from '@/types/tests';
import { departamentosInfo, niveisInfo,  } from '@/config/testsConfig';
import { Clock, FileText, CheckCircle, Circle, Play } from 'lucide-react';

interface BateriaCardProps {
  bateria: BateriaProvas;
  onSelect?: (bateria: BateriaProvas) => void;
}

export function BateriaCard({ bateria, onSelect }: BateriaCardProps) {
  const departamento = departamentosInfo[bateria.departamento];
  const nivel = niveisInfo[bateria.nivel];
  
  const provasObrigatorias = bateria.obrigatorias.map(id => 
    .find(p => p.id === id)
  ).filter(Boolean);
  
  const provasOpcionais = bateria.opcionais.map(id => 
    .find(p => p.id === id)
  ).filter(Boolean);

  return (
    <Card role="article" aria-label="Bateria de testes" className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
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
            {Math.floor(bateria.duracaoTotal / 60)}h {bateria.duracaoTotal % 60}min
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {bateria.provas.length} provas
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Obrigatórias ({provasObrigatorias.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {provasObrigatorias.map((prova) => (
              <Badge key={prova?.id} variant="outline" className="text-xs">
                {prova?.titulo}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            Opcionais ({provasOpcionais.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {provasOpcionais.slice(0, 4).map((prova) => (
              <Badge key={prova?.id} variant="outline" className="text-xs bg-muted/50">
                {prova?.titulo}
              </Badge>
            ))}
            {provasOpcionais.length > 4 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{provasOpcionais.length - 4}
              </Badge>
            )}
          </div>
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
}

