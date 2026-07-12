/**
 * @fileoverview Quiz de Valores Culturais para Empresas (shell orchestrator)
 */

import { useCallback, useState } from 'react';
import { IntroScreen } from './companyValuesQuiz/IntroScreen';
import { ResultsScreen } from './companyValuesQuiz/ResultsScreen';
import { QuestionCard } from './companyValuesQuiz/QuestionCard';
import {
  VALORES_CULTURAIS,
  type ValorCulturalId,
  type RespostaValorEmpresa,
  type PerfilCulturalEmpresa,
} from '@/types/match';

interface CompanyValuesQuizProps {
  empresaNome: string;
  onComplete: (perfil: PerfilCulturalEmpresa) => void;
  onCancel?: () => void;
}

export function CompanyValuesQuiz({ empresaNome, onComplete, onCancel }: CompanyValuesQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Map<ValorCulturalId, RespostaValorEmpresa>>(new Map());
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [descricaoCultura, setDescricaoCultura] = useState('');

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
      empresaNome,
      descricaoCultura,
      valores: valoresArray,
      valoresPrioritarios: top5,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    });
  };

  if (showIntro) return <IntroScreen empresaNome={empresaNome} onStart={() => setShowIntro(false)} onCancel={onCancel} />;
  if (showResults)
    return (
      <ResultsScreen
        respostas={Array.from(respostas.values())}
        descricaoCultura={descricaoCultura}
        onDescricaoChange={setDescricaoCultura}
        onComplete={handleComplete}
      />
    );

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
