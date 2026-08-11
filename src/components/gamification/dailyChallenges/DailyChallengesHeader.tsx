import { memo } from "react";
import { Clock, Flame, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  completed: number;
  total: number;
  timeUntilReset: string;
  availableXP: number;
}

export const DailyChallengesHeader = memo(function DailyChallengesHeader({
  completed,
  total,
  timeUntilReset,
  availableXP,
}: Props) {
  return (
    <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-warning to-warning/70 shadow-lg">
            <Target className="w-5 h-5 text-warning-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Desafios Diários
              <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
                <Flame className="w-3 h-3 mr-1" />
                {completed}/{total}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              Renova em {timeUntilReset}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">XP Disponível</p>
          <p className="text-xl font-bold text-warning flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            {availableXP}
          </p>
        </div>
      </div>
    </CardHeader>
  );
});
