export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  headline?: string;
  profilePicture?: string;
  positions?: { 
    title: string; 
    company: string; 
    startDate: string; 
    endDate?: string;
    current?: boolean;
  }[];
  education?: { 
    school: string; 
    degree: string; 
    field: string; 
    startYear: number; 
    endYear?: number;
  }[];
  skills?: string[];
}

interface LinkedInAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

interface LinkedInCandidato {
  nome: string;
  email: string;
  linkedin_url: string;
  cargo_atual: string;
  foto_url?: string;
  experiencias: {
    cargo: string;
    empresa: string;
    data_inicio: string;
    data_fim?: string;
    atual?: boolean;
  }[];
  formacoes: {
    instituicao: string;
    curso: string;
    ano_conclusao?: number;
  }[];
  skills: string[];
  fonte: 'linkedin';
}

class LinkedInServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'LINKEDIN_ERROR'
  ) {
    super(message);
    this.name = 'LinkedInServiceError';
  }
}

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const POPUP_TIMEOUT = 300000; // 5 minutos
const POPUP_CHECK_INTERVAL = 500; // 500ms

// Armazenar state para verificação CSRF
let pendingState: string | null = null;

function generateState(): string {
  const state = crypto.randomUUID();
  pendingState = state;
  // Também salvar em sessionStorage como backup
  sessionStorage.setItem('linkedin_oauth_state', state);
  return state;
}

function validateState(returnedState: string): boolean {
  const storedState = pendingState ?? sessionStorage.getItem('linkedin_oauth_state');
  pendingState = null;
  sessionStorage.removeItem('linkedin_oauth_state');
  return storedState === returnedState;
}

export const linkedinService = {
  config: {
    clientId: import.meta.env['VITE_LINKEDIN_CLIENT_ID'] ?? '',
    redirectUri: typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/linkedin/callback`
      : '',
    scope: ['r_liteprofile', 'r_emailaddress'],
  } as LinkedInAuthConfig,

  isConfigured(): boolean {
    return !!this.config.clientId;
  },

  getAuthUrl(): string {
    if (!this.isConfigured()) {
      throw new LinkedInServiceError('LinkedIn client ID não configurado', 'NOT_CONFIGURED');
    }
    
    const state = generateState();
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state,
    });
    
    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string, state?: string): Promise<string> {
    // Validar state se fornecido
    if (state && !validateState(state)) {
      throw new LinkedInServiceError('State inválido - possível ataque CSRF', 'INVALID_STATE');
    }
    
    if (!code?.trim()) {
      throw new LinkedInServiceError('Código de autorização é obrigatório', 'VALIDATION_ERROR');
    }
    
    try {
      const response = await fetch('/api/linkedin/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          redirectUri: this.config.redirectUri 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LinkedInServiceError(
          errorData.message ?? `HTTP ${response.status}`,
          'TOKEN_ERROR'
        );
      }
      
      const data = await response.json();
      
      if (!data.access_token) {
        throw new LinkedInServiceError('Token não recebido', 'TOKEN_ERROR');
      }
      
      return data.access_token;
    } catch (error) {
      if (error instanceof LinkedInServiceError) throw error;
      throw new LinkedInServiceError(
        error instanceof Error ? error.message : 'Erro ao trocar código por token',
        'TOKEN_ERROR'
      );
    }
  },

  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    if (!accessToken?.trim()) {
      throw new LinkedInServiceError('Access token é obrigatório', 'VALIDATION_ERROR');
    }
    
    try {
      const response = await fetch('/api/linkedin/profile', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new LinkedInServiceError(`HTTP ${response.status}`, 'PROFILE_ERROR');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof LinkedInServiceError) throw error;
      throw new LinkedInServiceError(
        error instanceof Error ? error.message : 'Erro ao obter perfil',
        'PROFILE_ERROR'
      );
    }
  },

  mapToCandidato(profile: LinkedInProfile): LinkedInCandidato {
    return {
      nome: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Nome não informado',
      email: profile.email ?? '',
      linkedin_url: `https://linkedin.com/in/${profile.id}`,
      cargo_atual: profile.headline ?? '',
      foto_url: profile.profilePicture,
      experiencias: profile.positions?.map(p => ({
        cargo: p.title,
        empresa: p.company,
        data_inicio: p.startDate,
        data_fim: p.endDate,
        atual: p.current ?? !p.endDate,
      })) ?? [],
      formacoes: profile.education?.map(e => ({
        instituicao: e.school,
        curso: e.field ? `${e.degree} em ${e.field}` : e.degree,
        ano_conclusao: e.endYear,
      })) ?? [],
      skills: profile.skills ?? [],
      fonte: 'linkedin',
    };
  },

  openAuthPopup(): Promise<{ code: string; state: string }> {
    return new Promise((resolve, reject) => {
      if (!this.isConfigured()) {
        reject(new LinkedInServiceError('LinkedIn não configurado', 'NOT_CONFIGURED'));
        return;
      }
      
      const width = 600;
      const height = 700;
      const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
      const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);
      
      const popup = window.open(
        this.getAuthUrl(), 
        'LinkedIn Login', 
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=yes,status=no,menubar=no`
      );
      
      if (!popup) {
        reject(new LinkedInServiceError('Não foi possível abrir popup. Verifique se popups estão bloqueados.', 'POPUP_BLOCKED'));
        return;
      }
      
      const startTime = Date.now();
      
      const checkPopup = setInterval(() => {
        // Timeout check
        if (Date.now() - startTime > POPUP_TIMEOUT) {
          clearInterval(checkPopup);
          try { popup.close(); } catch {}
          reject(new LinkedInServiceError('Timeout - autenticação demorou muito', 'TIMEOUT'));
          return;
        }
        
        // Popup closed check
        if (popup.closed) {
          clearInterval(checkPopup);
          reject(new LinkedInServiceError('Popup fechado pelo usuário', 'USER_CANCELLED'));
          return;
        }
        
        // Check for callback
        try {
          const url = popup.location.href;
          
          if (url.includes('code=') || url.includes('error=')) {
            clearInterval(checkPopup);
            
            const urlObj = new URL(url);
            const code = urlObj.searchParams.get('code');
            const state = urlObj.searchParams.get('state');
            const error = urlObj.searchParams.get('error');
            const errorDescription = urlObj.searchParams.get('error_description');
            
            popup.close();
            
            if (error) {
              reject(new LinkedInServiceError(
                errorDescription ?? error, 
                'AUTH_ERROR'
              ));
              return;
            }
            
            if (!code) {
              reject(new LinkedInServiceError('Código não recebido', 'NO_CODE'));
              return;
            }
            
            resolve({ code, state: state ?? '' });
          }
        } catch {
          // Cross-origin error é esperado enquanto está no LinkedIn
        }
      }, POPUP_CHECK_INTERVAL);
    });
  },

  // Método completo de autenticação
  async authenticate(): Promise<LinkedInCandidato> {
    const { code, state } = await this.openAuthPopup();
    const accessToken = await this.exchangeCodeForToken(code, state);
    const profile = await this.getProfile(accessToken);
    return this.mapToCandidato(profile);
  },
};

export default linkedinService;
