-- Match ATS - Development Seed Data
-- Run: supabase db reset
-- Note: auth.users cannot be seeded directly - users must be created via Supabase Auth API

-- =============================================
-- SAMPLE VAGAS (Jobs)
-- =============================================
INSERT INTO vagas (id, titulo, departamento, status, prioridade, modalidade, tipo_contrato, quantidade, descricao_empresa, responsabilidades, requisitos_obrigatorios, requisitos_desejaveis, beneficios, salario_min, salario_max, cidade, estado, total_candidatos, em_processo, contratados) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'Tecnologia', 'aberta', 'alta', 'remoto', 'CLT', 2, 'Empresa líder em tecnologia', 'Desenvolver interfaces web responsivas', 'React, TypeScript, 4+ anos de experiência', 'Next.js, Tailwind CSS, Testes automatizados', ARRAY['Vale Refeição', 'Plano de Saúde', 'Home Office'], 12000, 18000, 'São Paulo', 'SP', 45, 12, 0),
  ('00000000-0000-0000-0000-000000000011', 'Desenvolvedor Backend Pleno', 'Tecnologia', 'aberta', 'media', 'hibrido', 'CLT', 1, 'Startup em crescimento', 'Criar APIs escaláveis', 'Node.js, PostgreSQL, 3+ anos', 'Docker, Kubernetes, AWS', ARRAY['Vale Alimentação', 'Gympass', 'PLR'], 8000, 12000, 'Rio de Janeiro', 'RJ', 32, 8, 0),
  ('00000000-0000-0000-0000-000000000012', 'Product Manager', 'Produto', 'aberta', 'alta', 'presencial', 'CLT', 1, 'Fintech inovadora', 'Gerenciar roadmap de produto', 'Experiência com metodologias ágeis, 5+ anos em produto', 'Certificação Scrum, Experiência em fintech', ARRAY['Stock Options', 'Plano Dental', 'Auxílio Educação'], 15000, 22000, 'São Paulo', 'SP', 28, 5, 0),
  ('00000000-0000-0000-0000-000000000013', 'Designer UX/UI', 'Design', 'pausada', 'baixa', 'remoto', 'PJ', 1, 'Agência digital', 'Criar interfaces intuitivas', 'Figma, 3+ anos de experiência', 'Motion design, Prototipagem', ARRAY['Horário Flexível', 'Equipamento fornecido'], 7000, 10000, 'Curitiba', 'PR', 15, 3, 0),
  ('00000000-0000-0000-0000-000000000014', 'DevOps Engineer', 'Infraestrutura', 'aberta', 'critica', 'remoto', 'CLT', 2, 'Empresa de cloud', 'Gerenciar infraestrutura em nuvem', 'AWS, Terraform, CI/CD, 4+ anos', 'Kubernetes, Observabilidade', ARRAY['Vale Refeição', 'Plano de Saúde', 'Bônus Anual'], 14000, 20000, 'Remoto', '', 52, 15, 1);

-- =============================================
-- SAMPLE CANDIDATOS
-- =============================================
INSERT INTO candidatos (id, nome, email, telefone, status, habilidades, resumo, fonte) VALUES
  ('00000000-0000-0000-0000-000000000020', 'João Silva Santos', 'joao.silva@email.com', '11999999901', 'ativo', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 'Desenvolvedor Full Stack com 5 anos de experiência', 'LinkedIn'),
  ('00000000-0000-0000-0000-000000000021', 'Maria Oliveira Costa', 'maria.oliveira@email.com', '11999999902', 'ativo', ARRAY['React', 'Next.js', 'Tailwind', 'Jest'], 'Frontend Developer especializada em React', 'Indeed'),
  ('00000000-0000-0000-0000-000000000022', 'Pedro Almeida Lima', 'pedro.almeida@email.com', '11999999903', 'ativo', ARRAY['Python', 'Django', 'FastAPI', 'Docker'], 'Backend Developer com foco em Python', 'Referência'),
  ('00000000-0000-0000-0000-000000000023', 'Ana Beatriz Souza', 'ana.beatriz@email.com', '11999999904', 'ativo', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Prototyping'], 'UX Designer com experiência em produtos digitais', 'LinkedIn'),
  ('00000000-0000-0000-0000-000000000024', 'Carlos Eduardo Rocha', 'carlos.rocha@email.com', '11999999905', 'ativo', ARRAY['AWS', 'Terraform', 'Kubernetes', 'Docker'], 'DevOps Engineer com certificações AWS', 'Site Próprio'),
  ('00000000-0000-0000-0000-000000000025', 'Fernanda Martins', 'fernanda.martins@email.com', '11999999906', 'em_processo', ARRAY['Product Management', 'Scrum', 'Jira', 'Analytics'], 'Product Manager com 6 anos de experiência', 'LinkedIn'),
  ('00000000-0000-0000-0000-000000000026', 'Ricardo Gomes', 'ricardo.gomes@email.com', '11999999907', 'contratado', ARRAY['Java', 'Spring Boot', 'Microservices', 'Kafka'], 'Backend Developer Java Senior', 'Indicação'),
  ('00000000-0000-0000-0000-000000000027', 'Juliana Ferreira', 'juliana.ferreira@email.com', '11999999908', 'ativo', ARRAY['React', 'Vue.js', 'Angular', 'TypeScript'], 'Frontend Developer versátil', 'Indeed'),
  ('00000000-0000-0000-0000-000000000028', 'Lucas Mendes', 'lucas.mendes@email.com', '11999999909', 'reprovado', ARRAY['PHP', 'Laravel', 'MySQL'], 'Desenvolvedor PHP', 'LinkedIn'),
  ('00000000-0000-0000-0000-000000000029', 'Camila Rodrigues', 'camila.rodrigues@email.com', '11999999910', 'ativo', ARRAY['Data Science', 'Python', 'Machine Learning', 'SQL'], 'Data Scientist com mestrado', 'Referência');

-- =============================================
-- SAMPLE PROCESSOS SELETIVOS (Pipeline)
-- =============================================
INSERT INTO processos_seletivos (id, candidato_id, candidato_nome, vaga_id, vaga_titulo, etapa_atual, status, match_score, origem, dias_na_etapa) VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020', 'João Silva Santos', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'entrevista_tecnica', 'em_andamento', 85, 'LinkedIn', 3),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', 'Maria Oliveira Costa', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'proposta', 'em_andamento', 92, 'Indeed', 1),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000022', 'Pedro Almeida Lima', '00000000-0000-0000-0000-000000000011', 'Desenvolvedor Backend Pleno', 'triagem', 'em_andamento', 78, 'Referência', 5),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000023', 'Ana Beatriz Souza', '00000000-0000-0000-0000-000000000013', 'Designer UX/UI', 'entrevista_rh', 'em_andamento', 88, 'LinkedIn', 2),
  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000024', 'Carlos Eduardo Rocha', '00000000-0000-0000-0000-000000000014', 'DevOps Engineer', 'contratado', 'finalizado', 95, 'Site Próprio', 0),
  ('00000000-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000025', 'Fernanda Martins', '00000000-0000-0000-0000-000000000012', 'Product Manager', 'entrevista_gestor', 'em_andamento', 82, 'LinkedIn', 4),
  ('00000000-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000027', 'Juliana Ferreira', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'triagem', 'em_andamento', 75, 'Indeed', 1);

-- =============================================
-- SAMPLE ENTREVISTAS
-- =============================================
INSERT INTO entrevistas (id, candidato_id, candidato_nome, vaga_id, vaga_titulo, data, hora_inicio, hora_fim, tipo, etapa, status, entrevistadores, local, link_online) VALUES
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000020', 'João Silva Santos', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', CURRENT_DATE + 1, '10:00', '11:00', 'online', 'entrevista_tecnica', 'agendada', ARRAY['Tech Lead', 'Senior Dev'], NULL, 'https://meet.google.com/abc-defg-hij'),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000021', 'Maria Oliveira Costa', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', CURRENT_DATE, '14:00', '15:00', 'online', 'proposta', 'agendada', ARRAY['RH', 'Gestor'], NULL, 'https://meet.google.com/xyz-uvwx-rst'),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000025', 'Fernanda Martins', '00000000-0000-0000-0000-000000000012', 'Product Manager', CURRENT_DATE + 2, '09:00', '10:30', 'presencial', 'entrevista_gestor', 'agendada', ARRAY['CPO', 'Product Lead'], 'Sala de Reuniões 3', NULL),
  ('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000023', 'Ana Beatriz Souza', '00000000-0000-0000-0000-000000000013', 'Designer UX/UI', CURRENT_DATE - 1, '11:00', '12:00', 'online', 'entrevista_rh', 'realizada', ARRAY['RH'], NULL, 'https://meet.google.com/qwe-rtyp-asd');

-- =============================================
-- SAMPLE INDICAÇÕES
-- =============================================
INSERT INTO indicacoes (id, indicador_nome, indicador_email, candidato_nome, candidato_email, candidato_telefone, vaga_id, vaga_titulo, status, observacao) VALUES
  ('00000000-0000-0000-0000-000000000050', 'Roberto Santos', 'roberto@empresa.com', 'Marcos Paulo Silva', 'marcos.paulo@email.com', '11988887777', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'pendente', 'Trabalhamos juntos na empresa anterior'),
  ('00000000-0000-0000-0000-000000000051', 'Amanda Costa', 'amanda@empresa.com', 'Patricia Almeida', 'patricia.almeida@email.com', '11988886666', '00000000-0000-0000-0000-000000000012', 'Product Manager', 'em_processo', 'Conhecida da faculdade, excelente profissional'),
  ('00000000-0000-0000-0000-000000000052', 'Felipe Lima', 'felipe@empresa.com', 'Diego Ferreira', 'diego.ferreira@email.com', '11988885555', '00000000-0000-0000-0000-000000000014', 'DevOps Engineer', 'contratado', 'Certificado AWS, muito experiente');

-- =============================================
-- SAMPLE PROVAS
-- =============================================
INSERT INTO provas (id, titulo, categoria, descricao, duracao, total_questoes, pontuacao_maxima, nota_minima, departamentos, niveis_aplicaveis, ativo, aplicacoes, media_notas, tags) VALUES
  ('00000000-0000-0000-0000-000000000060', 'Teste Técnico React', 'tecnico', 'Avaliação de conhecimentos em React, hooks e boas práticas', 60, 20, 100, 70, ARRAY['Tecnologia'], ARRAY['pleno', 'senior'], true, 45, 78.5, ARRAY['react', 'frontend', 'javascript']),
  ('00000000-0000-0000-0000-000000000061', 'Lógica de Programação', 'tecnico', 'Teste de raciocínio lógico e algoritmos', 45, 15, 100, 60, ARRAY['Tecnologia'], ARRAY['junior', 'pleno', 'senior'], true, 120, 72.3, ARRAY['logica', 'algoritmos', 'programacao']),
  ('00000000-0000-0000-0000-000000000062', 'Perfil Comportamental', 'comportamental', 'Avaliação de soft skills e perfil profissional', 30, 25, 100, 0, ARRAY['Todos'], ARRAY['junior', 'pleno', 'senior'], true, 200, 85.0, ARRAY['comportamental', 'soft-skills']),
  ('00000000-0000-0000-0000-000000000063', 'Inglês Técnico', 'idioma', 'Avaliação de proficiência em inglês técnico', 40, 30, 100, 50, ARRAY['Tecnologia', 'Produto'], ARRAY['pleno', 'senior'], true, 80, 68.7, ARRAY['ingles', 'idioma']);

-- =============================================
-- SAMPLE QUESTÕES
-- =============================================
INSERT INTO questoes (id, prova_id, enunciado, tipo, alternativas, resposta_correta, pontuacao, dificuldade, ordem) VALUES
  ('00000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000060', 'Qual hook do React é usado para gerenciar estado local em componentes funcionais?', 'multipla_escolha', '[{"id": "a", "texto": "useEffect"}, {"id": "b", "texto": "useState"}, {"id": "c", "texto": "useContext"}, {"id": "d", "texto": "useReducer"}]', 'b', 5, 'facil', 1),
  ('00000000-0000-0000-0000-000000000071', '00000000-0000-0000-0000-000000000060', 'O useEffect é executado após cada renderização por padrão?', 'verdadeiro_falso', '[{"id": "v", "texto": "Verdadeiro"}, {"id": "f", "texto": "Falso"}]', 'v', 5, 'facil', 2),
  ('00000000-0000-0000-0000-000000000072', '00000000-0000-0000-0000-000000000061', 'Qual é a complexidade de tempo de uma busca binária?', 'multipla_escolha', '[{"id": "a", "texto": "O(n)"}, {"id": "b", "texto": "O(log n)"}, {"id": "c", "texto": "O(n²)"}, {"id": "d", "texto": "O(1)"}]', 'b', 5, 'medio', 1);

-- =============================================
-- SAMPLE MATCH SCORES
-- =============================================
INSERT INTO match_scores (id, candidato_id, vaga_id, vaga_titulo, score_total, score_habilidades, score_experiencia, score_formacao, habilidades_match, habilidades_faltantes, habilidades_extras, pontos_fortes, pontos_atencao, recomendacao, analise) VALUES
  ('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 85, 90, 80, 85, ARRAY['React', 'TypeScript'], ARRAY['Next.js'], ARRAY['Node.js', 'PostgreSQL'], ARRAY['Experiência sólida em React', 'Conhecimento full stack'], ARRAY['Falta experiência com Next.js'], 'Altamente recomendado', 'Candidato com perfil técnico forte e experiência relevante'),
  ('00000000-0000-0000-0000-000000000081', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 92, 95, 90, 90, ARRAY['React', 'TypeScript', 'Next.js', 'Tailwind'], ARRAY[]::text[], ARRAY['Jest'], ARRAY['Match perfeito de habilidades', 'Experiência com testes'], ARRAY[]::text[], 'Excelente candidato', 'Candidata excepcional, atende todos os requisitos');

-- =============================================
-- SAMPLE COMUNICAÇÕES
-- =============================================
INSERT INTO comunicacoes (id, candidato_id, template_nome, template_etapa, assunto, conteudo, enviado_em) VALUES
  ('00000000-0000-0000-0000-000000000090', '00000000-0000-0000-0000-000000000020', 'Convite Entrevista Técnica', 'entrevista_tecnica', 'Convite para Entrevista Técnica - Match ATS', 'Olá João, gostaríamos de convidá-lo para a próxima etapa do processo seletivo...', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000021', 'Proposta de Trabalho', 'proposta', 'Proposta de Trabalho - Match ATS', 'Olá Maria, temos o prazer de enviar nossa proposta de trabalho...', NOW() - INTERVAL '1 day');

-- =============================================
-- SAMPLE BATERIAS DE PROVAS
-- =============================================
INSERT INTO baterias_provas (id, nome, descricao, departamento, nivel, duracao_total, ativo) VALUES
  ('00000000-0000-0000-0000-0000000000a0', 'Bateria Frontend Pleno', 'Conjunto de provas para avaliar desenvolvedores frontend nível pleno', 'Tecnologia', 'pleno', 105, true),
  ('00000000-0000-0000-0000-0000000000a1', 'Bateria Geral Junior', 'Avaliação básica para candidatos júnior', 'Todos', 'junior', 75, true);

INSERT INTO bateria_provas_rel (id, bateria_id, prova_id, ordem, obrigatoria) VALUES
  ('00000000-0000-0000-0000-0000000000b0', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000060', 1, true),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000062', 2, true),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000063', 3, false),
  ('00000000-0000-0000-0000-0000000000b3', '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000061', 1, true),
  ('00000000-0000-0000-0000-0000000000b4', '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000062', 2, true);

SELECT 'Seed data inserted successfully! Use Supabase Auth API to create test users.' as message;
