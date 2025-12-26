import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, Star, Send, CheckCircle } from 'lucide-react';

interface Evaluator { id: string; name: string; role: string; status: 'pending' | 'completed'; score?: number; feedback?: string; completedAt?: string; }
interface Feedback360Props { candidatoId: string; evaluators: Evaluator[]; onSubmit?: (evaluatorId: string, score: number, feedback: string) => void; currentUserId?: string; }

export function Feedback360({ candidatoId, evaluators, onSubmit, currentUserId }: Feedback360Props) {
  const [selectedScore, setSelectedScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredScore, setHoveredScore] = useState(0);

  const completedCount = evaluators.filter(e => e.status === 'completed').length;
  const progress = (completedCount / evaluators.length) * 100;
  const averageScore = evaluators.filter(e => e.score).reduce((acc, e) => acc + (e.score || 0), 0) / completedCount || 0;

  const currentEvaluator = evaluators.find(e => e.id === currentUserId);
  const canSubmit = currentEvaluator?.status === 'pending';

  const handleSubmit = () => {
    if (currentUserId && selectedScore > 0) {
      onSubmit?.(currentUserId, selectedScore, feedback);
      setSelectedScore(0);
      setFeedback('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Users className="h-5 w-5" />Avaliação 360°</span>
          <Badge variant="outline">{completedCount}/{evaluators.length} avaliações</Badge>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Média Geral</p>
            <p className="text-3xl font-bold">{averageScore.toFixed(1)}<span className="text-lg text-muted-foreground">/5</span></p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Avaliadores</p>
            <div className="flex -space-x-2">
              {evaluators.map(e => (
                <Avatar key={e.id} className={`border-2 ${e.status === 'completed' ? 'border-green-500' : 'border-muted'}`}>
                  <AvatarFallback className="text-xs">{e.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {evaluators.map(evaluator => (
            <div key={evaluator.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>{evaluator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><p className="font-medium text-sm">{evaluator.name}</p><p className="text-xs text-muted-foreground">{evaluator.role}</p></div>
              </div>
              <div className="flex items-center gap-2">
                {evaluator.status === 'completed' ? (
                  <>
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= (evaluator.score || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </>
                ) : (
                  <Badge variant="outline">Pendente</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {canSubmit && (
          <div className="border-t pt-4 space-y-4">
            <p className="font-medium">Sua Avaliação</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(score => (
                <button key={score} onClick={() => setSelectedScore(score)} onMouseEnter={() => setHoveredScore(score)} onMouseLeave={() => setHoveredScore(0)} className="focus:outline-none">
                  <Star className={`h-8 w-8 transition-colors ${score <= (hoveredScore || selectedScore) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Adicione seu feedback..." value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} />
            <Button onClick={handleSubmit} disabled={selectedScore === 0}><Send className="h-4 w-4 mr-2" />Enviar Avaliação</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Feedback360;
