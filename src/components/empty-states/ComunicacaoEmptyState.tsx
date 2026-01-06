/**
 * @fileoverview Empty State para Comunicações
 */

import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { ComunicacaoEmptyIllustration } from './illustrations';

interface ComunicacaoEmptyStateProps {
  context?: 'historico' | 'templates';
}

export function ComunicacaoEmptyState({ context = 'historico' }: ComunicacaoEmptyStateProps) {
  const navigate = useNavigate();

  const configs = {
    historico: {
      title: "Nenhuma comunicação enviada",
      description: "O histórico de comunicações com candidatos aparecerá aqui. Envie e-mails, feedbacks e notificações para manter os candidatos informados.",
      primaryLabel: "Enviar Comunicação",
      primaryIcon: Mail,
      navigateTo: '/comunicacao/nova',
    },
    templates: {
      title: "Crie templates de comunicação",
      description: "Templates ajudam a padronizar e agilizar suas comunicações. Crie modelos para cada etapa do processo seletivo.",
      primaryLabel: "Criar Template",
      primaryIcon: Mail,
      navigateTo: '/comunicacao/templates/novo',
    },
  };

  const config = configs[context];

  return (
    <EmptyStateCard
      illustration={<ComunicacaoEmptyIllustration />}
      title={config.title}
      description={config.description}
      primaryAction={{
        label: config.primaryLabel,
        onClick: () => navigate(config.navigateTo),
        icon: config.primaryIcon,
      }}
      secondaryAction={{
        label: "Ver Candidatos",
        onClick: () => navigate('/candidatos'),
      }}
    />
  );
}

export default ComunicacaoEmptyState;
