import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { VagaCard } from "@/components/vagas/VagaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useVagas } from "@/hooks/useVagas";
import { StatusVaga, Prioridade } from "@/types/recruitment";
import { Plus, Search, Filter, LayoutGrid, List, X , AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function VagasList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("todas");
  const [departamentoFilter, setDepartamentoFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: vagas = [], isLoading } = useVagas();

  // Get unique departments
  const departamentos = [...new Set(vagas.map((v) => v.departamento))];

  // Filter vagas
  const filteredVagas = vagas.filter((vaga) => {
    const matchesSearch = vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todas" || vaga.status === statusFilter;
    const matchesPrioridade = prioridadeFilter === "todas" || vaga.prioridade === prioridadeFilter;
    const matchesDepartamento = departamentoFilter === "todos" || vaga.departamento === departamentoFilter;
    
    return matchesSearch && matchesStatus && matchesPrioridade && matchesDepartamento;
  });

  // Count by status
  const statusCounts = {
    todas: vagas.length,
    publicada: vagas.filter((v) => v.status === "publicada").length,
    aguardando_aprovacao: vagas.filter((v) => v.status === "aguardando_aprovacao").length,
    encerrada: vagas.filter((v) => v.status === "encerrada").length,
  };

  const hasActiveFilters = statusFilter !== "todas" || prioridadeFilter !== "todas" || departamentoFilter !== "todos" || searchTerm !== "";

  const clearFilters = () => {
  usePageTitle('Vagas');

    setSearchTerm("");
    setStatusFilter("todas");
    setPrioridadeFilter("todas");
    setDepartamentoFilter("todos");
  };

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout title="Vagas">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestão de Vagas</h2>
            <p className="text-muted-foreground">
              Gerencie todas as vagas da empresa
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/vagas/nova">
              <Plus className="h-4 w-4" />
              Nova Vaga
            </Link>
          </Button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "todas", label: "Todas" },
            { value: "publicada", label: "Abertas" },
            { value: "aguardando_aprovacao", label: "Em Aprovação" },
            { value: "encerrada", label: "Encerradas" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className="gap-2"
            >
              {tab.label}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 h-5 px-1.5",
                  statusFilter === tab.value 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {statusCounts[tab.value as keyof typeof statusCounts] || 0}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar vaga por título ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="todos">Todos os departamentos</SelectItem>
                {departamentos.map((dep) => (
                  <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredVagas.length} vaga{filteredVagas.length !== 1 ? "s" : ""} encontrada{filteredVagas.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Vagas Grid/List */}
        {isLoading ? (
          <div className={cn(
            "gap-4",
            viewMode === "grid" 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
              : "flex flex-col"
          )}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredVagas.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou criar uma nova vaga
            </p>
            <Button asChild>
              <Link to="/vagas/nova">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Vaga
              </Link>
            </Button>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === "grid" 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
              : "flex flex-col"
          )}>
            {filteredVagas.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

