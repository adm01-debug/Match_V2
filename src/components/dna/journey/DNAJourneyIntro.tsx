import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Heart, Mic2, Compass, Zap, Target, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DNA_STRANDS } from '@/types/behavioralDNA';

interface Props {
  participantName: string;
  onStart: () => void;
  onCancel?: () => void;
}

export const DNAJourneyIntro: React.FC<Props> = ({ participantName, onStart, onCancel }) => (
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
          Você está prestes a embarcar em uma experiência imersiva que vai revelar seu verdadeiro DNA
          comportamental através de cenários realistas, desafios estratégicos e reflexões profundas.
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
            onClick={onStart}
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
