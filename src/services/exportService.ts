// Export Service for CSV, Excel, and PDF generation

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  columns?: string[];
  title?: string;
}

class ExportService {
  toCSV<T extends Record<string, any>>(data: T[], columns?: string[]): string {
    if (data.length === 0) return '';

    const keys = columns || Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(item =>
      keys.map(key => {
        const value = item[key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      }).join(',')
    );

    return [header, ...rows].join('\n');
  }

  toJSON<T>(data: T[]): string {
    return JSON.stringify(data, null, 2);
  }

  toExcelCSV<T extends Record<string, any>>(data: T[], columns?: string[]): string {
    const bom = '\uFEFF';
    return bom + this.toCSV(data, columns);
  }

  download(content: string | Blob, filename: string, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async export<T extends Record<string, any>>(data: T[], options: ExportOptions): Promise<void> {
    const filename = options.filename || `export-${new Date().toISOString().split('T')[0]}`;

    switch (options.format) {
      case 'csv':
        this.download(this.toExcelCSV(data, options.columns), `${filename}.csv`, 'text/csv;charset=utf-8');
        break;
      case 'xlsx':
        await this.exportToExcel(data, filename, options.columns, options.title);
        break;
      case 'pdf':
        await this.exportToPDF(data, filename, options.columns, options.title);
        break;
      case 'json':
        this.download(this.toJSON(data), `${filename}.json`, 'application/json');
        break;
    }
  }

  private async exportToExcel<T extends Record<string, any>>(data: T[], filename: string, columns?: string[], title?: string): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const keys = columns || Object.keys(data[0] || {});
      const worksheetData = [title ? [title] : [], keys, ...data.map(item => keys.map(key => item[key] ?? ''))].filter(row => row.length > 0);
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      // Excel export error - handled
      this.download(this.toExcelCSV(data, columns), `${filename}.csv`, 'text/csv;charset=utf-8');
    }
  }

  private async exportToPDF<T extends Record<string, any>>(data: T[], filename: string, columns?: string[], title?: string): Promise<void> {
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();
      const keys = columns || Object.keys(data[0] || {});
      if (title) {
        doc.setFontSize(16);
        doc.text(title, 14, 20);
      }
      autoTable(doc, {
        head: [keys],
        body: data.map(item => keys.map(key => String(item[key] ?? ''))),
        startY: title ? 30 : 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });
      doc.save(`${filename}.pdf`);
    } catch (error) {
      // PDF export error - handled
      this.download(this.toExcelCSV(data, columns), `${filename}.csv`, 'text/csv;charset=utf-8');
    }
  }

  async exportCandidatos(candidatos: any[], format: ExportFormat): Promise<void> {
    const columns = ['nome', 'email', 'telefone', 'origem', 'status', 'created_at'];
    await this.export(candidatos, { filename: 'candidatos', format, columns, title: 'Lista de Candidatos' });
  }

  async exportVagas(vagas: any[], format: ExportFormat): Promise<void> {
    const columns = ['titulo', 'departamento', 'status', 'prioridade', 'created_at'];
    await this.export(vagas, { filename: 'vagas', format, columns, title: 'Lista de Vagas' });
  }
}

export const exportService = new ExportService();
export default exportService;

