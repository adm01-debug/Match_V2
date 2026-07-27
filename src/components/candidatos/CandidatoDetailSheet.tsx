import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Users, Mail, Phone, Target, Sparkles, Briefcase, GraduationCap, MessageSquare, Trash2, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComunicacaoHistorico } from '@/components/candidatos/ComunicacaoHistorico';
import { CandidatoTechProfileForm } from '@/components/candidatos/CandidatoTechProfileForm';
import { PotentialIndexCard } from '@/components/candidatos/PotentialIndexCard';
import { CandidatoSkillsEditor } from '@/components/candidatos/CandidatoSkillsEditor';
import { useNavigate } from 'react-router-dom';
import { Candidato, MatchScore, statusOptions, getStatusConfig, getScoreColor } from '@/types/candidate';

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

        {/* Perfil técnico estruturado */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Perfil Técnico
          </h4>
          <CandidatoTechProfileForm candidatoId={candidato.id} />
        </div>

        {/* Índice de Potencial (cognitivo + comportamental + fit cultural) */}
        <PotentialIndexCard candidatoId={candidato.id} />



        {/* Competências da taxonomia */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Competências Estruturadas
          </h4>
          <CandidatoSkillsEditor candidatoId={candidato.id} />
        </div>



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

        {/* Timeline de etapas e contatos */}
        <CandidatoTimelineSection email={candidato.email} />

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