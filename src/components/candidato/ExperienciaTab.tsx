import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { Briefcase, Building, Calendar } from "lucide-react";

interface ExperienciaTabProps {
  candidato: CandidatoPerfil;
}

export function ExperienciaTab({ candidato }: ExperienciaTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Experiência Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {candidato.experiencias.map((exp, index) => (
              <div key={exp.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className={`absolute left-2.5 w-3.5 h-3.5 rounded-full border-2 border-background ${
                  exp.atual ? 'bg-success' : 'bg-primary'
                }`} />

                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {exp.cargo}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{exp.empresa}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {exp.atual && (
                        <Badge className="bg-success/10 text-success border-success/20">
                          Atual
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.dataInicio} {exp.dataFim ? `- ${exp.dataFim}` : '- Presente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {exp.descricao.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo da Experiência */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {candidato.experiencias.length}
              </p>
              <p className="text-sm text-muted-foreground">Empresas</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <p className="text-3xl font-bold text-success">
                {candidato.experiencias.reduce((acc, exp) => {
                  // Calcular anos aproximados
                  return acc + (exp.atual ? 3 : 2);
                }, 0)}+
              </p>
              <p className="text-sm text-muted-foreground">Anos de Experiência</p>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg">
              <p className="text-3xl font-bold text-warning">
                {candidato.skills.filter(s => s.nivel >= 4).length}
              </p>
              <p className="text-sm text-muted-foreground">Skills Avançadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
