import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Heart, Star, RotateCcw, Info, Building2, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';
import { 
  DNAProfile, 
  DNA_ARCHETYPES, 
  calculateMatchCompatibility,
  archetypeChemistry 
} from '@/types/behavioralDNA';
import { DNABar } from './DNAHelix3D';

interface DNAMatchSwiperProps {
  userProfile: DNAProfile;
  potentialMatches: DNAProfile[];
  onMatch?: (profile: DNAProfile, action: 'like' | 'pass') => void;
}

export const DNAMatchSwiper: React.FC<DNAMatchSwiperProps> = ({
  userProfile,
  potentialMatches,
  onMatch
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const currentMatch = potentialMatches[currentIndex];
  const matchScore = currentMatch 
    ? calculateMatchCompatibility(userProfile, currentMatch)
    : 0;

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!currentMatch) return;

    setSwipeDirection(direction);
    setHistory(prev => [...prev, currentIndex]);

    if (direction === 'right' && matchScore >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f59e0b']
      });
    }

    onMatch?.(currentMatch, direction === 'right' ? 'like' : 'pass');

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
      setShowDetails(false);
    }, 300);
  }, [currentIndex, currentMatch, matchScore, onMatch]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (lastIndex !== undefined) {
      setCurrentIndex(lastIndex);
    }
  }, [history]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  }, [handleSwipe]);

  if (currentIndex >= potentialMatches.length) {
    return (
      <Card className="p-12 text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Você viu todos!</h2>
        <p className="text-muted-foreground mb-6">
          Não há mais perfis para analisar no momento.
        </p>
        {history.length > 0 && (
          <Button variant="outline" onClick={handleUndo}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Desfazer Último
          </Button>
        )}
      </Card>
    );
  }

  if (!currentMatch) return null;

  const archetype = DNA_ARCHETYPES.find(a => a.id === currentMatch.archetype);
  const userArchetype = DNA_ARCHETYPES.find(a => a.id === userProfile.archetype);
  const chemistry = archetypeChemistry(userProfile.archetype, currentMatch.archetype);
  const Icon = currentMatch.type === 'candidate' ? User : Building2;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-success to-success/70';
    if (score >= 60) return 'from-warning to-warning/70';
    if (score >= 40) return 'from-warning to-destructive';
    return 'from-destructive to-destructive/80';
  };

  const getChemistryBadge = () => {
    switch (chemistry) {
      case 'synergy':
        return <Badge className="bg-success/20 text-success border-success/30">💫 Sinergia Total</Badge>;
      case 'complementary':
        return <Badge className="bg-info/20 text-info border-info/30">🤝 Complementares</Badge>;
      case 'tension':
        return <Badge className="bg-warning/20 text-warning border-warning/30">⚡ Tensão Criativa</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border">⚖️ Neutro</Badge>;
    }
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
            rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : 0
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <Card className="overflow-hidden relative">
            {/* Swipe Indicators */}
            <motion.div
              className="absolute top-8 left-8 z-10 bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-bold text-2xl -rotate-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: swipeDirection === 'left' ? 1 : 0,
                scale: swipeDirection === 'left' ? 1 : 0
              }}
            >
              NOPE
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 z-10 bg-success text-success-foreground px-6 py-2 rounded-lg font-bold text-2xl rotate-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: swipeDirection === 'right' ? 1 : 0,
                scale: swipeDirection === 'right' ? 1 : 0
              }}
            >
              MATCH!
            </motion.div>

            {/* Match Score Header */}
            <div className={`bg-gradient-to-r ${getScoreColor(matchScore)} p-4 text-center text-primary-foreground`}>
              <div className="text-sm opacity-90 mb-1">Compatibilidade</div>
              <div className="text-4xl font-bold">{Math.round(matchScore)}%</div>
              {getChemistryBadge()}
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
                  style={{ backgroundColor: `${archetype?.color}30` }}
                >
                  {archetype?.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase">
                      {currentMatch.type === 'candidate' ? 'Candidato' : 'Empresa'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{currentMatch.name}</h3>
                  <p className="text-sm" style={{ color: archetype?.color }}>
                    {archetype?.name}
                  </p>
                </div>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {currentMatch.dnaCode}
                </code>
              </div>

              {/* DNA Comparison */}
              <div className="mb-6">
                <DNABar helix={currentMatch.helix} />
              </div>

              {/* Details Toggle */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-success/10 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-success mb-2">Forças</h4>
                        <ul className="text-sm space-y-1">
                          {currentMatch.strengths.slice(0, 3).map((s, i) => (
                            <li key={i} className="text-muted-foreground">• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-warning/10 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-warning mb-2">Desafios</h4>
                        <ul className="text-sm space-y-1">
                          {currentMatch.challenges.slice(0, 3).map((c, i) => (
                            <li key={i} className="text-muted-foreground">• {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Archetype Compatibility */}
                    <div className="bg-primary/10 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-primary mb-2">
                        {userArchetype?.emoji} {userArchetype?.name} × {archetype?.emoji} {archetype?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {chemistry === 'synergy' && 'Vocês formam uma dupla poderosa! Seus pontos fortes se amplificam mutuamente.'}
                        {chemistry === 'complementary' && 'Boa combinação! Um pode cobrir as lacunas do outro.'}
                        {chemistry === 'tension' && 'Há potencial de conflito, mas também de crescimento. Diferenças podem ser produtivas.'}
                        {chemistry === 'neutral' && 'Combinação equilibrada sem grandes pontos de atrito ou sinergia.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-2 border-border hover:border-muted-foreground/50 hover:bg-muted"
                onClick={handleUndo}
                disabled={history.length === 0}
              >
                <RotateCcw className="w-6 h-6 text-muted-foreground" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full border-2 border-destructive/40 hover:border-destructive hover:bg-destructive/10"
                onClick={() => handleSwipe('left')}
              >
                <X className="w-8 h-8 text-destructive" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-2 border-info/40 hover:border-info hover:bg-info/10"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-5 h-5 text-info" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full border-2 border-success/40 hover:border-success hover:bg-success/10"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-8 h-8 text-success" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-2 border-primary/40 hover:border-primary hover:bg-primary/10"
                onClick={() => {
                  handleSwipe('right');
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                }}
              >
                <Star className="w-6 h-6 text-primary" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Progress */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {currentIndex + 1} de {potentialMatches.length} perfis
      </div>
    </div>
  );
};

export default DNAMatchSwiper;
