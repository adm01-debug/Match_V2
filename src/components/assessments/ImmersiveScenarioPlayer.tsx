/**
 * @fileoverview Player de Cenários Imersivos
 * Interface gamificada para avaliação comportamental baseada em cenários
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  AlertTriangle, 
  Zap, 
  Brain, 
  ChevronRight,
  Eye,
  Timer,
  Sparkles
} from 'lucide-react';
import type { ImmersiveScenario } from '@/config/behavioralPillars';

interface ImmersiveScenarioPlayerProps {
  scenario: ImmersiveScenario;
  onComplete: (response: ScenarioResponse) => void;
  onSkip?: () => void;
  scenarioIndex: number;
  totalScenarios: number;
}

export interface ScenarioResponse {
  scenarioId: string;
  selectedOption: string;
  timeToRespond: number; // ms
  followUpResponse?: string;
  followUpTime?: number;
  hesitations: number; // quantas vezes mudou de opção antes de confirmar
  readTime: number; // tempo lendo antes de primeira interação
}

const tipoLabels: Record<string, { label: string; icon: typeof AlertTriangle; color: string }> = {
  dilema_etico: { label: 'Dilema Ético', icon: AlertTriangle, color: 'text-amber-500' },
  situacao_pressao: { label: 'Sob Pressão', icon: Zap, color: 'text-red-500' },
  conflito_interpessoal: { label: 'Conflito', icon: Brain, color: 'text-violet-500' },
  decisao_estrategica: { label: 'Decisão Estratégica', icon: Eye, color: 'text-blue-500' },
  crise: { label: 'Gestão de Crise', icon: AlertTriangle, color: 'text-red-600' },
  inovacao: { label: 'Inovação', icon: Sparkles, color: 'text-emerald-500' },
};

export function ImmersiveScenarioPlayer({
  scenario,
  onComplete,
  onSkip,
  scenarioIndex,
  totalScenarios,
}: ImmersiveScenarioPlayerProps) {
  const [phase, setPhase] = useState<'intro' | 'narrative' | 'options' | 'followup' | 'transitioning'>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hesitations, setHesitations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(scenario.tempoLimite || 120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const readTimeRef = useRef<number>(0);
  const firstInteractionRef = useRef<boolean>(false);
  const previousSelectionRef = useRef<string | null>(null);

  const tipoInfo = tipoLabels[scenario.tipo] || tipoLabels['dilema_etico'];
  const TipoIcon = tipoInfo?.icon || AlertTriangle;

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || phase === 'transitioning') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Tempo esgotado - força seleção ou usa primeira opção
          if (selectedOption) {
            handleConfirm();
          } else if (scenario.opcoes[0]) {
            setSelectedOption(scenario.opcoes[0].id);
            setTimeout(() => handleConfirm(), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerActive, phase, selectedOption]);

  // Track read time
  useEffect(() => {
    if (phase === 'narrative' && !firstInteractionRef.current) {
      const interval = setInterval(() => {
        readTimeRef.current += 100;
      }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [phase]);

  const handleOptionInteraction = useCallback(() => {
    if (!firstInteractionRef.current) {
      firstInteractionRef.current = true;
    }
  }, []);

  const handleOptionSelect = (optionId: string) => {
    handleOptionInteraction();
    
    if (previousSelectionRef.current && previousSelectionRef.current !== optionId) {
      setHesitations((prev) => prev + 1);
    }
    previousSelectionRef.current = optionId;
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    const timeToRespond = Date.now() - startTimeRef.current;

    // Check if there's a follow-up
    if (scenario.followUp && scenario.followUp.condicao === selectedOption && !followUpResponse) {
      setPhase('followup');
      startTimeRef.current = Date.now();
      return;
    }

    setPhase('transitioning');

    const response: ScenarioResponse = {
      scenarioId: scenario.id,
      selectedOption,
      timeToRespond,
      hesitations,
      readTime: readTimeRef.current,
      followUpResponse: followUpResponse || undefined,
      followUpTime: followUpResponse ? Date.now() - startTimeRef.current : undefined,
    };

    setTimeout(() => {
      onComplete(response);
    }, 800);
  };

  const startScenario = () => {
    setPhase('narrative');
    setTimeout(() => {
      setPhase('options');
      setIsTimerActive(true);
      startTimeRef.current = Date.now();
    }, 3000); // Tempo para ler contexto
  };

  const timerColor = timeLeft > 30 ? 'text-foreground' : timeLeft > 10 ? 'text-amber-500' : 'text-red-500';
  const timerProgress = ((scenario.tempoLimite || 120) - timeLeft) / (scenario.tempoLimite || 120) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-2xl w-full"
          >
            <Card className="border-2 border-primary/20 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className={cn("p-4 rounded-full bg-muted", tipoInfo?.color || 'text-primary')}>
                    <TipoIcon className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className={tipoInfo?.color || ''}>
                    {tipoInfo?.label || 'Cenário'}
                  </Badge>
                  <CardTitle className="text-2xl">{scenario.titulo}</CardTitle>
                </div>
                <p className="text-muted-foreground">{scenario.contexto}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span>{scenario.tempoLimite || 120}s para decidir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>{scenario.opcoes.length} opções</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-600">Importante</p>
                      <p className="text-muted-foreground">
                        Não existe resposta certa ou errada. Responda como você realmente agiria, 
                        não como acha que deveria agir.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {onSkip && (
                    <Button variant="ghost" onClick={onSkip} className="flex-1">
                      Pular
                    </Button>
                  )}
                  <Button onClick={startScenario} className="flex-1 gap-2">
                    Começar <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  Cenário {scenarioIndex + 1} de {totalScenarios}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* NARRATIVE */}
        {phase === 'narrative' && (
          <motion.div
            key="narrative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl w-full"
          >
            <Card className="border-2 border-primary/10 shadow-2xl">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {scenario.narrativa}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-8 text-center"
                >
                  <div className="inline-flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Preparando opções...</span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* OPTIONS */}
        {phase === 'options' && (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl w-full"
          >
            <Card className="border-2 border-primary/10 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{scenario.titulo}</CardTitle>
                  <div className={cn("flex items-center gap-2 font-mono text-lg font-bold", timerColor)}>
                    <Clock className="h-5 w-5" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <Progress value={timerProgress} className="h-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {scenario.narrativa.slice(0, 200)}...
                </p>

                <div className="grid gap-3">
                  {scenario.opcoes.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleOptionSelect(option.id)}
                      onMouseEnter={() => setHoveredOption(option.id)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-primary/5",
                        selectedOption === option.id
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border bg-card",
                        hoveredOption === option.id && selectedOption !== option.id
                          ? "border-muted-foreground/30"
                          : ""
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedOption === option.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        )}>
                          {selectedOption === option.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-primary-foreground rounded-full"
                            />
                          )}
                        </div>
                        <span className="flex-1">{option.texto}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    onClick={handleConfirm}
                    disabled={!selectedOption}
                    className="gap-2"
                  >
                    Confirmar Decisão
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FOLLOW-UP */}
        {phase === 'followup' && scenario.followUp && (
          <motion.div
            key="followup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl w-full"
          >
            <Card className="border-2 border-amber-500/30 shadow-2xl">
              <CardHeader>
                <Badge variant="outline" className="w-fit text-amber-500 border-amber-500/30">
                  Pergunta de Acompanhamento
                </Badge>
                <CardTitle className="text-xl">{scenario.followUp.pergunta}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {scenario.followUp.opcoes.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setFollowUpResponse(option.id)}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                        "hover:border-amber-500/50 hover:bg-amber-500/5",
                        followUpResponse === option.id
                          ? "border-amber-500 bg-amber-500/10 shadow-md"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          followUpResponse === option.id
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-muted-foreground/30"
                        )}>
                          {followUpResponse === option.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="flex-1">{option.texto}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    onClick={handleConfirm}
                    disabled={!followUpResponse}
                    className="gap-2"
                  >
                    Continuar
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TRANSITIONING */}
        {phase === 'transitioning' && (
          <motion.div
            key="transitioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="text-muted-foreground">Processando sua resposta...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImmersiveScenarioPlayer;
