/**
 * @module components/dashboard/SlaAlertBanner
 * @description Alerta proativo de SLA de primeira resposta (48h).
 *
 * Regra de exibição: o banner só aparece quando existe fila real de atraso
 * (`aguardando_agora > 0`). Silêncio é sinal de saúde — evitamos ruído
 * permanente no dashboard, que treinaria o usuário a ignorar o alerta.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useFunnelSla } from "@/hooks/useFunnelSla";

const SLA_HORAS = 48;
const JANELA_DIAS = 30;
const MAX_VAGAS_LISTADAS = 3;

export function SlaAlertBanner() {
  const { data, isLoading, isError } = useFunnelSla({ dias: JANELA_DIAS, slaHoras: SLA_HORAS });

  const resumo = useMemo(() => {
    const linhas = (data ?? []).filter((l) => l.aguardando_agora > 0);
    const total = linhas.reduce((acc, l) => acc + l.aguardando_agora, 0);
    const topo = [...linhas]
      .sort((a, b) => b.aguardando_agora - a.aguardando_agora)
      .slice(0, MAX_VAGAS_LISTADAS);
    return { total, topo, vagasAfetadas: linhas.length };
  }, [data]);

  // Erro de SLA não é bloqueante: o dashboard segue útil sem o alerta.
  if (isLoading || isError || resumo.total === 0) return null;

  return (
    <Alert variant="destructive" role="status" aria-live="polite">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>
        {resumo.total} {resumo.total === 1 ? "candidatura sem resposta" : "candidaturas sem resposta"} há mais de {SLA_HORAS}h
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm">
          {resumo.vagasAfetadas === 1 ? "1 vaga afetada" : `${resumo.vagasAfetadas} vagas afetadas`}:{" "}
          {resumo.topo.map((l) => `${l.vaga_titulo} (${l.aguardando_agora})`).join(" · ")}
          {resumo.vagasAfetadas > resumo.topo.length ? " e outras" : ""}.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/analytics">
            Ver fila de atrasadas
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
