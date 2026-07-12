import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ParsedResume } from './types';

interface UseResumeParserOptions {
  onParsed?: (data: ParsedResume) => void;
  onCandidatoSaved?: (candidatoId: string) => void;
}

export function useResumeParser({ onParsed, onCandidatoSaved }: UseResumeParserOptions = {}) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showMatchCalculator, setShowMatchCalculator] = useState(false);
  const [savedCandidatoId, setSavedCandidatoId] = useState<string | null>(null);

  const extractTextFromFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });

  const parseResume = useCallback(async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    setParsedData(null);
    setShowMatchCalculator(false);
    setSavedCandidatoId(null);

    try {
      const fileContent = await extractTextFromFile(file);

      if (!fileContent || fileContent.trim().length < 50) {
        toast({
          title: 'Arquivo inválido',
          description: 'O arquivo parece estar vazio ou não contém texto suficiente.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { fileContent, fileName: file.name },
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'Erro ao processar currículo');

      setParsedData(data.data);
      onParsed?.(data.data);

      toast({
        title: 'Currículo processado!',
        description: `Dados de ${data.data.nome || 'candidato'} extraídos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao processar',
        description: error instanceof Error ? error.message : 'Não foi possível processar o currículo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [onParsed, toast]);

  const saveCandidato = useCallback(async () => {
    if (!parsedData) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.rpc('create_candidato_with_details', {
        p_nome: parsedData.nome,
        p_email: parsedData.email,
        p_telefone: parsedData.telefone,
        p_resumo: parsedData.resumo,
        p_habilidades: parsedData.habilidades,
        p_experiencias: parsedData.experiencias,
        p_formacao: parsedData.formacao,
        p_arquivo_curriculo: fileName || undefined,
        p_fonte: 'parser_curriculo',
        p_status: 'novo',
      });
      if (error) throw error;
      setSavedCandidatoId(data.id);
      onCandidatoSaved?.(data.id);
      toast({
        title: 'Candidato salvo!',
        description: `${parsedData.nome} foi adicionado ao banco de dados.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o candidato.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [parsedData, fileName, onCandidatoSaved, toast]);

  const validateAndParse = useCallback((file: File) => {
    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (validTypes.includes(file.type) || file.name.endsWith('.txt')) {
      parseResume(file);
    } else {
      toast({
        title: 'Formato não suportado',
        description: 'Use arquivos .txt, .pdf ou .docx',
        variant: 'destructive',
      });
    }
  }, [parseResume, toast]);

  const clearData = useCallback(() => {
    setParsedData(null);
    setFileName(null);
    setShowMatchCalculator(false);
    setSavedCandidatoId(null);
  }, []);

  return {
    isDragging,
    setIsDragging,
    isLoading,
    isSaving,
    parsedData,
    fileName,
    showMatchCalculator,
    setShowMatchCalculator,
    savedCandidatoId,
    validateAndParse,
    saveCandidato,
    clearData,
  };
}
