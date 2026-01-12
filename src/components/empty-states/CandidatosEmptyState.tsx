/**
 * @fileoverview Empty State para Banco de Candidatos
 */

import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { CandidatosEmptyIllustration, SearchEmptyIllustration } from './illustrations';

interface CandidatosEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function CandidatosEmptyState({ hasFilters, onClearFilters }: CandidatosEmptyStateProps) {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <EmptyStateCard
        illustration={<SearchEmptyIllustration />}
        title="Nenhum candidato encontrado"
        description="Sua busca não retornou resultados. Experimente usar termos diferentes ou ajustar os filtros aplicados."
        primaryAction={{
          label: "Limpar Filtros",
          onClick: () => onClearFilters?.(),
        }}
      />
    );
  }

  return (
    <EmptyStateCard
      illustration={<CandidatosEmptyIllustration />}
      title="Seu banco de talentos está vazio"
      description="Comece a construir seu banco de candidatos importando currículos ou aguardando candidaturas em suas vagas publicadas."
      primaryAction={{
        label: "Importar Currículos",
        onClick: () => navigate('/parser-curriculo'),
        icon: Upload,
      }}
      secondaryAction={{
        label: "Cadastrar Candidato",
        onClick: () => navigate('/talentos/novo'),
      }}
    />
  );
}

export default CandidatosEmptyState;
