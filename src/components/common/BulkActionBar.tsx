import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Archive, Mail, Trash2, MoveRight, Tag, MoreHorizontal, X, CheckCircle2 } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
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
  { id: 'archive', label: 'Arquivar', icon: <Archive className="h-4 w-4" /> },
  { id: 'email', label: 'Enviar Email', icon: <Mail className="h-4 w-4" /> },
  { id: 'move', label: 'Mover para Etapa', icon: <MoveRight className="h-4 w-4" /> },
  { id: 'tag', label: 'Adicionar Tag', icon: <Tag className="h-4 w-4" /> },
  { id: 'delete', label: 'Excluir', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive', confirmMessage: 'Tem certeza que deseja excluir os itens selecionados? Esta ação não pode ser desfeita.' },
];

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onAction,
  actions = defaultActions,
  isProcessing = false,
  progress = 0,
}: BulkActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  if (selectedCount === 0) return null;

  const handleAction = async (action: BulkAction) => {
    if (action.confirmMessage) {
      setConfirmAction(action);
    } else {
      await onAction(action.id);
    }
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await onAction(confirmAction.id);
      setConfirmAction(null);
    }
  };

  const primaryActions = actions.slice(0, 3);
  const moreActions = actions.slice(3);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">{selectedCount} selecionado{selectedCount > 1 ? 's' : ''}</span>
          
          <div className="h-6 w-px bg-primary-foreground/20 mx-2" />

          {isProcessing ? (
            <div className="flex items-center gap-2 min-w-[200px]">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm">{progress}%</span>
            </div>
          ) : (
            <>
              {primaryActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => handleAction(action)}
                >
                  {action.icon}
                  <span className="ml-1.5 hidden sm:inline">{action.label}</span>
                </Button>
              ))}

              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {moreActions.map((action, index) => (
                      <div key={action.id}>
                        {action.variant === 'destructive' && index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={() => handleAction(action)}
                          className={action.variant === 'destructive' ? 'text-destructive' : ''}
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="h-6 w-px bg-primary-foreground/20 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={onClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>{confirmAction?.confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancelar</Button>
            <Button variant={confirmAction?.variant || 'default'} onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BulkActionBar;
