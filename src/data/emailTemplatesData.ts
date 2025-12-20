export interface EmailTemplate {
  id: string;
  nome: string;
  etapa: string;
  assunto: string;
  conteudo: string;
  ativo: boolean;
}

export const emailTemplatesMock: EmailTemplate[] = [
  {
    id: 'convite-entrevista',
    nome: 'Convite para entrevista',
    etapa: 'entrevista',
    assunto: 'Entrevista - {{vaga_titulo}} | {{empresa_nome}}',
    conteudo:
      'Olá {{candidato_nome}},\n\nGostaríamos de convidá-lo(a) para uma entrevista referente à vaga {{vaga_titulo}} na {{empresa_nome}}.\n\nData: {{data_entrevista}}\nHora: {{hora_entrevista}}\nLocal/Link: {{local_entrevista}}\n\nAtenciosamente,\n{{recrutador_nome}}',
    ativo: true,
  },
  {
    id: 'solicitar-testes',
    nome: 'Solicitação de testes',
    etapa: 'teste',
    assunto: 'Próxima etapa - Testes | {{vaga_titulo}}',
    conteudo:
      'Olá {{candidato_nome}},\n\nPara avançarmos no processo da vaga {{vaga_titulo}}, pedimos que você realize os testes dentro do prazo de {{prazo_testes}}.\n\nQualquer dúvida, responda este e-mail.\n\nAtenciosamente,\n{{recrutador_nome}}',
    ativo: true,
  },
  {
    id: 'retorno-processo',
    nome: 'Retorno do processo',
    etapa: 'retorno',
    assunto: 'Atualização do processo | {{vaga_titulo}}',
    conteudo:
      'Olá {{candidato_nome}},\n\nEstamos retornando com uma atualização sobre o processo da vaga {{vaga_titulo}} na {{empresa_nome}}.\n\nObrigado pelo interesse.\n\nAtenciosamente,\n{{recrutador_nome}}',
    ativo: true,
  },
];

export const variaveisDisponiveis: { nome: string; descricao: string }[] = [
  { nome: '{{candidato_nome}}', descricao: 'Nome do candidato' },
  { nome: '{{vaga_titulo}}', descricao: 'Título da vaga' },
  { nome: '{{empresa_nome}}', descricao: 'Nome da empresa' },
  { nome: '{{data_entrevista}}', descricao: 'Data da entrevista' },
  { nome: '{{hora_entrevista}}', descricao: 'Hora da entrevista' },
  { nome: '{{local_entrevista}}', descricao: 'Local ou link da entrevista' },
  { nome: '{{recrutador_nome}}', descricao: 'Nome do recrutador' },
  { nome: '{{prazo_testes}}', descricao: 'Prazo para testes' },
  { nome: '{{salario_proposto}}', descricao: 'Salário proposto' },
  { nome: '{{data_inicio}}', descricao: 'Data prevista de início' },
];
