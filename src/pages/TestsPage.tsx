import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProvas } from "@/hooks/useProvas";
import { categoriasInfo, niveisInfo, departamentosInfo, getCategoriaById, getNivelById } from "@/config/testsConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  BarChart3,
  Filter,
  RefreshCw,
  Edit,
  Copy,
  Trash2,
  Play,
  Brain,
  Code,
  BookOpen,
  Globe,
  Table,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mapa de ícones
const iconeMap: Record<string, any> = {
  Brain,
  Code,
  BookOpen,
  Globe,
  Table,
  Users,
  Heart,
};

export default function TestsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: provas = [], isLoading, isError, deleteProva, duplicarProva, refetch } = useProvas();

  const [searchQuery, setSearchQuery] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroNivel, setFiltroNivel] = useState<string>("todos");
  const [activeTab, setActiveTab] = useState("provas");

  // Filtrar provas
  const provasFiltradas = useMemo(() => {
  usePageTitle('Testes');

    return provas.filter(p => {
      if (searchQuery && !p.titulo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filtroCategoria !== "todas" && p.categoria !== filtroCategoria) return false;
      if (filtroNivel !== "todos" && p.nivel !== filtroNivel) return false;
      return true;
    });
  }, [provas, searchQuery, filtroCategoria, filtroNivel]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      totalProvas: provas.length,
      totalQuestoes: provas.reduce((acc, p) => acc + (p.total_questoes || 0), 0),
      totalAplicacoes: provas.reduce((acc, p) => acc + (p.total_aplicacoes || 0), 0),
      mediaAprovacao: provas.length > 0
        ? provas.reduce((acc, p) => acc + (p.taxa_aprovacao || 0), 0) / provas.length
        : 0,
    };
  }, [provas]);

  // Handlers
  const handleDuplicar = async (id: string) => {
    try {
      await duplicarProva(id);
      toast({ title: "Prova duplicada com sucesso" });
    } catch {
      toast({ title: "Erro ao duplicar", variant: "destructive" });
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Deseja excluir esta prova?")) return;
    try {
      await deleteProva(id);
      toast({ title: "Prova excluída" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  // Render Card de Prova
  const ProvaCard = ({ prova }: { prova: any }) => {
  useDocumentTitle('Provas');

    const categoria = getCategoriaById(prova.categoria);
    const nivel = getNivelById(prova.nivel);
    const IconeCategoria = categoria ? iconeMap[categoria.icone] || FileText : FileText;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className={cn("p-2 rounded-lg", categoria?.cor || "bg-gray-500")}>
              <IconeCategoria className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline">{nivel?.nome || prova.nivel}</Badge>
          </div>
          <CardTitle className="text-lg mt-2">{prova.titulo}</CardTitle>
          <CardDescription className="line-clamp-2">{prova.descricao}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold">{prova.total_questoes}</p>
              <p className="text-xs text-muted-foreground">Questões</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{prova.duracao_minutos}</p>
              <p className="text-xs text-muted-foreground">Minutos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{prova.nota_minima}%</p>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
          </div>

          {prova.total_aplicacoes > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Aplicações</span>
                <span className="font-medium">{prova.total_aplicacoes}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Taxa de aprovação</span>
                <span className={cn(
                  "font-medium",
                  (prova.taxa_aprovacao || 0) >= 70 ? "text-green-600" : "text-amber-600"
                )}>
                  {prova.taxa_aprovacao?.toFixed(0) || 0}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/provas/${prova.id}/editar`)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDuplicar(prova.id)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleExcluir(prova.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" onClick={() => navigate(`/provas/${prova.id}/aplicar`)}>
            <Play className="h-4 w-4 mr-1" />
            Aplicar
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Layout title="Provas">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Provas e Testes">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Provas e Testes</h1>
            <p className="text-muted-foreground">Gerencie avaliações técnicas e comportamentais</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/provas/nova")}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Prova
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalProvas}</p>
                  <p className="text-xs text-muted-foreground">Provas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalQuestoes}</p>
                  <p className="text-xs text-muted-foreground">Questões</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalAplicacoes}</p>
                  <p className="text-xs text-muted-foreground">Aplicações</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.mediaAprovacao.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Aprovação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar prova..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas Categorias</SelectItem>
              {categoriasInfo.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroNivel} onValueChange={setFiltroNivel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Níveis</SelectItem>
              {niveisInfo.map(n => (
                <SelectItem key={n.id} value={n.id}>{n.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="provas">Provas ({provasFiltradas.length})</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          </TabsList>

          {/* Tab Provas */}
          <TabsContent value="provas" className="mt-4">
            {provasFiltradas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma prova encontrada</p>
                  <Button onClick={() => navigate("/provas/nova")} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Prova
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provasFiltradas.map(prova => (
                  <ProvaCard key={prova.id} prova={prova} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Por Categoria */}
          <TabsContent value="categorias" className="mt-4 space-y-6">
            {categoriasInfo.map(categoria => {
              const provasCategoria = provas.filter(p => p.categoria === categoria.id);
              if (provasCategoria.length === 0) return null;
              const IconeCategoria = iconeMap[categoria.icone] || FileText;

              return (
                <div role="main" key={categoria.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("p-2 rounded-lg", categoria.cor)}>
                      <IconeCategoria className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold">{categoria.nome}</h2>
                    <Badge variant="secondary">{provasCategoria.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provasCategoria.map(prova => (
                      <ProvaCard key={prova.id} prova={prova} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
