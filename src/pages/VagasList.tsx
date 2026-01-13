import { useState, useMemo } from "react";
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { FuzzySearchProvider } from '@/contexts/FuzzySearchContext';
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { VagaCard } from "@/components/vagas/VagaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonCard, SkeletonList } from "@/components/ui/premium-skeleton";
import { useVagas } from "@/hooks/useVagas";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { enhancedToast } from "@/components/ui/enhanced-toast";
import { Plus, Search, LayoutGrid, List, X, Briefcase, Users, Target, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VagasEmptyState } from "@/components/empty-states";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function VagasList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("todas");
  const [departamentoFilter, setDepartamentoFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: vagas = [], isLoading } = useVagas();
  const { playClick, playToggle, playSwoosh } = useSoundEffects();

  // Get unique departments
  const departamentos = [...new Set(vagas.map((v) => v.departamento))];

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults, matchesMap, searchTerm: activeSearchTerm } = useFuzzySearch(
    vagas,
    [
      { name: 'titulo', weight: 2 },
      { name: 'departamento', weight: 1.5 },
      { name: 'descricaoEmpresa', weight: 0.5 },
    ],
    searchTerm,
    { ...FUZZY_PRESETS.default, includeMatches: true }
  );

  // Filter vagas
  const filteredVagas = useMemo(() => {
    const baseVagas = searchTerm ? fuzzyResults : vagas;
    return baseVagas.filter((vaga) => {
      const matchesStatus = statusFilter === "todas" || vaga.status === statusFilter;
      const matchesPrioridade = prioridadeFilter === "todas" || vaga.prioridade === prioridadeFilter;
      const matchesDepartamento = departamentoFilter === "todos" || vaga.departamento === departamentoFilter;
      
      return matchesStatus && matchesPrioridade && matchesDepartamento;
    });
  }, [vagas, fuzzyResults, searchTerm, statusFilter, prioridadeFilter, departamentoFilter]);

  // Count by status
  const statusCounts = {
    todas: vagas.length,
    publicada: vagas.filter((v) => v.status === "publicada").length,
    aguardando_aprovacao: vagas.filter((v) => v.status === "aguardando_aprovacao").length,
    encerrada: vagas.filter((v) => v.status === "encerrada").length,
  };

  // Calculate stats
  const totalCandidatos = vagas.reduce((acc, v) => acc + (v.totalCandidatos || 0), 0);
  const emProcesso = vagas.reduce((acc, v) => acc + (v.emProcesso || 0), 0);
  const urgentes = vagas.filter((v) => v.prioridade === "urgente" && v.status === "publicada").length;

  const hasActiveFilters = statusFilter !== "todas" || prioridadeFilter !== "todas" || departamentoFilter !== "todos" || searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todas");
    setPrioridadeFilter("todas");
    setDepartamentoFilter("todos");
    playSwoosh();
    enhancedToast.info("Filtros limpos");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    playClick();
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    playToggle();
  };

  return (
    <Layout title="Vagas">
      <div className="p-6 space-y-6">
        {/* Header with Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Gestão de Vagas
              </h2>
              <p className="text-muted-foreground mt-1">
                Gerencie todas as oportunidades da empresa
              </p>
            </div>
            <Button asChild className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
              <Link to="/vagas/nova">
                <Plus className="h-4 w-4" />
                Nova Vaga
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  icon: Briefcase, 
                  value: statusCounts.publicada, 
                  label: "Vagas Abertas", 
                  color: "from-primary/20 to-primary/5 text-primary",
                  iconBg: "bg-primary/10"
                },
                { 
                  icon: Users, 
                  value: totalCandidatos, 
                  label: "Total Candidatos", 
                  color: "from-accent/20 to-accent/5 text-accent",
                  iconBg: "bg-accent/10"
                },
                { 
                  icon: Target, 
                  value: emProcesso, 
                  label: "Em Processo", 
                  color: "from-success/20 to-success/5 text-success",
                  iconBg: "bg-success/10"
                },
                { 
                  icon: TrendingUp, 
                  value: urgentes, 
                  label: "Urgentes", 
                  color: "from-warning/20 to-warning/5 text-warning",
                  iconBg: "bg-warning/10"
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "border-0 bg-gradient-to-br shadow-sm hover:shadow-md transition-shadow",
                    stat.color
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Status Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {[
            { value: "todas", label: "Todas", icon: undefined },
            { value: "publicada", label: "Abertas", icon: Sparkles },
            { value: "aguardando_aprovacao", label: "Em Aprovação", icon: undefined },
            { value: "encerrada", label: "Encerradas", icon: undefined },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilterChange(tab.value)}
              className={cn(
                "gap-2 transition-all",
                statusFilter === tab.value 
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20" 
                  : "hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.label}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 h-5 px-1.5 text-xs",
                  statusFilter === tab.value 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {statusCounts[tab.value as keyof typeof statusCounts] || 0}
              </Badge>
            </Button>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar vaga por título ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
              <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm">
                <SelectItem value="todos">Todos os departamentos</SelectItem>
                {departamentos.map((dep) => (
                  <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-[150px] bg-card/50 border-border/50">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm">
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}

            <div className="flex border border-border/50 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none border-0"
                onClick={() => handleViewModeChange("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none border-0"
                onClick={() => handleViewModeChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredVagas.length}</span> vaga{filteredVagas.length !== 1 ? "s" : ""} encontrada{filteredVagas.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Vagas Grid/List */}
        {isLoading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} lines={3} showActions showBadge />
              ))}
            </div>
          ) : (
            <SkeletonList items={6} variant="detailed" />
          )
        ) : filteredVagas.length === 0 ? (
          <VagasEmptyState 
            hasFilters={hasActiveFilters} 
            onClearFilters={clearFilters} 
          />
        ) : (
          <FuzzySearchProvider matchesMap={matchesMap} searchTerm={activeSearchTerm}>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "gap-4",
                viewMode === "grid" 
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
                  : "flex flex-col"
              )}
            >
              {filteredVagas.map((vaga, index) => (
                <motion.div key={vaga.id} variants={itemVariants}>
                  <VagaCard vaga={vaga} index={index} />
                </motion.div>
              ))}
            </motion.div>
          </FuzzySearchProvider>
        )}
      </div>
    </Layout>
  );
}
