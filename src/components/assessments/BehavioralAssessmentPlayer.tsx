/**
 * @module BehavioralAssessmentPlayer
 * @description Player universal para todas as ferramentas comportamentais.
 * Orquestra header, renderizador de questões e navegação. Cálculos ficam em `behavioralScoring`.
 */

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { BehavioralQuestion, BehavioralResult, BehavioralTool } from '@/types/behavioral';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import { getQuestionsForTool } from '@/data/behavioralAssessmentsData';
import { calculateBehavioralResults } from '@/lib/behavioral/behavioralScoring';
import { TOOL_ICONS } from './behavioralPlayer/toolIcons';
import { BehavioralPlayerHeader } from './behavioralPlayer/BehavioralPlayerHeader';
import { BehavioralQuestionRenderer } from './behavioralPlayer/BehavioralQuestionRenderer';
import { BehavioralPlayerNav } from './behavioralPlayer/BehavioralPlayerNav';

interface BehavioralAssessmentPlayerProps {
  toolId: string;
  candidatoId?: string;
  onComplete: (result: BehavioralResult) => void;
  onCancel: () => void;
}

export function BehavioralAssessmentPlayer({
  toolId,
  candidatoId,
  onComplete,
  onCancel,
}: BehavioralAssessmentPlayerProps) {
  const tool = BEHAVIORAL_TOOLS.find((t: BehavioralTool) => t.id === toolId);
  const questions = useMemo(() => getQuestionsForTool(toolId), [toolId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswer = (value: string | number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const unansweredCount = questions.filter(
      (q: BehavioralQuestion) => answers[q.id] === undefined
    ).length;
    if (unansweredCount > 0) {
      toast.error(`Você precisa responder ${unansweredCount} questões`);
      return;
    }

    setIsSubmitting(true);
    try {
      const results = calculateBehavioralResults({
        toolId,
        candidatoId,
        timeElapsed,
        answers,
        questions,
      });
      toast.success(`${tool?.name} finalizado com sucesso!`);
      onComplete(results);
    } catch {
      toast.error('Erro ao processar resultados');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tool) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <p className="text-muted-foreground">Ferramenta não encontrada</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma questão disponível para esta ferramenta</p>
        </CardContent>
      </Card>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div className="space-y-6">
      <BehavioralPlayerHeader
        tool={tool}
        icon={TOOL_ICONS[toolId]}
        timeElapsed={timeElapsed}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        progress={progress}
      />

      <AnimatePresence mode="wait">
        {currentQuestion && (
          <BehavioralQuestionRenderer
            question={currentQuestion}
            tool={tool}
            currentAnswer={currentAnswer}
            onAnswer={handleAnswer}
          />
        )}
      </AnimatePresence>

      <BehavioralPlayerNav
        tool={tool}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onJump={setCurrentIndex}
      />
    </div>
  );
}
