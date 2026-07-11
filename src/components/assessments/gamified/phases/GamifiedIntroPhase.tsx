/**
 * @fileoverview Fase de introdução do motor de avaliação gamificada.
 */

import { motion } from 'framer-motion';
import { ChevronRight, Clock, Flame, Rocket, Sparkles, Target, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { themeStyles, EngineTheme } from '@/components/assessments/gamified/engineConfig';

interface GamifiedIntroPhaseProps {
  title: string;
  subtitle: string;
  totalQuestions: number;
  theme: EngineTheme;
  onStart: () => void;
  onExit?: () => void;
}

export function GamifiedIntroPhase({
  title,
  subtitle,
  totalQuestions,
  theme,
  onStart,
  onExit,
}: GamifiedIntroPhaseProps) {
  const styles = themeStyles[theme];

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="max-w-lg w-full"
    >
      <div className={cn('rounded-3xl p-8 shadow-2xl border', styles.card)}>
        <motion.div
          className="flex justify-center mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br', styles.accent)}>
            <Rocket className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
        <p className="text-muted-foreground text-center mb-8">{subtitle}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">XP & Níveis</p>
              <p className="text-xs text-muted-foreground">Ganhe pontos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Combos</p>
              <p className="text-xs text-muted-foreground">Multiplique!</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Trophy className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Conquistas</p>
              <p className="text-xs text-muted-foreground">Desbloqueie</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Speed Bonus</p>
              <p className="text-xs text-muted-foreground">Seja rápido</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span>{totalQuestions} questões</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>~5 minutos</span>
          </div>
        </div>

        <Button
          size="lg"
          className={cn('w-full gap-2 text-lg h-14 bg-gradient-to-r', styles.accent)}
          onClick={onStart}
        >
          <Sparkles className="h-5 w-5" />
          Começar Jornada
          <ChevronRight className="h-5 w-5" />
        </Button>

        {onExit && (
          <Button variant="ghost" className="w-full mt-2" onClick={onExit}>
            Voltar
          </Button>
        )}
      </div>
    </motion.div>
  );
}
