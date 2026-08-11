-- Corrigir entrevistas com vaga_id inválido
-- Mapear "vaga-1" -> Operador de Gravação, "vaga-2" -> Designer Gráfico, etc.

-- Atualizar para o UUID real da vaga "Operador de Gravação"
UPDATE entrevistas SET vaga_id = '4edaf4a0-0723-4b0b-9512-c90221176a67' WHERE vaga_id = 'vaga-1';

-- Atualizar para o UUID real da vaga "Designer Gráfico"
UPDATE entrevistas SET vaga_id = '06ebe45e-63f0-48e0-8ded-30433ca34280' WHERE vaga_id = 'vaga-2';

-- Atualizar para o UUID real da vaga "Vendedor Externo"
UPDATE entrevistas SET vaga_id = '6e756643-279d-4913-97d5-3ecc14d56b2f' WHERE vaga_id = 'vaga-3';

-- Atualizar para o UUID real da vaga "Analista Financeiro"
UPDATE entrevistas SET vaga_id = '4f88089d-830c-4f45-8cc9-5a931efc7666' WHERE vaga_id = 'vaga-4';

-- Alterar o tipo da coluna para UUID
ALTER TABLE entrevistas ALTER COLUMN vaga_id TYPE uuid USING vaga_id::uuid;

-- Adicionar a foreign key constraint para validar referências
ALTER TABLE entrevistas 
ADD CONSTRAINT entrevistas_vaga_id_fkey 
FOREIGN KEY (vaga_id) REFERENCES vagas(id) ON DELETE SET NULL;