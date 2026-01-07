/**
 * @fileoverview AcoesRapidas component with motion
 * @module AcoesRapidas
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export function AcoesRapidas() {
  const acoes = [
    {
      label: "Nova Vaga",
      icon: Plus,
      href: "/vagas/nova",
      variant: "default" as const,
    },
    {
      label: "Banco de Talentos",
      icon: Users,
      href: "/talentos",
      variant: "outline" as const,
    },
    {
      label: "Relatórios",
      icon: BarChart3,
      href: "/relatorios",
      variant: "outline" as const,
    },
    {
      label: "Todas as Vagas",
      icon: Briefcase,
      href: "/vagas",
      variant: "outline" as const,
    },
  ];

  return (
    <motion.div 
      data-testid="acoes-rapidas" 
      role="region" 
      aria-label="Ações rápidas" 
      className="flex flex-wrap gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
    >
      {acoes.map((acao, index) => (
        <motion.div
          key={acao.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 400 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="button"
            variant={acao.variant}
            asChild
            className="gap-2"
          >
            <Link to={acao.href}>
              <acao.icon className="h-4 w-4" />
              {acao.label}
            </Link>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}

AcoesRapidas.displayName = "AcoesRapidas";

export default memo(AcoesRapidas);
