/**
 * @fileoverview IP Guard Edge Function
 * @description Verifica se o IP do cliente está na whitelist
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RATE_LIMIT = 100;
const WINDOW_MS = 60000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface IPCheckRequest {
  ip?: string;
}

interface IPCheckResponse {
  allowed: boolean;
  ip: string;
  reason: string;
  checkedAt: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: 60 }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    if (req.method === 'POST') {
      try {
        const body: IPCheckRequest = await req.json();
        if (body.ip) {
          clientIP = body.ip;
        }
      } catch {
        // Ignorar erro de parse
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: allowedIP, error } = await supabase
      .from('allowed_ips')
      .select('*')
      .eq('ip_address', clientIP)
      .eq('is_active', true)
      .single();

    const checkedAt = new Date().toISOString();

    if (allowedIP && !error) {
      await supabase.from('ip_access_logs').insert({
        ip_address: clientIP,
        action: 'ALLOWED',
        allowed: true,
      });

      const response: IPCheckResponse = {
        allowed: true,
        ip: clientIP,
        reason: `Acesso permitido: ${allowedIP.description || 'IP autorizado'}`,
        checkedAt,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('ip_access_logs').insert({
      ip_address: clientIP,
      action: 'BLOCKED',
      allowed: false,
    });

    const response: IPCheckResponse = {
      allowed: false,
      ip: clientIP,
      reason: 'Acesso não autorizado. Seu IP não está na lista de permitidos.',
      checkedAt,
    };

    return new Response(JSON.stringify(response), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in ip-guard:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
