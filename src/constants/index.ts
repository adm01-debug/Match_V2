export * from './routes';
export * from './queryKeys';

// Re-export from lib/constants (single source of truth)
export { 
  APP_NAME, 
  APP_VERSION,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION,
  ETAPAS_PROCESSO,
  STATUS_VAGA,
  PRIORIDADES,
  TIPOS_CONTRATO,
  MODALIDADES_TRABALHO,
  NIVEIS_EXPERIENCIA,
  FONTES_CANDIDATOS,
  TIPOS_ENTREVISTA,
  CATEGORIAS_PROVA,
  DEPARTAMENTOS,
  CHART_COLORS,
  METAS_PADRAO
} from '@/lib/constants';

// Additional constants specific to this module
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
