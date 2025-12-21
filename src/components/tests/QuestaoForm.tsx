import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Questao } from '@/types/tests';
import { Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestaoFormProps {
  questao?: Questao;
  onSave: (questao: Questao) => void;
  onCancel: () => void;
}

const tipoLabels = {
  multipla_escolha: 'Múltipla Escolha',
  dissertativa: 'Dissertativa',
  verdadeiro_falso: 'Verdadeiro/Falso',
  pratica: 'Prática'
};

const dificuldadeLabels = {
  facil: { label: 'Fácil', color: 'bg-green-500' },
  medio: { label: 'Médio', color: 'bg-yellow-500' },
  dificil: { label: 'Difícil', color: 'bg-red-500' }
};

export function QuestaoForm({ questao, onSave, onCancel }: QuestaoFormProps) {
  const [tipo, setTipo] = useState<Questao['tipo']>(questao?.tipo || 'multipla_escolha');
  const [enunciado, setEnunciado] = useState(questao?.enunciado || '');
  const [alternativas, setAlternativas] = useState<string[]>(
    questao?.alternativas || ['', '', '', '']
  );
  const [respostaCorreta, setRespostaCorreta] = useState<string | number>(
    questao?.respostaCorreta ?? 0
  );
  const [pontuacao, setPontuacao] = useState(questao?.pontuacao || 5);
  const [dificuldade, setDificuldade] = useState<Questao['dificuldade']>(
    questao?.dificuldade || 'medio'
  );

  const handleAddAlternativa = () => {
    if (alternativas.length < 6) {
      setAlternativas([...alternativas, '']);
    }
  };

  const handleRemoveAlternativa = (index: number) => {
    if (alternativas.length > 2) {
      const newAlternativas = alternativas.filter((_, i) => i !== index);
      setAlternativas(newAlternativas);
      if (typeof respostaCorreta === 'number' && respostaCorreta >= index) {
        setRespostaCorreta(Math.max(0, respostaCorreta - 1));
      }
    }
  };

  const handleAlternativaChange = (index: number, value: string) => {
    const newAlternativas = [...alternativas];
    newAlternativas[index] = value;
    setAlternativas(newAlternativas);
  };

  const handleSave = () => {
    const newQuestao: Questao = {
      id: questao?.id || `q-${Date.now()}`,
      enunciado,
      tipo,
      pontuacao,
      dificuldade,
      ...(tipo === 'multipla_escolha' && {
        alternativas: alternativas.filter(a => a.trim() !== ''),
        respostaCorreta: respostaCorreta as number
      }),
      ...(tipo === 'verdadeiro_falso' && {
        alternativas: ['Verdadeiro', 'Falso'],
        respostaCorreta: respostaCorreta as number
      })
    };
    onSave(newQuestao);
  };

  const isValid = enunciado.trim() !== '' && 
    (tipo === 'dissertativa' || tipo === 'pratica' || 
     (tipo === 'multipla_escolha' && alternativas.filter(a => a.trim()).length >= 2) ||
     tipo === 'verdadeiro_falso');

  return (
    <div className="space-y-6">
      {/* Tipo de questão */}
      <div className="space-y-2">
        <Label>Tipo de Questão</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(tipoLabels) as Questao['tipo'][]).map((t) => (
            <Button
              key={t}
              type="button"
              variant={tipo === t ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => setTipo(t)}
            >
              {tipoLabels[t]}
            </Button>
          ))}
        </div>
      </div>

      {/* Enunciado */}
      <div className="space-y-2">
        <Label>Enunciado da Questão *</Label>
        <Textarea
          placeholder="Digite o enunciado da questão..."
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
          rows={4}
        />
      </div>

      {/* Alternativas - Múltipla Escolha */}
      {tipo === 'multipla_escolha' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Alternativas</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAlternativa}
              disabled={alternativas.length >= 6}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {alternativas.map((alt, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => setRespostaCorreta(index)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                      respostaCorreta === index 
                        ? "border-green-500 bg-green-500 text-white" 
                        : "border-muted-foreground/30 hover:border-green-500"
                    )}
                  >
                    {respostaCorreta === index && <Check className="h-4 w-4" />}
                  </button>
                  <span className="text-sm text-muted-foreground w-6">
                    {String.fromCharCode(65 + index)})
                  </span>
                  <Input
                    placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                    value={alt}
                    onChange={(e) => handleAlternativaChange(index, e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAlternativa(index)}
                  disabled={alternativas.length <= 2}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Clique no círculo para marcar a resposta correta
          </p>
        </div>
      )}

      {/* Alternativas - Verdadeiro/Falso */}
      {tipo === 'verdadeiro_falso' && (
        <div className="space-y-3">
          <Label>Resposta Correta</Label>
          <RadioGroup
            value={String(respostaCorreta)}
            onValueChange={(v) => setRespostaCorreta(Number(v))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="verdadeiro" />
              <Label htmlFor="verdadeiro" className="cursor-pointer">Verdadeiro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="falso" />
              <Label htmlFor="falso" className="cursor-pointer">Falso</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Dissertativa - Orientações */}
      {(tipo === 'dissertativa' || tipo === 'pratica') && (
        <Card role="article" aria-label="Formulário questão" className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              {tipo === 'dissertativa' 
                ? 'Questões dissertativas serão corrigidas manualmente pelo avaliador.'
                : 'Questões práticas requerem entrega de arquivo ou código para correção.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pontuação e Dificuldade */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pontuação</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={pontuacao}
            onChange={(e) => setPontuacao(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Dificuldade</Label>
          <Select value={dificuldade} onValueChange={(v) => setDificuldade(v as Questao['dificuldade'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {(Object.entries(dificuldadeLabels) as [Questao['dificuldade'], typeof dificuldadeLabels.facil][]).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", info.color)} />
                    {info.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!isValid}>
          {questao ? 'Salvar Alterações' : 'Adicionar Questão'}
        </Button>
      </div>
    </div>
  );
}
