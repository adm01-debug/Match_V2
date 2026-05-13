/**
 * @fileoverview Motor de Avaliação Gamificada
 * Sistema que transforma avaliações em experiências lúdicas e envolventes
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  Star, 
  Flame, 
  Target,
  Sparkles,
  ChevronRight,
  Clock,
  Award,
  Rocket,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import confetti from 'canvas-confetti';

export interface GamifiedQuestion {
  id: string;
  text: string;
  type: 'swipe' | 'choice' | 'scale' | 'ranking' | 'quick-fire';
  options?: { id: string; text: string; emoji?: string }[];
  category: string;
  xpReward: number;
  timeBonus?: number; // segundos para bonus de velocidade
}

interface GamifiedAssessmentEngineProps {
  questions: GamifiedQuestion[];
  onComplete: (answers: Record<string, AssessmentAnswer>, stats: AssessmentStats) => void;
  onExit?: () => void;
  title?: string;
  subtitle?: string;
  theme?: 'default' | 'playful' | 'minimal' | 'cosmic';
}

interface AssessmentAnswer {
  answer: string | number | boolean | string[] | Record<string, unknown>;
  responseTime: number;
  combo: number;
}

interface AssessmentStats {
  totalXP: number;
  comboMax: number;
  fastAnswers: number;
  timeElapsed: number;
  accuracy: number;
  badges: string[];
}

interface ComboState {
  count: number;
  multiplier: number;
  lastAnswerTime: number;
}

const COMBO_THRESHOLD = 3000; // 3 segundos para manter combo
const FAST_ANSWER_THRESHOLD = 2000; // 2 segundos = resposta rápida

const themeStyles = {
  default: {
    bg: 'bg-gradient-to-br from-background via-background to-primary/5',
    card: 'bg-card/90 backdrop-blur-xl border-border/50',
    accent: 'from-primary to-primary/80',
  },
  playful: {
    bg: 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10',
    card: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-pink-200/50 dark:border-purple-500/30',
    accent: 'from-pink-500 to-purple-500',
  },
  minimal: {
    bg: 'bg-background',
    card: 'bg-card border-border',
    accent: 'from-foreground to-foreground/80',
  },
  cosmic: {
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    card: 'bg-white/5 backdrop-blur-xl border-purple-500/20',
    accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
};

export const GamifiedAssessmentEngine = memo(function GamifiedAssessmentEngine({
  questions,
  onComplete,
  onExit,
  title = "Avaliação Gamificada",
  subtitle = "Descubra seu perfil de forma divertida",
  theme = 'playful',
}: GamifiedAssessmentEngineProps) {
  const { addXP, level } = useGamification();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [phase, setPhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [totalXP, setTotalXP] = useState(0);
  const [showXPGain, setShowXPGain] = useState<{ amount: number; x: number; y: number } | null>(null);
  const [combo, setCombo] = useState<ComboState>({ count: 0, multiplier: 1, lastAnswerTime: 0 });
  const [fastAnswers, setFastAnswers] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const styles = themeStyles[theme];

  // Trigger confetti for special moments
  const triggerConfetti = useCallback((type: 'small' | 'big' | 'combo') => {
    const configs = {
      small: { particleCount: 30, spread: 60, origin: { y: 0.7 } },
      big: { particleCount: 100, spread: 100, origin: { y: 0.6 } },
      combo: { 
        particleCount: 50, 
        spread: 90, 
        colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
        origin: { y: 0.5 }
      },
    };
    confetti(configs[type]);
  }, []);

  // Handle answer selection
  const handleAnswer = useCallback((questionId: string, answer: any, event?: React.MouseEvent) => {
    const now = Date.now();
    const responseTime = now - questionStartTime;
    const isFastAnswer = responseTime < FAST_ANSWER_THRESHOLD;
    const maintainsCombo = now - combo.lastAnswerTime < COMBO_THRESHOLD || combo.count === 0;

    // Calculate XP with multipliers
    let xpGained = currentQuestion?.xpReward || 10;
    
    // Fast answer bonus
    let newFastAnswers = fastAnswers;
    if (isFastAnswer && currentQuestion?.timeBonus) {
      xpGained += currentQuestion.timeBonus;
      newFastAnswers = fastAnswers + 1;
      setFastAnswers(newFastAnswers);
    }

    // Combo multiplier
    const newCombo = maintainsCombo 
      ? { count: combo.count + 1, multiplier: Math.min(4, 1 + combo.count * 0.5), lastAnswerTime: now }
      : { count: 1, multiplier: 1, lastAnswerTime: now };
    
    xpGained = Math.round(xpGained * newCombo.multiplier);
    setCombo(newCombo);

    // Show XP animation
    if (event) {
      setShowXPGain({ amount: xpGained, x: event.clientX, y: event.clientY });
      setTimeout(() => setShowXPGain(null), 1000);
    }

    // Trigger effects
    if (newCombo.count >= 3) {
      triggerConfetti('combo');
    } else if (isFastAnswer) {
      triggerConfetti('small');
    }

    // Check for badges
    let newBadges = [...earnedBadges];
    if (newCombo.count === 5 && !earnedBadges.includes('combo-master')) {
      newBadges = [...newBadges, 'combo-master'];
      setEarnedBadges(newBadges);
    }
    if (newFastAnswers >= 5 && !earnedBadges.includes('speed-demon')) {
      newBadges = [...newBadges, 'speed-demon'];
      setEarnedBadges(newBadges);
    }

    // Calculate new total XP including current answer
    const newTotalXP = totalXP + xpGained;
    setTotalXP(newTotalXP);
    addXP(xpGained, 'avaliacao');
    
    // Update answers with current answer included
    const newAnswers = { ...answers, [questionId]: { answer, responseTime, combo: newCombo.count } };
    setAnswers(newAnswers);

    // Next question or complete
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
      }, 500);
    } else {
      triggerConfetti('big');
      setTimeout(() => {
        setPhase('complete');
        onComplete(newAnswers, {
          totalXP: newTotalXP,
          comboMax: Math.max(combo.count, newCombo.count),
          fastAnswers: newFastAnswers,
          timeElapsed: Date.now() - startTime,
          accuracy: 100,
          badges: newBadges,
        });
      }, 1000);
    }
  }, [currentQuestion, questionStartTime, combo, fastAnswers, earnedBadges, currentIndex, questions.length, addXP, triggerConfetti, answers, totalXP, startTime, onComplete]);

  // Start playing
  const handleStart = () => {
    setPhase('playing');
    setQuestionStartTime(Date.now());
    triggerConfetti('small');
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4", styles.bg)}>
      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-lg w-full"
          >
            <div className={cn("rounded-3xl p-8 shadow-2xl border", styles.card)}>
              {/* Animated Icon */}
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                  styles.accent
                )}>
                  <Rocket className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
              <p className="text-muted-foreground text-center mb-8">{subtitle}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">XP & Níveis</p>
                    <p className="text-xs text-muted-foreground">Ganhe pontos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Combos</p>
                    <p className="text-xs text-muted-foreground">Multiplique!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Conquistas</p>
                    <p className="text-xs text-muted-foreground">Desbloqueie</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Speed Bonus</p>
                    <p className="text-xs text-muted-foreground">Seja rápido</p>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="flex items-center justify-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span>{questions.length} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>~5 minutos</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className={cn("w-full gap-2 text-lg h-14 bg-gradient-to-r", styles.accent)}
                onClick={handleStart}
              >
                <Sparkles className="h-5 w-5" />
                Começar Jornada
                <ChevronRight className="h-5 w-5" />
              </Button>

              {onExit && (
                <Button variant="ghost" className="w-full mt-2" onClick={onExit}>
                  Voltar
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* PLAYING PHASE */}
        {phase === 'playing' && currentQuestion && (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl w-full"
          >
            {/* HUD */}
            <div className="mb-6">
              {/* Progress Bar */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <Progress value={progress} className="h-3" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                {/* XP */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-yellow-600">{totalXP} XP</span>
                </div>

                {/* Combo */}
                {combo.count >= 2 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
                  >
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-orange-600">
                      x{combo.multiplier.toFixed(1)} Combo!
                    </span>
                  </motion.div>
                )}

                {/* Level */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">Nível {level}</span>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className={cn("rounded-3xl p-8 shadow-2xl border", styles.card)}>
              {/* Category Badge */}
              <Badge variant="outline" className="mb-4">
                {currentQuestion.category}
              </Badge>

              {/* Question Text */}
              <h2 className="text-2xl font-bold mb-8">{currentQuestion.text}</h2>

              {/* Options based on question type */}
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={(e) => handleAnswer(currentQuestion.id, option.id, e)}
                      className={cn(
                        "w-full p-5 text-left rounded-2xl border-2 transition-all",
                        "hover:border-primary hover:bg-primary/5 hover:scale-[1.02]",
                        "active:scale-[0.98]",
                        "flex items-center gap-4"
                      )}
                    >
                      {option.emoji && (
                        <span className="text-3xl">{option.emoji}</span>
                      )}
                      <span className="text-lg">{option.text}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'swipe' && currentQuestion.options && (
                <div className="flex gap-4 justify-center">
                  {currentQuestion.options.slice(0, 2).map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={(e) => handleAnswer(currentQuestion.id, option.id, e)}
                      className={cn(
                        "flex-1 p-8 rounded-3xl border-2 transition-all",
                        "hover:scale-105 active:scale-95",
                        index === 0 
                          ? "hover:border-red-500 hover:bg-red-500/10" 
                          : "hover:border-green-500 hover:bg-green-500/10"
                      )}
                    >
                      <div className="text-center">
                        <span className="text-5xl mb-4 block">{option.emoji}</span>
                        <span className="text-lg font-medium">{option.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: value * 0.05 }}
                      onClick={(e) => handleAnswer(currentQuestion.id, value, e)}
                      className={cn(
                        "w-16 h-16 rounded-2xl border-2 transition-all",
                        "hover:border-primary hover:bg-primary/10 hover:scale-110",
                        "active:scale-95",
                        "flex items-center justify-center text-2xl font-bold"
                      )}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* XP Reward indicator */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>+{currentQuestion.xpReward} XP base</span>
                  {combo.multiplier > 1 && (
                    <span className="text-orange-500">
                      (x{combo.multiplier.toFixed(1)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center"
          >
            <div className={cn("rounded-3xl p-8 shadow-2xl border", styles.card)}>
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Crown className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold mb-2">Incrível! 🎉</h1>
              <p className="text-muted-foreground mb-8">Você completou a avaliação!</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{totalXP}</p>
                  <p className="text-sm text-muted-foreground">XP Ganho</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">x{combo.multiplier.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Combo Máximo</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{fastAnswers}</p>
                  <p className="text-sm text-muted-foreground">Respostas Rápidas</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{earnedBadges.length}</p>
                  <p className="text-sm text-muted-foreground">Conquistas</p>
                </div>
              </div>

              {/* Badges earned */}
              {earnedBadges.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">Conquistas Desbloqueadas:</p>
                  <div className="flex justify-center gap-2">
                    {earnedBadges.map(badge => (
                      <Badge key={badge} variant="outline" className="px-3 py-1">
                        🏆 {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button size="lg" className="w-full" onClick={onExit}>
                Continuar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating XP Animation */}
      <AnimatePresence>
        {showXPGain && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              left: showXPGain.x - 30, 
              top: showXPGain.y - 20,
              pointerEvents: 'none'
            }}
            className="text-yellow-500 font-bold text-xl z-50"
          >
            +{showXPGain.amount} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

GamifiedAssessmentEngine.displayName = 'GamifiedAssessmentEngine';
