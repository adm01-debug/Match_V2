import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Prova } from '@/types/tests';
import { categoriasInfo, departamentosInfo, niveisInfo } from '@/config/testsConfig';
import { Clock, Users, BarChart3, FileText, Play, Edit, Copy, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface ProvaCardProps {
  prova: Prova;
  onSelect?: (prova: Prova) => void;
  onEdit?: (prova: Prova) => void;
  onDuplicate?: (prova: Prova) => void;
  onDelete?: (prova: Prova) => void;
  compact?: boolean;
}

export function ProvaCard({ prova, onSelect, onEdit, onDuplicate, onDelete, compact = false }: ProvaCardProps) {
  const categoriaInfo = categoriasInfo[prova.categoria];
  
  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
        style={{ borderLeftColor: `var(--${prova.categoria}-color, hsl(var(--primary)))` }}
        onClick={() => onSelect?.(prova)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{prova.titulo}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{prova.descricao}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {prova.duracao}min
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {prova.totalQuestoes}q
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {categoriaInfo.nome.split(' ')[1] || categoriaInfo.nome.split(' ')[0]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg ${categoriaInfo.cor} flex items-center justify-center`}>
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{prova.titulo}</h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {categoriaInfo.nome}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => onEdit?.(prova)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(prova)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(prova)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{prova.descricao}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{prova.duracao} minutos</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{prova.totalQuestoes} questões</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{prova.aplicacoes} aplicações</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Média: {prova.mediaNotas}%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Nota mínima: {prova.notaMinima}%</span>
            <span>Máx: {prova.pontuacaoMaxima}pts</span>
          </div>
          <Progress value={prova.notaMinima} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-1">
          {prova.niveisAplicaveis.slice(0, 4).map((nivel) => (
            <Badge key={nivel} variant="outline" className="text-xs">
              {niveisInfo[nivel].nome}
            </Badge>
          ))}
          {prova.niveisAplicaveis.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{prova.niveisAplicaveis.length - 4}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => onSelect?.(prova)}
          >
            <Play className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

