/**
 * @hook useWebAuthn
 * @description Hook para gerenciar autenticação WebAuthn/Passkeys
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WebAuthnCredential {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  device_type: string | null;
  device_name: string | null;
  transports: string[] | null;
  created_at: string;
  last_used_at: string | null;
}

// Helper functions for encoding/decoding
function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function useWebAuthn() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check WebAuthn support
  useEffect(() => {
    const checkSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsSupported(available);
        } catch {
          setIsSupported(false);
        }
      } else {
        setIsSupported(false);
      }
    };
    checkSupport();
  }, []);

  // Fetch user's passkeys
  const fetchCredentials = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webauthn_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error) {
      console.error('Erro ao buscar passkeys:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  // Register a new passkey
  const registerPasskey = async (deviceName?: string): Promise<boolean> => {
    if (!user || !isSupported) {
      toast.error('WebAuthn não suportado neste dispositivo');
      return false;
    }

    setIsRegistering(true);
    try {
      // Generate challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Get existing credential IDs to exclude
      const excludeCredentials = credentials.map(cred => ({
        id: base64urlToBuffer(cred.credential_id),
        type: 'public-key' as const,
        transports: (cred.transports || ['internal']) as AuthenticatorTransport[],
      }));

      // Create credential options
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: challenge.buffer,
        rp: {
          name: 'People Lovers',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user.id),
          name: user.email || '',
          displayName: (user.user_metadata as Record<string, unknown>)?.['nome'] as string || user.email || 'Usuário',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },   // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
        excludeCredentials,
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Falha ao criar credencial');
      }

      const response = credential.response as AuthenticatorAttestationResponse;
      
      // Extract credential data
      const credentialId = bufferToBase64url(credential.rawId);
      const publicKey = bufferToBase64url(response.getPublicKey() || new ArrayBuffer(0));
      const transports = response.getTransports?.() || ['internal'];

      // Detect device type
      let deviceType = 'unknown';
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        deviceType = 'ios';
      } else if (/Android/.test(navigator.userAgent)) {
        deviceType = 'android';
      } else if (/Mac/.test(navigator.userAgent)) {
        deviceType = 'macos';
      } else if (/Windows/.test(navigator.userAgent)) {
        deviceType = 'windows';
      } else if (/Linux/.test(navigator.userAgent)) {
        deviceType = 'linux';
      }

      // Save to database
      const { error } = await supabase
        .from('webauthn_credentials')
        .insert({
          user_id: user.id,
          credential_id: credentialId,
          public_key: publicKey,
          counter: 0,
          device_type: deviceType,
          device_name: deviceName || `${deviceType.toUpperCase()} Passkey`,
          transports,
        });

      if (error) throw error;

      toast.success('Passkey registrada com sucesso!');
      await fetchCredentials();
      return true;
    } catch (error: unknown) {
      console.error('Erro ao registrar passkey:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Registro cancelado pelo usuário');
      } else {
        toast.error('Erro ao registrar passkey');
      }
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  // Delete a passkey
  const deletePasskey = async (credentialId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('webauthn_credentials')
        .delete()
        .eq('id', credentialId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Passkey removida com sucesso');
      await fetchCredentials();
      return true;
    } catch (error) {
      console.error('Erro ao remover passkey:', error);
      toast.error('Erro ao remover passkey');
      return false;
    }
  };

  // Rename a passkey
  const renamePasskey = async (credentialId: string, newName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('webauthn_credentials')
        .update({ device_name: newName })
        .eq('id', credentialId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Passkey renomeada com sucesso');
      await fetchCredentials();
      return true;
    } catch (error) {
      console.error('Erro ao renomear passkey:', error);
      toast.error('Erro ao renomear passkey');
      return false;
    }
  };

  return {
    credentials,
    loading,
    isSupported,
    isRegistering,
    registerPasskey,
    deletePasskey,
    renamePasskey,
    refreshCredentials: fetchCredentials,
  };
}
