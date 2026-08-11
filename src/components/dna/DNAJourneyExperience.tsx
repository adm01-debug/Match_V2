import React, { useState, useCallback } from 'react';
import {
  DNAHelix,
  DNAProfile,
  DNA_ARCHETYPES,
  calculateDNACode,
  determineArchetype,
} from '@/types/behavioralDNA';
import { MiniGameResult } from './BehavioralMiniGame';
import { JOURNEY_SCENARIOS, JOURNEY_MINIGAMES } from './journey/dnaJourneyScenarios';
import { DNAJourneyIntro } from './journey/DNAJourneyIntro';
import { DNAJourneyScenarioPhase } from './journey/DNAJourneyScenarioPhase';
import { DNAJourneyMinigamePhase } from './journey/DNAJourneyMinigamePhase';
import { DNAJourneyResults } from './journey/DNAJourneyResults';

interface DNAJourneyExperienceProps {
  participantType: 'candidate' | 'company';
  participantName: string;
  onComplete: (profile: DNAProfile) => void;
  onCancel?: () => void;
}

type JourneyPhase = 'intro' | 'scenario' | 'minigame' | 'results';

const INITIAL_HELIX: DNAHelix = {
  strategic: 50,
  emotional: 50,
  influence: 50,
  values: 50,
  adaptive: 50,
};

export const DNAJourneyExperience: React.FC<DNAJourneyExperienceProps> = ({
  participantType,
  participantName,
  onComplete,
  onCancel,
}) => {
  const [phase, setPhase] = useState<JourneyPhase>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [helixScores, setHelixScores] = useState<DNAHelix>(INITIAL_HELIX);
  const [showDNAPreview, setShowDNAPreview] = useState(false);
  const [gameResults, setGameResults] = useState<MiniGameResult[]>([]);

  const totalSteps = JOURNEY_SCENARIOS.length + JOURNEY_MINIGAMES.length;
  const currentStep =
    phase === 'scenario'
      ? currentScenarioIndex + 1
      : phase === 'minigame'
      ? JOURNEY_SCENARIOS.length + currentGameIndex + 1
      : phase === 'results'
      ? totalSteps
      : 0;

  const handleScenarioComplete = useCallback(
    (impact: DNAHelix) => {
      setHelixScores((prev) => ({
        strategic: Math.min(100, Math.max(0, (prev.strategic + impact.strategic) / 2)),
        emotional: Math.min(100, Math.max(0, (prev.emotional + impact.emotional) / 2)),
        influence: Math.min(100, Math.max(0, (prev.influence + impact.influence) / 2)),
        values: Math.min(100, Math.max(0, (prev.values + impact.values) / 2)),
        adaptive: Math.min(100, Math.max(0, (prev.adaptive + impact.adaptive) / 2)),
      }));

      if (currentScenarioIndex < JOURNEY_SCENARIOS.length - 1) {
        setCurrentScenarioIndex((p) => p + 1);
      } else {
        setPhase('minigame');
      }
    },
    [currentScenarioIndex],
  );

  const handleGameComplete = useCallback(
    (result: MiniGameResult) => {
      setGameResults((prev) => [...prev, result]);

      setHelixScores((prev) => {
        const adjustment = (result.score / 100) * 20;
        const next = { ...prev };
        switch (result.gameType) {
          case 'value-tower':
            next.values = Math.min(100, prev.values + adjustment);
            break;
          case 'reaction':
            next.adaptive = Math.min(100, prev.adaptive + adjustment);
            break;
          case 'pressure':
            next.strategic = Math.min(100, prev.strategic + adjustment);
            next.emotional = Math.min(100, prev.emotional + adjustment * 0.5);
            break;
          case 'emotional-radar':
            next.emotional = Math.min(100, prev.emotional + adjustment);
            next.influence = Math.min(100, prev.influence + adjustment * 0.5);
            break;
        }
        return next;
      });

      if (currentGameIndex < JOURNEY_MINIGAMES.length - 1) {
        setCurrentGameIndex((p) => p + 1);
      } else {
        setPhase('results');
      }
    },
    [currentGameIndex],
  );

  const buildProfile = useCallback((): DNAProfile => {
    const dnaCode = calculateDNACode(helixScores);
    const archetype = determineArchetype(helixScores);
    const archetypeData = DNA_ARCHETYPES.find((a) => a.id === archetype);

    const avgGameScore =
      gameResults.length > 0
        ? gameResults.reduce((sum, r) => sum + r.score, 0) / gameResults.length
        : 50;

    return {
      id: `${participantType}-${Date.now()}`,
      type: participantType,
      name: participantName,
      helix: helixScores,
      dnaCode,
      archetype,
      strengths: archetypeData?.strengths || [],
      challenges: archetypeData?.challenges || [],
      idealEnvironment: archetypeData
        ? `Ambiente que valoriza ${archetypeData.name.toLowerCase()} e permite expressão autêntica${
            avgGameScore >= 70 ? ', com ritmo dinâmico e desafios constantes' : ''
          }`
        : 'Ambiente colaborativo e desafiador',
      completedAt: new Date().toISOString(),
    };
  }, [helixScores, participantType, participantName, gameResults]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    setCurrentScenarioIndex(0);
    setCurrentGameIndex(0);
    setHelixScores(INITIAL_HELIX);
    setGameResults([]);
  }, []);

  if (phase === 'intro') {
    return (
      <DNAJourneyIntro
        participantName={participantName}
        onStart={() => setPhase('scenario')}
        onCancel={onCancel}
      />
    );
  }

  if (phase === 'scenario') {
    const scenario = JOURNEY_SCENARIOS[currentScenarioIndex];
    if (!scenario) {
      setPhase('minigame');
      return null;
    }
    return (
      <DNAJourneyScenarioPhase
        scenario={scenario}
        currentIndex={currentScenarioIndex}
        totalScenarios={JOURNEY_SCENARIOS.length}
        currentStep={currentStep}
        totalSteps={totalSteps}
        helixScores={helixScores}
        showDNAPreview={showDNAPreview}
        onTogglePreview={() => setShowDNAPreview((s) => !s)}
        onChoice={handleScenarioComplete}
        onSkip={() => {
          if (currentScenarioIndex < JOURNEY_SCENARIOS.length - 1) {
            setCurrentScenarioIndex((p) => p + 1);
          } else {
            setPhase('minigame');
          }
        }}
      />
    );
  }

  if (phase === 'minigame') {
    const gameType = JOURNEY_MINIGAMES[currentGameIndex];
    if (!gameType) {
      setPhase('results');
      return null;
    }
    return (
      <DNAJourneyMinigamePhase
        gameType={gameType}
        currentIndex={currentGameIndex}
        totalGames={JOURNEY_MINIGAMES.length}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onGameComplete={handleGameComplete}
      />
    );
  }

  if (phase === 'results') {
    return (
      <DNAJourneyResults
        profile={buildProfile()}
        participantName={participantName}
        helixScores={helixScores}
        onRestart={handleRestart}
        onComplete={() => onComplete(buildProfile())}
      />
    );
  }

  return null;
};

export default DNAJourneyExperience;
