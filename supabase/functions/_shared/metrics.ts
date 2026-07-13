// Fire-and-forget métricas de integrações externas.
// Insere em `integration_health_events` via REST usando SERVICE_ROLE.
// Nunca lança — falhas de métrica não devem afetar o fluxo principal.

type EventType = "success" | "failure" | "breaker_open" | "breaker_half_open" | "breaker_close";

interface EventPayload {
  integration: string;
  event_type: EventType;
  error?: string | null;
  latency_ms?: number | null;
  metadata?: Record<string, unknown> | null;
}

export function recordIntegrationEvent(payload: EventPayload): void {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return;

    // Fire-and-forget — não aguarda, não relança.
    void fetch(`${url}/rest/v1/integration_health_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        integration: payload.integration,
        event_type: payload.event_type,
        error: payload.error ?? null,
        latency_ms: payload.latency_ms ?? null,
        metadata: payload.metadata ?? null,
      }),
    }).catch(() => {
      /* silencioso */
    });
  } catch {
    /* silencioso */
  }
}
