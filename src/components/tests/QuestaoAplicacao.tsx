import { memo , memo} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Questao } from '@/types/tests';
import { cn } from '@/lib/utils';
import { FileText, ToggleLeft, MessageSquare, CheckCircle } from 'lucide-react';

interface QuestaoAplicacaoProps {
  questao: Questao;
  index: number;
  totalQuestoes: number;
  resposta: string | number | null;
  onResponder: (resposta: string | number) => void;
  isRevisao?: boolean;
}

const dificuldadeConfig = {
  facil: { label: 'Fácil', color: 'bg-green-500/10 text-green-600' },
  medio: { label: 'Médio', color: 'bg-yellow-500/10 text-yellow-600' },
  dificil: { label: 'Difícil', color: 'bg-red-500/10 text-red-600' }
};

export function QuestaoAplicacao({ 
  questao, 
  index, 
  totalQuestoes, 
  resposta, 
  onResponder,
  isRevisao = false 
}: QuestaoAplicacaoProps) {
  const dificuldade = dificuldadeConfig[questao.dificuldade];
  const respondida = resposta !== null && resposta !== '';

  return (
    <Card role="article" aria-label="Aplicação questão" className={cn(
      "transition-all",
      respondida && "ring-2 ring-green-500/30"
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div data-testid="questao-aplicacao" className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              {index + 1}
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Questão {index + 1} de {totalQuestoes}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", dificuldade.color)}>
                  {dificuldade.label}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {questao.pontuacao} pts
                </Badge>
              </div>
            </div>
          </div>
          {respondida && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Respondida
            </div>
          )}
        </div>

        {/* Enunciado */}
        <p className="text-base mb-6 leading-relaxed">{questao.enunciado}</p>

        {/* Alternativas - Múltipla Escolha */}
        {questao.tipo === 'multipla_escolha' && questao.alternativas && (
          <RadioGroup
            value={resposta !== null ? String(resposta) : ''}
            onValueChange={(v) => onResponder(Number(v))}
            disabled={isRevisao}
            className="space-y-3"
          >
            {questao.alternativas.map((alt, altIndex) => (
              <div
                key={altIndex}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  resposta === altIndex 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={() => !isRevisao && onResponder(altIndex)}
              >
                <RadioGroupItem value={String(altIndex)} id={`q${index}-a${altIndex}`} />
                <Label 
                  htmlFor={`q${index}-a${altIndex}`} 
                  className="flex-1 cursor-pointer text-sm"
                >
                  <span className="font-medium text-muted-foreground mr-2">
                    {String.fromCharCode(65 + altIndex)})
                  </span>
                  {alt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* Alternativas - Verdadeiro/Falso */}
        {questao.tipo === 'verdadeiro_falso' && (
          <RadioGroup
            value={resposta !== null ? String(resposta) : ''}
            onValueChange={(v) => onResponder(Number(v))}
            disabled={isRevisao}
            className="flex gap-4"
          >
            {['Verdadeiro', 'Falso'].map((alt, altIndex) => (
              <div
                key={altIndex}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 p-4 rounded-lg border transition-colors cursor-pointer",
                  resposta === altIndex 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={() => !isRevisao && onResponder(altIndex)}
              >
                <RadioGroupItem value={String(altIndex)} id={`q${index}-vf${altIndex}`} />
                <Label 
                  htmlFor={`q${index}-vf${altIndex}`} 
                  className="cursor-pointer font-medium"
                >
                  {alt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* Dissertativa */}
        {(questao.tipo === 'dissertativa' || questao.tipo === 'pratica') && (
          <div className="space-y-2">
            <Textarea
              placeholder={
                questao.tipo === 'dissertativa' 
                  ? "Digite sua resposta aqui..." 
                  : "Cole seu código ou descreva sua solução..."
              }
              value={resposta as string || ''}
              onChange={(e) => onResponder(e.target.value)}
              disabled={isRevisao}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {questao.tipo === 'dissertativa' 
                ? 'Esta questão será corrigida manualmente pelo avaliador.'
                : 'Esta questão prática será avaliada posteriormente.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
