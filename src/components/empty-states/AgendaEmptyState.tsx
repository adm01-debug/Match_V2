/**
 * @fileoverview Empty State para Agenda de Entrevistas
 */

import { useNavigate } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { AgendaEmptyIllustration } from './illustrations';

interface AgendaEmptyStateProps {
  dateSelected?: boolean;
}

export function AgendaEmptyState({ dateSelected }: AgendaEmptyStateProps) {
  const navigate = useNavigate();

  if (dateSelected) {
    return (
      <EmptyStateCard
        illustration={<AgendaEmptyIllustration />}
        title="Sem entrevistas nesta data"
        description="Não há entrevistas agendadas para o dia selecionado. Que tal agendar uma nova entrevista?"
        primaryAction={{
          label: "Agendar Entrevista",
          onClick: () => navigate('/agenda/nova'),
          icon: CalendarPlus,
        }}
        variant="minimal"
      />
    );
  }

  return (
    <EmptyStateCard
      illustration={<AgendaEmptyIllustration />}
      title="Sua agenda está livre"
      description="Você não tem entrevistas agendadas. Inicie processos seletivos e agende entrevistas com os candidatos que mais se destacarem."
      primaryAction={{
        label: "Agendar Entrevista",
        onClick: () => navigate('/agenda/nova'),
        icon: CalendarPlus,
      }}
      secondaryAction={{
        label: "Ver Pipeline",
        onClick: () => navigate('/pipeline'),
      }}
    />
  );
}

export default AgendaEmptyState;
