/**
 * Utilitários para captação de candidatos via WhatsApp (wa.me deep-link).
 * Não faz chamadas server-side: apenas monta URLs seguras para intake.
 */

export function normalizeWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10) return null;
  // Assume BR se veio sem DDI e tem 10-11 dígitos
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}

export function buildWhatsappApplyUrl(params: {
  numero: string | null | undefined;
  vagaTitulo: string;
  mensagemTemplate?: string | null;
  origem?: string;
}): string | null {
  const numero = normalizeWhatsappNumber(params.numero);
  if (!numero) return null;
  const template =
    params.mensagemTemplate?.trim() ||
    'Olá! Tenho interesse na vaga {{vaga}} e gostaria de me candidatar.';
  const msg = template.replaceAll('{{vaga}}', params.vagaTitulo);
  const origem = params.origem ? `\n\n(via ${params.origem})` : '';
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg + origem)}`;
}

export function buildWhatsappShareVagaUrl(vagaTitulo: string, vagaUrl: string): string {
  const msg = `Confira esta oportunidade: ${vagaTitulo}\n${vagaUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}
