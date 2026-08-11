import { KnockoutQuestion, KnockoutAnswer } from '@/types/knockout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  questions: KnockoutQuestion[];
  answers: Record<string, KnockoutAnswer>;
  onChange: (id: string, value: KnockoutAnswer) => void;
}

export function KnockoutQuestionsForm({ questions, answers, onChange }: Props) {
  if (!questions.length) return null;

  return (
    <div className="space-y-5 border-t pt-5">
      <div>
        <h3 className="font-semibold">Perguntas de triagem</h3>
        <p className="text-xs text-muted-foreground">
          Perguntas específicas desta vaga. Respostas obrigatórias são marcadas com *.
        </p>
      </div>

      {questions.map((q) => {
        const val = answers[q.id];
        const fieldId = `k-${q.id}`;
        return (
          <div key={q.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {q.pergunta} {q.obrigatoria && <span className="text-destructive">*</span>}
            </Label>
            {q.ajuda && <p className="text-xs text-muted-foreground">{q.ajuda}</p>}

            {q.tipo === 'boolean' && (
              <RadioGroup
                id={fieldId}
                value={val === undefined || val === null ? '' : String(val)}
                onValueChange={(v) => onChange(q.id, v === 'true')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id={`${fieldId}-sim`} value="true" />
                  <Label htmlFor={`${fieldId}-sim`} className="font-normal">Sim</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id={`${fieldId}-nao`} value="false" />
                  <Label htmlFor={`${fieldId}-nao`} className="font-normal">Não</Label>
                </div>
              </RadioGroup>
            )}

            {q.tipo === 'select' && q.opcoes && (
              <Select
                value={val ? String(val) : ''}
                onValueChange={(v) => onChange(q.id, v)}
              >
                <SelectTrigger id={fieldId}><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {q.opcoes.map((op) => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {q.tipo === 'number' && (
              <Input
                id={fieldId}
                type="number"
                value={val === null || val === undefined ? '' : String(val)}
                onChange={(e) => onChange(q.id, e.target.value === '' ? null : Number(e.target.value))}
              />
            )}

            {q.tipo === 'text' && (
              <Textarea
                id={fieldId}
                rows={2}
                value={val ? String(val) : ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                maxLength={500}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
