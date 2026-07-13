// Public health check endpoint - aggregates DB, breakers, workers status
// No auth required - designed for external uptime monitors (UptimeRobot, BetterStack, etc.)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

interface HealthCheck {
  name: string;
  status: "ok" | "degraded" | "down";
  latency_ms?: number;
  detail?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const started = Date.now();
  const checks: HealthCheck[] = [];
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, serviceKey);

  // 1) Database connectivity
  const dbStart = Date.now();
  try {
    const { error } = await client.from("feature_flags").select("id").limit(1);
    if (error) throw error;
    checks.push({ name: "database", status: "ok", latency_ms: Date.now() - dbStart });
  } catch (e) {
    checks.push({
      name: "database",
      status: "down",
      latency_ms: Date.now() - dbStart,
      detail: (e as Error).message,
    });
  }

  // 2) Retry queue backlog
  try {
    const { data, error } = await client
      .from("communication_retry_queue")
      .select("status", { count: "exact", head: false })
      .in("status", ["pending", "processing", "dead"]);
    if (error) throw error;

    const rows = (data ?? []) as { status: string }[];
    const dead = rows.filter((r) => r.status === "dead").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const status: HealthCheck["status"] =
      dead > 50 ? "down" : dead > 10 || pending > 500 ? "degraded" : "ok";
    checks.push({
      name: "retry_queue",
      status,
      detail: `pending=${pending} dead=${dead}`,
    });
  } catch (e) {
    checks.push({ name: "retry_queue", status: "degraded", detail: (e as Error).message });
  }

  // 3) Circuit breakers (from integration_health_events last 15min)
  try {
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const { data, error } = await client
      .from("integration_health_events")
      .select("integration, event_type, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const rows = (data ?? []) as { integration: string; event_type: string }[];
    const lastState = new Map<string, string>();
    for (const r of rows) {
      if (["breaker_open", "breaker_half_open", "breaker_close"].includes(r.event_type)) {
        if (!lastState.has(r.integration)) lastState.set(r.integration, r.event_type);
      }
    }
    const open = [...lastState.entries()].filter(([, s]) => s === "breaker_open").map(([i]) => i);
    checks.push({
      name: "circuit_breakers",
      status: open.length > 0 ? "degraded" : "ok",
      detail: open.length > 0 ? `open: ${open.join(", ")}` : "all closed",
    });
  } catch (e) {
    checks.push({ name: "circuit_breakers", status: "degraded", detail: (e as Error).message });
  }

  const overall: HealthCheck["status"] = checks.some((c) => c.status === "down")
    ? "down"
    : checks.some((c) => c.status === "degraded")
      ? "degraded"
      : "ok";

  const body = {
    status: overall,
    timestamp: new Date().toISOString(),
    latency_ms: Date.now() - started,
    checks,
  };

  return new Response(JSON.stringify(body), {
    status: overall === "down" ? 503 : 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
});
