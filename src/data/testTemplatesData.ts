/**
 * @fileoverview Templates de provas e testes para recrutamento e seleção
 * @module TestTemplatesData
 * Baseado em melhores práticas de assessment: raciocínio lógico, habilidades técnicas,
 * idiomas, Excel, comportamental e fit cultural
 */

import type { Questao, CategoriaProva, NivelCargo, Departamento } from '@/types/tests';

export interface TestTemplate {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaProva;
  departamentos: Departamento[];
  niveisAplicaveis: NivelCargo[];
  duracao: number; // minutos
  notaMinima: number;
  tags: string[];
  questoes: Omit<Questao, 'id'>[];
}

// ============================================================
// 1. RACIOCÍNIO LÓGICO
// ============================================================
export const logicaTestTemplates: TestTemplate[] = [
  {
    id: 'logica-basico',
    titulo: 'Raciocínio Lógico - Básico',
    descricao: 'Avalia capacidade de análise, sequências e padrões para cargos operacionais',
    categoria: 'logica',
    departamentos: ['geral'],
    niveisAplicaveis: ['basico'],
    duracao: 20,
    notaMinima: 60,
    tags: ['lógica', 'sequências', 'padrões'],
    questoes: [
      {
        enunciado: 'Complete a sequência: 2, 4, 8, 16, ?',
        tipo: 'multipla_escolha',
        alternativas: ['24', '32', '30', '28'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Se todos os gatos são felinos e alguns felinos são selvagens, podemos concluir que:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Todos os gatos são selvagens',
          'Alguns gatos podem ser selvagens',
          'Nenhum gato é selvagem',
          'Todos os selvagens são gatos'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Em uma corrida, Ana chegou antes de Bia, que chegou depois de Carol. Quem chegou primeiro?',
        tipo: 'multipla_escolha',
        alternativas: ['Ana', 'Bia', 'Carol', 'Não é possível determinar'],
        respostaCorreta: 3,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Complete: 1, 1, 2, 3, 5, 8, ?',
        tipo: 'multipla_escolha',
        alternativas: ['10', '11', '12', '13'],
        respostaCorreta: 3,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Se A > B, B > C e C > D, qual é a relação entre A e D?',
        tipo: 'multipla_escolha',
        alternativas: ['A < D', 'A = D', 'A > D', 'Não é possível determinar'],
        respostaCorreta: 2,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Um relógio marca 3h15. Qual é o ângulo entre os ponteiros?',
        tipo: 'multipla_escolha',
        alternativas: ['0°', '7,5°', '15°', '30°'],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Se chove, então a rua fica molhada. A rua está seca. Logo:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Choveu',
          'Não choveu',
          'A rua está molhada',
          'Nada pode ser concluído'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual número não pertence à sequência: 2, 5, 10, 17, 26, 35?',
        tipo: 'multipla_escolha',
        alternativas: ['5', '17', '26', '35'],
        respostaCorreta: 3,
        pontuacao: 15,
        dificuldade: 'dificil',
      },
    ],
  },
  {
    id: 'logica-avancado',
    titulo: 'Raciocínio Lógico - Avançado',
    descricao: 'Avalia análise complexa, lógica proposicional e resolução de problemas',
    categoria: 'logica',
    departamentos: ['ti', 'financeiro'],
    niveisAplicaveis: ['avancado'],
    duracao: 40,
    notaMinima: 70,
    tags: ['lógica avançada', 'proposições', 'análise'],
    questoes: [
      {
        enunciado: 'Se P → Q e Q → R são verdadeiras, e R é falso, o que podemos concluir sobre P?',
        tipo: 'multipla_escolha',
        alternativas: ['P é verdadeiro', 'P é falso', 'P pode ser verdadeiro ou falso', 'Nada pode ser concluído'],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'dificil',
      },
      {
        enunciado: 'Três pessoas A, B e C estão em fila. A não está na primeira posição. B está entre A e C. Qual é a ordem?',
        tipo: 'multipla_escolha',
        alternativas: ['C-B-A', 'A-B-C', 'B-A-C', 'C-A-B'],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Complete: 1, 4, 9, 16, 25, ?',
        tipo: 'multipla_escolha',
        alternativas: ['30', '35', '36', '49'],
        respostaCorreta: 2,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Em um grupo de 100 pessoas, 60 falam inglês, 50 falam espanhol e 20 falam ambos. Quantas não falam nenhum?',
        tipo: 'multipla_escolha',
        alternativas: ['10', '20', '30', '40'],
        respostaCorreta: 0,
        pontuacao: 20,
        dificuldade: 'dificil',
      },
      {
        enunciado: 'A negação de "Todos os funcionários são pontuais" é:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Nenhum funcionário é pontual',
          'Alguns funcionários não são pontuais',
          'Todos os funcionários são atrasados',
          'Alguns funcionários são atrasados'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Se 3 máquinas produzem 3 peças em 3 minutos, quantas peças 100 máquinas produzem em 100 minutos?',
        tipo: 'multipla_escolha',
        alternativas: ['100', '1000', '3333', '10000'],
        respostaCorreta: 2,
        pontuacao: 20,
        dificuldade: 'dificil',
      },
      {
        enunciado: 'Descreva seu processo de raciocínio para resolver problemas complexos.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'dificil',
      },
    ],
  },
];

// ============================================================
// 2. PORTUGUÊS / COMUNICAÇÃO
// ============================================================
export const portuguesTestTemplates: TestTemplate[] = [
  {
    id: 'portugues-comunicacao',
    titulo: 'Comunicação e Escrita Empresarial',
    descricao: 'Avalia gramática, interpretação de texto e redação profissional',
    categoria: 'portugues',
    departamentos: ['geral', 'rh', 'comercial', 'marketing'],
    niveisAplicaveis: ['basico', 'intermediario'],
    duracao: 30,
    notaMinima: 65,
    tags: ['português', 'comunicação', 'escrita'],
    questoes: [
      {
        enunciado: 'Qual a forma correta? "Segue _____ os documentos solicitados."',
        tipo: 'multipla_escolha',
        alternativas: ['anexo', 'anexos', 'em anexo', 'anexado'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: '"Fazem cinco anos que trabalho aqui." A frase está:',
        tipo: 'multipla_escolha',
        alternativas: ['Correta', 'Incorreta - deveria ser "Faz"', 'Incorreta - deveria ser "Faziam"', 'Depende do contexto'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual alternativa apresenta a concordância correta?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Haverão reuniões amanhã',
          'Existem muitos candidatos qualificados',
          'Faltam três dias para o prazo',
          'Houveram imprevistos no projeto'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Identifique o uso correto de "onde":',
        tipo: 'multipla_escolha',
        alternativas: [
          'Onde você quer chegar com isso?',
          'A reunião onde tratamos do projeto',
          'O escritório onde trabalho é moderno',
          'Onde fica a solução do problema?'
        ],
        respostaCorreta: 2,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Leia o texto e interprete:\n\n"A transformação digital não é uma opção, mas uma necessidade. Empresas que não se adaptarem ficarão para trás."\n\nO autor defende que:',
        tipo: 'multipla_escolha',
        alternativas: [
          'A transformação digital é opcional',
          'Empresas devem resistir à tecnologia',
          'Adaptação digital é essencial para sobrevivência',
          'O passado era melhor'
        ],
        respostaCorreta: 2,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Redija um e-mail profissional comunicando o adiamento de uma reunião importante para a próxima semana.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual é a forma correta? "O gerente e sua equipe _____ responsáveis pelo resultado."',
        tipo: 'multipla_escolha',
        alternativas: ['é', 'são', 'foi', 'era'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'A expressão "a princípio" significa:',
        tipo: 'multipla_escolha',
        alternativas: ['Em primeiro lugar', 'Inicialmente/aparentemente', 'Em respeito', 'Na teoria'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
    ],
  },
];

// ============================================================
// 3. INGLÊS
// ============================================================
export const inglesTestTemplates: TestTemplate[] = [
  {
    id: 'ingles-intermediario',
    titulo: 'Business English - Intermediate',
    descricao: 'Avalia compreensão e comunicação em inglês para negócios',
    categoria: 'ingles',
    departamentos: ['ti', 'comercial', 'marketing'],
    niveisAplicaveis: ['intermediario', 'avancado'],
    duracao: 30,
    notaMinima: 60,
    tags: ['inglês', 'business english', 'comunicação'],
    questoes: [
      {
        enunciado: 'Choose the correct option: "The meeting _____ cancelled due to unforeseen circumstances."',
        tipo: 'multipla_escolha',
        alternativas: ['has been', 'have been', 'was being', 'were'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Complete: "We need to _____ a solution before the deadline."',
        tipo: 'multipla_escolha',
        alternativas: ['come out with', 'come up with', 'come in with', 'come by with'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Read the text:\n\n"The quarterly report indicates a 15% increase in revenue. However, operational costs have also risen by 8%, resulting in a net profit improvement of 7%."\n\nWhat was the actual improvement in net profit?',
        tipo: 'multipla_escolha',
        alternativas: ['15%', '8%', '7%', '23%'],
        respostaCorreta: 2,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Which is the most formal way to start a business email?',
        tipo: 'multipla_escolha',
        alternativas: ['Hey John,', 'Hi there,', 'Dear Mr. Smith,', 'Hello!'],
        respostaCorreta: 2,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: '"I would appreciate it if you could send me the report by Friday." This sentence is:',
        tipo: 'multipla_escolha',
        alternativas: ['A demand', 'A polite request', 'A suggestion', 'An order'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Choose the correct phrasal verb: "We need to _____ this project until next month."',
        tipo: 'multipla_escolha',
        alternativas: ['put off', 'put up', 'put down', 'put away'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Write a brief email (4-5 sentences) to a client apologizing for a delay in delivery and proposing a new date.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: '"By the time you arrive, the meeting _____ started."',
        tipo: 'multipla_escolha',
        alternativas: ['will have', 'would have', 'has', 'had'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'dificil',
      },
    ],
  },
  {
    id: 'ingles-avancado',
    titulo: 'Advanced Business English',
    descricao: 'Avalia fluência e comunicação avançada em inglês corporativo',
    categoria: 'ingles',
    departamentos: ['ti', 'comercial'],
    niveisAplicaveis: ['avancado'],
    duracao: 45,
    notaMinima: 70,
    tags: ['inglês avançado', 'negociação', 'fluência'],
    questoes: [
      {
        enunciado: 'In the sentence "The stakeholders are concerned about the ROI of this initiative," ROI stands for:',
        tipo: 'multipla_escolha',
        alternativas: ['Return on Investment', 'Rate of Interest', 'Revenue of Income', 'Range of Improvement'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Complete with the appropriate conditional: "If we _____ the budget earlier, we could have launched the product on time."',
        tipo: 'multipla_escolha',
        alternativas: ['approve', 'approved', 'had approved', 'have approved'],
        respostaCorreta: 2,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Which expression best means "to take responsibility"?',
        tipo: 'multipla_escolha',
        alternativas: ['Step down', 'Step up', 'Step aside', 'Step out'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Read and analyze:\n\n"Our Q3 results exceeded expectations, with EBITDA margins reaching 22%, up from 18% YoY. The board has approved a dividend increase of 15% for shareholders."\n\nWhat does YoY mean?',
        tipo: 'multipla_escolha',
        alternativas: ['Year over Year', 'Yield on Yield', 'Yesterday or Yesterday', 'Youth over Youth'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Write a professional summary (100-150 words) discussing the advantages and challenges of remote work for corporations.',
        tipo: 'dissertativa',
        pontuacao: 30,
        dificuldade: 'dificil',
      },
      {
        enunciado: '"Despite the _____ challenges, the team delivered exceptional results."',
        tipo: 'multipla_escolha',
        alternativas: ['unprecedented', 'unprecedent', 'unprecedents', 'unprecedentedly'],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'dificil',
      },
      {
        enunciado: 'What is the most appropriate way to disagree politely in a business meeting?',
        tipo: 'multipla_escolha',
        alternativas: [
          'You are wrong.',
          'I see your point, but I have a different perspective.',
          'That is incorrect.',
          'No, that will not work.'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
    ],
  },
];

// ============================================================
// 4. EXCEL / ANÁLISE DE DADOS
// ============================================================
export const excelTestTemplates: TestTemplate[] = [
  {
    id: 'excel-basico',
    titulo: 'Excel Básico para Escritório',
    descricao: 'Avalia conhecimentos fundamentais de Excel para rotinas administrativas',
    categoria: 'excel',
    departamentos: ['administrativo', 'financeiro', 'rh'],
    niveisAplicaveis: ['basico'],
    duracao: 25,
    notaMinima: 60,
    tags: ['excel', 'planilhas', 'básico'],
    questoes: [
      {
        enunciado: 'Qual fórmula soma os valores de A1 até A10?',
        tipo: 'multipla_escolha',
        alternativas: ['=SOMA(A1:A10)', '=SOMAR(A1:A10)', '=ADD(A1:A10)', '=TOTAL(A1:A10)'],
        respostaCorreta: 0,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Para fixar uma célula em uma fórmula ao copiar, usa-se:',
        tipo: 'multipla_escolha',
        alternativas: ['# antes da célula', '$ antes da letra e/ou número', '* antes da célula', '! antes da célula'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual a diferença entre =CONT.SE e =CONT.SES?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Não há diferença',
          'CONT.SES permite múltiplos critérios',
          'CONT.SE é mais rápida',
          'CONT.SES é para texto apenas'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Para calcular uma média, excluindo zeros, qual abordagem usar?',
        tipo: 'multipla_escolha',
        alternativas: [
          '=MÉDIA(intervalo)',
          '=MÉDIASE(intervalo;"<>0")',
          '=MÉDIA.EXCETO.ZEROS()',
          '=SOMA()/CONT.VALORES()'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual atalho de teclado insere a data atual em uma célula?',
        tipo: 'multipla_escolha',
        alternativas: ['Ctrl + D', 'Ctrl + ;', 'Ctrl + T', 'Ctrl + H'],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'O que faz a função =SE(A1>100;"Alto";"Baixo")?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Soma se A1 for maior que 100',
          'Retorna "Alto" se A1>100, senão "Baixo"',
          'Conta quantos são maiores que 100',
          'Formata a célula'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual função retorna a posição de uma letra específica em um texto?',
        tipo: 'multipla_escolha',
        alternativas: ['=POSIÇÃO()', '=PROCURAR()', '=LOCALIZAR()', '=PROCURAR() ou =LOCALIZAR()'],
        respostaCorreta: 3,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Descreva como você organizaria uma planilha para controle de despesas mensais.',
        tipo: 'dissertativa',
        pontuacao: 15,
        dificuldade: 'medio',
      },
    ],
  },
  {
    id: 'excel-avancado',
    titulo: 'Excel Avançado - Análise de Dados',
    descricao: 'Avalia conhecimentos avançados de Excel para análise e modelagem',
    categoria: 'excel',
    departamentos: ['ti', 'financeiro', 'operacoes'],
    niveisAplicaveis: ['intermediario', 'avancado'],
    duracao: 45,
    notaMinima: 65,
    tags: ['excel avançado', 'análise de dados', 'VBA'],
    questoes: [
      {
        enunciado: 'Qual combinação de funções busca um valor em uma tabela com correspondência aproximada e índice?',
        tipo: 'multipla_escolha',
        alternativas: [
          'PROCV com FALSO',
          'ÍNDICE + CORRESP',
          'PROCX apenas',
          'Todas as alternativas funcionam'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que significa a função =PROCX não encontrar uma correspondência exata?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Retorna erro #N/D por padrão',
          'Retorna o valor mais próximo',
          'Retorna a primeira célula',
          'Pode retornar erro ou valor customizado'
        ],
        respostaCorreta: 3,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual é a principal vantagem de usar Tabelas Dinâmicas?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Formatação mais bonita',
          'Resumir e analisar grandes volumes de dados dinamicamente',
          'Ocupar menos espaço',
          'Proteger dados'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual função de matriz dinâmica retorna valores únicos de um intervalo?',
        tipo: 'multipla_escolha',
        alternativas: ['=ÚNICO()', '=VALORES()', '=DISTINTOS()', '=REMOVERDUPLICADOS()'],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Como você combinaria dados de múltiplas planilhas em um único relatório?',
        tipo: 'dissertativa',
        pontuacao: 20,
        dificuldade: 'dificil',
      },
      {
        enunciado: 'Qual função calcula a diferença entre duas datas em dias úteis?',
        tipo: 'multipla_escolha',
        alternativas: ['=DATEDIF()', '=DIASTRABALHO()', '=DIAÚTIL.VALOR()', '=DIAS.ÚTEIS()'],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: '=SE(ÉERRO(PROCV(...));"Não encontrado";PROCV(...)) pode ser substituído por:',
        tipo: 'multipla_escolha',
        alternativas: ['=SEERRO(PROCV(...);"Não encontrado")', '=SEÉRRO()', '=SEPROC()', '=PROCV.SE()'],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que é Power Query no Excel?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Uma ferramenta de gráficos',
          'Um suplemento para ETL e transformação de dados',
          'Um tipo de tabela dinâmica',
          'Uma função de busca'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
    ],
  },
];

// ============================================================
// 5. TÉCNICO - ESPECÍFICO POR ÁREA
// ============================================================
export const tecnicoTestTemplates: TestTemplate[] = [
  {
    id: 'ti-desenvolvimento',
    titulo: 'Conhecimentos Técnicos - Desenvolvimento',
    descricao: 'Avalia conhecimentos de programação e desenvolvimento de software',
    categoria: 'tecnica',
    departamentos: ['ti'],
    niveisAplicaveis: ['intermediario', 'avancado'],
    duracao: 45,
    notaMinima: 70,
    tags: ['programação', 'desenvolvimento', 'tecnologia'],
    questoes: [
      {
        enunciado: 'Qual a diferença entre let, const e var em JavaScript?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Não há diferença',
          'let e const têm escopo de bloco; var tem escopo de função',
          'var é mais moderno',
          'const não existe em JavaScript'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'O que é REST API?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Um tipo de banco de dados',
          'Uma arquitetura para serviços web stateless',
          'Uma linguagem de programação',
          'Um framework frontend'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual a complexidade de tempo do algoritmo de busca binária?',
        tipo: 'multipla_escolha',
        alternativas: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        respostaCorreta: 2,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que é SOLID em programação orientada a objetos?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Um tipo de banco de dados',
          'Cinco princípios de design de software',
          'Uma linguagem de programação',
          'Um padrão de API'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Explique o conceito de Git e por que é importante para desenvolvimento em equipe.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual é a principal diferença entre SQL e NoSQL?',
        tipo: 'multipla_escolha',
        alternativas: [
          'SQL é mais rápido',
          'NoSQL não armazena dados',
          'SQL é relacional; NoSQL é não-relacional',
          'São a mesma coisa'
        ],
        respostaCorreta: 2,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'O que é Docker e para que serve?',
        tipo: 'dissertativa',
        pontuacao: 20,
        dificuldade: 'medio',
      },
    ],
  },
  {
    id: 'comercial-vendas',
    titulo: 'Conhecimentos Técnicos - Vendas',
    descricao: 'Avalia conhecimentos de técnicas de vendas e negociação',
    categoria: 'tecnica',
    departamentos: ['comercial'],
    niveisAplicaveis: ['basico', 'intermediario'],
    duracao: 30,
    notaMinima: 65,
    tags: ['vendas', 'negociação', 'comercial'],
    questoes: [
      {
        enunciado: 'O que significa SPIN Selling?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Situação, Problema, Implicação, Necessidade de solução',
          'Sistema de Pontos de Interesse Nacional',
          'Selling Points In Negotiation',
          'Sales Process Integration Network'
        ],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que é um funil de vendas?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Um equipamento de escritório',
          'Um modelo que representa as etapas do cliente até a compra',
          'Um tipo de contrato',
          'Uma técnica de desconto'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual é a principal diferença entre venda B2B e B2C?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Não há diferença',
          'B2B é para empresas; B2C é para consumidor final',
          'B2C é mais complexo',
          'B2B é apenas online'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Como você lidaria com uma objeção de preço do cliente?',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que é Customer Success e por que é importante?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Apenas atendimento ao cliente',
          'Garantir que o cliente alcance seus objetivos com o produto',
          'Vender mais produtos',
          'Resolver reclamações'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual a diferença entre up-sell e cross-sell?',
        tipo: 'multipla_escolha',
        alternativas: [
          'São a mesma coisa',
          'Up-sell é vender versão superior; cross-sell é vender produtos complementares',
          'Cross-sell é mais caro',
          'Up-sell é para novos clientes'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Descreva sua abordagem para prospecção de novos clientes.',
        tipo: 'dissertativa',
        pontuacao: 20,
        dificuldade: 'medio',
      },
    ],
  },
  {
    id: 'financeiro-contabilidade',
    titulo: 'Conhecimentos Técnicos - Financeiro',
    descricao: 'Avalia conhecimentos de finanças, contabilidade e análise',
    categoria: 'tecnica',
    departamentos: ['financeiro'],
    niveisAplicaveis: ['intermediario', 'avancado'],
    duracao: 40,
    notaMinima: 70,
    tags: ['finanças', 'contabilidade', 'análise financeira'],
    questoes: [
      {
        enunciado: 'O que é EBITDA?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Lucro antes de impostos',
          'Lucro antes de juros, impostos, depreciação e amortização',
          'Receita total',
          'Margem de lucro'
        ],
        respostaCorreta: 1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual a diferença entre regime de caixa e competência?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Não há diferença',
          'Caixa reconhece quando paga/recebe; Competência quando o fato ocorre',
          'Competência é apenas para impostos',
          'Caixa é mais preciso'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Como calcular o ponto de equilíbrio?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Receita / Lucro',
          'Custos Fixos / (Preço - Custo Variável Unitário)',
          'Lucro / Vendas',
          'Ativos / Passivos'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Explique a importância do fluxo de caixa para uma empresa.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que representa o índice de liquidez corrente?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Capacidade de pagar dívidas de longo prazo',
          'Capacidade de pagar obrigações de curto prazo com ativos circulantes',
          'Rentabilidade da empresa',
          'Margem de lucro'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Qual a fórmula do ROI (Return on Investment)?',
        tipo: 'multipla_escolha',
        alternativas: [
          '(Ganho - Custo) / Custo × 100',
          'Receita / Custos',
          'Lucro / Receita',
          'Ativos / Patrimônio'
        ],
        respostaCorreta: 0,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'O que é DRE e quais informações ela fornece?',
        tipo: 'dissertativa',
        pontuacao: 20,
        dificuldade: 'medio',
      },
    ],
  },
];

// ============================================================
// 6. FIT CULTURAL
// ============================================================
export const fitCulturalTestTemplates: TestTemplate[] = [
  {
    id: 'fit-cultural-geral',
    titulo: 'Fit Cultural - Alinhamento de Valores',
    descricao: 'Avalia alinhamento com a cultura organizacional e valores da empresa',
    categoria: 'fit_cultural',
    departamentos: ['geral'],
    niveisAplicaveis: ['basico', 'intermediario', 'avancado'],
    duracao: 20,
    notaMinima: 60,
    tags: ['cultura', 'valores', 'fit cultural'],
    questoes: [
      {
        enunciado: 'O que você valoriza mais em um ambiente de trabalho?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Hierarquia clara e processos definidos',
          'Flexibilidade e autonomia',
          'Colaboração e trabalho em equipe',
          'Competitividade e meritocracia'
        ],
        respostaCorreta: -1, // Não há resposta certa - é análise de fit
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Como você reage a mudanças inesperadas no trabalho?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Fico incomodado e prefiro estabilidade',
          'Aceito, mas preciso de tempo para adaptação',
          'Vejo como oportunidade de aprendizado',
          'Gosto muito e me sinto energizado'
        ],
        respostaCorreta: -1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Quando você discorda de uma decisão do seu líder:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Aceito a decisão e sigo em frente',
          'Expresso minha opinião respeitosamente',
          'Busco convencer os colegas da minha visão',
          'Faço do meu jeito mesmo assim'
        ],
        respostaCorreta: -1,
        pontuacao: 15,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Descreva seu ambiente de trabalho ideal e por quê.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'O que te motiva a dar o melhor de si no trabalho?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Recompensa financeira',
          'Reconhecimento e elogios',
          'Crescimento e aprendizado',
          'Impacto positivo no resultado'
        ],
        respostaCorreta: -1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual sua preferência sobre trabalho remoto?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Prefiro 100% presencial',
          'Híbrido com mais presencial',
          'Híbrido com mais remoto',
          'Prefiro 100% remoto'
        ],
        respostaCorreta: -1,
        pontuacao: 10,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Conte sobre uma situação em que teve que se adaptar a uma cultura diferente.',
        tipo: 'dissertativa',
        pontuacao: 20,
        dificuldade: 'medio',
      },
    ],
  },
];

// ============================================================
// 7. COMPORTAMENTAL
// ============================================================
export const comportamentalTestTemplates: TestTemplate[] = [
  {
    id: 'comportamental-lideranca',
    titulo: 'Avaliação Comportamental - Liderança',
    descricao: 'Avalia competências comportamentais de liderança e gestão',
    categoria: 'comportamental',
    departamentos: ['geral'],
    niveisAplicaveis: ['intermediario', 'avancado'],
    duracao: 25,
    notaMinima: 60,
    tags: ['liderança', 'gestão', 'comportamental'],
    questoes: [
      {
        enunciado: 'Descreva uma situação em que você precisou liderar uma equipe em um projeto desafiador. O que você fez e qual foi o resultado?',
        tipo: 'dissertativa',
        pontuacao: 30,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Quando um membro da equipe está com desempenho abaixo do esperado, você:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Comunica imediatamente o RH',
          'Dá feedback construtivo e oferece suporte',
          'Espera que melhore sozinho',
          'Transfere para outra área'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Conte sobre uma decisão difícil que você teve que tomar que afetou outras pessoas.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Como você mantém sua equipe motivada durante períodos de alta pressão?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Aumento de metas para energizar',
          'Comunicação clara, reconhecimento e suporte',
          'Evito falar sobre a pressão',
          'Deixo cada um se virar'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Qual sua abordagem para delegar tarefas?',
        tipo: 'dissertativa',
        pontuacao: 15,
        dificuldade: 'medio',
      },
    ],
  },
  {
    id: 'comportamental-resolucao-problemas',
    titulo: 'Avaliação Comportamental - Resolução de Problemas',
    descricao: 'Avalia capacidade analítica e resolução de problemas',
    categoria: 'comportamental',
    departamentos: ['geral'],
    niveisAplicaveis: ['basico', 'intermediario', 'avancado'],
    duracao: 25,
    notaMinima: 60,
    tags: ['resolução de problemas', 'análise', 'comportamental'],
    questoes: [
      {
        enunciado: 'Descreva um problema complexo que você resolveu no trabalho. Como você abordou?',
        tipo: 'dissertativa',
        pontuacao: 30,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Quando você enfrenta um problema sem solução óbvia:',
        tipo: 'multipla_escolha',
        alternativas: [
          'Peço ajuda imediatamente',
          'Pesquiso e analiso antes de agir',
          'Tento a primeira solução que penso',
          'Espero o problema se resolver'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Conte sobre uma situação em que você identificou um problema antes que outros percebessem.',
        tipo: 'dissertativa',
        pontuacao: 25,
        dificuldade: 'medio',
      },
      {
        enunciado: 'Como você prioriza quando tem múltiplos problemas para resolver?',
        tipo: 'multipla_escolha',
        alternativas: [
          'Resolvo por ordem de chegada',
          'Priorizo por impacto e urgência',
          'Faço o mais fácil primeiro',
          'Peço para outros priorizarem'
        ],
        respostaCorreta: 1,
        pontuacao: 15,
        dificuldade: 'facil',
      },
      {
        enunciado: 'Descreva sua metodologia para analisar e resolver problemas.',
        tipo: 'dissertativa',
        pontuacao: 15,
        dificuldade: 'medio',
      },
    ],
  },
];

// ============================================================
// AGREGADOR DE TODOS OS TEMPLATES
// ============================================================
export const allTestTemplates: TestTemplate[] = [
  ...logicaTestTemplates,
  ...portuguesTestTemplates,
  ...inglesTestTemplates,
  ...excelTestTemplates,
  ...tecnicoTestTemplates,
  ...fitCulturalTestTemplates,
  ...comportamentalTestTemplates,
];

// Função para buscar templates por categoria
export function getTemplatesByCategory(categoria: CategoriaProva): TestTemplate[] {
  return allTestTemplates.filter(t => t.categoria === categoria);
}

// Função para buscar templates por departamento
export function getTemplatesByDepartment(departamento: Departamento): TestTemplate[] {
  return allTestTemplates.filter(t => t.departamentos.includes(departamento) || t.departamentos.includes('geral'));
}

// Função para buscar templates por nível
export function getTemplatesByLevel(nivel: NivelCargo): TestTemplate[] {
  return allTestTemplates.filter(t => t.niveisAplicaveis.includes(nivel));
}

// Função para buscar template por ID
export function getTemplateById(id: string): TestTemplate | undefined {
  return allTestTemplates.find(t => t.id === id);
}

export default allTestTemplates;
