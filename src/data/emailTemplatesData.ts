export interface EmailTemplate {
  id: string;
  nome: string;
  etapa: string;
  assunto: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export const etapasProcesso = [
  { value: 'candidatura_recebida', label: 'Candidatura Recebida' },
  { value: 'triagem', label: 'Em Triagem' },
  { value: 'convite_entrevista_rh', label: 'Convite Entrevista RH' },
  { value: 'convite_entrevista_gestor', label: 'Convite Entrevista Gestor' },
  { value: 'convite_testes', label: 'Convite para Testes' },
  { value: 'feedback_positivo', label: 'Feedback Positivo' },
  { value: 'feedback_negativo', label: 'Feedback Negativo' },
  { value: 'proposta', label: 'Proposta de Emprego' },
  { value: 'contratacao', label: 'Confirmação Contratação' },
  { value: 'banco_talentos', label: 'Banco de Talentos' },
];

export const variaveisDisponiveis = [
  { nome: '{{candidato_nome}}', descricao: 'Nome do candidato' },
  { nome: '{{vaga_titulo}}', descricao: 'Título da vaga' },
  { nome: '{{empresa_nome}}', descricao: 'Nome da empresa' },
  { nome: '{{data_entrevista}}', descricao: 'Data da entrevista' },
  { nome: '{{hora_entrevista}}', descricao: 'Hora da entrevista' },
  { nome: '{{local_entrevista}}', descricao: 'Local/Link da entrevista' },
  { nome: '{{recrutador_nome}}', descricao: 'Nome do recrutador' },
  { nome: '{{prazo_testes}}', descricao: 'Prazo para realizar testes' },
  { nome: '{{salario_proposto}}', descricao: 'Salário proposto' },
  { nome: '{{data_inicio}}', descricao: 'Data de início' },
];

export const emailTemplatesMock: EmailTemplate[] = [
  {
    id: '1',
    nome: 'Confirmação de Candidatura',
    etapa: 'candidatura_recebida',
    assunto: 'Recebemos sua candidatura para {{vaga_titulo}} - {{empresa_nome}}',
    conteudo: `Olá {{candidato_nome}},

Agradecemos seu interesse em fazer parte da equipe {{empresa_nome}}!

Recebemos sua candidatura para a vaga de {{vaga_titulo}} e ela já está sendo analisada pelo nosso time de Recrutamento.

Próximos passos:
• Nossa equipe avaliará seu perfil nos próximos dias
• Caso seu perfil seja compatível, entraremos em contato para as próximas etapas
• Você pode acompanhar o status da sua candidatura pelo portal

Agradecemos a confiança e desejamos boa sorte!

Atenciosamente,
Equipe de RH - {{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'empresa_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
  {
    id: '2',
    nome: 'Convite Entrevista RH',
    etapa: 'convite_entrevista_rh',
    assunto: 'Convite para Entrevista - {{vaga_titulo}} | {{empresa_nome}}',
    conteudo: `Olá {{candidato_nome}},

Temos o prazer de informar que você foi pré-selecionado(a) para a vaga de {{vaga_titulo}}!

Gostaríamos de convidá-lo(a) para uma entrevista com nosso time de RH:

📅 Data: {{data_entrevista}}
🕐 Horário: {{hora_entrevista}}
📍 Local: {{local_entrevista}}

Por favor, confirme sua participação respondendo este e-mail.

Caso não possa comparecer na data sugerida, entre em contato para reagendarmos.

Estamos ansiosos para conhecê-lo(a)!

Atenciosamente,
{{recrutador_nome}}
{{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'empresa_nome', 'data_entrevista', 'hora_entrevista', 'local_entrevista', 'recrutador_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
  {
    id: '3',
    nome: 'Convite para Testes',
    etapa: 'convite_testes',
    assunto: 'Próxima Etapa: Avaliação Técnica - {{vaga_titulo}}',
    conteudo: `Olá {{candidato_nome}},

Parabéns! Você avançou no processo seletivo para {{vaga_titulo}}!

A próxima etapa consiste em uma avaliação técnica que nos ajudará a conhecer melhor suas habilidades.

📝 Instruções:
• Acesse o link de testes que será enviado em breve
• Você terá até {{prazo_testes}} para concluir
• Reserve um ambiente tranquilo e sem interrupções
• Tenha uma conexão estável de internet

Dicas importantes:
• Leia atentamente cada questão antes de responder
• Gerencie bem seu tempo
• Seja autêntico(a) nas respostas comportamentais

Qualquer dúvida, estamos à disposição!

Boa sorte!
{{recrutador_nome}}
{{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'prazo_testes', 'recrutador_nome', 'empresa_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
  {
    id: '4',
    nome: 'Feedback Positivo - Aprovação',
    etapa: 'feedback_positivo',
    assunto: '🎉 Parabéns! Você foi aprovado(a) - {{vaga_titulo}}',
    conteudo: `Olá {{candidato_nome}},

É com grande satisfação que comunicamos: VOCÊ FOI APROVADO(A)! 🎉

Após análise criteriosa do seu perfil e desempenho nas etapas do processo seletivo, decidimos que você é a pessoa ideal para a vaga de {{vaga_titulo}}.

Ficamos muito impressionados com:
• Suas competências técnicas
• Seu alinhamento cultural com nossa empresa
• Seu potencial de crescimento

Próximos passos:
Em breve, nosso time entrará em contato para apresentar a proposta formal e alinhar os detalhes da contratação.

Seja muito bem-vindo(a) à equipe {{empresa_nome}}!

Com entusiasmo,
{{recrutador_nome}}
{{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'empresa_nome', 'recrutador_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
  {
    id: '5',
    nome: 'Feedback Negativo',
    etapa: 'feedback_negativo',
    assunto: 'Atualização sobre sua candidatura - {{vaga_titulo}}',
    conteudo: `Olá {{candidato_nome}},

Agradecemos imensamente seu interesse na vaga de {{vaga_titulo}} e o tempo dedicado ao nosso processo seletivo.

Após cuidadosa análise de todos os candidatos, decidimos seguir com outros perfis que se mostraram mais aderentes aos requisitos específicos desta posição neste momento.

Esta decisão não diminui o valor das suas qualificações. O mercado é dinâmico e seu perfil certamente será valorizado em outras oportunidades.

Gostaríamos de manter seu currículo em nosso banco de talentos para futuras vagas compatíveis com seu perfil.

Desejamos sucesso em sua trajetória profissional!

Atenciosamente,
{{recrutador_nome}}
{{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'empresa_nome', 'recrutador_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
  {
    id: '6',
    nome: 'Proposta de Emprego',
    etapa: 'proposta',
    assunto: 'Proposta de Emprego - {{vaga_titulo}} | {{empresa_nome}}',
    conteudo: `Olá {{candidato_nome}},

É com grande satisfação que formalizamos nossa proposta para você integrar a equipe {{empresa_nome}} como {{vaga_titulo}}.

📋 Detalhes da Proposta:
• Cargo: {{vaga_titulo}}
• Remuneração: {{salario_proposto}}
• Data prevista de início: {{data_inicio}}

Benefícios inclusos:
• Vale Refeição
• Vale Transporte
• Plano de Saúde
• Plano Odontológico
• Seguro de Vida

Aguardamos seu retorno em até 5 dias úteis.

Estamos entusiasmados com a possibilidade de tê-lo(a) conosco!

Atenciosamente,
{{recrutador_nome}}
{{empresa_nome}}`,
    variaveis: ['candidato_nome', 'vaga_titulo', 'empresa_nome', 'salario_proposto', 'data_inicio', 'recrutador_nome'],
    ativo: true,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-01-15',
  },
];
