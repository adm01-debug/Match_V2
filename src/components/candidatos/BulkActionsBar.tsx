/**
 * Bulk Actions Bar - Ações em massa para candidatos
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Mail,
  UserPlus,
  Trash2,
  MoreHorizontal,
  Download,
  Tag,
  ArrowRight,
  Sparkles,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string, data?: unknown) => Promise<void>;
  isVisible: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkAction,
  isVisible,
}: BulkActionsBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [emailContent, setEmailContent] = useState('');

  const handleAction = async (action: string, data?: unknown) => {
    if (['delete', 'move_to_rejected'].includes(action)) {
      setPendingAction(action);
      setShowConfirmDialog(true);
      return;
    }

    await executeAction(action, data);
  };

  const executeAction = async (action: string, data?: unknown) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      await onBulkAction(action, data);

      clearInterval(interval);
      setProgress(100);

      // Reset after short delay
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        onClearSelection();
      }, 500);
    } catch {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const confirmAction = async () => {
    if (pendingAction) {
      setShowConfirmDialog(false);
      await executeAction(pendingAction);
      setPendingAction(null);
    }
  };

  const sendBulkEmail = async () => {
    setShowEmailDialog(false);
    await executeAction('send_email', { content: emailContent });
    setEmailContent('');
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && selectedCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl',
              'bg-card/95 backdrop-blur-xl',
              'border border-border/50 shadow-2xl shadow-black/20',
              'min-w-[500px]'
            )}>
              {/* Selection count */}
              <div className="flex items-center gap-2 pr-3 border-r border-border/50">
                <Badge 
                  variant="default" 
                  className="bg-primary text-primary-foreground text-sm px-3 py-1"
                >
                  {selectedCount}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  selecionado{selectedCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* Progress indicator when processing */}
              {isProcessing && (
                <div className="flex items-center gap-2 px-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <div className="w-24">
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
              )}

              {/* Actions */}
              {!isProcessing && (
                <div className="flex items-center gap-2 flex-1">
                  {/* Status change */}
                  <Select onValueChange={(value) => handleAction('change_status', value)}>
                    <SelectTrigger className="w-[140px] h-9">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      <SelectValue placeholder="Mover para" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_triagem">Em Triagem</SelectItem>
                      <SelectItem value="entrevista">Entrevista</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="banco_talentos">Banco de Talentos</SelectItem>
                      <SelectItem value="reprovado">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Quick actions */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setShowEmailDialog(true)}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleAction('add_to_vaga')}
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar a Vaga
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleAction('calculate_match')}
                  >
                    <Sparkles className="h-4 w-4" />
                    Calcular Match
                  </Button>

                  {/* More actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction('schedule_interview')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Entrevista
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('send_test')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Enviar Teste
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('add_tags')}>
                        <Tag className="h-4 w-4 mr-2" />
                        Adicionar Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('export')}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleAction('delete')}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Selecionados
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Clear selection */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2"
                onClick={onClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Enviar Email em Massa
            </DialogTitle>
            <DialogDescription>
              Enviar email para {selectedCount} candidato{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="triagem">Confirmação de Triagem</SelectItem>
                  <SelectItem value="entrevista">Convite para Entrevista</SelectItem>
                  <SelectItem value="feedback">Feedback de Processo</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Digite o conteúdo do email..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={sendBulkEmail} className="gap-2">
              <Mail className="h-4 w-4" />
              Enviar para {selectedCount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Ação
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'delete' 
                ? `Você está prestes a excluir ${selectedCount} candidato(s). Esta ação não pode ser desfeita.`
                : `Você está prestes a mover ${selectedCount} candidato(s) para reprovados.`
              }
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
