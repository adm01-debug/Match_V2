import { motion } from 'framer-motion';
import { CheckCircle2, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VALORES_CULTURAIS, type RespostaValorCandidato } from '@/types/match';

interface ResultsScreenProps {
  respostas: RespostaValorCandidato[];
  onComplete: () => void;
}

export function ResultsScreen({ respostas, onComplete }: ResultsScreenProps) {
  const top5 = [...respostas].sort((a, b) => b.intensidade - a.intensidade).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-accent/20">
        <CardHeader className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mx-auto mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-destructive flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute -top-1 -right-1 bg-warning rounded-full p-1">
                <Star className="h-4 w-4 text-warning" />
              </motion.div>
            </div>
          </motion.div>
          <CardTitle className="text-2xl">Seus Valores Descobertos! ✨</CardTitle>
          <CardDescription>Isso é o que mais importa para você no trabalho</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            {top5.map((resposta, index) => {
              const valor = VALORES_CULTURAIS.find((v) => v.id === resposta.valorId)!;
              return (
                <motion.div
                  key={resposta.valorId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn('flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r', valor.cor, 'text-white shadow-lg')}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{valor.nome}</p>
                    <p className="text-sm opacity-90 line-clamp-1">{valor.descricao}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: resposta.intensidade }).map((_, i) => (
                      <Heart key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              🎯 Agora vamos encontrar empresas que compartilham esses valores com você!
            </p>
          </div>
          <Button onClick={onComplete} className="w-full bg-gradient-to-r from-accent to-destructive hover:from-accent hover:to-destructive" size="lg">
            <Heart className="h-5 w-5 mr-2" />
            Ver Meus Matches
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
