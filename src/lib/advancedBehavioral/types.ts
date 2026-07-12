import type { BehavioralResult } from '@/types/behavioral';
import type { GenerationType, BrainType, StressResponse } from '@/types/advancedBehavioral';

export interface GenerationalResult extends BehavioralResult {
  generationType: GenerationType;
  confidence: number;
  secondaryGeneration?: GenerationType;
  generationScores: Record<string, number>;
}

export interface StressProfileResult extends BehavioralResult {
  discProfile: 'D' | 'I' | 'S' | 'C';
  stressResponse: StressResponse;
  stressIntensity: number;
  vulnerabilityAreas: string[];
  resilience: number;
}

export interface TriuneBrainResult extends BehavioralResult {
  dominant: BrainType;
  secondary: BrainType;
  reptilianoScore: number;
  limbicoScore: number;
  neocortexScore: number;
  balance: 'balanced' | 'dominated' | 'dual';
  decisionStyle: string;
}

export interface CrossFrameworkAnalysis {
  discProfile?: 'D' | 'I' | 'S' | 'C';
  generationType?: GenerationType;
  stressResponse?: StressResponse;
  dominantBrain?: BrainType;
  synergies: string[];
  tensions: string[];
  recommendations: string[];
  overallConsistency: number;
  communicationStrategy: string;
  managementApproach: string;
}
