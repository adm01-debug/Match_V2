import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Team } from './types';

interface TeamCardProps {
  team: Team;
  isCurrentTeam?: boolean;
  onJoin?: () => void;
}

export const TeamCard = memo(({ team, isCurrentTeam, onJoin }: TeamCardProps) => {
  const goalPercent = (team.goalProgress / team.goalTarget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 rounded-xl transition-all duration-300 border',
        isCurrentTeam
          ? 'bg-primary/10 border-primary/30 shadow-lg'
          : 'bg-card/50 border-border/30 hover:bg-card/80'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <motion.div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
              `bg-gradient-to-br ${team.color} shadow-md`
            )}
          >
            {team.icon}
          </motion.div>
          <div
            className={cn(
              'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
              team.rank === 1 && 'bg-warning',
              team.rank === 2 && 'bg-muted-foreground',
              team.rank === 3 && 'bg-accent',
              team.rank > 3 && 'bg-muted-foreground'
            )}
          >
            {team.rank}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{team.name}</h3>
            {isCurrentTeam && <Badge variant="secondary" className="text-xs">Seu Time</Badge>}
            {team.streak >= 3 && (
              <Badge variant="outline" className="gap-1 border-warning/50 text-warning">
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
              <TrendingUp className="h-4 w-4 text-success" />
              +{team.weeklyXP.toLocaleString()} esta semana
            </span>
          </div>

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

      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name.replace(' ', '')}`} />
                <AvatarFallback className="text-xs">
                  {member.name.split(' ').map((n) => n[0]).join('')}
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
