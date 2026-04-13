import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, Mail, DollarSign, Calendar, FileSignature } from 'lucide-react';

interface OfferTemplate {
  id: string;
  nome: string;
}

interface CreateOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  templates: OfferTemplate[];
}

export function CreateOfferDialog({ open, onOpenChange, onSubmit, templates }: CreateOfferDialogProps) {
  const [newOffer, setNewOffer] = useState({
    candidatoNome: '', candidatoEmail: '', vagaTitulo: '', salario: '', dataInicio: '', template: '',
  });

  const handleSubmit = () => {
    onSubmit();
    setNewOffer({ candidatoNome: '', candidatoEmail: '', vagaTitulo: '', salario: '', dataInicio: '', template: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Nova Proposta de Emprego</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Candidato</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Nome do candidato" className="pl-10" value={newOffer.candidatoNome} onChange={(e) => setNewOffer({...newOffer, candidatoNome: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="email@exemplo.com" className="pl-10" value={newOffer.candidatoEmail} onChange={(e) => setNewOffer({...newOffer, candidatoEmail: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vaga</Label>
            <Select value={newOffer.vagaTitulo} onValueChange={(v) => setNewOffer({...newOffer, vagaTitulo: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione a vaga" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dev-senior">Desenvolvedor Full Stack Senior</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
                <SelectItem value="ux">UX Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Salário (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="number" placeholder="15000" className="pl-10" value={newOffer.salario} onChange={(e) => setNewOffer({...newOffer, salario: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-10" value={newOffer.dataInicio} onChange={(e) => setNewOffer({...newOffer, dataInicio: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={newOffer.template} onValueChange={(v) => setNewOffer({...newOffer, template: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione um template" /></SelectTrigger>
              <SelectContent>
                {templates.map((t) => (<SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea placeholder="Adicione observações ou personalizações..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}><FileSignature className="h-4 w-4 mr-2" />Criar Proposta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
