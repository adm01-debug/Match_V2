import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Users, Mail, Phone, Target, Sparkles, Briefcase, GraduationCap, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComunicacaoHistorico } from '@/components/candidatos/ComunicacaoHistorico';
import { useNavigate } from 'react-router-dom';

interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

interface Formacao {
  curso: string;
  instituicao: string;
}

interface MatchScore {
  id: string;
  vaga_titulo: string;
  score_total: number;
}

interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  resumo: string | null;
  habilidades: string[] | null;
  experiencias: Experiencia[] | null;
  formacao: Formacao[] | null;
  status: string | null;
}

const statusOptions = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_triagem', label: 'Em Triagem' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
  { value: 'banco_talentos', label: 'Banco de Talentos' },
];

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case 'novo': return { color: 'bg-info text-info-foreground' };
    case 'em_triagem': return { color: 'bg-warning text-warning-foreground' };
    case 'entrevista': return { color: 'bg-accent text-accent-foreground' };
    case 'aprovado': return { color: 'bg-success text-success-foreground' };
    case 'reprovado': return { color: 'bg-destructive text-destructive-foreground' };
    case 'banco_talentos': return { color: 'bg-primary text-primary-foreground' };
    default: return { color: 'bg-muted text-muted-foreground' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success bg-success/10 border-success/20';
  if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
  if (score >= 40) return 'text-accent bg-accent/10 border-accent/20';
  return 'text-destructive bg-destructive/10 border-destructive/20';
};

interface CandidatoDetailSheetProps {
  candidato: Candidato;
  matchScores: MatchScore[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const CandidatoDetailSheet = memo(function CandidatoDetailSheet({
  candidato, matchScores, onUpdateStatus, onDelete
}: CandidatoDetailSheetProps) {
  const navigate = useNavigate();

  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          {candidato.nome}
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 mt-6">
        {/* Status Edit */}
        <div>
          <h4 className="text-sm font-medium mb-2">Alterar Status</h4>
          <Select 
            value={candidato.status || 'novo'} 
            onValueChange={(value) => onUpdateStatus(candidato.id, value)}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getStatusConfig(opt.value).color)} />
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact */}
        <div className="p-4 rounded-xl bg-muted/30 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <span>{candidato.email}</span>
          </div>
          {candidato.telefone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>{candidato.telefone}</span>
            </div>
          )}
        </div>

        {/* Match Scores */}
        {matchScores.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Match Scores
            </h4>
            <div className="space-y-2">
              {matchScores.map((score) => (
                <div key={score.id} className={cn(
                  "p-3 rounded-xl border",
                  getScoreColor(score.score_total)
                )}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{score.vaga_titulo}</span>
                    <span className="font-bold">{score.score_total}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        {candidato.resumo && (
          <div>
            <h4 className="text-sm font-medium mb-2">Resumo</h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
              {candidato.resumo}
            </p>
          </div>
        )}

        {/* Skills */}
        {candidato.habilidades && candidato.habilidades.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Habilidades ({candidato.habilidades.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidato.habilidades.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {candidato.experiencias && candidato.experiencias.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Experiências ({candidato.experiencias.length})
            </h4>
            <div className="space-y-2">
              {candidato.experiencias.map((exp, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-xl">
                  <p className="font-medium text-sm">{exp.cargo}</p>
                  <p className="text-sm text-primary">{exp.empresa}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exp.periodo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidato.formacao && candidato.formacao.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Formação ({candidato.formacao.length})
            </h4>
            <div className="space-y-2">
              {candidato.formacao.map((edu, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-xl">
                  <p className="font-medium text-sm">{edu.curso}</p>
                  <p className="text-sm text-primary">{edu.instituicao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communication History */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Histórico de Comunicações
          </h4>
          <ComunicacaoHistorico candidatoId={candidato.id} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className="flex-1 btn-premium text-primary-foreground"
            onClick={() => navigate(`/candidato/${candidato.id}`)}
          >
            <Users className="h-4 w-4 mr-2" />
            Ver Perfil Completo
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onDelete(candidato.id)}
            aria-label="Excluir candidato"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </SheetContent>
  );
});
