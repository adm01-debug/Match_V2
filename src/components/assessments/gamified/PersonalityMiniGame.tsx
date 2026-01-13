/**
 * @fileoverview Mini-games de Personalidade
 * Jogos rápidos e divertidos para revelar traços de personalidade
 */

import { useState, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Timer, 
  Brain, 
  Star, 
  Trophy,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

export type MiniGameType = 'quick-choice' | 'word-association' | 'scenario-pick' | 'this-or-that' | 'priority-sort';

interface MiniGameQuestion {
  id: string;
  type: MiniGameType;
  prompt: string;
  options: { id: string; text: string; emoji?: string; trait?: string }[];
  timeLimit?: number;
  xpReward: number;
}

interface PersonalityMiniGameProps {
  games: MiniGameQuestion[];
  onComplete: (results: MiniGameResult[], totalXP: number) => void;
  onExit?: () => void;
}

interface MiniGameResult {
  gameId: string;
  selectedOption: string;
  responseTime: number;
  earnedXP: number;
  trait?: string;
}

const QUICK_TIME_BONUS = 5; // XP bonus por resposta rápida

export const PersonalityMiniGame = memo(function PersonalityMiniGame({
  games,
  onComplete,
  onExit,
}: PersonalityMiniGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'feedback' | 'complete'>('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [showXP, setShowXP] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const currentGame = games[currentIndex];
  const progress = (currentIndex / games.length) * 100;

  // Timer effect
  useEffect(() => {
    if (phase !== 'playing' || !currentGame?.timeLimit) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          // Auto-select first option on timeout
          handleSelect(currentGame.options[0]?.id || '');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentGame]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setQuestionStart(Date.now());
    setTimeLeft(currentGame?.timeLimit || 10);
  }, [currentGame]);

  const handleSelect = useCallback((optionId: string) => {
    if (phase !== 'playing' || !currentGame) return;

    const responseTime = Date.now() - questionStart;
    const isQuick = responseTime < 2000;
    const option = currentGame.options.find(o => o.id === optionId);
    
    // Calculate XP
    let earnedXP = currentGame.xpReward;
    if (isQuick) {
      earnedXP += QUICK_TIME_BONUS;
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Streak bonus
    if (streak >= 3) {
      earnedXP = Math.round(earnedXP * 1.5);
    }

    // Show XP animation
    setShowXP(earnedXP);
    setTimeout(() => setShowXP(null), 1000);

    // Confetti for quick answers or streaks
    if (isQuick && streak >= 2) {
      confetti({
        particleCount: 50,
        spread: 70,
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        origin: { y: 0.6 }
      });
    }

    // Record result
    const result: MiniGameResult = {
      gameId: currentGame.id,
      selectedOption: optionId,
      responseTime,
      earnedXP,
      trait: option?.trait,
    };

    setResults(prev => [...prev, result]);
    setTotalXP(prev => prev + earnedXP);
    setPhase('feedback');

    // Move to next
    setTimeout(() => {
      if (currentIndex < games.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setPhase('playing');
        setQuestionStart(Date.now());
        setTimeLeft(games[currentIndex + 1]?.timeLimit || 10);
      } else {
        setPhase('complete');
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 }
        });
        onComplete(results, totalXP + earnedXP);
      }
    }, 1000);
  }, [phase, currentGame, questionStart, streak, currentIndex, games, results, totalXP, onComplete]);

  // Game type renderers
  const renderQuickChoice = () => (
    <div className="grid grid-cols-2 gap-4">
      {currentGame?.options.map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleSelect(option.id)}
          className={cn(
            "p-6 rounded-2xl border-2 transition-all",
            "hover:scale-105 hover:border-primary active:scale-95",
            "flex flex-col items-center gap-3"
          )}
        >
          {option.emoji && <span className="text-4xl">{option.emoji}</span>}
          <span className="font-medium text-center">{option.text}</span>
        </motion.button>
      ))}
    </div>
  );

  const renderThisOrThat = () => (
    <div className="flex gap-4">
      {currentGame?.options.slice(0, 2).map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => handleSelect(option.id)}
          className={cn(
            "flex-1 p-8 rounded-3xl border-2 transition-all",
            "hover:scale-105 active:scale-95",
            index === 0 
              ? "hover:border-pink-500 hover:bg-pink-500/10" 
              : "hover:border-blue-500 hover:bg-blue-500/10"
          )}
        >
          <div className="text-center">
            {option.emoji && <span className="text-6xl block mb-4">{option.emoji}</span>}
            <span className="text-xl font-bold">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderWordAssociation = () => (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Escolha a primeira palavra que vier à mente:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {currentGame?.options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(option.id)}
            className={cn(
              "px-6 py-3 rounded-full border-2 transition-all",
              "hover:scale-110 hover:border-primary active:scale-95",
              "font-medium"
            )}
          >
            {option.emoji && <span className="mr-2">{option.emoji}</span>}
            {option.text}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {/* READY PHASE */}
        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Brain className="h-12 w-12 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2">Mini-Games de Personalidade</h2>
            <p className="text-muted-foreground mb-6">
              {games.length} desafios rápidos para descobrir seu perfil
            </p>

            <div className="flex items-center justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Responda rápido = mais XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                <span>Combos multiplicam</span>
              </div>
            </div>

            <Button size="lg" className="gap-2" onClick={startGame}>
              <Zap className="h-5 w-5" />
              Iniciar!
            </Button>

            {onExit && (
              <Button variant="ghost" className="mt-2 w-full" onClick={onExit}>
                Voltar
              </Button>
            )}
          </motion.div>
        )}

        {/* PLAYING PHASE */}
        {phase === 'playing' && currentGame && (
          <motion.div
            key={`game-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-xl"
          >
            {/* HUD */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-yellow-600">{totalXP} XP</span>
                  </div>
                  {streak >= 2 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20"
                    >
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-bold text-orange-600">x{streak}</span>
                    </motion.div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1}/{games.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Timer */}
            {currentGame.timeLimit && (
              <motion.div 
                className={cn(
                  "flex items-center justify-center gap-2 mb-6 text-2xl font-mono font-bold",
                  timeLeft <= 3 ? "text-red-500" : "text-foreground"
                )}
                animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
              >
                <Timer className="h-6 w-6" />
                {timeLeft}s
              </motion.div>
            )}

            {/* Question */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl border p-8 mb-6">
              <h3 className="text-2xl font-bold text-center mb-8">
                {currentGame.prompt}
              </h3>

              {/* Render based on game type */}
              {currentGame.type === 'quick-choice' && renderQuickChoice()}
              {currentGame.type === 'this-or-that' && renderThisOrThat()}
              {currentGame.type === 'word-association' && renderWordAssociation()}
              {(currentGame.type === 'scenario-pick' || currentGame.type === 'priority-sort') && renderQuickChoice()}
            </div>

            {/* XP Reward hint */}
            <div className="text-center text-sm text-muted-foreground">
              <Sparkles className="inline h-4 w-4 mr-1 text-yellow-500" />
              +{currentGame.xpReward} XP por resposta
            </div>
          </motion.div>
        )}

        {/* FEEDBACK PHASE */}
        {phase === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            {showXP && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-yellow-500"
              >
                +{showXP} XP!
              </motion.p>
            )}
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
            >
              <Trophy className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-2">Fantástico! 🎉</h2>
            <p className="text-muted-foreground mb-8">
              Você completou todos os mini-games
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalXP}</p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{games.length}</p>
                <p className="text-sm text-muted-foreground">Desafios</p>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={onExit}>
              Ver Resultados <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating XP */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-500 pointer-events-none z-50"
          >
            +{showXP}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PersonalityMiniGame.displayName = 'PersonalityMiniGame';
