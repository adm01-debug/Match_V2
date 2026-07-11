import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesFormProps {
  pontosFortes: string;
  pontosDesenvolvimento: string;
  observacoesGerais: string;
  onPontosFortesChange: (v: string) => void;
  onPontosDesenvolvimentoChange: (v: string) => void;
  onObservacoesGeraisChange: (v: string) => void;
}

export function ObservacoesForm({
  pontosFortes,
  pontosDesenvolvimento,
  observacoesGerais,
  onPontosFortesChange,
  onPontosDesenvolvimentoChange,
  onObservacoesGeraisChange,
}: ObservacoesFormProps) {
  return (
    <div className="space-y-4 mt-0">
      <div className="space-y-2">
        <Label>Pontos Fortes</Label>
        <Textarea
          value={pontosFortes}
          onChange={(e) => onPontosFortesChange(e.target.value)}
          placeholder="Descreva os principais pontos fortes do candidato..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Pontos de Desenvolvimento</Label>
        <Textarea
          value={pontosDesenvolvimento}
          onChange={(e) => onPontosDesenvolvimentoChange(e.target.value)}
          placeholder="Áreas que precisam de desenvolvimento..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Observações Gerais</Label>
        <Textarea
          value={observacoesGerais}
          onChange={(e) => onObservacoesGeraisChange(e.target.value)}
          placeholder="Outras observações relevantes..."
          rows={3}
        />
      </div>
    </div>
  );
}
