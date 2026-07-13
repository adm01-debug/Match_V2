/**
 * @fileoverview Send Email Edge Function
 * @description Envio de emails via Resend API com autenticação JWT
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { enforceRateLimit } from "../_shared/rateLimit.ts";
import { getBreaker, retryWithBackoff } from "../_shared/resilience.ts";
import { enqueueRetry } from "../_shared/retryQueue.ts";
import { recordIntegrationEvent } from "../_shared/metrics.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@match-ats.com';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const limited = await enforceRateLimit(req, { route: "send-email", max: 30 });
  if (limited) return limited;


  try {
    // Validação JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Unauthorized: Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Token de autenticação ausente' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Unauthorized: Invalid token', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`Authenticated user for send-email: ${userId}`);

    const { to, subject, html, replyTo }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendBreaker = getBreaker("resend-api", {
      onStateChange: (name, from, to) =>
        recordIntegrationEvent({
          integration: name,
          event_type:
            to === "open" ? "breaker_open" : to === "half-open" ? "breaker_half_open" : "breaker_close",
          metadata: { from, to },
        }),
    });
    let response: Response;
    const startedAt = Date.now();
    try {
      response = await resendBreaker.execute(() =>
        retryWithBackoff(
          () => fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [to],
              subject,
              html,
              reply_to: replyTo,
            }),
          }),
          {
            retries: 3,
            shouldRetry: (_err, _attempt) => true,
            onRetry: (err, attempt, delay) =>
              console.warn(`[send-email] retry ${attempt} em ${delay}ms:`, err),
          },
        )
      );
    } catch (breakerErr) {
      recordIntegrationEvent({
        integration: "resend-api",
        event_type: "failure",
        error: String(breakerErr),
        latency_ms: Date.now() - startedAt,
      });
      // Circuit breaker open ou falha após retries → enfileira para retentativa assíncrona
      await enqueueRetry({
        channel: "email",
        recipient: to,
        payload: { to, subject, html, replyTo, from: FROM_EMAIL },
        error: String(breakerErr),
        dedupKey: `email:${to}:${subject}:${userId}`,
      });
      return new Response(
        JSON.stringify({ queued: true, message: 'Serviço indisponível, envio agendado para retentativa' }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      recordIntegrationEvent({
        integration: "resend-api",
        event_type: "failure",
        error: JSON.stringify(data).slice(0, 500),
        latency_ms: Date.now() - startedAt,
      });
      // Falha lógica da API → também enfileira
      await enqueueRetry({
        channel: "email",
        recipient: to,
        payload: { to, subject, html, replyTo, from: FROM_EMAIL },
        error: JSON.stringify(data),
        dedupKey: `email:${to}:${subject}:${userId}`,
      });
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: data, queued: true }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    recordIntegrationEvent({
      integration: "resend-api",
      event_type: "success",
      latency_ms: Date.now() - startedAt,
    });
    console.log(`Email sent successfully by user ${userId} to ${to}`);
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});