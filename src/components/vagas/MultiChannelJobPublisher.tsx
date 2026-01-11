/**
 * @fileoverview Multi-Channel Job Publisher - Publicação em múltiplos job boards
 * @module MultiChannelJobPublisher
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, ExternalLink, Check, X, Globe, Zap, 
  BarChart3, Eye, MousePointer, Users, TrendingUp,
  Settings, RefreshCw, Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobBoard {
  id: string;
  name: string;
  logo: string;
  color: string;
  isConnected: boolean;
  isPremium: boolean;
  stats?: {
    views: number;
    clicks: number;
    applications: number;
  };
}

interface PublishResult {
  success: boolean;
  externalId?: string;
  url?: string;
  error?: string;
}

interface MultiChannelJobPublisherProps {
  vagaId: string;
  vagaTitle: string;
  onPublish?: (results: Record<string, PublishResult>) => void;
}

const JOB_BOARDS: JobBoard[] = [
  { 
    id: "linkedin", 
    name: "LinkedIn Jobs", 
    logo: "🔗", 
    color: "from-blue-600 to-blue-700",
    isConnected: true, 
    isPremium: true,
    stats: { views: 12500, clicks: 450, applications: 89 }
  },
  { 
    id: "indeed", 
    name: "Indeed", 
    logo: "📋", 
    color: "from-indigo-500 to-purple-600",
    isConnected: true, 
    isPremium: false,
    stats: { views: 8700, clicks: 320, applications: 67 }
  },
  { 
    id: "catho", 
    name: "Catho", 
    logo: "🎯", 
    color: "from-orange-500 to-red-500",
    isConnected: true, 
    isPremium: false,
    stats: { views: 5400, clicks: 180, applications: 42 }
  },
  { 
    id: "vagas", 
    name: "Vagas.com.br", 
    logo: "💼", 
    color: "from-green-500 to-emerald-600",
    isConnected: true, 
    isPremium: false,
    stats: { views: 4200, clicks: 156, applications: 38 }
  },
  { 
    id: "infojobs", 
    name: "InfoJobs", 
    logo: "📝", 
    color: "from-cyan-500 to-blue-500",
    isConnected: true, 
    isPremium: false,
    stats: { views: 3100, clicks: 98, applications: 24 }
  },
  { 
    id: "glassdoor", 
    name: "Glassdoor", 
    logo: "🚪", 
    color: "from-green-600 to-teal-600",
    isConnected: false, 
    isPremium: true,
    stats: { views: 0, clicks: 0, applications: 0 }
  },
];

export function MultiChannelJobPublisher({ 
  vagaId,
  vagaTitle, 
  onPublish 
}: MultiChannelJobPublisherProps) {
  const { toast } = useToast();
  const [selectedBoards, setSelectedBoards] = useState<string[]>(
    JOB_BOARDS.filter(b => b.isConnected).map(b => b.id)
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [results, setResults] = useState<Record<string, PublishResult>>({});
  const [autoPost, setAutoPost] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const connectedBoards = JOB_BOARDS.filter(b => b.isConnected);
  const disconnectedBoards = JOB_BOARDS.filter(b => !b.isConnected);

  const toggleBoard = (boardId: string) => {
    setSelectedBoards(prev =>
      prev.includes(boardId)
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const selectAll = () => {
    setSelectedBoards(connectedBoards.map(b => b.id));
  };

  const handlePublish = async () => {
    if (selectedBoards.length === 0) {
      toast({ title: "Selecione ao menos um canal", variant: "destructive" });
      return;
    }

    setIsPublishing(true);
    setPublishProgress(0);
    const publishResults: Record<string, PublishResult> = {};

    for (let i = 0; i < selectedBoards.length; i++) {
      const boardId = selectedBoards[i];
      try {
        // Simular publicação
        await new Promise(r => setTimeout(r, 800));
        publishResults[boardId] = {
          success: Math.random() > 0.1,
          externalId: `ext-${Date.now()}-${boardId}`,
          url: `https://${boardId}.com/job/${vagaId}`,
        };
      } catch {
        publishResults[boardId] = { success: false, error: "Erro de conexão" };
      }
      setPublishProgress(((i + 1) / selectedBoards.length) * 100);
    }

    setResults(publishResults);
    setIsPublishing(false);
    onPublish?.(publishResults);

    const successCount = Object.values(publishResults).filter(r => r.success).length;
    toast({
      title: `Publicação concluída!`,
      description: `${successCount}/${selectedBoards.length} canais publicados com sucesso`,
    });
  };

  const totalStats = connectedBoards.reduce(
    (acc, board) => ({
      views: acc.views + (board.stats?.views || 0),
      clicks: acc.clicks + (board.stats?.clicks || 0),
      applications: acc.applications + (board.stats?.applications || 0),
    }),
    { views: 0, clicks: 0, applications: 0 }
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Multi-Channel Publisher
                <Badge variant="secondary" className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  1-Click
                </Badge>
              </CardTitle>
              <CardDescription>
                Publique em múltiplos job boards simultaneamente
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showStats ? 'Ocultar Stats' : 'Ver Stats'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Stats Overview */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">Visualizações</span>
                </div>
                <p className="text-2xl font-bold">{totalStats.views.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                  <MousePointer className="h-4 w-4" />
                  <span className="text-xs">Cliques</span>
                </div>
                <p className="text-2xl font-bold">{totalStats.clicks.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Candidaturas</span>
                </div>
                <p className="text-2xl font-bold">{totalStats.applications.toLocaleString()}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vaga Info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <span className="text-sm text-muted-foreground">Publicando:</span>
            <p className="font-semibold">{vagaTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={autoPost} 
              onCheckedChange={setAutoPost}
              id="auto-post"
            />
            <Label htmlFor="auto-post" className="text-sm">
              Auto-renovar
            </Label>
          </div>
        </div>

        {/* Connected Boards */}
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
            {connectedBoards.map((board, index) => {
              const result = results[board.id];
              const isSelected = selectedBoards.includes(board.id);
              
              return (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30",
                    result?.success && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    result?.success === false && "border-red-500 bg-red-50 dark:bg-red-950/20"
                  )}
                  onClick={() => !isPublishing && toggleBoard(board.id)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      disabled={isPublishing}
                      className="pointer-events-none"
                    />
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br",
                      board.color
                    )}>
                      {board.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{board.name}</span>
                        {board.isPremium && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                        {board.stats && board.stats.views > 0 && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {board.stats.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {board.stats.applications}
                            </span>
                            <span className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              {((board.stats.applications / board.stats.views) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {result?.success === true && (
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                    {result?.success === false && (
                      <div className="flex items-center gap-2 text-red-500">
                        <X className="h-5 w-5" />
                        <span className="text-xs">{result.error}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Disconnected Boards */}
        {disconnectedBoards.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Disponíveis para conexão
            </h4>
            <div className="grid gap-2">
              {disconnectedBoards.map((board) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-dashed opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br",
                      board.color
                    )}>
                      {board.logo}
                    </div>
                    <span className="font-medium">{board.name}</span>
                    {board.isPremium && (
                      <Badge variant="outline" className="text-xs">Premium</Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publishing Progress */}
        {isPublishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Publicando...</span>
              <span className="font-medium">{Math.round(publishProgress)}%</span>
            </div>
            <Progress value={publishProgress} className="h-2" />
          </motion.div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedBoards.length} selecionado(s)
            </Badge>
            {Object.keys(results).length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setResults({})}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Resetar
              </Button>
            )}
          </div>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing || selectedBoards.length === 0}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
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
