import { useEffect, useMemo, useState } from "react";
import {
  COMPETENCIAS_COMPORTAMENTAIS,
  COMPETENCIAS_TECNICAS,
  useAvaliacao,
  useAvaliacoes,
} from "@/hooks/useAvaliacoes";
import type { NotaCompetencia } from "@/components/avaliacao/CompetenciasList";

type NotaValida = 1 | 2 | 3 | 4 | 5;

export interface UseAvaliacaoFormArgs {
  id?: string;
  processoIdInicial?: string;
}

export function useAvaliacaoForm({ id, processoIdInicial }: UseAvaliacaoFormArgs) {
  const isEditing = !!id;
  const { data: avaliacaoExistente, isLoading: loadingAvaliacao } = useAvaliacao(id);
  const { createAvaliacao, salvarRascunho, finalizarAvaliacao, isCreating, isUpdating } =
    useAvaliacoes();

  const [processoId, setProcessoId] = useState<string>(processoIdInicial || "");
  const [notasTecnicas, setNotasTecnicas] = useState<NotaCompetencia[]>(
    COMPETENCIAS_TECNICAS.map((c) => ({ ...c, nota: 5 }))
  );
  const [notasComportamentais, setNotasComportamentais] = useState<NotaCompetencia[]>(
    COMPETENCIAS_COMPORTAMENTAIS.map((c) => ({ ...c, nota: 5 }))
  );
  const [pontosFortes, setPontosFortes] = useState("");
  const [pontosDesenvolvimento, setPontosDesenvolvimento] = useState("");
  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [parecer, setParecer] = useState<string>("em_duvida");
  const [recomendacao, setRecomendacao] = useState("");

  useEffect(() => {
    if (!avaliacaoExistente) return;
    setProcessoId(avaliacaoExistente.processo_id);
    if (avaliacaoExistente.notas_tecnicas) {
      setNotasTecnicas(avaliacaoExistente.notas_tecnicas as unknown as NotaCompetencia[]);
    }
    if (avaliacaoExistente.notas_comportamentais) {
      setNotasComportamentais(
        avaliacaoExistente.notas_comportamentais as unknown as NotaCompetencia[]
      );
    }
    setPontosFortes(avaliacaoExistente.pontos_fortes || "");
    setPontosDesenvolvimento(avaliacaoExistente.pontos_desenvolvimento || "");
    setObservacoesGerais(avaliacaoExistente.observacoes_gerais || "");
    setParecer(avaliacaoExistente.parecer || "em_duvida");
    setRecomendacao(avaliacaoExistente.recomendacao || "");
  }, [avaliacaoExistente]);

  const { mediaTecnica, mediaComportamental, mediaGeral } = useMemo(() => {
    const mt = notasTecnicas.reduce((acc, n) => acc + n.nota, 0) / notasTecnicas.length;
    const mc =
      notasComportamentais.reduce((acc, n) => acc + n.nota, 0) / notasComportamentais.length;
    return { mediaTecnica: mt, mediaComportamental: mc, mediaGeral: (mt + mc) / 2 };
  }, [notasTecnicas, notasComportamentais]);

  const handleNotaChange = (
    tipo: "tecnica" | "comportamental",
    compId: string,
    nota: number
  ) => {
    if (tipo === "tecnica") {
      setNotasTecnicas((prev) => prev.map((n) => (n.id === compId ? { ...n, nota } : n)));
    } else {
      setNotasComportamentais((prev) =>
        prev.map((n) => (n.id === compId ? { ...n, nota } : n))
      );
    }
  };

  const buildPayload = () => ({
    processo_id: processoId,
    etapa: "avaliacao" as const,
    notas_tecnicas: notasTecnicas as unknown as {
      competenciaId: string;
      nota: NotaValida;
      observacao?: string;
    }[],
    notas_comportamentais: notasComportamentais as unknown as {
      competenciaId: string;
      nota: NotaValida;
      observacao?: string;
    }[],
    nota_geral: mediaGeral * 10,
    pontos_fortes: pontosFortes,
    pontos_desenvolvimento: pontosDesenvolvimento,
    observacoes_gerais: observacoesGerais,
  });

  return {
    isEditing,
    loading: loadingAvaliacao,
    saving: isCreating || isUpdating,
    processoId,
    setProcessoId,
    notasTecnicas,
    notasComportamentais,
    pontosFortes,
    setPontosFortes,
    pontosDesenvolvimento,
    setPontosDesenvolvimento,
    observacoesGerais,
    setObservacoesGerais,
    parecer,
    setParecer,
    recomendacao,
    setRecomendacao,
    mediaTecnica,
    mediaComportamental,
    mediaGeral,
    handleNotaChange,
    createAvaliacao,
    salvarRascunho,
    finalizarAvaliacao,
    buildPayload,
  };
}
