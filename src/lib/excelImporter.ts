/**
 * Excel/CSV Export utilities
 * @module lib/excelImporter
 */

interface ExportColumn<T> {
  key: keyof T;
  label: string;
}

/**
 * Exports data to Excel/CSV format
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string,
  sheetName: string = 'Dados'
): void {
  if (!data || data.length === 0) {
    console.warn('[exportToExcel] No data to export');
    return;
  }

  // Build CSV content
  const headers = columns.map(c => c.label).join(',');
  const rows = data.map(row => 
    columns.map(c => {
      const value = row[c.key];
      // Escape commas and quotes
      const stringValue = value == null ? '' : String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses CSV content to array of objects
 */
export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ?? '';
    });
    return obj;
  });
}

export default { exportToExcel, parseCSV };
