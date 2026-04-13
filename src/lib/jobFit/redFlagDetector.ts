/**
 * @fileoverview Red Flag detection logic
 */

import type { DISCProfile } from '@/types/behavioral';
import type { StressResponse } from '@/types/advancedBehavioral';
import type { RedFlagRule, RedFlagDetectado, CandidatoComparativo } from '@/types/jobFit';
import { RED_FLAG_RULES } from './redFlagRules';

export { RED_FLAG_RULES };

export function detectarRedFlags(
  candidato: CandidatoComparativo,
  contextoCargo: {
    altaPressao?: boolean;
    colaborativo?: boolean;
    dinamico?: boolean;
    agil?: boolean;
    estrategico?: boolean;
    liderancaServidora?: boolean;
    decisaoRapida?: boolean;
  }
): RedFlagDetectado[] {
  const flagsDetectados: RedFlagDetectado[] = [];
  
  RED_FLAG_RULES.forEach(rule => {
    const detectado = avaliarRegra(rule, candidato, contextoCargo);
    if (detectado) {
      flagsDetectados.push({
        ruleId: rule.id,
        ruleName: rule.nome,
        severidade: rule.severidade,
        categoria: rule.categoria,
        mensagem: rule.mensagem,
        recomendacao: rule.recomendacao,
        perguntasEntrevista: rule.perguntasEntrevista,
        dadosEvidence: detectado.evidence,
        detectadoEm: new Date().toISOString()
      });
    }
  });
  
  return flagsDetectados.sort((a, b) => {
    const ordem = { critico: 0, alto: 1, medio: 2, baixo: 3 };
    return ordem[a.severidade] - ordem[b.severidade];
  });
}

function avaliarRegra(
  rule: RedFlagRule,
  candidato: CandidatoComparativo,
  contexto: Record<string, boolean | undefined>
): { evidence: Record<string, unknown> } | null {
  switch (rule.condicao.tipo) {
    case 'combinacao_risco': {
      const params = rule.condicao.parametros as { resilienciaMax?: number; vagaAltaPressao?: boolean; cerebroDominante?: string; cargoTipo?: string };
      if (params.resilienciaMax !== undefined && params.vagaAltaPressao) {
        if ((candidato.resiliencia || 100) <= params.resilienciaMax && contexto['altaPressao']) {
          return { evidence: { resiliencia: candidato.resiliencia, contexto: 'alta_pressao' } };
        }
      }
      if (params.cerebroDominante && params.cargoTipo === 'estrategico') {
        if (candidato.cerebroDominante === params.cerebroDominante && contexto['estrategico']) {
          return { evidence: { cerebroDominante: candidato.cerebroDominante, contexto: 'estrategico' } };
        }
      }
      return null;
    }
    case 'disc_baixo': {
      const params = rule.condicao.parametros as { perfil: DISCProfile; limiar: number; contexto: string };
      const valor = candidato.discScores?.[params.perfil] || 0;
      const contextoAtivo = contexto[params.contexto as keyof typeof contexto];
      if (valor >= params.limiar && contextoAtivo) {
        return { evidence: { perfil: params.perfil, valor, limiar: params.limiar } };
      }
      return null;
    }
    case 'stress_alto': {
      const params = rule.condicao.parametros as { response: StressResponse; intensidade: number };
      if (candidato.stressResponse === params.response) {
        return { evidence: { stressResponse: candidato.stressResponse } };
      }
      return null;
    }
    default:
      return null;
  }
}
