import { motion } from "framer-motion";
import { Trophy, Flame, Award, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GamificationHeaderProps {
  level: number;
  streak: number;
  xp: number;
}

export function GamificationHeader({ level, streak, xp }: GamificationHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-warning via-warning to-accent shadow-lg shadow-warning/25"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Trophy className="h-7 w-7 text-white" />
        </motion.div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Conquistas & Ranking</h1>
            <Badge className="bg-gradient-to-r from-warning to-accent text-primary-foreground border-0">
              <Flame className="h-3 w-3 mr-1" />
              Em chamas!
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu progresso, desbloqueie conquistas e suba no ranking
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 border border-warning/20">
          <Award className="h-5 w-5 text-warning" />
          <div>
            <p className="text-xs text-muted-foreground">Nível</p>
            <p className="font-bold text-warning">{level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
          <Flame className="h-5 w-5 text-accent-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="font-bold text-accent-foreground">{streak} dias</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Star className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">XP</p>
            <p className="font-bold text-primary">{xp.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
