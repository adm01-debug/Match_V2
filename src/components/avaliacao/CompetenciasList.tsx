import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface NotaCompetencia {
  id: string;
  nome: string;
  tipo: string;
  nota: number;
}

interface CompetenciasListProps {
  notas: NotaCompetencia[];
  media: number;
  mediaLabel: string;
  onChange: (compId: string, nota: number) => void;
}

export function notaColorClass(nota: number) {
  if (nota >= 8) return "text-success";
  if (nota >= 6) return "text-warning";
  return "text-destructive";
}

export function CompetenciasList({ notas, media, mediaLabel, onChange }: CompetenciasListProps) {
  return (
    <div className="space-y-6 mt-0">
      {notas.map((comp) => (
        <div key={comp.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{comp.nome}</Label>
            <span className={cn("font-bold", notaColorClass(comp.nota))}>
              {comp.nota}/10
            </span>
          </div>
          <Slider
            value={[comp.nota]}
            onValueChange={([value]) => onChange(comp.id, value ?? 5)}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
        </div>
      ))}
      <Separator />
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium">{mediaLabel}:</span>
        <span className={cn("font-bold", notaColorClass(media))}>
          {media.toFixed(1)}/10
        </span>
      </div>
    </div>
  );
}
