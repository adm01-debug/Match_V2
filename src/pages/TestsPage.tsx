import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo, useCallback } from 'react';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { getMatchIndices } from '@/components/ui/highlight-match';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProvas, useDeleteProva, useDuplicateProva } from '@/hooks/useProvas';
import { categoriasInfo } from '@/config/testsConfig';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BehavioralToolsCard } from '@/components/assessments';
import { Skeleton } from '@/components/ui/skeleton';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Plus, FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TestsEmptyState } from '@/components/empty-states';
import type { NivelCargo } from '@/types/tests';
import { iconeMap } from './tests/iconMap';
import { TestsStats } from './tests/TestsStats';
import { TestsFilters } from './tests/TestsFilters';
import { ProvaCard } from './tests/ProvaCard';

export default function TestsPage() {
  usePageTitle('Testes');
  const navigate = useNavigate();
  const { playSuccess, playError, playPop, playClick } = useSoundEffects();

  const { data: provas = [], isLoading, refetch } = useProvas();
  const deleteProvaMutation = useDeleteProva();
  const duplicarProvaMutation = useDuplicateProva();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState('provas');

  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    provas,
    [
      { name: 'titulo', weight: 2 },
      { name: 'descricao', weight: 1 },
      { name: 'categoria', weight: 1 },
      { name: 'tags', weight: 0.5 },
    ],
    searchQuery,
    { ...FUZZY_PRESETS.default },
  );

  const getProvaMatchIndices = useCallback((provaId: string, key: string) => {
    const matches = matchesMap.get(provaId);
    return getMatchIndices(matches, key);
  }, [matchesMap]);

  const provasFiltradas = useMemo(() => {
    const baseProvas = searchQuery ? fuzzyResults : provas;
    return baseProvas.filter((p) => {
      if (filtroCategoria !== 'todas' && p.categoria !== filtroCategoria) return false;
      if (filtroNivel !== 'todos' && !p.niveisAplicaveis?.includes(filtroNivel as NivelCargo)) return false;
      return true;
    });
  }, [provas, fuzzyResults, searchQuery, filtroCategoria, filtroNivel]);

  const stats = useMemo(() => ({
    totalProvas: provas.length,
    totalQuestoes: provas.reduce((acc, p) => acc + (p.totalQuestoes || 0), 0),
    totalAplicacoes: provas.reduce((acc, p) => acc + (p.aplicacoes || 0), 0),
    mediaAprovacao: provas.length > 0
      ? provas.reduce((acc, p) => acc + (p.mediaNotas || 0), 0) / provas.length
      : 0,
  }), [provas]);

  const handleDuplicar = async (id: string) => {
    try {
      await duplicarProvaMutation.mutateAsync(id);
      playPop();
      enhancedToast.success('Prova duplicada com sucesso!');
    } catch {
      playError();
      enhancedToast.error('Erro ao duplicar prova');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Deseja excluir esta prova?')) return;
    try {
      await deleteProvaMutation.mutateAsync(id);
      playSuccess();
      enhancedToast.info('Prova excluída');
    } catch {
      playError();
      enhancedToast.error('Erro ao excluir');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    playClick();
  };

  if (isLoading) {
    return (
      <Layout title="Provas">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Provas e Testes">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Provas e Testes</h1>
            <p className="text-muted-foreground">Gerencie avaliações técnicas e comportamentais</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('/testes/nova')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Prova
            </Button>
          </div>
        </div>

        <TestsStats {...stats} />

        <TestsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filtroCategoria={filtroCategoria}
          onCategoriaChange={setFiltroCategoria}
          filtroNivel={filtroNivel}
          onNivelChange={setFiltroNivel}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="provas">Provas ({provasFiltradas.length})</TabsTrigger>
            <TabsTrigger value="comportamentais">Comportamentais (10)</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          </TabsList>

          <TabsContent value="provas" className="mt-4">
            {provasFiltradas.length === 0 ? (
              <TestsEmptyState
                hasFilters={searchQuery !== '' || filtroCategoria !== 'todas' || filtroNivel !== 'todos'}
                onClearFilters={() => {
                  setSearchQuery('');
                  setFiltroCategoria('todas');
                  setFiltroNivel('todos');
                }}
                context="provas"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provasFiltradas.map((prova) => (
                  <ProvaCard
                    key={prova.id}
                    prova={prova}
                    getMatchIndices={getProvaMatchIndices}
                    onDuplicar={handleDuplicar}
                    onExcluir={handleExcluir}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comportamentais" className="mt-4">
            <BehavioralToolsCard
              onStartAssessment={(assessmentId) => navigate(`/avaliacoes-comportamentais?tool=${assessmentId}`)}
              className="max-w-4xl"
            />
          </TabsContent>

          <TabsContent value="categorias" className="mt-4 space-y-6">
            {categoriasInfo.map((categoria) => {
              const provasCategoria = provas.filter((p) => p.categoria === categoria.id);
              if (provasCategoria.length === 0) return null;
              const IconeCategoria = iconeMap[categoria.icone] || FileText;

              return (
                <div role="main" key={categoria.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('p-2 rounded-lg', categoria.cor)}>
                      <IconeCategoria className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold">{categoria.nome}</h2>
                    <Badge variant="secondary">{provasCategoria.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provasCategoria.map((prova) => (
                      <ProvaCard
                        key={prova.id}
                        prova={prova}
                        getMatchIndices={getProvaMatchIndices}
                        onDuplicar={handleDuplicar}
                        onExcluir={handleExcluir}
                      />
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
