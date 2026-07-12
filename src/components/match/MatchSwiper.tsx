/**
 * @fileoverview Swiper de Matches estilo Tinder
 * @description Interface de swipe para candidatos verem matches com empresas
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  X, 
  Star,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  RotateCcw,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface MatchCard {
  id: string;
  empresaNome: string;
  empresaLogo?: string;
  vagaTitulo: string;
  localizacao?: string;
  salario?: string;
  modalidade?: string;
  matchScore: number;
  valoresPrincipais: string[];
  descricao: string;
}

interface MatchSwiperProps {
  cards: MatchCard[];
  onSwipeLeft: (card: MatchCard) => void;
  onSwipeRight: (card: MatchCard) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

const SWIPE_THRESHOLD = 100;

export function MatchSwiper({ 
  cards, 
  onSwipeLeft, 
  onSwipeRight,
  onUndo,
  canUndo = false
}: MatchSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [exitX, setExitX] = useState(0);
  
  const currentCard = cards[currentIndex];
  const hasMoreCards = currentIndex < cards.length;
  
  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    if (!currentCard) return;
    
    setDirection(dir);
    setExitX(dir === 'left' ? -500 : 500);
    
    if (dir === 'right' && currentCard.matchScore >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#a855f7', '#f472b6']
      });
    }
    
    setTimeout(() => {
      if (dir === 'left') {
        onSwipeLeft(currentCard);
      } else {
        onSwipeRight(currentCard);
      }
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  }, [currentCard, onSwipeLeft, onSwipeRight]);
  
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };
  
  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-success to-success/80';
    if (score >= 60) return 'from-warning to-warning/80';
    if (score >= 40) return 'from-warning to-destructive';
    return 'from-gray-400 to-gray-500';
  };
  
  if (!hasMoreCards) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="border-2 border-dashed text-center p-12">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Você viu todas!</h3>
            <p className="text-muted-foreground">
              Novos matches aparecerão quando novas vagas forem publicadas
            </p>
            {canUndo && (
              <Button variant="outline" onClick={onUndo}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Voltar ao Último
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 relative min-h-[600px]">
      {/* Cards Stack */}
      <div className="relative h-[500px]">
        {/* Background cards */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, i) => (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            style={{
              zIndex: 2 - i,
              scale: 1 - (i + 1) * 0.05,
              y: (i + 1) * 10,
            }}
          >
            <Card className="h-full opacity-60 shadow-lg">
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <Building2 className="h-12 w-12" />
              </div>
            </Card>
          </motion.div>
        ))}
        
        {/* Current Card */}
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: direction ? exitX : 0,
                rotate: direction ? (direction === 'left' ? -15 : 15) : 0
              }}
              exit={{ 
                x: exitX,
                opacity: 0,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full overflow-hidden shadow-2xl border-2">
                {/* Score Badge */}
                <div className={cn(
                  "absolute top-4 right-4 z-20 px-4 py-2 rounded-full text-white font-bold shadow-lg",
                  "bg-gradient-to-r",
                  getScoreGradient(currentCard.matchScore)
                )}>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{currentCard.matchScore}%</span>
                  </div>
                </div>
                
                {/* Swipe Indicators */}
                <motion.div
                  className="absolute top-1/2 left-4 -translate-y-1/2 z-20"
                  style={{ opacity: direction === 'left' ? 1 : 0 }}
                >
                  <div className="px-6 py-3 rounded-lg border-4 border-destructive text-destructive font-bold text-2xl rotate-[-20deg]">
                    NOPE
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 right-4 -translate-y-1/2 z-20"
                  style={{ opacity: direction === 'right' ? 1 : 0 }}
                >
                  <div className="px-6 py-3 rounded-lg border-4 border-success text-success font-bold text-2xl rotate-[20deg]">
                    MATCH!
                  </div>
                </motion.div>
                
                {/* Company Header */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      {currentCard.empresaLogo ? (
                        <img 
                          src={currentCard.empresaLogo} 
                          alt={currentCard.empresaNome}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{currentCard.empresaNome}</h3>
                      <p className="text-primary font-medium">{currentCard.vagaTitulo}</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  {/* Info Tags */}
                  <div className="flex flex-wrap gap-2">
                    {currentCard.localizacao && (
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {currentCard.localizacao}
                      </Badge>
                    )}
                    {currentCard.salario && (
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        {currentCard.salario}
                      </Badge>
                    )}
                    {currentCard.modalidade && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {currentCard.modalidade}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {currentCard.descricao}
                  </p>
                  
                  {/* Matching Values */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      Valores em Comum
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentCard.valoresPrincipais.slice(0, 4).map((valor, i) => (
                        <Badge 
                          key={i} 
                          className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/30"
                        >
                          {valor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {canUndo && (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={onUndo}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8 text-destructive" />
        </Button>
        
        <Button
          size="icon"
          className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-10 w-10" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 border-info/30 hover:bg-info/10 hover:border-info/50"
        >
          <Info className="h-5 w-5 text-info" />
        </Button>
      </div>
      
      {/* Progress */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} de {cards.length} oportunidades
      </div>
    </div>
  );
}
