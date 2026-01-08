import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDeviceFingerprint, getDeviceName, DeviceInfo } from '@/lib/deviceFingerprint';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TrustedDevice {
  id: string;
  device_hash: string;
  device_name: string | null;
  last_used_at: string;
  created_at: string;
  expires_at: string;
}

interface UseTrustedDevicesReturn {
  devices: TrustedDevice[];
  currentDevice: DeviceInfo | null;
  isCurrentDeviceTrusted: boolean;
  isLoading: boolean;
  isNewDevice: boolean;
  checkDevice: () => Promise<{ isNew: boolean; deviceInfo: DeviceInfo }>;
  trustCurrentDevice: () => Promise<void>;
  removeDevice: (deviceId: string) => Promise<void>;
  removeAllDevices: () => Promise<void>;
}

const DEVICE_EXPIRY_DAYS = 30;

export const useTrustedDevices = (): UseTrustedDevicesReturn => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo | null>(null);
  const [isCurrentDeviceTrusted, setIsCurrentDeviceTrusted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewDevice, setIsNewDevice] = useState(false);

  const fetchDevices = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching trusted devices:', error);
    }
  }, [user?.id]);

  const checkDevice = useCallback(async (): Promise<{ isNew: boolean; deviceInfo: DeviceInfo }> => {
    const deviceInfo = await generateDeviceFingerprint();
    setCurrentDevice(deviceInfo);

    if (!user?.id) {
      return { isNew: true, deviceInfo };
    }

    try {
      const { data: existingDevice, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_hash', deviceInfo.fingerprint)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      const isNew = !existingDevice;
      setIsCurrentDeviceTrusted(!isNew);
      setIsNewDevice(isNew);

      // Update last used time if device exists
      if (existingDevice) {
        await supabase
          .from('trusted_devices')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', existingDevice.id);
      }

      return { isNew, deviceInfo };
    } catch (error) {
      console.error('Error checking device:', error);
      return { isNew: true, deviceInfo };
    }
  }, [user?.id]);

  const trustCurrentDevice = useCallback(async () => {
    if (!user?.id || !currentDevice) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + DEVICE_EXPIRY_DAYS);

      const { error } = await supabase
        .from('trusted_devices')
        .upsert({
          user_id: user.id,
          device_hash: currentDevice.fingerprint,
          device_name: getDeviceName(currentDevice),
          expires_at: expiresAt.toISOString(),
          last_used_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,device_hash',
        });

      if (error) throw error;

      setIsCurrentDeviceTrusted(true);
      setIsNewDevice(false);
      await fetchDevices();
      toast.success('Dispositivo adicionado como confiável');
    } catch (error) {
      console.error('Error trusting device:', error);
      toast.error('Erro ao salvar dispositivo');
    }
  }, [user?.id, currentDevice, fetchDevices]);

  const removeDevice = useCallback(async (deviceId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('trusted_devices')
        .delete()
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDevices();
      
      // Check if removed device is current
      const removedDevice = devices.find(d => d.id === deviceId);
      if (removedDevice && currentDevice && removedDevice.device_hash === currentDevice.fingerprint) {
        setIsCurrentDeviceTrusted(false);
        setIsNewDevice(true);
      }
      
      toast.success('Dispositivo removido');
    } catch (error) {
      console.error('Error removing device:', error);
      toast.error('Erro ao remover dispositivo');
    }
  }, [user?.id, devices, currentDevice, fetchDevices]);

  const removeAllDevices = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('trusted_devices')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setDevices([]);
      setIsCurrentDeviceTrusted(false);
      setIsNewDevice(true);
      toast.success('Todos os dispositivos foram removidos');
    } catch (error) {
      console.error('Error removing all devices:', error);
      toast.error('Erro ao remover dispositivos');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      Promise.all([fetchDevices(), checkDevice()]).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user?.id, fetchDevices, checkDevice]);

  return {
    devices,
    currentDevice,
    isCurrentDeviceTrusted,
    isLoading,
    isNewDevice,
    checkDevice,
    trustCurrentDevice,
    removeDevice,
    removeAllDevices,
  };
};
