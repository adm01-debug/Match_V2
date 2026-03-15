/**
 * @module AssessmentPlayer
 * @description Player para execução de assessments comportamentais e culturais
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAssessment, useSubmitAssessment } from '@/hooks/useAssessments';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Brain,
  Target,
  Sparkles
} from 'lucide-react';
import type { AssessmentOpcao } from '@/types/selection';
import { toast } from 'sonner';

interface AssessmentPlayerProps {
  assessmentId: string;
  candidatoId: string;
  processoId?: string;
  onComplete: (resultados: unknown) => void;
  onCancel: () => void;
}

export function AssessmentPlayer({ 
  assessmentId, 
  candidatoId, 
  processoId,
  onComplete, 
  onCancel 
}: AssessmentPlayerProps) {
  const { data: assessment, isLoading } = useAssessment(assessmentId);
  const submitMutation = useSubmitAssessment();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const questoes = assessment?.questoes || [];
  const currentQuestao = questoes[currentIndex];
  const progress = questoes.length > 0 ? ((currentIndex + 1) / questoes.length) * 100 : 0;

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
    if (!currentQuestao) return;
    setRespostas(prev => ({ ...prev, [currentQuestao.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = questoes.filter(q => q.obrigatoria && !(q.id in respostas));
    if (unanswered.length > 0) {
      toast.error(`Você precisa responder ${unanswered.length} questões obrigatórias`);
      return;
    }

    try {
      const result = await submitMutation.mutateAsync({
        assessmentId,
        candidatoId,
        processoId,
        respostas,
        tempoGasto: timeElapsed,
      });
      toast.success('Assessment finalizado com sucesso!');
      onComplete(result.resultados);
    } catch (error) {
      toast.error('Erro ao enviar assessment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <p className="text-muted-foreground">Assessment não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  const isLastQuestion = currentIndex === questoes.length - 1;
  const currentAnswer = currentQuestao ? respostas[currentQuestao.id] : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {assessment.tipo === 'disc' && <Brain className="h-6 w-6 text-primary" />}
              {assessment.tipo === 'cultural' && <Target className="h-6 w-6 text-primary" />}
              <div>
                <CardTitle>{assessment.titulo}</CardTitle>
                <CardDescription>{assessment.descricao}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeElapsed)}
              </Badge>
              <Badge variant="secondary">
                {currentIndex + 1} de {questoes.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestao && (
          <motion.div
            key={currentQuestao.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="min-h-[300px]">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl font-medium">
                    {currentQuestao.texto}
                  </CardTitle>
                  {currentQuestao.obrigatoria && (
                    <Badge variant="destructive" className="shrink-0">
                      Obrigatória
                    </Badge>
                  )}
                </div>
                {currentQuestao.dimensao && (
                  <Badge variant="outline" className="w-fit">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {currentQuestao.dimensao}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Escala (1-5) */}
                {currentQuestao.tipo === 'escala' && (
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Discordo totalmente</span>
                      <span>Concordo totalmente</span>
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
                              ? 'bg-primary text-primary-foreground scale-110'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escolha Forçada / Múltipla */}
                {(currentQuestao.tipo === 'escolha_forcada' || currentQuestao.tipo === 'multipla') && (
                  <RadioGroup
                    value={currentAnswer !== undefined && currentAnswer !== null ? String(currentAnswer) : undefined}
                    onValueChange={(val) => handleAnswer(Number(val))}
                    className="space-y-3"
                  >
                    {(currentQuestao.opcoes || []).map((opcao: AssessmentOpcao, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                          currentAnswer === idx
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => handleAnswer(idx)}
                      >
                        <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">
                          {opcao.texto}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* Situacional */}
                {currentQuestao.tipo === 'situacional' && (
                  <RadioGroup
                    value={String(currentAnswer || '')}
                    onValueChange={(val) => handleAnswer(Number(val))}
                    className="space-y-3"
                  >
                    {(currentQuestao.opcoes || []).map((opcao: AssessmentOpcao, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                          currentAnswer === idx
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => handleAnswer(idx)}
                      >
                        <RadioGroupItem value={String(idx)} id={`sit-${idx}`} className="mt-1" />
                        <Label htmlFor={`sit-${idx}`} className="flex-1 cursor-pointer text-sm">
                          {opcao.texto}
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

        <div className="flex gap-2">
          {/* Question indicators */}
          {questoes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-primary scale-125'
                  : questoes[idx] && respostas[questoes[idx].id] !== undefined
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit} 
            disabled={submitMutation.isPending}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {submitMutation.isPending ? 'Enviando...' : 'Finalizar'}
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
