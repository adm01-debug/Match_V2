import { memo , memo} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { useEntrevistasStats } from '@/hooks/useEntrevistas';

export function EntrevistasStats() {
  const { data: stats, isLoading, error } = useEntrevistasStats();

  if (isLoading) {
    return (
      <Card role="article" aria-label="Estatísticas de entrevistas">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Entrevistas - Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Entrevistas - Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Erro ao carregar estatísticas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Entrevistas - Taxa de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Taxa de Aprovação */}
        <div data-testid="entrevistas-stats" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Taxa de Aprovação</span>
            </div>
            <Badge variant="default" className="bg-green-500">
              {stats.taxaAprovacao}%
            </Badge>
          </div>
          <Progress value={stats.taxaAprovacao} className="h-2" />
        </div>

        {/* Taxa de Reprovação */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Taxa de Reprovação</span>
            </div>
            <Badge variant="destructive">
              {stats.taxaReprovacao}%
            </Badge>
          </div>
          <Progress value={stats.taxaReprovacao} className="h-2 [&>div]:bg-red-500" />
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
            <div className="text-xs text-muted-foreground">Aprovados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.reprovados}</div>
            <div className="text-xs text-muted-foreground">Reprovados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </div>
        </div>

        {/* Nota Média e Entrevistas Futuras */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="text-lg font-semibold">{stats.notaMedia}/10</div>
              <div className="text-xs text-muted-foreground">Nota Média</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <div className="text-lg font-semibold">{stats.agendadas + stats.confirmadas}</div>
              <div className="text-xs text-muted-foreground">Agendadas</div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="text-center pt-2 text-sm text-muted-foreground">
          Total de {stats.realizadas} entrevistas realizadas
        </div>
      </CardContent>
    </Card>
  );
}


EntrevistasStats.displayName = "EntrevistasStats";