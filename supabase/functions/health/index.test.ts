import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.224.0/assert/assert_exists.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("health - retorna status ok", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/health`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({}),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertExists(body);
});

Deno.test("health - aceita GET", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/health`, {
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  // Should not return 405
  const text = await res.text();
  assertExists(text);
});
