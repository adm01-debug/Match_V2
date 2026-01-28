/**
 * @fileoverview Calculadoras de perfil para Big Five, MBTI e Eneagrama
 * Inclui normalização, detecção de subdimensões e validação de consistência
 */

import {
  BigFiveResult,
  BigFiveDimension,
  BigFiveFacet,
  MBTIResult,
  MBTIType,
  MBTIDichotomyScore,
  MBTICognitiveFunction,
  EnneagramResult,
  EnneagramType,
  EnneagramWing,
  EnneagramTriad,
  EnneagramInstinct,
  EnneagramHealthLevel,
  EnneagramTypeScore,
  PersonalityAnswer,
  MBTI_TYPE_INFO,
  ENNEAGRAM_TYPE_INFO,
  BIG_FIVE_DIMENSION_INFO,
} from '@/types/personality';

import {
  BIG_FIVE_QUESTIONS,
  MBTI_QUESTIONS,
  ENNEAGRAM_QUESTIONS,
} from '@/data/personalityQuestions';

// ================================
// UTILIDADES COMUNS
// ================================

function calculateConsistency(answers: PersonalityAnswer[], validationPairs: Record<string, string>): number {
  let consistentPairs = 0;
  let totalPairs = 0;

  Object.entries(validationPairs).forEach(([questionId, pairId]) => {
    const answer1 = answers.find(a => a.questionId === questionId);
    const answer2 = answers.find(a => a.questionId === pairId);
    
    if (answer1 && answer2) {
      totalPairs++;
      // Para questões reversas, esperamos que sejam inversamente correlacionadas
      const diff = Math.abs(answer1.value - (6 - answer2.value)); // Assumindo escala 1-5
      if (diff <= 1) consistentPairs++;
    }
  });

  return totalPairs > 0 ? Math.round((consistentPairs / totalPairs) * 100) : 100;
}

function getLevel(score: number): 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto' {
  if (score <= 20) return 'muito_baixo';
  if (score <= 40) return 'baixo';
  if (score <= 60) return 'medio';
  if (score <= 80) return 'alto';
  return 'muito_alto';
}

function normalizeScore(raw: number, min: number, max: number): number {
  return Math.round(((raw - min) / (max - min)) * 100);
}

// ================================
// BIG FIVE CALCULATOR
// ================================

export function calculateBigFiveResult(answers: PersonalityAnswer[]): BigFiveResult {
  const dimensions: Record<string, { scores: number[]; facets: Record<string, number[]> }> = {
    openness: { scores: [], facets: {} },
    conscientiousness: { scores: [], facets: {} },
    extraversion: { scores: [], facets: {} },
    agreeableness: { scores: [], facets: {} },
    neuroticism: { scores: [], facets: {} },
  };

  // Processar respostas
  BIG_FIVE_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;

    let value = answer.value;
    if (question.reverse) {
      value = 6 - value; // Inverter para escala 1-5
    }

    const dim = dimensions[question.dimension];
    if (dim) {
      dim.scores.push(value);
      
      if (question.facet) {
        const facetArray = dim.facets[question.facet];
        if (!facetArray) {
          dim.facets[question.facet] = [value];
        } else {
          facetArray.push(value);
        }
      }
    }
  });

  // Calcular dimensões
  const dimensionResults: BigFiveDimension[] = Object.entries(dimensions).map(([dimId, data]) => {
    const avgScore = data.scores.length > 0
      ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      : 3;
    
    const normalizedScore = normalizeScore(avgScore, 1, 5);
    const info = BIG_FIVE_DIMENSION_INFO[dimId] || { label: dimId, description: '', highTraits: [], lowTraits: [] };

    // Calcular facetas
    const facets: BigFiveFacet[] = Object.entries(data.facets).map(([facetId, scores]) => {
      const facetAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const facetScore = normalizeScore(facetAvg, 1, 5);
      
      return {
        name: formatFacetName(facetId),
        score: facetScore,
        description: getFacetDescription(dimId, facetId, facetScore),
      };
    });

    const level = getLevel(normalizedScore);
    const isHigh = normalizedScore > 60;

    return {
      dimension: dimId as BigFiveDimension['dimension'],
      label: info?.label || dimId,
      score: normalizedScore,
      percentile: calculatePercentile(normalizedScore),
      level,
      facets,
      strengths: isHigh ? (info?.highTraits || []) : (info?.lowTraits || []),
      challenges: isHigh 
        ? ['Pode parecer desorganizado para alguns (O)', 'Muito idealista (A)']
        : ['Pode parecer inflexível (C)', 'Pode parecer distante (E)'],
    };
  });

  // Identificar traços dominantes
  const sortedDims = [...dimensionResults].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50));
  const dominantTraits = sortedDims.slice(0, 3).map(d => {
    const prefix = d.score > 60 ? 'Alto' : d.score < 40 ? 'Baixo' : 'Médio';
    return `${prefix} ${d.label}`;
  });

  // Gerar sumário
  const summaryParts: string[] = [];
  dimensionResults.forEach(dim => {
    if (dim.score > 70) {
      summaryParts.push(`muito ${dim.label.toLowerCase()}`);
    } else if (dim.score < 30) {
      const opposite = BIG_FIVE_DIMENSION_INFO[dim.dimension]?.lowTraits[0]?.toLowerCase() || '';
      summaryParts.push(opposite);
    }
  });

  // Calcular consistência
  const validationPairs: Record<string, string> = {};
  BIG_FIVE_QUESTIONS.forEach(q => {
    if (q.validationPair) {
      validationPairs[q.id] = q.validationPair;
    }
  });
  const consistencyScore = calculateConsistency(answers, validationPairs);

  return {
    dimensions: dimensionResults,
    dominantTraits,
    personalitySummary: generatePersonalitySummary(dimensionResults),
    workStyle: generateWorkStyle(dimensionResults),
    communicationStyle: generateCommunicationStyle(dimensionResults),
    leadershipStyle: generateLeadershipStyle(dimensionResults),
    teamRole: generateTeamRole(dimensionResults),
    stressResponse: generateStressResponse(dimensionResults),
    developmentAreas: generateDevelopmentAreas(dimensionResults),
    consistencyScore,
    confidence: Math.min(consistencyScore, 95),
    completedAt: new Date().toISOString(),
  };
}

function formatFacetName(facetId: string): string {
  const names: Record<string, string> = {
    'imagination': 'Imaginação',
    'artistic': 'Interesses Artísticos',
    'emotionality': 'Emotividade',
    'adventurousness': 'Aventura',
    'intellect': 'Intelecto',
    'liberalism': 'Liberalismo',
    'self-efficacy': 'Autoeficácia',
    'orderliness': 'Ordem',
    'dutifulness': 'Senso de Dever',
    'achievement': 'Busca por Realização',
    'self-discipline': 'Autodisciplina',
    'cautiousness': 'Cautela',
    'friendliness': 'Amigabilidade',
    'gregariousness': 'Gregário',
    'assertiveness': 'Assertividade',
    'activity-level': 'Nível de Atividade',
    'excitement-seeking': 'Busca por Emoções',
    'cheerfulness': 'Alegria',
    'trust': 'Confiança',
    'morality': 'Moralidade',
    'altruism': 'Altruísmo',
    'cooperation': 'Cooperação',
    'modesty': 'Modéstia',
    'sympathy': 'Simpatia',
    'anxiety': 'Ansiedade',
    'anger': 'Raiva',
    'depression': 'Depressão',
    'self-consciousness': 'Autoconsciência',
    'immoderation': 'Imoderação',
    'vulnerability': 'Vulnerabilidade',
  };
  return names[facetId] || facetId;
}

function getFacetDescription(_dimension: string, _facet: string, score: number): string {
  const level = score > 70 ? 'alta' : score < 30 ? 'baixa' : 'moderada';
  return `Tendência ${level} nesta faceta`;
}

function calculatePercentile(score: number): number {
  // Simulação simples de percentil baseado no score normalizado
  return Math.min(99, Math.max(1, score + Math.floor(Math.random() * 10) - 5));
}

function generatePersonalitySummary(dimensions: BigFiveDimension[]): string {
  const high = dimensions.filter(d => d.score > 65);
  const low = dimensions.filter(d => d.score < 35);
  
  let summary = 'Você possui um perfil ';
  
  if (high.length > 0) {
    summary += `com destaque em ${high.map(d => d.label).join(' e ')}. `;
  }
  
  if (low.length > 0) {
    summary += `Apresenta menor intensidade em ${low.map(d => d.label).join(' e ')}.`;
  }
  
  return summary || 'Você possui um perfil equilibrado entre as dimensões de personalidade.';
}

function generateWorkStyle(dimensions: BigFiveDimension[]): string {
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const O = dimensions.find(d => d.dimension === 'openness')?.score || 50;
  
  if (C > 70 && E < 40) return 'Metódico e focado, prefere trabalhar de forma independente e estruturada.';
  if (E > 70 && C > 60) return 'Colaborativo e organizado, lidera bem projetos em equipe.';
  if (O > 70) return 'Criativo e inovador, busca constantemente novas abordagens.';
  return 'Adaptável e equilibrado, ajusta seu estilo conforme a situação.';
}

function generateCommunicationStyle(dimensions: BigFiveDimension[]): string {
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50;
  
  if (E > 70 && A > 70) return 'Expressivo e empático, conecta-se facilmente com outros.';
  if (E > 70 && A < 40) return 'Direto e assertivo, comunica-se com clareza e objetividade.';
  if (E < 40 && A > 70) return 'Atencioso e reservado, ouve mais do que fala.';
  return 'Equilibrado, adapta o estilo de comunicação ao contexto.';
}

function generateLeadershipStyle(dimensions: BigFiveDimension[]): string {
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50;
  
  if (E > 70 && C > 70) return 'Líder carismático e organizado, inspira e estrutura a equipe.';
  if (C > 70 && A > 70) return 'Líder servidor, focado em apoiar o desenvolvimento da equipe.';
  if (E > 70 && A < 50) return 'Líder visionário, define direção com autoridade.';
  return 'Liderança situacional, adapta-se às necessidades do momento.';
}

function generateTeamRole(dimensions: BigFiveDimension[]): string {
  const O = dimensions.find(d => d.dimension === 'openness')?.score || 50;
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  
  if (O > 70) return 'Inovador - gera ideias e soluções criativas';
  if (C > 70) return 'Implementador - transforma ideias em ação';
  if (E > 70) return 'Coordenador - conecta pessoas e recursos';
  return 'Especialista - contribui com conhecimento técnico';
}

function generateStressResponse(dimensions: BigFiveDimension[]): string {
  const N = dimensions.find(d => d.dimension === 'neuroticism')?.score || 50;
  
  if (N > 70) return 'Pode experimentar estresse intensamente. Recomenda-se técnicas de regulação emocional.';
  if (N < 30) return 'Geralmente resiliente sob pressão. Mantém a calma em situações difíceis.';
  return 'Resposta moderada ao estresse, com capacidade de recuperação.';
}

function generateDevelopmentAreas(dimensions: BigFiveDimension[]): string[] {
  const areas: string[] = [];
  
  dimensions.forEach(dim => {
    if (dim.dimension === 'neuroticism' && dim.score > 60) {
      areas.push('Desenvolver técnicas de gerenciamento de estresse');
    }
    if (dim.dimension === 'conscientiousness' && dim.score < 40) {
      areas.push('Trabalhar organização e gestão do tempo');
    }
    if (dim.dimension === 'agreeableness' && dim.score < 40) {
      areas.push('Praticar empatia e colaboração');
    }
    if (dim.dimension === 'openness' && dim.score < 40) {
      areas.push('Explorar novas perspectivas e ideias');
    }
    if (dim.dimension === 'extraversion' && dim.score < 30) {
      areas.push('Desenvolver habilidades de networking');
    }
  });
  
  return areas.length > 0 ? areas : ['Manter desenvolvimento contínuo em todas as áreas'];
}

// ================================
// MBTI CALCULATOR
// ================================

export function calculateMBTIResult(answers: PersonalityAnswer[]): MBTIResult {
  const dichotomyScores: Record<string, { left: number[]; right: number[] }> = {
    EI: { left: [], right: [] },
    SN: { left: [], right: [] },
    TF: { left: [], right: [] },
    JP: { left: [], right: [] },
  };

  // Processar respostas
  MBTI_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;

    const dim = dichotomyScores[question.dimension];
    if (!dim) return;

    if (question.reverse) {
      dim.right.push(answer.value);
    } else {
      dim.left.push(answer.value);
    }
  });

  // Calcular dicotomias
  const dichotomies: MBTIDichotomyScore[] = [
    calculateDichotomy('EI', 'Extroversão', 'Introversão', dichotomyScores['EI']!),
    calculateDichotomy('SN', 'Sensação', 'Intuição', dichotomyScores['SN']!),
    calculateDichotomy('TF', 'Pensamento', 'Sentimento', dichotomyScores['TF']!),
    calculateDichotomy('JP', 'Julgamento', 'Percepção', dichotomyScores['JP']!),
  ];

  // Determinar tipo
  const type = (
    (dichotomies[0]?.dominantSide || 'E') +
    (dichotomies[1]?.dominantSide || 'S') +
    (dichotomies[2]?.dominantSide || 'T') +
    (dichotomies[3]?.dominantSide || 'J')
  ) as MBTIType;

  const typeInfo = MBTI_TYPE_INFO[type];

  // Calcular funções cognitivas
  const cognitiveFunctions = calculateCognitiveFunctions(type);

  // Calcular consistência
  const avgClarity = dichotomies.reduce((sum, d) => sum + d.clarity, 0) / 4;

  return {
    type,
    typeName: typeInfo?.name || type,
    typeNickname: typeInfo?.nickname || '',
    dichotomies,
    cognitiveFunctions,
    description: typeInfo?.description || '',
    strengths: getMBTIStrengths(type),
    weaknesses: getMBTIWeaknesses(type),
    careerSuggestions: getMBTICareerSuggestions(type),
    communicationTips: getMBTICommunicationTips(type),
    workEnvironment: getMBTIWorkEnvironment(type),
    leadershipStyle: getMBTILeadershipStyle(type),
    conflictStyle: getMBTIConflictStyle(type),
    stressPatterns: getMBTIStressPatterns(type),
    growthAreas: getMBTIGrowthAreas(type),
    compatibility: {
      bestMatches: getMBTIBestMatches(type),
      challengingMatches: getMBTIChallengingMatches(type),
    },
    consistencyScore: Math.round(avgClarity),
    confidence: Math.round(avgClarity * 0.95),
    completedAt: new Date().toISOString(),
  };
}

function calculateDichotomy(
  dimension: 'EI' | 'SN' | 'TF' | 'JP',
  leftLabel: string,
  rightLabel: string,
  scores: { left: number[]; right: number[] }
): MBTIDichotomyScore {
  const leftAvg = scores.left.length > 0
    ? scores.left.reduce((a, b) => a + b, 0) / scores.left.length
    : 4;
  const rightAvg = scores.right.length > 0
    ? scores.right.reduce((a, b) => a + b, 0) / scores.right.length
    : 4;

  const leftNorm = normalizeScore(leftAvg, 1, 7);
  const rightNorm = normalizeScore(rightAvg, 1, 7);
  
  const totalScore = Math.round((100 - leftNorm + rightNorm) / 2);
  const clarity = Math.abs(totalScore - 50) * 2;

  const leftLetter = dimension[0] as 'E' | 'S' | 'T' | 'J';
  const rightLetter = dimension[1] as 'I' | 'N' | 'F' | 'P';
  const dominantSide = totalScore < 50 ? leftLetter : rightLetter;

  return {
    dimension,
    leftLabel,
    rightLabel,
    leftScore: totalScore,
    clarity,
    dominantSide,
  };
}

function calculateCognitiveFunctions(type: MBTIType): MBTICognitiveFunction[] {
  // Mapeamento simplificado de funções cognitivas por tipo
  const functionStacks: Record<MBTIType, string[]> = {
    INTJ: ['Ni', 'Te', 'Fi', 'Se'],
    INTP: ['Ti', 'Ne', 'Si', 'Fe'],
    ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
    ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
    INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
    INFP: ['Fi', 'Ne', 'Si', 'Te'],
    ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
    ENFP: ['Ne', 'Fi', 'Te', 'Si'],
    ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
    ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
    ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
    ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
    ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
    ISFP: ['Fi', 'Se', 'Ni', 'Te'],
    ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
    ESFP: ['Se', 'Fi', 'Te', 'Ni'],
  };

  const functionLabels: Record<string, string> = {
    Ni: 'Intuição Introvertida',
    Ne: 'Intuição Extrovertida',
    Si: 'Sensação Introvertida',
    Se: 'Sensação Extrovertida',
    Ti: 'Pensamento Introvertido',
    Te: 'Pensamento Extrovertido',
    Fi: 'Sentimento Introvertido',
    Fe: 'Sentimento Extrovertido',
  };

  const roles: ('dominant' | 'auxiliary' | 'tertiary' | 'inferior')[] = ['dominant', 'auxiliary', 'tertiary', 'inferior'];
  const stack = functionStacks[type] || ['Ni', 'Te', 'Fi', 'Se'];

  return stack.map((func, index) => ({
    function: func,
    label: functionLabels[func] || func,
    strength: Math.max(20, 100 - (index * 25)),
    description: getFunctionDescription(func),
    role: roles[index] || 'inferior' as const,
  }));
}

function getFunctionDescription(func: string): string {
  const descriptions: Record<string, string> = {
    Ni: 'Foco em padrões futuros e insights profundos',
    Ne: 'Exploração de possibilidades e conexões',
    Si: 'Memória detalhada e respeito pela tradição',
    Se: 'Atenção ao momento presente e experiências',
    Ti: 'Análise lógica interna e frameworks',
    Te: 'Organização eficiente e tomada de decisão objetiva',
    Fi: 'Valores pessoais profundos e autenticidade',
    Fe: 'Harmonia social e consideração pelos outros',
  };
  return descriptions[func] || '';
}

function getMBTIStrengths(type: MBTIType): string[] {
  const strengths: Record<string, string[]> = {
    INTJ: ['Pensamento estratégico', 'Visão de longo prazo', 'Independência', 'Determinação'],
    INTP: ['Análise profunda', 'Criatividade lógica', 'Objetividade', 'Conhecimento amplo'],
    ENTJ: ['Liderança natural', 'Eficiência', 'Confiança', 'Planejamento estratégico'],
    ENTP: ['Inovação', 'Debate intelectual', 'Adaptabilidade', 'Visão de possibilidades'],
    INFJ: ['Empatia profunda', 'Visão', 'Integridade', 'Dedicação'],
    INFP: ['Criatividade', 'Valores fortes', 'Empatia', 'Autenticidade'],
    ENFJ: ['Carisma', 'Inspiração', 'Diplomacia', 'Organização'],
    ENFP: ['Entusiasmo', 'Criatividade', 'Empatia', 'Flexibilidade'],
    ISTJ: ['Confiabilidade', 'Meticulosidade', 'Disciplina', 'Comprometimento'],
    ISFJ: ['Lealdade', 'Praticidade', 'Cuidado', 'Observação'],
    ESTJ: ['Organização', 'Liderança prática', 'Responsabilidade', 'Diligência'],
    ESFJ: ['Hospitalidade', 'Cooperação', 'Lealdade', 'Harmonia'],
    ISTP: ['Praticidade', 'Análise', 'Calma sob pressão', 'Habilidade técnica'],
    ISFP: ['Sensibilidade artística', 'Gentileza', 'Flexibilidade', 'Autenticidade'],
    ESTP: ['Ação rápida', 'Persuasão', 'Observação', 'Pragmatismo'],
    ESFP: ['Energia', 'Praticidade', 'Generosidade', 'Otimismo'],
  };
  return strengths[type] || [];
}

function getMBTIWeaknesses(type: MBTIType): string[] {
  const weaknesses: Record<string, string[]> = {
    INTJ: ['Pode parecer arrogante', 'Impaciente com ineficiência', 'Dificuldade com emoções'],
    INTP: ['Pode parecer distante', 'Dificuldade com decisões', 'Pode ser excessivamente crítico'],
    ENTJ: ['Pode ser dominador', 'Impaciente', 'Insensível às emoções'],
    ENTP: ['Pode ser argumentativo', 'Dificuldade em finalizar', 'Pode ser insensível'],
    INFJ: ['Perfeccionista', 'Muito reservado', 'Sensível demais às críticas'],
    INFP: ['Muito idealista', 'Pode ser impraticável', 'Evita conflitos'],
    ENFJ: ['Pode ser muito idealista', 'Dificuldade em receber críticas', 'Pode ser manipulador'],
    ENFP: ['Dificuldade com rotina', 'Pode ser desorganizado', 'Pensa demais'],
    ISTJ: ['Pode ser inflexível', 'Resistente a mudanças', 'Muito rígido'],
    ISFJ: ['Evita conflitos', 'Dificuldade em dizer não', 'Pode ser submisso'],
    ESTJ: ['Pode ser inflexível', 'Muito focado em regras', 'Insensível'],
    ESFJ: ['Pode ser dependente de aprovação', 'Dificuldade com críticas', 'Muito tradicional'],
    ISTP: ['Pode parecer insensível', 'Dificuldade com compromissos', 'Reservado demais'],
    ISFP: ['Pode ser imprevisível', 'Evita planejamento', 'Muito sensível'],
    ESTP: ['Impaciente', 'Pode correr riscos demais', 'Pode ser insensível'],
    ESFP: ['Dificuldade com planejamento', 'Pode ser superficial', 'Busca atenção'],
  };
  return weaknesses[type] || [];
}

function getMBTICareerSuggestions(type: MBTIType): string[] {
  const careers: Record<string, string[]> = {
    INTJ: ['Estrategista', 'Cientista', 'Analista de Sistemas', 'Advogado', 'Engenheiro'],
    INTP: ['Programador', 'Pesquisador', 'Analista', 'Professor universitário', 'Filósofo'],
    ENTJ: ['CEO', 'Consultor estratégico', 'Advogado corporativo', 'Empreendedor'],
    ENTP: ['Empreendedor', 'Advogado', 'Consultor', 'Cientista', 'Marketeiro'],
    INFJ: ['Psicólogo', 'Escritor', 'Conselheiro', 'RH estratégico', 'Coach'],
    INFP: ['Escritor', 'Artista', 'Psicólogo', 'Designer', 'Terapeuta'],
    ENFJ: ['Professor', 'Treinador', 'RH', 'Político', 'Coach'],
    ENFP: ['Jornalista', 'Consultor', 'Psicólogo', 'Artista', 'Empreendedor'],
    ISTJ: ['Contador', 'Auditor', 'Gerente de projetos', 'Militar', 'Engenheiro'],
    ISFJ: ['Enfermeiro', 'Professor', 'Administrador', 'Assistente social', 'RH'],
    ESTJ: ['Gerente', 'Administrador', 'Juiz', 'Oficial militar', 'Diretor financeiro'],
    ESFJ: ['Enfermeiro', 'Professor', 'Vendedor', 'Assistente administrativo', 'RH'],
    ISTP: ['Engenheiro', 'Técnico', 'Piloto', 'Mecânico', 'Atleta'],
    ISFP: ['Designer', 'Artista', 'Veterinário', 'Cozinheiro', 'Fisioterapeuta'],
    ESTP: ['Empreendedor', 'Vendedor', 'Policial', 'Corretor', 'Atleta'],
    ESFP: ['Ator', 'Vendedor', 'Designer', 'Relações públicas', 'Coach'],
  };
  return careers[type] || [];
}

function getMBTICommunicationTips(_type: MBTIType): string[] {
  return [
    'Adapte seu estilo ao interlocutor',
    'Seja claro e direto quando necessário',
    'Ouça ativamente antes de responder',
    'Valide as emoções dos outros',
  ];
}

function getMBTIWorkEnvironment(type: MBTIType): string {
  const EI = type[0];
  const JP = type[3];
  
  if (EI === 'I' && JP === 'J') return 'Ambiente estruturado e quieto, com autonomia para trabalhar';
  if (EI === 'I' && JP === 'P') return 'Ambiente flexível e quieto, com liberdade para explorar';
  if (EI === 'E' && JP === 'J') return 'Ambiente organizado com muita interação e colaboração';
  return 'Ambiente dinâmico e social, com variedade de tarefas';
}

function getMBTILeadershipStyle(type: MBTIType): string {
  const TF = type[2];
  const EI = type[0];
  
  if (EI === 'E' && TF === 'T') return 'Liderança direta e orientada a resultados';
  if (EI === 'E' && TF === 'F') return 'Liderança carismática e inspiradora';
  if (EI === 'I' && TF === 'T') return 'Liderança estratégica e analítica';
  return 'Liderança empática e orientada a pessoas';
}

function getMBTIConflictStyle(type: MBTIType): string {
  const TF = type[2];
  return TF === 'T' 
    ? 'Aborda conflitos de forma lógica e objetiva, focando na solução'
    : 'Aborda conflitos considerando sentimentos e buscando harmonia';
}

function getMBTIStressPatterns(_type: MBTIType): string[] {
  return [
    'Pode se isolar quando sobrecarregado',
    'Tendência a trabalhar demais sob pressão',
    'Pode se tornar mais crítico consigo e com outros',
  ];
}

function getMBTIGrowthAreas(_type: MBTIType): string[] {
  return [
    'Desenvolver a função inferior',
    'Praticar flexibilidade cognitiva',
    'Buscar perspectivas diferentes',
    'Equilibrar trabalho e vida pessoal',
  ];
}

function getMBTIBestMatches(type: MBTIType): MBTIType[] {
  const matches: Record<MBTIType, MBTIType[]> = {
    INTJ: ['ENFP', 'ENTP'],
    INTP: ['ENTJ', 'ENFJ'],
    ENTJ: ['INTP', 'INFP'],
    ENTP: ['INFJ', 'INTJ'],
    INFJ: ['ENTP', 'ENFP'],
    INFP: ['ENTJ', 'ENFJ'],
    ENFJ: ['INFP', 'INTP'],
    ENFP: ['INTJ', 'INFJ'],
    ISTJ: ['ESFP', 'ESTP'],
    ISFJ: ['ESTP', 'ESFP'],
    ESTJ: ['ISFP', 'ISTP'],
    ESFJ: ['ISTP', 'ISFP'],
    ISTP: ['ESFJ', 'ESTJ'],
    ISFP: ['ESTJ', 'ESFJ'],
    ESTP: ['ISFJ', 'ISTJ'],
    ESFP: ['ISTJ', 'ISFJ'],
  };
  return matches[type] || [];
}

function getMBTIChallengingMatches(type: MBTIType): MBTIType[] {
  // Tipos com todas as letras opostas podem ser desafiadores
  const opposite = type.split('').map((l, i) => {
    if (i === 0) return l === 'E' ? 'I' : 'E';
    if (i === 1) return l === 'S' ? 'N' : 'S';
    if (i === 2) return l === 'T' ? 'F' : 'T';
    return l === 'J' ? 'P' : 'J';
  }).join('') as MBTIType;
  
  return [opposite];
}

// ================================
// ENNEAGRAM CALCULATOR
// ================================

export function calculateEnneagramResult(answers: PersonalityAnswer[]): EnneagramResult {
  const typeScores: Record<number, number[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
  };

  // Processar respostas
  ENNEAGRAM_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;

    const typeNum = parseInt(question.dimension);
    if (typeScores[typeNum]) {
      typeScores[typeNum].push(answer.value);
    }
  });

  // Calcular scores por tipo
  const typeResults: EnneagramTypeScore[] = Object.entries(typeScores).map(([typeStr, scores]) => {
    const typeNum = parseInt(typeStr) as EnneagramType;
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 1;
    const normalizedScore = normalizeScore(avgScore, 1, 5);
    
    return {
      type: typeNum,
      name: ENNEAGRAM_TYPE_INFO[typeNum]?.name || `Tipo ${typeNum}`,
      score: normalizedScore,
      isCore: false,
      isWing: false,
    };
  }).sort((a, b) => b.score - a.score);

  // Determinar tipo core e asas
  const firstResult = typeResults[0];
  if (!firstResult) {
    throw new Error('No type results calculated');
  }
  const coreType = firstResult.type;
  firstResult.isCore = true;

  // Determinar asa (tipos adjacentes)
  const leftWing = (coreType === 1 ? 9 : coreType - 1) as EnneagramType;
  const rightWing = (coreType === 9 ? 1 : coreType + 1) as EnneagramType;
  
  const leftScore = typeResults.find(t => t.type === leftWing)?.score || 0;
  const rightScore = typeResults.find(t => t.type === rightWing)?.score || 0;
  const wing: EnneagramType = leftScore > rightScore ? leftWing : rightWing;
  const wingInfluence = Math.max(leftScore, rightScore);

  const wingResult = typeResults.find(t => t.type === wing);
  if (wingResult) wingResult.isWing = true;

  const wingLabel = `${coreType}w${wing}` as EnneagramWing;

  // Determinar tríade
  const triad = getEnneagramTriad(coreType);
  
  // Determinar instinto dominante (simplificado)
  const dominantInstinct = calculateDominantInstinct(answers);
  
  // Determinar nível de saúde
  const healthLevel = calculateHealthLevel(firstResult.score);

  // Obter informações do tipo
  const typeInfo = ENNEAGRAM_TYPE_INFO[coreType] || { name: `Tipo ${coreType}`, description: '', motivation: '', fear: '' };

  return {
    coreType,
    typeName: typeInfo.name || `Tipo ${coreType}`,
    typeDescription: typeInfo.description || '',
    wing: wingLabel,
    wingInfluence,
    triad,
    dominantInstinct,
    instinctStack: [dominantInstinct, 'social', 'sexual'].filter((v, i, a) => a.indexOf(v) === i) as EnneagramInstinct[],
    healthLevel,
    typeScores: typeResults,
    integration: getIntegrationPattern(coreType),
    coreMotivation: typeInfo.motivation || '',
    coreFear: typeInfo.fear || '',
    coreDesire: getEnneagramDesire(coreType),
    basicVice: getEnneagramVice(coreType),
    basicVirtue: getEnneagramVirtue(coreType),
    strengths: getEnneagramStrengths(coreType),
    challenges: getEnneagramChallenges(coreType),
    blindSpots: getEnneagramBlindSpots(coreType),
    communicationStyle: getEnneagramCommunicationStyle(coreType),
    leadershipStyle: getEnneagramLeadershipStyle(coreType),
    conflictBehavior: getEnneagramConflictBehavior(coreType),
    careerFit: getEnneagramCareerFit(coreType),
    developmentPath: getEnneagramDevelopmentPath(coreType),
    compatibleTypes: getEnneagramCompatibleTypes(coreType),
    challengingTypes: getEnneagramChallengingTypes(coreType),
    consistencyScore: calculateEnneagramConsistency(typeResults),
    confidence: Math.min(95, firstResult.score),
    completedAt: new Date().toISOString(),
  };
}

function getEnneagramTriad(type: EnneagramType): EnneagramTriad {
  if ([8, 9, 1].includes(type)) return 'instintivo';
  if ([2, 3, 4].includes(type)) return 'emocional';
  return 'mental';
}

function calculateDominantInstinct(_answers: PersonalityAnswer[]): EnneagramInstinct {
  // Simplificado - retorna baseado em padrões gerais
  return 'autopreservacao';
}

function calculateHealthLevel(coreScore: number): EnneagramHealthLevel {
  if (coreScore > 85) return 'muito_saudavel';
  if (coreScore > 70) return 'saudavel';
  if (coreScore > 50) return 'medio';
  if (coreScore > 30) return 'nao_saudavel';
  return 'muito_nao_saudavel';
}

function getIntegrationPattern(type: EnneagramType) {
  const patterns: Record<EnneagramType, { stress: EnneagramType; growth: EnneagramType }> = {
    1: { stress: 4, growth: 7 },
    2: { stress: 8, growth: 4 },
    3: { stress: 9, growth: 6 },
    4: { stress: 2, growth: 1 },
    5: { stress: 7, growth: 8 },
    6: { stress: 3, growth: 9 },
    7: { stress: 1, growth: 5 },
    8: { stress: 5, growth: 2 },
    9: { stress: 6, growth: 3 },
  };

  const pattern = patterns[type];
  return {
    stressDirection: pattern.stress,
    growthDirection: pattern.growth,
    stressBehaviors: [`Manifesta características negativas do tipo ${pattern.stress}`],
    growthBehaviors: [`Desenvolve qualidades positivas do tipo ${pattern.growth}`],
  };
}

function getEnneagramDesire(type: EnneagramType): string {
  const desires: Record<EnneagramType, string> = {
    1: 'Ser bom, íntegro e ter razão',
    2: 'Ser amado e apreciado',
    3: 'Ser valioso e admirado',
    4: 'Ser único e autêntico',
    5: 'Ser competente e capaz',
    6: 'Ter segurança e suporte',
    7: 'Ser feliz e satisfeito',
    8: 'Se proteger e estar no controle',
    9: 'Ter paz interior e harmonia',
  };
  return desires[type];
}

function getEnneagramVice(type: EnneagramType): string {
  const vices: Record<EnneagramType, string> = {
    1: 'Ira (raiva reprimida)',
    2: 'Orgulho',
    3: 'Vaidade (engano)',
    4: 'Inveja',
    5: 'Avareza',
    6: 'Medo (ansiedade)',
    7: 'Gula',
    8: 'Luxúria (excesso)',
    9: 'Preguiça (acomodação)',
  };
  return vices[type];
}

function getEnneagramVirtue(type: EnneagramType): string {
  const virtues: Record<EnneagramType, string> = {
    1: 'Serenidade',
    2: 'Humildade',
    3: 'Autenticidade',
    4: 'Equanimidade',
    5: 'Desapego',
    6: 'Coragem',
    7: 'Sobriedade',
    8: 'Inocência',
    9: 'Ação',
  };
  return virtues[type];
}

function getEnneagramStrengths(type: EnneagramType): string[] {
  const strengths: Record<EnneagramType, string[]> = {
    1: ['Ético', 'Organizado', 'Justo', 'Dedicado', 'Íntegro'],
    2: ['Generoso', 'Empático', 'Caloroso', 'Prestativo', 'Atencioso'],
    3: ['Eficiente', 'Adaptável', 'Motivador', 'Ambicioso', 'Produtivo'],
    4: ['Criativo', 'Autêntico', 'Profundo', 'Expressivo', 'Sensível'],
    5: ['Analítico', 'Perspicaz', 'Objetivo', 'Inovador', 'Independente'],
    6: ['Leal', 'Responsável', 'Atencioso', 'Preparado', 'Colaborativo'],
    7: ['Otimista', 'Versátil', 'Entusiasta', 'Criativo', 'Espontâneo'],
    8: ['Direto', 'Protetor', 'Corajoso', 'Decidido', 'Líder natural'],
    9: ['Pacificador', 'Receptivo', 'Estável', 'Diplomático', 'Harmonioso'],
  };
  return strengths[type];
}

function getEnneagramChallenges(type: EnneagramType): string[] {
  const challenges: Record<EnneagramType, string[]> = {
    1: ['Crítico demais', 'Perfeccionista', 'Inflexível', 'Ressentido'],
    2: ['Manipulador', 'Possessivo', 'Martir', 'Dependente'],
    3: ['Workaholic', 'Superficial', 'Calculista', 'Competitivo demais'],
    4: ['Melancólico', 'Invejoso', 'Temperamental', 'Centrado em si'],
    5: ['Isolado', 'Avarento', 'Arrogante', 'Distante'],
    6: ['Ansioso', 'Indeciso', 'Desconfiado', 'Reativo'],
    7: ['Impulsivo', 'Disperso', 'Evitativo', 'Superficial'],
    8: ['Intimidador', 'Controlador', 'Confrontador', 'Impaciente'],
    9: ['Passivo', 'Complacente', 'Procrastinador', 'Autoesquecido'],
  };
  return challenges[type];
}

function getEnneagramBlindSpots(type: EnneagramType): string[] {
  const blindSpots: Record<EnneagramType, string[]> = {
    1: ['Não percebe sua própria raiva', 'Rigidez vista como virtude'],
    2: ['Não reconhece suas próprias necessidades', 'Ajuda com expectativas ocultas'],
    3: ['Desconexão com sentimentos reais', 'Confunde imagem com identidade'],
    4: ['Drama pode afastar pessoas', 'Foco no que falta, não no que tem'],
    5: ['Isolamento visto como autossuficiência', 'Conhecimento ≠ ação'],
    6: ['Busca de segurança pode paralisar', 'Projeção de medos nos outros'],
    7: ['Evitação de dor impede crescimento', 'Otimismo excessivo nega realidade'],
    8: ['Vulnerabilidade vista como fraqueza', 'Intensidade pode assustar'],
    9: ['Passividade confundida com paz', 'Fusão com outros perde identidade'],
  };
  return blindSpots[type];
}

function getEnneagramCommunicationStyle(type: EnneagramType): string {
  const styles: Record<EnneagramType, string> = {
    1: 'Direto, focado em melhorias e padrões',
    2: 'Caloroso, focado em relacionamentos e necessidades',
    3: 'Eficiente, orientado a objetivos e resultados',
    4: 'Expressivo, focado em autenticidade e profundidade',
    5: 'Conciso, focado em dados e análise',
    6: 'Cauteloso, focado em riscos e contingências',
    7: 'Entusiasta, focado em possibilidades e opções',
    8: 'Assertivo, direto e sem rodeios',
    9: 'Harmonioso, buscando consenso e entendimento',
  };
  return styles[type];
}

function getEnneagramLeadershipStyle(type: EnneagramType): string {
  const styles: Record<EnneagramType, string> = {
    1: 'Líder ético que define padrões elevados',
    2: 'Líder servidor que desenvolve pessoas',
    3: 'Líder orientado a resultados que motiva pela performance',
    4: 'Líder criativo que inspira autenticidade',
    5: 'Líder estratégico que analisa e planeja',
    6: 'Líder colaborativo que constrói equipes coesas',
    7: 'Líder visionário que inspira com possibilidades',
    8: 'Líder decisivo que protege e mobiliza',
    9: 'Líder inclusivo que busca consenso',
  };
  return styles[type];
}

function getEnneagramConflictBehavior(type: EnneagramType): string {
  const behaviors: Record<EnneagramType, string> = {
    1: 'Confronta com base em princípios, pode parecer rígido',
    2: 'Evita conflitos diretos, pode ser passivo-agressivo',
    3: 'Foca em resolver eficientemente, pode ignorar emoções',
    4: 'Reage emocionalmente, pode dramatizar',
    5: 'Se retrai para analisar, pode parecer indiferente',
    6: 'Busca apoio do grupo, pode escalar ou evitar',
    7: 'Tenta minimizar ou mudar de assunto',
    8: 'Confronta diretamente, pode escalar rapidamente',
    9: 'Evita a todo custo, pode se desligar',
  };
  return behaviors[type];
}

function getEnneagramCareerFit(type: EnneagramType): string[] {
  const careers: Record<EnneagramType, string[]> = {
    1: ['Auditor', 'Juiz', 'Editor', 'Consultor de qualidade', 'Professor'],
    2: ['RH', 'Enfermeiro', 'Assistente social', 'Coach', 'Terapeuta'],
    3: ['Vendas', 'Marketing', 'Executivo', 'Empreendedor', 'Consultor'],
    4: ['Artista', 'Designer', 'Escritor', 'Terapeuta', 'Músico'],
    5: ['Pesquisador', 'Analista', 'Cientista', 'Programador', 'Professor'],
    6: ['Gestor de riscos', 'Advogado', 'Policial', 'Gerente de projetos', 'RH'],
    7: ['Empreendedor', 'Publicitário', 'Consultor', 'Viajante', 'Apresentador'],
    8: ['CEO', 'Político', 'Advogado', 'Empreendedor', 'Diretor'],
    9: ['Mediador', 'Diplomata', 'RH', 'Terapeuta', 'Bibliotecário'],
  };
  return careers[type];
}

function getEnneagramDevelopmentPath(type: EnneagramType): string[] {
  const paths: Record<EnneagramType, string[]> = {
    1: ['Aceitar imperfeição', 'Desenvolver paciência', 'Expressar emoções', 'Relaxar padrões'],
    2: ['Reconhecer próprias necessidades', 'Pedir ajuda', 'Estabelecer limites', 'Amor próprio'],
    3: ['Conectar com sentimentos', 'Valorizar ser sobre fazer', 'Autenticidade', 'Desacelerar'],
    4: ['Apreciar o ordinário', 'Agir apesar das emoções', 'Estabilidade', 'Gratidão'],
    5: ['Engajar com o mundo', 'Compartilhar conhecimento', 'Conexão emocional', 'Generosidade'],
    6: ['Confiar em si mesmo', 'Tomar decisões', 'Enfrentar medos', 'Autonomia'],
    7: ['Completar projetos', 'Processar emoções', 'Compromisso', 'Profundidade'],
    8: ['Mostrar vulnerabilidade', 'Suavizar abordagem', 'Ouvir mais', 'Paciência'],
    9: ['Expressar opiniões', 'Tomar iniciativa', 'Enfrentar conflitos', 'Priorizar-se'],
  };
  return paths[type];
}

function getEnneagramCompatibleTypes(type: EnneagramType): EnneagramType[] {
  const compatible: Record<EnneagramType, EnneagramType[]> = {
    1: [7, 9, 2],
    2: [4, 8, 9],
    3: [6, 9, 1],
    4: [2, 5, 9],
    5: [4, 8, 9],
    6: [3, 9, 8],
    7: [1, 5, 9],
    8: [2, 5, 6],
    9: [3, 6, 1],
  };
  return compatible[type] || [];
}

function getEnneagramChallengingTypes(type: EnneagramType): EnneagramType[] {
  const challenging: Record<EnneagramType, EnneagramType[]> = {
    1: [4, 8],
    2: [5, 1],
    3: [4, 8],
    4: [1, 3],
    5: [2, 7],
    6: [7, 5],
    7: [4, 6],
    8: [4, 5],
    9: [3, 8],
  };
  return challenging[type] || [];
}

function calculateEnneagramConsistency(typeResults: EnneagramTypeScore[]): number {
  // Se o tipo dominante é claramente mais alto que os outros
  if (typeResults.length < 2) return 100;
  
  const first = typeResults[0];
  const second = typeResults[1];
  if (!first || !second) return 100;
  
  const gap = first.score - second.score;
  if (gap > 20) return 95;
  if (gap > 10) return 80;
  if (gap > 5) return 65;
  return 50;
}
