/**
 * @fileoverview Empty State para Testes e Provas
 */

import { useNavigate } from 'react-router-dom';
import { FilePlus, BookOpen } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { TestsEmptyIllustration, SearchEmptyIllustration } from './illustrations';

interface TestsEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  context?: 'provas' | 'baterias' | 'resultados';
}

export function TestsEmptyState({ hasFilters, onClearFilters, context = 'provas' }: TestsEmptyStateProps) {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <EmptyStateCard
        illustration={<SearchEmptyIllustration />}
        title="Nenhum resultado encontrado"
        description="Não encontramos testes que correspondam aos seus filtros. Tente ajustar os critérios de busca."
        primaryAction={{
          label: "Limpar Filtros",
          onClick: () => onClearFilters?.(),
        }}
      />
    );
  }

  const configs = {
    provas: {
      title: "Crie sua primeira prova",
      description: "Desenvolva provas técnicas, comportamentais e de conhecimento para avaliar candidatos de forma objetiva e padronizada.",
      primaryLabel: "Criar Prova",
      primaryIcon: FilePlus,
      navigateTo: '/testes/nova',
    },
    baterias: {
      title: "Monte baterias de provas",
      description: "Agrupe provas em baterias para aplicar conjuntos de avaliações padronizadas por cargo ou departamento.",
      primaryLabel: "Criar Bateria",
      primaryIcon: BookOpen,
      navigateTo: '/testes/nova',
    },
    resultados: {
      title: "Nenhum resultado ainda",
      description: "Os resultados das provas aplicadas aos candidatos aparecerão aqui. Aplique provas para começar a avaliar.",
      primaryLabel: "Ver Provas",
      primaryIcon: BookOpen,
      navigateTo: '/testes',
    },
  };

  const config = configs[context];

  return (
    <EmptyStateCard
      illustration={<TestsEmptyIllustration />}
      title={config.title}
      description={config.description}
      primaryAction={{
        label: config.primaryLabel,
        onClick: () => navigate(config.navigateTo),
        icon: config.primaryIcon,
      }}
    />
  );
}

export default TestsEmptyState;
