/**
 * @fileoverview Calculadora de Job Fit e Red Flags
 * @module lib/jobFitCalculator
 */

import type { DISCProfile } from '@/types/behavioral';
import type { StressResponse } from '@/types/advancedBehavioral';
import type {
  PerfilIdealComportamental,
  JobFitResult,
  JobFitNivel,
  JobFitDetalhe,
  RedFlagRule,
  RedFlagDetectado,
  CandidatoComparativo,
  RelatorioExecutivo,
} from '@/types/jobFit';

// ============================================================
// RED FLAG RULES - Regras de detecção de riscos
// ============================================================

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: 'rf_baixa_resiliencia_alta_pressao',
    nome: 'Baixa Resiliência em Cargo de Pressão',
    descricao: 'Candidato com baixa resiliência aplicando para vaga de alta pressão',
    categoria: 'resiliencia',
    severidade: 'critico',
    condicao: { tipo: 'combinacao_risco', parametros: { resilienciaMax: 40, vagaAltaPressao: true } },
    mensagem: 'Resiliência abaixo de 40% pode ser insuficiente para cargos de alta pressão',
    recomendacao: 'Avaliar histórico de situações de stress e estratégias de coping em entrevista',
    perguntasEntrevista: [
      'Conte sobre uma situação de extrema pressão e como você lidou',
      'O que você faz quando está sobrecarregado?',
      'Como você recarrega suas energias após períodos intensos?'
    ]
  },
  {
    id: 'rf_d_muito_alto_trabalho_equipe',
    nome: 'Dominância Alta em Cargo Colaborativo',
    descricao: 'Perfil D muito alto para vaga que exige trabalho em equipe',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'D', limiar: 80, contexto: 'colaborativo' } },
    mensagem: 'Perfil D acima de 80% pode gerar conflitos em ambientes altamente colaborativos',
    recomendacao: 'Verificar capacidade de ceder controle e ouvir opiniões diversas',
    perguntasEntrevista: [
      'Como você lida quando sua opinião é minoria no grupo?',
      'Descreva uma situação em que você mudou de ideia baseado em feedback da equipe',
      'Como você equilibra assertividade com colaboração?'
    ]
  },
  {
    id: 'rf_s_alto_ambiente_dinamico',
    nome: 'Estabilidade Alta em Ambiente Dinâmico',
    descricao: 'Perfil S muito alto para vaga com mudanças frequentes',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'S', limiar: 80, contexto: 'dinamico' } },
    mensagem: 'Perfil S acima de 80% pode ter dificuldade com mudanças frequentes',
    recomendacao: 'Avaliar adaptabilidade e tolerância a ambiguidade',
    perguntasEntrevista: [
      'Como você reage quando prioridades mudam de repente?',
      'Conte sobre uma mudança significativa que você enfrentou no trabalho',
      'O que te deixa desconfortável em ambientes de trabalho?'
    ]
  },
  {
    id: 'rf_c_muito_alto_cargo_agil',
    nome: 'Conformidade Alta em Cargo Ágil',
    descricao: 'Perfil C muito alto para vaga que exige velocidade',
    categoria: 'comportamental',
    severidade: 'baixo',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'C', limiar: 85, contexto: 'agil' } },
    mensagem: 'Perfil C acima de 85% pode gerar lentidão em decisões rápidas',
    recomendacao: 'Verificar capacidade de tomar decisões com informações incompletas',
    perguntasEntrevista: [
      'Como você decide quando não tem todas as informações?',
      'Você prefere entregar algo 80% perfeito rápido ou 100% perfeito devagar?'
    ]
  },
  {
    id: 'rf_fight_lideranca_servidora',
    nome: 'Resposta Fight em Liderança Servidora',
    descricao: 'Resposta agressiva ao stress em cargo de liderança servidora',
    categoria: 'stress',
    severidade: 'alto',
    condicao: { tipo: 'stress_alto', parametros: { response: 'fight', intensidade: 70 } },
    mensagem: 'Resposta "fight" intensa pode afetar relacionamento com equipe',
    recomendacao: 'Avaliar inteligência emocional e gestão de conflitos',
    perguntasEntrevista: [
      'Como você gerencia sua frustração quando liderados não performam?',
      'Descreva seu estilo de dar feedback negativo'
    ]
  },
  {
    id: 'rf_freeze_cargo_decisao',
    nome: 'Resposta Freeze em Cargo de Decisão',
    descricao: 'Tendência a paralisar sob stress em cargo que exige decisões rápidas',
    categoria: 'stress',
    severidade: 'alto',
    condicao: { tipo: 'stress_alto', parametros: { response: 'freeze', intensidade: 60 } },
    mensagem: 'Resposta "freeze" pode comprometer tomada de decisão sob pressão',
    recomendacao: 'Avaliar estratégias de decisão em cenários de crise',
    perguntasEntrevista: [
      'Como você decide quando está sob muita pressão?',
      'Conte sobre uma crise que você precisou resolver rapidamente'
    ]
  },
  {
    id: 'rf_reptiliano_dominante_estrategico',
    nome: 'Cérebro Reptiliano Dominante em Cargo Estratégico',
    descricao: 'Foco excessivo em sobrevivência/reatividade para cargo estratégico',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'combinacao_risco', parametros: { cerebroDominante: 'reptiliano', cargoTipo: 'estrategico' } },
    mensagem: 'Cérebro reptiliano dominante pode dificultar pensamento estratégico de longo prazo',
    recomendacao: 'Avaliar capacidade de planejamento e visão de futuro',
    perguntasEntrevista: [
      'Como você equilibra urgências do dia-a-dia com planejamento de longo prazo?',
      'Descreva sua abordagem para definir estratégia'
    ]
  },
  {
    id: 'rf_inconsistencia_resultados',
    nome: 'Inconsistência nos Resultados',
    descricao: 'Resultados contraditórios entre diferentes ferramentas',
    categoria: 'consistencia',
    severidade: 'baixo',
    condicao: { tipo: 'inconsistencia', parametros: { limiarVariancia: 30 } },
    mensagem: 'Resultados apresentam variação significativa entre ferramentas',
    recomendacao: 'Pode indicar autoconhecimento em desenvolvimento ou tentativa de manipular respostas',
    perguntasEntrevista: [
      'Como você se descreveria em 3 palavras?',
      'O que seus colegas diriam sobre você?'
    ]
  }
];

// ============================================================
// CÁLCULO DE JOB FIT
// ============================================================

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
  
  // 1. Calcular fit DISC
  if (candidato.discScores) {
    const discFit = calcularDISCFit(candidato.discScores, perfilIdeal.discIdeal);
    scoreDISC = discFit.score;
    detalhes.push(...discFit.matches);
    alertas.push(...discFit.alertas);
  }
  
  // 2. Verificar DISC dealbreakers
  if (perfilIdeal.dealbreakers.discProfilesIncompativeis && candidato.discPrimario) {
    if (perfilIdeal.dealbreakers.discProfilesIncompativeis.includes(candidato.discPrimario)) {
      dealbreakersViolados.push(`Perfil DISC ${candidato.discPrimario} é incompatível com a vaga`);
    }
  }
  
  // 3. Calcular fit competências
  if (candidato.competencias) {
    const compFit = calcularCompetenciasFit(candidato.competencias, perfilIdeal.competencias);
    scoreCompetencias = compFit.score;
    detalhes.push(...compFit.matches);
    alertas.push(...compFit.alertas);
    
    // Verificar competências obrigatórias
    perfilIdeal.dealbreakers.competenciasObrigatorias?.forEach(obrig => {
      const valorCandidato = candidato.competencias?.[obrig.competencia] || 0;
      if (valorCandidato < obrig.minimo) {
        dealbreakersViolados.push(
          `${obrig.competencia} (${valorCandidato}%) abaixo do mínimo obrigatório (${obrig.minimo}%)`
        );
      }
    });
  }
  
  // 4. Calcular fit resiliência
  if (candidato.resiliencia !== undefined && perfilIdeal.resilienciaMinima) {
    scoreResiliencia = Math.min(100, (candidato.resiliencia / perfilIdeal.resilienciaMinima) * 100);
    
    if (candidato.resiliencia >= perfilIdeal.resilienciaMinima) {
      detalhes.push({
        categoria: 'Resiliência',
        nome: 'Nível de Resiliência',
        scoreCanditato: candidato.resiliencia,
        scoreIdeal: perfilIdeal.resilienciaMinima,
        diferenca: candidato.resiliencia - perfilIdeal.resilienciaMinima,
        status: 'match',
        comentario: 'Resiliência adequada para a posição'
      });
    } else {
      alertas.push({
        categoria: 'Resiliência',
        nome: 'Nível de Resiliência',
        scoreCanditato: candidato.resiliencia,
        scoreIdeal: perfilIdeal.resilienciaMinima,
        diferenca: candidato.resiliencia - perfilIdeal.resilienciaMinima,
        status: 'critico',
        comentario: 'Resiliência abaixo do ideal para a posição'
      });
      
      if (perfilIdeal.dealbreakers.resilienciaMinimaObrigatoria && 
          candidato.resiliencia < perfilIdeal.dealbreakers.resilienciaMinimaObrigatoria) {
        dealbreakersViolados.push(`Resiliência abaixo do mínimo obrigatório`);
      }
    }
  }
  
  // 5. Calcular fit cérebro trino
  if (candidato.cerebroDominante && perfilIdeal.cerebroDominante) {
    if (candidato.cerebroDominante === perfilIdeal.cerebroDominante) {
      scoreCerebroTrino = 100;
      detalhes.push({
        categoria: 'Cérebro Trino',
        nome: 'Cérebro Dominante',
        scoreCanditato: 100,
        scoreIdeal: 100,
        diferenca: 0,
        status: 'match',
        comentario: `Cérebro ${candidato.cerebroDominante} alinhado com a vaga`
      });
    } else {
      scoreCerebroTrino = 60;
      alertas.push({
        categoria: 'Cérebro Trino',
        nome: 'Cérebro Dominante',
        scoreCanditato: 60,
        scoreIdeal: 100,
        diferenca: -40,
        status: 'distante',
        comentario: `Cérebro ${candidato.cerebroDominante} difere do ideal (${perfilIdeal.cerebroDominante})`
      });
    }
  }
  
  // Calcular score total (média ponderada)
  const pesos = { disc: 0.35, competencias: 0.35, resiliencia: 0.20, cerebro: 0.10 };
  const scoreTotalFit = Math.round(
    scoreDISC * pesos.disc +
    scoreCompetencias * pesos.competencias +
    scoreResiliencia * pesos.resiliencia +
    scoreCerebroTrino * pesos.cerebro
  );
  
  // Determinar nível e recomendação
  const nivel = determinarNivel(scoreTotalFit, dealbreakersViolados.length);
  const recomendacao = determinarRecomendacao(nivel, dealbreakersViolados.length);
  
  // Gerar perguntas de validação
  const perguntasValidacao = gerarPerguntasValidacao(alertas, candidato);
  const areasAprofundar = alertas.slice(0, 3).map(a => a.nome);
  
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
    justificativa: gerarJustificativa(nivel, detalhes, alertas, dealbreakersViolados),
    perguntasValidacao,
    areasAprofundar,
    calculadoEm: new Date().toISOString()
  };
}

function calcularDISCFit(
  candidatoScores: { D: number; I: number; S: number; C: number },
  idealDISC: PerfilIdealComportamental['discIdeal']
): { score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[] } {
  const matches: JobFitDetalhe[] = [];
  const alertas: JobFitDetalhe[] = [];
  let totalScore = 0;
  let totalPeso = 0;
  
  const perfis = [
    { key: 'D', nome: 'Dominância', ideal: idealDISC.dominancia, valor: candidatoScores.D },
    { key: 'I', nome: 'Influência', ideal: idealDISC.influencia, valor: candidatoScores.I },
    { key: 'S', nome: 'Estabilidade', ideal: idealDISC.estabilidade, valor: candidatoScores.S },
    { key: 'C', nome: 'Conformidade', ideal: idealDISC.conformidade, valor: candidatoScores.C }
  ] as const;
  
  perfis.forEach(p => {
    const diferenca = Math.abs(p.valor - p.ideal.ideal);
    const dentroRange = p.valor >= p.ideal.min && p.valor <= p.ideal.max;
    const score = dentroRange ? 100 - (diferenca * 0.5) : Math.max(0, 100 - diferenca * 1.5);
    
    totalScore += score * p.ideal.peso;
    totalPeso += p.ideal.peso;
    
    const detalhe: JobFitDetalhe = {
      categoria: 'DISC',
      nome: p.nome,
      scoreCanditato: p.valor,
      scoreIdeal: p.ideal.ideal,
      diferenca: p.valor - p.ideal.ideal,
      status: dentroRange ? 'match' : diferenca <= 15 ? 'proximo' : diferenca <= 30 ? 'distante' : 'critico',
      comentario: dentroRange
        ? `${p.nome} dentro da faixa ideal`
        : `${p.nome} ${p.valor < p.ideal.ideal ? 'abaixo' : 'acima'} do ideal`
    };
    
    if (dentroRange || diferenca <= 15) {
      matches.push(detalhe);
    } else {
      alertas.push(detalhe);
    }
  });
  
  return { score: totalPeso > 0 ? totalScore / totalPeso : 0, matches, alertas };
}

function calcularCompetenciasFit(
  candidatoComp: Record<string, number>,
  idealComp: PerfilIdealComportamental['competencias']
): { score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[] } {
  const matches: JobFitDetalhe[] = [];
  const alertas: JobFitDetalhe[] = [];
  let totalScore = 0;
  let count = 0;
  
  const nomes: Record<string, string> = {
    lideranca: 'Liderança',
    comunicacao: 'Comunicação',
    trabalhoEquipe: 'Trabalho em Equipe',
    resolucaoProblemas: 'Resolução de Problemas',
    adaptabilidade: 'Adaptabilidade',
    orientacaoResultados: 'Orientação a Resultados',
    criatividade: 'Criatividade',
    atencaoDetalhes: 'Atenção aos Detalhes',
    autonomia: 'Autonomia',
    empatia: 'Empatia'
  };
  
  Object.entries(idealComp).forEach(([key, idealValor]) => {
    if (idealValor === 0) return; // Competência não relevante para a vaga
    
    const candidatoValor = candidatoComp[key] || 50; // Default 50 se não avaliado
    const diferenca = candidatoValor - idealValor;
    const score = Math.max(0, 100 - Math.abs(diferenca) * 2);
    
    totalScore += score;
    count++;
    
    const detalhe: JobFitDetalhe = {
      categoria: 'Competências',
      nome: nomes[key] || key,
      scoreCanditato: candidatoValor,
      scoreIdeal: idealValor,
      diferenca,
      status: Math.abs(diferenca) <= 10 ? 'match' : Math.abs(diferenca) <= 20 ? 'proximo' : 'distante',
      comentario: diferenca >= 0
        ? `Atende ou supera o esperado`
        : `${Math.abs(diferenca)}% abaixo do esperado`
    };
    
    if (diferenca >= -10) {
      matches.push(detalhe);
    } else {
      alertas.push(detalhe);
    }
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

function determinarRecomendacao(
  nivelFit: JobFitNivel,
  numDealbreakers: number
): JobFitResult['recomendacao'] {
  if (numDealbreakers > 0) return 'nao_recomendado';
  switch (nivelFit) {
    case 'excelente': return 'contratar';
    case 'alto': return 'considerar';
    case 'moderado': return 'reserva';
    default: return 'nao_recomendado';
  }
}

function gerarResumoExecutivo(
  candidato: CandidatoComparativo,
  nivel: JobFitNivel,
  matches: JobFitDetalhe[],
  alertas: JobFitDetalhe[]
): string {
  const nivelTexto = {
    excelente: 'excelente compatibilidade',
    alto: 'alta compatibilidade',
    moderado: 'compatibilidade moderada',
    baixo: 'baixa compatibilidade',
    incompativel: 'não é compatível'
  };
  
  const numMatches = matches.length;
  const numAlertas = alertas.length;
  
  return `${candidato.nome} apresenta ${nivelTexto[nivel]} com a vaga. ` +
    `Foram identificados ${numMatches} pontos positivos e ${numAlertas} áreas de atenção. ` +
    (candidato.discPrimario ? `Perfil comportamental predominante: ${candidato.discPrimario}.` : '');
}

function gerarJustificativa(
  _nivel: JobFitNivel,
  matches: JobFitDetalhe[],
  alertas: JobFitDetalhe[],
  dealbreakers: string[]
): string {
  if (dealbreakers.length > 0) {
    return `Não recomendado devido a: ${dealbreakers.join('; ')}.`;
  }
  
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
      if (alerta.nome === 'Dominância' && alerta.diferenca > 0) {
        perguntas.push('Como você equilibra assertividade com escuta ativa em situações de conflito?');
      }
      if (alerta.nome === 'Estabilidade' && alerta.diferenca > 0) {
        perguntas.push('Conte sobre uma situação em que precisou se adaptar rapidamente a mudanças');
      }
    }
    if (alerta.categoria === 'Competências' && alerta.diferenca < -15) {
      perguntas.push(`Quais experiências você tem que demonstram sua ${alerta.nome.toLowerCase()}?`);
    }
  });
  
  if (candidato.stressResponse === 'fight') {
    perguntas.push('Como você gerencia sua assertividade em momentos de pressão intensa?');
  }
  
  return [...new Set(perguntas)].slice(0, 5);
}

// ============================================================
// DETECÇÃO DE RED FLAGS
// ============================================================

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
      
      // Check resiliencia + alta pressão
      if (params.resilienciaMax !== undefined && params.vagaAltaPressao) {
        if ((candidato.resiliencia || 100) <= params.resilienciaMax && contexto['altaPressao']) {
          return { evidence: { resiliencia: candidato.resiliencia, contexto: 'alta_pressao' } };
        }
      }
      
      // Check cérebro + cargo estratégico
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

// ============================================================
// GERAÇÃO DE RELATÓRIO EXECUTIVO
// ============================================================

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
        icone: 'User',
        cor: 'blue'
      },
      pontosFortes: {
        titulo: 'Pontos Fortes',
        conteudo: gerarSecaoPontosFortes(candidato, jobFit),
        icone: 'ThumbsUp',
        cor: 'green'
      },
      areasDesenvolvimento: {
        titulo: 'Áreas de Desenvolvimento',
        conteudo: gerarSecaoAreasDesenvolvimento(candidato, jobFit),
        icone: 'TrendingUp',
        cor: 'yellow'
      },
      fitCultural: {
        titulo: 'Fit Cultural',
        conteudo: jobFit ? `Score de compatibilidade: ${jobFit.scoreTotalFit}%` : 'Não calculado',
        icone: 'Heart',
        cor: 'pink'
      },
      riscos: {
        titulo: 'Riscos Identificados',
        conteudo: gerarSecaoRiscos(redFlags),
        icone: 'AlertTriangle',
        cor: 'red'
      },
      recomendacaoFinal: {
        titulo: 'Recomendação Final',
        conteudo: gerarSecaoRecomendacao(classificacao, jobFit, redFlags),
        icone: 'CheckCircle',
        cor: 'emerald'
      }
    },
    
    dadosVisuais: {
      radarCompetencias: Object.entries(candidato.competencias || {}).map(([key, valor]) => ({
        label: key,
        valor: valor as number
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
  let total = 0;
  let count = 0;
  
  if (candidato.discScores) {
    total += (candidato.discScores.D + candidato.discScores.I + candidato.discScores.S + candidato.discScores.C) / 4;
    count++;
  }
  if (candidato.resiliencia) {
    total += candidato.resiliencia;
    count++;
  }
  if (candidato.jobFitScore) {
    total += candidato.jobFitScore;
    count++;
  }
  
  return count > 0 ? Math.round(total / count) : 50;
}

function determinarClassificacao(score: number): RelatorioExecutivo['classificacaoGeral'] {
  if (score >= 85) return 'excepcional';
  if (score >= 70) return 'acima_media';
  if (score >= 55) return 'adequado';
  if (score >= 40) return 'abaixo_media';
  return 'nao_recomendado';
}

function gerarManchete(
  candidato: CandidatoComparativo,
  classificacao: RelatorioExecutivo['classificacaoGeral'],
  redFlags?: RedFlagDetectado[]
): string {
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0;
  
  if (numCriticos > 0) {
    return `⚠️ ${candidato.nome} apresenta ${numCriticos} ponto(s) crítico(s) de atenção`;
  }
  
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
  
  if (cand.discPrimario) {
    partes.push(`Perfil DISC primário: ${cand.discPrimario}`);
  }
  if (cand.cerebroDominante) {
    partes.push(`Cérebro dominante: ${cand.cerebroDominante}`);
  }
  if (cand.geracao) {
    partes.push(`Perfil geracional: ${cand.geracao}`);
  }
  if (cand.stressResponse) {
    partes.push(`Resposta ao stress: ${cand.stressResponse}`);
  }
  
  return partes.join('. ') || 'Avaliações comportamentais pendentes';
}

function gerarSecaoPontosFortes(_cand: CandidatoComparativo, jf?: JobFitResult): string {
  const fortes = jf?.matchesPositivos.slice(0, 5).map(m => m.nome) || [];
  return fortes.length > 0 ? fortes.join(', ') : 'Aguardando mais avaliações';
}

function gerarSecaoAreasDesenvolvimento(_cand: CandidatoComparativo, jf?: JobFitResult): string {
  const areas = jf?.alertas.slice(0, 5).map(a => a.nome) || [];
  return areas.length > 0 ? areas.join(', ') : 'Nenhuma área crítica identificada';
}

function gerarSecaoRiscos(redFlags?: RedFlagDetectado[]): string {
  if (!redFlags || redFlags.length === 0) {
    return 'Nenhum risco significativo identificado';
  }
  return redFlags.map(rf => `${rf.severidade.toUpperCase()}: ${rf.mensagem}`).join('. ');
}

function gerarSecaoRecomendacao(
  classificacao: RelatorioExecutivo['classificacaoGeral'],
  _jf?: JobFitResult,
  redFlags?: RedFlagDetectado[]
): string {
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0;
  
  if (numCriticos > 0) {
    return 'Recomenda-se não prosseguir devido a riscos críticos identificados. ' +
      'Caso decida prosseguir, aprofunde especificamente nos pontos de risco em entrevista.';
  }
  
  if (classificacao === 'excepcional') {
    return 'Candidato altamente recomendado. Priorize para próximas etapas.';
  }
  if (classificacao === 'acima_media') {
    return 'Bom candidato. Recomenda-se entrevista para validar pontos específicos.';
  }
  if (classificacao === 'adequado') {
    return 'Candidato dentro do perfil. Considere para entrevista se não houver opções melhores.';
  }
  
  return 'Não recomendado para esta posição no momento.';
}

function determinarDecisao(
  classificacao: RelatorioExecutivo['classificacaoGeral'],
  redFlags?: RedFlagDetectado[]
): RelatorioExecutivo['decisaoSugerida'] {
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
  const numAvaliacoes = candidato.avaliacoesCompletadas.length;
  // Mais avaliações = mais confiança
  return Math.min(95, 50 + numAvaliacoes * 10);
}

function gerarProximosPassos(
  classificacao: RelatorioExecutivo['classificacaoGeral'],
  redFlags?: RedFlagDetectado[]
): string[] {
  const passos: string[] = [];
  
  if (classificacao === 'excepcional' || classificacao === 'acima_media') {
    passos.push('Agendar entrevista com gestor da área');
  }
  
  if (redFlags && redFlags.length > 0) {
    passos.push('Aprofundar pontos de atenção em entrevista comportamental');
    passos.push(...redFlags.slice(0, 2).map(rf => rf.perguntasEntrevista[0] || '').filter(Boolean));
  }
  
  if (classificacao === 'adequado' || classificacao === 'abaixo_media') {
    passos.push('Comparar com outros candidatos antes de decidir');
  }
  
  return passos.slice(0, 5);
}
