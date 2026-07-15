// Resend delivery webhook — recebe eventos delivered/bounced/complained/opened/clicked
// e persiste em integration_health_events para cálculo de SLA.
// Assinatura Svix (svix-id, svix-timestamp, svix-signature) verificada com RESEND_WEBHOOK_SECRET.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "svix-id, svix-timestamp, svix-signature, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Mapeia event types do Resend para nossos event_types canônicos
const EVENT_MAP: Record<string, string> = {
  "email.sent": "email_sent",
  "email.delivered": "email_delivered",
  "email.delivery_delayed": "email_delayed",
  "email.bounced": "email_bounced",
  "email.hard_bounced": "email_hard_bounced",
  "email.complained": "email_complained",
  "email.opened": "email_opened",
  "email.clicked": "email_clicked",
};

function verifySvix(secret: string, id: string, timestamp: string, body: string, header: string): boolean {
  // secret format: whsec_<base64>
  const key = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
  const signedPayload = `${id}.${timestamp}.${body}`;
  const hmac = createHmac("sha256", keyBytes).update(signedPayload).digest("base64");
  const expected = `v1,${hmac}`;
  // header pode conter múltiplas assinaturas separadas por espaço, ex: "v1,xxx v1,yyy"
  return header.split(" ").some((sig) => sig === expected);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  const body = await req.text();
  const svixId = req.headers.get("svix-id") ?? "";
  const svixTs = req.headers.get("svix-timestamp") ?? "";
  const svixSig = req.headers.get("svix-signature") ?? "";

  if (secret) {
    if (!svixId || !svixTs || !svixSig) {
      return new Response(JSON.stringify({ error: "missing signature headers" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    try {
      if (!verifySvix(secret, svixId, svixTs, body, svixSig)) {
        return new Response(JSON.stringify({ error: "invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: `signature verification failed: ${(e as Error).message}` }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    console.warn("[resend-webhook] RESEND_WEBHOOK_SECRET not configured — skipping signature check");
  }

  let payload: { type?: string; data?: Record<string, unknown> } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const eventType = EVENT_MAP[payload.type ?? ""] ?? null;
  if (!eventType) {
    // Evento desconhecido — retorna 200 para não gerar retentativa do Resend
    return new Response(JSON.stringify({ ignored: payload.type }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const data = payload.data ?? {};
  const { error } = await client.from("integration_health_events").insert({
    integration: "resend-api",
    event_type: eventType,
    metadata: {
      email_id: data.email_id ?? null,
      to: data.to ?? null,
      subject: data.subject ?? null,
      raw_type: payload.type,
    },
    error: eventType.includes("bounced") || eventType === "email_complained" ? JSON.stringify(data).slice(0, 500) : null,
  });

  if (error) {
    console.error("[resend-webhook] insert failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, event: eventType }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
