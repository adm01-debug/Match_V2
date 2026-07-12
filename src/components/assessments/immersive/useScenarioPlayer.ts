import { useState, useEffect, useCallback, useRef } from 'react';
import type { ImmersiveScenario } from '@/config/behavioralPillars';
import type { ScenarioResponse } from './types';

type Phase = 'intro' | 'narrative' | 'options' | 'followup' | 'transitioning';

export function useScenarioPlayer(scenario: ImmersiveScenario, onComplete: (r: ScenarioResponse) => void) {
  const [phase, setPhase] = useState<Phase>('intro');
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

  const handleOptionInteraction = useCallback(() => {
    if (!firstInteractionRef.current) firstInteractionRef.current = true;
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedOption) return;
    const timeToRespond = Date.now() - startTimeRef.current;

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
    setTimeout(() => onComplete(response), 800);
  }, [selectedOption, scenario.followUp, scenario.id, followUpResponse, hesitations, onComplete]);

  useEffect(() => {
    if (!isTimerActive || phase === 'transitioning') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (selectedOption) handleConfirm();
          else if (scenario.opcoes[0]) {
            setSelectedOption(scenario.opcoes[0].id);
            setTimeout(() => handleConfirm(), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, phase, selectedOption, handleConfirm, scenario.opcoes]);

  useEffect(() => {
    if (phase === 'narrative' && !firstInteractionRef.current) {
      const interval = setInterval(() => { readTimeRef.current += 100; }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [phase]);

  const handleOptionSelect = (optionId: string) => {
    handleOptionInteraction();
    if (previousSelectionRef.current && previousSelectionRef.current !== optionId) {
      setHesitations((prev) => prev + 1);
    }
    previousSelectionRef.current = optionId;
    setSelectedOption(optionId);
  };

  const startScenario = () => {
    setPhase('narrative');
    setTimeout(() => {
      setPhase('options');
      setIsTimerActive(true);
      startTimeRef.current = Date.now();
    }, 3000);
  };

  return {
    phase, selectedOption, hoveredOption, setHoveredOption,
    timeLeft, followUpResponse, setFollowUpResponse,
    handleOptionSelect, handleConfirm, startScenario,
  };
}
