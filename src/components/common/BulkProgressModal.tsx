import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";

export interface BulkOperationItem {
  id: string;
  name: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
}

interface BulkProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: BulkOperationItem[];
  onCancel?: () => void;
  onComplete?: () => void;
}

export function BulkProgressModal({
  open,
  onOpenChange,
  title,
  items,
  onCancel,
  onComplete,
}: BulkProgressModalProps) {
  const [canClose, setCanClose] = useState(false);

  const completed = items.filter(i => i.status === "success" || i.status === "error").length;
  const successful = items.filter(i => i.status === "success").length;
  const failed = items.filter(i => i.status === "error").length;
  const progress = items.length > 0 ? (completed / items.length) * 100 : 0;
  const isComplete = completed === items.length;

  useEffect(() => {
    if (isComplete) {
      setCanClose(true);
      onComplete?.();
    }
  }, [isComplete]);

  const getStatusIcon = (status: BulkOperationItem["status"]) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "error": return <XCircle className="h-4 w-4 text-destructive" />;
      case "processing": return <Loader2 className="h-4 w-4 animate-spin text-info" />;
      default: return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completed} de {items.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {isComplete && (
            <div className="flex gap-2">
              <Badge variant="default" className="bg-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />{successful} sucesso
              </Badge>
              {failed > 0 && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />{failed} erro(s)
                </Badge>
              )}
            </div>
          )}

          <ScrollArea className="h-[200px] rounded border p-2">
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm truncate max-w-[200px]">{item.name}</span>
                  </div>
                  {item.error && (
                    <span className="text-xs text-destructive truncate max-w-[100px]">{item.error}</span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {failed > 0 && isComplete && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span>{failed} item(ns) não puderam ser processados</span>
            </div>
          )}
        </div>

        <DialogFooter>
          {!isComplete && onCancel && (
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          )}
          {isComplete && (
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
