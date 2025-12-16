import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PerfilHeader } from "@/components/candidato/PerfilHeader";
import { CurriculoTab } from "@/components/candidato/CurriculoTab";
import { ExperienciaTab } from "@/components/candidato/ExperienciaTab";
import { FormacaoTab } from "@/components/candidato/FormacaoTab";
import { AvaliacoesTab } from "@/components/candidato/AvaliacoesTab";
import { HistoricoTab } from "@/components/candidato/HistoricoTab";
import { candidatoPerfilMock } from "@/data/candidatoPerfilData";
import { 
  ArrowLeft, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  ClipboardCheck, 
  History,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

export default function CandidatoPerfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("curriculo");

  // Por enquanto usando dados mockados
  const candidato = candidatoPerfilMock;

  const handleEmail = () => {
    toast.info("Abrindo composição de e-mail...");
  };

  const handleLigar = () => {
    toast.info(`Ligar para ${candidato.telefone}`);
  };

  const handleFavoritar = () => {
    toast.success("Candidato adicionado aos favoritos!");
  };

  const handleAgendar = () => {
    toast.info("Abrindo modal de agendamento...");
  };

  const handleAprovar = () => {
    toast.success("Candidato movido para próxima etapa!");
  };

  const handleReprovar = () => {
    toast.error("Candidato movido para reprovados");
  };

  return (
    <Layout title={candidato.nome}>
      <div className="space-y-6">
        {/* Navegação */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleAgendar}>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Entrevista
            </Button>
            <Button variant="outline" className="text-success hover:text-success" onClick={handleAprovar}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleReprovar}>
              <XCircle className="h-4 w-4 mr-2" />
              Reprovar
            </Button>
          </div>
        </div>

        {/* Header do Perfil */}
        <PerfilHeader 
          candidato={candidato}
          onEmail={handleEmail}
          onLigar={handleLigar}
          onFavoritar={handleFavoritar}
        />

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-card border rounded-lg p-1 h-auto flex-wrap">
            <TabsTrigger value="curriculo" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              Currículo
            </TabsTrigger>
            <TabsTrigger value="experiencia" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="h-4 w-4" />
              Experiência
            </TabsTrigger>
            <TabsTrigger value="formacao" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardCheck className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="curriculo" className="m-0">
              <CurriculoTab candidato={candidato} />
            </TabsContent>
            <TabsContent value="experiencia" className="m-0">
              <ExperienciaTab candidato={candidato} />
            </TabsContent>
            <TabsContent value="formacao" className="m-0">
              <FormacaoTab candidato={candidato} />
            </TabsContent>
            <TabsContent value="avaliacoes" className="m-0">
              <AvaliacoesTab candidato={candidato} />
            </TabsContent>
            <TabsContent value="historico" className="m-0">
              <HistoricoTab candidato={candidato} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
