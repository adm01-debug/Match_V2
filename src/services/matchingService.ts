// Matching Service — Candidate-Job matching logic
import { supabase } from '@/integrations/supabase/client';

export const matchingService = {
  calculateSkillMatch(candidateSkills: string[], jobSkills: string[]) {
    if (!jobSkills.length) return { score: 100, matched: [], missing: [], extra: candidateSkills };
    const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
    const normalizedJob = jobSkills.map((s) => s.toLowerCase().trim());

    const matched = normalizedJob.filter((s) => normalizedCandidate.includes(s));
    const missing = normalizedJob.filter((s) => !normalizedCandidate.includes(s));
    const extra = normalizedCandidate.filter((s) => !normalizedJob.includes(s));
    const score = Math.round((matched.length / normalizedJob.length) * 100);

    return { score, matched, missing, extra };
  },

  async findBestCandidates(vagaId: string, limit: number = 10) {
    const { data: scores } = await supabase
      .from('match_scores')
      .select('*, candidatos(*)')
      .eq('vaga_id', vagaId)
      .order('score_total', { ascending: false })
      .limit(limit);
    return scores || [];
  },

  getRecommendation(score: number): string {
    if (score >= 80) return 'Forte Recomendação';
    if (score >= 60) return 'Recomendado';
    if (score >= 40) return 'Moderado';
    return 'Baixa Compatibilidade';
  },
};
