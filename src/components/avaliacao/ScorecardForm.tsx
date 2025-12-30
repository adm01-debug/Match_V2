import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Save } from 'lucide-react';

interface Competency { id: string; name: string; description: string; category: string; }
interface ScorecardFormProps {
  candidatoId: string;
  entrevistaId: string;
  competencies?: Competency[];
  onSubmit?: (scores: Record<string, number>, notes: string) => void;
}

const DEFAULT_COMPETENCIES: Competency[] = [
  { id: '1', name: 'Comunicação', description: 'Clareza e objetividade na comunicação', category: 'Comportamental' },
  { id: '2', name: 'Trabalho em Equipe', description: 'Colaboração e relacionamento interpessoal', category: 'Comportamental' },
  { id: '3', name: 'Resolução de Problemas', description: 'Capacidade analítica e tomada de decisão', category: 'Técnica' },
  { id: '4', name: 'Conhecimento Técnico', description: 'Domínio das habilidades requeridas', category: 'Técnica' },
  { id: '5', name: 'Proatividade', description: 'Iniciativa e autonomia', category: 'Comportamental' },
  { id: '6', name: 'Adaptabilidade', description: 'Flexibilidade e abertura a mudanças', category: 'Comportamental' },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="focus:outline-none">
          <Star className={`h-6 w-6 transition-colors ${star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export function ScorecardForm({ candidatoId, entrevistaId, competencies = DEFAULT_COMPETENCIES, onSubmit }: ScorecardFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState<'aprovar' | 'reprovar' | 'talvez' | null>(null);
  void candidatoId;
  void entrevistaId;

  const categories = [...new Set(competencies.map(c => c.category))];
  const averageScore = Object.values(scores).length > 0 ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1) : '0.0';

  const handleSubmit = () => {
    onSubmit?.(scores, notes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scorecard de Avaliação</span>
          <span className="text-2xl font-bold text-primary">{averageScore}/5.0</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{category}</h3>
            <div className="space-y-4">
              {competencies.filter(c => c.category === category).map(comp => (
                <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{comp.name}</p>
                    <p className="text-xs text-muted-foreground">{comp.description}</p>
                  </div>
                  <StarRating value={scores[comp.id] || 0} onChange={(v) => setScores({ ...scores, [comp.id]: v })} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label>Recomendação</Label>
          <div className="flex gap-2">
            {(['aprovar', 'talvez', 'reprovar'] as const).map((rec) => (
              <Button key={rec} variant={recommendation === rec ? 'default' : 'outline'} onClick={() => setRecommendation(rec)} className={rec === 'aprovar' ? 'border-green-500' : rec === 'reprovar' ? 'border-red-500' : ''}>
                {rec === 'aprovar' ? '✅ Aprovar' : rec === 'reprovar' ? '❌ Reprovar' : '🤔 Talvez'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Adicione observações sobre o candidato..." rows={4} />
        </div>

        <Button onClick={handleSubmit} className="w-full"><Save className="h-4 w-4 mr-2" />Salvar Avaliação</Button>
      </CardContent>
    </Card>
  );
}

export default ScorecardForm;
