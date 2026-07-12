/**
 * @fileoverview Assessment types e catálogos (BEHAVIORAL_ASSESSMENTS, BEHAVIORAL_TOOLS)
 */

import type { DISCResult } from './nlpFrameworks';
import type { VAKDResult, MetaprogramResult } from './nlpFrameworks';
import type { MentalTriggerResult, SleightResult } from './persuasion';
import type { EmotionalStateResult, ValuesResult, EQResult } from './emotional';
import type { CognitiveBiasResult, RapportResult } from './cognitive';

export interface BehavioralAssessmentType {
  id: string;
  nome: string;
  descricao: string;
  duracao: number;
  icone: string;
  cor: string;
  ativo: boolean;
}

export const BEHAVIORAL_ASSESSMENTS: BehavioralAssessmentType[] = [
  { id: 'disc', nome: 'DISC', descricao: 'Perfis comportamentais', duracao: 15, icone: 'Users', cor: 'bg-red-500', ativo: true },
  { id: 'vakd', nome: 'VAK/D', descricao: 'Sistemas representacionais', duracao: 10, icone: 'Eye', cor: 'bg-purple-500', ativo: true },
  { id: 'metaprogramas', nome: 'Metaprogramas', descricao: 'Padrões de processamento mental', duracao: 20, icone: 'Brain', cor: 'bg-indigo-500', ativo: true },
  { id: 'gatilhos', nome: 'Gatilhos Mentais', descricao: 'Princípios de persuasão', duracao: 12, icone: 'Zap', cor: 'bg-yellow-500', ativo: true },
  { id: 'sleight', nome: 'Sleight of Mouth', descricao: 'Padrões de reframe', duracao: 15, icone: 'MessageSquare', cor: 'bg-orange-500', ativo: true },
  { id: 'emocional', nome: 'Estados Emocionais', descricao: 'Detecção e gestão de emoções', duracao: 15, icone: 'Heart', cor: 'bg-pink-500', ativo: true },
  { id: 'valores', nome: 'Valores & Critérios', descricao: 'Mapeamento de motivadores', duracao: 12, icone: 'Target', cor: 'bg-green-500', ativo: true },
  { id: 'eq', nome: 'Inteligência Emocional', descricao: '5 Pilares de Goleman', duracao: 25, icone: 'Sparkles', cor: 'bg-cyan-500', ativo: true },
  { id: 'vieses', nome: 'Vieses Cognitivos', descricao: 'Padrões de pensamento', duracao: 15, icone: 'Lightbulb', cor: 'bg-amber-500', ativo: true },
  { id: 'rapport', nome: 'Rapport & Espelhamento', descricao: 'Técnicas de conexão', duracao: 10, icone: 'Handshake', cor: 'bg-teal-500', ativo: true }
];

export interface FullBehavioralProfile {
  readonly candidatoId: string;
  readonly dataAvaliacao: string;
  readonly disc?: DISCResult;
  readonly vakd?: VAKDResult;
  readonly metaprogramas?: MetaprogramResult;
  readonly gatilhosMentais?: MentalTriggerResult;
  readonly sleight?: SleightResult;
  readonly estadosEmocionais?: EmotionalStateResult;
  readonly valores?: ValuesResult;
  readonly eq?: EQResult;
  readonly viesesCognitivos?: CognitiveBiasResult;
  readonly rapport?: RapportResult;
  readonly perfilGeral: string;
  readonly scoreCompatibilidade?: number;
  readonly recomendacaoFinal: 'altamente_recomendado' | 'recomendado' | 'com_ressalvas' | 'nao_recomendado';
}

export interface BehavioralTool {
  id: string;
  name: string;
  description: string;
  color: string;
  estimatedTime: number;
  dimensions: string[];
  questionCount: number;
}

export interface BehavioralQuestion {
  id: string;
  toolId: string;
  text: string;
  dimension: string;
  type: 'scale' | 'forced_choice' | 'situational' | 'ranking';
  options?: {
    text: string;
    dimension: string;
    score: number;
  }[];
  scaleLabels?: {
    min: string;
    max: string;
  };
}

export interface BehavioralResult {
  toolId: string;
  candidatoId?: string;
  completedAt: string;
  timeSpent: number;
  scores: Record<string, number>;
  primaryProfile: string;
  secondaryProfile?: string;
  rawAnswers: Record<string, number | string>;
  confidence?: number;
}

export const BEHAVIORAL_TOOLS: BehavioralTool[] = [
  { id: 'disc', name: 'DISC', description: 'Avalia perfis comportamentais: Dominância, Influência, Estabilidade e Conformidade', color: '#ef4444', estimatedTime: 15, dimensions: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'], questionCount: 8 },
  { id: 'vakd', name: 'VAK/D', description: 'Identifica sistemas representacionais: Visual, Auditivo, Cinestésico e Digital', color: '#8b5cf6', estimatedTime: 10, dimensions: ['Visual', 'Auditivo', 'Cinestésico', 'Digital'], questionCount: 6 },
  { id: 'metaprograms', name: 'Metaprogramas', description: 'Mapeia padrões de processamento mental e tomada de decisão', color: '#6366f1', estimatedTime: 20, dimensions: ['Aproximação', 'Referência', 'Opções', 'Escopo', 'Mudança', 'Iniciativa', 'Afiliação'], questionCount: 8 },
  { id: 'mental_triggers', name: 'Gatilhos Mentais', description: 'Avalia sensibilidade aos princípios de persuasão de Cialdini', color: '#eab308', estimatedTime: 12, dimensions: ['Escassez', 'Autoridade', 'Prova Social', 'Reciprocidade', 'Compromisso', 'Afinidade'], questionCount: 6 },
  { id: 'sleight_of_mouth', name: 'Sleight of Mouth', description: 'Mede habilidade em padrões de reframe linguístico', color: '#f97316', estimatedTime: 15, dimensions: ['Reframe', 'Consequência', 'Contra-exemplo', 'Redefinição', 'Meta-Frame'], questionCount: 3 },
  { id: 'emotional_states', name: 'Estados Emocionais', description: 'Avalia detecção e gestão de emoções e âncoras', color: '#ec4899', estimatedTime: 15, dimensions: ['Autoconsciência', 'Gestão de Estados', 'Empatia', 'Ancoragem', 'Recuperação'], questionCount: 6 },
  { id: 'values', name: 'Valores & Critérios', description: 'Mapeia valores prioritários e critérios de decisão', color: '#22c55e', estimatedTime: 12, dimensions: ['Autonomia', 'Reconhecimento', 'Segurança', 'Crescimento', 'Propósito'], questionCount: 6 },
  { id: 'emotional_intelligence', name: 'Inteligência Emocional', description: 'Avalia os 5 pilares de Goleman: autoconsciência, autorregulação, motivação, empatia e habilidades sociais', color: '#06b6d4', estimatedTime: 25, dimensions: ['Autoconsciência', 'Autorregulação', 'Motivação', 'Empatia', 'Habilidades Sociais'], questionCount: 10 },
  { id: 'cognitive_biases', name: 'Vieses Cognitivos', description: 'Identifica padrões de pensamento e vieses na tomada de decisão', color: '#f59e0b', estimatedTime: 15, dimensions: ['Confirmação', 'Ancoragem', 'Disponibilidade', 'Excesso de Confiança', 'Aversão à Perda'], questionCount: 5 },
  { id: 'rapport', name: 'Rapport & Espelhamento', description: 'Avalia habilidades de conexão, sintonia e espelhamento', color: '#14b8a6', estimatedTime: 10, dimensions: ['Espelhamento Físico', 'Espelhamento Verbal', 'Escuta Ativa', 'Sintonia', 'Flexibilidade'], questionCount: 6 },
  { id: 'generational', name: 'Inteligência Geracional', description: 'Identifica perfil geracional e adapta comunicação, motivadores e estilo de trabalho', color: '#a855f7', estimatedTime: 12, dimensions: ['Silent/Boomer', 'Gen X', 'Millennial', 'Gen Z'], questionCount: 8 },
  { id: 'stress_profile', name: 'Perfil sob Stress', description: 'Avalia como você reage sob pressão e quais gatilhos de stress te afetam', color: '#dc2626', estimatedTime: 10, dimensions: ['Gatilhos', 'Comportamentos', 'Recuperação', 'Riscos'], questionCount: 6 },
  { id: 'triune_brain', name: 'Modelo 3 Cérebros', description: 'Identifica dominância cerebral: Reptiliano (segurança), Límbico (emoção), Neocórtex (lógica)', color: '#0891b2', estimatedTime: 12, dimensions: ['Reptiliano', 'Límbico', 'Neocórtex'], questionCount: 8 },
  { id: 'disc_compatibility', name: 'Compatibilidade DISC', description: 'Analisa compatibilidade entre perfis DISC para prever sinergia e conflitos em equipe', color: '#059669', estimatedTime: 5, dimensions: ['Sinergia', 'Conflitos', 'Comunicação', 'Estilo de Trabalho'], questionCount: 0 }
];
