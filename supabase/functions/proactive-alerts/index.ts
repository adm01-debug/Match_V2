// Proactive alerts: monitors delivery SLA and circuit breakers; emits alert emails.
// Scheduled by pg_cron every 5 minutes. Uses service role internally.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALERT_TO = Deno.env.get("ALERT_EMAIL_TO") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@match-ats.com";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const SLA_THRESHOLD = 80; // %
const BREAKER_OPEN_MINUTES = 15;
const DEDUP_WINDOW_MINUTES = 30;

interface AlertKey {
  kind: "sla_low" | "breaker_open";
  subject: string;
  html: string;
  dedup: string;
}

async function sendAlert(alert: AlertKey) {
  if (!RESEND_API_KEY || !ALERT_TO) {
    console.warn("[proactive-alerts] missing RESEND_API_KEY or ALERT_EMAIL_TO; skipping send");
    return { skipped: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [ALERT_TO],
      subject: alert.subject,
      html: alert.html,
    }),
  });
  return { ok: res.ok, status: res.status };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const fired: string[] = [];
  const skipped: string[] = [];

  try {
    const sinceDedup = new Date(Date.now() - DEDUP_WINDOW_MINUTES * 60_000).toISOString();

    // Recently fired alerts (to dedupe)
    const { data: recent } = await client
      .from("integration_health_events")
      .select("integration, event_type, metadata, created_at")
      .eq("event_type", "alert_fired")
      .gte("created_at", sinceDedup);
    const recentKeys = new Set(
      (recent ?? []).map((r) => `${(r as { metadata?: { dedup?: string } }).metadata?.dedup ?? ""}`),
    );

    // 1) Email delivery SLA check
    const { data: slaRows } = await client.rpc("public_email_delivery_sla", { p_window_minutes: 60 });
    const sla = Array.isArray(slaRows) ? slaRows[0] : null;
    if (sla && Number(sla.sent) >= 5 && Number(sla.delivery_rate) < SLA_THRESHOLD) {
      const dedup = `sla_low:${new Date().toISOString().slice(0, 13)}`; // hourly
      if (!recentKeys.has(dedup)) {
        const alert: AlertKey = {
          kind: "sla_low",
          subject: `⚠️ SLA de entrega abaixo do limite: ${sla.delivery_rate}%`,
          html: `<h2>Alerta de SLA</h2>
            <p>Taxa de entrega nos últimos 60min: <strong>${sla.delivery_rate}%</strong> (limite: ${SLA_THRESHOLD}%)</p>
            <ul>
              <li>Enviados: ${sla.sent}</li>
              <li>Entregues: ${sla.delivered}</li>
              <li>Bounces: ${sla.bounced}</li>
            </ul>
            <p>Verifique <code>/status</code> e <code>/admin/dlq</code>.</p>`,
          dedup,
        };
        const r = await sendAlert(alert);
        await client.from("integration_health_events").insert({
          integration: "alerting",
          event_type: "alert_fired",
          metadata: { dedup, kind: alert.kind, delivery_rate: sla.delivery_rate, result: r },
        });
        fired.push(dedup);
      } else {
        skipped.push("sla_low:deduped");
      }
    }

    // 2) Circuit breakers open > BREAKER_OPEN_MINUTES
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { data: events } = await client
      .from("integration_health_events")
      .select("integration, event_type, created_at")
      .in("event_type", ["breaker_open", "breaker_half_open", "breaker_close"])
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    const lastByIntegration = new Map<string, { state: string; at: string }>();
    for (const e of (events ?? []) as { integration: string; event_type: string; created_at: string }[]) {
      if (!lastByIntegration.has(e.integration)) {
        lastByIntegration.set(e.integration, { state: e.event_type, at: e.created_at });
      }
    }

    const now = Date.now();
    for (const [integration, { state, at }] of lastByIntegration) {
      if (state !== "breaker_open") continue;
      const openedFor = (now - new Date(at).getTime()) / 60_000;
      if (openedFor < BREAKER_OPEN_MINUTES) continue;
      const dedup = `breaker_open:${integration}:${new Date().toISOString().slice(0, 13)}`;
      if (recentKeys.has(dedup)) {
        skipped.push(`breaker:${integration}:deduped`);
        continue;
      }
      const alert: AlertKey = {
        kind: "breaker_open",
        subject: `🚨 Circuit breaker aberto: ${integration}`,
        html: `<h2>Alerta de integração</h2>
          <p>O circuit breaker para <strong>${integration}</strong> está aberto há ${openedFor.toFixed(0)} minutos.</p>
          <p>Início: ${at}</p>
          <p>Verifique <code>/status</code> e <code>/admin/dlq</code>.</p>`,
        dedup,
      };
      const r = await sendAlert(alert);
      await client.from("integration_health_events").insert({
        integration: "alerting",
        event_type: "alert_fired",
        metadata: { dedup, kind: alert.kind, target: integration, minutes_open: openedFor, result: r },
      });
      fired.push(dedup);
    }

    return new Response(JSON.stringify({ ok: true, fired, skipped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[proactive-alerts] error:", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
