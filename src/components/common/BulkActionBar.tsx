/**
 * @fileoverview BulkActionBar component for batch operations
 * @module BulkActionBar
 */

import { useState, useCallback, memo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Archive, Mail, Trash2, MoveRight, Tag, 
  MoreHorizontal, X, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulkAction {
  id: string;
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'destructive';
  confirmMessage?: string;
}

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (actionId: string) => Promise<void>;
  actions?: BulkAction[];
  isProcessing?: boolean;
  progress?: number;
}

const defaultActions: BulkAction[] = [
  { id: 'archive', label: 'Arquivar', icon: <Archive className="h-4 w-4" aria-hidden="true" /> },
  { id: 'email', label: 'Enviar Email', icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
  { id: 'move', label: 'Mover para Etapa', icon: <MoveRight className="h-4 w-4" aria-hidden="true" /> },
  { id: 'tag', label: 'Adicionar Tag', icon: <Tag className="h-4 w-4" aria-hidden="true" /> },
  { 
    id: 'delete', 
    label: 'Excluir', 
    icon: <Trash2 className="h-4 w-4" aria-hidden="true" />, 
    variant: 'destructive', 
    confirmMessage: 'Tem certeza que deseja excluir os itens selecionados? Esta ação não pode ser desfeita.' 
  },
];

function BulkActionBarComponent({
  selectedCount,
  onClearSelection,
  onAction,
  actions = defaultActions,
  isProcessing = false,
  progress = 0,
}: BulkActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  const handleAction = useCallback(async (action: BulkAction) => {
    if (action.confirmMessage) {
      setConfirmAction(action);
    } else {
      await onAction(action.id);
    }
  }, [onAction]);

  const handleConfirm = useCallback(async () => {
    if (confirmAction) {
      await onAction(confirmAction.id);
      setConfirmAction(null);
    }
  }, [confirmAction, onAction]);

  const handleCancel = useCallback(() => {
    setConfirmAction(null);
  }, []);

  if (selectedCount === 0) return null;

  const primaryActions = actions.slice(0, 3);
  const moreActions = actions.slice(3);
  const selectionLabel = selectedCount === 1 ? 'selecionado' : 'selecionados';

  return (
    <>
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4"
        role="toolbar"
        aria-label={`Ações em lote - ${selectedCount} itens ${selectionLabel}`}
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium" aria-live="polite">
            {selectedCount} {selectionLabel}
          </span>
          
          <div className="h-6 w-px bg-primary-foreground/20 mx-2" aria-hidden="true" />

          {isProcessing ? (
            <div 
              className="flex items-center gap-2 min-w-[200px]"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso da ação em lote"
            >
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm">{progress}%</span>
            </div>
          ) : (
            <>
              {primaryActions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => handleAction(action)}
                  aria-label={action.label}
                >
                  {action.icon}
                  <span className="ml-1.5 hidden sm:inline">{action.label}</span>
                </Button>
              ))}

              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                      aria-label="Mais ações"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {moreActions.map((action, index) => (
                      <div key={action.id}>
                        {action.variant === 'destructive' && index > 0 && (
                          <DropdownMenuSeparator />
                        )}
                        <DropdownMenuItem
                          onClick={() => handleAction(action)}
                          className={cn(
                            action.variant === 'destructive' && 'text-destructive'
                          )}
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="h-6 w-px bg-primary-foreground/20 mx-2" aria-hidden="true" />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={onClearSelection}
                aria-label="Limpar seleção"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={!!confirmAction} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>
              {confirmAction?.confirmMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="button"
              variant={confirmAction?.variant || 'default'} 
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

BulkActionBarComponent.displayName = 'BulkActionBar';

export const BulkActionBar = memo(BulkActionBarComponent);
export default BulkActionBar;
