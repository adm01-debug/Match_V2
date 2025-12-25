/**
 * @fileoverview IP Guard Edge Function
 * @description Verifica se o IP do cliente está na whitelist
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';


// Rate limiting configuration
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

function isValidIP(ip: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ip === 'localhost' || ip === '::1') return true;
  if (ipv4Pattern.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every(p => p >= 0 && p <= 255);
  }
  return ipv6Pattern.test(ip);
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter IP do cliente
    let clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: 60 }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }


    // Se foi enviado um IP no body, usar esse (para testes)
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

    // Verificar se IP está na whitelist
    const { data: allowedIP, error } = await supabase
      .from('allowed_ips')
      .select('*')
      .eq('ip', clientIP)
      .eq('is_active', true)
      .single();

    const checkedAt = new Date().toISOString();

    // Se encontrou o IP e está ativo
    if (allowedIP && !error) {
      // Verificar expiração
      if (allowedIP.expires_at && new Date(allowedIP.expires_at) < new Date()) {
        // IP expirado
        await supabase.from('ip_access_logs').insert({
          ip: clientIP,
          action: 'EXPIRED',
          reason: `Acesso expirado em ${allowedIP.expires_at}`,
        });

        const response: IPCheckResponse = {
          allowed: false,
          ip: clientIP,
          reason: 'Seu acesso expirou. Entre em contato com o administrador.',
          checkedAt,
        };

        return new Response(JSON.stringify(response), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // IP válido
      await supabase.from('ip_access_logs').insert({
        ip: clientIP,
        action: 'ALLOWED',
        reason: allowedIP.description,
      });

      const response: IPCheckResponse = {
        allowed: true,
        ip: clientIP,
        reason: `Acesso permitido: ${allowedIP.description}`,
        checkedAt,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // IP não encontrado - bloquear
    await supabase.from('ip_access_logs').insert({
      ip: clientIP,
      action: 'BLOCKED',
      reason: 'IP não está na whitelist',
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

  } catch (error) {
    console.error('Error in ip-guard:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
