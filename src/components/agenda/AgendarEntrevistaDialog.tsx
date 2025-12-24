import { useMemo,  useCallback,  useState, useEffect   , memo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
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
import { useCandidatosDisponiveis } from '@/hooks/useEntrevistas';
import { useVagasSelect } from '@/hooks/useVagas';
import { Entrevista } from '@/data/agendaData';

interface AgendarEntrevistaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entrevista: Omit<Entrevista, 'id'>) => void;
  selectedDate?: Date;
}

const etapas = [
  'Triagem Telefônica',
  'Entrevista RH',
  'Entrevista Técnica',
  'Entrevista Gestor',
  'Entrevista Final',
];

const entrevistadoresDisponiveis = [
  'Maria Santos (RH)',
  'Carlos Supervisor',
  'João Diretor',
  'Gerente Comercial',
  'Diretor de Arte',
  'CFO',
  'CTO',
];

const locaisDisponiveis = [
  'Sala de Reuniões 1',
  'Sala de Reuniões 2',
  'Sala da Diretoria',
  'Auditório',
];

const AgendarEntrevistaDialog = ({
  open,
  onOpenChange,
  onSave,
  selectedDate,
}: AgendarEntrevistaDialogProps) => {
  const [data, setData] = useState<Date | undefined>(selectedDate || new Date());
  const [candidatoId, setCandidatoId] = useState('');
  const [candidatoNome, setCandidatoNome] = useState('');
  const [vagaId, setVagaId] = useState('');
  const [tipo, setTipo] = useState<'presencial' | 'online' | 'telefone'>('presencial');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFim, setHoraFim] = useState('10:00');
  const [local, setLocal] = useState('');
  const [linkOnline, setLinkOnline] = useState('');
  const [etapa, setEtapa] = useState('');
  const [entrevistadores, setEntrevistadores] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState('');

  const { data: candidatosDB = [] } = useCandidatosDisponiveis();
  const { data: vagasDisponiveis = [] } = useVagasSelect();

  useEffect(() => {
    if (selectedDate) {
      setData(selectedDate);
    }
  }, [selectedDate]);

  const handleAddEntrevistador = (entrevistador: string) => {
    if (!entrevistadores.includes(entrevistador)) {
      setEntrevistadores([...entrevistadores, entrevistador]);
    }
  };

  const handleRemoveEntrevistador = (entrevistador: string) => {
    setEntrevistadores(entrevistadores.filter((e) => e !== entrevistador));
  };

  const handleCandidatoChange = (id: string) => {
    setCandidatoId(id);
    const candidato = candidatosDB.find((c) => c.id === id);
    if (candidato) {
      setCandidatoNome(candidato.nome);
    }
  };

  const handleSave = () => {
    if (!data || !candidatoNome || !vagaId || !etapa || entrevistadores.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const vaga = vagasDisponiveis.find((v) => v.id === vagaId);

    if (!vaga) {
      toast.error('Vaga inválida');
      return;
    }

    const novaEntrevista: Omit<Entrevista, 'id'> = {
      candidatoId: candidatoId || undefined,
      candidatoNome,
      vagaId,
      vagaTitulo: vaga.titulo,
      tipo,
      data,
      horaInicio,
      horaFim,
      local: tipo === 'presencial' ? local : undefined,
      linkOnline: tipo === 'online' ? linkOnline : undefined,
      entrevistadores,
      etapa,
      status: 'agendada',
      observacoes: observacoes || undefined,
    };

    onSave(novaEntrevista);
    toast.success('Entrevista agendada com sucesso!');
    onOpenChange(false);
    
    // Reset form
    setCandidatoId('');
    setCandidatoNome('');
    setVagaId('');
    setTipo('presencial');
    setHoraInicio('09:00');
    setHoraFim('10:00');
    setLocal('');
    setLinkOnline('');
    setEtapa('');
    setEntrevistadores([]);
    setObservacoes('');
  };

  return (
    <div data-testid="agendar-entrevista"><Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Nova Entrevista</DialogTitle>
        </DialogHeader>

        <div role="region" aria-label="Agendar entrevista" className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Candidato *</Label>
              {candidatosDB.length > 0 ? (
                <Select value={candidatoId} onValueChange={handleCandidatoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o candidato" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidatosDB.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Nome do candidato"
                  value={candidatoNome}
                  onChange={(e) => setCandidatoNome(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Vaga *</Label>
              <Select value={vagaId} onValueChange={setVagaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a vaga" />
                </SelectTrigger>
                <SelectContent>
                  {vagasDisponiveis.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Etapa *</Label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  {etapas.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora Início *</Label>
              <Input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Hora Fim *</Label>
              <Input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          </div>

          {tipo === 'presencial' && (
            <div className="space-y-2">
              <Label>Local</Label>
              <Select value={local} onValueChange={setLocal}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  {locaisDisponiveis.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {tipo === 'online' && (
            <div className="space-y-2">
              <Label>Link da Reunião</Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={linkOnline}
                onChange={(e) => setLinkOnline(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Entrevistadores *</Label>
            <Select onValueChange={handleAddEntrevistador}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar entrevistador" />
              </SelectTrigger>
              <SelectContent>
                {entrevistadoresDisponiveis
                  .filter((e) => !entrevistadores.includes(e))
                  .map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {entrevistadores.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {entrevistadores.map((e) => (
                  <Badge key={e} variant="secondary" className="gap-1">
                    {e}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveEntrevistador(e)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Notas adicionais sobre a entrevista..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar Entrevista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgendarEntrevistaDialog;
