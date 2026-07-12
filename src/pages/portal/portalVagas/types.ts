export const modalidadeLabels: Record<string, string> = {
  presencial: 'Presencial',
  hibrido: 'Híbrido',
  remoto: 'Remoto',
};

export const contratoLabels: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário',
};

export interface VagaPublicada {
  id: string;
  titulo: string;
  departamento: string;
  cidade: string | null;
  estado: string | null;
  modalidade: string;
  tipo_contrato: string;
  descricao?: string | null;
  salario_min: number | null;
  salario_max: number | null;
  salario_a_combinar?: boolean;
  data_publicacao: string | null;
  [key: string]: unknown;
}
