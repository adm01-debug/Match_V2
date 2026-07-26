/**
 * Utilitários de exportação CSV.
 *
 * Decisões deliberadas:
 * - **BOM UTF-8**: sem ele o Excel (pt-BR) interpreta o arquivo como
 *   Latin-1 e quebra acentuação — sintoma clássico de "Ana Beatriz" virar
 *   "Ana BeatrÃ­z".
 * - **Separador `;`**: o Excel em locales pt-BR usa ponto-e-vírgula como
 *   delimitador de lista. Vírgula abriria tudo em uma coluna só.
 * - **Anti CSV injection**: células iniciadas por `= + - @` (ou por tab /
 *   CR, que o Excel normaliza) são prefixadas com apóstrofo. Sem isso um
 *   candidato poderia gravar `=HYPERLINK(...)` no nome e transformar o
 *   export num vetor de ataque contra a máquina do recrutador.
 */

const SEPARATOR = ";";
const BOM = "\uFEFF";
const INJECTION_PREFIX = /^[=+\-@\t\r]/;

/** Normaliza qualquer valor para o texto que irá para a célula. */
export function toCellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((v) => toCellText(v)).join(", ");
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value);
}

/** Escapa uma célula: neutraliza fórmulas e aplica aspas quando preciso. */
export function escapeCsvCell(value: unknown): string {
  let text = toCellText(value);
  if (INJECTION_PREFIX.test(text)) text = `'${text}`;
  if (/["\n\r;,]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export interface CsvColumn<T> {
  /** Cabeçalho legível exibido na planilha. */
  header: string;
  /** Extrator do valor da célula a partir da linha. */
  value: (row: T) => unknown;
}

/** Serializa linhas tipadas em um CSV completo (com BOM). */
export function buildCsv<T>(rows: readonly T[], columns: readonly CsvColumn<T>[]): string {
  const head = columns.map((c) => escapeCsvCell(c.header)).join(SEPARATOR);
  const body = rows.map((row) =>
    columns.map((c) => escapeCsvCell(c.value(row))).join(SEPARATOR)
  );
  return BOM + [head, ...body].join("\r\n");
}

/** Sanitiza o nome do arquivo para evitar path traversal e caracteres inválidos. */
export function safeFileName(base: string, extension = "csv"): string {
  const cleaned = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "export";
  return `${cleaned}.${extension}`;
}

/**
 * Dispara o download no navegador. Isolado em função própria para que a
 * serialização (`buildCsv`) permaneça testável sem DOM.
 */
export function downloadCsv(content: string, fileName: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFileName(fileName);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoga no próximo tick: revogar de imediato aborta o download no Safari.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
