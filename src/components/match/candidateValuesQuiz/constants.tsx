import {
  Sparkles, Heart, User, Lightbulb, Users, Award, Eye, Leaf, Zap, Compass,
  GraduationCap, Shield, Flame, Mountain, Scale, Trophy, Rocket, Palette, Target,
} from 'lucide-react';
import type { ReactNode } from 'react';

export const iconMap: Record<string, ReactNode> = {
  Lightbulb: <Lightbulb className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
  Eye: <Eye className="h-6 w-6" />,
  Rainbow: <Sparkles className="h-6 w-6" />,
  Leaf: <Leaf className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Compass: <Compass className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Mountain: <Mountain className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Trophy: <Trophy className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Building: <User className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />,
};

export const intensidadeLabels = [
  { valor: 1, label: 'Não me representa', emoji: '😕', color: 'from-gray-400 to-gray-500' },
  { valor: 2, label: 'Pouco importante', emoji: '🤷', color: 'from-yellow-400 to-orange-400' },
  { valor: 3, label: 'Importante', emoji: '👍', color: 'from-blue-400 to-cyan-400' },
  { valor: 4, label: 'Muito importante', emoji: '💪', color: 'from-green-400 to-emerald-400' },
  { valor: 5, label: 'Essencial para mim', emoji: '❤️‍🔥', color: 'from-pink-500 to-rose-500' },
];
