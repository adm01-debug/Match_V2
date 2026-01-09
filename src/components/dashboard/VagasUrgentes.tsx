/**
 * @fileoverview Premium VagasUrgentes component
 * @module VagasUrgentes
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VagaUrgente } from "@/types/recruitment";
import { Eye, Kanban, Flame, AlertTriangle, Clock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface VagasUrgentesProps {
  vagas: VagaUrgente[];
}

const prioridadeConfig = {
  urgente: {
    label: "Urgente",
    icon: Flame,
    className: "bg-destructive/10 text-destructive border-destructive/30",
    glowClass: "shadow-[0_0_12px_-3px_hsl(var(--destructive)/0.4)]",
  },
  alta: {
    label: "Alta",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/30",
    glowClass: "shadow-[0_0_12px_-3px_hsl(var(--warning)/0.4)]",
  },
  media: {
    label: "Média",
    icon: null,
    className: "bg-info/10 text-info border-info/30",
    glowClass: "",
  },
  baixa: {
    label: "Baixa",
    icon: null,
    className: "bg-muted text-muted-foreground border-border",
    glowClass: "",
  },
};

export function VagasUrgentes({ vagas }: VagasUrgentesProps) {
  return (
    <motion.div 
      data-testid="component"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card role="article" aria-label="Vagas urgentes" className="h-full border-border/50 shadow-elevated overflow-hidden">
        {/* Header accent line */}
        <div className="h-1 bg-gradient-to-r from-destructive via-warning to-destructive" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="p-2 rounded-xl bg-destructive/10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="h-5 w-5 text-destructive" />
              </motion.div>
              <CardTitle className="text-base font-semibold">Vagas Urgentes</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
              {vagas.length} ativas
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {vagas.length === 0 ? (
            <motion.div 
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="p-4 rounded-full bg-success/10 w-fit mx-auto mb-3">
                <Flame className="h-8 w-8 text-success" />
              </div>
              <p className="font-medium">Sem vagas urgentes!</p>
              <p className="text-sm">Todas as vagas estão sob controle</p>
            </motion.div>
          ) : (
            vagas.map((vaga, index) => {
              const config = prioridadeConfig[vaga.prioridade];
              const PrioridadeIcon = config.icon;
              
              return (
                <motion.div
                  key={vaga.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                  className={cn(
                    "group relative p-4 rounded-xl border bg-card transition-all duration-300",
                    "hover:shadow-elevated hover:-translate-y-0.5",
                    config.glowClass
                  )}
                >
                  {/* Priority indicator bar */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                    vaga.prioridade === 'urgente' ? 'bg-destructive' :
                    vaga.prioridade === 'alta' ? 'bg-warning' :
                    vaga.prioridade === 'media' ? 'bg-info' : 'bg-muted'
                  )} />
                  
                  <div className="flex items-start justify-between gap-2 mb-3 pl-2">
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {vaga.titulo}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {vaga.quantidade} vaga{vaga.quantidade > 1 ? "s" : ""} abertas
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0 font-medium", config.className)}>
                      {PrioridadeIcon && <PrioridadeIcon className="h-3 w-3 mr-1" />}
                      {config.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 pl-2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="text-center p-2.5 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <p className="text-lg font-bold text-primary">{vaga.candidatos}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Candidatos</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="text-center p-2.5 rounded-lg bg-accent/5 border border-accent/10"
                    >
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Kanban className="h-3.5 w-3.5 text-accent" />
                        <p className="text-lg font-bold text-accent">{vaga.emProcesso}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Em Processo</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={cn(
                        "text-center p-2.5 rounded-lg border",
                        vaga.diasAberta > 10 
                          ? "bg-warning/5 border-warning/20" 
                          : "bg-muted/50 border-border"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Clock className={cn("h-3.5 w-3.5", vaga.diasAberta > 10 ? "text-warning" : "text-muted-foreground")} />
                        <p className={cn(
                          "text-lg font-bold",
                          vaga.diasAberta > 10 ? "text-warning" : "text-foreground"
                        )}>
                          {vaga.diasAberta}d
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aberta</p>
                    </motion.div>
                  </div>

                  <div className="flex gap-2 pl-2">
                    <Button variant="outline" size="sm" className="flex-1 group/btn" asChild>
                      <Link to={`/vagas/${vaga.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Ver Detalhes
                        <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/pipeline?vaga=${vaga.id}`}>
                        <Kanban className="h-3.5 w-3.5 mr-1.5" />
                        Pipeline
                      </Link>
                    </Button>
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

VagasUrgentes.displayName = "VagasUrgentes";

export default memo(VagasUrgentes);
