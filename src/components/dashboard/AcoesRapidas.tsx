import { memo , memo, useMemo} from 'react';
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
    <div data-testid="acoes-rapidas" role="region" aria-label="Ações rápidas" className="flex flex-wrap gap-3">
      {acoes.map((acao) => (
        <button type="button"
          key={acao.label}
          variant={acao.variant}
          asChild
          className={acao.variant === "default" ? "gap-2" : "gap-2"}
        >
          <Link to={acao.href}>
            <acao.icon className="h-4 w-4" />
            {acao.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
