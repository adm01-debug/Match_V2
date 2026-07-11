import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Video,
  MapPin,
} from "lucide-react";

export interface EntrevistaCardData {
  id: string;
  status: string;
  tipo: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  local?: string;
  candidatoNome: string;
  vagaTitulo: string;
  entrevistadores: string[];
  candidatoId?: string;
}

export const statusConfig = {
  agendada: { label: "Agendada", color: "bg-primary/10 text-primary", icon: CalendarIcon },
  confirmada: { label: "Confirmada", color: "bg-success/10 text-success", icon: CheckCircle2 },
  realizada: { label: "Realizada", color: "bg-accent text-accent-foreground", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", color: "bg-destructive/10 text-destructive", icon: XCircle },
  reagendada: { label: "Reagendada", color: "bg-warning/10 text-warning", icon: AlertCircle },
} as const;

export const tipoConfig = {
  telefone: { label: "Telefone", icon: Phone },
  online: { label: "Videoconferência", icon: Video },
  presencial: { label: "Presencial", icon: MapPin },
} as const;
