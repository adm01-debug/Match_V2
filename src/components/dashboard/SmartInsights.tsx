/**
 * @fileoverview Premium SmartInsights component
 * @module SmartInsights
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, Lightbulb, ArrowRight, Brain } from 'lucide-react';
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
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
    glowColor: 'hover:shadow-[0_0_20px_-5px_hsl(var(--success)/0.3)]',
  },
  alerta: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
    glowColor: 'hover:shadow-[0_0_20px_-5px_hsl(var(--warning)/0.3)]',
  },
  sugestao: {
    icon: Lightbulb,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20',
    glowColor: 'hover:shadow-[0_0_20px_-5px_hsl(var(--info)/0.3)]',
  },
  tendencia: {
    icon: TrendingUp,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
    glowColor: 'hover:shadow-[0_0_20px_-5px_hsl(var(--accent)/0.3)]',
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

  return insights.slice(0, 4);
}

function SmartInsightsComponent({ kpiData, funilData }: SmartInsightsProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card 
        role="article" 
        aria-label="Insights inteligentes" 
        className="h-full border-primary/20 shadow-elevated overflow-hidden relative"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Header accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="relative pb-3">
          <div data-testid="smart-insights" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="p-2 rounded-xl gradient-primary"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Insights Inteligentes</CardTitle>
                <p className="text-xs text-muted-foreground">Análise automática do seu recrutamento</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-[10px] px-2">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-3">
          <AnimatePresence mode="popLayout">
            {insights.map((insight, index) => {
              const config = tipoConfig[insight.tipo];
              const Icon = config.icon;

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "group p-4 rounded-xl border transition-all cursor-pointer",
                    config.bgColor,
                    config.borderColor,
                    config.glowColor
                  )}
                >
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className={cn("p-2 rounded-lg", config.bgColor)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{insight.titulo}</span>
                        {insight.impacto === 'alto' && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-current">
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
                          className={cn("h-auto p-0 mt-2 text-xs font-medium group/btn", config.color)}
                        >
                          {insight.acao}
                          <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

SmartInsightsComponent.displayName = "SmartInsights";

export const SmartInsights = memo(SmartInsightsComponent);
export default SmartInsights;
