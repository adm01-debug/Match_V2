import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
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
  disabled?: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

const ACCEPTED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
} as const;

export function ResumeUploader({
  onUpload,
  onParse,
  acceptedFormats = ['.pdf', '.docx', '.doc', '.txt'],
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
}: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track interval for cleanup
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejections
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      let errorMessage = 'Arquivo não aceito';
      
      if (rejection.errors[0]?.code === 'file-too-large') {
        errorMessage = `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`;
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        errorMessage = `Formato não aceito. Use: ${acceptedFormats.join(', ')}`;
      }
      
      setError(errorMessage);
      setStatus('error');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setStatus('uploading');
    setProgress(0);

    // Clear any existing interval
    clearProgressInterval();

    try {
      // Simulate upload progress
      progressIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          clearProgressInterval();
          return;
        }
        setProgress((prev) => {
          if (prev >= 90) {
            clearProgressInterval();
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(selectedFile);
      
      if (!isMountedRef.current) return;
      
      clearProgressInterval();
      setProgress(100);

      if (onParse) {
        setStatus('parsing');
        await onParse(selectedFile);
      }

      if (!isMountedRef.current) return;
      setStatus('success');
    } catch (err) {
      clearProgressInterval();
      if (!isMountedRef.current) return;
      
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      console.error('[ResumeUploader] Error:', err);
    }
  }, [onUpload, onParse, maxSize, acceptedFormats, clearProgressInterval]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize,
    multiple: false,
    disabled,
    noClick: false,
    noKeyboard: false,
  });

  const handleRemove = useCallback(() => {
    clearProgressInterval();
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, [clearProgressInterval]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  }, [open]);

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'parsing':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
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

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const isProcessing = status === 'uploading' || status === 'parsing';

  return (
    <div className={className}>
      {!file ? (
        <Card
          {...getRootProps()}
          className={`cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-dashed hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          aria-label="Área para upload de currículo"
          aria-describedby="upload-instructions"
        >
          <CardContent className="flex flex-col items-center justify-center py-10">
            <input {...getInputProps()} aria-label="Selecionar arquivo de currículo" />
            <Upload 
              className={`h-10 w-10 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} 
              aria-hidden="true"
            />
            <p className="text-lg font-medium mb-1">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um currículo ou clique para selecionar'}
            </p>
            <p id="upload-instructions" className="text-sm text-muted-foreground">
              Formatos aceitos: {acceptedFormats.join(', ')} (máx. {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card role="status" aria-live="polite">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              {getStatusIcon()}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" title={file.name}>{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {getStatusText()}
                </p>
                {isProcessing && (
                  <Progress 
                    value={progress} 
                    className="mt-2 h-1" 
                    aria-label={`Progresso: ${progress}%`}
                  />
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemove} 
                disabled={isProcessing}
                aria-label="Remover arquivo"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
