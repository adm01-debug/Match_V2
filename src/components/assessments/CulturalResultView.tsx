/**
 * @module CulturalResultView
 * @description Visualização dos resultados do assessment de Fit Cultural
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Heart, CheckCircle, XCircle, Minus } from 'lucide-react';
import type { CulturalResultado } from '@/types/selection';

interface CulturalResultViewProps {
  resultado: CulturalResultado;
  candidatoNome?: string;
}

const getStatusColor = (status: 'alto' | 'medio' | 'baixo') => {
  switch (status) {
    case 'alto': return 'text-success bg-success/15';
    case 'medio': return 'text-warning bg-warning/15';
    case 'baixo': return 'text-destructive bg-destructive/15';
  }
};

const getStatusIcon = (status: 'alto' | 'medio' | 'baixo') => {
  switch (status) {
    case 'alto': return <CheckCircle className="h-4 w-4" />;
    case 'medio': return <Minus className="h-4 w-4" />;
    case 'baixo': return <XCircle className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: 'alto' | 'medio' | 'baixo') => {
  switch (status) {
    case 'alto': return 'Alto Alinhamento';
    case 'medio': return 'Alinhamento Parcial';
    case 'baixo': return 'Baixo Alinhamento';
  }
};

export function CulturalResultView({ resultado, candidatoNome }: CulturalResultViewProps) {
  const sortedAlinhamentos = [...resultado.alinhamentos].sort((a, b) => b.score - a.score);

  const getFitColor = (fit: number) => {
    if (fit >= 80) return 'text-success';
    if (fit >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getFitBgColor = (fit: number) => {
    if (fit >= 80) return 'bg-success';
    if (fit >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header com Fit Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Fit Cultural {candidatoNome && `- ${candidatoNome}`}
                </CardTitle>
                <CardDescription className="mt-1">
                  Análise de alinhamento com os valores da empresa
                </CardDescription>
              </div>
            </div>
            {/* Score Geral */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getFitColor(resultado.fitGeral)}`}>
                {resultado.fitGeral}%
              </div>
              <span className="text-sm text-muted-foreground">Fit Geral</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 ${getFitBgColor(resultado.fitGeral)} rounded-full transition-all duration-700`}
              style={{ width: `${resultado.fitGeral}%` }}
            />
            <div className="absolute inset-y-0 left-[60%] w-px bg-warning opacity-50" />
            <div className="absolute inset-y-0 left-[80%] w-px bg-success opacity-50" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span className="text-warning">60% Parcial</span>
            <span className="text-success">80% Alto</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Alinhamento por Valor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-primary" />
            Alinhamento por Valor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedAlinhamentos.map((alinhamento, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{alinhamento.valor}</span>
                  <Badge className={getStatusColor(alinhamento.status)}>
                    {getStatusIcon(alinhamento.status)}
                    <span className="ml-1">{getStatusLabel(alinhamento.status)}</span>
                  </Badge>
                </div>
                <span className="font-bold">{alinhamento.score}%</span>
              </div>
              <Progress 
                value={alinhamento.score} 
                className={`h-2 ${
                  alinhamento.status === 'alto' ? '[&>div]:bg-green-500' :
                  alinhamento.status === 'medio' ? '[&>div]:bg-yellow-500' :
                  '[&>div]:bg-red-500'
                }`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resumo e Observações */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Valores com Alto Fit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedAlinhamentos
                .filter(a => a.status === 'alto')
                .map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="capitalize">{a.valor}</span>
                    <span className="ml-auto font-semibold text-green-600">{a.score}%</span>
                  </div>
                ))}
              {sortedAlinhamentos.filter(a => a.status === 'alto').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum valor com alto alinhamento
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Áreas de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedAlinhamentos
                .filter(a => a.status === 'baixo')
                .map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg dark:bg-red-950/20">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="capitalize">{a.valor}</span>
                    <span className="ml-auto font-semibold text-red-600">{a.score}%</span>
                  </div>
                ))}
              {sortedAlinhamentos.filter(a => a.status === 'baixo').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum valor com baixo alinhamento ✨
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {resultado.observacoes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{resultado.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
