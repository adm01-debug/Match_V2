import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { vagas, processos } from "@/data/mockData";
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  Kanban,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  Building2,
  User,
  FileText,
  Flame,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  aguardando_aprovacao: { label: "Em Aprovação", className: "bg-warning/10 text-warning border-warning/20" },
  aprovada: { label: "Aprovada", className: "bg-info/10 text-info border-info/20" },
  publicada: { label: "Aberta", className: "bg-success/10 text-success border-success/20" },
  em_selecao: { label: "Em Seleção", className: "bg-primary/10 text-primary border-primary/20" },
  pausada: { label: "Pausada", className: "bg-muted text-muted-foreground" },
  encerrada: { label: "Encerrada", className: "bg-muted text-muted-foreground" },
  cancelada: { label: "Cancelada", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const prioridadeConfig = {
  urgente: { label: "Urgente", icon: Flame, className: "bg-destructive/10 text-destructive" },
  alta: { label: "Alta", icon: AlertTriangle, className: "bg-warning/10 text-warning" },
  media: { label: "Média", icon: null, className: "bg-info/10 text-info" },
  baixa: { label: "Baixa", icon: null, className: "bg-muted text-muted-foreground" },
};

export default function VagaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const vaga = vagas.find((v) => v.id === id);
  const candidatosVaga = processos.filter((p) => p.vagaId === id);

  if (!vaga) {
    return (
      <Layout title="Vaga não encontrada">
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Vaga não encontrada</h2>
          <Button onClick={() => navigate("/vagas")}>Voltar para Vagas</Button>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[vaga.status];
  const prioridade = prioridadeConfig[vaga.prioridade];
  const PrioridadeIcon = prioridade.icon;
  
  const diasAberta = vaga.dataPublicacao 
    ? Math.floor((new Date().getTime() - new Date(vaga.dataPublicacao).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatSalario = (min?: number, max?: number, aCombinar?: boolean) => {
    if (aCombinar) return "A combinar";
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    return "Não informado";
  };

  return (
    <Layout title="Detalhes da Vaga">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vagas")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn(status.className)}>
                  {status.label}
                </Badge>
                {vaga.prioridade !== "baixa" && (
                  <Badge variant="outline" className={cn(prioridade.className)}>
                    {PrioridadeIcon && <PrioridadeIcon className="h-3 w-3 mr-1" />}
                    {prioridade.label}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{vaga.titulo}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {vaga.departamento}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {vaga.cidade}/{vaga.estado}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {vaga.tipoContrato.toUpperCase()} • {vaga.modalidade}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-12 lg:ml-0">
            <Button variant="outline" asChild>
              <Link to={`/vagas/${vaga.id}/editar`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/pipeline?vaga=${vaga.id}`}>
                <Kanban className="h-4 w-4 mr-2" />
                Pipeline
              </Link>
            </Button>
            {vaga.status === "publicada" && (
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Divulgar
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{vaga.totalCandidatos}</p>
              <p className="text-xs text-muted-foreground">Candidatos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-5 w-5 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{vaga.emProcesso}</p>
              <p className="text-xs text-muted-foreground">Em Processo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{vaga.contratados}</p>
              <p className="text-xs text-muted-foreground">Contratados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="h-5 w-5 mx-auto mb-2 text-info" />
              <p className="text-2xl font-bold">{vaga.quantidade}</p>
              <p className="text-xs text-muted-foreground">Vagas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className={cn("text-2xl font-bold", diasAberta > 30 && "text-warning")}>
                {diasAberta}
              </p>
              <p className="text-xs text-muted-foreground">Dias Aberta</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Descrição da Vaga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Sobre a Empresa</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {vaga.descricaoEmpresa}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Responsabilidades</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {vaga.responsabilidades}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Requisitos Obrigatórios</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {vaga.requisitosObrigatorios}
                  </p>
                </div>

                {vaga.requisitosDesejaveis && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Requisitos Desejáveis</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {vaga.requisitosDesejaveis}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Candidatos Recentes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Candidatos em Processo
                  </CardTitle>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link to={`/pipeline?vaga=${vaga.id}`}>
                      Ver todos
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {candidatosVaga.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum candidato em processo ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {candidatosVaga.slice(0, 5).map((processo) => (
                      <div
                        key={processo.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{processo.candidatoNome}</p>
                            <p className="text-xs text-muted-foreground">
                              {processo.etapaAtual.replace(/_/g, " ")} • Há {processo.diasNaEtapa} dias
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            processo.matchScore >= 80
                              ? "bg-success/10 text-success"
                              : processo.matchScore >= 60
                              ? "bg-warning/10 text-warning"
                              : "bg-muted"
                          )}
                        >
                          ⭐ {processo.matchScore}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Salário</span>
                  <span className="text-sm font-medium">
                    {formatSalario(vaga.salarioMin, vaga.salarioMax, vaga.salarioACombinar)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gestor</span>
                  <span className="text-sm font-medium">{vaga.gestorNome}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recrutador</span>
                  <span className="text-sm font-medium">{vaga.recrutadorNome}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Criada em</span>
                  <span className="text-sm font-medium">
                    {new Date(vaga.dataCriacao).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {vaga.dataPublicacao && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Publicada em</span>
                      <span className="text-sm font-medium">
                        {new Date(vaga.dataPublicacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Benefícios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Benefícios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vaga.beneficios.map((beneficio) => (
                    <Badge key={beneficio} variant="secondary">
                      {beneficio}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills para Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vaga.skillsAvaliacao.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
