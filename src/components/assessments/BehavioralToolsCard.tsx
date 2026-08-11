/**
 * @fileoverview Card exibindo as 10 ferramentas de comportamento humano
 */

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Eye, Brain, Zap, MessageSquare, Heart, 
  Target, Sparkles, Lightbulb, Handshake, Play, Clock
} from 'lucide-react';
import { BEHAVIORAL_ASSESSMENTS } from '@/types/behavioral';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Users, Eye, Brain, Zap, MessageSquare, Heart, 
  Target, Sparkles, Lightbulb, Handshake
};

interface BehavioralToolsCardProps {
  onStartAssessment?: (assessmentId: string) => void;
  completedAssessments?: string[];
  className?: string;
}

export const BehavioralToolsCard = memo(function BehavioralToolsCard({
  onStartAssessment,
  completedAssessments = [],
  className
}: BehavioralToolsCardProps) {
  const totalDuration = BEHAVIORAL_ASSESSMENTS.reduce((acc, a) => acc + a.duracao, 0);
  const completedCount = completedAssessments.length;
  const progressPercent = (completedCount / BEHAVIORAL_ASSESSMENTS.length) * 100;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              10 Ferramentas de Comportamento Humano
            </CardTitle>
            <CardDescription>
              Avaliações profundas para conhecer o candidato além do currículo
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {totalDuration} min total
          </Badge>
        </div>
        
        {completedCount > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{completedCount}/{BEHAVIORAL_ASSESSMENTS.length}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {BEHAVIORAL_ASSESSMENTS.map((assessment) => {
            const Icon = iconMap[assessment.icone] || Brain;
            const isCompleted = completedAssessments.includes(assessment.id);
            
            return (
              <div
                key={assessment.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  isCompleted 
                    ? "bg-primary/5 border-primary/20" 
                    : "hover:bg-muted/50 hover:border-muted-foreground/20"
                )}
              >
                <div className={cn("p-2 rounded-lg", assessment.cor)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{assessment.nome}</h4>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {assessment.descricao}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {assessment.duracao}min
                  </span>
                  {onStartAssessment && !isCompleted && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => onStartAssessment(assessment.id)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

export default BehavioralToolsCard;
