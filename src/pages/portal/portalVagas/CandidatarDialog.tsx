import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { VagaPublicada, modalidadeLabels, contratoLabels } from './types';

interface Props {
  vaga: VagaPublicada | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { carta: string; curriculo: File | null }) => Promise<void>;
  isSubmitting: boolean;
}

export const CandidatarDialog = ({ vaga, open, onOpenChange, onSubmit, isSubmitting }: Props) => {
  const [cartaApresentacao, setCartaApresentacao] = useState('');
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Envie PDF ou DOC/DOCX.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      return;
    }
    setCurriculo(file);
  };

  const handleSubmit = async () => {
    await onSubmit({ carta: cartaApresentacao, curriculo });
    setCartaApresentacao('');
    setCurriculo(null);
  };

  if (!vaga) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => {
      onOpenChange(o);
      if (!o) { setCurriculo(null); setCartaApresentacao(''); }
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Candidatar-se para {vaga.titulo}</DialogTitle>
          <DialogDescription>
            Envie sua candidatura para esta vaga. Uma carta de apresentação ajuda a destacar seu perfil.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-1">{vaga.titulo}</h4>
            <p className="text-sm text-muted-foreground">{vaga.departamento}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{modalidadeLabels[vaga.modalidade]}</Badge>
              <Badge variant="secondary" className="text-xs">{contratoLabels[vaga.tipo_contrato]}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Currículo (PDF ou DOC, máx 5MB)
            </Label>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
            {curriculo ? (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{curriculo.name}</span>
                <span className="text-xs text-muted-foreground">{(curriculo.size / 1024).toFixed(0)}KB</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurriculo(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Anexar Currículo
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Carta de Apresentação (opcional)</Label>
            <Textarea
              placeholder="Escreva uma breve apresentação sobre você e por que você é ideal para esta vaga..."
              rows={5}
              value={cartaApresentacao}
              onChange={(e) => setCartaApresentacao(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
