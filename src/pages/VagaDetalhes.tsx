import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useVaga, useUpdateVaga } from "@/hooks/useVagas";
import { useProcessosSeletivos } from "@/hooks/useProcessosSeletivos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Send, MapPin, AlertCircle, Star, Building, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VagaStatsCards } from '@/components/vaga-detalhes/VagaStatsCards';
import { VagaDetalhesTab } from '@/components/vaga-detalhes/VagaDetalhesTab';

const statusStyles: Record<string, { bg: string; text: string }> = {
  rascunho: { bg: "bg-muted", text: "text-foreground" },
  publicada: { bg: "bg-success", text: "text-success" },
  em_selecao: { bg: "bg-info", text: "text-info" },
  pausada: { bg: "bg-warning", text: "text-warning" },
  encerrada: { bg: "bg-destructive", text: "text-destructive" },
};

const prioridadeStyles: Record<string, string> = {
  urgente: "bg-destructive", alta: "bg-warning", media: "bg-warning", baixa: "bg-success",
};

export default function VagaDetalhes() {
  usePageTitle('Detalhes da Vaga');
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const { data: vaga, isLoading: loadingVaga } = useVaga(id || '');
  const updateVagaMutation = useUpdateVaga();
  const { data: processos = [], isLoading: loadingProcessos } = useProcessosSeletivos();

  const stats = useMemo(() => ({
    total: processos.length,
    emTriagem: processos.filter(p => p.etapaAtual === 'em_triagem').length,
    emEntrevista: processos.filter(p => ['entrevista_rh', 'entrevista_gestor', 'entrevista_final'].includes(p.etapaAtual)).length,
    aprovados: processos.filter(p => p.status === 'aprovado' || p.status === 'contratado').length,
    reprovados: processos.filter(p => p.status === 'reprovado').length,
  }), [processos]);

  if (loadingVaga || loadingProcessos) return <Layout title="Carregando"><div className="p-6 space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div></Layout>;
  if (!vaga) return <Layout title="Erro"><div className="p-6 text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4" /><p>Vaga não encontrada</p><Button onClick={() => navigate("/vagas")} className="mt-4">Voltar</Button></div></Layout>;

  const status = statusStyles[vaga.status] || statusStyles['rascunho'];

  return (
    <Layout title={vaga.titulo}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vagas")}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <div className="flex items-center gap-2 mb-2"><Badge className={cn(status?.bg, status?.text)}>{vaga.status}</Badge><Badge className={prioridadeStyles[vaga.prioridade]}>{vaga.prioridade}</Badge></div>
              <h1 className="text-2xl font-bold">{vaga.titulo}</h1>
              <div className="flex items-center gap-4 text-muted-foreground"><span className="flex items-center gap-1"><Building className="h-4 w-4" />{vaga.departamento}</span>{vaga.cidade && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{vaga.cidade}</span>}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/vagas/${id}/ranking`)}><Sparkles className="h-4 w-4 mr-2" />Ranking IA</Button>
            <Button variant="outline" onClick={() => navigate(`/vagas/${id}/editar`)}><Edit className="h-4 w-4 mr-2" />Editar</Button>
            {vaga.status === 'rascunho' && <Button onClick={() => updateVagaMutation.mutate({ id: id!, status: 'publicada' })}><Send className="h-4 w-4 mr-2" />Publicar</Button>}
          </div>
        </div>

        <VagaStatsCards stats={stats} quantidade={vaga.quantidade} />

        <Card><CardContent className="pt-4"><div className="flex justify-between mb-2"><span className="text-sm font-medium">Progresso</span><span>{stats.aprovados}/{vaga.quantidade}</span></div><Progress value={(stats.aprovados / vaga.quantidade) * 100} /></CardContent></Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList><TabsTrigger value="detalhes">Detalhes</TabsTrigger><TabsTrigger value="candidatos">Candidatos</TabsTrigger><TabsTrigger value="requisitos">Requisitos</TabsTrigger></TabsList>
          <TabsContent value="detalhes" className="mt-4"><VagaDetalhesTab vaga={vaga} /></TabsContent>
          <TabsContent value="candidatos" className="mt-4">
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Inscritos</CardTitle><Button variant="outline" onClick={() => navigate(`/pipeline?vaga=${id}`)}><ExternalLink className="h-4 w-4 mr-2" />Pipeline</Button></CardHeader>
            <CardContent>{processos.length === 0 ? <p className="text-center py-8">Nenhum candidato</p> : <div className="space-y-3">{processos.slice(0, 10).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer" onClick={() => navigate(`/candidato/${p.candidatoId}`)}>
                <div className="flex items-center gap-3"><Avatar><AvatarImage src={p.candidatoFoto} /><AvatarFallback>{p.candidatoNome?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{p.candidatoNome}</p></div></div>
                <div className="flex items-center gap-4">{p.matchScore && <div className="flex items-center gap-1"><Star className="h-4 w-4 text-warning" /><span>{p.matchScore}%</span></div>}<Badge variant="outline">{p.etapaAtual}</Badge></div>
              </div>
            ))}</div>}</CardContent></Card>
          </TabsContent>
          <TabsContent value="requisitos" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Obrigatórios</CardTitle></CardHeader><CardContent><p className="text-sm whitespace-pre-line">{vaga.requisitosObrigatorios || 'N/A'}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Desejáveis</CardTitle></CardHeader><CardContent><p className="text-sm whitespace-pre-line">{vaga.requisitosDesejaveis || 'N/A'}</p></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
