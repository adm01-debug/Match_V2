// Dados mockados detalhados para o perfil completo do candidato

export interface ExperienciaProfissional {
  id: string;
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim?: string;
  atual: boolean;
  descricao: string[];
}

export interface FormacaoAcademica {
  id: string;
  instituicao: string;
  curso: string;
  nivel: 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';
  anoConclusao: string;
  status: 'concluido' | 'cursando' | 'trancado';
}

export interface Certificacao {
  id: string;
  nome: string;
  instituicao: string;
  dataEmissao: string;
  dataValidade?: string;
}

export interface AvaliacaoRegistrada {
  id: string;
  tipo: 'triagem' | 'entrevista_rh' | 'teste_tecnico' | 'entrevista_gestor' | 'entrevista_final';
  tipoLabel: string;
  data: string;
  avaliador: string;
  notaGeral: number;
  notas: { criterio: string; nota: number }[];
  observacoes: string;
  recomendacao: 'aprovar' | 'reprovar' | 'duvida';
}

export interface HistoricoEvento {
  id: string;
  data: string;
  hora: string;
  tipo: 'candidatura' | 'triagem' | 'entrevista' | 'teste' | 'avaliacao' | 'mudanca_etapa' | 'comunicacao';
  tipoIcon: string;
  descricao: string;
  detalhes?: string;
  usuario?: string;
}

export interface ArquivoAnexo {
  id: string;
  nome: string;
  tipo: 'curriculo' | 'certificado' | 'carta' | 'portfolio' | 'outro';
  tamanho: string;
  dataUpload: string;
  url: string;
}

export interface CandidatoPerfil {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  linkedin?: string;
  cidade: string;
  estado: string;
  foto?: string;
  cargoAtual?: string;
  empresaAtual?: string;
  resumoProfissional: string;
  pretensaoSalarial: number;
  disponibilidade: 'imediata' | '15_dias' | '30_dias' | 'negociar';
  disponibilidadeLabel: string;
  matchScore: number;
  origem: string;
  origemLabel: string;
  dataCadastro: string;
  status: string;
  statusLabel: string;
  vagaAtual?: string;
  etapaAtual?: string;
  etapaAtualLabel?: string;
  skills: { nome: string; nivel: number }[];
  experiencias: ExperienciaProfissional[];
  formacao: FormacaoAcademica[];
  certificacoes: Certificacao[];
  avaliacoes: AvaliacaoRegistrada[];
  historico: HistoricoEvento[];
  arquivos: ArquivoAnexo[];
}

// Candidato de exemplo com perfil completo
export const candidatoPerfilMock: CandidatoPerfil = {
  id: 'c1',
  nome: 'Carlos Eduardo Silva',
  email: 'carlos.silva@email.com',
  telefone: '(11) 98765-4321',
  linkedin: 'linkedin.com/in/carlossilva',
  cidade: 'São Paulo',
  estado: 'SP',
  cargoAtual: 'Operador de Produção',
  empresaAtual: 'Gráfica ABC Ltda',
  resumoProfissional: 'Profissional com 3 anos de experiência em operação de máquinas industriais, especializado em gravação a laser e tampografia. Comprometido com qualidade e eficiência produtiva.',
  pretensaoSalarial: 2800,
  disponibilidade: 'imediata',
  disponibilidadeLabel: 'Disponível para início imediato',
  matchScore: 92,
  origem: 'indeed',
  origemLabel: 'Indeed',
  dataCadastro: '10/12/2025',
  status: 'em_processo',
  statusLabel: 'Em processo seletivo',
  vagaAtual: 'Operador de Gravação',
  etapaAtual: 'entrevista_gestor',
  etapaAtualLabel: 'Entrevista com Gestor',
  skills: [
    { nome: 'Gravação Laser', nivel: 5 },
    { nome: 'CorelDraw', nivel: 4 },
    { nome: 'Tampografia', nivel: 3 },
    { nome: 'CNC', nivel: 4 },
    { nome: 'Manutenção Preventiva', nivel: 4 },
    { nome: 'Controle de Qualidade', nivel: 5 },
  ],
  experiencias: [
    {
      id: 'exp1',
      empresa: 'Gráfica ABC Ltda',
      cargo: 'Operador de Produção',
      dataInicio: 'Jan/2022',
      atual: true,
      descricao: [
        'Operação de máquinas de gravação a laser com precisão',
        'Controle de qualidade de produtos personalizados',
        'Manutenção preventiva de equipamentos',
        'Treinamento de novos colaboradores',
      ],
    },
    {
      id: 'exp2',
      empresa: 'Empresa XYZ Indústria',
      cargo: 'Auxiliar de Produção',
      dataInicio: 'Mar/2020',
      dataFim: 'Dez/2021',
      atual: false,
      descricao: [
        'Apoio na linha de produção',
        'Embalagem e expedição de produtos',
        'Controle de estoque de materiais',
      ],
    },
    {
      id: 'exp3',
      empresa: 'Metalúrgica Santos',
      cargo: 'Aprendiz Industrial',
      dataInicio: 'Jan/2019',
      dataFim: 'Fev/2020',
      atual: false,
      descricao: [
        'Programa de aprendizagem industrial SENAI',
        'Operação básica de máquinas CNC',
        'Leitura e interpretação de desenhos técnicos',
      ],
    },
  ],
  formacao: [
    {
      id: 'form1',
      instituicao: 'SENAI São Paulo',
      curso: 'Técnico em Mecânica',
      nivel: 'tecnico',
      anoConclusao: '2019',
      status: 'concluido',
    },
    {
      id: 'form2',
      instituicao: 'Escola Estadual Prof. João Silva',
      curso: 'Ensino Médio',
      nivel: 'medio',
      anoConclusao: '2017',
      status: 'concluido',
    },
  ],
  certificacoes: [
    {
      id: 'cert1',
      nome: 'Operador de Gravação a Laser',
      instituicao: 'SENAI',
      dataEmissao: '2022',
    },
    {
      id: 'cert2',
      nome: 'CorelDraw Avançado',
      instituicao: 'Corel Corporation',
      dataEmissao: '2021',
    },
    {
      id: 'cert3',
      nome: 'NR-12 Segurança em Máquinas',
      instituicao: 'Safety Training',
      dataEmissao: '2023',
      dataValidade: '2025',
    },
  ],
  avaliacoes: [
    {
      id: 'aval1',
      tipo: 'triagem',
      tipoLabel: 'Triagem Telefônica',
      data: '12/12/2025',
      avaliador: 'Maria Santos (RH)',
      notaGeral: 5,
      notas: [
        { criterio: 'Comunicação', nota: 5 },
        { criterio: 'Interesse na vaga', nota: 5 },
        { criterio: 'Disponibilidade', nota: 5 },
        { criterio: 'Expectativa salarial', nota: 4 },
      ],
      observacoes: 'Candidato muito articulado, demonstrou conhecimento técnico sobre gravação a laser. Disponível para início imediato. Recomendo avançar para próxima etapa.',
      recomendacao: 'aprovar',
    },
    {
      id: 'aval2',
      tipo: 'entrevista_rh',
      tipoLabel: 'Entrevista RH',
      data: '13/12/2025',
      avaliador: 'Maria Santos (RH)',
      notaGeral: 4,
      notas: [
        { criterio: 'Postura profissional', nota: 5 },
        { criterio: 'Histórico profissional', nota: 4 },
        { criterio: 'Fit cultural', nota: 5 },
        { criterio: 'Motivação', nota: 4 },
      ],
      observacoes: 'Ótima postura durante a entrevista. Demonstrou interesse genuíno na empresa e na vaga. Histórico profissional consistente com a posição.',
      recomendacao: 'aprovar',
    },
    {
      id: 'aval3',
      tipo: 'teste_tecnico',
      tipoLabel: 'Teste Técnico Prático',
      data: '14/12/2025',
      avaliador: 'Carlos Mendes (Supervisor)',
      notaGeral: 4,
      notas: [
        { criterio: 'Conhecimento técnico', nota: 5 },
        { criterio: 'Habilidade prática', nota: 4 },
        { criterio: 'Qualidade do trabalho', nota: 4 },
        { criterio: 'Velocidade de execução', nota: 4 },
      ],
      observacoes: 'Experiência sólida com gravação. Mostrou conhecimento prático durante demonstração. Falta experiência com tampografia, mas demonstrou disposição para aprender.',
      recomendacao: 'aprovar',
    },
  ],
  historico: [
    {
      id: 'hist1',
      data: '16/12/2025',
      hora: '14:00',
      tipo: 'mudanca_etapa',
      tipoIcon: '✅',
      descricao: 'Entrevista Final agendada',
      detalhes: 'Agendada para 18/12/2025 às 09:00',
      usuario: 'Maria Santos',
    },
    {
      id: 'hist2',
      data: '14/12/2025',
      hora: '15:30',
      tipo: 'avaliacao',
      tipoIcon: '📝',
      descricao: 'Avaliação do teste técnico registrada',
      detalhes: 'Nota: 8.5/10 - Recomendação: Aprovar',
      usuario: 'Carlos Mendes',
    },
    {
      id: 'hist3',
      data: '14/12/2025',
      hora: '10:00',
      tipo: 'teste',
      tipoIcon: '📝',
      descricao: 'Teste técnico prático realizado',
      detalhes: 'Demonstração de gravação a laser',
    },
    {
      id: 'hist4',
      data: '13/12/2025',
      hora: '14:00',
      tipo: 'avaliacao',
      tipoIcon: '✅',
      descricao: 'Avaliação da entrevista RH registrada',
      detalhes: 'Nota: 4/5 - Recomendação: Aprovar',
      usuario: 'Maria Santos',
    },
    {
      id: 'hist5',
      data: '13/12/2025',
      hora: '10:00',
      tipo: 'entrevista',
      tipoIcon: '🎤',
      descricao: 'Entrevista com RH realizada',
      detalhes: 'Presencial - Sala de Reuniões',
    },
    {
      id: 'hist6',
      data: '12/12/2025',
      hora: '11:00',
      tipo: 'avaliacao',
      tipoIcon: '✅',
      descricao: 'Avaliação da triagem registrada',
      detalhes: 'Nota: 5/5 - Recomendação: Aprovar',
      usuario: 'Maria Santos',
    },
    {
      id: 'hist7',
      data: '12/12/2025',
      hora: '10:00',
      tipo: 'triagem',
      tipoIcon: '📞',
      descricao: 'Triagem telefônica realizada',
      detalhes: 'Duração: 15 minutos',
    },
    {
      id: 'hist8',
      data: '11/12/2025',
      hora: '09:00',
      tipo: 'comunicacao',
      tipoIcon: '📧',
      descricao: 'E-mail de confirmação de candidatura enviado',
      usuario: 'Sistema',
    },
    {
      id: 'hist9',
      data: '10/12/2025',
      hora: '08:30',
      tipo: 'candidatura',
      tipoIcon: '📥',
      descricao: 'Candidatura recebida via Indeed',
      detalhes: 'Vaga: Operador de Gravação',
    },
  ],
  arquivos: [
    {
      id: 'arq1',
      nome: 'curriculo_carlos_silva.pdf',
      tipo: 'curriculo',
      tamanho: '234 KB',
      dataUpload: '10/12/2025',
      url: '#',
    },
    {
      id: 'arq2',
      nome: 'certificado_gravacao_laser.pdf',
      tipo: 'certificado',
      tamanho: '156 KB',
      dataUpload: '10/12/2025',
      url: '#',
    },
    {
      id: 'arq3',
      nome: 'carta_recomendacao_abc.pdf',
      tipo: 'carta',
      tamanho: '89 KB',
      dataUpload: '10/12/2025',
      url: '#',
    },
  ],
};

// Lista de candidatos para seleção
export const candidatosListaMock: Partial<CandidatoPerfil>[] = [
  {
    id: 'c1',
    nome: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    matchScore: 92,
    etapaAtualLabel: 'Entrevista Gestor',
    vagaAtual: 'Operador de Gravação',
  },
  {
    id: 'c2',
    nome: 'Ana Paula Oliveira',
    email: 'ana.oliveira@email.com',
    matchScore: 85,
    etapaAtualLabel: 'Entrevista RH',
    vagaAtual: 'Operador de Gravação',
  },
  {
    id: 'c3',
    nome: 'Roberto Santos Ferreira',
    email: 'roberto.f@email.com',
    matchScore: 88,
    etapaAtualLabel: 'Teste Técnico',
    vagaAtual: 'Operador de Gravação',
  },
];
