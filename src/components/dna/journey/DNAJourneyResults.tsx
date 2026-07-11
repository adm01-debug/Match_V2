import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DNAHelix3D } from '../DNAHelix3D';
import { DNAProfileCard } from '../DNAProfileCard';
import { DNA_ARCHETYPES, type DNAHelix, type DNAProfile } from '@/types/behavioralDNA';

interface Props {
  profile: DNAProfile;
  participantName: string;
  helixScores: DNAHelix;
  onRestart: () => void;
  onComplete: () => void;
}

export const DNAJourneyResults: React.FC<Props> = ({
  profile,
  participantName,
  helixScores,
  onRestart,
  onComplete,
}) => {
  const archetypeData = DNA_ARCHETYPES.find((a) => a.id === profile.archetype);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <DNAHelix3D helix={helixScores} size="lg" animated />
        </motion.div>

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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <DNAProfileCard profile={profile} variant="full" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-4 pb-8"
        >
          <Button
            variant="outline"
            onClick={onRestart}
            className="border-purple-500/50 text-purple-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer Jornada
          </Button>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
          >
            Salvar Perfil DNA
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
