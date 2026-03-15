// WhatsApp Service — wraps send-whatsapp Edge Function
import { supabase } from '@/integrations/supabase/client';

export const whatsappService = {
  async sendMessage(phone: string, message: string) {
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { phone, message },
    });
    if (error) throw error;
    return data;
  },

  async sendTemplate(phone: string, templateName: string, variables: string[]) {
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { phone, templateName, variables },
    });
    if (error) throw error;
    return data;
  },

  isConfigured: () => true, // Edge function handles config
};
