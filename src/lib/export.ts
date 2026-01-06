// Utilitários de exportação de dados
// Para exportação completa, instalar: npm install xlsx file-saver jspdf

/**
 * Exporta dados para CSV
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  if (!data.length) return;

  const keys = Object.keys(data[0] ?? {}) as (keyof T)[];
  const headerRow = headers 
    ? keys.map(k => headers[k] || String(k)).join(',')
    : keys.join(',');

  const rows = data.map(item =>
    keys.map(key => {
      const value = item[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );

  const csv = [headerRow, ...rows].join('\n');
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exporta dados para JSON
 */
export function exportToJSON<T>(data: T[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
}

/**
 * Formata data para exportação
 */
export function formatDateForExport(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata moeda para exportação
 */
export function formatCurrencyForExport(value: number | null): string {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Helper para download de arquivo
 */
function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta candidatos para CSV
 */
export function exportCandidatosCSV(candidatos: Record<string, unknown>[]): void {
  const data = candidatos.map(c => ({
    nome: c['nome'] as string ?? '',
    email: c['email'] as string ?? '',
    telefone: (c['telefone'] as string) || '',
    status: c['status'] as string ?? '',
    data_cadastro: formatDateForExport((c['created_at'] as string) ?? null),
    pretensao_salarial: formatCurrencyForExport((c['pretensao_salarial'] as number) ?? null),
  }));

  exportToCSV(data, `candidatos_${new Date().toISOString().split('T')[0]}`, {
    nome: 'Nome',
    email: 'E-mail',
    telefone: 'Telefone',
    status: 'Status',
    data_cadastro: 'Data Cadastro',
    pretensao_salarial: 'Pretensão Salarial',
  });
}

/**
 * Exporta vagas para CSV
 */
export function exportVagasCSV(vagas: Record<string, unknown>[]): void {
  const data = vagas.map(v => ({
    titulo: v['titulo'] as string ?? '',
    departamento: v['departamento'] as string ?? '',
    status: v['status'] as string ?? '',
    prioridade: v['prioridade'] as string ?? '',
    modalidade: v['modalidade'] as string ?? '',
    quantidade_vagas: v['quantidade_vagas'] as number ?? 0,
    data_criacao: formatDateForExport((v['created_at'] as string) ?? null),
  }));

  exportToCSV(data, `vagas_${new Date().toISOString().split('T')[0]}`, {
    titulo: 'Título',
    departamento: 'Departamento',
    status: 'Status',
    prioridade: 'Prioridade',
    modalidade: 'Modalidade',
    quantidade_vagas: 'Qtd. Vagas',
    data_criacao: 'Data Criação',
  });
}
