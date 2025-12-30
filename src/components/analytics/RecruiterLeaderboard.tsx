import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, TrendingUp, Clock, Target } from 'lucide-react';

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
}

export function RecruiterLeaderboard({ recruiters, period }: RecruiterLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = previous - current;
    if (diff > 0) return <span className="text-green-500 text-xs">↑{diff}</span>;
    if (diff < 0) return <span className="text-red-500 text-xs">↓{Math.abs(diff)}</span>;
    return <span className="text-gray-400 text-xs">—</span>;
  };

  const topRecruiter = recruiters[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Ranking de Recrutadores
            </CardTitle>
            <CardDescription>Performance em {period}</CardDescription>
          </div>
          {topRecruiter?.streak && topRecruiter.streak >= 3 && (
            <Badge variant="default" className="gap-1">🔥 {topRecruiter.streak} meses no topo</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recruiters.map((recruiter) => (
          <div
            key={recruiter.id}
            className={`flex items-center gap-4 p-3 rounded-lg ${recruiter.rank <= 3 ? 'bg-muted' : 'border'}`}
          >
            <div className="flex items-center gap-1 w-12">
              {getRankIcon(recruiter.rank)}
              {getRankChange(recruiter.rank, recruiter.previousRank)}
            </div>

            <Avatar className="h-10 w-10">
              <AvatarImage src={recruiter.avatar} />
              <AvatarFallback>{recruiter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{recruiter.name}</div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Target className="h-3 w-3" />{recruiter.hires} contratações</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recruiter.avgTimeToHire}d média</span>
              </div>
            </div>

            <div className="text-right w-24">
              <div className="text-sm font-medium">{recruiter.acceptRate}%</div>
              <Progress value={recruiter.acceptRate} className="h-1.5 mt-1" />
              <span className="text-xs text-muted-foreground">taxa aceite</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
