/**
 * @fileoverview AI Interview Scheduler - Sugere horários automaticamente
 * @module AIInterviewScheduler
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEntrevistadores } from './aiScheduler/mockData';
import { useSuggestedSlots } from './aiScheduler/useSuggestedSlots';
import { AISchedulerIntro } from './aiScheduler/AISchedulerIntro';
import { ConflictBanner } from './aiScheduler/ConflictBanner';
import { SuggestedSlotCard } from './aiScheduler/SuggestedSlotCard';
import type { Entrevistador, SugestedSlot, ConflictInfo } from './aiScheduler/types';

export type { Entrevistador, SugestedSlot, ConflictInfo } from './aiScheduler/types';

interface AIInterviewSchedulerProps {
  entrevistadores?: Entrevistador[];
  duracao?: number;
  onSelectSlot: (slot: SugestedSlot) => void;
  candidatoNome?: string;
}

export function AIInterviewScheduler({
  entrevistadores = mockEntrevistadores,
  duracao = 60,
  onSelectSlot,
  candidatoNome = 'Candidato',
}: AIInterviewSchedulerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conflictWarnings, setConflictWarnings] = useState<ConflictInfo[]>([]);

  const suggestedSlots = useSuggestedSlots(entrevistadores, duracao);

  const currentSlot = useMemo(
    () => suggestedSlots.find(s => s.id === selectedSlot),
    [selectedSlot, suggestedSlots],
  );

  useEffect(() => {
    setConflictWarnings(currentSlot?.conflicts ?? []);
  }, [currentSlot]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setShowSuggestions(true);
  };

  const handleSelectSlot = (slot: SugestedSlot) => {
    setSelectedSlot(slot.id);
    onSelectSlot(slot);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-accent/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Interview Scheduler
              <Badge variant="secondary" className="bg-gradient-to-r from-primary to-accent text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </CardTitle>
            <CardDescription>
              Sugestões inteligentes baseadas em disponibilidade e produtividade
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {!showSuggestions ? (
          <AISchedulerIntro
            candidatoNome={candidatoNome}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">
                    {suggestedSlots.length} horários encontrados
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleAnalyze}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reanalisar
                </Button>
              </div>

              <ConflictBanner conflicts={conflictWarnings} />

              <div className="space-y-3">
                {suggestedSlots.map((slot, index) => (
                  <SuggestedSlotCard
                    key={slot.id}
                    slot={slot}
                    index={index}
                    isSelected={selectedSlot === slot.id}
                    onSelect={handleSelectSlot}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
