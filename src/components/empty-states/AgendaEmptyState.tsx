/**
 * @fileoverview Empty State para Agenda de Entrevistas
 */

import { useNavigate } from 'react-router-dom';
import { CalendarPlus, Kanban } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { AgendaEmptyIllustration } from './illustrations';

interface AgendaEmptyStateProps {
  /** Whether a specific date is selected */
  dateSelected?: boolean;
  /** Callback to open the scheduling dialog */
  onOpenDialog?: () => void;
}

export function AgendaEmptyState({ dateSelected, onOpenDialog }: AgendaEmptyStateProps) {
  const navigate = useNavigate();

  if (dateSelected) {
    return (
      <EmptyStateCard
        illustration={<AgendaEmptyIllustration />}
        title="Sem entrevistas nesta data"
        description="Não há entrevistas agendadas para o dia selecionado. Que tal agendar uma nova entrevista?"
        primaryAction={{
          label: "Agendar Entrevista",
          onClick: onOpenDialog,
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
        onClick: onOpenDialog,
        icon: CalendarPlus,
      }}
      secondaryAction={{
        label: "Ver Pipeline",
        onClick: () => navigate('/pipeline'),
        icon: Kanban,
      }}
    />
  );
}

export default AgendaEmptyState;
