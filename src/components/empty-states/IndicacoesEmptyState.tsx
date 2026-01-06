/**
 * @fileoverview Empty State para Indicações
 */

import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { IndicacoesEmptyIllustration } from './illustrations';

export function IndicacoesEmptyState() {
  const navigate = useNavigate();

  return (
    <EmptyStateCard
      illustration={<IndicacoesEmptyIllustration />}
      title="Sem indicações ainda"
      description="Incentive colaboradores a indicarem talentos e construa um pipeline de candidatos qualificados através de referências internas."
      primaryAction={{
        label: "Registrar Indicação",
        onClick: () => navigate('/indicacoes/nova'),
        icon: UserPlus,
      }}
      secondaryAction={{
        label: "Compartilhar Programa",
        onClick: () => {
          // Copy share link
          navigator.clipboard.writeText(window.location.origin + '/indicacoes');
        },
      }}
    />
  );
}

export default IndicacoesEmptyState;
