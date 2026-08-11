import { motion } from 'framer-motion';
import { CheckCircle2, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { VALORES_CULTURAIS, type RespostaValorEmpresa } from '@/types/match';

interface ResultsScreenProps {
  respostas: RespostaValorEmpresa[];
  descricaoCultura: string;
  onDescricaoChange: (v: string) => void;
  onComplete: () => void;
}

export function ResultsScreen({ respostas, descricaoCultura, onDescricaoChange, onComplete }: ResultsScreenProps) {
  const top5 = [...respostas].sort((a, b) => b.intensidade - a.intensidade).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-success/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
          >
            <CheckCircle2 className="h-8 w-8 text-success" />
          </motion.div>
          <CardTitle className="text-2xl">Perfil Cultural Definido!</CardTitle>
          <CardDescription>Seus 5 valores mais importantes para encontrar o match perfeito</CardDescription>
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
                  className={cn('flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r', valor.cor, 'text-white')}
                >
                  <span className="text-2xl font-bold">#{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{valor.nome}</p>
                    <p className="text-sm opacity-90">{valor.descricao}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {resposta.intensidade}/5
                  </Badge>
                </motion.div>
              );
            })}
          </div>
          <div className="space-y-3">
            <label htmlFor="descricao-cultura" className="text-sm font-medium">
              Descreva a cultura da empresa em suas palavras (opcional):
            </label>
            <Textarea
              id="descricao-cultura"
              value={descricaoCultura}
              onChange={(e) => onDescricaoChange(e.target.value)}
              placeholder="Ex: Somos uma startup inovadora que valoriza..."
              rows={3}
            />
          </div>
          <Button onClick={onComplete} className="w-full bg-gradient-to-r from-success to-success/70" size="lg">
            <Heart className="h-5 w-5 mr-2" />
            Salvar e Encontrar Matches
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
