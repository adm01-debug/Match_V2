/**
 * @fileoverview EntrevistaDetalhesDialog component
 * @module EntrevistaDetalhesDialog
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  Briefcase,
  Edit,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { toast } from 'sonner';
import {
  Entrevista,
  entrevistadoresDisponiveis,
  locaisDisponiveis,
} from '@/data/agendaData';

interface EntrevistaDetalhesDialogProps {
  entrevista: Entrevista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (entrevista: Entrevista) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
}

const tipoConfig = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-blue-500/10 text-blue-600' },
  online: { icon: Video, label: 'Online', color: 'bg-purple-500/10 text-purple-600' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-green-500/10 text-green-600' },
  tecnica: { icon: Briefcase, label: 'Técnica', color: 'bg-blue-500/10 text-blue-600' },
  rh: { icon: Users, label: 'RH', color: 'bg-green-500/10 text-green-600' },
  cultural: { icon: Users, label: 'Cultural', color: 'bg-purple-500/10 text-purple-600' },
  final: { icon: Briefcase, label: 'Final', color: 'bg-orange-500/10 text-orange-600' },
  triagem: { icon: Phone, label: 'Triagem', color: 'bg-gray-500/10 text-gray-600' },
};

const statusConfig = {
  agendada: { label: 'Agendada', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  confirmada: { label: 'Confirmada', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  realizada: { label: 'Realizada', color: 'bg-muted text-muted-foreground border-muted' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  reagendada: { label: 'Reagendada', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  remarcada: { label: 'Remarcada', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  no_show: { label: 'No Show', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const etapas = [
  'Triagem Telefônica',
  'Entrevista RH',
  'Entrevista Técnica',
  'Entrevista Gestor',
  'Entrevista Final',
];

// Extended interface for editing
interface EditableEntrevista extends Entrevista {
  observacoes?: string;
}

const EntrevistaDetalhesDialog = ({
  entrevista,
  open,
  onOpenChange,
  onUpdate,
  onCancel,
  onConfirm,
}: EntrevistaDetalhesDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [editData, setEditData] = useState<EditableEntrevista | null>(null);

  const handleStartEdit = () => {
    if (entrevista) {
      setEditData({ ...entrevista, observacoes: entrevista.notas || '' });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editData) {
      const updatedEntrevista: Entrevista = {
        ...editData,
        notas: editData.observacoes,
      };
      onUpdate(updatedEntrevista);
      toast.success('Entrevista atualizada com sucesso!');
      setIsEditing(false);
      setEditData(null);
    }
  };

  const handleConfirmCancel = () => {
    if (entrevista) {
      onCancel(entrevista.id);
      toast.success('Entrevista cancelada');
      setShowCancelDialog(false);
      onOpenChange(false);
    }
  };

  const handleConfirmEntrevista = () => {
    if (entrevista) {
      onConfirm(entrevista.id);
      toast.success('Entrevista confirmada!');
    }
  };

  const handleAddEntrevistador = (entrevistadorId: string) => {
    if (!editData) return;
    const entrevistador = entrevistadoresDisponiveis.find(e => e.id === entrevistadorId);
    if (entrevistador && !editData.entrevistadores.some(e => e.id === entrevistadorId)) {
      setEditData({
        ...editData,
        entrevistadores: [...editData.entrevistadores, entrevistador],
      });
    }
  };

  const handleRemoveEntrevistador = (entrevistadorId: string) => {
    if (editData) {
      setEditData({
        ...editData,
        entrevistadores: editData.entrevistadores.filter((e) => e.id !== entrevistadorId),
      });
    }
  };

  if (!entrevista) return null;

  const tipoData = tipoConfig[entrevista.tipo as keyof typeof tipoConfig] || tipoConfig.presencial;
  const TipoIcon = tipoData.icon;
  const statusData = statusConfig[entrevista.status as keyof typeof statusConfig] || statusConfig.agendada;
  const canEdit = entrevista.status !== 'realizada' && entrevista.status !== 'cancelada';
  const canConfirm = entrevista.status === 'agendada';

  const parseDate = (date: string | Date): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => {
        if (!o) {
          setIsEditing(false);
          setEditData(null);
        }
        onOpenChange(o);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{isEditing ? 'Editar Entrevista' : 'Detalhes da Entrevista'}</DialogTitle>
              {!isEditing && (
                <Badge variant="outline" className={cn("ml-2", statusData.color)}>
                  {statusData.label}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {isEditing && editData ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(parseDate(editData.data), "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={parseDate(editData.data)} 
                        onSelect={(date) => date && setEditData({ ...editData, data: date })} 
                        locale={ptBR} 
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Etapa</Label>
                  <Select value={editData.etapa || undefined} onValueChange={(v) => setEditData({ ...editData, etapa: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={editData.tipo} onValueChange={(v) => setEditData({ ...editData, tipo: v as typeof editData.tipo })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hora Início</Label>
                  <Input type="time" value={editData.horaInicio} onChange={(e) => setEditData({ ...editData, horaInicio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Hora Fim</Label>
                  <Input type="time" value={editData.horaFim} onChange={(e) => setEditData({ ...editData, horaFim: e.target.value })} />
                </div>
              </div>
              {editData.tipo === 'presencial' && (
                <div className="space-y-2">
                  <Label>Local</Label>
                  <Select value={editData.local || undefined} onValueChange={(v) => setEditData({ ...editData, local: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o local" /></SelectTrigger>
                    <SelectContent>
                      {locaisDisponiveis.filter(l => l.tipo === 'presencial').map((l) => (
                        <SelectItem key={l.id} value={l.nome}>{l.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {editData.tipo === 'online' && (
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input placeholder="https://..." value={editData.linkOnline || ''} onChange={(e) => setEditData({ ...editData, linkOnline: e.target.value })} />
                </div>
              )}
              <div className="space-y-2">
                <Label>Entrevistadores</Label>
                <Select onValueChange={handleAddEntrevistador}>
                  <SelectTrigger><SelectValue placeholder="Adicionar" /></SelectTrigger>
                  <SelectContent>
                    {entrevistadoresDisponiveis
                      .filter((e) => !editData.entrevistadores.some(ent => ent.id === e.id))
                      .map((e) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                {editData.entrevistadores.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editData.entrevistadores.map((e) => (
                      <Badge key={e.id} variant="secondary" className="gap-1">
                        {e.nome}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveEntrevistador(e.id)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={editData.observacoes || ''} onChange={(e) => setEditData({ ...editData, observacoes: e.target.value })} rows={2} />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">{entrevista.candidatoNome.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{entrevista.candidatoNome}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><Briefcase className="h-4 w-4" /><span>{entrevista.vagaTitulo}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Data</Label>
                  <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><span>{format(parseDate(entrevista.data), "dd/MM/yyyy", { locale: ptBR })}</span></div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Horário</Label>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{entrevista.horaInicio} - {entrevista.horaFim}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Tipo</Label>
                  <Badge variant="secondary" className={cn(tipoData.color)}><TipoIcon className="h-3 w-3 mr-1" />{tipoData.label}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Etapa</Label>
                  <Badge variant="outline">{entrevista.etapa || 'N/A'}</Badge>
                </div>
              </div>
              {(entrevista.local || entrevista.linkOnline) && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">{entrevista.tipo === 'presencial' ? 'Local' : 'Link'}</Label>
                  <div className="flex items-center gap-2 text-sm">
                    {entrevista.tipo === 'presencial' ? (
                      <><MapPin className="h-4 w-4 text-muted-foreground" /><span>{entrevista.local}</span></>
                    ) : (
                      <><Video className="h-4 w-4 text-muted-foreground" /><a href={entrevista.linkOnline} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{entrevista.linkOnline}</a></>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Entrevistadores</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{entrevista.entrevistadores.map(e => e.nome).join(', ') || 'Nenhum'}</span>
                </div>
              </div>
              {entrevista.notas && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Observações</Label>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{entrevista.notas}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 mt-4">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
                <Button type="button" onClick={handleSaveEdit}><Check className="h-4 w-4 mr-2" />Salvar</Button>
              </>
            ) : (
              <>
                {canEdit && (
                  <>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setShowCancelDialog(true)} aria-label="Cancelar entrevista"><X className="h-4 w-4 mr-2" />Cancelar</Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleStartEdit} aria-label="Editar entrevista"><Edit className="h-4 w-4 mr-2" />Editar</Button>
                    {canConfirm && <Button type="button" size="sm" onClick={handleConfirmEntrevista} aria-label="Confirmar entrevista"><Check className="h-4 w-4 mr-2" />Confirmar</Button>}
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />Cancelar Entrevista</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja cancelar a entrevista de <strong>{entrevista.candidatoNome}</strong>?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sim, Cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

EntrevistaDetalhesDialog.displayName = "EntrevistaDetalhesDialog";

export default EntrevistaDetalhesDialog;
