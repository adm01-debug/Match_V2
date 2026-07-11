/**
 * @fileoverview Cabeçalho do Player Comportamental com progresso e cronômetro.
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BehavioralTool } from '@/types/behavioral';

interface BehavioralPlayerHeaderProps {
  tool: BehavioralTool;
  icon: ReactNode;
  timeElapsed: number;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function BehavioralPlayerHeader({
  tool,
  icon,
  timeElapsed,
  currentIndex,
  totalQuestions,
  progress,
}: BehavioralPlayerHeaderProps) {
  return (
    <Card className="border-2" style={{ borderColor: tool.color }}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl text-white" style={{ backgroundColor: tool.color }}>
              {icon}
            </div>
            <div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeElapsed)}
            </Badge>
            <Badge variant="secondary">
              {currentIndex + 1} de {totalQuestions}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
    </Card>
  );
}
