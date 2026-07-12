import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { ImmersiveScenario } from '@/config/behavioralPillars';

export function NarrativePhase({ scenario }: { scenario: ImmersiveScenario }) {
  return (
    <motion.div key="narrative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl w-full">
      <Card className="border-2 border-primary/10 shadow-2xl">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="text-lg leading-relaxed whitespace-pre-line">{scenario.narrativa}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground animate-pulse">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Preparando opções...</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
