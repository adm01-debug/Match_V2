/**
 * @fileoverview Card de Resultado do Match
 * @description Exibe o resultado do match entre candidato e empresa estilo Tinder
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  X, 
  Star,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Zap,
  Trophy,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MatchResult, type MatchDetalhe, VALORES_CULTURAIS, getCorAlinhamento } from '@/types/match';
import confetti from 'canvas-confetti';

interface MatchResultCardProps {
  match: MatchResult;
  empresaNome: string;
  candidatoNome?: string;
  vagaTitulo?: string;
  onLike?: () => void;
  onPass?: () => void;
  onViewDetails?: () => void;
  showActions?: boolean;
}

const recomendacaoConfig = {
  match_perfeito: {
    label: 'Match Perfeito!',
    emoji: '💜',
    color: 'from-primary to-accent',
    icon: Trophy,
    description: 'Vocês são feitos um para o outro!'
  },
  match_forte: {
    label: 'Match Forte',
    emoji: '🔥',
    color: 'from-warning to-destructive',
    icon: Zap,
    description: 'Grande potencial de sucesso juntos'
  },
  match_moderado: {
    label: 'Match Promissor',
    emoji: '✨',
    color: 'from-info to-primary',
    icon: Star,
    description: 'Há alinhamento em pontos importantes'
  },
  revisar: {
    label: 'Vale Explorar',
    emoji: '🤔',
    color: 'from-warning to-warning/70',
    icon: TrendingUp,
    description: 'Alguns pontos precisam de atenção'
  },
  nao_recomendado: {
    label: 'Talvez Não',
    emoji: '💭',
    color: 'from-muted to-muted-foreground',
    icon: AlertCircle,
    description: 'Pode haver desalinhamento significativo'
  }
};

/**
 * Lê uma variável CSS HSL semântica e converte em `hsl(...)` para bibliotecas
 * externas (canvas-confetti) que não entendem tokens Tailwind.
 */
const cssVarHsl = (varName: string): string => {
  if (typeof window === 'undefined') return 'hsl(0 0% 50%)';
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return raw ? `hsl(${raw})` : 'hsl(0 0% 50%)';
};

export function MatchResultCard({
  match,
  empresaNome,
  vagaTitulo,
  onLike,
  onPass,
  onViewDetails,
  showActions = true
}: MatchResultCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  
  const config = recomendacaoConfig[match.recomendacao];
  const IconComponent = config.icon;
  
  const handleLike = () => {
    setLiked(true);
    
    // Confetti para match!
    if (match.scoreTotal >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          cssVarHsl('--accent'),
          cssVarHsl('--primary'),
          cssVarHsl('--destructive'),
          cssVarHsl('--warning'),
        ],
      });
    }
    
    onLike?.();
  };
  
  const handlePass = () => {
    setLiked(false);
    onPass?.();
  };
  
  const renderAlinhamentoItem = (detalhe: MatchDetalhe) => {
    const valor = VALORES_CULTURAIS.find(v => v.id === detalhe.valorId);
    if (!valor) return null;
    
    return (
      <div 
        key={detalhe.valorId}
        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", getCorAlinhamento(detalhe.alinhamento))} />
          <span className="font-medium">{valor.nome}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Empresa: {detalhe.intensidadeEmpresa}</span>
          <span>|</span>
          <span className="text-muted-foreground">Você: {detalhe.intensidadeCandidato}</span>
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden border-2 shadow-xl">
        {/* Header com Score */}
        <div className={cn("bg-gradient-to-r p-6 text-primary-foreground", config.color)}>
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2"
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-semibold">{config.label} {config.emoji}</span>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="relative inline-block"
            >
              <div className="text-7xl font-bold">{match.scoreTotal}</div>
              <div className="text-lg opacity-90">% compatibilidade</div>
            </motion.div>
            
            <p className="text-primary-foreground/80">{config.description}</p>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          {/* Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">{empresaNome}</p>
                {vagaTitulo && <p className="text-sm text-muted-foreground">{vagaTitulo}</p>}
              </div>
            </div>
          </div>
          
          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-green-500">{match.matchesPerfeitos.length + match.matchesAltos.length}</p>
              <p className="text-xs text-muted-foreground">Valores Alinhados</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-orange-500">{match.conflitos.length}</p>
              <p className="text-xs text-muted-foreground">Pontos de Atenção</p>
            </div>
          </div>
          
          {/* Pontos Fortes */}
          {match.pontosFortes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Vocês combinam em:
              </p>
              <div className="flex flex-wrap gap-2">
                {match.pontosFortes.slice(0, 3).map((ponto, i) => (
                  <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                    {ponto}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Expand Details */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Ocultar Detalhes
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ver Análise Completa
              </>
            )}
          </Button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Matches Perfeitos */}
                {match.matchesPerfeitos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">💚 Alinhamento Perfeito</p>
                    {match.matchesPerfeitos.map(renderAlinhamentoItem)}
                  </div>
                )}
                
                {/* Matches Altos */}
                {match.matchesAltos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-600">💪 Alinhamento Alto</p>
                    {match.matchesAltos.map(renderAlinhamentoItem)}
                  </div>
                )}
                
                {/* Conflitos */}
                {match.conflitos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-600">⚠️ Pontos de Atenção</p>
                    {match.conflitos.map(renderAlinhamentoItem)}
                  </div>
                )}
                
                {/* Análise */}
                <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Análise</p>
                  {match.analiseTexto}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Actions */}
          {showActions && liked === null && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950"
                onClick={handlePass}
              >
                <X className="h-5 w-5 mr-2 text-red-500" />
                Passar
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                onClick={handleLike}
              >
                <Heart className="h-5 w-5 mr-2" />
                Match!
              </Button>
            </div>
          )}
          
          {liked !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-4"
            >
              {liked ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-pink-500">
                    <Heart className="h-6 w-6 fill-current" />
                    <span className="text-xl font-bold">Você deu Match!</span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={onViewDetails}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Passou para a próxima oportunidade</p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
