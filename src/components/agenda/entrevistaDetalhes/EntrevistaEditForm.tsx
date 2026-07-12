import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { entrevistadoresDisponiveis, locaisDisponiveis } from '@/data/agendaData';
import { EditableEntrevista } from './types';
import { etapas, parseDate } from './constants';

interface Props {
  editData: EditableEntrevista;
  setEditData: (d: EditableEntrevista) => void;
}

export const EntrevistaEditForm = ({ editData, setEditData }: Props) => {
  const handleAddEntrevistador = (entrevistadorId: string) => {
    const entrevistador = entrevistadoresDisponiveis.find(e => e.id === entrevistadorId);
    if (entrevistador && !editData.entrevistadores.some(e => e.id === entrevistadorId)) {
      setEditData({ ...editData, entrevistadores: [...editData.entrevistadores, entrevistador] });
    }
  };

  const handleRemoveEntrevistador = (entrevistadorId: string) => {
    setEditData({
      ...editData,
      entrevistadores: editData.entrevistadores.filter(e => e.id !== entrevistadorId),
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(parseDate(editData.data), 'PPP', { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={parseDate(editData.data)} onSelect={(date) => date && setEditData({ ...editData, data: date })} locale={ptBR} />
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
              .map((e) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
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
  );
};
