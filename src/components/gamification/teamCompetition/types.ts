export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  contributionPercent: number;
}

export interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  members: TeamMember[];
  totalXP: number;
  weeklyXP: number;
  rank: number;
  previousRank?: number;
  streak: number;
  goalProgress: number;
  goalTarget: number;
}
