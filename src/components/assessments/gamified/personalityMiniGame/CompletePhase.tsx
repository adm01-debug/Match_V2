import { motion } from 'framer-motion';
import { ArrowRight, Star, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  totalXP: number;
  totalGames: number;
  onExit?: () => void;
}

export function CompletePhase({ totalXP, totalGames, onExit }: Props) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-warning to-destructive flex items-center justify-center"
      >
        <Trophy className="h-12 w-12 text-primary-foreground" />
      </motion.div>

      <h2 className="text-3xl font-bold mb-2">Fantástico! 🎉</h2>
      <p className="text-muted-foreground mb-8">Você completou todos os mini-games</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20">
          <Star className="h-8 w-8 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalXP}</p>
          <p className="text-sm text-muted-foreground">XP Total</p>
        </div>
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
          <Target className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalGames}</p>
          <p className="text-sm text-muted-foreground">Desafios</p>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={onExit}>
        Ver Resultados <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
}
