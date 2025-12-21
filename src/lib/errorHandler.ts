import { toast } from 'sonner';

export const handleError = (error: unknown, context?: string) => {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  console.error(`[${context || 'Error'}]:`, error);
  toast.error(message);
  return message;
};

export const handleApiError = (error: unknown) => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'PGRST116': return 'Registro não encontrado';
      case '23505': return 'Registro duplicado';
      case '23503': return 'Referência inválida';
      default: return 'Erro na operação';
    }
  }
  return handleError(error);
};
