/**
 * @fileoverview Empty State para Notificações
 */


import { EmptyStateCard } from './EmptyStateCard';
import { NotificationsEmptyIllustration } from './illustrations';

export function NotificationsEmptyState() {
  return (
    <EmptyStateCard
      illustration={<NotificationsEmptyIllustration className="w-32 h-32" />}
      title="Tudo em dia!"
      description="Você não tem notificações pendentes. Novas atualizações aparecerão aqui."
      variant="minimal"
    />
  );
}

export default NotificationsEmptyState;
