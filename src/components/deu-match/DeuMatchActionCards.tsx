import React from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Play, ArrowRight, Sparkles, Brain, Heart, Compass, Zap, Target, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type PerfilCulturalEmpresa, type PerfilCulturalCandidato } from '@/types/match';

interface DeuMatchActionCardsProps {
  empresaNome: string;
  candidatoNome: string;
  onEmpresaNomeChange: (value: string) => void;
  onCandidatoNomeChange: (value: string) => void;
  perfilEmpresa: PerfilCulturalEmpresa | null;
  perfilCandidato: PerfilCulturalCandidato | null;
  onStartEmpresa: () => void;
  onStartCandidato: () => void;
  onViewEmpresaResult: () => void;
  onViewCandidatoResult: () => void;
  onResetEmpresa: () => void;
  onResetCandidato: () => void;
}

export const DeuMatchActionCards: React.FC<DeuMatchActionCardsProps> = ({
  empresaNome, candidatoNome, onEmpresaNomeChange, onCandidatoNomeChange,
  perfilEmpresa, perfilCandidato,
  onStartEmpresa, onStartCandidato,
  onViewEmpresaResult, onViewCandidatoResult,
  onResetEmpresa, onResetCandidato,
}) => {
  const renderCard = (isEmpresa: boolean) => {
    const perfil = isEmpresa ? perfilEmpresa : perfilCandidato;
    const nome = isEmpresa ? empresaNome : candidatoNome;
    const onNomeChange = isEmpresa ? onEmpresaNomeChange : onCandidatoNomeChange;
    const Icon = isEmpresa ? Building2 : User;
    const title = isEmpresa ? 'Sou Empresa' : 'Sou Candidato';
    const subtitle = isEmpresa ? 'Defina sua cultura e atraia talentos certos' : 'Descubra seus valores e encontre seu match';
    const placeholder = isEmpresa ? 'Qual é a sua empresa?' : 'Como você se chama?';
    const inputId = isEmpresa ? 'empresa-name' : 'candidato-name';
    const label = isEmpresa ? 'Nome da empresa' : 'Seu nome';
    const borderColor = isEmpresa ? 'hover:border-primary/50' : 'hover:border-accent/50';
    const bgGradient = isEmpresa
      ? 'from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20'
      : 'from-accent/5 to-accent/10 group-hover:from-accent/10 group-hover:to-accent/20';
    const iconGradient = isEmpresa ? 'from-primary to-primary/70' : 'from-accent to-accent/70';
    const btnGradient = isEmpresa
      ? 'from-primary to-primary/80 hover:opacity-90 text-primary-foreground'
      : 'from-accent to-accent/80 hover:opacity-90 text-accent-foreground';
    const btnText = isEmpresa ? 'Definir Cultura' : 'Descobrir Valores';
    const completedText = isEmpresa ? 'Perfil definido!' : 'Valores descobertos!';
    const viewText = isEmpresa ? 'Ver Perfil' : 'Ver Valores';
    const features = isEmpresa ? [
      { icon: Compass, color: 'text-primary', text: '20 valores culturais para avaliar' },
      { icon: Zap, color: 'text-primary', text: '~5 minutos para completar' },
      { icon: Target, color: 'text-primary', text: 'Match preciso com candidatos' },
    ] : [
      { icon: Sparkles, color: 'text-accent', text: 'Jornada de autoconhecimento' },
      { icon: Brain, color: 'text-accent', text: 'Reflexões sobre seus valores' },
      { icon: Heart, color: 'text-accent', text: 'Match com empresas alinhadas' },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, x: isEmpresa ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: isEmpresa ? 0.3 : 0.4 }}
      >
        <Card className={`relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 ${borderColor}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} transition-all`} />
          <div className="relative p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 bg-gradient-to-br ${iconGradient} rounded-2xl`}>
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            {!perfil && (
              <div className="space-y-4">
                <Label htmlFor={inputId}>{label}</Label>
                <Input id={inputId} placeholder={placeholder} value={nome} onChange={(e) => onNomeChange(e.target.value)} className="bg-background/50" />
              </div>
            )}
            <ul className="space-y-2 text-sm text-muted-foreground">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <f.icon className={`w-4 h-4 ${f.color}`} />{f.text}
                </li>
              ))}
            </ul>
            {perfil ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">{completedText}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={isEmpresa ? onViewEmpresaResult : onViewCandidatoResult}>{viewText}</Button>
                  <Button variant="outline" onClick={isEmpresa ? onResetEmpresa : onResetCandidato}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </div>
            ) : (
              <Button className={`w-full bg-gradient-to-r ${btnGradient}`} size="lg" disabled={!nome.trim()} onClick={isEmpresa ? onStartEmpresa : onStartCandidato}>
                <Play className="w-5 h-5 mr-2" />{btnText}<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {renderCard(true)}
        {renderCard(false)}
      </div>
    </div>
  );
};
