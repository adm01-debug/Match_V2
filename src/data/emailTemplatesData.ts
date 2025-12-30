/**
 * @fileoverview Email templates mock data
 */

export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  conteudo: string;
  etapa: string;
  ativo: boolean;
}

export interface VariavelDisponivel {
  nome: string;
  descricao: string;
}

export const emailTemplatesMock: EmailTemplate[] = [
  {
    id: '1',
    nome: 'Confirmação de Candidatura',
    assunto: 'Candidatura recebida - {{vaga_titulo}}',
    conteudo: 'Olá {{candidato_nome}},\n\nRecebemos sua candidatura para a vaga de {{vaga_titulo}} na {{empresa_nome}}.\n\nEm breve entraremos em contato.\n\nAtenciosamente,\n{{recrutador_nome}}',
    etapa: 'candidatura',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Convite para Entrevista',
    assunto: 'Convite para entrevista - {{vaga_titulo}}',
    conteudo: 'Olá {{candidato_nome}},\n\nGostaríamos de convidá-lo(a) para uma entrevista para a vaga de {{vaga_titulo}}.\n\nData: {{data_entrevista}}\nHorário: {{hora_entrevista}}\nLocal: {{local_entrevista}}\n\nPor favor, confirme sua presença.\n\nAtenciosamente,\n{{recrutador_nome}}',
    etapa: 'entrevista_rh',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Feedback Positivo',
    assunto: 'Parabéns! Próximos passos - {{vaga_titulo}}',
    conteudo: 'Olá {{candidato_nome}},\n\nTemos uma ótima notícia! Você foi aprovado(a) na etapa atual do processo seletivo para {{vaga_titulo}}.\n\nEm breve entraremos em contato com os próximos passos.\n\nAtenciosamente,\n{{recrutador_nome}}',
    etapa: 'feedback_positivo',
    ativo: true,
  },
  {
    id: '4',
    nome: 'Feedback Negativo',
    assunto: 'Atualização sobre sua candidatura - {{vaga_titulo}}',
    conteudo: 'Olá {{candidato_nome}},\n\nAgradecemos seu interesse na vaga de {{vaga_titulo}} e o tempo dedicado ao nosso processo seletivo.\n\nInfelizmente, não seguiremos com sua candidatura neste momento, mas manteremos seu currículo em nosso banco de talentos.\n\nDesejamos sucesso em sua jornada profissional.\n\nAtenciosamente,\n{{recrutador_nome}}',
    etapa: 'feedback_negativo',
    ativo: true,
  },
];

export const variaveisDisponiveis: VariavelDisponivel[] = [
  { nome: '{{candidato_nome}}', descricao: 'Nome do candidato' },
  { nome: '{{vaga_titulo}}', descricao: 'Título da vaga' },
  { nome: '{{empresa_nome}}', descricao: 'Nome da empresa' },
  { nome: '{{data_entrevista}}', descricao: 'Data da entrevista' },
  { nome: '{{hora_entrevista}}', descricao: 'Hora da entrevista' },
  { nome: '{{local_entrevista}}', descricao: 'Local da entrevista' },
  { nome: '{{recrutador_nome}}', descricao: 'Nome do recrutador' },
];

export default { emailTemplatesMock, variaveisDisponiveis };