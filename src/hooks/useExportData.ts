/**
 * Hook para Exportação de Dados
 * @module hooks/useExportData
 * @description Exportação para CSV e Excel
 */

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export type ExportFormat = 'csv' | 'xlsx';

export interface ExportColumn<T> {
  key: keyof T;
  header: string;
  width?: number;
  format?: (value: unknown) => string;
}

interface UseExportDataOptions<T> {
  columns: ExportColumn<T>[];
  fileName: string;
}

export function useExportData<T extends Record<string, unknown>>(
  options: UseExportDataOptions<T>
) {
  const { columns, fileName } = options;
  const [isExporting, setIsExporting] = useState(false);

  const formatData = useCallback((data: T[]): Record<string, unknown>[] => {
    return data.map((row) => {
      const formatted: Record<string, unknown> = {};
      columns.forEach((col) => {
        const value = row[col.key];
        formatted[col.header] = col.format ? col.format(value) : value;
      });
      return formatted;
    });
  }, [columns]);

  const exportCSV = useCallback((data: T[]) => {
    const formatted = formatData(data);
    const headers = columns.map((c) => c.header);
    
    const csvContent = [
      headers.join(','),
      ...formatted.map((row) =>
        headers
          .map((h) => {
            const value = row[h];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [columns, formatData, fileName]);

  const exportExcel = useCallback((data: T[]) => {
    const formatted = formatData(data);
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    
    const colWidths = columns.map((col) => ({
      wch: col.width ?? Math.max(col.header.length, 15),
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, [columns, formatData, fileName]);

  const exportData = useCallback(async (
    data: T[],
    format: ExportFormat,
  ) => {
    if (data.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    setIsExporting(true);

    try {
      switch (format) {
        case 'csv':
          exportCSV(data);
          break;
        case 'xlsx':
          exportExcel(data);
          break;
      }

      toast.success(`Exportado ${data.length} registros para ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Erro ao exportar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsExporting(false);
    }
  }, [exportCSV, exportExcel]);

  return {
    exportData,
    exportCSV: (data: T[]) => exportData(data, 'csv'),
    exportExcel: (data: T[]) => exportData(data, 'xlsx'),
    isExporting,
  };
}

export default useExportData;
