/**
 * @fileoverview Quiz interativo para 16 Tipos de Personalidade
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Heart, Eye, Zap,
  ArrowRight, ArrowLeft, RotateCcw,
  Timer
} from 'lucide-react';
import { PERSONALITY_16_INFO, type PersonalityType16, type PersonalityType16Result, type CognitiveFunction } from '@/types/personality';
import { cn } from '@/lib/utils';

interface Type16Question {
  id: string;
  pergunta: string;
  opcaoA: { texto: string; dimensao: 'E' | 'S' | 'T' | 'J' };
  opcaoB: { texto: string; dimensao: 'I' | 'N' | 'F' | 'P' };
}

const QUESTIONS: Type16Question[] = [
  // E vs I
  { 
    id: 'ei1', 
    pergunta: 'Em uma festa ou evento social:',
    opcaoA: { texto: 'Gosto de conhecer muitas pessoas novas', dimensao: 'E' },
    opcaoB: { texto: 'Prefiro conversas profundas com poucas pessoas', dimensao: 'I' }
  },
  { 
    id: 'ei2', 
    pergunta: 'Quando preciso recarregar energias:',
    opcaoA: { texto: 'Saio com amigos ou vou a eventos', dimensao: 'E' },
    opcaoB: { texto: 'Fico sozinho ou com pessoas muito próximas', dimensao: 'I' }
  },
  { 
    id: 'ei3', 
    pergunta: 'No trabalho, prefiro:',
    opcaoA: { texto: 'Trabalhar em equipe e discutir ideias', dimensao: 'E' },
    opcaoB: { texto: 'Trabalhar sozinho e me concentrar', dimensao: 'I' }
  },
  { 
    id: 'ei4', 
    pergunta: 'Quando conheço alguém novo:',
    opcaoA: { texto: 'Inicio conversas facilmente', dimensao: 'E' },
    opcaoB: { texto: 'Espero que a outra pessoa tome iniciativa', dimensao: 'I' }
  },
  
  // S vs N
  { 
    id: 'sn1', 
    pergunta: 'Ao resolver um problema:',
    opcaoA: { texto: 'Foco nos fatos e detalhes concretos', dimensao: 'S' },
    opcaoB: { texto: 'Busco padrões e possibilidades ocultas', dimensao: 'N' }
  },
  { 
    id: 'sn2', 
    pergunta: 'Quando penso no futuro:',
    opcaoA: { texto: 'Prefiro planos realistas e alcançáveis', dimensao: 'S' },
    opcaoB: { texto: 'Gosto de imaginar grandes possibilidades', dimensao: 'N' }
  },
  { 
    id: 'sn3', 
    pergunta: 'Ao aprender algo novo:',
    opcaoA: { texto: 'Prefiro instruções práticas passo a passo', dimensao: 'S' },
    opcaoB: { texto: 'Prefiro entender o conceito geral primeiro', dimensao: 'N' }
  },
  { 
    id: 'sn4', 
    pergunta: 'Você tende a confiar mais:',
    opcaoA: { texto: 'Na experiência prática e no que já funcionou', dimensao: 'S' },
    opcaoB: { texto: 'Na intuição e em novas abordagens', dimensao: 'N' }
  },
  
  // T vs F
  { 
    id: 'tf1', 
    pergunta: 'Ao tomar uma decisão difícil:',
    opcaoA: { texto: 'Analiso logicamente prós e contras', dimensao: 'T' },
    opcaoB: { texto: 'Considero como afetará as pessoas envolvidas', dimensao: 'F' }
  },
  { 
    id: 'tf2', 
    pergunta: 'Quando alguém compartilha um problema:',
    opcaoA: { texto: 'Ofereço soluções e conselhos práticos', dimensao: 'T' },
    opcaoB: { texto: 'Ofereço apoio emocional e empatia', dimensao: 'F' }
  },
  { 
    id: 'tf3', 
    pergunta: 'Em uma discussão, você valoriza mais:',
    opcaoA: { texto: 'A verdade, mesmo que seja dura', dimensao: 'T' },
    opcaoB: { texto: 'A harmonia e os sentimentos dos outros', dimensao: 'F' }
  },
  { 
    id: 'tf4', 
    pergunta: 'Você se considera mais:',
    opcaoA: { texto: 'Objetivo e analítico', dimensao: 'T' },
    opcaoB: { texto: 'Empático e compassivo', dimensao: 'F' }
  },
  
  // J vs P
  { 
    id: 'jp1', 
    pergunta: 'Em relação a prazos:',
    opcaoA: { texto: 'Gosto de terminar com antecedência', dimensao: 'J' },
    opcaoB: { texto: 'Trabalho melhor sob pressão no final', dimensao: 'P' }
  },
  { 
    id: 'jp2', 
    pergunta: 'Seu ambiente de trabalho ideal é:',
    opcaoA: { texto: 'Organizado e estruturado', dimensao: 'J' },
    opcaoB: { texto: 'Flexível e adaptável', dimensao: 'P' }
  },
  { 
    id: 'jp3', 
    pergunta: 'Ao planejar uma viagem:',
    opcaoA: { texto: 'Faço um roteiro detalhado', dimensao: 'J' },
    opcaoB: { texto: 'Deixo espaço para espontaneidade', dimensao: 'P' }
  },
  { 
    id: 'jp4', 
    pergunta: 'Você prefere:',
    opcaoA: { texto: 'Ter as coisas decididas e resolvidas', dimensao: 'J' },
    opcaoB: { texto: 'Manter opções em aberto', dimensao: 'P' }
  },
];

interface Type16QuizProps {
  onComplete: (result: PersonalityType16Result) => void;
  candidatoNome?: string;
}

export const Type16Quiz = memo(function Type16Quiz({ 
  onComplete, 
  candidatoNome 
}: Type16QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = QUESTIONS[currentIndex] as Type16Question | undefined;
  const progress = (currentIndex / QUESTIONS.length) * 100;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const calculateResult = useCallback((): PersonalityType16Result => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer === 'A') {
        scores[q.opcaoA.dimensao]++;
      } else if (answer === 'B') {
        scores[q.opcaoB.dimensao]++;
      }
    });

    // Calcular percentuais
    const total_EI = scores.E + scores.I || 1;
    const total_SN = scores.S + scores.N || 1;
    const total_TF = scores.T + scores.F || 1;
    const total_JP = scores.J + scores.P || 1;

    const dimensions = {
      energyDirection: { 
        E: Math.round((scores.E / total_EI) * 100), 
        I: Math.round((scores.I / total_EI) * 100) 
      },
      informationGathering: { 
        S: Math.round((scores.S / total_SN) * 100), 
        N: Math.round((scores.N / total_SN) * 100) 
      },
      decisionMaking: { 
        T: Math.round((scores.T / total_TF) * 100), 
        F: Math.round((scores.F / total_TF) * 100) 
      },
      lifestyleApproach: { 
        J: Math.round((scores.J / total_JP) * 100), 
        P: Math.round((scores.P / total_JP) * 100) 
      },
    };

    // Determinar tipo
    const type = (
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P')
    ) as PersonalityType16;

    const info = PERSONALITY_16_INFO[type];

    return {
      type,
      dimensions,
      cognitiveFunctions: {
        dominant: (info.cognitiveFunctions[0] ?? 'Ni') as CognitiveFunction,
        auxiliary: (info.cognitiveFunctions[1] ?? 'Te') as CognitiveFunction,
        tertiary: (info.cognitiveFunctions[2] ?? 'Fi') as CognitiveFunction,
        inferior: (info.cognitiveFunctions[3] ?? 'Se') as CognitiveFunction,
      },
      descricao: info.descricao,
      titulo: info.titulo,
      arquetipo: info.arquetipo,
      pontosFortes: info.pontosFortes,
      pontosADesenvolver: info.areasDesenvolvimento,
      motivadores: ['Crescimento pessoal', 'Desafios intelectuais', 'Autonomia'],
      estressores: ['Rotina excessiva', 'Falta de propósito', 'Conflitos'],
      comunicacao: 'Estilo de comunicação baseado no tipo',
      lideranca: 'Estilo de liderança baseado no tipo',
      carreiraIdeal: info.carreirasIdeais,
      relacionamentos: 'Dinâmica de relacionamentos baseada no tipo',
      famosos: info.famosos,
      raridade: info.raridade,
    };
  }, [answers]);

  const handleAnswer = useCallback((choice: 'A' | 'B') => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
    
    // Auto-advance
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
        const result = calculateResult();
        onComplete(result);
      }
    }, 300);
  }, [currentQuestion?.id, currentIndex, calculateResult, onComplete]);

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
    const result = calculateResult();
    const info = PERSONALITY_16_INFO[result.type];
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className={cn(
            "w-32 h-32 rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center text-white shadow-xl",
            info.cor
          )}
        >
          <span className="text-4xl">{info.emojis}</span>
          <span className="text-2xl font-bold mt-2">{result.type}</span>
        </motion.div>
        
        <h3 className="mt-6 text-2xl font-bold">{info.titulo}</h3>
        <p className="text-muted-foreground">{info.arquetipo}</p>
        <p className="mt-2 text-center max-w-md text-sm">{info.descricao}</p>
        
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary">
            {info.raridade}% da população
          </Badge>
        </div>
        
        <Button onClick={handleReset} variant="outline" className="mt-6">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refazer Avaliação
        </Button>
      </motion.div>
    );
  }

  // Determinar categoria da pergunta
  const getQuestionCategory = () => {
    if (!currentQuestion) return { label: 'Pergunta', icon: Brain, color: 'text-muted-foreground' };
    const id = currentQuestion.id;
    if (id.startsWith('ei')) return { label: 'Energia', icon: Zap, color: 'text-yellow-500' };
    if (id.startsWith('sn')) return { label: 'Informação', icon: Eye, color: 'text-blue-500' };
    if (id.startsWith('tf')) return { label: 'Decisão', icon: Brain, color: 'text-purple-500' };
    return { label: 'Estilo de Vida', icon: Heart, color: 'text-pink-500' };
  };

  const category = getQuestionCategory();
  const CategoryIcon = category.icon;

  if (!currentQuestion) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CategoryIcon className={cn("w-3 h-3", category.color)} />
              {category.label}
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
          {candidatoNome ? `Olá, ${candidatoNome}!` : '16 Tipos de Personalidade'}
        </CardTitle>
        <CardDescription>
          Escolha a opção que mais se parece com você
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Question */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border text-center">
              <p className="text-lg font-medium">{currentQuestion.pergunta}</p>
            </div>

            {/* Options */}
            <div className="grid gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer('A')}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  currentAnswer === 'A' 
                    ? "border-primary bg-primary/5" 
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    currentAnswer === 'A' ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    A
                  </div>
                  <span>{currentQuestion.opcaoA.texto}</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer('B')}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  currentAnswer === 'B' 
                    ? "border-primary bg-primary/5" 
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    currentAnswer === 'B' ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    B
                  </div>
                  <span>{currentQuestion.opcaoB.texto}</span>
                </div>
              </motion.button>
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
            {QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  answers[q.id] ? "bg-primary" : "bg-muted",
                  i === currentIndex && "w-4 bg-primary"
                )}
              />
            ))}
          </div>
          
          <Button
            onClick={() => {
              if (currentAnswer) {
                if (currentIndex === QUESTIONS.length - 1) {
                  setIsComplete(true);
                  onComplete(calculateResult());
                } else {
                  setCurrentIndex(prev => prev + 1);
                }
              }
            }}
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

export default Type16Quiz;
