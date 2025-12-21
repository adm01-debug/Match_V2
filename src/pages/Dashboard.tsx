import { usePageTitle } from '@/hooks/usePageTitle';
import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { FunilChart } from "@/components/dashboard/FunilChart";
import { VagasUrgentes } from "@/components/dashboard/VagasUrgentes";
import { AcoesPendentes } from "@/components/dashboard/AcoesPendentes";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AcoesRapidas } from "@/components/dashboard/AcoesRapidas";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { AlertasInteligentes } from "@/components/dashboard/AlertasInteligentes";
import { TopCandidatos } from "@/components/dashboard/TopCandidatos";
import { EntrevistasStats } from "@/components/dashboard/EntrevistasStats";
import { EntrevistasChart } from "@/components/dashboard/EntrevistasChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Briefcase, Users, Target, UserCheck, Clock, Loader2 , AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  usePageTitle('Dashboard');

  const { 
    kpiData, 
    funilData, 
    vagasUrgentes, 
    acoesPendentes, 
    agendaDia, 
    processos,
    isLoading 
  } = useDashboardData();

  // Valores default enquanto carrega
  const kpis = kpiData || {
    vagasAbertas: 0,
    vagasNovas: 0,
    candidatosTotal: 0,
    candidatosNovos: 0,
    emProcesso: 0,
    vagasEmProcesso: 0,
    contratadosMes: 0,
    metaContratacao: 5,
    tempoMedio: 0,
    metaTempo: 25,
  };

  return (
    <Layout title="Dashboard">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Visão Geral</h2>
            <p className="text-muted-foreground">
              Acompanhe o processo de recrutamento em tempo real
            </p>
          </div>
          <Select defaultValue="dez">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dez">Dezembro 2025</SelectItem>
              <SelectItem value="nov">Novembro 2025</SelectItem>
              <SelectItem value="out">Outubro 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))
          ) : (
            <>
              <KPICard
                title="Vagas Abertas"
                value={kpis.vagasAbertas}
                subtitle={`+${kpis.vagasNovas} novas`}
                icon={Briefcase}
                variant="primary"
              />
              <KPICard
                title="Candidatos Total"
                value={kpis.candidatosTotal}
                subtitle={`+${kpis.candidatosNovos} este mês`}
                icon={Users}
                trend={{ value: `+${kpis.candidatosNovos}`, positive: true }}
                variant="default"
              />
              <KPICard
                title="Em Processo"
                value={kpis.emProcesso}
                subtitle={`em ${kpis.vagasEmProcesso} vagas`}
                icon={Target}
                variant="warning"
              />
              <KPICard
                title="Contratados no Mês"
                value={kpis.contratadosMes}
                subtitle={`meta: ${kpis.metaContratacao}`}
                icon={UserCheck}
                variant="success"
              />
              <KPICard
                title="Tempo Médio"
                value={kpis.tempoMedio > 0 ? `${kpis.tempoMedio} dias` : '-'}
                subtitle={`meta: ${kpis.metaTempo}`}
                icon={Clock}
                variant={kpis.tempoMedio > kpis.metaTempo ? "danger" : "success"}
              />
            </>
          )}
        </div>

        {/* Insights e Alertas Inteligentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmartInsights kpiData={kpis} funilData={funilData} />
          <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funil - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FunilChart data={funilData} />
          </div>

          {/* Top Candidatos */}
          <div>
            <TopCandidatos processos={processos} />
          </div>
        </div>

        {/* Entrevistas Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Evolução */}
          <div className="lg:col-span-2">
            <EntrevistasChart />
          </div>

          {/* Estatísticas de Entrevistas */}
          <div>
            <EntrevistasStats />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vagas Urgentes */}
          <div className="lg:col-span-2">
            <VagasUrgentes vagas={vagasUrgentes} />
          </div>

          {/* Agenda do Dia */}
          <div>
            <AgendaHoje agenda={agendaDia} />
          </div>
        </div>

        {/* Ações Pendentes Row */}
        <div className="grid grid-cols-1 gap-6">
          <AcoesPendentes acoes={acoesPendentes} />
        </div>

        {/* Ações Rápidas */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Ações Rápidas</h3>
          <AcoesRapidas />
        </div>
      </div>
    </Layout>
  );
}

