import { useMemo,  useCallback,  memo   } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  File, 
  Award, 
  FileCheck,
  Folder
} from "lucide-react";
import { CandidatoPerfil, ArquivoAnexo } from "@/data/candidatoPerfilData";
import { toast } from "sonner";

interface DocumentosTabProps {
  candidato: CandidatoPerfil;
}

const tipoIcons: Record<string, React.ReactNode> = {
  curriculo: <FileText className="h-5 w-5 text-blue-400" />,
  certificado: <Award className="h-5 w-5 text-amber-400" />,
  carta: <FileCheck className="h-5 w-5 text-emerald-400" />,
  portfolio: <Folder className="h-5 w-5 text-purple-400" />,
  outro: <File className="h-5 w-5 text-muted-foreground" />,
};

const tipoLabels: Record<string, string> = {
  curriculo: "Currículo",
  certificado: "Certificado",
  carta: "Carta",
  portfolio: "Portfólio",
  outro: "Outro",
};

export function DocumentosTab({ candidato }: DocumentosTabProps) {
  const handleDownload = (arquivo: ArquivoAnexo) => {
    toast.success(`Baixando ${arquivo.nome}...`);
  };

  const handlePreview = (arquivo: ArquivoAnexo) => {
    toast.info(`Abrindo preview de ${arquivo.nome}...`);
  };

  const handleUpload = () => {
    toast.info("Funcionalidade de upload em desenvolvimento");
  };

  const documentosPorTipo = candidato.arquivos.reduce((acc, arq) => {
    if (!acc[arq.tipo]) acc[arq.tipo] = [];
    acc[arq.tipo].push(arq);
    return acc;
  }, {} as Record<string, ArquivoAnexo[]>);

  return (
    <div data-testid="component"><div className="space-y-6">
      {/* Header com Upload */}
      <Card role="article" aria-label="Documentos do candidato">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Documentos e Arquivos
              </CardTitle>
              <CardDescription>
                {candidato.arquivos.length} arquivo(s) anexado(s)
              </CardDescription>
            </div>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Documentos */}
      {Object.entries(documentosPorTipo).map(([tipo, arquivos]) => (
        <Card key={tipo}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {tipoIcons[tipo]}
              {tipoLabels[tipo] || tipo}
              <Badge variant="secondary" className="ml-2">
                {arquivos.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {arquivos.map((arquivo) => (
                <div
                  key={arquivo.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {tipoIcons[arquivo.tipo]}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{arquivo.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {arquivo.tamanho} • Enviado em {arquivo.dataUpload}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(arquivo)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(arquivo)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {candidato.arquivos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">Nenhum documento anexado</p>
            <Button variant="outline" className="mt-4" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

DocumentosTab.displayName = "DocumentosTab";

export default memo(DocumentosTab, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
