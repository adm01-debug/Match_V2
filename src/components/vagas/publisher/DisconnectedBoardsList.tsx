import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JobBoard } from './types';

interface DisconnectedBoardsListProps {
  boards: JobBoard[];
}

export function DisconnectedBoardsList({ boards }: DisconnectedBoardsListProps) {
  if (boards.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-muted-foreground flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Disponíveis para conexão
      </h4>
      <div className="grid gap-2">
        {boards.map((board) => (
          <div
            key={board.id}
            className="flex items-center justify-between p-3 rounded-lg border border-dashed opacity-60"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br text-white',
                  board.color,
                )}
              >
                {board.logo}
              </div>
              <span className="font-medium">{board.name}</span>
              {board.isPremium && (
                <Badge variant="outline" className="text-xs">
                  Premium
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              Conectar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
