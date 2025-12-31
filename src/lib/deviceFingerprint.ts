/**
 * Device Fingerprint Service
 * Generates unique device identifiers for security tracking
 */

export interface DeviceInfo {
  fingerprint: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

/**
 * Get browser name from user agent
 */
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  
  return 'Unknown Browser';
};

/**
 * Get OS from user agent
 */
const getOS = (): string => {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows NT 10')) return 'Windows 10';
  if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (ua.includes('Windows NT 6.2')) return 'Windows 8';
  if (ua.includes('Windows NT 6.1')) return 'Windows 7';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'Unknown OS';
};

/**
 * Get device type
 */
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile';
  
  return 'Desktop';
};

/**
 * Generate a simple hash from string
 */
const simpleHash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Get canvas fingerprint
 */
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('MATCH ATS Security', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('MATCH ATS Security', 4, 17);
    
    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
};

/**
 * Generate device fingerprint
 */
export const generateDeviceFingerprint = async (): Promise<DeviceInfo> => {
  const browser = getBrowser();
  const os = getOS();
  const device = getDeviceType();
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  
  // Collect fingerprint components
  const components = [
    navigator.userAgent,
    screenResolution,
    screen.colorDepth.toString(),
    timezone,
    language,
    navigator.hardwareConcurrency?.toString() || 'unknown',
    getCanvasFingerprint(),
    navigator.plugins?.length?.toString() || '0',
    new Date().getTimezoneOffset().toString(),
  ];
  
  const fingerprint = await simpleHash(components.join('|'));
  
  return {
    fingerprint,
    browser,
    os,
    device,
    screenResolution,
    timezone,
    language,
  };
};

/**
 * Get device name for display
 */
export const getDeviceName = (info: DeviceInfo): string => {
  return `${info.browser} em ${info.os} (${info.device})`;
};
