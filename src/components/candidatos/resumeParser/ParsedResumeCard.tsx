import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle2, GraduationCap, Loader2, Mail, Phone, Sparkles, Target, User, UserPlus, X } from 'lucide-react';
import type { ParsedResume } from './types';

interface ParsedResumeCardProps {
  data: ParsedResume;
  isSaving: boolean;
  savedCandidatoId: string | null;
  showMatchCalculator: boolean;
  onClear: () => void;
  onSave: () => void;
  onToggleMatch: () => void;
}

export const ParsedResumeCard = memo(function ParsedResumeCard({
  data, isSaving, savedCandidatoId, showMatchCalculator, onClear, onSave, onToggleMatch,
}: ParsedResumeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Dados Extraídos
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoTile icon={<User className="h-5 w-5 text-primary" />} label="Nome" value={data.nome} />
          <InfoTile icon={<Mail className="h-5 w-5 text-primary" />} label="Email" value={data.email} />
          <InfoTile icon={<Phone className="h-5 w-5 text-primary" />} label="Telefone" value={data.telefone} />
        </div>

        {data.resumo && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Resumo Profissional</h4>
            <p className="text-sm bg-muted p-3 rounded-lg">{data.resumo}</p>
          </div>
        )}

        {data.habilidades?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Habilidades ({data.habilidades.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.habilidades.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.experiencias?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência Profissional ({data.experiencias.length})
            </h4>
            <div className="space-y-3">
              {data.experiencias.map((exp, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">{exp.cargo}</p>
                    <Badge variant="outline" className="text-xs">{exp.periodo}</Badge>
                  </div>
                  <p className="text-sm text-primary">{exp.empresa}</p>
                  {exp.descricao && <p className="text-sm text-muted-foreground mt-2">{exp.descricao}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.formacao?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação Acadêmica ({data.formacao.length})
            </h4>
            <div className="space-y-3">
              {data.formacao.map((edu, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{edu.curso}</p>
                      <p className="text-sm text-primary">{edu.instituicao}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{edu.periodo}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {!savedCandidatoId ? (
            <Button onClick={onSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />Salvar Candidato no Banco</>
              )}
            </Button>
          ) : (
            <div className="flex-1 p-3 bg-success/10 rounded-lg text-center">
              <p className="text-sm text-success flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Candidato salvo com sucesso!
              </p>
            </div>
          )}

          <Button variant="outline" onClick={onToggleMatch} className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {showMatchCalculator ? 'Ocultar Match Score' : 'Calcular Match Score'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || '-'}</p>
      </div>
    </div>
  );
}
