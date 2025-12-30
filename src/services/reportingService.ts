import { supabase } from "@/integrations/supabase/client";

export interface ReportMetrics {
  totalCandidates: number;
  totalVagas: number;
  totalContratados: number;
  candidatesByStage: Record<string, number>;
  conversionRates: Record<string, number>;
  avgTimeToHire: number;
  avgTimePerStage: Record<string, number>;
  candidatesBySource: Record<string, number>;
  hiresBySource: Record<string, number>;
  recruiterMetrics: RecruiterMetrics[];
  timelineData: TimelineDataPoint[];
}

export interface RecruiterMetrics {
  id: string;
  name: string;
  totalCandidates: number;
  totalHires: number;
  avgTimeToHire: number;
  conversionRate: number;
}

export interface TimelineDataPoint {
  date: string;
  candidates: number;
  interviews: number;
  hires: number;
}

export interface ReportFilters {
  dateRange: { from: Date; to: Date };
  vagas?: string[];
  recrutadores?: string[];
  fontes?: string[];
  etapas?: string[];
}

class ReportingService {
  async getMetrics(filters: ReportFilters): Promise<ReportMetrics> {
    const { dateRange } = filters;
    
    // Total de candidatos no período
    const { count: totalCandidates } = await supabase
      .from("candidatos")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dateRange.from.toISOString())
      .lte("created_at", dateRange.to.toISOString());

    // Total de vagas
    const { count: totalVagas } = await supabase
      .from("vagas")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dateRange.from.toISOString());

    // Candidaturas por etapa
    const { data: candidaturas } = await supabase
      .from("candidaturas")
      .select("etapa_atual, fonte, created_at, updated_at")
      .gte("created_at", dateRange.from.toISOString())
      .lte("created_at", dateRange.to.toISOString());

    const candidatesByStage: Record<string, number> = {};
    const candidatesBySource: Record<string, number> = {};
    let totalContratados = 0;

    candidaturas?.forEach(c => {
      candidatesByStage[c.etapa_atual] = (candidatesByStage[c.etapa_atual] || 0) + 1;
      if (c.fonte) {
        candidatesBySource[c.fonte] = (candidatesBySource[c.fonte] || 0) + 1;
      }
      if (c.etapa_atual === "contratado") totalContratados++;
    });

    // Calcular taxas de conversão
    const stages = ["triagem", "entrevista_rh", "entrevista_tecnica", "entrevista_gestor", "proposta", "contratado"];
    const conversionRates: Record<string, number> = {};
    for (let i = 1; i < stages.length; i++) {
      const prev = candidatesByStage[stages[i - 1]] || 0;
      const curr = candidatesByStage[stages[i]] || 0;
      conversionRates[`${stages[i - 1]}_to_${stages[i]}`] = prev > 0 ? (curr / prev) * 100 : 0;
    }

    // Tempo médio por etapa (simulado)
    const avgTimePerStage: Record<string, number> = {
      triagem: 2,
      entrevista_rh: 5,
      entrevista_tecnica: 7,
      entrevista_gestor: 4,
      proposta: 3,
    };

    const avgTimeToHire = Object.values(avgTimePerStage).reduce((a, b) => a + b, 0);

    // Timeline data
    const timelineData = this.generateTimelineData(candidaturas || [], dateRange);

    // Métricas por recrutador (simulado)
    const recruiterMetrics: RecruiterMetrics[] = [
      { id: "1", name: "Maria Silva", totalCandidates: 45, totalHires: 8, avgTimeToHire: 18, conversionRate: 17.8 },
      { id: "2", name: "João Santos", totalCandidates: 38, totalHires: 6, avgTimeToHire: 22, conversionRate: 15.8 },
      { id: "3", name: "Ana Costa", totalCandidates: 52, totalHires: 10, avgTimeToHire: 15, conversionRate: 19.2 },
    ];

    return {
      totalCandidates: totalCandidates || 0,
      totalVagas: totalVagas || 0,
      totalContratados,
      candidatesByStage,
      conversionRates,
      avgTimeToHire,
      avgTimePerStage,
      candidatesBySource,
      hiresBySource: {},
      recruiterMetrics,
      timelineData,
    };
  }

  private generateTimelineData(candidaturas: any[], dateRange: { from: Date; to: Date }): TimelineDataPoint[] {
    const data: TimelineDataPoint[] = [];
    const current = new Date(dateRange.from);
    
    while (current <= dateRange.to) {
      const dateStr = current.toISOString().split("T")[0];
      const dayData = candidaturas.filter(c => c.created_at?.startsWith(dateStr));
      
      data.push({
        date: dateStr,
        candidates: dayData.length,
        interviews: Math.floor(dayData.length * 0.4),
        hires: Math.floor(dayData.length * 0.1),
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return data;
  }

  async getFunnelData(filters: ReportFilters) {
    const metrics = await this.getMetrics(filters);
    const stages = ["triagem", "entrevista_rh", "entrevista_tecnica", "entrevista_gestor", "proposta", "contratado"];
    const labels: Record<string, string> = {
      triagem: "Triagem",
      entrevista_rh: "Entrevista RH",
      entrevista_tecnica: "Entrevista Técnica",
      entrevista_gestor: "Entrevista Gestor",
      proposta: "Proposta",
      contratado: "Contratado",
    };

    return stages.map(stage => ({
      name: labels[stage] || stage,
      value: metrics.candidatesByStage[stage] || 0,
    }));
  }
}

export const reportingService = new ReportingService();
