import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Target, ArrowRight, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MatchScoreCard } from './MatchScoreCard';
import { vagas } from '@/data/mockData';

interface ParsedResume {
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

interface MatchResult {
  scoreTotal: number;
  scoreHabilidades: number;
  scoreExperiencia: number;
  scoreFormacao: number;
  habilidadesMatch: string[];
  habilidadesFaltantes: string[];
  habilidadesExtras: string[];
  analise: string;
  recomendacao: 'forte' | 'moderado' | 'fraco' | 'nao_recomendado';
  pontosFortes: string[];
  pontosAtencao: string[];
}

interface MatchScoreCalculatorProps {
  candidatoData: ParsedResume;
  candidatoId?: string;
  onMatchSaved?: () => void;
}

export function MatchScoreCalculator({ candidatoData, candidatoId, onMatchSaved }: MatchScoreCalculatorProps) {
  const { toast } = useToast();
  const [selectedVagaId, setSelectedVagaId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const vagasAbertas = vagas.filter(v => v.status === 'publicada' || v.status === 'aprovada');
  const selectedVaga = vagas.find(v => v.id === selectedVagaId);

  const calculateMatch = async () => {
    if (!selectedVaga) {
      toast({
        title: "Selecione uma vaga",
        description: "Escolha uma vaga para calcular a compatibilidade.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMatchResult(null);

    try {
      const parseRequisitos = (texto: string): string[] => {
        return texto
          .split(/[,;\n]/)
          .map(r => r.trim())
          .filter(r => r.length > 0);
      };

      const vagaRequisitos = {
        titulo: selectedVaga.titulo,
        departamento: selectedVaga.departamento,
        nivel: 'pleno',
        habilidadesObrigatorias: [
          ...parseRequisitos(selectedVaga.requisitosObrigatorios),
          ...selectedVaga.skillsAvaliacao
        ],
        habilidadesDesejaveis: parseRequisitos(selectedVaga.requisitosDesejaveis),
        experienciaMinima: 2,
        formacaoMinima: 'Superior completo',
        descricao: selectedVaga.responsabilidades,
      };

      const { data, error } = await supabase.functions.invoke('match-score', {
        body: { 
          vaga: vagaRequisitos, 
          candidato: candidatoData 
        },
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'Erro ao calcular match score');

      setMatchResult(data.data);

      toast({
        title: "Match Score Calculado!",
        description: `Compatibilidade: ${data.data.scoreTotal}% - ${data.data.recomendacao}`,
      });
    } catch (error) {
      console.error('Error calculating match:', error);
      toast({
        title: "Erro ao calcular",
        description: error instanceof Error ? error.message : "Não foi possível calcular o match score.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMatchScore = async () => {
    if (!matchResult || !selectedVaga || !candidatoId) {
      toast({
        title: "Erro",
        description: "Dados incompletos para salvar o match score.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from('match_scores').insert({
        candidato_id: candidatoId,
        vaga_id: selectedVaga.id,
        vaga_titulo: selectedVaga.titulo,
        score_total: matchResult.scoreTotal,
        score_habilidades: matchResult.scoreHabilidades,
        score_experiencia: matchResult.scoreExperiencia,
        score_formacao: matchResult.scoreFormacao,
        habilidades_match: matchResult.habilidadesMatch,
        habilidades_faltantes: matchResult.habilidadesFaltantes,
        habilidades_extras: matchResult.habilidadesExtras,
        analise: matchResult.analise,
        recomendacao: matchResult.recomendacao,
        pontos_fortes: matchResult.pontosFortes,
        pontos_atencao: matchResult.pontosAtencao,
      });

      if (error) throw error;

      toast({
        title: "Match Score salvo!",
        description: `Score de ${matchResult.scoreTotal}% para ${selectedVaga.titulo} foi salvo.`,
      });

      onMatchSaved?.();
    } catch (error) {
      console.error('Error saving match score:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o match score.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Calcular Match Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Candidato</label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{candidatoData.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {candidatoData.habilidades.length} habilidades • {candidatoData.experiencias.length} experiências
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Vaga</label>
              <Select value={selectedVagaId} onValueChange={setSelectedVagaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma vaga..." />
                </SelectTrigger>
                <SelectContent>
                  {vagasAbertas.map((vaga) => (
                    <SelectItem key={vaga.id} value={vaga.id}>
                      {vaga.titulo} - {vaga.departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateMatch} 
              disabled={!selectedVagaId || isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Calcular Match
                </>
              )}
            </Button>
          </div>

          {selectedVaga && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">{selectedVaga.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedVaga.departamento} • {selectedVaga.cidade}/{selectedVaga.estado} • {selectedVaga.modalidade}
              </p>
              {selectedVaga.skillsAvaliacao && selectedVaga.skillsAvaliacao.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Skills: {selectedVaga.skillsAvaliacao.slice(0, 3).join(', ')}
                  {selectedVaga.skillsAvaliacao.length > 3 && '...'}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {matchResult && selectedVaga && (
        <>
          <MatchScoreCard
            matchResult={matchResult}
            candidatoNome={candidatoData.nome}
            vagaTitulo={selectedVaga.titulo}
          />
          
          {candidatoId && (
            <div className="flex justify-end">
              <Button onClick={saveMatchScore} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Match Score
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
