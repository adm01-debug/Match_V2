import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCandidatoPerfil } from "@/hooks/useCandidatoPerfil";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  AlertCircle,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CandidatoPerfilPage() {
  usePageTitle('Perfil do Candidato');

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");

  const { data: candidato, isLoading: loading } = useCandidatoPerfil(id ?? '');

  if (loading) {
    return (
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
              <AvatarFallback className="text-2xl">{candidato.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{candidato.nome}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {candidato.email}
                </span>
                {candidato.telefone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {candidato.telefone}
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{candidato.candidaturas.length}</p>
                  <p className="text-xs text-muted-foreground">Candidaturas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{candidato.entrevistas.length}</p>
                  <p className="text-xs text-muted-foreground">Entrevistas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="candidaturas">Candidaturas ({candidato.candidaturas.length})</TabsTrigger>
            <TabsTrigger value="entrevistas">Entrevistas ({candidato.entrevistas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
                <CardContent>
                  {candidato.habilidades.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidato.habilidades.map((h: string, i: number) => (
                        <Badge key={i} variant="secondary">{h}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma habilidade</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Experiência</CardTitle></CardHeader>
                <CardContent>
                  {candidato.experiencias.length > 0 ? (
                    <div className="space-y-3">
                      {(candidato.experiencias as { cargo?: string; empresa?: string; periodo?: string }[]).slice(0, 3).map((exp, i) => (
                        <div key={i} className="border-l-2 border-primary/20 pl-4">
                          <p className="font-medium">{exp.cargo || 'Cargo'}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {exp.empresa || 'Empresa'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma experiência</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Formação</CardTitle></CardHeader>
                <CardContent>
                  {candidato.formacoes.length > 0 ? (
                    <div className="space-y-3">
                      {(candidato.formacoes as { curso?: string; instituicao?: string }[]).map((f, i) => (
                        <div key={i} className="border-l-2 border-primary/20 pl-4">
                          <p className="font-medium">{f.curso || 'Curso'}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {f.instituicao || 'Instituição'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma formação</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidaturas" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Candidaturas</CardTitle></CardHeader>
              <CardContent>
                {candidato.candidaturas.length > 0 ? (
                  <div className="space-y-3">
                    {candidato.candidaturas.map((c: { id: string; vaga_titulo: string; status: string }) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{c.vaga_titulo}</p>
                        <Badge variant="outline">{c.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Nenhuma candidatura</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entrevistas" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Entrevistas</CardTitle></CardHeader>
              <CardContent>
                {candidato.entrevistas.length > 0 ? (
                  <div className="space-y-3">
                    {candidato.entrevistas.map((e: { id: string; data: string; tipo: string; status: string }) => (
                      <div key={e.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{format(new Date(e.data), 'dd/MM/yyyy', { locale: ptBR })}</p>
                          <p className="text-sm text-muted-foreground">{e.tipo}</p>
                        </div>
                        <Badge variant="outline">{e.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Nenhuma entrevista</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
