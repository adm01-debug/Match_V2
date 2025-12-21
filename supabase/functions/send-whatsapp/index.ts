// Edge Function: Envio de mensagens WhatsApp
// Compatível com: Evolution API, Z-API, Twilio

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Input validation schema
const RequestSchema = z.object({
  // Add your schema here
}).passthrough();


// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const client = rateLimitMap.get(clientId);
  if (!client || now > client.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (client.count >= RATE_LIMIT) return false;
  client.count++;
  return true;
}


const WHATSAPP_API_URL = Deno.env.get("WHATSAPP_API_URL");
const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY");
const WHATSAPP_INSTANCE = Deno.env.get("WHATSAPP_INSTANCE");

interface WhatsAppRequest {
  to: string;
  message: string;
  type?: "text" | "template";
  templateName?: string;
  templateParams?: Record<string, string>;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Formatar número para WhatsApp (adicionar código do país)
function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 11) return `55${numbers}`;
  if (numbers.length === 10) return `559${numbers}`;
  return numbers;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, type = "text" }: WhatsAppRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!WHATSAPP_API_URL || !WHATSAPP_API_KEY) {
      console.error("WhatsApp API not configured");
      return new Response(
        JSON.stringify({ error: "WhatsApp service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedPhone = formatPhone(to);

    // Evolution API format
    const payload = {
      number: formattedPhone,
      text: message,
    };

    const response = await fetch(`${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`, {
      method: "POST",
      headers: {
        "apikey": WHATSAPP_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send message", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("WhatsApp message sent:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
