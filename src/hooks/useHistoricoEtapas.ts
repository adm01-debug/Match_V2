import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HistoricoEtapa {
  id: string;
  processo_seletivo_id: string;
  etapa_anterior: string | null;
  etapa_nova: string;
  motivo: string | null;
  responsavel_id: string | null;
  created_at: string;
}

interface HistoricoEtapaInsert {
  processo_seletivo_id: string;
  etapa_anterior?: string | null;
  etapa_nova: string;
  motivo?: string | null;
  responsavel_id?: string | null;
}

// Simular histórico a partir dos processos seletivos (até a tabela ser criada)
export function useHistoricoEtapas(processoSeletivoId?: string) {
  const { toast } = useToast();
  const [historico, setHistorico] = useState<HistoricoEtapa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRegistrando, setIsRegistrando] = useState(false);

  const fetchHistorico = useCallback(async () => {
    setIsLoading(true);
    try {
      // Como a tabela historico_etapas não existe, vamos simular a partir dos processos
      if (processoSeletivoId) {
        const { data: processo } = await supabase
          .from('processos_seletivos')
          .select('*')
          .eq('id', processoSeletivoId)
          .single();

        if (processo) {
          // Criar um "histórico" baseado na etapa atual
          setHistorico([{
            id: crypto.randomUUID(),
            processo_seletivo_id: processo.id,
            etapa_anterior: null,
            etapa_nova: processo.etapa_atual,
            motivo: null,
            responsavel_id: null,
            created_at: processo.data_ultima_movimentacao,
          }]);
        }
      } else {
        setHistorico([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar histórico'));
    } finally {
      setIsLoading(false);
    }
  }, [processoSeletivoId]);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  const registrarMudancaEtapa = async (dados: HistoricoEtapaInsert): Promise<HistoricoEtapa> => {
    setIsRegistrando(true);
    try {
      // Atualizar o processo seletivo com a nova etapa
      const { error: updateError } = await supabase
        .from('processos_seletivos')
        .update({
          etapa_atual: dados.etapa_nova,
          data_ultima_movimentacao: new Date().toISOString(),
        })
        .eq('id', dados.processo_seletivo_id);

      if (updateError) throw updateError;

      const novoRegistro: HistoricoEtapa = {
        id: crypto.randomUUID(),
        processo_seletivo_id: dados.processo_seletivo_id,
        etapa_anterior: dados.etapa_anterior || null,
        etapa_nova: dados.etapa_nova,
        motivo: dados.motivo || null,
        responsavel_id: dados.responsavel_id || null,
        created_at: new Date().toISOString(),
      };

      setHistorico(prev => [novoRegistro, ...prev]);
      toast({ title: 'Etapa atualizada com sucesso!' });
      
      return novoRegistro;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar mudança';
      toast({
        title: 'Erro ao registrar mudança',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsRegistrando(false);
    }
  };

  return {
    historico,
    isLoading,
    error,
    registrarMudancaEtapa,
    isRegistrando,
  };
}

export default useHistoricoEtapas;
