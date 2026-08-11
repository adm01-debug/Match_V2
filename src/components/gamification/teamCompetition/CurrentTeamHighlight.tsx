import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Team } from './types';

export function CurrentTeamHighlight({ team }: { team: Team }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl', `bg-gradient-to-br ${team.color}`)}>
            {team.icon}
          </div>
          <div>
            <p className="font-semibold">{team.name}</p>
            <p className="text-sm text-muted-foreground">
              Posição #{team.rank} • {team.members.length} membros
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{team.totalXP.toLocaleString()}</p>
          <p className="text-sm text-success">+{team.weeklyXP.toLocaleString()} esta semana</p>
        </div>
      </div>
    </motion.div>
  );
}
