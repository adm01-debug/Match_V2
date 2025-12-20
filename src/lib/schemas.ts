import { z } from 'zod';

// Schema para Vaga
export const vagaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  nivel: z.string().min(1, 'Nível é obrigatório'),
  tipo_contrato: z.string().min(1, 'Tipo de contrato é obrigatório'),
  modalidade: z.string().min(1, 'Modalidade é obrigatória'),
  local: z.string().optional(),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  requisitos: z.string().min(10, 'Requisitos devem ter pelo menos 10 caracteres'),
  beneficios: z.string().optional(),
  faixa_salarial_min: z.number().min(0, 'Salário mínimo deve ser positivo').optional(),
  faixa_salarial_max: z.number().min(0, 'Salário máximo deve ser positivo').optional(),
  quantidade_vagas: z.number().min(1, 'Quantidade deve ser pelo menos 1').default(1),
  data_limite: z.string().optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
});

export type VagaFormData = z.infer<typeof vagaSchema>;

// Schema para Candidato
export const candidatoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  linkedin: z.string().url('URL do LinkedIn inválida').optional().or(z.literal('')),
  github: z.string().url('URL do GitHub inválida').optional().or(z.literal('')),
  portfolio: z.string().url('URL do Portfolio inválida').optional().or(z.literal('')),
  resumo_profissional: z.string().optional(),
  pretensao_salarial: z.number().min(0).optional(),
  disponibilidade: z.string().optional(),
});

export type CandidatoFormData = z.infer<typeof candidatoSchema>;

// Schema para Avaliação
export const avaliacaoSchema = z.object({
  tipo: z.enum(['tecnica', 'comportamental', 'cultural']),
  competencias: z.array(z.object({
    nome: z.string(),
    nota: z.number().min(0).max(10),
    peso: z.number().min(1).max(5).default(1),
    observacoes: z.string().optional(),
  })).min(1, 'Adicione pelo menos uma competência'),
  nota_geral: z.number().min(0).max(10),
  parecer: z.enum(['aprovar', 'reprovar', 'em_duvida']),
  observacoes: z.string().optional(),
});

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

// Schema para Prova/Teste
export const provaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  categoria: z.enum(['logica', 'tecnica', 'comportamental', 'idiomas', 'conhecimentos_gerais']),
  nivel: z.enum(['junior', 'pleno', 'senior', 'especialista']),
  departamento: z.string().optional(),
  tempo_limite_minutos: z.number().min(5, 'Tempo mínimo de 5 minutos').max(240, 'Tempo máximo de 4 horas'),
  nota_minima: z.number().min(0).max(100).default(70),
  ativo: z.boolean().default(true),
});

export type ProvaFormData = z.infer<typeof provaSchema>;

// Schema para Questão
export const questaoSchema = z.object({
  enunciado: z.string().min(10, 'Enunciado deve ter pelo menos 10 caracteres'),
  tipo: z.enum(['multipla_escolha', 'verdadeiro_falso', 'dissertativa']),
  opcoes: z.array(z.string()).optional(),
  resposta_correta: z.string().optional(),
  pontuacao: z.number().min(1).max(100).default(10),
  dificuldade: z.enum(['facil', 'medio', 'dificil']).default('medio'),
});

export type QuestaoFormData = z.infer<typeof questaoSchema>;

// Schema para Entrevista
export const entrevistaSchema = z.object({
  data_hora: z.string().min(1, 'Data e hora são obrigatórios'),
  tipo: z.enum(['presencial', 'video', 'telefone']),
  local: z.string().optional(),
  link_video: z.string().url('URL inválida').optional().or(z.literal('')),
  entrevistadores: z.array(z.string()).min(1, 'Adicione pelo menos um entrevistador'),
  observacoes: z.string().optional(),
});

export type EntrevistaFormData = z.infer<typeof entrevistaSchema>;

// Schema para Indicação
export const indicacaoSchema = z.object({
  indicador_nome: z.string().min(2, 'Nome do indicador é obrigatório'),
  indicador_email: z.string().email('Email do indicador inválido'),
  candidato_nome: z.string().min(2, 'Nome do candidato é obrigatório'),
  candidato_email: z.string().email('Email do candidato inválido'),
  candidato_telefone: z.string().optional(),
  vaga_id: z.string().uuid('Selecione uma vaga'),
  relacao: z.string().optional(),
  justificativa: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres'),
});

export type IndicacaoFormData = z.infer<typeof indicacaoSchema>;
