import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Building2, User, Sparkles, Dna, 
  ArrowRight, Play, Users, Target, Zap,
  Brain, Compass, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { DNAJourneyExperience } from '@/components/dna/DNAJourneyExperience';
import { DNAProfileCard } from '@/components/dna/DNAProfileCard';
import { DNAMatchSwiper } from '@/components/dna/DNAMatchSwiper';
import { DNAProfile, DNA_ARCHETYPES } from '@/types/behavioralDNA';
import confetti from 'canvas-confetti';

type PageView = 'home' | 'journey-candidate' | 'journey-company' | 'matches' | 'profiles';

const DeuMatchPage: React.FC = () => {
  const [view, setView] = useState<PageView>('home');
  const [candidateName, setCandidateName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [profiles, setProfiles] = useState<DNAProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<DNAProfile | null>(null);

  const handleProfileComplete = (profile: DNAProfile) => {
    setProfiles(prev => [...prev, profile]);
    setActiveProfile(profile);
    
    // Celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#06b6d4']
    });

    setView('profiles');
  };

  const handleMatch = (_profile: DNAProfile, action: 'like' | 'pass') => {
    if (action === 'like') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Sample profiles for demo
  const sampleProfiles: DNAProfile[] = [
    {
      id: 'company-1',
      type: 'company',
      name: 'TechVision Labs',
      helix: { strategic: 85, emotional: 70, influence: 75, values: 90, adaptive: 88 },
      dnaCode: 'S85-E70-I75-V90-A88',
      archetype: 'innovator',
      strengths: ['Inovação constante', 'Cultura de aprendizado', 'Autonomia'],
      challenges: ['Ritmo intenso', 'Mudanças frequentes'],
      idealEnvironment: 'Startup tech em crescimento',
      completedAt: new Date().toISOString()
    },
    {
      id: 'company-2',
      type: 'company',
      name: 'Harmony Solutions',
      helix: { strategic: 70, emotional: 92, influence: 80, values: 95, adaptive: 65 },
      dnaCode: 'S70-E92-I80-V95-A65',
      archetype: 'harmonizer',
      strengths: ['Bem-estar primeiro', 'Comunicação aberta', 'Propósito claro'],
      challenges: ['Decisões podem ser lentas', 'Foco em consenso'],
      idealEnvironment: 'Empresa com forte cultura de pessoas',
      completedAt: new Date().toISOString()
    },
    {
      id: 'company-3',
      type: 'company',
      name: 'Apex Ventures',
      helix: { strategic: 95, emotional: 60, influence: 88, values: 75, adaptive: 92 },
      dnaCode: 'S95-E60-I88-V75-A92',
      archetype: 'strategist',
      strengths: ['Visão clara', 'Execução rápida', 'Meritocracia'],
      challenges: ['Alta pressão', 'Competitividade interna'],
      idealEnvironment: 'Ambiente de alta performance',
      completedAt: new Date().toISOString()
    }
  ];

  // Home View
  if (view === 'home') {
    return (
      <Layout title="Deu Match">
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                {/* Logo/Brand */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-xl opacity-50" />
                    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 p-6 rounded-3xl">
                      <div className="flex items-center gap-3">
                        <Dna className="w-12 h-12 text-white" />
                        <Heart className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                    Deu Match!
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  O Tinder do mundo corporativo. Conectamos pessoas e empresas 
                  através do <strong className="text-primary">DNA Comportamental</strong>.
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-8 sm:gap-16 py-8">
                  {[
                    { icon: Users, value: '10k+', label: 'Candidatos' },
                    { icon: Building2, value: '500+', label: 'Empresas' },
                    { icon: Heart, value: '3k+', label: 'Matches' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Candidate Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-500/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />
                  
                  <div className="relative p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Sou Candidato</h2>
                        <p className="text-muted-foreground">Descubra seu DNA e encontre sua empresa ideal</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="candidate-name">Seu nome</Label>
                      <Input
                        id="candidate-name"
                        placeholder="Como você se chama?"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        Jornada imersiva de autoconhecimento
                      </li>
                      <li className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-pink-500" />
                        Mini-jogos comportamentais
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-500" />
                        Match com empresas alinhadas
                      </li>
                    </ul>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                      disabled={!candidateName.trim()}
                      onClick={() => setView('journey-candidate')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar Jornada
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Company Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-cyan-500/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all" />
                  
                  <div className="relative p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Sou Empresa</h2>
                        <p className="text-muted-foreground">Defina sua cultura e atraia talentos certos</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="company-name">Nome da empresa</Label>
                      <Input
                        id="company-name"
                        placeholder="Qual é a sua empresa?"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-cyan-500" />
                        Mapeamento cultural profundo
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        Cenários de decisão empresarial
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        Encontre candidatos compatíveis
                      </li>
                    </ul>

                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      size="lg"
                      disabled={!companyName.trim()}
                      onClick={() => setView('journey-company')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar Jornada
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Archetypes Preview */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">10 Arquétipos Comportamentais</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Descubra qual dos 10 arquétipos únicos define você ou sua empresa
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {DNA_ARCHETYPES.map((archetype, i) => (
                <motion.div
                  key={archetype.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <Card 
                    className="p-4 text-center hover:shadow-lg transition-all cursor-pointer group"
                    style={{ borderColor: `${archetype.color}30` }}
                  >
                    <div 
                      className="text-4xl mb-2 group-hover:scale-110 transition-transform"
                    >
                      {archetype.emoji}
                    </div>
                    <div 
                      className="font-semibold text-sm"
                      style={{ color: archetype.color }}
                    >
                      {archetype.name}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-16">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { icon: Play, title: 'Inicie a Jornada', desc: 'Embarque em uma experiência imersiva' },
                  { icon: Brain, title: 'Responda Cenários', desc: 'Tome decisões em situações reais' },
                  { icon: Dna, title: 'Descubra seu DNA', desc: 'Seu código comportamental único' },
                  { icon: Heart, title: 'Deu Match!', desc: 'Conecte-se com quem combina' }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-purple-200">{step.desc}</p>
                    {i < 3 && (
                      <ChevronRight className="w-6 h-6 mx-auto mt-4 text-purple-400 hidden md:block" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Section */}
          {profiles.length > 0 && (
            <div className="max-w-5xl mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold text-center mb-8">Seus Perfis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {profiles.map(profile => (
                  <DNAProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    variant="compact"
                    onClick={() => {
                      setActiveProfile(profile);
                      setView('matches');
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Journey Views
  if (view === 'journey-candidate') {
    return (
      <DNAJourneyExperience
        participantType="candidate"
        participantName={candidateName}
        onComplete={handleProfileComplete}
        onCancel={() => setView('home')}
      />
    );
  }

  if (view === 'journey-company') {
    return (
      <DNAJourneyExperience
        participantType="company"
        participantName={companyName}
        onComplete={handleProfileComplete}
        onCancel={() => setView('home')}
      />
    );
  }

  // Matches View
  if (view === 'matches' && activeProfile) {
    const matchProfiles = activeProfile.type === 'candidate' 
      ? sampleProfiles.filter(p => p.type === 'company')
      : profiles.filter(p => p.type === 'candidate');

    return (
      <Layout title="Seus Matches">
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Encontre seu Match
                </h1>
                <p className="text-muted-foreground">
                  Baseado no DNA de {activeProfile.name}
                </p>
              </div>
              <Button variant="outline" onClick={() => setView('home')}>
                Voltar
              </Button>
            </div>

            <DNAMatchSwiper
              userProfile={activeProfile}
              potentialMatches={matchProfiles.length > 0 ? matchProfiles : sampleProfiles}
              onMatch={handleMatch}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Profiles View
  if (view === 'profiles') {
    return (
      <Layout title="Perfis DNA">
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Seus Perfis DNA</h1>
              <Button variant="outline" onClick={() => setView('home')}>
                Voltar
              </Button>
            </div>

            <Tabs defaultValue="my-profiles">
              <TabsList className="mb-6">
                <TabsTrigger value="my-profiles">Meus Perfis</TabsTrigger>
                <TabsTrigger value="find-matches">Buscar Matches</TabsTrigger>
              </TabsList>

              <TabsContent value="my-profiles">
                <div className="grid gap-6">
                  {profiles.map(profile => (
                    <DNAProfileCard 
                      key={profile.id} 
                      profile={profile} 
                      variant="full"
                    />
                  ))}
                  {profiles.length === 0 && (
                    <Card className="p-12 text-center">
                      <Dna className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Nenhum perfil ainda</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete a jornada para descobrir seu DNA comportamental
                      </p>
                      <Button onClick={() => setView('home')}>
                        Começar Jornada
                      </Button>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="find-matches">
                {profiles.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Selecione um perfil para buscar matches:</p>
                    {profiles.map(profile => (
                      <Card 
                        key={profile.id}
                        className="p-4 cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => {
                          setActiveProfile(profile);
                          setView('matches');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">
                              {DNA_ARCHETYPES.find(a => a.id === profile.archetype)?.emoji}
                            </div>
                            <div>
                              <h3 className="font-semibold">{profile.name}</h3>
                              <p className="text-sm text-muted-foreground">{profile.dnaCode}</p>
                            </div>
                          </div>
                          <Button variant="ghost">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Complete seu perfil primeiro</h3>
                    <p className="text-muted-foreground mb-6">
                      Você precisa de um perfil DNA para buscar matches
                    </p>
                    <Button onClick={() => setView('home')}>
                      Criar Perfil
                    </Button>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};

export default DeuMatchPage;
