import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { tracedRpc } from "@/lib/sentryRpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { RefreshCw, RotateCcw, Mail, MessageSquare, AlertCircle, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type RetryStatus = "pending" | "processing" | "sent" | "dead";

type RetryRow = {
  id: string;
  channel: string;
  recipient: string;
  status: RetryStatus;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  next_retry_at: string;
  created_at: string;
  updated_at: string;
};

const STATUS_VARIANTS: Record<RetryStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  processing: "secondary",
  sent: "default",
  dead: "destructive",
};

const STATUS_LABELS: Record<RetryStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  sent: "Enviado",
  dead: "Falhado",
};

export default function DeadLetterQueuePage() {
  const [activeStatus, setActiveStatus] = useState<RetryStatus>("dead");
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ["dlq-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_communication_retry_stats");
      if (error) throw error;
      return data as Array<{ status: RetryStatus; total: number }>;
    },
    refetchInterval: 15000,
  });

  const listQuery = useQuery({
    queryKey: ["dlq-list", activeStatus],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_communication_retries", {
        p_status: activeStatus,
        p_limit: 100,
        p_offset: 0,
      });
      if (error) throw error;
      return (data ?? []) as RetryRow[];
    },
    refetchInterval: 15000,
  });

  const requeueMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("admin_requeue_communication_retry", { p_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Item reenfileirado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["dlq-list"] });
      queryClient.invalidateQueries({ queryKey: ["dlq-stats"] });
    },
    onError: (err: Error) => toast.error(`Falha ao reenfileirar: ${err.message}`),
  });

  const healthQuery = useQuery({
    queryKey: ["dlq-health"],
    queryFn: async () => {
      const { data, error } = await tracedRpc("admin_integration_health_summary", async () => await supabase.rpc("admin_integration_health_summary", {
        p_window_minutes: 60,
      }));
      if (error) throw error;
      return (data ?? []) as Array<{
        integration: string;
        total_success: number;
        total_failure: number;
        breaker_opens: number;
        last_state: string;
        last_error: string | null;
        last_event_at: string;
        avg_latency_ms: number | null;
      }>;
    },
    refetchInterval: 15000,
  });

  const statsByStatus = new Map(
    (statsQuery.data ?? []).map((s) => [s.status, Number(s.total)]),
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fila de Comunicações</h1>
          <p className="text-muted-foreground">
            Monitoramento e reprocessamento manual de envios de e-mail e WhatsApp.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["dlq-list"] });
            queryClient.invalidateQueries({ queryKey: ["dlq-stats"] });
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(["pending", "processing", "sent", "dead"] as RetryStatus[]).map((s) => (
          <Card key={s}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{STATUS_LABELS[s]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statsByStatus.get(s) ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" aria-hidden />
            Saúde das integrações (últimos 60 min)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthQuery.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : healthQuery.data && healthQuery.data.length > 0 ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {healthQuery.data.map((h) => {
                const stateVariant: "default" | "secondary" | "destructive" =
                  h.last_state === "breaker_open"
                    ? "destructive"
                    : h.last_state === "breaker_half_open"
                      ? "secondary"
                      : "default";
                const stateLabel =
                  h.last_state === "breaker_open"
                    ? "OPEN"
                    : h.last_state === "breaker_half_open"
                      ? "HALF-OPEN"
                      : "CLOSED";
                return (
                  <li
                    key={h.integration}
                    className="rounded-lg border p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{h.integration}</span>
                      <Badge variant={stateVariant}>{stateLabel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ✅ {h.total_success} sucessos · ❌ {h.total_failure} falhas ·{" "}
                      🔓 {h.breaker_opens} aberturas
                      {h.avg_latency_ms !== null && ` · ⏱ ${h.avg_latency_ms}ms`}
                    </p>
                    {h.last_error && (
                      <p className="line-clamp-2 text-xs text-destructive">
                        Último erro: {h.last_error}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum evento registrado nos últimos 60 minutos.
            </p>
          )}
        </CardContent>
      </Card>


      <Tabs value={activeStatus} onValueChange={(v) => setActiveStatus(v as RetryStatus)}>
        <TabsList>
          <TabsTrigger value="dead">Falhados</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="processing">Processando</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="mt-4">
          {listQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : listQuery.data && listQuery.data.length > 0 ? (
            <ul className="space-y-2">
              {listQuery.data.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.channel === "email" ? (
                            <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden />
                          )}
                          <span className="font-medium">{item.recipient}</span>
                          <Badge variant={STATUS_VARIANTS[item.status]}>
                            {STATUS_LABELS[item.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Tentativas: {item.attempts}/{item.max_attempts}
                          </span>
                        </div>
                        {item.last_error && (
                          <p className="flex items-start gap-1 text-xs text-destructive">
                            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden />
                            <span className="break-all">{item.last_error}</span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Atualizado{" "}
                          {formatDistanceToNow(new Date(item.updated_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      {(item.status === "dead" || item.status === "processing") && (
                        <Button
                          size="sm"
                          onClick={() => requeueMutation.mutate(item.id)}
                          disabled={requeueMutation.isPending}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" /> Reenfileirar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhum item nesta categoria.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
