import { memo } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export interface NewOfferState {
  candidatoNome: string;
  candidatoEmail: string;
  vagaTitulo: string;
  salario: string;
  dataInicio: string;
  beneficios: string[];
  template: string;
}

export interface OfferTemplateOption {
  id: string;
  nome: string;
}

interface CreateOfferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newOffer: NewOfferState;
  setNewOffer: React.Dispatch<React.SetStateAction<NewOfferState>>;
  templates: OfferTemplateOption[];
  onCreate: () => void;
}

export const CreateOfferDialog = memo(function CreateOfferDialog({
  isOpen,
  onOpenChange,
  newOffer,
  setNewOffer,
  templates,
  onCreate,
}: CreateOfferDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Proposta</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Candidato</Label>
            <Input 
              id="nome" 
              placeholder="Ex: Ana Silva"
              value={newOffer.candidatoNome}
              onChange={(e) => setNewOffer({...newOffer, candidatoNome: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email do Candidato</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="ana.silva@email.com"
              value={newOffer.candidatoEmail}
              onChange={(e) => setNewOffer({...newOffer, candidatoEmail: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vaga">Vaga</Label>
            <Input 
              id="vaga" 
              placeholder="Ex: Desenvolvedor Senior"
              value={newOffer.vagaTitulo}
              onChange={(e) => setNewOffer({...newOffer, vagaTitulo: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salario">Salário Mensal (R$)</Label>
            <Input 
              id="salario" 
              type="number" 
              placeholder="15000"
              value={newOffer.salario}
              onChange={(e) => setNewOffer({...newOffer, salario: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select 
              value={newOffer.template} 
              onValueChange={(val) => setNewOffer({...newOffer, template: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data Prevista de Início</Label>
            <Input 
              id="data" 
              type="date"
              value={newOffer.dataInicio}
              onChange={(e) => setNewOffer({...newOffer, dataInicio: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
