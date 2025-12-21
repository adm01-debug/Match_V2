import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { FileText, Download, Eye, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculoTabProps {
  candidato: CandidatoPerfil;
}

export function CurriculoTab({ candidato }: CurriculoTabProps) {
  const getArquivoIcon = (tipo: string) => {
    switch (tipo) {
      case 'curriculo': return '📄';
      case 'certificado': return '🎓';
      case 'carta': return '📝';
      case 'portfolio': return '🎨';
      default: return '📎';
    }
  };

  const getArquivoLabel = (tipo: string) => {
    switch (tipo) {
      case 'curriculo': return 'Currículo';
      case 'certificado': return 'Certificado';
      case 'carta': return 'Carta';
      case 'portfolio': return 'Portfólio';
      default: return 'Arquivo';
    }
  };

  const getSkillColor = (nivel: number) => {
    if (nivel >= 4) return "bg-success";
    if (nivel >= 3) return "bg-warning";
    return "bg-muted";
  };

  return (
    <div className="space-y-6">
      {/* Resumo Profissional */}
      <Card role="article" aria-label="Currículo do candidato">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resumo Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {candidato.resumoProfissional}
          </p>
        </CardContent>
      </Card>

      {/* Arquivos Anexos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Arquivos Anexos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {candidato.arquivos.map((arquivo) => (
              <div 
                key={arquivo.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getArquivoIcon(arquivo.tipo)}</span>
                  <div>
                    <p className="font-medium text-foreground">{arquivo.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {getArquivoLabel(arquivo.tipo)} • {arquivo.tamanho} • {arquivo.dataUpload}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Habilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidato.skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.nome}</span>
                  <span className="text-xs text-muted-foreground">{skill.nivel}/5</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", getSkillColor(skill.nivel))}
                    style={{ width: `${(skill.nivel / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {candidato.certificacoes.map((cert) => (
              <div 
                key={cert.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{cert.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {cert.instituicao} • {cert.dataEmissao}
                  </p>
                </div>
                {cert.dataValidade && (
                  <Badge variant="outline" className="text-xs">
                    Válido até {cert.dataValidade}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
