import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'csv' | 'json' | 'xlsx';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
  columns?: string[];
}

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = useCallback((data: Record<string, unknown>[], filename: string, columns?: string[]) => {
    const keys = columns || (data.length > 0 ? Object.keys(data[0]) : []);
    const header = keys.join(',');
    const rows = data.map((row) => keys.map((k) => {
      const val = row[k];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportToJSON = useCallback((data: Record<string, unknown>[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportData = useCallback(async (data: Record<string, unknown>[], options: ExportOptions) => {
    setIsExporting(true);
    try {
      switch (options.format) {
        case 'csv':
          exportToCSV(data, options.filename, options.columns);
          break;
        case 'json':
          exportToJSON(data, options.filename);
          break;
        default:
          exportToCSV(data, options.filename, options.columns);
      }
      toast({ title: 'Exportação concluída', description: `Arquivo ${options.filename}.${options.format} baixado.` });
    } catch (err) {
      toast({ title: 'Erro na exportação', description: 'Não foi possível exportar os dados.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  }, [exportToCSV, exportToJSON, toast]);

  return { exportData, isExporting };
}
