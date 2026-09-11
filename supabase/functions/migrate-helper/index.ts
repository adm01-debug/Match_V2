// Edge function temporária para migração de banco.
// Após a migração e auditoria, remova esta função.

const ACCESS_KEY = "8a15e4c21c6adcef298adedc21bb18ccd3b25a67f8831547";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-access-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const MCP_EXEC_DDL = `
CREATE OR REPLACE FUNCTION public.mcp_exec(sql text, max_rows integer DEFAULT 200)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_catalog
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE format(
    'WITH q AS MATERIALIZED (%s) SELECT jsonb_build_object(''rows'', coalesce(jsonb_agg(to_jsonb(q.*)), ''[]''::jsonb)) FROM q',
    sql
  ) INTO result;
  RETURN coalesce(result, jsonb_build_object('rows', '[]'::jsonb));
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM, 'rows', '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.mcp_exec(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mcp_exec(text, integer) TO service_role;
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const key = req.headers.get("x-access-key");
  if (key !== ACCESS_KEY) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "ping";

  try {
    if (action === "ping") {
      return new Response(JSON.stringify({ ok: true, project_ref: Deno.env.get("SUPABASE_URL") }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (action === "credentials") {
      return new Response(JSON.stringify({
        url: Deno.env.get("SUPABASE_URL"),
        service_role: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
        db_url: Deno.env.get("SUPABASE_DB_URL"),
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (action === "install_mcp_exec") {
      const { Client } = await import("https://deno.land/x/postgres@v0.19.3/mod.ts");
      const dbUrl = Deno.env.get("SUPABASE_DB_URL");
      if (!dbUrl) return new Response(JSON.stringify({ error: "SUPABASE_DB_URL not set" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
      const client = new Client(dbUrl);
      await client.connect();
      try {
        await client.queryObject(MCP_EXEC_DDL);
        const check = await client.queryObject("SELECT proname, prosecdef FROM pg_proc WHERE proname='mcp_exec' AND pronamespace='public'::regnamespace");
        return new Response(JSON.stringify({ ok: true, rows: check.rows }), { headers: { ...cors, "Content-Type": "application/json" } });
      } finally {
        await client.end();
      }
    }
    if (action === "query") {
      const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
      const sql = body.sql || url.searchParams.get("sql");
      if (!sql) return new Response(JSON.stringify({ error: "sql required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      const { Client } = await import("https://deno.land/x/postgres@v0.19.3/mod.ts");
      const dbUrl = Deno.env.get("SUPABASE_DB_URL");
      if (!dbUrl) return new Response(JSON.stringify({ error: "SUPABASE_DB_URL not set" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
      const client = new Client(dbUrl);
      await client.connect();
      try {
        const result = await client.queryObject(sql);
        return new Response(JSON.stringify({ rows: result.rows, rowCount: result.rowCount }), { headers: { ...cors, "Content-Type": "application/json" } });
      } finally {
        await client.end();
      }
    }
    return new Response(JSON.stringify({ error: "unknown_action" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
