import { useNewDeviceDetection } from '@/hooks/useNewDeviceDetection';
import { NewDeviceAlert } from './NewDeviceAlert';

/**
 * Component that handles new device detection on login
 * Should be placed in the main app layout
 */
export const NewDeviceDetector = () => {
  const { showAlert, deviceInfo, trustDevice, dismissAlert } = useNewDeviceDetection();

  if (!showAlert || !deviceInfo) {
    return null;
  }

  return (
    <NewDeviceAlert
      isOpen={showAlert}
      deviceInfo={deviceInfo}
      onTrustDevice={trustDevice}
      onDismiss={dismissAlert}
    />
  );
};
