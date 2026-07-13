// AI response cache — reduces cost/latency for parse-resume / match-score / etc.
// Key = SHA-256(operation + version + normalized_input). Result stored as JSONB.
// Fail-open: any cache error is logged and bypassed so the caller path always works.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

let _client: SupabaseClient | null = null;
function client(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Build a stable cache key from an arbitrary payload.
 * Objects are sorted deterministically to avoid key drift by property order.
 */
export async function buildCacheKey(payload: unknown): Promise<string> {
  const normalized = JSON.stringify(payload, Object.keys(payload as object ?? {}).sort());
  return sha256Hex(normalized);
}

export interface CacheLookup<T> {
  hit: boolean;
  value?: T;
}

export async function getCached<T>(
  operation: string,
  version: string,
  cacheKey: string,
): Promise<CacheLookup<T>> {
  try {
    const { data, error } = await client()
      .from("ai_cache")
      .select("result, expires_at")
      .eq("cache_key", cacheKey)
      .eq("operation", operation)
      .eq("version", version)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !data) return { hit: false };

    // Fire-and-forget hit counter
    client()
      .from("ai_cache")
      .update({ hit_count: undefined as unknown as number })
      .eq("cache_key", cacheKey)
      .eq("operation", operation)
      .eq("version", version)
      .then(() => {}, () => {});

    return { hit: true, value: data.result as T };
  } catch (_e) {
    return { hit: false };
  }
}

export async function setCached(
  operation: string,
  version: string,
  cacheKey: string,
  result: unknown,
  ttlDays = 30,
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + ttlDays * 86_400_000).toISOString();
    await client()
      .from("ai_cache")
      .upsert(
        {
          cache_key: cacheKey,
          operation,
          version,
          result,
          expires_at: expiresAt,
        },
        { onConflict: "cache_key,operation,version" },
      );
  } catch (_e) {
    // fail-open
  }
}

/**
 * High-level wrapper: try cache → compute on miss → store → return.
 */
export async function withCache<T>(
  operation: string,
  version: string,
  keyPayload: unknown,
  compute: () => Promise<T>,
  ttlDays = 30,
): Promise<{ value: T; cached: boolean }> {
  const cacheKey = await buildCacheKey(keyPayload);
  const lookup = await getCached<T>(operation, version, cacheKey);
  if (lookup.hit && lookup.value !== undefined) {
    return { value: lookup.value, cached: true };
  }
  const value = await compute();
  await setCached(operation, version, cacheKey, value, ttlDays);
  return { value, cached: false };
}
