/**
 * @fileoverview Team/Squad Competition System
 * Departmental competition with collective goals
 */

import { useState, useMemo, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Trophy, Flame, 
  TrendingUp, Sparkles, ChevronRight, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

interface TeamCompetitionProps {
  currentTeamId?: string;
  onJoinTeam?: (teamId: string) => void;
  onContribute?: (amount: number) => void;
  className?: string;
}

// Demo teams data
const generateDemoTeams = (currentTeamId?: string): Team[] => {
  const teams: Team[] = [
    {
      id: 'team-rh',
      name: 'RH Champions',
      icon: '👥',
      color: 'from-blue-500 to-indigo-600',
      members: [
        { id: 'm1', name: 'Ana Silva', xp: 4500, contributionPercent: 35 },
        { id: 'm2', name: 'Carlos Santos', xp: 3200, contributionPercent: 25 },
        { id: 'm3', name: 'Maria Oliveira', xp: 2800, contributionPercent: 22 },
        { id: 'm4', name: 'João Pedro', xp: 2300, contributionPercent: 18 },
      ],
      totalXP: 12800,
      weeklyXP: 3500,
      rank: 1,
      previousRank: 2,
      streak: 5,
      goalProgress: 12800,
      goalTarget: 15000
    },
    {
      id: 'team-tech',
      name: 'Tech Titans',
      icon: '💻',
      color: 'from-purple-500 to-pink-600',
      members: [
        { id: 'm5', name: 'Ricardo Lima', xp: 4200, contributionPercent: 38 },
        { id: 'm6', name: 'Juliana Alves', xp: 3000, contributionPercent: 27 },
        { id: 'm7', name: 'Bruno Martins', xp: 2500, contributionPercent: 23 },
        { id: 'm8', name: 'Patrícia Souza', xp: 1300, contributionPercent: 12 },
      ],
      totalXP: 11000,
      weeklyXP: 4200,
      rank: 2,
      previousRank: 1,
      streak: 3,
      goalProgress: 11000,
      goalTarget: 15000
    },
    {
      id: 'team-sales',
      name: 'Sales Stars',
      icon: '⭐',
      color: 'from-amber-500 to-orange-600',
      members: [
        { id: 'm9', name: 'André Ferreira', xp: 3800, contributionPercent: 40 },
        { id: 'm10', name: 'Camila Rocha', xp: 2900, contributionPercent: 30 },
        { id: 'm11', name: 'Lucas Ribeiro', xp: 2800, contributionPercent: 30 },
      ],
      totalXP: 9500,
      weeklyXP: 2800,
      rank: 3,
      previousRank: 3,
      streak: 7,
      goalProgress: 9500,
      goalTarget: 15000
    },
    {
      id: 'team-marketing',
      name: 'Marketing Mavericks',
      icon: '🚀',
      color: 'from-emerald-500 to-teal-600',
      members: [
        { id: 'm12', name: 'Amanda Nascimento', xp: 3200, contributionPercent: 45 },
        { id: 'm13', name: 'Gabriel Santos', xp: 2500, contributionPercent: 35 },
        { id: 'm14', name: 'Isabela Cruz', xp: 1400, contributionPercent: 20 },
      ],
      totalXP: 7100,
      weeklyXP: 2100,
      rank: 4,
      previousRank: 5,
      streak: 2,
      goalProgress: 7100,
      goalTarget: 15000
    }
  ];

  return teams.map(team => ({
    ...team,
    isCurrentTeam: team.id === currentTeamId
  }));
};

// Podium component for top 3 teams
const TeamPodium = memo(({ teams }: { teams: Team[] }) => {
  const topTeams = teams.slice(0, 3);
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {podiumOrder.map((orderIndex) => {
        const team = topTeams[orderIndex];
        if (!team) return null;

        const heights = { 0: 'h-32', 1: 'h-24', 2: 'h-20' };
        const podiumHeight = heights[orderIndex as keyof typeof heights];

        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: orderIndex * 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2",
                `bg-gradient-to-br ${team.color} shadow-lg`
              )}
              animate={orderIndex === 0 ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {team.icon}
            </motion.div>
            <p className="font-semibold text-sm text-center mb-1">{team.name}</p>
            <Badge className={cn(
              "mb-2",
              orderIndex === 0 && "bg-yellow-500 text-white",
              orderIndex === 1 && "bg-gray-400 text-white",
              orderIndex === 2 && "bg-amber-600 text-white"
            )}>
              {team.totalXP.toLocaleString()} XP
            </Badge>
            <div className={cn(
              "w-20 rounded-t-xl flex items-end justify-center pb-2",
              podiumHeight,
              orderIndex === 0 && "bg-gradient-to-t from-yellow-500 to-amber-400",
              orderIndex === 1 && "bg-gradient-to-t from-gray-400 to-gray-300",
              orderIndex === 2 && "bg-gradient-to-t from-amber-600 to-amber-500"
            )}>
              <span className="text-2xl font-bold text-white">
                {orderIndex === 0 ? '🥇' : orderIndex === 1 ? '🥈' : '🥉'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

TeamPodium.displayName = 'TeamPodium';

// Team card component
const TeamCard = memo(({ 
  team, 
  isCurrentTeam,
  onJoin
}: { 
  team: Team;
  isCurrentTeam?: boolean;
  onJoin?: () => void;
}) => {
  const goalPercent = (team.goalProgress / team.goalTarget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "p-4 rounded-xl transition-all duration-300 border",
        isCurrentTeam 
          ? "bg-primary/10 border-primary/30 shadow-lg" 
          : "bg-card/50 border-border/30 hover:bg-card/80"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Team Icon & Rank */}
        <div className="relative">
          <motion.div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
              `bg-gradient-to-br ${team.color} shadow-md`
            )}
          >
            {team.icon}
          </motion.div>
          <div className={cn(
            "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
            team.rank === 1 && "bg-yellow-500",
            team.rank === 2 && "bg-gray-400",
            team.rank === 3 && "bg-amber-600",
            team.rank > 3 && "bg-muted-foreground"
          )}>
            {team.rank}
          </div>
        </div>

        {/* Team Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{team.name}</h3>
            {isCurrentTeam && (
              <Badge variant="secondary" className="text-xs">Seu Time</Badge>
            )}
            {team.streak >= 3 && (
              <Badge variant="outline" className="gap-1 border-orange-500/50 text-orange-600">
                <Flame className="h-3 w-3" />
                {team.streak}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {team.members.length} membros
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              +{team.weeklyXP.toLocaleString()} esta semana
            </span>
          </div>

          {/* Goal Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Meta Semanal</span>
              <span className="font-medium">
                {team.goalProgress.toLocaleString()} / {team.goalTarget.toLocaleString()} XP
              </span>
            </div>
            <Progress value={goalPercent} className="h-2" />
          </div>
        </div>

        {/* Total XP & Actions */}
        <div className="text-right">
          <p className="text-xl font-bold">{team.totalXP.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mb-2">XP Total</p>
          {!isCurrentTeam && onJoin && (
            <Button size="sm" variant="outline" onClick={onJoin}>
              Entrar
            </Button>
          )}
        </div>
      </div>

      {/* Members Preview */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member, idx) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name.replace(' ', '')}`} />
                <AvatarFallback className="text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver detalhes
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

TeamCard.displayName = 'TeamCard';

export const TeamCompetition = memo(({
  currentTeamId,
  onJoinTeam,
  onContribute,
  className
}: TeamCompetitionProps) => {
  const [teams] = useState(() => generateDemoTeams(currentTeamId));

  const currentTeam = useMemo(() => 
    teams.find(t => t.id === currentTeamId),
    [teams, currentTeamId]
  );

  const handleJoinTeam = useCallback((teamId: string) => {
    onJoinTeam?.(teamId);
    toast.success("Solicitação enviada!", {
      description: "Aguarde a aprovação do líder do time."
    });
  }, [onJoinTeam]);

  const handleContribute = useCallback(() => {
    onContribute?.(100);
    toast.success("+100 XP contribuído para o time!", {
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />
    });
  }, [onContribute]);

  return (
    <Card className={cn("bg-card/50 backdrop-blur-xl border-border/30", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Competição de Times</CardTitle>
              <p className="text-sm text-muted-foreground">
                Semana 3 de Janeiro
              </p>
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
        {/* Podium for top 3 */}
        <TeamPodium teams={teams} />

        {/* Current team highlight */}
        {currentTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                  `bg-gradient-to-br ${currentTeam.color}`
                )}>
                  {currentTeam.icon}
                </div>
                <div>
                  <p className="font-semibold">{currentTeam.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Posição #{currentTeam.rank} • {currentTeam.members.length} membros
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{currentTeam.totalXP.toLocaleString()}</p>
                <p className="text-sm text-green-500">
                  +{currentTeam.weeklyXP.toLocaleString()} esta semana
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* All teams list */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
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
