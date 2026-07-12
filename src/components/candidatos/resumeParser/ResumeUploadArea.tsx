import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileText, Loader2, Save, Sparkles, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeUploadAreaProps {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  isLoading: boolean;
  fileName: string | null;
  hasParsedData: boolean;
  savedCandidatoId: string | null;
  onFile: (file: File) => void;
}

export const ResumeUploadArea = memo(function ResumeUploadArea({
  isDragging,
  setIsDragging,
  isLoading,
  fileName,
  hasParsedData,
  savedCandidatoId,
  onFile,
}: ResumeUploadAreaProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile, setIsDragging]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <Card role="article" aria-label="Parser currículo">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Parser de Currículo com IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            isLoading && 'pointer-events-none opacity-50',
          )}
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
            <div className="flex items-center gap-2">
              {savedCandidatoId && (
                <Badge className="bg-primary text-primary-foreground">
                  <Save className="h-3 w-3 mr-1" />
                  Salvo no BD
                </Badge>
              )}
              {hasParsedData && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Processado
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
