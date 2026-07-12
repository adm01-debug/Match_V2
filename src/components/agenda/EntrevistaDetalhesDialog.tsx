/**
 * @fileoverview EntrevistaDetalhesDialog - shell orquestrador
 */
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Edit, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Entrevista } from '@/data/agendaData';
import { statusConfig } from './entrevistaDetalhes/constants';
import { EditableEntrevista } from './entrevistaDetalhes/types';
import { EntrevistaEditForm } from './entrevistaDetalhes/EntrevistaEditForm';
import { EntrevistaDetailsView } from './entrevistaDetalhes/EntrevistaDetailsView';

interface EntrevistaDetalhesDialogProps {
  entrevista: Entrevista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (entrevista: Entrevista) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
}

const EntrevistaDetalhesDialog = ({
  entrevista, open, onOpenChange, onUpdate, onCancel, onConfirm,
}: EntrevistaDetalhesDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [editData, setEditData] = useState<EditableEntrevista | null>(null);

  if (!entrevista) return null;

  const statusData = statusConfig[entrevista.status as keyof typeof statusConfig] || statusConfig.agendada;
  const canEdit = entrevista.status !== 'realizada' && entrevista.status !== 'cancelada';
  const canConfirm = entrevista.status === 'agendada';

  const handleStartEdit = () => {
    setEditData({ ...entrevista, observacoes: entrevista.notas || '' });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    onUpdate({ ...editData, notas: editData.observacoes });
    toast.success('Entrevista atualizada com sucesso!');
    setIsEditing(false);
    setEditData(null);
  };

  const handleConfirmCancel = () => {
    onCancel(entrevista.id);
    toast.success('Entrevista cancelada');
    setShowCancelDialog(false);
    onOpenChange(false);
  };

  const handleConfirmEntrevista = () => {
    onConfirm(entrevista.id);
    toast.success('Entrevista confirmada!');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => {
        if (!o) { setIsEditing(false); setEditData(null); }
        onOpenChange(o);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{isEditing ? 'Editar Entrevista' : 'Detalhes da Entrevista'}</DialogTitle>
              {!isEditing && (
                <Badge variant="outline" className={cn('ml-2', statusData.color)}>
                  {statusData.label}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {isEditing && editData ? (
            <EntrevistaEditForm editData={editData} setEditData={setEditData} />
          ) : (
            <EntrevistaDetailsView entrevista={entrevista} />
          )}

          <DialogFooter className="gap-2 mt-4">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
                <Button type="button" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 mr-2" />Salvar
                </Button>
              </>
            ) : canEdit && (
              <>
                <Button type="button" variant="destructive" size="sm" onClick={() => setShowCancelDialog(true)} aria-label="Cancelar entrevista">
                  <X className="h-4 w-4 mr-2" />Cancelar
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleStartEdit} aria-label="Editar entrevista">
                  <Edit className="h-4 w-4 mr-2" />Editar
                </Button>
                {canConfirm && (
                  <Button type="button" size="sm" onClick={handleConfirmEntrevista} aria-label="Confirmar entrevista">
                    <Check className="h-4 w-4 mr-2" />Confirmar
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />Cancelar Entrevista
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a entrevista de <strong>{entrevista.candidatoNome}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

EntrevistaDetalhesDialog.displayName = 'EntrevistaDetalhesDialog';

export default EntrevistaDetalhesDialog;
