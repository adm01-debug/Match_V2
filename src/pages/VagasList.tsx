import { useState, useMemo } from "react";
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { FuzzySearchProvider } from '@/contexts/FuzzySearchContext';
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { VagaCard } from "@/components/vagas/VagaCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard, SkeletonList } from "@/components/ui/premium-skeleton";
import { useVagas } from "@/hooks/useVagas";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VagasEmptyState } from "@/components/empty-states";
import { VagasListStats } from '@/components/vagas-list/VagasListStats';
import { VagasListFilters } from '@/components/vagas-list/VagasListFilters';

export default function VagasList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [prioridadeFilter, setPrioridadeFilter] = useState("todas");
  const [departamentoFilter, setDepartamentoFilter] = useState("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: vagas = [], isLoading } = useVagas();
  const { playClick, playSwoosh } = useSoundEffects();

  const departamentos = useMemo(() => [...new Set(vagas.map(v => v.departamento))], [vagas]);

  const { results: fuzzyResults, matchesMap, searchTerm: activeSearchTerm } = useFuzzySearch(
    vagas, [{ name: 'titulo', weight: 2 }, { name: 'departamento', weight: 1.5 }], searchTerm, { ...FUZZY_PRESETS.default, includeMatches: true }
  );

  const filteredVagas = useMemo(() => {
    const base = searchTerm ? fuzzyResults : vagas;
    return base.filter(v => (statusFilter === "todas" || v.status === statusFilter) && (prioridadeFilter === "todas" || v.prioridade === prioridadeFilter) && (departamentoFilter === "todos" || v.departamento === departamentoFilter));
  }, [vagas, fuzzyResults, searchTerm, statusFilter, prioridadeFilter, departamentoFilter]);

  const stats = useMemo(() => ({
    publicada: vagas.filter(v => v.status === "publicada").length,
    totalCandidatos: vagas.reduce((acc, v) => acc + (v.totalCandidatos || 0), 0),
    emProcesso: vagas.reduce((acc, v) => acc + (v.emProcesso || 0), 0),
    urgentes: vagas.filter(v => v.prioridade === "urgente" && v.status === "publicada").length,
    todas: vagas.length, aguardando_aprovacao: vagas.filter(v => v.status === "aguardando_aprovacao").length, encerrada: vagas.filter(v => v.status === "encerrada").length
  }), [vagas]);

  return (
    <Layout title="Vagas">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div><h2 className="text-3xl font-bold">Gestão de Vagas</h2><p className="text-muted-foreground">Oportunidades da empresa</p></div>
          <Button asChild><Link to="/vagas/nova"><Plus className="h-4 w-4 mr-2" />Nova Vaga</Link></Button>
        </div>

        {!isLoading && <VagasListStats counts={stats} />}

        <div className="flex gap-2">
          {["todas", "publicada", "aguardando_aprovacao", "encerrada"].map(t => (
            <Button key={t} variant={statusFilter === t ? "default" : "outline"} size="sm" onClick={() => { setStatusFilter(t); playClick(); }}>
              {t} <Badge variant="secondary" className="ml-1">{(stats as any)[t] || 0}</Badge>
            </Button>
          ))}
        </div>

        <VagasListFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          departamentoFilter={departamentoFilter} setDepartamentoFilter={setDepartamentoFilter}
          prioridadeFilter={prioridadeFilter} setPrioridadeFilter={setPrioridadeFilter}
          departamentos={departamentos} clearFilters={() => { setSearchTerm(""); setStatusFilter("todas"); setPrioridadeFilter("todas"); setDepartamentoFilter("todos"); playSwoosh(); }}
          hasActiveFilters={statusFilter !== "todas" || prioridadeFilter !== "todas" || departamentoFilter !== "todos" || searchTerm !== ""}
        />

        <div className="flex justify-end gap-2">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
        </div>

        {isLoading ? (viewMode === "grid" ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div> : <SkeletonList />) :
          filteredVagas.length === 0 ? <VagasEmptyState /> :
          <FuzzySearchProvider matchesMap={matchesMap} searchTerm={activeSearchTerm}>
            <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3" : "flex flex-col")}>
              {filteredVagas.map((v, i) => <VagaCard key={v.id} vaga={v} index={i} />)}
            </div>
          </FuzzySearchProvider>
        }
      </div>
    </Layout>
  );
}
