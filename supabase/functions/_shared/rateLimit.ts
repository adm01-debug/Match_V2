// Helper compartilhado de rate limiting para edge functions.
// Uso:
//   import { enforceRateLimit } from "../_shared/rateLimit.ts";
//   const limited = await enforceRateLimit(req, { route: "webhook-handler", max: 60 });
//   if (limited) return limited; // Response 429 pronto

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RateLimitOptions {
  route: string;
  max: number;
  windowSeconds?: number;
  keyOverride?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const admin = SUPABASE_URL && SERVICE_ROLE
  ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
  : null;

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  return "anonymous";
}

/**
 * Retorna `Response` 429 se o limite foi excedido; caso contrário `null`.
 * Falha aberta (permite passar) quando o cliente admin não está disponível
 * — melhor degradar do que derrubar tráfego legítimo.
 */
export async function enforceRateLimit(
  req: Request,
  opts: RateLimitOptions,
): Promise<Response | null> {
  if (!admin) return null;

  const key = opts.keyOverride ?? clientKey(req);
  const window = opts.windowSeconds ?? 60;

  try {
    const { data, error } = await admin.rpc("check_rate_limit", {
      p_route: opts.route,
      p_key: key,
      p_max: opts.max,
      p_window_seconds: window,
    });

    if (error) {
      console.warn("[rateLimit] rpc error, allowing request", error.message);
      return null;
    }

    if (data === false) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          route: opts.route,
          retry_after_seconds: window,
        }),
        {
          status: 429,
          headers: {
            "content-type": "application/json",
            "retry-after": String(window),
          },
        },
      );
    }
    return null;
  } catch (err) {
    console.warn("[rateLimit] exception, allowing request", err);
    return null;
  }
}
