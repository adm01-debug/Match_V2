// AI Service for intelligent matching and analysis
const ANTHROPIC_API_KEY = import.meta.env['VITE_ANTHROPIC_API_KEY'] as string | undefined;
const OPENAI_API_KEY = import.meta.env['VITE_OPENAI_API_KEY'] as string | undefined;

export interface MatchAnalysis {
  score: number;
  confidence: number;
  insights: string[];
  strengths: string[];
  gaps: string[];
  culturalFit: number;
  technicalFit: number;
  experienceFit: number;
  recommendation: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended';
}

export interface CandidatoProfile {
  nome: string;
  experiencias: string[];
  skills: string[];
  formacao: string[];
  resumo?: string;
}

export interface VagaRequirements {
  titulo: string;
  descricao: string;
  requisitos: string[];
  diferenciais?: string[];
  cultura?: string;
}

class AIService {
  private async callAnthropic(prompt: string): Promise<string> {
    if (!ANTHROPIC_API_KEY) throw new Error('Anthropic API key not configured');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async analyzeMatch(candidato: CandidatoProfile, vaga: VagaRequirements): Promise<MatchAnalysis> {
    const prompt = `Analise a compatibilidade entre o candidato e a vaga. Responda APENAS em JSON válido.

CANDIDATO:
- Nome: ${candidato.nome}
- Experiências: ${candidato.experiencias.join(', ')}
- Skills: ${candidato.skills.join(', ')}
- Formação: ${candidato.formacao.join(', ')}
${candidato.resumo ? `- Resumo: ${candidato.resumo}` : ''}

VAGA:
- Título: ${vaga.titulo}
- Descrição: ${vaga.descricao}
- Requisitos: ${vaga.requisitos.join(', ')}
${vaga.diferenciais ? `- Diferenciais: ${vaga.diferenciais.join(', ')}` : ''}
${vaga.cultura ? `- Cultura: ${vaga.cultura}` : ''}

Retorne JSON com: score (0-100), confidence (0-100), insights (array), strengths (array), gaps (array), culturalFit (0-100), technicalFit (0-100), experienceFit (0-100), recommendation (highly_recommended|recommended|consider|not_recommended)`;

    try {
      const result = ANTHROPIC_API_KEY 
        ? await this.callAnthropic(prompt)
        : await this.callOpenAI(prompt);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      return JSON.parse(jsonMatch[0]) as MatchAnalysis;
    } catch (error) {
      // AI analysis error - using fallback
      return this.fallbackAnalysis(candidato, vaga);
    }
  }

  private fallbackAnalysis(candidato: CandidatoProfile, vaga: VagaRequirements): MatchAnalysis {
    const candidatoText = [...candidato.skills, ...candidato.experiencias].join(' ').toLowerCase();
    const vagaText = [...vaga.requisitos, vaga.descricao].join(' ').toLowerCase();
    
    const keywords = vagaText.split(/\s+/).filter(w => w.length > 3);
    const matches = keywords.filter(k => candidatoText.includes(k));
    const score = Math.min(100, Math.round((matches.length / keywords.length) * 100));

    return {
      score,
      confidence: 60,
      insights: ['Análise baseada em correspondência de palavras-chave'],
      strengths: matches.slice(0, 3),
      gaps: keywords.filter(k => !candidatoText.includes(k)).slice(0, 3),
      culturalFit: 50,
      technicalFit: score,
      experienceFit: score,
      recommendation: score >= 70 ? 'recommended' : score >= 50 ? 'consider' : 'not_recommended',
    };
  }

  async parseResume(resumeText: string): Promise<Partial<CandidatoProfile>> {
    const prompt = `Extraia informações estruturadas deste currículo. Responda APENAS em JSON.

CURRÍCULO:
${resumeText}

Retorne JSON com: nome, email, telefone, skills (array), experiencias (array de strings descritivas), formacao (array), resumo (string breve)`;

    try {
      const result = ANTHROPIC_API_KEY 
        ? await this.callAnthropic(prompt)
        : await this.callOpenAI(prompt);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      // Resume parsing error - using fallback
      return {};
    }
  }

  async generateJobDescription(title: string, requirements: string[]): Promise<string> {
    const prompt = `Gere uma descrição de vaga profissional e atraente para:
Título: ${title}
Requisitos: ${requirements.join(', ')}

Inclua: sobre a empresa, responsabilidades, requisitos, benefícios. Formato em markdown.`;

    try {
      return ANTHROPIC_API_KEY 
        ? await this.callAnthropic(prompt)
        : await this.callOpenAI(prompt);
    } catch {
      return `# ${title}\n\n## Requisitos\n${requirements.map(r => `- ${r}`).join('\n')}`;
    }
  }
}

export const aiService = new AIService();
export default aiService;

