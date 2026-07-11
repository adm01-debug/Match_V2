/**
 * @fileoverview Fase de conclusão do motor de avaliação gamificada.
 */

import { motion } from 'framer-motion';
import { Crown, Flame, Star, Trophy, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ComboState, EngineTheme, themeStyles } from '@/components/assessments/gamified/engineConfig';

interface GamifiedCompletePhaseProps {
  totalXP: number;
  combo: ComboState;
  fastAnswers: number;
  earnedBadges: string[];
  theme: EngineTheme;
  onExit?: () => void;
}

export function GamifiedCompletePhase({
  totalXP,
  combo,
  fastAnswers,
  earnedBadges,
  theme,
  onExit,
}: GamifiedCompletePhaseProps) {
  const styles = themeStyles[theme];

  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center"
    >
      <div className={cn('rounded-3xl p-8 shadow-2xl border', styles.card)}>
        <motion.div
          className="flex justify-center mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Incrível! 🎉</h1>
        <p className="text-muted-foreground mb-8">Você completou a avaliação!</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{totalXP}</p>
            <p className="text-sm text-muted-foreground">XP Ganho</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">x{combo.multiplier.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Combo Máximo</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{fastAnswers}</p>
            <p className="text-sm text-muted-foreground">Respostas Rápidas</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{earnedBadges.length}</p>
            <p className="text-sm text-muted-foreground">Conquistas</p>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Conquistas Desbloqueadas:</p>
            <div className="flex justify-center gap-2">
              {earnedBadges.map((badge) => (
                <Badge key={badge} variant="outline" className="px-3 py-1">
                  🏆 {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button size="lg" className="w-full" onClick={onExit}>
          Continuar
        </Button>
      </div>
    </motion.div>
  );
}
