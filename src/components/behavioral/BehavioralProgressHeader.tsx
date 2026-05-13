import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Star, Trophy, Flame, BarChart3 } from 'lucide-react';

interface BehavioralProgressHeaderProps {
  totalBehavioralXP: number;
  unlockedCount: number;
  dailyCombo: number;
  progressPercentage: number;
}

export function BehavioralProgressHeader({
  totalBehavioralXP,
  unlockedCount,
  dailyCombo,
  progressPercentage
}: BehavioralProgressHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8"
    >
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-primary text-primary-foreground">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">10 Ferramentas de Comportamento Humano</h1>
            <p className="text-muted-foreground mt-1">
              Sistema completo de avaliação comportamental para recrutamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-background/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{totalBehavioralXP}</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{unlockedCount}</div>
                <div className="text-sm text-muted-foreground">Conquistas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{dailyCombo}x</div>
                <div className="text-sm text-muted-foreground">Combo</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-muted-foreground">Progresso</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
}