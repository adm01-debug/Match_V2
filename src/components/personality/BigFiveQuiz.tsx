/**
 * @fileoverview Quiz interativo para avaliação Big Five (OCEAN)
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, Target, Users, Heart, Brain, 
  ArrowRight, ArrowLeft, CheckCircle2, RotateCcw,
  Timer, Info
} from 'lucide-react';
import { BIG_FIVE_INFO, type BigFiveTrait, type BigFiveResult } from '@/types/personality';
import { cn } from '@/lib/utils';

interface BigFiveQuestion {
  id: string;
  texto: string;
  dimensao: BigFiveTrait;
  invertida: boolean;
}

const QUESTIONS: BigFiveQuestion[] = [
  // Abertura (O)
  { id: 'o1', texto: 'Tenho uma imaginação vívida e ativa', dimensao: 'O', invertida: false },
  { id: 'o2', texto: 'Gosto de experimentar coisas novas e diferentes', dimensao: 'O', invertida: false },
  { id: 'o3', texto: 'Prefiro trabalhos que exigem criatividade', dimensao: 'O', invertida: false },
  { id: 'o4', texto: 'Aprecio arte, música e literatura', dimensao: 'O', invertida: false },
  { id: 'o5', texto: 'Estou sempre buscando aprender coisas novas', dimensao: 'O', invertida: false },
  { id: 'o6', texto: 'Gosto de pensar em conceitos abstratos', dimensao: 'O', invertida: false },
  
  // Conscienciosidade (C)
  { id: 'c1', texto: 'Sou muito organizado e metódico', dimensao: 'C', invertida: false },
  { id: 'c2', texto: 'Sempre cumpro minhas tarefas no prazo', dimensao: 'C', invertida: false },
  { id: 'c3', texto: 'Presto muita atenção aos detalhes', dimensao: 'C', invertida: false },
  { id: 'c4', texto: 'Faço planos e os sigo à risca', dimensao: 'C', invertida: false },
  { id: 'c5', texto: 'Sou persistente até completar uma tarefa', dimensao: 'C', invertida: false },
  { id: 'c6', texto: 'Tenho autodisciplina forte', dimensao: 'C', invertida: false },
  
  // Extroversão (E)
  { id: 'e1', texto: 'Sou a "alma da festa" em eventos sociais', dimensao: 'E', invertida: false },
  { id: 'e2', texto: 'Sinto-me energizado quando estou com outras pessoas', dimensao: 'E', invertida: false },
  { id: 'e3', texto: 'Gosto de ser o centro das atenções', dimensao: 'E', invertida: false },
  { id: 'e4', texto: 'Inicio conversas facilmente', dimensao: 'E', invertida: false },
  { id: 'e5', texto: 'Tenho um círculo social amplo', dimensao: 'E', invertida: false },
  { id: 'e6', texto: 'Sou assertivo e expresso minhas opiniões', dimensao: 'E', invertida: false },
  
  // Amabilidade (A)
  { id: 'a1', texto: 'Preocupo-me genuinamente com o bem-estar dos outros', dimensao: 'A', invertida: false },
  { id: 'a2', texto: 'Prefiro cooperar a competir', dimensao: 'A', invertida: false },
  { id: 'a3', texto: 'Confio nas intenções das outras pessoas', dimensao: 'A', invertida: false },
  { id: 'a4', texto: 'Estou sempre disposto a ajudar os outros', dimensao: 'A', invertida: false },
  { id: 'a5', texto: 'Evito conflitos e busco harmonia', dimensao: 'A', invertida: false },
  { id: 'a6', texto: 'Sou paciente com as falhas dos outros', dimensao: 'A', invertida: false },
  
  // Neuroticismo (N)
  { id: 'n1', texto: 'Preocupo-me muito com o que pode dar errado', dimensao: 'N', invertida: false },
  { id: 'n2', texto: 'Minhas emoções variam frequentemente', dimensao: 'N', invertida: false },
  { id: 'n3', texto: 'Fico facilmente estressado', dimensao: 'N', invertida: false },
  { id: 'n4', texto: 'Tenho tendência a me sentir ansioso', dimensao: 'N', invertida: false },
  { id: 'n5', texto: 'Levo críticas muito a sério', dimensao: 'N', invertida: false },
  { id: 'n6', texto: 'Às vezes me sinto triste sem motivo aparente', dimensao: 'N', invertida: false },
];

const TRAIT_ICONS: Record<BigFiveTrait, React.ElementType> = {
  O: Sparkles,
  C: Target,
  E: Users,
  A: Heart,
  N: Brain
};

const LIKERT_OPTIONS = [
  { value: 1, label: 'Discordo totalmente', emoji: '😤' },
  { value: 2, label: 'Discordo', emoji: '😕' },
  { value: 3, label: 'Neutro', emoji: '😐' },
  { value: 4, label: 'Concordo', emoji: '🙂' },
  { value: 5, label: 'Concordo totalmente', emoji: '😄' },
];

interface BigFiveQuizProps {
  onComplete: (result: BigFiveResult) => void;
  candidatoNome?: string;
}

export const BigFiveQuiz = memo(function BigFiveQuiz({ 
  onComplete, 
  candidatoNome 
}: BigFiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = QUESTIONS[currentIndex] as BigFiveQuestion;
  const progress = (currentIndex / QUESTIONS.length) * 100;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const calculateResult = useCallback((): BigFiveResult => {
    const scores = {
      O: [] as number[],
      C: [] as number[],
      E: [] as number[],
      A: [] as number[],
      N: [] as number[],
    };

    QUESTIONS.forEach(q => {
      const answer = answers[q.id] || 3;
      const score = q.invertida ? 6 - answer : answer;
      scores[q.dimensao].push(score);
    });

    const calculateAverage = (arr: number[]) => 
      Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 20);

    const bigFiveScores = {
      openness: calculateAverage(scores.O),
      conscientiousness: calculateAverage(scores.C),
      extraversion: calculateAverage(scores.E),
      agreeableness: calculateAverage(scores.A),
      neuroticism: calculateAverage(scores.N),
    };

    const sortedTraits = Object.entries(bigFiveScores)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key);

    const traitMap: Record<string, BigFiveTrait> = {
      openness: 'O',
      conscientiousness: 'C',
      extraversion: 'E',
      agreeableness: 'A',
      neuroticism: 'N'
    };

    const firstTrait = sortedTraits[0] as string | undefined;
    const secondTrait = sortedTraits[1] as string | undefined;
    
    const traitPrimario: BigFiveTrait = (firstTrait && traitMap[firstTrait]) ? traitMap[firstTrait] : 'O';
    const traitSecundario: BigFiveTrait = (secondTrait && traitMap[secondTrait]) ? traitMap[secondTrait] : 'C';

    const infoPrimario = BIG_FIVE_INFO[traitPrimario];
    const infoSecundario = BIG_FIVE_INFO[traitSecundario];

    return {
      scores: bigFiveScores,
      facets: {},
      traitPrimario,
      traitSecundario,
      perfil: `${infoPrimario.nome} + ${infoSecundario.nome}`,
      descricao: infoPrimario.descricaoAlta,
      pontosFortes: infoPrimario.caracteristicasAltas.slice(0, 3),
      areasDesenvolvimento: infoPrimario.caracteristicasBaixas.slice(0, 2),
      compatibilidadeCarreira: infoPrimario.carreirasCompativeis,
      ambienteIdeal: `Ambiente que valoriza ${infoPrimario.nome.toLowerCase()} e ${infoSecundario.nome.toLowerCase()}`,
      estiloTrabalho: infoPrimario.descricaoAlta,
      relacionamentoEquipe: `Contribui com ${(infoPrimario.caracteristicasAltas[0] ?? 'colaboração').toLowerCase()}`,
    };
  }, [answers]);

  const handleAnswer = useCallback((value: number) => {
    if (currentQuestion) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      const result = calculateResult();
      onComplete(result);
    }
  }, [currentIndex, calculateResult, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setIsComplete(false);
  }, []);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30"
          />
        </div>
        <h3 className="mt-6 text-2xl font-bold">Análise Concluída!</h3>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Seu perfil Big Five foi calculado com base em {QUESTIONS.length} dimensões de personalidade.
        </p>
        <Button onClick={handleReset} variant="outline" className="mt-6">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refazer Avaliação
        </Button>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  const TraitIcon = TRAIT_ICONS[currentQuestion.dimensao];
  const traitInfo = BIG_FIVE_INFO[currentQuestion.dimensao];

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(
              "bg-gradient-to-r text-white border-0",
              traitInfo.cor
            )}>
              <TraitIcon className="w-3 h-3 mr-1" />
              {traitInfo.nome}
            </Badge>
            <Badge variant="secondary">
              {currentIndex + 1} / {QUESTIONS.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            {Math.round((Date.now() - startTime) / 60000)} min
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <CardTitle className="text-lg">
          {candidatoNome ? `Olá, ${candidatoNome}!` : 'Avaliação Big Five'}
        </CardTitle>
        <CardDescription>
          Avalie o quanto você concorda com cada afirmação
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Question */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <p className="text-lg font-medium text-center">
                "{currentQuestion.texto}"
              </p>
            </div>

            {/* Slider Response */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Discordo totalmente</span>
                <span>Concordo totalmente</span>
              </div>
              
              <Slider
                value={[currentAnswer ?? 3]}
                min={1}
                max={5}
                step={1}
                onValueChange={([val]) => val !== undefined && handleAnswer(val)}
                className="py-4"
              />
              
              <div className="flex justify-center gap-2">
                {LIKERT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={currentAnswer === option.value ? 'default' : 'outline'}
                    size="lg"
                    className={cn(
                      "flex-1 flex flex-col gap-1 h-auto py-3",
                      currentAnswer === option.value && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-xs hidden sm:block">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Trait Info */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
              <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="font-medium">{traitInfo.nomeCompleto}:</span>{' '}
                <span className="text-muted-foreground">{traitInfo.descricaoAlta}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex gap-1">
            {QUESTIONS.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((q) => (
              <div
                key={q.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  answers[q.id] ? "bg-primary" : "bg-muted",
                  currentQuestion && q.id === currentQuestion.id && "w-4 bg-primary"
                )}
              />
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default BigFiveQuiz;
