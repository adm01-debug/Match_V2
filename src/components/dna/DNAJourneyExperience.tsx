import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Brain, Heart, Mic2, Compass, Zap, 
  ChevronRight, Sparkles, Trophy, Target,
  Play, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { 
  DNAHelix, DNAProfile, 
  DNA_STRANDS, DNA_ARCHETYPES,
  calculateDNACode, determineArchetype
} from '@/types/behavioralDNA';
import { ImmersiveScenarioPlayer } from './ImmersiveScenarioPlayer';
import { MiniGameSelector, MiniGameResult } from './BehavioralMiniGame';
import { DNAHelix3D } from './DNAHelix3D';
import { DNAProfileCard } from './DNAProfileCard';

// Scenarios for the journey
const JOURNEY_SCENARIOS = [
  {
    id: 'crisis-decision',
    title: 'Decisão de Crise',
    description: 'Você é o CEO de uma startup. Uma crise inesperada surge...',
    context: 'Segunda-feira, 8h da manhã. Seu celular toca insistentemente. O maior cliente da empresa descobriu uma falha crítica no produto e ameaça cancelar o contrato de R$2 milhões.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ambiance: 'tense' as const,
    choices: [
      {
        id: 'a',
        text: 'Reunir a equipe imediatamente para brainstorm de soluções',
        consequence: 'Você mobiliza todos, criando união mas também ansiedade coletiva',
        helixImpact: {
          strategic: 70,
          emotional: 60,
          influence: 80,
          values: 75,
          adaptive: 65
        }
      },
      {
        id: 'b',
        text: 'Ligar pessoalmente para o cliente e assumir responsabilidade',
        consequence: 'O cliente aprecia a honestidade, mas espera soluções concretas',
        helixImpact: {
          strategic: 60,
          emotional: 85,
          influence: 90,
          values: 95,
          adaptive: 70
        }
      },
      {
        id: 'c',
        text: 'Analisar dados da falha antes de qualquer comunicação',
        consequence: 'Você ganha informação valiosa, mas o cliente fica impaciente',
        helixImpact: {
          strategic: 95,
          emotional: 50,
          influence: 55,
          values: 70,
          adaptive: 80
        }
      },
      {
        id: 'd',
        text: 'Delegar para a equipe técnica e focar em novos clientes',
        consequence: 'Você mantém a visão de futuro, mas a equipe sente-se abandonada',
        helixImpact: {
          strategic: 75,
          emotional: 40,
          influence: 50,
          values: 45,
          adaptive: 85
        }
      }
    ]
  },
  {
    id: 'team-conflict',
    title: 'Conflito de Equipe',
    description: 'Dois talentos essenciais estão em conflito aberto...',
    context: 'Dois dos seus melhores funcionários não conseguem mais trabalhar juntos. A tensão está afetando toda a equipe e a produtividade caiu 30%.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ambiance: 'reflective' as const,
    choices: [
      {
        id: 'a',
        text: 'Mediar uma conversa honesta entre os dois',
        consequence: 'O diálogo é difícil mas revela questões importantes',
        helixImpact: {
          strategic: 65,
          emotional: 90,
          influence: 85,
          values: 88,
          adaptive: 70
        }
      },
      {
        id: 'b',
        text: 'Separar em projetos diferentes e monitorar',
        consequence: 'A tensão diminui mas o problema não é resolvido',
        helixImpact: {
          strategic: 80,
          emotional: 55,
          influence: 60,
          values: 65,
          adaptive: 85
        }
      },
      {
        id: 'c',
        text: 'Propor um desafio conjunto que exija colaboração',
        consequence: 'Arriscado, mas pode transformar rivais em aliados',
        helixImpact: {
          strategic: 85,
          emotional: 70,
          influence: 75,
          values: 80,
          adaptive: 90
        }
      },
      {
        id: 'd',
        text: 'Consultar cada um individualmente primeiro',
        consequence: 'Você entende ambos os lados antes de agir',
        helixImpact: {
          strategic: 75,
          emotional: 85,
          influence: 70,
          values: 82,
          adaptive: 65
        }
      }
    ]
  },
  {
    id: 'ethical-dilemma',
    title: 'Dilema Ético',
    description: 'Uma oportunidade questionável surge...',
    context: 'Um concorrente oferece informações confidenciais sobre o mercado. É ilegal, mas poderia salvar sua empresa de uma decisão errada.',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    ambiance: 'dramatic' as const,
    choices: [
      {
        id: 'a',
        text: 'Recusar imediatamente e reportar a tentativa',
        consequence: 'Você mantém a integridade mas perde uma vantagem',
        helixImpact: {
          strategic: 60,
          emotional: 75,
          influence: 70,
          values: 100,
          adaptive: 55
        }
      },
      {
        id: 'b',
        text: 'Ouvir a proposta sem se comprometer',
        consequence: 'Você ganha informação sobre o concorrente, mas flerta com o limite',
        helixImpact: {
          strategic: 85,
          emotional: 50,
          influence: 65,
          values: 55,
          adaptive: 80
        }
      },
      {
        id: 'c',
        text: 'Consultar jurídico antes de qualquer decisão',
        consequence: 'Prudente, mas pode parecer indeciso',
        helixImpact: {
          strategic: 70,
          emotional: 60,
          influence: 55,
          values: 85,
          adaptive: 75
        }
      },
      {
        id: 'd',
        text: 'Usar isso como oportunidade de fortalecer cultura ética',
        consequence: 'Você transforma uma ameaça em momento de liderança',
        helixImpact: {
          strategic: 75,
          emotional: 80,
          influence: 90,
          values: 95,
          adaptive: 70
        }
      }
    ]
  }
];

interface DNAJourneyExperienceProps {
  participantType: 'candidate' | 'company';
  participantName: string;
  onComplete: (profile: DNAProfile) => void;
  onCancel?: () => void;
}

type JourneyPhase = 'intro' | 'scenario' | 'minigame' | 'reflection' | 'results';

export const DNAJourneyExperience: React.FC<DNAJourneyExperienceProps> = ({
  participantType,
  participantName,
  onComplete,
  onCancel
}) => {
  const [phase, setPhase] = useState<JourneyPhase>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [helixScores, setHelixScores] = useState<DNAHelix>({
    strategic: 50,
    emotional: 50,
    influence: 50,
    values: 50,
    adaptive: 50
  });
  const [showDNAPreview, setShowDNAPreview] = useState(false);

  const miniGames: Array<'value-tower' | 'reaction' | 'pressure' | 'emotional-radar'> = [
    'value-tower',
    'reaction', 
    'pressure',
    'emotional-radar'
  ];

  const totalSteps = JOURNEY_SCENARIOS.length + miniGames.length;
  const currentStep = phase === 'scenario' 
    ? currentScenarioIndex + 1 
    : phase === 'minigame' 
    ? JOURNEY_SCENARIOS.length + currentGameIndex + 1
    : phase === 'results' ? totalSteps : 0;

  const handleScenarioComplete = useCallback((impact: DNAHelix) => {
    setHelixScores(prev => ({
      strategic: Math.min(100, Math.max(0, (prev.strategic + impact.strategic) / 2)),
      emotional: Math.min(100, Math.max(0, (prev.emotional + impact.emotional) / 2)),
      influence: Math.min(100, Math.max(0, (prev.influence + impact.influence) / 2)),
      values: Math.min(100, Math.max(0, (prev.values + impact.values) / 2)),
      adaptive: Math.min(100, Math.max(0, (prev.adaptive + impact.adaptive) / 2))
    }));

    if (currentScenarioIndex < JOURNEY_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setPhase('minigame');
    }
  }, [currentScenarioIndex]);

  const handleGameComplete = useCallback((result: MiniGameResult) => {
    setGameResults(prev => [...prev, result]);
    
    // Adjust helix based on game results
    setHelixScores(prev => {
      const adjustment = result.score / 100 * 20; // Up to 20 points adjustment
      const newScores = { ...prev };
      
      switch (result.gameType) {
        case 'value-tower':
          newScores.values = Math.min(100, prev.values + adjustment);
          break;
        case 'reaction':
          newScores.adaptive = Math.min(100, prev.adaptive + adjustment);
          break;
        case 'pressure':
          newScores.strategic = Math.min(100, prev.strategic + adjustment);
          newScores.emotional = Math.min(100, prev.emotional + adjustment * 0.5);
          break;
        case 'emotional-radar':
          newScores.emotional = Math.min(100, prev.emotional + adjustment);
          newScores.influence = Math.min(100, prev.influence + adjustment * 0.5);
          break;
      }
      
      return newScores;
    });

    if (currentGameIndex < miniGames.length - 1) {
      setCurrentGameIndex(prev => prev + 1);
    } else {
      setPhase('results');
    }
  }, [currentGameIndex, miniGames.length]);

  const buildProfile = useCallback((): DNAProfile => {
    const dnaCode = calculateDNACode(helixScores);
    const archetype = determineArchetype(helixScores);
    const archetypeData = DNA_ARCHETYPES.find(a => a.id === archetype);

    return {
      id: `${participantType}-${Date.now()}`,
      type: participantType,
      name: participantName,
      helix: helixScores,
      dnaCode,
      archetype,
      strengths: archetypeData?.strengths || [],
      challenges: archetypeData?.challenges || [],
      idealEnvironment: archetypeData 
        ? `Ambiente que valoriza ${archetypeData.name.toLowerCase()} e permite expressão autêntica`
        : 'Ambiente colaborativo e desafiador',
      completedAt: new Date().toISOString()
    };
  }, [helixScores, participantType, participantName]);

  const handleComplete = useCallback(() => {
    const profile = buildProfile();
    onComplete(profile);
  }, [buildProfile, onComplete]);

  // Intro Phase
  if (phase === 'intro') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border-purple-500/30 p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-6"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-50"
              />
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Jornada do DNA Comportamental
            </h1>

            <p className="text-lg text-purple-200">
              Olá, <span className="font-bold text-white">{participantName}</span>!
            </p>

            <p className="text-purple-300 max-w-lg mx-auto">
              Você está prestes a embarcar em uma experiência imersiva que vai revelar 
              seu verdadeiro DNA comportamental através de cenários realistas, 
              desafios estratégicos e reflexões profundas.
            </p>

            <div className="grid grid-cols-5 gap-3 py-6">
              {DNA_STRANDS.map((strand, i) => (
                <motion.div
                  key={strand.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div 
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${strand.color}30` }}
                  >
                    {strand.id === 'strategic' && <Brain className="w-6 h-6" style={{ color: strand.color }} />}
                    {strand.id === 'emotional' && <Heart className="w-6 h-6" style={{ color: strand.color }} />}
                    {strand.id === 'influence' && <Mic2 className="w-6 h-6" style={{ color: strand.color }} />}
                    {strand.id === 'values' && <Compass className="w-6 h-6" style={{ color: strand.color }} />}
                    {strand.id === 'adaptive' && <Zap className="w-6 h-6" style={{ color: strand.color }} />}
                  </div>
                  <span className="text-xs text-purple-300">{strand.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-purple-900/30 rounded-xl p-4 text-left space-y-2">
              <h3 className="font-semibold text-purple-200 flex items-center gap-2">
                <Target className="w-5 h-5" />
                O que esperar:
              </h3>
              <ul className="text-sm text-purple-300 space-y-1">
                <li>• 3 cenários imersivos de tomada de decisão</li>
                <li>• 4 mini-jogos comportamentais</li>
                <li>• Revelação do seu arquétipo único</li>
                <li>• Tempo estimado: 15-20 minutos</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              {onCancel && (
                <Button variant="ghost" onClick={onCancel} className="text-purple-300">
                  Cancelar
                </Button>
              )}
              <Button 
                onClick={() => setPhase('scenario')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Jornada
              </Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  // Scenario Phase
  if (phase === 'scenario') {
    const scenario = JOURNEY_SCENARIOS[currentScenarioIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Progress Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <span className="text-sm text-purple-300">
              Cenário {currentScenarioIndex + 1}/{JOURNEY_SCENARIOS.length}
            </span>
            <Progress value={(currentStep / totalSteps) * 100} className="flex-1 h-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDNAPreview(!showDNAPreview)}
              className="text-purple-300"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* DNA Preview Overlay */}
        <AnimatePresence>
          {showDNAPreview && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-4 top-20 z-40"
            >
              <Card className="bg-black/80 backdrop-blur-xl border-purple-500/30 p-4">
                <DNAHelix3D helix={helixScores} size="sm" />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-20">
          <ImmersiveScenarioPlayer
            scenario={scenario}
            onComplete={(choiceId) => {
              const choice = scenario.choices.find(c => c.id === choiceId);
              if (choice) {
                handleScenarioComplete(choice.helixImpact);
              }
            }}
            onSkip={() => {
              if (currentScenarioIndex < JOURNEY_SCENARIOS.length - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
              } else {
                setPhase('minigame');
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Mini-game Phase
  if (phase === 'minigame') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 p-4">
        {/* Progress Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <span className="text-sm text-purple-300">
              Desafio {currentGameIndex + 1}/{miniGames.length}
            </span>
            <Progress value={(currentStep / totalSteps) * 100} className="flex-1 h-2" />
          </div>
        </div>

        <MiniGameSelector
          gameType={miniGames[currentGameIndex]}
          onComplete={handleGameComplete}
        />
      </div>
    );
  }

  // Results Phase
  if (phase === 'results') {
    const profile = buildProfile();
    const archetypeData = DNA_ARCHETYPES.find(a => a.id === profile.archetype);

    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">Jornada Completa!</span>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Seu DNA Comportamental
            </h1>

            <p className="text-purple-300">
              {participantName}, seu código genético comportamental foi revelado!
            </p>
          </motion.div>

          {/* DNA Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-block bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <span className="text-sm text-purple-400 block mb-2">Código DNA</span>
              <span className="text-4xl font-mono font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {profile.dnaCode}
              </span>
            </div>
          </motion.div>

          {/* 3D Helix */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <DNAHelix3D helix={helixScores} size="lg" animated />
          </motion.div>

          {/* Archetype */}
          {archetypeData && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="text-4xl p-4 rounded-xl"
                    style={{ backgroundColor: `${archetypeData.color}20` }}
                  >
                    {archetypeData.emoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{archetypeData.name}</h2>
                    <p className="text-purple-300">{archetypeData.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-900/20 rounded-xl p-4">
                    <h3 className="font-semibold text-green-400 mb-2">💪 Pontos Fortes</h3>
                    <ul className="text-sm text-green-300 space-y-1">
                      {archetypeData.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-900/20 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">🎯 Desafios</h3>
                    <ul className="text-sm text-orange-300 space-y-1">
                      {archetypeData.challenges.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Profile Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <DNAProfileCard profile={profile} variant="full" />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center gap-4 pb-8"
          >
            <Button
              variant="outline"
              onClick={() => {
                setPhase('intro');
                setCurrentScenarioIndex(0);
                setCurrentGameIndex(0);
                setHelixScores({ strategic: 50, emotional: 50, influence: 50, values: 50, adaptive: 50 });
                setGameResults([]);
              }}
              className="border-purple-500/50 text-purple-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refazer Jornada
            </Button>
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
            >
              Salvar Perfil DNA
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default DNAJourneyExperience;
