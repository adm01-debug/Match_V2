import { useState, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2, Check, X } from 'lucide-react';

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  requireConfirmation?: boolean;
  confirmationText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  requireConfirmation = false,
  confirmationText,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = isLoading || internalLoading;
  const isConfirmDisabled = requireConfirmation && inputValue !== confirmationText;

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
      setInputValue('');
      onOpenChange?.(false);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    setInputValue('');
    onCancel?.();
    onOpenChange?.(false);
  };

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-6 w-6 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-warning" />;
      default:
        return <Check className="h-6 w-6 text-primary" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive' as const;
      case 'warning':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              variant === 'destructive' ? 'bg-destructive' :
              variant === 'warning' ? 'bg-warning' : 'bg-primary/10'
            }`}>
              {getIcon()}
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          {description && (
            <AlertDialogDescription className="pt-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {requireConfirmation && confirmationText && (
          <div className="py-4 space-y-2">
            <Label htmlFor="confirmation">
              Digite <span className="font-mono font-semibold">{confirmationText}</span> para confirmar:
            </Label>
            <Input
              id="confirmation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationText}
              disabled={loading}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled || loading}
            className={getConfirmButtonVariant() === 'destructive' ? 'bg-destructive hover:bg-destructive' : ''}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processando...
              </span>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook para usar confirm dialog programaticamente
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>;
  }>({
    open: false,
    props: { title: '', onConfirm: () => {} },
  });

  const confirm = (props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm?.();
            resolve(true);
          },
          onCancel: () => {
            props.onCancel?.();
            resolve(false);
          },
        },
      });
    });
  };

  const Dialog = () => (
    <ConfirmDialog
      open={dialogState.open}
      onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      {...dialogState.props}
    />
  );

  return { confirm, Dialog };
}
