import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeUploaderProps {
  onUpload: (file: File) => Promise<void>;
  onParse?: (file: File) => Promise<unknown>;
  acceptedFormats?: string[];
  maxSize?: number;
  className?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

export function ResumeUploader({
  onUpload,
  onParse,
  acceptedFormats = ['.pdf', '.docx', '.doc', '.txt'],
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setStatus('uploading');
    setProgress(0);

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);

      if (onParse) {
        setStatus('parsing');
        await onParse(selectedFile);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
    }
  }, [onUpload, onParse]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'parsing':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Enviando arquivo...';
      case 'parsing':
        return 'Processando com IA...';
      case 'success':
        return 'Processado com sucesso!';
      case 'error':
        return error || 'Erro ao processar';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      {!file ? (
        <Card
          {...getRootProps()}
          className={`cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary/50'
          }`}
        >
          <CardContent className="flex flex-col items-center justify-center py-10">
            <input {...getInputProps()} />
            <Upload className={`h-10 w-10 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-lg font-medium mb-1">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um currículo ou clique para selecionar'}
            </p>
            <p className="text-sm text-muted-foreground">
              Formatos aceitos: {acceptedFormats.join(', ')} (máx. {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              {getStatusIcon()}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {getStatusText()}
                </p>
                {(status === 'uploading' || status === 'parsing') && (
                  <Progress value={progress} className="mt-2 h-1" />
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemove} disabled={status === 'uploading' || status === 'parsing'}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
