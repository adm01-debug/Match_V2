/**
 * @fileoverview Visualização dos resultados Big Five (OCEAN)
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Target, Users, Heart, Brain,
  TrendingUp, TrendingDown, Briefcase, Star
} from 'lucide-react';
import { type BigFiveResult, BIG_FIVE_INFO, type BigFiveTrait } from '@/types/personality';
import { cn } from '@/lib/utils';

const TRAIT_ICONS: Record<BigFiveTrait, React.ElementType> = {
  O: Sparkles,
  C: Target,
  E: Users,
  A: Heart,
  N: Brain
};

const TRAIT_KEYS: Record<BigFiveTrait, keyof BigFiveResult['scores']> = {
  O: 'openness',
  C: 'conscientiousness',
  E: 'extraversion',
  A: 'agreeableness',
  N: 'neuroticism'
};

interface BigFiveResultCardProps {
  result: BigFiveResult;
  candidatoNome?: string;
  showDetails?: boolean;
  variant?: 'compact' | 'full';
}

export const BigFiveResultCard = memo(function BigFiveResultCard({
  result,
  candidatoNome,
  showDetails = true,
  variant = 'full'
}: BigFiveResultCardProps) {
  const traits: BigFiveTrait[] = ['O', 'C', 'E', 'A', 'N'];
  
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Perfil Big Five
              {candidatoNome && <span className="text-muted-foreground font-normal"> - {candidatoNome}</span>}
            </CardTitle>
            <Badge variant="outline" className={cn(
              "bg-gradient-to-r text-white border-0",
              BIG_FIVE_INFO[result.traitPrimario].cor
            )}>
              {BIG_FIVE_INFO[result.traitPrimario].nome}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {traits.map(trait => {
              const Icon = TRAIT_ICONS[trait];
              const info = BIG_FIVE_INFO[trait];
              const score = result.scores[TRAIT_KEYS[trait]];
              
              return (
                <div key={trait} className="text-center">
                  <div className={cn(
                    "w-10 h-10 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center",
                    info.cor
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="mt-1 text-xs font-medium">{score}%</p>
                  <p className="text-[10px] text-muted-foreground truncate">{info.nome}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Perfil Big Five (OCEAN)
            </CardTitle>
            <CardDescription>
              {candidatoNome ? `Análise de personalidade de ${candidatoNome}` : 'Análise dos 5 grandes fatores de personalidade'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Star className="w-3 h-3 mr-1" />
            {result.perfil}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Trait Bars */}
        <div className="space-y-4">
          {traits.map((trait, index) => {
            const Icon = TRAIT_ICONS[trait];
            const info = BIG_FIVE_INFO[trait];
            const score = result.scores[TRAIT_KEYS[trait]];
            const isPrimary = trait === result.traitPrimario;
            const isSecondary = trait === result.traitSecundario;
            
            return (
              <motion.div
                key={trait}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  isPrimary && "bg-primary/5 border-primary/20",
                  isSecondary && "bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      info.cor
                    )}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{info.nomeCompleto}</span>
                        {isPrimary && (
                          <Badge variant="default" className="text-xs">Principal</Badge>
                        )}
                        {isSecondary && (
                          <Badge variant="secondary" className="text-xs">Secundário</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {score >= 60 ? info.descricaoAlta : info.descricaoBaixa}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{score}</span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress value={score} className="h-2" />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-muted-foreground/30"
                    style={{ left: '50%' }}
                  />
                </div>
                
                {showDetails && (
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Baixo
                    </span>
                    <span className="flex items-center gap-1">
                      Alto
                      <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {showDetails && (
          <>
            {/* Pontos Fortes e Desenvolvimento */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-1">
                  {result.pontosFortes.map((ponto, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  Áreas de Desenvolvimento
                </h4>
                <ul className="space-y-1">
                  {result.areasDesenvolvimento.map((area, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Carreiras Compatíveis */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-primary" />
                Carreiras Compatíveis
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.compatibilidadeCarreira.map((carreira, i) => (
                  <Badge key={i} variant="secondary">
                    {carreira}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ambiente e Estilo */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="p-3 rounded-lg border bg-background">
                <span className="text-muted-foreground">Ambiente Ideal:</span>
                <p className="font-medium mt-1">{result.ambienteIdeal}</p>
              </div>
              <div className="p-3 rounded-lg border bg-background">
                <span className="text-muted-foreground">Relacionamento em Equipe:</span>
                <p className="font-medium mt-1">{result.relacionamentoEquipe}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default BigFiveResultCard;
