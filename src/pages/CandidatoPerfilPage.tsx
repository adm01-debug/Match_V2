import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCandidatoPerfil } from "@/hooks/useCandidatoPerfil";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Briefcase, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CandidateProfileHeader } from '@/components/candidate-profile/CandidateProfileHeader';
import { CandidateResumoTab } from '@/components/candidate-profile/CandidateResumoTab';

export default function CandidatoPerfilPage() {
  usePageTitle('Perfil do Candidato');
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");
  const { data: candidato, isLoading: loading } = useCandidatoPerfil(id ?? '');

  if (loading) return (
    <Layout title="Perfil">
      <div className="p-6 space-y-6">
        <div className="flex gap-4"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-32" /></div></div>
        <Skeleton className="h-64" />
      </div>
    </Layout>
  );

  if (!candidato) return (
    <Layout title="Erro">
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Não encontrado</p>
        <Button onClick={() => navigate("/talentos")} className="mt-4">Voltar</Button>
      </div>
    </Layout>
  );

  return (
    <Layout title={candidato.nome}>
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/talentos")}><ArrowLeft className="h-5 w-5" /></Button>
          <CandidateProfileHeader candidato={candidato} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold">{candidato.candidaturas.length}</p><p className="text-xs text-muted-foreground">Candidaturas</p></div></CardContent></Card>
          <Card><CardContent className="pt-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-purple-500" /><div><p className="text-2xl font-bold">{candidato.entrevistas.length}</p><p className="text-xs text-muted-foreground">Entrevistas</p></div></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="candidaturas">Candidaturas ({candidato.candidaturas.length})</TabsTrigger>
            <TabsTrigger value="entrevistas">Entrevistas ({candidato.entrevistas.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo" className="mt-4"><CandidateResumoTab habilidades={candidato.habilidades} experiencias={candidato.experiencias as Array<{cargo?: string; empresa?: string}>} formacoes={candidato.formacoes as Array<{curso?: string; instituicao?: string}>} /></TabsContent>
          <TabsContent value="candidaturas" className="mt-4">
            <Card><CardHeader><CardTitle>Candidaturas</CardTitle></CardHeader>
            <CardContent>{candidato.candidaturas.length > 0 ? (
              <div className="space-y-3">{candidato.candidaturas.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><p className="font-medium">{c.vaga_titulo}</p><Badge variant="outline">{c.status}</Badge></div>
              ))}</div>
            ) : <p className="text-center py-8 text-muted-foreground">Nenhuma</p>}</CardContent></Card>
          </TabsContent>
          <TabsContent value="entrevistas" className="mt-4">
            <Card><CardHeader><CardTitle>Entrevistas</CardTitle></CardHeader>
            <CardContent>{candidato.entrevistas.length > 0 ? (
              <div className="space-y-3">{candidato.entrevistas.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div><p className="font-medium">{format(new Date(e.data), 'dd/MM/yyyy', { locale: ptBR })}</p><p className="text-sm text-muted-foreground">{e.tipo}</p></div><Badge variant="outline">{e.status}</Badge></div>
              ))}</div>
            ) : <p className="text-center py-8 text-muted-foreground">Nenhuma</p>}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
