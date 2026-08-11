import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Leaderboard, AchievementGrid, type LeaderboardUser, type Achievement } from '@/components/gamification';

interface BehavioralLeaderboardTabProps {
  leaderboardUsers: LeaderboardUser[];
  demoAchievements: Achievement[];
}

export function BehavioralLeaderboardTab({
  leaderboardUsers,
  demoAchievements
}: BehavioralLeaderboardTabProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Leaderboard 
        users={leaderboardUsers} 
        currentUserId="current" 
        title="Ranking da Semana" 
        maxDisplay={5} 
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementGrid achievements={demoAchievements} size="md" columns={5} />
        </CardContent>
      </Card>
    </div>
  );
}