import type { ImmersiveScenario } from '@/config/behavioralPillars';

export const RESULTS_ORIENTATION_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'resultados_atalho',
    titulo: 'O Caminho Curto',
    contexto: 'Você precisa entregar um projeto em tempo recorde.',
    tipo: 'decisao_estrategica',
    narrativa: `Deadline em 2 semanas. Normalmente levaria 6.
    
    Você identificou um "atalho":
    - Pular testes de segurança (economiza 1 semana)
    - Documentação mínima (economiza 3 dias)
    - Código "bom o suficiente" (economiza 4 dias)
    
    Se der certo: você é herói.
    Se der problema: você é responsável.
    Probabilidade de problema: ~20%
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'integridade', 'pensamento_critico', 'lideranca'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'renegociar_escopo',
        texto: 'Volto ao stakeholder: "Posso entregar em 2 semanas, mas com escopo reduzido. Qual parte é essencial?"',
        impacto: { orientacao_resultados: 2, integridade: 3, comunicacao: 2, pensamento_critico: 2 },
        tags: ['negociador', 'realista', 'íntegro'],
      },
      {
        id: 'atalho_documentado',
        texto: 'Tomo o atalho, mas documento os riscos e faço stakeholder assinar termo de aceite.',
        impacto: { orientacao_resultados: 2, integridade: 1, pensamento_critico: 1, comunicacao: 1 },
        tags: ['pragmático', 'CYA', 'arriscado'],
      },
      {
        id: 'atalho_silencioso',
        texto: 'Tomo o atalho sem documentar. Se der problema, resolvo depois.',
        impacto: { orientacao_resultados: 1, integridade: -3, pensamento_critico: -2 },
        tags: ['irresponsável', 'arriscado', 'antiético'],
      },
      {
        id: 'recusar_deadline',
        texto: 'Recuso o deadline. Não é possível entregar com qualidade aceitável.',
        impacto: { orientacao_resultados: -1, integridade: 2, lideranca: 1, resiliencia: 0 },
        tags: ['íntegro', 'inflexível', 'limitado'],
      },
    ],
  },
  {
    id: 'resultados_burnout_equipe',
    titulo: 'O Preço da Vitória',
    contexto: 'Sua equipe está batendo todas as metas.',
    tipo: 'decisao_estrategica',
    narrativa: `Trimestre fantástico: 140% da meta, bônus recorde, CEO te elogiou publicamente.
    
    O que ninguém sabe:
    - 3 pessoas estão tomando remédio para dormir
    - 1 pediu demissão ontem (você convenceu a ficar "mais um mês")
    - Você mesmo está tendo crises de ansiedade
    - Turnover no time foi de 40% no ano
    
    O board quer repetir o resultado no próximo trimestre.
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'inteligencia_emocional', 'lideranca', 'integridade'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'transparencia_board',
        texto: 'Apresento ao board o custo humano real e proponho metas sustentáveis com plano de recuperação.',
        impacto: { orientacao_resultados: 1, inteligencia_emocional: 3, integridade: 3, lideranca: 3 },
        tags: ['corajoso', 'sustentável', 'líder real'],
        socialmenteDesejavel: true,
      },
      {
        id: 'contratar_mais',
        texto: 'Peço aumento de headcount para distribuir carga. Mantém o ritmo com mais gente.',
        impacto: { orientacao_resultados: 2, inteligencia_emocional: 1, pensamento_critico: 1, lideranca: 1 },
        tags: ['prático', 'band-aid', 'parcial'],
      },
      {
        id: 'continuar_sprint',
        texto: 'Mais um trimestre de esforço. Depois vamos ter recursos para contratar e aliviar.',
        impacto: { orientacao_resultados: 1, inteligencia_emocional: -3, integridade: -2, lideranca: -2 },
        tags: ['tóxico', 'míope', 'workaholic'],
      },
      {
        id: 'pedir_demissao',
        texto: 'Não aguento mais. Preparo minha saída de forma organizada.',
        impacto: { orientacao_resultados: -1, inteligencia_emocional: 1, integridade: 0, resiliencia: -1 },
        tags: ['autopreservação', 'desistente', 'honesto'],
      },
    ],
  },
  {
    id: 'resultados_qualidade_quantidade',
    titulo: 'O Dilema da Fábrica',
    contexto: 'Você gerencia uma equipe de produção.',
    tipo: 'decisao_estrategica',
    narrativa: `Descoberta recente: você pode aumentar produção em 30% com pequena queda de qualidade.
    
    - De 100 itens, 2-3 teriam defeitos menores (hoje é 0.5)
    - Defeitos são estetéticos, não funcionais
    - Cliente não especificou esse nível de qualidade
    - Concorrentes têm taxa de 5%
    
    30% a mais de produção significa:
    - Bônus maior para a equipe
    - Meta do ano atingida com sobra
    - Sua promoção praticamente garantida
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'integridade', 'pensamento_critico', 'comunicacao'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'manter_qualidade',
        texto: 'Mantenho os padrões atuais. Nossa qualidade é nosso diferencial - não vale comprometer.',
        impacto: { orientacao_resultados: 0, integridade: 3, pensamento_critico: 2 },
        tags: ['íntegro', 'conservador', 'qualidade'],
      },
      {
        id: 'consultar_cliente',
        texto: 'Consulto o cliente sobre tolerância a defeitos. Deixo eles decidirem o trade-off.',
        impacto: { orientacao_resultados: 2, integridade: 2, comunicacao: 3, colaboracao: 2 },
        tags: ['transparente', 'colaborativo', 'cliente-cêntrico'],
      },
      {
        id: 'implementar_silencioso',
        texto: 'Implemento a mudança. O cliente não vai perceber e estamos dentro do padrão de mercado.',
        impacto: { orientacao_resultados: 2, integridade: -2, pensamento_critico: -1 },
        tags: ['pragmático', 'antiético', 'arriscado'],
      },
      {
        id: 'piloto_controlado',
        texto: 'Faço piloto de 1 mês, monitoro reclamações de clientes, e decido com dados.',
        impacto: { orientacao_resultados: 1, pensamento_critico: 3, adaptabilidade: 2, integridade: 1 },
        tags: ['científico', 'cauteloso', 'data-driven'],
      },
    ],
  },
