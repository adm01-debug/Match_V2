import { useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { NovaIndicacaoInput } from './types';

interface VagaOption {
  id: string;
  titulo: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vagas: VagaOption[];
  isSubmitting: boolean;
  onSubmit: (input: NovaIndicacaoInput) => void;
  trigger?: React.ReactNode;
}

const EMPTY: NovaIndicacaoInput = {
  candidatoNome: '',
  candidatoEmail: '',
  candidatoTelefone: '',
  vagaId: '',
  observacao: '',
};

export function NovaIndicacaoDialog({
  open, onOpenChange, vagas, isSubmitting, onSubmit, trigger,
}: Props) {
  const [form, setForm] = useState<NovaIndicacaoInput>(EMPTY);

  const handleSubmit = () => {
    if (!form.candidatoNome || !form.candidatoEmail || !form.vagaId) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    onSubmit(form);
    setForm(EMPTY);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Indicar Candidato</DialogTitle>
          <DialogDescription>
            Preencha os dados da pessoa que você deseja indicar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="candidato-nome">Nome do Candidato *</Label>
            <Input
              id="candidato-nome"
              value={form.candidatoNome}
              onChange={e => setForm({ ...form, candidatoNome: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidato-email">E-mail *</Label>
              <Input
                id="candidato-email"
                type="email"
                value={form.candidatoEmail}
                onChange={e => setForm({ ...form, candidatoEmail: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidato-tel">Telefone</Label>
              <Input
                id="candidato-tel"
                value={form.candidatoTelefone}
                onChange={e => setForm({ ...form, candidatoTelefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vaga de Interesse *</Label>
            <Select value={form.vagaId} onValueChange={v => setForm({ ...form, vagaId: v })}>
              <SelectTrigger aria-label="Vaga de Interesse">
                <SelectValue placeholder="Selecione uma vaga..." />
              </SelectTrigger>
              <SelectContent>
                {vagas.map(vaga => (
                  <SelectItem key={vaga.id} value={vaga.id}>{vaga.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              value={form.observacao}
              onChange={e => setForm({ ...form, observacao: e.target.value })}
              placeholder="Como você conhece esta pessoa? Por que está indicando?"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Users className="h-4 w-4 mr-2" />
            )}
            Registrar Indicação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
