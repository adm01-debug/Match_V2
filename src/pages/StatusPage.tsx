import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "ok" | "degraded" | "down";

interface HealthCheck {
  name: string;
  status: Status;
  latency_ms?: number;
  detail?: string;
}

interface HealthResponse {
  status: Status;
  timestamp: string;
  latency_ms: number;
  checks: HealthCheck[];
}

const HEALTH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health`;

const statusMeta: Record<Status, { label: string; icon: typeof CheckCircle2; className: string; badge: string }> = {
  ok: {
    label: "Todos os sistemas operacionais",
    icon: CheckCircle2,
    className: "text-success",
    badge: "bg-success/10 text-success border-success/20",
  },
  degraded: {
    label: "Degradação parcial de serviços",
    icon: AlertTriangle,
    className: "text-warning",
    badge: "bg-warning/10 text-warning border-warning/20",
  },
  down: {
    label: "Incidente em andamento",
    icon: XCircle,
    className: "text-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const checkLabels: Record<string, string> = {
  database: "Banco de dados",
  retry_queue: "Fila de reprocessamento",
  circuit_breakers: "Integrações externas",
};

export default function StatusPage() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(HEALTH_URL, { cache: "no-store" });
      const json = (await res.json()) as HealthResponse;
      setData(json);
      setLastFetched(new Date());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 30_000);
    return () => clearInterval(id);
  }, []);

  const overall = data?.status ?? "degraded";
  const meta = statusMeta[overall];
  const OverallIcon = meta.icon;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Status do Sistema | People Lovers</title>
        <meta name="description" content="Status em tempo real dos serviços da plataforma People Lovers." />
      </Helmet>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8 flex items-center gap-3">
          <Activity className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Status do Sistema</h1>
        </header>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <OverallIcon className={cn("h-8 w-8", meta.className)} aria-hidden />
              <div>
                <CardTitle className="text-xl">{meta.label}</CardTitle>
                {lastFetched && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Última verificação: {lastFetched.toLocaleTimeString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchHealth} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Atualizar
            </Button>
          </CardHeader>
        </Card>

        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="pt-6 text-sm text-destructive">
              Não foi possível carregar o status: {error}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Componentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.checks ?? []).map((check) => {
              const cMeta = statusMeta[check.status];
              const Icon = cMeta.icon;
              return (
                <div
                  key={check.name}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5 shrink-0", cMeta.className)} aria-hidden />
                    <div>
                      <div className="font-medium">{checkLabels[check.name] ?? check.name}</div>
                      {check.detail && (
                        <div className="text-xs text-muted-foreground">{check.detail}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {typeof check.latency_ms === "number" && (
                      <span className="text-xs text-muted-foreground">{check.latency_ms}ms</span>
                    )}
                    <Badge variant="outline" className={cn("uppercase text-xs", cMeta.badge)}>
                      {check.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {!data && !error && (
              <div className="text-sm text-muted-foreground text-center py-8">Carregando...</div>
            )}
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Atualização automática a cada 30 segundos.
        </footer>
      </main>
    </div>
  );
}
