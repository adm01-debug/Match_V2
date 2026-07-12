/**
 * @fileoverview Comparativo lado a lado de candidatos
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Users,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Equal
} from 'lucide-react';
import type { CandidatoComparativo } from '@/types/jobFit';
import { DISC_PROFILES_INFO } from '@/types/behavioral';
import { getRedFlagSeveridadeInfo } from '@/types/jobFit';

interface CandidateComparisonProps {
  candidatos: CandidatoComparativo[];
  vagaTitulo?: string;
  onSelectWinner?: (candidatoId: string) => void;
}

const DIMENSOES_COMPARACAO = [
  { key: 'discD', label: 'Dominância (D)', categoria: 'DISC' },
  { key: 'discI', label: 'Influência (I)', categoria: 'DISC' },
  { key: 'discS', label: 'Estabilidade (S)', categoria: 'DISC' },
  { key: 'discC', label: 'Conformidade (C)', categoria: 'DISC' },
  { key: 'resiliencia', label: 'Resiliência', categoria: 'Stress' },
  { key: 'lideranca', label: 'Liderança', categoria: 'Competência' },
  { key: 'comunicacao', label: 'Comunicação', categoria: 'Competência' },
  { key: 'trabalhoEquipe', label: 'Trabalho em Equipe', categoria: 'Competência' },
  { key: 'adaptabilidade', label: 'Adaptabilidade', categoria: 'Competência' },
  { key: 'jobFitScore', label: 'Job Fit', categoria: 'Geral' }
] as const;

function getValorDimensao(candidato: CandidatoComparativo, key: string): number | undefined {
  if (key.startsWith('disc')) {
    const perfil = key.replace('disc', '') as 'D' | 'I' | 'S' | 'C';
    return candidato.discScores?.[perfil];
  }
  if (key === 'resiliencia') return candidato.resiliencia;
  if (key === 'jobFitScore') return candidato.jobFitScore;
  return candidato.competencias?.[key];
}

function getComparisonIcon(valor: number | undefined, melhorValor: number): React.ReactNode {
  if (valor === undefined) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (valor === melhorValor) return <Trophy className="h-4 w-4 text-warning" />;
  if (valor >= melhorValor - 10) return <ArrowUpRight className="h-4 w-4 text-success" />;
  if (valor >= melhorValor - 25) return <Equal className="h-4 w-4 text-muted-foreground" />;
  return <ArrowDownRight className="h-4 w-4 text-destructive" />;
}

function getProgressColor(valor: number): string {
  if (valor >= 80) return 'bg-success';
  if (valor >= 60) return 'bg-success/70';
  if (valor >= 40) return 'bg-warning';
  if (valor >= 20) return 'bg-warning/70';
  return 'bg-destructive';
}

export function CandidateComparison({ 
  candidatos, 
  vagaTitulo,
  onSelectWinner 
}: CandidateComparisonProps) {
  const [selectedTab, setSelectedTab] = useState<'geral' | 'disc' | 'competencias' | 'riscos'>('geral');

  if (candidatos.length < 2) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Selecione pelo menos 2 candidatos para comparar</p>
        </CardContent>
      </Card>
    );
  }

  // Calcular melhor valor para cada dimensão
  const melhoresValores: Record<string, number> = {};
  DIMENSOES_COMPARACAO.forEach(dim => {
    const valores = candidatos
      .map(c => getValorDimensao(c, dim.key))
      .filter((v): v is number => v !== undefined);
    melhoresValores[dim.key] = valores.length > 0 ? Math.max(...valores) : 0;
  });

  // Calcular ranking geral
  const ranking = candidatos
    .map(c => {
      let pontos = 0;
      DIMENSOES_COMPARACAO.forEach(dim => {
        const valor = getValorDimensao(c, dim.key);
        const melhor = melhoresValores[dim.key] ?? 0;
        if (valor === melhor) pontos += 2;
        else if (valor && valor >= melhor - 10) pontos += 1;
      });
      return { id: c.id, nome: c.nome, pontos };
    })
    .sort((a, b) => b.pontos - a.pontos);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Comparativo de Candidatos
        </CardTitle>
        <CardDescription>
          {vagaTitulo ? `Para a vaga: ${vagaTitulo}` : 'Comparação comportamental lado a lado'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
          <TabsList className="mb-4">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="disc">DISC</TabsTrigger>
            <TabsTrigger value="competencias">Competências</TabsTrigger>
            <TabsTrigger value="riscos">Riscos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="geral">
            <div className="space-y-6">
              {/* Ranking */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium mb-3">🏆 Ranking Geral</h4>
                <div className="flex gap-4 flex-wrap">
                  {ranking.map((r, idx) => (
                    <div 
                      key={r.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        idx === 0 ? 'bg-warning/15 border border-warning/30' : 'bg-background border'
                      }`}
                    >
                      <span className="font-bold">{idx + 1}º</span>
                      <span>{r.nome}</span>
                      <Badge variant="outline">{r.pontos} pts</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cards de candidatos */}
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {candidatos.map(candidato => (
                    <Card key={candidato.id} className="min-w-[280px] flex-shrink-0">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={candidato.foto} />
                            <AvatarFallback>
                              {candidato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{candidato.nome}</h4>
                            {candidato.discPrimario && (
                              <Badge 
                                variant="outline" 
                                className={DISC_PROFILES_INFO[candidato.discPrimario].cor.replace('bg-', 'border-')}
                              >
                                DISC: {candidato.discPrimario}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {candidato.jobFitScore !== undefined && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Job Fit</span>
                                <span className="font-medium">{candidato.jobFitScore}%</span>
                              </div>
                              <Progress value={candidato.jobFitScore} className="h-2" />
                            </div>
                          )}

                          {candidato.resiliencia !== undefined && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Resiliência</span>
                                <span className="font-medium">{candidato.resiliencia}%</span>
                              </div>
                              <Progress value={candidato.resiliencia} className="h-2" />
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Avaliações:</span>
                            <Badge variant="secondary">
                              {candidato.avaliacoesCompletadas.length} completas
                            </Badge>
                          </div>

                          {candidato.redFlags && candidato.redFlags.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{candidato.redFlags.length} alerta(s)</span>
                            </div>
                          )}
                        </div>

                        {onSelectWinner && (
                          <Button 
                            className="w-full mt-4" 
                            size="sm"
                            onClick={() => onSelectWinner(candidato.id)}
                          >
                            Selecionar
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>

          {/* DISC Comparison */}
          <TabsContent value="disc">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Dimensão</th>
                    {candidatos.map(c => (
                      <th key={c.id} className="text-center py-2 px-4 min-w-[120px]">
                        {c.nome.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DIMENSOES_COMPARACAO.filter(d => d.categoria === 'DISC').map(dim => (
                    <tr key={dim.key} className="border-b">
                      <td className="py-3 pr-4 font-medium">{dim.label}</td>
                      {candidatos.map(candidato => {
                        const valor = getValorDimensao(candidato, dim.key);
                        return (
                          <td key={candidato.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                      {getComparisonIcon(valor, melhoresValores[dim.key] ?? 0)}
                              <span className={valor === melhoresValores[dim.key] ? 'font-bold' : ''}>
                                {valor !== undefined ? `${valor}%` : '-'}
                              </span>
                            </div>
                            {valor !== undefined && (
                              <div className="mt-1">
                                <div 
                                  className={`h-1.5 rounded-full ${getProgressColor(valor)}`}
                                  style={{ width: `${valor}%` }}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Competências Comparison */}
          <TabsContent value="competencias">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Competência</th>
                    {candidatos.map(c => (
                      <th key={c.id} className="text-center py-2 px-4 min-w-[120px]">
                        {c.nome.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DIMENSOES_COMPARACAO.filter(d => d.categoria === 'Competência').map(dim => (
                    <tr key={dim.key} className="border-b">
                      <td className="py-3 pr-4 font-medium">{dim.label}</td>
                      {candidatos.map(candidato => {
                        const valor = getValorDimensao(candidato, dim.key);
                        return (
                          <td key={candidato.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                      {getComparisonIcon(valor, melhoresValores[dim.key] ?? 0)}
                              <span className={valor === melhoresValores[dim.key] ? 'font-bold' : ''}>
                                {valor !== undefined ? `${valor}%` : '-'}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Riscos Comparison */}
          <TabsContent value="riscos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidatos.map(candidato => (
                <Card key={candidato.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{candidato.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!candidato.redFlags || candidato.redFlags.length === 0) ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Nenhum risco identificado</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {candidato.redFlags.map((flag, idx) => {
                          const info = getRedFlagSeveridadeInfo(flag.severidade);
                          return (
                            <div 
                              key={idx} 
                              className={`p-2 rounded-lg text-sm border ${info.cor}`}
                            >
                              <div className="flex items-center gap-2 font-medium">
                                <AlertTriangle className="h-4 w-4" />
                                {flag.ruleName}
                              </div>
                              <p className="text-xs mt-1 opacity-80">{flag.mensagem}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
