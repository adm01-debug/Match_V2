/**
 * @fileoverview Desafios por Fases - Jornada gamificada em etapas
 * Cada fase representa um desafio diferente com progressão
 */

import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Lock, CheckCircle2, Star, 
  Trophy, Zap, Target, Brain, Heart,
  Sparkles, Award, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export interface ChallengePhase {
  id: string;
  title: string;
  description: string;
  icon: 'brain' | 'heart' | 'target' | 'zap' | 'star';
  difficulty: 'facil' | 'medio' | 'dificil' | 'expert';
  xpReward: number;
  questions: PhaseQuestion[];
  unlockRequirement?: number; // Previous phase score needed
}

export interface PhaseQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect?: boolean; trait?: string }[];
  timeLimit?: number;
}

interface PhaseChallengeProps {
  phases: ChallengePhase[];
  onComplete: (results: PhaseResult[]) => void;
  onExit?: () => void;
}

export interface PhaseResult {
  phaseId: string;
  score: number;
  xpEarned: number;
  timeSpent: number;
  answers: { questionId: string; answerId: string }[];
}

const iconMap = {
  brain: Brain,
  heart: Heart,
  target: Target,
  zap: Zap,
  star: Star,
};

const difficultyColors = {
  facil: 'bg-green-500',
  medio: 'bg-yellow-500',
  dificil: 'bg-orange-500',
  expert: 'bg-red-500',
};

const difficultyLabels = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
  expert: 'Expert',
};

export const PhaseChallenge = memo(function PhaseChallenge({
  phases,
  onComplete,
  onExit,
}: PhaseChallengeProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseResults, setPhaseResults] = useState<PhaseResult[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<{ questionId: string; answerId: string }[]>([]);
  const [phaseStartTime, setPhaseStartTime] = useState<number>(0);
  const [showPhaseComplete, setShowPhaseComplete] = useState(false);
  const [lastPhaseResult, setLastPhaseResult] = useState<PhaseResult | null>(null);

  const currentPhase = currentPhaseIndex !== null ? phases[currentPhaseIndex] : null;
  const currentQuestion = currentPhase?.questions[currentQuestionIndex];
  const completedPhases = phaseResults.map(r => r.phaseId);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const isPhaseUnlocked = useCallback((phase: ChallengePhase, index: number) => {
    if (index === 0) return true;
    if (!phase.unlockRequirement) return true;
    
    const prevResult = phaseResults.find(r => r.phaseId === phases[index - 1]?.id);
    return prevResult ? prevResult.score >= phase.unlockRequirement : false;
  }, [phaseResults, phases]);

  const startPhase = useCallback((phaseIndex: number) => {
    setCurrentPhaseIndex(phaseIndex);
    setCurrentQuestionIndex(0);
    setCurrentAnswers([]);
    setPhaseStartTime(Date.now());
  }, []);

  const handleAnswer = useCallback((answerId: string) => {
    if (!currentPhase || !currentQuestion) return;

    // Include current answer in the new answers array
    const newAnswers = [...currentAnswers, { questionId: currentQuestion.id, answerId }];
    setCurrentAnswers(newAnswers);

    if (currentQuestionIndex < currentPhase.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Phase complete - calculate score with all answers including current
      const timeSpent = Math.floor((Date.now() - phaseStartTime) / 1000);
      
      // Count correct answers from all answers including current
      const correctAnswers = newAnswers.filter((answer, idx) => {
        const question = currentPhase.questions[idx];
        const selectedOption = question?.options.find(o => o.id === answer.answerId);
        return selectedOption?.isCorrect;
      }).length;
      
      const score = Math.round((correctAnswers / currentPhase.questions.length) * 100);
      const xpEarned = Math.round((score / 100) * currentPhase.xpReward);

      const result: PhaseResult = {
        phaseId: currentPhase.id,
        score,
        xpEarned,
        timeSpent,
        answers: newAnswers,
      };

      setLastPhaseResult(result);
      setPhaseResults(prev => [...prev, result]);
      setShowPhaseComplete(true);
      triggerConfetti();
    }
  }, [currentPhase, currentQuestion, currentQuestionIndex, currentAnswers, phaseStartTime, triggerConfetti]);

  const handlePhaseCompleteClose = useCallback(() => {
    setShowPhaseComplete(false);
    setCurrentPhaseIndex(null);
    setLastPhaseResult(null);

    // Check if all phases complete - need to account for the result we just added
    if (phaseResults.length >= phases.length) {
      onComplete(phaseResults);
    }
  }, [phaseResults, phases.length, onComplete]);

  const totalXP = phaseResults.reduce((sum, r) => sum + r.xpEarned, 0);
  const progress = (completedPhases.length / phases.length) * 100;

  // Phase Selection View
  if (currentPhaseIndex === null) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto"
          >
            <Award className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold">Desafio por Fases</h2>
          <p className="text-muted-foreground">Complete todas as fases para dominar o assessment</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">{completedPhases.length}/{phases.length} fases</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>XP Total: {totalXP}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="space-y-3">
          {phases.map((phase, index) => {
            const Icon = iconMap[phase.icon];
            const isCompleted = completedPhases.includes(phase.id);
            const isUnlocked = isPhaseUnlocked(phase, index);
            const result = phaseResults.find(r => r.phaseId === phase.id);

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-xl border-2 p-4 transition-all",
                  isCompleted && "border-green-500 bg-green-500/5",
                  !isCompleted && isUnlocked && "border-primary/50 hover:border-primary hover:shadow-lg cursor-pointer",
                  !isUnlocked && "border-muted opacity-60"
                )}
                onClick={() => isUnlocked && !isCompleted && startPhase(index)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isCompleted && "bg-green-500 text-white",
                    !isCompleted && isUnlocked && "bg-primary/10 text-primary",
                    !isUnlocked && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : !isUnlocked ? (
                      <Lock className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{phase.title}</h3>
                      <Badge className={cn("text-xs text-white", difficultyColors[phase.difficulty])}>
                        {difficultyLabels[phase.difficulty]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    
                    {result && (
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-4 w-4" />
                          {result.score}%
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Sparkles className="h-4 w-4" />
                          +{result.xpEarned} XP
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reward */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{phase.xpReward}</div>
                    <div className="text-xs text-muted-foreground">XP máximo</div>
                  </div>

                  {/* Arrow */}
                  {isUnlocked && !isCompleted && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exit Button */}
        {onExit && (
          <Button variant="outline" className="w-full" onClick={onExit}>
            Voltar
          </Button>
        )}
      </div>
    );
  }

  // Phase Complete Modal
  if (showPhaseComplete && lastPhaseResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-card rounded-2xl border shadow-elevated p-8 max-w-md w-full text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Fase Completa!</h2>
            <p className="text-muted-foreground">{currentPhase?.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{lastPhaseResult.score}%</div>
              <div className="text-xs text-muted-foreground">Precisão</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <div className="text-2xl font-bold text-yellow-600">+{lastPhaseResult.xpEarned}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-600">{lastPhaseResult.timeSpent}s</div>
              <div className="text-xs text-muted-foreground">Tempo</div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handlePhaseCompleteClose}>
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Question View
  if (currentPhase && currentQuestion) {
    const questionProgress = ((currentQuestionIndex + 1) / currentPhase.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPhaseIndex(null)}>
            ← Voltar
          </Button>
          <Badge variant="outline">{currentPhase.title}</Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pergunta {currentQuestionIndex + 1} de {currentPhase.questions.length}</span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {currentPhase.xpReward} XP
            </span>
          </div>
          <Progress value={questionProgress} className="h-2" />
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-center py-4">
            {currentQuestion.text}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option.id)}
                className="w-full p-4 rounded-xl border-2 text-left hover:border-primary hover:bg-primary/5 transition-all"
              >
                <span className="font-medium">{option.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
});

PhaseChallenge.displayName = 'PhaseChallenge';
