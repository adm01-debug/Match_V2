/**
 * @fileoverview Banco de questões de personalidade — barrel.
 * Frameworks separados em `./personality/*` (bigFive, mbti, enneagram, likert).
 */
import type { PersonalityQuestion } from '@/types/personality';
import { BIG_FIVE_QUESTIONS } from './personality/bigFive';
import { MBTI_QUESTIONS } from './personality/mbti';
import { ENNEAGRAM_QUESTIONS } from './personality/enneagram';

export { BIG_FIVE_QUESTIONS } from './personality/bigFive';
export { MBTI_QUESTIONS } from './personality/mbti';
export { ENNEAGRAM_QUESTIONS } from './personality/enneagram';
export { LIKERT_5, LIKERT_7 } from './personality/likert';

export const ALL_PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  ...BIG_FIVE_QUESTIONS,
  ...MBTI_QUESTIONS,
  ...ENNEAGRAM_QUESTIONS,
];

export function getQuestionsByFramework(
  framework: 'bigfive' | 'mbti' | 'enneagram'
): PersonalityQuestion[] {
  switch (framework) {
    case 'bigfive':
      return BIG_FIVE_QUESTIONS;
    case 'mbti':
      return MBTI_QUESTIONS;
    case 'enneagram':
      return ENNEAGRAM_QUESTIONS;
    default:
      return [];
  }
}

export function shuffleQuestions(questions: PersonalityQuestion[]): PersonalityQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
}
