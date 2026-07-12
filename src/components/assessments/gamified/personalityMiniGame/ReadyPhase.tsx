import { motion } from 'framer-motion';
import { Brain, Flame, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  totalGames: number;
  onStart: () => void;
  onExit?: () => void;
}

export function ReadyPhase({ totalGames, onStart, onExit }: Props) {
  return (
    <motion.div
      key="ready"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center max-w-md"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
      >
        <Brain className="h-12 w-12 text-primary-foreground" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-2">Mini-Games de Personalidade</h2>
      <p className="text-muted-foreground mb-6">
        {totalGames} desafios rápidos para descobrir seu perfil
      </p>

      <div className="flex items-center justify-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-warning" />
          <span>Responda rápido = mais XP</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-destructive" />
          <span>Combos multiplicam</span>
        </div>
      </div>

      <Button size="lg" className="gap-2" onClick={onStart}>
        <Zap className="h-5 w-5" />
        Iniciar!
      </Button>

      {onExit && (
        <Button variant="ghost" className="mt-2 w-full" onClick={onExit}>
          Voltar
        </Button>
      )}
    </motion.div>
  );
}
