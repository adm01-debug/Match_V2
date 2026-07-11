import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Experiencia {
  cargo?: string;
  empresa?: string;
}
export interface Formacao {
  curso?: string;
  instituicao?: string;
}

interface CandidateResumoTabProps {
  habilidades: string[];
  experiencias: Experiencia[];
  formacoes: Formacao[];
}

export const CandidateResumoTab = memo(function CandidateResumoTab({ 
  habilidades, 
  experiencias, 
  formacoes 
}: CandidateResumoTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
        <CardContent>
          {habilidades.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {habilidades.map((h, i) => (
                <Badge key={i} variant="secondary">{h}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma habilidade</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Experiência</CardTitle></CardHeader>
        <CardContent>
          {experiencias.length > 0 ? (
            <div className="space-y-3">
              {experiencias.slice(0, 3).map((exp, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-4">
                  <p className="font-medium">{exp.cargo || 'Cargo'}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {exp.empresa || 'Empresa'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma experiência</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Formação</CardTitle></CardHeader>
        <CardContent>
          {formacoes.length > 0 ? (
            <div className="space-y-3">
              {formacoes.map((f, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-4">
                  <p className="font-medium">{f.curso || 'Curso'}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {f.instituicao || 'Instituição'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma formação</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
