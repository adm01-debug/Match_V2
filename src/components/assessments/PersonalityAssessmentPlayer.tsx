/**
 * @module PersonalityAssessmentPlayer
 * @description Player completo para testes de personalidade (Big Five, MBTI, Eneagrama)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
import { logger } from '@/services/logger';
  usePersonalityAssessment, 
  type PersonalityFramework 
} from '@/hooks/usePersonalityAssessment';
import { 
  Brain, 
  Users, 
  Compass,
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonalityResultsView } from './PersonalityResultsView';
import type { PersonalityAssessment } from '@/types/personality';

interface PersonalityAssessmentPlayerProps {
  candidatoId?: string;
  processoId?: string;
  frameworks?: PersonalityFramework[];
  onComplete?: (results: PersonalityAssessment) => void;
  onCancel?: () => void;
}

const FRAMEWORK_INFO = {
  bigfive: {
    icon: Brain,
    label: 'Big Five (OCEAN)',
    description: 'Abertura, Conscienciosidade, Extroversão, Amabilidade, Neuroticismo',
    color: 'text-blue-500',
  },
  mbti: {
    icon: Users,
    label: 'MBTI (16 Tipos)',
    description: 'Descubra seu tipo de personalidade entre os 16 tipos',
    color: 'text-purple-500',
  },
  enneagram: {
    icon: Compass,
    label: 'Eneagrama (9 Tipos)',
    description: 'Identifique seu tipo central, asas e padrões de integração',
    color: 'text-amber-500',
  },
};

export function PersonalityAssessmentPlayer({
  candidatoId,
  processoId,
  frameworks = ['all'],
  onComplete,
  onCancel,
}: PersonalityAssessmentPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<PersonalityAssessment | null>(null);
  const [answerStartTime, setAnswerStartTime] = useState(Date.now());

  const assessment = usePersonalityAssessment({
    candidatoId,
    processoId,
    frameworks,
  });

  const {
    currentFramework,
    currentQuestionIndex,
    currentQuestion,
    currentQuestions,
    answers,
    progressPercent,
    totalAnswered,
    totalQuestionsAll,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    isLastQuestion,
    submit,
    isSubmitting,
    setCurrentFramework,
  } = assessment;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const frameworkInfo = FRAMEWORK_INFO[currentFramework];
  const FrameworkIcon = frameworkInfo.icon;

  const handleAnswer = (value: number) => {
    const responseTime = Date.now() - answerStartTime;
    answerQuestion(value, responseTime);
    setAnswerStartTime(Date.now());
  };

  const handleNext = () => {
    if (!currentAnswer) {
      toast.error('Por favor, selecione uma resposta');
      return;
    }
    nextQuestion();
    setAnswerStartTime(Date.now());
  };

  const handleSubmit = async () => {
    if (!currentAnswer) {
      toast.error('Por favor, selecione uma resposta');
      return;
    }

    try {
      const result = await submit();
      setResults(result);
      setIsCompleted(true);
      toast.success('Teste de personalidade concluído!');
      onComplete?.(result);
    } catch (error) {
      logger.error('Erro ao submeter:', error);
      toast.error('Erro ao finalizar o teste');
    }
  };

  if (isCompleted && results) {
    return (
      <PersonalityResultsView 
        results={results} 
        onClose={() => onCancel?.()} 
      />
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <p className="text-muted-foreground">Nenhuma questão disponível</p>
        </CardContent>
      </Card>
    );
  }

  const activeFrameworks = frameworks.includes('all') 
    ? ['bigfive', 'mbti', 'enneagram'] as const
    : frameworks.filter(f => f !== 'all') as ('bigfive' | 'mbti' | 'enneagram')[];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header com Progresso */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${frameworkInfo.color}`}>
                <FrameworkIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{frameworkInfo.label}</CardTitle>
                <CardDescription>{frameworkInfo.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {currentQuestionIndex + 1}/{currentQuestions.length}
              </Badge>
              <Badge variant="secondary">
                {totalAnswered}/{totalQuestionsAll} total
              </Badge>
            </div>
          </div>

          {/* Tabs de Framework */}
          {activeFrameworks.length > 1 && (
            <Tabs 
              value={currentFramework} 
              onValueChange={(v) => setCurrentFramework(v as typeof currentFramework)}
              className="mt-4"
            >
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${activeFrameworks.length}, 1fr)` }}>
                {activeFrameworks.map((fw) => {
                  const info = FRAMEWORK_INFO[fw];
                  const Icon = info.icon;
                  const fwQuestions = assessment.getQuestionsForFramework(fw);
                  const fwAnswered = answers.filter(a => 
                    fwQuestions.some(q => q.id === a.questionId)
                  ).length;
                  const isComplete = fwAnswered === fwQuestions.length;

                  return (
                    <TabsTrigger key={fw} value={fw} className="gap-2">
                      <Icon className={`h-4 w-4 ${info.color}`} />
                      <span className="hidden sm:inline">{fw.toUpperCase()}</span>
                      {isComplete && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          )}

          <Progress value={progressPercent} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Questão Atual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentFramework}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="min-h-[350px]">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="shrink-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {currentQuestion.dimension || 'Geral'}
                </Badge>
              </div>
              <CardTitle className="text-xl font-medium mt-4">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Opções de Resposta */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      currentAnswer?.value === option.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'hover:border-muted-foreground/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        currentAnswer?.value === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        {option.value}
                      </div>
                      <span className="flex-1">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentQuestionIndex === 0 && currentFramework === activeFrameworks[0] ? onCancel : prevQuestion}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentQuestionIndex === 0 && currentFramework === activeFrameworks[0] ? 'Cancelar' : 'Anterior'}
        </Button>

        {/* Indicadores de Progresso do Framework Atual */}
        <div className="hidden md:flex gap-1 max-w-[300px] overflow-hidden">
          {currentQuestions.slice(
            Math.max(0, currentQuestionIndex - 3),
            Math.min(currentQuestions.length, currentQuestionIndex + 4)
          ).map((_, idx) => {
            const actualIdx = idx + Math.max(0, currentQuestionIndex - 3);
            const q = currentQuestions[actualIdx];
            const isAnswered = q && answers.some(a => a.questionId === q.id);
            
            return (
              <button
                key={actualIdx}
                onClick={() => assessment.setCurrentQuestionIndex(actualIdx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  actualIdx === currentQuestionIndex
                    ? 'bg-primary scale-150'
                    : isAnswered
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            );
          })}
        </div>

        {isLastQuestion() ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? 'Processando...' : 'Finalizar'}
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2">
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
