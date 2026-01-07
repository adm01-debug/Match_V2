// Import Service for CSV and Excel files
import { supabase } from '@/integrations/supabase/client';

export interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; error: string }[];
}

export interface ImportConfig {
  table: string;
  mapping: Record<string, string>;
  validators?: Record<string, (value: unknown) => boolean>;
  transformers?: Record<string, (value: unknown) => unknown>;
}

class ImportService {
  parseCSV(content: string): Record<string, string>[] {
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = this.parseCSVLine(lines[0] ?? '');
    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i] ?? '');
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() ?? '';
      });
      data.push(row);
    }

    return data;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  }

  async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async readExcel(file: File): Promise<Record<string, string>[]> {
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];
      if (!firstSheet) return [];
      return XLSX.utils.sheet_to_json(firstSheet);
    } catch {
      return [];
    }
  }

  validateRow(row: Record<string, unknown>, config: ImportConfig): string | null {
    if (!config.validators) return null;

    for (const [field, validator] of Object.entries(config.validators)) {
      const csvColumn = Object.entries(config.mapping).find(([, dbCol]) => dbCol === field)?.[0];
      if (csvColumn && row[csvColumn] !== undefined && !validator(row[csvColumn])) {
        return `Campo "${field}" inválido`;
      }
    }

    return null;
  }

  transformRow(row: Record<string, unknown>, config: ImportConfig): Record<string, unknown> {
    const transformed: Record<string, unknown> = {};

    for (const [csvColumn, dbColumn] of Object.entries(config.mapping)) {
      let value = row[csvColumn];

      if (config.transformers?.[dbColumn]) {
        value = config.transformers[dbColumn](value);
      }

      transformed[dbColumn] = value;
    }

    return transformed;
  }

  async import(data: Record<string, unknown>[], config: ImportConfig): Promise<ImportResult> {
    const result: ImportResult = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      const rowNum = i + 2;

      const validationError = this.validateRow(row, config);
      if (validationError) {
        result.failed++;
        result.errors.push({ row: rowNum, error: validationError });
        continue;
      }

      const transformedData = this.transformRow(row, config);

      try {
        const insertData = {
          nome: String(transformedData['nome'] ?? ''),
          email: String(transformedData['email'] ?? ''),
          telefone: transformedData['telefone'] ? String(transformedData['telefone']) : null,
          fonte: transformedData['fonte'] ? String(transformedData['fonte']) : null,
        };
        
        const { error } = await supabase.from('candidatos').insert(insertData);
        if (error) {
          result.failed++;
          result.errors.push({ row: rowNum, error: error.message });
        } else {
          result.success++;
        }
      } catch (err) {
        result.failed++;
        result.errors.push({ row: rowNum, error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    return result;
  }

  async importCandidatos(file: File): Promise<ImportResult> {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const data = isExcel
      ? await this.readExcel(file)
      : this.parseCSV(await this.readFile(file));

    const config: ImportConfig = {
      table: 'candidatos',
      mapping: {
        'Nome': 'nome',
        'E-mail': 'email',
        'Email': 'email',
        'Telefone': 'telefone',
        'Origem': 'fonte',
      },
      validators: {
        email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
      },
      transformers: {
        email: (v) => v ? String(v).toLowerCase().trim() : null,
        telefone: (v) => v ? String(v).replace(/\D/g, '') : null,
      },
    };

    return this.import(data as Record<string, unknown>[], config);
  }

  preview(data: Record<string, unknown>[], limit = 5): Record<string, unknown>[] {
    return data.slice(0, limit);
  }

  getHeaders(data: Record<string, unknown>[]): string[] {
    if (data.length === 0) return [];
    const firstItem = data[0];
    return firstItem ? Object.keys(firstItem) : [];
  }
}

export const importService = new ImportService();
export default importService;
