/**
 * @fileoverview Componente de alertas de Red Flags
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  HelpCircle,
  Shield,
  MessageSquare
} from 'lucide-react';
import type { RedFlagDetectado } from '@/types/jobFit';
import { getRedFlagSeveridadeInfo } from '@/types/jobFit';

interface RedFlagsAlertProps {
  redFlags: RedFlagDetectado[];
  candidatoNome: string;
  showInterviewQuestions?: boolean;
  compact?: boolean;
}

function getSeveridadeIcon(severidade: RedFlagDetectado['severidade']) {
  switch (severidade) {
    case 'critico': return <AlertOctagon className="h-5 w-5" />;
    case 'alto': return <AlertTriangle className="h-5 w-5" />;
    case 'medio': return <AlertCircle className="h-5 w-5" />;
    case 'baixo': return <Info className="h-5 w-5" />;
  }
}

function getCategoriaIcon(categoria: RedFlagDetectado['categoria']) {
  switch (categoria) {
    case 'comportamental': return '🧠';
    case 'resiliencia': return '💪';
    case 'compatibilidade': return '🎯';
    case 'consistencia': return '🔄';
    case 'stress': return '⚡';
    case 'cultural': return '🏢';
  }
}

export function RedFlagsAlert({ 
  redFlags, 
  candidatoNome,
  showInterviewQuestions = true,
  compact = false
}: RedFlagsAlertProps) {
  if (redFlags.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3 text-green-700">
            <Shield className="h-5 w-5" />
            <span className="font-medium">
              Nenhum risco comportamental identificado para {candidatoNome}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticos = redFlags.filter(f => f.severidade === 'critico');
  const altos = redFlags.filter(f => f.severidade === 'alto');
  const medios = redFlags.filter(f => f.severidade === 'medio');
  const baixos = redFlags.filter(f => f.severidade === 'baixo');

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {criticos.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertOctagon className="h-3 w-3" />
            {criticos.length} crítico(s)
          </Badge>
        )}
        {altos.length > 0 && (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {altos.length} alto(s)
          </Badge>
        )}
        {medios.length > 0 && (
          <Badge className="bg-yellow-500 text-yellow-900 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {medios.length} médio(s)
          </Badge>
        )}
        {baixos.length > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            {baixos.length} baixo(s)
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Risco - {candidatoNome}
          </div>
          <div className="flex gap-2">
            {criticos.length > 0 && (
              <Badge variant="destructive">{criticos.length} crítico</Badge>
            )}
            {altos.length > 0 && (
              <Badge className="bg-orange-500">{altos.length} alto</Badge>
            )}
            {medios.length > 0 && (
              <Badge className="bg-yellow-500 text-yellow-900">{medios.length} médio</Badge>
            )}
            {baixos.length > 0 && (
              <Badge variant="secondary">{baixos.length} baixo</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {redFlags.map((flag, index) => {
          const info = getRedFlagSeveridadeInfo(flag.severidade);
          
          return (
            <Collapsible key={index}>
              <div className={`p-3 rounded-lg border ${info.cor}`}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-start justify-between cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getSeveridadeIcon(flag.severidade)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{flag.ruleName}</span>
                          <span className="text-lg">{getCategoriaIcon(flag.categoria)}</span>
                        </div>
                        <p className="text-sm opacity-80 mt-1">{flag.mensagem}</p>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-4 pt-3 border-t border-current/20 space-y-3">
                    {/* Recomendação */}
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium uppercase opacity-70">Recomendação</span>
                        <p className="text-sm">{flag.recomendacao}</p>
                      </div>
                    </div>

                    {/* Perguntas para entrevista */}
                    {showInterviewQuestions && flag.perguntasEntrevista.length > 0 && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium uppercase opacity-70">
                            Perguntas Sugeridas para Entrevista
                          </span>
                          <ul className="text-sm mt-1 space-y-1">
                            {flag.perguntasEntrevista.map((pergunta, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-muted-foreground">•</span>
                                <span>{pergunta}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}

        {/* Resumo de ações */}
        {criticos.length > 0 && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg mt-4">
            <div className="flex items-center gap-2 text-red-800 font-medium">
              <AlertOctagon className="h-4 w-4" />
              Ação Requerida
            </div>
            <p className="text-sm text-red-700 mt-1">
              Existem {criticos.length} alerta(s) crítico(s) que devem ser avaliados antes de 
              prosseguir com este candidato. Recomenda-se aprofundar estes pontos em entrevista 
              comportamental estruturada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
