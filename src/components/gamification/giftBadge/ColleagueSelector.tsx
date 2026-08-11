import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Colleague } from './types';

interface Props {
  colleagues: Colleague[];
  selected?: Colleague;
  onSelect: (colleague: Colleague) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ColleagueSelector = memo(({ colleagues, selected, onSelect, searchQuery, onSearchChange }: Props) => {
  const filtered = colleagues.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar colega..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {filtered.map((colleague) => (
          <motion.button
            key={colleague.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(colleague)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg transition-all',
              selected?.id === colleague.id
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-muted/50 hover:bg-muted',
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={colleague.avatar} />
              <AvatarFallback>{colleague.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{colleague.name}</p>
              {colleague.department && (
                <p className="text-sm text-muted-foreground">{colleague.department}</p>
              )}
            </div>
            {selected?.id === colleague.id && <ThumbsUp className="h-5 w-5 text-primary ml-auto" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

ColleagueSelector.displayName = 'ColleagueSelector';
