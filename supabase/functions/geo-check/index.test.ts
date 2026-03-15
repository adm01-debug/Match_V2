import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.224.0/assert/assert_exists.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("geo-check - verifica IP válido", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/geo-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ip: "8.8.8.8" }),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertExists(body);
});

Deno.test("geo-check - lida com IP vazio", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/geo-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({}),
  });
  const body = await res.text();
  assertExists(body);
  // Should handle gracefully, either 200 or 400
  assertEquals(res.status >= 200 && res.status < 500, true);
});
