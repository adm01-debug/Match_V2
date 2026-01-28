/**
 * @fileoverview Dados das ferramentas comportamentais avançadas
 * @module advancedBehavioralData
 * 
 * Questões para:
 * - Inteligência Geracional
 * - Perfil sob Stress
 * - Modelo 3 Cérebros
 */

import type { BehavioralQuestion } from '@/types/behavioral';

// ========================================
// 1. INTELIGÊNCIA GERACIONAL
// ========================================
export const generationalQuestions: BehavioralQuestion[] = [
  {
    id: 'gen-1',
    toolId: 'generational',
    text: 'Qual sua principal forma de consumir conteúdo?',
    dimension: 'media_consumption',
    type: 'forced_choice',
    options: [
      { text: 'Televisão, jornais e revistas impressas', dimension: 'silent_boomer', score: 4 },
      { text: 'Email, sites e alguns vídeos', dimension: 'gen_x', score: 4 },
      { text: 'Redes sociais, podcasts e vídeos longos', dimension: 'millennial', score: 4 },
      { text: 'Vídeos curtos (TikTok, Reels), stories e memes', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-2',
    toolId: 'generational',
    text: 'Como você prefere se comunicar no trabalho?',
    dimension: 'communication',
    type: 'forced_choice',
    options: [
      { text: 'Reuniões presenciais e telefonemas', dimension: 'silent_boomer', score: 4 },
      { text: 'Email com respostas elaboradas', dimension: 'gen_x', score: 4 },
      { text: 'Chat (Slack/Teams) com respostas rápidas', dimension: 'millennial', score: 4 },
      { text: 'Mensagens de voz e vídeos curtos', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-3',
    toolId: 'generational',
    text: 'O que você mais valoriza em um emprego?',
    dimension: 'work_values',
    type: 'forced_choice',
    options: [
      { text: 'Estabilidade, benefícios e plano de carreira claro', dimension: 'silent_boomer', score: 4 },
      { text: 'Equilíbrio vida-trabalho e autonomia', dimension: 'gen_x', score: 4 },
      { text: 'Propósito, crescimento e cultura colaborativa', dimension: 'millennial', score: 4 },
      { text: 'Flexibilidade, autenticidade e impacto imediato', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-4',
    toolId: 'generational',
    text: 'Como você lida com hierarquia?',
    dimension: 'hierarchy',
    type: 'forced_choice',
    options: [
      { text: 'Respeito naturalmente e valorizo títulos', dimension: 'silent_boomer', score: 4 },
      { text: 'Respeito quando há competência demonstrada', dimension: 'gen_x', score: 4 },
      { text: 'Prefiro estruturas mais horizontais e acessíveis', dimension: 'millennial', score: 4 },
      { text: 'Hierarquia me parece ultrapassada, prefiro igualdade', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-5',
    toolId: 'generational',
    text: 'Como você prefere aprender algo novo?',
    dimension: 'learning',
    type: 'forced_choice',
    options: [
      { text: 'Cursos formais, livros e treinamentos estruturados', dimension: 'silent_boomer', score: 4 },
      { text: 'Pesquisa independente e aprendizado autodidata', dimension: 'gen_x', score: 4 },
      { text: 'Vídeos no YouTube, cursos online e comunidades', dimension: 'millennial', score: 4 },
      { text: 'Tutoriais rápidos, TikTok educativo e aprender fazendo', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-6',
    toolId: 'generational',
    text: 'Qual sua visão sobre tecnologia no trabalho?',
    dimension: 'technology',
    type: 'forced_choice',
    options: [
      { text: 'Útil mas prefiro métodos tradicionais quando possível', dimension: 'silent_boomer', score: 4 },
      { text: 'Ferramenta importante que deve ser bem aplicada', dimension: 'gen_x', score: 4 },
      { text: 'Essencial, integro naturalmente às minhas atividades', dimension: 'millennial', score: 4 },
      { text: 'Não consigo imaginar trabalhar sem ela, é extensão de mim', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-7',
    toolId: 'generational',
    text: 'Como você prefere receber feedback?',
    dimension: 'feedback',
    type: 'forced_choice',
    options: [
      { text: 'Avaliações formais anuais com gestor direto', dimension: 'silent_boomer', score: 4 },
      { text: 'Feedback direto e objetivo quando necessário', dimension: 'gen_x', score: 4 },
      { text: 'Feedback frequente e contínuo, estilo coaching', dimension: 'millennial', score: 4 },
      { text: 'Feedback instantâneo, informal e transparente', dimension: 'gen_z', score: 4 },
    ],
  },
  {
    id: 'gen-8',
    toolId: 'generational',
    text: 'O que te motiva a dar o seu melhor?',
    dimension: 'motivation',
    type: 'forced_choice',
    options: [
      { text: 'Reconhecimento por lealdade e tempo de serviço', dimension: 'silent_boomer', score: 4 },
      { text: 'Resultados mensuráveis e metas alcançadas', dimension: 'gen_x', score: 4 },
      { text: 'Fazer parte de algo maior, ter propósito', dimension: 'millennial', score: 4 },
      { text: 'Impacto visível e rápido, fazer diferença agora', dimension: 'gen_z', score: 4 },
    ],
  },
];

// ========================================
// 2. PERFIL SOB STRESS
// ========================================
export const stressProfileQuestions: BehavioralQuestion[] = [
  {
    id: 'stress-1',
    toolId: 'stress_profile',
    text: 'Quando estou sob pressão intensa, eu tendo a:',
    dimension: 'primary_response',
    type: 'forced_choice',
    options: [
      { text: 'Tomar controle da situação e agir rapidamente', dimension: 'D', score: 4 },
      { text: 'Buscar apoio social e conversar sobre o problema', dimension: 'I', score: 4 },
      { text: 'Ficar quieto(a) e processar internamente', dimension: 'S', score: 4 },
      { text: 'Analisar todos os detalhes antes de qualquer ação', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'stress-2',
    toolId: 'stress_profile',
    text: 'O que mais me estressa no ambiente de trabalho?',
    dimension: 'stress_triggers',
    type: 'forced_choice',
    options: [
      { text: 'Perder o controle ou depender de pessoas lentas', dimension: 'D', score: 4 },
      { text: 'Ser ignorado(a), criticado(a) publicamente ou isolado(a)', dimension: 'I', score: 4 },
      { text: 'Mudanças bruscas, conflitos e pressão por decisões rápidas', dimension: 'S', score: 4 },
      { text: 'Erros, falta de informação e decisões sem dados', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'stress-3',
    toolId: 'stress_profile',
    text: 'Quando estou muito estressado(a), as pessoas ao meu redor notam que:',
    dimension: 'visible_signs',
    type: 'forced_choice',
    options: [
      { text: 'Fico mais impaciente, direto(a) e às vezes rude', dimension: 'D', score: 4 },
      { text: 'Fico falante demais, distraído(a) ou emocional', dimension: 'I', score: 4 },
      { text: 'Fico calado(a), concordo com tudo só para acabar', dimension: 'S', score: 4 },
      { text: 'Fico extremamente crítico(a) e peço muitos detalhes', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'stress-4',
    toolId: 'stress_profile',
    text: 'Para me recuperar do stress, eu preciso:',
    dimension: 'recovery',
    type: 'forced_choice',
    options: [
      { text: 'Resolver o problema e ver resultados imediatos', dimension: 'D', score: 4 },
      { text: 'Atividades sociais, diversão e reconhecimento', dimension: 'I', score: 4 },
      { text: 'Tempo sozinho(a), rotina estável e apoio de pessoas próximas', dimension: 'S', score: 4 },
      { text: 'Análise do que deu errado, planejamento e organização', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'stress-5',
    toolId: 'stress_profile',
    text: 'Em uma crise, minha primeira reação é:',
    dimension: 'crisis_response',
    type: 'forced_choice',
    options: [
      { text: 'Assumir a liderança e dar ordens claras', dimension: 'D', score: 4 },
      { text: 'Motivar a equipe e manter o otimismo', dimension: 'I', score: 4 },
      { text: 'Manter a calma e seguir o que já funcionou antes', dimension: 'S', score: 4 },
      { text: 'Coletar informações e criar um plano estruturado', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'stress-6',
    toolId: 'stress_profile',
    text: 'Sob stress extremo, meu maior risco é:',
    dimension: 'risk',
    type: 'forced_choice',
    options: [
      { text: 'Ser autoritário(a) demais e alienar as pessoas', dimension: 'D', score: 4 },
      { text: 'Perder o foco e fazer promessas que não posso cumprir', dimension: 'I', score: 4 },
      { text: 'Paralisar e não tomar decisões necessárias', dimension: 'S', score: 4 },
      { text: 'Demorar demais analisando e perder oportunidades', dimension: 'C', score: 4 },
    ],
  },
];

// ========================================
// 3. MODELO 3 CÉREBROS
// ========================================
export const triuneBrainQuestions: BehavioralQuestion[] = [
  {
    id: 'brain-1',
    toolId: 'triune_brain',
    text: 'Ao tomar uma decisão importante de compra ou carreira, você:',
    dimension: 'decision_style',
    type: 'forced_choice',
    options: [
      { text: 'Pensa primeiro na segurança e proteção para você e sua família', dimension: 'reptiliano', score: 4 },
      { text: 'Se conecta emocionalmente - precisa "sentir" que é certo', dimension: 'limbico', score: 4 },
      { text: 'Analisa dados, compara alternativas e calcula ROI', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-2',
    toolId: 'triune_brain',
    text: 'O que mais te convence a aceitar uma proposta de emprego?',
    dimension: 'motivation',
    type: 'forced_choice',
    options: [
      { text: 'Salário garantido, estabilidade e benefícios de segurança', dimension: 'reptiliano', score: 4 },
      { text: 'Cultura, pessoas, propósito e pertencimento', dimension: 'limbico', score: 4 },
      { text: 'Plano de carreira documentado, métricas claras e crescimento lógico', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-3',
    toolId: 'triune_brain',
    text: 'Quando algo parece "bom demais para ser verdade", você:',
    dimension: 'trust',
    type: 'forced_choice',
    options: [
      { text: 'Desconfia automaticamente - onde está a armadilha?', dimension: 'reptiliano', score: 4 },
      { text: 'Verifica se outras pessoas confiáveis já aprovaram', dimension: 'limbico', score: 4 },
      { text: 'Pede dados, termos e condições para analisar', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-4',
    toolId: 'triune_brain',
    text: 'Qual argumento mais te convence?',
    dimension: 'persuasion',
    type: 'forced_choice',
    options: [
      { text: '"Últimas vagas disponíveis" ou "Oferta por tempo limitado"', dimension: 'reptiliano', score: 4 },
      { text: '"Milhares de pessoas como você já aprovaram" ou "Nossa comunidade exclusiva"', dimension: 'limbico', score: 4 },
      { text: '"Estudos mostram que..." ou "O ROI médio é de..."', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-5',
    toolId: 'triune_brain',
    text: 'Ao conhecer uma empresa nova, você primeiro quer saber:',
    dimension: 'first_impression',
    type: 'forced_choice',
    options: [
      { text: 'Se é confiável, segura e vai durar', dimension: 'reptiliano', score: 4 },
      { text: 'Quem são as pessoas, a cultura e os valores', dimension: 'limbico', score: 4 },
      { text: 'Os números, processos e estrutura', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-6',
    toolId: 'triune_brain',
    text: 'O que te faz abandonar uma negociação?',
    dimension: 'deal_breaker',
    type: 'forced_choice',
    options: [
      { text: 'Sentir que há risco ou algo não está certo', dimension: 'reptiliano', score: 4 },
      { text: 'Não sentir conexão ou não confiar na pessoa', dimension: 'limbico', score: 4 },
      { text: 'Os números não fazem sentido ou falta informação', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-7',
    toolId: 'triune_brain',
    text: 'Qual dessas mensagens ressoa mais com você?',
    dimension: 'messaging',
    type: 'forced_choice',
    options: [
      { text: '"Proteja seu futuro e sua família"', dimension: 'reptiliano', score: 4 },
      { text: '"Faça parte de algo extraordinário"', dimension: 'limbico', score: 4 },
      { text: '"A escolha inteligente baseada em dados"', dimension: 'neocortex', score: 4 },
    ],
  },
  {
    id: 'brain-8',
    toolId: 'triune_brain',
    text: 'Antes de aceitar uma oferta, você precisa:',
    dimension: 'requirement',
    type: 'forced_choice',
    options: [
      { text: 'Ter garantias, contrato e proteções claras', dimension: 'reptiliano', score: 4 },
      { text: 'Conhecer as pessoas, visitar o local, sentir o ambiente', dimension: 'limbico', score: 4 },
      { text: 'Ver comparativos, projeções e documentação detalhada', dimension: 'neocortex', score: 4 },
    ],
  },
];

// ========================================
// Função para obter questões das novas ferramentas
// ========================================
export function getAdvancedQuestionsForTool(toolId: string): BehavioralQuestion[] {
  switch (toolId) {
    case 'generational':
      return generationalQuestions;
    case 'stress_profile':
      return stressProfileQuestions;
    case 'triune_brain':
      return triuneBrainQuestions;
    default:
      return [];
  }
}
