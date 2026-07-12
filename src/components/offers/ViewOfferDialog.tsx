import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Offer {
  id: string;
  candidatoNome: string;
  candidatoEmail: string;
  vagaTitulo: string;
  salario: number;
  dataInicio: Date;
  beneficios: string[];
  status: 'rascunho' | 'enviada' | 'visualizada' | 'aceita' | 'recusada' | 'expirada';
}

const statusConfig: Record<string, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-muted-foreground' },
  enviada: { label: 'Enviada', color: 'bg-info' },
  visualizada: { label: 'Visualizada', color: 'bg-warning' },
  aceita: { label: 'Aceita', color: 'bg-success' },
  recusada: { label: 'Recusada', color: 'bg-destructive' },
  expirada: { label: 'Expirada', color: 'bg-warning' },
};

interface ViewOfferDialogProps {
  offer: Offer | null;
  onClose: () => void;
  onSend: (offer: Offer) => void;
}

export function ViewOfferDialog({ offer, onClose, onSend }: ViewOfferDialogProps) {
  if (!offer) return null;
  const config = statusConfig[offer.status] || { label: offer.status, color: 'bg-muted-foreground' };

  return (
    <Dialog open={!!offer} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Detalhes da Proposta</DialogTitle></DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <h3 className="font-semibold text-lg">{offer.candidatoNome}</h3>
              <p className="text-muted-foreground">{offer.vagaTitulo}</p>
            </div>
            <Badge className={cn(config.color, "text-white")}>{config.label}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Salário</p>
              <p className="text-xl font-bold">R$ {offer.salario.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
              <p className="text-xl font-bold">{format(offer.dataInicio, "dd/MM/yyyy")}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-2">Benefícios</p>
            <div className="flex flex-wrap gap-2">
              {offer.beneficios.map((b) => (<Badge key={b} variant="secondary">{b}</Badge>))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Baixar PDF</Button>
            {offer.status === 'rascunho' && (<Button onClick={() => onSend(offer)}><Send className="h-4 w-4 mr-2" />Enviar Proposta</Button>)}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
