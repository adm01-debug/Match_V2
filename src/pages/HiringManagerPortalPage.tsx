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
import { mockVagas, mockCandidatos, mockEntrevistas } from '@/components/hiring-manager/hiringManagerMockData';

export default function HiringManagerPortalPage() {
  usePageTitle('Portal do Gestor');
  const { user } = useAuth();
  const [selectedVaga, setSelectedVaga] = useState<string>('all');

  const gestorNome = (user?.user_metadata?.['nome'] as string) || 'Gestor';

  const stats = useMemo(() => ({
    totalVagas: mockVagas.length,
    vagasUrgentes: mockVagas.filter(v => v.urgente).length,
    totalCandidatos: mockCandidatos.length,
    pendentesAvaliacao: mockCandidatos.filter(c => c.avaliacao === 'pendente').length,
    entrevistasHoje: mockEntrevistas.filter(e =>
      format(e.data, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    ).length,
    tempoMedioContratacao: 25,
  }), []);

  const filteredCandidatos = selectedVaga === 'all'
    ? mockCandidatos
    : mockCandidatos.filter(c => c.vaga === selectedVaga);

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
                {mockVagas.map(v => (
                  <SelectItem key={v.id} value={v.titulo}>{v.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <HiringManagerStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HiringManagerVagas vagas={mockVagas} />
            <HiringManagerCandidates candidatos={filteredCandidatos} />
          </div>
          <HiringManagerSidebar entrevistas={mockEntrevistas} />
        </div>
      </div>
    </Layout>
  );
}
