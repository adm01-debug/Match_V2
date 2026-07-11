import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  GamifiedAssessmentEngine,
  SwipeValuesCard,
  PersonalityMiniGame,
  PhaseChallenge,
} from "@/components/assessments/gamified";
import {
  GAMIFIED_QUESTIONS,
  VALUE_CARDS,
  PERSONALITY_MINI_GAMES,
} from "@/data/gamifiedAssessmentData";
import { CHALLENGE_PHASES } from "@/data/phaseChallengeData";
import { GamifiedMode } from "./gameCardsConfig";

interface GamifiedModeViewProps {
  mode: NonNullable<GamifiedMode>;
  onExit: () => void;
  onComplete: (xp: number) => void;
}

export function GamifiedModeView({ mode, onExit, onComplete }: GamifiedModeViewProps) {
  const titles: Record<NonNullable<GamifiedMode>, string> = {
    quiz: "Quiz Interativo",
    swipe: "Swipe de Valores",
    minigame: "Mini-Games",
    phases: "Desafio por Fases",
  };

  return (
    <Layout title={titles[mode]}>
      <div className="p-6">
        <Button variant="ghost" onClick={onExit} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {mode === "quiz" && (
          <GamifiedAssessmentEngine
            questions={GAMIFIED_QUESTIONS}
            onComplete={(_answers, stats) => onComplete(stats.totalXP)}
            onExit={onExit}
            title="Quiz Comportamental"
            subtitle="Teste seus conhecimentos e ganhe XP!"
            theme="cosmic"
          />
        )}

        {mode === "swipe" && (
          <SwipeValuesCard
            cards={VALUE_CARDS}
            onComplete={(liked, _passed, superLiked) => {
              onComplete(liked.length * 10 + superLiked.length * 25);
            }}
            title="Descubra Seus Valores"
          />
        )}

        {mode === "minigame" && (
          <PersonalityMiniGame
            games={PERSONALITY_MINI_GAMES}
            onComplete={(_results, totalXP) => onComplete(totalXP)}
            onExit={onExit}
          />
        )}

        {mode === "phases" && (
          <PhaseChallenge
            phases={CHALLENGE_PHASES}
            onComplete={(results) =>
              onComplete(results.reduce((acc, r) => acc + r.xpEarned, 0))
            }
            onExit={onExit}
          />
        )}
      </div>
    </Layout>
  );
}
