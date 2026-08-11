/**
 * @fileoverview Hiring Manager Portal - Dashboard para Gestores
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { HiringManagerStats } from '@/components/hiring-manager/HiringManagerStats';
import { HiringManagerVagas } from '@/components/hiring-manager/HiringManagerVagas';
import { HiringManagerCandidates } from '@/components/hiring-manager/HiringManagerCandidates';
import { HiringManagerSidebar } from '@/components/hiring-manager/HiringManagerSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { METAS_PADRAO } from '@/lib/constants';
import { useHiringManagerData } from '@/hooks/useHiringManagerData';

export default function HiringManagerPortalPage() {
  usePageTitle('Portal do Gestor');
  const { user } = useAuth();
  const [selectedVaga, setSelectedVaga] = useState<string>('all');

  const gestorNome = (user?.user_metadata?.['nome'] as string) || 'Gestor';

  const { data, isLoading } = useHiringManagerData();
  const vagas = data?.vagas ?? [];
  const candidatos = data?.candidatos ?? [];
  const entrevistas = data?.entrevistas ?? [];

  const stats = useMemo(() => ({
    totalVagas: vagas.length,
    vagasUrgentes: vagas.filter(v => v.urgente).length,
    totalCandidatos: candidatos.length,
    pendentesAvaliacao: candidatos.filter(c => c.avaliacao === 'pendente').length,
    entrevistasHoje: entrevistas.filter(e =>
      format(e.data, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    ).length,
    tempoMedioContratacao: METAS_PADRAO.tempoMedioContratacao,
  }), [vagas, candidatos, entrevistas]);

  const filteredCandidatos = selectedVaga === 'all'
    ? candidatos
    : candidatos.filter(c => c.vaga === selectedVaga);

  return (
    <Layout title="Portal do Gestor">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-primary" />
              Portal do Gestor
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, {gestorNome}! Acompanhe suas vagas e candidatos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedVaga} onValueChange={setSelectedVaga}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as vagas</SelectItem>
                {vagas.map(v => (
                  <SelectItem key={v.id} value={v.titulo}>{v.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <HiringManagerStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <HiringManagerVagas vagas={vagas} />
                <HiringManagerCandidates candidatos={filteredCandidatos} />
              </div>
              <HiringManagerSidebar entrevistas={entrevistas} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
