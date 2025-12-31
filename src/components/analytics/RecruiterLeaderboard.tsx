/**
 * @fileoverview RecruiterLeaderboard component
 * @module RecruiterLeaderboard
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, Clock, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecruiterStats {
  id: string;
  name: string;
  avatar?: string;
  hires: number;
  avgTimeToHire: number;
  acceptRate: number;
  interviews: number;
  rank: number;
  previousRank?: number;
  streak?: number;
}

interface RecruiterLeaderboardProps {
  recruiters: RecruiterStats[];
  period: string;
  isLoading?: boolean;
}

function getInitials(name: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function RankIcon({ rank }: { rank: number }) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" aria-label="1º lugar" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" aria-label="2º lugar" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" aria-label="3º lugar" />;
    default:
      return (
        <span className="text-lg font-bold text-muted-foreground" aria-label={`${rank}º lugar`}>
          #{rank}
        </span>
      );
  }
}

function RankChange({ current, previous }: { current: number; previous?: number }) {
  if (!previous) return null;
  
  const diff = previous - current;
  
  if (diff > 0) {
    return (
      <span className="text-green-500 text-xs flex items-center" aria-label={`Subiu ${diff} posições`}>
        <TrendingUp className="h-3 w-3" aria-hidden="true" />
        {diff}
      </span>
    );
  }
  
  if (diff < 0) {
    return (
      <span className="text-red-500 text-xs flex items-center" aria-label={`Desceu ${Math.abs(diff)} posições`}>
        <TrendingDown className="h-3 w-3" aria-hidden="true" />
        {Math.abs(diff)}
      </span>
    );
  }
  
  return (
    <span className="text-gray-400 text-xs" aria-label="Manteve posição">
      <Minus className="h-3 w-3" aria-hidden="true" />
    </span>
  );
}

function RecruiterLeaderboardComponent({ recruiters, period, isLoading = false }: RecruiterLeaderboardProps) {
  const sortedRecruiters = useMemo(
    () => [...recruiters].sort((a, b) => a.rank - b.rank),
    [recruiters]
  );

  const topRecruiter = sortedRecruiters[0];
  const showStreak = topRecruiter?.streak && topRecruiter.streak >= 3;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" aria-hidden="true" />
            Ranking de Recrutadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3">
                <div className="w-12 h-6 bg-muted rounded" />
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recruiters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" aria-hidden="true" />
            Ranking de Recrutadores
          </CardTitle>
          <CardDescription>Performance em {period}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum dado disponível para este período.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" aria-hidden="true" />
              Ranking de Recrutadores
            </CardTitle>
            <CardDescription>Performance em {period}</CardDescription>
          </div>
          {showStreak && (
            <Badge variant="default" className="gap-1">
              🔥 {topRecruiter.streak} meses no topo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4" role="list" aria-label="Ranking de recrutadores">
          {sortedRecruiters.map((recruiter) => (
            <li
              key={recruiter.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-colors",
                recruiter.rank <= 3 ? 'bg-muted' : 'border'
              )}
              aria-label={`${recruiter.name}, ${recruiter.rank}º lugar`}
            >
              <div className="flex items-center gap-1 w-12">
                <RankIcon rank={recruiter.rank} />
                <RankChange current={recruiter.rank} previous={recruiter.previousRank} />
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={recruiter.avatar} alt={recruiter.name} />
                <AvatarFallback>{getInitials(recruiter.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{recruiter.name}</div>
                <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" aria-hidden="true" />
                    {recruiter.hires} contratações
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {recruiter.avgTimeToHire}d média
                  </span>
                </div>
              </div>

              <div className="text-right w-24">
                <div className="text-sm font-medium">{recruiter.acceptRate}%</div>
                <Progress 
                  value={recruiter.acceptRate} 
                  className="h-1.5 mt-1"
                  aria-label={`Taxa de aceite: ${recruiter.acceptRate}%`}
                />
                <span className="text-xs text-muted-foreground">taxa aceite</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

RecruiterLeaderboardComponent.displayName = 'RecruiterLeaderboard';

export const RecruiterLeaderboard = memo(RecruiterLeaderboardComponent);
export default RecruiterLeaderboard;
