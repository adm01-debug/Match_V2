/**
 * @fileoverview Password Reset Approval Panel
 * @description Painel para admin aprovar/rejeitar solicitações de reset
 */

import { useState, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Key, 
  Check, 
  X, 
  Clock, 
  Loader2, 
  RefreshCw,
  MessageSquare,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  getPasswordResetRequests, 
  processResetRequest,
  type PasswordResetRequest 
} from '@/services/passwordResetService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
  approved: { label: 'Aprovado', variant: 'default' as const, icon: Check },
  rejected: { label: 'Rejeitado', variant: 'destructive' as const, icon: X },
  completed: { label: 'Concluído', variant: 'outline' as const, icon: CheckCircle },
  expired: { label: 'Expirado', variant: 'outline' as const, icon: Clock },
};

export const PasswordResetApprovalPanel = memo(() => {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [resetLink, setResetLink] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['password-reset-requests', statusFilter],
    queryFn: () => getPasswordResetRequests(statusFilter === 'all' ? undefined : statusFilter),
  });

  const processMutation = useMutation({
    mutationFn: async ({ requestId, action, notes }: { 
      requestId: string; 
      action: 'approve' | 'reject'; 
      notes: string 
    }) => processResetRequest(requestId, action, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['password-reset-requests'] });
      toast({ 
        title: data.success ? 'Sucesso' : 'Erro',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      });
      
      if (data.resetLink) {
        setResetLink(data.resetLink);
      } else {
        closeDialog();
      }
    },
    onError: () => {
      toast({ title: 'Erro ao processar solicitação', variant: 'destructive' });
    },
  });

  const openDialog = (request: PasswordResetRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewNotes('');
    setResetLink(null);
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setActionType(null);
    setReviewNotes('');
    setResetLink(null);
  };

  const handleProcess = () => {
    if (!selectedRequest || !actionType) return;
    
    processMutation.mutate({
      requestId: selectedRequest.id,
      action: actionType,
      notes: reviewNotes,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Link copiado!' });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Solicitações de Reset de Senha
                  {pendingCount > 0 && (
                    <Badge variant="destructive">{pendingCount} pendentes</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Aprove ou rejeite solicitações de reset de senha
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma solicitação encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(request => {
                  const config = statusConfig[request.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.userName || 'N/A'}
                      </TableCell>
                      <TableCell>{request.userEmail}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.reason || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.requestedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-green-600 hover:text-green-700"
                              onClick={() => openDialog(request, 'approve')}
                            >
                              <Check className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive"
                              onClick={() => openDialog(request, 'reject')}
                            >
                              <X className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        {request.reviewNotes && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={request.reviewNotes}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprovar' : 'Rejeitar'} Solicitação
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'O usuário receberá um email com o link de reset.'
                : 'O usuário será notificado sobre a rejeição.'}
            </DialogDescription>
          </DialogHeader>

          {resetLink ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Resend não configurado. Compartilhe este link manualmente:
              </p>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                  {resetLink}
                </code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(resetLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={closeDialog}>Fechar</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Usuário:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest?.userName} ({selectedRequest?.userEmail})
                  </p>
                </div>
                {selectedRequest?.reason && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Motivo informado:</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Observações (opcional):</p>
                  <Textarea
                    placeholder="Adicione uma nota sobre sua decisão..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleProcess}
                  disabled={processMutation.isPending}
                  variant={actionType === 'reject' ? 'destructive' : 'default'}
                >
                  {processMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {actionType === 'approve' ? 'Aprovar e Enviar Email' : 'Rejeitar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});

PasswordResetApprovalPanel.displayName = 'PasswordResetApprovalPanel';

export default PasswordResetApprovalPanel;
