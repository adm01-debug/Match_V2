import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, Timer, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface MiniGameResult {
  gameType: 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';
  score: number;
  timeSpent: number;
  details: Record<string, unknown>;
}

interface MiniGameProps {
  onComplete: (result: MiniGameResult) => void;
}

// ==========================================
// VALUE TOWER GAME
// Ordene valores por importância
// ==========================================
const VALUES = [
  { id: 'innovation', name: 'Inovação', emoji: '💡' },
  { id: 'collaboration', name: 'Colaboração', emoji: '🤝' },
  { id: 'integrity', name: 'Integridade', emoji: '⚖️' },
  { id: 'growth', name: 'Crescimento', emoji: '📈' },
  { id: 'balance', name: 'Equilíbrio', emoji: '☯️' },
  { id: 'excellence', name: 'Excelência', emoji: '🏆' },
  { id: 'autonomy', name: 'Autonomia', emoji: '🦅' },
  { id: 'purpose', name: 'Propósito', emoji: '🎯' }
];

export const ValueTowerGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  
  const availableValues = VALUES.filter(v => !selectedValues.includes(v.id));
  
  const handleSelectValue = (valueId: string) => {
    if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, valueId]);
    }
  };
  
  const handleRemoveValue = (index: number) => {
    setSelectedValues(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const score = selectedValues.length === 5 ? 80 + Math.min(20, Math.max(0, 60 - timeSpent)) : 50;
    
    onComplete({
      gameType: 'value-tower',
      score,
      timeSpent,
      details: { selectedValues }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Torre de Valores</h2>
        <p className="text-purple-300">Selecione seus 5 valores mais importantes em ordem</p>
      </div>
      
      {/* Selected Tower */}
      <Card className="bg-black/40 border-purple-500/30 p-6">
        <h3 className="text-sm text-purple-300 mb-4">Sua Torre ({selectedValues.length}/5)</h3>
        <div className="space-y-2 min-h-[200px]">
          {selectedValues.map((valueId, index) => {
            const value = VALUES.find(v => v.id === valueId);
            return (
              <motion.div
                key={valueId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg cursor-pointer hover:from-purple-500/30 hover:to-pink-500/30"
                onClick={() => handleRemoveValue(index)}
              >
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-2xl">{value?.emoji}</span>
                <span className="text-white font-medium">{value?.name}</span>
              </motion.div>
            );
          })}
          {selectedValues.length === 0 && (
            <div className="h-full flex items-center justify-center text-purple-300/50">
              Clique nos valores abaixo para construir sua torre
            </div>
          )}
        </div>
      </Card>
      
      {/* Available Values */}
      <div className="grid grid-cols-4 gap-3">
        {availableValues.map(value => (
          <motion.div
            key={value.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectValue(value.id)}
            className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-3xl block mb-2">{value.emoji}</span>
            <span className="text-xs text-white/80">{value.name}</span>
          </motion.div>
        ))}
      </div>
      
      {selectedValues.length === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-8"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Confirmar Torre
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ==========================================
// REACTION GAME
// Teste de velocidade de reação
// ==========================================
export const ReactionGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'click' | 'done'>('ready');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [waitStart, setWaitStart] = useState(0);
  const [round, setRound] = useState(0);
  const totalRounds = 5;
  
  const startRound = () => {
    setPhase('wait');
    const delay = 1000 + Math.random() * 3000; // 1-4 segundos
    setTimeout(() => {
      setWaitStart(Date.now());
      setPhase('click');
    }, delay);
  };
  
  const handleClick = () => {
    if (phase === 'wait') {
      // Clicou cedo demais
      setReactionTimes(prev => [...prev, 1000]); // Penalidade
    } else if (phase === 'click') {
      const time = Date.now() - waitStart;
      setReactionTimes(prev => [...prev, time]);
    }
    
    if (round + 1 >= totalRounds) {
      setPhase('done');
      const avgTime = [...reactionTimes].reduce((a, b) => a + b, 0) / reactionTimes.length;
      const score = Math.max(0, 100 - (avgTime / 5));
      
      onComplete({
        gameType: 'reaction',
        score: Math.round(score),
        timeSpent: reactionTimes.reduce((a, b) => a + b, 0) / 1000,
        details: { reactionTimes, averageTime: avgTime }
      });
    } else {
      setRound(r => r + 1);
      setPhase('ready');
    }
  };
  
  const bgColor = phase === 'wait' ? 'bg-red-500/20' : phase === 'click' ? 'bg-green-500' : 'bg-purple-500/20';

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Reflexos</h2>
        <p className="text-purple-300">Clique quando a tela ficar verde</p>
        <p className="text-sm text-purple-400 mt-2">Rodada {round + 1} de {totalRounds}</p>
      </div>
      
      <motion.div
        className={`h-64 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${bgColor}`}
        onClick={phase === 'ready' ? startRound : handleClick}
        animate={phase === 'click' ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {phase === 'ready' && (
          <div className="text-center">
            <Play className="w-12 h-12 text-white mx-auto mb-2" />
            <span className="text-white">Clique para começar</span>
          </div>
        )}
        {phase === 'wait' && (
          <div className="text-center">
            <Timer className="w-12 h-12 text-red-400 mx-auto mb-2 animate-pulse" />
            <span className="text-red-300">Aguarde...</span>
          </div>
        )}
        {phase === 'click' && (
          <div className="text-center">
            <Zap className="w-16 h-16 text-white mx-auto animate-bounce" />
            <span className="text-white text-2xl font-bold">AGORA!</span>
          </div>
        )}
      </motion.div>
      
      {/* Reaction Times */}
      <div className="flex justify-center gap-2">
        {reactionTimes.map((time, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full text-sm ${
              time < 300 ? 'bg-green-500/30 text-green-300' :
              time < 500 ? 'bg-yellow-500/30 text-yellow-300' :
              'bg-red-500/30 text-red-300'
            }`}
          >
            {time}ms
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// PRESSURE GAME
// Tomada de decisão sob pressão
// ==========================================
const PRESSURE_SCENARIOS = [
  { text: 'Deadline apertado, entregar incompleto ou pedir mais tempo?', a: 'Entregar', b: 'Pedir tempo' },
  { text: 'Conflito na equipe, intervir agora ou esperar esfriar?', a: 'Intervir', b: 'Esperar' },
  { text: 'Erro descoberto após entrega, admitir ou corrigir silenciosamente?', a: 'Admitir', b: 'Corrigir' },
  { text: 'Oportunidade arriscada, agir rápido ou analisar mais?', a: 'Agir', b: 'Analisar' },
  { text: 'Feedback negativo inesperado, defender ou aceitar?', a: 'Defender', b: 'Aceitar' }
];

export const PressureGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer('timeout');
      return;
    }
    
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  const handleAnswer = (answer: string) => {
    setAnswers(prev => [...prev, answer]);
    
    if (currentIndex + 1 >= PRESSURE_SCENARIOS.length) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const timeouts = answers.filter(a => a === 'timeout').length;
      const score = Math.round(100 - (timeouts * 15));
      
      onComplete({
        gameType: 'pressure',
        score,
        timeSpent,
        details: { answers, timeouts }
      });
    } else {
      setCurrentIndex(i => i + 1);
      setTimeLeft(5);
    }
  };
  
  const scenario = PRESSURE_SCENARIOS[currentIndex];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Sob Pressão</h2>
        <p className="text-purple-300">Decida rápido! Você tem 5 segundos</p>
      </div>
      
      {/* Timer */}
      <div className="relative">
        <Progress value={(timeLeft / 5) * 100} className="h-2" />
        <div className={`absolute right-0 top-4 text-2xl font-bold ${timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
          {timeLeft}s
        </div>
      </div>
      
      {/* Scenario */}
      <Card className="bg-black/40 border-purple-500/30 p-8">
        <p className="text-xl text-white text-center mb-8">{scenario.text}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleAnswer('a')}
            className="h-20 text-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30"
            variant="outline"
          >
            {scenario.a}
          </Button>
          <Button
            onClick={() => handleAnswer('b')}
            className="h-20 text-lg bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/30"
            variant="outline"
          >
            {scenario.b}
          </Button>
        </div>
      </Card>
      
      {/* Progress */}
      <div className="flex justify-center gap-2">
        {PRESSURE_SCENARIOS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < currentIndex ? 'bg-purple-500' :
              i === currentIndex ? 'bg-white' :
              'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ==========================================
// EMOTIONAL RADAR GAME
// Identificação de emoções
// ==========================================
const EMOTIONS = [
  { face: '😊', emotion: 'Alegria', options: ['Alegria', 'Surpresa', 'Satisfação'] },
  { face: '😤', emotion: 'Frustração', options: ['Raiva', 'Frustração', 'Irritação'] },
  { face: '😰', emotion: 'Ansiedade', options: ['Medo', 'Ansiedade', 'Preocupação'] },
  { face: '🤔', emotion: 'Dúvida', options: ['Confusão', 'Dúvida', 'Curiosidade'] },
  { face: '😌', emotion: 'Calma', options: ['Calma', 'Indiferença', 'Aceitação'] },
  { face: '🥺', emotion: 'Vulnerabilidade', options: ['Tristeza', 'Vulnerabilidade', 'Empatia'] }
];

export const EmotionalRadarGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  
  const handleAnswer = (answer: string) => {
    const isCorrect = answer === EMOTIONS[currentIndex].emotion;
    if (isCorrect) setCorrect(c => c + 1);
    setShowResult(isCorrect ? 'correct' : 'wrong');
    
    setTimeout(() => {
      setShowResult(null);
      if (currentIndex + 1 >= EMOTIONS.length) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const score = Math.round((correct + (isCorrect ? 1 : 0)) / EMOTIONS.length * 100);
        
        onComplete({
          gameType: 'emotional-radar',
          score,
          timeSpent,
          details: { correct: correct + (isCorrect ? 1 : 0), total: EMOTIONS.length }
        });
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 800);
  };
  
  const emotion = EMOTIONS[currentIndex];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Radar Emocional</h2>
        <p className="text-purple-300">Identifique a emoção predominante</p>
      </div>
      
      {/* Face Display */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center py-8"
      >
        <span className="text-9xl">{emotion.face}</span>
      </motion.div>
      
      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex items-center justify-center z-10 ${
              showResult === 'correct' ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}
          >
            <span className="text-6xl">
              {showResult === 'correct' ? '✅' : '❌'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Options */}
      <div className="grid grid-cols-3 gap-3">
        {emotion.options.map(option => (
          <Button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showResult !== null}
            className="h-16 bg-white/10 hover:bg-white/20 text-white"
            variant="outline"
          >
            {option}
          </Button>
        ))}
      </div>
      
      {/* Score */}
      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-green-400">
          <Heart className="w-5 h-5" />
          <span>{correct}/{currentIndex}</span>
        </div>
        <div className="flex gap-1">
          {EMOTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentIndex ? 'bg-purple-500' :
                i === currentIndex ? 'bg-white' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// GAME SELECTOR
// ==========================================
interface MiniGameSelectorProps {
  gameType: 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';
  onComplete: (result: MiniGameResult) => void;
}

export const MiniGameSelector: React.FC<MiniGameSelectorProps> = ({ gameType, onComplete }) => {
  switch (gameType) {
    case 'value-tower':
      return <ValueTowerGame onComplete={onComplete} />;
    case 'reaction':
      return <ReactionGame onComplete={onComplete} />;
    case 'pressure':
      return <PressureGame onComplete={onComplete} />;
    case 'emotional-radar':
      return <EmotionalRadarGame onComplete={onComplete} />;
    default:
      return null;
  }
};

export default MiniGameSelector;
