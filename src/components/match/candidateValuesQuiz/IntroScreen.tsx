import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntroScreenProps {
  candidatoNome: string;
  onStart: () => void;
  onCancel?: () => void;
}

export function IntroScreen({ candidatoNome, onStart, onCancel }: IntroScreenProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-pink-500/20 bg-gradient-to-br from-background to-pink-50/10 dark:to-pink-950/10">
        <CardHeader className="text-center space-y-4 pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"
          >
            <Heart className="h-12 w-12 text-white" />
          </motion.div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Encontre seu Match! 💜
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Olá, {candidatoNome}! Vamos descobrir seus valores
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              O segredo de um trabalho feliz
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Quando você trabalha em uma empresa que compartilha seus valores, tudo flui naturalmente.
              Menos estresse, mais realização, e a sensação de estar no lugar certo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-pink-500/5">
              <span className="text-2xl">💭</span>
              <p className="text-sm font-medium mt-1">20 reflexões</p>
              <p className="text-xs text-muted-foreground">sobre você</p>
            </div>
            <div className="p-4 rounded-lg bg-pink-500/5">
              <span className="text-2xl">⏱️</span>
              <p className="text-sm font-medium mt-1">~5 minutos</p>
              <p className="text-xs text-muted-foreground">do seu tempo</p>
            </div>
            <div className="p-4 rounded-lg bg-pink-500/5">
              <span className="text-2xl">💜</span>
              <p className="text-sm font-medium mt-1">Matches</p>
              <p className="text-xs text-muted-foreground">personalizados</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">Voltar</Button>
            )}
            <Button onClick={onStart} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Descobrir Meus Valores
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
