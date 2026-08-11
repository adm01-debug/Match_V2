/**
 * @fileoverview Ícones associados a cada ferramenta comportamental.
 */

import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Brain,
  Eye,
  Heart,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export const TOOL_ICONS: Record<string, ReactNode> = {
  disc: <Brain className="h-6 w-6" />,
  vakd: <Eye className="h-6 w-6" />,
  metaprograms: <Lightbulb className="h-6 w-6" />,
  mental_triggers: <Zap className="h-6 w-6" />,
  sleight_of_mouth: <MessageSquare className="h-6 w-6" />,
  emotional_states: <Heart className="h-6 w-6" />,
  values: <Target className="h-6 w-6" />,
  emotional_intelligence: <Sparkles className="h-6 w-6" />,
  cognitive_biases: <AlertTriangle className="h-6 w-6" />,
  rapport: <Users className="h-6 w-6" />,
  generational: <Users className="h-6 w-6" />,
  stress_profile: <Zap className="h-6 w-6" />,
  triune_brain: <Brain className="h-6 w-6" />,
  disc_compatibility: <Users className="h-6 w-6" />,
};
