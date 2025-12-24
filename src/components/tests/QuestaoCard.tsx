import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Questao } from '@/types/tests';
import { Edit, Trash2, GripVertical, Check, X, FileText, ToggleLeft, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestaoCardProps {
  questao: Questao;
  index: number;
  onEdit: (questao: Questao) => void;
  onDelete: (questao: Questao) => void;
  showAnswer?: boolean;
}

const tipoIcons = {
  multipla_escolha: FileText,
  dissertativa: MessageSquare,
  verdadeiro_falso: ToggleLeft,
  pratica: FileText
};

const tipoLabels = {
  multipla_escolha: 'Múltipla Escolha',
  dissertativa: 'Dissertativa',
  verdadeiro_falso: 'V/F',
  pratica: 'Prática'
};

const dificuldadeConfig = {
  facil: { label: 'Fácil', color: 'bg-green-500/10 text-green-600 border-green-500/30' },
  medio: { label: 'Médio', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
  dificil: { label: 'Difícil', color: 'bg-red-500/10 text-red-600 border-red-500/30' }
};

export function QuestaoCard({ questao, index, onEdit, onDelete, showAnswer = true }: QuestaoCardProps) {
  const TipoIcon = tipoIcons[questao.tipo];
  const dificuldade = dificuldadeConfig[questao.dificuldade];

  return (
    <Card role="article" aria-label="Questão" className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div data-testid="questao-card" className="flex gap-3">
          {/* Drag handle & Number */}
          <div className="flex flex-col items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {index + 1}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                <TipoIcon className="h-3 w-3 mr-1" />
                {tipoLabels[questao.tipo]}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", dificuldade.color)}>
                {dificuldade.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {questao.pontuacao} pts
              </Badge>
            </div>

            {/* Enunciado */}
            <p className="text-sm">{questao.enunciado}</p>

            {/* Alternativas */}
            {(questao.tipo === 'multipla_escolha' || questao.tipo === 'verdadeiro_falso') && 
              questao.alternativas && (
              <div className="space-y-1.5 pl-2">
                {questao.alternativas.map((alt, altIndex) => {
                  const isCorrect = showAnswer && questao.respostaCorreta === altIndex;
                  return (
                    <div 
                      key={altIndex}
                      className={cn(
                        "flex items-center gap-2 text-sm py-1 px-2 rounded",
                        isCorrect && "bg-green-500/10"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0",
                        isCorrect 
                          ? "border-green-500 bg-green-500 text-white" 
                          : "border-muted-foreground/30"
                      )}>
                        {isCorrect ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + altIndex)}
                      </span>
                      <span className={cn(isCorrect && "font-medium text-green-600")}>
                        {alt}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Info for dissertativa/pratica */}
            {(questao.tipo === 'dissertativa' || questao.tipo === 'pratica') && (
              <p className="text-xs text-muted-foreground italic">
                {questao.tipo === 'dissertativa' 
                  ? 'Resposta dissertativa - correção manual'
                  : 'Questão prática - entrega de arquivo'
                }
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onEdit(questao)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(questao)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
