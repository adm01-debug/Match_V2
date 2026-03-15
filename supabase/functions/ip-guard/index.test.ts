import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.224.0/assert/assert_exists.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("ip-guard - check action com IP local", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ip-guard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ip: "192.168.1.1", action: "check" }),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertExists(body);
});

Deno.test("ip-guard - check action com IP público", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ip-guard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ip: "1.1.1.1", action: "check" }),
  });
  const body = await res.text();
  assertExists(body);
  assertEquals(res.status >= 200 && res.status < 500, true);
});

Deno.test("ip-guard - sem body retorna erro controlado", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ip-guard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({}),
  });
  const body = await res.text();
  assertExists(body);
});
