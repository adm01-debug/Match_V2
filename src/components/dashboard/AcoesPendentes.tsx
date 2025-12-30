/**
 * @fileoverview AcoesPendentes component
 * @module AcoesPendentes
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AcaoPendente } from "@/types/recruitment";
import { AlertCircle, Clock, Calendar, ClipboardCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AcoesPendentesProps {
  acoes: AcaoPendente[];
}

const tipoConfig = {
  feedback: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  agendar: {
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  avaliar: {
    icon: ClipboardCheck,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  proposta: {
    icon: FileText,
    color: "text-success",
    bgColor: "bg-success/10",
  },
};

export function AcoesPendentes({ acoes }: AcoesPendentesProps) {
  return (
    <Card role="article" aria-label="Ações pendentes" className="h-full">
      <CardHeader className="pb-4">
        <div data-testid="acoes-pendentes" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          <CardTitle className="text-base font-semibold">Ações Pendentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {acoes.map((acao, index) => {
          const config = tipoConfig[acao.tipo];
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                acao.alerta 
                  ? "border-warning/30 bg-warning/5 hover:bg-warning/10" 
                  : "hover:bg-muted/50"
              )}
            >
              <div className={cn("rounded-lg p-2", config.bgColor)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{acao.quantidade}</span>
                  <span className="text-sm text-muted-foreground truncate">{acao.descricao}</span>
                </div>
              </div>
              {acao.alerta && (
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse-soft" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


AcoesPendentes.displayName = "AcoesPendentes";