/**
 * @fileoverview Formatting utilities for numbers, currencies, and text
 * @module lib/formatters
 */

import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de datas
export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm");
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function diasDesde(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(new Date(), d);
}

// Formatação de números
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// Formatação de texto
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Formatação de telefone
export function formatPhone(phone: string | null): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

// Formatação de CPF/CNPJ
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Match score helpers
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  if (score >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Baixo';
}

// Status helpers
export const statusVagaLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  publicada: 'Publicada',
  pausada: 'Pausada',
  fechada: 'Fechada',
  cancelada: 'Cancelada',
};

export const statusProcessoLabels: Record<string, string> = {
  em_andamento: 'Em Andamento',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
  desistente: 'Desistente',
  contratado: 'Contratado',
};

export const etapaLabels: Record<string, string> = {
  novo: 'Novo',
  em_triagem: 'Em Triagem',
  pre_selecao: 'Pré-seleção',
  entrevista_rh: 'Entrevista RH',
  teste_tecnico: 'Teste Técnico',
  entrevista_gestor: 'Entrevista Gestor',
  entrevista_final: 'Entrevista Final',
  aprovado: 'Aprovado',
  proposta_enviada: 'Proposta Enviada',
  contratado: 'Contratado',
  reprovado: 'Reprovado',
  banco_talentos: 'Banco de Talentos',
};
