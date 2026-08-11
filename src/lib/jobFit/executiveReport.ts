/**
 * @fileoverview Executive report generation
 */

import type {
  JobFitResult,
  RedFlagDetectado,
  CandidatoComparativo,
  RelatorioExecutivo,
} from '@/types/jobFit';

export function gerarRelatorioExecutivo(
  candidato: CandidatoComparativo,
  jobFit?: JobFitResult,
  redFlags?: RedFlagDetectado[]
): RelatorioExecutivo {
  const scoreConsolidado = jobFit?.scoreTotalFit || calcularScoreConsolidado(candidato);
  const classificacao = determinarClassificacao(scoreConsolidado);
  
  return {
    id: crypto.randomUUID(),
    candidatoId: candidato.id,
    candidatoNome: candidato.nome,
    vagaId: jobFit?.vagaId,
    vagaTitulo: jobFit?.vagaTitulo,
    scoreFinalConsolidado: scoreConsolidado,
    classificacaoGeral: classificacao,
    manchetePrincipal: gerarManchete(candidato, classificacao, redFlags),
    secoes: {
      perfilComportamental: {
        titulo: 'Perfil Comportamental',
        conteudo: gerarSecaoPerfilComportamental(candidato),
        icone: 'User', cor: 'blue'
      },
      pontosFortes: {
        titulo: 'Pontos Fortes',
        conteudo: gerarSecaoPontosFortes(jobFit),
        icone: 'ThumbsUp', cor: 'green'
      },
      areasDesenvolvimento: {
        titulo: 'Áreas de Desenvolvimento',
        conteudo: gerarSecaoAreasDesenvolvimento(jobFit),
        icone: 'TrendingUp', cor: 'yellow'
      },
      fitCultural: {
        titulo: 'Fit Cultural',
        conteudo: jobFit ? `Score de compatibilidade: ${jobFit.scoreTotalFit}%` : 'Não calculado',
        icone: 'Heart', cor: 'pink'
      },
      riscos: {
        titulo: 'Riscos Identificados',
        conteudo: gerarSecaoRiscos(redFlags),
        icone: 'AlertTriangle', cor: 'red'
      },
      recomendacaoFinal: {
        titulo: 'Recomendação Final',
        conteudo: gerarSecaoRecomendacao(classificacao, redFlags),
        icone: 'CheckCircle', cor: 'emerald'
      }
    },
    dadosVisuais: {
      radarCompetencias: Object.entries(candidato.competencias || {}).map(([key, valor]) => ({
        label: key, valor: valor as number
      })),
      discChart: candidato.discScores || { D: 0, I: 0, S: 0, C: 0 },
      cerebroChart: candidato.cerebroScores,
      compatibilidadeVaga: jobFit?.scoreTotalFit
    },
    ferramentasAvaliadas: candidato.avaliacoesCompletadas,
    decisaoSugerida: determinarDecisao(classificacao, redFlags),
    confiancaDecisao: calcularConfianca(candidato),
    proximosPassos: gerarProximosPassos(classificacao, redFlags),
    geradoEm: new Date().toISOString()
  };
}

function calcularScoreConsolidado(candidato: CandidatoComparativo): number {
  let total = 0; let count = 0;
  if (candidato.discScores) {
    total += (candidato.discScores.D + candidato.discScores.I + candidato.discScores.S + candidato.discScores.C) / 4;
    count++;
  }
  if (candidato.resiliencia) { total += candidato.resiliencia; count++; }
  if (candidato.jobFitScore) { total += candidato.jobFitScore; count++; }
  return count > 0 ? Math.round(total / count) : 50;
}

function determinarClassificacao(score: number): RelatorioExecutivo['classificacaoGeral'] {
  if (score >= 85) return 'excepcional';
  if (score >= 70) return 'acima_media';
  if (score >= 55) return 'adequado';
  if (score >= 40) return 'abaixo_media';
  return 'nao_recomendado';
}

function gerarManchete(candidato: CandidatoComparativo, classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[]): string {
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0;
  if (numCriticos > 0) return `⚠️ ${candidato.nome} apresenta ${numCriticos} ponto(s) crítico(s) de atenção`;
  const manchetes = {
    excepcional: `🌟 ${candidato.nome} é um candidato excepcional para a posição`,
    acima_media: `✅ ${candidato.nome} demonstra perfil acima da média`,
    adequado: `📊 ${candidato.nome} atende aos requisitos da posição`,
    abaixo_media: `📉 ${candidato.nome} apresenta gaps significativos`,
    nao_recomendado: `❌ ${candidato.nome} não é recomendado para esta posição`
  };
  return manchetes[classificacao];
}

function gerarSecaoPerfilComportamental(cand: CandidatoComparativo): string {
  const partes: string[] = [];
  if (cand.discPrimario) partes.push(`Perfil DISC primário: ${cand.discPrimario}`);
  if (cand.cerebroDominante) partes.push(`Cérebro dominante: ${cand.cerebroDominante}`);
  if (cand.geracao) partes.push(`Perfil geracional: ${cand.geracao}`);
  if (cand.stressResponse) partes.push(`Resposta ao stress: ${cand.stressResponse}`);
  return partes.join('. ') || 'Avaliações comportamentais pendentes';
}

function gerarSecaoPontosFortes(jf?: JobFitResult): string {
  const fortes = jf?.matchesPositivos.slice(0, 5).map(m => m.nome) || [];
  return fortes.length > 0 ? fortes.join(', ') : 'Aguardando mais avaliações';
}

function gerarSecaoAreasDesenvolvimento(jf?: JobFitResult): string {
  const areas = jf?.alertas.slice(0, 5).map(a => a.nome) || [];
  return areas.length > 0 ? areas.join(', ') : 'Nenhuma área crítica identificada';
}

function gerarSecaoRiscos(redFlags?: RedFlagDetectado[]): string {
  if (!redFlags || redFlags.length === 0) return 'Nenhum risco significativo identificado';
  return redFlags.map(rf => `${rf.severidade.toUpperCase()}: ${rf.mensagem}`).join('. ');
}

function gerarSecaoRecomendacao(classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[]): string {
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0;
  if (numCriticos > 0) return 'Recomenda-se não prosseguir devido a riscos críticos identificados. Caso decida prosseguir, aprofunde especificamente nos pontos de risco em entrevista.';
  if (classificacao === 'excepcional') return 'Candidato altamente recomendado. Priorize para próximas etapas.';
  if (classificacao === 'acima_media') return 'Bom candidato. Recomenda-se entrevista para validar pontos específicos.';
  if (classificacao === 'adequado') return 'Candidato dentro do perfil. Considere para entrevista se não houver opções melhores.';
  return 'Não recomendado para esta posição no momento.';
}

function determinarDecisao(classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[]): RelatorioExecutivo['decisaoSugerida'] {
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0;
  if (numCriticos > 0) return 'recusar';
  switch (classificacao) {
    case 'excepcional': return 'aprovar';
    case 'acima_media': return 'entrevistar';
    case 'adequado': return 'reserva';
    default: return 'recusar';
  }
}

function calcularConfianca(candidato: CandidatoComparativo): number {
  return Math.min(95, 50 + candidato.avaliacoesCompletadas.length * 10);
}

function gerarProximosPassos(classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[]): string[] {
  const passos: string[] = [];
  if (classificacao === 'excepcional' || classificacao === 'acima_media') passos.push('Agendar entrevista com gestor da área');
  if (redFlags && redFlags.length > 0) {
    passos.push('Aprofundar pontos de atenção em entrevista comportamental');
    passos.push(...redFlags.slice(0, 2).map(rf => rf.perguntasEntrevista[0] || '').filter(Boolean));
  }
  if (classificacao === 'adequado' || classificacao === 'abaixo_media') passos.push('Comparar com outros candidatos antes de decidir');
  return passos.slice(0, 5);
}
