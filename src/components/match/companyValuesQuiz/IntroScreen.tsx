import { motion } from 'framer-motion';
import { Building2, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntroScreenProps {
  empresaNome: string;
  onStart: () => void;
  onCancel?: () => void;
}

export function IntroScreen({ empresaNome, onStart, onCancel }: IntroScreenProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="text-center space-y-4 pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
          >
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Deu Match! 💜
            </CardTitle>
            <CardDescription className="text-lg mt-2">Defina a cultura da {empresaNome}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              Por que isso é importante?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Assim como no amor, no trabalho o alinhamento de valores é fundamental. Quando empresa e
              colaborador compartilham as mesmas crenças, o resultado é engajamento, produtividade e felicidade.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-primary/5">
              <span className="text-2xl">🎯</span>
              <p className="text-sm font-medium mt-1">20 valores</p>
              <p className="text-xs text-muted-foreground">para avaliar</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <span className="text-2xl">⏱️</span>
              <p className="text-sm font-medium mt-1">~5 minutos</p>
              <p className="text-xs text-muted-foreground">tempo estimado</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <span className="text-2xl">💜</span>
              <p className="text-sm font-medium mt-1">Match preciso</p>
              <p className="text-xs text-muted-foreground">com candidatos</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">Voltar</Button>
            )}
            <Button onClick={onStart} className="flex-1 bg-gradient-to-r from-primary to-primary/80">
              <Sparkles className="h-4 w-4 mr-2" />
              Começar Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
