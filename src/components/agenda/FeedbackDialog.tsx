import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: string, avaliacao: number) => void;
}

export function FeedbackDialog({ open, onOpenChange, onSubmit }: FeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Feedback da Entrevista</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const feedback = (form.elements.namedItem("feedback") as HTMLTextAreaElement).value;
            const avaliacao = parseInt(
              (form.elements.namedItem("avaliacao") as HTMLSelectElement).value,
            );
            onSubmit(feedback, avaliacao);
          }}
        >
          <div className="space-y-4">
            <div>
              <Label>Avaliação Geral</Label>
              <Select name="avaliacao" defaultValue="3">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Muito Bom</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Bom</SelectItem>
                  <SelectItem value="2">⭐⭐ Regular</SelectItem>
                  <SelectItem value="1">⭐ Insatisfatório</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea name="feedback" placeholder="Observações da entrevista..." rows={4} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
