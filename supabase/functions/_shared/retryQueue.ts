/**
 * @fileoverview Dead-letter/retry queue helpers for external communications.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export async function enqueueRetry(params: {
  channel: "email" | "whatsapp";
  recipient: string;
  payload: Record<string, unknown>;
  error?: string;
  dedupKey?: string;
  maxAttempts?: number;
}): Promise<void> {
  try {
    const sb = serviceClient();
    await sb.rpc("enqueue_communication_retry", {
      p_channel: params.channel,
      p_recipient: params.recipient,
      p_payload: params.payload,
      p_error: params.error ?? null,
      p_dedup_key: params.dedupKey ?? null,
      p_max_attempts: params.maxAttempts ?? 5,
    });
  } catch (err) {
    console.error("[retryQueue] enqueue failed (fail-open):", err);
  }
}
