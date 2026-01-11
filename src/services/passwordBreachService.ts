/**
 * @fileoverview Password Breach Check Service
 * @description Verifica se uma senha foi exposta em vazamentos usando Have I Been Pwned API
 * Usa k-anonymity: apenas os 5 primeiros caracteres do hash SHA-1 são enviados
 */

/**
 * Gera hash SHA-1 de uma string
 */
const sha1 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

export interface BreachCheckResult {
  isBreached: boolean;
  count: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Verifica se uma senha foi exposta em vazamentos de dados
 * Usa k-anonymity: apenas os 5 primeiros caracteres do hash são enviados à API
 */
export const checkPasswordBreach = async (password: string): Promise<BreachCheckResult> => {
  if (!password || password.length < 4) {
    return { isBreached: false, count: 0, isLoading: false, error: null };
  }

  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true' // Adiciona padding para evitar timing attacks
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao verificar senha');
    }

    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      const parts = line.split(':');
      const hashSuffix = parts[0];
      const count = parts[1];
      if (hashSuffix?.trim() === suffix) {
        return { 
          isBreached: true, 
          count: parseInt(count?.trim() ?? '0', 10), 
          isLoading: false, 
          error: null 
        };
      }
    }

    return { isBreached: false, count: 0, isLoading: false, error: null };
  } catch {
    // Silently handle - user will see "não foi possível verificar"
    return { 
      isBreached: false, 
      count: 0, 
      isLoading: false, 
      error: 'Não foi possível verificar' 
    };
  }
};
