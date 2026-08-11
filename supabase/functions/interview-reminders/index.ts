/**
 * @fileoverview Interview Reminders Edge Function
 * @description Envia lembretes automáticos de entrevista para candidatos e entrevistadores
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@match-ats.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Entrevista {
  id: string;
  candidato_nome: string;
  candidato_id: string | null;
  vaga_titulo: string;
  vaga_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  tipo: string;
  local: string | null;
  link_online: string | null;
  entrevistadores: string[];
  status: string;
}

interface ReminderRequest {
  entrevistaId?: string;
  hoursAhead?: number;
  sendToCandidate?: boolean;
  sendToInterviewers?: boolean;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
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
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to send email to ${to}:`, error);
      return false;
    }

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return false;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5);
}

function generateCandidateEmail(entrevista: Entrevista): string {
  const locationInfo = entrevista.tipo === 'online' && entrevista.link_online
    ? `<p><strong>Link da reunião:</strong> <a href="${entrevista.link_online}">${entrevista.link_online}</a></p>`
    : entrevista.local
    ? `<p><strong>Local:</strong> ${entrevista.local}</p>`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; }
        .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 Lembrete de Entrevista</h1>
      </div>
      <div class="content">
        <p>Olá <strong>${entrevista.candidato_nome}</strong>,</p>
        <p>Este é um lembrete sobre sua entrevista agendada:</p>
        
        <div class="highlight">
          <p><strong>Vaga:</strong> ${entrevista.vaga_titulo}</p>
          <p><strong>Data:</strong> ${formatDate(entrevista.data)}</p>
          <p><strong>Horário:</strong> ${formatTime(entrevista.hora_inicio)} - ${formatTime(entrevista.hora_fim)}</p>
          <p><strong>Tipo:</strong> ${entrevista.tipo === 'online' ? '💻 Online' : entrevista.tipo === 'presencial' ? '🏢 Presencial' : '📞 Telefone'}</p>
          ${locationInfo}
        </div>
        
        <p><strong>Dicas para sua entrevista:</strong></p>
        <ul>
          <li>Chegue com 10-15 minutos de antecedência</li>
          <li>Prepare perguntas sobre a vaga e a empresa</li>
          <li>Tenha uma cópia do seu currículo em mãos</li>
          ${entrevista.tipo === 'online' ? '<li>Teste sua câmera e microfone antes</li>' : ''}
        </ul>
        
        <p>Boa sorte! 🍀</p>
      </div>
      <div class="footer">
        <p>People Lovers - Sistema de Recrutamento Inteligente</p>
      </div>
    </body>
    </html>
  `;
}

function generateInterviewerEmail(entrevista: Entrevista, interviewerName: string): string {
  const locationInfo = entrevista.tipo === 'online' && entrevista.link_online
    ? `<p><strong>Link da reunião:</strong> <a href="${entrevista.link_online}">${entrevista.link_online}</a></p>`
    : entrevista.local
    ? `<p><strong>Local:</strong> ${entrevista.local}</p>`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; }
        .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Lembrete: Entrevista Agendada</h1>
      </div>
      <div class="content">
        <p>Olá <strong>${interviewerName}</strong>,</p>
        <p>Você tem uma entrevista agendada em breve:</p>
        
        <div class="highlight">
          <p><strong>Candidato:</strong> ${entrevista.candidato_nome}</p>
          <p><strong>Vaga:</strong> ${entrevista.vaga_titulo}</p>
          <p><strong>Data:</strong> ${formatDate(entrevista.data)}</p>
          <p><strong>Horário:</strong> ${formatTime(entrevista.hora_inicio)} - ${formatTime(entrevista.hora_fim)}</p>
          <p><strong>Tipo:</strong> ${entrevista.tipo === 'online' ? '💻 Online' : entrevista.tipo === 'presencial' ? '🏢 Presencial' : '📞 Telefone'}</p>
          ${locationInfo}
        </div>
        
        <p><strong>Lembretes:</strong></p>
        <ul>
          <li>Revise o currículo do candidato</li>
          <li>Prepare as perguntas de avaliação</li>
          <li>Tenha o scorecard em mãos</li>
        </ul>
      </div>
      <div class="footer">
        <p>People Lovers - Sistema de Recrutamento Inteligente</p>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: ReminderRequest = req.method === 'POST' 
      ? await req.json().catch(() => ({}))
      : {};

    const {
      entrevistaId,
      hoursAhead = 24,
      sendToCandidate = true,
      sendToInterviewers = true,
    } = body;

    console.log('Processing interview reminders...', { entrevistaId, hoursAhead });

    let query = supabase
      .from('entrevistas')
      .select('*')
      .eq('status', 'agendada');

    if (entrevistaId) {
      query = query.eq('id', entrevistaId);
    } else {
      // Get interviews happening in the next X hours
      const now = new Date();
      const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
      const todayStr = now.toISOString().split('T')[0];
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      query = query.gte('data', todayStr).lte('data', futureDateStr);
    }

    const { data: entrevistas, error } = await query;

    if (error) {
      console.error('Error fetching interviews:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch interviews', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${entrevistas?.length || 0} interviews to process`);

    const results: Array<{
      entrevistaId: string;
      candidateEmail: boolean;
      interviewerEmails: number;
    }> = [];

    for (const entrevista of entrevistas || []) {
      const result: {
        entrevistaId: string;
        candidateEmail: boolean;
        interviewerEmails: number;
      } = {
        entrevistaId: entrevista.id,
        candidateEmail: false,
        interviewerEmails: 0,
      };

      // Send reminder to candidate if they have a linked candidato_id
      if (sendToCandidate && entrevista.candidato_id) {
        const { data: candidato } = await supabase
          .from('candidatos')
          .select('email, nome')
          .eq('id', entrevista.candidato_id)
          .single();

        if (candidato?.email) {
          const subject = `🔔 Lembrete: Entrevista para ${entrevista.vaga_titulo}`;
          const html = generateCandidateEmail(entrevista);
          result.candidateEmail = await sendEmail(candidato.email, subject, html);
        }
      }

      // Send reminders to interviewers
      if (sendToInterviewers && entrevista.entrevistadores?.length > 0) {
        for (const interviewerName of entrevista.entrevistadores) {
          // Try to find interviewer email from profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, nome')
            .ilike('nome', `%${interviewerName}%`)
            .single();

          if (profile?.email) {
            const subject = `📋 Lembrete: Entrevista com ${entrevista.candidato_nome}`;
            const html = generateInterviewerEmail(entrevista, interviewerName);
            if (await sendEmail(profile.email, subject, html)) {
              result.interviewerEmails++;
            }
          }
        }
      }

      results.push(result);

      // Create notification in database
      if (result.candidateEmail || result.interviewerEmails > 0) {
        await supabase.from('notifications').insert({
          user_id: entrevista.created_by || 'system',
          type: 'interview_reminder',
          title: 'Lembretes enviados',
          message: `Lembretes de entrevista enviados para ${entrevista.candidato_nome}`,
          link: `/agenda`,
          read: false,
        });
      }
    }

    console.log('Interview reminders processed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing interview reminders:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
