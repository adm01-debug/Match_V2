import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewDeviceAlertRequest {
  userId: string;
  userEmail: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    timezone: string;
    language: string;
  };
  ipAddress?: string;
  loginTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body: NewDeviceAlertRequest = await req.json();
    const { userId, userEmail, deviceInfo, ipAddress, loginTime } = body;

    console.log(`[new-device-alert] Processing alert for user: ${userId}`);
    console.log(`[new-device-alert] Device: ${deviceInfo.browser} on ${deviceInfo.os}`);

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome')
      .eq('user_id', userId)
      .single();

    const userName = profile?.nome || userEmail;

    // Log the new device detection
    await supabase.from('ip_access_logs').insert({
      ip_address: ipAddress || 'unknown',
      user_id: userId,
      action: 'NEW_DEVICE_DETECTED',
      allowed: true,
      user_agent: `${deviceInfo.browser} - ${deviceInfo.os} - ${deviceInfo.device}`,
      endpoint: '/auth/login',
    });

    // Create internal notification
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'security',
      title: '🔐 Novo dispositivo detectado',
      message: `Login realizado de um novo dispositivo: ${deviceInfo.browser} em ${deviceInfo.os} (${deviceInfo.device}). Se não foi você, altere sua senha imediatamente.`,
      link: '/configuracoes/seguranca',
    });

    // Check if Resend API key is configured for email
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      // Send email notification using Resend
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #dc2626; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Alerta de Segurança</h1>
            </div>
            <div style="padding: 32px;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
                Olá <strong>${userName}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
                Detectamos um login na sua conta a partir de um <strong>novo dispositivo</strong>:
              </p>
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Navegador:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${deviceInfo.browser}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Sistema:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${deviceInfo.os}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Dispositivo:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${deviceInfo.device}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Fuso horário:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${deviceInfo.timezone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">IP:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${ipAddress || 'Não disponível'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Data/Hora:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${new Date(loginTime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #374151; font-size: 16px; margin-bottom: 16px;">
                <strong>Se foi você:</strong> Pode ignorar este email. Recomendamos adicionar este dispositivo como confiável.
              </p>
              <p style="color: #dc2626; font-size: 16px; margin-bottom: 24px;">
                <strong>Se NÃO foi você:</strong> Altere sua senha imediatamente e ative a autenticação de dois fatores (2FA).
              </p>
              <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'https://match-ats.lovable.app'}/configuracoes/seguranca" 
                   style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Verificar Segurança
                </a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Este é um email automático de segurança do MATCH ATS.<br>
                Você recebeu este email porque houve um login de um novo dispositivo.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "MATCH ATS <security@resend.dev>",
          to: [userEmail],
          subject: "🔐 Novo dispositivo detectado na sua conta",
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("[new-device-alert] Email send failed:", errorText);
      } else {
        console.log("[new-device-alert] Email sent successfully to:", userEmail);
      }
    } else {
      console.log("[new-device-alert] RESEND_API_KEY not configured, skipping email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Alert processed successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[new-device-alert] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
