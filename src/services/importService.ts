// Import Service
import { z } from 'zod';

export interface ImportResult {
  total: number;
  success: number;
  errors: { row: number; message: string }[];
}

export const importService = {
  parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headerLine = lines[0] ?? '';
    const headers = headerLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ''; });
      return row;
    });
  },

  validate(data: Record<string, string>[], schema: z.ZodSchema): ImportResult {
    const result: ImportResult = { total: data.length, success: 0, errors: [] };
    data.forEach((row, i) => {
      const parsed = schema.safeParse(row);
      if (parsed.success) {
        result.success++;
      } else {
        result.errors.push({ row: i + 1, message: parsed.error.errors.map((e) => e.message).join(', ') });
      }
    });
    return result;
  },
};
