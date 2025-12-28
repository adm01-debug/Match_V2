/**
 * @fileoverview VagasUrgentes component
 * @module VagasUrgentes
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VagaUrgente } from "@/types/recruitment";
import { Eye, Edit, Kanban, Share2, Flame, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VagasUrgentesProps {
  vagas: VagaUrgente[];
}

const prioridadeConfig = {
  urgente: {
    label: "Urgente",
    icon: Flame,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  alta: {
    label: "Alta",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  media: {
    label: "Média",
    icon: null,
    className: "bg-info/10 text-info border-info/20",
  },
  baixa: {
    label: "Baixa",
    icon: null,
    className: "bg-muted text-muted-foreground",
  },
};

export function VagasUrgentes({ vagas }: VagasUrgentesProps) {
  return (
    <div data-testid="component">
      <Card role="article" aria-label="Vagas urgentes" className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base font-semibold">Vagas Urgentes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {vagas.map((vaga) => {
            const config = prioridadeConfig[vaga.prioridade];
            const PrioridadeIcon = config.icon;
            
            return (
              <div
                key={vaga.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{vaga.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vaga.quantidade} vaga{vaga.quantidade > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0", config.className)}>
                    {PrioridadeIcon && <PrioridadeIcon className="h-3 w-3 mr-1" />}
                    {config.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-lg font-semibold text-foreground">{vaga.candidatos}</p>
                    <p className="text-xs text-muted-foreground">candidatos</p>
                  </div>
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-lg font-semibold text-foreground">{vaga.emProcesso}</p>
                    <p className="text-xs text-muted-foreground">em processo</p>
                  </div>
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className={cn(
                      "text-lg font-semibold",
                      vaga.diasAberta > 10 ? "text-warning" : "text-foreground"
                    )}>
                      {vaga.diasAberta}d
                    </p>
                    <p className="text-xs text-muted-foreground">aberta</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Kanban className="h-3.5 w-3.5 mr-1" />
                    Pipeline
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

VagasUrgentes.displayName = "VagasUrgentes";

export default memo(VagasUrgentes);
