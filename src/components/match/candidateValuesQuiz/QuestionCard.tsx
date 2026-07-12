import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { VALORES_CULTURAIS, type RespostaValorCandidato } from '@/types/match';
import { iconMap, intensidadeLabels } from './constants';

interface QuestionCardProps {
  currentIndex: number;
  respostaAtual?: RespostaValorCandidato;
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
          <span>Reflexão {currentIndex + 1} de {totalQuestoes}</span>
          <span>{Math.round(progresso)}% completo</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <Card className="border-2 border-pink-500/20">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn('mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 rotate-3 bg-gradient-to-br', valorAtual.cor, 'text-white shadow-lg')}
              >
                {iconMap[valorAtual.icone] || <Sparkles className="h-6 w-6" />}
              </motion.div>
              <Badge variant="outline" className="mx-auto mb-2 border-pink-500/30">{valorAtual.nome}</Badge>
              <CardTitle className="text-xl leading-relaxed">{valorAtual.perguntaCandidato}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {intensidadeLabels.map((item) => (
                  <motion.button
                    key={item.valor}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onResposta(item.valor)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4',
                      respostaAtual?.intensidade === item.valor
                        ? `border-pink-500 bg-gradient-to-r ${item.color} text-white`
                        : 'border-muted hover:border-pink-300'
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={cn(
                            'h-4 w-4 transition-all',
                            i < item.valor
                              ? respostaAtual?.intensidade === item.valor
                                ? 'fill-white text-white'
                                : 'fill-pink-500 text-pink-500'
                              : respostaAtual?.intensidade === item.valor
                                ? 'text-white/30'
                                : 'text-muted'
                          )}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={onNext} disabled={!respostaAtual} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500">
                  {currentIndex === totalQuestoes - 1 ? 'Ver Resultado' : 'Próximo'}
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
