import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, RefreshCw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  tipo: 'positivo' | 'alerta' | 'sugestao' | 'tendencia';
  titulo: string;
  descricao: string;
  acao?: string;
  impacto?: 'alto' | 'medio' | 'baixo';
}

interface SmartInsightsProps {
  kpiData: {
    tempoMedio: number;
    metaTempo: number;
    contratadosMes: number;
    metaContratacao: number;
    emProcesso: number;
  };
  funilData: { etapa: string; quantidade: number }[];
}

const tipoConfig = {
  positivo: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  alerta: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  sugestao: {
    icon: Lightbulb,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  tendencia: {
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
};

function generateInsights(kpiData: SmartInsightsProps['kpiData'], funilData: SmartInsightsProps['funilData']): Insight[] {
  const insights: Insight[] = [];

  // Análise de tempo médio
  if (kpiData.tempoMedio > kpiData.metaTempo) {
    const diferenca = kpiData.tempoMedio - kpiData.metaTempo;
    insights.push({
      id: 'tempo-acima',
      tipo: 'alerta',
      titulo: 'Tempo de contratação acima da meta',
      descricao: `O tempo médio está ${diferenca} dias acima da meta. Considere otimizar etapas do processo.`,
      acao: 'Ver gargalos',
      impacto: 'alto',
    });
  } else {
    insights.push({
      id: 'tempo-ok',
      tipo: 'positivo',
      titulo: 'Tempo de contratação saudável',
      descricao: `Processo está ${kpiData.metaTempo - kpiData.tempoMedio} dias abaixo da meta. Continue assim!`,
      impacto: 'medio',
    });
  }

  // Análise de meta de contratação
  const progressoMeta = (kpiData.contratadosMes / kpiData.metaContratacao) * 100;
  if (progressoMeta >= 75) {
    insights.push({
      id: 'meta-positiva',
      tipo: 'positivo',
      titulo: 'Meta de contratação próxima',
      descricao: `${Math.round(progressoMeta)}% da meta atingida. Você está no caminho certo!`,
      impacto: 'alto',
    });
  } else if (progressoMeta < 50) {
    insights.push({
      id: 'meta-atencao',
      tipo: 'alerta',
      titulo: 'Meta de contratação em risco',
      descricao: `Apenas ${Math.round(progressoMeta)}% da meta atingida. Priorize candidatos em fase final.`,
      acao: 'Ver finais',
      impacto: 'alto',
    });
  }

  // Análise de funil - detectar gargalos
  if (funilData.length >= 4) {
    const triagem = funilData.find(f => f.etapa === 'Triagem');
    const entrevista = funilData.find(f => f.etapa === 'Entrevista');
    
    if (triagem && entrevista) {
      const conversao = (entrevista.quantidade / triagem.quantidade) * 100;
      if (conversao < 40) {
        insights.push({
          id: 'gargalo-triagem',
          tipo: 'sugestao',
          titulo: 'Gargalo na triagem',
          descricao: `Apenas ${Math.round(conversao)}% dos candidatos avançam para entrevista. Revise critérios de triagem.`,
          acao: 'Ajustar filtros',
          impacto: 'medio',
        });
      }
    }
  }

  // Sugestão de automação
  if (kpiData.emProcesso > 30) {
    insights.push({
      id: 'automacao',
      tipo: 'sugestao',
      titulo: 'Considere automação',
      descricao: `Com ${kpiData.emProcesso} candidatos em processo, automação de feedbacks pode economizar horas.`,
      acao: 'Ver templates',
      impacto: 'medio',
    });
  }

  return insights.slice(0, 4); // Máximo 4 insights
}

export function SmartInsights({ kpiData, funilData }: SmartInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setInsights(generateInsights(kpiData, funilData));
  }, [kpiData, funilData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setInsights(generateInsights(kpiData, funilData));
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Insights Inteligentes</CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">IA</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((insight) => {
          const config = tipoConfig[insight.tipo];
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer",
                config.bgColor,
                config.borderColor
              )}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{insight.titulo}</span>
                    {insight.impacto === 'alto' && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        Prioridade
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.descricao}
                  </p>
                  {insight.acao && (
                    <Button
                      variant="link"
                      size="sm"
                      className={cn("h-auto p-0 mt-1 text-xs", config.color)}
                    >
                      {insight.acao} →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
