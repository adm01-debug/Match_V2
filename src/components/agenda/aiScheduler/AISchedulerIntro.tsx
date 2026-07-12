import { motion } from 'framer-motion';
import { Calendar, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  candidatoNome: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function AISchedulerIntro({ candidatoNome, isAnalyzing, onAnalyze }: Props) {
  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Agendar entrevista para {candidatoNome}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Nossa IA analisará os calendários dos entrevistadores e sugerirá os melhores horários baseados em disponibilidade e produtividade.
      </p>
      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Analisando calendários...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Encontrar melhores horários
          </>
        )}
      </Button>
    </motion.div>
  );
}
