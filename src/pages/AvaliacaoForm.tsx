import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CompetenciaRating } from '@/components/avaliacao/CompetenciaRating';
import { NotaResumo } from '@/components/avaliacao/NotaResumo';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  User, 
  Briefcase,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  competenciasTecnicas, 
  competenciasComportamentais,
} from '@/data/avaliacaoData';
import { processos, candidatos, vagas } from '@/data/mockData';
import { NotaCompetencia } from '@/types/recruitment';
import { cn } from '@/lib/utils';

type Parecer = 'aprovar' | 'reprovar' | 'em_duvida';

export default function AvaliacaoForm() {
  const { processoId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const processo = processos.find(p => p.id === processoId);
  const candidato = candidatos.find(c => c.id === processo?.candidatoId);
  const vaga = vagas.find(v => v.id === processo?.vagaId);

  // State for ratings
  const [notasTecnicas, setNotasTecnicas] = useState<Record<string, NotaCompetencia>>(
    competenciasTecnicas.reduce((acc, comp) => ({
      ...acc,
      [comp.id]: { competenciaId: comp.id, nota: 0 as any, observacao: '' }
    }), {})
  );

  const [notasComportamentais, setNotasComportamentais] = useState<Record<string, NotaCompetencia>>(
    competenciasComportamentais.reduce((acc, comp) => ({
      ...acc,
      [comp.id]: { competenciaId: comp.id, nota: 0 as any, observacao: '' }
    }), {})
  );

  const [pontosFortes, setPontosFortes] = useState('');
  const [pontosDesenvolvimento, setPontosDesenvolvimento] = useState('');
  const [parecer, setParecer] = useState<Parecer | ''>('');
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [recomendacao, setRecomendacao] = useState('');

  // Calculate averages
  const mediaTecnica = useMemo(() => {
    const notas = Object.values(notasTecnicas).filter(n => n.nota > 0);
    if (notas.length === 0) return 0;
    return notas.reduce((sum, n) => sum + n.nota, 0) / notas.length;
  }, [notasTecnicas]);

  const mediaComportamental = useMemo(() => {
    const notas = Object.values(notasComportamentais).filter(n => n.nota > 0);
    if (notas.length === 0) return 0;
    return notas.reduce((sum, n) => sum + n.nota, 0) / notas.length;
  }, [notasComportamentais]);

  const mediaGeral = useMemo(() => {
    if (mediaTecnica === 0 && mediaComportamental === 0) return 0;
    if (mediaTecnica === 0) return mediaComportamental;
    if (mediaComportamental === 0) return mediaTecnica;
    return (mediaTecnica + mediaComportamental) / 2;
  }, [mediaTecnica, mediaComportamental]);

  const handleNotaTecnicaChange = (competenciaId: string, nota: number) => {
    setNotasTecnicas(prev => ({
      ...prev,
      [competenciaId]: { ...prev[competenciaId], nota: nota as any }
    }));
  };

  const handleObservacaoTecnicaChange = (competenciaId: string, observacao: string) => {
    setNotasTecnicas(prev => ({
      ...prev,
      [competenciaId]: { ...prev[competenciaId], observacao }
    }));
  };

  const handleNotaComportamentalChange = (competenciaId: string, nota: number) => {
    setNotasComportamentais(prev => ({
      ...prev,
      [competenciaId]: { ...prev[competenciaId], nota: nota as any }
    }));
  };

  const handleObservacaoComportamentalChange = (competenciaId: string, observacao: string) => {
    setNotasComportamentais(prev => ({
      ...prev,
      [competenciaId]: { ...prev[competenciaId], observacao }
    }));
  };

  const handleSalvarRascunho = () => {
    toast({
      title: 'Rascunho salvo',
      description: 'A avaliação foi salva como rascunho.',
    });
  };

  const handleEnviarAvaliacao = () => {
    // Validate
    const notasTecnicasPreenchidas = Object.values(notasTecnicas).filter(n => n.nota > 0).length;
    const notasComportamentaisPreenchidas = Object.values(notasComportamentais).filter(n => n.nota > 0).length;

    if (notasTecnicasPreenchidas < competenciasTecnicas.length) {
      toast({
        title: 'Avaliação incompleta',
        description: 'Preencha todas as notas técnicas.',
        variant: 'destructive',
      });
      return;
    }

    if (notasComportamentaisPreenchidas < competenciasComportamentais.length) {
      toast({
        title: 'Avaliação incompleta',
        description: 'Preencha todas as notas comportamentais.',
        variant: 'destructive',
      });
      return;
    }

    if (!parecer) {
      toast({
        title: 'Parecer obrigatório',
        description: 'Selecione um parecer para o candidato.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Avaliação enviada',
      description: 'A avaliação foi registrada com sucesso!',
    });

    navigate('/pipeline');
  };

  if (!processo || !candidato || !vaga) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">Processo não encontrado</p>
          <Button variant="link" onClick={() => navigate('/pipeline')}>
            Voltar ao Pipeline
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Formulário de Avaliação</h1>
            <p className="text-muted-foreground">Avalie o candidato nas competências técnicas e comportamentais</p>
          </div>
        </div>

        {/* Candidate Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Candidato</p>
                  <p className="font-semibold text-lg">{candidato.nome}</p>
                  <p className="text-sm text-muted-foreground">{candidato.cargoAtual || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vaga</p>
                  <p className="font-semibold">{vaga.titulo}</p>
                  <p className="text-sm text-muted-foreground">{vaga.departamento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Etapa Atual</p>
                  <Badge variant="outline" className="mt-1">
                    {processo.etapaAtual.replace(/_/g, ' ')}
                  </Badge>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Match:</span>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      {processo.matchScore}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary - Sticky */}
        <div className="sticky top-4 z-10">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <NotaResumo titulo="Técnica" nota={mediaTecnica} tipo="tecnica" />
                <NotaResumo titulo="Comportamental" nota={mediaComportamental} tipo="comportamental" />
                <NotaResumo titulo="Média Geral" nota={mediaGeral} tipo="geral" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Competencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              Competências Técnicas
            </CardTitle>
            <CardDescription>
              Avalie o candidato nas competências técnicas necessárias para a função
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {competenciasTecnicas.map(comp => (
              <CompetenciaRating
                key={comp.id}
                competencia={comp}
                nota={notasTecnicas[comp.id]?.nota || 0}
                observacao={notasTecnicas[comp.id]?.observacao}
                onNotaChange={(nota) => handleNotaTecnicaChange(comp.id, nota)}
                onObservacaoChange={(obs) => handleObservacaoTecnicaChange(comp.id, obs)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Behavioral Competencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              Competências Comportamentais
            </CardTitle>
            <CardDescription>
              Avalie o candidato nas competências comportamentais e soft skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {competenciasComportamentais.map(comp => (
              <CompetenciaRating
                key={comp.id}
                competencia={comp}
                nota={notasComportamentais[comp.id]?.nota || 0}
                observacao={notasComportamentais[comp.id]?.observacao}
                onNotaChange={(nota) => handleNotaComportamentalChange(comp.id, nota)}
                onObservacaoChange={(obs) => handleObservacaoComportamentalChange(comp.id, obs)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Qualitative Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Feedback Qualitativo
            </CardTitle>
            <CardDescription>
              Descreva os pontos fortes e áreas de desenvolvimento do candidato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pontos-fortes">Pontos Fortes</Label>
              <Textarea
                id="pontos-fortes"
                placeholder="Descreva os principais pontos fortes observados no candidato..."
                value={pontosFortes}
                onChange={(e) => setPontosFortes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pontos-desenvolvimento">Pontos de Desenvolvimento</Label>
              <Textarea
                id="pontos-desenvolvimento"
                placeholder="Descreva as áreas que o candidato precisa desenvolver..."
                value={pontosDesenvolvimento}
                onChange={(e) => setPontosDesenvolvimento(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                placeholder="Outras observações relevantes sobre o candidato..."
                value={observacoesGerais}
                onChange={(e) => setObservacoesGerais(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parecer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Parecer Final
            </CardTitle>
            <CardDescription>
              Indique sua decisão sobre o candidato para esta etapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={parecer}
              onValueChange={(value) => setParecer(value as Parecer)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="aprovar"
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all',
                  parecer === 'aprovar'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-green-500/50'
                )}
              >
                <RadioGroupItem value="aprovar" id="aprovar" className="sr-only" />
                <CheckCircle className={cn(
                  'h-10 w-10',
                  parecer === 'aprovar' ? 'text-green-500' : 'text-muted-foreground'
                )} />
                <span className="font-semibold">Aprovar</span>
                <span className="text-sm text-muted-foreground text-center">
                  Avançar para próxima etapa
                </span>
              </Label>

              <Label
                htmlFor="em_duvida"
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all',
                  parecer === 'em_duvida'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-border hover:border-yellow-500/50'
                )}
              >
                <RadioGroupItem value="em_duvida" id="em_duvida" className="sr-only" />
                <HelpCircle className={cn(
                  'h-10 w-10',
                  parecer === 'em_duvida' ? 'text-yellow-500' : 'text-muted-foreground'
                )} />
                <span className="font-semibold">Em Dúvida</span>
                <span className="text-sm text-muted-foreground text-center">
                  Precisa de mais avaliações
                </span>
              </Label>

              <Label
                htmlFor="reprovar"
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all',
                  parecer === 'reprovar'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-border hover:border-red-500/50'
                )}
              >
                <RadioGroupItem value="reprovar" id="reprovar" className="sr-only" />
                <XCircle className={cn(
                  'h-10 w-10',
                  parecer === 'reprovar' ? 'text-red-500' : 'text-muted-foreground'
                )} />
                <span className="font-semibold">Reprovar</span>
                <span className="text-sm text-muted-foreground text-center">
                  Não prosseguir no processo
                </span>
              </Label>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="recomendacao">Recomendação / Justificativa</Label>
              <Textarea
                id="recomendacao"
                placeholder="Justifique seu parecer e faça recomendações para a próxima etapa..."
                value={recomendacao}
                onChange={(e) => setRecomendacao(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSalvarRascunho}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={handleEnviarAvaliacao}>
              <Send className="h-4 w-4 mr-2" />
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
