import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { MatchResultCard } from '@/components/match/MatchResultCard';
import { type MatchResult } from '@/types/match';
import confetti from 'canvas-confetti';

interface DeuMatchesViewProps {
  matches: MatchResult[];
  empresaNome: string;
  candidatoNome: string;
  onBack: () => void;
}

export const DeuMatchesView: React.FC<DeuMatchesViewProps> = ({
  matches, empresaNome, candidatoNome, onBack
}) => {
  const handleLike = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  return (
    <Layout title="Seus Matches">
      <div className="min-h-screen bg-gradient-to-br from-accent via-accent to-destructive dark:from-slate-900 dark:via-accent/20 dark:to-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
                Deu Match! 💜
              </h1>
              <p className="text-muted-foreground">
                Compatibilidade entre {empresaNome} e {candidatoNome}
              </p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          {matches.map((match, index) => (
            <MatchResultCard
              key={index}
              match={match}
              empresaNome={empresaNome}
              onLike={handleLike}
              onPass={onBack}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};