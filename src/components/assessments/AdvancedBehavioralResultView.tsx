/**
 * @fileoverview Visualização de resultados para ferramentas comportamentais avançadas
 * @module AdvancedBehavioralResultView
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Zap, 
  Brain, 
  AlertTriangle,
  Shield,
  Heart,
  Lightbulb,
  Clock,
  MessageCircle,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  GENERATIONS_INFO, 
  DISC_STRESS_INFO, 
  TRIUNE_BRAIN_INFO,
  type GenerationType,
  type BrainType
} from '@/types/advancedBehavioral';
import type { BehavioralResult } from '@/types/behavioral';

interface AdvancedResultViewProps {
  result: BehavioralResult;
  className?: string;
}

// ============================================
// INTELIGÊNCIA GERACIONAL
// ============================================
export const GenerationalResultView = memo(function GenerationalResultView({ 
  result, 
  className 
}: AdvancedResultViewProps) {
  const generation = result.primaryProfile as GenerationType;
  const info = GENERATIONS_INFO[generation];
  
  if (!info) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Inteligência Geracional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={`${info.cor} text-white text-lg px-4 py-2`}>
            {info.nome}
          </Badge>
          <span className="text-muted-foreground">{info.anos}</span>
        </div>

        <p className="text-muted-foreground">{info.descricao}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Características
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.caracteristicas.map((c, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Motivadores
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.motivadores.map((m, i) => (
                <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              Comunicação Preferida
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.comunicacao.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Como Gerenciar
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.comoGerenciar.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t">
          <h4 className="font-medium mb-2">Canais Preferidos</h4>
          <div className="flex flex-wrap gap-2">
            {info.canaisPreferidos.map((canal, i) => (
              <Badge key={i} variant="default" className="text-xs">{canal}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ============================================
// PERFIL SOB STRESS
// ============================================
export const StressProfileResultView = memo(function StressProfileResultView({ 
  result, 
  className 
}: AdvancedResultViewProps) {
  const discProfile = result.primaryProfile as 'D' | 'I' | 'S' | 'C';
  const info = DISC_STRESS_INFO[discProfile];
  
  if (!info) return null;

  const responseColors = {
    fight: 'bg-red-500',
    flight: 'bg-yellow-500',
    freeze: 'bg-blue-500',
    fawn: 'bg-green-500'
  };

  const responseNames = {
    fight: 'Luta (Fight)',
    flight: 'Fuga (Flight)',
    freeze: 'Paralisia (Freeze)',
    fawn: 'Acomodação (Fawn)'
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Perfil sob Stress - DISC {discProfile}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={`${responseColors[info.respostaPrimaria]} text-white`}>
            Resposta Primária: {responseNames[info.respostaPrimaria]}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Gatilhos de Stress
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.gatilhos.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-500">⚡</span> {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Comportamentos sob Pressão
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.comportamentos.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500">⚠️</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Sinais de Alerta
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.sinaisAlerta.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-500">🔔</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Como Apoiar
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {info.comoApoiar.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t space-y-2">
          <h4 className="font-medium">Comunicação sob Stress</h4>
          <p className="text-sm text-muted-foreground italic">
            "{info.comunicacaoSobStress}"
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            Estratégias de Recuperação
          </h4>
          <div className="flex flex-wrap gap-2">
            {info.recuperacao.map((r, i) => (
              <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ============================================
// MODELO 3 CÉREBROS
// ============================================
export const TriuneBrainResultView = memo(function TriuneBrainResultView({ 
  result, 
  className 
}: AdvancedResultViewProps) {
  const scores = result.scores;
  const reptiliano = scores['reptiliano'] || 0;
  const limbico = scores['limbico'] || 0;
  const neocortex = scores['neocortex'] || 0;
  const total = reptiliano + limbico + neocortex;

  const getPercentage = (value: number) => total > 0 ? Math.round((value / total) * 100) : 33;

  const dominante = result.primaryProfile as BrainType;
  const info = TRIUNE_BRAIN_INFO[dominante];

  if (!info) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Modelo dos 3 Cérebros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={`${info.cor} text-white text-lg px-4 py-2`}>
            Dominante: {info.nome}
          </Badge>
        </div>

        {/* Barras de proporção */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                Reptiliano (Segurança)
              </span>
              <span>{getPercentage(reptiliano)}%</span>
            </div>
            <Progress value={getPercentage(reptiliano)} className="h-3 bg-muted" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-orange-600" />
                Límbico (Emoção)
              </span>
              <span>{getPercentage(limbico)}%</span>
            </div>
            <Progress value={getPercentage(limbico)} className="h-3 bg-muted" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Neocórtex (Lógica)
              </span>
              <span>{getPercentage(neocortex)}%</span>
            </div>
            <Progress value={getPercentage(neocortex)} className="h-3 bg-muted" />
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Foco principal:</strong> {info.foco}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Motivadores
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.motivadores.map((m, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Gatilhos Efetivos
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.gatilhos.map((g, i) => (
                <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            Como Comunicar
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {info.comunicacao.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t space-y-2">
          <h4 className="font-medium">Abordagem Recomendada</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {info.abordagemVenda.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500">✓</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});

export default {
  GenerationalResultView,
  StressProfileResultView,
  TriuneBrainResultView
};
