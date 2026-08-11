/**
 * @fileoverview Web Vitals collector — envia LCP, CLS, INP, FCP, TTFB para Lovable Cloud.
 * @module lib/webVitals
 *
 * Executa de forma silenciosa: erros nunca propagam para a UI.
 * Em desenvolvimento, apenas loga no console via logger.
 */

import type { Metric } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';

const SESSION_KEY = 'wv_session_id';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon-session';
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getConnectionType(): string | null {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType ?? null;
}

async function report(metric: Metric): Promise<void> {
  const payload = {
    session_id: getSessionId(),
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    path: window.location.pathname,
    user_agent: navigator.userAgent,
    device_type: getDeviceType(),
    connection_type: getConnectionType(),
  };

  if (import.meta.env.DEV) {
    logger.debug(`[web-vitals] ${metric.name}`, payload);
    return;
  }

  try {
    // Insert direto na tabela (RLS permite anon INSERT)
    await supabase.from('web_vitals').insert(payload);
  } catch (err) {
    // Fail-silent: telemetria nunca deve quebrar a app
    logger.warn('[web-vitals] falha ao reportar métrica', err);
  }
}

/**
 * Inicializa a coleta de Web Vitals. Chamar UMA vez em `main.tsx`.
 */
export async function initWebVitals(): Promise<void> {
  try {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');
    onCLS(report);
    onFCP(report);
    onINP(report);
    onLCP(report);
    onTTFB(report);
  } catch (err) {
    logger.warn('[web-vitals] módulo indisponível', err);
  }
}
