/**
 * Hook para Importação de Dados
 * @module hooks/useImportData
 * @description Importação de CSV e Excel com validação Zod
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export interface ImportResult<T> {
  success: T[];
  errors: ImportError[];
  total: number;
  fileName: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: unknown;
}

export type ImportStatus = 'idle' | 'parsing' | 'validating' | 'importing' | 'complete' | 'error';

interface UseImportDataOptions<T> {
  schema: z.ZodSchema<T>;
  onImport: (data: T[]) => Promise<void>;
  maxRows?: number;
  skipFirstRow?: boolean;
}

export function useImportData<T>(options: UseImportDataOptions<T>) {
  const { schema, onImport, maxRows = 10000, skipFirstRow = false } = options;

  const [status, setStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult<T> | null>(null);

  const parseCSV = useCallback(async (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            resolve([]);
            return;
          }
          
          const firstLine = lines[0] ?? '';
          const headers = firstLine.split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
          const dataLines = skipFirstRow ? lines.slice(2) : lines.slice(1);
          
          const data = dataLines.map(line => {
            const values = line.split(',');
            const row: Record<string, string> = {};
            headers.forEach((header, i) => {
              row[header] = values[i]?.trim() || '';
            });
            return row;
          });
          
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }, [skipFirstRow]);

  const parseExcel = useCallback(async (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            resolve([]);
            return;
          }
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) {
            resolve([]);
            return;
          }
          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
            raw: false,
          }) as Record<string, unknown>[];
          
          const normalized = jsonData.map((row) => {
            const newRow: Record<string, unknown> = {};
            Object.keys(row).forEach(key => {
              const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '_');
              newRow[normalizedKey] = row[key];
            });
            return newRow;
          });
          
          if (skipFirstRow && normalized.length > 0) {
            normalized.shift();
          }
          
          resolve(normalized);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  }, [skipFirstRow]);

  const validateData = useCallback((data: unknown[]): ImportResult<T> => {
    const success: T[] = [];
    const errors: ImportError[] = [];

    data.slice(0, maxRows).forEach((row, index) => {
      try {
        const validated = schema.parse(row);
        success.push(validated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.issues.forEach((err) => {
            const fieldKey = err.path[0];
            errors.push({
              row: index + 2,
              field: err.path.join('.'),
              message: err.message,
              value: typeof row === 'object' && row !== null && typeof fieldKey === 'string' 
                ? (row as Record<string, unknown>)[fieldKey] 
                : undefined,
            });
          });
        }
      }
    });

    return {
      success,
      errors,
      total: data.length,
      fileName: '',
    };
  }, [schema, maxRows]);

  const processFile = useCallback(async (file: File) => {
    setStatus('parsing');
    setProgress(10);
    setResult(null);

    try {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const data = isExcel ? await parseExcel(file) : await parseCSV(file);

      setStatus('validating');
      setProgress(40);

      const validationResult = validateData(data);
      validationResult.fileName = file.name;

      setResult(validationResult);
      setProgress(60);
      setStatus('complete');

      if (validationResult.errors.length > 0) {
        toast.warning(`${validationResult.success.length} válidos, ${validationResult.errors.length} com erro`);
      } else {
        toast.success(`${validationResult.success.length} registros prontos para importar`);
      }
    } catch (error) {
      setStatus('error');
      toast.error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [parseCSV, parseExcel, validateData]);

  const confirmImport = useCallback(async () => {
    if (!result || result.success.length === 0) {
      toast.error('Nenhum dado válido para importar');
      return;
    }

    setStatus('importing');
    setProgress(70);

    try {
      await onImport(result.success);
      setProgress(100);
      toast.success(`${result.success.length} registros importados com sucesso!`);
      
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
        setProgress(0);
      }, 2000);
    } catch (error) {
      setStatus('error');
      toast.error(`Erro ao importar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [result, onImport]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
  }, []);

  return {
    status,
    progress,
    result,
    processFile,
    confirmImport,
    reset,
    isProcessing: status === 'parsing' || status === 'validating' || status === 'importing',
  };
}

export default useImportData;
