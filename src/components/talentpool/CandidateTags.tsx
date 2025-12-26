import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Plus, Tag } from 'lucide-react';

interface CandidateTagsProps { tags: string[]; onChange?: (tags: string[]) => void; readOnly?: boolean; suggestedTags?: string[]; }

const DEFAULT_SUGGESTED = ['Senior', 'Pleno', 'Junior', 'Remoto', 'Presencial', 'Tech Lead', 'Full Stack', 'Frontend', 'Backend', 'DevOps', 'Data', 'Product', 'Design', 'Urgente', 'Indicação'];

export function CandidateTags({ tags, onChange, readOnly = false, suggestedTags = DEFAULT_SUGGESTED }: CandidateTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange?.([...tags, trimmed]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    onChange?.(tags.filter(t => t !== tag));
  };

  const filteredSuggestions = suggestedTags.filter(s => !tags.includes(s) && s.toLowerCase().includes(newTag.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">
            <Tag className="h-3 w-3" />{tag}
            {!readOnly && (
              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
            )}
          </Badge>
        ))}
        {!readOnly && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 px-2"><Plus className="h-3 w-3 mr-1" />Tag</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Digite uma tag..." className="mb-2" onKeyDown={e => { if (e.key === 'Enter') { addTag(newTag); e.preventDefault(); } }} autoFocus />
              {filteredSuggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground px-1">Sugestões:</p>
                  <div className="flex flex-wrap gap-1">
                    {filteredSuggestions.slice(0, 8).map(suggestion => (
                      <Badge key={suggestion} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => { addTag(suggestion); setIsOpen(false); }}>
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

export default CandidateTags;
