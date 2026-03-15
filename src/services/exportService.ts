// Export Service

export const exportService = {
  toCSV(data: Record<string, unknown>[], columns?: string[]): string {
    const keys = columns || (data.length > 0 ? Object.keys(data[0] ?? {}) : []);
    const header = keys.join(',');
    const rows = data.map((row) =>
      keys.map((k) => {
        const val = row[k];
        const str = val == null ? '' : String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    );
    return [header, ...rows].join('\n');
  },

  toJSON(data: Record<string, unknown>[]): string {
    return JSON.stringify(data, null, 2);
  },

  download(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportAsCSV(data: Record<string, unknown>[], filename: string, columns?: string[]) {
    this.download(this.toCSV(data, columns), `${filename}.csv`, 'text/csv;charset=utf-8');
  },

  exportAsJSON(data: Record<string, unknown>[], filename: string) {
    this.download(this.toJSON(data), `${filename}.json`, 'application/json');
  },
};
