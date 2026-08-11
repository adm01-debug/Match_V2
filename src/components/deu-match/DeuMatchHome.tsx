import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Building2, User, Sparkles, Play, Users, Target, Brain, Compass, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type PerfilCulturalEmpresa, type PerfilCulturalCandidato, VALORES_CULTURAIS } from '@/types/match';

interface DeuMatchHomeProps {
  perfilEmpresa: PerfilCulturalEmpresa | null;
  perfilCandidato: PerfilCulturalCandidato | null;
  empresaNome: string;
  candidatoNome: string;
  onEmpresaNomeChange: (v: string) => void;
  onCandidatoNomeChange: (v: string) => void;
  onStartEmpresa: () => void;
  onStartCandidato: () => void;
  onViewResultEmpresa: () => void;
  onViewResultCandidato: () => void;
  onViewMatches: () => void;
  onReset: () => void;
  onResetEmpresa: () => void;
  onResetCandidato: () => void;
}

export const DeuMatchHome: React.FC<DeuMatchHomeProps> = ({
  perfilEmpresa, perfilCandidato, empresaNome, candidatoNome,
  onEmpresaNomeChange, onCandidatoNomeChange, onStartEmpresa, onStartCandidato,
  onViewResultEmpresa, onViewResultCandidato, onViewMatches, onReset, onResetEmpresa, onResetCandidato,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-info/5">
    {/* Hero */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-info/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
          <div className="flex justify-center">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-info rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-gradient-to-r from-primary via-accent to-info p-6 rounded-3xl">
                <Heart className="w-12 h-12 text-primary-foreground animate-pulse" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent">Deu Match!</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            O <strong className="text-primary">Tinder do mundo corporativo</strong>. Conectamos pessoas e empresas através de <strong>valores, crenças e cultura</strong>.
          </p>

          {(perfilEmpresa || perfilCandidato) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-3">
              {perfilEmpresa && (<Badge className="bg-primary/10 text-primary border-primary/30 gap-2 px-4 py-2"><Building2 className="h-4 w-4" />{perfilEmpresa.empresaNome}<CheckCircle2 className="h-4 w-4" /></Badge>)}
              {perfilCandidato && (<Badge className="bg-accent/10 text-accent border-accent/30 gap-2 px-4 py-2"><User className="h-4 w-4" />{perfilCandidato.candidatoNome}<CheckCircle2 className="h-4 w-4" /></Badge>)}
              {perfilEmpresa && perfilCandidato && (<Button size="sm" className="bg-gradient-to-r from-primary to-accent" onClick={onViewMatches}><Heart className="h-4 w-4 mr-2" />Ver Match</Button>)}
              <Button size="sm" variant="ghost" onClick={onReset}><RefreshCw className="h-4 w-4 mr-2" />Recomeçar</Button>
            </motion.div>
          )}

          <div className="flex justify-center gap-8 sm:gap-16 py-8">
            {[{ icon: Users, value: '10k+', label: 'Candidatos' }, { icon: Building2, value: '500+', label: 'Empresas' }, { icon: Heart, value: '3k+', label: 'Matches' }].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="text-center">
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
        {/* Empresa */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-primary to-primary/70 rounded-2xl"><Building2 className="w-8 h-8 text-primary-foreground" /></div>
                <div><h2 className="text-2xl font-bold">Sou Empresa</h2><p className="text-muted-foreground">Defina sua cultura e atraia talentos certos</p></div>
              </div>
              {!perfilEmpresa && (<div className="space-y-4"><Label htmlFor="empresa-name">Nome da empresa</Label><Input id="empresa-name" placeholder="Qual é a sua empresa?" value={empresaNome} onChange={(e) => onEmpresaNomeChange(e.target.value)} className="bg-background/50" /></div>)}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Compass className="w-4 h-4 text-primary" />20 valores culturais para avaliar</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />~5 minutos para completar</li>
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Match preciso com candidatos</li>
              </ul>
              {perfilEmpresa ? (
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 rounded-lg flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-sm font-medium">Perfil definido!</span></div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={onViewResultEmpresa}>Ver Perfil</Button>
                    <Button variant="outline" onClick={onResetEmpresa}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                </div>
              ) : (
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80" size="lg" disabled={!empresaNome.trim()} onClick={onStartEmpresa}>
                  <Play className="w-5 h-5 mr-2" />Definir Cultura<ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Candidato */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-accent/50">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 group-hover:from-accent/10 group-hover:to-accent/20 transition-all" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-accent to-accent/70 rounded-2xl"><User className="w-8 h-8 text-accent-foreground" /></div>
                <div><h2 className="text-2xl font-bold">Sou Candidato</h2><p className="text-muted-foreground">Descubra seus valores e encontre seu match</p></div>
              </div>
              {!perfilCandidato && (<div className="space-y-4"><Label htmlFor="candidato-name">Seu nome</Label><Input id="candidato-name" placeholder="Como você se chama?" value={candidatoNome} onChange={(e) => onCandidatoNomeChange(e.target.value)} className="bg-background/50" /></div>)}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" />Jornada de autoconhecimento</li>
                <li className="flex items-center gap-2"><Brain className="w-4 h-4 text-accent" />Reflexões sobre seus valores</li>
                <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-destructive" />Match com empresas alinhadas</li>
              </ul>
              {perfilCandidato ? (
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 rounded-lg flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-sm font-medium">Valores descobertos!</span></div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={onViewResultCandidato}>Ver Valores</Button>
                    <Button variant="outline" onClick={onResetCandidato}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                </div>
              ) : (
                <Button className="w-full bg-gradient-to-r from-accent to-accent/80" size="lg" disabled={!candidatoNome.trim()} onClick={onStartCandidato}>
                  <Play className="w-5 h-5 mr-2" />Descobrir Valores<ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>

    {/* How it Works & Values Preview */}
    <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[{ icon: Play, title: '1. Responda o Quiz', desc: 'Avalie 20 valores culturais' }, { icon: Target, title: '2. Defina Prioridades', desc: 'Identifique o que mais importa' }, { icon: Brain, title: '3. Algoritmo Match', desc: 'Calculamos a compatibilidade' }, { icon: Heart, title: '4. Deu Match!', desc: 'Conecte-se com quem combina' }].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-foreground/10 rounded-2xl flex items-center justify-center"><step.icon className="w-8 h-8" /></div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-primary-foreground/80">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">20 Valores Culturais</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Avaliamos compatibilidade através de valores fundamentais</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {VALORES_CULTURAIS.slice(0, 10).map((valor, i) => (
          <motion.div key={valor.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.03 }}>
            <Card className={`p-3 text-center hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br ${valor.cor} text-primary-foreground`}>
              <div className="font-medium text-sm">{valor.nome}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
