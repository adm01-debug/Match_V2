-- Match ATS - Development Seed Data
-- Run: supabase db reset

-- Insert sample companies
INSERT INTO companies (id, name, cnpj, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Empresa Demo', '00.000.000/0001-00', 'demo@match.com');

-- Insert sample users
INSERT INTO profiles (id, email, full_name, role, company_id) VALUES
  ('00000000-0000-0000-0000-000000000002', 'admin@match.com', 'Admin User', 'admin', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', 'recruiter@match.com', 'Recruiter User', 'recruiter', '00000000-0000-0000-0000-000000000001');

-- Insert sample vagas
INSERT INTO vagas (id, titulo, descricao, requisitos, status, company_id, created_by) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend', 'Vaga para desenvolvedor React', 'React, TypeScript, 2+ anos', 'aberta', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000011', 'Desenvolvedor Backend', 'Vaga para desenvolvedor Node.js', 'Node.js, PostgreSQL, 3+ anos', 'aberta', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

-- Insert sample candidatos
INSERT INTO candidatos (id, nome, email, telefone, status) VALUES
  ('00000000-0000-0000-0000-000000000020', 'João Silva', 'joao@email.com', '11999999999', 'ativo'),
  ('00000000-0000-0000-0000-000000000021', 'Maria Santos', 'maria@email.com', '11988888888', 'ativo'),
  ('00000000-0000-0000-0000-000000000022', 'Pedro Costa', 'pedro@email.com', '11977777777', 'ativo');

-- Insert sample candidaturas
INSERT INTO candidaturas (id, candidato_id, vaga_id, etapa, status) VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'triagem', 'em_andamento'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', 'entrevista', 'em_andamento'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011', 'triagem', 'em_andamento');

SELECT 'Seed data inserted successfully!' as message;
