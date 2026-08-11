// Email Service — wraps send-email Edge Function
import { supabase } from '@/integrations/supabase/client';

export const emailService = {
  async sendEmail(to: string, subject: string, content: string, replyTo?: string) {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html: content, replyTo },
    });
    if (error) throw error;
    return data;
  },

  async sendBulk(recipients: string[], subject: string, content: string) {
    const results = await Promise.allSettled(
      recipients.map((to) => this.sendEmail(to, subject, content))
    );
    return {
      sent: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  },

  async sendTemplated(to: string, templateId: string, variables: Record<string, string>) {
    const { data: template } = await supabase
      .from('email_templates')
      .select('assunto, conteudo')
      .eq('id', templateId)
      .single();

    if (!template) throw new Error('Template não encontrado');

    let subject = template.assunto;
    let content = template.conteudo;
    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return this.sendEmail(to, subject, content);
  },
};
