/**
 * @fileoverview Componente para destacar correspondências de busca fuzzy
 */

import { memo } from 'react';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface HighlightMatchProps {
  /** Texto completo a ser exibido */
  text: string;
  /** Índices das correspondências [início, fim] */
  indices?: readonly [number, number][];
  /** Classe CSS para o texto destacado */
  highlightClassName?: string;
  /** Classe CSS para o container */
  className?: string;
}

/**
 * Componente que destaca partes do texto que correspondem à busca
 */
export const HighlightMatch = memo(function HighlightMatch({
  text,
  indices,
  highlightClassName = 'bg-primary/20 text-primary font-semibold rounded-sm px-0.5',
  className,
}: HighlightMatchProps) {
  if (!indices || indices.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Ordenar índices e mesclar sobreposições
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  const mergedIndices: [number, number][] = [];
  
  for (const [start, end] of sortedIndices) {
    const last = mergedIndices[mergedIndices.length - 1];
    if (last && start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      mergedIndices.push([start, end]);
    }
  }

  const parts: JSX.Element[] = [];
  let lastEnd = 0;

  mergedIndices.forEach(([start, end], i) => {
    // Texto antes do match
    if (start > lastEnd) {
      parts.push(
        <span key={`pre-${i}`}>
          {text.slice(lastEnd, start)}
        </span>
      );
    }
    
    // Texto do match (destacado)
    parts.push(
      <mark key={`match-${i}`} className={cn(highlightClassName)}>
        {text.slice(start, end + 1)}
      </mark>
    );
    
    lastEnd = end + 1;
  });

  // Texto após o último match
  if (lastEnd < text.length) {
    parts.push(
      <span key="post">
        {text.slice(lastEnd)}
      </span>
    );
  }

  return <span className={className}>{parts}</span>;
});

/**
 * Função utilitária para extrair índices de um resultado do Fuse.js
 */
export function getMatchIndices(
  matches: readonly { key?: string; indices: readonly [number, number][] }[] | undefined,
  key: string
): readonly [number, number][] | undefined {
  if (!matches) return undefined;
  const match = matches.find(m => m.key === key);
  return match?.indices;
}

export default HighlightMatch;
