import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Plus } from 'lucide-react';
import { IndicacoesEmptyState } from '@/components/empty-states';
import { IndicacoesStats } from '@/components/indicacoes/IndicacoesStats';
import { IndicacoesShareCard } from '@/components/indicacoes/IndicacoesShareCard';
import { IndicacoesRulesCard } from '@/components/indicacoes/IndicacoesRulesCard';
import { IndicacaoCard } from '@/components/indicacoes/IndicacaoCard';
import { NovaIndicacaoDialog } from '@/components/indicacoes/NovaIndicacaoDialog';
import { useIndicacoes } from '@/hooks/useIndicacoes';
import type { IndicacaoStatus } from '@/components/indicacoes/types';

const TABS: { key: string; status?: IndicacaoStatus; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendentes', status: 'pendente', label: 'Pendentes' },
  { key: 'em_analise', status: 'em_analise', label: 'Em Análise' },
  { key: 'contratados', status: 'contratado', label: 'Contratados' },
];

export default function IndicacoesPage() {
  usePageTitle('Indicações');
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    indicacoes, isLoading, vagasPublicadas,
    createIndicacao, isCreating, updateStatus,
  } = useIndicacoes();

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

  const total = indicacoes.length;
  const contratados = indicacoes.filter(i => i.status === 'contratado').length;
  const emAnalise = indicacoes.filter(i => i.status === 'em_analise' || i.status === 'pendente').length;
  const bonusTotal = indicacoes.reduce((acc, i) => acc + (i.bonus || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
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
          <NovaIndicacaoDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            vagas={vagasPublicadas}
            isSubmitting={isCreating}
            onSubmit={(input) => {
              createIndicacao(input, { onSuccess: () => setDialogOpen(false) });
            }}
            trigger={
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Nova Indicação
              </Button>
            }
          />
        </div>

        <IndicacoesStats
          total={total}
          emAnalise={emAnalise}
          contratados={contratados}
          bonusTotal={bonusTotal}
        />

        <IndicacoesShareCard />

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList>
            {TABS.map(t => {
              const count = t.status
                ? indicacoes.filter(i => i.status === t.status).length
                : indicacoes.length;
              return (
                <TabsTrigger key={t.key} value={t.key}>
                  {t.label} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {TABS.map(t => {
            const filtered = t.status
              ? indicacoes.filter(i => i.status === t.status)
              : indicacoes;
            return (
              <TabsContent key={t.key} value={t.key} className="space-y-4">
                {filtered.length === 0 ? (
                  <IndicacoesEmptyState onOpenDialog={() => setDialogOpen(true)} />
                ) : (
                  <div className="space-y-3">
                    {filtered.map(i => (
                      <IndicacaoCard
                        key={i.id}
                        indicacao={i}
                        onStatusChange={updateStatus}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <IndicacoesRulesCard />
      </div>
    </Layout>
  );
}
