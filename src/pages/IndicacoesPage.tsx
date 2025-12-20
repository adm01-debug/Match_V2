import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  Gift, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle,
  Share2,
  Copy,
  Mail,
  TrendingUp,
  User,
  Briefcase,
  DollarSign
} from "lucide-react";

interface Indicacao {
  id: string;
  indicador: string;
  indicadorEmail: string;
  candidatoNome: string;
  candidatoEmail: string;
  candidatoTelefone: string;
  vaga: string;
  status: "pendente" | "em_analise" | "aprovado" | "contratado" | "reprovado";
  dataCriacao: string;
  bonus?: number;
}

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-amber-500/20 text-amber-400", icon: Clock },
  em_analise: { label: "Em Análise", color: "bg-blue-500/20 text-blue-400", icon: User },
  aprovado: { label: "Aprovado", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
  contratado: { label: "Contratado", color: "bg-green-500/20 text-green-400", icon: Trophy },
  reprovado: { label: "Reprovado", color: "bg-red-500/20 text-red-400", icon: XCircle },
};

const mockIndicacoes: Indicacao[] = [
  {
    id: "1",
    indicador: "Maria Santos",
    indicadorEmail: "maria@empresa.com",
    candidatoNome: "João Silva",
    candidatoEmail: "joao@email.com",
    candidatoTelefone: "(11) 99999-1111",
    vaga: "Operador de Gravação",
    status: "contratado",
    dataCriacao: "15/11/2025",
    bonus: 500,
  },
  {
    id: "2",
    indicador: "Carlos Mendes",
    indicadorEmail: "carlos@empresa.com",
    candidatoNome: "Ana Paula Costa",
    candidatoEmail: "ana@email.com",
    candidatoTelefone: "(11) 99999-2222",
    vaga: "Auxiliar Administrativo",
    status: "em_analise",
    dataCriacao: "10/12/2025",
  },
  {
    id: "3",
    indicador: "Roberto Oliveira",
    indicadorEmail: "roberto@empresa.com",
    candidatoNome: "Lucas Ferreira",
    candidatoEmail: "lucas@email.com",
    candidatoTelefone: "(11) 99999-3333",
    vaga: "Operador de Tampografia",
    status: "pendente",
    dataCriacao: "18/12/2025",
  },
  {
    id: "4",
    indicador: "Maria Santos",
    indicadorEmail: "maria@empresa.com",
    candidatoNome: "Pedro Henrique",
    candidatoEmail: "pedro@email.com",
    candidatoTelefone: "(11) 99999-4444",
    vaga: "Operador de Gravação",
    status: "aprovado",
    dataCriacao: "05/12/2025",
  },
];

const vagasMock = [
  "Operador de Gravação",
  "Operador de Tampografia",
  "Auxiliar Administrativo",
  "Analista de RH",
  "Supervisor de Produção",
];

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>(mockIndicacoes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaIndicacao, setNovaIndicacao] = useState({
    candidatoNome: "",
    candidatoEmail: "",
    candidatoTelefone: "",
    vaga: "",
    observacao: "",
  });

  const linkIndicacao = `${window.location.origin}/indicar`;

  const totalIndicacoes = indicacoes.length;
  const contratados = indicacoes.filter(i => i.status === "contratado").length;
  const emAnalise = indicacoes.filter(i => i.status === "em_analise" || i.status === "pendente").length;
  const bonusTotal = indicacoes.reduce((acc, i) => acc + (i.bonus || 0), 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkIndicacao);
    toast.success("Link copiado!");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Indique um amigo para trabalhar conosco!");
    const body = encodeURIComponent(`Olá!\n\nVocê pode indicar pessoas para trabalhar na nossa empresa através deste link:\n\n${linkIndicacao}\n\nCada indicação contratada rende um bônus para você!\n\nAbraços,\nEquipe RH`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSubmit = () => {
    if (!novaIndicacao.candidatoNome || !novaIndicacao.candidatoEmail || !novaIndicacao.vaga) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const indicacao: Indicacao = {
      id: Date.now().toString(),
      indicador: "Usuário Atual",
      indicadorEmail: "usuario@empresa.com",
      candidatoNome: novaIndicacao.candidatoNome,
      candidatoEmail: novaIndicacao.candidatoEmail,
      candidatoTelefone: novaIndicacao.candidatoTelefone,
      vaga: novaIndicacao.vaga,
      status: "pendente",
      dataCriacao: new Date().toLocaleDateString("pt-BR"),
    };

    setIndicacoes([indicacao, ...indicacoes]);
    setDialogOpen(false);
    setNovaIndicacao({
      candidatoNome: "",
      candidatoEmail: "",
      candidatoTelefone: "",
      vaga: "",
      observacao: "",
    });
    toast.success("Indicação registrada com sucesso!");
  };

  const handleStatusChange = (id: string, newStatus: Indicacao["status"]) => {
    setIndicacoes(indicacoes.map(i => 
      i.id === id 
        ? { ...i, status: newStatus, bonus: newStatus === "contratado" ? 500 : i.bonus }
        : i
    ));
    toast.success("Status atualizado");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              Programa de Indicações
            </h1>
            <p className="text-muted-foreground">
              Indique talentos e ganhe bônus por cada contratação
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Nova Indicação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Indicar Candidato</DialogTitle>
                <DialogDescription>
                  Preencha os dados da pessoa que você deseja indicar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Candidato *</Label>
                  <Input 
                    value={novaIndicacao.candidatoNome}
                    onChange={(e) => setNovaIndicacao({...novaIndicacao, candidatoNome: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail *</Label>
                    <Input 
                      type="email"
                      value={novaIndicacao.candidatoEmail}
                      onChange={(e) => setNovaIndicacao({...novaIndicacao, candidatoEmail: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input 
                      value={novaIndicacao.candidatoTelefone}
                      onChange={(e) => setNovaIndicacao({...novaIndicacao, candidatoTelefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Vaga de Interesse *</Label>
                  <Select 
                    value={novaIndicacao.vaga}
                    onValueChange={(value) => setNovaIndicacao({...novaIndicacao, vaga: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma vaga..." />
                    </SelectTrigger>
                    <SelectContent>
                      {vagasMock.map(vaga => (
                        <SelectItem key={vaga} value={vaga}>{vaga}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea 
                    value={novaIndicacao.observacao}
                    onChange={(e) => setNovaIndicacao({...novaIndicacao, observacao: e.target.value})}
                    placeholder="Como você conhece esta pessoa? Por que está indicando?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit}>
                  <Users className="h-4 w-4 mr-2" />
                  Registrar Indicação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalIndicacoes}</p>
                <p className="text-sm text-muted-foreground">Total Indicações</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emAnalise}</p>
                <p className="text-sm text-muted-foreground">Em Análise</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <Trophy className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contratados}</p>
                <p className="text-sm text-muted-foreground">Contratados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {bonusTotal.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-muted-foreground">Bônus Pagos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-primary/20">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Compartilhe o Programa</h3>
                  <p className="text-sm text-muted-foreground">
                    Convide colegas para participar do programa de indicações
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
                <Button variant="outline" onClick={handleShareEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por E-mail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todas">Todas ({indicacoes.length})</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes ({indicacoes.filter(i => i.status === "pendente").length})</TabsTrigger>
            <TabsTrigger value="em_analise">Em Análise ({indicacoes.filter(i => i.status === "em_analise").length})</TabsTrigger>
            <TabsTrigger value="contratados">Contratados ({indicacoes.filter(i => i.status === "contratado").length})</TabsTrigger>
          </TabsList>

          {["todas", "pendentes", "em_analise", "contratados"].map(tab => {
            const filtered = tab === "todas" 
              ? indicacoes 
              : indicacoes.filter(i => i.status === (tab === "pendentes" ? "pendente" : tab));
            
            return (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filtered.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                      <p className="text-muted-foreground">Nenhuma indicação nesta categoria</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filtered.map(indicacao => {
                      const StatusIcon = statusConfig[indicacao.status].icon;
                      return (
                        <Card key={indicacao.id} className="hover:border-primary/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-semibold truncate">{indicacao.candidatoNome}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{indicacao.candidatoEmail}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Badge variant="outline" className="gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {indicacao.vaga}
                                  </Badge>
                                  <Badge className={statusConfig[indicacao.status].color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig[indicacao.status].label}
                                  </Badge>
                                  {indicacao.bonus && (
                                    <Badge className="bg-green-500/20 text-green-400">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      R$ {indicacao.bonus}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Indicado por <span className="font-medium">{indicacao.indicador}</span> em {indicacao.dataCriacao}
                                </p>
                              </div>
                              <div className="shrink-0">
                                <Select
                                  value={indicacao.status}
                                  onValueChange={(value) => handleStatusChange(indicacao.id, value as Indicacao["status"])}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="em_analise">Em Análise</SelectItem>
                                    <SelectItem value="aprovado">Aprovado</SelectItem>
                                    <SelectItem value="contratado">Contratado</SelectItem>
                                    <SelectItem value="reprovado">Reprovado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Regras do Programa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Regras do Programa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Como Funciona</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Indique pessoas que você conhece</li>
                  <li>• O RH analisa o perfil indicado</li>
                  <li>• Acompanhe o status da indicação</li>
                  <li>• Receba bônus após contratação</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Bônus</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• R$ 500 por indicação contratada</li>
                  <li>• Pagamento após período de experiência</li>
                  <li>• Sem limite de indicações</li>
                  <li>• Bônus extra para vagas críticas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Requisitos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Indicador deve ser funcionário ativo</li>
                  <li>• Indicado não pode ter participado antes</li>
                  <li>• Informações precisas do candidato</li>
                  <li>• Sem parentesco de 1º grau</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
