/**
 * @component AutomationLogsView
 * @description Visualização de logs de execução de regras de automação
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAutomationLogs } from '@/hooks/useAutomationRules';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AutomationLogsViewProps {
  regraId?: string;
}

const RESULT_CONFIG = {
  sucesso: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Sucesso',
  },
  erro: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Erro',
  },
  ignorado: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    label: 'Ignorado',
  },
};

export function AutomationLogsView({ regraId }: AutomationLogsViewProps) {
  const { data: logs, isLoading } = useAutomationLogs(regraId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Execuções
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs && logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma execução registrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {logs?.map(log => {
                const config = RESULT_CONFIG[log.resultado];
                const Icon = config.icon;

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <div className={`p-2 rounded-full ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.executadoEm), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {log.detalhes && (
                        <p className="text-sm text-muted-foreground truncate">
                          {log.detalhes}
                        </p>
                      )}

                      {log.acaoExecutada && (
                        <div className="mt-2 text-xs">
                          <span className="font-medium">Ação:</span>{' '}
                          <code className="px-1 py-0.5 bg-muted rounded">
                            {log.acaoExecutada.tipo}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
