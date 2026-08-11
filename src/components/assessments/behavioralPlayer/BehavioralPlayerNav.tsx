/**
 * @fileoverview Navegação do Player Comportamental (anterior / dots / próxima|finalizar).
 */

import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BehavioralQuestion, BehavioralTool } from '@/types/behavioral';

interface BehavioralPlayerNavProps {
  tool: BehavioralTool;
  questions: BehavioralQuestion[];
  answers: Record<string, number | string>;
  currentIndex: number;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onJump: (index: number) => void;
}

export function BehavioralPlayerNav({
  tool,
  questions,
  answers,
  currentIndex,
  isLastQuestion,
  isSubmitting,
  onCancel,
  onPrev,
  onNext,
  onSubmit,
  onJump,
}: BehavioralPlayerNavProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={currentIndex === 0 ? onCancel : onPrev}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {currentIndex === 0 ? 'Cancelar' : 'Anterior'}
      </Button>

      <div className="flex gap-1.5 flex-wrap justify-center max-w-md">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isActive = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onJump(idx)}
              aria-label={`Ir para questão ${idx + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isActive ? 'scale-125' : isAnswered ? 'opacity-60' : 'bg-muted'
              }`}
              style={
                isActive || isAnswered ? { backgroundColor: tool.color } : {}
              }
            />
          );
        })}
      </div>

      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-2"
          style={{ backgroundColor: tool.color }}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isSubmitting ? 'Processando...' : 'Finalizar'}
        </Button>
      ) : (
        <Button onClick={onNext} className="gap-2" style={{ backgroundColor: tool.color }}>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
