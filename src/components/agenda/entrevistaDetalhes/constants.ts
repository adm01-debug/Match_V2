import { MapPin, Video, Phone, Users, Briefcase } from 'lucide-react';

export const tipoConfig = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-primary/10 text-primary' },
  online: { icon: Video, label: 'Online', color: 'bg-accent/10 text-accent-foreground' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-success/10 text-success' },
  tecnica: { icon: Briefcase, label: 'Técnica', color: 'bg-primary/10 text-primary' },
  rh: { icon: Users, label: 'RH', color: 'bg-success/10 text-success' },
  cultural: { icon: Users, label: 'Cultural', color: 'bg-accent/10 text-accent-foreground' },
  final: { icon: Briefcase, label: 'Final', color: 'bg-warning/10 text-warning' },
  triagem: { icon: Phone, label: 'Triagem', color: 'bg-muted text-muted-foreground' },
} as const;

export const statusConfig = {
  agendada: { label: 'Agendada', color: 'bg-warning/10 text-warning border-warning/20' },
  confirmada: { label: 'Confirmada', color: 'bg-success/10 text-success border-success/20' },
  realizada: { label: 'Realizada', color: 'bg-muted text-muted-foreground border-muted' },
  cancelada: { label: 'Cancelada', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  reagendada: { label: 'Reagendada', color: 'bg-warning/10 text-warning border-warning/20' },
  remarcada: { label: 'Remarcada', color: 'bg-warning/10 text-warning border-warning/20' },
  no_show: { label: 'No Show', color: 'bg-destructive/10 text-destructive border-destructive/20' },
} as const;

export const etapas = [
  'Triagem Telefônica',
  'Entrevista RH',
  'Entrevista Técnica',
  'Entrevista Gestor',
  'Entrevista Final',
];

export const parseDate = (date: string | Date): Date =>
  typeof date === 'string' ? new Date(date) : date;
