import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { VALORES_CULTURAIS, type RespostaValorEmpresa } from '@/types/match';
import { iconMap, intensidadeLabels } from './constants';

interface QuestionCardProps {
  currentIndex: number;
  respostaAtual?: RespostaValorEmpresa;
  onResposta: (intensidade: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuestionCard({ currentIndex, respostaAtual, onResposta, onPrevious, onNext }: QuestionCardProps) {
  const valorAtual = VALORES_CULTURAIS[currentIndex]!;
  const totalQuestoes = VALORES_CULTURAIS.length;
  const progresso = (currentIndex / totalQuestoes) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Questão {currentIndex + 1} de {totalQuestoes}</span>
          <span>{Math.round(progresso)}% completo</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn('mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br', valorAtual.cor, 'text-white')}
              >
                {iconMap[valorAtual.icone] || <Sparkles className="h-6 w-6" />}
              </motion.div>
              <Badge variant="outline" className="mx-auto mb-2">{valorAtual.nome}</Badge>
              <CardTitle className="text-xl leading-relaxed">{valorAtual.perguntaEmpresa}</CardTitle>
              <CardDescription className="mt-2">{valorAtual.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {intensidadeLabels.map((item) => (
                  <motion.button
                    key={item.valor}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onResposta(item.valor)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between hover:border-primary hover:bg-primary/5',
                      respostaAtual?.intensidade === item.valor ? 'border-primary bg-primary/10' : 'border-muted'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={cn('w-2 h-2 rounded-full', i < item.valor ? 'bg-primary' : 'bg-muted')} />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button onClick={onNext} disabled={!respostaAtual} className="flex-1">
                  {currentIndex === totalQuestoes - 1 ? 'Ver Resultados' : 'Próximo'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
