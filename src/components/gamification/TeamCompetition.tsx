/**
 * @fileoverview Team/Squad Competition System
 */

import { useState, useMemo, memo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Users, Trophy, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generateDemoTeams } from './teamCompetition/demoTeams';
import { TeamPodium } from './teamCompetition/TeamPodium';
import { TeamCard } from './teamCompetition/TeamCard';
import { CurrentTeamHighlight } from './teamCompetition/CurrentTeamHighlight';

export type { Team, TeamMember } from './teamCompetition/types';

interface TeamCompetitionProps {
  currentTeamId?: string;
  onJoinTeam?: (teamId: string) => void;
  onContribute?: (amount: number) => void;
  className?: string;
}

export const TeamCompetition = memo(({
  currentTeamId, onJoinTeam, onContribute, className,
}: TeamCompetitionProps) => {
  const [teams] = useState(() => generateDemoTeams(currentTeamId));
  const currentTeam = useMemo(() => teams.find((t) => t.id === currentTeamId), [teams, currentTeamId]);

  const handleJoinTeam = useCallback((teamId: string) => {
    onJoinTeam?.(teamId);
    toast.success('Solicitação enviada!', { description: 'Aguarde a aprovação do líder do time.' });
  }, [onJoinTeam]);

  const handleContribute = useCallback(() => {
    onContribute?.(100);
    toast.success('+100 XP contribuído para o time!', {
      icon: <Sparkles className="h-5 w-5 text-warning" />,
    });
  }, [onContribute]);

  return (
    <Card className={cn('bg-card/50 backdrop-blur-xl border-border/30', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-success to-primary shadow-lg shadow-success/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Competição de Times</CardTitle>
              <p className="text-sm text-muted-foreground">Semana 3 de Janeiro</p>
            </div>
          </div>
          {currentTeam && (
            <Button onClick={handleContribute} className="gap-2">
              <Zap className="h-4 w-4" />
              Contribuir XP
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <TeamPodium teams={teams} />

        {currentTeam && <CurrentTeamHighlight team={currentTeam} />}

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Ranking de Times
          </h3>
          <AnimatePresence>
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isCurrentTeam={team.id === currentTeamId}
                onJoin={() => handleJoinTeam(team.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
});

TeamCompetition.displayName = 'TeamCompetition';
