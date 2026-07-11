/**
 * @fileoverview Multi-Channel Job Publisher - Publicação em múltiplos job boards
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Globe,
  Zap,
  BarChart3,
  RefreshCw,
  Rocket,
} from 'lucide-react';
import { JOB_BOARDS, type PublishResult } from './publisher/types';
import { StatsOverview } from './publisher/StatsOverview';
import { ConnectedBoardCard } from './publisher/ConnectedBoardCard';
import { DisconnectedBoardsList } from './publisher/DisconnectedBoardsList';

interface MultiChannelJobPublisherProps {
  vagaId: string;
  vagaTitle: string;
  onPublish?: (results: Record<string, PublishResult>) => void;
}

export function MultiChannelJobPublisher({
  vagaId,
  vagaTitle,
  onPublish,
}: MultiChannelJobPublisherProps) {
  const { toast } = useToast();
  const connectedBoards = JOB_BOARDS.filter((b) => b.isConnected);
  const disconnectedBoards = JOB_BOARDS.filter((b) => !b.isConnected);

  const [selectedBoards, setSelectedBoards] = useState<string[]>(
    connectedBoards.map((b) => b.id),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [results, setResults] = useState<Record<string, PublishResult>>({});
  const [autoPost, setAutoPost] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const toggleBoard = (boardId: string) => {
    setSelectedBoards((prev) =>
      prev.includes(boardId) ? prev.filter((id) => id !== boardId) : [...prev, boardId],
    );
  };

  const selectAll = () => setSelectedBoards(connectedBoards.map((b) => b.id));

  const handlePublish = async () => {
    if (selectedBoards.length === 0) {
      toast({ title: 'Selecione ao menos um canal', variant: 'destructive' });
      return;
    }

    setIsPublishing(true);
    setPublishProgress(0);
    const publishResults: Record<string, PublishResult> = {};

    for (let i = 0; i < selectedBoards.length; i++) {
      const boardId = selectedBoards[i];
      if (!boardId) continue;
      try {
        await new Promise((r) => setTimeout(r, 800));
        publishResults[boardId] = {
          success: Math.random() > 0.1,
          externalId: `ext-${Date.now()}-${boardId}`,
          url: `https://${boardId}.com/job/${vagaId}`,
        };
      } catch {
        publishResults[boardId] = { success: false, error: 'Erro de conexão' };
      }
      setPublishProgress(((i + 1) / selectedBoards.length) * 100);
    }

    setResults(publishResults);
    setIsPublishing(false);
    onPublish?.(publishResults);

    const successCount = Object.values(publishResults).filter((r) => r.success).length;
    toast({
      title: 'Publicação concluída!',
      description: `${successCount}/${selectedBoards.length} canais publicados com sucesso`,
    });
  };

  const totalStats = connectedBoards.reduce(
    (acc, board) => ({
      views: acc.views + (board.stats?.views || 0),
      clicks: acc.clicks + (board.stats?.clicks || 0),
      applications: acc.applications + (board.stats?.applications || 0),
    }),
    { views: 0, clicks: 0, applications: 0 },
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Multi-Channel Publisher
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  1-Click
                </Badge>
              </CardTitle>
              <CardDescription>
                Publique em múltiplos job boards simultaneamente
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {showStats ? 'Ocultar Stats' : 'Ver Stats'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <StatsOverview show={showStats} stats={totalStats} />

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <span className="text-sm text-muted-foreground">Publicando:</span>
            <p className="font-semibold">{vagaTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={autoPost} onCheckedChange={setAutoPost} id="auto-post" />
            <Label htmlFor="auto-post" className="text-sm">
              Auto-renovar
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Canais Conectados ({connectedBoards.length})
            </h4>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Selecionar todos
            </Button>
          </div>

          <div className="grid gap-3">
            {connectedBoards.map((board, index) => (
              <ConnectedBoardCard
                key={board.id}
                board={board}
                index={index}
                isSelected={selectedBoards.includes(board.id)}
                isPublishing={isPublishing}
                result={results[board.id]}
                onToggle={() => toggleBoard(board.id)}
              />
            ))}
          </div>
        </div>

        <DisconnectedBoardsList boards={disconnectedBoards} />

        {isPublishing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Publicando...</span>
              <span className="font-medium">{Math.round(publishProgress)}%</span>
            </div>
            <Progress value={publishProgress} className="h-2" />
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedBoards.length} selecionado(s)</Badge>
            {Object.keys(results).length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setResults({})}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resetar
              </Button>
            )}
          </div>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || selectedBoards.length === 0}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Publicar em {selectedBoards.length} canais
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
