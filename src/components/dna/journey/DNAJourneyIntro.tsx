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
    className="min-h-screen bg-gradient-to-br from-background via-primary/20 to-background flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <Card className="max-w-2xl w-full bg-card/60 backdrop-blur-xl border-primary/30 p-8">
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
            className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-info rounded-full blur-xl opacity-50"
          />
          <div className="relative bg-gradient-to-r from-primary to-accent p-6 rounded-full">
            <Rocket className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent">
          Jornada do DNA Comportamental
        </h1>

        <p className="text-lg text-muted-foreground">
          Olá, <span className="font-bold text-foreground">{participantName}</span>!
        </p>

        <p className="text-muted-foreground max-w-lg mx-auto">
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
              <span className="text-xs text-muted-foreground">{strand.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/10 rounded-xl p-4 text-left space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5" />
            O que esperar:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 3 cenários imersivos de tomada de decisão</li>
            <li>• 4 mini-jogos comportamentais</li>
            <li>• Revelação do seu arquétipo único</li>
            <li>• Tempo estimado: 15-20 minutos</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Jornada
          </Button>
        </div>
      </motion.div>
    </Card>
  </motion.div>
);
