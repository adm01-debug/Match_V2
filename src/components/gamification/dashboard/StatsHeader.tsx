import { motion } from "framer-motion";
import { Flame, Trophy, Award, Medal, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "../ProgressRing";
import { cn } from "@/lib/utils";

interface StatsHeaderProps {
  level: number;
  levelTitle: string;
  xp: number;
  requiredXP: number;
  streak: number;
  unlockedCount: number;
  totalCount: number;
  rank: number;
}

export function StatsHeader({ level, levelTitle, xp, requiredXP, streak, unlockedCount, totalCount, rank }: StatsHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nível Atual</p>
                <p className="text-3xl font-bold">{level}</p>
                <p className="text-xs text-primary">{levelTitle}</p>
              </div>
              <ProgressRing value={xp} max={requiredXP} size="md" color="primary" showValue={false}>
                <Award className="w-6 h-6 text-primary" />
              </ProgressRing>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-warning/10 to-destructive/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak Atual</p>
                <p className="text-3xl font-bold">{streak} dias</p>
                <p className="text-xs text-warning">
                  {streak >= 7 ? "🔥 Em chamas!" : streak >= 3 ? "🌟 Continuando!" : "✨ Comece agora!"}
                </p>
              </div>
              <motion.div animate={streak >= 3 ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
                <Flame className={cn("w-10 h-10", streak >= 3 ? "text-warning" : "text-muted-foreground")} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conquistas</p>
                <p className="text-3xl font-bold">{unlockedCount}/{totalCount}</p>
                <p className="text-xs text-warning">2 novas disponíveis!</p>
              </div>
              <Trophy className="w-10 h-10 text-warning" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ranking</p>
                <p className="text-3xl font-bold">#{rank}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Continue jogando!
                </p>
              </div>
              <Medal className="w-10 h-10 text-success" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
