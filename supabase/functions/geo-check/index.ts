/**
 * @fileoverview Geo Check Edge Function
 * @description Verifica geolocalização do IP e valida acesso por país
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeoResponse {
  allowed: boolean;
  country_code: string | null;
  country_name: string | null;
  ip: string;
  reason: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[geo-check] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { ip } = body;
    
    if (!ip) {
      return new Response(
        JSON.stringify({ error: 'IP não fornecido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[geo-check] Checking IP: ${ip}`);

    let countryCode: string | null = null;
    let countryName: string | null = null;

    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,country`);
      const geoData = await geoResponse.json();
      
      console.log(`[geo-check] Geo API response:`, geoData);
      
      if (geoData.status === 'success') {
        countryCode = geoData.countryCode;
        countryName = geoData.country;
      }
    } catch (geoError) {
      console.error('[geo-check] Erro na geolocalização:', geoError);
    }

    let allowed = false;
    let reason = 'País não detectado';

    if (countryCode) {
      const { data: allowedCountries, error: dbError } = await supabase
        .from('allowed_countries')
        .select('country_code, country_name')
        .eq('is_active', true);

      if (dbError) {
        console.error('[geo-check] Erro ao buscar países permitidos:', dbError);
        return new Response(
          JSON.stringify({ error: 'Erro interno ao verificar permissões' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[geo-check] Allowed countries from DB:`, allowedCountries);

      const matchedCountry = allowedCountries?.find(c => c.country_code === countryCode);
      
      if (matchedCountry) {
        allowed = true;
        reason = `País permitido: ${matchedCountry.country_name}`;
      } else {
        reason = `País não permitido: ${countryName}`;
      }
    }

    const userAgent = req.headers.get('user-agent') || null;
    
    try {
      await supabase.from('geo_access_logs').insert({
        ip_address: ip,
        country_code: countryCode,
        country_name: countryName,
        allowed,
        user_agent: userAgent,
      });
    } catch (logError) {
      console.error('[geo-check] Erro ao registrar log:', logError);
    }

    const response: GeoResponse = {
      allowed,
      country_code: countryCode,
      country_name: countryName,
      ip,
      reason,
    };

    console.log(`[geo-check] Response:`, response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[geo-check] Erro:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});