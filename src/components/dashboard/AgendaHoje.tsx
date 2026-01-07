/**
 * @fileoverview AgendaHoje component with motion
 * @module AgendaHoje
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
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

function AgendaHojeComponent({ agenda }: AgendaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
    >
      <Card role="article" aria-label="Agenda de hoje" className="h-full">
        <CardHeader className="pb-4">
          <div data-testid="agenda-hoje" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring' as const, stiffness: 400 }}
              >
                <Calendar className="h-5 w-5 text-primary" />
              </motion.div>
              <CardTitle className="text-base font-semibold">Agenda do Dia</CardTitle>
            </div>
            <Badge variant="secondary" className="font-normal">
              {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {agenda.length === 0 ? (
            <motion.div 
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              </motion.div>
              <p>Nenhum compromisso hoje</p>
            </motion.div>
          ) : (
            agenda.map((item, index) => {
              const config = tipoConfig[item.tipo];
              const Icon = config.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 300 }}
                  whileHover={{ 
                    x: 4, 
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                  }}
                  className="flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <motion.span 
                      className="text-lg font-bold text-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 + 0.1 }}
                    >
                      {item.hora.split(":")[0]}
                    </motion.span>
                    <span className="text-xs text-muted-foreground">:{item.hora.split(":")[1]}</span>
                  </div>
                  
                  <div className="w-px bg-border" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div 
                        className={cn("rounded-md p-1", config.bgColor)}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                      </motion.div>
                      <span className="font-medium text-sm text-foreground truncate">
                        {item.titulo}
                      </span>
                    </div>
                    <p className="text-sm text-foreground truncate">{item.candidato}</p>
                    {item.local && (
                      <p className="text-xs text-muted-foreground truncate">{item.local}</p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

AgendaHojeComponent.displayName = "AgendaHoje";

export const AgendaHoje = memo(AgendaHojeComponent);
export default AgendaHoje;
