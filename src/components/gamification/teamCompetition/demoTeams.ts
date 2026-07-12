import type { Team } from './types';

export const generateDemoTeams = (currentTeamId?: string): Team[] => {
  const teams: Team[] = [
    {
      id: 'team-rh', name: 'RH Champions', icon: '👥', color: 'from-info to-accent',
      members: [
        { id: 'm1', name: 'Ana Silva', xp: 4500, contributionPercent: 35 },
        { id: 'm2', name: 'Carlos Santos', xp: 3200, contributionPercent: 25 },
        { id: 'm3', name: 'Maria Oliveira', xp: 2800, contributionPercent: 22 },
        { id: 'm4', name: 'João Pedro', xp: 2300, contributionPercent: 18 },
      ],
      totalXP: 12800, weeklyXP: 3500, rank: 1, previousRank: 2, streak: 5,
      goalProgress: 12800, goalTarget: 15000,
    },
    {
      id: 'team-tech', name: 'Tech Titans', icon: '💻', color: 'from-accent to-accent',
      members: [
        { id: 'm5', name: 'Ricardo Lima', xp: 4200, contributionPercent: 38 },
        { id: 'm6', name: 'Juliana Alves', xp: 3000, contributionPercent: 27 },
        { id: 'm7', name: 'Bruno Martins', xp: 2500, contributionPercent: 23 },
        { id: 'm8', name: 'Patrícia Souza', xp: 1300, contributionPercent: 12 },
      ],
      totalXP: 11000, weeklyXP: 4200, rank: 2, previousRank: 1, streak: 3,
      goalProgress: 11000, goalTarget: 15000,
    },
    {
      id: 'team-sales', name: 'Sales Stars', icon: '⭐', color: 'from-warning to-warning',
      members: [
        { id: 'm9', name: 'André Ferreira', xp: 3800, contributionPercent: 40 },
        { id: 'm10', name: 'Camila Rocha', xp: 2900, contributionPercent: 30 },
        { id: 'm11', name: 'Lucas Ribeiro', xp: 2800, contributionPercent: 30 },
      ],
      totalXP: 9500, weeklyXP: 2800, rank: 3, previousRank: 3, streak: 7,
      goalProgress: 9500, goalTarget: 15000,
    },
    {
      id: 'team-marketing', name: 'Marketing Mavericks', icon: '🚀', color: 'from-success to-success',
      members: [
        { id: 'm12', name: 'Amanda Nascimento', xp: 3200, contributionPercent: 45 },
        { id: 'm13', name: 'Gabriel Santos', xp: 2500, contributionPercent: 35 },
        { id: 'm14', name: 'Isabela Cruz', xp: 1400, contributionPercent: 20 },
      ],
      totalXP: 7100, weeklyXP: 2100, rank: 4, previousRank: 5, streak: 2,
      goalProgress: 7100, goalTarget: 15000,
    },
  ];
  return teams.map((team) => ({ ...team, isCurrentTeam: team.id === currentTeamId }));
};
