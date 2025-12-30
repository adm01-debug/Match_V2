/**
 * @fileoverview HistoricoTab component
 * @module HistoricoTab
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { History, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoricoTabProps {
  candidato: CandidatoPerfil;
}

type HistoricoEvento = {
  id: string;
  data: string;
  hora: string;
  tipo: string;
  tipoIcon: string;
  descricao: string;
  detalhes?: string | null;
  usuario?: string | null;
};

export function HistoricoTab({ candidato }: HistoricoTabProps) {
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'candidatura':
        return 'bg-primary text-primary-foreground';
      case 'triagem':
        return 'bg-blue-500 text-white';
      case 'entrevista':
        return 'bg-purple-500 text-white';
      case 'teste':
        return 'bg-pink-500 text-white';
      case 'avaliacao':
        return 'bg-success text-success-foreground';
      case 'mudanca_etapa':
        return 'bg-warning text-warning-foreground';
      case 'comunicacao':
        return 'bg-cyan-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const historico = (Array.isArray((candidato as any).historico)
    ? (candidato as any).historico
    : []) as HistoricoEvento[];

  // Agrupar eventos por data
  const eventosPorData = historico.reduce((acc, evento) => {
    if (!acc[evento.data]) acc[evento.data] = [];
    acc[evento.data]!.push(evento);
    return acc;
  }, {} as Record<string, HistoricoEvento[]>);

  const eventosEntries = Object.entries(eventosPorData) as [string, HistoricoEvento[]][];

  return (
    <div data-testid="component" className="space-y-6">
      <Card role="article" aria-label="Histórico">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Timeline do Candidato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {eventosEntries.map(([data, eventos]) => (
                <div key={data} className="relative">
                  {/* Data badge */}
                  <div className="sticky top-0 z-10 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{data.split('/')[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground bg-background px-2">
                      {data}
                    </span>
                  </div>

                  {/* Eventos do dia */}
                  <div className="ml-12 space-y-4">
                    {eventos.map((evento) => (
                      <div
                        key={evento.id}
                        className="relative p-4 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            'absolute -left-[2.85rem] top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs',
                            getTipoColor(evento.tipo)
                          )}
                        >
                          {evento.tipoIcon}
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{evento.hora}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium text-foreground">{evento.descricao}</span>
                            </div>
                            {evento.detalhes && (
                              <p className="text-sm text-muted-foreground mt-1">{evento.detalhes}</p>
                            )}
                          </div>
                          {evento.usuario && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {evento.usuario}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Processo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-3xl font-bold text-primary">{historico.length}</p>
              <p className="text-sm text-muted-foreground">Total de Eventos</p>
            </div>
            <div className="text-center p-4 bg-purple-500/5 rounded-lg">
              <p className="text-3xl font-bold text-purple-500">
                {historico.filter((e) => e.tipo === 'entrevista').length}
              </p>
              <p className="text-sm text-muted-foreground">Entrevistas</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <p className="text-3xl font-bold text-success">
                {historico.filter((e) => e.tipo === 'avaliacao').length}
              </p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </div>
            <div className="text-center p-4 bg-cyan-500/5 rounded-lg">
              <p className="text-3xl font-bold text-cyan-500">
                {historico.filter((e) => e.tipo === 'comunicacao').length}
              </p>
              <p className="text-sm text-muted-foreground">Comunicações</p>
            </div>
          </div>

          {/* Tempo no processo */}
          <div className="mt-4 p-4 bg-warning/5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo no processo</p>
              <p className="text-lg font-semibold text-warning">6 dias</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Data de entrada</p>
              <p className="text-lg font-semibold text-foreground">{candidato.dataCadastro || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

HistoricoTab.displayName = "HistoricoTab";

export default memo(HistoricoTab);
