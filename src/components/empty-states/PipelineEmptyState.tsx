/**
 * @fileoverview Empty State para Pipeline de Recrutamento
 */

import { useNavigate } from 'react-router-dom';
import { Users, Briefcase } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { PipelineEmptyIllustration } from './illustrations';

interface PipelineEmptyStateProps {
  hasVagas?: boolean;
}

export function PipelineEmptyState({ hasVagas = true }: PipelineEmptyStateProps) {
  const navigate = useNavigate();

  if (!hasVagas) {
    return (
      <EmptyStateCard
        illustration={<PipelineEmptyIllustration />}
        title="Crie vagas para iniciar o pipeline"
        description="O pipeline de recrutamento será preenchido automaticamente quando candidatos se aplicarem às suas vagas ou forem adicionados a processos seletivos."
        primaryAction={{
          label: "Criar Primeira Vaga",
          onClick: () => navigate('/vagas/nova'),
          icon: Briefcase,
        }}
      />
    );
  }

  return (
    <EmptyStateCard
      illustration={<PipelineEmptyIllustration />}
      title="Nenhum candidato no pipeline"
      description="Quando candidatos se inscreverem em suas vagas ou forem adicionados manualmente, eles aparecerão aqui para você gerenciar o processo seletivo."
      primaryAction={{
        label: "Ver Candidatos",
        onClick: () => navigate('/candidatos'),
        icon: Users,
      }}
      secondaryAction={{
        label: "Ver Vagas",
        onClick: () => navigate('/vagas'),
      }}
    />
  );
}

export default PipelineEmptyState;
