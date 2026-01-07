import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.3.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApprovalRequest {
  requestId: string;
  action: 'approve' | 'reject';
  reviewNotes?: string;
  baseUrl: string;
}

async function sendEmail(to: string, subject: string, html: string, resendApiKey: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sistema <noreply@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email send failed: ${error}`);
  }
  
  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { requestId, action, reviewNotes, baseUrl }: ApprovalRequest = await req.json();

    console.log(`[password-reset-approval] Processing ${action} for request ${requestId}`);

    // Get the reset request
    const { data: resetRequest, error: fetchError } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !resetRequest) {
      console.error('[password-reset-approval] Request not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Solicitação não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (resetRequest.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Solicitação já foi processada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reject') {
      // Update request as rejected
      const { error: updateError } = await supabase
        .from('password_reset_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || 'Solicitação rejeitada pelo administrador',
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('[password-reset-approval] Error updating request:', updateError);
        throw updateError;
      }

      // Send rejection email if Resend is configured
      if (resendApiKey) {
        try {
          await sendEmail(
            resetRequest.user_email,
            'Solicitação de Reset de Senha - Rejeitada',
            `
              <h2>Solicitação de Reset de Senha</h2>
              <p>Olá ${resetRequest.user_name || 'Usuário'},</p>
              <p>Sua solicitação de reset de senha foi <strong>rejeitada</strong>.</p>
              ${reviewNotes ? `<p><strong>Motivo:</strong> ${reviewNotes}</p>` : ''}
              <p>Se você acredita que isso foi um erro, entre em contato com o administrador.</p>
            `,
            resendApiKey
          );
        } catch (emailError) {
          console.error('[password-reset-approval] Email error:', emailError);
        }
      }

      console.log(`[password-reset-approval] Request ${requestId} rejected`);

      return new Response(
        JSON.stringify({ success: true, message: 'Solicitação rejeitada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update request as approved
    const { error: updateError } = await supabase
      .from('password_reset_requests')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || 'Aprovado pelo administrador',
        reset_token: resetToken,
        token_expires_at: tokenExpiresAt.toISOString(),
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('[password-reset-approval] Error updating request:', updateError);
      throw updateError;
    }

    // Generate reset link
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send approval email with reset link
    if (resendApiKey) {
      try {
        await sendEmail(
          resetRequest.user_email,
          'Solicitação de Reset de Senha - Aprovada',
          `
            <h2>Solicitação de Reset de Senha Aprovada</h2>
            <p>Olá ${resetRequest.user_name || 'Usuário'},</p>
            <p>Sua solicitação de reset de senha foi <strong>aprovada</strong>.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <p><a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Redefinir Senha</a></p>
            <p>Este link é válido por 24 horas.</p>
            <p>Se você não solicitou esta alteração, ignore este email.</p>
          `,
          resendApiKey
        );
        console.log(`[password-reset-approval] Reset email sent to ${resetRequest.user_email}`);
      } catch (emailError) {
        console.error('[password-reset-approval] Email error:', emailError);
      }
    } else {
      console.log(`[password-reset-approval] Resend not configured, reset link: ${resetLink}`);
    }

    console.log(`[password-reset-approval] Request ${requestId} approved`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Solicitação aprovada e email enviado',
        resetLink: resendApiKey ? undefined : resetLink // Only return link if email not sent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[password-reset-approval] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
