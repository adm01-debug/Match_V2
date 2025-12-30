/**
 * @fileoverview AgendaHoje component
 * @module AgendaHoje
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgendaDia } from "@/types/recruitment";
import { Calendar, Video, ClipboardCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgendaProps {
  agenda: AgendaDia[];
}

const tipoConfig = {
  entrevista: {
    icon: Video,
    color: "text-primary",
    bgColor: "bg-primary/10",
    badge: "Entrevista",
    badgeClass: "bg-primary/10 text-primary",
  },
  teste: {
    icon: ClipboardCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    badge: "Teste",
    badgeClass: "bg-accent/10 text-accent",
  },
  reuniao: {
    icon: Users,
    color: "text-success",
    bgColor: "bg-success/10",
    badge: "Reunião",
    badgeClass: "bg-success/10 text-success",
  },
};

export function AgendaHoje({ agenda }: AgendaProps) {
  return (
    <Card role="article" aria-label="Agenda de hoje" className="h-full">
      <CardHeader className="pb-4">
        <div data-testid="agenda-hoje" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">Agenda do Dia</CardTitle>
          </div>
          <Badge variant="secondary" className="font-normal">
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agenda.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum compromisso hoje</p>
          </div>
        ) : (
          agenda.map((item) => {
            const config = tipoConfig[item.tipo];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-foreground">{item.hora.split(":")[0]}</span>
                  <span className="text-xs text-muted-foreground">:{item.hora.split(":")[1]}</span>
                </div>
                
                <div className="w-px bg-border" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("rounded-md p-1", config.bgColor)}>
                      <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>
                    <span className="font-medium text-sm text-foreground truncate">
                      {item.titulo}
                    </span>
                  </div>
                  <p className="text-sm text-foreground truncate">{item.candidato}</p>
                  {item.local && (
                    <p className="text-xs text-muted-foreground truncate">{item.local}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}


AgendaHoje.displayName = "AgendaHoje";