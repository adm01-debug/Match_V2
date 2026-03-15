// AI Service — wraps Lovable AI models via Edge Functions
import { supabase } from '@/integrations/supabase/client';

export const aiService = {
  async analyzeResume(resumeText: string) {
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { resumeText },
    });
    if (error) throw error;
    return data;
  },

  async calculateMatchScore(candidatoId: string, vagaId: string) {
    const { data, error } = await supabase.functions.invoke('match-score', {
      body: { candidatoId, vagaId },
    });
    if (error) throw error;
    return data;
  },

  async generateScorecard(processoId: string) {
    const { data, error } = await supabase.functions.invoke('generate-scorecard', {
      body: { processoId },
    });
    if (error) throw error;
    return data;
  },

  async generateInsights(context: string) {
    console.log('[AIService] Generate insights for:', context);
    return { insights: [] };
  },
};
