export interface Entrevistador {
  id: string;
  nome: string;
  cargo: string;
  disponibilidade: { dia: number; inicio: string; fim: string }[];
}

export interface ConflictInfo {
  type: 'overlap' | 'interviewer_busy' | 'time_proximity';
  severity: 'high' | 'medium' | 'low';
  message: string;
  conflictingInterview?: {
    id: string;
    candidatoNome: string;
    horaInicio: string;
    horaFim: string;
  };
}

export interface SugestedSlot {
  id: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  entrevistadores: Entrevistador[];
  score: number;
  reasons: string[];
  conflicts?: ConflictInfo[];
  hasConflict?: boolean;
}
