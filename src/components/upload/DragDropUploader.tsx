import { useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile { file: File; id: string; progress: number; status: 'uploading' | 'complete' | 'error'; url?: string; error?: string; }
interface DragDropUploaderProps { onUpload: (files: File[]) => Promise<string[]>; accept?: string; maxFiles?: number; maxSizeMB?: number; className?: string; }

export function DragDropUploader({ onUpload, accept = '*', maxFiles = 10, maxSizeMB = 10, className }: DragDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length).filter(f => f.size <= maxSizeMB * 1024 * 1024);
    const uploadFiles: UploadedFile[] = newFiles.map(f => ({ file: f, id: crypto.randomUUID(), progress: 0, status: 'uploading' }));
    setFiles(prev => [...prev, ...uploadFiles]);

    try {
      const urls = await onUpload(newFiles);
      setFiles(prev => prev.map((f, i) => uploadFiles.find(uf => uf.id === f.id) ? { ...f, status: 'complete', progress: 100, url: urls[i] } : f));
    } catch (error) {
      setFiles(prev => prev.map(f => uploadFiles.find(uf => uf.id === f.id) ? { ...f, status: 'error', error: 'Upload failed' } : f));
    }
  }, [files.length, maxFiles, maxSizeMB, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) processFiles(e.target.files); };
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className={className}>
      <Card className={cn('border-2 border-dashed transition-colors cursor-pointer', isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50')}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className={cn('h-10 w-10 mb-4', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          <p className="text-sm font-medium mb-1">{isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}</p>
          <p className="text-xs text-muted-foreground">Máximo {maxFiles} arquivos, até {maxSizeMB}MB cada</p>
          <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handleChange} />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.file.name}</p>
                {f.status === 'uploading' && <Progress value={f.progress} className="h-1 mt-1" />}
              </div>
              {f.status === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {f.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DragDropUploader;
