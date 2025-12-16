import { ProcessoSeletivo, EtapaProcesso, FonteCandidato } from '@/types/recruitment';

// Extended mock data for Pipeline
export const pipelineData: ProcessoSeletivo[] = [
  // Novos
  { id: 'p1', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c1', candidatoNome: 'João Mendes', etapaAtual: 'novo', status: 'em_andamento', matchScore: 92, origem: 'indeed', dataInscricao: new Date('2025-12-14'), dataUltimaMovimentacao: new Date('2025-12-14'), diasNaEtapa: 2 },
  { id: 'p2', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c2', candidatoNome: 'Maria Lima', etapaAtual: 'novo', status: 'em_andamento', matchScore: 88, origem: 'linkedin', dataInscricao: new Date('2025-12-14'), dataUltimaMovimentacao: new Date('2025-12-14'), diasNaEtapa: 2 },
  { id: 'p3', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c3', candidatoNome: 'Paulo Vieira', etapaAtual: 'novo', status: 'em_andamento', matchScore: 75, origem: 'portal', dataInscricao: new Date('2025-12-15'), dataUltimaMovimentacao: new Date('2025-12-15'), diasNaEtapa: 1 },
  { id: 'p4', vagaId: '2', vagaTitulo: 'Designer Gráfico', candidatoId: 'c4', candidatoNome: 'Ana Costa', etapaAtual: 'novo', status: 'em_andamento', matchScore: 90, origem: 'linkedin', dataInscricao: new Date('2025-12-13'), dataUltimaMovimentacao: new Date('2025-12-13'), diasNaEtapa: 3 },
  
  // Em Triagem
  { id: 'p5', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c5', candidatoNome: 'Carlos Eduardo', etapaAtual: 'em_triagem', status: 'em_andamento', matchScore: 90, origem: 'indeed', dataInscricao: new Date('2025-12-10'), dataUltimaMovimentacao: new Date('2025-12-13'), diasNaEtapa: 3 },
  { id: 'p6', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c6', candidatoNome: 'Felipe Rodrigues', etapaAtual: 'em_triagem', status: 'em_andamento', matchScore: 85, origem: 'catho', dataInscricao: new Date('2025-12-11'), dataUltimaMovimentacao: new Date('2025-12-13'), diasNaEtapa: 3 },
  { id: 'p7', vagaId: '2', vagaTitulo: 'Designer Gráfico', candidatoId: 'c7', candidatoNome: 'Amanda Garcia', etapaAtual: 'em_triagem', status: 'em_andamento', matchScore: 82, origem: 'indicacao', dataInscricao: new Date('2025-12-12'), dataUltimaMovimentacao: new Date('2025-12-14'), diasNaEtapa: 2 },
  
  // Pré-seleção
  { id: 'p8', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c8', candidatoNome: 'Ana Paula', etapaAtual: 'pre_selecao', status: 'em_andamento', matchScore: 85, origem: 'linkedin', dataInscricao: new Date('2025-12-08'), dataUltimaMovimentacao: new Date('2025-12-12'), diasNaEtapa: 4 },
  { id: 'p9', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c9', candidatoNome: 'Bruno Costa', etapaAtual: 'pre_selecao', status: 'em_andamento', matchScore: 80, origem: 'portal', dataInscricao: new Date('2025-12-09'), dataUltimaMovimentacao: new Date('2025-12-13'), diasNaEtapa: 3 },
  { id: 'p10', vagaId: '3', vagaTitulo: 'Vendedor Externo', candidatoId: 'c10', candidatoNome: 'Renata Ferreira', etapaAtual: 'pre_selecao', status: 'em_andamento', matchScore: 78, origem: 'indeed', dataInscricao: new Date('2025-12-10'), dataUltimaMovimentacao: new Date('2025-12-14'), diasNaEtapa: 2 },
  
  // Entrevista RH
  { id: 'p11', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c11', candidatoNome: 'Roberto Santos', etapaAtual: 'entrevista_rh', status: 'em_andamento', matchScore: 88, origem: 'indicacao', dataInscricao: new Date('2025-12-05'), dataUltimaMovimentacao: new Date('2025-12-11'), diasNaEtapa: 5 },
  { id: 'p12', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c12', candidatoNome: 'Carla Mendes', etapaAtual: 'entrevista_rh', status: 'em_andamento', matchScore: 86, origem: 'linkedin', dataInscricao: new Date('2025-12-06'), dataUltimaMovimentacao: new Date('2025-12-12'), diasNaEtapa: 4 },
  { id: 'p13', vagaId: '2', vagaTitulo: 'Designer Gráfico', candidatoId: 'c13', candidatoNome: 'Lucas Almeida', etapaAtual: 'entrevista_rh', status: 'em_andamento', matchScore: 91, origem: 'linkedin', dataInscricao: new Date('2025-12-07'), dataUltimaMovimentacao: new Date('2025-12-13'), diasNaEtapa: 3 },
  
  // Teste Técnico
  { id: 'p14', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c14', candidatoNome: 'Pedro Martins', etapaAtual: 'teste_tecnico', status: 'em_andamento', matchScore: 82, origem: 'indeed', dataInscricao: new Date('2025-12-01'), dataUltimaMovimentacao: new Date('2025-12-09'), diasNaEtapa: 7 },
  { id: 'p15', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c15', candidatoNome: 'Juliana Silva', etapaAtual: 'teste_tecnico', status: 'em_andamento', matchScore: 79, origem: 'catho', dataInscricao: new Date('2025-12-02'), dataUltimaMovimentacao: new Date('2025-12-10'), diasNaEtapa: 6 },
  
  // Entrevista Gestor
  { id: 'p16', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c16', candidatoNome: 'Marcos Antonio', etapaAtual: 'entrevista_gestor', status: 'em_andamento', matchScore: 84, origem: 'indicacao', dataInscricao: new Date('2025-11-28'), dataUltimaMovimentacao: new Date('2025-12-08'), diasNaEtapa: 8 },
  { id: 'p17', vagaId: '3', vagaTitulo: 'Vendedor Externo', candidatoId: 'c17', candidatoNome: 'Fernanda Souza', etapaAtual: 'entrevista_gestor', status: 'em_andamento', matchScore: 87, origem: 'linkedin', dataInscricao: new Date('2025-11-29'), dataUltimaMovimentacao: new Date('2025-12-09'), diasNaEtapa: 7 },
  
  // Entrevista Final
  { id: 'p18', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c18', candidatoNome: 'Lucas Ferreira', etapaAtual: 'entrevista_final', status: 'em_andamento', matchScore: 95, origem: 'linkedin', dataInscricao: new Date('2025-11-25'), dataUltimaMovimentacao: new Date('2025-12-06'), diasNaEtapa: 10 },
  
  // Aprovado
  { id: 'p19', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c19', candidatoNome: 'Gustavo Pereira', etapaAtual: 'aprovado', status: 'aprovado', matchScore: 94, origem: 'portal', dataInscricao: new Date('2025-11-20'), dataUltimaMovimentacao: new Date('2025-12-10'), diasNaEtapa: 6 },
  
  // Proposta Enviada
  { id: 'p20', vagaId: '2', vagaTitulo: 'Designer Gráfico', candidatoId: 'c20', candidatoNome: 'Camila Ribeiro', etapaAtual: 'proposta_enviada', status: 'em_andamento', matchScore: 93, origem: 'indicacao', dataInscricao: new Date('2025-11-15'), dataUltimaMovimentacao: new Date('2025-12-12'), diasNaEtapa: 4 },
  
  // Contratado
  { id: 'p21', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c21', candidatoNome: 'Ricardo Oliveira', etapaAtual: 'contratado', status: 'contratado', matchScore: 96, origem: 'indeed', dataInscricao: new Date('2025-11-01'), dataUltimaMovimentacao: new Date('2025-12-01'), diasNaEtapa: 15 },
  
  // Reprovado
  { id: 'p22', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c22', candidatoNome: 'Sandra Martins', etapaAtual: 'reprovado', status: 'reprovado', matchScore: 65, origem: 'catho', dataInscricao: new Date('2025-11-10'), dataUltimaMovimentacao: new Date('2025-11-20'), diasNaEtapa: 26 },
  { id: 'p23', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c23', candidatoNome: 'Diego Santos', etapaAtual: 'reprovado', status: 'reprovado', matchScore: 58, origem: 'portal', dataInscricao: new Date('2025-11-12'), dataUltimaMovimentacao: new Date('2025-11-22'), diasNaEtapa: 24 },
  
  // Banco de Talentos
  { id: 'p24', vagaId: '1', vagaTitulo: 'Operador de Gravação', candidatoId: 'c24', candidatoNome: 'Patricia Lima', etapaAtual: 'banco_talentos', status: 'em_andamento', matchScore: 72, origem: 'linkedin', dataInscricao: new Date('2025-11-05'), dataUltimaMovimentacao: new Date('2025-11-25'), diasNaEtapa: 21 },
];

export const etapasConfig: { id: EtapaProcesso; label: string; cor: string }[] = [
  { id: 'novo', label: 'Novos', cor: 'hsl(217, 91%, 60%)' },
  { id: 'em_triagem', label: 'Triagem', cor: 'hsl(263, 70%, 50%)' },
  { id: 'pre_selecao', label: 'Pré-seleção', cor: 'hsl(280, 70%, 50%)' },
  { id: 'entrevista_rh', label: 'Entrevista RH', cor: 'hsl(38, 92%, 50%)' },
  { id: 'teste_tecnico', label: 'Testes', cor: 'hsl(330, 81%, 60%)' },
  { id: 'entrevista_gestor', label: 'Ent. Gestor', cor: 'hsl(200, 70%, 50%)' },
  { id: 'entrevista_final', label: 'Ent. Final', cor: 'hsl(160, 84%, 39%)' },
  { id: 'aprovado', label: 'Aprovado', cor: 'hsl(158, 64%, 32%)' },
  { id: 'proposta_enviada', label: 'Proposta', cor: 'hsl(45, 93%, 47%)' },
  { id: 'contratado', label: 'Contratado', cor: 'hsl(160, 84%, 25%)' },
  { id: 'reprovado', label: 'Reprovado', cor: 'hsl(0, 84%, 60%)' },
  { id: 'banco_talentos', label: 'Banco', cor: 'hsl(220, 9%, 46%)' },
];
