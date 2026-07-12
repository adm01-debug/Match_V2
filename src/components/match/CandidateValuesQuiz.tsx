/**
 * @fileoverview Quiz de Valores para Candidatos (shell orchestrator)
 */

import { useCallback, useState } from 'react';
import { IntroScreen } from './candidateValuesQuiz/IntroScreen';
import { ResultsScreen } from './candidateValuesQuiz/ResultsScreen';
import { QuestionCard } from './candidateValuesQuiz/QuestionCard';
import {
  VALORES_CULTURAIS,
  type ValorCulturalId,
  type RespostaValorCandidato,
  type PerfilCulturalCandidato,
} from '@/types/match';

interface CandidateValuesQuizProps {
  candidatoId: string;
  candidatoNome: string;
  onComplete: (perfil: PerfilCulturalCandidato) => void;
  onCancel?: () => void;
}

export function CandidateValuesQuiz({ candidatoId, candidatoNome, onComplete, onCancel }: CandidateValuesQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Map<ValorCulturalId, RespostaValorCandidato>>(new Map());
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const totalQuestoes = VALORES_CULTURAIS.length;
  const valorAtual = VALORES_CULTURAIS[currentIndex];
  const respostaAtual = valorAtual ? respostas.get(valorAtual.id) : undefined;

  const handleResposta = useCallback((intensidade: number) => {
    if (!valorAtual) return;
    setRespostas((prev) => {
      const nova = new Map(prev);
      nova.set(valorAtual.id, { valorId: valorAtual.id, intensidade });
      return nova;
    });
    setTimeout(() => {
      if (currentIndex < totalQuestoes - 1) setCurrentIndex((p) => p + 1);
      else setShowResults(true);
    }, 300);
  }, [valorAtual, currentIndex, totalQuestoes]);

  const handleNext = () => {
    if (currentIndex < totalQuestoes - 1) setCurrentIndex((p) => p + 1);
    else setShowResults(true);
  };

  const handleComplete = () => {
    const valoresArray = Array.from(respostas.values());
    const top5 = [...valoresArray].sort((a, b) => b.intensidade - a.intensidade).slice(0, 5).map((v) => v.valorId);
    onComplete({
      id: crypto.randomUUID(),
      candidatoId,
      candidatoNome,
      valores: valoresArray,
      valoresPrioritarios: top5,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    });
  };

  if (showIntro) return <IntroScreen candidatoNome={candidatoNome} onStart={() => setShowIntro(false)} onCancel={onCancel} />;
  if (showResults) return <ResultsScreen respostas={Array.from(respostas.values())} onComplete={handleComplete} />;

  return (
    <QuestionCard
      currentIndex={currentIndex}
      respostaAtual={respostaAtual}
      onResposta={handleResposta}
      onPrevious={() => currentIndex > 0 && setCurrentIndex((p) => p - 1)}
      onNext={handleNext}
    />
  );
}
