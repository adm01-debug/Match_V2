import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { MiniGameQuestion } from './types';

interface RendererProps {
  game: MiniGameQuestion;
  onSelect: (optionId: string) => void;
}

export function QuickChoiceRenderer({ game, onSelect }: RendererProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {game.options.map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(option.id)}
          className={cn(
            'p-6 rounded-2xl border-2 transition-all',
            'hover:scale-105 hover:border-primary active:scale-95',
            'flex flex-col items-center gap-3'
          )}
        >
          {option.emoji && <span className="text-4xl">{option.emoji}</span>}
          <span className="font-medium text-center">{option.text}</span>
        </motion.button>
      ))}
    </div>
  );
}

export function ThisOrThatRenderer({ game, onSelect }: RendererProps) {
  return (
    <div className="flex gap-4">
      {game.options.slice(0, 2).map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => onSelect(option.id)}
          className={cn(
            'flex-1 p-8 rounded-3xl border-2 transition-all',
            'hover:scale-105 active:scale-95',
            index === 0
              ? 'hover:border-accent hover:bg-accent/10'
              : 'hover:border-primary hover:bg-primary/10'
          )}
        >
          <div className="text-center">
            {option.emoji && <span className="text-6xl block mb-4">{option.emoji}</span>}
            <span className="text-xl font-bold">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export function WordAssociationRenderer({ game, onSelect }: RendererProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Escolha a primeira palavra que vier à mente:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {game.options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              'px-6 py-3 rounded-full border-2 transition-all',
              'hover:scale-110 hover:border-primary active:scale-95',
              'font-medium'
            )}
          >
            {option.emoji && <span className="mr-2">{option.emoji}</span>}
            {option.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
