export interface MiniGameResult {
  gameType: 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';
  score: number;
  timeSpent: number;
  details: Record<string, unknown>;
}

export interface MiniGameProps {
  onComplete: (result: MiniGameResult) => void;
}
