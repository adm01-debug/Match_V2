/**
 * @module useHiringManagerData
 * @description Dados reais do Portal do Gestor (Etapa 35): vagas, candidatos em processo
 * e entrevistas agendadas, mapeados para os tipos usados pelos componentes do portal.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  ManagerVaga,
  ManagerCandidato,
  ManagerEntrevista,
} from '@/components/hiring-manager/hiringManagerMockData';

const diasDesde = (iso: string | null): number => {
  if (!iso) return 0;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
};

const ETAPA_LABEL: Record<string, string> = {
  novo: 'Novo',
  em_triagem: 'Em Triagem',
  pre_selecao: 'Pré-seleção',
  entrevista_rh: 'Entrevista RH',
  teste_tecnico: 'Teste Técnico',
  entrevista_gestor: 'Entrevista Gestor',
  entrevista_final: 'Entrevista Final',
  aprovado: 'Aprovado',
  proposta_enviada: 'Proposta Enviada',
  contratado: 'Contratado',
  reprovado: 'Reprovado',
  banco_talentos: 'Banco de Talentos',
};

export interface HiringManagerData {
  vagas: ManagerVaga[];
  candidatos: ManagerCandidato[];
  entrevistas: ManagerEntrevista[];
}

export function useHiringManagerData() {
  return useQuery({
    queryKey: ['hiring-manager-data'],
    queryFn: async (): Promise<HiringManagerData> => {
      const [vagasRes, processosRes, entrevistasRes] = await Promise.all([
        supabase
          .from('vagas')
          .select(
            'id, titulo, departamento, status, total_candidatos, em_processo, contratados, quantidade, prioridade, data_publicacao, created_at',
          )
          .is('deleted_at', null)
          .in('status', ['publicada', 'pausada'])
          .order('created_at', { ascending: false }),
        supabase
          .from('processos_seletivos')
          .select(
            'id, candidato_nome, candidato_foto, vaga_titulo, etapa_atual, match_score, dias_na_etapa, data_ultima_movimentacao',
          )
          .is('deleted_at', null)
          .not('etapa_atual', 'in', '("contratado","reprovado","banco_talentos")')
          .order('match_score', { ascending: false })
          .limit(50),
        supabase
          .from('entrevistas')
          .select('id, candidato_nome, vaga_titulo, data, hora_inicio, tipo, status')
          .is('deleted_at', null)
          .gte('data', new Date().toISOString().slice(0, 10))
          .order('data', { ascending: true })
          .limit(20),
      ]);

      if (vagasRes.error) throw vagasRes.error;
      if (processosRes.error) throw processosRes.error;
      if (entrevistasRes.error) throw entrevistasRes.error;

      const vagas: ManagerVaga[] = (vagasRes.data ?? []).map((v) => ({
        id: v.id,
        titulo: v.titulo,
        departamento: v.departamento ?? 'Não informado',
        status: v.status ?? 'publicada',
        totalCandidatos: v.total_candidatos ?? 0,
        emProcesso: v.em_processo ?? 0,
        contratados: v.contratados ?? 0,
        diasAberta: diasDesde(v.data_publicacao ?? v.created_at),
        urgente: v.prioridade === 'urgente' || v.prioridade === 'alta',
        meta: v.quantidade ?? 1,
      }));

      const candidatos: ManagerCandidato[] = (processosRes.data ?? []).map((p) => ({
        id: p.id,
        nome: p.candidato_nome,
        foto: p.candidato_foto ?? undefined,
        vaga: p.vaga_titulo ?? '—',
        etapa: ETAPA_LABEL[p.etapa_atual ?? 'novo'] ?? p.etapa_atual ?? 'Novo',
        matchScore: p.match_score ?? 0,
        diasNaEtapa: p.dias_na_etapa ?? diasDesde(p.data_ultima_movimentacao),
        avaliacao: 'pendente',
      }));

      const entrevistas: ManagerEntrevista[] = (entrevistasRes.data ?? []).map((e) => ({
        id: e.id,
        candidato: e.candidato_nome ?? '—',
        vaga: e.vaga_titulo ?? '—',
        data: new Date(`${e.data}T00:00:00`),
        hora: (e.hora_inicio ?? '').slice(0, 5),
        tipo: e.tipo ?? 'Entrevista',
        status: (e.status as ManagerEntrevista['status']) ?? 'agendada',
      }));

      return { vagas, candidatos, entrevistas };
    },
    staleTime: 2 * 60 * 1000,
  });
}
