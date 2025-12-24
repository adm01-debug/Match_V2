import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCandidatoPerfil } from "@/hooks/useCandidatoPerfil";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Calendar,
  Star,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  Building,
  Download,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  ativo: { bg: "bg-green-100", text: "text-green-700", label: "Ativo" },
  em_processo: { bg: "bg-blue-100", text: "text-blue-700", label: "Em Processo" },
  contratado: { bg: "bg-purple-100", text: "text-purple-700", label: "Contratado" },
  desistente: { bg: "bg-amber-100", text: "text-amber-700", label: "Desistente" },
  blacklist: { bg: "bg-red-100", text: "text-red-700", label: "Blacklist" },
  banco_talentos: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Banco de Talentos" },
};

export default function CandidatoPerfilPage() {
  usePageTitle('Perfil do Candidato');

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");

  const {
    candidato,
    loading,
    estatisticas,
    adicionarAoBancoTalentos,
    removerDoBancoTalentos,
  } = useCandidatoPerfil(id);

  if (loading) {
    return (
      <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout title="Perfil do Candidato">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (!candidato) {
    return (
      <Layout title="Candidato não encontrado">
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>Candidato não encontrado</p>
          <Button onClick={() => navigate("/candidatos")} className="mt-4">
            Voltar para Candidatos
          </Button>
        </div>
      </Layout>
    );
  }

  const status = statusStyles[candidato.status] || statusStyles.ativo;

  return (
    <Layout title={candidato.nome}>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/candidatos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-20 w-20">
              <AvatarImage src={candidato.foto_url || undefined} />
              <AvatarFallback className="text-2xl">{candidato.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{candidato.nome}</h1>
                <Badge className={cn(status.bg, status.text, "border-0")}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">{candidato.cargo_atual || "Cargo não informado"}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {candidato.cidade && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidato.cidade}{candidato.estado && `, ${candidato.estado}`}
                  </span>
                )}
                {candidato.experiencia_anos > 0 && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {candidato.experiencia_anos} anos exp.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/candidatos/${id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            {candidato.status !== 'banco_talentos' ? (
              <Button variant="outline" onClick={adicionarAoBancoTalentos}>
                <Star className="h-4 w-4 mr-2" />
                Banco de Talentos
              </Button>
            ) : (
              <Button variant="outline" onClick={removerDoBancoTalentos}>
                <XCircle className="h-4 w-4 mr-2" />
                Remover do Banco
              </Button>
            )}
            {candidato.curriculo_url && (
              <Button asChild>
                <a href={candidato.curriculo_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  CV
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {estatisticas && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.totalProcessos}</p>
                    <p className="text-xs text-muted-foreground">Processos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.totalEntrevistas}</p>
                    <p className="text-xs text-muted-foreground">Entrevistas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.aprovacoes}</p>
                    <p className="text-xs text-muted-foreground">Aprovações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {estatisticas.mediaMatchScore ? `${Math.round(estatisticas.mediaMatchScore)}%` : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">Match Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {estatisticas.melhorMatchScore ? `${estatisticas.melhorMatchScore}%` : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">Melhor Match</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contato Rápido */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4">
              <a href={`mailto:${candidato.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
                <Mail className="h-4 w-4" />
                {candidato.email}
              </a>
              {candidato.telefone && (
                <a href={`tel:${candidato.telefone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                  <Phone className="h-4 w-4" />
                  {candidato.telefone}
                </a>
              )}
              {candidato.linkedin && (
                <a href={candidato.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="processos">Processos ({candidato.processos.length})</TabsTrigger>
            <TabsTrigger value="entrevistas">Entrevistas ({candidato.entrevistas.length})</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Habilidades */}
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidato.habilidades && candidato.habilidades.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidato.habilidades.map((h, i) => (
                        <Badge key={i} variant="secondary">{h}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Experiência */}
              <Card>
                <CardHeader>
                  <CardTitle>Experiência Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidato.experiencias && candidato.experiencias.length > 0 ? (
                    <div className="space-y-4">
                      {(candidato.experiencias as any[]).slice(0, 3).map((exp, i) => (
                        <div key={i} className="border-l-2 border-primary/20 pl-4">
                          <p className="font-medium">{exp.cargo}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {exp.empresa}
                          </p>
                          <p className="text-xs text-muted-foreground">{exp.periodo}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma experiência cadastrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Formação */}
              <Card>
                <CardHeader>
                  <CardTitle>Formação Acadêmica</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidato.formacao && candidato.formacao.length > 0 ? (
                    <div className="space-y-4">
                      {(candidato.formacao as any[]).map((form, i) => (
                        <div key={i} className="border-l-2 border-primary/20 pl-4">
                          <p className="font-medium">{form.curso}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {form.instituicao}
                          </p>
                          <p className="text-xs text-muted-foreground">{form.periodo}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma formação cadastrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Match Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Match Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidato.match_scores.length > 0 ? (
                    <div className="space-y-3">
                      {candidato.match_scores.slice(0, 5).map((match: any) => (
                        <div key={match.id} className="flex items-center justify-between">
                          <span className="text-sm truncate max-w-[60%]">{match.vaga?.titulo}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={match.score_total} className="w-16 h-2" />
                            <span className={cn(
                              "text-sm font-medium",
                              match.score_total >= 80 ? "text-green-600" :
                              match.score_total >= 60 ? "text-amber-600" : "text-red-600"
                            )}>
                              {match.score_total}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum match calculado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="processos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Processos Seletivos</CardTitle>
              </CardHeader>
              <CardContent>
                {candidato.processos.length > 0 ? (
                  <div className="space-y-3">
                    {candidato.processos.map((processo: any) => (
                      <div
                        key={processo.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => navigate(`/pipeline?processo=${processo.id}`)}
                      >
                        <div>
                          <p className="font-medium">{processo.vaga?.titulo}</p>
                          <p className="text-sm text-muted-foreground">{processo.vaga?.departamento}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{processo.etapa_atual.replace(/_/g, ' ')}</Badge>
                          <Badge className={cn(
                            processo.status === 'contratado' ? "bg-green-500" :
                            processo.status === 'reprovado' ? "bg-red-500" :
                            processo.status === 'em_andamento' ? "bg-blue-500" : "bg-gray-500"
                          )}>
                            {processo.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Nenhum processo seletivo</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entrevistas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Entrevistas</CardTitle>
              </CardHeader>
              <CardContent>
                {candidato.entrevistas.length > 0 ? (
                  <div className="space-y-3">
                    {candidato.entrevistas.map((entrevista: any) => (
                      <div
                        key={entrevista.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold">
                              {format(new Date(entrevista.data_hora), 'dd')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(entrevista.data_hora), 'MMM', { locale: ptBR })}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium capitalize">{entrevista.tipo}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(entrevista.data_hora), 'HH:mm')} - {entrevista.entrevistador?.full_name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn(
                          entrevista.status === 'realizada' ? "bg-green-100 text-green-700" :
                          entrevista.status === 'cancelada' ? "bg-red-100 text-red-700" :
                          entrevista.status === 'confirmada' ? "bg-blue-100 text-blue-700" : ""
                        )}>
                          {entrevista.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Nenhuma entrevista agendada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Comunicações</CardTitle>
              </CardHeader>
              <CardContent>
                {candidato.comunicacoes.length > 0 ? (
                  <div className="space-y-3">
                    {candidato.comunicacoes.map((com: any) => (
                      <div key={com.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium capitalize">{com.tipo}</p>
                          <p className="text-sm">{com.assunto}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(com.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Nenhuma comunicação registrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
