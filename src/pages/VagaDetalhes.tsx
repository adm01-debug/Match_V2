import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useVaga } from "@/hooks/useVagas";
import { useUpdateVaga } from "@/hooks/useVagas";
import { useProcessosSeletivos } from "@/hooks/useProcessosSeletivos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Send,
  Pause,
  XCircle,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Star,
  Building,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, { bg: string; text: string }> = {
  rascunho: { bg: "bg-gray-100", text: "text-gray-700" },
  publicada: { bg: "bg-green-100", text: "text-green-700" },
  em_selecao: { bg: "bg-blue-100", text: "text-blue-700" },
  pausada: { bg: "bg-amber-100", text: "text-amber-700" },
  encerrada: { bg: "bg-red-100", text: "text-red-700" },
};

const prioridadeStyles: Record<string, string> = {
  urgente: "bg-red-500",
  alta: "bg-orange-500",
  media: "bg-yellow-500",
  baixa: "bg-green-500",
};

export default function VagaDetalhes() {
  usePageTitle('Detalhes da Vaga');
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");

  const { data: vaga, isLoading: loadingVaga } = useVaga(id || '');
  const updateVagaMutation = useUpdateVaga();
  const { data: processos = [], isLoading: loadingProcessos } = useProcessosSeletivos();

  const loading = loadingVaga || loadingProcessos;

  // Estatísticas dos candidatos
  const stats = {
    total: processos.length,
    emTriagem: processos.filter(p => p.etapaAtual === 'em_triagem').length,
    emEntrevista: processos.filter(p => ['entrevista_rh', 'entrevista_gestor', 'entrevista_final'].includes(p.etapaAtual)).length,
    aprovados: processos.filter(p => p.status === 'aprovado' || p.status === 'contratado').length,
    reprovados: processos.filter(p => p.status === 'reprovado').length,
  };

  const handlePublicar = async () => {
    if (id) await updateVagaMutation.mutateAsync({ id, status: 'publicada' });
  };

  const handlePausar = async () => {
    if (id) await updateVagaMutation.mutateAsync({ id, status: 'pausada' });
  };

  const handleEncerrar = async () => {
    if (id && confirm('Deseja encerrar esta vaga?')) {
      await updateVagaMutation.mutateAsync({ id, status: 'encerrada' });
    }
  };

  if (loading) {
    return (
      <Layout title="Detalhes da Vaga">
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (!vaga) {
    return (
      <Layout title="Vaga não encontrada">
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>Vaga não encontrada</p>
          <Button onClick={() => navigate("/vagas")} className="mt-4">
            Voltar para Vagas
          </Button>
        </div>
      </Layout>
    );
  }

  const status = statusStyles[vaga.status] || statusStyles['rascunho'];

  return (
    <Layout title={vaga.titulo}>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vagas")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn(status?.bg, status?.text, "border-0")}>
                  {vaga.status.replace('_', ' ')}
                </Badge>
                <Badge className={cn(prioridadeStyles[vaga.prioridade], "text-white")}>
                  {vaga.prioridade}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">{vaga.titulo}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {vaga.departamento}
                </span>
                {vaga.cidade && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {vaga.cidade}{vaga.estado && `, ${vaga.estado}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/vagas/${id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            {vaga.status === 'rascunho' && (
              <Button onClick={handlePublicar}>
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            )}
            {vaga.status === 'publicada' && (
              <Button variant="outline" onClick={handlePausar}>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
            )}
            {['publicada', 'pausada', 'em_selecao'].includes(vaga.status) && (
              <Button variant="destructive" onClick={handleEncerrar}>
                <XCircle className="h-4 w-4 mr-2" />
                Encerrar
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Candidatos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.emTriagem}</p>
                  <p className="text-xs text-muted-foreground">Em Triagem</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.emEntrevista}</p>
                  <p className="text-xs text-muted-foreground">Em Entrevista</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.aprovados}</p>
                  <p className="text-xs text-muted-foreground">Aprovados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold">{vaga.quantidade}</p>
                  <p className="text-xs text-muted-foreground">Vagas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso de Contratação</span>
              <span className="text-sm text-muted-foreground">
                {stats.aprovados} de {vaga.quantidade} vagas preenchidas
              </span>
            </div>
            <Progress value={(stats.aprovados / vaga.quantidade) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="candidatos">Candidatos ({stats.total})</TabsTrigger>
            <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Modalidade</p>
                      <p className="font-medium capitalize">{vaga.modalidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                      <p className="font-medium uppercase">{vaga.tipoContrato}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{vaga.quantidade} vaga(s)</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Remuneração
                    </p>
                    <p className="font-medium">
                      {vaga.salarioACombinar
                        ? 'A combinar'
                        : vaga.salarioMin && vaga.salarioMax
                          ? `R$ ${vaga.salarioMin.toLocaleString()} - R$ ${vaga.salarioMax.toLocaleString()}`
                          : 'Não informado'}
                    </p>
                  </div>
                  {vaga.beneficios && vaga.beneficios.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Benefícios</p>
                        <div className="flex flex-wrap gap-1">
                          {vaga.beneficios.map((b, i) => (
                            <Badge key={i} variant="secondary">{b}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vaga.descricaoEmpresa && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sobre a Empresa</p>
                      <p className="text-sm whitespace-pre-line">{vaga.descricaoEmpresa}</p>
                    </div>
                  )}
                  {vaga.responsabilidades && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Responsabilidades</p>
                      <p className="text-sm whitespace-pre-line">{vaga.responsabilidades}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidatos" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Candidatos Inscritos</CardTitle>
                <Button variant="outline" onClick={() => navigate(`/pipeline?vaga=${id}`)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Pipeline
                </Button>
              </CardHeader>
              <CardContent>
                {processos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum candidato inscrito ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {processos.slice(0, 10).map((processo) => (
                      <div
                        key={processo.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => navigate(`/candidato/${processo.candidatoId}`)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={processo.candidatoFoto} />
                            <AvatarFallback>
                              {processo.candidatoNome?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{processo.candidatoNome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {processo.matchScore && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-500" />
                              <span className="font-medium">{processo.matchScore}%</span>
                            </div>
                          )}
                          <Badge variant="outline">
                            {processo.etapaAtual.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {processos.length > 10 && (
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/pipeline?vaga=${id}`)}>
                        Ver todos os {processos.length} candidatos
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requisitos" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos Obrigatórios</CardTitle>
                </CardHeader>
                <CardContent>
                  {vaga.requisitosObrigatorios ? (
                    <p className="text-sm whitespace-pre-line">{vaga.requisitosObrigatorios}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Não especificados</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requisitos Desejáveis</CardTitle>
                </CardHeader>
                <CardContent>
                  {vaga.requisitosDesejaveis ? (
                    <p className="text-sm whitespace-pre-line">{vaga.requisitosDesejaveis}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Não especificados</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
