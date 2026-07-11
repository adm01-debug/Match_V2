/**
 * @fileoverview Renderizador de questões comportamentais (scale/forced_choice/situational/ranking).
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import type { BehavioralQuestion, BehavioralTool } from '@/types/behavioral';

interface BehavioralQuestionRendererProps {
  question: BehavioralQuestion;
  tool: BehavioralTool;
  currentAnswer: number | string | undefined;
  onAnswer: (value: string | number) => void;
}

export function BehavioralQuestionRenderer({
  question,
  tool,
  currentAnswer,
  onAnswer,
}: BehavioralQuestionRendererProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="min-h-[350px]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-medium">{question.text}</CardTitle>
            <Badge
              variant="outline"
              className="shrink-0"
              style={{ borderColor: tool.color, color: tool.color }}
            >
              {question.dimension.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {question.type === 'scale' && (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{question.scaleLabels?.min || 'Discordo'}</span>
                <span>{question.scaleLabels?.max || 'Concordo'}</span>
              </div>
              <Slider
                value={[Number(currentAnswer) || 3]}
                onValueChange={(values) => onAnswer(values[0] ?? 3)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-2xl font-bold">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => onAnswer(n)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      Number(currentAnswer) === n ? 'text-white scale-110' : 'bg-muted hover:bg-muted/80'
                    }`}
                    style={Number(currentAnswer) === n ? { backgroundColor: tool.color } : {}}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(question.type === 'forced_choice' || question.type === 'situational') && (
            <RadioGroup
              value={String(currentAnswer ?? '')}
              onValueChange={(val) => onAnswer(Number(val))}
              className="space-y-3"
            >
              {(question.options || []).map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    currentAnswer === idx ? 'bg-primary/5' : 'hover:border-muted-foreground/50'
                  }`}
                  style={currentAnswer === idx ? { borderColor: tool.color } : {}}
                  onClick={() => onAnswer(idx)}
                >
                  <RadioGroupItem value={String(idx)} id={`opt-${idx}`} className="mt-0.5" />
                  <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'ranking' && (
            <RadioGroup
              value={String(currentAnswer ?? '')}
              onValueChange={(val) => onAnswer(Number(val))}
              className="space-y-3"
            >
              {(question.options || []).map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    currentAnswer === idx ? 'bg-primary/5' : 'hover:border-muted-foreground/50'
                  }`}
                  style={currentAnswer === idx ? { borderColor: tool.color } : {}}
                  onClick={() => onAnswer(idx)}
                >
                  <RadioGroupItem value={String(idx)} id={`rank-${idx}`} />
                  <Label htmlFor={`rank-${idx}`} className="flex-1 cursor-pointer font-medium">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
