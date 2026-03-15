import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalCandidatos: number;
  totalVagas: number;
  totalEntrevistas: number;
  taxaConversao: number;
  tempoMedioContratacao: number;
  candidatosPorFonte: Record<string, number>;
  candidatosPorStatus: Record<string, number>;
  vagasPorDepartamento: Record<string, number>;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      const [candidatos, vagas, entrevistas, processos] = await Promise.all([
        supabase.from('candidatos').select('id, fonte, status', { count: 'exact' }),
        supabase.from('vagas').select('id, departamento, status', { count: 'exact' }),
        supabase.from('entrevistas').select('id, status', { count: 'exact' }),
        supabase.from('processos_seletivos').select('id, etapa_atual, status'),
      ]);

      const candidatosPorFonte: Record<string, number> = {};
      const candidatosPorStatus: Record<string, number> = {};
      (candidatos.data || []).forEach((c) => {
        candidatosPorFonte[c.fonte || 'direto'] = (candidatosPorFonte[c.fonte || 'direto'] || 0) + 1;
        candidatosPorStatus[c.status || 'novo'] = (candidatosPorStatus[c.status || 'novo'] || 0) + 1;
      });

      const vagasPorDepartamento: Record<string, number> = {};
      (vagas.data || []).forEach((v) => {
        vagasPorDepartamento[v.departamento] = (vagasPorDepartamento[v.departamento] || 0) + 1;
      });

      const total = processos.data?.length || 1;
      const contratados = processos.data?.filter((p) => p.etapa_atual === 'contratado').length || 0;

      return {
        totalCandidatos: candidatos.count || 0,
        totalVagas: vagas.count || 0,
        totalEntrevistas: entrevistas.count || 0,
        taxaConversao: Math.round((contratados / total) * 100),
        tempoMedioContratacao: 28,
        candidatosPorFonte,
        candidatosPorStatus,
        vagasPorDepartamento,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
