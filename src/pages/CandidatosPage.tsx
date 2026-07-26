import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useDebounce } from '@/hooks/useDebounce';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, Clock, UserCheck, UserX, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useCandidatosData } from '@/hooks/useCandidatosData';
import { useTalentSearch, TALENT_PAGE_SIZE } from '@/hooks/useTalentSearch';
import { useTalentExport } from '@/hooks/useTalentExport';
import { TalentAdvancedFilters } from '@/components/candidatos/TalentAdvancedFilters';
import { CandidatosList } from '@/components/candidatos/CandidatosList';
import { CandidatoDetailSheet } from '@/components/candidatos/CandidatoDetailSheet';
import { Candidato, MatchScore } from '@/types/candidate';


const CandidatosChartsSection = lazy(() =>
  import('@/components/candidatos/CandidatosChartsSection').then((m) => ({ default: m.CandidatosChartsSection }))
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CandidatosPage() {
  usePageTitle('Talentos');
  const navigate = useNavigate();

  /**
   * `useCandidatosData` continua sendo a fonte para estatísticas, gráficos
   * e mutações (status/exclusão). A LISTA, porém, passou a ser servida pela
   * RPC `search_candidatos`: filtrar em memória não escala e impedia
   * paginação real.
   */
  const { candidatos, matchScores, isLoading: isLoadingBase, deleteCandidato, updateCandidatoStatus, fetchCandidatos } =
    useCandidatosData();

  const {
    filters,
    patchFilters,
    resetFilters,
    activeFiltersCount,
    rows,
    total,
    page,
    pageCount,
    setPage,
    canPrev,
    canNext,
    isLoading,
    isFetching,
    refetch,
  } = useTalentSearch();

  const [termoLocal, setTermoLocal] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const { exportCsv, isExporting, progress } = useTalentExport();


  /** Debounce evita uma ida ao banco por tecla digitada. */
  const termoDebounced = useDebounce(termoLocal, 350);
  useEffect(() => {
    // Só emite patch quando o valor estabilizado difere do filtro vigente,
    // evitando reset de paginação em re-renders sem mudança real.
    if (termoDebounced !== filters.termo) patchFilters({ termo: termoDebounced });
  }, [termoDebounced, filters.termo, patchFilters]);

  const getBestMatchScore = useCallback(
    (candidatoId: string): MatchScore | null => {
      const scores = matchScores[candidatoId];
      if (!scores || scores.length === 0) return null;
      return scores.reduce((best, current) => (current.score_total > best.score_total ? current : best));
    },
    [matchScores]
  );

  /** A RPC já devolve resultados relevantes; o realce fuzzy não se aplica. */
  const noMatches = useCallback(() => undefined, []);

  const listaCandidatos = useMemo(() => rows as unknown as Candidato[], [rows]);

  const quickStats = useMemo(() => {
    const novos = candidatos.filter((c) => c.status === 'novo' || !c.status).length;
    const emProcesso = candidatos.filter((c) => ['em_triagem', 'entrevista'].includes(c.status || '')).length;
    const aprovados = candidatos.filter((c) => c.status === 'aprovado').length;
    const reprovados = candidatos.filter((c) => c.status === 'reprovado').length;
    return { novos, emProcesso, aprovados, reprovados };
  }, [candidatos]);

  const handleClear = () => {
    setTermoLocal('');
    resetFilters();
  };

  /** Mutações precisam invalidar as duas fontes (base e busca). */
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja realmente excluir este candidato?')) {
      const ok = await deleteCandidato(id);
      if (ok) await refetch();
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const ok = await updateCandidatoStatus(id, status);
    if (ok) await refetch();
    return ok;
  };

  return (
    <Layout>
      <div className="space-y-6 relative">
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8"
        >
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 shadow-glow-primary">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient">Banco de Talentos</h1>
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{candidatos.length}</span> candidatos cadastrados
              </p>
            </div>
            <Button onClick={() => navigate('/parser-curriculo')} className="btn-premium text-primary-foreground shadow-lg">
              <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" /> Novo Candidato
            </Button>
          </div>
        </motion.div>

        {!isLoadingBase && candidatos.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Users, label: 'Novos', value: quickStats.novos, color: 'info' },
              { icon: Clock, label: 'Em Processo', value: quickStats.emProcesso, color: 'warning' },
              { icon: UserCheck, label: 'Aprovados', value: quickStats.aprovados, color: 'success' },
              { icon: UserX, label: 'Reprovados', value: quickStats.reprovados, color: 'destructive' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card variant="glass" hover="lift" className="group overflow-hidden">
                  <CardContent className="p-4 md:p-5 relative">
                    <div
                      className={cn(
                        'absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2',
                        `bg-${stat.color}`
                      )}
                    />
                    <div className="flex items-center gap-3 relative">
                      <div
                        className={cn(
                          'p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110',
                          `bg-${stat.color}/10 text-${stat.color}`
                        )}
                      >
                        <stat.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Suspense fallback={<Skeleton className="h-[250px] w-full rounded-2xl" />}>
          <CandidatosChartsSection candidatos={candidatos} />
        </Suspense>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              aria-label="Buscar talentos por nome, e-mail, resumo ou habilidade"
              placeholder="Buscar por nome, e-mail, resumo ou habilidade…"
              className="pl-9"
              value={termoLocal}
              onChange={(e) => setTermoLocal(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="painel-filtros-talentos"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
            Filtros{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
          </Button>
        </div>

        {showFilters && (
          <div id="painel-filtros-talentos">
            <TalentAdvancedFilters
              filters={filters}
              onChange={patchFilters}
              onReset={handleClear}
              activeFiltersCount={activeFiltersCount}
              total={total}
              isFetching={isFetching}
            />
          </div>
        )}

        <CandidatosList
          candidatos={listaCandidatos}
          isLoading={isLoading}
          getBestMatchScore={getBestMatchScore}
          getMatchesForCandidate={noMatches}
          onSelect={setSelectedCandidato}
          onDelete={handleDelete}
        />

        {pageCount > 1 && (
          <nav className="flex items-center justify-center gap-4" aria-label="Paginação de talentos">
            <Button variant="outline" size="sm" disabled={!canPrev} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" /> Anterior
            </Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              Página {page + 1} de {pageCount} · {total} talentos
            </span>
            <Button variant="outline" size="sm" disabled={!canNext} onClick={() => setPage(page + 1)}>
              Próxima <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          </nav>
        )}

        <Sheet open={!!selectedCandidato} onOpenChange={() => setSelectedCandidato(null)}>
          {selectedCandidato && (
            <CandidatoDetailSheet
              candidato={selectedCandidato}
              matchScores={matchScores[selectedCandidato.id] || []}
              onUpdateStatus={handleUpdateStatus}
              onDelete={async (id) => {
                if (confirm('Excluir este candidato permanentemente?')) {
                  const ok = await deleteCandidato(id);
                  if (ok) {
                    setSelectedCandidato(null);
                    await Promise.all([refetch(), fetchCandidatos()]);
                  }
                }
              }}
            />
          )}
        </Sheet>
      </div>
    </Layout>
  );
}

export { TALENT_PAGE_SIZE };
