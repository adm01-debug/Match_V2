/**
 * @fileoverview VagasUrgentes component with motion interactions
 * @module VagasUrgentes
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VagaUrgente } from "@/types/recruitment";
import { Eye, Kanban, Flame, AlertTriangle } from "lucide-react";
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
    <motion.div 
      data-testid="component"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
    >
      <Card role="article" aria-label="Vagas urgentes" className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame className="h-5 w-5 text-destructive" />
            </motion.div>
            <CardTitle className="text-base font-semibold">Vagas Urgentes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {vagas.map((vaga, index) => {
            const config = prioridadeConfig[vaga.prioridade];
            const PrioridadeIcon = config.icon;
            
            return (
              <motion.div
                key={vaga.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' as const, stiffness: 300 }}
                whileHover={{ 
                  y: -2,
                  boxShadow: '0 10px 30px -10px hsl(var(--destructive) / 0.15)',
                }}
                className="p-4 rounded-lg border bg-card transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{vaga.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vaga.quantidade} vaga{vaga.quantidade > 1 ? "s" : ""}
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge variant="outline" className={cn("shrink-0", config.className)}>
                      {PrioridadeIcon && <PrioridadeIcon className="h-3 w-3 mr-1" />}
                      {config.label}
                    </Badge>
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { value: vaga.candidatos, label: 'candidatos' },
                    { value: vaga.emProcesso, label: 'em processo' },
                    { value: `${vaga.diasAberta}d`, label: 'aberta', warning: vaga.diasAberta > 10 },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-2 rounded-md bg-muted/50"
                    >
                      <p className={cn(
                        "text-lg font-semibold",
                        stat.warning ? "text-warning" : "text-foreground"
                      )}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Ver
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Kanban className="h-3.5 w-3.5 mr-1" />
                      Pipeline
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

VagasUrgentes.displayName = "VagasUrgentes";

export default memo(VagasUrgentes);
