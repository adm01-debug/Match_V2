/**
 * @module usePersonalityAssessment
 * @description Hook para gerenciar testes de personalidade (Big Five, MBTI, Eneagrama)
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  calculateBigFiveResult,
  calculateMBTIResult,
  calculateEnneagramResult,
} from '@/lib/personalityCalculator';
import {
  BIG_FIVE_QUESTIONS,
  MBTI_QUESTIONS,
  ENNEAGRAM_QUESTIONS,
} from '@/data/personalityQuestions';
import type {
  PersonalityAnswer,
  PersonalityAssessment,
  BigFiveResult,
  MBTIResult,
  EnneagramResult,
  PersonalityQuestion,
} from '@/types/personality';

export type PersonalityFramework = 'bigfive' | 'mbti' | 'enneagram' | 'all';

interface UsePersonalityAssessmentOptions {
  candidatoId?: string;
  processoId?: string;
  frameworks: PersonalityFramework[];
}

export function usePersonalityAssessment(options: UsePersonalityAssessmentOptions) {
  const { candidatoId, processoId, frameworks } = options;
  const queryClient = useQueryClient();

  const [currentFramework, setCurrentFramework] = useState<'bigfive' | 'mbti' | 'enneagram'>('bigfive');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PersonalityAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [frameworkStartTime, setFrameworkStartTime] = useState(Date.now());

  // Determinar questões com base no framework atual
  const getQuestionsForFramework = useCallback((fw: 'bigfive' | 'mbti' | 'enneagram'): PersonalityQuestion[] => {
    switch (fw) {
      case 'bigfive': return BIG_FIVE_QUESTIONS;
      case 'mbti': return MBTI_QUESTIONS;
      case 'enneagram': return ENNEAGRAM_QUESTIONS;
    }
  }, []);

  const getAllQuestions = useCallback((): PersonalityQuestion[] => {
    const allFrameworks = frameworks.includes('all') 
      ? ['bigfive', 'mbti', 'enneagram'] as const
      : frameworks.filter(f => f !== 'all') as ('bigfive' | 'mbti' | 'enneagram')[];
    
    return allFrameworks.flatMap(fw => getQuestionsForFramework(fw));
  }, [frameworks, getQuestionsForFramework]);

  const currentQuestions = getQuestionsForFramework(currentFramework);
  const totalQuestionsAll = getAllQuestions().length;

  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  const answeredInCurrentFramework = answers.filter(
    a => currentQuestions.some(q => q.id === a.questionId)
  ).length;

  const totalAnswered = answers.length;
  const progressPercent = (totalAnswered / totalQuestionsAll) * 100;

  // Responder questão
  const answerQuestion = useCallback((value: number, responseTime?: number) => {
    if (!currentQuestion) return;

    const newAnswer: PersonalityAnswer = {
      questionId: currentQuestion.id,
      value,
      responseTime: responseTime || Date.now() - frameworkStartTime,
    };

    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  }, [currentQuestion, frameworkStartTime]);

  // Navegação
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Framework completado, avançar para próximo se houver
      const frameworkOrder: ('bigfive' | 'mbti' | 'enneagram')[] = ['bigfive', 'mbti', 'enneagram'];
      const activeFrameworks = frameworks.includes('all') 
        ? frameworkOrder 
        : frameworkOrder.filter(f => frameworks.includes(f));
      
      const currentIdx = activeFrameworks.indexOf(currentFramework);
      if (currentIdx < activeFrameworks.length - 1) {
        setCurrentFramework(activeFrameworks[currentIdx + 1]!);
        setCurrentQuestionIndex(0);
        setFrameworkStartTime(Date.now());
      }
    }
  }, [currentQuestionIndex, currentQuestions.length, currentFramework, frameworks]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Voltar para framework anterior
      const frameworkOrder: ('bigfive' | 'mbti' | 'enneagram')[] = ['bigfive', 'mbti', 'enneagram'];
      const activeFrameworks = frameworks.includes('all') 
        ? frameworkOrder 
        : frameworkOrder.filter(f => frameworks.includes(f));
      
      const currentIdx = activeFrameworks.indexOf(currentFramework);
      if (currentIdx > 0) {
        const prevFramework = activeFrameworks[currentIdx - 1]!;
        setCurrentFramework(prevFramework);
        const prevQuestions = getQuestionsForFramework(prevFramework);
        setCurrentQuestionIndex(prevQuestions.length - 1);
      }
    }
  }, [currentQuestionIndex, currentFramework, frameworks, getQuestionsForFramework]);

  const goToQuestion = useCallback((framework: 'bigfive' | 'mbti' | 'enneagram', index: number) => {
    setCurrentFramework(framework);
    setCurrentQuestionIndex(index);
  }, []);

  // Verificar se está na última questão
  const isLastQuestion = useCallback(() => {
    const frameworkOrder: ('bigfive' | 'mbti' | 'enneagram')[] = ['bigfive', 'mbti', 'enneagram'];
    const activeFrameworks = frameworks.includes('all') 
      ? frameworkOrder 
      : frameworkOrder.filter(f => frameworks.includes(f));
    
    const isLastFramework = currentFramework === activeFrameworks[activeFrameworks.length - 1];
    const isLastInFramework = currentQuestionIndex === currentQuestions.length - 1;
    
    return isLastFramework && isLastInFramework;
  }, [currentFramework, currentQuestionIndex, currentQuestions.length, frameworks]);

  // Calcular resultados
  const calculateResults = useCallback((): {
    bigFive?: BigFiveResult;
    mbti?: MBTIResult;
    enneagram?: EnneagramResult;
  } => {
    const results: {
      bigFive?: BigFiveResult;
      mbti?: MBTIResult;
      enneagram?: EnneagramResult;
    } = {};

    const shouldCalculate = (fw: 'bigfive' | 'mbti' | 'enneagram') => 
      frameworks.includes('all') || frameworks.includes(fw);

    if (shouldCalculate('bigfive')) {
      const bigFiveAnswers = answers.filter(a => 
        BIG_FIVE_QUESTIONS.some(q => q.id === a.questionId)
      );
      if (bigFiveAnswers.length > 0) {
        results.bigFive = calculateBigFiveResult(bigFiveAnswers);
      }
    }

    if (shouldCalculate('mbti')) {
      const mbtiAnswers = answers.filter(a => 
        MBTI_QUESTIONS.some(q => q.id === a.questionId)
      );
      if (mbtiAnswers.length > 0) {
        results.mbti = calculateMBTIResult(mbtiAnswers);
      }
    }

    if (shouldCalculate('enneagram')) {
      const enneagramAnswers = answers.filter(a => 
        ENNEAGRAM_QUESTIONS.some(q => q.id === a.questionId)
      );
      if (enneagramAnswers.length > 0) {
        results.enneagram = calculateEnneagramResult(enneagramAnswers);
      }
    }

    return results;
  }, [answers, frameworks]);

  // Submeter assessment
  const submitMutation = useMutation({
    mutationFn: async () => {
      const results = calculateResults();
      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      const assessment: PersonalityAssessment = {
        id: crypto.randomUUID(),
        candidatoId,
        processoId,
        frameworks: results,
        answers,
        totalTime,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        overallConsistency: calculateOverallConsistency(results),
      };

      // Salvar no Supabase
      const { error } = await supabase
        .from('behavioral_assessment_results')
        .insert([{
          candidato_id: candidatoId || null,
          processo_id: processoId || null,
          tool_id: 'personality-test',
          tool_name: 'Teste de Personalidade Completo',
          answers: JSON.stringify(answers),
          results: JSON.stringify(results),
          time_spent: totalTime,
          started_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          primary_result: results.mbti?.type || results.enneagram?.coreType?.toString() || null,
          secondary_result: results.bigFive?.dominantTraits?.[0] || null,
          score: results.bigFive?.confidence || results.mbti?.confidence || null,
        }]);

      if (error) throw error;

      return assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['behavioral-assessments'] });
    },
  });

  return {
    // Estado atual
    currentFramework,
    currentQuestionIndex,
    currentQuestion,
    currentQuestions,
    answers,
    
    // Progresso
    answeredInCurrentFramework,
    totalAnswered,
    totalQuestionsAll,
    progressPercent,
    
    // Ações
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    isLastQuestion,
    calculateResults,
    
    // Submissão
    submit: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    
    // Utilitários
    getQuestionsForFramework,
    getAllQuestions,
    setCurrentFramework,
    setCurrentQuestionIndex,
  };
}

function calculateOverallConsistency(results: {
  bigFive?: BigFiveResult;
  mbti?: MBTIResult;
  enneagram?: EnneagramResult;
}): number {
  const scores: number[] = [];
  
  if (results.bigFive?.consistencyScore) scores.push(results.bigFive.consistencyScore);
  if (results.mbti?.consistencyScore) scores.push(results.mbti.consistencyScore);
  if (results.enneagram?.consistencyScore) scores.push(results.enneagram.consistencyScore);
  
  return scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 0;
}
