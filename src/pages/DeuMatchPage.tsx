import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { CompanyValuesQuiz } from '@/components/match/CompanyValuesQuiz';
import { CandidateValuesQuiz } from '@/components/match/CandidateValuesQuiz';
import { 
  type PerfilCulturalEmpresa, 
  type PerfilCulturalCandidato,
  type MatchResult
} from '@/types/match';
import { 
  calcularMatch, 
  salvarPerfilLocal, 
  recuperarPerfilLocal,
  limparPerfisLocais
} from '@/lib/matchCalculator';
import confetti from 'canvas-confetti';

// New Components
import { DeuMatchHome } from '@/components/deu-match/DeuMatchHome';
import { DeuMatchProfileResult } from '@/components/deu-match/DeuMatchProfileResult';
import { DeuMatchesView } from '@/components/deu-match/DeuMatchesView';
import { DeuMatchActionCards } from '@/components/deu-match/DeuMatchActionCards';

type PageView = 
  | 'home' 
  | 'quiz-empresa' 
  | 'quiz-candidato' 
  | 'resultado-empresa'
  | 'resultado-candidato'
  | 'matches';

const DeuMatchPage: React.FC = () => {
  const [view, setView] = useState<PageView>('home');
  const [candidatoNome, setCandidatoNome] = useState('');
  const [empresaNome, setEmpresaNome] = useState('');
  const [perfilEmpresa, setPerfilEmpresa] = useState<PerfilCulturalEmpresa | null>(null);
  const [perfilCandidato, setPerfilCandidato] = useState<PerfilCulturalCandidato | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    const empresaSalva = recuperarPerfilLocal<PerfilCulturalEmpresa>('empresa');
    const candidatoSalvo = recuperarPerfilLocal<PerfilCulturalCandidato>('candidato');
    if (empresaSalva) {
      setPerfilEmpresa(empresaSalva);
      setEmpresaNome(empresaSalva.empresaNome);
    }
    if (candidatoSalvo) {
      setPerfilCandidato(candidatoSalvo);
      setCandidatoNome(candidatoSalvo.candidatoNome);
    }
  }, []);

  useEffect(() => {
    if (perfilEmpresa && perfilCandidato) {
      setMatches([calcularMatch(perfilEmpresa, perfilCandidato)]);
    }
  }, [perfilEmpresa, perfilCandidato]);

  const handleEmpresaComplete = (perfil: PerfilCulturalEmpresa) => {
    setPerfilEmpresa(perfil);
    salvarPerfilLocal('empresa', perfil);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#a855f7'] });
    setView('resultado-empresa');
  };

  const handleCandidatoComplete = (perfil: PerfilCulturalCandidato) => {
    setPerfilCandidato(perfil);
    salvarPerfilLocal('candidato', perfil);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#f472b6', '#fb7185'] });
    setView('resultado-candidato');
  };

  const handleReset = () => {
    limparPerfisLocais();
    setPerfilEmpresa(null); setPerfilCandidato(null); setMatches([]);
    setCandidatoNome(''); setEmpresaNome(''); setView('home');
  };

  if (view === 'quiz-empresa') {
    return (
      <Layout title="Quiz Empresa">
        <div className="max-w-4xl mx-auto py-8">
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <CompanyValuesQuiz empresaNome={empresaNome} onComplete={handleEmpresaComplete} onCancel={() => setView('home')} />
        </div>
      </Layout>
    );
  }

  if (view === 'quiz-candidato') {
    return (
      <Layout title="Quiz Candidato">
        <div className="max-w-4xl mx-auto py-8">
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <CandidateValuesQuiz candidatoId={crypto.randomUUID()} candidatoNome={candidatoNome} onComplete={handleCandidatoComplete} onCancel={() => setView('home')} />
        </div>
      </Layout>
    );
  }

  if (view === 'resultado-empresa' && perfilEmpresa) {
    return <DeuMatchProfileResult type="empresa" perfil={perfilEmpresa} hasOtherProfile={!!perfilCandidato} onBack={() => setView('home')} onViewMatches={() => setView('matches')} />;
  }

  if (view === 'resultado-candidato' && perfilCandidato) {
    return <DeuMatchProfileResult type="candidato" perfil={perfilCandidato} hasOtherProfile={!!perfilEmpresa} onBack={() => setView('home')} onViewMatches={() => setView('matches')} />;
  }

  if (view === 'matches' && matches.length > 0) {
    return <DeuMatchesView matches={matches} empresaNome={perfilEmpresa?.empresaNome || ''} candidatoNome={perfilCandidato?.candidatoNome || ''} onBack={() => setView('home')} />;
  }

  return (
    <Layout title="Deu Match">
      <DeuMatchHome 
        perfilEmpresa={perfilEmpresa} 
        perfilCandidato={perfilCandidato}
        empresaNome={empresaNome}
        candidatoNome={candidatoNome}
        onEmpresaNomeChange={setEmpresaNome}
        onCandidatoNomeChange={setCandidatoNome}
        onStartEmpresa={() => setView('quiz-empresa')}
        onStartCandidato={() => setView('quiz-candidato')}
        onViewResultEmpresa={() => setView('resultado-empresa')}
        onViewResultCandidato={() => setView('resultado-candidato')}
        onViewMatches={() => setView('matches')}
        onReset={handleReset}
        onResetEmpresa={() => setPerfilEmpresa(null)}
        onResetCandidato={() => setPerfilCandidato(null)}
      />
      <DeuMatchActionCards 
        empresaNome={empresaNome}
        candidatoNome={candidatoNome}
        onEmpresaNomeChange={setEmpresaNome}
        onCandidatoNomeChange={setCandidatoNome}
        perfilEmpresa={perfilEmpresa}
        perfilCandidato={perfilCandidato}
        onStartEmpresa={() => setView('quiz-empresa')}
        onStartCandidato={() => setView('quiz-candidato')}
        onViewEmpresaResult={() => setView('resultado-empresa')}
        onViewCandidatoResult={() => setView('resultado-candidato')}
        onResetEmpresa={() => setPerfilEmpresa(null)}
        onResetCandidato={() => setPerfilCandidato(null)}
      />
    </Layout>
  );
};

export default DeuMatchPage;