import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useVagas } from "@/hooks/useVagas";
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
  User,
  Briefcase,
  DollarSign,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Indicacao {
  id: string;
  indicador_user_id: string | null;
  indicador_nome: string;
  indicador_email: string;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone: string | null;
  vaga_id: string | null;
  vaga_titulo: string;
  observacao: string | null;
  status: "pendente" | "em_analise" | "aprovado" | "contratado" | "reprovado";
  bonus: number | null;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-amber-500/20 text-amber-400", icon: Clock },
  em_analise: { label: "Em Análise", color: "bg-blue-500/20 text-blue-400", icon: User },
  aprovado: { label: "Aprovado", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
  contratado: { label: "Contratado", color: "bg-green-500/20 text-green-400", icon: Trophy },
  reprovado: { label: "Reprovado", color: "bg-red-500/20 text-red-400", icon: XCircle },
};

export default function IndicacoesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: vagas = [] } = useVagas();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaIndicacao, setNovaIndicacao] = useState({
    candidatoNome: "",
    candidatoEmail: "",
    candidatoTelefone: "",
    vagaId: "",
    observacao: "",
  });

  const linkIndicacao = `${window.location.origin}/indicar`;

  // Fetch indicações
  const { data: indicacoes = [], isLoading } = useQuery({
    queryKey: ['indicacoes'],
    queryFn: async () => {
  usePageTitle('Indicações');

      const { data, error } = await supabase
        .from('indicacoes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Indicacao[];
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (indicacao: {
      candidatoNome: string;
      candidatoEmail: string;
      candidatoTelefone: string;
      vagaId: string;
      observacao: string;
    }) => {
      const vaga = vagas.find(v => v.id === indicacao.vagaId);
      
      const { error } = await supabase.from('indicacoes').insert({
        indicador_user_id: user?.id || null,
        indicador_nome: user?.user_metadata?.nome || user?.email || 'Usuário',
        indicador_email: user?.email || '',
        candidato_nome: indicacao.candidatoNome,
        candidato_email: indicacao.candidatoEmail,
        candidato_telefone: indicacao.candidatoTelefone || null,
        vaga_id: indicacao.vagaId || null,
        vaga_titulo: vaga?.titulo || 'Vaga não especificada',
        observacao: indicacao.observacao || null,
        status: 'pendente',
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      setDialogOpen(false);
      setNovaIndicacao({
        candidatoNome: "",
        candidatoEmail: "",
        candidatoTelefone: "",
        vagaId: "",
        observacao: "",
      });
      toast.success("Indicação registrada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao registrar indicação", { description: error.message });
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Indicacao['status'] }) => {
      const bonus = status === 'contratado' ? 500 : 0;
      
      const { error } = await supabase
        .from('indicacoes')
        .update({ status, bonus })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      toast.success("Status atualizado");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar status", { description: error.message });
    }
  });

  const totalIndicacoes = indicacoes.length;
  const contratados = indicacoes.filter(i => i.status === "contratado").length;
  const emAnalise = indicacoes.filter(i => i.status === "em_analise" || i.status === "pendente").length;
  const bonusTotal = indicacoes.reduce((acc, i) => acc + (i.bonus || 0), 0);

  const handleCopyLink = () => {
  useDocumentTitle('Indicações');

    navigator.clipboard.writeText(linkIndicacao);
    toast.success("Link copiado!");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Indique um amigo para trabalhar conosco!");
    const body = encodeURIComponent(`Olá!\n\nVocê pode indicar pessoas para trabalhar na nossa empresa através deste link:\n\n${linkIndicacao}\n\nCada indicação contratada rende um bônus para você!\n\nAbraços,\nEquipe RH`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSubmit = () => {
    if (!novaIndicacao.candidatoNome || !novaIndicacao.candidatoEmail || !novaIndicacao.vagaId) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    createMutation.mutate(novaIndicacao);
  };

  const vagasPublicadas = vagas.filter(v => v.status === 'publicada');

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </Layout>
    );
  }

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
                    value={novaIndicacao.vagaId}
                    onValueChange={(value) => setNovaIndicacao({...novaIndicacao, vagaId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma vaga..." />
                    </SelectTrigger>
                    <SelectContent>
                      {vagasPublicadas.map(vaga => (
                        <SelectItem key={vaga.id} value={vaga.id}>{vaga.titulo}</SelectItem>
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
                <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4 mr-2" />
                  )}
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
                                    <h3 className="font-semibold truncate">{indicacao.candidato_nome}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{indicacao.candidato_email}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Badge variant="outline" className="gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {indicacao.vaga_titulo}
                                  </Badge>
                                  <Badge className={statusConfig[indicacao.status].color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig[indicacao.status].label}
                                  </Badge>
                                  {indicacao.bonus && indicacao.bonus > 0 && (
                                    <Badge className="bg-green-500/20 text-green-400">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      R$ {indicacao.bonus}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Indicado por <span className="font-medium">{indicacao.indicador_nome}</span> em {format(new Date(indicacao.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                              <div className="shrink-0">
                                <Select
                                  value={indicacao.status}
                                  onValueChange={(value) => updateStatusMutation.mutate({ 
                                    id: indicacao.id, 
                                    status: value as Indicacao["status"] 
                                  })}
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
              <Gift className="h-5 w-5 text-primary" />
              Regras do Programa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">1</div>
                  Indique
                </div>
                <p className="text-sm text-muted-foreground">
                  Indique amigos, familiares ou conhecidos para as vagas disponíveis
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">2</div>
                  Acompanhe
                </div>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o status das suas indicações no sistema
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">3</div>
                  Receba
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba R$ 500,00 de bônus para cada indicação contratada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}