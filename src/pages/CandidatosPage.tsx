import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFuzzySearch, FUZZY_PRESETS, FuseMatch } from '@/hooks/useFuzzySearch';
import { startOfDay, endOfDay } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, UserPlus, Clock, UserCheck, UserX
} from 'lucide-react';
import { cn } from '@/lib/utils';

// New Components
import { useCandidatosData } from '@/hooks/useCandidatosData';
import { CandidatosFilters } from '@/components/candidatos/CandidatosFilters';
import { CandidatosList } from '@/components/candidatos/CandidatosList';
import { CandidatoDetailSheet } from '@/components/candidatos/CandidatoDetailSheet';
import { Candidato, MatchScore } from '@/types/candidate';

const CandidatosChartsSection = lazy(() => import('@/components/candidatos/CandidatosChartsSection').then(m => ({ default: m.CandidatosChartsSection })));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CandidatosPage() {
  usePageTitle('Talentos');
  const navigate = useNavigate();
  
  const { 
    candidatos, 
    matchScores, 
    isLoading, 
    deleteCandidato, 
    updateCandidatoStatus 
  } = useCandidatosData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [skillFilter, setSkillFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [minExperiences, setMinExperiences] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const allSkills = useMemo(() => 
    [...new Set(candidatos.flatMap(c => c.habilidades || []))].sort(),
    [candidatos]
  );

  const getBestMatchScore = useCallback((candidatoId: string): MatchScore | null => {
    const scores = matchScores[candidatoId];
    if (!scores || scores.length === 0) return null;
    return scores.reduce((best, current) => 
      current.score_total > best.score_total ? current : best
    );
  }, [matchScores]);

  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    candidatos,
    [
      { name: 'nome', weight: 2 },
      { name: 'email', weight: 1.5 },
      { name: 'resumo', weight: 1 },
      { name: 'habilidades', weight: 1.5 },
    ],
    searchTerm,
    { ...FUZZY_PRESETS.default, includeMatches: true }
  );

  const getMatchesForCandidate = useCallback((candidatoId: string): readonly FuseMatch[] | undefined => {
    return matchesMap.get(candidatoId);
  }, [matchesMap]);

  const filteredCandidatos = useMemo(() => {
    return (searchTerm ? fuzzyResults : candidatos)
      .filter(c => {
        const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
        const matchesSkill = skillFilter === 'todas' || 
          (c.habilidades && c.habilidades.some((h: string) => 
            h.toLowerCase().includes(skillFilter.toLowerCase())
          ));
        const candidatoDate = c.created_at ? new Date(c.created_at) : new Date(0);
        const matchesDateFrom = !dateFrom || candidatoDate >= startOfDay(dateFrom);
        const matchesDateTo = !dateTo || candidatoDate <= endOfDay(dateTo);
        const matchesExperience = (c.experiencias?.length || 0) >= minExperiences;

        return matchesStatus && matchesSkill && matchesDateFrom && matchesDateTo && matchesExperience;
      })
      .sort((a, b) => {
        if (searchTerm) return 0;
        if (sortBy === 'match_score') {
          return (getBestMatchScore(b.id)?.score_total || 0) - (getBestMatchScore(a.id)?.score_total || 0);
        }
        if (sortBy === 'nome') return a.nome.localeCompare(b.nome);
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [searchTerm, fuzzyResults, candidatos, statusFilter, skillFilter, dateFrom, dateTo, minExperiences, sortBy, getBestMatchScore]);

  const quickStats = useMemo(() => {
    const novos = candidatos.filter(c => c.status === 'novo' || !c.status).length;
    const emProcesso = candidatos.filter(c => ['em_triagem', 'entrevista'].includes(c.status || '')).length;
    const aprovados = candidatos.filter(c => c.status === 'aprovado').length;
    const reprovados = candidatos.filter(c => c.status === 'reprovado').length;
    return { novos, emProcesso, aprovados, reprovados };
  }, [candidatos]);

  const activeFiltersCount = [
    statusFilter !== 'todos',
    skillFilter !== 'todas',
    dateFrom !== undefined,
    dateTo !== undefined,
    minExperiences > 0
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter('todos');
    setSkillFilter('todas');
    setDateFrom(undefined);
    setDateTo(undefined);
    setMinExperiences(0);
    setSearchTerm('');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja realmente excluir este candidato?')) {
      await deleteCandidato(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 relative">
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-30" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 shadow-glow-primary"><Users className="h-6 w-6 text-primary" /></div>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient">Banco de Talentos</h1>
              </div>
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">{candidatos.length}</span> candidatos cadastrados</p>
            </div>
            <Button onClick={() => navigate('/parser-curriculo')} className="btn-premium text-primary-foreground shadow-lg">
              <UserPlus className="h-4 w-4 mr-2" /> Novo Candidato
            </Button>
          </div>
        </motion.div>

        {!isLoading && candidatos.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Novos', value: quickStats.novos, color: 'info' },
              { icon: Clock, label: 'Em Processo', value: quickStats.emProcesso, color: 'warning' },
              { icon: UserCheck, label: 'Aprovados', value: quickStats.aprovados, color: 'success' },
              { icon: UserX, label: 'Reprovados', value: quickStats.reprovados, color: 'destructive' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card variant="glass" hover="lift" className="group overflow-hidden">
                  <CardContent className="p-4 md:p-5 relative">
                    <div className={cn("absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2", `bg-${stat.color}`)} />
                    <div className="flex items-center gap-3 relative">
                      <div className={cn("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", `bg-${stat.color}/10 text-${stat.color}`)}>
                        <stat.icon className="h-5 w-5" />
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

        <CandidatosChartsSection candidatos={candidatos} />

        <CandidatosFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          skillFilter={skillFilter} setSkillFilter={setSkillFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          minExperiences={minExperiences} setMinExperiences={setMinExperiences}
          allSkills={allSkills}
          activeFiltersCount={activeFiltersCount}
          showFilters={showFilters} setShowFilters={setShowFilters}
          onClearFilters={clearFilters}
        />

        <CandidatosList
          candidatos={filteredCandidatos}
          isLoading={isLoading}
          getBestMatchScore={getBestMatchScore}
          getMatchesForCandidate={getMatchesForCandidate}
          onSelect={setSelectedCandidato}
          onDelete={handleDelete}
        />

        <Sheet open={!!selectedCandidato} onOpenChange={() => setSelectedCandidato(null)}>
          {selectedCandidato && (
            <CandidatoDetailSheet
              candidato={selectedCandidato}
              matchScores={matchScores[selectedCandidato.id] || []}
              onUpdateStatus={updateCandidatoStatus}
              onDelete={async (id) => {
                if (confirm('Excluir este candidato permanentemente?')) {
                  await deleteCandidato(id);
                  setSelectedCandidato(null);
                }
              }}
            />
          )}
        </Sheet>
      </div>
    </Layout>
  );
}