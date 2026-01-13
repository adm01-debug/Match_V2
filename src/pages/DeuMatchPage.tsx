/**
 * @fileoverview Página Deu Match - O Tinder Corporativo
 * @description Conecta empresas e candidatos através de valores culturais
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Building2, User, Sparkles, 
  ArrowRight, Play, Users, Target, Zap,
  Brain, Compass, ChevronRight, ArrowLeft,
  RefreshCw, Trophy, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { CompanyValuesQuiz } from '@/components/match/CompanyValuesQuiz';
import { CandidateValuesQuiz } from '@/components/match/CandidateValuesQuiz';
import { MatchResultCard } from '@/components/match/MatchResultCard';
import { 
  type PerfilCulturalEmpresa, 
  type PerfilCulturalCandidato,
  type MatchResult,
  VALORES_CULTURAIS
} from '@/types/match';
import { 
  calcularMatch, 
  salvarPerfilLocal, 
  recuperarPerfilLocal,
  limparPerfisLocais
} from '@/lib/matchCalculator';
import confetti from 'canvas-confetti';

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
  
  // Perfis salvos
  const [perfilEmpresa, setPerfilEmpresa] = useState<PerfilCulturalEmpresa | null>(null);
  const [perfilCandidato, setPerfilCandidato] = useState<PerfilCulturalCandidato | null>(null);
  
  // Matches calculados
  const [matches, setMatches] = useState<MatchResult[]>([]);

  // Carregar perfis salvos
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

  // Calcular matches quando ambos os perfis existem
  useEffect(() => {
    if (perfilEmpresa && perfilCandidato) {
      const match = calcularMatch(perfilEmpresa, perfilCandidato);
      setMatches([match]);
    }
  }, [perfilEmpresa, perfilCandidato]);

  const handleEmpresaComplete = (perfil: PerfilCulturalEmpresa) => {
    setPerfilEmpresa(perfil);
    salvarPerfilLocal('empresa', perfil);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#a855f7']
    });
    
    setView('resultado-empresa');
  };

  const handleCandidatoComplete = (perfil: PerfilCulturalCandidato) => {
    setPerfilCandidato(perfil);
    salvarPerfilLocal('candidato', perfil);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f472b6', '#fb7185']
    });
    
    setView('resultado-candidato');
  };

  const handleReset = () => {
    limparPerfisLocais();
    setPerfilEmpresa(null);
    setPerfilCandidato(null);
    setMatches([]);
    setCandidatoNome('');
    setEmpresaNome('');
    setView('home');
  };

  // ===== QUIZ EMPRESA =====
  if (view === 'quiz-empresa') {
    return (
      <Layout title="Quiz Empresa">
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900">
          <div className="max-w-4xl mx-auto py-8">
            <Button 
              variant="ghost" 
              onClick={() => setView('home')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            <CompanyValuesQuiz
              empresaNome={empresaNome}
              onComplete={handleEmpresaComplete}
              onCancel={() => setView('home')}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // ===== QUIZ CANDIDATO =====
  if (view === 'quiz-candidato') {
    return (
      <Layout title="Quiz Candidato">
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-pink-900/20 dark:to-slate-900">
          <div className="max-w-4xl mx-auto py-8">
            <Button 
              variant="ghost" 
              onClick={() => setView('home')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            <CandidateValuesQuiz
              candidatoId={crypto.randomUUID()}
              candidatoNome={candidatoNome}
              onComplete={handleCandidatoComplete}
              onCancel={() => setView('home')}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // ===== RESULTADO EMPRESA =====
  if (view === 'resultado-empresa' && perfilEmpresa) {
    const topValores = perfilEmpresa.valoresPrioritarios
      .map(id => VALORES_CULTURAIS.find(v => v.id === id))
      .filter(Boolean);

    return (
      <Layout title="Perfil Cultural">
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Building2 className="h-10 w-10" />
                    </div>
                  </motion.div>
                  <h1 className="text-2xl font-bold mb-2">Perfil Cultural Definido!</h1>
                  <p className="opacity-90">{perfilEmpresa.empresaNome}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Seus 5 Valores Principais
                    </h3>
                    <div className="space-y-2">
                      {topValores.map((valor, i) => valor && (
                        <motion.div
                          key={valor.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-3 rounded-lg bg-gradient-to-r ${valor.cor} text-white flex items-center gap-3`}
                        >
                          <span className="font-bold text-lg">#{i + 1}</span>
                          <span className="font-medium">{valor.nome}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setView('home')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    {perfilCandidato && (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500"
                        onClick={() => setView('matches')}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Ver Matches
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // ===== RESULTADO CANDIDATO =====
  if (view === 'resultado-candidato' && perfilCandidato) {
    const topValores = perfilCandidato.valoresPrioritarios
      .map(id => VALORES_CULTURAIS.find(v => v.id === id))
      .filter(Boolean);

    return (
      <Layout title="Seus Valores">
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-pink-900/20 dark:to-slate-900 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10" />
                    </div>
                  </motion.div>
                  <h1 className="text-2xl font-bold mb-2">Valores Descobertos!</h1>
                  <p className="opacity-90">{perfilCandidato.candidatoNome}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      O Que Mais Importa Para Você
                    </h3>
                    <div className="space-y-2">
                      {topValores.map((valor, i) => valor && (
                        <motion.div
                          key={valor.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-3 rounded-lg bg-gradient-to-r ${valor.cor} text-white flex items-center gap-3`}
                        >
                          <span className="font-bold text-lg">#{i + 1}</span>
                          <span className="font-medium">{valor.nome}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setView('home')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    {perfilEmpresa && (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                        onClick={() => setView('matches')}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Ver Matches
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // ===== MATCHES VIEW =====
  if (view === 'matches' && matches.length > 0) {
    return (
      <Layout title="Seus Matches">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Deu Match! 💜
                </h1>
                <p className="text-muted-foreground">
                  Compatibilidade entre {perfilEmpresa?.empresaNome} e {perfilCandidato?.candidatoNome}
                </p>
              </div>
              <Button variant="outline" onClick={() => setView('home')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            
            {/* Match Result Card */}
            {matches[0] && (
              <MatchResultCard
                match={matches[0]}
                empresaNome={perfilEmpresa?.empresaNome || ''}
                onLike={() => {
                  confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                  });
                }}
                onPass={() => setView('home')}
              />
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ===== HOME =====
  return (
    <Layout title="Deu Match">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
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
                      <Heart className="w-12 h-12 text-white animate-pulse" />
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
                O <strong className="text-primary">Tinder do mundo corporativo</strong>. Conectamos 
                pessoas e empresas através de <strong>valores, crenças e cultura</strong>.
              </p>

              {/* Perfis Salvos */}
              {(perfilEmpresa || perfilCandidato) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {perfilEmpresa && (
                    <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/30 gap-2 px-4 py-2">
                      <Building2 className="h-4 w-4" />
                      {perfilEmpresa.empresaNome}
                      <CheckCircle2 className="h-4 w-4" />
                    </Badge>
                  )}
                  {perfilCandidato && (
                    <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/30 gap-2 px-4 py-2">
                      <User className="h-4 w-4" />
                      {perfilCandidato.candidatoNome}
                      <CheckCircle2 className="h-4 w-4" />
                    </Badge>
                  )}
                  {perfilEmpresa && perfilCandidato && (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => setView('matches')}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Ver Match
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recomeçar
                  </Button>
                </motion.div>
              )}

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
            {/* Empresa Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-indigo-500/50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all" />
                
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Sou Empresa</h2>
                      <p className="text-muted-foreground">Defina sua cultura e atraia talentos certos</p>
                    </div>
                  </div>

                  {!perfilEmpresa && (
                    <div className="space-y-4">
                      <Label htmlFor="empresa-name">Nome da empresa</Label>
                      <Input
                        id="empresa-name"
                        placeholder="Qual é a sua empresa?"
                        value={empresaNome}
                        onChange={(e) => setEmpresaNome(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  )}

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-500" />
                      20 valores culturais para avaliar
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      ~5 minutos para completar
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-violet-500" />
                      Match preciso com candidatos
                    </li>
                  </ul>

                  {perfilEmpresa ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Perfil definido!</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => setView('resultado-empresa')}
                        >
                          Ver Perfil
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setPerfilEmpresa(null);
                            localStorage.removeItem('deu-match-empresa');
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      size="lg"
                      disabled={!empresaNome.trim()}
                      onClick={() => setView('quiz-empresa')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Definir Cultura
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Candidato Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-pink-500/50">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all" />
                
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Sou Candidato</h2>
                      <p className="text-muted-foreground">Descubra seus valores e encontre seu match</p>
                    </div>
                  </div>

                  {!perfilCandidato && (
                    <div className="space-y-4">
                      <Label htmlFor="candidato-name">Seu nome</Label>
                      <Input
                        id="candidato-name"
                        placeholder="Como você se chama?"
                        value={candidatoNome}
                        onChange={(e) => setCandidatoNome(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  )}

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      Jornada de autoconhecimento
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-rose-500" />
                      Reflexões sobre seus valores
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Match com empresas alinhadas
                    </li>
                  </ul>

                  {perfilCandidato ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Valores descobertos!</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => setView('resultado-candidato')}
                        >
                          Ver Valores
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setPerfilCandidato(null);
                            localStorage.removeItem('deu-match-candidato');
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                      size="lg"
                      disabled={!candidatoNome.trim()}
                      onClick={() => setView('quiz-candidato')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Descobrir Valores
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Play, title: '1. Responda o Quiz', desc: 'Avalie 20 valores culturais' },
                { icon: Target, title: '2. Defina Prioridades', desc: 'Identifique o que mais importa' },
                { icon: Brain, title: '3. Algoritmo Match', desc: 'Calculamos a compatibilidade' },
                { icon: Heart, title: '4. Deu Match!', desc: 'Conecte-se com quem combina' }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
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

        {/* Values Preview */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">20 Valores Culturais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Avaliamos compatibilidade através de valores fundamentais
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {VALORES_CULTURAIS.slice(0, 10).map((valor, i) => (
              <motion.div
                key={valor.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <Card 
                  className={`p-3 text-center hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br ${valor.cor} text-white`}
                >
                  <div className="font-medium text-sm">{valor.nome}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeuMatchPage;
