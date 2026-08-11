import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Scale, Users, Crown, Shuffle, Rocket,
  MessageCircle, Brain, Heart, Target,
} from 'lucide-react';
import { BEHAVIORAL_PILLARS } from '@/config/behavioralPillars';
import { cn } from '@/lib/utils';

const pilarIcons: Record<string, typeof Shield> = {
  resiliencia: Shield,
  integridade: Scale,
  colaboracao: Users,
  lideranca: Crown,
  adaptabilidade: Shuffle,
  proatividade: Rocket,
  comunicacao: MessageCircle,
  pensamento_critico: Brain,
  inteligencia_emocional: Heart,
  orientacao_resultados: Target,
};

export function BehavioralPilaresTab() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {BEHAVIORAL_PILLARS.map(pilar => {
        const Icon = pilarIcons[pilar.id] || Target;
        return (
          <motion.div
            key={pilar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', pilar.cor)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{pilar.nome}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{pilar.descricao}</p>
                <div className="flex flex-wrap gap-1">
                  {pilar.dimensoes.slice(0, 3).map(dim => (
                    <Badge key={dim} variant="outline" className="text-xs">{dim}</Badge>
                  ))}
                  {pilar.dimensoes.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{pilar.dimensoes.length - 3}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
