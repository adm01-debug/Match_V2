// Import Service for CSV and Excel files
import { supabase } from '@/integrations/supabase/client';

export interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; error: string }[];
}

export interface ImportConfig {
  table: string;
  mapping: Record<string, string>; // CSV column -> DB column
  validators?: Record<string, (value: any) => boolean>;
  transformers?: Record<string, (value: any) => any>;
}

class ImportService {
  // Parse CSV string
  parseCSV(content: string): Record<string, string>[] {
    const lines = content.split(/?
/).filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = this.parseCSVLine(lines[0]);
    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
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

  // Read file as text
  async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Read Excel file
  async readExcel(file: File): Promise<Record<string, string>[]> {
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(firstSheet);
    } catch (error) {
      console.error('Excel read error:', error);
      return [];
    }
  }

  // Validate row data
  validateRow(row: Record<string, any>, config: ImportConfig): string | null {
    if (!config.validators) return null;

    for (const [field, validator] of Object.entries(config.validators)) {
      const csvColumn = Object.entries(config.mapping).find(([_, dbCol]) => dbCol === field)?.[0];
      if (csvColumn && !validator(row[csvColumn])) {
        return `Campo "${field}" inválido`;
      }
    }

    return null;
  }

  // Transform row data
  transformRow(row: Record<string, any>, config: ImportConfig): Record<string, any> {
    const transformed: Record<string, any> = {};

    for (const [csvColumn, dbColumn] of Object.entries(config.mapping)) {
      let value = row[csvColumn];

      if (config.transformers?.[dbColumn]) {
        value = config.transformers[dbColumn](value);
      }

      transformed[dbColumn] = value;
    }

    return transformed;
  }

  // Import data to database
  async import(data: Record<string, any>[], config: ImportConfig): Promise<ImportResult> {
    const result: ImportResult = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // +2 because 1-indexed and header row

      // Validate
      const validationError = this.validateRow(row, config);
      if (validationError) {
        result.failed++;
        result.errors.push({ row: rowNum, error: validationError });
        continue;
      }

      // Transform
      const transformedData = this.transformRow(row, config);

      // Insert
      try {
        const { error } = await supabase.from(config.table).insert(transformedData);
        if (error) {
          result.failed++;
          result.errors.push({ row: rowNum, error: error.message });
        } else {
          result.success++;
        }
      } catch (error: any) {
        result.failed++;
        result.errors.push({ row: rowNum, error: error.message });
      }
    }

    return result;
  }

  // Import candidatos from file
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
        'Origem': 'origem',
        'LinkedIn': 'linkedin_url',
      },
      validators: {
        email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      },
      transformers: {
        email: (v) => v?.toLowerCase().trim(),
        telefone: (v) => v?.replace(/\D/g, ''),
      },
    };

    return this.import(data, config);
  }

  // Preview import data
  preview(data: Record<string, any>[], limit = 5): Record<string, any>[] {
    return data.slice(0, limit);
  }

  // Get column headers from data
  getHeaders(data: Record<string, any>[]): string[] {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }
}

export const importService = new ImportService();
export default importService;
