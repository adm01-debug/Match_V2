import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MiniGameProps } from './types';

const VALUES = [
  { id: 'innovation', name: 'Inovação', emoji: '💡' },
  { id: 'collaboration', name: 'Colaboração', emoji: '🤝' },
  { id: 'integrity', name: 'Integridade', emoji: '⚖️' },
  { id: 'growth', name: 'Crescimento', emoji: '📈' },
  { id: 'balance', name: 'Equilíbrio', emoji: '☯️' },
  { id: 'excellence', name: 'Excelência', emoji: '🏆' },
  { id: 'autonomy', name: 'Autonomia', emoji: '🦅' },
  { id: 'purpose', name: 'Propósito', emoji: '🎯' },
];

export const ValueTowerGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const availableValues = VALUES.filter((v) => !selectedValues.includes(v.id));

  const handleSelectValue = (valueId: string) => {
    if (selectedValues.length < 5) setSelectedValues([...selectedValues, valueId]);
  };

  const handleRemoveValue = (index: number) => {
    setSelectedValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const score = selectedValues.length === 5 ? 80 + Math.min(20, Math.max(0, 60 - timeSpent)) : 50;
    onComplete({ gameType: 'value-tower', score, timeSpent, details: { selectedValues } });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Torre de Valores</h2>
        <p className="text-muted-foreground">Selecione seus 5 valores mais importantes em ordem</p>
      </div>

      <Card className="p-6">
        <h3 className="text-sm text-muted-foreground mb-4">Sua Torre ({selectedValues.length}/5)</h3>
        <div className="space-y-2 min-h-[200px]">
          {selectedValues.map((valueId, index) => {
            const value = VALUES.find((v) => v.id === valueId);
            return (
              <motion.div
                key={valueId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-primary/10 hover:bg-primary/20 p-3 rounded-lg cursor-pointer"
                onClick={() => handleRemoveValue(index)}
              >
                <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-foreground">
                  {index + 1}
                </span>
                <span className="text-2xl">{value?.emoji}</span>
                <span className="text-foreground font-medium">{value?.name}</span>
              </motion.div>
            );
          })}
          {selectedValues.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Clique nos valores abaixo para construir sua torre
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        {availableValues.map((value) => (
          <motion.div
            key={value.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectValue(value.id)}
            className="bg-muted hover:bg-muted/70 p-4 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-3xl block mb-2">{value.emoji}</span>
            <span className="text-xs text-foreground">{value.name}</span>
          </motion.div>
        ))}
      </div>

      {selectedValues.length === 5 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <Button onClick={handleComplete} size="lg">
            <Trophy className="w-5 h-5 mr-2" />
            Confirmar Torre
          </Button>
        </motion.div>
      )}
    </div>
  );
};
