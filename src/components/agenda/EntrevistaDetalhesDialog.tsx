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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { toast } from 'sonner';
import {
  Entrevista,
  EntrevistaFeedback,
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
  onMarcarRealizada?: (id: string, feedback: EntrevistaFeedback) => void;
}

const tipoConfig = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-blue-500/10 text-blue-600' },
  online: { icon: Video, label: 'Online', color: 'bg-purple-500/10 text-purple-600' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-green-500/10 text-green-600' },
};

const statusConfig = {
  agendada: { label: 'Agendada', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  confirmada: { label: 'Confirmada', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  realizada: { label: 'Realizada', color: 'bg-muted text-muted-foreground border-muted' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  reagendada: { label: 'Reagendada', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
};

const etapas = [
  'Triagem Telefônica',
  'Entrevista RH',
  'Entrevista Técnica',
  'Entrevista Gestor',
  'Entrevista Final',
];

const EntrevistaDetalhesDialog = ({
  entrevista,
  open,
  onOpenChange,
  onUpdate,
  onCancel,
  onConfirm,
  onMarcarRealizada,
}: EntrevistaDetalhesDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [editData, setEditData] = useState<Entrevista | null>(null);
  const [resultado, setResultado] = useState<'aprovado' | 'reprovado' | 'pendente'>('pendente');
  const [notaGeral, setNotaGeral] = useState([7]);
  const [pontosFortes, setPontosFortes] = useState<string[]>(['']);
  const [pontosAMelhorar, setPontosAMelhorar] = useState<string[]>(['']);
  const [comentarios, setComentarios] = useState('');
  const [recomendacao, setRecomendacao] = useState('');

  const handleStartEdit = () => {
    if (entrevista) {
      setEditData({ ...entrevista });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editData) {
      onUpdate(editData);
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

  const handleAddEntrevistador = (entrevistador: string) => {
    if (editData && !editData.entrevistadores.includes(entrevistador)) {
      setEditData({
        ...editData,
        entrevistadores: [...editData.entrevistadores, entrevistador],
      });
    }
  };

  const handleRemoveEntrevistador = (entrevistador: string) => {
    if (editData) {
      setEditData({
        ...editData,
        entrevistadores: editData.entrevistadores.filter((e) => e !== entrevistador),
      });
    }
  };

  const addPontoForte = () => setPontosFortes([...pontosFortes, '']);
  const addPontoAMelhorar = () => setPontosAMelhorar([...pontosAMelhorar, '']);
  const updatePontoForte = (index: number, value: string) => {
    const updated = [...pontosFortes];
    updated[index] = value;
    setPontosFortes(updated);
  };
  const updatePontoAMelhorar = (index: number, value: string) => {
    const updated = [...pontosAMelhorar];
    updated[index] = value;
    setPontosAMelhorar(updated);
  };
  const removePontoForte = (index: number) => setPontosFortes(pontosFortes.filter((_, i) => i !== index));
  const removePontoAMelhorar = (index: number) => setPontosAMelhorar(pontosAMelhorar.filter((_, i) => i !== index));

  const handleSubmitFeedback = () => {
    if (!entrevista || !onMarcarRealizada) return;
    const feedback: EntrevistaFeedback = {
      resultado,
      notaGeral: notaGeral[0],
      pontosFortes: pontosFortes.filter(p => p.trim() !== ''),
      pontosAMelhorar: pontosAMelhorar.filter(p => p.trim() !== ''),
      comentarios,
      recomendacao,
      avaliadoPor: 'Usuário Atual',
      avaliadoEm: new Date().toISOString()
    };
    onMarcarRealizada(entrevista.id, feedback);
    onOpenChange(false);
    toast.success('Entrevista marcada como realizada!');
  };

  if (!entrevista) return null;

  const TipoIcon = tipoConfig[entrevista.tipo].icon;
  const canEdit = entrevista.status !== 'realizada' && entrevista.status !== 'cancelada';
  const canConfirm = entrevista.status === 'agendada';
  const canMarkAsRealized = entrevista.status === 'confirmada' || entrevista.status === 'agendada';

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
                <Badge variant="outline" className={cn("ml-2", statusConfig[entrevista.status].color)}>
                  {statusConfig[entrevista.status].label}
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
                        {format(editData.data, "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={editData.data} onSelect={(date) => date && setEditData({ ...editData, data: date })} locale={ptBR} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Etapa</Label>
                  <Select value={editData.etapa} onValueChange={(v) => setEditData({ ...editData, etapa: v })}>
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
                  <Select value={editData.local || ''} onValueChange={(v) => setEditData({ ...editData, local: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o local" /></SelectTrigger>
                    <SelectContent>{locaisDisponiveis.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
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
                  <SelectContent>{entrevistadoresDisponiveis.filter((e) => !editData.entrevistadores.includes(e)).map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
                {editData.entrevistadores.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editData.entrevistadores.map((e) => (
                      <Badge key={e} variant="secondary" className="gap-1">{e}<X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveEntrevistador(e)} /></Badge>
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
                  <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><span>{format(entrevista.data, "dd/MM/yyyy", { locale: ptBR })}</span></div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Horário</Label>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{entrevista.horaInicio} - {entrevista.horaFim}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Tipo</Label>
                  <Badge variant="secondary" className={cn(tipoConfig[entrevista.tipo].color)}><TipoIcon className="h-3 w-3 mr-1" />{tipoConfig[entrevista.tipo].label}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Etapa</Label>
                  <Badge variant="outline">{entrevista.etapa}</Badge>
                </div>
              </div>
              {(entrevista.local || entrevista.linkOnline) && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">{entrevista.tipo === 'presencial' ? 'Local' : 'Link'}</Label>
                  <div className="flex items-center gap-2 text-sm">
                    {entrevista.tipo === 'presencial' ? (<><MapPin className="h-4 w-4 text-muted-foreground" /><span>{entrevista.local}</span></>) : (<><Video className="h-4 w-4 text-muted-foreground" /><a href={entrevista.linkOnline} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{entrevista.linkOnline}</a></>)}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Entrevistadores</Label>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{entrevista.entrevistadores.join(', ')}</span></div>
              </div>
              {entrevista.observacoes && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Observações</Label>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{entrevista.observacoes}</p>
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
                    <Button type="button" variant="destructive" size="sm" onClick={() => setShowCancelDialog(true)}><X className="h-4 w-4 mr-2" />Cancelar</Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleStartEdit}><Edit className="h-4 w-4 mr-2" />Editar</Button>
                    {canConfirm && <Button type="button" size="sm" onClick={handleConfirmEntrevista}><Check className="h-4 w-4 mr-2" />Confirmar</Button>}
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

