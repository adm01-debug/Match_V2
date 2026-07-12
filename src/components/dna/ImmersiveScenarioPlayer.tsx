import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lightbulb, Heart, Zap, ChevronRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ScenarioChoice {
  id: string;
  text: string;
  consequence: string;
  helixImpact: {
    strategic: number;
    emotional: number;
    influence: number;
    values: number;
    adaptive: number;
  };
}

interface ImmersiveScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  imageUrl?: string;
  ambiance: 'tense' | 'reflective' | 'dramatic' | 'celebratory';
  choices: ScenarioChoice[];
}

interface ImmersiveScenarioPlayerProps {
  scenario: ImmersiveScenario;
  onComplete: (choiceId: string) => void;
  onSkip?: () => void;
}

const AMBIANCE_STYLES = {
  tense: {
    bg: 'from-destructive/30 via-warning/20 to-background',
    icon: AlertTriangle,
    iconColor: 'text-destructive',
    pulse: 'animate-pulse'
  },
  reflective: {
    bg: 'from-info/30 via-primary/20 to-background',
    icon: Lightbulb,
    iconColor: 'text-info',
    pulse: ''
  },
  dramatic: {
    bg: 'from-primary/30 via-accent/20 to-background',
    icon: Zap,
    iconColor: 'text-primary',
    pulse: 'animate-pulse'
  },
  celebratory: {
    bg: 'from-success/30 via-info/20 to-background',
    icon: Heart,
    iconColor: 'text-success',
    pulse: ''
  }
};

export const ImmersiveScenarioPlayer: React.FC<ImmersiveScenarioPlayerProps> = ({
  scenario,
  onComplete,
  onSkip
}) => {
  const [phase, setPhase] = useState<'context' | 'choices' | 'consequence'>('context');
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const ambiance = AMBIANCE_STYLES[scenario.ambiance];
  const AmbianceIcon = ambiance.icon;

  const handleChoiceSelect = (choice: ScenarioChoice) => {
    setSelectedChoice(choice);
    setPhase('consequence');
  };

  const handleContinue = () => {
    if (selectedChoice) {
      onComplete(selectedChoice.id);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${ambiance.bg} p-4 flex items-center justify-center`}>
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {/* Context Phase */}
          {phase === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Scenario Header */}
              <div className="text-center space-y-4">
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ${ambiance.pulse}`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AmbianceIcon className={`w-5 h-5 ${ambiance.iconColor}`} />
                  <span className="text-white/80 text-sm font-medium">Cenário Imersivo</span>
                </motion.div>
                
                <h1 className="text-4xl font-bold text-white">{scenario.title}</h1>
                <p className="text-xl text-white/70">{scenario.description}</p>
              </div>

              {/* Context Card */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 p-8">
                {scenario.imageUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img 
                      src={scenario.imageUrl} 
                      alt={scenario.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <p className="text-lg text-white/90 leading-relaxed">
                  {scenario.context}
                </p>
              </Card>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                {onSkip && (
                  <Button
                    variant="ghost"
                    onClick={onSkip}
                    className="text-white/60 hover:text-white/80"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Pular
                  </Button>
                )}
                <Button
                  onClick={() => setPhase('choices')}
                  className="bg-white/10 hover:bg-white/20 text-white px-8"
                  size="lg"
                >
                  O que você faz?
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Choices Phase */}
          {phase === 'choices' && (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Qual é sua decisão?</h2>
                <p className="text-white/60 mt-2">Escolha a opção que mais combina com você</p>
              </div>

              <div className="grid gap-4">
                {scenario.choices.map((choice, index) => (
                  <motion.div
                    key={choice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                        hoveredChoice === choice.id
                          ? 'bg-white/20 border-white/40 scale-[1.02]'
                          : 'bg-black/40 border-white/10 hover:bg-white/10'
                      }`}
                      onMouseEnter={() => setHoveredChoice(choice.id)}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => handleChoiceSelect(choice)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <p className="text-white text-lg">{choice.text}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setPhase('context')}
                  className="text-white/60"
                >
                  Voltar ao contexto
                </Button>
              </div>
            </motion.div>
          )}

          {/* Consequence Phase */}
          {phase === 'consequence' && selectedChoice && (
            <motion.div
              key="consequence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-success font-medium">Decisão tomada!</span>
                </motion.div>
              </div>

              <Card className="bg-black/40 backdrop-blur-xl border-white/10 p-8">
                <div className="space-y-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <p className="text-white/60 text-sm mb-2">Sua escolha:</p>
                    <p className="text-white text-lg">{selectedChoice.text}</p>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-xl">
                    <p className="text-primary text-sm mb-2">Consequência:</p>
                    <p className="text-white text-lg">{selectedChoice.consequence}</p>
                  </div>

                  {/* Impact Preview */}
                  <div className="grid grid-cols-5 gap-2 pt-4">
                    {[
                      { key: 'strategic', label: 'EST', color: '#8B5CF6' },
                      { key: 'emotional', label: 'EMO', color: '#EC4899' },
                      { key: 'influence', label: 'INF', color: '#F59E0B' },
                      { key: 'values', label: 'VAL', color: '#10B981' },
                      { key: 'adaptive', label: 'ADA', color: '#06B6D4' }
                    ].map(({ key, label, color }) => {
                      const value = selectedChoice.helixImpact[key as keyof typeof selectedChoice.helixImpact];
                      return (
                        <div key={key} className="text-center">
                          <div 
                            className="h-2 rounded-full mb-1"
                            style={{ backgroundColor: `${color}30` }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-xs text-white/60">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8"
                  size="lg"
                >
                  Continuar Jornada
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImmersiveScenarioPlayer;
