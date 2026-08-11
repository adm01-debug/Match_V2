export interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export const levels: UserLevel[] = [
  { level: 1, title: 'Iniciante', minXP: 0, maxXP: 100, color: 'text-slate-500', icon: '🌱' },
  { level: 2, title: 'Aprendiz', minXP: 100, maxXP: 300, color: 'text-green-500', icon: '🌿' },
  { level: 3, title: 'Praticante', minXP: 300, maxXP: 600, color: 'text-blue-500', icon: '💪' },
  { level: 4, title: 'Competente', minXP: 600, maxXP: 1000, color: 'text-purple-500', icon: '⭐' },
  { level: 5, title: 'Proficiente', minXP: 1000, maxXP: 1500, color: 'text-amber-500', icon: '🔥' },
  { level: 6, title: 'Especialista', minXP: 1500, maxXP: 2200, color: 'text-orange-500', icon: '💎' },
  { level: 7, title: 'Expert', minXP: 2200, maxXP: 3000, color: 'text-red-500', icon: '🏆' },
  { level: 8, title: 'Mestre', minXP: 3000, maxXP: 4000, color: 'text-pink-500', icon: '👑' },
  { level: 9, title: 'Grão-Mestre', minXP: 4000, maxXP: 5500, color: 'text-violet-500', icon: '🌟' },
  { level: 10, title: 'Lenda', minXP: 5500, maxXP: Infinity, color: 'text-yellow-400', icon: '🏅' },
];

export const xpRewards: Record<string, { amount: number; description: string }> = {
  candidatoAdicionado: { amount: 10, description: 'Candidato adicionado ao sistema' },
  candidatoAvaliado: { amount: 15, description: 'Candidato avaliado' },
  entrevistaAgendada: { amount: 20, description: 'Entrevista agendada' },
  entrevistaRealizada: { amount: 30, description: 'Entrevista realizada' },
  candidatoContratado: { amount: 100, description: 'Candidato contratado com sucesso' },
  vagaCriada: { amount: 25, description: 'Nova vaga criada' },
  vagaPublicada: { amount: 15, description: 'Vaga publicada' },
  vagaPreenchida: { amount: 75, description: 'Vaga preenchida com sucesso' },
  candidatoMovido: { amount: 5, description: 'Candidato movido no pipeline' },
  etapaConcluida: { amount: 20, description: 'Etapa concluída' },
  emailEnviado: { amount: 5, description: 'Email enviado ao candidato' },
  feedbackEnviado: { amount: 15, description: 'Feedback enviado' },
  loginDiario: { amount: 10, description: 'Login diário' },
  perfilAtualizado: { amount: 20, description: 'Perfil atualizado' },
  configSalva: { amount: 5, description: 'Configuração salva' },
  miniGameCompleto: { amount: 25, description: 'Mini-game completado' },
  assessmentCompleto: { amount: 50, description: 'Assessment completo' },
  primeiraContratacao: { amount: 200, description: 'Primeira contratação!' },
  dezContratacoes: { amount: 500, description: '10 contratações alcançadas!' },
  streakSemanal: { amount: 100, description: 'Streak de 7 dias!' },
  streakMensal: { amount: 500, description: 'Streak de 30 dias!' },
};
