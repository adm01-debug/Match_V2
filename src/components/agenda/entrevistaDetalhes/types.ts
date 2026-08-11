import { Entrevista } from '@/data/agendaData';

export interface EditableEntrevista extends Entrevista {
  observacoes?: string;
}
