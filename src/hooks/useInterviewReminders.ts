/**
 * @fileoverview Hook para gerenciamento de lembretes de entrevista
 * @module useInterviewReminders
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReminderConfig {
  hoursAhead?: number;
  sendToCandidate?: boolean;
  sendToInterviewers?: boolean;
}

export interface ReminderResult {
  entrevistaId: string;
  candidateEmail: boolean;
  interviewerEmails: number;
}

export interface UseInterviewRemindersReturn {
  sendReminder: (entrevistaId: string, config?: ReminderConfig) => Promise<boolean>;
  sendBulkReminders: (config?: ReminderConfig) => Promise<ReminderResult[]>;
  isLoading: boolean;
  error: string | null;
}

export function useInterviewReminders(): UseInterviewRemindersReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendReminder = useCallback(async (
    entrevistaId: string,
    config: ReminderConfig = {}
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('interview-reminders', {
        body: {
          entrevistaId,
          ...config,
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.success) {
        const result = data.results?.[0];
        const sent = (result?.candidateEmail ? 1 : 0) + (result?.interviewerEmails || 0);
        
        toast({
          title: 'Lembretes enviados',
          description: `${sent} lembrete(s) enviado(s) com sucesso`,
        });
        
        return true;
      }

      throw new Error('Falha ao enviar lembretes');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar lembretes';
      setError(message);
      
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const sendBulkReminders = useCallback(async (
    config: ReminderConfig = { hoursAhead: 24 }
  ): Promise<ReminderResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('interview-reminders', {
        body: config,
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.success) {
        const totalSent = data.results?.reduce((acc: number, r: ReminderResult) => 
          acc + (r.candidateEmail ? 1 : 0) + r.interviewerEmails, 0
        ) || 0;

        toast({
          title: 'Lembretes enviados em massa',
          description: `${totalSent} lembrete(s) enviado(s) para ${data.processed} entrevista(s)`,
        });

        return data.results || [];
      }

      throw new Error('Falha ao enviar lembretes');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar lembretes';
      setError(message);
      
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    sendReminder,
    sendBulkReminders,
    isLoading,
    error,
  };
}
