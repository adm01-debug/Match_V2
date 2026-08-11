/**
 * @module useVagas
 * @description Hook para gerenciar vagas
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vaga, VagaUrgente, StatusVaga, Prioridade, TipoContrato, Modalidade, PerguntaTriagem } from '@/types/recruitment';
import { Json } from '@/integrations/supabase/types';

interface VagaDB {
  id: string;
  titulo: string;
  departamento: string;
  gestor_nome: string | null;
  recrutador_nome: string | null;
  quantidade: number;
  tipo_contrato: string;
  modalidade: string;
  cidade: string | null;
  estado: string | null;
  salario_min: number | null;
  salario_max: number | null;
  salario_a_combinar: boolean;
  beneficios: string[] | null;
  descricao_empresa: string | null;
  responsabilidades: string | null;
  requisitos_obrigatorios: string | null;
  requisitos_desejaveis: string | null;
  perguntas_triagem: Json | null;
  skills_avaliacao: string[] | null;
  status: string;
  prioridade: string;
  data_criacao: string;
  data_publicacao: string | null;
  data_encerramento: string | null;
  total_candidatos: number;
  em_processo: number;
  contratados: number;
  created_at: string;
  updated_at: string;
}

function dbToVaga(row: VagaDB): Vaga {
  return {
    id: row.id,
    titulo: row.titulo,
    departamento: row.departamento,
    gestorId: '',
    gestorNome: row.gestor_nome || '',
    recrutadorId: '',
    recrutadorNome: row.recrutador_nome || '',
    quantidade: row.quantidade,
    tipoContrato: row.tipo_contrato as TipoContrato,
    modalidade: row.modalidade as Modalidade,
    cidade: row.cidade || '',
    estado: row.estado || '',
    salarioMin: row.salario_min || undefined,
    salarioMax: row.salario_max || undefined,
    salarioACombinar: row.salario_a_combinar,
    beneficios: row.beneficios || [],
    descricaoEmpresa: row.descricao_empresa || '',
    responsabilidades: row.responsabilidades || '',
    requisitosObrigatorios: row.requisitos_obrigatorios || '',
    requisitosDesejaveis: row.requisitos_desejaveis || '',
    perguntasTriagem: (row.perguntas_triagem as unknown as PerguntaTriagem[] | null) || [],
    skillsAvaliacao: row.skills_avaliacao || [],
    status: row.status as StatusVaga,
    prioridade: row.prioridade as Prioridade,
    dataCriacao: new Date(row.data_criacao),
    dataPublicacao: row.data_publicacao ? new Date(row.data_publicacao) : undefined,
    dataEncerramento: row.data_encerramento ? new Date(row.data_encerramento) : undefined,
    totalCandidatos: row.total_candidatos,
    emProcesso: row.em_processo,
    contratados: row.contratados,
  };
}

export function useVagas() {
  return useQuery({
    queryKey: ['vagas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .is('deleted_at', null)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return (data as unknown as VagaDB[]).map(dbToVaga);
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useVaga(id: string) {
  return useQuery({
    queryKey: ['vagas', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return dbToVaga(data as unknown as VagaDB);
    },
    placeholderData: undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useVagasSelect() {
  return useQuery({
    queryKey: ['vagas-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('id, titulo')
        .is('deleted_at', null)
        .in('status', ['publicada', 'em_selecao'])
        .order('titulo');

      if (error) throw error;
      return data as { id: string; titulo: string }[];
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useVagasUrgentes() {
  return useQuery({
    queryKey: ['vagas-urgentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .is('deleted_at', null)
        .in('prioridade', ['urgente', 'alta'])
        .in('status', ['publicada', 'em_selecao'])
        .order('prioridade')
        .limit(5);

      if (error) throw error;
      
      return (data as unknown as VagaDB[]).map((row): VagaUrgente => {
        const diasAberta = Math.floor(
          (new Date().getTime() - new Date(row.data_criacao).getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          id: row.id,
          titulo: row.titulo,
          candidatos: row.total_candidatos,
          emProcesso: row.em_processo,
          diasAberta,
          quantidade: row.quantidade,
          prioridade: row.prioridade as Prioridade,
        };
      });
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

interface CreateVagaInput {
  titulo: string;
  departamento: string;
  gestorNome?: string;
  recrutadorNome?: string;
  quantidade?: number;
  tipoContrato?: TipoContrato;
  modalidade?: Modalidade;
  cidade?: string;
  estado?: string;
  salarioMin?: number;
  salarioMax?: number;
  salarioACombinar?: boolean;
  beneficios?: string[];
  descricaoEmpresa?: string;
  responsabilidades?: string;
  requisitosObrigatorios?: string;
  requisitosDesejaveis?: string;
  perguntasTriagem?: PerguntaTriagem[];
  skillsAvaliacao?: string[];
  status?: string;
  prioridade?: string;
  dataPublicacao?: Date;
  totalCandidatos?: number;
  emProcesso?: number;
  contratados?: number;
}

export function useCreateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vaga: CreateVagaInput) => {
      const dbData = {
        titulo: vaga.titulo,
        departamento: vaga.departamento,
        gestor_nome: vaga.gestorNome,
        recrutador_nome: vaga.recrutadorNome,
        quantidade: vaga.quantidade,
        tipo_contrato: vaga.tipoContrato,
        modalidade: vaga.modalidade,
        cidade: vaga.cidade,
        estado: vaga.estado,
        salario_min: vaga.salarioMin,
        salario_max: vaga.salarioMax,
        salario_a_combinar: vaga.salarioACombinar,
        beneficios: vaga.beneficios,
        descricao_empresa: vaga.descricaoEmpresa,
        responsabilidades: vaga.responsabilidades,
        requisitos_obrigatorios: vaga.requisitosObrigatorios,
        requisitos_desejaveis: vaga.requisitosDesejaveis,
        perguntas_triagem: vaga.perguntasTriagem as unknown as Json,
        skills_avaliacao: vaga.skillsAvaliacao,
        status: vaga.status,
        prioridade: vaga.prioridade,
        data_publicacao: vaga.dataPublicacao?.toISOString(),
        total_candidatos: vaga.totalCandidatos,
        em_processo: vaga.emProcesso,
        contratados: vaga.contratados,
      };
      
      const { data, error } = await supabase
        .from('vagas')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      return dbToVaga(data as unknown as VagaDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-select'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-urgentes'] });
    },
  });
}

export function useUpdateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...vaga }: Partial<CreateVagaInput> & { id: string }) => {
      const dbData: Record<string, unknown> = {};
      
      if (vaga.titulo !== undefined) dbData['titulo'] = vaga.titulo;
      if (vaga.departamento !== undefined) dbData['departamento'] = vaga.departamento;
      if (vaga.gestorNome !== undefined) dbData['gestor_nome'] = vaga.gestorNome;
      if (vaga.recrutadorNome !== undefined) dbData['recrutador_nome'] = vaga.recrutadorNome;
      if (vaga.quantidade !== undefined) dbData['quantidade'] = vaga.quantidade;
      if (vaga.tipoContrato !== undefined) dbData['tipo_contrato'] = vaga.tipoContrato;
      if (vaga.modalidade !== undefined) dbData['modalidade'] = vaga.modalidade;
      if (vaga.cidade !== undefined) dbData['cidade'] = vaga.cidade;
      if (vaga.estado !== undefined) dbData['estado'] = vaga.estado;
      if (vaga.salarioMin !== undefined) dbData['salario_min'] = vaga.salarioMin;
      if (vaga.salarioMax !== undefined) dbData['salario_max'] = vaga.salarioMax;
      if (vaga.salarioACombinar !== undefined) dbData['salario_a_combinar'] = vaga.salarioACombinar;
      if (vaga.beneficios !== undefined) dbData['beneficios'] = vaga.beneficios;
      if (vaga.descricaoEmpresa !== undefined) dbData['descricao_empresa'] = vaga.descricaoEmpresa;
      if (vaga.responsabilidades !== undefined) dbData['responsabilidades'] = vaga.responsabilidades;
      if (vaga.requisitosObrigatorios !== undefined) dbData['requisitos_obrigatorios'] = vaga.requisitosObrigatorios;
      if (vaga.requisitosDesejaveis !== undefined) dbData['requisitos_desejaveis'] = vaga.requisitosDesejaveis;
      if (vaga.perguntasTriagem !== undefined) dbData['perguntas_triagem'] = vaga.perguntasTriagem as unknown as Json;
      if (vaga.skillsAvaliacao !== undefined) dbData['skills_avaliacao'] = vaga.skillsAvaliacao;
      if (vaga.status !== undefined) dbData['status'] = vaga.status;
      if (vaga.prioridade !== undefined) dbData['prioridade'] = vaga.prioridade;
      if (vaga.dataPublicacao !== undefined) dbData['data_publicacao'] = vaga.dataPublicacao?.toISOString();
      if (vaga.totalCandidatos !== undefined) dbData['total_candidatos'] = vaga.totalCandidatos;
      if (vaga.emProcesso !== undefined) dbData['em_processo'] = vaga.emProcesso;
      if (vaga.contratados !== undefined) dbData['contratados'] = vaga.contratados;
      
      const { data, error } = await supabase
        .from('vagas')
        .update(dbData as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return dbToVaga(data as unknown as VagaDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-select'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-urgentes'] });
    },
  });
}

export function useDeleteVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vagas')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-select'] });
      queryClient.invalidateQueries({ queryKey: ['vagas-urgentes'] });
    },
  });
}

export type UseVagasReturn = ReturnType<typeof useVagas>;
