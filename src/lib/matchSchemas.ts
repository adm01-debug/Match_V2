import { z } from 'zod';

export const vagaSchema = z.object({
  titulo: z.string().min(1),
  departamento: z.string().optional(),
  descricao: z.string().optional(),
  requisitos: z.string().optional(),
  tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario']).optional(),
  modalidade: z.enum(['presencial', 'remoto', 'hibrido']).optional(),
  salario_min: z.coerce.number().positive().optional(),
  salario_max: z.coerce.number().positive().optional(),
  status: z.enum(['aberta', 'em_selecao', 'finalizada', 'cancelada']).default('aberta'),
  data_limite: z.string().optional(),
});

export const candidatoSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().optional(),
  linkedin: z.string().url().optional(),
  curriculo_url: z.string().url().optional(),
  vaga_id: z.string().uuid().optional(),
  etapa: z.enum(['triagem', 'entrevista_rh', 'entrevista_tecnica', 'proposta', 'contratado', 'reprovado']).default('triagem'),
  avaliacao: z.coerce.number().min(0).max(10).optional(),
  observacoes: z.string().optional(),
});

export const matchImportTemplates = {
  candidatos: [
    { key: 'nome', label: 'Nome', example: 'João Silva' },
    { key: 'email', label: 'E-mail', example: 'joao@email.com' },
    { key: 'telefone', label: 'Telefone', example: '(11) 99999-9999' },
    { key: 'linkedin', label: 'LinkedIn', example: 'https://linkedin.com/in/joao' },
  ],
};

export const matchFilterConfigs = {
  candidatos: [
    { key: 'etapa', label: 'Etapa', type: 'select' as const, options: [
      { value: 'triagem', label: 'Triagem' },
      { value: 'entrevista_rh', label: 'Entrevista RH' },
      { value: 'entrevista_tecnica', label: 'Entrevista Técnica' },
      { value: 'proposta', label: 'Proposta' },
      { value: 'contratado', label: 'Contratado' },
      { value: 'reprovado', label: 'Reprovado' },
    ]},
  ],
  vagas: [
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'aberta', label: 'Aberta' },
      { value: 'em_selecao', label: 'Em Seleção' },
      { value: 'finalizada', label: 'Finalizada' },
    ]},
  ],
};
