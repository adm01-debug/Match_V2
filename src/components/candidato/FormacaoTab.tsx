import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { GraduationCap, Award, BookOpen } from "lucide-react";

interface FormacaoTabProps {
  candidato: CandidatoPerfil;
}

export function FormacaoTab({ candidato }: FormacaoTabProps) {
  const getNivelLabel = (nivel: string) => {
    const labels: Record<string, string> = {
      'medio': 'Ensino Médio',
      'tecnico': 'Técnico',
      'graduacao': 'Graduação',
      'pos_graduacao': 'Pós-Graduação',
      'mestrado': 'Mestrado',
      'doutorado': 'Doutorado',
    };
    return labels[nivel] || nivel;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      'concluido': { label: 'Concluído', color: 'bg-success/10 text-success border-success/20' },
      'cursando': { label: 'Cursando', color: 'bg-primary/10 text-primary border-primary/20' },
      'trancado': { label: 'Trancado', color: 'bg-muted text-muted-foreground' },
    };
    return labels[status] || { label: status, color: 'bg-muted' };
  };

  return (
    <div className="space-y-6">
      {/* Formação Acadêmica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Formação Acadêmica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidato.formacao.map((form) => {
              const statusInfo = getStatusLabel(form.status);
              return (
                <div 
                  key={form.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{form.curso}</h3>
                      <p className="text-muted-foreground">{form.instituicao}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {getNivelLabel(form.nivel)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {form.anoConclusao}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Certificações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificações e Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidato.certificacoes.map((cert) => (
              <div 
                key={cert.id}
                className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Award className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{cert.nome}</h4>
                    <p className="text-sm text-muted-foreground">{cert.instituicao}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Emitido: {cert.dataEmissao}</span>
                      {cert.dataValidade && (
                        <>
                          <span>•</span>
                          <span>Validade: {cert.dataValidade}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo da Formação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {candidato.formacao.length}
              </p>
              <p className="text-sm text-muted-foreground">Formações</p>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg">
              <p className="text-3xl font-bold text-warning">
                {candidato.certificacoes.length}
              </p>
              <p className="text-sm text-muted-foreground">Certificações</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <p className="text-3xl font-bold text-success">
                {candidato.formacao.filter(f => f.status === 'concluido').length}
              </p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
