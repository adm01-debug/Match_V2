// Traduções em Português Brasileiro
// Para usar: npm install react-i18next i18next

export const ptBR = {
  common: {
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    search: 'Buscar',
    filter: 'Filtrar',
    actions: 'Ações',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    yes: 'Sim',
    no: 'Não',
    all: 'Todos',
    none: 'Nenhum',
    select: 'Selecionar',
    required: 'Obrigatório',
    optional: 'Opcional',
  },
  auth: {
    login: 'Entrar',
    logout: 'Sair',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueci minha senha',
    register: 'Cadastrar',
  },
  navigation: {
    dashboard: 'Dashboard',
    vagas: 'Vagas',
    pipeline: 'Pipeline',
    candidatos: 'Candidatos',
    testes: 'Testes',
    agenda: 'Agenda',
    comunicacao: 'Comunicação',
    relatorios: 'Relatórios',
    indicacoes: 'Indicações',
    admin: 'Administração',
  },
  vagas: {
    title: 'Vagas',
    new: 'Nova Vaga',
    edit: 'Editar Vaga',
    status: {
      aberta: 'Aberta',
      pausada: 'Pausada',
      fechada: 'Fechada',
      cancelada: 'Cancelada',
    },
    priority: {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
      urgente: 'Urgente',
    },
  },
  candidatos: {
    title: 'Candidatos',
    new: 'Novo Candidato',
    profile: 'Perfil do Candidato',
    status: {
      novo: 'Novo',
      em_analise: 'Em Análise',
      aprovado: 'Aprovado',
      reprovado: 'Reprovado',
      contratado: 'Contratado',
    },
  },
  pipeline: {
    title: 'Pipeline de Recrutamento',
    stages: {
      novo: 'Novo',
      triagem: 'Triagem',
      entrevista_rh: 'Entrevista RH',
      teste_tecnico: 'Teste Técnico',
      entrevista_gestor: 'Entrevista Gestor',
      proposta: 'Proposta',
      contratado: 'Contratado',
    },
  },
  messages: {
    success: {
      saved: 'Salvo com sucesso!',
      deleted: 'Excluído com sucesso!',
      updated: 'Atualizado com sucesso!',
    },
    error: {
      generic: 'Ocorreu um erro. Tente novamente.',
      notFound: 'Item não encontrado.',
      unauthorized: 'Acesso não autorizado.',
    },
  },
};

export type Translations = typeof ptBR;
