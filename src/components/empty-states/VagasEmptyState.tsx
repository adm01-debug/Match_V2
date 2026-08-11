/**
 * @fileoverview Empty State para Lista de Vagas
 */

import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { VagasEmptyIllustration } from './illustrations';

interface VagasEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function VagasEmptyState({ hasFilters, onClearFilters }: VagasEmptyStateProps) {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <EmptyStateCard
        illustration={<VagasEmptyIllustration />}
        title="Nenhuma vaga encontrada"
        description="Não encontramos vagas que correspondam aos seus filtros. Tente ajustar os critérios de busca ou limpe os filtros para ver todas as vagas."
        primaryAction={{
          label: "Limpar Filtros",
          onClick: () => onClearFilters?.(),
        }}
        secondaryAction={{
          label: "Criar Nova Vaga",
          onClick: () => navigate('/vagas/nova'),
        }}
      />
    );
  }

  return (
    <EmptyStateCard
      illustration={<VagasEmptyIllustration />}
      title="Comece criando sua primeira vaga"
      description="Ainda não há vagas cadastradas. Crie sua primeira vaga para começar a atrair candidatos qualificados e construir seu time."
      primaryAction={{
        label: "Criar Primeira Vaga",
        onClick: () => navigate('/vagas/nova'),
        icon: Plus,
      }}
    />
  );
}

export default VagasEmptyState;
