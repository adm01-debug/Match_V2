import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDeviceFingerprint, DeviceInfo } from '@/lib/deviceFingerprint';
import { useAuth } from '@/contexts/AuthContext';
import { createContextLogger } from '@/services/logger';

const log = createContextLogger('NewDeviceDetection');

interface UseNewDeviceDetectionReturn {
  isNewDevice: boolean;
  deviceInfo: DeviceInfo | null;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  trustDevice: () => Promise<void>;
  dismissAlert: () => void;
}

const DEVICE_EXPIRY_DAYS = 30;

export const useNewDeviceDetection = (): UseNewDeviceDetectionReturn => {
  const { user } = useAuth();
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkDevice = useCallback(async () => {
    if (!user?.id || hasChecked) return;

    try {
      const info = await generateDeviceFingerprint();
      setDeviceInfo(info);

      // Check if device is already trusted
      const { data: existingDevice } = await supabase
        .from('trusted_devices')
        .select('id')
        .eq('user_id', user.id)
        .eq('device_hash', info.fingerprint)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (!existingDevice) {
        // New device detected!
        setIsNewDevice(true);
        setShowAlert(true);

        // Get client IP (best effort)
        let ipAddress = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        } catch {
          log.debug('Could not fetch IP address');
        }

        // Send alert via edge function
        try {
          await supabase.functions.invoke('new-device-alert', {
            body: {
              userId: user.id,
              userEmail: user.email,
              deviceInfo: {
                browser: info.browser,
                os: info.os,
                device: info.device,
                timezone: info.timezone,
                language: info.language,
              },
              ipAddress,
              loginTime: new Date().toISOString(),
            },
          });
          log.info('New device alert sent successfully');
        } catch (error) {
          log.error('Failed to send new device alert:', error);
        }
      } else {
        // Update last used time
        await supabase
          .from('trusted_devices')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', existingDevice.id);
      }

      setHasChecked(true);
    } catch (error) {
      log.error('Error checking device:', error);
    }
  }, [user?.id, user?.email, hasChecked]);

  const trustDevice = useCallback(async () => {
    if (!user?.id || !deviceInfo) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + DEVICE_EXPIRY_DAYS);

      const { error } = await supabase
        .from('trusted_devices')
        .insert({
          user_id: user.id,
          device_hash: deviceInfo.fingerprint,
          device_name: `${deviceInfo.browser} em ${deviceInfo.os} (${deviceInfo.device})`,
          expires_at: expiresAt.toISOString(),
          last_used_at: new Date().toISOString(),
        });

      if (error) throw error;

      setIsNewDevice(false);
      setShowAlert(false);
    } catch (error) {
      log.error('Error trusting device:', error);
      throw error;
    }
  }, [user?.id, deviceInfo]);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  useEffect(() => {
    if (user?.id && !hasChecked) {
      // Small delay to ensure auth is fully established
      const timer = setTimeout(checkDevice, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [user?.id, hasChecked, checkDevice]);

  // Reset when user logs out
  useEffect(() => {
    if (!user) {
      setHasChecked(false);
      setIsNewDevice(false);
      setShowAlert(false);
      setDeviceInfo(null);
    }
  }, [user]);

  return {
    isNewDevice,
    deviceInfo,
    showAlert,
    setShowAlert,
    trustDevice,
    dismissAlert,
  };
};
