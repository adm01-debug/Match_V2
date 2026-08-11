import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type AuditRow = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export default function AuditLogPage() {
  const [filter, setFilter] = useState("");

  const query = useQuery({
    queryKey: ["admin-audit-log", filter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_audit_log", {
        p_action: filter.trim() || undefined,
        p_actor: undefined,
        p_limit: 200,
        p_offset: 0,
      });
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
    refetchInterval: 30000,
  });

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Log de auditoria</h1>
          <p className="text-sm text-muted-foreground">
            Histórico imutável de ações administrativas críticas.
          </p>
        </div>
      </header>

      <Input
        placeholder="Filtrar por ação (ex: requeue_communication_retry)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filtrar por ação"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Últimos eventos ({query.data?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : query.data && query.data.length > 0 ? (
            <ul className="space-y-2">
              {query.data.map((r) => (
                <li key={r.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{r.action}</Badge>
                    {r.target_type && (
                      <span className="text-xs text-muted-foreground">
                        {r.target_type}
                        {r.target_id ? `#${r.target_id.slice(0, 8)}` : ""}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(r.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Por:</span>{" "}
                    {r.actor_email ?? r.actor_id ?? "sistema"}
                  </p>
                  {r.metadata && Object.keys(r.metadata).length > 0 && (
                    <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                      {JSON.stringify(r.metadata, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
