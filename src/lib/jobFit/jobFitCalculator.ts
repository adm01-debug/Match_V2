/**
 * @fileoverview Job Fit calculator - core logic
 */

import type {
  PerfilIdealComportamental,
  JobFitResult,
  JobFitNivel,
  JobFitDetalhe,
  CandidatoComparativo,
} from '@/types/jobFit';

export function calcularJobFit(
  candidato: CandidatoComparativo,
  perfilIdeal: PerfilIdealComportamental
): JobFitResult {
  const detalhes: JobFitDetalhe[] = [];
  const alertas: JobFitDetalhe[] = [];
  const dealbreakersViolados: string[] = [];
  
  let scoreDISC = 0;
  let scoreCompetencias = 0;
  let scoreResiliencia = 0;
  let scoreCerebroTrino = 0;
  
  if (candidato.discScores) {
    const discFit = calcularDISCFit(candidato.discScores, perfilIdeal.discIdeal);
    scoreDISC = discFit.score;
    detalhes.push(...discFit.matches);
    alertas.push(...discFit.alertas);
  }
  
  if (perfilIdeal.dealbreakers.discProfilesIncompativeis && candidato.discPrimario) {
    if (perfilIdeal.dealbreakers.discProfilesIncompativeis.includes(candidato.discPrimario)) {
      dealbreakersViolados.push(`Perfil DISC ${candidato.discPrimario} é incompatível com a vaga`);
    }
  }
  
  if (candidato.competencias) {
    const compFit = calcularCompetenciasFit(candidato.competencias, perfilIdeal.competencias);
    scoreCompetencias = compFit.score;
    detalhes.push(...compFit.matches);
    alertas.push(...compFit.alertas);
    
    perfilIdeal.dealbreakers.competenciasObrigatorias?.forEach(obrig => {
      const valorCandidato = candidato.competencias?.[obrig.competencia] || 0;
      if (valorCandidato < obrig.minimo) {
        dealbreakersViolados.push(`${obrig.competencia} (${valorCandidato}%) abaixo do mínimo obrigatório (${obrig.minimo}%)`);
      }
    });
  }
  
  if (candidato.resiliencia !== undefined && perfilIdeal.resilienciaMinima) {
    scoreResiliencia = Math.min(100, (candidato.resiliencia / perfilIdeal.resilienciaMinima) * 100);
    
    if (candidato.resiliencia >= perfilIdeal.resilienciaMinima) {
      detalhes.push({ categoria: 'Resiliência', nome: 'Nível de Resiliência', scoreCanditato: candidato.resiliencia, scoreIdeal: perfilIdeal.resilienciaMinima, diferenca: candidato.resiliencia - perfilIdeal.resilienciaMinima, status: 'match', comentario: 'Resiliência adequada para a posição' });
    } else {
      alertas.push({ categoria: 'Resiliência', nome: 'Nível de Resiliência', scoreCanditato: candidato.resiliencia, scoreIdeal: perfilIdeal.resilienciaMinima, diferenca: candidato.resiliencia - perfilIdeal.resilienciaMinima, status: 'critico', comentario: 'Resiliência abaixo do ideal para a posição' });
      if (perfilIdeal.dealbreakers.resilienciaMinimaObrigatoria && candidato.resiliencia < perfilIdeal.dealbreakers.resilienciaMinimaObrigatoria) {
        dealbreakersViolados.push(`Resiliência abaixo do mínimo obrigatório`);
      }
    }
  }
  
  if (candidato.cerebroDominante && perfilIdeal.cerebroDominante) {
    if (candidato.cerebroDominante === perfilIdeal.cerebroDominante) {
      scoreCerebroTrino = 100;
      detalhes.push({ categoria: 'Cérebro Trino', nome: 'Cérebro Dominante', scoreCanditato: 100, scoreIdeal: 100, diferenca: 0, status: 'match', comentario: `Cérebro ${candidato.cerebroDominante} alinhado com a vaga` });
    } else {
      scoreCerebroTrino = 60;
      alertas.push({ categoria: 'Cérebro Trino', nome: 'Cérebro Dominante', scoreCanditato: 60, scoreIdeal: 100, diferenca: -40, status: 'distante', comentario: `Cérebro ${candidato.cerebroDominante} difere do ideal (${perfilIdeal.cerebroDominante})` });
    }
  }
  
  const pesos = { disc: 0.35, competencias: 0.35, resiliencia: 0.20, cerebro: 0.10 };
  const scoreTotalFit = Math.round(
    scoreDISC * pesos.disc + scoreCompetencias * pesos.competencias +
    scoreResiliencia * pesos.resiliencia + scoreCerebroTrino * pesos.cerebro
  );
  
  const nivel = determinarNivel(scoreTotalFit, dealbreakersViolados.length);
  const recomendacao = determinarRecomendacao(nivel, dealbreakersViolados.length);
  const perguntasValidacao = gerarPerguntasValidacao(alertas, candidato);
  
  return {
    id: crypto.randomUUID(),
    candidatoId: candidato.id,
    candidatoNome: candidato.nome,
    vagaId: perfilIdeal.vagaId,
    vagaTitulo: perfilIdeal.vagaTitulo,
    perfilIdealId: perfilIdeal.id,
    scoreTotalFit,
    scoreDISC: Math.round(scoreDISC),
    scoreCompetencias: Math.round(scoreCompetencias),
    scoreResiliencia: Math.round(scoreResiliencia),
    scoreCerebroTrino: Math.round(scoreCerebroTrino),
    nivel,
    matchesPositivos: detalhes,
    alertas,
    dealbreakersViolados,
    resumoExecutivo: gerarResumoExecutivo(candidato, nivel, detalhes, alertas),
    recomendacao,
    justificativa: gerarJustificativa(detalhes, alertas, dealbreakersViolados),
    perguntasValidacao,
    areasAprofundar: alertas.slice(0, 3).map(a => a.nome),
    calculadoEm: new Date().toISOString()
  };
}

function calcularDISCFit(
  candidatoScores: { D: number; I: number; S: number; C: number },
  idealDISC: PerfilIdealComportamental['discIdeal']
): { score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[] } {
  const matches: JobFitDetalhe[] = [];
  const alertas: JobFitDetalhe[] = [];
  let totalScore = 0; let totalPeso = 0;
  
  const perfis = [
    { nome: 'Dominância', ideal: idealDISC.dominancia, valor: candidatoScores.D },
    { nome: 'Influência', ideal: idealDISC.influencia, valor: candidatoScores.I },
    { nome: 'Estabilidade', ideal: idealDISC.estabilidade, valor: candidatoScores.S },
    { nome: 'Conformidade', ideal: idealDISC.conformidade, valor: candidatoScores.C }
  ] as const;
  
  perfis.forEach(p => {
    const diferenca = Math.abs(p.valor - p.ideal.ideal);
    const dentroRange = p.valor >= p.ideal.min && p.valor <= p.ideal.max;
    const score = dentroRange ? 100 - (diferenca * 0.5) : Math.max(0, 100 - diferenca * 1.5);
    totalScore += score * p.ideal.peso;
    totalPeso += p.ideal.peso;
    
    const detalhe: JobFitDetalhe = {
      categoria: 'DISC', nome: p.nome, scoreCanditato: p.valor, scoreIdeal: p.ideal.ideal,
      diferenca: p.valor - p.ideal.ideal,
      status: dentroRange ? 'match' : diferenca <= 15 ? 'proximo' : diferenca <= 30 ? 'distante' : 'critico',
      comentario: dentroRange ? `${p.nome} dentro da faixa ideal` : `${p.nome} ${p.valor < p.ideal.ideal ? 'abaixo' : 'acima'} do ideal`
    };
    
    (dentroRange || diferenca <= 15 ? matches : alertas).push(detalhe);
  });
  
  return { score: totalPeso > 0 ? totalScore / totalPeso : 0, matches, alertas };
}

function calcularCompetenciasFit(
  candidatoComp: Record<string, number>,
  idealComp: PerfilIdealComportamental['competencias']
): { score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[] } {
  const matches: JobFitDetalhe[] = [];
  const alertas: JobFitDetalhe[] = [];
  let totalScore = 0; let count = 0;
  
  const nomes: Record<string, string> = {
    lideranca: 'Liderança', comunicacao: 'Comunicação', trabalhoEquipe: 'Trabalho em Equipe',
    resolucaoProblemas: 'Resolução de Problemas', adaptabilidade: 'Adaptabilidade',
    orientacaoResultados: 'Orientação a Resultados', criatividade: 'Criatividade',
    atencaoDetalhes: 'Atenção aos Detalhes', autonomia: 'Autonomia', empatia: 'Empatia'
  };
  
  Object.entries(idealComp).forEach(([key, idealValor]) => {
    if (idealValor === 0) return;
    const candidatoValor = candidatoComp[key] || 50;
    const diferenca = candidatoValor - idealValor;
    const score = Math.max(0, 100 - Math.abs(diferenca) * 2);
    totalScore += score; count++;
    
    const detalhe: JobFitDetalhe = {
      categoria: 'Competências', nome: nomes[key] || key, scoreCanditato: candidatoValor, scoreIdeal: idealValor,
      diferenca, status: Math.abs(diferenca) <= 10 ? 'match' : Math.abs(diferenca) <= 20 ? 'proximo' : 'distante',
      comentario: diferenca >= 0 ? `Atende ou supera o esperado` : `${Math.abs(diferenca)}% abaixo do esperado`
    };
    
    (diferenca >= -10 ? matches : alertas).push(detalhe);
  });
  
  return { score: count > 0 ? totalScore / count : 0, matches, alertas };
}

function determinarNivel(score: number, numDealbreakers: number): JobFitNivel {
  if (numDealbreakers > 0) return 'incompativel';
  if (score >= 85) return 'excelente';
  if (score >= 70) return 'alto';
  if (score >= 55) return 'moderado';
  if (score >= 40) return 'baixo';
  return 'incompativel';
}

function determinarRecomendacao(nivelFit: JobFitNivel, numDealbreakers: number): JobFitResult['recomendacao'] {
  if (numDealbreakers > 0) return 'nao_recomendado';
  switch (nivelFit) {
    case 'excelente': return 'contratar';
    case 'alto': return 'considerar';
    case 'moderado': return 'reserva';
    default: return 'nao_recomendado';
  }
}

function gerarResumoExecutivo(candidato: CandidatoComparativo, nivel: JobFitNivel, matches: JobFitDetalhe[], alertas: JobFitDetalhe[]): string {
  const nivelTexto = { excelente: 'excelente compatibilidade', alto: 'alta compatibilidade', moderado: 'compatibilidade moderada', baixo: 'baixa compatibilidade', incompativel: 'não é compatível' };
  return `${candidato.nome} apresenta ${nivelTexto[nivel]} com a vaga. Foram identificados ${matches.length} pontos positivos e ${alertas.length} áreas de atenção. ${candidato.discPrimario ? `Perfil comportamental predominante: ${candidato.discPrimario}.` : ''}`;
}

function gerarJustificativa(matches: JobFitDetalhe[], alertas: JobFitDetalhe[], dealbreakers: string[]): string {
  if (dealbreakers.length > 0) return `Não recomendado devido a: ${dealbreakers.join('; ')}.`;
  const pontosFortes = matches.slice(0, 2).map(m => m.nome).join(', ');
  const pontosAtencao = alertas.slice(0, 2).map(a => a.nome).join(', ');
  let texto = '';
  if (pontosFortes) texto += `Destaques positivos: ${pontosFortes}. `;
  if (pontosAtencao) texto += `Requer atenção: ${pontosAtencao}.`;
  return texto || 'Análise baseada nos resultados comportamentais disponíveis.';
}

function gerarPerguntasValidacao(alertas: JobFitDetalhe[], candidato: CandidatoComparativo): string[] {
  const perguntas: string[] = [];
  alertas.forEach(alerta => {
    if (alerta.categoria === 'DISC') {
      if (alerta.nome === 'Dominância' && alerta.diferenca > 0) perguntas.push('Como você equilibra assertividade com escuta ativa em situações de conflito?');
      if (alerta.nome === 'Estabilidade' && alerta.diferenca > 0) perguntas.push('Conte sobre uma situação em que precisou se adaptar rapidamente a mudanças');
    }
    if (alerta.categoria === 'Competências' && alerta.diferenca < -15) perguntas.push(`Quais experiências você tem que demonstram sua ${alerta.nome.toLowerCase()}?`);
  });
  if (candidato.stressResponse === 'fight') perguntas.push('Como você gerencia sua assertividade em momentos de pressão intensa?');
  return [...new Set(perguntas)].slice(0, 5);
}
