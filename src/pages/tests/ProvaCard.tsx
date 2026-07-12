import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2, Play, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getCategoriaById, getNivelById } from '@/config/testsConfig';
import { HighlightMatch } from '@/components/ui/highlight-match';
import type { Prova } from '@/types/tests';
import { iconeMap } from './iconMap';

interface Props {
  prova: Prova;
  getMatchIndices: (id: string, key: string) => number[][] | undefined;
  onDuplicar: (id: string) => void;
  onExcluir: (id: string) => void;
}

export const ProvaCard = ({ prova, getMatchIndices, onDuplicar, onExcluir }: Props) => {
  const navigate = useNavigate();
  const categoria = getCategoriaById(prova.categoria);
  const nivel = prova.niveisAplicaveis?.[0] ? getNivelById(prova.niveisAplicaveis[0]) : null;
  const IconeCategoria = categoria ? iconeMap[categoria.icone] || FileText : FileText;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className={cn('p-2 rounded-lg', categoria?.cor || 'bg-muted')}>
            <IconeCategoria className="h-5 w-5 text-primary-foreground" />
          </div>
          <Badge variant="outline">{nivel?.nome || 'Geral'}</Badge>
        </div>
        <CardTitle className="text-lg mt-2">
          <HighlightMatch text={prova.titulo} indices={getMatchIndices(prova.id, 'titulo')} />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          <HighlightMatch text={prova.descricao || ''} indices={getMatchIndices(prova.id, 'descricao')} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold">{prova.totalQuestoes}</p>
            <p className="text-xs text-muted-foreground">Questões</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{prova.duracao}</p>
            <p className="text-xs text-muted-foreground">Minutos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{prova.notaMinima}%</p>
            <p className="text-xs text-muted-foreground">Mínimo</p>
          </div>
        </div>

        {(prova.aplicacoes || 0) > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Aplicações</span>
              <span className="font-medium">{prova.aplicacoes}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Média de notas</span>
              <span className={cn('font-medium', (prova.mediaNotas || 0) >= 70 ? 'text-success' : 'text-warning')}>
                {prova.mediaNotas?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/testes/${prova.id}/editar`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDuplicar(prova.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onExcluir(prova.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" onClick={() => navigate(`/testes/${prova.id}/aplicar`)}>
          <Play className="h-4 w-4 mr-1" />
          Aplicar
        </Button>
      </CardFooter>
    </Card>
  );
};
