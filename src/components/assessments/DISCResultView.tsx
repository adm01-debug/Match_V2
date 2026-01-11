/**
 * @module DISCResultView
 * @description Visualização dos resultados do assessment DISC
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { DISCResultado } from '@/types/selection';
import { DISC_PROFILES } from '@/types/selection';

interface DISCResultViewProps {
  resultado: DISCResultado;
  candidatoNome?: string;
  showDetails?: boolean;
}

const DISC_COLORS = {
  D: 'bg-red-500',
  I: 'bg-yellow-500',
  S: 'bg-green-500',
  C: 'bg-blue-500',
};

const DISC_TEXT_COLORS = {
  D: 'text-red-600',
  I: 'text-yellow-600',
  S: 'text-green-600',
  C: 'text-blue-600',
};

export function DISCResultView({ resultado, candidatoNome, showDetails = true }: DISCResultViewProps) {
  const primaryProfile = DISC_PROFILES[resultado.perfilPrimario];
  const secondaryProfile = resultado.perfilSecundario ? DISC_PROFILES[resultado.perfilSecundario] : null;

  const scores = [
    { key: 'D' as const, label: 'Dominância', value: resultado.dominancia },
    { key: 'I' as const, label: 'Influência', value: resultado.influencia },
    { key: 'S' as const, label: 'Estabilidade', value: resultado.estabilidade },
    { key: 'C' as const, label: 'Conformidade', value: resultado.conformidade },
  ];

  return (
    <div className="space-y-6">
      {/* Header com Perfil Principal */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${DISC_COLORS[resultado.perfilPrimario]} text-white`}>
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Perfil DISC {candidatoNome && `- ${candidatoNome}`}
                </CardTitle>
                <CardDescription className="mt-1">
                  {resultado.descricao}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Perfis */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`${DISC_COLORS[resultado.perfilPrimario]} text-white text-lg px-4 py-2`}>
              {resultado.perfilPrimario} - {primaryProfile.nome}
              <span className="ml-2 opacity-75">(Primário)</span>
            </Badge>
            {secondaryProfile && (
              <Badge variant="outline" className={`${DISC_TEXT_COLORS[resultado.perfilSecundario!]} border-2 text-lg px-4 py-2`}>
                {resultado.perfilSecundario} - {secondaryProfile.nome}
                <span className="ml-2 opacity-50">(Secundário)</span>
              </Badge>
            )}
          </div>

          {/* Barras de Score */}
          <div className="space-y-4">
            {scores.map(score => (
              <div key={score.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${DISC_TEXT_COLORS[score.key]}`}>
                    {score.key} - {score.label}
                  </span>
                  <span className="font-bold">{score.value}%</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${DISC_COLORS[score.key]} rounded-full transition-all duration-500`}
                    style={{ width: `${score.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Pontos Fortes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.pontosFortes.map((ponto, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    {ponto}
                  </li>
                ))}
                {primaryProfile.pontosFortes.slice(0, 2).map((ponto, idx) => (
                  <li key={`profile-${idx}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-300" />
                    {ponto}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Áreas de Desenvolvimento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Áreas de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.areasDesenvolvimento.map((area, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    {area}
                  </li>
                ))}
                {primaryProfile.desafios.slice(0, 2).map((desafio, idx) => (
                  <li key={`desafio-${idx}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-orange-300" />
                    {desafio}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Descrição do Perfil */}
      {showDetails && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Descrição do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg border-l-4 ${DISC_COLORS[resultado.perfilPrimario].replace('bg-', 'border-')}`}>
              <h4 className="font-semibold mb-2">
                {resultado.perfilPrimario} - {primaryProfile.nome}
              </h4>
              <p className="text-sm text-muted-foreground">
                {primaryProfile.descricao}
              </p>
            </div>
            {secondaryProfile && (
              <div className={`p-4 rounded-lg border-l-4 ${DISC_COLORS[resultado.perfilSecundario!].replace('bg-', 'border-')} opacity-75`}>
                <h4 className="font-semibold mb-2">
                  {resultado.perfilSecundario} - {secondaryProfile.nome}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {secondaryProfile.descricao}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
