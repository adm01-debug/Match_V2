import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, Check, X, Globe } from "lucide-react";
import { JOB_BOARDS, type JobBoardIntegration, type PublishResult } from "@/types/jobBoard";

interface JobPublisherProps {
  vagaId: string;
  vagaTitle: string;
  onPublish?: (results: Record<string, PublishResult>) => void;
}

export function JobPublisher({ vagaId, vagaTitle, onPublish }: JobPublisherProps) {
  const { toast } = useToast();
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [results, setResults] = useState<Record<string, PublishResult>>({});

  const connectedBoards = JOB_BOARDS.filter(b => b.isConnected);

  const toggleBoard = (boardId: string) => {
    setSelectedBoards(prev =>
      prev.includes(boardId)
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handlePublish = async () => {
    if (selectedBoards.length === 0) {
      toast({ title: "Selecione ao menos um canal", variant: "destructive" });
      return;
    }

    setIsPublishing(true);
    const publishResults: Record<string, PublishResult> = {};

    for (const boardId of selectedBoards) {
      try {
        // Simular publicação
        await new Promise(r => setTimeout(r, 1000));
        publishResults[boardId] = {
          success: Math.random() > 0.2,
          externalId: `ext-${Date.now()}`,
          url: `https://${boardId}.com/job/${Date.now()}`,
        };
      } catch {
        publishResults[boardId] = { success: false, error: "Erro de conexão" };
      }
    }

    setResults(publishResults);
    setIsPublishing(false);
    onPublish?.(publishResults);

    const successCount = Object.values(publishResults).filter(r => r.success).length;
    toast({
      title: `Publicação concluída`,
      description: `${successCount}/${selectedBoards.length} canais com sucesso`,
    });
  };

  const getStatusIcon = (boardId: string) => {
    const result = results[boardId];
    if (!result) return null;
    return result.success 
      ? <Check className="h-4 w-4 text-green-500" />
      : <X className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Publicar Vaga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Publicando: <strong>{vagaTitle}</strong>
        </p>

        {connectedBoards.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Nenhuma integração conectada</p>
            <Button variant="link" className="mt-2">Configurar integrações</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedBoards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedBoards.includes(board.id)}
                    onCheckedChange={() => toggleBoard(board.id)}
                    disabled={isPublishing}
                  />
                  <span className="font-medium">{board.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(board.id)}
                  {results[board.id]?.url && (
                    <a href={results[board.id].url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-blue-500" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBoards.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Badge variant="secondary">{selectedBoards.length} selecionado(s)</Badge>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Publicar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
