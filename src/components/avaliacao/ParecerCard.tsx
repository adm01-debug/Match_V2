import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParecerCardProps {
  parecer: string;
  recomendacao: string;
  onParecerChange: (v: string) => void;
  onRecomendacaoChange: (v: string) => void;
}

export function ParecerCard({ parecer, recomendacao, onParecerChange, onRecomendacaoChange }: ParecerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parecer Final</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={parecer === "aprovar" ? "default" : "outline"}
            className={cn(
              "w-full",
              parecer === "aprovar" && "bg-success text-success-foreground hover:bg-success/90"
            )}
            onClick={() => onParecerChange("aprovar")}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
          <Button
            type="button"
            variant={parecer === "reprovar" ? "default" : "outline"}
            className={cn(
              "w-full",
              parecer === "reprovar" && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
            onClick={() => onParecerChange("reprovar")}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reprovar
          </Button>
        </div>
        <Button
          type="button"
          variant={parecer === "em_duvida" ? "default" : "outline"}
          className="w-full"
          onClick={() => onParecerChange("em_duvida")}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Em Dúvida
        </Button>
        <div className="space-y-2">
          <Label>Recomendação</Label>
          <Textarea
            value={recomendacao}
            onChange={(e) => onRecomendacaoChange(e.target.value)}
            placeholder="Próximos passos recomendados..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
