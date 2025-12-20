import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, FileText, X, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface CurriculoUploadProps {
  curriculoUrl?: string | null;
  curriculoNome?: string | null;
  onUploadComplete?: () => void;
}

const CurriculoUpload: React.FC<CurriculoUploadProps> = ({ 
  curriculoUrl, 
  curriculoNome,
  onUploadComplete 
}) => {
  const { user, profile } = useCandidatoAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id || !profile?.id) throw new Error('Usuário não autenticado');
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use PDF ou Word.');
      }
      
      // Validate file size
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Máximo 10MB.');
      }
      
      setUploading(true);
      setUploadProgress(0);
      
      // Create file path with user ID as folder
      const fileExt = file.name.split('.').pop();
      const fileName = `curriculo.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('curriculos')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) throw uploadError;
      
      setUploadProgress(70);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('curriculos')
        .getPublicUrl(filePath);
      
      // Update profile with CV info
      const { error: updateError } = await supabase
        .from('candidatos_auth')
        .update({ 
          curriculo_url: filePath,
          curriculo_nome: file.name
        })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
      
      setUploadProgress(100);
      
      return { path: filePath, name: file.name };
    },
    onSuccess: () => {
      toast.success('Currículo enviado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['candidato-profile'] });
      setUploading(false);
      setUploadProgress(0);
      onUploadComplete?.();
    },
    onError: (error: any) => {
      toast.error('Erro ao enviar currículo', { description: error.message });
      setUploading(false);
      setUploadProgress(0);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !profile?.id || !curriculoUrl) return;
      
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('curriculos')
        .remove([curriculoUrl]);
      
      if (deleteError) throw deleteError;
      
      // Update profile
      const { error: updateError } = await supabase
        .from('candidatos_auth')
        .update({ 
          curriculo_url: null,
          curriculo_nome: null
        })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success('Currículo removido!');
      queryClient.invalidateQueries({ queryKey: ['candidato-profile'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao remover currículo', { description: error.message });
    }
  });

  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDownload = async () => {
    if (!curriculoUrl) return;
    
    const { data, error } = await supabase.storage
      .from('curriculos')
      .download(curriculoUrl);
    
    if (error) {
      toast.error('Erro ao baixar currículo');
      return;
    }
    
    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = curriculoNome || 'curriculo.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName?.endsWith('.pdf')) return '📄';
    if (fileName?.endsWith('.doc') || fileName?.endsWith('.docx')) return '📝';
    return '📎';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Currículo
        </CardTitle>
        <CardDescription>
          Envie seu currículo em PDF ou Word (máx. 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {curriculoUrl && curriculoNome ? (
          <div className="space-y-4">
            {/* Current CV */}
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-2xl">{getFileIcon(curriculoNome)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{curriculoNome}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  Currículo enviado
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleDownload}
                  title="Baixar"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  title="Remover"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Replace option */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Substituir Currículo
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <Upload className="h-12 w-12 mx-auto text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Enviando currículo...</p>
                  <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                  Arraste seu currículo aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF ou Word • Máximo 10MB
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleInputChange}
        />
      </CardContent>
    </Card>
  );
};

export default CurriculoUpload;
