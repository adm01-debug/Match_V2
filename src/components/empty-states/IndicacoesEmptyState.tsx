/**
 * @fileoverview Empty State para Indicações
 */

import { UserPlus, Share2 } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { IndicacoesEmptyIllustration } from './illustrations';
import { toast } from 'sonner';

interface IndicacoesEmptyStateProps {
  /** Callback to open the new indication dialog */
  onOpenDialog?: () => void;
}

export function IndicacoesEmptyState({ onOpenDialog }: IndicacoesEmptyStateProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/indicacoes');
    toast.success('Link copiado para a área de transferência!');
  };

  return (
    <EmptyStateCard
      illustration={<IndicacoesEmptyIllustration />}
      title="Sem indicações ainda"
      description="Incentive colaboradores a indicarem talentos e construa um pipeline de candidatos qualificados através de referências internas."
      primaryAction={{
        label: "Registrar Indicação",
        onClick: onOpenDialog,
        icon: UserPlus,
      }}
      secondaryAction={{
        label: "Compartilhar Programa",
        onClick: handleCopyLink,
        icon: Share2,
      }}
    />
  );
}

export default IndicacoesEmptyState;
