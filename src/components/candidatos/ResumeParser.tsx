import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Loader2, User, Mail, Phone, Briefcase, GraduationCap, Sparkles, CheckCircle2, X, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MatchScoreCalculator } from './MatchScoreCalculator';

export interface ParsedResume {
  nome: string;
  email: string;
  telefone: string;
  experiencias: {
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
  }[];
  habilidades: string[];
  formacao: {
    instituicao: string;
    curso: string;
    periodo: string;
  }[];
  resumo: string;
}

interface ResumeParserProps {
  onParsed?: (data: ParsedResume) => void;
}

export function ResumeParser({ onParsed }: ResumeParserProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showMatchCalculator, setShowMatchCalculator] = useState(false);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  const parseResume = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    setParsedData(null);
    setShowMatchCalculator(false);

    try {
      const fileContent = await extractTextFromFile(file);
      
      if (!fileContent || fileContent.trim().length < 50) {
        toast({
          title: "Arquivo inválido",
          description: "O arquivo parece estar vazio ou não contém texto suficiente. Para PDFs, use arquivos de texto (.txt) por enquanto.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { fileContent, fileName: file.name },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar currículo');
      }

      setParsedData(data.data);
      onParsed?.(data.data);

      toast({
        title: "Currículo processado!",
        description: `Dados de ${data.data.nome || 'candidato'} extraídos com sucesso.`,
      });
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast({
        title: "Erro ao processar",
        description: error instanceof Error ? error.message : "Não foi possível processar o currículo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.txt')) {
        parseResume(file);
      } else {
        toast({
          title: "Formato não suportado",
          description: "Use arquivos .txt, .pdf ou .docx",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      parseResume(files[0]);
    }
  };

  const clearData = () => {
    setParsedData(null);
    setFileName(null);
    setShowMatchCalculator(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Parser de Currículo com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              ${isLoading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            <input
              id="resume-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={handleFileInput}
              disabled={isLoading}
            />
            
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg font-medium">Processando currículo...</p>
                <p className="text-sm text-muted-foreground">Extraindo informações com IA</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">Arraste o currículo aqui</p>
                  <p className="text-sm text-muted-foreground">ou clique para selecionar (.txt, .pdf, .docx)</p>
                </div>
              </div>
            )}
          </div>

          {fileName && !isLoading && (
            <div className="mt-4 flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{fileName}</span>
              </div>
              {parsedData && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Processado
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Dados Extraídos
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearData}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="font-medium">{parsedData.nome || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{parsedData.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{parsedData.telefone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Resume */}
            {parsedData.resumo && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Resumo Profissional</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{parsedData.resumo}</p>
              </div>
            )}

            {/* Skills */}
            {parsedData.habilidades && parsedData.habilidades.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Habilidades ({parsedData.habilidades.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.habilidades.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.experiencias && parsedData.experiencias.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experiência Profissional ({parsedData.experiencias.length})
                </h4>
                <div className="space-y-3">
                  {parsedData.experiencias.map((exp, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium">{exp.cargo}</p>
                        <Badge variant="outline" className="text-xs">{exp.periodo}</Badge>
                      </div>
                      <p className="text-sm text-primary">{exp.empresa}</p>
                      {exp.descricao && (
                        <p className="text-sm text-muted-foreground mt-2">{exp.descricao}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.formacao && parsedData.formacao.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Formação Acadêmica ({parsedData.formacao.length})
                </h4>
                <div className="space-y-3">
                  {parsedData.formacao.map((edu, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1">
                Criar Candidato com estes dados
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMatchCalculator(!showMatchCalculator)}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                {showMatchCalculator ? 'Ocultar Match Score' : 'Calcular Match Score'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Score Calculator */}
      {parsedData && showMatchCalculator && (
        <MatchScoreCalculator candidatoData={parsedData} />
      )}
    </div>
  );
}
