/**
 * @fileoverview Premium AcoesPendentes component
 * @module AcoesPendentes
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcaoPendente } from "@/types/recruitment";
import { AlertCircle, Clock, Calendar, ClipboardCheck, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AcoesPendentesProps {
  acoes: AcaoPendente[];
}

const tipoConfig = {
  feedback: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-gradient-to-br from-warning/20 to-warning/5",
    borderColor: "border-warning/30",
  },
  agendar: {
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-gradient-to-br from-info/20 to-info/5",
    borderColor: "border-info/30",
  },
  avaliar: {
    icon: ClipboardCheck,
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  proposta: {
    icon: FileText,
    color: "text-success",
    bgColor: "bg-gradient-to-br from-success/20 to-success/5",
    borderColor: "border-success/30",
  },
};

function AcoesPendentesComponent({ acoes }: AcoesPendentesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <Card variant="premium" hover="lift" role="article" aria-label="Ações pendentes" className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div data-testid="acoes-pendentes" className="flex items-center gap-3">
              <motion.div 
                className="p-2.5 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5"
                whileHover={{ scale: 1.05, rotate: -5 }}
              >
                <AlertCircle className="h-5 w-5 text-warning" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Ações Pendentes</CardTitle>
                <p className="text-xs text-muted-foreground">{acoes.length} itens para resolver</p>
              </div>
            </div>
            {acoes.some(a => a.alerta) && (
              <Badge variant="glow-warning" size="sm" className="animate-pulse">
                Urgente
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {acoes.map((acao, index) => {
            const config = tipoConfig[acao.tipo as keyof typeof tipoConfig] || tipoConfig.feedback;
            const Icon = config.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, type: 'spring' as const, stiffness: 300 }}
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                  config.bgColor,
                  config.borderColor,
                  acao.alerta && "ring-2 ring-warning/30"
                )}
              >
                <motion.div 
                  className={cn("rounded-xl p-2", config.bgColor)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="font-bold text-lg text-foreground"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1, type: 'spring' as const }}
                    >
                      {acao.quantidade}
                    </motion.span>
                    <span className="text-sm text-muted-foreground truncate">{acao.descricao}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {acao.alerta && (
                    <motion.div 
                      className="h-2.5 w-2.5 rounded-full bg-warning"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}

          {acoes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <motion.div 
                className="p-3 rounded-full bg-success/10 mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ClipboardCheck className="h-6 w-6 text-success" />
              </motion.div>
              <p className="font-medium text-foreground">Tudo em dia!</p>
              <p className="text-sm text-muted-foreground">Nenhuma ação pendente.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

AcoesPendentesComponent.displayName = "AcoesPendentes";

export const AcoesPendentes = memo(AcoesPendentesComponent);
export default AcoesPendentes;
