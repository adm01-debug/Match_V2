/**
 * @module BehavioralAssessmentPlayer
 * @description Player universal para todas as 10 ferramentas comportamentais
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Brain,
  Eye,
  Lightbulb,
  Zap,
  MessageSquare,
  Heart,
  Target,
  Sparkles,
  AlertTriangle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import type { BehavioralTool, BehavioralQuestion, BehavioralResult } from '@/types/behavioral';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import { getQuestionsForTool } from '@/data/behavioralAssessmentsData';

interface BehavioralAssessmentPlayerProps {
  toolId: string;
  candidatoId?: string;
  onComplete: (result: BehavioralResult) => void;
  onCancel: () => void;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  // Ferramentas originais (10)
  disc: <Brain className="h-6 w-6" />,
  vakd: <Eye className="h-6 w-6" />,
  metaprograms: <Lightbulb className="h-6 w-6" />,
  mental_triggers: <Zap className="h-6 w-6" />,
  sleight_of_mouth: <MessageSquare className="h-6 w-6" />,
  emotional_states: <Heart className="h-6 w-6" />,
  values: <Target className="h-6 w-6" />,
  emotional_intelligence: <Sparkles className="h-6 w-6" />,
  cognitive_biases: <AlertTriangle className="h-6 w-6" />,
  rapport: <Users className="h-6 w-6" />,
  // Ferramentas avançadas (4)
  generational: <Users className="h-6 w-6" />,
  stress_profile: <Zap className="h-6 w-6" />,
  triune_brain: <Brain className="h-6 w-6" />,
  disc_compatibility: <Users className="h-6 w-6" />,
};

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value: string | number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): BehavioralResult => {
    // Verificar se é uma ferramenta avançada que requer cálculo especializado
    const advancedTools = ['generational', 'stress_profile', 'triune_brain'];
    
    if (advancedTools.includes(toolId)) {
      return calculateAdvancedResults();
    }
    
    // Cálculo padrão para ferramentas originais
    const scores: Record<string, number> = {};
    const dimensionCounts: Record<string, number> = {};

    // Calculate scores per dimension
    questions.forEach((q: BehavioralQuestion) => {
      const answer = answers[q.id];
      if (answer === undefined) return;

      const dimension = q.dimension;
      if (!scores[dimension]) {
        scores[dimension] = 0;
        dimensionCounts[dimension] = 0;
      }

      if (q.type === 'scale') {
        scores[dimension] = (scores[dimension] || 0) + Number(answer);
        dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1;
      } else if (q.type === 'forced_choice' || q.type === 'situational') {
        const selectedOption = q.options?.[Number(answer)];
        if (selectedOption) {
          const optDim = selectedOption.dimension;
          scores[optDim] = (scores[optDim] || 0) + selectedOption.score;
          dimensionCounts[optDim] = (dimensionCounts[optDim] || 0) + 1;
        }
      }
    });

    // Calculate percentages with improved normalization
    const percentages: Record<string, number> = {};
    
    Object.keys(scores).forEach(dim => {
      const count = dimensionCounts[dim] || 1;
      // Normalização melhorada: considera score máximo de 4 por questão forced_choice
      const maxPossible = count * 4;
      percentages[dim] = Math.round(((scores[dim] || 0) / Math.max(maxPossible, 1)) * 100);
    });

    // Determine primary and secondary profiles
    const sortedDimensions = Object.entries(percentages)
      .sort(([, a], [, b]) => b - a);
    
    const primary = sortedDimensions[0]?.[0] || '';
    const secondary = sortedDimensions[1]?.[0] || '';

    // Calcular confiança baseada na diferença entre primeiro e segundo
    const primaryScore = sortedDimensions[0]?.[1] || 0;
    const secondaryScore = sortedDimensions[1]?.[1] || 0;
    const confidence = Math.min(100, Math.round((primaryScore - secondaryScore) + 50));

    return {
      toolId,
      candidatoId,
      completedAt: new Date().toISOString(),
      timeSpent: timeElapsed,
      scores: percentages,
      primaryProfile: primary,
      secondaryProfile: secondary,
      rawAnswers: answers,
      confidence,
    };
  };

  // Cálculo especializado para ferramentas avançadas
  const calculateAdvancedResults = (): BehavioralResult => {
    const baseResult: BehavioralResult = {
      toolId,
      candidatoId,
      completedAt: new Date().toISOString(),
      timeSpent: timeElapsed,
      scores: {},
      primaryProfile: '',
      rawAnswers: answers,
    };

    if (toolId === 'generational') {
      // Inteligência Geracional
      const genScores: Record<string, number> = {
        silent: 0, baby_boomer: 0, gen_x: 0, millennial: 0, gen_z: 0, gen_alpha: 0,
      };

      Object.entries(answers).forEach(([, answerIndex]) => {
        if (typeof answerIndex !== 'number') return;
        const genMap = ['baby_boomer', 'gen_x', 'millennial', 'gen_z'];
        const selectedGen = genMap[answerIndex];
        if (selectedGen) genScores[selectedGen] = (genScores[selectedGen] || 0) + 4;
      });

      const maxScore = Object.keys(answers).length * 4;
      const normalized: Record<string, number> = {};
      Object.entries(genScores).forEach(([gen, score]) => {
        normalized[gen] = Math.round((score / Math.max(maxScore, 1)) * 100);
      });

      const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
      return {
        ...baseResult,
        scores: normalized,
        primaryProfile: sorted[0]?.[0] || 'millennial',
        secondaryProfile: sorted[1]?.[0],
        confidence: Math.min(100, (sorted[0]?.[1] || 0) - (sorted[1]?.[1] || 0) + 50),
      };
    }

    if (toolId === 'stress_profile') {
      // Perfil sob Stress
      const discScores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

      Object.entries(answers).forEach(([, answerIndex]) => {
        if (typeof answerIndex !== 'number') return;
        const profiles = ['D', 'I', 'S', 'C'];
        const selected = profiles[answerIndex];
        if (selected) discScores[selected] = (discScores[selected] || 0) + 4;
      });

      const maxScore = Object.keys(answers).length * 4;
      const normalized: Record<string, number> = {};
      Object.entries(discScores).forEach(([profile, score]) => {
        normalized[profile] = Math.round((score / Math.max(maxScore, 1)) * 100);
      });

      const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
      return {
        ...baseResult,
        scores: normalized,
        primaryProfile: sorted[0]?.[0] || 'S',
        secondaryProfile: sorted[1]?.[0],
      };
    }

    if (toolId === 'triune_brain') {
      // Modelo 3 Cérebros
      const brainScores: Record<string, number> = { reptiliano: 0, limbico: 0, neocortex: 0 };

      Object.entries(answers).forEach(([, answerIndex]) => {
        if (typeof answerIndex !== 'number') return;
        const brains = ['reptiliano', 'limbico', 'neocortex'];
        const selected = brains[answerIndex];
        if (selected) brainScores[selected] = (brainScores[selected] || 0) + 4;
      });

      const total = Object.values(brainScores).reduce((a, b) => a + b, 0);
      const normalized: Record<string, number> = {};
      Object.entries(brainScores).forEach(([brain, score]) => {
        normalized[brain] = Math.round((score / Math.max(total, 1)) * 100);
      });

      const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
      return {
        ...baseResult,
        scores: normalized,
        primaryProfile: sorted[0]?.[0] || 'limbico',
        secondaryProfile: sorted[1]?.[0],
      };
    }

    return baseResult;
  };

  const handleSubmit = async () => {
    const unansweredCount = questions.filter((q: BehavioralQuestion) => answers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      toast.error(`Você precisa responder ${unansweredCount} questões`);
      return;
    }

    setIsSubmitting(true);
    try {
      const results = calculateResults();
      toast.success(`${tool?.name} finalizado com sucesso!`);
      onComplete(results);
    } catch (error) {
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
      {/* Header */}
      <Card className="border-2" style={{ borderColor: tool.color }}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-xl text-white"
                style={{ backgroundColor: tool.color }}
              >
                {TOOL_ICONS[toolId]}
              </div>
              <div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeElapsed)}
              </Badge>
              <Badge variant="secondary">
                {currentIndex + 1} de {questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="min-h-[350px]">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl font-medium">
                    {currentQuestion.text}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className="shrink-0"
                    style={{ borderColor: tool.color, color: tool.color }}
                  >
                    {currentQuestion.dimension.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scale Type */}
                {currentQuestion.type === 'scale' && (
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{currentQuestion.scaleLabels?.min || 'Discordo'}</span>
                      <span>{currentQuestion.scaleLabels?.max || 'Concordo'}</span>
                    </div>
                    <Slider
                      value={[Number(currentAnswer) || 3]}
                      onValueChange={(values) => handleAnswer(values[0] ?? 3)}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-2xl font-bold">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => handleAnswer(n)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            Number(currentAnswer) === n
                              ? 'text-white scale-110'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                          style={Number(currentAnswer) === n ? { backgroundColor: tool.color } : {}}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Forced Choice / Situational */}
                {(currentQuestion.type === 'forced_choice' || currentQuestion.type === 'situational') && (
                  <RadioGroup
                    value={String(currentAnswer ?? '')}
                    onValueChange={(val) => handleAnswer(Number(val))}
                    className="space-y-3"
                  >
                    {(currentQuestion.options || []).map((option: { text: string; dimension: string; score: number }, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          currentAnswer === idx
                            ? 'bg-primary/5'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        style={currentAnswer === idx ? { borderColor: tool.color } : {}}
                        onClick={() => handleAnswer(idx)}
                      >
                        <RadioGroupItem value={String(idx)} id={`opt-${idx}`} className="mt-0.5" />
                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* Ranking Type (simplified to selection) */}
                {currentQuestion.type === 'ranking' && (
                  <RadioGroup
                    value={String(currentAnswer ?? '')}
                    onValueChange={(val) => handleAnswer(Number(val))}
                    className="space-y-3"
                  >
                    {(currentQuestion.options || []).map((option: { text: string; dimension: string; score: number }, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          currentAnswer === idx
                            ? 'bg-primary/5'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        style={currentAnswer === idx ? { borderColor: tool.color } : {}}
                        onClick={() => handleAnswer(idx)}
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
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentIndex === 0 ? onCancel : handlePrev}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentIndex === 0 ? 'Cancelar' : 'Anterior'}
        </Button>

        <div className="flex gap-1.5 flex-wrap justify-center max-w-md">
          {questions.map((q: BehavioralQuestion, idx: number) => {
            const qId = q.id;
            const isAnswered = answers[qId] !== undefined;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'scale-125'
                    : isAnswered
                    ? 'opacity-60'
                    : 'bg-muted'
                }`}
                style={
                  idx === currentIndex
                    ? { backgroundColor: tool.color }
                    : isAnswered
                    ? { backgroundColor: tool.color }
                    : {}
                }
              />
            );
          })}
        </div>

        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
            style={{ backgroundColor: tool.color }}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? 'Processando...' : 'Finalizar'}
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            className="gap-2"
            style={{ backgroundColor: tool.color }}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
