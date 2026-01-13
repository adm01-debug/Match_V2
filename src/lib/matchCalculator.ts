/**
 * @fileoverview Calculadora de Match entre Empresa e Candidato
 * @description Algoritmo que calcula compatibilidade cultural
 */

import {
  type PerfilCulturalEmpresa,
  type PerfilCulturalCandidato,
  type MatchResult,
  type MatchDetalhe,
  VALORES_CULTURAIS,
  calcularAlinhamento
} from '@/types/match';

/**
 * Calcula o match entre um perfil de empresa e um perfil de candidato
 */
export function calcularMatch(
  empresa: PerfilCulturalEmpresa,
  candidato: PerfilCulturalCandidato,
  vagaId?: string
): MatchResult {
  const detalhes: MatchDetalhe[] = [];
  
  // Mapear respostas por valorId
  const empresaMap = new Map(empresa.valores.map(v => [v.valorId, v.intensidade]));
  const candidatoMap = new Map(candidato.valores.map(v => [v.valorId, v.intensidade]));
  
  // Calcular alinhamento para cada valor
  for (const valor of VALORES_CULTURAIS) {
    const intensidadeEmpresa = empresaMap.get(valor.id) ?? 3;
    const intensidadeCandidato = candidatoMap.get(valor.id) ?? 3;
    const diferencaAbsoluta = Math.abs(intensidadeEmpresa - intensidadeCandidato);
    const alinhamento = calcularAlinhamento(intensidadeEmpresa, intensidadeCandidato);
    
    let comentario = '';
    switch (alinhamento) {
      case 'perfeito':
        comentario = `Alinhamento perfeito em ${valor.nome}!`;
        break;
      case 'alto':
        comentario = `Ótima compatibilidade em ${valor.nome}`;
        break;
      case 'medio':
        comentario = `Compatibilidade moderada em ${valor.nome}`;
        break;
      case 'baixo':
        comentario = `Pode haver diferenças em ${valor.nome}`;
        break;
      case 'conflito':
        comentario = `Visões diferentes sobre ${valor.nome}`;
        break;
    }
    
    detalhes.push({
      valorId: valor.id,
      valorNome: valor.nome,
      intensidadeEmpresa,
      intensidadeCandidato,
      alinhamento,
      diferencaAbsoluta,
      comentario
    });
  }
  
  // Separar por categoria
  const matchesPerfeitos = detalhes.filter(d => d.alinhamento === 'perfeito');
  const matchesAltos = detalhes.filter(d => d.alinhamento === 'alto');
  const matchesMedios = detalhes.filter(d => d.alinhamento === 'medio');
  const conflitos = detalhes.filter(d => d.alinhamento === 'conflito' || d.alinhamento === 'baixo');
  
  // Calcular scores com peso nos valores prioritários
  const valoresPrioritariosEmpresa = new Set(empresa.valoresPrioritarios);
  const valoresPrioritariosCandidato = new Set(candidato.valoresPrioritarios);
  
  let scoreTotal = 0;
  let pesoTotal = 0;
  
  for (const detalhe of detalhes) {
    // Peso maior para valores prioritários
    let peso = 1;
    if (valoresPrioritariosEmpresa.has(detalhe.valorId)) peso += 1;
    if (valoresPrioritariosCandidato.has(detalhe.valorId)) peso += 1;
    
    // Score baseado no alinhamento
    let scoreValor = 0;
    switch (detalhe.alinhamento) {
      case 'perfeito': scoreValor = 100; break;
      case 'alto': scoreValor = 85; break;
      case 'medio': scoreValor = 60; break;
      case 'baixo': scoreValor = 35; break;
      case 'conflito': scoreValor = 10; break;
    }
    
    scoreTotal += scoreValor * peso;
    pesoTotal += peso;
  }
  
  const scoreFinal = Math.round(scoreTotal / pesoTotal);
  
  // Gerar pontos fortes e atenção
  const pontosFortes = matchesPerfeitos
    .concat(matchesAltos)
    .slice(0, 5)
    .map(d => d.valorNome);
  
  const pontosAtencao = conflitos
    .slice(0, 3)
    .map(d => d.valorNome);
  
  // Determinar recomendação
  let recomendacao: MatchResult['recomendacao'];
  if (scoreFinal >= 85) {
    recomendacao = 'match_perfeito';
  } else if (scoreFinal >= 70) {
    recomendacao = 'match_forte';
  } else if (scoreFinal >= 55) {
    recomendacao = 'match_moderado';
  } else if (scoreFinal >= 40) {
    recomendacao = 'revisar';
  } else {
    recomendacao = 'nao_recomendado';
  }
  
  // Gerar análise textual
  const analiseTexto = gerarAnaliseTexto(
    empresa.empresaNome,
    candidato.candidatoNome,
    scoreFinal,
    matchesPerfeitos.length,
    conflitos.length,
    pontosFortes,
    pontosAtencao
  );
  
  return {
    id: crypto.randomUUID(),
    candidatoId: candidato.candidatoId,
    empresaPerfilId: empresa.id,
    vagaId,
    scoreTotal: scoreFinal,
    scoreValores: scoreFinal,
    scoreCompatibilidade: scoreFinal,
    matchesPerfeitos,
    matchesAltos,
    matchesMedios,
    conflitos,
    pontosFortes,
    pontosAtencao,
    recomendacao,
    analiseTexto,
    calculadoEm: new Date().toISOString()
  };
}

function gerarAnaliseTexto(
  empresaNome: string,
  candidatoNome: string,
  score: number,
  perfeitos: number,
  conflitos: number,
  pontosFortes: string[],
  pontosAtencao: string[]
): string {
  const partes: string[] = [];
  
  if (score >= 85) {
    partes.push(`${candidatoNome} e ${empresaNome} têm um alinhamento cultural excepcional!`);
  } else if (score >= 70) {
    partes.push(`Há uma forte compatibilidade entre ${candidatoNome} e ${empresaNome}.`);
  } else if (score >= 55) {
    partes.push(`${candidatoNome} e ${empresaNome} compartilham valores importantes.`);
  } else {
    partes.push(`Existem diferenças significativas de valores entre ${candidatoNome} e ${empresaNome}.`);
  }
  
  if (perfeitos > 3) {
    partes.push(`Vocês têm ${perfeitos} valores em alinhamento perfeito.`);
  }
  
  if (pontosFortes.length > 0) {
    partes.push(`Destaques positivos: ${pontosFortes.join(', ')}.`);
  }
  
  if (pontosAtencao.length > 0 && conflitos > 0) {
    partes.push(`Pontos que merecem atenção: ${pontosAtencao.join(', ')}.`);
  }
  
  return partes.join(' ');
}

/**
 * Salva perfil no localStorage
 */
export function salvarPerfilLocal(
  tipo: 'empresa' | 'candidato',
  perfil: PerfilCulturalEmpresa | PerfilCulturalCandidato
): void {
  const key = tipo === 'empresa' ? 'deu-match-empresa' : 'deu-match-candidato';
  localStorage.setItem(key, JSON.stringify(perfil));
}

/**
 * Recupera perfil do localStorage
 */
export function recuperarPerfilLocal<T>(tipo: 'empresa' | 'candidato'): T | null {
  const key = tipo === 'empresa' ? 'deu-match-empresa' : 'deu-match-candidato';
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Limpa perfis salvos
 */
export function limparPerfisLocais(): void {
  localStorage.removeItem('deu-match-empresa');
  localStorage.removeItem('deu-match-candidato');
}
