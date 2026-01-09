/**
 * @fileoverview Premium AcoesRapidas component
 * @module AcoesRapidas
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3, Briefcase, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const acoes = [
  {
    label: "Nova Vaga",
    description: "Criar nova posição",
    icon: Plus,
    href: "/vagas/nova",
    primary: true,
    gradient: "from-primary to-primary/80",
  },
  {
    label: "Banco de Talentos",
    description: "Gerenciar candidatos",
    icon: Users,
    href: "/talentos",
    primary: false,
  },
  {
    label: "Relatórios",
    description: "Análises e métricas",
    icon: BarChart3,
    href: "/relatorios",
    primary: false,
  },
  {
    label: "Todas as Vagas",
    description: "Ver posições abertas",
    icon: Briefcase,
    href: "/vagas",
    primary: false,
  },
];

export function AcoesRapidas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="border-border/50 shadow-elevated overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div 
            data-testid="acoes-rapidas" 
            role="region" 
            aria-label="Ações rápidas" 
            className="grid grid-cols-2 gap-3"
          >
            {acoes.map((acao, index) => (
              <motion.div
                key={acao.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 400 }}
              >
                {acao.primary ? (
                  <Link to={acao.href} className="block">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative overflow-hidden rounded-xl p-4 h-full",
                        "bg-gradient-to-br", acao.gradient,
                        "text-white shadow-glow cursor-pointer"
                      )}
                    >
                      {/* Decorative circles */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                      <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/5" />
                      
                      <div className="relative">
                        <div className="p-2 rounded-lg bg-white/20 w-fit mb-3">
                          <acao.icon className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-sm">{acao.label}</p>
                        <p className="text-xs text-white/70">{acao.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="h-auto p-4 flex-col items-start gap-2 w-full border-border/50 hover:border-primary/30 hover:bg-primary/5 group"
                  >
                    <Link to={acao.href}>
                      <div className="flex items-center justify-between w-full">
                        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                          <acao.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                      <div className="text-left w-full">
                        <p className="font-medium text-sm text-foreground">{acao.label}</p>
                        <p className="text-xs text-muted-foreground">{acao.description}</p>
                      </div>
                    </Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

AcoesRapidas.displayName = "AcoesRapidas";

export default memo(AcoesRapidas);
