/**
 * @fileoverview Dados para Desafios por Fases
 */

import type { ChallengePhase } from '@/components/assessments/gamified/PhaseChallenge';

export const CHALLENGE_PHASES: ChallengePhase[] = [
  {
    id: 'phase-1',
    title: 'Autoconhecimento',
    description: 'Descubra seu estilo de trabalho e preferências',
    icon: 'brain',
    difficulty: 'facil',
    xpReward: 50,
    questions: [
      {
        id: 'p1-q1',
        text: 'Como você prefere começar seu dia de trabalho?',
        options: [
          { id: 'a', text: 'Com uma lista de tarefas organizada', trait: 'organizado' },
          { id: 'b', text: 'Verificando e-mails e mensagens', trait: 'comunicativo' },
          { id: 'c', text: 'Direto na tarefa mais importante', trait: 'focado' },
          { id: 'd', text: 'Conversando com colegas', trait: 'social' },
        ],
      },
      {
        id: 'p1-q2',
        text: 'Ao aprender algo novo, você prefere:',
        options: [
          { id: 'a', text: 'Ler documentação detalhada', trait: 'analítico' },
          { id: 'b', text: 'Experimentar na prática', trait: 'prático' },
          { id: 'c', text: 'Assistir tutoriais em vídeo', trait: 'visual' },
          { id: 'd', text: 'Aprender com um mentor', trait: 'colaborativo' },
        ],
      },
      {
        id: 'p1-q3',
        text: 'O que mais te motiva no trabalho?',
        options: [
          { id: 'a', text: 'Reconhecimento e promoções', trait: 'ambicioso' },
          { id: 'b', text: 'Aprender e crescer', trait: 'curioso' },
          { id: 'c', text: 'Ajudar a equipe', trait: 'altruísta' },
          { id: 'd', text: 'Resolver problemas difíceis', trait: 'desafiador' },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Resolução de Problemas',
    description: 'Teste sua capacidade analítica e tomada de decisão',
    icon: 'target',
    difficulty: 'medio',
    xpReward: 100,
    unlockRequirement: 60,
    questions: [
      {
        id: 'p2-q1',
        text: 'Um projeto importante está atrasado. O que você faz primeiro?',
        options: [
          { id: 'a', text: 'Identificar o que causou o atraso', isCorrect: true, trait: 'analítico' },
          { id: 'b', text: 'Trabalhar horas extras imediatamente', trait: 'reativo' },
          { id: 'c', text: 'Pedir mais prazo ao cliente', trait: 'negociador' },
          { id: 'd', text: 'Redistribuir tarefas na equipe', trait: 'líder' },
        ],
      },
      {
        id: 'p2-q2',
        text: 'Dois colegas estão em conflito sobre uma decisão. Você:',
        options: [
          { id: 'a', text: 'Deixa eles resolverem sozinhos', trait: 'passivo' },
          { id: 'b', text: 'Media a conversa focando em fatos', isCorrect: true, trait: 'mediador' },
          { id: 'c', text: 'Toma partido do que parece certo', trait: 'decisivo' },
          { id: 'd', text: 'Escala para o gestor', trait: 'formal' },
        ],
      },
      {
        id: 'p2-q3',
        text: 'Recebeu uma tarefa sem instruções claras. Você:',
        options: [
          { id: 'a', text: 'Faz do jeito que achar melhor', trait: 'autônomo' },
          { id: 'b', text: 'Pergunta detalhes antes de começar', isCorrect: true, trait: 'preciso' },
          { id: 'c', text: 'Espera mais instruções', trait: 'passivo' },
          { id: 'd', text: 'Pesquisa referências similares', trait: 'investigativo' },
        ],
      },
      {
        id: 'p2-q4',
        text: 'Descobre um erro que você cometeu no trabalho. Você:',
        options: [
          { id: 'a', text: 'Corrige silenciosamente se possível', trait: 'discreto' },
          { id: 'b', text: 'Comunica imediatamente ao gestor', isCorrect: true, trait: 'transparente' },
          { id: 'c', text: 'Espera ver se alguém nota', trait: 'evitativo' },
          { id: 'd', text: 'Corrige e documenta para evitar no futuro', trait: 'sistemático' },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Inteligência Emocional',
    description: 'Avalie sua empatia e habilidades interpessoais',
    icon: 'heart',
    difficulty: 'medio',
    xpReward: 120,
    unlockRequirement: 50,
    questions: [
      {
        id: 'p3-q1',
        text: 'Um colega parece desmotivado ultimamente. Você:',
        options: [
          { id: 'a', text: 'Pergunta se está tudo bem em particular', isCorrect: true, trait: 'empático' },
          { id: 'b', text: 'Foca no próprio trabalho', trait: 'focado' },
          { id: 'c', text: 'Comenta com outros sobre isso', trait: 'comunicativo' },
          { id: 'd', text: 'Reporta ao RH', trait: 'formal' },
        ],
      },
      {
        id: 'p3-q2',
        text: 'Recebe uma crítica que você acha injusta. Você:',
        options: [
          { id: 'a', text: 'Defende sua posição imediatamente', trait: 'assertivo' },
          { id: 'b', text: 'Respira fundo e pede exemplos específicos', isCorrect: true, trait: 'equilibrado' },
          { id: 'c', text: 'Aceita para evitar conflito', trait: 'evitativo' },
          { id: 'd', text: 'Fica magoado mas não demonstra', trait: 'reservado' },
        ],
      },
      {
        id: 'p3-q3',
        text: 'Uma reunião está ficando tensa. Você:',
        options: [
          { id: 'a', text: 'Sugere uma pausa para todos pensarem', isCorrect: true, trait: 'moderador' },
          { id: 'b', text: 'Tenta resolver a tensão diretamente', trait: 'confrontador' },
          { id: 'c', text: 'Fica quieto e observa', trait: 'observador' },
          { id: 'd', text: 'Muda de assunto sutilmente', trait: 'diplomático' },
        ],
      },
      {
        id: 'p3-q4',
        text: 'Precisa dar feedback negativo a um colega. Você:',
        options: [
          { id: 'a', text: 'Vai direto ao ponto sem rodeios', trait: 'direto' },
          { id: 'b', text: 'Começa com pontos positivos primeiro', isCorrect: true, trait: 'construtivo' },
          { id: 'c', text: 'Evita dar o feedback', trait: 'evitativo' },
          { id: 'd', text: 'Envia por escrito', trait: 'formal' },
        ],
      },
    ],
  },
  {
    id: 'phase-4',
    title: 'Liderança & Visão',
    description: 'Demonstre seu potencial de liderança e visão estratégica',
    icon: 'star',
    difficulty: 'dificil',
    xpReward: 150,
    unlockRequirement: 70,
    questions: [
      {
        id: 'p4-q1',
        text: 'Sua equipe está resistente a uma mudança importante. Você:',
        options: [
          { id: 'a', text: 'Impõe a mudança por autoridade', trait: 'autoritário' },
          { id: 'b', text: 'Explica os benefícios e ouve as preocupações', isCorrect: true, trait: 'inspirador' },
          { id: 'c', text: 'Deixa o time decidir se muda ou não', trait: 'democrático' },
          { id: 'd', text: 'Implementa gradualmente sem avisar', trait: 'estratégico' },
        ],
      },
      {
        id: 'p4-q2',
        text: 'Um membro da equipe está performando abaixo do esperado. Você:',
        options: [
          { id: 'a', text: 'Documenta e inicia processo disciplinar', trait: 'rígido' },
          { id: 'b', text: 'Conversa para entender e criar plano de desenvolvimento', isCorrect: true, trait: 'desenvolvedor' },
          { id: 'c', text: 'Redistribui as tarefas para outros', trait: 'pragmático' },
          { id: 'd', text: 'Espera ver se melhora sozinho', trait: 'passivo' },
        ],
      },
      {
        id: 'p4-q3',
        text: 'Você tem uma ideia inovadora mas arriscada. Você:',
        options: [
          { id: 'a', text: 'Implementa escondido para provar que funciona', trait: 'rebelde' },
          { id: 'b', text: 'Apresenta com dados e propõe um piloto', isCorrect: true, trait: 'estratégico' },
          { id: 'c', text: 'Guarda para si por medo de rejeição', trait: 'inseguro' },
          { id: 'd', text: 'Espera alguém mais influente apoiar', trait: 'político' },
        ],
      },
      {
        id: 'p4-q4',
        text: 'A empresa está passando por crise. Como líder, você:',
        options: [
          { id: 'a', text: 'Mantém a equipe focada e positiva', trait: 'otimista' },
          { id: 'b', text: 'É transparente sobre a situação e envolve todos', isCorrect: true, trait: 'autêntico' },
          { id: 'c', text: 'Protege a equipe de más notícias', trait: 'protetor' },
          { id: 'd', text: 'Foca em garantir sua própria posição', trait: 'individualista' },
        ],
      },
      {
        id: 'p4-q5',
        text: 'Precisa escolher entre resultado rápido ou qualidade. Você:',
        options: [
          { id: 'a', text: 'Sempre prioriza qualidade', trait: 'perfeccionista' },
          { id: 'b', text: 'Depende do contexto e impacto', isCorrect: true, trait: 'contextual' },
          { id: 'c', text: 'Sempre prioriza velocidade', trait: 'ágil' },
          { id: 'd', text: 'Delega a decisão para o time', trait: 'delegador' },
        ],
      },
    ],
  },
  {
    id: 'phase-5',
    title: 'Desafio Final',
    description: 'Prove que você é o candidato ideal!',
    icon: 'zap',
    difficulty: 'expert',
    xpReward: 200,
    unlockRequirement: 75,
    questions: [
      {
        id: 'p5-q1',
        text: 'Se você pudesse mudar uma coisa na forma como as empresas contratam, seria:',
        options: [
          { id: 'a', text: 'Menos foco em diploma e mais em habilidades', trait: 'inovador' },
          { id: 'b', text: 'Processos mais humanos e menos robotizados', trait: 'humanista' },
          { id: 'c', text: 'Mais transparência sobre salário e cultura', trait: 'transparente' },
          { id: 'd', text: 'Feedback obrigatório para todos os candidatos', trait: 'empático' },
        ],
      },
      {
        id: 'p5-q2',
        text: 'Daqui a 5 anos, onde você se vê?',
        options: [
          { id: 'a', text: 'Liderando uma equipe', trait: 'líder' },
          { id: 'b', text: 'Especialista técnico reconhecido', trait: 'especialista' },
          { id: 'c', text: 'Empreendendo meu próprio negócio', trait: 'empreendedor' },
          { id: 'd', text: 'Equilibrado entre carreira e vida pessoal', trait: 'equilibrado' },
        ],
      },
      {
        id: 'p5-q3',
        text: 'Qual é o maior desafio do mundo corporativo hoje?',
        options: [
          { id: 'a', text: 'Manter talentos engajados', trait: 'gestor' },
          { id: 'b', text: 'Adaptar-se às mudanças tecnológicas', trait: 'visionário' },
          { id: 'c', text: 'Criar culturas mais inclusivas', trait: 'humanista' },
          { id: 'd', text: 'Equilibrar lucro e propósito', trait: 'consciente' },
        ],
      },
    ],
  },
];
