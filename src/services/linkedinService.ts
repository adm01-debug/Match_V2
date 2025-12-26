interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  headline?: string;
  profilePicture?: string;
  positions?: { title: string; company: string; startDate: string; endDate?: string }[];
  education?: { school: string; degree: string; field: string; startYear: number; endYear?: number }[];
  skills?: string[];
}

interface LinkedInAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

export const linkedinService = {
  config: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/linkedin/callback`,
    scope: ['r_liteprofile', 'r_emailaddress'],
  } as LinkedInAuthConfig,

  getAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state: crypto.randomUUID(),
    });
    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('/api/linkedin/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: this.config.redirectUri }),
    });
    const data = await response.json();
    return data.access_token;
  },

  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    const response = await fetch('/api/linkedin/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  },

  mapToCandidato(profile: LinkedInProfile) {
    return {
      nome: `${profile.firstName} ${profile.lastName}`,
      email: profile.email || '',
      linkedin_url: `https://linkedin.com/in/${profile.id}`,
      cargo_atual: profile.headline || '',
      foto_url: profile.profilePicture,
      experiencias: profile.positions?.map(p => ({
        cargo: p.title,
        empresa: p.company,
        data_inicio: p.startDate,
        data_fim: p.endDate,
      })) || [],
      formacoes: profile.education?.map(e => ({
        instituicao: e.school,
        curso: `${e.degree} em ${e.field}`,
        ano_conclusao: e.endYear,
      })) || [],
      skills: profile.skills || [],
      fonte: 'linkedin',
    };
  },

  openAuthPopup(): Promise<string> {
    return new Promise((resolve, reject) => {
      const width = 600, height = 700;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      const popup = window.open(this.getAuthUrl(), 'LinkedIn Login', `width=${width},height=${height},left=${left},top=${top}`);
      
      const checkPopup = setInterval(() => {
        try {
          if (popup?.closed) {
            clearInterval(checkPopup);
            reject(new Error('Popup closed'));
          }
          if (popup?.location.href.includes('code=')) {
            const url = new URL(popup.location.href);
            const code = url.searchParams.get('code');
            popup.close();
            clearInterval(checkPopup);
            if (code) resolve(code);
            else reject(new Error('No code received'));
          }
        } catch (e) { /* cross-origin, ignore */ }
      }, 500);
    });
  },
};

export default linkedinService;
