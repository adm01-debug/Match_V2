import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { notaColorClass } from "./CompetenciasList";

interface NotaGeralCardProps {
  mediaGeral: number;
  mediaTecnica: number;
  mediaComportamental: number;
}

function bgColorClass(nota: number) {
  if (nota >= 8) return "bg-success/15";
  if (nota >= 6) return "bg-warning/15";
  return "bg-destructive/15";
}

export function NotaGeralCard({ mediaGeral, mediaTecnica, mediaComportamental }: NotaGeralCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-warning" />
          Nota Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-center p-6 rounded-lg", bgColorClass(mediaGeral))}>
          <p className={cn("text-5xl font-bold", notaColorClass(mediaGeral))}>
            {(mediaGeral * 10).toFixed(0)}%
          </p>
          <p className="text-sm mt-2 text-muted-foreground">
            Média das competências
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Técnica</span>
            <span className="font-medium">{mediaTecnica.toFixed(1)}</span>
          </div>
          <Progress value={mediaTecnica * 10} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Comportamental</span>
            <span className="font-medium">{mediaComportamental.toFixed(1)}</span>
          </div>
          <Progress value={mediaComportamental * 10} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
