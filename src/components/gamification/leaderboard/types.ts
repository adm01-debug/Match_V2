export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  previousRank?: number;
  streak?: number;
  achievements?: number;
  department?: string;
}
